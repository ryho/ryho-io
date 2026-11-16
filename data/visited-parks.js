// Inferred from generated route points inside official NPS administrative boundaries. Review possible drive-throughs.
const visitedParks= [
  {
    "code": "neri",
    "name": "New River Gorge National Park and Preserve, West Virginia",
    "position": [
      38.0708,
      -81.0757
    ],
    "dates": [
      "2025-07-24",
      "2025-07-25",
      "2025-07-26",
      "2025-07-27",
      "2025-07-28",
      "2025-07-29",
      "2025-07-30",
      "2025-07-31"
    ],
    "status": "Confirmed visit",
    "confirmedByUser": true,
    "url": "https://www.nps.gov/neri/index.htm",
    "icon": "assets/icons/highlights/new-river-gorge.svg",
    "iconDescription": "New River Gorge Bridge",
    "category": "parks",
    "stateLabel": "West Virginia",
    "photo": "assets/photos/new-river-gorge.jpg",
    "photoAlt": "At the New River Gorge Bridge overlook with our dog",
    "photoFit": "contain"
  },
  {
    "code": "thro",
    "name": "Theodore Roosevelt National Park, North Dakota",
    "position": [
      46.933157,
      -103.389214
    ],
    "dates": [
      "2025-08-19",
      "2025-08-20",
      "2025-08-21",
      "2025-08-22"
    ],
    "samples": 88,
    "status": "Confirmed visit",
    "photo": "assets/photos/theodore-roosevelt.jpg",
    "icon": "assets/icons/parks/thro.svg",
    "iconDescription": "badlands",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "North Dakota",
    "photoAlt": "Wildflowers and badlands at sunset in Theodore Roosevelt National Park",
    "photoFit": "contain"
  },
  {
    "code": "badl",
    "name": "Badlands National Park, South Dakota",
    "position": [
      43.76612,
      -101.927009
    ],
    "dates": [
      "2025-08-23"
    ],
    "samples": 6,
    "status": "Confirmed visit",
    "photo": "assets/photos/badlands.jpg",
    "icon": "assets/icons/parks/badl.svg",
    "iconDescription": "badlands",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "South Dakota",
    "photoAlt": "Layered ridges and eroded rock formations in Badlands National Park",
    "photoFit": "contain"
  },
  {
    "code": "glac",
    "name": "Glacier National Park, Montana",
    "position": [
      48.739498,
      -113.436801
    ],
    "dates": [
      "2025-09-01",
      "2025-09-02",
      "2025-09-03",
      "2025-09-04",
      "2025-09-05",
      "2025-09-06",
      "2025-09-07",
      "2026-07-31",
      "2026-08-01",
      "2026-08-02",
      "2026-08-03"
    ],
    "samples": 79,
    "status": "Confirmed visit",
    "photo": "assets/photos/glacier.jpg",
    "icon": "assets/icons/parks/glac.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "dateSource": "Visit ranges corrected by traveler",
    "category": "parks",
    "stateLabel": "Montana",
    "photoAlt": "An alpine lake framed by mountains, evergreen forest and a green meadow in Glacier National Park",
    "photoFit": "contain"
  },
  {
    "code": "crla",
    "name": "Crater Lake National Park, Oregon",
    "position": [
      42.920335,
      -122.16237
    ],
    "dates": [
      "2025-09-11",
      "2025-09-12"
    ],
    "samples": 6,
    "status": "Confirmed visit",
    "photo": "assets/photos/crater-lake.jpg",
    "icon": "assets/icons/parks/crla.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Oregon",
    "photoAlt": "Wizard Island in Crater Lake beneath clouds and blue sky",
    "photoFit": "contain"
  },
  {
    "code": "yell",
    "name": "Yellowstone National Park, Wyoming, Montana & Idaho",
    "position": [
      44.699879,
      -110.504965
    ],
    "dates": [
      "2025-09-28",
      "2025-09-29",
      "2025-09-30",
      "2025-10-01",
      "2025-10-02"
    ],
    "samples": 145,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/22D0798C-F552-D488-C5047B379DB6005C.jpg",
    "photoSource": "https://www.nps.gov/yell/index.htm",
    "icon": "assets/icons/parks/yell.svg",
    "iconDescription": "geyser",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Wyoming, Montana & Idaho"
  },
  {
    "code": "grte",
    "name": "Grand Teton National Park, Wyoming",
    "position": [
      43.641951,
      -110.623399
    ],
    "dates": [
      "2025-10-02",
      "2025-10-03",
      "2025-10-05",
      "2025-10-07"
    ],
    "samples": 150,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/B3CF0402-0C72-2247-816D63B41D1B3300.jpg",
    "photoSource": "https://www.nps.gov/grte/index.htm",
    "icon": "assets/icons/parks/grte.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Wyoming"
  },
  {
    "code": "zion",
    "name": "Zion National Park, Utah",
    "position": [
      37.1999,
      -112.9883
    ],
    "dates": [
      "2025-10-18",
      "2025-10-19",
      "2025-10-21",
      "2025-10-22",
      "2025-10-23",
      "2025-10-24",
      "2025-10-25",
      "2025-10-26",
      "2025-10-27",
      "2025-10-28"
    ],
    "samples": 115,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/81F47385-CF2C-7006-04CDA857AF81F98A.jpg",
    "photoSource": "https://www.nps.gov/zion/index.htm",
    "icon": "assets/icons/parks/zion.svg",
    "iconDescription": "cliff",
    "confirmedByUser": true,
    "markerLocation": "South entrance near Springdale",
    "category": "parks",
    "stateLabel": "Utah"
  },
  {
    "code": "brca",
    "name": "Bryce Canyon National Park, Utah",
    "position": [
      37.673671,
      -112.112656
    ],
    "dates": [
      "2025-11-02",
      "2025-11-03",
      "2025-11-04",
      "2025-11-05",
      "2025-11-06"
    ],
    "samples": 220,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/1DB59E1B-A974-0512-565535214BD62FD1.jpg",
    "photoSource": "https://www.nps.gov/brca/index.htm",
    "icon": "assets/icons/parks/brca.svg",
    "iconDescription": "cliff",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Utah"
  },
  {
    "code": "care",
    "name": "Capitol Reef National Park, Utah",
    "position": [
      38.320576,
      -111.318522
    ],
    "dates": [
      "2025-11-06",
      "2025-11-07",
      "2025-11-08",
      "2025-11-09",
      "2025-11-10",
      "2025-11-11",
      "2025-11-12"
    ],
    "samples": 178,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/4278897C-E561-2333-807608024BC97BFB.jpg",
    "photoSource": "https://www.nps.gov/care/index.htm",
    "icon": "assets/icons/parks/care.svg",
    "iconDescription": "canyon",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Utah"
  },
  {
    "code": "arch",
    "name": "Arches National Park, Utah",
    "position": [
      38.692095,
      -109.545181
    ],
    "dates": [
      "2025-11-18",
      "2025-11-19",
      "2025-11-20",
      "2025-11-21",
      "2025-11-23",
      "2025-11-24"
    ],
    "samples": 57,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/0A1D8E19-EC46-C240-E108559CE8609123.jpg",
    "photoSource": "https://www.nps.gov/arch/index.htm",
    "icon": "assets/icons/parks/arch.svg",
    "iconDescription": "sandstone arch",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Utah"
  },
  {
    "code": "cany",
    "name": "Canyonlands National Park, Utah",
    "position": [
      38.18,
      -109.79
    ],
    "dates": [
      "2025-11-23"
    ],
    "status": "Confirmed visit",
    "confirmedByUser": true,
    "url": "https://www.nps.gov/cany/index.htm",
    "icon": "assets/icons/parks/cany.svg",
    "iconDescription": "layered red-rock canyons",
    "category": "parks",
    "stateLabel": "Utah"
  },
  {
    "code": "jotr",
    "name": "Joshua Tree National Park, California",
    "position": [
      34.002011,
      -116.08518
    ],
    "dates": [
      "2025-12-10",
      "2025-12-11",
      "2025-12-12",
      "2025-12-13",
      "2025-12-15"
    ],
    "samples": 89,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/C8E386CA-E68F-E483-2C9C8C50BA8B4DEE.jpg",
    "photoSource": "https://www.nps.gov/jotr/index.htm",
    "icon": "assets/icons/parks/jotr.svg",
    "iconDescription": "cactus",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "deva",
    "name": "Death Valley National Park, California & Nevada",
    "position": [
      36.347357,
      -116.699709
    ],
    "dates": [
      "2025-12-16",
      "2025-12-17",
      "2025-12-18",
      "2025-12-19",
      "2025-12-20",
      "2025-12-21",
      "2026-01-03",
      "2026-01-04"
    ],
    "samples": 541,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/8A274E4D-C9F5-C45C-4AB2CDD4FA838583.jpg",
    "photoSource": "https://www.nps.gov/deva/index.htm",
    "icon": "assets/icons/parks/deva.svg",
    "iconDescription": "dunes",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California & Nevada"
  },
  {
    "code": "grca",
    "name": "Grand Canyon National Park, Arizona",
    "position": [
      36.051551,
      -112.12189
    ],
    "dates": [
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
      "2026-01-10",
      "2026-01-11",
      "2026-01-12",
      "2026-01-17",
      "2026-01-19",
      "2026-03-20",
      "2026-03-21"
    ],
    "samples": 361,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/99556161-1DD8-B71B-0B896E4D786C6B47.jpg",
    "photoSource": "https://www.nps.gov/grca/index.htm",
    "icon": "assets/icons/parks/grca.svg",
    "iconDescription": "canyon",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Arizona"
  },
  {
    "code": "pefo",
    "name": "Petrified Forest National Park, Arizona",
    "position": [
      34.936608,
      -109.781031
    ],
    "dates": [
      "2026-01-26",
      "2026-01-27",
      "2026-01-28"
    ],
    "samples": 119,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/150EC131-05BF-1222-9FA407EC6101A8B7.jpg",
    "photoSource": "https://www.nps.gov/pefo/index.htm",
    "icon": "assets/icons/parks/pefo.svg",
    "iconDescription": "badlands",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Arizona"
  },
  {
    "code": "meve",
    "name": "Mesa Verde National Park, Colorado",
    "position": [
      37.294893,
      -108.441235
    ],
    "dates": [
      "2026-02-01",
      "2026-02-02"
    ],
    "samples": 119,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/E06DAC3A-F89E-05AC-8383F3AF5699EBB8.jpg",
    "photoSource": "https://www.nps.gov/meve/index.htm",
    "icon": "assets/icons/parks/meve.svg",
    "iconDescription": "cliff",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Colorado"
  },
  {
    "code": "grsa",
    "name": "Great Sand Dunes National Park, Colorado",
    "position": [
      37.750188,
      -105.52403
    ],
    "dates": [
      "2026-02-17",
      "2026-02-18",
      "2026-02-19"
    ],
    "samples": 56,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/40B6A775-D31E-2E17-A3D01E8D5D05BFD5.jpeg",
    "photoSource": "https://www.nps.gov/grsa/index.htm",
    "icon": "assets/icons/parks/grsa.svg",
    "iconDescription": "dunes",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Colorado"
  },
  {
    "code": "cave",
    "name": "Carlsbad Caverns National Park, New Mexico",
    "position": [
      32.19,
      -104.46
    ],
    "dates": [
      "2026-02-26",
      "2026-02-27"
    ],
    "samples": 48,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/07CA762D-1DD8-B71B-0B5263929F1AEAC2.jpg",
    "photoSource": "https://www.nps.gov/cave/index.htm",
    "icon": "assets/icons/parks/cave.svg",
    "iconDescription": "cave",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "New Mexico"
  },
  {
    "code": "gumo",
    "name": "Guadalupe Mountains National Park, Texas",
    "position": [
      31.916168,
      -104.800783
    ],
    "dates": [
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02"
    ],
    "samples": 128,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/80E2D888-F25A-75F0-639ADEB893018593.jpg",
    "photoSource": "https://www.nps.gov/gumo/index.htm",
    "icon": "assets/icons/parks/gumo.svg",
    "iconDescription": "cliff",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Texas"
  },
  {
    "code": "whsa",
    "name": "White Sands National Park, New Mexico",
    "position": [
      32.820707,
      -106.272403
    ],
    "dates": [
      "2026-03-03",
      "2026-03-04"
    ],
    "samples": 125,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/A16AAF73-C278-1129-5EB3056BED7BA85C.jpg",
    "photoSource": "https://www.nps.gov/whsa/index.htm",
    "icon": "assets/icons/parks/whsa.svg",
    "iconDescription": "dunes",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "New Mexico"
  },
  {
    "code": "chis",
    "name": "Channel Islands National Park, California",
    "position": [
      34.047551,
      -119.552286
    ],
    "dates": [
      "2026-03-08",
      "2026-03-09",
      "2026-03-10"
    ],
    "samples": 2,
    "status": "Confirmed visit",
    "confirmedByUser": true,
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/8B1831DF-1DD8-B71B-0BF9865C590EE5A5.jpg",
    "photoSource": "https://www.nps.gov/chis/index.htm",
    "icon": "assets/icons/parks/chis.svg",
    "iconDescription": "island",
    "category": "parks",
    "stateLabel": "California",
    "dateSource": "Visit dates corrected by traveler"
  },
  {
    "code": "sagu",
    "name": "Saguaro National Park, Arizona",
    "position": [
      32.285156,
      -111.185961
    ],
    "dates": [
      "2026-03-25",
      "2026-03-26",
      "2026-03-27",
      "2026-03-28"
    ],
    "samples": 230,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/imr/homepage/C8CFB083-A621-98AC-1D209ADD6F75CE6E.jpg",
    "photoSource": "https://www.nps.gov/sagu/index.htm",
    "icon": "assets/icons/parks/sagu.svg",
    "iconDescription": "cactus",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Arizona"
  },
  {
    "code": "kica",
    "name": "Kings Canyon National Park, California",
    "position": [
      36.74639,
      -118.973169
    ],
    "dates": [
      "2026-04-17",
      "2026-04-18",
      "2026-04-25",
      "2026-04-26",
      "2026-04-27",
      "2026-04-28"
    ],
    "samples": 148,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/14B0FC86-DB98-FED5-4605BEDEEB487B7B.jpg",
    "photoSource": "https://www.nps.gov/seki/index.htm",
    "icon": "assets/icons/parks/kica.svg",
    "iconDescription": "towering forest",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "yose",
    "name": "Yosemite National Park, California",
    "position": [
      37.753016,
      -119.542506
    ],
    "dates": [
      "2026-04-19",
      "2026-04-20",
      "2026-04-21",
      "2026-04-22",
      "2026-04-23",
      "2026-04-24"
    ],
    "samples": 251,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/36C683FE-1DD8-B71B-0B6B4AE9C34946B8.jpg",
    "photoSource": "https://www.nps.gov/yose/index.htm",
    "icon": "assets/icons/parks/yose.svg",
    "iconDescription": "Half Dome",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "sequ",
    "name": "Sequoia National Park, California",
    "position": [
      36.607939,
      -118.77575
    ],
    "dates": [
      "2026-04-25",
      "2026-04-26",
      "2026-04-27"
    ],
    "samples": 116,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/14B0FC86-DB98-FED5-4605BEDEEB487B7B.jpg",
    "photoSource": "https://www.nps.gov/seki/index.htm",
    "icon": "assets/icons/parks/sequ.svg",
    "iconDescription": "towering forest",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "lavo",
    "name": "Lassen Volcanic National Park, California",
    "position": [
      40.515228,
      -121.465163
    ],
    "dates": [
      "2026-05-15",
      "2026-05-16"
    ],
    "samples": 39,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/4092E028-988D-C75D-56E62D51A83D26C7.jpg",
    "photoSource": "https://www.nps.gov/lavo/index.htm",
    "icon": "assets/icons/parks/lavo.svg",
    "iconDescription": "volcano",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "pinn",
    "name": "Pinnacles National Park, California",
    "position": [
      36.480933,
      -121.158762
    ],
    "dates": [
      "2026-05-19",
      "2026-05-20",
      "2026-05-21",
      "2026-05-22"
    ],
    "samples": 35,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/2913AF89-1DD8-B71B-0B428CC0594DA1F3.jpg",
    "photoSource": "https://www.nps.gov/pinn/index.htm",
    "icon": "assets/icons/parks/pinn.svg",
    "iconDescription": "cliff",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "redw",
    "name": "Redwood National Park, California",
    "position": [
      41.643794,
      -124.11433
    ],
    "dates": [
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19"
    ],
    "samples": 315,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/0FBA9AF8-1DD8-B71B-0BF72F798FF5BC7E.jpg",
    "photoSource": "https://www.nps.gov/redw/index.htm",
    "icon": "assets/icons/parks/redw.svg",
    "iconDescription": "towering forest",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "California"
  },
  {
    "code": "mora",
    "name": "Mount Rainier National Park, Washington",
    "position": [
      46.913021,
      -121.537109
    ],
    "dates": [
      "2026-06-22",
      "2026-06-23",
      "2026-06-24",
      "2026-06-25",
      "2026-06-26"
    ],
    "samples": 376,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/EFEE6DC6-1DD8-B71B-0B9A2188BE6539A9.jpg",
    "photoSource": "https://www.nps.gov/mora/index.htm",
    "icon": "assets/icons/parks/mora.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Washington"
  },
  {
    "code": "olym",
    "name": "Olympic National Park, Washington",
    "position": [
      48.023678,
      -123.397269
    ],
    "dates": [
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-07-06",
      "2026-07-07"
    ],
    "samples": 175,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/24B35902-92B6-77CA-0C35FCF526C94819.jpg",
    "photoSource": "https://www.nps.gov/olym/index.htm",
    "icon": "assets/icons/parks/olym.svg",
    "iconDescription": "towering forest",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Washington"
  },
  {
    "code": "noca",
    "name": "North Cascades National Park, Washington",
    "position": [
      48.48,
      -121.05
    ],
    "dates": [
      "2026-07-12",
      "2026-07-13"
    ],
    "samples": 2,
    "status": "Confirmed visit",
    "confirmedByUser": true,
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/575C3B44-1DD8-B71B-0BD879DB3BC0AD69.jpg",
    "photoSource": "https://www.nps.gov/noca/index.htm",
    "icon": "assets/icons/parks/noca.svg",
    "iconDescription": "mountains and lake",
    "category": "parks",
    "stateLabel": "Washington"
  },
  {
    "code": "havo",
    "name": "Hawai'i Volcanoes National Park, Hawaii",
    "position": [
      19.413302,
      -155.246894
    ],
    "dates": [
      "2026-07-15",
      "2026-07-16",
      "2026-07-20",
      "2026-07-21"
    ],
    "samples": 130,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/pwr/homepage/36C3E97C-965A-0FBC-49F40566687E9E0E.jpg",
    "photoSource": "https://www.nps.gov/havo/index.htm",
    "icon": "assets/icons/parks/havo.svg",
    "iconDescription": "volcano",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Hawaii"
  },
  {
    "code": "wica",
    "name": "Wind Cave National Park, South Dakota",
    "position": [
      43.629091,
      -103.436165
    ],
    "dates": [
      "2026-08-19",
      "2026-08-20"
    ],
    "samples": 68,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/mwr/homepage/CC25AAB0-1DD8-B71B-0B48DF48A0B8DE84.JPG",
    "photoSource": "https://www.nps.gov/wica/index.htm",
    "icon": "assets/icons/parks/wica.svg",
    "iconDescription": "cave",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "South Dakota"
  },
  {
    "code": "jeff",
    "name": "Gateway Arch National Park, Missouri",
    "position": [
      38.624104,
      -90.185211
    ],
    "dates": [
      "2026-08-24"
    ],
    "samples": 9,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/mwr/homepage/63841426-D5F9-602F-192C46B9C6728AEA.jpeg",
    "photoSource": "https://www.nps.gov/jeff/index.htm",
    "icon": "assets/icons/parks/jeff.svg",
    "iconDescription": "archsteel",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Missouri"
  },
  {
    "code": "maca",
    "name": "Mammoth Cave National Park, Kentucky",
    "position": [
      37.189881,
      -86.238707
    ],
    "dates": [
      "2026-08-25",
      "2026-08-26"
    ],
    "samples": 61,
    "status": "Confirmed visit",
    "photo": "https://www.nps.gov/common/uploads/banner_image/akr/homepage/3E9D974D-C283-26E1-1B85C4C14E7F66EA.jpg",
    "photoSource": "https://www.nps.gov/maca/index.htm",
    "icon": "assets/icons/parks/maca.svg",
    "iconDescription": "cave",
    "confirmedByUser": true,
    "category": "parks",
    "stateLabel": "Kentucky"
  },
  {
    "code": "ca-banff",
    "name": "Banff National Park, Canada",
    "country": "Canada",
    "position": [
      51.602447,
      -116.309841
    ],
    "dates": [
      "2026-08-05",
      "2026-08-06",
      "2026-08-07",
      "2026-08-08",
      "2026-08-09",
      "2026-08-10",
      "2026-08-11",
      "2026-08-15"
    ],
    "samples": 788,
    "status": "Confirmed visit",
    "url": "https://parks.canada.ca/pn-np/ab/banff",
    "photo": "https://pcweb2.azureedge.net/-/media/pn-np/ab/banff/WET4/HomePage/feature-louise-moraine-tile-640x360.jpg?modified=20260514193056",
    "photoSource": "https://parks.canada.ca/pn-np/ab/banff",
    "icon": "assets/icons/parks/ca-banff.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks"
  },
  {
    "code": "ca-yoho",
    "name": "Yoho National Park, Canada",
    "country": "Canada",
    "position": [
      51.193398,
      -116.577766
    ],
    "dates": [
      "2026-08-10",
      "2026-08-11"
    ],
    "samples": 183,
    "status": "Confirmed visit",
    "url": "https://parks.canada.ca/pn-np/bc/yoho",
    "photo": "https://pcweb2.azureedge.net/-/media/pn-np/bc/yoho/WET4/2022-web-renewal/Yoho_Banner-pn-np-bc-yoho-1920x4801.jpg?modified=20221126075156",
    "photoSource": "https://parks.canada.ca/pn-np/bc/yoho",
    "icon": "assets/icons/parks/ca-yoho.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks"
  },
  {
    "code": "ca-jasper",
    "name": "Jasper National Park, Canada",
    "country": "Canada",
    "position": [
      52.811572,
      -118.045265
    ],
    "dates": [
      "2026-08-11",
      "2026-08-12",
      "2026-08-13",
      "2026-08-14",
      "2026-08-15"
    ],
    "samples": 391,
    "status": "Confirmed visit",
    "url": "https://parks.canada.ca/pn-np/ab/jasper",
    "photo": "https://pcweb2.azureedge.net/-/media/pn-np/ab/jasper/WET4/ms-sm/OG-home-page_Facebook.jpg?modified=20221107002024",
    "photoSource": "https://parks.canada.ca/pn-np/ab/jasper",
    "icon": "assets/icons/parks/ca-jasper.svg",
    "iconDescription": "mountains and lake",
    "confirmedByUser": true,
    "category": "parks"
  }
];
