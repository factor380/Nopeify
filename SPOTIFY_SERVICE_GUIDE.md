# Spotify Service Guide

## Overview

The Spotify Service is a centralized, type-safe wrapper around the Spotify Web API. It simplifies integration with Spotify and provides methods for all major Spotify operations.

## Architecture

```
services/spotifyService.ts  → Core Spotify API wrapper
hooks/useSpotify.ts         → Authentication hook
hooks/useTopTracks.ts       → Top tracks hook
hooks/useSearch.ts          → Search hook
hooks/usePlaylists.ts       → Playlists hook
App.tsx                     → Main app using these hooks
```

## Quick Start

### 1. Initialize the Service with Access Token

After obtaining a Spotify access token from the authentication flow:

```typescript
import { useSpotify } from './hooks/useSpotify';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useSpotify();

  const handleLogin = async (token: string) => {
    await login(token);
    // Now the service has the token and you can make API calls
  };

  return (
    <>
      {!isAuthenticated ? (
        <SpotifyLogin onLogin={handleLogin} />
      ) : (
        <Text>Welcome {user?.display_name}!</Text>
      )}
    </>
  );
}
```

### 2. Use the Service Directly

```typescript
import spotifyService from './services/spotifyService';

// Get current user
const user = await spotifyService.getCurrentUser();

// Get top tracks
const topTracks = await spotifyService.getTopTracks(10, 0, 'medium_term');

// Search for tracks
const searchResults = await spotifyService.search('Beatles', 'track', 20);
```

### 3. Use Provided Hooks

```typescript
import { useTopTracks } from './hooks/useTopTracks';
import { useSearch } from './hooks/useSearch';
import { usePlaylists } from './hooks/usePlaylists';

// Fetch top tracks
const { tracks, loading, error, fetchTopTracks } = useTopTracks();

useEffect(() => {
  fetchTopTracks(20, 'medium_term');
}, []);

// Search for music
const { results, loading: searchLoading, search } = useSearch();

const handleSearch = async () => {
  await search('Dream Theater', 'artist', 10);
};

// Get user playlists
const { playlists, loading: playlistsLoading, fetchPlaylists } = usePlaylists();

useEffect(() => {
  fetchPlaylists(20);
}, []);
```

## Available Methods

### Authentication & User

```typescript
// Get current user profile
getCurrentUser(): Promise<SpotifyUser>

// Set access token (called automatically by useSpotify hook)
setAccessToken(token: string): void

// Clear access token
clearAccessToken(): void
```

### Top Tracks & Artists

```typescript
// Get user's top tracks
getTopTracks(
  limit: number = 20,
  offset: number = 0,
  timeRange: 'long_term' | 'medium_term' | 'short_term' = 'medium_term'
): Promise<SpotifyTopTracksResponse>

// Get user's top artists
getTopArtists(
  limit: number = 20,
  offset: number = 0,
  timeRange: 'long_term' | 'medium_term' | 'short_term' = 'medium_term'
): Promise<any>
```

### Search

```typescript
// Search Spotify
search(
  query: string,
  type: 'track' | 'artist' | 'album' | 'playlist' = 'track',
  limit: number = 20
): Promise<any>
```

### Tracks

```typescript
// Get a track by ID
getTrack(trackId: string): Promise<SpotifyTrack>

// Get multiple tracks
getTracks(trackIds: string[]): Promise<SpotifyTrack[]>

// Get saved tracks (user's library)
getSavedTracks(limit: number = 20, offset: number = 0): Promise<any>

// Check if tracks are saved
checkSavedTracks(trackIds: string[]): Promise<boolean[]>

// Save tracks to library
saveTracks(trackIds: string[]): Promise<void>

// Remove tracks from library
removeTracks(trackIds: string[]): Promise<void>
```

### Playlists

```typescript
// Get user's playlists
getUserPlaylists(limit: number = 20, offset: number = 0): Promise<SpotifyPlaylist[]>

// Get playlist by ID
getPlaylist(playlistId: string): Promise<SpotifyPlaylist>

// Get playlist tracks
getPlaylistTracks(
  playlistId: string,
  limit: number = 50,
  offset: number = 0
): Promise<any>
```

### Artists

```typescript
// Get artist by ID
getArtist(artistId: string): Promise<any>

// Get multiple artists
getArtists(artistIds: string[]): Promise<any>

// Get artist's top tracks
getArtistTopTracks(artistId: string, market: string = 'US'): Promise<SpotifyTrack[]>

// Get related artists
getRelatedArtists(artistId: string): Promise<any>

// Get user's followed artists
getFollowedArtists(limit: number = 20): Promise<any>
```

### Albums

```typescript
// Get album by ID
getAlbum(albumId: string): Promise<any>

// Get album tracks
getAlbumTracks(
  albumId: string,
  limit: number = 50,
  offset: number = 0
): Promise<any>

// Get user's saved albums
getSavedAlbums(limit: number = 20, offset: number = 0): Promise<any>

// Save albums to library
saveAlbums(albumIds: string[]): Promise<void>
```

### Browse

```typescript
// Get new releases
getNewReleases(limit: number = 20, offset: number = 0): Promise<any>

// Get featured playlists
getFeaturedPlaylists(limit: number = 20, offset: number = 0): Promise<any>

// Get available genres for recommendations
getAvailableGenres(): Promise<string[]>
```

### Recommendations

```typescript
// Get track recommendations
getRecommendations(
  seeds: {
    tracks?: string[];
    artists?: string[];
    genres?: string[];
  },
  limit: number = 20
): Promise<any>
```

### Following

```typescript
// Follow artists/users
follow(ids: string[], type: 'artist' | 'user'): Promise<void>

// Unfollow artists/users
unfollow(ids: string[], type: 'artist' | 'user'): Promise<void>

// Check if user follows artists/users
checkFollowing(ids: string[], type: 'artist' | 'user'): Promise<boolean[]>
```

## Types

### SpotifyTrack

```typescript
interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}
```

### SpotifyPlaylist

```typescript
interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
  owner: { display_name: string };
}
```

### SpotifyUser

```typescript
interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
}
```

## Error Handling

All methods include try-catch blocks with error logging:

```typescript
try {
  const tracks = await spotifyService.getTopTracks();
} catch (error) {
  console.error('Error fetching top tracks:', error);
  // Handle error appropriately
}
```

The hooks also manage error states:

```typescript
const { tracks, loading, error, fetchTopTracks } = useTopTracks();

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

## Performance Tips

1. **Use hooks for state management** - They handle loading and error states automatically
2. **Batch API calls** - Use methods like `getTracks()` or `getArtists()` to fetch multiple items at once
3. **Paginate results** - Use `limit` and `offset` parameters for large datasets
4. **Cache results** - Consider using React Query or similar library for caching API responses
5. **Limit recommendations** - Typically use 5-6 seed values with `getRecommendations()`

## Examples

### Display User's Top 5 Tracks

```typescript
import { useTopTracks } from './hooks/useTopTracks';

export function TopTracksScreen() {
  const { tracks, loading, error, fetchTopTracks } = useTopTracks();

  useEffect(() => {
    fetchTopTracks(5, 'medium_term');
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.name} - {item.artists[0].name}</Text>
      )}
    />
  );
}
```

### Search for Artists

```typescript
import { useSearch } from './hooks/useSearch';

export function SearchScreen() {
  const { results, search } = useSearch();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    await search(query, 'artist', 20);
  };

  return (
    <>
      <TextInput 
        value={query}
        onChangeText={setQuery}
        placeholder="Search artists..."
      />
      <Button title="Search" onPress={handleSearch} />
      
      {results?.artists?.items?.map((artist) => (
        <Text key={artist.id}>{artist.name}</Text>
      ))}
    </>
  );
}
```

### Display User Playlists

```typescript
import { usePlaylists } from './hooks/usePlaylists';

export function PlaylistsScreen() {
  const { playlists, loading, fetchPlaylists } = usePlaylists();

  useEffect(() => {
    fetchPlaylists(20);
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={playlists}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.name} ({item.tracks.total} tracks)</Text>
      )}
    />
  );
}
```

## Dependencies

- `axios` - For HTTP requests
- `react` - For hooks
- `react-native` - For components

## Environment Setup

Make sure your Spotify configuration is set up in `spotifyConfig.ts`:

```typescript
export const spotifyConfig = {
  clientId: 'your_client_id_here',
  clientSecret: 'your_client_secret_here',
  redirectUrl: 'your_redirect_url',
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
    'user-library-read',
  ],
};
```

## Support for Future Enhancements

The service is designed to be easily extended. To add new methods:

```typescript
// In spotifyService.ts
async myNewMethod(param: string) {
  try {
    const response = await this.client.get('/endpoint', { params: { param } });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

Then create a corresponding hook:

```typescript
// In hooks/useMyNewHook.ts
export const useMyNewHook = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (param: string) => {
    setLoading(true);
    try {
      const result = await spotifyService.myNewMethod(param);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
```
