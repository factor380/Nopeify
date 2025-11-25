import { useState, useCallback } from 'react';
import spotifyService from '../services/spotifyService';

export interface UseSearchReturn {
  results: any;
  loading: boolean;
  error: Error | null;
  search: (query: string, type?: 'track' | 'artist' | 'album' | 'playlist', limit?: number) => Promise<void>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (
      query: string,
      type: 'track' | 'artist' | 'album' | 'playlist' = 'track',
      limit: number = 20
    ) => {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await spotifyService.search(query, type, limit);
        setResults(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Search failed');
        setError(error);
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
};
