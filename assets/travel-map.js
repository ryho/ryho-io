const {t,locale,placeName}=TravelI18n;
const map=L.map('map',{worldCopyJump:true,preferCanvas:true,minZoom:2,maxZoom:19}).setView([38,-106],4);
// OpenFreeMap serves OpenStreetMap vector data with translated name fields.
let vectorMap;
function setBasemapLanguage(){
 if(!vectorMap)return;
 if(!vectorMap.isStyleLoaded()){vectorMap.once('idle',setBasemapLanguage);return;}
 const name=['coalesce',['get','name:'+TravelI18n.language()],['get','name:latin'],['get','name']];
 for(const layer of vectorMap.getStyle().layers){
  const field=layer.layout?.['text-field'];
  if(field&&JSON.stringify(field).includes('name'))vectorMap.setLayoutProperty(layer.id,'text-field',name);
 }
}
async function loadBasemap(){
 try{
  const response=await fetch('assets/map-style.json');if(!response.ok)throw new Error('Map style unavailable');
  const style=await response.json();
  const background=L.maplibreGL({style,interactive:false,attribution:'<a href="https://openfreemap.org/">OpenFreeMap</a> · © <a href="https://openmaptiles.org/">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  vectorMap=background.getMaplibreMap();vectorMap.on('load',setBasemapLanguage);
 }catch(error){
  console.warn('Vector basemap unavailable; using standard OpenStreetMap tiles.',error);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
 }
}
loadBasemap();
const countrySelect=document.getElementById('country');
// Broad trip-view regions; edit these bounds to adjust their coverage.
const usTripRegions={
 'us-southwest':[[31,-125],[42,-102]],
 'us-northwest':[[42,-125],[49.5,-104]],
 'us-upper-midwest':[[40.5,-104],[49.5,-82]]
};
function withinRegionBounds(point,bounds){return point[0]>=bounds[0][0]&&point[0]<=bounds[1][0]&&point[1]>=bounds[0][1]&&point[1]<=bounds[1][1];}
function pointInCountry(point,key){
 if(usTripRegions[key])return withinRegionBounds(point,usTripRegions[key])&&pointInCountry(point,'us');
 if(key==='hawaii')return point[0]>=18&&point[0]<=23&&point[1]>=-161&&point[1]<=-154;
 if(key==='us'&&(point[0]<24.5||point[0]>49.5||point[1]<-125||point[1]>-66))return false;
 const geometry=tripCountryBoundaries[key];if(!geometry)return false;
 const polygons=geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates];
 function inside(ring){let hit=false;const x=point[1],y=point[0];for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
 }return hit;}
 return polygons.some(poly=>inside(poly[0])&&!poly.slice(1).some(inside));
}
const countryPointCache={};
function countryTripBounds(key,month,fallbackToCountry=true){
 if(!countryPointCache[key]){
  const candidates=[];
  for(const [m,lines] of Object.entries(paths))lines.forEach((line,index)=>line.forEach((point,j)=>{
   if(pointInCountry(point,key))candidates.push({point,date:pathDates[m][index][j],month:m});
  }));
  // Pins help retain coastal stops that simplified country outlines can miss.
  for(const place of [...visitedParks,...travelHighlights]){
   const country=place.country;
   const belongs=usTripRegions[key]?(!country&&withinRegionBounds(place.position,usTripRegions[key])):key==='hawaii'?place.stateLabel==='Hawaii':key==='us'?(!country&&place.position[1]>=-125&&place.position[1]<=-66&&place.position[0]>=24.5&&place.position[0]<=49.5):Boolean(country&&country===({canada:'Canada',japan:'Japan',nicaragua:'Nicaragua'})[key]);
   if(belongs||pointInCountry(place.position,key))for(const date of place.dates)candidates.push({point:place.position,date,month:date.slice(0,7)});
  }
  countryPointCache[key]=candidates;
 }
 const visible=countryPointCache[key].filter(p=>!hiddenHolidayDate(p.date));
 const selected=month==='all'?visible:visible.filter(p=>p.month===month);
 return (selected.length||!fallbackToCountry?selected:visible).map(p=>p.point);
}
function fitUSView(){
 // Preserve the preferred framing as a geographic area, so smaller maps zoom out.
 const zoom=5,center=map.project([42.87,-102.2],zoom),half=L.point(570,390);
 const bounds=L.latLngBounds(map.unproject(center.subtract(half),zoom),map.unproject(center.add(half),zoom));
 map.fitBounds(bounds,{padding:[12,12],animate:false});
}
function focusCountry(){draw(monthSel.value);}
countrySelect.addEventListener('change',focusCountry);
const transportColors={ground:'#007A78',flight:'#B53670',gap:'#687583',rail:'#7546D9'};
const months=[...new Set([...Object.keys(paths),...Object.keys(typeof routeBreaks==='undefined'?{}:routeBreaks)])].sort();const monthSel=document.getElementById('month');
months.forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=new Date(m+'-15T12:00:00Z').toLocaleString(locale(),{month:'long',year:'numeric',timeZone:'UTC'});monthSel.appendChild(o)});
let layers=L.layerGroup().addTo(map);
function formatRecordedTime(value) {
 if(!value)return t('Date unavailable');
 if(!value.includes('T'))return new Date(value+'T12:00:00Z').toLocaleDateString(locale(),{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
 // Format the recorded wall-clock time, preserving its original offset.
 const local=new Date(value.slice(0,19)+'Z');
 const offset=value.endsWith('Z')?'UTC':'UTC'+value.slice(-6);
 return local.toLocaleString(locale(),{year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'UTC'})+' ('+offset+')';
}
function formatZonedTime(instant,zone,options){
 // Intl uses numeric GMT offsets for some regions even in English.
 // Supply the conventional abbreviations for the international stops.
 const conventional={'Asia/Tokyo':'JST','America/Managua':'CST'};
 const englishZone=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'short'}).formatToParts(instant).find(p=>p.type==='timeZoneName').value;
 const parts=new Intl.DateTimeFormat(locale(),{...options,timeZone:zone,timeZoneName:'short'}).formatToParts(instant);
 return parts.map(part=>part.type==='timeZoneName'?(conventional[zone]||englishZone):part.value).join('');
}
function formatLocalPointTime(value,point){
 if(!value||!value.includes('T'))return formatRecordedTime(value);
 try{
  const zone=tzlookup(point[0],point[1]);
  return formatZonedTime(new Date(value),zone,{year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'});
 }catch(error){return formatRecordedTime(value);}
}
function formatConnectionTimes(dates,points){
 try{
  const endpoints=dates.map((value,index)=>{
   const instant=new Date(value),zone=tzlookup(points[index][0],points[index][1]);
   const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:zone}).formatToParts(instant);
   const key=['year','month','day'].map(type=>parts.find(part=>part.type===type).value).join('-');
   return {key,date:instant.toLocaleDateString(locale(),{year:'numeric',month:'long',day:'numeric',timeZone:zone}),time:formatZonedTime(instant,zone,{hour:'numeric',minute:'2-digit'})};
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
// Keep country-view pins compact; enlarge gradually at closer zoom levels.
function travelIconScale(zoom){return 1+Math.max(0,Math.min(5,zoom-5))*0.25;}
function scaledTravelIcon(spec){
 const scale=travelIconScale(map.getZoom());
 const pair=value=>value.map(number=>number*scale);
 return L.icon({iconUrl:spec.url,iconSize:pair(spec.size),iconAnchor:pair(spec.anchor),popupAnchor:pair(spec.popup)});
}
function resizeTravelIcons(){
 for(const group of [locationLayers,layers])group.eachLayer(marker=>{
  if(marker.options.travelIconSpec)marker.setIcon(scaledTravelIcon(marker.options.travelIconSpec));
 });
}
map.on('zoomend',resizeTravelIcons);
const locationLayers=L.layerGroup().addTo(map);
const categories={parks:{name:'National parks',color:'#28633d'},nature:{name:'Nature & outdoors',color:'#2466a5'},cities:{name:'Cities & towns',color:'#7546b8'},landmarks:{name:'Landmarks & oddities',color:'#d0a42b'},people:{name:'People & celebrations',color:'#b53670'}};
const activeCategories=new Set(Object.keys(categories));
for(const [key,group] of [['all',{name:'All pins',color:'#64748b'}],['none',{name:'No pins',color:'#64748b'}],...Object.entries(categories)]){
 const label=document.createElement('label');label.style='display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer';
 const input=document.createElement('input');input.type='radio';input.name='location-category';input.checked=key==='all';input.value=key;input.style.accentColor=group.color;
 input.addEventListener('change',()=>{if(!input.checked)return;activeCategories.clear();(key==='all'?Object.keys(categories):key==='none'?[]:[key]).forEach(category=>activeCategories.add(category));drawLocations(monthSel.value);});
 const dot=document.createElement('span');dot.style='width:11px;height:11px;border-radius:50%;background:'+group.color;
 const text=document.createElement('span');text.className='category-label';text.style.minWidth='0';text.textContent=t(group.name);input.style.flexShrink='0';dot.style.flexShrink='0';
 label.append(input,dot,text);document.getElementById('category-options').appendChild(label);
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
let playbackVisitDate=null;
function visibleVisitDates(place,chosen){return place.dates.filter(date=>!hiddenHolidayDate(date)&&(chosen==='all'||date.startsWith(chosen))&&(!playbackVisitDate||date<=playbackVisitDate));}
document.getElementById('hide-holiday-trips').addEventListener('change',()=>draw(monthSel.value));
function compareVisitDates(chosen){
 const firstDate=place=>visibleVisitDates(place,chosen).sort()[0]||'9999-12-31';
 return (a,b)=>{
  if(a.id==='trip-start'&&b.id!=='trip-start')return -1;
  if(b.id==='trip-start'&&a.id!=='trip-start')return 1;
  return firstDate(a).localeCompare(firstDate(b))||((a.dateOrder||0)-(b.dateOrder||0))||a.name.localeCompare(b.name);
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
   const month=new Date(start+'T12:00:00Z').toLocaleDateString(locale(),{month:'long',timeZone:'UTC'});
   if(TravelI18n.language()==='fr')return Number(start.slice(8,10))+' - '+Number(end.slice(8,10))+' '+month+' '+start.slice(0,4);
   return TravelI18n.language()==='es'?Number(start.slice(8,10))+' - '+Number(end.slice(8,10))+' de '+month+' de '+start.slice(0,4):month+' '+Number(start.slice(8,10))+' - '+Number(end.slice(8,10))+', '+start.slice(0,4);
  }
  return formatRecordedTime(start)+' – '+formatRecordedTime(end);
 }).join('; ');
}
let placePhotoDialog;
function showPlacePhoto(place){
 if(!placePhotoDialog){
  placePhotoDialog=document.createElement('dialog');placePhotoDialog.className='place-photo-viewer';
  placePhotoDialog.addEventListener('click',event=>{if(event.target===placePhotoDialog)placePhotoDialog.close();});
  document.body.appendChild(placePhotoDialog);
 }
 const header=document.createElement('div');header.className='place-photo-header';
 const title=document.createElement('h2');title.id='place-photo-title';title.textContent=placeName(place.name);
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t('Close photo'));close.addEventListener('click',()=>placePhotoDialog.close());header.append(title,close);
 const image=document.createElement('img');image.src=place.photo;image.alt=place.photoAlt||placeName(place.name);
 placePhotoDialog.setAttribute('aria-labelledby','place-photo-title');placePhotoDialog.replaceChildren(header,image);placePhotoDialog.showModal();
}
function normalizeLocationSearch(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();}
function matchesLocationSearch(place,query){
 const name=normalizeLocationSearch(place.name+' '+placeName(place.name));
 return normalizeLocationSearch(query).split(/\s+/).every(term=>name.includes(term));
}
const locationSearch=document.getElementById('location-search');
locationSearch.addEventListener('input',()=>{
 drawLocations(monthSel.value);
});
function drawLocations(chosen){
 map.closePopup();locationLayers.clearLayers();const list=document.getElementById('location-list');list.replaceChildren();
 const available=[...visitedParks,...travelHighlights].filter(place=>(visibleVisitDates(place,chosen).length>0||(chosen==='all'&&!playbackVisitDate&&place.dates.length===0))&&matchesLocationSearch(place,locationSearch.value));
 const counts=Object.fromEntries(Object.keys(categories).map(key=>[key,0]));
 available.forEach(place=>{if(Object.hasOwn(counts,place.category))counts[place.category]++;});
 for(const label of document.querySelectorAll('#category-options label')){
  const key=label.querySelector('input').value;
  const name=t(key==='all'?'All pins':key==='none'?'No pins':categories[key].name);
  label.querySelector('.category-label').textContent=name+(key==='none'?'':' ('+(key==='all'?available.length:counts[key]).toLocaleString(locale())+')');
 }
 const places=available.filter(place=>activeCategories.has(place.category)).sort(compareVisitDates(chosen));
 if(!places.length){const empty=document.createElement('li');empty.textContent=activeCategories.size?t('No locations match these filters.'):t('Location pins hidden.');list.appendChild(empty);}
 for(const place of places){
  const dates=visibleVisitDates(place,chosen);
  const content=document.createElement('div');const heading=document.createElement('strong');heading.textContent=placeName(place.name);content.appendChild(heading);
  if(place.photo){const photoButton=document.createElement('button');photoButton.type='button';photoButton.className='place-photo-button';photoButton.setAttribute('aria-label',t('Open photo')+' · '+placeName(place.name));photoButton.addEventListener('click',()=>showPlacePhoto(place));const image=document.createElement('img');image.src=place.photo;image.alt=place.photoAlt||placeName(place.name);image.loading='lazy';image.className='place-photo';image.addEventListener('load',()=>{if(marker.isPopupOpen())marker.getPopup().update();});image.addEventListener('error',()=>photoButton.remove());photoButton.appendChild(image);content.appendChild(photoButton);if(place.photoSource){const source=document.createElement('a');source.href=place.photoSource;source.target='_blank';source.rel='noopener';source.textContent=t('Photo source');source.style='font-size:11px';content.appendChild(source);}}
  const date=document.createElement('p');date.textContent=dates.length?formatVisitRanges(dates):t('Date not recorded');content.appendChild(date);
  const url=place.url||(place.code?'https://www.nps.gov/'+(['sequ','kica'].includes(place.code)?'seki':place.code)+'/':null);
  if(url){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent=t('More information');content.appendChild(link);}
  const spec={url:place.icon,size:[32,38],anchor:place.iconAnchor?[place.iconAnchor[0]*32/42,38]:[16,38],popup:[16-(place.iconAnchor?place.iconAnchor[0]*32/42:16),-35]};
  const marker=L.marker(place.position,{icon:scaledTravelIcon(spec),travelIconSpec:spec,title:placeName(place.name),alt:placeName(place.name),riseOnHover:true}).bindPopup(content,{maxWidth:460,className:place.photo?'photo-popup':''}).addTo(locationLayers);
  const item=document.createElement('li');const button=document.createElement('button');button.type='button';button.style='background:none;border:0;padding:5px 0;text-align:left;font-size:14px';
  const dot=document.createElement('span');dot.style='display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px;background:'+categories[place.category].color;
  const name=document.createElement('span');name.textContent=placeName(place.name);const dateLabel=document.createElement('small');dateLabel.style='display:block;margin-left:17px;color:var(--sub)';dateLabel.textContent=dates.length?formatVisitRanges(dates):t('Date not recorded');button.append(dot,name,dateLabel);button.addEventListener('click',()=>{map.setView(place.position,9,{animate:false});marker.openPopup();});item.appendChild(button);list.appendChild(item);
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
 return map.distance(nearest.point,point)<75000?placeName(nearest.name):t('Unidentified location');
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
function railAt(start,end){
 const a=Date.parse(start),b=Date.parse(end);
 return (typeof railJourneys==='undefined'?[]:railJourneys).some(j=>a>=Date.parse(j.dates[0])&&b<=Date.parse(j.dates[1]));
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
let playbackSegments=[];
function draw(chosen){
 window.tripPlayback?.stop(false);
 playbackSegments=[];
 flights=allFlights.filter(f=>!hiddenHolidayConnection(f.dates));
 drawLocations(chosen);
 map.closePopup();layers.clearLayers();const bounds=[];
 const selected=m=>chosen==='all'||m===chosen;
 // Draw context first so the highlighted month stays on top.
 const ordered=[...months].sort((a,b)=>Number(selected(a))-Number(selected(b)));
 for(const m of ordered){
  const active=selected(m);
  for(const gap of (typeof routeBreaks==='undefined'?{}:routeBreaks)[m]||[]){
   if(hiddenHolidayConnection(gap.dates)||gapMatchesFlight(gap)||railAt(...gap.dates))continue;
   const content=document.createElement('div');content.textContent=formatConnectionTimes(gap.dates,gap.points)+' · '+t('Recording gap: actual route unknown.');
   L.polyline(gap.points,{color:transportColors.gap,weight:active?3:2,opacity:active?.65:.12,dashArray:'7 10'}).bindPopup(content).addTo(layers);
   if(active){bounds.push(...gap.points);playbackSegments.push({type:'gap',points:gap.points,dates:gap.dates});}
  }
  (paths[m]||[]).forEach((line,index)=>{
   const dates=typeof pathDates==='undefined'?[]:pathDates[m]?.[index]||[];
   // Split at explicit flight samples to avoid drawing them as ground travel.
   let segment=[],times=[];
   function flush(){if(segment.length>1){const points=segment,stamp=times;if(active)playbackSegments.push({type:'ground',points,dates:stamp});const route=L.polyline(points,{color:transportColors.ground,weight:active?5:2,opacity:active?.95:.14,smoothFactor:1}).addTo(layers);route.on('click',event=>showRouteDate(event,points,stamp));}segment=[];times=[];}
   for(let j=0;j<line.length;j++){
    if(hiddenHolidayDate(dates[j])){flush();continue;}
    if(j>0&&(flightAt(dates[j-1],dates[j])||railAt(dates[j-1],dates[j]))){flush();segment=[line[j]];times=[dates[j]];}
    else{segment.push(line[j]);times.push(dates[j]);}
   }
   flush();if(active){line.forEach((point,index)=>{if(!hiddenHolidayDate(dates[index])){bounds.push(point);}});}
  });
 }
 for(const [journeyIndex,journey] of (typeof railJourneys==='undefined'?[]:railJourneys).entries()){
  if(hiddenHolidayConnection(journey.dates))continue;
  const active=selected(journey.dates[0].slice(0,7)),points=[];
  for(const [month,lines] of Object.entries(paths))lines.forEach((line,index)=>{
   const stamps=pathDates[month][index];let section=[],sectionDates=[];
   function flush(){if(section.length>1){const copy=section,ds=sectionDates;if(active)playbackSegments.push({type:'rail',points:copy,dates:ds});L.polyline(copy,{color:transportColors.rail,weight:active?5:2,opacity:active?.95:.14}).on('click',event=>showRouteDate(event,copy,ds)).addTo(layers);}section=[];sectionDates=[];}
   line.forEach((point,j)=>{const t=Date.parse(stamps[j]);if(t>=Date.parse(journey.dates[0])&&t<=Date.parse(journey.dates[1])){section.push(point);sectionDates.push(stamps[j]);points.push(point);}else flush();});flush();
  });
  if(active&&points.length){
   const spec={url:'assets/icons/bullet-train.svg',size:[54,16],anchor:[27,8],popup:[0,-14]};
   const orderedPoints=[...points].sort((a,b)=>a[1]-b[1]);
   const iconPoint=orderedPoints[Math.floor((orderedPoints.length-1)*(journeyIndex%2===0?0.3:0.7))];
   const content=document.createElement('div');const title=document.createElement('strong');title.textContent=placeName(journey.name);content.appendChild(title);const time=document.createElement('p');time.textContent=formatConnectionTimes(journey.dates,[points[0],points[points.length-1]]);content.appendChild(time);
   L.marker(iconPoint,{icon:scaledTravelIcon(spec),travelIconSpec:spec,title:placeName(journey.name)}).bindPopup(content).addTo(layers);bounds.push(...points);
  }
 }
 for(const flight of flights)if(selected(flight.dates[0].slice(0,7)))playbackSegments.push({type:'flight',points:flight.points,dates:flight.dates});
 // Group complete itineraries, including layovers, and align repeated paths.
 const journeyGroups=[];
 for(const journey of buildFlightJourneys(flights)){
  const names=journey.points.map(flightCity),forward=names.join('|'),reverse=[...names].reverse().join('|');
  const canonical=forward<reverse?forward:reverse;
  let group=journeyGroups.find(g=>g.key===canonical);
  // Unidentified points should not collapse unrelated flight records.
  if(names.includes(t('Unidentified location')))group=null;
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
   L.marker(point,{icon:scaledTravelIcon({url:'assets/icons/plane.svg',size:[22,22],anchor:[11,11],popup:[0,-12]}),travelIconSpec:{url:'assets/icons/plane.svg',size:[22,22],anchor:[11,11],popup:[0,-12]},title:shown[0].points.map(flightCity).join(' → ')}).bindPopup(content.cloneNode(true)).addTo(layers);
   for(const location of group.points){const city=flightCity(location);if(labeledAirports.has(city))continue;labeledAirports.add(city);L.circleMarker(location,{radius:4,color:transportColors.flight,fillColor:'white',fillOpacity:1,weight:2}).addTo(layers);}
   bounds.push(...group.points);
  }
 }

 const countryBounds=countrySelect.value==='all'?[]:countryTripBounds(countrySelect.value,chosen,chosen==='all');
 if(countrySelect.value==='us'&&chosen==='all'){
  fitUSView();
 }
 else if(countryBounds.length)map.fitBounds(countryBounds,{padding:[35,35],maxZoom:10});
 else if(bounds.length)map.fitBounds(bounds,{padding:[30,30],maxZoom:chosen==='all'?5:9});
 window.tripPlayback?.updateMileage();
}
monthSel.addEventListener('change',()=>draw(monthSel.value));
function refreshLanguage(){
 setBasemapLanguage();
 TravelI18n.apply();
 for(const option of monthSel.options)option.textContent=option.value==='all'?t('Entire trip'):new Date(option.value+'-15T12:00:00Z').toLocaleString(locale(),{month:'long',year:'numeric',timeZone:'UTC'});
 for(const label of document.querySelectorAll('#category-options label')){
  const key=label.querySelector('input').value;label.querySelector('.category-label').textContent=t(key==='all'?'All pins':key==='none'?'No pins':categories[key].name);
 }
 const center=map.getCenter(),zoom=map.getZoom();draw(monthSel.value);map.setView(center,zoom);
}
window.addEventListener('languagechange',refreshLanguage);
TravelI18n.apply();
draw('all');

new ResizeObserver(()=>{
 map.invalidateSize();
 if(countrySelect.value==='us'&&monthSel.value==='all'&&!window.tripPlayback?.isActive())fitUSView();
}).observe(document.getElementById("map"));
