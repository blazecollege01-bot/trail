export type CategoryType = 'All' | 'Portrait' | 'Lifestyle' | 'Travel' | 'Evening' | 'Other';

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroStatement: string;
  heroImage: string;
  introImage?: string;
  introQuote?: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  storyIntroHeading: string;
  storyIntroText: string;
  photographyHeading: string;
  photographySubheading: string;
  proofHeading: string;
  proofSubheading: string;
  aboutSectionTitle: string;
  contactHeading: string;
  contactText: string;
  contactCtaText: string;
}

export interface StoryChapter {
  id: string;
  chapterNumber: string;
  title: string;
  heading: string;
  description: string;
  quote?: string;
  image: string;
  imageCaption?: string;
  layout: 'text-left' | 'text-right';
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Portrait' | 'Lifestyle' | 'Travel' | 'Evening' | 'Other';
  description: string;
  image: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  featured: boolean;
  order: number;
  published: boolean;
  location?: string;
  year?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutData {
  name: string;
  tagline: string;
  shortBio: string;
  fullBio: string;
  portraitImage: string;
  secondaryImage: string;
  location: string;
  focus: string;
  website: string;
  stats: Array<{ label: string; value: string }>;
  highlights: string[];
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'Facebook' | 'Linktree' | 'TikTok' | 'Email' | 'YouTube' | 'Other';
  label: string;
  url: string;
  handle: string;
  featured: boolean;
  order: number;
  enabled: boolean;
}

export interface ContactSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  bookingTitle: string;
  bookingText: string;
  priceInfo: string;
  durationInfo: string;
  availabilityMessage: string;
  isAvailable: boolean;
}

export interface ProofItem {
  id: string;
  title: string;
  clientOrContext: string;
  description: string;
  image: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
  primaryEmail: string;
  footerText: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface FullDatabase {
  homepage: HomepageSettings;
  stories: StoryChapter[];
  photos: PhotoItem[];
  about: AboutData;
  socialLinks: SocialLink[];
  contact: ContactSettings;
  proofs: ProofItem[];
  settings: SiteSettings;
  media: MediaItem[];
}
