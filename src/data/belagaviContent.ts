import type {
  ArtCraftItem,
  CulturalActivity,
  Destination,
  FoodItem,
  GalleryPhoto,
  TripRequest,
  VisitorReview,
} from '../types';

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'gokak-falls',
    name: 'Gokak Falls',
    category: 'Waterfalls & Nature',
    distanceFromCity: '60 km',
    bestSeason: 'Jul – Dec',
    description:
      'Known as the "Niagara of Karnataka," the Ghataprabha River cascades 170 ft over horseshoe-shaped red sandstone cliffs, spanned by a historic 201-meter hanging suspension bridge.',
    highlights: ['170 ft Sandstone Plunge', 'Historic Suspension Bridge', 'Ghataprabha Gorge'],
    imageUrl: '/src/assets/images/dest_gokak_falls_1795511401556.jpg',
    estimatedHours: 3.5,
  },
  {
    id: 'belagavi-fort-kamal-basti',
    name: 'Belagavi Fort & Kamal Basti',
    category: 'Forts & Heritage',
    secondaryCategory: 'Spiritual & Landmarks',
    distanceFromCity: '2 km',
    bestSeason: 'Oct – Mar',
    description:
      'Built in 1204 CE by the Ratta dynasty in red laterite and dark basalt, this storied oval fort houses the intricately carved Chalukyan-style Kamal Basadi Jain temple with its famed lotus-dome ceiling.',
    highlights: ['Kamal Basadi Lotus Dome', '12th-Century Ratta Bastions', 'Ancient Stepwell'],
    imageUrl: '/src/assets/images/dest_kamal_basti_1795511401772.jpg',
    estimatedHours: 2.5,
  },
  {
    id: 'rajhansgad-yellur-fort',
    name: 'Rajhansgad (Yellur Fort)',
    category: 'Forts & Heritage',
    secondaryCategory: 'Spiritual & Landmarks',
    distanceFromCity: '16 km',
    bestSeason: 'Aug – Feb',
    description:
      'Perched atop an emerald ridge overlooking Belagavi’s agricultural valleys, this centuries-old stone fortress rewards climbers with sweeping 360-degree Sahyadri vistas and a tranquil hilltop Siddheshwar Shiva temple.',
    highlights: ['360° Sahyadri Ridge Views', 'Siddheshwar Shiva Temple', 'Freshwater Fort Well'],
    imageUrl: '/src/assets/images/dest_rajhansgad_fort_1795511403187.jpg',
    estimatedHours: 3,
  },
  {
    id: 'kittur-rani-channamma-fort',
    name: 'Kittur Rani Channamma Fort & Palace',
    category: 'Forts & Heritage',
    distanceFromCity: '48 km',
    bestSeason: 'Oct – Feb',
    description:
      'The historic seat of Queen Kittur Channamma—who led one of India’s earliest armed resistances in 1824—featuring monumental carved stone gateways, palace ruins, and an archaeological museum.',
    highlights: ['Rani Channamma Memorial', 'Archaeological Museum', 'Carved Basalt Gatehouse'],
    imageUrl: '/src/assets/images/dest_kittur_fort_1795511401550.jpg',
    estimatedHours: 3,
  },
  {
    id: 'godchinamalaki-falls',
    name: 'Godchinamalaki Falls',
    category: 'Waterfalls & Nature',
    distanceFromCity: '65 km',
    bestSeason: 'Jul – Nov',
    description:
      'Tucked inside a rugged, forested gorge on the Markandeya River near Gokak, this picturesque two-tier waterfall tumbles across stepped basalt ledges into emerald rock pools.',
    highlights: ['Two-Tier Cascading Gorge', 'Markandeya River Valley', 'Monsoon Forest Walk'],
    imageUrl: '/src/assets/images/dest_godchinamalaki_falls_1795511403515.jpg',
    estimatedHours: 3,
  },
  {
    id: 'bhimgad-wildlife-sanctuary',
    name: 'Bhimgad Wildlife Sanctuary',
    category: 'Waterfalls & Nature',
    distanceFromCity: '42 km',
    bestSeason: 'Oct – Mar',
    description:
      'A pristine Western Ghats biodiversity reserve in Khanapur taluk, celebrated for misty subtropical rainforests, limestone Barapede caves, Mahadayi river headwaters, and ridge trails.',
    highlights: ['Barapede Limestone Caves', 'Mahadayi River Origin', 'Western Ghats Canopy'],
    imageUrl: '/src/assets/images/dest_bhimgad_forest_1795511402913.jpg',
    estimatedHours: 5,
  },
];

export const SEED_FOOD: FoodItem[] = [
  {
    id: 'belagavi-kunda',
    name: 'Belagavi Kunda',
    dietary: 'Veg',
    type: 'Heritage Sweet',
    origin: 'Belagavi City',
    description:
      'Belagavi’s signature culinary emblem: buffalo milk slow-simmered for hours in heavy iron kadhais with sugar and green cardamom until rich, grainy, and deeply caramelized.',
    imageUrl: '/src/assets/images/food_belagavi_kunda_1795511403154.jpg',
  },
  {
    id: 'gokak-karadant',
    name: 'Gokak Karadant',
    dietary: 'Veg',
    type: 'Traditional Sweet',
    origin: 'Gokak Town',
    description:
      'A wholesome centuries-old confection crafted from edible acacia gum (ant), organic sugarcane jaggery, roasted almonds, cashews, pistachios, and dry coconut.',
    imageUrl: '/src/assets/images/food_gokak_karadant_1795511403631.jpg',
  },
  {
    id: 'jolada-roti-enne-gai',
    name: 'Jolada Roti & Enne Gai',
    dietary: 'Veg',
    type: 'Authentic Meal',
    origin: 'North Karnataka Kitchens',
    description:
      'Hand-patted sorghum millet flatbreads paired with sesame-peanut stuffed brinjal curry (Enne Gai), fiery Shenga chutney pudi, fresh curd, and crisp raw onion.',
    imageUrl: '/src/assets/images/food_jolada_roti_1795511405543.jpg',
  },
  {
    id: 'belagavi-biryani-mandige',
    name: 'Belagavi Biryani & Mandige',
    dietary: 'Non-Veg / Veg',
    type: 'Local Specialties',
    origin: 'Old Camp & Khade Bazaar',
    description:
      'Aromatic Deccan-meets-Konkan spiced biryani slow-cooked over wood embers, complemented by paper-thin flaky Mandige flatbread dusted with cardamom sugar and ghee.',
    imageUrl: '/src/assets/images/food_belagavi_biryani_1795511405763.jpg',
  },
];

export const SEED_ART: ArtCraftItem[] = [
  {
    id: 'gokak-wooden-toys',
    name: 'Gokak Wooden Toys',
    cluster: 'Gokak Artisan Guild',
    craftType: 'Lacquered Woodcraft',
    description:
      'Turned on traditional lathes from soft hale wood and finished with natural glossy lacquer, depicting lifelike mangoes, pomegranates, folk figurines, and kitchen miniatures.',
    imageUrl: '/src/assets/images/art_gokak_toys_1795511405482.jpg',
  },
  {
    id: 'khanapur-terracotta',
    name: 'Khanapur Terracotta & Pottery',
    cluster: 'Khanapur Clay Cluster',
    craftType: 'Hand-Thrown Earthenware',
    description:
      'Fired in open village kilns using mineral-rich Western Ghats clay, producing porous water matkas, cooking handis, and festival lamps prized across Karnataka and Goa.',
    imageUrl: '/src/assets/images/art_khanapur_pottery_1795511405461.jpg',
  },
  {
    id: 'shahapur-handloom',
    name: 'Shahapur Handloom & Ilkal Sarees',
    cluster: 'Shahapur Weaving Lanes',
    craftType: 'Heritage Textiles',
    description:
      'Generational pit-loom weavers in Shahapur create luminous silk-cotton drapes featuring traditional kasuti embroidery motifs, chikki paras borders, and deep temple pallus.',
    imageUrl: '/src/assets/images/art_shahapur_handloom_1795511405772.jpg',
  },
  {
    id: 'chalukyan-stone-sculpture',
    name: 'Chalukyan & Ratta Stone Sculpture',
    cluster: 'Belagavi Fort & Bailhongal',
    craftType: 'Architectural Basalt Carving',
    description:
      'Intricate 12th-century lathe-turned basalt pillars, suspended lotus ceilings, and delicately chiseled Jain Tirthankara reliefs preserved inside Kamal Basadi.',
    imageUrl: '/src/assets/images/dest_kamal_basti_1795511401772.jpg',
  },
];

export const SEED_CULTURE: CulturalActivity[] = [
  {
    id: 'kittur-utsava',
    name: 'Kittur Utsava',
    season: 'October (Annual)',
    tradition: 'State Heritage Festival',
    description:
      'A grand three-day commemoration of Rani Channamma’s 1824 victory, uniting historical torchlight processions, Veeragase folk theatre, traditional kushti wrestling, and classical concerts.',
    imageUrl: '/src/assets/images/dest_kittur_fort_1795511401550.jpg',
  },
  {
    id: 'belagavi-kite-festival',
    name: 'Belagavi Kite Festival',
    season: 'January (Makar Sankranti)',
    tradition: 'International Sky Festival',
    description:
      'Crisp winter skies above Belagavi fill with hundreds of handcrafted giant kites flown by national and visiting flyers, accompanied by folk music and sesame-jaggery treats.',
    imageUrl: '/src/assets/images/dest_rajhansgad_fort_1795511403187.jpg',
  },
  {
    id: 'ganesh-chaturthi-navaratri',
    name: 'Ganesh Chaturthi & Navaratri',
    season: 'August – October',
    tradition: 'Cross-Border Community Tradition',
    description:
      'Belagavi’s century-old Sarvajanik Ganesh pandals and Navaratri celebrations reflect the city’s vibrant blend of Kannada and Marathi devotional music, rangoli, and theatre.',
    imageUrl: '/src/assets/images/art_khanapur_pottery_1795511405461.jpg',
  },
  {
    id: 'dollu-kunitha-folk',
    name: 'Dollu Kunitha & Folk Performances',
    season: 'Year-Round Jatras',
    tradition: 'Traditional Drum Dance',
    description:
      'Thunderous percussion ensembles where troupes in crimson and turmeric dhotis perform synchronized acrobatic formations with heavy hollowed-wood Dollu drums.',
    imageUrl: '/src/assets/images/culture_kittur_utsava_1795511407130.jpg',
  },
];

export const SEED_GALLERY: GalleryPhoto[] = [
  {
    id: '22222222-2222-4222-8222-222222222201',
    title: 'Monsoon Roar at Gokak Falls',
    category: 'Nature',
    caption: 'Ghataprabha River plunging 170 ft beneath the historic hanging bridge.',
    imageUrl: '/src/assets/images/dest_gokak_falls_1795511401556.jpg',
    createdAt: '2026-09-12T08:30:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222202',
    title: 'Kamal Basadi Basalt Mandapa',
    category: 'Heritage',
    caption: 'Lathe-turned 12th-century Ratta pillars inside Belagavi Fort.',
    imageUrl: '/src/assets/images/dest_kamal_basti_1795511401772.jpg',
    createdAt: '2026-09-14T10:15:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222203',
    title: 'Slow-Caramelized Belagavi Kunda',
    category: 'Food',
    caption: 'Warm brass-bowl serving garnished with roasted pistachios and cardamom.',
    imageUrl: '/src/assets/images/food_belagavi_kunda_1795511403154.jpg',
    createdAt: '2026-09-18T14:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222204',
    title: 'Morning Mist Over Rajhansgad',
    category: 'Heritage',
    caption: 'Basalt bastions overlooking the emerald Yellur valley.',
    imageUrl: '/src/assets/images/dest_rajhansgad_fort_1795511403187.jpg',
    createdAt: '2026-09-20T06:45:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222205',
    title: 'Dollu Kunitha Drum Procession',
    category: 'Culture',
    caption: 'Folk percussionists performing in a sunlit red-stone heritage courtyard.',
    imageUrl: '/src/assets/images/gallery_dollu_kunitha_1795515915464.jpg',
    createdAt: '2026-10-03T18:20:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222206',
    title: 'North Karnataka Jolada Roti Thali',
    category: 'Food',
    caption: 'Sorghum flatbread with Enne Gai stuffed brinjal and peanut chutney pudi.',
    imageUrl: '/src/assets/images/food_jolada_roti_1795511405543.jpg',
    createdAt: '2026-10-08T12:30:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222207',
    title: 'Gokak Lacquered Woodcraft',
    category: 'Culture',
    caption: 'Hand-turned wooden fruit replicas crafted on traditional lathes.',
    imageUrl: '/src/assets/images/art_gokak_toys_1795511405482.jpg',
    createdAt: '2026-10-12T11:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222208',
    title: 'Godchinamalaki Stepped Cascades',
    category: 'Nature',
    caption: 'Two-tier waterfall tucked deep inside the Markandeya gorge.',
    imageUrl: '/src/assets/images/dest_godchinamalaki_falls_1795511403515.jpg',
    createdAt: '2026-10-15T09:10:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222209',
    title: 'Shahapur Silk Pit-Loom Weaves',
    category: 'Culture',
    caption: 'Handwoven temple-border Ilkal sarees resting on a wooden loom.',
    imageUrl: '/src/assets/images/art_shahapur_handloom_1795511405772.jpg',
    createdAt: '2026-10-19T15:40:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222210',
    title: 'Bhimgad Rainforest Sunbeams',
    category: 'Nature',
    caption: 'Misty evergreen canopy trail in the Khanapur Western Ghats.',
    imageUrl: '/src/assets/images/dest_bhimgad_forest_1795511402913.jpg',
    createdAt: '2026-10-22T07:50:00.000Z',
  },
];

export const SEED_TRIPS: TripRequest[] = [
  {
    id: 'trip-seed-1',
    bookingId: 'BGM-2026-4812',
    fullName: 'Meera Deshpande',
    email: 'meera.deshpande@example.com',
    phone: '+91 98452 71094',
    preferredDate: '2026-12-05',
    duration: '2 Days / 1 Night',
    travelers: 4,
    budget: 'Standard',
    selectedDestinations: ['Gokak Falls', 'Godchinamalaki Falls', 'Belagavi Fort & Kamal Basti'],
    experiences: ['Local Food Trail', 'Nature & Waterfall Trek'],
    notes: 'Would love a morning tasting stop for warm Belagavi Kunda and Gokak Karadant.',
    status: 'Confirmed',
    createdAt: '2026-11-18T09:20:00.000Z',
  },
  {
    id: 'trip-seed-2',
    bookingId: 'BGM-2026-7390',
    fullName: 'Raghavendra Rao',
    email: 'raghav.rao@example.com',
    phone: '+91 97310 44821',
    preferredDate: '2026-12-19',
    duration: '3 Days / 2 Nights',
    travelers: 2,
    budget: 'Premium',
    selectedDestinations: [
      'Belagavi Fort & Kamal Basti',
      'Rajhansgad (Yellur Fort)',
      'Kittur Rani Channamma Fort & Palace',
      'Bhimgad Wildlife Sanctuary',
    ],
    experiences: ['Heritage & Fort Walk', 'Art & Handicraft Shopping'],
    notes: 'Interested in visiting Shahapur handloom weavers and Khanapur terracotta workshops.',
    status: 'Pending',
    createdAt: '2026-11-22T14:45:00.000Z',
  },
];

export const SEED_REVIEWS: VisitorReview[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    visitorName: 'Siddharth Joshi',
    originCity: 'Pune, Maharashtra',
    rating: 5,
    visitedLandmark: 'Gokak Falls',
    comment:
      'Walking across the historic suspension bridge above the roaring Ghataprabha gorge at sunrise is unforgettable. Paired it with warm Karadant from Gokak market.',
    createdAt: '2026-10-14T11:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    visitorName: 'Kavita Hegde',
    originCity: 'Bengaluru, Karnataka',
    rating: 5,
    visitedLandmark: 'Belagavi Fort & Kamal Basti',
    comment:
      'The carved lotus ceiling inside Kamal Basadi is a hidden architectural marvel. Afterwards we picked up fresh slow-cooked Belagavi Kunda and Jolada Roti thali nearby.',
    createdAt: '2026-11-02T16:30:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    visitorName: 'Aarav Sawant',
    originCity: 'Panaji, Goa',
    rating: 4,
    visitedLandmark: 'Rajhansgad (Yellur Fort)',
    comment:
      'An easy drive from the Goa border up to sweeping green Sahyadri views. The quiet Shiva temple inside the basalt ramparts makes it worth every step.',
    createdAt: '2026-11-15T08:45:00.000Z',
  },
];
