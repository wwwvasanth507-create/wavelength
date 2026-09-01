import { usePlayer } from "../context/PlayerContext";
import type { Song } from "../types";

export function PremiumSongCard({
  song,
  queue,
  size = "md",
}: {
  song: Song;
  queue?: Song[];
  size?: "sm" | "md" | "lg";
}) {
  const { playSong, toggleLike, likedSongIds, currentSong, isPlaying } = usePlayer();
  const playing = currentSong?.id === song.id && isPlaying;
  const isLiked = likedSongIds.includes(song.id);

  const dimensions = {
    sm: { card: "w-32", img: "h-32" },
    md: { card: "w-44", img: "h-44" },
    lg: { card: "w-52", img: "h-52" },
  };

  const dim = dimensions[size];

  return (
    <div
      className={`${dim.card} shrink-0 group fade-in cursor-pointer`}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl shadow-premium-sm hover:shadow-premium-md transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image */}
        <div className={`${dim.img} relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5`}>
          <img
            src={song.coverUrl}
            alt={song.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='${song.color ?? "#1ED760"}'/><stop offset='1' stop-color='#000'/></linearGradient></defs><rect width='200' height='200' fill='url(%23g)'/><text x='100' y='110' font-family='Arial' font-size='80' fill='white' text-anchor='middle'>♪</text></svg>`,
                );
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              playSong(song, queue);
            }}
            className="absolute bottom-3 right-3 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-black grid place-items-center shadow-premium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg hover:scale-110"
            aria-label="Play"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 ml-0.5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Now playing indicator */}
          {playing && (
            <div className="absolute left-3 bottom-3 flex items-end gap-1 h-6">
              <div className="eq-bar" style={{ height: "6px" }} />
              <div className="eq-bar" style={{ height: "10px" }} />
              <div className="eq-bar" style={{ height: "8px" }} />
              <div className="eq-bar" style={{ height: "12px" }} />
            </div>
          )}

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleLike(song);
            }}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm grid place-items-center hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Like"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 20s-6.5-4.2-8.5-8A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 5.6C18.5 15.8 12 20 12 20Z"
                className={isLiked ? "text-rose-500" : "text-white/80"}
              />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="glass-sm p-3 backdrop-blur-sm border-t border-white/5">
          <h3 className="font-bold text-sm text-white truncate leading-snug">
            {song.title}
          </h3>
          <p className="text-xs text-white/60 truncate mt-0.5">{song.artist}</p>
          {size !== "sm" && (
            <p className="text-xs text-white/40 truncate mt-1">{song.album || "Single"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 flex items-center gap-3">
      <span>{children}</span>
      <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
    </h2>
  );
}

export function SectionContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <section className="mb-12">
      {title && <SectionTitle>{title}</SectionTitle>}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {children}
      </div>
    </section>
  );
}
