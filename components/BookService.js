import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  BackHandler,
  ScrollView,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import LocationModal from './LocationModal';
import MapView, {
  Marker,
  Polyline,
  Callout,
  PROVIDER_GOOGLE,
  OverlayComponent,
} from 'react-native-maps';
// import MapInputStart from './MapInputStart';
import RNGooglePlaces from 'react-native-google-places';
import DiscountModal from './DiscountModal';
import VehicleModal from './VehicleModal';
import Dialog, {
  ScaleAnimation,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
export default class BookService extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.pickUp = React.createRef();
    this.drop = React.createRef();
    this.state = {
      locationModalVisible: false,
      discountModalVisible: false,
      vehicleModalVisible: false,
      loadingModalVisible: false,
      vehicleValue: null,
      discountValue: null,
      Additional: null,
      inValidText: '',
      discountListData: [],
      discountCarListData: [],
      vehicleListData: [],
      currentModal: '',
      pickUp: {address: null, location: null},
      drop: {address: null, location: null},
      navigation: props.navigation,
      locationVisible: false,
      errorText: '',
      errorTitle: '',
      parking: {
        o: true,
        ms: false,
        b: false,
      },
      region: {
        latitude: 1.352083,
        longitude: 103.819836,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      pickUpError: false,
      dropError: false,
      carBrandItems: [],
      carModelItems: [],
      loadingModal: false,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const servType = route.params.servType;
    console.log(servType);
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        this.setState({
          region: {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      },
      error => {
        console.log(error.message);
        this.setState({loadingModalVisible: false});
        this.setState({
          locationVisible: true,
          errorTitle: 'No location available',
          errorText:
            'Please turn on device location to get your current location',
        });
      },
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    // this.setState({
    //   locationVisible: false,
    // });
    this.state.navigation.navigate('CarAssistance');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  checkOnSubmit = () => {
    const {
      vehicleValue,
      discountValue,
      pickUp,
      drop,
      Additional,
      discountListData,
      discountCarListData,
    } = this.state;
    if (!pickUp.address) {
      this.setState({pickUpError: true, inValidText: 'Enter Pick Up location'});
    } else if (pickUp.address === drop.address) {
      this.setState({
        inValidText: 'Pick Up and Drop Location cannot be the same',
      });
    } else if (!vehicleValue) {
      this.setState({
        inValidText: 'Please select a vehicle',
      });
    } else {
      this.setState({loadingModal: true});
      const {currentUser} = auth();
      const {route} = this.props;
      const servType = route.params.servType;
      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(
          documentSnapshot => {
            if (documentSnapshot.exists) {
              var userData = documentSnapshot.data();
              firestore()
                .collection('Transaction')
                .add({
                  userName: userData.userName,
                  userContact: userData.mobCode + userData.mob,
                  userRole: vehicleValue.role,
                  userID: currentUser.uid,
                  email: currentUser.email,
                  additional: Additional,
                  loc_to: drop.address
                    ? {
                        address: drop.address,
                        lat: drop.location.latitude,
                        long: drop.location.longitude,
                      }
                    : null,
                  loc_from: {
                    address: pickUp.address,
                    lat: pickUp.location.latitude,
                    long: pickUp.location.longitude,
                  },
                  servType: servType,
                  parkingType: this.getSelectedParking(),
                  discountApp: discountValue,
                  carDetails: {
                    carPlate: vehicleValue.carPlate,
                    carBrand: vehicleValue.carBrand,
                    carModel: vehicleValue.carModel,
                  },
                  servStatus: 0,
                  driverDetails: null,
                  liveLocation: null,
                  createdAt: firestore.FieldValue.serverTimestamp(),
                  modifiedAt: firestore.FieldValue.serverTimestamp(),
                })
                .then(success => {
                  var arrayData = [];
                  if (discountValue) {
                    if (discountValue.source == 'User') {
                      arrayData = discountListData;
                    } else {
                      arrayData = discountCarListData;
                    }
                  }
                  if (arrayData.length > 0) {
                    var updatedReward = [];
                    arrayData.forEach(val => {
                      if (val.id === discountValue.id) {
                        val.status = 1;
                      }
                      var data = {...val};
                      delete data.source;
                      updatedReward.push(data);
                    });
                    console.log(discountValue.source);
                    if (discountValue.source == 'User') {
                      firestore()
                        .collection('Users')
                        .doc(currentUser.uid)
                        .update({
                          reward: updatedReward,
                        })
                        .then(() => {
                          this.setState({loadingModal: false});
                          console.log('Transaction added!', success.id);
                          this.state.navigation.navigate('TrackBooking', {
                            transactionId: success.id,
                          });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    } else {
                      console.log('carPlate discount');
                      firestore()
                        .collection('carPlates')
                        .doc(vehicleValue.carPlate)
                        .update({
                          rewards: updatedReward,
                        })
                        .then(
                          () => {
                            this.setState({loadingModal: false});
                            console.log('Transaction added!', success.id);
                            this.state.navigation.navigate('TrackBooking', {
                              transactionId: success.id,
                            });
                          },
                          error => {
                            console.log(error);
                          },
                        )
                        .catch(err => {
                          console.log(err);
                        });
                    }
                  } else {
                    this.setState({loadingModal: false});
                    console.log('Transaction added!', success.id);
                    this.state.navigation.navigate('TrackBooking', {
                      transactionId: success.id,
                    });
                  }
                })
                .catch(error => {
                  console.log(error);
                  this.setState({loading: false});
                  this.setState({inValidText: 'Check your network connection'});
                });
            }
          },
          error => {
            console.log(error);
            this.setState({loading: false});
            this.setState({inValidText: 'Check your network connection'});
          },
        )
        .catch(err => {
          console.log(err);
        });
    }
  };
  onMoveMap = place => {
    this.setState({
      region: place,
    });
  };
  getCurrentLocation = value => {
    this.setState({loadingModalVisible: true});
    var currentMax = 0;
    // Geolocation.getCurrentPosition(
    //   position => {
    //     var lat = parseFloat(position.coords.latitude);
    //     var long = parseFloat(position.coords.longitude);
    //   },
    //   error => {
    //     console.log(error.message);
    //   },
    // );
    RNGooglePlaces.getCurrentPlace(['address', 'location'])
      .then(results => {
        console.log(results[0].location);
        this.setState({
          loadingModalVisible: false,
          [value]: {address: results[0].address, location: results[0].location},
          inValidText: null,
          pickUpError: false,
          dropError: false,
        });
      })
      .catch(error => {
        console.log(error.message, 'error');
        this.setState({loadingModalVisible: false});
        this.setState({
          locationVisible: true,
          errorTitle: 'No location available',
          errorText:
            'Please turn on device location to get your current location',
          inValidText: null,
          pickUpError: false,
          dropError: false,
        });
      });
  };
  hideModal = modalName => {
    this.setState({[modalName]: false});
  };
  showDiscountModal = () => {
    if (this.state.vehicleValue) {
      this.setState({loadingModalVisible: true});
      const {currentUser} = auth();
      // console.log(this.state.vehicleValue);
      this.setState({discountListData: [], discountCarListData: []});

      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(
          documentSnapshot => {
            // console.log('User exists: ', documentSnapshot.exists);
            var aRewards = [];
            if (documentSnapshot.exists) {
              if (documentSnapshot.data().reward) {
                documentSnapshot.data().reward.forEach(val => {
                  if (val.status == 0) {
                    val.source = 'User';
                    aRewards.push(val);
                  }
                });
              }
            }
            this.setState({
              discountListData: aRewards,
            });
            firestore()
              .collection('carPlates')
              .doc(this.state.vehicleValue.carPlate)
              .get()
              .then(
                documentSnapshot => {
                  // console.log('User exists: ', documentSnapshot.exists);
                  var caRewards = [];
                  if (documentSnapshot.exists) {
                    // console.log(documentSnapshot.data().rewards);
                    if (documentSnapshot.data().rewards) {
                      documentSnapshot.data().rewards.forEach(val => {
                        if (val.status == 0) {
                          val.source = 'carPlate';
                          caRewards.push(val);
                        }
                      });
                    }
                  }
                  this.setState({
                    discountCarListData: caRewards,
                  });
                  this.setState({loadingModalVisible: false});
                  this.setState({discountModalVisible: true});
                },
                error => {
                  this.setState({loading: false});
                  this.setState({inValidText: 'Check your network connection'});
                },
              );
            // this.setState({
            //   discountListData: [...this.state.discountListData, aRewards],
            // });
            // this.setState({loadingModalVisible: false});
            // this.setState({discountModalVisible: true});
          },
          error => {
            this.setState({loading: false});
            this.setState({inValidText: 'Check your network connection'});
          },
        );
    } else {
      this.setState({inValidText: 'Please select vehicle first'});
    }
  };
  showVehicleModal = () => {
    this.setState({loadingModalVisible: true});
    const {currentUser} = auth();
    firestore()
      .collection('carBrands')
      .get()
      .then(
        querySnapshot => {
          var aModels = [];
          var aBrands = [];
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);
            var brand = documentSnapshot.id;
            var data = documentSnapshot.data();
            aBrands.push({label: brand, value: brand});
            aModels[brand] = [];
            data.carModel.forEach(function(val) {
              aModels[brand].push({label: val, value: val});
            });
          });
          this.setState({carBrandItems: aBrands, carModelItems: aModels});
          // console.log(aBrands);
        },
        error => {
          this.setState({loading: false});
          this.setState({inValidText: 'Check your network connection'});
        },
      );
    firestore()
      .collection('carPlates')
      .where('users', 'array-contains', currentUser.uid)
      .where('status', '==', 1)
      .get()
      .then(
        querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            aData.push(data);
          });
          // console.log('vehcle', aData);
          this.setState({
            vehicleListData: aData,
            loadingModalVisible: false,
            vehicleModalVisible: true,
            inValidText: null,
            pickUpError: false,
            dropError: false,
          });
        },
        error => {
          console.log(error);
          this.setState({
            loadingModalVisible: false,
            inValidText: null,
            pickUpError: false,
            dropError: false,
          });
        },
      );
  };
  selectedDiscountItem = item => {
    this.hideModal('discountModalVisible');
    console.log(item.source);
    this.setState({discountValue: item});
  };
  selectedVehicleItem = item => {
    this.hideModal('vehicleModalVisible');
    this.setState({vehicleValue: item, discountValue: null});
    console.log(item.role);
  };
  showModal = value => {
    this.setState({
      currentModal: value,
      locationModalVisible: true,
      inValidText: null,
      pickUpError: false,
      dropError: false,
    });
  };
  parkingSelected = selected => {
    this.setState({
      parking: {
        o: selected === 'o' ? true : false,
        ms: selected === 'ms' ? true : false,
        b: selected === 'b' ? true : false,
      },
    });
  };
  clear = value => {
    this.setState({[value]: {address: null, location: null}});
  };
  getSelectedParking = () => {
    if (this.state.parking.o) {
      return 'Open';
    }
    if (this.state.parking.ms) {
      return 'Multi-story';
    }
    if (this.state.parking.b) {
      return 'Basement';
    }
  };

  changePlaceText = address => {
    this.setState({[this.state.currentModal]: address});
  };

  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {
      inValidText,
      pickUp,
      drop,
      parking,
      locationModalVisible,
      currentModal,
      discountModalVisible,
      discountListData,
      discountValue,
      vehicleModalVisible,
      vehicleListData,
      vehicleValue,
      loadingModalVisible,
      locationVisible,
      errorText,
      errorTitle,
      pickUpError,
      dropError,
      region,
      carBrandItems,
      carModelItems,
      Additional,
      loadingModal,
      discountCarListData,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
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
          dialogTitle={<DialogTitle title={errorTitle} />}
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
              {errorText}
            </Text>
          </DialogContent>
        </Dialog>
        <View style={styles.container}>
          <Text
            style={{
              color: 'red',
              paddingTop: 10,
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              display: inValidText ? 'flex' : 'none',
            }}>
            {inValidText}
          </Text>
          <View style={{flex: 3, width: '100%', paddingTop: 20}}>
            <ScrollView>
              <View style={styles.formElement}>
                <Icon name="location-on" size={30} color="red" />
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'rgb(250, 204, 4)',
                      padding: 10,
                      alignItems: 'center',
                    },
                    pickUpError ? styles.error : null,
                  ]}
                  onPress={() => this.showModal('pickUp')}>
                  <Text style={styles.input}>
                    {pickUp.address ? pickUp.address : 'Enter Pick Up Location'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: '100%',
                    justifyContent: 'flex-start',
                  }}
                  onPress={() => this.clear('pickUp')}>
                  <Icon
                    name="close"
                    size={20}
                    style={{
                      padding: 10,
                    }}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.formElement}>
                <Icon name="location-on" size={30} color="green" />
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'rgb(250, 204, 4)',
                      padding: 10,
                      alignItems: 'center',
                    },
                    dropError ? styles.error : null,
                  ]}
                  onPress={() => this.showModal('drop')}>
                  <Text style={styles.input}>
                    {drop.address
                      ? drop.address
                      : 'Enter Drop Off Location (optional)'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: '100%',
                    justifyContent: 'flex-start',
                  }}
                  onPress={() => this.clear('drop')}>
                  <Icon
                    name="close"
                    size={20}
                    style={{
                      padding: 10,
                    }}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.selectOption, {padding: 20}]}>
                Please select current carpark type
              </Text>
              <View
                style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={[
                    styles.parkingButton,
                    parking.o ? styles.selected : styles.unselected,
                  ]}
                  onPress={() => this.parkingSelected('o')}>
                  <Text style={styles.parkingText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.parkingButton,
                    parking.ms ? styles.selected : styles.unselected,
                  ]}
                  onPress={() => this.parkingSelected('ms')}>
                  <Text style={styles.parkingText}>Multi-story</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.parkingButton,
                    parking.b ? styles.selected : styles.unselected,
                  ]}
                  onPress={() => this.parkingSelected('b')}>
                  <Text style={styles.parkingText}>Basement</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', margin: 20}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgb(250, 204, 4)',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    padding: 10,
                  }}
                  onPress={this.showVehicleModal}>
                  <Text style={styles.selectOption}>Vehicle</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.selectOption}>
                      {vehicleValue ? vehicleValue.carPlate : 'Select Vehicle'}
                    </Text>
                    <Icon name="chevron-right" size={40} color="black" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    backgroundColor: 'grey',
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  onPress={() => this.setState({vehicleValue: null})}>
                  <Icon
                    backgroundColor="white"
                    name="close"
                    color="white"
                    size={40}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', margin: 20}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgb(250, 204, 4)',
                    alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    padding: 10,
                  }}
                  onPress={this.showDiscountModal}>
                  <Text style={[styles.selectOption, {flex: 1}]}>Discount</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Text style={styles.selectOption} numberOfLines={1}>
                      {discountValue ? discountValue.title : 'Select Coupons'}
                    </Text>
                    <Icon name="chevron-right" size={40} color="black" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    backgroundColor: 'grey',
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  onPress={() => this.setState({discountValue: null})}>
                  <Icon
                    backgroundColor="white"
                    name="close"
                    color="white"
                    size={40}
                  />
                </TouchableOpacity>
              </View>
              <View style={{margin: 20}}>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Additional information (optional)"
                  style={{
                    backgroundColor: 'rgb(250, 204, 4)',
                    color: 'black',
                    fontSize: Dimensions.get('window').width / 24,
                    fontFamily: 'sans-serif-condensed',
                    textAlignVertical: 'top',
                  }}
                  onChangeText={text => this.changeValue('Additional', text)}
                  value={Additional}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
              {loadingModalVisible && (
                <View style={styles.loading}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="red"
                  />
                </View>
              )}
            </ScrollView>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              paddingBottom: 20,
              width: '100%',
            }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={this.checkOnSubmit.bind(this)}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 20,
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '700',
                  paddingVertical: 10,
                }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={loadingModal}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                flex: 1,
                justifyContent: 'center',
              }}>
              <View style={styles.loading}>
                <ActivityIndicator animating={true} size="large" color="red" />
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={locationModalVisible}
            onRequestClose={() => this.hideModal('locationModalVisible')}>
            <LocationModal
              region={region}
              setRegion={places => this.onMoveMap(places)}
              hideModal={() => this.hideModal('locationModalVisible')}
              setAddress={place => this.changePlaceText(place)}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={discountModalVisible}
            onRequestClose={() => this.hideModal('discountModalVisible')}>
            <DiscountModal
              listData={discountListData}
              carListData={discountCarListData}
              selectedItem={item => this.selectedDiscountItem(item)}
              hideModal={() => this.hideModal('discountModalVisible')}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={vehicleModalVisible}
            onRequestClose={() => this.hideModal('vehicleModalVisible')}>
            <VehicleModal
              carBrandItems={carBrandItems}
              carModelItems={carModelItems}
              listData={vehicleListData}
              selectedItem={item => this.selectedVehicleItem(item)}
              hideModal={() => this.hideModal('vehicleModalVisible')}
            />
          </Modal>
        </View>
      </KeyboardAwareScrollView>
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
  input: {
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    margin: 30,
    backgroundColor: 'rgb(250, 204, 4)',
  },
  buttonMarker: {
    backgroundColor: '#d0cdcd',
  },
  formElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  formLabel: {
    color: 'black',
    textAlign: 'right',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    paddingRight: 20,
    flex: 1,
  },
  error: {
    borderColor: 'red',
    borderWidth: 2,
  },
  parkingButton: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: 'rgb(250, 204, 4)',
  },
  unselected: {
    backgroundColor: 'grey',
  },
  parkingText: {
    textAlign: 'center',
    fontSize: Dimensions.get('window').width / 28,
    fontFamily: 'sans-serif-condensed',
    fontWeight: '700',
  },
  selectOption: {
    fontSize: Dimensions.get('window').width / 20,
    fontFamily: 'sans-serif-condensed',
    fontWeight: '700',
  },
});
