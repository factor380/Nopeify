import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import SongList from './SongList';

interface TrackListProps {
  tracks: any[];
  loading: boolean;
  onDelete?: (id: string) => void;
}

export default function TrackList({ tracks, loading, onDelete }: TrackListProps) {
  return (
    <View style={styles.section}>
      {loading ? (
        <ActivityIndicator size="small" color="#1DB954" />
      ) : tracks.length > 0 ? (
        <SongList
          songs={tracks.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists?.[0]?.name || 'Unknown',
          }))}
          onDelete={onDelete}
        />
      ) : (
        <Text style={styles.noData}>No tracks found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },

  noData: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginVertical: 16,
  },
});