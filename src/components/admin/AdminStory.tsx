import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff, Check, X, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { StoryChapter } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminStoryProps {
  stories: StoryChapter[];
  onRefresh: () => void;
  onUpdateStories?: (stories: StoryChapter[]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const STORY_PRESET_IMAGES = [
  { label: 'Kathmandu Street', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Sunset Rooftop', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Heritage Texture', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Monochrome Film', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Warm Daylight', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1600&q=85' },
];

export const AdminStory: React.FC<AdminStoryProps> = ({ stories, onRefresh, onUpdateStories, showToast }) => {
  const { token: ctxToken } = useAuth();
  const token = ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('liyana_admin_token') : null);
  const [editingChapter, setEditingChapter] = useState<Partial<StoryChapter> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoryChapter | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sorted = [...stories].sort((a, b) => a.order - b.order);

  const handleStartCreate = () => {
    setIsNew(true);
    setEditingChapter({
      chapterNumber: `0${stories.length + 1}`,
      title: 'NEW CHAPTER',
      heading: 'Everyday Moments in Kathmandu',
      description: 'Describe the emotion, place, or journey in detail...',
      quote: 'A memorable thought or aesthetic statement.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
      imageCaption: 'Kathmandu, 2026',
      layout: stories.length % 2 === 0 ? 'text-left' : 'text-right',
      order: stories.length + 1,
      published: true
    });
  };

  const handleStartEdit = (chapter: StoryChapter) => {
    setIsNew(false);
    setEditingChapter({ ...chapter });
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
      setEditingChapter((prev) => (prev ? { ...prev, image: res.url } : null));
      showToast('Chapter image uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;
    setSaving(true);

    try {
      let updatedList: StoryChapter[];
      if (isNew) {
        const payload = {
          ...editingChapter,
          id: editingChapter.id || `story-${Date.now()}`,
          order: Number(editingChapter.order) || stories.length + 1,
          published: editingChapter.published !== false
        } as StoryChapter;
        updatedList = [...stories, payload];
        if (onUpdateStories) onUpdateStories(updatedList);
        if (token) {
          await api.createStory(token, editingChapter);
        }
        showToast('Story chapter created successfully!');
      } else if (editingChapter.id) {
        updatedList = stories.map((s) => (s.id === editingChapter.id ? { ...s, ...editingChapter } as StoryChapter : s));
        if (onUpdateStories) onUpdateStories(updatedList);
        if (token) {
          await api.updateStory(token, editingChapter.id, editingChapter);
        }
        showToast('Story chapter updated!');
      }
      setEditingChapter(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save story chapter', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const updatedList = stories.filter((s) => s.id !== deleteTarget.id);
      if (onUpdateStories) onUpdateStories(updatedList);
      if (token) {
        await api.deleteStory(token, deleteTarget.id);
      }
      showToast('Story chapter deleted');
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete chapter', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Editorial Story Chapters
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Manage your narrative timeline, chapters, photos, quotes, and alternating editorial layouts.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Chapter</span>
        </button>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {sorted.map((chapter) => (
          <div
            key={chapter.id}
            className="bg-[#141416] border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-all shadow-lg"
          >
            {/* Image Preview & Title */}
            <div className="flex items-center space-x-5">
              <div className="w-20 h-24 bg-[#1b1b1e] border border-white/10 overflow-hidden shrink-0">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-xs uppercase tracking-widest text-[#c5a880] font-mono">
                    Chapter {chapter.chapterNumber}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#737069] font-sans">
                    Order: {chapter.order}
                  </span>
                  {chapter.published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/40">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 border border-amber-800/40">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg text-[#f7f5f0] tracking-wide">
                  {chapter.title}
                </h3>
                <p className="text-xs text-[#a8a49c] line-clamp-1 max-w-xl mt-0.5">
                  {chapter.heading}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => handleStartEdit(chapter)}
                className="px-3.5 py-2 bg-[#1b1b1e] hover:bg-[#c5a880] text-[#dedbd2] hover:text-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-white/5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => setDeleteTarget(chapter)}
                className="p-2 bg-[#1b1b1e] hover:bg-red-950/60 text-[#8e8b83] hover:text-red-400 border border-white/5 transition-colors"
                title="Delete Chapter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141416] border border-white/15 max-w-2xl w-full p-6 sm:p-8 my-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-serif text-xl text-[#f7f5f0]">
                {isNew ? 'Create New Story Chapter' : `Edit Chapter ${editingChapter.chapterNumber}`}
              </h3>
              <button
                onClick={() => setEditingChapter(null)}
                className="text-[#9e9a92] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Chapter Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingChapter.chapterNumber || ''}
                    onChange={(e) => setEditingChapter({ ...editingChapter, chapterNumber: e.target.value })}
                    placeholder="01"
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingChapter.title || ''}
                    onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                    placeholder="THE BEGINNING"
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Main Headline / Intro Hook
                </label>
                <input
                  type="text"
                  required
                  value={editingChapter.heading || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, heading: e.target.value })}
                  placeholder="I am Liyana. I live in Kathmandu."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Full Story Narrative
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingChapter.description || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, description: e.target.value })}
                  placeholder="Write your story..."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Pull Quote (Optional)
                </label>
                <input
                  type="text"
                  value={editingChapter.quote || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, quote: e.target.value })}
                  placeholder="An editorial quote..."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                />
              </div>

              {/* Image, Preview and Upload */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] font-sans">
                  Chapter Image Source
                </label>
                
                {editingChapter.image && (
                  <div className="relative aspect-[16/9] w-full max-h-48 bg-[#1b1b1e] overflow-hidden border border-white/10 rounded-xs">
                    <img
                      src={editingChapter.image}
                      alt="Chapter preview"
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
                    value={editingChapter.image || ''}
                    onChange={(e) => setEditingChapter({ ...editingChapter, image: e.target.value })}
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

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-[#737069] block">
                    Curated Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {STORY_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingChapter({ ...editingChapter, image: preset.url })}
                        className={`text-[10px] px-2.5 py-1 border transition-colors ${
                          editingChapter.image === preset.url
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Layout
                  </label>
                  <select
                    value={editingChapter.layout || 'text-left'}
                    onChange={(e) => setEditingChapter({ ...editingChapter, layout: e.target.value as any })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="text-left">Text Left | Image Right</option>
                    <option value="text-right">Image Left | Text Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingChapter.order || 1}
                    onChange={(e) => setEditingChapter({ ...editingChapter, order: Number(e.target.value) })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Publish Status
                  </label>
                  <select
                    value={editingChapter.published ? 'true' : 'false'}
                    onChange={(e) => setEditingChapter({ ...editingChapter, published: e.target.value === 'true' })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingChapter(null)}
                  className="px-5 py-2.5 bg-[#1b1b1e] text-[#a8a49c] hover:text-white text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-wider font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
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
              <h4 className="font-serif text-lg text-white">Delete Chapter?</h4>
            </div>
            <p className="text-xs text-[#9e9a92]">
              Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.
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
