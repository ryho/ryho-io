// Distance-based playback compresses stops while retaining recorded dates and transport.
function buildPlaybackRoute(records,month){
 const ordered=records.filter(s=>s.points.length>1&&s.dates.length===s.points.length&&Number.isFinite(Date.parse(s.dates[0])))
  .slice().sort((a,b)=>Date.parse(a.dates[0])-Date.parse(b.dates[0]));
 const segments=[];let previousLongitude;
 for(const record of ordered){
  let pointsLongitude;
  const points=record.points.map(([lat,original],index)=>{
   let lon=original;const previous=index?pointsLongitude:previousLongitude;
   if(previous!==undefined){while(lon-previous>180)lon-=360;while(lon-previous< -180)lon+=360;}
   pointsLongitude=lon;return [lat,lon];
  });
  previousLongitude=points[points.length-1][1];
  const cumulative=[0];
  for(let i=1;i<points.length;i++){
   const [a,b]=[points[i-1],points[i]],rad=Math.PI/180;
   const h=Math.sin((b[0]-a[0])*rad/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin((b[1]-a[1])*rad/2)**2;
   cumulative.push(cumulative[i-1]+12742000*Math.asin(Math.min(1,Math.sqrt(h))));
  }
  const length=cumulative[cumulative.length-1];if(length<1)continue;
  segments.push({...record,points,cumulative,length,times:record.dates.map(Date.parse)});
 }
 const target=month==='all'?180000:60000;
 const weights=segments.map(s=>Math.max(100,s.length*(s.type==='flight'?.25:s.type==='gap'?.1:1)));
 const sum=weights.reduce((a,b)=>a+b,0);
 const durations=weights.map(w=>Math.min(7000,Math.max(100,w/sum*target)));
 const durationSum=durations.reduce((a,b)=>a+b,0);let totalDuration=0,totalDistance=0;
 segments.forEach((segment,index)=>{segment.start=totalDuration;totalDuration+=durations[index]/durationSum*target;segment.end=totalDuration;segment.distanceBefore=totalDistance;if(segment.type!=='gap')totalDistance+=segment.length;});
 return {segments,totalDuration,totalDistance};
}
// Kept outside the UI so route ordering, transport, and interpolation can be verified.
function playbackPosition(route,elapsed){
 if(!route.segments.length)return null;
 let lo=0,hi=route.segments.length-1;
 while(lo<hi){const mid=(lo+hi)>>1;if(route.segments[mid].end<=elapsed)lo=mid+1;else hi=mid;}
 const segment=route.segments[lo],fraction=Math.max(0,Math.min(1,(elapsed-segment.start)/(segment.end-segment.start))),distance=segment.length*fraction;
 let a=0,b=segment.cumulative.length-1;
 while(a<b){const mid=(a+b+1)>>1;if(segment.cumulative[mid]<=distance)a=mid;else b=mid-1;}
 const index=Math.min(a,segment.points.length-2),length=segment.cumulative[index+1]-segment.cumulative[index];
 const progress=length?Math.max(0,Math.min(1,(distance-segment.cumulative[index])/length)):1;
 const from=segment.points[index],to=segment.points[index+1];
 // Match Leaflet's straight segments in Web Mercator, including date-line crossings.
 const mercator=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
 const y=mercator(from[0])+(mercator(to[0])-mercator(from[0]))*progress;
 const point=[(2*Math.atan(Math.exp(y))-Math.PI/2)*180/Math.PI,from[1]+(to[1]-from[1])*progress];
 const time=segment.times[index]+(segment.times[index+1]-segment.times[index])*progress;
 const heading=Math.atan2((to[1]-from[1])*Math.PI/180,mercator(to[0])-mercator(from[0]))*180/Math.PI;
 const distanceTraveled=segment.distanceBefore+(segment.type==='gap'?0:distance);
 return {segment,segmentIndex:lo,index,point,time,heading,distanceTraveled,forward:to[1]>=from[1]};
}

// Keep ground vehicles facing steadily through city blocks and GPS wiggles.
function stableGroundFacing(state,previous){
 const longitude=state.point[1];
 if(!previous){
  const segment=state.segment,target=segment.cumulative[state.index]+1000;
  let index=state.index+1;while(index<segment.points.length-1&&segment.cumulative[index]<target)index++;
  const delta=segment.points[index][1]-longitude;
  return {forward:Math.abs(delta)>0.0005?delta>0:state.forward,anchor:longitude};
 }
 const metersPerDegree=111195*Math.cos(state.point[0]*Math.PI/180);
 let {forward,anchor}=previous;
 // Reverse only after travelling at least 600 m against the current facing.
 if(forward){anchor=Math.max(anchor,longitude);if((anchor-longitude)*metersPerDegree>600){forward=false;anchor=longitude;}}
 else{anchor=Math.min(anchor,longitude);if((longitude-anchor)*metersPerDegree>600){forward=true;anchor=longitude;}}
 return {forward,anchor};
}

// Use the rental car for ground travel in these three parts of the trip.
function groundPlaybackVehicle(point){
 const lat=point[0],lon=((point[1]+180)%360+360)%360-180;
 // Rental-car regions include nearby border/coastal points; time-zone polygons
 // alone can label part of the Nicaragua itinerary as Honduras.
 let car=(lat>=18&&lat<=23&&lon>=-161&&lon<=-154)||(lat>=24&&lat<=46&&lon>=122&&lon<=146)||(lat>=10.7&&lat<=15.2&&lon>=-87.8&&lon<=-82.5);
 try{car=car||['Pacific/Honolulu','Asia/Tokyo','America/Managua'].includes(tzlookup(lat,lon));}catch(error){}
 return car?{url:'assets/icons/silver-car.svg',size:[54,27]}:{url:'assets/icons/truck-camper.svg',size:[84,42]};
}

const playbackControls={play:document.getElementById('play-trip'),stop:document.getElementById('stop-trip'),options:document.getElementById('trip-playback-options'),progress:document.getElementById('trip-progress'),speed:document.getElementById('trip-speed'),follow:document.getElementById('trip-follow'),status:document.getElementById('trip-playback-status')};
const playbackTrail=L.layerGroup().addTo(map),playbackVehicle=L.layerGroup().addTo(map);
let tripRoute=null,tripActive=false,tripRunning=false,tripElapsed=0,tripFrame=null,tripLastFrame=0,tripPainted=-1,tripCurrentLine=null,tripMarker=null,tripVehicleKey='',tripLastMode='',tripLastStatus='';
let groundFacing=null;
function updateTripMileage(meters){
 const counter=document.getElementById('trip-miles');
 counter.textContent='≈ '+Math.round(meters/1609.344).toLocaleString(locale())+' mi';
 counter.title=t('Includes ground travel, flights and trains; excludes missing-data connections.');
}
function showFullTripMileage(){updateTripMileage(buildPlaybackRoute(playbackSegments,monthSel.value).totalDistance);}
function playbackLabels(){
 playbackControls.play.textContent=t(!tripActive?'▶ Play trip':tripRunning?'Ⅱ Pause trip':tripElapsed>=tripRoute.totalDuration?'↺ Replay trip':'▶ Resume trip');
 playbackControls.stop.textContent=t('■ Stop trip');
 playbackControls.progress.setAttribute('aria-label',t('Progress'));
}
function tripLine(segment,points){
 const style={color:transportColors[segment.type],weight:segment.type==='ground'||segment.type==='rail'?5:3,opacity:segment.type==='gap'?.65:.95,lineCap:segment.type==='flight'?'butt':'round'};
 if(segment.type==='flight')style.dashArray='16 16';if(segment.type==='gap')style.dashArray='7 10';
 return L.polyline(points,style).addTo(playbackTrail);
}
function paintTripPlayback(rebuild=false){
 const state=playbackPosition(tripRoute,tripElapsed);if(!state)return;
 updateTripMileage(state.distanceTraveled);
 if(rebuild||state.segmentIndex<tripPainted){groundFacing=null;playbackTrail.clearLayers();tripPainted=-1;tripCurrentLine=null;}
 if(state.segmentIndex!==tripPainted){
  if(tripCurrentLine)tripCurrentLine.setLatLngs(tripRoute.segments[tripPainted].points);
  for(let i=tripPainted+1;i<state.segmentIndex;i++)tripLine(tripRoute.segments[i],tripRoute.segments[i].points);
  tripCurrentLine=tripLine(state.segment,[]);tripPainted=state.segmentIndex;
 }
 tripCurrentLine.setLatLngs([...state.segment.points.slice(0,state.index+1),state.point]);
 // Visit dates are local calendar dates, just like the dates in the pin popups.
 let visitDate;
 try{
  const longitude=((state.point[1]+180)%360+360)%360-180;
  const zone=tzlookup(state.point[0],longitude);
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(state.time));
  visitDate=['year','month','day'].map(type=>parts.find(part=>part.type===type).value).join('-');
 }catch(error){visitDate=new Date(state.time).toISOString().slice(0,10);}
 if(playbackVisitDate!==visitDate){playbackVisitDate=visitDate;drawLocations(monthSel.value);}
 const type=state.segment.type;
 if(type==='ground')groundFacing=stableGroundFacing(state,groundFacing);else groundFacing=null;
 const facing=type==='ground'?groundFacing.forward:state.forward;
 if(type==='gap'){
  playbackVehicle.clearLayers();tripMarker=null;tripVehicleKey='';
 }else{
  const spec=type==='flight'?{url:'assets/icons/plane.svg',size:[34,34]}:type==='rail'?{url:'assets/icons/bullet-train.svg',size:[74,22]}:groundPlaybackVehicle(state.point);
  const key=spec.url+':'+facing;
  if(key!==tripVehicleKey){
   const flip=type==='ground'?facing:!facing;
   const icon=L.divIcon({className:'trip-vehicle',html:'<img alt="" src="'+spec.url+'" style="transform:scaleX('+(flip?-1:1)+')">',iconSize:spec.size,iconAnchor:spec.size.map(n=>n/2)});
   if(tripMarker)tripMarker.setIcon(icon);else tripMarker=L.marker(state.point,{icon,zIndexOffset:2000,interactive:false,keyboard:false}).addTo(playbackVehicle);
   tripVehicleKey=key;
  }
  tripMarker.setLatLng(state.point);
  if(type==='flight'){const image=tripMarker.getElement()?.querySelector('img');if(image)image.style.transform='rotate('+state.heading+'deg)';}
 }
 const mode=t(type==='ground'?'Ground travel':type==='flight'?'Flights':type==='rail'?'Bullet train':'Missing data');
 const date=formatLocalPointTime(new Date(state.time).toISOString(),state.point.map((n,i)=>i===1?((n+180)%360+360)%360-180:n));
 const status=tripElapsed>=tripRoute.totalDuration?t('Trip complete')+' · '+date:mode+' · '+date;
 if(status!==tripLastStatus){playbackControls.status.textContent=status;tripLastStatus=status;}
 playbackControls.progress.value=Math.round(tripElapsed/tripRoute.totalDuration*1000);
 if(playbackControls.follow.checked){
  if(type!==tripLastMode)map.setView(state.point,type==='flight'?4:type==='rail'?7:6,{animate:false});
  else map.panInside(state.point,{padding:[65,65],animate:false});
 }
 tripLastMode=type;
}
function tripTick(timestamp){
 if(!tripRunning)return;
 if(tripLastFrame)tripElapsed=Math.min(tripRoute.totalDuration,tripElapsed+Math.min(250,timestamp-tripLastFrame)*Number(playbackControls.speed.value));
 tripLastFrame=timestamp;paintTripPlayback();
 if(tripElapsed>=tripRoute.totalDuration){tripRunning=false;tripFrame=null;playbackLabels();return;}
 tripFrame=requestAnimationFrame(tripTick);
}
function stopTripPlayback(restore=true){
 playbackVisitDate=null;groundFacing=null;
 cancelAnimationFrame(tripFrame);tripFrame=null;tripRunning=false;tripActive=false;tripElapsed=0;tripLastFrame=0;
 playbackTrail.clearLayers();playbackVehicle.clearLayers();tripMarker=null;tripVehicleKey='';tripPainted=-1;tripCurrentLine=null;tripLastMode='';tripLastStatus='';
 playbackControls.options.hidden=true;playbackControls.stop.hidden=true;playbackControls.progress.value=0;playbackLabels();
 if(restore)draw(monthSel.value);
}
window.tripPlayback={stop:stopTripPlayback,isActive:()=>tripActive,updateMileage:showFullTripMileage};
playbackControls.play.addEventListener('click',()=>{
 if(tripRunning){tripRunning=false;cancelAnimationFrame(tripFrame);tripFrame=null;tripLastFrame=0;playbackLabels();return;}
 if(!tripActive){
  // draw() prepares the same filtered sections used by the regular map.
  draw(monthSel.value);tripRoute=buildPlaybackRoute(playbackSegments,monthSel.value);
  if(!tripRoute.segments.length){playbackControls.status.textContent=t('No route to play.');playbackControls.options.hidden=false;return;}
  layers.clearLayers();tripActive=true;playbackControls.options.hidden=false;playbackControls.stop.hidden=false;paintTripPlayback(true);
 }
 if(tripElapsed>=tripRoute.totalDuration){tripElapsed=0;tripLastMode='';paintTripPlayback(true);}
 tripRunning=true;tripLastFrame=0;playbackLabels();tripFrame=requestAnimationFrame(tripTick);
});
playbackControls.stop.addEventListener('click',()=>stopTripPlayback());
playbackControls.progress.addEventListener('input',()=>{if(!tripActive)return;tripElapsed=Number(playbackControls.progress.value)/1000*tripRoute.totalDuration;tripLastFrame=0;paintTripPlayback(true);playbackLabels();});
playbackControls.follow.addEventListener('change',()=>{if(tripActive&&playbackControls.follow.checked){tripLastMode='';paintTripPlayback();}});
map.on('dragstart',()=>{if(tripActive)playbackControls.follow.checked=false;});
// Changing the language redraws the map, stopping playback consistently with other filters.
window.addEventListener('languagechange',playbackLabels);
playbackLabels();
showFullTripMileage();
