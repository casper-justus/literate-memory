import axios from 'axios';

export interface LyricsResult {
  lyrics: string;
  syncedLyrics?: string;
  source: 'lrclib' | 'lyrics.ovh';
}

const normalizeTerm = (value: string) =>
  value
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\bfeat\.?\b.*$/i, '')
    .replace(/\bft\.?\b.*$/i, '')
    .trim();

export async function fetchLyrics(
  artist: string,
  title: string
): Promise<LyricsResult | null> {
  const safeArtist = normalizeTerm(artist);
  const safeTitle = normalizeTerm(title);

  if (!safeArtist || !safeTitle) return null;

  try {
    const lrclibResponse = await axios.get('https://lrclib.net/api/get', {
      params: {
        artist: safeArtist,
        track: safeTitle,
      },
      timeout: 15000,
    });

    const plainLyrics = lrclibResponse.data?.plainLyrics;
    const syncedLyrics = lrclibResponse.data?.syncedLyrics;

    if (typeof plainLyrics === 'string' && plainLyrics.trim().length > 0) {
      return {
        lyrics: plainLyrics.trim(),
        syncedLyrics: typeof syncedLyrics === 'string' ? syncedLyrics : undefined,
        source: 'lrclib',
      };
    }
  } catch {
    // ignore
  }

  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(
        safeArtist
      )}/${encodeURIComponent(safeTitle)}`,
      { timeout: 15000 }
    );

    const lyrics = response.data?.lyrics;

    if (typeof lyrics === 'string' && lyrics.trim().length > 0) {
      return { lyrics: lyrics.trim(), source: 'lyrics.ovh' };
    }
  } catch {
    // ignore
  }

  return null;
}
