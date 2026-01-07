import * as SecureStore from 'expo-secure-store';

// Keys
export const SPOTIFY_REFRESH_TOKEN_KEY = 'spotify_refresh_token';
export const SPOTIFY_ACCESS_TOKEN_KEY = 'spotify_access_token';
export const DISLIKED_SONGS_KEY = 'disliked_songs_storage';

import type { DislikedSong } from './dislikedSongsService';

// Spotify refresh token helpers
export async function setSpotifyRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SPOTIFY_REFRESH_TOKEN_KEY, token);
}

export async function getSpotifyRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(SPOTIFY_REFRESH_TOKEN_KEY);
}

export async function deleteSpotifyRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SPOTIFY_REFRESH_TOKEN_KEY);
}

// Spotify access token helpers
export async function setSpotifyAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SPOTIFY_ACCESS_TOKEN_KEY, token);
}

export async function getSpotifyAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(SPOTIFY_ACCESS_TOKEN_KEY);
}

export async function deleteSpotifyAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SPOTIFY_ACCESS_TOKEN_KEY);
}

// Disliked songs helpers
export async function setDislikedSongs(songs: DislikedSong[]): Promise<void> {
  const jsonString = JSON.stringify(songs);
  await SecureStore.setItemAsync(DISLIKED_SONGS_KEY, jsonString);
}

export async function getDislikedSongs(): Promise<DislikedSong[] | null> {
  const json = await SecureStore.getItemAsync(DISLIKED_SONGS_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json) as DislikedSong[];
  } catch (err) {
    console.error('Failed to parse disliked songs from secure store', err);
    return null;
  }
}

export async function deleteDislikedSongs(): Promise<void> {
  await SecureStore.deleteItemAsync(DISLIKED_SONGS_KEY);
}
