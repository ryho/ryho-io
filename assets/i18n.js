// Shared English, Spanish and French UI and editable place-name translations.
(()=>{
 const spanish={"ryho.io \u00b7 A work in progress. Map tiles \u00a9 OpenStreetMap contributors.":"ryho.io \u00b7 En desarrollo. Mapa \u00a9 colaboradores de OpenStreetMap.","Language":"Idioma","Travel Atlas": "Atlas de viajes", "← Home": "← Inicio", "On the road since July 22, 2025": "De viaje desde el 22 de julio de 2025", "Country:": "País:", "United States": "Estados Unidos", "Canada": "Canadá", "Japan": "Japón", "Nicaragua": "Nicaragua", "Entire trip": "Todo el viaje", "Month:": "Mes:", "Show Trips Back Home": "Mostrar viajes a casa", "Show locations": "Mostrar lugares", "Locations": "Lugares", "All pins": "Todos los pines", "No pins": "Sin pines", "National parks": "Parques nacionales", "Nature & outdoors": "Naturaleza y aire libre", "Cities & towns": "Ciudades y pueblos", "Landmarks & oddities": "Monumentos y curiosidades", "People & celebrations": "Familia y celebraciones", "Ground travel": "Viaje por tierra", "Flights": "Vuelos", "Bullet train": "Tren bala", "Missing data": "Datos faltantes", "Date unavailable": "Fecha no disponible", "Date not recorded": "Fecha no registrada", "Photo source": "Fuente de la foto", "More information": "Más información", "No locations match these filters.": "No hay lugares que coincidan con estos filtros.", "Location pins hidden.": "Pines ocultos.", "Unidentified location": "Lugar sin identificar", "Recording gap: actual route unknown.": "Datos faltantes: recorrido desconocido.", "Selected month highlighted": "Mes seleccionado resaltado", "Click a route for dates": "Haz clic en una ruta para ver las fechas", "route points": "puntos de ruta", "locations": "lugares", "this month": "este mes", "About": "Acerca de mí", "Explore the travel map →": "Explorar el mapa de viajes →", "Taking the long way home.": "Tomando el camino largo a casa.", "Building systems.": "Construyendo sistemas.", "Travel stories": "Historias de viaje", "Engineering notes": "Notas de ingeniería", "Projects": "Proyectos", "Engineering · Exploring · Learning": "Ingeniería · Exploración · Aprendizaje", "Explore the places, national parks, and routes from our travels since July 22, 2025.": "Explora los lugares, parques nacionales y rutas de nuestros viajes desde el 22 de julio de 2025.", "Distributed systems": "Sistemas distribuidos", "Databases": "Bases de datos", "Travel": "Viajes", "Occasional writing": "Escritos ocasionales", "I'm a backend and distributed systems engineer who spent a decade building software at Square, then traded the desk for a year on the road. This is a home for things I'm building, places I've been, and what I'm learning along the way.": "Soy ingeniero de backend y sistemas distribuidos. Pasé una década creando software en Square y luego cambié el escritorio por un año de viaje. Aquí comparto lo que construyo, los lugares que visito y lo que aprendo por el camino.", "Photos and short dispatches from the road. Coming soon.": "Fotos y relatos breves del viaje. Próximamente.", "Storage, distributed systems, databases and new experiments. Coming soon.": "Almacenamiento, sistemas distribuidos, bases de datos y nuevos experimentos. Próximamente.", "Small tools, visualizations and things worth tinkering with. Coming soon.": "Herramientas, visualizaciones y proyectos para experimentar. Próximamente."};
 Object.assign(spanish,{"Résumé":"Currículum"});
 const french={
  "Language": "Langue",
  "Travel Atlas": "Atlas de voyage",
  "← Home": "← Accueil",
  "On the road since July 22, 2025": "En voyage depuis le 22 juillet 2025",
  "Country:": "Pays :",
  "United States": "États-Unis",
  "Canada": "Canada",
  "Japan": "Japon",
  "Nicaragua": "Nicaragua",
  "Entire trip": "Tout le voyage",
  "Month:": "Mois :",
  "Show Trips Back Home": "Afficher les retours à la maison",
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
  "ryho.io · A work in progress. Map tiles © OpenStreetMap contributors.": "ryho.io · En cours de création. Carte © contributeurs OpenStreetMap."
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
 Object.assign(spanish,{'Experience building systems.':'Experiencia construyendo sistemas.','Read about my work in backend engineering and distributed systems, or download my résumé.':'Conoce mi trabajo en ingeniería backend y sistemas distribuidos, o descarga mi currículum.','View my résumé →':'Ver mi currículum →','Download résumé (PDF)':'Descargar currículum (PDF)','Open PDF in a new tab':'Abrir PDF en una pestaña nueva','Your browser cannot display this PDF inline.':'Tu navegador no puede mostrar este PDF aquí.'});
 Object.assign(french,{'Experience building systems.':'Mon expérience en conception de systèmes.','Read about my work in backend engineering and distributed systems, or download my résumé.':'Découvrez mon travail en ingénierie backend et en systèmes distribués, ou téléchargez mon CV.','View my résumé →':'Voir mon CV →','Download résumé (PDF)':'Télécharger le CV (PDF)','Open PDF in a new tab':'Ouvrir le PDF dans un nouvel onglet','Your browser cannot display this PDF inline.':'Votre navigateur ne peut pas afficher ce PDF ici.'});
 Object.assign(spanish,{"A little about us.": "Un poco sobre nosotros.", "I'm Ryan Hollis, a backend and distributed systems engineer from Mississippi, living in Atlanta. My wife, Cristhiam Torrez, is from Nicaragua.": "Soy Ryan Hollis, ingeniero de backend y sistemas distribuidos, originario de Misisipi y residente en Atlanta. Mi esposa, Cristhiam Torrez, es de Nicaragua.", "We married on April 26, 2025. After the wedding, we took an extended honeymoon on the road, traveling with our dog, Bento.": "Nos casamos el 26 de abril de 2025. Después de la boda, emprendimos una larga luna de miel por carretera con nuestro perro, Bento.", "Our home on the road": "Nuestro hogar sobre ruedas", "We renovated our camper and equipped it with solar panels and an off-grid electrical system. That let us spend more time away from hookups, with the flexibility to stay close to the places we wanted to explore.": "Renovamos nuestra casa rodante y la equipamos con paneles solares y un sistema eléctrico autónomo. Así pudimos pasar más tiempo sin conexiones eléctricas y quedarnos cerca de los lugares que queríamos explorar.", "We often chose dispersed camping in national forests near the national parks we visited. The camper was our base for hiking, exploring, and everyday life between stops—with Bento along for the journey.": "A menudo acampábamos fuera de los campamentos establecidos, en bosques nacionales cerca de los parques nacionales que visitábamos. La casa rodante era nuestra base para caminar, explorar y vivir el día a día entre destinos, con Bento acompañándonos.", "What comes next": "Lo que viene", "We're open to relocating for our next roles. Atlanta has been home, but we're excited to see where the right opportunity takes us next.": "Estamos abiertos a mudarnos por nuestras próximas oportunidades laborales. Atlanta ha sido nuestro hogar, pero nos ilusiona descubrir adónde nos llevará la oportunidad adecuada.", "Ryan, Cristhiam, and Bento at the start of the trip.": "Ryan, Cristhiam y Bento al comienzo del viaje."});
 Object.assign(french,{"A little about us.": "Un peu de nous.", "I'm Ryan Hollis, a backend and distributed systems engineer from Mississippi, living in Atlanta. My wife, Cristhiam Torrez, is from Nicaragua.": "Je suis Ryan Hollis, ingénieur backend et systèmes distribués, originaire du Mississippi et installé à Atlanta. Ma femme, Cristhiam Torrez, est originaire du Nicaragua.", "We married on April 26, 2025. After the wedding, we took an extended honeymoon on the road, traveling with our dog, Bento.": "Nous nous sommes mariés le 26 avril 2025. Après le mariage, nous sommes partis pour une longue lune de miel sur la route avec notre chien, Bento.", "Our home on the road": "Notre maison sur la route", "We renovated our camper and equipped it with solar panels and an off-grid electrical system. That let us spend more time away from hookups, with the flexibility to stay close to the places we wanted to explore.": "Nous avons rénové notre caravane et installé des panneaux solaires et un système électrique autonome. Cela nous a permis de passer plus de temps sans branchement électrique et de rester près des endroits que nous voulions explorer.", "We often chose dispersed camping in national forests near the national parks we visited. The camper was our base for hiking, exploring, and everyday life between stops—with Bento along for the journey.": "Nous faisions souvent du camping dispersé dans les forêts nationales près des parcs nationaux que nous visitions. La caravane était notre point de départ pour randonner, explorer et vivre au quotidien entre les étapes, avec Bento à nos côtés.", "What comes next": "La suite", "We're open to relocating for our next roles. Atlanta has been home, but we're excited to see where the right opportunity takes us next.": "Nous sommes ouverts à déménager pour nos prochains postes. Atlanta a été notre chez-nous, mais nous avons hâte de découvrir où la bonne opportunité nous mènera.", "Ryan, Cristhiam, and Bento at the start of the trip.": "Ryan, Cristhiam et Bento au début du voyage."});
 Object.assign(spanish,{"Meet our little travel crew.": "Conoce a nuestro pequeño equipo viajero.", "A little about Cristhiam, Bento, and me—our backgrounds, our solar-powered camper, and life on the road together.": "Un poco sobre Cristhiam, Bento y yo: nuestras raíces, nuestra casa rodante con energía solar y nuestra vida juntos en la carretera.", "More about us →": "Más sobre nosotros →"});
 Object.assign(french,{"Meet our little travel crew.": "Rencontrez notre petite équipe de voyage.", "A little about Cristhiam, Bento, and me—our backgrounds, our solar-powered camper, and life on the road together.": "Quelques mots sur Cristhiam, Bento et moi : nos origines, notre caravane à énergie solaire et notre vie ensemble sur la route.", "More about us →": "En savoir plus sur nous →"});
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
