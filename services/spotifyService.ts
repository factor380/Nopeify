
import axios, { AxiosInstance } from 'axios';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
  owner: { display_name: string };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
}

class SpotifyService {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Set the access token for API requests
   */
  setAccessToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the access token
   */
  clearAccessToken() {
    this.accessToken = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Get current user's profile
   */
  async getCurrentUser(): Promise<SpotifyUser> {
    try {
      const response = await this.client.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Get user's top tracks
   */
  async getTopTracks(
    limit: number = 20,
    offset: number = 0,
    timeRange: 'long_term' | 'medium_term' | 'short_term' = 'medium_term'
  ): Promise<SpotifyTopTracksResponse> {
    try {
      const response = await this.client.get('/me/top/tracks', {
        params: { limit, offset, time_range: timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    }
  }


  /**
   * Search for tracks, artists, albums, or playlists
   */
  async search(
    query: string,
    type: 'track' | 'artist' | 'album' | 'playlist' = 'track',
    limit: number = 20
  ) {
    try {
      const response = await this.client.get('/search', {
        params: { q: query, type, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Spotify:', error);
      throw error;
    }
  }

  /**
   * Get a track by ID
   */
  async getTrack(trackId: string): Promise<SpotifyTrack> {
    try {
      const response = await this.client.get(`/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching track:', error);
      throw error;
    }
  }

  /**
   * Get multiple tracks by IDs
   */
  async getTracks(trackIds: string[]): Promise<SpotifyTrack[]> {
    try {
      const response = await this.client.get('/tracks', {
        params: { ids: trackIds.join(',') },
      });
      return response.data.tracks;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
  }

  /**
   * Get user's saved tracks
   */
  async getSavedTracks(limit: number = 20, offset: number = 0) {
    try {
      const response = await this.client.get('/me/tracks', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved tracks:', error);
      throw error;
    }
  }

  /**
   * Check if tracks are saved by the user
   */
  async checkSavedTracks(trackIds: string[]): Promise<boolean[]> {
    try {
      const response = await this.client.get('/me/tracks/contains', {
        params: { ids: trackIds.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking saved tracks:', error);
      throw error;
    }
  }


  /**
   * Get artist by ID
   */
  async getArtist(artistId: string) {
    try {
      const response = await this.client.get(`/artists/${artistId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  }

  /**
   * Get user's followed artists
   */
  async getFollowedArtists(limit: number = 20) {
    try {
      const response = await this.client.get('/me/following', {
        params: { type: 'artist', limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching followed artists:', error);
      throw error;
    }
  }



  /**
   * Check if user follows artists or users
   */
  async checkFollowing(ids: string[], type: 'artist' | 'user'): Promise<boolean[]> {
    try {
      const response = await this.client.get('/me/following/contains', {
        params: { type, ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking following status:', error);
      throw error;
    }
  }


  /**
   * Pause playback on the user's active device
   */
  async pausePlayback(deviceId?: string): Promise<void> {
    try {
      const params: any = {};
      if (deviceId) params.device_id = deviceId;
      await this.client.put('/me/player/pause', null, { params });
    } catch (error) {
      console.error('Error pausing playback:', error);
      throw error;
    }
  }



  async getCurrentPlayback(token?: string) {
    const client = token
      ? axios.create({
        baseURL: SPOTIFY_API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` },
      })
      : this.client;

    try {
      const response = await client.get('/me/player');
      return response.data;
    } catch (error) {
      console.error('Error fetching current playback:', error);
      throw error;
    }
  }

  async nextTrack(token?: string, deviceId?: string) {
    const client = token
      ? axios.create({
        baseURL: SPOTIFY_API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` },
      })
      : this.client;

    try {
      const params: any = {};
      if (deviceId) params.device_id = deviceId;
      await client.post('/me/player/next', null, { params });
    } catch (error) {
      console.error('Error skipping to next track:', error);
      throw error;
    }
  }

}

// Export singleton instance
export const spotifyService = new SpotifyService();
export default spotifyService;
