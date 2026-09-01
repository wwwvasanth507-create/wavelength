import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";

interface Props {
  onNavigate: (view: string, id?: string) => void;
  currentView: string;
  playlistIds: { id: string; name: string }[];
  onCreatePlaylistModal: () => void;
}

export default function Sidebar({
  onNavigate,
  currentView,
  playlistIds,
  onCreatePlaylistModal,
}: Props) {
  const { customPlaylists, likedSongIds } = usePlayer();
  const [filter, setFilter] = useState<"all" | "pinned">("all");

  const allPlaylists = [
    ...playlistIds,
    ...customPlaylists.map((p) => ({ id: p.id, name: p.name, isPinned: p.isPinned })),
  ];

  const displayedPlaylists = filter === "pinned" ? allPlaylists.filter((p) => (p as any).isPinned) : allPlaylists;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col glass-panel border-r border-white/10 p-5 gap-6 h-full">
      {/* Brand Header with App Icon */}
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center gap-3.5 px-1 text-left group"
      >
        <img
          src="/app_icon.png"
          alt="Wavelength"
          className="h-11 w-11 rounded-2xl object-cover shadow-2xl border border-white/20 group-hover:scale-105 transition-transform duration-300"
        />
        <div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#18E29A] transition-colors font-heading block">
            Wavelength
          </span>
          <span className="block text-[9px] uppercase tracking-widest text-[#18E29A] font-black">
            FEEL EVERY BEAT
          </span>
        </div>
      </button>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1.5">
        <SideNavItem
          active={currentView === "home"}
          onClick={() => onNavigate("home")}
          icon={
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          }
          label="Home"
        />
        <SideNavItem
          active={currentView === "search"}
          onClick={() => onNavigate("search")}
          icon={
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          }
          label="Search"
        />
        <SideNavItem
          active={currentView === "library"}
          onClick={() => onNavigate("library")}
          icon={
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
          }
          label="Your Library"
        />
      </nav>

      {/* Library Quick Access */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10 min-h-0 flex-1">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-white/50 font-black">
              Playlists
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70">
              {allPlaylists.length}
            </span>
          </div>
          <button
            onClick={onCreatePlaylistModal}
            className="h-7 w-7 rounded-full bg-white/5 hover:bg-[#18E29A] hover:text-black grid place-items-center text-white/70 transition-all icon-btn-smooth"
            aria-label="Create Playlist"
            title="Create Playlist"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Liked Songs Quick Shortcut */}
        <button
          onClick={() => onNavigate("library")}
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 border border-white/10 hover:border-rose-500/40 transition-all text-left group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 grid place-items-center text-white shadow-lg shrink-0">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-white group-hover:text-rose-400 transition-colors font-heading">Liked Songs</div>
            <div className="text-[11px] text-white/50 font-medium">{likedSongIds.length} tracks</div>
          </div>
        </button>

        {/* Playlist Filter Chips */}
        <div className="flex gap-1.5 px-1 py-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              filter === "all" ? "bg-white/15 text-white shadow-md" : "text-white/40 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pinned")}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              filter === "pinned" ? "bg-white/15 text-white shadow-md" : "text-white/40 hover:text-white"
            }`}
          >
            Pinned
          </button>
        </div>

        {/* Scrollable Playlist List */}
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1">
          {displayedPlaylists.map((p) => (
            <button
              key={p.id}
              onClick={() => onNavigate("playlist", p.id)}
              className={`text-left text-sm px-3.5 py-2.5 rounded-xl truncate transition-all flex items-center justify-between group font-medium ${
                currentView === `playlist:${p.id}`
                  ? "bg-[#18E29A]/15 text-[#18E29A] font-extrabold border border-[#18E29A]/30 shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="truncate">{p.name}</span>
              {(p as any).isPinned && (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#18E29A] shrink-0 opacity-90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 17h14l-1.5-6H6.5L5 17z" />
                  <path d="M9 11V4h6v7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SideNavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
        active
          ? "bg-gradient-to-r from-[#18E29A]/20 to-[#6D5EF8]/20 text-[#18E29A] border border-[#18E29A]/30 shadow-lg font-heading"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
        {icon}
      </svg>
      {label}
    </button>
  );
}

export function MiniSidebar({
  onNavigate,
  currentView,
}: {
  onNavigate: (v: string) => void;
  currentView: string;
}) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Search",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      ),
    },
    {
      id: "library",
      label: "Library",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around glass-panel border-t border-white/10 px-2 py-2 shrink-0">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all ${
            currentView === item.id
              ? "text-[#18E29A] font-extrabold"
              : "text-white/60 hover:text-white"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
