import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff, X, AlertTriangle, Award, Image as ImageIcon } from 'lucide-react';
import { ProofItem } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminProofProps {
  proofs: ProofItem[];
  onRefresh: () => void;
  onUpdateProofs?: (proofs: ProofItem[]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const PROOF_PRESETS = [
  { label: 'Magazine Editorial Cover', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', client: 'Vogue Nepal' },
  { label: 'Runway Partnership', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', client: 'Fashion Week' },
  { label: 'Luxury Brand Campaign', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80', client: 'Kathmandu Couture' },
  { label: 'Studio Showcase', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80', client: 'Heritage Collective' },
];

export const AdminProof: React.FC<AdminProofProps> = ({ proofs, onRefresh, onUpdateProofs, showToast }) => {
  const { token: ctxToken } = useAuth();
  const token = ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('liyana_admin_token') : null);
  const [editingProof, setEditingProof] = useState<Partial<ProofItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProofItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sorted = [...proofs].sort((a, b) => a.order - b.order);

  const handleStartCreate = () => {
    setIsNew(true);
    setEditingProof({
      title: 'Brand Partnership Feature',
      clientOrContext: 'Editorial Feature',
      description: 'Collaborative campaign and styling highlights.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      order: proofs.length + 1,
      published: true
    });
  };

  const handleStartEdit = (proof: ProofItem) => {
    setIsNew(false);
    setEditingProof({ ...proof });
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
      setEditingProof((prev) => (prev ? { ...prev, image: res.url } : null));
      showToast('Proof image uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProof) return;
    setSaving(true);
    try {
      let updatedList: ProofItem[];
      if (isNew) {
        const payload: ProofItem = {
          id: editingProof.id || `proof-${Date.now()}`,
          title: editingProof.title || 'New Collaboration',
          clientOrContext: editingProof.clientOrContext || 'Client Proof',
          description: editingProof.description || '',
          image: editingProof.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
          order: Number(editingProof.order) || proofs.length + 1,
          published: editingProof.published !== false,
          createdAt: new Date().toISOString()
        };
        updatedList = [...proofs, payload];
        if (onUpdateProofs) onUpdateProofs(updatedList);
        if (token) {
          await api.createProof(token, editingProof);
        }
        showToast('Proof item added successfully!');
      } else if (editingProof.id) {
        updatedList = proofs.map((p) => (p.id === editingProof.id ? { ...p, ...editingProof } as ProofItem : p));
        if (onUpdateProofs) onUpdateProofs(updatedList);
        if (token) {
          await api.updateProof(token, editingProof.id, editingProof);
        }
        showToast('Proof item updated!');
      }
      setEditingProof(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save proof', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const updatedList = proofs.filter((p) => p.id !== deleteTarget.id);
      if (onUpdateProofs) onUpdateProofs(updatedList);
      if (token) {
        await api.deleteProof(token, deleteTarget.id);
      }
      showToast('Proof item deleted');
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete proof', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Collaborations & Proof Gallery
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Manage screenshots, magazine feature credentials, campaign case studies, and brand testimonials.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Proof</span>
        </button>
      </div>

      {/* Proof Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#141416] border border-white/10 overflow-hidden shadow-lg group hover:border-[#c5a880]/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] w-full bg-[#1b1b1e] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#c5a880]">
                  {item.clientOrContext || 'Proof'}
                </div>

                <div className="absolute top-3 right-3">
                  {item.published ? (
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

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#737069]">
                  <span className="font-mono">#{item.order < 10 ? `0${item.order}` : item.order}</span>
                  <span>{item.clientOrContext}</span>
                </div>

                <h3 className="font-serif text-base text-[#f7f5f0] tracking-wide font-normal">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-[#9e9a92] font-light line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between mt-2">
              <button
                onClick={() => handleStartEdit(item)}
                className="text-xs uppercase tracking-wider text-[#c5a880] hover:text-white flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => setDeleteTarget(item)}
                className="p-1.5 text-[#737069] hover:text-red-400 transition-colors"
                title="Delete proof"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141416] border border-white/15 max-w-lg w-full p-6 sm:p-8 my-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-xl text-[#f7f5f0]">
                {isNew ? 'Add Proof Item' : 'Edit Proof Item'}
              </h3>
              <button onClick={() => setEditingProof(null)} className="text-[#9e9a92] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProof.title || ''}
                  onChange={(e) => setEditingProof({ ...editingProof, title: e.target.value })}
                  placeholder="e.g. Kathmandu Heritage Campaign"
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-sm text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Client / Context
                </label>
                <input
                  type="text"
                  value={editingProof.clientOrContext || ''}
                  onChange={(e) => setEditingProof({ ...editingProof, clientOrContext: e.target.value })}
                  placeholder="e.g. Vogue Nepal or Brand Partnership"
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProof.description || ''}
                  onChange={(e) => setEditingProof({ ...editingProof, description: e.target.value })}
                  placeholder="Brief note about the project outcome..."
                  className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0] resize-none"
                />
              </div>

              {/* Image, Preview and Upload */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] font-sans">
                  Proof Image Source or Upload
                </label>

                {editingProof.image && (
                  <div className="relative aspect-[16/10] w-full max-h-48 bg-[#1b1b1e] overflow-hidden border border-white/10 rounded-xs">
                    <img
                      src={editingProof.image}
                      alt="Proof preview"
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
                    value={editingProof.image || ''}
                    onChange={(e) => setEditingProof({ ...editingProof, image: e.target.value })}
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
                    Curated Proof / Campaign Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PROOF_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingProof({ ...editingProof, image: preset.url, clientOrContext: preset.client })}
                        className={`text-[10px] px-2.5 py-1 border transition-colors ${
                          editingProof.image === preset.url
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingProof.order || 1}
                    onChange={(e) => setEditingProof({ ...editingProof, order: Number(e.target.value) })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9e9a92] mb-1 font-sans">
                    Publish Status
                  </label>
                  <select
                    value={editingProof.published ? 'true' : 'false'}
                    onChange={(e) => setEditingProof({ ...editingProof, published: e.target.value === 'true' })}
                    className="w-full bg-[#1b1b1e] border border-white/10 px-3 py-2 text-xs text-[#f7f5f0]"
                  >
                    <option value="true">Published</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProof(null)}
                  className="px-4 py-2 bg-[#1b1b1e] text-xs uppercase text-[#9e9a92]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Proof'}
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
              <h4 className="font-serif text-lg text-white">Delete Proof?</h4>
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
