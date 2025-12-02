import AsyncStorage from '@react-native-async-storage/async-storage';
import dislikedSongsService, { DislikedSong } from './dislikedSongsService';

const DISLIKED_SONGS_KEY = '@disliked_songs_storage';

class PersistenceService {
  /**
   * Load disliked songs from AsyncStorage and populate the service
   */
  async loadDislikedSongs(): Promise<DislikedSong[]> {
    try {
      const jsonString = await AsyncStorage.getItem(DISLIKED_SONGS_KEY);
      if (jsonString) {
        const songs = JSON.parse(jsonString) as DislikedSong[];
        console.log('Loaded disliked songs from storage:', songs.length);
        // Populate the service with loaded songs
        songs.forEach(song => {
          dislikedSongsService.add(song);
        });
        return songs;
      }
    } catch (error) {
      console.error('Error loading disliked songs from storage:', error);
    }
    return [];
  }

  /**
   * Save disliked songs to AsyncStorage
   */
  async saveDislikedSongs(): Promise<void> {
    try {
      const songs = dislikedSongsService.getAll();
      const jsonString = JSON.stringify(songs);
      await AsyncStorage.setItem(DISLIKED_SONGS_KEY, jsonString);
      console.log('Saved disliked songs to storage:', songs.length);
    } catch (error) {
      console.error('Error saving disliked songs to storage:', error);
    }
  }

  /**
   * Clear all disliked songs from AsyncStorage
   */
  async clearDislikedSongs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DISLIKED_SONGS_KEY);
      console.log('Cleared disliked songs from storage');
    } catch (error) {
      console.error('Error clearing disliked songs from storage:', error);
    }
  }

  /**
   * Subscribe to changes and auto-save to AsyncStorage
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
