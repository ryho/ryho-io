// Shared English, Spanish and French UI and editable place-name translations.
(()=>{
 const spanish={"ryho.io \u00b7 A work in progress. Location data has been deliberately reduced in precision for public viewing. Map tiles \u00a9 OpenStreetMap contributors.":"ryho.io \u00b7 En desarrollo. La precisi\u00f3n de las ubicaciones se ha reducido para su publicaci\u00f3n. Mapa \u00a9 colaboradores de OpenStreetMap.","Language":"Idioma","Travel atlas": "Atlas de viajes", "← Home": "← Inicio", "On the road since July 22, 2025": "De viaje desde el 22 de julio de 2025", "Country:": "País:", "United States": "Estados Unidos", "Canada": "Canadá", "Japan": "Japón", "Nicaragua": "Nicaragua", "Entire trip": "Todo el viaje", "Month:": "Mes:", "Show Trips Home": "Mostrar viajes a casa", "Show locations": "Mostrar lugares", "Locations": "Lugares", "All pins": "Todos los pines", "No pins": "Sin pines", "National parks": "Parques nacionales", "Nature & outdoors": "Naturaleza y aire libre", "Cities & towns": "Ciudades y pueblos", "Landmarks & oddities": "Monumentos y curiosidades", "People & celebrations": "Familia y celebraciones", "Ground travel": "Viaje por tierra", "Flights": "Vuelos", "Bullet train": "Tren bala", "Missing data": "Datos faltantes", "Date unavailable": "Fecha no disponible", "Date not recorded": "Fecha no registrada", "Photo source": "Fuente de la foto", "More information": "Más información", "No locations match these filters.": "No hay lugares que coincidan con estos filtros.", "Location pins hidden.": "Pines ocultos.", "Unidentified location": "Lugar sin identificar", "Recording gap: actual route unknown.": "Datos faltantes: recorrido desconocido.", "Selected month highlighted": "Mes seleccionado resaltado", "Click a route for dates": "Haz clic en una ruta para ver las fechas", "route points": "puntos de ruta", "locations": "lugares", "this month": "este mes", "About": "Acerca de mí", "Explore the travel map →": "Explorar el mapa de viajes →", "Taking the long way home.": "Tomando el camino largo a casa.", "Building systems.": "Construyendo sistemas.", "Travel stories": "Historias de viaje", "Engineering notes": "Notas de ingeniería", "Projects": "Proyectos", "Engineering · Exploring · Learning": "Ingeniería · Exploración · Aprendizaje", "Explore the places, national parks, and routes from our travels since July 22, 2025.": "Explora los lugares, parques nacionales y rutas de nuestros viajes desde el 22 de julio de 2025.", "Distributed systems": "Sistemas distribuidos", "Databases": "Bases de datos", "Travel": "Viajes", "Occasional writing": "Escritos ocasionales", "I'm a backend and distributed systems engineer who spent a decade building software at Square, then traded the desk for a year on the road. This is a home for things I'm building, places I've been, and what I'm learning along the way.": "Soy ingeniero de backend y sistemas distribuidos. Pasé una década creando software en Square y luego cambié el escritorio por un año de viaje. Aquí comparto lo que construyo, los lugares que visito y lo que aprendo por el camino.", "Photos and short dispatches from the road. Coming soon.": "Fotos y relatos breves del viaje. Próximamente.", "Storage, distributed systems, databases and new experiments. Coming soon.": "Almacenamiento, sistemas distribuidos, bases de datos y nuevos experimentos. Próximamente.", "Small tools, visualizations and things worth tinkering with. Coming soon.": "Herramientas, visualizaciones y proyectos para experimentar. Próximamente."};
 Object.assign(spanish,{"Résumé":"Currículum"});
 const french={
  "Language": "Langue",
  "Travel atlas": "Atlas de voyage",
  "← Home": "← Accueil",
  "On the road since July 22, 2025": "En voyage depuis le 22 juillet 2025",
  "Country:": "Pays :",
  "United States": "États-Unis",
  "Canada": "Canada",
  "Japan": "Japon",
  "Nicaragua": "Nicaragua",
  "Entire trip": "Tout le voyage",
  "Month:": "Mois :",
  "Show Trips Home": "Afficher les retours à la maison",
  "Show locations": "Afficher les lieux",
  "Locations": "Lieux",
  "All pins": "Tous les repères",
  "No pins": "Sans repères",
  "National parks": "Parcs nationaux",
  "Nature & outdoors": "Nature et plein air",
  "Cities & towns": "Villes et villages",
  "Landmarks & oddities": "Sites et curiosités",
  "People & celebrations": "Famille et fêtes",
  "Ground travel": "Trajets terrestres",
  "Flights": "Vols",
  "Bullet train": "Train à grande vitesse",
  "Missing data": "Données manquantes",
  "Date unavailable": "Date indisponible",
  "Date not recorded": "Date non enregistrée",
  "Photo source": "Source de la photo",
  "More information": "En savoir plus",
  "No locations match these filters.": "Aucun lieu ne correspond à ces filtres.",
  "Location pins hidden.": "Repères masqués.",
  "Unidentified location": "Lieu non identifié",
  "Recording gap: actual route unknown.": "Données manquantes : itinéraire réel inconnu.",
  "Selected month highlighted": "Mois sélectionné en surbrillance",
  "Click a route for dates": "Cliquez sur un trajet pour voir les dates",
  "route points": "points du parcours",
  "locations": "lieux",
  "this month": "ce mois-ci",
  "About": "À propos",
  "Explore the travel map →": "Explorer la carte du voyage →",
  "Taking the long way home.": "Prendre le chemin des écoliers.",
  "Building systems.": "Concevoir des systèmes.",
  "Travel stories": "Récits de voyage",
  "Engineering notes": "Notes techniques",
  "Projects": "Projets",
  "Engineering · Exploring · Learning": "Concevoir · Explorer · Apprendre",
  "Explore the places, national parks, and routes from our travels since July 22, 2025.": "Découvrez les lieux, les parcs nationaux et les itinéraires de nos voyages depuis le 22 juillet 2025.",
  "Distributed systems": "Systèmes distribués",
  "Databases": "Bases de données",
  "Travel": "Voyages",
  "Occasional writing": "Quelques écrits",
  "I'm a backend and distributed systems engineer who spent a decade building software at Square, then traded the desk for a year on the road. This is a home for things I'm building, places I've been, and what I'm learning along the way.": "Ingénieur en développement backend et en systèmes distribués, j’ai passé dix ans à créer des logiciels chez Square, puis j’ai quitté mon bureau pour une année de voyage. Ici, je partage mes projets, les lieux que j’ai visités et ce que j’apprends en chemin.",
  "Photos and short dispatches from the road. Coming soon.": "Photos et petits récits de voyage. Bientôt.",
  "Storage, distributed systems, databases and new experiments. Coming soon.": "Stockage, systèmes distribués, bases de données et nouvelles expériences. Bientôt.",
  "Small tools, visualizations and things worth tinkering with. Coming soon.": "Petits outils, visualisations et projets à explorer. Bientôt.",
  "ryho.io · A work in progress. Location data has been deliberately reduced in precision for public viewing. Map tiles © OpenStreetMap contributors.": "ryho.io · En cours de création. La précision des données de localisation a été volontairement réduite pour leur publication. Carte © contributeurs OpenStreetMap."
};
 Object.assign(spanish,{'▶ Play trip':'▶ Reproducir viaje','Ⅱ Pause trip':'Ⅱ Pausar viaje','▶ Resume trip':'▶ Continuar viaje','↺ Replay trip':'↺ Repetir viaje','■ Stop trip':'■ Detener viaje','Progress':'Progreso','Speed':'Velocidad','Follow vehicle':'Seguir vehículo','Trip complete':'Viaje terminado','No route to play.':'No hay ruta para reproducir.'});
 Object.assign(french,{'▶ Play trip':'▶ Revoir le voyage','Ⅱ Pause trip':'Ⅱ Mettre en pause','▶ Resume trip':'▶ Reprendre','↺ Replay trip':'↺ Revoir le voyage','■ Stop trip':'■ Arrêter','Progress':'Progression','Speed':'Vitesse','Follow vehicle':'Suivre le véhicule','Trip complete':'Voyage terminé','No route to play.':'Aucun trajet à lire.'});
 Object.assign(french,{'Résumé':'CV'});
 Object.assign(spanish,{'Region:':'Región:','Hawaii':'Hawái','World':'Mundo','Southwest US':'Suroeste de EE. UU.','Northwest US':'Noroeste de EE. UU.','Upper Midwest US':'Medio Oeste norte de EE. UU.'});
 Object.assign(french,{'Region:':'Région :','Hawaii':'Hawaï','World':'Monde','Southwest US':'Sud-Ouest des États-Unis','Northwest US':'Nord-Ouest des États-Unis','Upper Midwest US':'Haut Midwest des États-Unis'});
 Object.assign(spanish,{'Open photo':'Ampliar foto','Close photo':'Cerrar foto'});
 Object.assign(french,{'Open photo':'Agrandir la photo','Close photo':'Fermer la photo'});
 Object.assign(spanish,{'Miles traveled':'Millas recorridas','Includes ground travel, flights and trains; excludes missing-data connections.':'Incluye viajes por tierra, vuelos y trenes; excluye las conexiones sin datos.'});
 Object.assign(french,{'Miles traveled':'Miles parcourus','Includes ground travel, flights and trains; excludes missing-data connections.':'Comprend les trajets terrestres, les vols et les trains ; exclut les liaisons sans données.'});
 Object.assign(spanish,{'On the road July 22, 2025 to October 9, 2026':'De viaje del 22 de julio de 2025 al 9 de octubre de 2026'});
 Object.assign(french,{'On the road July 22, 2025 to October 9, 2026':'En voyage du 22 juillet 2025 au 9 octobre 2026'});
 Object.assign(spanish,{'Search locations':'Buscar lugares','Name or place…':'Nombre o lugar…'});
 Object.assign(french,{'Search locations':'Rechercher un lieu','Name or place…':'Nom ou lieu…'});
 const dictionaries={en:{},es:spanish,fr:french};
 // Follow the browser's ordered preferences until the visitor chooses a language.
 const browserLanguages=navigator.languages?.length?navigator.languages:[navigator.language||'en'];
 let language=browserLanguages.map(value=>value.toLowerCase().split(/[-_]/)[0]).find(value=>Object.hasOwn(dictionaries,value))||'en';
 try{const saved=localStorage.getItem('ryho-language');if(Object.hasOwn(dictionaries,saved))language=saved;}catch(error){}
 const t=text=>dictionaries[language][text]||text;
 function apply(){document.documentElement.lang=language;document.querySelectorAll('[data-i18n-placeholder]').forEach(node=>node.placeholder=t(node.dataset.i18nPlaceholder));document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll('[data-language-select]').forEach(select=>select.value=language);}
 const placeName=text=>({es:window.spanishPlaceNames,fr:window.frenchPlaceNames}[language]?.[text]||text);
 window.TravelI18n={t,placeName,locale:()=>({en:'en-US',es:'es',fr:'fr-FR'}[language]),language:()=>language,apply};
 document.addEventListener('DOMContentLoaded',()=>{apply();document.querySelectorAll('[data-language-select]').forEach(select=>select.addEventListener('change',()=>{language=select.value;try{localStorage.setItem('ryho-language',language);}catch(error){}apply();window.dispatchEvent(new Event('languagechange'));}));});
})();
