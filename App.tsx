import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Linking, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SpotifyLogin from './components/SpotifyLogin';
import { useSpotify } from './hooks/useSpotify';
import UserInfo from './components/UserInfo';
import TrackControls from './components/TrackControls';
import CurrentTrack from './components/CurrentTrack';
import DislikedSongs from './components/DislikedSongs';
import BackgroundController, { checkSpotify } from './components/background/BackgroundController';
import * as Notifications from 'expo-notifications';

export default function App() {
  console.log('App component rendered');

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    // 1. בדיקה אם כבר יש הרשאה
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 2. אם לא, בקש הרשאה בזמן ריצה
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      // כאן ניתן להציג הודעה למשתמש שמסבירה למה צריך הרשאות
      return; 
    }
  }

  const handleBatteryOptimization = async () => {
    if (Platform.OS === 'android') {
        // בדוק אם האפליקציה נמצאת במצב אופטימיזציה (דורש מודול Native מותאם אישית בדרך כלל)
        // אם אתה משתמש בספרייה כגון react-native-background-actions, ייתכן שיש לה פונקציה לבדיקה

        Alert.alert(
            "חשוב: הפעלת רקע",
            "כדי ששירות הרקע של Nopeify יעבוד באופן רציף, עליך לבטל את אופטימיזציית הסוללה עבור האפליקציה.",
            [
                { text: "ביטול" },
                {
                    text: "הגדרות",
                    onPress: () => {
                        // הפניה ישירה למסך הגדרות הסוללה של האפליקציה
                        const packageName = 'com.binyaminfactor380.helloworld'; // החלף בשם החבילה שלך!
                        const intentUri = `package:${packageName}`;

                        // מנסה לפתוח את מסך הגדרות האפליקציה
                        Linking.openURL(`settings:ignore_battery_optimization?package=${intentUri}`)
                            .catch(() => {
                                // אם הקישור הקצר נכשל (בגרסאות אנדרואיד ישנות), פנה למסך הכללי יותר
                                Linking.openURL('app-settings:')
                                    .catch(() => {
                                        Alert.alert("שגיאה", "אנא נווט ידנית להגדרות -> אפליקציות -> Nopeify -> סוללה.");
                                    });
                            });
                    }
                }
            ]
        );
    }
};


  const { isAuthenticated, user, loading, error, login, logout } = useSpotify();

  const [token, setToken] = useState<string | undefined>(undefined);

  

  const handleLogin = async (token: string) => {
    setToken(token);
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
              <BackgroundController token={token}/>

              {user && <UserInfo user={user} onLogout={logout} />}

              {error && <Text style={styles.error}>Error: {error.message}</Text>}
              <TrackControls />
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
