import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FullDatabase } from './types';
import { initialData } from './data/initialData';
import { api } from './services/api';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { IntroSection } from './components/public/IntroSection';
import { StorySection } from './components/public/StorySection';
import { PhotographyGallery } from './components/public/PhotographyGallery';
import { AboutSection } from './components/public/AboutSection';
import { SocialSection } from './components/public/SocialSection';
import { ProofSection } from './components/public/ProofSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState<FullDatabase>(initialData);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);

  // Check URL query parameters for ?admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') !== null || window.location.pathname.startsWith('/admin')) {
      setIsAdminView(true);
    }
  }, []);

  // Fetch full live database content from server
  const loadData = async (authToken?: string | null) => {
    try {
      const activeToken = authToken !== undefined ? authToken : (token || localStorage.getItem('liyana_editorial_token'));
      let serverData: FullDatabase;
      if (activeToken) {
        serverData = await api.getAllContent(activeToken);
      } else {
        serverData = await api.getFullData();
      }

      if (serverData) {
        setData((prev) => ({
          ...prev,
          ...serverData,
          homepage: { ...prev.homepage, ...(serverData.homepage || {}) },
          about: { ...prev.about, ...(serverData.about || {}) },
          contact: { ...prev.contact, ...(serverData.contact || {}) },
          settings: { ...prev.settings, ...(serverData.settings || {}) },
          stories: Array.isArray(serverData.stories) ? serverData.stories : prev.stories,
          photos: Array.isArray(serverData.photos) ? serverData.photos : prev.photos,
          socialLinks: Array.isArray(serverData.socialLinks) ? serverData.socialLinks : prev.socialLinks,
          proofs: Array.isArray(serverData.proofs) ? serverData.proofs : prev.proofs,
          media: Array.isArray(serverData.media) ? serverData.media : prev.media,
        }));
      }
    } catch (err) {
      console.warn('Using local fallback seed data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(token);
  }, [token]);

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    setIsAdminView(false);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View is active
  if (isAdminView) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center text-[#77736D] text-xs uppercase tracking-widest font-mono">
          Verifying Session...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin onBackToSite={handleBackToSite} />;
    }

    return (
      <AdminLayout
        data={data}
        onRefresh={() => loadData(token)}
        onPreviewSite={handleBackToSite}
        onUpdateHomepage={(updated) => setData((prev) => ({ ...prev, homepage: updated }))}
        onUpdateAbout={(updated) => setData((prev) => ({ ...prev, about: updated }))}
        onUpdateContact={(updated) => setData((prev) => ({ ...prev, contact: updated }))}
        onUpdateSettings={(updated) => setData((prev) => ({ ...prev, settings: updated }))}
      />
    );
  }

  // Filter published content for public visitors
  const publishedStories = (data.stories || [])
    .filter((s) => s.published)
    .sort((a, b) => a.order - b.order);

  const publishedPhotos = (data.photos || [])
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  const publishedProofs = (data.proofs || [])
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717] selection:bg-[#171717] selection:text-[#F8F7F4] font-sans antialiased overflow-x-hidden">
      {/* Sticky Editorial Navigation */}
      <Navbar
        contact={data.contact}
        socialLinks={data.socialLinks || []}
        whatsappNumber={data.contact?.whatsappNumber}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Hero Section */}
      <Hero
        homepage={data.homepage}
      />

      {/* Introduction Section with Generous Whitespace */}
      <IntroSection
        homepage={data.homepage}
      />

      {/* Story / Narrative Chapters */}
      <StorySection
        stories={publishedStories}
        homepage={data.homepage}
      />

      {/* Photography Masonry & Categories */}
      <PhotographyGallery
        photos={publishedPhotos}
        homepage={data.homepage}
      />

      {/* About Profile & Philosophy */}
      <AboutSection
        about={data.about}
        homepage={data.homepage}
      />

      {/* Social Journey Links */}
      <SocialSection
        socialLinks={data.socialLinks || []}
      />

      {/* Proof / Collaborations */}
      <ProofSection
        proofs={publishedProofs}
        homepage={data.homepage}
      />

      {/* Contact & Inquiries */}
      <ContactSection
        contact={data.contact}
        socialLinks={data.socialLinks || []}
        homepage={data.homepage}
      />

      {/* Minimal Footer */}
      <Footer
        socialLinks={data.socialLinks || []}
        settings={data.settings}
        onOpenAdmin={handleOpenAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
