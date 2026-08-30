import React, { useState } from 'react';
import { Upload, Copy, Check, Trash2, Eye, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { MediaItem } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminMediaProps {
  media: MediaItem[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ media, onRefresh, showToast }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !token) return;
    setUploading(true);
    try {
      await api.uploadImage(token, e.target.files[0]);
      showToast('Asset uploaded to media library!');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await api.deleteMedia(token, id);
      showToast('Media file removed');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove media', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
            Media Asset Library
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Central repository for high-resolution portraits, story backgrounds, and editorial banners.
          </p>
        </div>

        <label className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-lg">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload New File'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Zone */}
      <label className="border-2 border-dashed border-white/15 hover:border-[#c5a880]/60 transition-colors p-8 bg-[#141416] flex flex-col items-center justify-center cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-[#1b1b1e] border border-white/10 flex items-center justify-center text-[#c5a880] mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#f7f5f0] font-sans font-medium mb-1">
          {uploading ? 'Processing & Optimizing Image...' : 'Click to Upload or Drag & Drop'}
        </p>
        <p className="text-[11px] text-[#737069]">
          Supports high-res PNG, JPG, JPEG, WEBP files
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-[#141416] border border-white/10 overflow-hidden group hover:border-[#c5a880]/50 transition-all flex flex-col justify-between shadow-lg"
          >
            <div className="relative aspect-square w-full bg-[#1b1b1e] overflow-hidden">
              <img
                src={item.url}
                alt={item.name || 'Media Asset'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setPreviewImage(item)}
                  className="p-2 bg-black/80 text-white hover:text-[#c5a880] transition-colors"
                  title="View fullscreen"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className="p-2 bg-black/80 text-white hover:text-[#c5a880] transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 space-y-1">
              <p className="text-xs text-[#dedbd2] truncate font-mono">
                {item.name || item.url.split('/').pop()}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#737069]">
                <span>{item.size ? `${(item.size / 1024).toFixed(0)} KB` : 'Image'}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4"
        >
          <div className="max-w-4xl max-h-[85vh] p-2 bg-[#141416] border border-white/10">
            <img
              src={previewImage.url}
              alt={previewImage.filename}
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
