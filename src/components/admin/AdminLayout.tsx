import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Camera,
  User,
  Share2,
  PhoneCall,
  Award,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  Eye,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullDatabase } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminHome } from './AdminHome';
import { AdminStory } from './AdminStory';
import { AdminPhotos } from './AdminPhotos';
import { AdminAbout } from './AdminAbout';
import { AdminLinks } from './AdminLinks';
import { AdminContact } from './AdminContact';
import { AdminProof } from './AdminProof';
import { AdminMedia } from './AdminMedia';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  data: FullDatabase;
  onRefresh: () => void;
  onPreviewSite: () => void;
  onUpdateHomepage: (data: any) => void;
  onUpdateAbout: (data: any) => void;
  onUpdateContact: (data: any) => void;
  onUpdateSettings: (data: any) => void;
  onUpdateStories?: (stories: any) => void;
  onUpdatePhotos?: (photos: any) => void;
  onUpdateProofs?: (proofs: any) => void;
  onUpdateSocialLinks?: (links: any) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  data,
  onRefresh,
  onPreviewSite,
  onUpdateHomepage,
  onUpdateAbout,
  onUpdateContact,
  onUpdateSettings,
  onUpdateStories,
  onUpdatePhotos,
  onUpdateProofs,
  onUpdateSocialLinks
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'home', label: 'Home & Hero', icon: Home },
    { id: 'story', label: 'Story Chapters', icon: BookOpen },
    { id: 'photos', label: 'Photography', icon: Camera },
    { id: 'about', label: 'About & Bio', icon: User },
    { id: 'links', label: 'Social Channels', icon: Share2 },
    { id: 'contact', label: 'Contact & Booking', icon: PhoneCall },
    { id: 'proof', label: 'Proof & Features', icon: Award },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Settings & SEO', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#09090a] text-[#dedbd2] flex flex-col md:flex-row antialiased selection:bg-[#c5a880] selection:text-black">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border shadow-2xl text-xs uppercase tracking-wider font-medium backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-800 text-red-200'
                : 'bg-[#18181b]/95 border-[#c5a880]/60 text-[#f7f5f0]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#111113] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-lg text-[#f7f5f0] tracking-wider">LIYANA</span>
          <span className="text-[10px] uppercase text-[#c5a880] font-sans tracking-widest bg-black/40 px-2 py-0.5 border border-white/5">
            CMS
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onPreviewSite}
            className="p-2 text-xs bg-[#1b1b1e] text-[#f7f5f0] border border-white/10 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 bg-[#1b1b1e] text-[#f7f5f0] border border-white/10"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0e0e10] border-r border-white/10 z-40 flex flex-col justify-between transition-transform duration-300 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-serif text-xl text-[#f7f5f0] tracking-wider block">
                LIYANA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#c5a880] font-sans">
                Studio CMS Admin
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#c5a880]" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-[0.18em] font-sans transition-all text-left ${
                    isActive
                      ? 'bg-[#c5a880] text-black font-semibold'
                      : 'text-[#9e9a92] hover:text-[#f7f5f0] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#737069]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions Bottom */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#0a0a0c]">
          <div className="flex items-center justify-between px-2 text-xs text-[#737069]">
            <span className="truncate max-w-[120px]">{user?.email || 'admin'}</span>
            <span className="text-[9px] text-[#c5a880] uppercase tracking-wider font-mono">
              {user?.role || 'admin'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onPreviewSite}
              className="py-2 bg-[#18181b] hover:bg-[#222226] text-[#dedbd2] text-[11px] uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Live Site</span>
            </button>

            <button
              onClick={logout}
              className="py-2 bg-[#18181b] hover:bg-red-950/60 text-[#dedbd2] hover:text-red-300 text-[11px] uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              data={data}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onPreviewSite={onPreviewSite}
            />
          )}

          {activeTab === 'home' && (
            <AdminHome
              homepage={data.homepage}
              onUpdate={onUpdateHomepage}
              showToast={showToast}
            />
          )}

          {activeTab === 'story' && (
            <AdminStory
              stories={data.stories || []}
              onRefresh={onRefresh}
              onUpdateStories={onUpdateStories}
              showToast={showToast}
            />
          )}

          {activeTab === 'photos' && (
            <AdminPhotos
              photos={data.photos || []}
              onRefresh={onRefresh}
              onUpdatePhotos={onUpdatePhotos}
              showToast={showToast}
            />
          )}

          {activeTab === 'about' && (
            <AdminAbout
              about={data.about}
              onUpdate={onUpdateAbout}
              showToast={showToast}
            />
          )}

          {activeTab === 'links' && (
            <AdminLinks
              socialLinks={data.socialLinks || []}
              onRefresh={onRefresh}
              onUpdateSocialLinks={onUpdateSocialLinks}
              showToast={showToast}
            />
          )}

          {activeTab === 'contact' && (
            <AdminContact
              contact={data.contact}
              onUpdate={onUpdateContact}
              showToast={showToast}
            />
          )}

          {activeTab === 'proof' && (
            <AdminProof
              proofs={data.proofs || []}
              onRefresh={onRefresh}
              onUpdateProofs={onUpdateProofs}
              showToast={showToast}
            />
          )}

          {activeTab === 'media' && (
            <AdminMedia
              media={data.media || []}
              onRefresh={onRefresh}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={data.settings}
              onUpdate={onUpdateSettings}
              showToast={showToast}
            />
          )}
        </div>
      </main>

    </div>
  );
};
