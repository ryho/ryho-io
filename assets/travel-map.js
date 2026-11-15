const map=L.map('map',{worldCopyJump:true,preferCanvas:true}).setView([38,-106],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:13}).addTo(map);
const transportColors={ground:'#007A78',flight:'#B53670',gap:'#687583'};
const months=[...new Set([...Object.keys(paths),...Object.keys(typeof routeBreaks==='undefined'?{}:routeBreaks)])].sort();const monthSel=document.getElementById('month');
months.forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=new Date(m+'-15T12:00:00Z').toLocaleString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});monthSel.appendChild(o)});
let layers=L.layerGroup().addTo(map);let playTimer=null;
function formatRecordedTime(value) {
 if(!value)return 'Date unavailable';
 if(!value.includes('T'))return new Date(value+'T12:00:00Z').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
 // Format the recorded wall-clock time, preserving its original offset.
 const local=new Date(value.slice(0,19)+'Z');
 const offset=value.endsWith('Z')?'UTC':'UTC'+value.slice(-6);
 return local.toLocaleString(undefined,{year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'UTC'})+' ('+offset+')';
}
function formatLocalPointTime(value,point){
 if(!value||!value.includes('T'))return formatRecordedTime(value);
 try{
  const zone=tzlookup(point[0],point[1]);
  return new Date(value).toLocaleString(undefined,{year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:zone,timeZoneName:'short'});
 }catch(error){return formatRecordedTime(value);}
}
function formatConnectionTimes(dates,points){
 try{
  const endpoints=dates.map((value,index)=>{
   const instant=new Date(value),zone=tzlookup(points[index][0],points[index][1]);
   const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:zone}).formatToParts(instant);
   const key=['year','month','day'].map(type=>parts.find(part=>part.type===type).value).join('-');
   return {key,date:instant.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric',timeZone:zone}),time:instant.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',timeZone:zone,timeZoneName:'short'})};
  });
  const [start,end]=endpoints;
  return start.key===end.key?start.date+' · '+start.time+' – '+end.time:start.date+' · '+start.time+' – '+end.date+' · '+end.time;
 }catch(error){return dates.map((value,index)=>formatLocalPointTime(value,points[index])).join(' – ');}
}
function showRouteDate(event, line, dates) {
 const clicked=map.latLngToLayerPoint(event.latlng);
 let nearest=0, best=Infinity;
 line.forEach((point,index)=>{
  const pixel=map.latLngToLayerPoint(point);
  const distance=pixel.distanceTo(clicked);
  if(distance<best){best=distance;nearest=index;}
 });
 const date=dates && dates[nearest];
 const label=formatLocalPointTime(date,line[nearest]);
 const content=document.createElement('div');
 const title=document.createElement('strong');title.textContent=label;content.appendChild(title);
 map.closePopup();
 L.popup().setLatLng(line[nearest]).setContent(content).openOn(map);
}
const locationLayers=L.layerGroup().addTo(map);
const categories={parks:{name:'National parks',color:'#28633d'},nature:{name:'Nature & outdoors',color:'#2466a5'},cities:{name:'Cities & towns',color:'#7546b8'},landmarks:{name:'Landmarks & oddities',color:'#d0a42b'},people:{name:'People & celebrations',color:'#b53670'}};
const activeCategories=new Set(Object.keys(categories));
for(const [key,group] of [['all',{name:'All locations',color:'#64748b'}],...Object.entries(categories)]){
 const label=document.createElement('label');label.style='display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer';
 const input=document.createElement('input');input.type='radio';input.name='location-category';input.checked=key==='all';input.value=key;input.style.accentColor=group.color;
 input.addEventListener('change',()=>{if(!input.checked)return;activeCategories.clear();(key==='all'?Object.keys(categories):[key]).forEach(category=>activeCategories.add(category));drawLocations(monthSel.value);});
 const dot=document.createElement('span');dot.style='width:11px;height:11px;border-radius:50%;background:'+group.color;
 label.append(input,dot,document.createTextNode(group.name));document.getElementById('category-options').appendChild(label);
}
// Inclusive local calendar dates; edit these ranges to adjust the comparison.
const holidayHomeRanges=[['2025-10-09','2025-10-15'],['2025-11-25','2025-12-02'],['2025-12-22','2025-12-29'],['2026-03-12','2026-03-17']];
function holidayTripsHidden(){return document.getElementById('hide-holiday-trips').checked;}
function hiddenHolidayDate(value){return holidayTripsHidden()&&value&&holidayHomeRanges.some(([start,end])=>value.slice(0,10)>=start&&value.slice(0,10)<=end);}
function hiddenHolidayConnection(dates){
 if(!holidayTripsHidden())return false;
 const start=dates[0].slice(0,10),end=dates[dates.length-1].slice(0,10);
 return holidayHomeRanges.some(([a,b])=>start<=b&&end>=a);
}
function visibleVisitDates(place,chosen){return place.dates.filter(date=>!hiddenHolidayDate(date)&&(chosen==='all'||date.startsWith(chosen)));}
document.getElementById('hide-holiday-trips').addEventListener('change',()=>draw(monthSel.value));
function compareVisitDates(chosen){
 const firstDate=place=>visibleVisitDates(place,chosen).sort()[0]||'9999-12-31';
 return (a,b)=>{
  if(a.id==='trip-start'&&b.id!=='trip-start')return -1;
  if(b.id==='trip-start'&&a.id!=='trip-start')return 1;
  return firstDate(a).localeCompare(firstDate(b))||a.name.localeCompare(b.name);
 };
}
// Merge consecutive days and single missing days; preserve longer gaps.
function formatVisitRanges(dates){
 const sorted=[...new Set(dates)].sort();const ranges=[];
 for(const date of sorted){
  const last=ranges[ranges.length-1];
  if(last && Date.parse(date+'T00:00:00Z')-Date.parse(last[1]+'T00:00:00Z')<=2*86400000){last[1]=date;}
  else ranges.push([date,date]);
 }
 return ranges.map(([start,end])=>{
  if(start===end)return formatRecordedTime(start);
  if(start.slice(0,7)===end.slice(0,7)){
   const month=new Date(start+'T12:00:00Z').toLocaleDateString(undefined,{month:'long',timeZone:'UTC'});
   return month+' '+Number(start.slice(8,10))+' - '+Number(end.slice(8,10))+', '+start.slice(0,4);
  }
  return formatRecordedTime(start)+' – '+formatRecordedTime(end);
 }).join('; ');
}
function drawLocations(chosen){
 map.closePopup();locationLayers.clearLayers();const list=document.getElementById('location-list');list.replaceChildren();
 const places=[...visitedParks,...travelHighlights].filter(place=>activeCategories.has(place.category)&&(visibleVisitDates(place,chosen).length>0||(chosen==='all'&&place.dates.length===0))).sort(compareVisitDates(chosen));
 document.getElementById('location-summary').textContent=places.length+' locations'+(chosen==='all'?'':' this month');
 if(!places.length){const empty=document.createElement('li');empty.textContent='No locations match these filters.';list.appendChild(empty);}
 for(const place of places){
  const dates=visibleVisitDates(place,chosen);
  const content=document.createElement('div');const heading=document.createElement('strong');heading.textContent=place.name;content.appendChild(heading);
  if(place.photo){const image=document.createElement('img');image.src=place.photo;image.alt=place.photoAlt||place.name;image.loading='lazy';image.style='display:block;width:100%;height:150px;object-fit:cover;border-radius:8px;margin-top:10px';image.addEventListener('error',()=>image.remove());content.appendChild(image);if(place.photoSource){const source=document.createElement('a');source.href=place.photoSource;source.target='_blank';source.rel='noopener';source.textContent='Photo source';source.style='font-size:11px';content.appendChild(source);}}
  const date=document.createElement('p');date.textContent=dates.length?formatVisitRanges(dates):'Date not recorded';content.appendChild(date);
  const url=place.url||(place.code?'https://www.nps.gov/'+(['sequ','kica'].includes(place.code)?'seki':place.code)+'/':null);
  if(url){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent='More information';content.appendChild(link);}
  const marker=L.marker(place.position,{icon:L.icon({iconUrl:place.icon,iconSize:[32,38],iconAnchor:place.iconAnchor?[place.iconAnchor[0]*32/42,38]:[16,38],popupAnchor:[16-(place.iconAnchor?place.iconAnchor[0]*32/42:16),-35]}),title:place.name,alt:place.name,riseOnHover:true}).bindPopup(content,{maxWidth:330}).addTo(locationLayers);
  const item=document.createElement('li');const button=document.createElement('button');button.type='button';button.style='background:none;border:0;padding:5px 0;text-align:left;font-size:14px';
  const dot=document.createElement('span');dot.style='display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px;background:'+categories[place.category].color;
  const name=document.createElement('span');name.textContent=place.name;const dateLabel=document.createElement('small');dateLabel.style='display:block;margin-left:17px;color:var(--sub)';dateLabel.textContent=dates.length?formatVisitRanges(dates):'Date not recorded';button.append(dot,name,dateLabel);button.addEventListener('click',()=>{map.setView(place.position,9);marker.openPopup();});item.appendChild(button);list.appendChild(item);
 }
}
const allFlights=[...(typeof recordedFlights==='undefined'?[]:recordedFlights),...(typeof flightOverrides==='undefined'?[]:flightOverrides)];
let flights=allFlights;
const flightCities=[
 {name:'Las Vegas, Nevada',point:[36.09,-115.14]}, {name:'Atlanta, Georgia',point:[33.63,-84.42]},
 {name:'Memphis, Tennessee',point:[35.04,-89.97]}, {name:'Phoenix, Arizona',point:[33.43,-112.02]},
 {name:'Denver, Colorado',point:[39.84,-104.67]}, {name:'Seattle, Washington',point:[47.45,-122.31]},
 {name:'Kona, Hawaii',point:[19.74,-156.03]}, {name:'Chicago, Illinois',point:[41.97,-87.90]},
 {name:'Tokyo, Japan',point:[35.55,139.77]}, {name:'Newark, New Jersey',point:[40.70,-74.18]},
 {name:'Houston, Texas',point:[29.99,-95.34]}, {name:'Managua, Nicaragua',point:[12.15,-86.16]}
];
function flightCity(point){
 const nearest=[...flightCities].sort((a,b)=>map.distance(a.point,point)-map.distance(b.point,point))[0];
 return map.distance(nearest.point,point)<75000?nearest.name:'Unidentified location';
}
function buildFlightJourneys(records){
 const journeys=[];
 for(const flight of [...records].sort((a,b)=>Date.parse(a.dates[0])-Date.parse(b.dates[0]))){
  const previous=journeys[journeys.length-1],last=previous?.legs[previous.legs.length-1];
  const wait=last?Date.parse(flight.dates[0])-Date.parse(last.dates[1]):Infinity;
  if(last&&wait>=0&&wait<=24*3600000&&map.distance(last.points[1],flight.points[0])<100000){previous.legs.push(flight);previous.points.push(flight.points[1]);}
  else journeys.push({legs:[flight],points:[...flight.points]});
 }
 return journeys;
}
function flightAt(start,end){
 const a=Date.parse(start),b=Date.parse(end);
 return flights.some(f=>a>=Date.parse(f.dates[0])&&b<=Date.parse(f.dates[1]));
}
function gapMatchesFlight(gap){
 const a=Date.parse(gap.dates[0]),b=Date.parse(gap.dates[1]);
 const longConnection=map.distance(gap.points[0],gap.points[1])>200000;
 return flights.some(f=>{
  if(a<Date.parse(f.dates[1])&&b>Date.parse(f.dates[0]))return true;
  if(!longConnection)return false;
  // Repeated/return flights may overlap on the map despite different dates.
  const near=(p,q)=>map.distance(p,q)<100000;
  return (near(gap.points[0],f.points[0])&&near(gap.points[1],f.points[1]))||
         (near(gap.points[0],f.points[1])&&near(gap.points[1],f.points[0]));
 });
}
function draw(chosen){
 flights=allFlights.filter(f=>!hiddenHolidayConnection(f.dates));
 drawLocations(chosen);
 map.closePopup();layers.clearLayers();const bounds=[];let count=0;
 const selected=m=>chosen==='all'||m===chosen;
 // Draw context first so the highlighted month stays on top.
 const ordered=[...months].sort((a,b)=>Number(selected(a))-Number(selected(b)));
 for(const m of ordered){
  const active=selected(m);
  for(const gap of (typeof routeBreaks==='undefined'?{}:routeBreaks)[m]||[]){
   if(hiddenHolidayConnection(gap.dates)||gapMatchesFlight(gap))continue;
   const content=document.createElement('div');content.textContent=formatConnectionTimes(gap.dates,gap.points)+' · Recording gap: actual route unknown.';
   L.polyline(gap.points,{color:transportColors.gap,weight:active?3:2,opacity:active?.65:.12,dashArray:'7 10'}).bindPopup(content).addTo(layers);
   if(active)bounds.push(...gap.points);
  }
  (paths[m]||[]).forEach((line,index)=>{
   const dates=typeof pathDates==='undefined'?[]:pathDates[m]?.[index]||[];
   // Split at explicit flight samples to avoid drawing them as ground travel.
   let segment=[],times=[];
   function flush(){if(segment.length>1){const points=segment,stamp=times;const route=L.polyline(points,{color:transportColors.ground,weight:active?5:2,opacity:active?.95:.14,smoothFactor:1}).addTo(layers);route.on('click',event=>showRouteDate(event,points,stamp));}segment=[];times=[];}
   for(let j=0;j<line.length;j++){
    if(hiddenHolidayDate(dates[j])){flush();continue;}
    if(j>0&&flightAt(dates[j-1],dates[j])){flush();segment=[line[j]];times=[dates[j]];}
    else{segment.push(line[j]);times.push(dates[j]);}
   }
   flush();if(active){line.forEach((point,index)=>{if(!hiddenHolidayDate(dates[index])){count++;bounds.push(point);}});}
  });
 }
 // Group complete itineraries, including layovers, and align repeated paths.
 const journeyGroups=[];
 for(const journey of buildFlightJourneys(flights)){
  const names=journey.points.map(flightCity),forward=names.join('|'),reverse=[...names].reverse().join('|');
  const canonical=forward<reverse?forward:reverse;
  let group=journeyGroups.find(g=>g.key===canonical);
  // Unidentified points should not collapse unrelated flight records.
  if(names.includes('Unidentified location'))group=null;
  if(!group){group={key:canonical,points:forward<reverse?journey.points:[...journey.points].reverse(),journeys:[]};journeyGroups.push(group);}
  group.journeys.push(journey);
 }
 const labeledAirports=new Set();
 for(const group of journeyGroups){
  const matching=group.journeys.filter(j=>j.legs.some(f=>selected(f.dates[0].slice(0,7))));
  const active=matching.length>0,shown=active?matching:group.journeys;
  const content=document.createElement('div');
  for(const journey of shown){
   const heading=document.createElement('strong');heading.textContent=journey.points.map(flightCity).join(' → ');content.appendChild(heading);
   for(const flight of journey.legs){const leg=document.createElement('p');leg.textContent=flightCity(flight.points[0])+' → '+flightCity(flight.points[1])+' · '+formatConnectionTimes(flight.dates,flight.points);content.appendChild(leg);}
  }
  // Unwrap longitudes so Pacific flights take the short path across the date line.
  const points=group.points.map((p,i)=>{let lon=p[1];if(i){const prev=group.unwrapped[i-1][1];while(lon-prev>180)lon-=360;while(lon-prev< -180)lon+=360;}const point=[p[0],lon];if(!i)group.unwrapped=[];group.unwrapped.push(point);return point;});
  L.polyline(points,{color:transportColors.flight,weight:active?3:2,opacity:active?.95:.14,dashArray:'16 16',lineCap:'butt'}).bindPopup(content).addTo(layers);
  if(active){
   const segment=Math.floor((points.length-2)/2);
   const point=[(points[segment][0]+points[segment+1][0])/2,(points[segment][1]+points[segment+1][1])/2];
   L.marker(point,{icon:L.icon({iconUrl:'assets/icons/plane.svg',iconSize:[22,22],iconAnchor:[11,11]}),title:shown[0].points.map(flightCity).join(' → ')}).bindPopup(content.cloneNode(true)).addTo(layers);
   for(const location of group.points){const city=flightCity(location);if(labeledAirports.has(city))continue;labeledAirports.add(city);L.circleMarker(location,{radius:4,color:transportColors.flight,fillColor:'white',fillOpacity:1,weight:2}).addTo(layers);}
   bounds.push(...group.points);
  }
 }

 if(chosen==='all')map.fitBounds([[24.5,-125],[49.5,-66]],{padding:[25,25]});
 else if(bounds.length)map.fitBounds(bounds,{padding:[30,30],maxZoom:9});
 document.getElementById('count').textContent=count.toLocaleString()+' route points'+(chosen==='all'?'':' · Selected month highlighted')+' · Click a route for dates';
}
monthSel.addEventListener('change',()=>draw(monthSel.value));const btn=document.getElementById('play');btn.addEventListener('click',()=>{if(playTimer){clearInterval(playTimer);playTimer=null;btn.textContent='▶ Play months';return}
 let i=monthSel.value==='all'?-1:months.indexOf(monthSel.value);btn.textContent='■ Stop';function tick(){i=(i+1)%months.length;monthSel.value=months[i];draw(months[i]);if(i===months.length-1){clearInterval(playTimer);playTimer=null;btn.textContent='▶ Play months'}}tick();playTimer=setInterval(tick,3000)});
draw('all');

new ResizeObserver(()=>map.invalidateSize()).observe(document.getElementById("map"));
