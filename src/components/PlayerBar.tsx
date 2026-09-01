import { useRef, useState } from "react";
import { usePlayer, usePlayerProgress, formatTime } from "../context/PlayerContext";
import type { AudioQuality } from "../types";

export default function PlayerBar({
  onOpenNowPlaying,
  onOpenLyrics,
  onOpenQueue,
}: {
  onOpenNowPlaying: () => void;
  onOpenLyrics?: () => void;
  onOpenQueue?: () => void;
}) {
  const p = usePlayer();
  const song = p.currentSong;
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);

  if (!song) {
    return (
      <div className="fixed bottom-[56px] lg:bottom-0 left-0 right-0 z-30 h-14 glass-card-premium border-t border-white/10 px-4 flex items-center justify-between text-xs text-white/50">
        <span className="font-medium">Select a track from the library to start listening.</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[56px] lg:sticky lg:bottom-0 left-0 right-0 z-30 w-full glass-card-premium border-t border-white/10 px-3 py-2 md:px-6 md:py-3 shadow-2xl backdrop-blur-3xl">
      {/* Mobile Mini Player Bar (<768px) */}
      <div className="md:hidden flex items-center justify-between gap-3">
        <button
          onClick={onOpenNowPlaying}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          <img
            src={song.coverUrl}
            alt={song.title}
            className="h-10 w-10 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-extrabold text-white font-heading">{song.title}</div>
            <div className="truncate text-[11px] text-white/60 font-medium">{song.artist}</div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* GREEN SHUFFLE BUTTON */}
          <button
            onClick={p.toggleShuffle}
            className={`h-8 w-8 grid place-items-center rounded-full icon-btn-smooth ${
              p.shuffle ? "bg-[#18E29A]/20 text-[#18E29A] border border-[#18E29A]/40" : "text-white/60"
            }`}
            aria-label="Shuffle"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>

          {/* PLAY / PAUSE */}
          <button
            onClick={p.togglePlay}
            className="h-9 w-9 rounded-full btn-glow-primary grid place-items-center shrink-0"
            aria-label="Play/Pause"
          >
            {p.isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-black" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-black translate-x-[1px]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* NEXT */}
          <button
            onClick={p.next}
            className="h-8 w-8 grid place-items-center rounded-full text-white/80 icon-btn-smooth"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
              <path d="M16 6h2v12h-2zM4 6v12l11-6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Player Bar (>=768px) */}
      <div className="hidden md:grid grid-cols-[1fr_1.4fr_1fr] items-center gap-4">
        {/* Left: song info & artwork */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onOpenNowPlaying}
            className="group relative h-13 w-13 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-xl"
            aria-label="Expand player"
          >
            <img
              src={song.coverUrl}
              alt={song.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNowPlaying}
                className="truncate text-sm font-extrabold font-heading text-white hover:text-[#18E29A] transition-colors text-left"
              >
                {song.title}
              </button>
              {p.audioQuality === "lossless" && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-widest bg-emerald-500/20 text-[#18E29A] border border-[#18E29A]/30 uppercase">
                  Lossless
                </span>
              )}
            </div>
            <div className="truncate text-xs text-white/60 font-medium hover:text-white transition-colors cursor-pointer">
              {song.artist}
            </div>
          </div>

          <button
            onClick={() => p.toggleLike(song)}
            className={`h-9 w-9 grid place-items-center rounded-full icon-btn-smooth ${
              p.likedSongIds.includes(song.id) ? "text-rose-500 bg-rose-500/20 border border-rose-500/30" : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Like song"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill={p.likedSongIds.includes(song.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Center: controls & seekbar */}
        <div className="flex flex-col items-center gap-1.5 min-w-0">
          <div className="flex items-center justify-center gap-4">
            {/* GREEN SHUFFLE BUTTON */}
            <button
              onClick={p.toggleShuffle}
              aria-label="Shuffle"
              title={p.shuffle ? "Shuffle Enabled" : "Shuffle Disabled"}
              className={`h-9 w-9 grid place-items-center rounded-full icon-btn-smooth ${
                p.shuffle
                  ? "bg-[#18E29A]/20 text-[#18E29A] border border-[#18E29A]/40 shadow-[0_0_15px_rgba(24,226,154,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>

            {/* PREVIOUS */}
            <button
              onClick={p.prev}
              aria-label="Previous"
              className="h-9 w-9 grid place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 icon-btn-smooth"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M6 6h2v12H6zM20 6v12L9 12z" />
              </svg>
            </button>

            {/* PLAY / PAUSE */}
            <button
              onClick={p.togglePlay}
              aria-label="Play or Pause"
              className="h-11 w-11 rounded-full btn-glow-primary grid place-items-center shrink-0"
            >
              {p.isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-black translate-x-[1.5px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* NEXT */}
            <button
              onClick={p.next}
              aria-label="Next"
              className="h-9 w-9 grid place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 icon-btn-smooth"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M16 6h2v12h-2zM4 6v12l11-6z" />
              </svg>
            </button>

            {/* REPEAT */}
            <button
              onClick={p.cycleRepeat}
              aria-label="Repeat"
              title={`Repeat: ${p.repeat.toUpperCase()}`}
              className={`h-9 w-9 grid place-items-center rounded-full relative icon-btn-smooth ${
                p.repeat !== "off"
                  ? "bg-[#18E29A]/20 text-[#18E29A] border border-[#18E29A]/40 shadow-[0_0_15px_rgba(24,226,154,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              {p.repeat === "one" && (
                <span className="absolute bottom-1 font-black text-[9px] text-[#18E29A]">1</span>
              )}
            </button>
          </div>

          <ProgressBar />
        </div>

        {/* Right: volume & audio tools */}
        <div className="flex items-center justify-end gap-2 text-white/70">
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowQualityMenu(false);
                setShowSleepMenu(false);
              }}
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-all"
            >
              {p.playbackSpeed}x
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 right-0 bg-[#141418] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 w-24 backdrop-blur-2xl">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      p.setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`text-xs py-1.5 px-2.5 rounded-xl text-left font-bold ${
                      p.playbackSpeed === s ? "bg-[#18E29A]/20 text-[#18E29A]" : "hover:bg-white/5 text-white/80"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowQualityMenu(!showQualityMenu);
                setShowSpeedMenu(false);
                setShowSleepMenu(false);
              }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-black uppercase bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-all"
            >
              {p.audioQuality.slice(0, 4)}
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-10 right-0 bg-[#141418] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 w-32 backdrop-blur-2xl">
                {(["normal", "high", "lossless"] as AudioQuality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      p.setAudioQuality(q);
                      setShowQualityMenu(false);
                    }}
                    className={`text-xs py-1.5 px-2.5 rounded-xl text-left font-bold capitalize ${
                      p.audioQuality === q ? "bg-[#18E29A]/20 text-[#18E29A]" : "hover:bg-white/5 text-white/80"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowSleepMenu(!showSleepMenu);
                setShowSpeedMenu(false);
                setShowQualityMenu(false);
              }}
              className={`h-8 w-8 grid place-items-center rounded-full icon-btn-smooth ${
                p.sleepTimer !== null ? "text-[#18E29A] bg-[#18E29A]/20 border border-[#18E29A]/30" : "hover:text-white hover:bg-white/10"
              }`}
              aria-label="Sleep timer"
              title="Sleep timer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>

            {showSleepMenu && (
              <div className="absolute bottom-10 right-0 bg-[#141418] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 w-36 backdrop-blur-2xl">
                {[null, 15, 30, 45, 60].map((m) => (
                  <button
                    key={m ?? 0}
                    onClick={() => {
                      p.setSleepTimerMinutes(m);
                      setShowSleepMenu(false);
                    }}
                    className="text-xs py-1.5 px-2.5 rounded-xl text-left font-medium hover:bg-white/5 text-white/80"
                  >
                    {m === null ? "Off" : `${m} minutes`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onOpenLyrics && (
            <button
              onClick={onOpenLyrics}
              className="h-8 w-8 grid place-items-center rounded-full hover:text-white hover:bg-white/10 icon-btn-smooth"
              aria-label="Lyrics"
              title="Lyrics"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}

          {onOpenQueue && (
            <button
              onClick={onOpenQueue}
              className="h-8 w-8 grid place-items-center rounded-full hover:text-white hover:bg-white/10 icon-btn-smooth"
              aria-label="Queue"
              title="Queue"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          )}

          <button
            onClick={() => p.setVolume(p.volume > 0 ? 0 : 0.85)}
            className="h-8 w-8 grid place-items-center rounded-full hover:text-white hover:bg-white/10 icon-btn-smooth"
            aria-label="Mute"
          >
            {p.volume === 0 ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-400" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          <div className="w-24 relative h-1.5 flex items-center group">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(p.volume * 100)}
              onChange={(e) => p.setVolume(Number(e.target.value) / 100)}
              className="wv-range absolute inset-0 h-full w-full"
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar() {
  const { seek } = usePlayer();
  const { progress, duration, elapsed } = usePlayerProgress();
  const [hoverX, setHoverX] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const hoverRatio =
    hoverX !== null && trackRef.current
      ? Math.max(0, Math.min(1, hoverX / trackRef.current.offsetWidth))
      : null;

  return (
    <div className="flex items-center gap-2.5 w-full max-w-xl text-[11px] text-white/50 tabular-nums font-bold">
      <span className="w-9 text-right">{formatTime(elapsed)}</span>
      <div
        ref={trackRef}
        className="relative flex-1 h-1.5 group cursor-pointer"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHoverX(e.clientX - rect.left);
        }}
        onMouseLeave={() => setHoverX(null)}
      >
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#18E29A] to-[#6D5EF8] rounded-full group-hover:brightness-125 transition-all"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />

        {hoverRatio !== null && duration > 0 && (
          <div
            className="pointer-events-none absolute -top-8 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#141418] border border-white/10 text-white text-[10px] shadow-2xl font-black"
            style={{ left: `${hoverRatio * 100}%` }}
          >
            {formatTime(hoverRatio * duration)}
          </div>
        )}

        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={Math.round(progress * 1000)}
          onChange={(e) => seek(Number(e.target.value) / 1000)}
          aria-label="Seek timeline"
          className="wv-range absolute inset-0 h-full w-full"
        />
      </div>
      <span className="w-9">{formatTime(duration)}</span>
    </div>
  );
}
