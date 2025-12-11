import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import dislikedSongsService from '../services/dislikedSongsService';
import persistenceService from '../services/persistenceService';
import TrackList from './TrackList';

export default function DislikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const filteredSongs = React.useMemo(() => {
    if (searchQuery === '') {
      return songs;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return songs.filter(song => {
      return (
        song.name.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [searchQuery, songs]);


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
      <TextInput
        style={styles.input}
        placeholder="הקלד שם שיר או אמן..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery} // מעדכן את הסטייט של השאילתה
      />
      <TrackList
        tracks={filteredSongs}
        loading={loading}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'right', // תמיכה בעברית
  },
});
