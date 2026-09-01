import { memo } from "react";
import type { Song } from "../types";
import { usePlayer } from "../context/PlayerContext";

function SongCardComponent({
  song,
  onClick,
  queue,
  size = "md",
}: {
  song: Song;
  onClick?: () => void;
  queue?: Song[];
  size?: "sm" | "md" | "lg";
}) {
  const { playSong, currentSong, isPlaying, toggleLike, likedSongIds } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedSongIds.includes(song.id);

  const dim =
    size === "lg" ? "w-44 sm:w-52" : size === "sm" ? "w-32 sm:w-36" : "w-36 sm:w-44";

  const handlePrimaryClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    playSong(song, queue);
  };

  return (
    <div
      onClick={handlePrimaryClick}
      className={`group relative text-left ${dim} shrink-0 glass-card-premium p-2.5 cursor-pointer select-none`}
    >
      {/* Artwork Container */}
      <div className="relative overflow-hidden rounded-2xl aspect-square shadow-xl bg-black/60 border border-white/10">
        <img
          src={song.coverUrl}
          alt={song.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80";
          }}
        />

        {/* Play Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSong(song, queue);
          }}
          type="button"
          className="absolute right-2.5 bottom-2.5 h-10 w-10 rounded-full btn-glow-primary grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shrink-0 icon-btn-smooth"
          aria-label="Play track"
        >
          {isThisPlaying ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-black translate-x-[1px]" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Equalizer Visualizer Badge */}
        {isThisPlaying && (
          <div className="absolute left-2 bottom-2 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#18E29A]/40 flex items-center gap-1">
            <div className="eq-container">
              <span className="eq-bar-smooth" />
              <span className="eq-bar-smooth" />
              <span className="eq-bar-smooth" />
            </div>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song);
          }}
          className={`absolute top-2 left-2 h-7 w-7 rounded-full bg-black/50 backdrop-blur-md grid place-items-center icon-btn-smooth transition-all ${
            isLiked ? "text-rose-500 bg-rose-500/20 border border-rose-500/30" : "text-white/80 hover:text-white"
          }`}
          aria-label="Like track"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info Section OUTSIDE Image */}
      <div className="mt-2.5 min-w-0">
        <div className={`font-extrabold text-xs sm:text-sm truncate font-heading ${isCurrent ? "text-[#18E29A]" : "text-white group-hover:text-[#18E29A] transition-colors"}`}>
          {song.title}
        </div>
        <div className="text-[11px] text-white/60 truncate font-medium mt-0.5">
          {song.artist}
        </div>
      </div>
    </div>
  );
}

export const SongCard = memo(SongCardComponent);

function SongRowComponent({
  song,
  index,
  onClick,
  queue,
}: {
  song: Song;
  index: number;
  onClick?: () => void;
  queue?: Song[];
}) {
  const { playSong, currentSong, isPlaying, togglePlay, toggleLike, likedSongIds } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedSongIds.includes(song.id);

  const handleClick = () => {
    if (isCurrent) togglePlay();
    else if (onClick) onClick();
    else playSong(song, queue);
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full grid grid-cols-[24px_minmax(0,1fr)_auto_auto] md:grid-cols-[36px_minmax(0,4fr)_minmax(0,2.5fr)_minmax(0,1fr)_auto_auto] gap-2.5 md:gap-4 items-center px-2.5 sm:px-4 py-2.5 rounded-xl text-left group transition-all duration-150 cursor-pointer border ${
        isCurrent
          ? "bg-[#18E29A]/15 border-[#18E29A]/30 shadow-md"
          : "hover:bg-white/5 border-transparent"
      }`}
    >
      {/* Index or Equalizer */}
      <div className="text-xs font-bold text-white/40 text-center shrink-0">
        {isThisPlaying ? (
          <div className="flex items-end justify-center h-4">
            <span className="eq-bar-smooth" />
            <span className="eq-bar-smooth" />
            <span className="eq-bar-smooth" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <svg
              viewBox="0 0 24 24"
              className="hidden group-hover:block h-4 w-4 mx-auto text-[#18E29A]"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </>
        )}
      </div>

      {/* Cover & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <img
          src={song.coverUrl}
          alt=""
          className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-cover shrink-0 shadow-md border border-white/10"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className={`truncate text-xs sm:text-sm font-extrabold font-heading ${isCurrent ? "text-[#18E29A]" : "text-white group-hover:text-[#18E29A] transition-colors"}`}>
            {song.title}
          </div>
          <div className="truncate text-[11px] text-white/60 font-medium">
            {song.artist}
            <span className="inline md:hidden text-white/40 font-normal">
              {song.album ? ` • ${song.album}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Album (Desktop / Tablet) */}
      <div className="hidden md:block truncate text-xs text-white/60 font-medium">
        {song.album ?? "Single"}
      </div>

      {/* Year (Desktop) */}
      <div className="hidden md:block text-xs text-white/40 text-right font-medium">
        {song.year ?? ""}
      </div>

      {/* Duration */}
      <div className="text-[11px] sm:text-xs text-white/50 tabular-nums font-bold text-right shrink-0">
        {song.duration ?? "3:30"}
      </div>

      {/* Actions (Heart Button Only) */}
      <div className="flex items-center justify-end shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song);
          }}
          className={`h-7 w-7 grid place-items-center rounded-full icon-btn-smooth ${
            isLiked ? "text-rose-500" : "text-white/40 hover:text-white"
          }`}
          aria-label="Like song"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const SongRow = memo(SongRowComponent);
