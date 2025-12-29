import React, { useEffect, useState, useRef } from "react";
import BackgroundService from "react-native-background-actions";
import { skipSongTask, skipTaskOptions } from "../background/skipBackgroundTask";
import dislikedSongsService from "../../services/dislikedSongsService";
import spotifyService, { setAccessTokenRefreshCallback } from "../../services/spotifyService";
import { Platform, Alert, Linking } from "react-native";
// import * as Battery from 'expo-battery';


let changeNotification = true;

// Token refresh callback to notify BackgroundController of token changes
let onTokenRefreshed: ((newToken: string) => Promise<void>) | null = null;

export const setTokenRefreshCallback = (callback: (newToken: string) => Promise<void>) => {
  onTokenRefreshed = callback;
};



export const checkSpotify = async (token?: string) => {
  try {
    console.log("background-skip-task: running checkSpotify");

    const response = await spotifyService.getCurrentPlayback(token);
    const track = response?.item;
    const id = track?.id;

    if (id && dislikedSongsService.isDisliked(id)) {
      console.log("background-skip-task: skipping disliked track", id);

      await spotifyService.nextTrack(token);

      await BackgroundService.updateNotification({
        taskTitle: "Nopeify",
        taskDesc: "Skipped a disliked track 🎵",
      });
    } else {
      console.log("background-skip-task: track is fine");
      if (changeNotification) {
        changeNotification = !changeNotification;
        await BackgroundService.updateNotification({
          taskTitle: "Nopeify",
          taskDesc: track ? `Now playing: ${track?.name}` : "No track playing",
        });
      }
      else {
        changeNotification = !changeNotification;
        BackgroundService.updateNotification({
          taskTitle: "Nopeify",
          taskDesc: "Tap here to dislike this song ",
        });
      }
    }
  } catch (e) {
    console.warn("background-skip-task: error", e);
  }
};

// חשוב: בקש מהמשתמש לבטל אופטימיזציית סוללה לאפליקציה
const handleBatteryOptimization = async () => {
  if (Platform.OS === 'android') {

    // const isEnabled = await Battery.isBatteryOptimizationEnabledAsync();change when i can do build
    const isEnabled = true; // temporary fix
    if (!isEnabled) {
      console.log("Battery optimization is already disabled for this app.");
      return;
    }
    Alert.alert(
      "Important: Background enabled",
      `For Nopeify to stay active and reliable, Android needs to know not to close it to save power.
       Please disable battery optimization in your settings so we can work for you 24/7.`,
      [
        { text: "Cancel" },
        {
          text: "Settings",
          onPress: () => {
            // הפניה ישירה למסך הגדרות הסוללה של האפליקציה
            const packageName = 'com.binyaminfactor380.Nopeify'; // החלף בשם החבילה שלך!
            const intentUri = `package:${packageName}`;

            // מנסה לפתוח את מסך הגדרות האפליקציה
            Linking.openSettings()
              .catch(() => {
                Linking.openURL('app-settings:')
                  .catch((err) => {
                    console.error("Error opening settings:", err);
                    Alert.alert("Error", "Please navigate to Settings -> Apps -> Nopeify -> Battery.");
                  });
              });
          }
        }
      ]
    );
  }
};


export default function BackgroundController({ token }: { token?: string }) {
  const [currentToken, setCurrentToken] = useState(token);
  const backgroundRunningRef = useRef(false);

  // Callback to handle token refresh
  const handleTokenRefresh = async (newToken: string) => {
    console.log("Token refreshed, restarting background service");
    stop();
    
    // Wait a moment before restarting to ensure clean shutdown
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentToken(newToken);
  };

  useEffect(() => {
    // Register this component's callback with spotifyService
    setAccessTokenRefreshCallback(handleTokenRefresh);

    return () => {
      setAccessTokenRefreshCallback(null as any);
    };
  }, []);

  useEffect(() => {
    handleBatteryOptimization();
    return
  }, []);


  useEffect(() => {
    console.log("Starting background service");
    if (!currentToken) {
      console.log("'No token provided, not starting background service");
      return;
    }


    startService(currentToken);

    return () => {
      stop();
    };
  }, [currentToken]);

  const startService = async (token: string) => {
    if (!BackgroundService.isRunning()) {
      console.log("Starting background service with token", token);
      backgroundRunningRef.current = true;

      await BackgroundService.start(skipSongTask, {
        ...skipTaskOptions,
        parameters: {
          delay: 5000,
          token,
          checkFunction: checkSpotify,
        },
      }).catch((err) => {
        console.error("Error starting background service:", err);
        backgroundRunningRef.current = false;
      });
    }
  };

  const stop = async () => {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
      backgroundRunningRef.current = false;
    }
  };

  return null;
}