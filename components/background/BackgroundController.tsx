import React, { useEffect } from "react";
import BackgroundService from "react-native-background-actions";
import { skipSongTask, skipTaskOptions } from "../background/skipBackgroundTask";
import dislikedSongsService from "../../services/dislikedSongsService";
import spotifyService from "../../services/spotifyService";



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
    }
  } catch (e) {
    console.warn("background-skip-task: error", e);
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