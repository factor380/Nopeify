import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SongList from './components/SongList';
import SpotifyLogin from './components/SpotifyLogin';
import { useSpotify } from './hooks/useSpotify';
import spotifyService from './services/spotifyService';
import UserInfo from './components/UserInfo';
import TopTracks from './components/TopTracks';

export default function App() {
  console.log('App component rendered');
  const [songs, setSongs] = useState([
    { id: '1', title: 'Imagine', artist: 'John Lennon' },
    { id: '2', title: 'Bohemian Rhapsody', artist: 'Queen' },
    { id: '3', title: 'Hotel California', artist: 'Eagles' },
    { id: '4', title: 'Billie Jean', artist: 'Michael Jackson' },
    { id: '5', title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
  ]);

  const { isAuthenticated, user, loading, error, login, logout } = useSpotify();

  const handleLogin = async (token: string) => {
    await login(token);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isAuthenticated ? (
        <SpotifyLogin onLogin={handleLogin} />
      ) : (
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : (
            <>
              {user && <UserInfo user={user} onLogout={logout} />}

              {error && <Text style={styles.error}>Error: {error.message}</Text>}

              <TopTracks />
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  content: {
    flex: 1,
    padding: 16,
  },
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
  section: {
    marginBottom: 24,
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
  error: {
    fontSize: 14,
    color: '#e22134',
    marginBottom: 12,
  },
});
