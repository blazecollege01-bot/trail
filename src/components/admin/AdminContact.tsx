import React, { useState } from 'react';
import { MessageCircle, Mail, Clock, DollarSign, Sparkles } from 'lucide-react';
import { ContactSettings } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminContactProps {
  contact: ContactSettings;
  onUpdate: (updated: ContactSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminContact: React.FC<AdminContactProps> = ({ contact, onUpdate, showToast }) => {
  const { token } = useAuth();
  const [form, setForm] = useState<ContactSettings>({ ...contact });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (contact) {
      setForm({ ...contact });
    }
  }, [contact]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.updateContact(token, form);
      onUpdate(updated);
      showToast('Contact & Booking information updated!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save contact settings', 'error');
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
            Contact & Booking Settings
          </h2>
          <p className="text-xs text-[#9e9a92] mt-1 font-light">
            Configure direct WhatsApp dispatch, project pricing terms, email routing, and calendar availability.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
        >
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WhatsApp & Email Dispatch Card */}
        <div className="bg-[#141416] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium">
            <MessageCircle className="w-4 h-4" />
            <span>01. Direct Messaging</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="+977 984-1234567"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] font-mono focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Pre-filled WhatsApp Message
            </label>
            <textarea
              rows={3}
              value={form.whatsappMessage}
              onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
              placeholder="Hi Liyana, I would love to collaborate with you..."
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="inquiries@liyanashrestha.com"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>
        </div>

        {/* Booking Specs & Terms Card */}
        <div className="bg-[#141416] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-sans font-medium">
            <Sparkles className="w-4 h-4" />
            <span>02. Booking & Turnaround Terms</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Availability Status Message
            </label>
            <input
              type="text"
              value={form.availabilityMessage}
              onChange={(e) => setForm({ ...form, availabilityMessage: e.target.value })}
              placeholder="e.g. Currently accepting brand collaborations & editorial shoots in Nepal and abroad."
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Turnaround / Production Timeline
            </label>
            <input
              type="text"
              value={form.durationInfo}
              onChange={(e) => setForm({ ...form, durationInfo: e.target.value })}
              placeholder="e.g. 3-5 business days for deliverables"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Price Range / Rate Card Note
            </label>
            <input
              type="text"
              value={form.priceInfo || ''}
              onChange={(e) => setForm({ ...form, priceInfo: e.target.value })}
              placeholder="e.g. Campaign packages tailored to scope"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Booking Subject / Title
            </label>
            <input
              type="text"
              value={form.bookingTitle || ''}
              onChange={(e) => setForm({ ...form, bookingTitle: e.target.value })}
              placeholder="Collaborations & Projects"
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Booking Description
            </label>
            <textarea
              rows={2}
              value={form.bookingText || ''}
              onChange={(e) => setForm({ ...form, bookingText: e.target.value })}
              placeholder="For brand campaigns, sponsored content, creative direction..."
              className="w-full bg-[#1b1b1e] border border-white/10 px-4 py-2.5 text-sm text-[#f7f5f0] focus:border-[#c5a880] focus:outline-none resize-none"
            />
          </div>
        </div>

      </div>
    </form>
  );
};
