import React, {Component, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import DateModal from './DateModal';
import auth from '@react-native-firebase/auth';
export default class SignUpExtra extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.carModel = React.createRef();
    this.carPlate = React.createRef();
    this.carBrand = React.createRef();
    this.NRIC = React.createRef();
    this.Address = React.createRef();
    const {route} = this.props;
    this.state = {
      dateModalVisible: false,
      modalType: '',
      showDate: false,
      carModel: null,
      carModelItems: [],
      carBrandItems: [],
      carBrand: null,
      carPlate: null,
      insEXPDateString: null,
      insEXPDate: new Date(),
      NRIC: '',
      roadTaxEXPMonth: null,
      Address: '',
      AddressIsError: false,
      carModelIsError: false,
      carPlateIsError: false,
      carBrandIsError: false,
      insEXPDateStringIsError: false,
      NRICIsError: false,
      roadTaxEXPMonthIsError: false,
      inValidText: '',
      loading: false,
      navigation: props.navigation,
    };
  }

  showDateModal = type => {
    this.setState({dateModalVisible: true, modalType: type});
  };
  monthSelected = value => {
    this.setState({dateModalVisible: false, [this.state.modalType]: value});
  };
  componentDidMount = () => {
    firestore()
      .collection('carBrands')
      .get()
      .then(
        querySnapshot => {
          var aModels = [];
          var aBrands = [];
          querySnapshot.forEach(documentSnapshot => {
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
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    this.state.navigation.navigate('DashboardStack');
    return true;
  };
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = ['carPlate', 'NRIC', 'carBrand', 'carModel', 'Address'];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (
          fieldArray[i] != 'roadTaxEXPMonth' &&
          fieldArray[i] != 'carBrand' &&
          fieldArray[i] != 'carModel' &&
          fieldArray[i] != 'insEXPDateString'
        ) {
          this[fieldArray[i]].current.focus();
        }
        return;
      } else if (fieldArray[i] === 'NRIC') {
        const reg = /^\d{3}[a-zA-Z]$/;
        if (reg.test(this.state.NRIC) === false) {
          this.setState({NRICIsError: true});
          text = 'NRIC last 4 digit ex:123A';
          this.setState({inValidText: text});
          return;
        }
      }
    }
    this.setState({loading: true});
    console.log('No Error');
    const {currentUser} = auth();
    // console.log(currentUser.uid);
    // console.log(
    //   this.state.carBrand,
    //   this.state.carModel,
    //   this.state.roadTaxEXPMonth,
    //   this.state.insEXPDateString,
    // );
    const {
      carModel,
      carPlate,
      carBrand,
      insEXPDateString,
      roadTaxEXPMonth,
    } = this.state;
    var currCarPlate = carPlate.toUpperCase();
    firestore()
      .collection('carPlates')
      .doc(carPlate)
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          this.setState({loading: false});
          this.setState({carPlateIsError: true});
          this.carPlate.current.focus();
          this.setState({inValidText: 'Car plate is alreay in use'});
        } else {
          const {currentUser} = auth();
          firestore()
            .collection('carPlates')
            .doc(currCarPlate)
            .set({
              carModel: carModel,
              carBrand: carBrand,
              InsExpMonth: insEXPDateString,
              carPlate: currCarPlate,
              status: insEXPDateString && roadTaxEXPMonth ? 1 : 0,
              RDTaxExpMonth: roadTaxEXPMonth,
              createdAt: firestore.FieldValue.serverTimestamp(),
              userID: currentUser.uid,
              users: [currentUser.uid],
              role: 'BASIC',
            })
            .then(() => {
              firestore()
                .collection('Users')
                .doc(currentUser.uid)
                .update({
                  nric: this.state.NRIC,
                  address: this.state.Address,
                  userStatus: 1,
                })
                .then(() => {
                  this.setState({loading: false});
                  console.log('User updated!');
                  this.state.navigation.navigate('DashboardStack');
                })
                .catch(error => {
                  this.setState({loading: false});
                  this.setState({inValidText: error});
                });
              // this.setState({inValidText: 'Vehicle added', loading: false});
              // console.log('User updated!');
              // this.state.navigation.navigate('DashboardStack');
            })
            .catch(() => {
              this.setState({
                inValidText: 'Vehicle not added',
                loading: false,
              });
            });
        }
      });
  };
  onSkip = () => {
    this.state.navigation.navigate('DashboardStack');
  };

  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
    if (field === 'carBrand') {
      this.setState({carModel: null});
    }
  };
  render() {
    const {
      showDate,
      carModel,
      carBrand,
      carPlateIsError,
      carPlate,
      insEXPDateString,
      dateModalVisible,
      NRIC,
      roadTaxEXPMonth,
      carModelIsError,
      carBrandIsError,
      insEXPDateStringIsError,
      NRICIsError,
      roadTaxEXPMonthIsError,
      Address,
      carBrandItems,
      AddressIsError,
      inValidText,
      carModelItems,
      loading,
      navigation,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator animating={true} size="large" color="red" />
            </View>
          ) : null}
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingVertical: 20,
            }}>
            Please fill additional details!!
          </Text>
          <Text
            style={{
              color: 'red',
              paddingBottom: 10,
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              display: inValidText ? 'flex' : 'none',
            }}>
            {inValidText}
          </Text>
          <View style={{flex: 3, width: '100%'}}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Vehicle no.</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Vehicle no."
                  style={[styles.input, carPlateIsError ? styles.error : null]}
                  value={carPlate}
                  onChangeText={text => this.changeValue('carPlate', text)}
                  ref={this.carPlate}
                />
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>NRIC</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Last 4 digits e.g. 123A"
                  style={[styles.input, NRICIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('NRIC', text)}
                  value={NRIC}
                  maxLength={4}
                  ref={this.NRIC}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car make</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={carBrandItems}
                    defaultValue={carBrand}
                    placeholder="Select car make"
                    containerStyle={{height: 40}}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: carBrandIsError ? 2 : 0,
                      borderBottomWidth: carBrandIsError ? 2 : 0,
                      borderLeftWidth: carBrandIsError ? 2 : 0,
                      borderRightWidth: carBrandIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    zIndex={5000}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('carBrand', item.label)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car model</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={carBrand ? carModelItems[carBrand] : []}
                    defaultValue={carModel}
                    placeholder="Select car model"
                    containerStyle={{height: 40}}
                    zIndex={4000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: carModelIsError ? 2 : 0,
                      borderBottomWidth: carModelIsError ? 2 : 0,
                      borderLeftWidth: carModelIsError ? 2 : 0,
                      borderRightWidth: carModelIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('carModel', item.label)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Road tax expiry month</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    roadTaxEXPMonthIsError ? styles.error : null,
                  ]}
                  onPress={() => this.showDateModal('roadTaxEXPMonth')}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {roadTaxEXPMonth ? roadTaxEXPMonth : 'Select month'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Insurance expiry month</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    insEXPDateStringIsError ? styles.error : null,
                  ]}
                  onPress={() => this.showDateModal('insEXPDateString')}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {insEXPDateString ? insEXPDateString : 'Select month'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                }}>
                <Text style={styles.formLabel}>Address:</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter address"
                  style={[
                    {
                      backgroundColor: 'rgb(250, 204, 4)',
                      color: 'black',
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                      flex: 3,
                      textAlignVertical: 'top',
                    },
                    AddressIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('Address', text)}
                  value={Address}
                  ref={this.Address}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 20,
              width: '100%',
            }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
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
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.3} onPress={this.onSkip}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 20,
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '700',
                  paddingVertical: 10,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
              }}>
              By proceeding, you agree to Yellow Road Rangers
            </Text>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <Text
                style={{
                  color: 'rgb(250, 204, 4)',
                  fontSize: Dimensions.get('window').width / 30,
                  fontFamily: 'sans-serif-condensed',
                }}
                onPress={() => Linking.openURL('https://www.google.com')}>
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
                onPress={() => Linking.openURL('https://www.google.com')}>
                Privacy Policy
              </Text>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={dateModalVisible}
            onRequestClose={() => this.setState({dateModalVisible: false})}>
            <DateModal onSelectDate={month => this.monthSelected(month)} />
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
    flex: 3,
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: 'rgb(250, 204, 4)',
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
});
