import React, {Component, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import firestore from '@react-native-firebase/firestore';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import ShareText from 'react-native-share';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SideBarContent(props) {
  const [username, setUsername] = useState(null);
  const [useremail, setUseremail] = useState(null);
  if (!username && !useremail) {
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        // console.log(documentSnapshot.data().email);
        if (documentSnapshot.exists) {
          setUseremail(documentSnapshot.data().email);
          setUsername(documentSnapshot.data().userName);
        }
      });
  }

  const signOut = async () => {
    // await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await LoginManager.logOut();

    const {currentUser} = auth();
    let fcmToken = await AsyncStorage.getItem('userfcmToken');
    firestore()
      .collection('controllerNotificationToken')
      .doc(currentUser.uid)
      .update({
        token: firestore.FieldValue.arrayRemove(fcmToken),
      })
      .then(() => {
        AsyncStorage.removeItem('userfcmToken');
        auth()
          .signOut()
          .then(() => {
            // console.log('User signed out!');
            props.navigation.navigate('Home');
          });
      });
  };

  const openShare = () => {
    var fullText =
      'https://play.google.com/store/apps/details?id=com.rudelabs.yrr';
    const shareOptions = {
      title: 'Share via',
      message: fullText,
      url: '', // country code + phone number(currently only works on Android)
      filename: '', // only for base64 file in Android
    };
    ShareText.open(shareOptions)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={require('../assets/user-icon.jpg')}
                size={50}
              />
              <View
                style={{
                  marginLeft: 15,
                  flexDirection: 'column',
                  flexShrink: 1,
                }}>
                <Title style={styles.title}>{username}</Title>
                <Caption style={styles.caption}>{useremail}</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home" color={color} size={size} />
              )}
              label="Dashboard"
              labelStyle={styles.drawerLabel}
              onPress={() =>
                props.navigation.navigate('Dashboard', {initial: false})
              }
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="receipt" color={color} size={size} />
              )}
              label="History"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('Bookings')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="gift-outline" color={color} size={size} />
              )}
              label="Rewards"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('Rewards')}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-edit" color={color} size={size} />
              )}
              label="Update profile"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('UpdateProfile')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="car" color={color} size={size} />
              )}
              label="My vehicles"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('Vehicle')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-group" color={color} size={size} />
              )}
              label="Add Benificiary"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('AddBenificiary')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cogs" color={color} size={size} />
              )}
              label="Settings"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('ChangePassword')}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Icon name="share-outline" color={color} size={size} />
              )}
              label="Share with Friends"
              labelStyle={styles.drawerLabel}
              onPress={openShare}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="headset" color={color} size={size} />
              )}
              label="Contact Us"
              labelStyle={styles.drawerLabel}
              onPress={() => props.navigation.navigate('Contact')}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          labelStyle={styles.drawerLabel}
          onPress={signOut}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    flexShrink: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
  },
});
