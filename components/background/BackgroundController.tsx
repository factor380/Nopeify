import React, { useEffect } from "react";
import BackgroundService from "react-native-background-actions";
import { skipSongTask, skipTaskOptions } from "../background/skipBackgroundTask";
import dislikedSongsService from "../../services/dislikedSongsService";
import spotifyService from "../../services/spotifyService";
import { Platform, Alert, Linking } from "react-native";



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
      await BackgroundService.updateNotification({
        taskTitle: "Nopeify",
        taskDesc: `Now playing: ${track?.name}`,
      });
    }
  } catch (e) {
    console.warn("background-skip-task: error", e);
  }
};

// חשוב: בקש מהמשתמש לבטל אופטימיזציית סוללה לאפליקציה
const handleBatteryOptimization = async () => {
    if (Platform.OS === 'android') {
        // בדוק אם האפליקציה נמצאת במצב אופטימיזציה (דורש מודול Native מותאם אישית בדרך כלל)
        // אם אתה משתמש בספרייה כגון react-native-background-actions, ייתכן שיש לה פונקציה לבדיקה

        Alert.alert(
            "Important: Background enabled",
            "To keep the Nopeify background service running reliably, please disable battery optimization for the app.",
            [
              { text: "Cancel" },
              {
                text: "Settings",
                onPress: () => {
                        // הפניה ישירה למסך הגדרות הסוללה של האפליקציה
                        const packageName = 'com.binyaminfactor380.Nopeify'; // החלף בשם החבילה שלך!
                        const intentUri = `package:${packageName}`;

                        // מנסה לפתוח את מסך הגדרות האפליקציה
                        Linking.openURL(`settings:ignore_battery_optimization?package=${intentUri}`)
                            .catch(() => {
                            // If the short link fails (older Android versions), open the general settings screen
                            Linking.openURL('app-settings:')
                              .catch(() => {
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

  useEffect(() => {
        console.log("Starting background service");
    if (!token) {
        console.log("'No token provided, not starting background service");
      return;
    }

    const startService = async () => {
      if (!BackgroundService.isRunning()) {
        console.log("Starting background service with token",token);

        await BackgroundService.start(skipSongTask, {
          ...skipTaskOptions,
          parameters: {
            delay: 5000,
            token,
            checkFunction: checkSpotify,
          },
        }).catch((err) => {
          console.error("Error starting background service:", err);
        });
      }
    };

    startService();

    return () => {
      stop();  
    };
  }, [token]);

  const stop = async () => {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  };

  return null;
}