// services/notifications.ts

import * as Notifications from 'expo-notifications';
import { NotificationBehavior } from 'expo-notifications';

export const initializeNotifications = () => {
    Notifications.setNotificationHandler({
        handleNotification: async (): Promise<NotificationBehavior> => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
};

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Permission for notifications not granted!');
        return false;
    }

    console.log('Notification permissions granted.');
    return true;

}

export const scheduleNotification = async (title:string, body:string, timeInterval: number) => {
    try {
        // Prima verifica i permessi
        const hasPermissions = await requestNotificationPermissions();
        if (!hasPermissions) {
            console.log('Impossibile programmare la notifica: permessi negati');
            return;
        }

        // Programma la notifica
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: timeInterval,
            },
        });

        console.log('Notifica programmata con ID:', notificationId);
        console.log(`La notifica arriverà tra ${timeInterval} secondi...`);

        return notificationId;
    } catch (error) {
        console.error('Errore nel programmare la notifica:', error);
        throw error;
    }
};

export const scheduleRepeatingNotification = async (title:string, body:string, intervalInMinutes: number) => {
    try {
        // Prima verifica i permessi
        const hasPermissions = await requestNotificationPermissions();
        if (!hasPermissions) {
            console.log('Impossibile programmare la notifica: permessi negati');
            return;
        }

        // Programma la notifica ripetitiva
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: intervalInMinutes * 60,
                repeats: true,
            },
        });

        console.log('Notifica ripetitiva programmata con ID:', notificationId);
        console.log(`La notifica arriverà ogni ${intervalInMinutes} minuti...`);

        return notificationId;
    } catch (error) {
        console.error('Errore nel programmare la notifica:', error);
        throw error;
    }
};

// Cancella tutte le notifiche programmate
export const cancelAllScheduledNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Tutte le notifiche programmate sono state cancellate');
    } catch (error) {
        console.error('Errore nel cancellare le notifiche:', error);
    }
};

// Ottiene tutte le notifiche programmate
export const getScheduledNotifications = async () => {
    try {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        console.log('Notifiche programmate:', scheduledNotifications);
        return scheduledNotifications;
    } catch (error) {
        console.error('Errore nel recuperare le notifiche programmate:', error);
        return [];
    }
};
