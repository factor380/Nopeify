import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import SongList from './SongList';
import spotifyService from '../services/spotifyService';

export default function TopTracks() {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  useEffect(() => {
    fetchTopTracks();
  }, []);

  const fetchTopTracks = async () => {
    try {
      setLoadingTracks(true);
      const response = await spotifyService.getTopTracks(20, 0, 'medium_term');
      setTopTracks(response.items || []);
    } catch (err) {
      console.error('Error fetching top tracks in TopTracks component:', err);
    } finally {
      setLoadingTracks(false);
    }
  };

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleSkip = async () => {
    setActionMessage(null);
    setActionLoading(true);
    try {
      await spotifyService.nextTrack();
      setActionMessage('דילגתי לשיר הבא');
      // Optionally refresh top tracks or playback state
      await fetchTopTracks();
    } catch (err) {
      console.error('Error skipping track:', err);
      setActionMessage('שגיאה בדילוג על השיר');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    setActionMessage(null);
    setActionLoading(true);
    try {
      await spotifyService.pausePlayback();
      setActionMessage('הפעלת השהייה בהשמעה');
    } catch (err) {
      console.error('Error pausing playback:', err);
      setActionMessage('שגיאה בהשהיית ההשמעה');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.controls}>
        <Button title="דלג" onPress={handleSkip} disabled={actionLoading} color="#1DB954" />
        <View style={{ width: 12 }} />
        <Button title="השהה" onPress={handlePause} disabled={actionLoading} color="#1DB954" />
      </View>

      <Text style={styles.sectionTitle}>Your Top Tracks</Text>
      {actionMessage && <Text style={styles.actionMessage}>{actionMessage}</Text>}
      {loadingTracks ? (
        <ActivityIndicator size="small" color="#1DB954" />
      ) : topTracks.length > 0 ? (
        <SongList
          songs={topTracks.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists?.[0]?.name || 'Unknown',
          }))}
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionMessage: {
    color: '#b3b3b3',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  noData: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginVertical: 16,
  },
});
