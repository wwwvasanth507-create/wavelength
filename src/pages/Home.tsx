import { useMemo } from "react";
import { SongCard, SongRow } from "../components/SongList";
import { usePlayer } from "../context/PlayerContext";
import { useCatalog } from "../services/catalog";
import type { Album, Artist } from "../types";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface Props {
  onNavigate: (view: string, id?: string) => void;
}

export default function Home({ onNavigate }: Props) {
  const { songs, playlists, artists, albums } = useCatalog();
  const { recentlyPlayed } = usePlayer();

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const featuredPlaylist = playlists[0] ?? null;

  // Randomized Top Tracks on every page refresh / initial visit
  const topTracks = useMemo(() => {
    if (!songs.length) return [];
    return shuffleArray(songs).slice(0, 6);
  }, [songs]);

  const recent = useMemo(() => (recentlyPlayed.length ? recentlyPlayed : songs.slice(0, 8)), [recentlyPlayed, songs]);

  const regionalMixes = [
    { title: "Tamil Hits", color: "bg-gradient-to-r from-rose-500 to-orange-500" },
    { title: "English Chartbusters", color: "bg-gradient-to-r from-blue-600 to-indigo-600" },
    { title: "Hindi Blockbusters", color: "bg-gradient-to-r from-emerald-500 to-teal-600" },
  ];

  const moodMixes = [
    {
      name: "Workout Energy",
      color: "from-rose-600 to-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      name: "Deep Sleep & Chill",
      color: "from-indigo-600 to-purple-800",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      name: "Weekend Party",
      color: "from-fuchsia-600 to-pink-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      name: "Romance & Beats",
      color: "from-red-500 to-pink-600",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="animate-fade-in px-4 md:px-8 space-y-8 pb-16 pt-2">
      {/* Header Greeting & Quick Filters */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight">
          {greeting}
        </h1>

        <div className="flex flex-wrap gap-2">
          {regionalMixes.map((mix) => (
            <button
              key={mix.title}
              onClick={() => onNavigate("search")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white ${mix.color} shadow-lg hover:scale-105 transition-transform`}
            >
              {mix.title}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Featured Banner (Compact Buttons for Mobile & PC) */}
      {featuredPlaylist && (
        <section className="relative overflow-hidden rounded-3xl p-5 md:p-8 border border-white/10 shadow-2xl glass-card-premium">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            <img
              src={featuredPlaylist.coverUrl}
              alt=""
              className="h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-2xl object-cover shadow-2xl border border-white/10 shrink-0"
            />
            <div className="flex-1 space-y-2.5 text-center md:text-left min-w-0">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-white/10 text-[#18E29A] border border-[#18E29A]/30">
                Featured Mix
              </span>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white font-heading tracking-tight truncate">
                {featuredPlaylist.name}
              </h2>
              <p className="text-white/70 text-xs sm:text-sm max-w-lg font-medium line-clamp-2">
                {featuredPlaylist.description || "Every track in the library, in one place."}
              </p>
              
              {/* Compact Buttons for Mobile & PC */}
              <div className="pt-1 flex items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={() => onNavigate("playlist", featuredPlaylist.id)}
                  className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full btn-glow-primary text-black text-xs font-extrabold flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Listen Now
                </button>
                <button
                  onClick={() => onNavigate("playlist", featuredPlaylist.id)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full btn-glow-secondary text-white text-xs font-bold"
                >
                  View Playlist
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC RANDOMIZED TOP 6 TRACKS */}
      <Section title="Top Tracks">
        <div className="glass-card-premium rounded-3xl overflow-hidden p-2 border border-white/10 shadow-xl">
          {/* Header Row */}
          <div className="grid grid-cols-[28px_minmax(0,3fr)_minmax(0,1.5fr)_auto] md:grid-cols-[36px_minmax(0,4fr)_minmax(0,2.5fr)_minmax(0,1fr)_auto_auto] gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
            <div className="text-center">#</div>
            <div>Title & Artist</div>
            <div className="hidden md:block">Album</div>
            <div className="hidden md:block text-right">Year</div>
            <div className="text-right">Time</div>
            <div className="w-7"></div>
          </div>

          {/* Details List (Dynamic Top 6 Songs) */}
          <div className="divide-y divide-white/5">
            {topTracks.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} queue={topTracks} />
            ))}
          </div>
        </div>
      </Section>

      {/* Recently Played Cards */}
      <Section title="Recently Played">
        <ScrollRow>
          {recent.map((song) => (
            <SongCard key={`recent-${song.id}`} song={song} queue={recent} />
          ))}
        </ScrollRow>
      </Section>

      {/* Mood Mixes */}
      <Section title="Mood Mixes">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moodMixes.map((m) => (
            <button
              key={m.name}
              onClick={() => onNavigate("search")}
              className={`p-4 rounded-2xl bg-gradient-to-br ${m.color} text-left text-white shadow-xl hover:scale-105 transition-transform flex flex-col justify-between h-28 border border-white/10`}
            >
              <div>{m.icon}</div>
              <span className="font-extrabold text-xs sm:text-sm font-heading">{m.name}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Top Artists */}
      <Section title="Popular Artists">
        <ScrollRow>
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onNavigate={onNavigate} />
          ))}
        </ScrollRow>
      </Section>

      {/* Top Albums */}
      <Section title="Top Albums">
        <ScrollRow>
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onNavigate={onNavigate} />
          ))}
        </ScrollRow>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 snap-x no-scrollbar">{children}</div>;
}

function ArtistCard({ artist, onNavigate }: { artist: Artist; onNavigate: (view: string, id?: string) => void }) {
  return (
    <button
      onClick={() => onNavigate("search")}
      className="group relative text-left w-32 sm:w-40 shrink-0 glass-card-premium p-3 rounded-2xl transition-all"
    >
      <div className="relative overflow-hidden rounded-full aspect-square shadow-xl border border-white/10">
        <img src={artist.coverUrl} alt={artist.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="mt-2.5 text-center font-extrabold text-xs text-white truncate font-heading">{artist.name}</div>
      <div className="text-[10px] text-center text-white/50 uppercase tracking-widest font-bold mt-0.5">Artist</div>
    </button>
  );
}

function AlbumCard({ album, onNavigate }: { album: Album; onNavigate: (view: string, id?: string) => void }) {
  return (
    <button
      onClick={() => onNavigate("search")}
      className="group relative text-left w-32 sm:w-40 shrink-0 glass-card-premium p-3 rounded-2xl transition-all"
    >
      <div className="relative overflow-hidden rounded-xl aspect-square shadow-xl border border-white/10">
        <img src={album.coverUrl} alt={album.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="mt-2.5 font-extrabold text-xs text-white truncate font-heading">{album.name}</div>
      <div className="text-[11px] text-white/60 truncate font-medium">{album.artist}</div>
    </button>
  );
}
