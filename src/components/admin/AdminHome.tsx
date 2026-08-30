import React, { useState } from 'react';
import { Upload, Check, Image as ImageIcon } from 'lucide-react';
import { HomepageSettings } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminHomeProps {
  homepage: HomepageSettings;
  onUpdate: (updated: HomepageSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminHome: React.FC<AdminHomeProps> = ({ homepage, onUpdate, showToast }) => {
  const { token } = useAuth();
  const [form, setForm] = useState<HomepageSettings>({ ...homepage });
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingIntro, setUploadingIntro] = useState(false);

  React.useEffect(() => {
    if (homepage) {
      setForm({ ...homepage });
    }
  }, [homepage]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !token) return;
    setUploadingHero(true);
    try {
      const res = await api.uploadImage(token, e.target.files[0]);
      setForm((prev) => ({ ...prev, heroImage: res.url }));
      showToast('Hero background uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload hero image', 'error');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleIntroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !token) return;
    setUploadingIntro(true);
    try {
      const res = await api.uploadImage(token, e.target.files[0]);
      setForm((prev) => ({ ...prev, introImage: res.url }));
      showToast('Introduction background uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload intro image', 'error');
    } finally {
      setUploadingIntro(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.updateHomepage(token, form);
      onUpdate(updated);
      showToast('Homepage content saved and live!');
    } catch (err: any) {
      showToast(err.message || 'Error saving homepage', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Homepage & Hero Content
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Edit main banner titles, statement quote, hero photography, and section headings.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
        >
          {saving ? 'SAVING...' : 'SAVE HOMEPAGE'}
        </button>
      </div>

      {/* Hero Section Card */}
      <div className="bg-[#141416] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium block">
          01. Hero Banner
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Main Name / Title
            </label>
            <input
              type="text"
              required
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Subtitle / Category
            </label>
            <input
              type="text"
              required
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
            Hero Statement / Quote
          </label>
          <input
            type="text"
            required
            value={form.heroStatement}
            onChange={(e) => setForm({ ...form, heroStatement: e.target.value })}
            className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
          />
        </div>

        {/* Hero Background Image Picker */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
            Hero Background Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-32 h-20 bg-[#1b1b1e] border border-white/10 overflow-hidden shrink-0">
              <img
                src={form.heroImage}
                alt="Hero Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                placeholder="https://... or /uploads/..."
                className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0] font-mono focus:border-[#c5a880] focus:outline-none"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#222226] hover:bg-[#2c2c30] text-[#dedbd2] text-xs cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{uploadingHero ? 'Uploading image...' : 'Upload New Hero Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  className="hidden"
                  disabled={uploadingHero}
                />
              </label>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <div className="space-y-3">
            <span className="text-xs text-[#c5a880] font-medium uppercase tracking-wider block">Primary CTA Button</span>
            <input
              type="text"
              value={form.heroCta1Text}
              onChange={(e) => setForm({ ...form, heroCta1Text: e.target.value })}
              placeholder="Button Label (e.g. EXPLORE MY STORY)"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0]"
            />
            <input
              type="text"
              value={form.heroCta1Link}
              onChange={(e) => setForm({ ...form, heroCta1Link: e.target.value })}
              placeholder="Target Link (e.g. #story)"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0] font-mono"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs text-[#c5a880] font-medium uppercase tracking-wider block">Secondary CTA Button</span>
            <input
              type="text"
              value={form.heroCta2Text}
              onChange={(e) => setForm({ ...form, heroCta2Text: e.target.value })}
              placeholder="Button Label (e.g. VIEW PHOTOGRAPHS)"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0]"
            />
            <input
              type="text"
              value={form.heroCta2Link}
              onChange={(e) => setForm({ ...form, heroCta2Link: e.target.value })}
              placeholder="Target Link (e.g. #photography)"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Introduction: A Little About Me Background & Details */}
      <div className="bg-[#141416] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium block">
          02. Introduction Banner & Quote
        </span>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
            Introduction Lead Quote
          </label>
          <input
            type="text"
            value={form.introQuote || ''}
            onChange={(e) => setForm({ ...form, introQuote: e.target.value })}
            placeholder="I create, explore and document the moments, places and people that inspire me."
            className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
          />
        </div>

        {/* Intro Background Image Picker */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
            Introduction Section Background Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-32 h-20 bg-[#1b1b1e] border border-white/10 overflow-hidden shrink-0">
              <img
                src={form.introImage || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85"}
                alt="Intro Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={form.introImage || ''}
                onChange={(e) => setForm({ ...form, introImage: e.target.value })}
                placeholder="https://... or /uploads/..."
                className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2 text-xs text-[#f7f5f0] font-mono focus:border-[#c5a880] focus:outline-none"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#222226] hover:bg-[#2c2c30] text-[#dedbd2] text-xs cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{uploadingIntro ? 'Uploading image...' : 'Upload Intro Background'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIntroUpload}
                  className="hidden"
                  disabled={uploadingIntro}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section Headings Customization */}
      <div className="bg-[#141416] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium block">
          03. Section Titles & Intros
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Story Section Heading
            </label>
            <input
              type="text"
              value={form.storyIntroHeading}
              onChange={(e) => setForm({ ...form, storyIntroHeading: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Photography Section Heading
            </label>
            <input
              type="text"
              value={form.photographyHeading}
              onChange={(e) => setForm({ ...form, photographyHeading: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
            Story Intro Subheading
          </label>
          <textarea
            rows={2}
            value={form.storyIntroText}
            onChange={(e) => setForm({ ...form, storyIntroText: e.target.value })}
            className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
          />
        </div>
      </div>
    </form>
  );
};
