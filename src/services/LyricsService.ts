import { LyricsLine } from '../types/music';

class LyricsService {
  /**
   * Parses LRC format string into LyricsLine array
   */
  parseLRC(lrc: string): LyricsLine[] {
    const lines = lrc.split('\n');
    const lyrics: LyricsLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

    lines.forEach((line) => {
      const matches = [...line.matchAll(timeRegex)];
      if (matches.length === 0) return;

      const text = line.replace(timeRegex, '').trim();
      if (!text) return;

      matches.forEach((match) => {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3].padEnd(3, '0'));
        const time = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
        lyrics.push({ time, text });
      });
    });

    return lyrics.sort((a, b) => a.time - b.time);
  }

  /**
   * Fetches lyrics for a track.
   * In a real app, this would call an external API.
   * For this demo, we'll return some mock synced lyrics.
   */
  async getLyrics(
    title: string,
    artist: string
  ): Promise<LyricsLine[] | undefined> {
    // Mocking lyrics fetching
    // In a real scenario, you might use an API like Musixmatch or LRCLIB

    // For demo purposes, we'll return synced lyrics tailored to the track title

    const mockLRC = `
[00:02.00]${title}
[00:05.00]Performed by ${artist}
[00:10.00]Welcome to this amazing track
[00:15.00]Hope you are enjoying the music
[00:20.00]This is a synced lyrics demo
[00:25.00]Just like Apple Music experience
[00:30.00]Scrolling through the lines
[00:35.00]As the music plays along
[00:40.00]Feel the beat and the rhythm
[00:45.00]Lyrics highlighted in real-time
[00:50.00]Thank you for using our app
[00:55.00]Stay tuned for more updates
    `;

    return this.parseLRC(mockLRC);
  }
}
