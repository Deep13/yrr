import React, {Component, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  Callout,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog, {
  ScaleAnimation,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
export default class CarAssistance extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      screen: 0,
      backCount: 0,
      locationVisible: false,
      navigation: props.navigation,
      servType: '',
      aCondition: [],
      region: {
        latitude: 1.352083,
        longitude: 103.819836,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      currentLocation: '',
      poi: null,
    };
    this.handleBackButton = this.handleBackButton.bind(this);
  }
  componentDidMount() {
    if (this.props.route.params) {
      const {key} = this.props.route.params;
      if (key) {
        this.setState({screen: 2});
        this.bounce('Lost Key');
      } else {
        this.setState({screen: 1});
      }
    } else {
      this.setState({screen: 1});
    }
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        // console.log(lat, long);
        this.setState({
          region: {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          },
        });
      },
      error => {
        // this.setState({locationVisible: true});
        // console.log(error.message);
      },
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.screen == 2) {
      if (this.props.route.params) {
        const {key} = this.props.route.params;
        if (key) {
          this.state.navigation.navigate('Dashboard');
        } else {
          this.screen2.bounceOutDown(800);
          this.setState({screen: 1});
        }
      } else {
        this.screen2.bounceOutDown(800);
        this.setState({screen: 1});
      }
    } else if (this.state.screen == 1) {
      this.state.navigation.navigate('Dashboard');
    }
    this.setState({locationVisible: false});
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleScreen1 = ref => (this.screen1 = ref);
  handleScreen2 = ref => (this.screen2 = ref);

  bounce = value => {
    firestore()
      .collection('termsncondition')
      .doc(value)
      .get()
      .then(
        documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.data().text);

          if (documentSnapshot.exists) {
            console.log(documentSnapshot.data());
            this.setState({aCondition: documentSnapshot.data()});

            this.setState({screen: 2, servType: value});
            if (this.screen1) {
              this.screen1.bounceOutDown(800);
            }
          }
        },
        error => {
          // console.log(error);
        },
      );
  };
  render() {
    const {
      navigation,
      region,
      screen,
      locationVisible,
      servType,
      aCondition,
    } = this.state;
    return (
      <View style={styles.container}>
        <Dialog
          visible={locationVisible}
          dialogAnimation={
            new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })
          }
          onHardwareBackPress={() => {
            this.setState({locationVisible: false});
            return true;
          }}
          dialogTitle={<DialogTitle title="No location available" />}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {
                  this.setState({locationVisible: false});
                }}
              />
            </DialogFooter>
          }>
          <DialogContent>
            <Text
              style={{
                fontSize: Dimensions.get('window').width / 28,
                fontFamily: 'sans-serif-condensed',
                padding: 10,
                alignItems: 'center',
              }}>
              Please turn on device location, for better services
            </Text>
          </DialogContent>
        </Dialog>
        <View style={{flex: 2, width: '100%'}}>
          <MapView
            liteMode
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            toolbarEnabled={false}
            style={styles.map}
            region={region}
          />
        </View>
        {screen === 1 && (
          <Animatable.View
            animation="slideInUp"
            duration={500}
            ref={this.handleScreen1}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              backgroundColor: 'white',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: 'rgb(250, 204, 4)',
              }}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 18,
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingBottom: 10,
                }}>
                Road Assistance Services
              </Text>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 30,
                  fontFamily: 'sans-serif-condensed',
                  textAlign: 'center',
                }}>
                You will recieve a call from us. If unsure please select call
                center icon.
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 5,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => this.bounce('Tow Car')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/car_towing.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Tow Car
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => this.bounce('Jump Start')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/jump_start.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Jump Start
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => this.bounce('Change Battery')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/car_battery.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Change Battery
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 5,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => this.bounce('Flat Tyre')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/flat_tyres.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Flat Tyre
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => this.bounce('Others')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/others.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Others
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => Linking.openURL('tel:+6591013232')}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/unsure.png')}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Call Center
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
        {screen === 2 && (
          <Animatable.View
            animation="slideInUp"
            duration={500}
            ref={this.handleScreen2}
            style={{
              flex: 2,
              width: Dimensions.get('window').width,
              // backgroundColor: 'rgb(250, 204, 4)',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: 'center',
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: Dimensions.get('window').width / 18,
                fontFamily: 'sans-serif-condensed',
                fontWeight: 'bold',
              }}>
              Terms and Conditions
            </Text>
            <View
              style={{
                width: '100%',
                flex: 1,
                paddingHorizontal: 10,
                paddingBottom: 10,
                // backgroundColor: 'rgb(250, 204, 4)',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <View style={{flex: 1, padding: 10}}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                  }}
                  source={require('../assets/others.png')}
                />
              </View>
              <View style={{flex: 2}}> */}
              {/* <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 18,
                    fontFamily: 'sans-serif-condensed',
                    textAlign: 'left',
                  }}>
                  Members
                </Text> */}
              <ScrollView
                persistentScrollbar={true}
                contentContainerStyle={{minHeight: '100%'}}>
                {aCondition.text &&
                  aCondition.text.map((item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          // padding: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: Dimensions.get('window').width / 20,
                            fontFamily: 'sans-serif-condensed',
                          }}>
                          {'\u2022' + ' '}
                        </Text>
                        <Text
                          style={{
                            fontSize: Dimensions.get('window').width / 25,
                            fontFamily: 'sans-serif-condensed',
                            textAlign: 'left',
                          }}>
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                {/* <View style={{flexDirection: 'row', paddingVertical: 10}}>
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width / 25,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    Read{' '}
                  </Text>
                  <Text
                    style={{
                      color: '#00ace6',
                      fontSize: Dimensions.get('window').width / 25,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    onPress={() =>
                      Linking.openURL(
                        'https://yellowbull.app/terms-conditions.html',
                      )
                    }>
                    Terms and Conditions
                  </Text>
                </View> */}
              </ScrollView>
              {/* </View> */}
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('BookService', {servType: servType})
                }>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: Dimensions.get('window').width / 20,
                    fontFamily: 'sans-serif-condensed',
                    fontWeight: '700',
                    paddingVertical: 10,
                  }}>
                  PROCEED
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  button: {
    marginBottom: 10,
    backgroundColor: 'rgb(250, 204, 4)',
    borderWidth: 1,
    // backgroundColor: 'white',
    borderColor: 'black',
    borderBottomColor: 'black',
  },
});
