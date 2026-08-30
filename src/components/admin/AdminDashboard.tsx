import React from 'react';
import { Camera, BookOpen, Share2, Award, Image as ImageIcon, Eye, RefreshCw, CheckCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { FullDatabase } from '../../types';

interface AdminDashboardProps {
  data: FullDatabase;
  onNavigateTab: (tab: string) => void;
  onPreviewSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onNavigateTab,
  onPreviewSite
}) => {
  const publishedPhotosCount = (data.photos || []).filter((p) => p.published).length;
  const publishedStoriesCount = (data.stories || []).filter((s) => s.published).length;
  const activeLinksCount = (data.socialLinks || []).filter((l) => l.enabled).length;
  const activeProofsCount = (data.proofs || []).filter((p) => p.published).length;
  const mediaCount = (data.media || []).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#17171a] via-[#141416] to-[#17171a] border border-white/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Studio Active</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#f7f5f0] tracking-wide">
            Welcome, Liyana
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9a92] mt-1 max-w-xl font-light">
            Manage your personal brand, editorial stories, photography archives, and collaboration channels. Any changes made here immediately sync to your live website.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onPreviewSite}
            className="px-5 py-2.5 bg-[#f7f5f0] hover:bg-[#c5a880] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Live Site</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Photos Card */}
        <div
          onClick={() => onNavigateTab('photos')}
          className="bg-[#141416] border border-white/10 p-6 hover:border-[#c5a880]/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#c5a880]/10 text-[#c5a880] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#737069] group-hover:text-[#c5a880] transition-colors flex items-center gap-1">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-serif text-[#f7f5f0] mb-1">{data.photos?.length || 0}</div>
          <div className="text-xs uppercase tracking-wider text-[#9e9a92]">Portfolio Photos</div>
          <div className="text-[11px] text-[#c5a880] mt-2 font-mono">
            {publishedPhotosCount} Published
          </div>
        </div>

        {/* Stories Card */}
        <div
          onClick={() => onNavigateTab('story')}
          className="bg-[#141416] border border-white/10 p-6 hover:border-[#c5a880]/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#c5a880]/10 text-[#c5a880] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#737069] group-hover:text-[#c5a880] transition-colors flex items-center gap-1">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-serif text-[#f7f5f0] mb-1">{data.stories?.length || 0}</div>
          <div className="text-xs uppercase tracking-wider text-[#9e9a92]">Story Chapters</div>
          <div className="text-[11px] text-[#c5a880] mt-2 font-mono">
            {publishedStoriesCount} Active Chapters
          </div>
        </div>

        {/* Proofs Card */}
        <div
          onClick={() => onNavigateTab('proof')}
          className="bg-[#141416] border border-white/10 p-6 hover:border-[#c5a880]/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#c5a880]/10 text-[#c5a880] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#737069] group-hover:text-[#c5a880] transition-colors flex items-center gap-1">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-serif text-[#f7f5f0] mb-1">{data.proofs?.length || 0}</div>
          <div className="text-xs uppercase tracking-wider text-[#9e9a92]">Collaborations & Proof</div>
          <div className="text-[11px] text-[#c5a880] mt-2 font-mono">
            {activeProofsCount} Published
          </div>
        </div>

        {/* Media Library Card */}
        <div
          onClick={() => onNavigateTab('media')}
          className="bg-[#141416] border border-white/10 p-6 hover:border-[#c5a880]/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#c5a880]/10 text-[#c5a880] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#737069] group-hover:text-[#c5a880] transition-colors flex items-center gap-1">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-serif text-[#f7f5f0] mb-1">{mediaCount}</div>
          <div className="text-xs uppercase tracking-wider text-[#9e9a92]">Uploaded Media Assets</div>
          <div className="text-[11px] text-[#c5a880] mt-2 font-mono">
            Direct Cloud / Disk Storage
          </div>
        </div>

      </div>

      {/* Quick Launchpad & Content Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Quick Actions */}
        <div className="lg:col-span-2 bg-[#141416] border border-white/10 p-6 shadow-xl space-y-6">
          <h2 className="font-serif text-lg text-[#f7f5f0] tracking-wide">
            Content Launchpad
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigateTab('home')}
              className="p-4 bg-[#1b1b1e] hover:bg-[#202024] border border-white/5 text-left transition-colors flex items-start justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#f7f5f0] block font-medium mb-1">
                  Homepage & Hero
                </span>
                <span className="text-[11px] text-[#9e9a92]">
                  Edit headline, statement, hero photo & CTAs
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c5a880] shrink-0" />
            </button>

            <button
              onClick={() => onNavigateTab('photos')}
              className="p-4 bg-[#1b1b1e] hover:bg-[#202024] border border-white/5 text-left transition-colors flex items-start justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#f7f5f0] block font-medium mb-1">
                  Add New Photo
                </span>
                <span className="text-[11px] text-[#9e9a92]">
                  Upload high-res portrait, lifestyle, or travel shoot
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c5a880] shrink-0" />
            </button>

            <button
              onClick={() => onNavigateTab('story')}
              className="p-4 bg-[#1b1b1e] hover:bg-[#202024] border border-white/5 text-left transition-colors flex items-start justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#f7f5f0] block font-medium mb-1">
                  Editorial Chapter
                </span>
                <span className="text-[11px] text-[#9e9a92]">
                  Write narrative updates on your Kathmandu journey
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c5a880] shrink-0" />
            </button>

            <button
              onClick={() => onNavigateTab('contact')}
              className="p-4 bg-[#1b1b1e] hover:bg-[#202024] border border-white/5 text-left transition-colors flex items-start justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#f7f5f0] block font-medium mb-1">
                  WhatsApp & Rates
                </span>
                <span className="text-[11px] text-[#9e9a92]">
                  Update booking info, rates, and availability
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#c5a880] shrink-0" />
            </button>
          </div>
        </div>

        {/* Right: Site Profile Snapshot */}
        <div className="bg-[#141416] border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg text-[#f7f5f0] tracking-wide mb-3">
              Brand Profile Status
            </h2>

            <div className="space-y-3 text-xs text-[#b8b4ab]">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#737069]">Creator Name:</span>
                <span className="text-[#f7f5f0] font-medium">{data.about?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#737069]">Location:</span>
                <span className="text-[#f7f5f0] font-medium">{data.about?.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#737069]">WhatsApp:</span>
                <span className="text-[#c5a880] font-mono">{data.contact?.whatsappNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#737069]">Availability:</span>
                <span className="text-emerald-400 font-medium">Accepting Projects</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => onNavigateTab('about')}
              className="w-full py-2.5 bg-[#1b1b1e] hover:bg-[#c5a880] text-[#f7f5f0] hover:text-black text-xs uppercase tracking-wider transition-colors font-medium text-center block"
            >
              Edit Magazine Bio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
