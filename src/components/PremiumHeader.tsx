import { useAuth } from "../context/AuthContext";

export default function PremiumHeader({
  onNavigate,
  onOpenAuthModal,
}: {
  onSearchClick?: () => void;
  onNavigate: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onOpenAuthModal?: () => void;
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between pointer-events-none">
      {/* Left Navigation Arrows */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => history.back()}
          className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 grid place-items-center text-white/80 hover:text-white hover:bg-black/80 icon-btn-smooth shadow-lg"
          aria-label="Go back"
          title="Go back"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={() => history.forward()}
          className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 grid place-items-center text-white/80 hover:text-white hover:bg-black/80 icon-btn-smooth shadow-lg"
          aria-label="Go forward"
          title="Go forward"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <button
          onClick={() => onNavigate("home")}
          className="lg:hidden flex items-center gap-2 ml-2 pointer-events-auto"
        >
          <img
            src="/app_icon.png"
            alt="Wavelength"
            className="h-8 w-8 rounded-xl object-cover border border-white/20 shadow-md"
          />
        </button>
      </div>

      {/* Right User / Admin Auth Buttons */}
      <div className="pointer-events-auto flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pl-4 shadow-lg">
            <div className="flex flex-col text-right pr-1">
              <span className="text-xs font-bold text-white leading-tight">{user.username}</span>
              {isAdmin ? (
                <span className="text-[9px] text-[#18E29A] font-extrabold uppercase tracking-wider">👑 Admin</span>
              ) : (
                <span className="text-[9px] text-white/50 uppercase font-semibold">User</span>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className="px-3 py-1.5 rounded-full bg-[#18E29A]/20 hover:bg-[#18E29A]/30 text-[#18E29A] text-xs font-extrabold transition-all border border-[#18E29A]/30"
                title="Admin Upload Portal"
              >
                Upload Center
              </button>
            )}

            <button
              onClick={logout}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 grid place-items-center text-xs font-bold transition-all"
              title="Log Out"
            >
              🚪
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-5 py-2 rounded-full btn-glow-primary text-xs font-black text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Log In / Create Account
          </button>
        )}
      </div>
    </header>
  );
}
