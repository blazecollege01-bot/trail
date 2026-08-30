import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Link as LinkIcon, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { SocialLink } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminLinksProps {
  socialLinks: SocialLink[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminLinks: React.FC<AdminLinksProps> = ({ socialLinks, onRefresh, showToast }) => {
  const { token } = useAuth();
  const [editingLink, setEditingLink] = useState<Partial<SocialLink> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const sorted = [...socialLinks].sort((a, b) => a.order - b.order);

  const handleStartCreate = () => {
    setIsNew(true);
    setEditingLink({
      platform: 'Instagram',
      url: 'https://instagram.com/',
      label: 'Instagram',
      enabled: true,
      order: socialLinks.length + 1
    });
  };

  const handleStartEdit = (link: SocialLink) => {
    setIsNew(false);
    setEditingLink({ ...link });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !token) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.createSocial(token, editingLink);
        showToast('Social link created!');
      } else if (editingLink.id) {
        await api.updateSocial(token, editingLink.id, editingLink);
        showToast('Social link updated!');
      }
      setEditingLink(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save link', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await api.deleteSocial(token, id);
      showToast('Social link removed');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove link', 'error');
    }
  };

  const handleToggle = async (link: SocialLink) => {
    if (!token) return;
    try {
      await api.updateSocial(token, link.id, { enabled: !link.enabled });
      onRefresh();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Social Channels & Links
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Manage public Instagram, TikTok, Linktree, WhatsApp, and Facebook touchpoints.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {sorted.map((link) => (
          <div
            key={link.id}
            className="bg-[#141416] border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-lg hover:border-white/20 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 bg-[#1b1b1e] border border-white/5 flex items-center justify-center text-[#c5a880]">
                <LinkIcon className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base text-[#f7f5f0] font-medium">
                    {link.label || link.platform}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#737069] bg-white/5 px-2 py-0.5 font-sans">
                    {link.platform}
                  </span>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#9e9a92] hover:text-[#c5a880] font-mono truncate max-w-xs sm:max-w-md block"
                >
                  {link.url}
                </a>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => handleToggle(link)}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium border ${
                  link.enabled
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-white/5 text-[#737069] border-white/10'
                }`}
              >
                {link.enabled ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => handleStartEdit(link)}
                className="p-2 bg-[#1b1b1e] hover:bg-[#c5a880] text-[#a8a49c] hover:text-black transition-colors"
                title="Edit link"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(link.id)}
                className="p-2 bg-[#1b1b1e] hover:bg-red-950/60 text-[#737069] hover:text-red-400 transition-colors"
                title="Delete link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="bg-[#141416] border border-white/15 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-lg text-[#f7f5f0]">
                {isNew ? 'Add Social Channel' : 'Edit Channel'}
              </h3>
              <button onClick={() => setEditingLink(null)} className="text-[#9e9a92] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Platform
                </label>
                <select
                  value={editingLink.platform || 'Instagram'}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Linktree">Linktree</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Button Label
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.label || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  placeholder="e.g. Instagram Official"
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  URL / Profile Link
                </label>
                <input
                  type="url"
                  required
                  value={editingLink.url || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingLink.order || 1}
                    onChange={(e) => setEditingLink({ ...editingLink, order: Number(e.target.value) })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Status
                  </label>
                  <select
                    value={editingLink.enabled ? 'true' : 'false'}
                    onChange={(e) => setEditingLink({ ...editingLink, enabled: e.target.value === 'true' })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 bg-[#1b1b1e] text-xs uppercase text-[#9e9a92]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
