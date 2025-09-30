import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { initializeNotifications, scheduleNotification } from '../../services/notifications';
import { GradientButton } from '../ui/GradientButton';

const NotificationButton = () => {

    useEffect(() => {
        // Inizializza il gestore delle notifiche
        initializeNotifications();
    }, []);

    const handleScheduleTest = async () => {
        try {
            const notification = {title: "Notifica di Test", body: "Questa è una notifica programmata di test.", timeInterval:30};
            const notificationId = await scheduleNotification(notification.title, notification.body, notification.timeInterval);
            if (notificationId) {
                Alert.alert(
                    "Notifica Programmata",
                    "La notifica di test arriverà tra qualche secondo!"
                );
            }
        } catch (error) {
            Alert.alert("Errore", "Impossibile programmare la notifica");
            console.error(error);
        }
    };

    return (
        <GradientButton title='Notifica' onPress={handleScheduleTest} className="my-3 w-80" />

    )
}

export default NotificationButton;