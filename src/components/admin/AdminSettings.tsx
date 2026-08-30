import React, { useState } from 'react';
import { Lock, Shield, Palette, Globe, KeyRound } from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdate: (updated: SiteSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdate, showToast }) => {
  const { token } = useAuth();
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setForm({ ...settings });
    }
  }, [settings]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.updateSettings(token, form);
      onUpdate(updated);
      showToast('Site and SEO settings updated!');
    } catch (err: any) {
      showToast(err.message || 'Error updating settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (!token) return;

    setPwdLoading(true);
    try {
      await api.changePassword(token, currentPassword, newPassword);
      showToast('Admin password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h2 className="font-serif text-2xl text-[#f7f5f0] tracking-wide">
          Settings & Security
        </h2>
        <p className="text-xs text-[#9e9a92] mt-1 font-light">
          Manage website metadata, SEO configuration, primary brand accent color, and admin authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEO & Meta Config */}
        <form onSubmit={handleSaveSettings} className="bg-[#141416] border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium">
            <Globe className="w-4 h-4" />
            <span>01. SEO & Brand Info</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Website Title Tag
            </label>
            <input
              type="text"
              required
              value={form.siteTitle || ''}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Meta Tag Description
            </label>
            <textarea
              rows={3}
              required
              value={form.metaDescription || ''}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Primary Contact Email
            </label>
            <input
              type="email"
              value={form.primaryEmail || ''}
              onChange={(e) => setForm({ ...form, primaryEmail: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Footer Text / Tagline
            </label>
            <input
              type="text"
              value={form.footerText || ''}
              onChange={(e) => setForm({ ...form, footerText: e.target.value })}
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 mt-4"
          >
            {saving ? 'Saving...' : 'Save Website Metadata'}
          </button>
        </form>

        {/* Security & Password Change */}
        <form onSubmit={handlePasswordChange} className="bg-[#141416] border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium">
            <Shield className="w-4 h-4" />
            <span>02. Change Admin Password</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-1.5 font-sans">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="w-full py-3 bg-[#222226] hover:bg-[#c5a880] text-[#dedbd2] hover:text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 mt-4 border border-white/10"
          >
            {pwdLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  );
};
