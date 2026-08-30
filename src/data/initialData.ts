import { FullDatabase } from '../types';

export const initialData: FullDatabase = {
  homepage: {
    heroTitle: "LIYANA SHRESTHA",
    heroSubtitle: "Digital Creator • Lifestyle • Kathmandu",
    heroStatement: "Stories, places and moments — captured as I see them.",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85",
    introImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85",
    introQuote: "I create, explore and document the moments, places and people that inspire me.",
    heroCta1Text: "EXPLORE MY STORY",
    heroCta1Link: "#story",
    heroCta2Text: "VIEW PHOTOGRAPHS",
    heroCta2Link: "#photography",
    storyIntroHeading: "THE EDITORIAL JOURNAL",
    storyIntroText: "A living record of identity, quiet beauty in Kathmandu alleys, and the art of seeing.",
    photographyHeading: "MY PHOTOS",
    photographySubheading: "A curated curation of portraits, street light, and fleeting moments.",
    proofHeading: "COLLABORATIONS & PROOF",
    proofSubheading: "Editorial partnerships, brand features, and audience engagement.",
    aboutSectionTitle: "WHO IS LIYANA?",
    contactHeading: "LET'S CONNECT.",
    contactText: "Have an idea, collaboration or simply want to say hello?",
    contactCtaText: "CONTACT ON WHATSAPP"
  },
  stories: [
    {
      id: "story-1",
      chapterNumber: "01",
      title: "THE BEGINNING",
      heading: "I am Liyana. I live in Kathmandu.",
      description: "Growing up among the ancient brick temples, misty mornings, and rapid cultural metamorphosis of Kathmandu shaped the way I look through the lens. What began as solitary walks with a vintage camera turned into an obsession with light, texture, and the unscripted poetry of everyday living in the valley.",
      quote: "To observe is to fall in love with the world over and over again.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85",
      imageCaption: "Kathmandu Courtyard — First light",
      layout: "text-left",
      order: 1,
      published: true,
      createdAt: "2026-01-10T10:00:00.000Z",
      updatedAt: "2026-02-15T14:30:00.000Z"
    },
    {
      id: "story-2",
      chapterNumber: "02",
      title: "LIGHT & SHADOWS",
      heading: "Finding stillness in the vibrant rush.",
      description: "Kathmandu moves with an unrelenting tempo — fluttering prayer flags, roaring motorbikes, aromatic chai stalls, and golden sunbeams slicing through wooden latticed windows. My work is an effort to carve out quiet sanctuaries inside that whirlwind, honoring both heritage and contemporary modernism.",
      quote: "Stillness isn't the absence of motion; it is presence inside it.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85",
      imageCaption: "Shadow study in Patan",
      layout: "text-right",
      order: 2,
      published: true,
      createdAt: "2026-01-15T11:00:00.000Z",
      updatedAt: "2026-02-18T09:15:00.000Z"
    },
    {
      id: "story-3",
      chapterNumber: "03",
      title: "FASHION & FORM",
      heading: "Where traditional textiles meet modern silhouettes.",
      description: "Fashion to me is wearable storytelling. Collaborating with local artisans, Dhaka weavers, and progressive South Asian designers allows us to rewrite what luxury feels like: tactile, grounded, and deeply personal. It is never just about the garments, but the posture of the person carrying them.",
      quote: "Style is a quiet assertion of who you are before you speak.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=85",
      imageCaption: "Editorial series for Himalayan silk",
      layout: "text-left",
      order: 3,
      published: true,
      createdAt: "2026-01-20T12:00:00.000Z",
      updatedAt: "2026-02-20T16:00:00.000Z"
    },
    {
      id: "story-4",
      chapterNumber: "04",
      title: "THE HORIZON",
      heading: "Exploring beyond the valley borders.",
      description: "From serene lakeside sunsets in Pokhara to rugged Mustang ridges, and onward to creative hubs across Asia, travel expands my palette. Every departure brings fresh eyes; every return to Kathmandu deepens my roots.",
      quote: "We travel not to escape life, but for life not to escape us.",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=85",
      imageCaption: "En route to high altitudes",
      layout: "text-right",
      order: 4,
      published: true,
      createdAt: "2026-01-28T08:30:00.000Z",
      updatedAt: "2026-02-25T11:45:00.000Z"
    }
  ],
  photos: [
    {
      id: "photo-1",
      title: "LEOPARD",
      category: "Portrait",
      description: "Warm tonal study exploring feline intensity and natural light fall.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "portrait",
      featured: true,
      order: 1,
      published: true,
      location: "Kathmandu Studio",
      year: "2026",
      createdAt: "2026-01-05T00:00:00.000Z",
      updatedAt: "2026-01-05T00:00:00.000Z"
    },
    {
      id: "photo-2",
      title: "EVENING SOLITUDE",
      category: "Evening",
      description: "Twilight reflections and ambient candle flicker across old brickwork.",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "portrait",
      featured: true,
      order: 2,
      published: true,
      location: "Boudha Terrace",
      year: "2026",
      createdAt: "2026-01-08T00:00:00.000Z",
      updatedAt: "2026-01-08T00:00:00.000Z"
    },
    {
      id: "photo-3",
      title: "TERRACOTTA & LINEN",
      category: "Lifestyle",
      description: "Organic textures, warm ceramics, and relaxed afternoon tea aesthetics.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "landscape",
      featured: true,
      order: 3,
      published: true,
      location: "Jhamsikhel",
      year: "2026",
      createdAt: "2026-01-12T00:00:00.000Z",
      updatedAt: "2026-01-12T00:00:00.000Z"
    },
    {
      id: "photo-4",
      title: "VALLEY HORIZON",
      category: "Travel",
      description: "Crisp mountain ridgelines piercing the early morning cloud layer.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "landscape",
      featured: true,
      order: 4,
      published: true,
      location: "Nagarkot Ridge",
      year: "2026",
      createdAt: "2026-01-16T00:00:00.000Z",
      updatedAt: "2026-01-16T00:00:00.000Z"
    },
    {
      id: "photo-5",
      title: "SILK & STRUCTURE",
      category: "Portrait",
      description: "Minimalist fashion portrait emphasizing clean lines and rich drape.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "portrait",
      featured: false,
      order: 5,
      published: true,
      location: "Babar Mahal Revisited",
      year: "2026",
      createdAt: "2026-01-20T00:00:00.000Z",
      updatedAt: "2026-01-20T00:00:00.000Z"
    },
    {
      id: "photo-6",
      title: "NOCTURNE IN AMBER",
      category: "Evening",
      description: "Deep shadows, city streetlamps, and moody cinematic glow.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "portrait",
      featured: true,
      order: 6,
      published: true,
      location: "Thamel Alley",
      year: "2026",
      createdAt: "2026-01-22T00:00:00.000Z",
      updatedAt: "2026-01-22T00:00:00.000Z"
    },
    {
      id: "photo-7",
      title: "HERITAGE COURTYARD",
      category: "Travel",
      description: "Century-old carved wood and warm morning sunlight in Patan Durbar.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "square",
      featured: false,
      order: 7,
      published: true,
      location: "Patan Heritage",
      year: "2026",
      createdAt: "2026-01-25T00:00:00.000Z",
      updatedAt: "2026-01-25T00:00:00.000Z"
    },
    {
      id: "photo-8",
      title: "CAFE CORNER",
      category: "Lifestyle",
      description: "Artisan espresso, handwritten notebooks, and quiet creative hours.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "landscape",
      featured: false,
      order: 8,
      published: true,
      location: "Sanepa",
      year: "2026",
      createdAt: "2026-01-29T00:00:00.000Z",
      updatedAt: "2026-01-29T00:00:00.000Z"
    },
    {
      id: "photo-9",
      title: "MINIMALIST DRAPE",
      category: "Other",
      description: "Abstract composition of raw linen folds and subtle cast shadow.",
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80",
      aspectRatio: "portrait",
      featured: false,
      order: 9,
      published: true,
      location: "Kathmandu Studio",
      year: "2026",
      createdAt: "2026-02-02T00:00:00.000Z",
      updatedAt: "2026-02-02T00:00:00.000Z"
    }
  ],
  about: {
    name: "Liyana Shrestha",
    tagline: "Digital Creator, Visual Storyteller & Lifestyle Curator",
    shortBio: "Capturing visual poetry, timeless fashion, and the evolving spirit of Kathmandu through a distinct cinematic lens.",
    fullBio: "Based in Kathmandu, Nepal, Liyana Shrestha is a digital creator and visual storyteller whose work bridges contemporary South Asian lifestyle, editorial fashion, and documentary-style travel photography. With a deep eye for natural light, tactile textures, and intimate moments, she creates compelling campaigns for modern lifestyle brands while maintaining an authentic, deeply engaged community.",
    portraitImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    location: "Kathmandu, Nepal",
    focus: "Lifestyle / Photography / Digital Content",
    website: "liyanashrestha.com",
    stats: [
      { label: "Instagram Community", value: "85K+" },
      { label: "Curated Captures", value: "240+" },
      { label: "Brand Partnerships", value: "35+" },
      { label: "Avg Engagement", value: "8.4%" }
    ],
    highlights: [
      "Editorial Photography & Creative Direction",
      "Brand Campaign Partnerships & Styling",
      "Short-form Cinematic Reels & Storytelling",
      "Travel & Hospitality Feature Coverage"
    ],
    updatedAt: "2026-02-28T12:00:00.000Z"
  },
  socialLinks: [
    {
      id: "social-1",
      platform: "Instagram",
      label: "Instagram",
      url: "https://instagram.com/liyanashrestha",
      handle: "@liyanashrestha",
      featured: true,
      order: 1,
      enabled: true
    },
    {
      id: "social-2",
      platform: "WhatsApp",
      label: "WhatsApp",
      url: "https://wa.me/9779800000000?text=Hi%20Liyana,%20I'd%20love%20to%20discuss%20a%20collaboration",
      handle: "+977 9800000000",
      featured: true,
      order: 2,
      enabled: true
    },
    {
      id: "social-3",
      platform: "Facebook",
      label: "Facebook",
      url: "https://facebook.com/liyanashrestha.official",
      handle: "Liyana Shrestha",
      featured: true,
      order: 3,
      enabled: true
    },
    {
      id: "social-4",
      platform: "Linktree",
      label: "Linktree",
      url: "https://linktr.ee/liyanashrestha",
      handle: "linktr.ee/liyanashrestha",
      featured: true,
      order: 4,
      enabled: true
    },
    {
      id: "social-5",
      platform: "TikTok",
      label: "TikTok",
      url: "https://tiktok.com/@liyanashrestha",
      handle: "@liyanashrestha",
      featured: false,
      order: 5,
      enabled: true
    }
  ],
  contact: {
    whatsappNumber: "+977 9800000000",
    whatsappMessage: "Hi Liyana, I came across your portfolio website and would love to collaborate on a creative project.",
    email: "contact@liyanashrestha.com",
    bookingTitle: "Collaborations & Projects",
    bookingText: "For brand campaigns, sponsored content, creative direction, or private commissions in Kathmandu and worldwide.",
    priceInfo: "Campaign packages tailored to scope",
    durationInfo: "Typical production turnaround: 5–10 days",
    availabilityMessage: "Currently accepting select brand collaborations & creative shoots for 2026.",
    isAvailable: true
  },
  proofs: [
    {
      id: "proof-1",
      title: "Vogue India Feature Spotlight",
      clientOrContext: "Editorial Feature",
      description: "Recognized among emerging South Asian visual creators redefining regional aesthetics.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
      order: 1,
      published: true,
      createdAt: "2026-01-10T00:00:00.000Z"
    },
    {
      id: "proof-2",
      title: "Himalayan Botanics Campaign",
      clientOrContext: "Brand Partnership",
      description: "Complete visual identity and reel series generating over 450K organic views.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      order: 2,
      published: true,
      createdAt: "2026-01-18T00:00:00.000Z"
    },
    {
      id: "proof-3",
      title: "Loom Heritage Silk Shoot",
      clientOrContext: "Fashion Lookbook",
      description: "Artisan textile series celebrated for authentic cultural preservation.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      order: 3,
      published: true,
      createdAt: "2026-02-01T00:00:00.000Z"
    },
    {
      id: "proof-4",
      title: "Audience Appreciation & Trust",
      clientOrContext: "Community Feedback",
      description: "Over 85,000 engaged followers across platforms engaging with genuine lifestyle narratives.",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      order: 4,
      published: true,
      createdAt: "2026-02-14T00:00:00.000Z"
    }
  ],
  settings: {
    siteTitle: "Liyana Shrestha — Digital Creator • Lifestyle • Kathmandu",
    metaDescription: "Stories, places and moments — captured as I see them. Official portfolio and editorial journal of Liyana Shrestha.",
    ogTitle: "Liyana Shrestha — Digital Creator • Lifestyle • Kathmandu",
    ogDescription: "Stories, places and moments — captured as I see them.",
    ogImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    favicon: "/favicon.ico",
    primaryEmail: "contact@liyanashrestha.com",
    footerText: "Stories, places and moments — captured as I see them."
  },
  media: [
    {
      id: "media-1",
      name: "hero-portrait-cinematic.jpg",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85",
      size: 1420500,
      type: "image/jpeg",
      uploadedAt: "2026-01-01T12:00:00.000Z"
    },
    {
      id: "media-2",
      name: "kathmandu-golden-hour.jpg",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85",
      size: 984000,
      type: "image/jpeg",
      uploadedAt: "2026-01-05T15:30:00.000Z"
    },
    {
      id: "media-3",
      name: "patan-shadows-lifestyle.jpg",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85",
      size: 1120000,
      type: "image/jpeg",
      uploadedAt: "2026-01-10T09:00:00.000Z"
    },
    {
      id: "media-4",
      name: "fashion-editorial-silk.jpg",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=85",
      size: 1340000,
      type: "image/jpeg",
      uploadedAt: "2026-01-15T14:20:00.000Z"
    },
    {
      id: "media-5",
      name: "himalayan-horizon-travel.jpg",
      url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=85",
      size: 1210000,
      type: "image/jpeg",
      uploadedAt: "2026-01-20T11:10:00.000Z"
    }
  ]
};
