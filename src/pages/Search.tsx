import { useMemo, useState } from "react";
import { SongRow } from "../components/SongList";
import { useCatalog } from "../services/catalog";
import { usePlayer } from "../context/PlayerContext";

interface Props {
  onNavigate: (view: string, id?: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

type FilterChip = "all" | "songs" | "albums" | "artists" | "playlists" | "podcasts";

export default function Search({ onNavigate, query, onQueryChange }: Props) {
  const { songs, playlists, artists, albums } = useCatalog();
  const { searchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory } = usePlayer();
  const [activeChip, setActiveChip] = useState<FilterChip>("all");

  const trendingTags = ["A.R. Rahman", "Anirudh Ravichander", "Electronic Lo-Fi", "Synthwave 80s", "Taylor Swift", "Instrumental Chill"];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { songs: [], playlists: [], artists: [], albums: [] };

    return {
      songs: songs.filter((s) => [s.title, s.artist, s.album ?? "", s.genre ?? ""].some((val) => val.toLowerCase().includes(q))),
      playlists: playlists.filter((p) => [p.name, p.description ?? ""].some((val) => val.toLowerCase().includes(q))),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
      albums: albums.filter((al) => al.name.toLowerCase().includes(q) || al.artist.toLowerCase().includes(q)),
    };
  }, [query, songs, playlists, artists, albums]);

  const isSearching = query.trim().length > 0;

  const handleSelectQuery = (term: string) => {
    onQueryChange(term);
    addSearchHistory(term);
  };

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 space-y-8 pb-16">
      {/* Header & Input Search */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">Search</h1>
        
        <div className="relative glass-input-premium rounded-2xl p-3.5 flex items-center gap-3 shadow-xl">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#18E29A] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                addSearchHistory(query.trim());
              }
            }}
            placeholder="Search songs, artists, albums, or playlists..."
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/40 font-medium"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="h-6 w-6 rounded-full bg-white/10 grid place-items-center text-white/70 hover:text-white icon-btn-smooth"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      {isSearching && (
        <div className="flex flex-wrap gap-2">
          {(["all", "songs", "albums", "artists", "playlists", "podcasts"] as FilterChip[]).map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeChip === chip
                  ? "bg-[#18E29A] text-black shadow-lg"
                  : "bg-white/5 text-white/70 hover:bg-white/15"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Search History & Trending Searches when idle */}
      {!isSearching && (
        <div className="space-y-8">
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-heading">Recent Searches</h2>
                <button
                  onClick={() => clearSearchHistory()}
                  className="text-xs text-white/50 hover:text-[#18E29A] font-bold"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item) => (
                  <div
                    key={item}
                    className="glass-card-premium px-4 py-2 rounded-full flex items-center gap-2.5 text-xs font-bold text-white/80 hover:text-white cursor-pointer border border-white/10"
                  >
                    <span onClick={() => handleSelectQuery(item)}>{item}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchHistory(item);
                      }}
                      className="text-white/40 hover:text-rose-400"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading">Trending Searches</h2>
            <div className="flex flex-wrap gap-2.5">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSelectQuery(tag)}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#18E29A]/40 text-xs font-bold text-white hover:text-[#18E29A] transition-all flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#18E29A]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Browse Genres Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white font-heading">Browse All Genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from(new Set(songs.map((s) => s.genre).filter(Boolean) as string[])).map((genre, idx) => (
                <button
                  key={genre}
                  onClick={() => handleSelectQuery(genre)}
                  className="relative aspect-[4/3] rounded-3xl p-5 text-left font-black text-lg text-white overflow-hidden shadow-xl hover:scale-105 transition-transform font-heading"
                  style={{
                    background: `linear-gradient(135deg, ${palette[idx % palette.length]} 0%, #141418 100%)`,
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Search Results (Windows Details View List for BOTH PC and Mobile) */}
      {isSearching && (
        <div className="space-y-8">
          {(activeChip === "all" || activeChip === "songs") && results.songs.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-white font-heading">Songs ({results.songs.length})</h2>
              
              {/* Windows Details View List for BOTH PC & MOBILE */}
              <div className="glass-card-premium rounded-3xl overflow-hidden p-2 border border-white/10 shadow-xl">
                <div className="grid grid-cols-[28px_minmax(0,3fr)_minmax(0,1.5fr)_auto] md:grid-cols-[36px_minmax(0,4fr)_minmax(0,2.5fr)_minmax(0,1fr)_auto_auto] gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                  <div className="text-center">#</div>
                  <div>Title & Artist</div>
                  <div className="hidden md:block">Album</div>
                  <div className="hidden md:block text-right">Year</div>
                  <div className="text-right">Time</div>
                  <div className="w-7"></div>
                </div>

                <div className="divide-y divide-white/5">
                  {results.songs.map((s, idx) => (
                    <SongRow key={s.id} song={s} index={idx} queue={results.songs} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {(activeChip === "all" || activeChip === "playlists") && results.playlists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-white font-heading">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => onNavigate("playlist", pl.id)}
                    className="glass-card-premium p-3.5 rounded-3xl text-left transition-all"
                  >
                    <img src={pl.coverUrl} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-lg border border-white/10" />
                    <div className="font-extrabold text-sm text-white truncate mt-3 font-heading">{pl.name}</div>
                    <div className="text-xs text-white/50 font-medium">{pl.songIds.length} tracks</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {(activeChip === "all" || activeChip === "artists") && results.artists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-white font-heading">Artists</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {results.artists.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => onNavigate("search")}
                    className="w-36 shrink-0 glass-card-premium p-3.5 rounded-3xl text-center"
                  >
                    <img src={art.coverUrl} alt="" className="w-full aspect-square object-cover rounded-full shadow-lg border border-white/10" />
                    <div className="font-extrabold text-sm text-white truncate mt-3 font-heading">{art.name}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {(activeChip === "all" || activeChip === "albums") && results.albums.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-white font-heading">Albums</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {results.albums.map((al) => (
                  <button
                    key={al.id}
                    onClick={() => onNavigate("search")}
                    className="w-36 shrink-0 glass-card-premium p-3.5 rounded-3xl text-left"
                  >
                    <img src={al.coverUrl} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-lg border border-white/10" />
                    <div className="font-extrabold text-sm text-white truncate mt-3 font-heading">{al.name}</div>
                    <div className="text-xs text-white/60 truncate font-medium">{al.artist}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {results.songs.length === 0 && results.playlists.length === 0 && results.artists.length === 0 && results.albums.length === 0 && (
            <div className="glass-card-premium p-12 text-center rounded-3xl space-y-3 border border-white/10">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-white/40 mx-auto" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3 className="text-lg font-bold text-white font-heading">No results found for "{query}"</h3>
              <p className="text-xs text-white/50 font-medium">Try checking spelling or search for another track or artist.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const palette = ["#EF4444", "#F59E0B", "#10B981", "#06B6D4", "#6366F1", "#A855F7", "#EC4899", "#18E29A"];
