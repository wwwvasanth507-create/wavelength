import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { useCatalog } from "../services/catalog";
import type { Playlist, Song } from "../types";

interface AdminPageProps {
  onNavigate: (view: string, id?: string) => void;
  songs: Song[];
  onRefreshCatalog?: () => void;
}

export default function Admin({ onNavigate, songs, onRefreshCatalog }: AdminPageProps) {
  const { user, isAdmin, token } = useAuth();
  const { addToast } = usePlayer();
  const catalog = useCatalog();

  const [activeTab, setActiveTab] = useState<"songs" | "playlists">("songs");

  // ==========================================
  // 1. SONG UPLOAD FORM STATE
  // ==========================================
  const [audioSource, setAudioSource] = useState<"file" | "url">("file");
  const [coverSource, setCoverSource] = useState<"file" | "url">("file");

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("3:30");
  const [color, setColor] = useState("#18E29A");
  const [lyrics, setLyrics] = useState("");
  const [year, setYear] = useState(2026);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [songLoading, setSongLoading] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);

  // ==========================================
  // 2. GLOBAL PLAYLIST FORM STATE
  // ==========================================
  const [plName, setPlName] = useState("");
  const [plDescription, setPlDescription] = useState("");
  const [plCoverSource, setPlCoverSource] = useState<"file" | "url">("url");
  const [plCoverFile, setPlCoverFile] = useState<File | null>(null);
  const [plCoverUrl, setPlCoverUrl] = useState("");
  const [plSelectedSongIds, setPlSelectedSongIds] = useState<string[]>([]);
  const [plIsPrivate, setPlIsPrivate] = useState(false);
  const [plIsCollab, setPlIsCollab] = useState(false);
  const [plSearchQuery, setPlSearchQuery] = useState("");

  const [plLoading, setPlLoading] = useState(false);
  const [plError, setPlError] = useState<string | null>(null);

  // Playlist Edit State
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editPlName, setEditPlName] = useState("");
  const [editPlDesc, setEditPlDesc] = useState("");
  const [editPlCoverSource, setEditPlCoverSource] = useState<"file" | "url">("url");
  const [editPlCoverFile, setEditPlCoverFile] = useState<File | null>(null);
  const [editPlCoverUrl, setEditPlCoverUrl] = useState("");
  const [editPlSongIds, setEditPlSongIds] = useState<string[]>([]);
  const [editSearchQuery, setEditSearchQuery] = useState("");

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4 text-2xl">
          🔒
        </div>
        <h2 className="text-2xl font-black font-heading text-white mb-2">Admin Access Required</h2>
        <p className="text-xs text-white/60 max-w-sm mb-6">
          Only authorized administrators can upload new songs, create global playlists, manage thumbnails, and modify the music catalog.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="px-6 py-2.5 rounded-full btn-glow-primary text-xs font-extrabold text-black"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // --- Handlers for Song ---
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      const tempAudio = document.createElement("audio");
      tempAudio.src = URL.createObjectURL(file);
      tempAudio.onloadedmetadata = () => {
        const mins = Math.floor(tempAudio.duration / 60);
        const secs = Math.floor(tempAudio.duration % 60);
        setDuration(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
      };
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSongError(null);

    if (!title.trim() || !artist.trim()) {
      setSongError("Title and Artist are required");
      return;
    }
    if (audioSource === "file" && !audioFile) {
      setSongError("Please select an audio file to upload");
      return;
    }
    if (audioSource === "url" && !audioUrl.trim()) {
      setSongError("Please enter a valid direct Audio URL");
      return;
    }
    if (coverSource === "url" && !coverUrl.trim()) {
      setSongError("Please enter a valid direct Thumbnail Cover URL");
      return;
    }

    setSongLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("artist", artist.trim());
      if (album.trim()) formData.append("album", album.trim());
      if (genre.trim()) formData.append("genre", genre.trim());
      formData.append("duration", duration.trim());
      formData.append("color", color);
      if (lyrics.trim()) formData.append("lyrics", lyrics.trim());
      formData.append("year", year.toString());

      if (audioSource === "file" && audioFile) {
        formData.append("audio_file", audioFile);
      } else {
        formData.append("audio_url", audioUrl.trim());
      }

      if (coverSource === "file" && coverFile) {
        formData.append("cover_file", coverFile);
      } else {
        formData.append("cover_url", coverUrl.trim());
      }

      const res = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setSongLoading(false);

      if (!res.ok) {
        setSongError(data.detail || "Failed to upload song");
        return;
      }

      addToast(`✨ "${title}" uploaded successfully!`, "success");

      setTitle("");
      setArtist("");
      setAlbum("");
      setGenre("");
      setLyrics("");
      setAudioFile(null);
      setCoverFile(null);
      setAudioUrl("");
      setCoverUrl("");

      if (onRefreshCatalog) onRefreshCatalog();
    } catch (err: any) {
      setSongLoading(false);
      setSongError(err?.message || "Server upload error");
    }
  };

  const handleDeleteSong = async (songId: string, songTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${songTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/songs/${songId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast(`🗑️ "${songTitle}" deleted`, "info");
        if (onRefreshCatalog) onRefreshCatalog();
      } else {
        const data = await res.json();
        addToast(`⚠️ ${data.detail || "Delete failed"}`, "error");
      }
    } catch {
      addToast("⚠️ Server connection error", "error");
    }
  };

  // --- Handlers for Global Playlist ---
  const handlePlCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlCoverFile(e.target.files[0]);
    }
  };

  const handleEditPlCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditPlCoverFile(e.target.files[0]);
    }
  };

  const toggleSongForNewPlaylist = (songId: string) => {
    setPlSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const toggleSongForEditPlaylist = (songId: string) => {
    setEditPlSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleCreatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlError(null);

    if (!plName.trim()) {
      setPlError("Playlist name is required");
      return;
    }

    if (plCoverSource === "url" && !plCoverUrl.trim()) {
      setPlError("Please enter a thumbnail cover image link/URL");
      return;
    }

    setPlLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", plName.trim());
      formData.append("description", plDescription.trim());
      formData.append("song_ids", JSON.stringify(plSelectedSongIds));
      formData.append("is_private", plIsPrivate ? "1" : "0");
      formData.append("is_collab", plIsCollab ? "1" : "0");

      if (plCoverSource === "file" && plCoverFile) {
        formData.append("cover_file", plCoverFile);
      } else if (plCoverUrl.trim()) {
        formData.append("cover_url", plCoverUrl.trim());
      }

      const res = await fetch("/api/admin/playlists", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setPlLoading(false);

      if (!res.ok) {
        setPlError(data.detail || "Failed to create playlist");
        return;
      }

      addToast(`✨ Global Playlist "${plName}" created!`, "success");

      setPlName("");
      setPlDescription("");
      setPlCoverUrl("");
      setPlCoverFile(null);
      setPlSelectedSongIds([]);
      setPlIsPrivate(false);
      setPlIsCollab(false);

      if (onRefreshCatalog) onRefreshCatalog();
    } catch (err: any) {
      setPlLoading(false);
      setPlError(err?.message || "Server playlist creation error");
    }
  };

  const startEditPlaylist = (pl: Playlist) => {
    setEditingPlaylist(pl);
    setEditPlName(pl.name);
    setEditPlDesc(pl.description || "");
    setEditPlCoverSource(pl.coverUrl.startsWith("/uploads/") ? "file" : "url");
    setEditPlCoverUrl(pl.coverUrl);
    setEditPlCoverFile(null);
    setEditPlSongIds(pl.songIds || []);
  };

  const handleUpdatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlaylist) return;

    if (!editPlName.trim()) {
      addToast("Playlist name is required", "error");
      return;
    }

    setPlLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", editPlName.trim());
      formData.append("description", editPlDesc.trim());
      formData.append("song_ids", JSON.stringify(editPlSongIds));

      if (editPlCoverSource === "file" && editPlCoverFile) {
        formData.append("cover_file", editPlCoverFile);
      } else if (editPlCoverUrl.trim()) {
        formData.append("cover_url", editPlCoverUrl.trim());
      }

      const res = await fetch(`/api/admin/playlists/${editingPlaylist.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setPlLoading(false);

      if (!res.ok) {
        addToast(`⚠️ ${data.detail || "Update failed"}`, "error");
        return;
      }

      addToast(`✨ Global Playlist "${editPlName}" updated!`, "success");
      setEditingPlaylist(null);

      if (onRefreshCatalog) onRefreshCatalog();
    } catch {
      setPlLoading(false);
      addToast("⚠️ Server connection error", "error");
    }
  };

  const handleDeletePlaylist = async (playlistId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete global playlist "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/playlists/${playlistId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast(`🗑️ Playlist "${name}" deleted`, "info");
        if (onRefreshCatalog) onRefreshCatalog();
      } else {
        const data = await res.json();
        addToast(`⚠️ ${data.detail || "Delete failed"}`, "error");
      }
    } catch {
      addToast("⚠️ Server connection error", "error");
    }
  };

  const filteredSongsForNewPl = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(plSearchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(plSearchQuery.toLowerCase())
  );

  const filteredSongsForEditPl = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(editSearchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(editSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card-premium p-6 rounded-3xl border border-[#18E29A]/30">
        <div>
          <div className="flex items-center gap-2 text-[#18E29A] text-xs font-black uppercase tracking-wider mb-1">
            <span>👑 Website Administrator Portal</span>
          </div>
          <h1 className="text-3xl font-black font-heading text-white">Music & Global Playlist Manager</h1>
          <p className="text-xs text-white/60 mt-1">
            Create global playlists, upload song tracks, manage thumbnail art (via link or local images of all formats), and add/remove songs anytime directly from the website admin panel.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab("songs")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === "songs"
                ? "bg-[#18E29A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🎵 Song Catalog ({songs.length})
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === "playlists"
                ? "bg-[#6D5EF8] text-white shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            📻 Global Playlists ({catalog.playlists.length})
          </button>
        </div>
      </div>

      {/* ==========================================
          TAB 1: SONGS MANAGEMENT
          ========================================== */}
      {activeTab === "songs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Song Upload Form (7 cols) */}
          <div className="lg:col-span-7 glass-card-premium p-7 rounded-3xl space-y-6 border border-white/10">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <span>🎵 Add New Track</span>
            </h2>

            {songError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-300">
                ⚠️ {songError}
              </div>
            )}

            <form onSubmit={handleAddSongSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Song Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Master the Blaster"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g. Anirudh Ravichander"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Album</label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="e.g. Master Tamil"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Genre</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Folk / Mass / Beats"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Duration (mm:ss)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3:45"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>
              </div>

              {/* AUDIO UPLOAD SOURCE SELECTION */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#18E29A] uppercase tracking-wider">
                    🔊 Audio Upload Mode
                  </label>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setAudioSource("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        audioSource === "file" ? "bg-[#18E29A] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      📁 Local File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioSource("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        audioSource === "url" ? "bg-[#18E29A] text-black shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      🔗 Direct Audio URL
                    </button>
                  </div>
                </div>

                {audioSource === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#18E29A]/20 file:text-[#18E29A] hover:file:bg-[#18E29A]/30 cursor-pointer"
                    />
                    {audioFile && (
                      <p className="text-[11px] text-[#18E29A] mt-1.5 font-semibold">
                        Selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/song.mp3"
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                )}
              </div>

              {/* COVER THUMBNAIL UPLOAD SOURCE SELECTION */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#6D5EF8] uppercase tracking-wider">
                    🖼️ Thumbnail Cover Upload Mode
                  </label>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setCoverSource("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        coverSource === "file" ? "bg-[#6D5EF8] text-white shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      📁 Local Image Upload (All Formats)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSource("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        coverSource === "url" ? "bg-[#6D5EF8] text-white shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      🔗 Direct Image URL
                    </button>
                  </div>
                </div>

                {coverSource === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6D5EF8]/20 file:text-[#6D5EF8] hover:file:bg-[#6D5EF8]/30 cursor-pointer"
                    />
                    <p className="text-[10px] text-white/40 mt-1">Supports all image formats: PNG, JPG, WEBP, GIF, SVG, AVIF</p>
                    {coverFile && (
                      <p className="text-[11px] text-[#6D5EF8] mt-1.5 font-semibold">
                        Selected Cover: {coverFile.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                )}
              </div>

              {/* COLOR & LYRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-14 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-white/80">{color}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white/70 mb-1">Release Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2026)}
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Lyrics (Optional)</label>
                <textarea
                  rows={3}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Paste song lyrics here..."
                  className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={songLoading}
                className="w-full py-4 rounded-2xl btn-glow-primary text-sm font-extrabold text-black shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
              >
                {songLoading ? "Uploading Track..." : "🚀 Publish Track to Catalog"}
              </button>
            </form>
          </div>

          {/* Songs List Table (5 cols) */}
          <div className="lg:col-span-5 glass-card-premium p-6 rounded-3xl border border-white/10 flex flex-col h-[750px]">
            <h2 className="text-lg font-bold font-heading text-white mb-4 flex items-center justify-between">
              <span>📚 Catalog Tracks</span>
              <span className="text-xs font-normal text-white/50">{songs.length} items</span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between gap-3 group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 aspect-square rounded-xl overflow-hidden shadow-md shrink-0 border border-white/10 bg-white/5">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full aspect-square object-cover object-center"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "data:image/svg+xml;utf8," +
                            encodeURIComponent(
                              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${song.color ?? "#1ED760"}'/><text x='50' y='65' font-size='40' fill='white' text-anchor='middle'>♪</text></svg>`
                            );
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{song.title}</p>
                      <p className="text-[11px] text-white/60 truncate">{song.artist}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#18E29A] font-mono">{song.duration || "--:--"}</span>
                        {song.audioUrl.startsWith("/uploads/") && (
                          <span className="text-[9px] bg-[#18E29A]/20 text-[#18E29A] px-1.5 py-0.5 rounded font-bold">
                            Local File
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSong(song.id, song.title)}
                    className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 grid place-items-center opacity-70 group-hover:opacity-100 transition-all shrink-0"
                    title="Delete Track"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: GLOBAL PLAYLISTS MANAGEMENT
          ========================================== */}
      {activeTab === "playlists" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Global Playlist Form (7 cols) */}
          <div className="lg:col-span-7 glass-card-premium p-7 rounded-3xl space-y-6 border border-white/10">
            <h2 className="text-xl font-bold font-heading text-white flex items-center justify-between">
              <span>📻 Create Global Playlist</span>
              <span className="text-xs font-normal text-[#6D5EF8]">Visible to all users</span>
            </h2>

            {plError && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-300">
                ⚠️ {plError}
              </div>
            )}

            <form onSubmit={handleCreatePlaylistSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Playlist Name *</label>
                <input
                  type="text"
                  required
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  placeholder="e.g. Master Hits & Mass Mix 2026"
                  className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={plDescription}
                  onChange={(e) => setPlDescription(e.target.value)}
                  placeholder="Official curated global playlist..."
                  className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                />
              </div>

              {/* THUMBNAIL COVER SOURCE SELECTION (LINK OR LOCAL IMAGE) */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#6D5EF8] uppercase tracking-wider">
                    🖼️ Playlist Thumbnail Cover Mode
                  </label>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPlCoverSource("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        plCoverSource === "url" ? "bg-[#6D5EF8] text-white shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      🔗 Direct Image Link URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlCoverSource("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        plCoverSource === "file" ? "bg-[#6D5EF8] text-white shadow-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      📁 Local Image Upload (All Formats)
                    </button>
                  </div>
                </div>

                {plCoverSource === "url" ? (
                  <input
                    type="url"
                    value={plCoverUrl}
                    onChange={(e) => setPlCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500..."
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePlCoverFileChange}
                      className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6D5EF8]/20 file:text-[#6D5EF8] hover:file:bg-[#6D5EF8]/30 cursor-pointer"
                    />
                    <p className="text-[10px] text-white/40 mt-1">Supports all image formats: PNG, JPG, WEBP, GIF, SVG, AVIF</p>
                    {plCoverFile && (
                      <p className="text-[11px] text-[#6D5EF8] mt-1.5 font-semibold">
                        Selected Cover: {plCoverFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* TRACK PICKER TO ADD SONGS ANYTIME */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#18E29A] uppercase tracking-wider">
                    🎵 Add Songs to Playlist ({plSelectedSongIds.length} selected)
                  </label>
                  <input
                    type="text"
                    placeholder="Filter catalog..."
                    value={plSearchQuery}
                    onChange={(e) => setPlSearchQuery(e.target.value)}
                    className="glass-input-premium rounded-xl px-3 py-1 text-xs text-white outline-none w-36 sm:w-48"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar border border-white/5 rounded-xl p-2 bg-black/20">
                  {filteredSongsForNewPl.map((song) => {
                    const isSelected = plSelectedSongIds.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => toggleSongForNewPlaylist(song.id)}
                        className={`p-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#18E29A]/20 border border-[#18E29A]/40 text-white"
                            : "hover:bg-white/5 text-white/70"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 aspect-square rounded-lg overflow-hidden shrink-0 border border-white/10 bg-white/5">
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="w-full h-full aspect-square object-cover object-center"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "data:image/svg+xml;utf8," +
                                  encodeURIComponent(
                                    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${song.color ?? "#1ED760"}'/><text x='50' y='65' font-size='40' fill='white' text-anchor='middle'>♪</text></svg>`
                                  );
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{song.title}</p>
                            <p className="text-[10px] opacity-60 truncate">{song.artist}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            isSelected ? "bg-[#18E29A] text-black" : "bg-white/10 text-white"
                          }`}
                        >
                          {isSelected ? "✓ Added" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={plLoading}
                className="w-full py-4 rounded-2xl btn-glow-primary text-sm font-extrabold text-black shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
              >
                {plLoading ? "Creating Playlist..." : "🚀 Publish Global Playlist"}
              </button>
            </form>
          </div>

          {/* Existing Global Playlists List & Editor (5 cols) */}
          <div className="lg:col-span-5 glass-card-premium p-6 rounded-3xl border border-white/10 flex flex-col h-[750px]">
            <h2 className="text-lg font-bold font-heading text-white mb-4 flex items-center justify-between">
              <span>📻 Active Global Playlists</span>
              <span className="text-xs font-normal text-white/50">{catalog.playlists.length} items</span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {catalog.playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 space-y-3 group transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 aspect-square rounded-2xl overflow-hidden shadow-md shrink-0 border border-white/10 bg-white/5">
                        <img
                          src={pl.coverUrl}
                          alt={pl.name}
                          className="w-full h-full aspect-square object-cover object-center"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "data:image/svg+xml;utf8," +
                              encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${pl.color ?? "#1ED760"}'/><text x='50' y='65' font-size='40' fill='white' text-anchor='middle'>♪</text></svg>`
                              );
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{pl.name}</p>
                        <p className="text-xs text-white/60 line-clamp-1">{pl.description || "No description"}</p>
                        <span className="inline-block text-[10px] text-[#18E29A] font-mono mt-1">
                          {pl.songIds?.length || 0} tracks added
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onNavigate("playlist", pl.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex-1"
                    >
                      ▶ View Playlist
                    </button>
                    <button
                      onClick={() => startEditPlaylist(pl)}
                      className="px-3 py-1.5 rounded-xl bg-[#6D5EF8]/20 border border-[#6D5EF8]/30 text-[#6D5EF8] hover:bg-[#6D5EF8]/30 text-xs font-bold"
                    >
                      ✏️ Edit / Add Songs
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(pl.id, pl.name)}
                      className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 grid place-items-center shrink-0"
                      title="Delete Playlist"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAYLIST MODAL */}
      {editingPlaylist && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl grid place-items-center p-4 animate-fade-in">
          <form
            onSubmit={handleUpdatePlaylistSubmit}
            className="w-full max-w-xl glass-card-premium p-7 rounded-3xl space-y-5 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                <span>✏️ Edit Global Playlist & Add/Remove Songs</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlaylist(null)}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/15 grid place-items-center text-white/60 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Playlist Name</label>
                <input
                  required
                  value={editPlName}
                  onChange={(e) => setEditPlName(e.target.value)}
                  className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editPlDesc}
                  onChange={(e) => setEditPlDesc(e.target.value)}
                  className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                />
              </div>

              {/* EDIT THUMBNAIL COVER (URL LINK OR LOCAL IMAGE FILE) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#6D5EF8] uppercase tracking-wider">
                    🖼️ Update Cover Thumbnail
                  </label>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditPlCoverSource("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        editPlCoverSource === "url" ? "bg-[#6D5EF8] text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      🔗 Link URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPlCoverSource("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        editPlCoverSource === "file" ? "bg-[#6D5EF8] text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      📁 Upload File (All Formats)
                    </button>
                  </div>
                </div>

                {editPlCoverSource === "url" ? (
                  <input
                    type="url"
                    value={editPlCoverUrl}
                    onChange={(e) => setEditPlCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full glass-input-premium rounded-2xl px-4 py-3 text-sm text-white outline-none font-medium"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPlCoverFileChange}
                      className="w-full text-xs text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6D5EF8]/20 file:text-[#6D5EF8]"
                    />
                    <p className="text-[10px] text-white/40 mt-1">Supports PNG, JPG, WEBP, GIF, SVG, AVIF</p>
                  </div>
                )}
              </div>

              {/* EDIT SONGS IN PLAYLIST ANYTIME */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#18E29A] uppercase tracking-wider">
                    🎵 Manage Playlist Tracks ({editPlSongIds.length} added)
                  </label>
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={editSearchQuery}
                    onChange={(e) => setEditSearchQuery(e.target.value)}
                    className="glass-input-premium rounded-xl px-3 py-1 text-xs text-white outline-none w-36"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar border border-white/5 rounded-xl p-2 bg-black/20">
                  {filteredSongsForEditPl.map((song) => {
                    const isSelected = editPlSongIds.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => toggleSongForEditPlaylist(song.id)}
                        className={`p-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#18E29A]/20 border border-[#18E29A]/40 text-white"
                            : "hover:bg-white/5 text-white/70"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{song.title}</p>
                            <p className="text-[10px] opacity-60 truncate">{song.artist}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            isSelected ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-[#18E29A] text-black"
                          }`}
                        >
                          {isSelected ? "✕ Remove" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPlaylist(null)}
                className="px-5 py-2.5 rounded-full btn-glow-secondary text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={plLoading}
                className="px-6 py-2.5 rounded-full btn-glow-primary text-xs font-extrabold text-black"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
