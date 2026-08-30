import React, { useState } from 'react';
import { Upload, Plus, Trash2, Check, User } from 'lucide-react';
import { AboutData } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminAboutProps {
  about: AboutData;
  onUpdate: (updated: AboutData) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const PORTRAIT_PRESETS = [
  { label: 'Kathmandu Warm Light', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Classic Studio', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Minimalist Editorial', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Atmospheric Ambient', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminAbout: React.FC<AdminAboutProps> = ({ about, onUpdate, showToast }) => {
  const { token: ctxToken } = useAuth();
  const token = ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('liyana_admin_token') : null);
  const [form, setForm] = useState<AboutData>({ ...about });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');

  React.useEffect(() => {
    if (about) {
      setForm({ ...about });
    }
  }, [about]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!token) {
      showToast('Admin session expired. Please log in again.', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await api.uploadImage(token, e.target.files[0]);
      setForm((prev) => ({ ...prev, portraitImage: res.url }));
      showToast('Profile portrait uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm({
      ...form,
      highlights: [...(form.highlights || []), newHighlight.trim()]
    });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setForm({
      ...form,
      highlights: form.highlights.filter((_, i) => i !== index)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      onUpdate(form);
      if (token) {
        const updated = await api.updateAbout(token, form);
        onUpdate(updated);
      }
      showToast('Profile and About biography saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Error saving about details', 'error');
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
            About Profile & Bio
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Edit your magazine biography, portrait photography, location, and creative focus areas.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
        >
          {saving ? 'SAVING...' : 'SAVE PROFILE'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Portrait Upload (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#141416] border border-white/10 p-6 shadow-xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium block">
              Editorial Portrait
            </span>

            <div className="aspect-[3/4] w-full bg-[#1b1b1e] overflow-hidden border border-white/10 relative">
              <img
                src={form.portraitImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={form.portraitImage}
                onChange={(e) => setForm({ ...form, portraitImage: e.target.value })}
                placeholder="Portrait Image URL"
                className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0] font-mono"
              />
              <label className="w-full py-2.5 bg-[#222226] hover:bg-[#2c2c30] text-[#dedbd2] text-xs cursor-pointer border border-white/10 transition-colors flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{uploading ? 'Uploading...' : 'Upload New Portrait'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Curated Presets */}
              <div className="pt-2">
                <span className="text-[9px] uppercase tracking-wider text-[#737069] block mb-1.5">
                  Curated Portrait Presets:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PORTRAIT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setForm({ ...form, portraitImage: preset.url })}
                      className={`text-[9px] p-1.5 border text-center transition-colors truncate ${
                        form.portraitImage === preset.url
                          ? 'bg-[#c5a880] text-black border-[#c5a880] font-medium'
                          : 'bg-[#1b1b1e] text-[#9e9a92] border-white/10 hover:border-white/30'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text and Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#141416] border border-white/10 p-6 md:p-8 space-y-5 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
                  Creator Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
                  Tagline / Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
                Short Statement Bio (Pull Quote)
              </label>
              <textarea
                rows={2}
                required
                value={form.shortBio}
                onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
                className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
                Full Magazine Biography
              </label>
              <textarea
                rows={5}
                required
                value={form.fullBio}
                onChange={(e) => setForm({ ...form, fullBio: e.target.value })}
                className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
              />
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1 font-sans">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1 font-sans">
                  Focus Areas
                </label>
                <input
                  type="text"
                  value={form.focus}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1 font-sans">
                  Website Domain
                </label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
              </div>
            </div>

            {/* Highlights Editor */}
            <div className="pt-4 border-t border-white/5">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
                Key Highlights / Service Offerings
              </label>

              <div className="space-y-2 mb-3">
                {(form.highlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#1b1b1e] border border-white/5 text-xs text-[#dedbd2]">
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-[#737069] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="e.g. Brand Campaign Partnerships & Styling"
                  className="flex-1 bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-[#222226] hover:bg-[#c5a880] hover:text-black text-[#dedbd2] text-xs uppercase tracking-wider transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
};
