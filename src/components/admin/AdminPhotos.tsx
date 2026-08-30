import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff, Check, X, AlertTriangle, Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import { PhotoItem, CategoryType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminPhotosProps {
  photos: PhotoItem[];
  onRefresh: () => void;
  onUpdatePhotos?: (photos: PhotoItem[]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const PHOTO_PRESETS = [
  { label: 'Kathmandu Editorial', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', cat: 'Portrait' },
  { label: 'Golden Hour Silhouette', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', cat: 'Lifestyle' },
  { label: 'Himalayan Ridge', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', cat: 'Travel' },
  { label: 'High Fashion Studio', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', cat: 'Portrait' },
  { label: 'Atmospheric Night', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', cat: 'Evening' },
  { label: 'Vintage Film Look', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80', cat: 'Lifestyle' },
];

export const AdminPhotos: React.FC<AdminPhotosProps> = ({ photos, onRefresh, onUpdatePhotos, showToast }) => {
  const { token: ctxToken } = useAuth();
  const token = ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('liyana_admin_token') : null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PhotoItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories: CategoryType[] = ['Portrait', 'Lifestyle', 'Travel', 'Evening', 'Other'];

  const filteredPhotos = filterCategory === 'All'
    ? photos
    : photos.filter((p) => p.category.toLowerCase() === filterCategory.toLowerCase());

  const handleStartCreate = () => {
    setIsNew(true);
    setEditingPhoto({
      title: 'New Portrait',
      category: 'Portrait',
      description: 'Editorial capture in Kathmandu.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'portrait',
      featured: true,
      order: photos.length + 1,
      published: true,
      location: 'Kathmandu',
      year: '2026'
    });
  };

  const handleStartEdit = (photo: PhotoItem) => {
    setIsNew(false);
    setEditingPhoto({ ...photo });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!token) {
      showToast('Admin session expired. Please log in again.', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await api.uploadImage(token, e.target.files[0]);
      setEditingPhoto((prev) => (prev ? { ...prev, image: res.url } : null));
      showToast('Photo uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSaving(true);

    try {
      let updatedList: PhotoItem[];
      if (isNew) {
        const payload: PhotoItem = {
          id: editingPhoto.id || `photo-${Date.now()}`,
          title: editingPhoto.title || 'Untitled Capture',
          category: (editingPhoto.category as CategoryType) || 'Portrait',
          description: editingPhoto.description || '',
          image: editingPhoto.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
          aspectRatio: (editingPhoto.aspectRatio as any) || 'portrait',
          featured: Boolean(editingPhoto.featured),
          order: Number(editingPhoto.order) || photos.length + 1,
          published: editingPhoto.published !== false,
          location: editingPhoto.location || 'Kathmandu',
          year: editingPhoto.year || '2026',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedList = [...photos, payload];
        if (onUpdatePhotos) onUpdatePhotos(updatedList);
        if (token) {
          await api.createPhoto(token, editingPhoto);
        }
        showToast('Photo added to gallery!');
      } else if (editingPhoto.id) {
        updatedList = photos.map((p) => (p.id === editingPhoto.id ? { ...p, ...editingPhoto } as PhotoItem : p));
        if (onUpdatePhotos) onUpdatePhotos(updatedList);
        if (token) {
          await api.updatePhoto(token, editingPhoto.id, editingPhoto);
        }
        showToast('Photo details updated!');
      }
      setEditingPhoto(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const updatedList = photos.filter((p) => p.id !== deleteTarget.id);
      if (onUpdatePhotos) onUpdatePhotos(updatedList);
      if (token) {
        await api.deletePhoto(token, deleteTarget.id);
      }
      showToast('Photo deleted from gallery');
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete photo', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Photography Gallery Manager
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Upload new captures, organize categories, change display order, and publish to the live editorial grid.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Photo</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider ${
            filterCategory === 'All' ? 'bg-[#c5a880] text-black font-medium' : 'bg-[#18181b] text-[#9e9a92] hover:text-white'
          }`}
        >
          All ({photos.length})
        </button>
        {categories.map((cat) => {
          const count = photos.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider ${
                filterCategory === cat ? 'bg-[#c5a880] text-black font-medium' : 'bg-[#18181b] text-[#9e9a92] hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="bg-[#141416] border border-white/10 overflow-hidden group hover:border-[#c5a880]/50 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Photo Image */}
              <div className="relative aspect-[4/3] w-full bg-[#1b1b1e] overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#c5a880]">
                  {photo.category}
                </div>

                <div className="absolute top-3 right-3">
                  {photo.published ? (
                    <span className="text-[9px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5">
                      Published
                    </span>
                  ) : (
                    <span className="text-[9px] bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2 py-0.5">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#737069]">
                    #{photo.order < 10 ? `0${photo.order}` : photo.order}
                  </span>
                  {photo.location && (
                    <span className="text-[10px] text-[#9e9a92] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c5a880]" />
                      {photo.location}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base text-[#f7f5f0] tracking-wide uppercase font-medium line-clamp-1">
                  {photo.title}
                </h3>

                {photo.description && (
                  <p className="text-xs text-[#9e9a92] font-light line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between mt-2">
              <button
                onClick={() => handleStartEdit(photo)}
                className="text-xs uppercase tracking-wider text-[#c5a880] hover:text-white flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => setDeleteTarget(photo)}
                className="p-1.5 text-[#737069] hover:text-red-400 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Upload Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141416] border border-white/15 max-w-xl w-full p-6 sm:p-8 my-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-serif text-xl text-[#f7f5f0]">
                {isNew ? 'Add New Photo' : `Edit "${editingPhoto.title}"`}
              </h3>
              <button onClick={() => setEditingPhoto(null)} className="text-[#9e9a92] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  placeholder="e.g. LEOPARD"
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Category
                  </label>
                  <select
                    value={editingPhoto.category || 'Portrait'}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Evening">Evening</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.location || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                    placeholder="Kathmandu Studio"
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingPhoto.description || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                  placeholder="Short caption describing light, concept, or shoot..."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0] resize-none"
                />
              </div>

              {/* Photo Image URL, Preview & Upload */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] font-sans">
                  Photo Source URL or Upload
                </label>

                {editingPhoto.image && (
                  <div className="relative aspect-[4/3] w-full max-h-48 bg-[#1b1b1e] overflow-hidden border border-white/10 rounded-xs">
                    <img
                      src={editingPhoto.image}
                      alt="Photo preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#c5a880]">
                      Active Preview
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingPhoto.image || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0] font-mono"
                  />
                  <label className="px-3 py-2 bg-[#222226] hover:bg-[#2c2c30] text-xs cursor-pointer border border-white/10 flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Curated Presets */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-[#737069] block">
                    Curated Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingPhoto({ ...editingPhoto, image: preset.url, category: preset.cat as any })}
                        className={`text-[10px] px-2.5 py-1 border transition-colors ${
                          editingPhoto.image === preset.url
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingPhoto.order || 1}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, order: Number(e.target.value) })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Publish Status
                  </label>
                  <select
                    value={editingPhoto.published ? 'true' : 'false'}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, published: e.target.value === 'true' })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="true">Published (Visible in gallery)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-5 py-2 bg-[#1b1b1e] text-xs uppercase text-[#a8a49c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-wider font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#141416] border border-red-900/40 p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-serif text-lg text-white">Delete Photo?</h4>
            </div>
            <p className="text-xs text-[#9e9a92]">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-[#1b1b1e] text-xs uppercase text-[#9e9a92] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs uppercase font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
