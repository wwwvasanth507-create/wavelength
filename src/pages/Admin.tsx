import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import type { Song } from "../types";

interface AdminPageProps {
  onNavigate: (view: string) => void;
  songs: Song[];
  onRefreshCatalog?: () => void;
}

export default function Admin({ onNavigate, songs, onRefreshCatalog }: AdminPageProps) {
  const { user, isAdmin, token } = useAuth();
  const { addToast } = usePlayer();

  // Upload Form Modes
  const [audioSource, setAudioSource] = useState<"file" | "url">("file");
  const [coverSource, setCoverSource] = useState<"file" | "url">("file");

  // Form State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("3:30");
  const [color, setColor] = useState("#18E29A");
  const [lyrics, setLyrics] = useState("");
  const [year, setYear] = useState(2026);

  // File Inputs
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // URL Inputs
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4 text-2xl">
          🔒
        </div>
        <h2 className="text-2xl font-black font-heading text-white mb-2">Admin Access Required</h2>
        <p className="text-xs text-white/60 max-w-sm mb-6">
          Only authorized administrators can upload new songs, manage thumbnails, and modify the music catalog.
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

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      // Auto duration extract if audio element can read it
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
    setError(null);

    if (!title.trim() || !artist.trim()) {
      setError("Title and Artist are required");
      return;
    }

    if (audioSource === "file" && !audioFile) {
      setError("Please select an audio file to upload");
      return;
    }

    if (audioSource === "url" && !audioUrl.trim()) {
      setError("Please enter a valid direct Audio URL");
      return;
    }

    if (coverSource === "url" && !coverUrl.trim() && coverSource === "url") {
      setError("Please enter a valid direct Thumbnail Cover URL");
      return;
    }

    setLoading(true);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.detail || "Failed to upload song");
        return;
      }

      addToast(`✨ "${title}" uploaded successfully!`, "success");

      // Reset form
      setTitle("");
      setArtist("");
      setAlbum("");
      setGenre("");
      setLyrics("");
      setAudioFile(null);
      setCoverFile(null);
      setAudioUrl("");
      setCoverUrl("");

      if (onRefreshCatalog) {
        onRefreshCatalog();
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Server upload error");
    }
  };

  const handleDeleteSong = async (songId: string, songTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${songTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/songs/${songId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card-premium p-6 rounded-3xl border border-[#18E29A]/30">
        <div>
          <div className="flex items-center gap-2 text-[#18E29A] text-xs font-black uppercase tracking-wider mb-1">
            <span>👑 Administrator Portal</span>
          </div>
          <h1 className="text-3xl font-black font-heading text-white">Song & Thumbnail Manager</h1>
          <p className="text-xs text-white/60 mt-1">
            Upload new tracks manually via local file upload or direct URLs. Uploaded content is saved directly to persistent storage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/80 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Total Tracks: {songs.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Upload Form + Songs List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form (7 cols) */}
        <div className="lg:col-span-7 glass-card-premium p-7 rounded-3xl space-y-6 border border-white/10">
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>🎵 Add New Track</span>
          </h2>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-300">
              ⚠️ {error}
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
                    📁 Local Image Upload
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
                  placeholder="https://example.com/cover.jpg"
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
              disabled={loading}
              className="w-full py-4 rounded-2xl btn-glow-primary text-sm font-extrabold text-black shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Uploading Track & Cover..." : "🚀 Publish Track to Catalog"}
            </button>
          </form>
        </div>

        {/* Existing Songs Table (5 cols) */}
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
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-xl object-cover shadow-md shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80";
                    }}
                  />
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
    </div>
  );
}
