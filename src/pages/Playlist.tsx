import { useMemo, useState } from "react";
import { SongRow } from "../components/SongList";
import { usePlayer } from "../context/PlayerContext";
import { useCatalog } from "../services/catalog";

type SortField = "default" | "title" | "artist" | "album" | "duration";

export default function PlaylistView({ playlistId }: { playlistId: string }) {
  const { playlists, songs } = useCatalog();
  const { customPlaylists, playSong, shuffle, toggleShuffle, deletePlaylist, renamePlaylist, addToast } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("default");

  const playlist = useMemo(() => {
    return (
      customPlaylists.find((item) => item.id === playlistId) ||
      playlists.find((item) => item.id === playlistId)
    );
  }, [playlistId, customPlaylists, playlists]);

  if (!playlist) {
    return (
      <div className="p-12 text-center text-white/60">
        <h2 className="text-xl font-bold text-white mb-2">Playlist not found</h2>
        <p className="text-sm">The playlist might have been deleted or moved.</p>
      </div>
    );
  }

  const rawPlaylistSongs = useMemo(
    () => (playlist.songIds || []).map((id) => songs.find((song) => song.id === id)).filter(Boolean) as typeof songs,
    [playlist.songIds, songs],
  );

  const playlistSongs = useMemo(() => {
    let result = [...rawPlaylistSongs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          (s.album && s.album.toLowerCase().includes(q)),
      );
    }

    if (sortBy !== "default") {
      result.sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "artist") return a.artist.localeCompare(b.artist);
        if (sortBy === "album") return (a.album ?? "").localeCompare(b.album ?? "");
        if (sortBy === "duration") return (a.duration ?? "0").localeCompare(b.duration ?? "0");
        return 0;
      });
    }

    return result;
  }, [rawPlaylistSongs, searchQuery, sortBy]);

  const totalMinutes = Math.max(1, playlistSongs.length * 3.8);

  const onPlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const onShufflePlay = () => {
    if (playlistSongs.length === 0) return;
    if (!shuffle) toggleShuffle();
    const randomStart = playlistSongs[Math.floor(Math.random() * playlistSongs.length)];
    playSong(randomStart, playlistSongs);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast("Playlist link copied to clipboard!", "success");
    }
  };

  const handleSaveRename = () => {
    if (editName.trim()) {
      renamePlaylist(playlist.id, editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in pb-16">
      {/* This PC Top Explorer Navigation Banner */}
      <div className="px-4 md:px-8 pt-4 pb-2 flex items-center justify-between text-xs font-semibold text-white/50 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#18E29A] shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-white/40">This PC</span>
          <span className="text-white/20">❯</span>
          <span className="text-white/40">Playlists</span>
          <span className="text-white/20">❯</span>
          <span className="text-white font-bold truncate">{playlist.name}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#18E29A] font-mono shrink-0">
          This PC List Model
        </span>
      </div>

      {/* Header Banner */}
      <section
        className="px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row items-start md:items-end gap-5 md:gap-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${playlist.color ?? "#6D5EF8"}44 0%, #09090B 100%)`,
        }}
      >
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-2xl object-cover shadow-2xl border border-white/10 shrink-0"
        />

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-white/10 text-[#18E29A] border border-[#18E29A]/30">
              {playlist.isCollaborative ? "Collaborative Playlist" : playlist.isPrivate ? "Private Playlist" : "Public Playlist"}
            </span>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl sm:text-2xl font-black bg-white/10 border border-white/20 rounded-xl px-3 py-1 text-white outline-none"
              />
              <button onClick={handleSaveRename} className="px-4 py-1.5 rounded-xl bg-[#18E29A] text-black font-bold text-xs">Save</button>
            </div>
          ) : (
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white truncate">
              {playlist.name}
            </h1>
          )}

          {playlist.description && (
            <p className="text-white/70 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-none">
              {playlist.description}
            </p>
          )}

          <div className="text-xs sm:text-sm text-white/50 font-semibold pt-1">
            {playlistSongs.length} items · approx {Math.floor(totalMinutes)} mins
          </div>
        </div>
      </section>

      {/* Toolbar & Controls */}
      <div className="px-4 md:px-8 py-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayAll}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full btn-glow-primary grid place-items-center shrink-0"
              aria-label="Play all"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7 text-black translate-x-[1px]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <button
              onClick={onShufflePlay}
              className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full grid place-items-center transition-all ${
                shuffle
                  ? "bg-[#18E29A]/20 text-[#18E29A] border border-[#18E29A]/40"
                  : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Shuffle play"
              title="Shuffle play"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>

            <button
              onClick={handleShare}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Share playlist"
              title="Share link"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          {/* Quick Filter & Sort Options */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-white/40 outline-none focus:border-[#18E29A]/50 transition-colors"
              />
              <svg viewBox="0 0 24 24" className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white/80 outline-none cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="default" className="bg-[#121214]">Sort: Default</option>
              <option value="title" className="bg-[#121214]">Sort: Title</option>
              <option value="artist" className="bg-[#121214]">Sort: Artist</option>
              <option value="album" className="bg-[#121214]">Sort: Album</option>
              <option value="duration" className="bg-[#121214]">Sort: Duration</option>
            </select>

            {playlist.id.startsWith("playlist-") && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setEditName(playlist.name);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-xs font-bold text-white"
                >
                  Rename
                </button>
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold text-rose-400"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* This PC Explorer List Container (Unified Mobile & PC) */}
        <div className="glass-card rounded-2xl p-1.5 sm:p-2 border border-white/10 shadow-2xl overflow-hidden">
          {/* List View Header Bar */}
          <div className="grid grid-cols-[24px_minmax(0,1fr)_auto_auto] md:grid-cols-[36px_minmax(0,4fr)_minmax(0,2.5fr)_minmax(0,1fr)_auto_auto] gap-2.5 md:gap-4 px-2.5 sm:px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white/40 border-b border-white/10 select-none">
            <div className="text-center">#</div>
            <div>Name / Details</div>
            <div className="hidden md:block">Album</div>
            <div className="hidden md:block text-right">Year</div>
            <div className="text-right">Time</div>
            <div className="text-right">Fav</div>
          </div>

          {/* Songs List Rows */}
          {playlistSongs.length > 0 ? (
            <div className="divide-y divide-white/[0.03] mt-1">
              {playlistSongs.map((s, i) => (
                <SongRow key={s.id} song={s} index={i} queue={playlistSongs} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-white/50 text-xs">
              No tracks match your current filter criteria.
            </div>
          )}

          {/* This PC File Explorer Status Footer */}
          <div className="mt-2 px-3 py-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span>{playlistSongs.length} items in list view</span>
            <span className="hidden sm:inline">This PC Explorer View</span>
          </div>
        </div>
      </div>
    </div>
  );
}

