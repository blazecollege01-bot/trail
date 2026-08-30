import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@liyanashrestha.com');
  const [password, setPassword] = useState('LiyanaAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleQuickFill = () => {
    setEmail('admin@liyanashrestha.com');
    setPassword('LiyanaAdmin2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#09090a] flex items-center justify-center p-6 relative overflow-hidden text-[#e8e6e1]">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Site */}
      <button
        onClick={onBackToSite}
        className="absolute top-8 left-8 text-xs uppercase tracking-[0.2em] text-[#9e9a92] hover:text-[#c5a880] transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Website</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#131315] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-none flex items-center justify-center mx-auto mb-4 text-[#c5a880]">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#f7f5f0] tracking-wide mb-1">
            CMS Portal
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-sans">
            Liyana Shrestha • Studio Admin
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800/40 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] mb-2 font-sans">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e6b64]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@liyanashrestha.com"
                className="w-full bg-[#1b1b1e] border border-white/10 pl-10 pr-4 py-3 text-sm text-[#f7f5f0] placeholder-[#5a5750] focus:border-[#c5a880] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#9e9a92] font-sans">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] text-[#c5a880] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e6b64]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1b1b1e] border border-white/10 pl-10 pr-10 py-3 text-sm text-[#f7f5f0] placeholder-[#5a5750] focus:border-[#c5a880] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6e6b64] hover:text-[#e8e6e1]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#c5a880] hover:bg-[#d8be96] text-black text-xs uppercase tracking-[0.25em] font-medium transition-colors disabled:opacity-50 mt-2 shadow-lg"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER CMS PANEL'}
          </button>
        </form>

        {/* Demo Quick-Fill Credentials Helper Box */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-[#18181b] border border-white/5 text-left text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#c5a880] font-medium">Default Credentials</span>
              <button
                onClick={handleQuickFill}
                className="text-[10px] text-[#c5a880] hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-[#a8a49c] font-mono text-[11px]">Email: admin@liyanashrestha.com</p>
            <p className="text-[#a8a49c] font-mono text-[11px]">Pass: LiyanaAdmin2026!</p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#141416] border border-white/10 p-6 max-w-sm w-full space-y-4">
            <h3 className="font-serif text-lg text-white">Password Recovery</h3>
            <p className="text-xs text-[#9e9a92]">
              For security, the default credentials are configured in your server environment. You can log in using:
            </p>
            <div className="p-3 bg-black/50 font-mono text-xs text-[#c5a880]">
              admin@liyanashrestha.com<br />
              LiyanaAdmin2026!
            </div>
            <p className="text-xs text-[#737069]">
              Once logged in, you can update your password anytime in the <strong>Settings</strong> tab.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#c5a880] text-black text-xs uppercase tracking-wider font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
