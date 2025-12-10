import { useCallback } from "react";
import * as Notifications from 'expo-notifications';

export interface UseNotificationPermissionsInterface {
    registerForPushNotificationsAsync: () => Promise<void>;
}

export const useNotificationPermissions = (): UseNotificationPermissionsInterface => {

    const registerForPushNotificationsAsync = useCallback(async () => {
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
        }
    }, []);

    return {
        registerForPushNotificationsAsync,
    };
}