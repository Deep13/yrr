import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  BackHandler,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  Marker,
  Polyline,
  Callout,
  PROVIDER_GOOGLE,
  OverlayComponent,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';
let animationTimeout;
export default class TrackBooking extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.map = null;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      toa: null,
      data: '',
      statusText: [
        require('../assets/assigning.png'),
        require('../assets/assigned.png'),
        require('../assets/assigning.png'),
      ],
      region: {
        latitude: 1.352083,
        longitude: 103.819836,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      animated: false,
      driver: null,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const transactionId = route.params.transactionId;
    firestore()
      .collection('Transaction')
      .doc(transactionId)
      .onSnapshot(
        documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            // console.log(documentSnapshot.data());
            let data = documentSnapshot.data();
            data.id = documentSnapshot.id;
            this.setState({
              data: data,
              markers: data.loc_to
                ? [
                    {
                      latlng: {
                        latitude: data.loc_from.lat,
                        longitude: data.loc_from.long,
                      },
                      title: 'Start',
                      identifier: 'Start',
                      color: 'red',
                    },
                    {
                      latlng: {
                        latitude: data.loc_to.lat,
                        longitude: data.loc_to.long,
                      },
                      title: 'End',
                      identifier: 'End',
                      color: 'green',
                    },
                  ]
                : [
                    {
                      latlng: {
                        latitude: data.loc_from.lat,
                        longitude: data.loc_from.long,
                      },
                      title: 'Start',
                      identifier: 'Start',
                      color: 'red',
                    },
                  ],
            });

            if (data.servStatus > 2) {
              if (data.liveLocation) {
                this.setState({
                  driver: {
                    coordinate: {
                      latitude: data.liveLocation
                        ? data.liveLocation.latitude
                        : null,
                      longitude: data.liveLocation
                        ? data.liveLocation.longitude
                        : null,
                    },
                    heading: data.liveLocation.heading,
                  },
                });
                if (data.servStatus == 3) {
                  var from =
                    data.liveLocation.latitude +
                    ',' +
                    data.liveLocation.longitude;
                  var to = data.loc_from.lat + ',' + data.loc_from.long;
                  this.fetchOnlineTextData(from, to);
                } else if (data.servStatus == 4 && data.loc_to) {
                  var from =
                    data.liveLocation.latitude +
                    ',' +
                    data.liveLocation.longitude;
                  var to = data.loc_to.lat + ',' + data.loc_to.long;
                  this.fetchOnlineTextData(from, to);
                }
              }
              // if (!this.state.animated) {
              //   this.animate();
              //   this.setState({animated: true});
              // }
            }
          } else {
            console.log('Does not exist');
          }
        },
        error => {
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  fetchOnlineTextData = (from, to) => {
    var url =
      'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' +
      from +
      '&destinations=' +
      to +
      '&key=AIzaSyBr0GhOdiiOeaUaVHvMibAD_m3RKZLYueM';
    fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.rows[0].elements[0].duration.text);
        if (responseJson.rows[0]) {
          this.setState({toa: responseJson.rows[0].elements[0].duration.text});
        }
      })
      .catch(error => {
        console.log('offline text data');
      });
  };

  goToCurrentLocation = () => {
    var aMarkers = [];
    if (this.state.markers.length > 0) {
      this.state.markers.forEach(function(val) {
        aMarkers.push(val.latlng);
      });
      if (this.state.driver) {
        aMarkers.push(this.state.driver.coordinate);
      }
      this.animate(aMarkers);
    }
  };
  goToCurrentLocationComplete = () => {
    var aMarkers = [];
    if (this.state.markers.length > 0) {
      this.state.markers.forEach(function(val) {
        aMarkers.push(val.latlng);
      });
      if (aMarkers.length == 1) {
        var region = {...aMarkers[0]};
        region.latitudeDelta = 0.0922;
        region.longitudeDelta = 0.0421;
        this.mapImage.animateToRegion(region);
      } else if (aMarkers.length == 2) {
        this.mapImage.fitToCoordinates(aMarkers, {
          edgePadding: {top: 400, bottom: 400, right: 200, left: 200},
          animated: true,
        });
      }
    }
  };
  handleBackButton = () => {
    this.state.navigation.navigate('Bookings');
    return true;
  };
  animate = aMarkers => {
    this.map.fitToCoordinates(aMarkers, {
      edgePadding: {top: 100, bottom: 100, right: 100, left: 100},
      animated: true,
    });
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  onMoveMap = place => {
    this.setState({
      region: {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
    });
  };
  render() {
    const {
      data,
      navigation,
      statusText,
      region,
      markers,
      driver,
      statusString,
      toa,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        {data.servStatus < 3 && (
          <ImageBackground
            source={statusText[data.servStatus]}
            resizeMode="contain"
            style={{flex: 1}}
          />
        )}
        {data.servStatus > 2 && data.servStatus < 5 && (
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
              <MapView
                ref={ref => {
                  this.map = ref;
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapReady={this.goToCurrentLocation}
                followsUserLocation={true}
                style={styles.map}
                onRegionChangeComplete={this.onMoveMap}
                initialRegion={region}>
                {markers.map(marker => (
                  <Marker
                    identifier={marker.identifier}
                    coordinate={marker.latlng}
                    title={marker.title}
                    pinColor={marker.color}
                  />
                ))}
                {driver && (
                  <Marker.Animated
                    identifier="Driver"
                    coordinate={driver.coordinate}
                    anchor={{x: 0.5, y: 0.5}}
                    style={{
                      transform: [
                        {
                          rotate: `${driver.heading}deg`,
                        },
                      ],
                    }}
                    title="Driver">
                    <Image
                      source={require('../assets/driver_icon.png')}
                      style={{
                        width: Dimensions.get('window').width / 10,
                        transform: [
                          {
                            rotate: '0deg',
                          },
                        ],
                      }}
                    />
                  </Marker.Animated>
                )}
              </MapView>
            </View>
            <View
              style={{
                padding: 30,
              }}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  fontFamily: 'sans-serif-condensed',
                  paddingVertical: 10,
                }}>
                Driver name: {data.driverDetails.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontFamily: 'sans-serif-condensed',
                  }}
                  onPress={() =>
                    Linking.openURL('tel:' + data.driverDetails.contact)
                  }>
                  Contact: {data.driverDetails.contact}
                </Text>
                <Icon
                  style={{paddingHorizontal: 10}}
                  onPress={() =>
                    Linking.openURL('tel:' + data.driverDetails.contact)
                  }
                  name="phone"
                  size={20}
                  color="green"
                />
              </View>
              {toa && (
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontFamily: 'sans-serif-condensed',
                    paddingVertical: 10,
                  }}>
                  Estimated time of arrival: {toa}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={this.goToCurrentLocation}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: '#fff',
                padding: 10,
              }}>
              <Entypo name="location" size={30} />
            </TouchableOpacity>
          </View>
        )}
        {data.servStatus == 5 && (
          <View style={{flex: 1}}>
            <View
              style={{
                height: Dimensions.get('window').height * 0.2,
              }}>
              <MapView
                ref={ref => {
                  this.mapImage = ref;
                }}
                liteMode
                onMapReady={this.goToCurrentLocationComplete}
                style={styles.map}
                initialRegion={region}>
                {markers.map(marker => (
                  <Marker
                    identifier={marker.identifier}
                    coordinate={marker.latlng}
                    title={marker.title}
                    pinColor={marker.color}>
                    <Icon
                      name="map-pin"
                      color={marker.color}
                      size={Dimensions.get('window').width / 20}
                    />
                  </Marker>
                ))}
              </MapView>
            </View>
            <View style={{flex: 1, padding: 10}}>
              <View style={{paddingVertical: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                    fontWeight: '700',
                  }}>
                  {data.createdAt.toDate().toDateString() +
                    ' ' +
                    data.createdAt.toDate().toLocaleTimeString()}
                </Text>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Booking Id: {data.id}
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                  borderBottomWidth: 1,
                }}
              />
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  fontFamily: 'sans-serif-condensed',
                  paddingVertical: 10,
                }}>
                Service Availed: {data.servType}
              </Text>
              <View style={{width: '95%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="map-marker-alt"
                    color="red"
                    size={Dimensions.get('window').width / 20}
                  />
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      fontSize: Dimensions.get('window').width / 25,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {data.loc_from.address}
                  </Text>
                </View>
                {data.loc_to && (
                  <View>
                    <View
                      style={{
                        width: Dimensions.get('window').width / 25,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 1,
                          height: 50,
                          borderLeftColor: 'rgba(0,0,0,0.2)',
                          borderLeftWidth: 1,
                          borderStyle: 'dashed',
                        }}
                      />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        name="map-marker-alt"
                        color="green"
                        size={Dimensions.get('window').width / 20}
                      />
                      <Text
                        style={{
                          paddingHorizontal: 10,
                          fontSize: Dimensions.get('window').width / 25,
                          fontFamily: 'sans-serif-condensed',
                        }}>
                        {data.loc_to.address}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Icon
                  style={{paddingRight: 10}}
                  name="car-side"
                  color="black"
                  size={Dimensions.get('window').width / 25}
                />
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontFamily: 'sans-serif-condensed',
                    color: 'black',
                    paddingVertical: 10,
                  }}>
                  {data.carDetails.carBrand}•
                </Text>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontFamily: 'sans-serif-condensed',
                    color: 'black',
                    paddingVertical: 10,
                  }}>
                  {data.carDetails.carModel}•
                </Text>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    fontFamily: 'sans-serif-condensed',
                    color: 'black',
                    paddingVertical: 10,
                  }}>
                  {data.carDetails.carPlate}
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                  borderBottomWidth: 1,
                }}
              />
              {data.discountApp && (
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 24,
                    fontFamily: 'sans-serif-condensed',
                    color: 'black',
                    paddingVertical: 10,
                  }}>
                  Discount applied:{data.discountApp.description}
                </Text>
              )}
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 24,
                  fontFamily: 'sans-serif-condensed',
                  color: 'black',
                  paddingVertical: 10,
                }}>
                Amount: ${data.amount}
              </Text>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 24,
                  fontFamily: 'sans-serif-condensed',
                  color: 'black',
                  paddingVertical: 10,
                }}>
                Payment mode: {data.paymentMode}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});
