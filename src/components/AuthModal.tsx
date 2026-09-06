import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setLoading(true);

    const res = isRegister
      ? await register(username.trim(), password.trim())
      : await login(username.trim(), password.trim());

    setLoading(false);
    if (res.success) {
      setUsername("");
      setPassword("");
      onClose();
    } else {
      setError(res.error || "Authentication failed");
    }
  };

  const handleAdminQuickLogin = async () => {
    setError(null);
    setLoading(true);
    const res = await login("admin", "admin123");
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Admin login failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl grid place-items-center p-4 animate-fade-in">
      <div className="w-full max-w-md glass-card-premium p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 grid place-items-center text-white/60 hover:text-white transition-all"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#18E29A] to-[#6D5EF8] mx-auto mb-3 grid place-items-center text-black font-black text-xl shadow-lg">
            W
          </div>
          <h2 className="text-2xl font-black font-heading text-white">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-white/60 mt-1">
            {isRegister
              ? "Join Wavelength to personalize your music experience"
              : "Log in to access your playlists & admin dashboard"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-300 text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">Username</label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. music_lover or admin"
              className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl btn-glow-primary text-xs font-extrabold text-black shadow-lg hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-3 items-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs font-bold text-white/70 hover:text-[#18E29A] transition-colors"
          >
            {isRegister ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>

          {!isRegister && (
            <button
              type="button"
              onClick={handleAdminQuickLogin}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#18E29A]/40 text-[11px] font-extrabold text-[#18E29A] transition-all"
            >
              👑 Admin Quick Login (admin / admin123)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
