import { useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useReadNotification } from './useReadNotification';

export const useNotificationListener = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { readNotification } = useReadNotification();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage) return null;
      const serviceId = serviceIdExtractor(remoteMessage);
      const notificationId = notificationIdExtractor(remoteMessage) as string;
      if (remoteMessage.notification && serviceId) {
        Alert.alert(
          remoteMessage.notification.title || t('newNotification'),
          remoteMessage.notification.body,
          [
            {
              text: t('cancel'),
              style: 'cancel',
            },
            {
              text: t('view'),
              onPress: () => {
                const serviceId = serviceIdExtractor(remoteMessage);
                if (serviceId) navigateToServiceDetails(serviceId);
                if (notificationId) readNotification(notificationId);
              },
            },
          ],
        );
      }
    });

    // Handle notification open when app is in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage) return null;
      const serviceId = serviceIdExtractor(remoteMessage);
      const notificationId = notificationIdExtractor(remoteMessage) as string;
      if (notificationId) readNotification(notificationId);
      if (serviceId) navigateToServiceDetails(serviceId);
    });

    // Handle notification open when app is quit
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!remoteMessage) return null;

        const serviceId = serviceIdExtractor(remoteMessage);
        const notificationId = notificationIdExtractor(remoteMessage) as string;
        if (notificationId) readNotification(notificationId);
        if (serviceId) navigateToServiceDetails(serviceId);
      });

    return unsubscribe;
  }, []);

  const serviceIdExtractor = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    const { data } = remoteMessage || {};
    const { service_id } = data || {};
    return service_id;
  };
  const notificationIdExtractor = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    const { data } = remoteMessage || {};
    const { id } = data || {};
    return id;
  };

  const navigateToServiceDetails = (service_id: string | object) => {
    if (service_id)
      navigation.navigate('ServiceDetails', {
        serviceId: Number(service_id),
      });
  };
};
