import React, {Component, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VersionCheck from 'react-native-version-check';
import PushNotification, {Importance} from 'react-native-push-notification';
import {
  requestUserPermission,
  notificationListener,
} from './NotificationService';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
    this.state = {
      popUp: true,
      navigation: props.navigation,
      propImage: '',
      email: '',
      password: '',
      emailIsError: false,
      passwordIsError: false,
      inValidText: '',
      defaultErrorText: false,
      loading: false,
      forceUpdate: false,
      storeUrl: '',
    };
  }

  componentWillUnmount() {}

  componentDidMount = async () => {
    SplashScreen.hide();
    let updateNeeded = await VersionCheck.needUpdate();
    console.log(updateNeeded);
    PushNotification.createChannel(
      {
        channelId: 'yrr-1232', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    requestUserPermission();
    notificationListener();
    if (
      updateNeeded.currentVersion.split('.')[0] !==
      updateNeeded.latestVersion.split('.')[0]
    ) {
      this.setState({forceUpdate: true, storeUrl: updateNeeded.storeUrl});
    } else {
      const {currentUser} = auth();
      // console.log(currentUser);
      if (currentUser) {
        this.state.navigation.navigate('DashboardStack');
      }
    }
    GoogleSignin.configure({
      webClientId:
        '592460446587-p0qcouv3sd1730simiif55g2v3c9b6br.apps.googleusercontent.com',
    });
  };
  onGoogleButtonPress = async () => {
    this.setState({inValidText: '', defaultErrorText: false});

    try {
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      this.setState({loading: true});

      // firestore()
      //   .collection('Users')
      //   .where('email', '==', userInfo.user.email)
      //   .get()
      //   .then(async querySnapshot => {
      // console.log('Total users: ', querySnapshot.size);
      //     if (querySnapshot.size == 0) {
      //       this.setState({loading: false});

      //       this.state.navigation.navigate('SocialSignUp', {
      //         type: 'google',
      //         userInfo: userInfo,
      //       });
      //     } else {
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth()
        .signInWithCredential(googleCredential)
        .then(data => {
          this.setState({loading: false});
          // console.log(data);
          firestore()
            .collection('Users')
            .doc(data.user.uid)
            .get()
            .then(documentSnapshot => {
              // console.log('User exists: ', documentSnapshot.exists);
              if (documentSnapshot.exists) {
                this.setState({loading: false});
                this.state.navigation.navigate('DashboardStack');
              } else {
                // console.log('No exists');
                auth()
                  .signOut()
                  .then(() => {
                    // console.log('User signed out!');
                  });
                this.setState({loading: false});
                this.state.navigation.navigate('SocialSignUp', {
                  type: 'google',
                  userInfo: data,
                  cred: googleCredential,
                });
              }
            });
        })
        .catch(error => {
          this.setState({loading: false});
          if (error.code === 'auth/account-exists-with-different-credential') {
            this.setState({
              inValidText:
                'An account already exists with the same email address but different sign-in method',
            });
          } else if (error.code.includes('network-request-failed')) {
            this.setState({inValidText: 'Check your network connection'});
          } else {
            this.setState({
              inValidText: 'Something went wrong.',
              defaultErrorText: true,
            });
          }
        });
    } catch (error) {
      this.setState({loading: false});
    }
  };
  onFacebookButtonPress = async () => {
    this.setState({inValidText: '', defaultErrorText: false});

    // Attempt login with permissions
    this.setState({loading: true});

    try {
      // if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('WEB_ONLY');

      // }
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        this.setState({loading: false});
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      // const profile = await Profile.getCurrentProfile();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // console.log('result', result);

      // console.log('data1', data);

      // console.log('cred', facebookCredential);

      // console.log('profile', profile);
      // Sign-in the user with the credential
      // this.setState({inValidText: 'cp :3'});

      auth()
        .signInWithCredential(facebookCredential)
        .then(data => {
          // console.log('data', data);
          firestore()
            .collection('Users')
            .doc(data.user.uid)
            .get()
            .then(documentSnapshot => {
              // console.log('User exists: ', documentSnapshot.exists);

              if (documentSnapshot.exists) {
                this.setState({loading: false});
                this.state.navigation.navigate('DashboardStack');
              } else {
                // console.log('No exists');
                auth().signOut();
                this.setState({loading: false});
                this.state.navigation.navigate('SocialSignUp', {
                  type: 'facebook',
                  userInfo: data,
                  cred: facebookCredential,
                });
              }
            });
        })
        .catch(error => {
          console.log(error);
          this.setState({loading: false});
          if (error.code === 'auth/account-exists-with-different-credential') {
            this.setState({
              inValidText:
                'An account already exists with the same email address but different sign-in method',
            });
          } else if (error.code.includes('network-request-failed')) {
            this.setState({inValidText: 'Check your network connection'});
          } else {
            this.setState({
              inValidText: 'Something went wrong.',
              defaultErrorText: true,
            });
          }
        });
    } catch (error) {
      console.log('2', error);
      this.setState({loading: false});
    }
  };
  signOut = async () => {
    const {currentUser} = auth();
    // console.log(currentUser);
    // auth().signOut();
    // await GoogleSignin.revokeAccess();
    // await GoogleSignin.signOut();
  };

  signUp = () => {
    this.setState({inValidText: '', defaultErrorText: false});
    this.state.navigation.navigate('SignUp');
  };

  openLink = link => {
    this.setState({inValidText: '', defaultErrorText: false});
    Linking.openURL(link);
  };

  login = () => {
    // const {email, password, emailIsError, passwordIsError} = this.state;
    // console.log('login');
    this.setState({inValidText: '', defaultErrorText: false});
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.email) {
      this.setState({emailIsError: true});
      this.setState({inValidText: 'Email is empty'});
      this.email.current.focus();
      return;
    } else if (!reg.test(this.state.email)) {
      this.setState({emailIsError: true});
      this.email.current.focus();
      this.setState({inValidText: 'Invaild login credentials'});
      return;
    } else if (!this.state.password) {
      this.setState({passwordIsError: true});
      this.password.current.focus();
      this.setState({inValidText: 'Password is empty'});
      return;
    }
    this.setState({loading: true});
    auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(data => {
        // console.log('User signed in!', data);
        this.setState({loading: false, email: null, password: null});
        this.state.navigation.navigate('DashboardStack');
      })
      .catch(error => {
        // console.log(error);
        this.setState({loading: false});
        if (error.code === 'auth/user-not-found') {
          // console.log('Inavlid user');
          this.email.current.focus();
          this.setState({inValidText: 'User does not exist'});
        } else if (error.code === 'auth/invalid-email') {
          // console.log('That email address is invalid!');
          this.setState({inValidText: 'User invalid'});
          this.email.current.focus();
        } else if (error.code === 'auth/wrong-password') {
          // console.log('Password is incorrect');
          this.password.current.focus();
          if (this.state.email.indexOf('@gmail.com') !== -1) {
            this.setState({
              inValidText:
                'Password is incorrect or you should try sign in with Google',
            });
          } else {
            this.setState({inValidText: 'Password is incorrect'});
          }
        } else if (error.code.includes('network-request-failed')) {
          this.setState({inValidText: 'Check your network connection'});
        } else {
          this.setState({
            inValidText: 'Something went wrong.',
            defaultErrorText: true,
          });
        }

        // console.log(error.text);
      });
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: '', defaultErrorText: false});
  };

  hidePopup = () => {
    this.setState({popUp: false});
  };
  showAlert = () => {
    alert('ccsda');
  };
  versionUpdate = () => {
    return (
      <Modal animationType="slide" transparent={false} visible={true}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 30,
          }}>
          <Image
            style={{width: 100, height: 100, marginBottom: 100}}
            source={require('../assets/playstore-icon.png')}
          />
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              fontWeight: '700',
              textAlign: 'center',
            }}>
            You are using an older version of the app. Kinldy update the app for
            uninterrupted experience.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(this.state.storeUrl)}
            style={[styles.button, {marginTop: 20}]}
            activeOpacity={0.5}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 20,
                fontFamily: 'sans-serif-condensed',
                padding: 10,
                paddingHorizontal: 20,
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  render() {
    const {
      popUp,
      navigation,
      propImage,
      email,
      password,
      emailIsError,
      passwordIsError,
      inValidText,
      loading,
      defaultErrorText,
      forceUpdate,
    } = this.state;
    return (
      <ImageBackground
        source={require('../assets/login_bg.png')}
        style={styles.container}>
        <StatusBar backgroundColor="#fac20e" />
        {forceUpdate && this.versionUpdate()}
        <View
          style={{
            paddingHorizontal: 40,
            paddingVertical: 40,
          }}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 18,
              fontFamily: 'sans-serif-condensed',
            }}>
            Hello, Welcome!
          </Text>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 18,
              fontFamily: 'sans-serif-condensed',
              fontWeight: '700',
            }}>
            Please sign in to continue
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 40,
            paddingVertical: 30,
            justifyContent: 'flex-end',
          }}>
          {/* <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingVertical: 20,
            }}>
            YRR Member Login
          </Text> */}

          <Text
            style={{
              color: 'red',
              paddingBottom: 10,
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              display: inValidText ? 'flex' : 'none',
              textAlign: 'center',
            }}>
            {inValidText}
          </Text>
          {defaultErrorText && (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  color: 'red',
                  paddingBottom: 10,
                  fontSize: Dimensions.get('window').width / 24,
                  fontFamily: 'sans-serif-condensed',
                  display: inValidText ? 'flex' : 'none',
                  textAlign: 'center',
                }}>
                Please try again or{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Contact')}>
                <Text
                  style={{
                    color: 'rgb(250, 204, 4)',
                    fontSize: Dimensions.get('window').width / 24,
                    fontFamily: 'sans-serif-condensed',
                    paddingBottom: 10,
                  }}>
                  Contact Us
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            placeholderTextColor="black"
            placeholder="Email"
            style={[styles.input, emailIsError ? styles.error : null]}
            onChangeText={text => this.changeValue('email', text)}
            value={email}
            ref={this.email}
            keyboardType="email-address"
          />
          <TextInput
            placeholderTextColor="black"
            placeholder="Password"
            secureTextEntry={true}
            style={[
              styles.input,
              passwordIsError ? styles.error : null,
              {marginBottom: 10},
            ]}
            onChangeText={text => this.changeValue('password', text)}
            value={password}
            ref={this.password}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                color: 'rgb(250, 204, 4)',
                textAlign: 'left',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 40,
            paddingBottom: 30,
            paddingTop: 60,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Contact')}>
            <Text
              style={{
                color: 'rgb(250, 204, 4)',
                textAlign: 'left',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
                paddingBottom: 20,
              }}>
              Have a question?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={this.login}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 20,
                fontFamily: 'sans-serif-condensed',
                paddingVertical: 10,
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onGoogleButtonPress}
            style={[styles.buttonContainer, {backgroundColor: '#f5e7ea'}]}>
            <View style={styles.iconWrapper}>
              <FontAwesome
                name="google"
                style={styles.icon}
                size={22}
                color="#de4d41"
              />
            </View>
            <View style={styles.btnTxtWrapper}>
              <Text style={[styles.buttonText, {color: '#de4d41'}]}>
                Sign In with Google
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: '#e6eaf4'}]}
            onPress={this.onFacebookButtonPress}>
            <View style={styles.iconWrapper}>
              <FontAwesome
                name="facebook"
                style={styles.icon}
                size={22}
                color="#4867aa"
              />
            </View>
            <View style={styles.btnTxtWrapper}>
              <Text style={[styles.buttonText, {color: '#4867aa'}]}>
                Sign In with Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={this.signUp}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 20,
                fontFamily: 'sans-serif-condensed',
                paddingVertical: 10,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: Dimensions.get('window').width / 30,
              fontFamily: 'sans-serif-condensed',
            }}>
            By proceeding, you agree to Yellow Road Rangers
          </Text>
          <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
            <Text
              style={{
                color: 'rgb(250, 204, 4)',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
              }}
              onPress={() =>
                this.openLink('https://yellowbull.app/terms-conditions.html')
              }>
              Terms of Service
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
              }}>
              &nbsp;and&nbsp;
            </Text>
            <Text
              style={{
                color: 'rgb(250, 204, 4)',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
              }}
              onPress={() =>
                this.openLink('https://yellowbull.app/privacy-policy.html')
              }>
              Privacy Policy
            </Text>
          </View>
        </View>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator animating={true} size="large" color="red" />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    marginBottom: 10,
    padding: 10,
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    fontWeight: '700',
  },
  button: {
    marginBottom: 10,
    backgroundColor: 'rgb(250, 204, 4)',
  },
  error: {
    borderColor: 'red',
    borderWidth: 2,
  },
  buttonContainer: {
    // marginTop: 5,
    width: '100%',
    // height: Dimensions.get('window').height / 15,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 3,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed',
  },
});
