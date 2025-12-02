import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import dislikedSongsService from '../services/dislikedSongsService';
import persistenceService from '../services/persistenceService';
import TrackList from './TrackList';

export default function DislikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Load from AsyncStorage on mount
    persistenceService.loadDislikedSongs().then(() => {
      // Subscribe with auto-persistence
      const unsubscribe = persistenceService.subscribeWithPersistence(dislikedSongs => {
        setSongs(dislikedSongs.map(song => ({
          id: song.id,
          name: song.title,
          artists: [{ name: song.artist }],
        })));
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    });
  }, []);

  const handleDelete = (id: string) => {
    dislikedSongsService.remove(id);
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <View style={styles.container}>
        <Text style={styles.sectionTitle}>Disliked Songs</Text>
      <TrackList 
        tracks={songs} 
        loading={loading}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  }
});
