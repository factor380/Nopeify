import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SongList from './components/SongList';

export default function App() {
  const [songs, setSongs] = useState([
    { id: '1', title: 'Imagine', artist: 'John Lennon' },
    { id: '2', title: 'Bohemian Rhapsody', artist: 'Queen' },
    { id: '3', title: 'Hotel California', artist: 'Eagles' },
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>🎵 רשימת שירים</Text>
        <SongList songs={songs} />
        <Button
          title="הוסף שיר נוסף"
          onPress={() =>
            setSongs([
              ...songs,
              { id: (songs.length + 1).toString(), title: `New Song #${songs.length + 1}`, artist: 'Unknown' },
            ])
          }
        />
      </View>
    </SafeAreaView>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
});