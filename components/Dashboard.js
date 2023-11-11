import React, {Component, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import ImageCarousel from './imageCarousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import {Badge} from 'react-native-elements';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingModal from './LoadingModal';
// import SplashScreen from 'react-native-splash-screen';
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      popUp: false,
      propImage: '',
      icons: null,
      textTitle: [],
      hidden: true,
      backCount: 0,
      navigation: props.navigation,
    };
    this.handleBackButton = this.handleBackButton.bind(this);
  }
  componentDidMount() {
    console.disableYellowBox = true;
    const {currentUser} = auth();
    var first = true;
    // console.log(currentUser.uid);
    // OneSignal.addEventListener('opened', this.onOpened.bind(this));

    firestore()
      .collection('Notification')
      .limit(1)
      .onSnapshot(
        snapshot => {
          if (!first) {
            var that = this;
            // console.log(snapshot.docChanges().length);
            snapshot.docChanges().forEach(function(change) {
              // if (change.type === 'added') {
              // console.log('added');
              that.setState({hidden: false});
              // }
            });
          } else {
            first = false;
          }
        },
        error => {
          // console.log(error);
        },
      );

    var obj = {};
    firestore()
      .collection('dashboardImg')
      .doc('fu7Ol3k6eIOcQRjQbDcD')
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          var aImages = [];
          if (documentSnapshot.data().images) {
            documentSnapshot.data().images.forEach(function(data, index) {
              // console.log(index, src);
              aImages.push({
                id: index.toString(),
                src: data.src,
                to: data.to,
                type: data.type,
              });
            });
            this.setState({
              textTitle: aImages,
            });
          }
          if (documentSnapshot.data().icons) {
            // console.log('Icons');
            this.setState({
              icons: documentSnapshot.data().icons,
            });
          }
        }
      });

    firestore()
      .collection('promoImg')
      .doc('i3wHYdTCb8SbmPoE543b')
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          if (documentSnapshot.data().state) {
            this.setState({popUp: true, propImage: documentSnapshot.data()});
            setInterval(() => {
              this.hidePopup();
            }, 3000);
          }
          // SplashScreen.hide();
          // console.log('User data: ', documentSnapshot.data());
        }
      });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.backCount == 1) {
      this.setState({backCount: 0});
      BackHandler.exitApp();
      return true;
    } else {
      this.setState({backCount: 1});
      ToastAndroid.showWithGravityAndOffset(
        'Press again to quit the application',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      setTimeout(() => {
        this.setState({backCount: 0});
      }, 2000);

      return true;
    }
  };
  componentWillUnmount() {
    // console.log('dash out');
    // OneSignal.removeEventListener('opened', this.onOpened);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  hidePopup = () => {
    this.setState({popUp: false});
  };
  // onOpened(openResult) {
  //   // console.log('Message: ', openResult.notification.payload.body);
  //   // console.log('Data: ', openResult.notification.payload.additionalData);
  //   // console.log('isActive: ', openResult.notification.isAppInFocus);
  //   // console.log('openResult: ', openResult);
  //   const {currentUser} = auth();
  //   if (currentUser) {
  //     this.state.navigation.navigate('Contact');
  //     // this.state.navigation.navigate('DashboardStack');
  //   }
  // }
  onImageClick = image => {
    if (image.type) {
      if (image.type === 'web') {
        Linking.openURL(image.to);
      } else {
        this.state.navigation.navigate(image.to);
      }
    }
  };
  navigationBell = () => {
    this.setState({hidden: true});
    this.state.navigation.navigate('Notifications');
  };
  render() {
    const {hidden, navigation, textTitle, popUp, propImage, icons} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View
          style={{
            backgroundColor: 'rgb(250, 204, 4)',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Icons.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
          <Image
            source={require('../assets/headerDashboard.png')}
            style={{width: '50%'}}
            resizeMode="contain"
          />
          {/* <Text
            style={{
              fontSize: Dimensions.get('window').width / 18,
              fontFamily: 'sans-serif-condensed',
              fontWeight: 'bold',
            }}>
            Dashboard
          </Text> */}
          <TouchableOpacity onPress={this.navigationBell}>
            <Badge
              badgeStyle={[styles.badge, {display: hidden ? 'none' : 'flex'}]}
              textStyle={styles.badgeText}
              status="error"
              containerStyle={[
                styles.badgeContainer,
                {
                  top: 5,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: hidden ? 'none' : 'flex',
                },
              ]}
            />
            <Icons.Button
              name="md-notifications"
              size={25}
              color="black"
              fontWeight={700}
              backgroundColor="rgb(250, 204, 4)"
            />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={popUp}
          onRequestClose={this.hidePopup}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: Dimensions.get('window').height,
              zIndex: 100,
              padding: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View style={{width: '100%', flex: 1}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{width: '100%', flex: 1}}
                onPress={() => Linking.openURL(propImage.url)}>
                <Image
                  source={{uri: propImage.img}}
                  style={{width: '100%', flex: 1}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', top: 20, right: 20}}
                onPress={this.hidePopup}>
                {/* <Text style={{color: 'black'}}>Close</Text> */}
                <Icon
                  backgroundColor="white"
                  name="close-circle-outline"
                  color="black"
                  style={{padding: 5}}
                  size={50}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            height: Dimensions.get('window').width * (9 / 16),
            backgroundColor: '#dddfe0',
          }}>
          <ImageCarousel
            imagePressed={this.onImageClick}
            textTitle={textTitle}
            navigation={navigation}
          />
        </View>
        {icons !== null ? (
          <View style={{flex: 1, padding: 10}}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => navigation.navigate('CarAssistance')}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[0].src}}
                  />
                  <Text style={styles.label}>{icons[0].title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => navigation.navigate('UpdateVehicle')}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[1].src}}
                  />
                  <Text style={styles.label}>{icons[1].title}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => navigation.navigate('Marketplace')}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[2].src}}
                  />
                  <Text style={styles.label}>{icons[2].title}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => navigation.navigate('Bookings')}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[3].src}}
                  />
                  <Text style={styles.label}>{icons[3].title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => navigation.navigate('Rewards')}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[4].src}}
                  />
                  <Text style={styles.label}>{icons[4].title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => Linking.openURL(icons[5].link)}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[5].src}}
                  />
                  <Text style={styles.label}>{icons[5].title}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => Linking.openURL(icons[6].link)}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[6].src}}
                  />
                  <Text style={styles.label}>{icons[6].title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => Linking.openURL(icons[7].link)}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[7].src}}
                  />
                  <Text style={styles.label}>{icons[7].title}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                /> */}
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() =>
                    navigation.navigate('CarAssistance', {key: true})
                  }>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[8].src}}
                  />
                  <Text style={styles.label}>{icons[8].title}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => Linking.openURL(icons[9].link)}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[9].src}}
                  />
                  <Text style={styles.label}>{icons[9].title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => Linking.openURL(icons[10].link)}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: Dimensions.get('window').width / 6,
                      width: '100%',
                    }}
                    source={{uri: icons[10].src}}
                  />
                  <Text style={styles.label}>{icons[10].title}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                /> */}
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <LoadingModal />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    borderRadius: 9,
    height: 10,
    minWidth: 0,
    width: 10,
  },
  badgeContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
  label: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 28,
    fontFamily: 'sans-serif-condensed',
    textAlign: 'center',
  },
});
