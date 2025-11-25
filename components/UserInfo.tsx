import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SpotifyUser } from '../services/spotifyService';

export default function UserInfo({ user, onLogout }: { user: SpotifyUser; onLogout: () => void }) {
  return (
    <View style={styles.userSection}>
      <Text style={styles.header}>Welcome {user.display_name}!</Text>
      {user.images && user.images[0] && <Text style={styles.subtext}>ID: {user.id}</Text>}
      <Button title="Logout" onPress={onLogout} color="#1DB954" />
    </View>
  );
}

const styles = StyleSheet.create({
  userSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 16,
  },
});
