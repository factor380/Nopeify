import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SongItemProps } from '../types/types';


function SongItem({ title, artist }: SongItemProps) {
  return (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{title}</Text>
      <Text style={styles.songArtist}>{artist}</Text>
    </View>
  );
}

export default React.memo(SongItem);

const styles = StyleSheet.create({
  songItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
});