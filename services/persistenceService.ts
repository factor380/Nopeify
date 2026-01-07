import dislikedSongsService, { DislikedSong } from './dislikedSongsService';
import { getDislikedSongs, setDislikedSongs, deleteDislikedSongs } from './secureStoreTokens';

const DISLIKED_SONGS_KEY = 'disliked_songs_storage';

class PersistenceService {
  /**
   * Load disliked songs from SecureStore and populate the service
   */
  async loadDislikedSongs(): Promise<DislikedSong[]> {
    try {
      const songs = await getDislikedSongs();
      if (songs && songs.length) {
        console.log('Loaded disliked songs from storage:', songs.length);
        songs.forEach(song => dislikedSongsService.add(song));
        return songs;
      }
    } catch (error) {
      console.error('Error loading disliked songs from storage:', error);
    }
    return [];
  }

  /**
   * Save disliked songs to SecureStore
   */
  async saveDislikedSongs(): Promise<void> {
    try {
      const songs = dislikedSongsService.getAll();
      const jsonString = JSON.stringify(songs);
      await setDislikedSongs(songs);
      console.log('Saved disliked songs to storage:', songs.length);
    } catch (error) {
      console.error('Error saving disliked songs to storage:', error);
    }
  }

  /**
   * Clear all disliked songs from SecureStore
   */
  async clearDislikedSongs(): Promise<void> {
    try {
      await deleteDislikedSongs();
      console.log('Cleared disliked songs from storage');
    } catch (error) {
      console.error('Error clearing disliked songs from storage:', error);
    }
  }

  /**
   * Subscribe to changes and auto-save to SecureStore
   * Returns unsubscribe function
   */
  subscribeWithPersistence(cb?: (songs: DislikedSong[]) => void) {
    // Subscribe to the service with auto-save
    const unsubscribe = dislikedSongsService.subscribe(songs => {
      this.saveDislikedSongs();
      if (cb) cb(songs);
    });
    return unsubscribe;
  }
}

const persistenceService = new PersistenceService();
export default persistenceService;
