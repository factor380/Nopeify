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
        taskDesc: "דילגתי על שיר שלא אהבת 🎵",
      });
    } else {
      console.log("background-skip-task: track is fine");
      await BackgroundService.updateNotification({
        taskTitle: "Nopeify",
        taskDesc: `now play: ${track?.name}`,
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