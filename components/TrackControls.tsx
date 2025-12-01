import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import spotifyService from '../services/spotifyService';

export default function TrackControls() {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleSkip = async () => {
    setActionMessage(null);
    setActionLoading(true);
    try {
      await spotifyService.nextTrack();
      setActionMessage('דילגתי לשיר הבא');
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
    <View style={styles.controls}>
      <Button title="דלג" onPress={handleSkip} disabled={actionLoading} color="#1DB954" />
      <View style={{ width: 12 }} />
      <Button title="השהה" onPress={handlePause} disabled={actionLoading} color="#1DB954" />
      {actionMessage && <Text style={styles.actionMessage}>{actionMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionMessage: {
    color: '#b3b3b3',
    marginLeft: 16,
  },
});