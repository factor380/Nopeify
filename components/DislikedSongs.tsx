import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import dislikedSongsService from '../services/dislikedSongsService';
import TrackList from './TrackList';

export default function DislikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dislikedSongs = dislikedSongsService.getAll();
    setSongs(dislikedSongs.map(song => ({
      id: song.id,
      name: song.title,
      artists: [{ name: song.artist }],
    })));
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.sectionTitle}>Disliked Songs</Text>
      <TrackList 
        tracks={songs} 
        loading={loading}
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
