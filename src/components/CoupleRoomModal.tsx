import { useState, useEffect } from "react";
import { useRoom } from "../context/RoomContext";
import { usePlayer } from "../context/PlayerContext";

interface CoupleRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledCode?: string;
}

export default function CoupleRoomModal({ isOpen, onClose, prefilledCode }: CoupleRoomModalProps) {
  const {
    roomCode,
    isConnected,
    isConnecting,
    memberCount,
    createRoom,
    joinRoom,
    leaveRoom,
    sendReaction,
  } = useRoom();
  const { currentSong, isPlaying, elapsed, queue, addToast } = usePlayer();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [inputCode, setInputCode] = useState(prefilledCode || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (prefilledCode && prefilledCode.length === 6) {
      setInputCode(prefilledCode);
      setActiveTab("join");
    }
  }, [prefilledCode]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    setError(null);
    setLoading(true);
    const code = await createRoom(currentSong, isPlaying, elapsed, queue);
    setLoading(false);
    if (code) {
      addToast(`Couple Room created: ${code}`, "success");
    } else {
      setError("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) {
      setError("Please enter the 6-digit room code");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await joinRoom(inputCode.trim());
    setLoading(false);
    if (res.success) {
      addToast(`Joined room: ${inputCode.trim()}`, "success");
    } else {
      setError(res.error || "Failed to join room");
    }
  };

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    addToast(`Room code ${roomCode} copied!`, "success");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyShareLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}#/room/${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast("Shareable Couple Room link copied!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const match = text.match(/\d{6}/);
      if (match) {
        setInputCode(match[0]);
      } else {
        setInputCode(text.trim().substring(0, 6));
      }
    } catch {}
  };

  const reactionsList = ["💖", "🔥", "✨", "🎵", "👏", "🥺"];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl grid place-items-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg glass-card-premium p-6 sm:p-8 rounded-3xl border border-white/15 shadow-[0_0_50px_rgba(24,226,154,0.15)] relative overflow-hidden">
        {/* Top ambient glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-[#18E29A] to-[#6D5EF8]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 grid place-items-center text-white/60 hover:text-white transition-all icon-btn-smooth"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 grid place-items-center text-2xl shadow-lg shadow-pink-500/20 shrink-0">
            💖
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
              Couple Music <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">Live Sync</span>
            </h2>
            <p className="text-xs text-white/60 font-medium">
              Listen together with your partner in real time with shared controls.
            </p>
          </div>
        </div>

        {/* ACTIVE ROOM VIEW */}
        {isConnected && roomCode ? (
          <div className="space-y-6 animate-fade-in">
            {/* Status card */}
            <div className="glass-card-premium p-5 rounded-2xl border border-[#18E29A]/30 text-center space-y-3 bg-[#18E29A]/5">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#18E29A]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#18E29A] animate-pulse" />
                Live Room Active
              </div>

              {/* 6 Digit Room Code Display */}
              <div className="py-2">
                <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                  Share this 6-digit code with your partner:
                </div>
                <div className="flex items-center justify-center gap-2 font-mono text-3xl sm:text-4xl font-black text-white tracking-wider">
                  {roomCode.split("").map((digit, i) => (
                    <span
                      key={i}
                      className="w-10 h-12 sm:w-11 sm:h-14 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-[#18E29A] shadow-inner"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={copyCode}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-extrabold text-white transition-all flex items-center gap-1.5 active:scale-95"
                >
                  {copiedCode ? "✅ Code Copied!" : "📋 Copy 6-Digit Code"}
                </button>
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 rounded-xl bg-[#18E29A]/20 hover:bg-[#18E29A]/30 text-xs font-extrabold text-[#18E29A] transition-all border border-[#18E29A]/40 flex items-center gap-1.5 active:scale-95"
                >
                  {copiedLink ? "✅ Link Copied!" : "🔗 Copy Invite Link"}
                </button>
              </div>
            </div>

            {/* Listener count & sync guarantee info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center text-lg">
                  {memberCount > 1 ? "👩‍❤️‍👨" : "🎧"}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {memberCount > 1 ? "2 Listeners in Room" : "1 Listener Connected"}
                  </div>
                  <div className="text-xs text-white/60">
                    {memberCount > 1 ? "Both devices playing in sync" : "Waiting for partner to enter code..."}
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                memberCount > 1 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}>
                {memberCount > 1 ? "Synced" : "Waiting"}
              </span>
            </div>

            {/* Real-time Reaction Pulses */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white/70 flex items-center justify-between">
                <span>Send Reaction to Partner:</span>
                <span className="text-[11px] text-white/40">Tap to float on partner screen</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {reactionsList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="h-11 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xl grid place-items-center hover:scale-110 active:scale-90 transition-all shadow-sm"
                    title={`Send ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={leaveRoom}
                className="px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-extrabold text-red-400 border border-red-500/30 transition-all active:scale-95"
              >
                Leave Room
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full btn-glow-primary text-xs font-extrabold text-black active:scale-95"
              >
                Back to Music
              </button>
            </div>
          </div>
        ) : (
          /* CREATE / JOIN TABS VIEW */
          <div className="space-y-5">
            {/* Tabs selector */}
            <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
              <button
                onClick={() => { setActiveTab("create"); setError(null); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === "create" ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => { setActiveTab("join"); setError(null); }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === "join" ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                Join with Code
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-300 text-center animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            {/* TAB 1: CREATE ROOM */}
            {activeTab === "create" && (
              <div className="space-y-4 text-center py-2 animate-fade-in">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2.5">
                  <div className="text-xs font-extrabold text-white flex items-center gap-2">
                    <span>✨ Instant 6-Digit Code</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Create a synchronized room in 1 second. Your partner enters your 6-digit code or clicks your link, and your music will play on both phones or laptops simultaneously without lag.
                  </p>
                  {currentSong && (
                    <div className="pt-2 text-[11px] text-[#18E29A] font-bold flex items-center gap-1.5">
                      <span>🎵 Currently playing:</span>
                      <span className="text-white truncate">{currentSong.title} — {currentSong.artist}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={loading || isConnecting}
                  className="w-full py-3.5 rounded-2xl btn-glow-primary text-xs font-black text-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading || isConnecting ? "Creating Room..." : "Generate 6-Digit Room & Start"}
                </button>
              </div>
            )}

            {/* TAB 2: JOIN ROOM */}
            {activeTab === "join" && (
              <form onSubmit={handleJoinRoom} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5">
                    Enter 6-Digit Room Code:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 482910"
                      className="w-full glass-input-premium rounded-2xl px-4 py-3.5 text-center text-2xl font-mono font-black text-white tracking-widest outline-none border border-white/20 focus:border-[#18E29A]"
                    />
                    <button
                      type="button"
                      onClick={handlePasteCode}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white/70 hover:text-white transition-all"
                    >
                      Paste
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/60 space-y-1.5">
                  <div className="font-bold text-white">How it works:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>You will join your partner's exact playback position instantly.</li>
                    <li>Both of you can play, pause, change songs, and edit the queue.</li>
                    <li>Full co-control with zero lag.</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading || isConnecting || inputCode.length !== 6}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-xs font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading || isConnecting ? "Connecting to Room..." : "Join Couple Room"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
