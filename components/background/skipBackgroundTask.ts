import BackgroundService from "react-native-background-actions";

export const skipTaskOptions = {
  taskName: "NopeifySkipTask",
  taskTitle: "Nopeify is running",
  taskDesc: "Skipping unwanted songs",
  isHeadless: false, 
  autoStart: true,
  taskIcon: {
        name: "ic_launcher_round", 
        type: "mipmap",
  },
  color: "#0db36a",
  linkingURI: 'nopeify://home',
  parameters: {
    delay: 5000,
    token: '',
    checkFunction: async (token: string) => {
      console.log('Default checkFunction called with token:', token);
    },
  },
  notificationChannelId: 'nopeify-channel', // חשוב
};


const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const skipSongTask = async (taskData: any) => {
  console.log("skipSongTask received taskData:", taskData);
  const { delay, token, checkFunction } = taskData;

  console.log("background-skip-task started");

  while (BackgroundService.isRunning()) {
    try {
      console.log("background-skip-task: invoking checkFunction");
      await checkFunction(token);
    } catch (err) {
      console.log("Error in background task:", err);
    } await sleep(delay);
  }

  console.log("background-skip-task stopped");
};

