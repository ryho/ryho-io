// Turn small, long-lived GPS clusters into a stationary pause in playback.
function playbackLocalDistance(a,b){
 let longitude=b[1]-a[1];while(longitude>180)longitude-=360;while(longitude< -180)longitude+=360;
 return 111195*Math.hypot(b[0]-a[0],longitude*Math.cos((a[0]+b[0])*Math.PI/360));
}
function groundPlaybackStops(record){
 if(record.type!=='ground'||record.points.length<2)return [record];
 const result=[];let points=[],dates=[];
 const flush=()=>{if(points.length>1)result.push({...record,points,dates});points=[];dates=[];};
 for(let i=0;i<record.points.length;){
  let end=i+1;
  while(end<record.points.length&&playbackLocalDistance(record.points[i],record.points[end])<=300)end++;
  const duration=Date.parse(record.dates[end-1])-Date.parse(record.dates[i]);
  if(end-i>1&&duration>=15*60000){
   const anchor=record.points[i];points.push(anchor);dates.push(record.dates[i]);flush();
   result.push({...record,points:[anchor,anchor],dates:[record.dates[i],record.dates[end-1]],dwell:true});
   points=[anchor];dates=[record.dates[end-1]];i=end;
  }else{points.push(record.points[i]);dates.push(record.dates[i]);i++;}
 }
 flush();return result;
}

// Keep brief border crossings in the surrounding trip region.
function playbackRegionAt(point){
 const p=[point[0],((point[1]+180)%360+360)%360-180];
 if(p[0]>=18&&p[0]<=23&&p[1]>=-161&&p[1]<=-154)return 'hawaii';
 if(p[0]>=48.97&&p[0]<=49.02&&p[1]>=-123.12&&p[1]<=-123.01)return 'canada';
 if(p[0]>=10.7&&p[0]<=17&&p[1]>=-90&&p[1]<=-82)return 'nicaragua';
 return ['japan','nicaragua','canada'].find(key=>pointInCountry(p,key))||'';
}
// Split recorded routes at region exits so playback never joins separate visits.
function regionPlaybackRecords(records,key){
 if(key==='all')return records;
 const inside=point=>pointInCountry([point[0],((point[1]+180)%360+360)%360-180],key);
 return records.flatMap(record=>{
  // Flights and unknown connections are indivisible: omit trips leaving the region.
  if(record.type==='flight'||record.type==='gap')return record.points.every(inside)?[record]:[];
  const sections=[];let points=[],dates=[];
  const flush=()=>{if(points.length>1)sections.push({...record,points,dates});points=[];dates=[];};
  record.points.forEach((point,index)=>{if(inside(point)){points.push(point);dates.push(record.dates[index]);}else flush();});
  flush();return sections;
 });
}
// The United States view sets the resting map framing and plays the worldwide route.
function playbackScope(){
 return countrySelect.value==='us'?'all':countrySelect.value;
}
// Distance-based playback compresses stops while retaining recorded dates and transport.
function buildPlaybackRoute(records,month){
 const scope=playbackScope();
 records=regionPlaybackRecords(records,scope);
 const layovers=[];
 for(const journey of buildFlightJourneys(records.filter(s=>s.type==='flight'))){
  for(let i=1;i<journey.legs.length;i++){
   const previous=journey.legs[i-1],next=journey.legs[i],airport=previous.points[previous.points.length-1];
   if(!(airport[0]>=24.5&&airport[0]<=49.5&&airport[1]>=-125&&airport[1]<=-66))continue;
   const from=previous.points[0],to=airport;
   let dx=to[1]-from[1];while(dx>180)dx-=360;while(dx< -180)dx+=360;
   const mercator=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
   layovers.push({start:Date.parse(previous.dates[0]),end:Date.parse(next.dates[next.dates.length-1]),airport,heading:Math.atan2(dx*Math.PI/180,mercator(to[0])-mercator(from[0]))*180/Math.PI});
  }
 }
 const ordered=records.flatMap(groundPlaybackStops).filter(s=>s.points.length>1&&s.dates.length===s.points.length&&Number.isFinite(Date.parse(s.dates[0])))
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
  const length=cumulative[cumulative.length-1];if(length<1&&!record.dwell)continue;
  const middle=points[Math.floor(points.length/2)],normalized=[middle[0],((middle[1]+180)%360+360)%360-180];
  const playbackRegion=record.type==='flight'?'':playbackRegionAt(normalized);
  segments.push({...record,points,cumulative,length,playbackRegion,times:record.dates.map(Date.parse)});
 }
 // A filtered region should play as a short trip, not inherit the worldwide duration.
 const target=['japan','nicaragua','hawaii','canada'].includes(scope)?(month==='all'?30000:15000):scope==='all'?(month==='all'?180000:60000):(month==='all'?60000:30000);
 const weights=segments.map(s=>s.dwell?0:Math.max(100,s.length*(s.type==='flight'?.25:s.type==='gap'?.1:1)));
 const sum=weights.reduce((a,b)=>a+b,0);
 const stops=segments.filter(s=>s.dwell).length,dwellBudget=Math.min(target*.2,stops*1200);
 const durations=weights.map((w,i)=>segments[i].dwell?dwellBudget/stops:Math.min(7000,Math.max(100,w/sum*(target-dwellBudget))));
 const durationSum=durations.reduce((a,b)=>a+b,0);let totalDuration=0,totalDistance=0;
 segments.forEach((segment,index)=>{segment.start=totalDuration;totalDuration+=durations[index]/durationSum*target;segment.end=totalDuration;segment.distanceBefore=totalDistance;totalDistance+=segment.length;});
 return {segments,totalDuration,totalDistance,layovers};
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
 const progress=segment.dwell?fraction:length?Math.max(0,Math.min(1,(distance-segment.cumulative[index])/length)):1;
 const from=segment.points[index],to=segment.points[index+1];
 // Match Leaflet's straight segments in Web Mercator, including date-line crossings.
 const mercator=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
 const y=mercator(from[0])+(mercator(to[0])-mercator(from[0]))*progress;
 const point=[(2*Math.atan(Math.exp(y))-Math.PI/2)*180/Math.PI,from[1]+(to[1]-from[1])*progress];
 const time=segment.times[index]+(segment.times[index+1]-segment.times[index])*progress;
 let heading=Math.atan2((to[1]-from[1])*Math.PI/180,mercator(to[0])-mercator(from[0]))*180/Math.PI;
 const layover=route.layovers?.find(stop=>time>=stop.start&&time<=stop.end&&playbackLocalDistance(point,stop.airport)<50000);
 if(layover)heading=layover.heading;
 const distanceTraveled=segment.distanceBefore+distance;
 return {segment,segmentIndex:lo,index,point,time,heading,inFlightLayover:!!layover,distance,distanceTraveled,forward:to[1]>=from[1]};
}

// Keep ground vehicles facing steadily through city blocks and GPS wiggles.
function stableGroundFacing(state,previous,elapsed=0){
 if(state.segment.dwell)return previous||{forward:state.forward};
 const segment=state.segment;
 let ahead=state.index+1,behind=state.index;
 while(ahead<segment.points.length-1&&segment.cumulative[ahead]<state.distance+1000)ahead++;
 while(behind>0&&segment.cumulative[behind]>state.distance-300)behind--;
 const delta=(segment.points[ahead][1]-segment.points[behind][1])*111195*Math.cos(state.point[0]*Math.PI/180);
 // Nearly north/south travel keeps its previous facing rather than flickering.
 if(Math.abs(delta)<80)return previous||{forward:state.forward};
 const forward=delta>0;
 if(!previous)return {forward};
 if(forward===previous.forward)return {forward};
 if(previous.candidate!==forward)return {...previous,candidate:forward,candidateAt:elapsed,candidateDistance:state.distanceTraveled};
 // A short consistent run confirms a real turn; do not wait kilometres to flip.
 if(elapsed-previous.candidateAt>=120&&state.distanceTraveled-previous.candidateDistance>=150)return {forward};
 return previous;
}

// Japan uses a metro car; Hawaii and Nicaragua retain the rental car.
function groundPlaybackVehicle(point){
 const lat=point[0],lon=((point[1]+180)%360+360)%360-180;
 let japan=lat>=24&&lat<=46&&lon>=122&&lon<=146;
 let car=(lat>=18&&lat<=23&&lon>=-161&&lon<=-154)||(lat>=10.7&&lat<=15.2&&lon>=-87.8&&lon<=-82.5);
 try{const zone=tzlookup(lat,lon);japan=japan||zone==='Asia/Tokyo';car=car||['Pacific/Honolulu','America/Managua'].includes(zone);}catch(error){}
 if(japan)return {url:'../assets/icons/subway-car.svg',size:[68,30]};
 return car?{url:'../assets/icons/silver-car.svg',size:[54,27]}:{url:'../assets/icons/truck-camper.svg',size:[84,42]};
}

const playbackControls={play:document.getElementById('play-trip'),stop:document.getElementById('stop-trip'),options:document.getElementById('trip-playback-options'),progress:document.getElementById('trip-progress'),speed:document.getElementById('trip-speed'),status:document.getElementById('trip-playback-status')};
const playbackTrail=L.layerGroup().addTo(map),playbackVehicle=L.layerGroup().addTo(map);
let tripRoute=null,tripActive=false,tripRunning=false,tripElapsed=0,tripFrame=null,tripLastFrame=0,tripPainted=-1,tripCurrentLine=null,tripMarker=null,tripVehicleKey='',tripLastMode='',tripLastStatus='';
let groundFacing=null,playbackFollow=true;
const playbackNames=L.control({position:'topright'});
const playbackNameBox=L.DomUtil.create('div','playback-place-names');
L.DomEvent.disableClickPropagation(playbackNameBox);
L.DomEvent.disableScrollPropagation(playbackNameBox);
playbackNames.onAdd=()=>playbackNameBox;playbackNames.addTo(map);
const announcedPlaybackPlaces=new Set();
let playbackNameEntries=[];
function clearPlaybackNames(){announcedPlaybackPlaces.clear();playbackNameEntries=[];playbackNameBox.replaceChildren();}
function updatePlaybackNames(state,date,rebuild){
 if(rebuild){
  clearPlaybackNames();
  for(const place of [...visitedParks,...travelHighlights]){
   if(place.dates.some(d=>d<date&&!hiddenHolidayDate(d)))announcedPlaybackPlaces.add(place.id||place.code||place.name);
  }
 }
 const now=performance.now();
 for(const entry of playbackNameEntries)if(now>=entry.until)entry.element.remove();
 playbackNameEntries=playbackNameEntries.filter(entry=>now<entry.until);
 const mobileNames=window.matchMedia('(max-width:700px)').matches;
 // Also trim existing desktop notifications if the viewport becomes mobile-sized.
 if(mobileNames&&playbackNameEntries.length>1){
  playbackNameEntries.slice(0,-1).forEach(entry=>entry.element.remove());
  playbackNameEntries=playbackNameEntries.slice(-1);
 }
 for(const place of [...visitedParks,...travelHighlights]){
  const key=place.id||place.code||place.name;
  if(announcedPlaybackPlaces.has(key)||!place.dates.includes(date)||hiddenHolidayDate(date))continue;
  if(playbackLocalDistance(state.point,place.position)>25000)continue;
  announcedPlaybackPlaces.add(key);
  const element=document.createElement('div');element.className='playback-place-name';
  const clip=document.createElement('div');clip.className='playback-name-clip';
  const button=document.createElement('button');button.type='button';button.className='playback-name-button';
  const image=document.createElement('img');image.src='../'+place.icon;image.alt='';image.width=32;image.height=38;
  const label=document.createElement('span');label.textContent=placeName(place.name);button.append(image,label);
  button.addEventListener('click',()=>{
   if(tripRunning){tripRunning=false;cancelAnimationFrame(tripFrame);tripFrame=null;tripLastFrame=0;playbackLabels();}
   playbackFollow=false;cameraZoomUntil=0;map.stop();
   map.setView(place.position,9,{animate:true});
   const popup=L.popup({maxWidth:460,className:place.photo?'photo-popup':''}).setLatLng(place.position);
   popup.setContent(placePopupContent(place,visibleVisitDates(place,monthSel.value),()=>({isPopupOpen:()=>map.hasLayer(popup),getPopup:()=>popup}))).openOn(map);
  });
  clip.appendChild(button);element.appendChild(clip);
  element.addEventListener('animationend',()=>element.remove(),{once:true});
  if(mobileNames){playbackNameEntries.forEach(entry=>entry.element.remove());playbackNameEntries=[];}
  playbackNameBox.appendChild(element);playbackNameEntries.push({element,until:now+8600});
 }
}
const bigIslandBounds=L.latLngBounds([18.90,-156.10],[20.30,-154.75]);
const bigIslandPadding=L.point(24,24);
let vehicleDisplay=null,vehicleTarget=null,cameraDisplay=null,cameraZoomUntil=0,cameraOnBigIsland=false;
// Smooth in projected coordinates so motion stays even at every latitude.
function smoothPlaybackPoint(current,target,seconds,dt){
 if(!current)return target;
 const a=map.project(current),b=map.project(target),blend=1-Math.exp(-dt/seconds);
 return map.unproject(a.add(b.subtract(a).multiplyBy(blend)));
}
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
function paintTripPlayback(rebuild=false,dt=1/60){
 const state=playbackPosition(tripRoute,tripElapsed);if(!state)return;
 updateTripMileage(state.distanceTraveled);
 if(rebuild){vehicleDisplay=null;vehicleTarget=null;cameraDisplay=null;cameraZoomUntil=0;map.stop();}
 const rawPoint=L.latLng(state.point);
 const onGround=state.segment.type==='ground'||state.segment.type==='gap';
 const smoothVehicle=onGround&&state.segment.playbackRegion!=='hawaii';
 // Skip the movement threshold and easing in Hawaii so the marker stays on the route.
 if(!smoothVehicle||!vehicleTarget||playbackLocalDistance([vehicleTarget.lat,vehicleTarget.lng],state.point)>400)vehicleTarget=rawPoint;
 vehicleDisplay=smoothVehicle?smoothPlaybackPoint(vehicleDisplay,vehicleTarget,.65,dt):rawPoint;
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
 updatePlaybackNames(state,visitDate,rebuild);
 const type=state.inFlightLayover?'flight':state.segment.type,vehicleType=type==='gap'?'ground':type;
 if(vehicleType==='ground'){
  const east=(vehicleTarget.lng-vehicleDisplay.lng)*111195*Math.cos(vehicleDisplay.lat*Math.PI/180);
  if(!smoothVehicle)groundFacing=stableGroundFacing(state,groundFacing,tripElapsed);
  else if(Math.abs(east)>120)groundFacing={forward:east>0};
  else if(!groundFacing)groundFacing=stableGroundFacing(state,null,tripElapsed);
 }
 else if(type==='flight'||type==='rail')groundFacing=null;
 const facing=vehicleType==='ground'?groundFacing.forward:state.forward;
 {
  const spec=type==='flight'?{url:'../assets/icons/plane.svg',size:[34,34]}:type==='rail'?{url:'../assets/icons/bullet-train.svg',size:[74,22]}:groundPlaybackVehicle(state.point);
  const key=spec.url;
  if(key!==tripVehicleKey){
   const flip=vehicleType==='ground'?facing:!facing;
   const icon=L.divIcon({className:'trip-vehicle',html:'<img alt="" src="'+spec.url+'" style="transform:scaleX('+(flip?-1:1)+')">',iconSize:spec.size,iconAnchor:spec.size.map(n=>n/2)});
   if(tripMarker)tripMarker.setIcon(icon);else tripMarker=L.marker(state.point,{icon,zIndexOffset:2000,interactive:false,keyboard:false}).addTo(playbackVehicle);
   tripVehicleKey=key;
  }
  tripMarker.setLatLng(vehicleDisplay);
  const image=tripMarker.getElement()?.querySelector('img');
  const transform=type==='flight'?'rotate('+state.heading+'deg)':'scaleX('+((vehicleType==='ground'?facing:!facing)?-1:1)+')';
  if(image&&image.style.transform!==transform)image.style.transform=transform;
 }
 const mode=t(type==='ground'?'Ground travel':type==='flight'?'Flights':type==='rail'?'Bullet train':'Missing data');
 const date=formatLocalPointTime(new Date(state.time).toISOString(),state.point.map((n,i)=>i===1?((n+180)%360+360)%360-180:n));
 const status=tripElapsed>=tripRoute.totalDuration?t('Trip complete')+' · '+date:mode+' · '+date;
 if(status!==tripLastStatus){playbackControls.status.textContent=status;tripLastStatus=status;}
 playbackControls.progress.value=Math.round(tripElapsed/tripRoute.totalDuration*1000);
 if(playbackFollow){
  const onBigIsland=type!=='flight'&&state.segment.playbackRegion==='hawaii';
  const zoom=type==='flight'?4:onBigIsland?Math.min(10,map.getBoundsZoom(bigIslandBounds,false,bigIslandPadding.multiplyBy(2))):state.segment.playbackRegion==='canada'?7:state.segment.playbackRegion?8:6;
  if(onBigIsland&&(!cameraDisplay||!cameraOnBigIsland)){
   // Match the longitude copy used by the worldwide playback route.
   const offset=360*Math.round((vehicleDisplay.lng-bigIslandBounds.getCenter().lng)/360);
   const southwest=bigIslandBounds.getSouthWest(),northeast=bigIslandBounds.getNorthEast();
   const bounds=[[southwest.lat,southwest.lng+offset],[northeast.lat,northeast.lng+offset]];
   const animated=!!cameraDisplay;
   cameraOnBigIsland=true;
   if(animated)map.flyToBounds(bounds,{padding:bigIslandPadding,maxZoom:zoom,duration:1.4});
   else map.fitBounds(bounds,{padding:bigIslandPadding,maxZoom:zoom,animate:false});
   cameraDisplay=map.getCenter();
   cameraZoomUntil=performance.now()+1500;
   return;
  }
  cameraOnBigIsland=onBigIsland;
  if(!cameraDisplay){
   // Set the view once. Transport changes must never snap or change zoom.
   map.setView(vehicleDisplay,zoom,{animate:false});
   cameraDisplay=map.getCenter();
  }
  if(performance.now()<cameraZoomUntil)return;
  if(map.getZoom()!==zoom){
   cameraZoomUntil=performance.now()+1500;
   map.flyTo(vehicleDisplay,zoom,{duration:1.4});cameraDisplay=vehicleDisplay;return;
  }
  cameraDisplay=map.getCenter();
  const center=map.project(cameraDisplay),vehicle=map.project(vehicleDisplay);
  const delta=vehicle.subtract(center),radius=Math.min(map.getSize().x,map.getSize().y)*.18;
  const length=Math.hypot(delta.x,delta.y);
  // A roomy stationary frame for cities; a slow continuous follow on the road.
  if(length>radius){
   const target=map.unproject(center.add(delta.multiplyBy((length-radius)/length)));
   cameraDisplay=smoothPlaybackPoint(cameraDisplay,target,type==='flight'?.45:2.5,dt);
  }
  // Bound camera lag so fast travel cannot take the vehicle outside the viewport.
  const view=map.getSize(),safeX=Math.max(30,view.x/2-90),safeY=Math.max(30,view.y/2-90);
  const proposed=map.project(cameraDisplay),offset=vehicle.subtract(proposed);
  cameraDisplay=map.unproject(proposed.add(L.point(
   offset.x-Math.max(-safeX,Math.min(safeX,offset.x)),
   offset.y-Math.max(-safeY,Math.min(safeY,offset.y)))));
  map.panTo(cameraDisplay,{animate:false});

 }
 tripLastMode=type;
}
function tripTick(timestamp){
 if(!tripRunning)return;
 const current=playbackPosition(tripRoute,tripElapsed),regionalSpeed=playbackScope()==='all'&&current?.segment.playbackRegion&&current.segment.playbackRegion!=='hawaii' ? .5 : 1;
 if(tripLastFrame&&performance.now()>=cameraZoomUntil)tripElapsed=Math.min(tripRoute.totalDuration,tripElapsed+Math.min(250,timestamp-tripLastFrame)*Number(playbackControls.speed.value)*regionalSpeed);
 const dt=tripLastFrame?Math.min(.1,(timestamp-tripLastFrame)/1000):1/60;
 tripLastFrame=timestamp;paintTripPlayback(false,dt);
 if(tripElapsed>=tripRoute.totalDuration){tripRunning=false;tripFrame=null;playbackLabels();return;}
 tripFrame=requestAnimationFrame(tripTick);
}
function stopTripPlayback(restore=true){
 playbackFollow=true;
 clearPlaybackNames();
 cameraZoomUntil=0;map.stop();playbackVisitDate=null;groundFacing=null;vehicleDisplay=null;vehicleTarget=null;cameraDisplay=null;
 cancelAnimationFrame(tripFrame);tripFrame=null;tripRunning=false;tripActive=false;tripElapsed=0;tripLastFrame=0;
 playbackTrail.clearLayers();playbackVehicle.clearLayers();tripMarker=null;tripVehicleKey='';tripPainted=-1;tripCurrentLine=null;tripLastMode='';tripLastStatus='';
 playbackControls.options.hidden=true;playbackControls.stop.hidden=true;playbackControls.progress.value=0;playbackLabels();
 if(restore)draw(monthSel.value);
}
window.tripPlayback={stop:stopTripPlayback,isActive:()=>tripActive,updateMileage:showFullTripMileage};
playbackControls.play.addEventListener('click',()=>{
 if(tripRunning){tripRunning=false;cancelAnimationFrame(tripFrame);tripFrame=null;tripLastFrame=0;playbackLabels();return;}
 if(!playbackFollow)cameraDisplay=null;
 playbackFollow=true;
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
// Changing the language redraws the map, stopping playback consistently with other filters.
window.addEventListener('languagechange',playbackLabels);
playbackLabels();
showFullTripMileage();
