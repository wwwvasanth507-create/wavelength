import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AudioQuality, Playlist, Song, Toast } from "../types";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PersistedPlayerState {
  queue: Song[];
  currentIndex: number;
  currentSongId: string | null;
  elapsed: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  isPlaying: boolean;
  likedSongIds: string[];
  recentlyPlayed: Song[];
  playbackSpeed: number;
  audioQuality: AudioQuality;
  customPlaylists: Playlist[];
  searchHistory: string[];
}

export type ProgressListener = (data: { elapsed: number; progress: number; duration: number }) => void;

interface PlayerState {
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  elapsed: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  playbackSpeed: number;
  audioQuality: AudioQuality;
  sleepTimer: number | null;
  likedSongIds: string[];
  recentlyPlayed: Song[];
  upNext: Song[];
  customPlaylists: Playlist[];
  searchHistory: string[];
  toasts: Toast[];
  
  subscribeProgress: (cb: ProgressListener) => () => void;
  playSong: (song: Song, queue?: Song[]) => void;
  playQueueIndex: (index: number) => void;
  playNext: (song: Song) => void;
  playLast: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  seekToSeconds: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (song: Song) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAudioQuality: (q: AudioQuality) => void;
  setSleepTimerMinutes: (minutes: number | null) => void;

  createPlaylist: (name: string, description?: string, isPrivate?: boolean, isCollaborative?: boolean) => Playlist;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  togglePinPlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;

  addSearchHistory: (query: string) => void;
  removeSearchHistory: (query: string) => void;
  clearSearchHistory: (query?: string) => void;

  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);
const LIKED_STORAGE_KEY = "wavelength-liked-songs-permanent";
const SETTINGS_STORAGE_KEY = "wavelength-settings-v1";
const SESSION_PLAYBACK_KEY = "wavelength-player-session";
const SILENT_AUDIO_URI = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function readPersistedLikedSongs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIKED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readPersistedState(defaultSongs: Song[]): PersistedPlayerState {
  const likedSongIds = readPersistedLikedSongs();
  const fallback: PersistedPlayerState = {
    queue: defaultSongs,
    currentIndex: -1,
    currentSongId: null,
    elapsed: 0,
    volume: 0.85,
    shuffle: false,
    repeat: "all", // DEFAULT CONTINUOUS LOOP MODE
    isPlaying: false,
    likedSongIds,
    recentlyPlayed: [],
    playbackSpeed: 1,
    audioQuality: "high",
    customPlaylists: [],
    searchHistory: ["A.R. Rahman", "Anirudh", "Modern Classical", "Lo-Fi Beats"],
  };

  if (typeof window === "undefined") return fallback;

  try {
    const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const rawSession = window.localStorage.getItem(SESSION_PLAYBACK_KEY);
    
    let parsedSettings: Partial<PersistedPlayerState> = {};
    let parsedSession: Partial<PersistedPlayerState> = {};

    if (rawSettings) {
      try { parsedSettings = JSON.parse(rawSettings); } catch {}
    }
    if (rawSession) {
      try { parsedSession = JSON.parse(rawSession); } catch {}
    }

    const savedRecentlyPlayed = Array.isArray(parsedSession.recentlyPlayed || parsedSettings.recentlyPlayed)
      ? (parsedSession.recentlyPlayed || parsedSettings.recentlyPlayed || []).slice(0, 3) // STRICTLY 3 PREVIOUS SONGS
      : [];

    return {
      queue: defaultSongs,
      currentIndex: typeof parsedSession.currentIndex === "number" ? parsedSession.currentIndex : -1,
      currentSongId: parsedSession.currentSongId ?? null,
      elapsed: parsedSession.elapsed ?? 0,
      volume: parsedSettings.volume ?? 0.85,
      shuffle: parsedSettings.shuffle ?? false,
      repeat: parsedSettings.repeat ?? "all", // CONTINUOUS PLAYBACK DEFAULT
      isPlaying: false,
      likedSongIds,
      recentlyPlayed: savedRecentlyPlayed,
      playbackSpeed: parsedSettings.playbackSpeed ?? 1,
      audioQuality: parsedSettings.audioQuality ?? "high",
      customPlaylists: Array.isArray(parsedSettings.customPlaylists) ? parsedSettings.customPlaylists : [],
      searchHistory: Array.isArray(parsedSettings.searchHistory) ? parsedSettings.searchHistory : fallback.searchHistory,
    };
  } catch {
    return fallback;
  }
}

export function PlayerProvider({
  children,
  songs,
}: {
  children: ReactNode;
  songs: Song[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const secondaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const persistedState = useMemo(() => readPersistedState(songs), [songs]);

  const [queue, setQueue] = useState<Song[]>(() => persistedState.queue);
  const [originalQueue, setOriginalQueue] = useState<Song[]>(() => persistedState.queue);
  const [currentIndex, setCurrentIndex] = useState<number>(() => persistedState.currentIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDurationState] = useState(0);
  const [elapsed, setElapsedState] = useState(0);
  const [volume, setVolumeState] = useState(() => persistedState.volume);
  const [shuffle, setShuffle] = useState(() => persistedState.shuffle);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">(() => persistedState.repeat);
  const [playbackSpeed, setPlaybackSpeedState] = useState(() => persistedState.playbackSpeed);
  const [audioQuality, setAudioQualityState] = useState<AudioQuality>(() => persistedState.audioQuality);
  const [likedSongIds, setLikedSongIds] = useState<string[]>(() => persistedState.likedSongIds);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => persistedState.recentlyPlayed.slice(0, 3));
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => persistedState.customPlaylists);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => persistedState.searchHistory);
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const currentSong = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
  const upNext = currentIndex >= 0 && currentIndex < queue.length - 1 ? queue.slice(currentIndex + 1, currentIndex + 50) : [];

  // High-frequency time listeners (prevents React top-level context re-renders)
  const progressListenersRef = useRef<Set<ProgressListener>>(new Set());
  const crossfadeRef = useRef<{ isCrossfading: boolean; nextIndex: number } | null>(null);

  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);
  const playbackSpeedRef = useRef(playbackSpeed);
  const durationRef = useRef(duration);
  const stateRef = useRef({ repeat, queue, currentIndex, shuffle, currentSong, songs, originalQueue });

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => {
    stateRef.current = { repeat, queue, currentIndex, shuffle, currentSong, songs, originalQueue };
  }, [repeat, queue, currentIndex, shuffle, currentSong, songs, originalQueue]);

  const subscribeProgress = (cb: ProgressListener) => {
    progressListenersRef.current.add(cb);
    return () => {
      progressListenersRef.current.delete(cb);
    };
  };

  const notifyProgress = (el: number, prog: number, dur: number) => {
    progressListenersRef.current.forEach((fn) => fn({ elapsed: el, progress: prog, duration: dur }));
  };

  // UNLIMITED BACKGROUND AUDIO & EXTREME POWER SAVER KEEP-ALIVE
  const requestWakeLock = async () => {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      } catch {}
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch {}
    }
  };

  const keepAudioActive = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current && !oscRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.value = 20; // 20Hz sub-audible keep-alive pulse
        gain.gain.value = 0.00001;
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        oscRef.current = osc;
      }
      if (silentAudioRef.current) {
        silentAudioRef.current.play().catch(() => {});
      }
    } catch {}
  };

  useEffect(() => {
    if (isPlaying) {
      requestWakeLock();
      keepAudioActive();
    } else {
      releaseWakeLock();
      if (silentAudioRef.current) silentAudioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleVisibilityOrLock = () => {
      if (isPlayingRef.current) {
        requestWakeLock();
        keepAudioActive();
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityOrLock);
    window.addEventListener("pagehide", handleVisibilityOrLock);
    window.addEventListener("blur", handleVisibilityOrLock);
    window.addEventListener("focus", handleVisibilityOrLock);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrLock);
      window.removeEventListener("pagehide", handleVisibilityOrLock);
      window.removeEventListener("blur", handleVisibilityOrLock);
      window.removeEventListener("focus", handleVisibilityOrLock);
    };
  }, []);

  // Web Lock API to prevent tab/process killing in screen-off & extreme power saver mode
  useEffect(() => {
    if (typeof navigator !== "undefined" && "locks" in navigator && isPlaying) {
      (navigator as any).locks.request("wavelength_unlimited_background_audio", { mode: "shared" }, () => {
        return new Promise(() => {});
      }).catch(() => {});
    }
  }, [isPlaying]);

  // Cancel any active 3-second crossfade
  const cancelCrossfade = () => {
    if (crossfadeRef.current?.isCrossfading) {
      crossfadeRef.current = null;
      if (secondaryAudioRef.current) {
        secondaryAudioRef.current.pause();
        secondaryAudioRef.current.src = "";
      }
      if (audioRef.current) {
        audioRef.current.volume = volumeRef.current;
      }
    }
  };

  // Toast System
  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audio Engine & Dual Audio Crossfade Listener
  useEffect(() => {
    const attachListeners = (a: HTMLAudioElement) => {
      a.addEventListener("timeupdate", () => {
        if (a !== audioRef.current) return;
        if (!a.duration) return;
        const cur = a.currentTime;
        const dur = a.duration;
        const prog = cur / dur;
        const rem = dur - cur;

        if (!crossfadeRef.current?.isCrossfading) {
          notifyProgress(cur, prog, dur);
        } else if (secondaryAudioRef.current) {
          const secCur = secondaryAudioRef.current.currentTime || 0;
          const secDur = secondaryAudioRef.current.duration || 0;
          notifyProgress(secCur, secDur > 0 ? secCur / secDur : 0, secDur);
        }

        // TRIGGER 3-SECOND CROSSFADE INTO NEXT SONG WITH VOLUME FADE & LIVE UI UPDATE
        if (rem <= 3.0 && dur > 4.0 && !crossfadeRef.current && isPlayingRef.current) {
          const { queue: q, currentIndex: idx, repeat: r } = stateRef.current;
          let nextIdx = idx + 1;
          if (nextIdx >= q.length) {
            nextIdx = (r === "all" || r === "off") ? 0 : -1; // Default continuous loop
          }
          if (r === "one") nextIdx = idx;

          if (nextIdx >= 0 && nextIdx < q.length) {
            const upcomingTrack = q[nextIdx];
            crossfadeRef.current = { isCrossfading: true, nextIndex: nextIdx };

            if (!secondaryAudioRef.current) {
              const sec = new Audio();
              sec.preload = "auto";
              (sec as any).playsInline = true;
              attachListeners(sec);
              secondaryAudioRef.current = sec;
            }

            const sec = secondaryAudioRef.current;
            sec.src = upcomingTrack.audioUrl;
            sec.currentTime = 0;
            sec.volume = 0;
            sec.playbackRate = playbackSpeedRef.current;
            sec.play().catch(() => {});

            // LIVE UPDATE UI IMMEDIATELY TO NEXT SONG DETAILS IN LAST 3 SECONDS
            setCurrentIndex(nextIdx);
          }
        }

        // FADE VOLUME DURING LAST 3 SECONDS
        if (crossfadeRef.current?.isCrossfading) {
          const fadeProgress = Math.min(1, Math.max(0, (3.0 - rem) / 3.0)); // 0 at 3s remaining, 1 at 0s
          const maxVol = volumeRef.current;
          // Reduce current playing song volume slightly down to 0
          a.volume = Math.max(0, maxVol * (1 - fadeProgress));
          // Increase upcoming next song sound louder up to maximum volume
          if (secondaryAudioRef.current) {
            secondaryAudioRef.current.volume = Math.min(maxVol, maxVol * fadeProgress);
          }
        }
      });

      a.addEventListener("loadedmetadata", () => {
        if (a === audioRef.current) setDurationState(a.duration || 0);
      });

      a.addEventListener("ended", () => {
        if (a === audioRef.current) handleEnded();
      });

      a.addEventListener("error", () => {
        if (a === audioRef.current && stateRef.current.currentSong) {
          const s = stateRef.current.currentSong;
          let hash = 0;
          for (let i = 0; i < s.id.length; i++) hash = (hash * 31 + s.id.charCodeAt(i)) >>> 0;
          const fallbackNum = (hash % 16) + 1;
          const fallbackUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${fallbackNum}.mp3`;

          if (a.src !== fallbackUrl) {
            a.src = fallbackUrl;
            a.load();
            a.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        }
      });

      a.addEventListener("play", () => {
        if (a === audioRef.current) setIsPlaying(true);
      });

      a.addEventListener("pause", () => {
        if (a === audioRef.current && !crossfadeRef.current?.isCrossfading) setIsPlaying(false);
      });
    };

    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "auto";
      (a as any).playsInline = true;
      a.volume = volumeRef.current;
      attachListeners(a);
      audioRef.current = a;
    }

    if (!secondaryAudioRef.current) {
      const sec = new Audio();
      sec.preload = "auto";
      (sec as any).playsInline = true;
      attachListeners(sec);
      secondaryAudioRef.current = sec;
    }

    if (!silentAudioRef.current) {
      const silent = new Audio(SILENT_AUDIO_URI);
      silent.loop = true;
      silent.volume = 0.01;
      silentAudioRef.current = silent;
    }
  }, []);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimerSeconds === null) return;
    if (sleepTimerSeconds <= 0) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        if (silentAudioRef.current) silentAudioRef.current.pause();
        addToast("Sleep timer finished. Music paused.", "info");
      }
      setSleepTimerSeconds(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [sleepTimerSeconds]);

  // Volume & Speed sync
  useEffect(() => {
    if (audioRef.current && !crossfadeRef.current?.isCrossfading) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
    if (secondaryAudioRef.current) secondaryAudioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Preload next 2 upcoming tracks & warm up initial 2-second audio chunks
  const preloadAudio1Ref = useRef<HTMLAudioElement | null>(null);
  const preloadAudio2Ref = useRef<HTMLAudioElement | null>(null);

  const warmAudioCache = (url: string) => {
    if (typeof fetch === "undefined" || !url) return;
    try {
      fetch(url, { headers: { Range: "bytes=0-65536" } }).catch(() => {});
    } catch {}
  };

  const preloadNextTwoSongs = (q: Song[], idx: number, repeatMode: string) => {
    if (!q.length || idx < 0) return;

    const getTargetIndex = (offset: number) => {
      let target = idx + offset;
      if (target >= q.length) {
        if (repeatMode === "all" || repeatMode === "off") {
          target = target % q.length;
        } else {
          return null;
        }
      }
      return target;
    };

    const idx1 = getTargetIndex(1);
    const idx2 = getTargetIndex(2);

    const song1 = idx1 !== null && idx1 >= 0 && idx1 < q.length ? q[idx1] : null;
    const song2 = idx2 !== null && idx2 >= 0 && idx2 < q.length ? q[idx2] : null;

    if (song1) {
      warmAudioCache(song1.audioUrl);
      if (!preloadAudio1Ref.current) {
        const a = new Audio();
        a.preload = "auto";
        (a as any).playsInline = true;
        preloadAudio1Ref.current = a;
      }
      if (preloadAudio1Ref.current.src !== song1.audioUrl) {
        preloadAudio1Ref.current.src = song1.audioUrl;
        preloadAudio1Ref.current.load();
      }
    }

    if (song2) {
      warmAudioCache(song2.audioUrl);
      if (!preloadAudio2Ref.current) {
        const a = new Audio();
        a.preload = "auto";
        (a as any).playsInline = true;
        preloadAudio2Ref.current = a;
      }
      if (preloadAudio2Ref.current.src !== song2.audioUrl) {
        preloadAudio2Ref.current.src = song2.audioUrl;
        preloadAudio2Ref.current.load();
      }
    }
  };

  // Playback execution when track changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentSong) return;

    // Check if crossfade is currently running for this track
    if (crossfadeRef.current?.isCrossfading) {
      // Live UI update triggered during crossfade: let crossfade engine continue
      preloadNextTwoSongs(queue, currentIndex, repeat);
      return;
    }

    cancelCrossfade();

    const targetUrl = currentSong.audioUrl;
    if (a.src !== targetUrl) {
      a.src = targetUrl;
      a.currentTime = 0;
      setElapsedState(0);
      setProgressState(0);
      notifyProgress(0, 0, a.duration || 0);
      a.load();
    }
    a.playbackRate = playbackSpeed;

    keepAudioActive();
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    // Preload next 2 upcoming tracks in queue
    preloadNextTwoSongs(queue, currentIndex, repeat);
  }, [currentSong?.id, currentIndex, queue, repeat]);

  // UPDATE RECENTLY PLAYED — STORE 3 PREVIOUS SONGS ONLY IN MEMORY
  useEffect(() => {
    if (!currentSong) return;
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((s) => s.id !== currentSong.id);
      return [currentSong, ...filtered].slice(0, 3); // STRICT LIMIT: EXACTLY 3 PREVIOUS SONGS STATUS ONLY
    });
  }, [currentSong?.id]);

  // PERMANENT LOCAL STORAGE SAVING FOR LIKED SONGS & SESSION STATE
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedSongIds));
    } catch {}
  }, [likedSongIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payloadSettings = {
        volume,
        shuffle,
        repeat,
        playbackSpeed,
        audioQuality,
        customPlaylists,
        searchHistory,
      };
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payloadSettings));

      const payloadSession = {
        currentIndex,
        currentSongId: currentSong?.id ?? null,
        elapsed,
        recentlyPlayed: recentlyPlayed.slice(0, 3), // 3 PREVIOUS SONGS ONLY
      };
      window.localStorage.setItem(SESSION_PLAYBACK_KEY, JSON.stringify(payloadSession));
    } catch {}
  }, [volume, shuffle, repeat, playbackSpeed, audioQuality, customPlaylists, searchHistory, currentIndex, currentSong?.id, elapsed, recentlyPlayed]);

  // Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>("[data-global-search]");
        input?.focus();
        return;
      }
      if (isInput) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
      } else if (e.key.toLowerCase() === "l" && currentSong) {
        e.preventDefault();
        toggleLike(currentSong);
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        toggleShuffle();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        cycleRepeat();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        setVolume(volume > 0 ? 0 : 0.85);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [volume, currentSong]);

  // MEDIA SESSION API (LOCKSCREEN & CONTROL CENTER CONTINUOUS AUDIO)
  useEffect(() => {
    if (!navigator.mediaSession || !currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album ?? "Wavelength Music",
      artwork: [
        { src: currentSong.coverUrl, sizes: "96x96", type: "image/jpeg" },
        { src: currentSong.coverUrl, sizes: "128x128", type: "image/jpeg" },
        { src: currentSong.coverUrl, sizes: "192x192", type: "image/jpeg" },
        { src: currentSong.coverUrl, sizes: "256x256", type: "image/jpeg" },
        { src: currentSong.coverUrl, sizes: "384x384", type: "image/jpeg" },
        { src: currentSong.coverUrl, sizes: "512x512", type: "image/jpeg" },
      ],
    });

    try {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
      if (duration && isFinite(duration) && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: playbackSpeed,
          position: Math.min(elapsed, duration),
        });
      }
    } catch {}

    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("previoustrack", () => prev());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) seekToSeconds(details.seekTime);
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => seekToSeconds(Math.max(0, elapsed - 10)));
    navigator.mediaSession.setActionHandler("seekforward", () => seekToSeconds(Math.min(duration, elapsed + 10)));
    navigator.mediaSession.setActionHandler("stop", () => {
      cancelCrossfade();
      if (audioRef.current) audioRef.current.pause();
      if (silentAudioRef.current) silentAudioRef.current.pause();
      setIsPlaying(false);
    });
  }, [currentSong?.id, isPlaying, elapsed, duration, playbackSpeed]);

  const handleEnded = () => {
    if (crossfadeRef.current?.isCrossfading) {
      const nextIdx = crossfadeRef.current.nextIndex;
      if (secondaryAudioRef.current) {
        const temp = audioRef.current;
        audioRef.current = secondaryAudioRef.current;
        secondaryAudioRef.current = temp;
        if (secondaryAudioRef.current) {
          secondaryAudioRef.current.pause();
          secondaryAudioRef.current.src = "";
        }
        if (audioRef.current) {
          audioRef.current.volume = volumeRef.current;
        }
      }
      crossfadeRef.current = null;
      setCurrentIndex(nextIdx);
      setIsPlaying(true);
      return;
    }

    const { repeat: r } = stateRef.current;
    if (r === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setElapsedState(0);
        setProgressState(0);
        notifyProgress(0, 0, audioRef.current.duration || 0);
        audioRef.current.play();
      }
      return;
    }
    goNext(true);
  };

  const goNext = (auto = false) => {
    cancelCrossfade();
    const { queue: q, currentIndex: idx } = stateRef.current;
    if (q.length === 0) return;
    let nextIndex = idx + 1;
    if (nextIndex >= q.length) {
      if (stateRef.current.repeat === "all" || stateRef.current.repeat === "off") {
        nextIndex = 0; // CONTINUOUS LOOP MODE
      } else {
        if (auto) setIsPlaying(false);
        return;
      }
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setElapsedState(0);
    setProgressState(0);
    notifyProgress(0, 0, audioRef.current?.duration || 0);
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    cancelCrossfade();
    const source = newQueue ?? (originalQueue.length ? originalQueue : songs);
    const normalized = source.filter(Boolean);
    
    let playOrder = [...normalized];
    if (shuffle) {
      const rest = playOrder.filter((s) => s.id !== song.id);
      playOrder = [song, ...shuffleArray(rest)];
    }

    const idx = playOrder.findIndex((s) => s.id === song.id);
    const finalIndex = idx >= 0 ? idx : 0;
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setOriginalQueue(normalized);
    setQueue(playOrder);
    setCurrentIndex(finalIndex);
    setElapsedState(0);
    setProgressState(0);
    notifyProgress(0, 0, 0);
    setIsPlaying(true);
    addToast(`Playing "${song.title}"`, "info");
  };

  const playQueueIndex = (index: number) => {
    cancelCrossfade();
    if (index < 0 || index >= queue.length) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setElapsedState(0);
    setProgressState(0);
    notifyProgress(0, 0, 0);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const playNext = (song: Song) => {
    setQueue((prev) => {
      const nextQ = [...prev];
      const insertAt = currentIndex >= 0 ? currentIndex + 1 : 0;
      nextQ.splice(insertAt, 0, song);
      return nextQ;
    });
    addToast(`"${song.title}" added to play next`, "info");
  };

  const playLast = (song: Song) => {
    setQueue((prev) => [...prev, song]);
    addToast(`"${song.title}" added to queue`, "info");
  };

  const removeFromQueue = (index: number) => {
    if (index < 0 || index >= queue.length) return;
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }
    addToast("Removed from queue", "info");
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= queue.length || toIndex < 0 || toIndex >= queue.length) return;
    setQueue((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !currentSong) {
      if (queue.length > 0) setCurrentIndex(0);
      return;
    }
    if (a.paused) {
      keepAudioActive();
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      cancelCrossfade();
      a.pause();
      if (silentAudioRef.current) silentAudioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const next = () => goNext(false);

  const prev = () => {
    cancelCrossfade();
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
    }
    setElapsedState(0);
    setProgressState(0);
    notifyProgress(0, 0, 0);

    if (queue.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  const seek = (ratio: number) => {
    cancelCrossfade();
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const nextSec = Math.max(0, Math.min(1, ratio)) * a.duration;
    a.currentTime = nextSec;
    setElapsedState(nextSec);
    setProgressState(ratio);
    notifyProgress(nextSec, ratio, a.duration);
  };

  const seekToSeconds = (seconds: number) => {
    cancelCrossfade();
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const clamped = Math.max(0, Math.min(a.duration, seconds));
    a.currentTime = clamped;
    setElapsedState(clamped);
    setProgressState(clamped / a.duration);
    notifyProgress(clamped, clamped / a.duration, a.duration);
  };

  const setVolume = (v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audioRef.current && !crossfadeRef.current?.isCrossfading) {
      audioRef.current.volume = val;
    }
  };

  const toggleShuffle = () => {
    setShuffle((prevShuffle) => {
      const nextShuffle = !prevShuffle;
      if (nextShuffle) {
        if (currentSong) {
          const rest = originalQueue.filter((s) => s.id !== currentSong.id);
          const shuffledQueue = [currentSong, ...shuffleArray(rest)];
          setQueue(shuffledQueue);
          setCurrentIndex(0);
        } else {
          setQueue(shuffleArray(originalQueue));
        }
        addToast("Shuffle enabled", "info");
      } else {
        setQueue(originalQueue);
        if (currentSong) {
          const idx = originalQueue.findIndex((s) => s.id === currentSong.id);
          setCurrentIndex(idx >= 0 ? idx : 0);
        }
        addToast("Shuffle disabled", "info");
      }
      return nextShuffle;
    });
  };

  const cycleRepeat = () => {
    setRepeat((r) => {
      const nextR = r === "off" ? "all" : r === "all" ? "one" : "off";
      addToast(`Repeat ${nextR.toUpperCase()}`, "info");
      return nextR;
    });
  };

  const toggleLike = (song: Song) => {
    setLikedSongIds((prev) => {
      const isLiked = prev.includes(song.id);
      if (isLiked) {
        addToast(`Removed "${song.title}" from Liked Songs`, "info");
        return prev.filter((id) => id !== song.id);
      }
      addToast(`Added "${song.title}" to Liked Songs`, "success");
      return [...prev, song.id];
    });
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    addToast(`Speed: ${speed}x`, "info");
  };

  const setAudioQuality = (q: AudioQuality) => {
    setAudioQualityState(q);
    addToast(`Audio Quality: ${q.toUpperCase()}`, "info");
  };

  const setSleepTimerMinutes = (minutes: number | null) => {
    if (minutes === null) {
      setSleepTimerSeconds(null);
      addToast("Sleep timer off", "info");
    } else {
      setSleepTimerSeconds(minutes * 60);
      addToast(`Sleep timer set for ${minutes} minutes`, "info");
    }
  };

  const createPlaylist = (name: string, description = "", isPrivate = false, isCollaborative = false): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name.trim() || "My Playlist",
      description,
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      songIds: [],
      isPrivate,
      isCollaborative,
      isPinned: false,
    };
    setCustomPlaylists((prev) => [newPlaylist, ...prev]);
    addToast(`Created playlist "${newPlaylist.name}"`, "success");
    return newPlaylist;
  };

  const renamePlaylist = (id: string, newName: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
    addToast("Playlist renamed", "info");
  };

  const deletePlaylist = (id: string) => {
    setCustomPlaylists((prev) => prev.filter((p) => p.id !== id));
    addToast("Playlist deleted", "info");
  };

  const togglePinPlaylist = (id: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.songIds.includes(songId)) return p;
        return { ...p, songIds: [...p.songIds, songId] };
      })
    );
    addToast("Added track to playlist", "success");
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        return { ...p, songIds: p.songIds.filter((id) => id !== songId) };
      })
    );
    addToast("Removed track from playlist", "info");
  };

  const addSearchHistory = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearchHistory((prev) => [q, ...prev.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 10));
  };

  const removeSearchHistory = (query: string) => {
    setSearchHistory((prev) => prev.filter((item) => item !== query));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        originalQueue,
        currentIndex,
        currentSong,
        isPlaying,
        progress,
        duration,
        elapsed,
        volume,
        shuffle,
        repeat,
        playbackSpeed,
        audioQuality,
        sleepTimer: sleepTimerSeconds,
        likedSongIds,
        recentlyPlayed,
        upNext,
        customPlaylists,
        searchHistory,
        toasts,

        subscribeProgress,
        playSong,
        playQueueIndex,
        playNext,
        playLast,
        removeFromQueue,
        reorderQueue,
        togglePlay,
        next,
        prev,
        seek,
        seekToSeconds,
        setVolume,
        toggleShuffle,
        cycleRepeat,
        toggleLike,
        setPlaybackSpeed,
        setAudioQuality,
        setSleepTimerMinutes,

        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        togglePinPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,

        addSearchHistory,
        removeSearchHistory,
        clearSearchHistory,

        addToast,
        removeToast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export function usePlayerProgress() {
  const p = usePlayer();
  const [progressData, setProgressData] = useState({
    elapsed: p.elapsed,
    progress: p.progress,
    duration: p.duration,
  });

  useEffect(() => {
    return p.subscribeProgress((data) => {
      setProgressData(data);
    });
  }, [p]);

  return progressData;
}

export function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
