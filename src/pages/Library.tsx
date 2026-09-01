import { useMemo, useState } from "react";
import { useCatalog } from "../services/catalog";
import { SongCard } from "../components/SongList";
import { usePlayer } from "../context/PlayerContext";

export default function Library({
  onNavigate,
  onCreatePlaylistModal,
}: {
  onNavigate: (view: string, id?: string) => void;
  onCreatePlaylistModal?: () => void;
}) {
  const [tab, setTab] = useState<"playlists" | "songs" | "liked" | "artists" | "albums">("playlists");
  const { songs, playlists, artists, albums } = useCatalog();
  const { likedSongIds, customPlaylists, deletePlaylist, togglePinPlaylist } = usePlayer();

  const allPlaylists = useMemo(() => {
    return [...customPlaylists, ...playlists];
  }, [customPlaylists, playlists]);

  const likedSongs = useMemo(
    () => songs.filter((song) => likedSongIds.includes(song.id)),
    [likedSongIds, songs],
  );

  return (
    <div className="animate-fade-in px-4 md:px-8 py-6 space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">Your Library</h1>
          <p className="text-sm text-white/60 font-medium mt-1">Manage your custom playlists, favorite tracks, and saved albums.</p>
        </div>

        <button
          onClick={onCreatePlaylistModal}
          className="px-5 py-2.5 rounded-full btn-glow-primary text-black font-extrabold text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Playlist
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {(["playlists", "songs", "liked", "artists", "albums"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              tab === item
                ? "bg-gradient-to-r from-[#18E29A] to-[#6D5EF8] text-black shadow-lg"
                : "bg-white/5 text-white/70 hover:bg-white/15"
            }`}
          >
            {item === "liked" ? `Liked (${likedSongs.length})` : item}
          </button>
        ))}
      </div>

      {/* Playlists Tab */}
      {tab === "playlists" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onNavigate("playlist", pl.id)}
              className="group relative glass-card-premium p-3.5 rounded-3xl cursor-pointer text-left transition-all"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-lg">
                <img src={pl.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                {/* Pin button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinPlaylist(pl.id);
                  }}
                  className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md grid place-items-center icon-btn-smooth ${
                    pl.isPinned ? "text-[#18E29A] bg-[#18E29A]/20 border border-[#18E29A]/40" : "text-white/40 hover:text-white"
                  }`}
                  title="Pin playlist"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <path d="M5 17h14l-1.5-6H6.5L5 17z" />
                    <path d="M9 11V4h6v7" />
                  </svg>
                </button>
              </div>

              <div className="mt-3.5 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-white truncate font-heading">{pl.name}</div>
                  <div className="text-xs text-white/50 font-medium">{pl.songIds?.length ?? 0} songs</div>
                </div>

                {pl.id.startsWith("playlist-") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="h-7 w-7 rounded-full text-white/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center"
                    title="Delete playlist"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Songs Tab */}
      {tab === "songs" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      )}

      {/* Liked Songs Tab */}
      {tab === "liked" && (
        likedSongs.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={likedSongs} />
            ))}
          </div>
        ) : (
          <div className="glass-card-premium rounded-3xl p-12 text-center space-y-3 border border-white/10">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 grid place-items-center mx-auto text-rose-500">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white font-heading">No liked songs yet</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto font-medium">
              Tap the heart icon on any track to save it here for quick listening anytime.
            </p>
          </div>
        )
      )}

      {/* Artists Tab */}
      {tab === "artists" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <div key={artist.id} className="glass-card-premium p-4 rounded-3xl text-center">
              <img src={artist.coverUrl} alt="" className="w-full aspect-square object-cover rounded-full shadow-lg border border-white/10" />
              <div className="font-extrabold text-sm text-white truncate mt-3 font-heading">{artist.name}</div>
              <div className="text-xs text-white/50 font-medium">Artist</div>
            </div>
          ))}
        </div>
      )}

      {/* Albums Tab */}
      {tab === "albums" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="glass-card-premium p-3.5 rounded-3xl text-left">
              <img src={album.coverUrl} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-lg border border-white/10" />
              <div className="font-extrabold text-sm text-white truncate mt-3 font-heading">{album.name}</div>
              <div className="text-xs text-white/50 truncate font-medium">{album.artist}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
