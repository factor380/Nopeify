import { useState, useCallback } from 'react';
import spotifyService, { SpotifyTrack } from '../services/spotifyService';

export interface UseTopTracksReturn {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: Error | null;
  fetchTopTracks: (
    limit?: number,
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
  ) => Promise<void>;
}

export const useTopTracks = (): UseTopTracksReturn => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopTracks = useCallback(
    async (
      limit: number = 20,
      timeRange: 'long_term' | 'medium_term' | 'short_term' = 'medium_term'
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await spotifyService.getTopTracks(limit, 0, timeRange);
        setTracks(response.items);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch top tracks');
        setError(error);
        console.error('Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { tracks, loading, error, fetchTopTracks };
};
