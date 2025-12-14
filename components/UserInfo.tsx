import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SpotifyUser } from '../services/spotifyService';
import AppButton from './Generic Components/AppButton';

export default function UserInfo({ user, onLogout }: { user: SpotifyUser; onLogout: () => void }) {
  return (
    <View style={styles.userSection}>
      <Text style={styles.header}>Welcome {user.display_name}!</Text>
      <AppButton title="Logout" onPress={onLogout} color="#1DB954" />
    </View>
  );
}

const styles = StyleSheet.create({
  userSection: {
    marginBottom: 0,
    paddingBottom: 8,
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
