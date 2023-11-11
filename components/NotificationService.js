import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

const getFCMToken = async () => {
  // AsyncStorage.removeItem('userfcmToken');
  let fcmToken = await AsyncStorage.getItem('userfcmToken');
  console.log(fcmToken, 'the old Token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new generated token');
        const {currentUser} = auth();
        firestore()
          .collection('controllerNotificationToken')
          .doc(currentUser.uid)
          .set(
            {
              token: firestore.FieldValue.arrayUnion(fcmToken),
              type: 'User',
            },
            {merge: true},
          )
          .then(() => {
            console.log('Token added!');
          });
        await AsyncStorage.setItem('userfcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error raised in fcmToken');
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notificaton caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging().onMessage(async remoteMessage => {
    console.log('recieved in foreground', remoteMessage);
    PushNotification.localNotification({
      channelId: 'yrr-1232',
      autoCancel: true,
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'ybsound.wav',
    });
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to popen from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
