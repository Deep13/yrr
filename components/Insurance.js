import React, {Component, useState} from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default class Insurance extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.Name = React.createRef();
    this.Email = React.createRef();
    this.Address = React.createRef();
    this.carModel = React.createRef();
    this.carBrand = React.createRef();
    this.carPlate = React.createRef();
    this.NRIC = React.createRef();
    this.state = {
      showDate: false,
      Name: '',
      Email: '',
      DOBString: '',
      DOB: new Date(),
      Address: '',
      gender: null,
      NameIsError: false,
      EmailIsError: false,
      DOBStringIsError: false,
      AddressIsError: false,
      genderIsError: false,
      inValidText: '',
      loading: false,
      navigation: props.navigation,
      MobileCode: '',
      carModel: '',
      carBrand: '',
      carPlate: '',
      NRIC: '',
      carModelIsError: false,
      carBrandIsError: false,
      carPlateIsError: false,
      NRICIsError: false,
    };
  }

  componentDidMount() {
    console.log('Second aya');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    this.state.navigation.navigate('Dashboard');
    return true;
  };
  componentWillUnmount() {
    console.log('second gaya');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = [
      'Name',
      'Email',
      'DOBString',
      'gender',
      'Address',
      'carModel',
      'carBrand',
      'carPlate',
      'NRIC',
    ];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (fieldArray[i] != 'DOBString' && fieldArray[i] != 'gender') {
          this[fieldArray[i]].current.focus();
        }
        return;
      } else if (fieldArray[i] === 'Email') {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.Email) === false) {
          this.setState({EmailIsError: true});
          text = 'Email is invalid';
          this.setState({inValidText: text});
          return;
        }
      }
    }

    console.log('Validated with No Error');

    this.setState({loading: true});
    // auth()
    //   .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
    //   .then(data => {
    //     console.log('User account created & signed in!');
    //     console.log(data.user.uid);
    //     firestore()
    //       .collection('Users')
    //       .doc(data.user.uid)
    //       .set({
    //         InsExpDate: 'NA',
    //         RDTaxExpMonth: 'NA',
    //         carBrand: 'NA',
    //         carModel: 'NA',
    //         carPlate: 'NA',
    //         modifiedAt: firestore.FieldValue.serverTimestamp(),
    //         nric: 'NA',
    //         reward: 'NA',
    //         promoKey: 'NA',
    //         userName: this.state.Name,
    //         email: this.state.Email,
    //         dob: this.state.DOB,
    //         mob: this.state.MobileCode + this.state.Mobile,
    //         address: this.state.Address,
    //         gender: this.state.gender,
    //         createdAt: firestore.FieldValue.serverTimestamp(),
    //         userID: data.user.uid,
    //         userStatus: 0,
    //       })
    //       .then(() => {
    //         this.setState({loading: false});
    //         console.log('User added!');
    //         this.state.navigation.navigate('SignUpExtra', {
    //           userId: 'odI6g1FpfaPJek7paNdUanhLNmM2',
    //         });
    //       });
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //       this.setState({inValidText: 'That email address is already in use!'});
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //       this.setState({inValidText: 'That email address is invalid!'});
    //     }
    //     this.setState({loading: false});
    //     // console.error(error);
    //   });
  };
  onChangeDate = (event, selectedDate) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    this.setState({showDate: Platform.OS === 'ios' ? true : false});
    this.setState({DOBStringIsError: false});
    this.setState({inValidText: ''});
    const currentDate = selectedDate || firestore.FieldValue.serverTimestamp();
    this.setState({DOB: currentDate});

    this.setState({
      DOBString:
        monthNames[currentDate.getMonth()] +
        ', ' +
        currentDate.getDate() +
        ' ' +
        currentDate.getFullYear(),
    });
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {
      showDate,
      Name,
      Email,
      DOB,
      Address,
      DOBString,
      gender,
      NameIsError,
      EmailIsError,
      AddressIsError,
      DOBStringIsError,
      genderIsError,
      inValidText,
      loading,
      carModel,
      carBrand,
      carPlate,
      NRIC,
      carModelIsError,
      carBrandIsError,
      carPlateIsError,
      NRICIsError,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
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
              fontSize: Dimensions.get('window').width / 20,
              fontFamily: 'sans-serif-condensed',
              fontWeight: '700',
              paddingTop: 20,
            }}>
            Insurance Quotation
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingBottom: 20,
              paddingTop: 10,
              paddingHorizontal: 40,
            }}>
            Submit your details and we will get the quotation and send to you
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
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Insured Name:</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Enter Name"
                  style={[styles.input, NameIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Name', text)}
                  value={Name}
                  ref={this.Name}
                />
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Email:</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Enter Email"
                  style={[styles.input, EmailIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Email', text)}
                  value={Email}
                  ref={this.Email}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>DOB:</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    flex: 3,
                  }}
                  onPress={() => this.setState({showDate: true})}>
                  <TextInput
                    placeholderTextColor="rgba(1,1,1,0.4)"
                    placeholder="Select date"
                    style={[
                      {
                        backgroundColor: 'white',
                        color: 'black',
                        paddingVertical: 10,
                        fontSize: Dimensions.get('window').width / 24,
                        fontFamily: 'sans-serif-condensed',
                      },
                      DOBStringIsError ? styles.error : null,
                    ]}
                    editable={false}
                    value={DOBString}
                  />
                </TouchableOpacity>
                {showDate && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    mode="date"
                    maximumDate={new Date()}
                    is24Hour={true}
                    display="calendar"
                    onChange={this.onChangeDate}
                    value={DOB}
                  />
                )}
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Gender:</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: 'Male', value: 'Male'},
                      {label: 'Female', value: 'Female'},
                      {label: 'Others', value: 'Others'},
                    ]}
                    defaultNull={gender === null}
                    placeholder="Select your gender"
                    containerStyle={{height: 40}}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: genderIsError ? 2 : 0,
                      borderBottomWidth: genderIsError ? 2 : 0,
                      borderLeftWidth: genderIsError ? 2 : 0,
                      borderRightWidth: genderIsError ? 2 : 0,
                      borderColor: 'red',
                    }}
                    dropDownMaxHeight={240}
                    onChangeItem={item =>
                      this.changeValue('gender', item.value)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Address:</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Enter Address"
                  style={[styles.input, AddressIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Address', text)}
                  value={Address}
                  ref={this.Address}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car Model</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Car Model"
                  style={[styles.input, carModelIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('carModel', text)}
                  value={carModel}
                  ref={this.carModel}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car Brand</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Car Brand"
                  style={[styles.input, carBrandIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('carBrand', text)}
                  value={carBrand}
                  ref={this.carBrand}
                />
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car Plate</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Car Plate"
                  style={[styles.input, carPlateIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('carPlate', text)}
                  value={carPlate}
                  ref={this.carPlate}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>NRIC</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Last 4 digits"
                  style={[styles.input, NRICIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('NRIC', text)}
                  value={NRIC}
                  maxLength={4}
                  keyboardType="numeric"
                  ref={this.NRIC}
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
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  button: {
    margin: 30,
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
  mobile: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  mobileCode: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
    marginRight: 10,
  },
});
