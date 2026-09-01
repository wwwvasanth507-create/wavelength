import type { Song, Playlist } from "../types";

/**
 * ============================================================
 *  🎵  ADMIN PANEL — CATALOG STORE
 * ============================================================
 *  All song and playlist catalog management is performed via
 *  the Admin Dashboard (/admin).
 * ============================================================
 */

export const rawSongsCatalog: Song[] = [];

// Fisher-Yates deterministic shuffle helper for catalog shuffling
function shuffleCatalog<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(((i * 9301 + 49297) % 233280) / 233280 * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

export const songs: Song[] = shuffleCatalog(rawSongsCatalog);

export const playlists: Playlist[] = [];
