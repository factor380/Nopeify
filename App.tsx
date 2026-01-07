import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Linking, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SpotifyLogin from './components/SpotifyLogin';
import { useSpotify } from './hooks/useSpotify';
import UserInfo from './components/UserInfo';
import CurrentTrack from './components/CurrentTrack';
import DislikedSongs from './components/DislikedSongs';
import BackgroundController, { checkSpotify } from './components/background/BackgroundController';
import * as Notifications from 'expo-notifications';
import { useNotificationPermissions } from './hooks/useNotificationPermissions';

export default function App() {
  console.log('App component rendered');


  const {registerForPushNotificationsAsync} =useNotificationPermissions();
  registerForPushNotificationsAsync();

  const { isAuthenticated, user, loading, error, login, logout } = useSpotify();

  const [token, setToken] = useState<string | undefined>(undefined);

  

  const handleLogin = async (token: string) => {
    setToken(token);
    await login(token);
  };

  //אולי לעשות חילוק ללוגיקת UI
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
              <BackgroundController token={token}/>

              {user && <UserInfo user={user} onLogout={logout} />}
              {error && <Text style={styles.error}>Error: {error.message}</Text>}
              <CurrentTrack />
              <DislikedSongs />
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
