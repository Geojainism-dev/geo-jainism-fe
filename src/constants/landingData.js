// `asset` = stable Cloudinary asset key (manifest id, see src/lib/cloudinary). An unknown key throws; there is no local fallback.
export const JOURNEY_SLIDES = [
  {
    asset: "site/journey/01-rock-sculpture",
    num: "Chapter 01 · Research",
    title: "Ancient Rock-Cut Tirthankaras",
    caption: "From the 3rd century BCE, Tamil Brahmi inscriptions and rock-cut sculptures silently bear witness to a flourishing Jain civilisation — the oldest epigraphic heritage of Jainism in India.",
  },
  {
    asset: "site/journey/02-temple-hill",
    num: "Chapter 02 · Heritage",
    title: "Forgotten Temples on the Hills",
    caption: "Hilltop shrines scattered across Tamil Nadu — from Madurai to the distant heights of Chithral and Kalugumalai — stood as strongholds of the Jain faith for two millennia.",
  },
  {
    asset: "site/journey/03-team-group",
    num: "Chapter 03 · The Team",
    title: "23 Days in the Field",
    caption: "From 17 December to 8 January the GEO Jainism team trekked to remote locations, reaching sites no camera had reached before — documenting every inscription in 4K.",
  },
  {
    asset: "site/journey/04-hillside",
    num: "Chapter 04 · Journey",
    title: "Fifty Hills. One Mission.",
    caption: "50+ hills climbed across Tamil Nadu to capture Jain cave shelters, rock-cut figures, and hilltop shrines that have silently watched centuries pass.",
  },
  {
    asset: "site/journey/05-rock-carvings",
    num: "Chapter 05 · Discovery",
    title: "Intricate Stone Carvings",
    caption: "Spectacular Jain rock-cut sculptures survive across the landscape — many converted to worship other deities, their original identity slowly being erased.",
  },
  {
    asset: "site/journey/06-sheep-site",
    num: "Chapter 06 · Timeless",
    title: "Heritage & Everyday Life",
    caption: "Grazing flocks pass by sacred stones — a quiet reminder of how ancient Jain monuments have become a living part of the Tamil countryside itself.",
  },
  {
    asset: "site/journey/07-stone-carving",
    num: "Chapter 07 · Artistry",
    title: "The Artistry of Jain Masters",
    caption: "Complex carvings depicting Tirthankaras, yakshas and celestial attendants — preserved in stone for over a thousand years, largely unknown to the outside world.",
  },
  {
    asset: "site/journey/08-community",
    num: "Chapter 08 · Community",
    title: "The Elders Who Remember",
    caption: "Only 25,000–35,000 Tamil Jains remain. We interviewed 50+ elders, priests and scholars — sharing the living memory of a fading tradition before it vanishes.",
  },
  {
    asset: "site/journey/09-temple",
    num: "Chapter 09 · Heritage",
    title: "Samanakovil, Vijayamangalam",
    caption: "The iconic Digambar Jain temple of Vijayamangalam — one of Tamil Nadu's great surviving Jain heritage centres, standing resilient through centuries of change.",
  },
  {
    asset: "site/journey/10-founder-research",
    num: "Chapter 10 · Vision",
    title: "On-Field Documentation",
    caption: "Founder Kavi Sajal Jain examines ancient stonework by torchlight — the quiet, painstaking fieldwork at the heart of everything GEO Jainism does.",
  },
];

export const COURSES = [
  {
    tag: "Tamil Nadu",
    title: "Revisit Jain History",
    desc: " Dive deeper into the rich, often-overlooked world of Jain history, literature, and culture — through structured, research-based series crafted by GEO Jainism.",
    // meta: "10 Episodes · 4K",
    cta: "Start Learning",
    asset: "site/journey/01-rock-sculpture",
  },
  {
    tag: "Literature",
    title: "Naldiyar & Rare Jain Manuscripts",
    desc: "The oldest Tamil text — written by 8,000 Jain monks. Explore Naldiyar, Silappadikaram, Ratnakara, and the literary soul of Tamil Jainism that shaped an entire civilisation.",
    meta: "6 Episodes · Subtitled",
    cta: "Start Learning",
    asset: "site/journey/07-stone-carving",
  },
  {
    tag: "Across Borders",
    title: "Jain History in Pakistan",
    desc: "From the Anarkali Jain Temple of Lahore to Rawalpindi's Jain Kanya Pathshala and the abandoned shrines of Multan — a documented journey into erased heritage.",
    meta: "8 Episodes · HD",
    cta: "Explore",
    asset: "site/journey/09-temple",
  },
  {
    tag: "10 Wonders",
    title: "The Jain Wonders of India",
    desc: "Ranthambore · Kumbhalgadh · Bijoliya · Chittorgarh · Ladnun — ten architectural marvels of Jain heritage you have never heard of, filmed on location in cinematic 4K.",
    meta: "10 Episodes · 4K",
    cta: "Start Learning",
    asset: "site/journey/04-hillside",
  },
  {
    tag: "Karnataka · Kerala",
    title: "Jain Virasat in South India",
    desc: "From Gulbarga's lost Jain temples to Kerala's near-forgotten Jain past — field research across Karnataka, Andhra Pradesh, Kerala, Telangana and Goa.",
    meta: "7 Episodes · Field",
    cta: "Explore",
    asset: "site/journey/02-temple-hill",
  },
  {
    tag: "Queens & Kings",
    title: "Rani Chennabhairadevi: The Pepper Queen",
    desc: "The untold story of India's longest-reigning Jain queen — a 54-year rule that controlled the global pepper trade and shielded Jain communities for generations.",
    meta: "Feature Episode · 4K",
    cta: "Watch Story",
    asset: "site/journey/05-rock-carvings",
  },
];

export const BLOGS = [
  {
    cat: "Featured",
    date: "Jan · 2026",
    title: "The Lost Jain Temples of Gulbarga — On Camera for the First Time",
    excerpt: "A 10-minute journey into the forgotten Jain monuments of Karnataka — ancient structures that have waited centuries for the world to notice them. Captured on camera for the very first time.",
    asset: "site/journey/09-temple",
    featured: true,
  },
  {
    cat: "Research",
    date: "Dec · 2025",
    title: "Naldiyar: 8,000 Jain Monks, One Ancient Tamil Text",
    excerpt: "Inside the Naldiyar — arguably the oldest Tamil scripture, composed by a community of 8,000 Jain monks. A deep dive into its authorship, verses, and lasting influence.",
    asset: "site/journey/07-stone-carving",
  },
  {
    cat: "Heritage",
    date: "Nov · 2025",
    title: "Rani Chennabhairadevi: The Pepper Queen of India",
    excerpt: "A 54-year reign, a global pepper trade, and a Jain queen history almost forgot. The extraordinary story of one of India's most powerful yet least-known monarchs.",
    asset: "site/journey/05-rock-carvings",
  },
];

export const TIMELINE_ITEMS = [
  {
    eyebrow: "EXPLORE HOW ANCIENT ETHICS SHAPED SOUTH INDIAN CIVILIZATION.",
    title: "Naladiyar",
    body: "A timeless Tamil classic composed of 400 moral verses by Jain monks, teaching wisdom, discipline, humility, and the deeper values of human life.",
    asset: "site/landing/literature/naladiyar",
    alt: "Naladiyar",
    caption: "Naladiyar Classic"
  },
  {
    eyebrow: "DISCOVER THE LEGACY OF ONE OF INDIA'S OLDEST LITERARY MASTERPIECES.",
    title: "Silappatikaram",
    body: "One of the greatest Tamil epics, narrating the powerful story of Kannagi — a symbol of justice, truth, and devotion. The text offers a vivid glimpse into the culture, trade, cities, and spiritual life of ancient Tamilakam.",
    asset: "site/landing/literature/shilapattikaram",
    alt: "Silappatikaram",
    caption: "Silappatikaram Epic"
  },
  {
    eyebrow: "STEP INTO A WORLD WHERE LITERATURE MEETS SPIRITUAL WISDOM.",
    title: "Jivaka Chintamani",
    body: "A celebrated Jain Tamil epic blending philosophy, poetry, romance, and spirituality. It reflects the richness of medieval Tamil literature and the influence of Jain thought on art and storytelling.",
    asset: "site/landing/literature/jeevak-chintamani",
    alt: "Jivaka Chintamani",
    caption: "Jeevak Chintamani Epic"
  },
  {
    eyebrow: "EXPLORE THE VOICE THAT CARRIED JAIN PHILOSOPHY ACROSS GENERATIONS.",
    title: "Ratnakaravarni",
    body: "A renowned Kannada Jain poet and scholar known for preserving spiritual traditions through literature. His works beautifully combine devotion, philosophy, and poetic excellence, leaving a lasting mark on Karnataka's literary heritage.",
    asset: "site/landing/literature/ratnakar",
    alt: "Ratnakaravarni",
    caption: "Ratnakaravarni Poetry"
  },
  {
    eyebrow: "THE UNTOLD STORY OF INDIA'S LONGEST-REIGNING JAIN QUEEN.",
    title: "Rani Chennabhairadevi: The Pepper Queen",
    body: "The fearless ruler of Gerusoppa who led one of the most prosperous kingdoms of the western coast, strengthening trade, culture, and Jain heritage during the 16th century. Remembered as the \"Pepper Queen,\" she became a symbol of power, resilience, and devotion to Jain traditions.",
    asset: "site/landing/literature/chenna-bhaira-devi",
    alt: "Rani Chennabhairadevi",
    caption: "Rani Chennabhairadevi"
  },
];

export const CHALLENGES = [
  {
    num: "01",
    title: "Rapid Population Decline",
    body: "Only ~25,000–35,000 Tamil Jains remain today. This ancient community has reached near-endangered status, a civilisation teetering on the edge of extinction.",
  },
  {
    num: "02",
    title: "Heritage Neglect",
    body: "450+ Jain sites exist in Tamil Nadu. Only a handful are protected. The rest — caves, sculptures, cave murals and manuscripts — lie buried in bushes or open fields, decaying without witness.",
  },
  {
    num: "03",
    title: "Cultural Appropriation",
    body: "Many Jain temples have been converted to worship local deities. Through redefinition and occupation, the identity of these sacred spaces is being systematically erased.",
  },
  {
    num: "04",
    title: "Global Invisibility",
    body: "Most people — in India and abroad — are completely unaware that Jainism had a deep and foundational presence in Tamil Nadu. Recognition and representation are both severely lacking.",
  },
  {
    num: "05",
    title: "Economic Hardship",
    body: "Most Tamil Jain families depend on subsistence agriculture as marginal or small farmers. Poverty is a significant barrier to community development, education, and cultural preservation.",
  },
  {
    num: "06",
    title: "No Prior Documentation",
    body: "This is the first-ever comprehensive 4K video documentation of Tamil Jain heritage — 111 sites, every inscription captured. The most extensive data collection initiative in Tamil Jain history.",
  },
];
