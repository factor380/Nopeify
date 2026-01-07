import { useState, useCallback, useEffect } from 'react';
import spotifyService from '../services/spotifyService';
import { SpotifyUser } from '../services/spotifyService';
import { deleteSpotifyAccessToken, deleteSpotifyRefreshToken } from '../services/secureStoreTokens';


export interface UseSpotifyReturn {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  loading: boolean;
  error: Error | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useSpotify = (): UseSpotifyReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Login with Spotify token
   */
  const login = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      spotifyService.setAccessToken(token);
      const userData = await spotifyService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      setIsAuthenticated(false);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout from Spotify
   */
  const logout = useCallback(async () => {
    try {
      spotifyService.clearAccessToken();
      await Promise.all([
      deleteSpotifyAccessToken(),
      deleteSpotifyRefreshToken()
    ]);
    } catch (err) {
      console.warn('Error clearing stored tokens on logout:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const userData = await spotifyService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh user');
      setError(error);
      console.error('Refresh user error:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
  };
};
