import React, {Component, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Dialog, {
  ScaleAnimation,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
export default class UpdateVehicle extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.Address = React.createRef();
    this.nric = React.createRef();
    this.occupation = React.createRef();
    this.currInsurance = React.createRef();
    this.state = {
      showDate: false,
      Address: null,
      nric: null,
      mStatus: null,
      occupation: null,
      carPlateItems: [],
      carPlate: null,
      carPlateIsError: false,
      occupationIsError: false,
      mStatusIsError: false,
      nricIsError: false,
      inValidText: '',
      loading: false,
      AddressIsError: false,
      currInsurance: null,
      currInsuranceIsError: false,
      ncd: null,
      ncdIsError: false,
      claim: null,
      claimIsError: false,
      navigation: props.navigation,
      extra: '',
      noCarsErrorVisible: false,
      nricExixts: false,
      licenseDate: null,
      licenseDateIsError: false,
    };
  }

  componentDidMount() {
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          let data = documentSnapshot.data();
          this.setState({
            name: data.userName,
            id: data.userID,
            dob: data.dob,
            email: data.email,
            gender: data.gender,
            mob: data.mob,
            mobCode: data.mobCode,
            Address: data.address,
            nric: data.nric,
            nricExixts: data.nric ? true : false,
          });

          // console.log('User data: ', documentSnapshot.data());
        }
      });
    firestore()
      .collection('carPlates')
      .where('userID', '==', currentUser.uid)
      .onSnapshot(
        querySnapshot => {
          var aData = [];
          console.log(querySnapshot.size);
          if (querySnapshot.size > 0) {
            querySnapshot.forEach(documentSnapshot => {
              var data = documentSnapshot.data();
              if (data.status > 0)
                aData.push({
                  label: data.carPlate,
                  value: data.carPlate,
                });
            });
            if (aData.length > 0) {
              this.setState({carPlateItems: aData});
            } else {
              this.setState({noCarsErrorVisible: true});
            }
          } else {
            this.setState({noCarsErrorVisible: true});
          }
        },
        error => {
          console.log(error);
        },
      );
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

  onSelectCancel = () => {
    this.setState({noCarsErrorVisible: false});
    this.state.navigation.navigate('Dashboard');
  };
  onSelectAdd = () => {
    this.setState({noCarsErrorVisible: false});
    this.state.navigation.navigate('Vehicle');
  };

  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = [
      'Address',
      'nric',
      'carPlate',
      'licenseDate',
      'mStatus',
      'ncd',
      'claim',
      'occupation',
      'currInsurance',
    ];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (
          fieldArray[i] != 'carPlate' &&
          fieldArray[i] != 'mStatus' &&
          fieldArray[i] != 'ncd' &&
          fieldArray[i] != 'claim' &&
          fieldArray[i] != 'licenseDate'
        ) {
          this[fieldArray[i]].current.focus();
        }
        return;
      } else if (fieldArray[i] === 'nric') {
        const reg = /^\d{3}[a-zA-Z]$/;
        if (reg.test(this.state.nric) === false) {
          this.setState({nricIsError: true});
          text = 'NRIC last 4 digit ex:123A';
          this.setState({inValidText: text});
          return;
        }
      }
    }

    console.log('Validated with No Error');
    this.setState({loading: true});
    const {
      mStatus,
      occupation,
      carPlate,
      currInsurance,
      ncd,
      claim,
      licenseDate,
      name,
      id,
      dob,
      email,
      gender,
      mob,
      mobCode,
      Address,
      nric,
    } = this.state;
    firestore()
      .collection('UserInsurance')
      .doc()
      .set({
        mStatus: mStatus,
        occupation: occupation,
        carPlate: carPlate,
        currInsurance: currInsurance,
        ncd: ncd,
        claim: claim,
        licenseDate: new Date(licenseDate),
        name: name,
        id: id,
        dob: dob,
        email: email,
        gender: gender,
        mob: mob,
        mobCode: mobCode,
        Address: Address,
        nric: nric,
        status: 0,
      })
      .then(
        () => {
          this.setState({loading: false});
          this.setState({inValidText: 'Insurance request sent'});
          console.log('Insurance added');
        },
        error => {
          this.setState({loading: false});
          this.setState({inValidText: 'Check your network connection'});
          console.log(error);
        },
      );
    // this.setState({loading: true});
  };
  changeValue = (field, value) => {
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
    this.setState({[field]: value});
  };
  render() {
    const {
      Address,
      nric,
      carPlate,
      mStatus,
      mStatusIsError,
      carPlateItems,
      carPlateIsError,
      inValidText,
      loading,
      AddressIsError,
      extra,
      nricIsError,
      occupationIsError,
      noCarsErrorVisible,
      navigation,
      occupation,
      currInsurance,
      currInsuranceIsError,
      ncdIsError,
      ncd,
      claimIsError,
      claim,
      nricExixts,
      licenseDate,
      licenseDateIsError,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <Dialog
          width={Dimensions.get('window').width - 30}
          visible={noCarsErrorVisible}
          dialogAnimation={
            new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })
          }
          onHardwareBackPress={() => {
            this.onSelectOption('Dashboard');
            return true;
          }}
          dialogTitle={<DialogTitle title="No Cars Added" />}
          footer={
            <DialogFooter>
              <DialogButton text="Back" onPress={this.onSelectCancel} />
              <DialogButton text="Update Vehicle" onPress={this.onSelectAdd} />
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
              To request for Car Insurance quote, you need to update your
              vehicle information.
            </Text>
          </DialogContent>
        </Dialog>
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
              paddingTop: 10,
              paddingBottom: 20,
              paddingHorizontal: 10,
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
          <View style={{flex: 3, width: '90%'}}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={[styles.formElement, {alignItems: 'flex-start'}]}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Enter Address"
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
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>NRIC</Text>
                <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Last 4 digits NRIC ex:123A"
                  style={[
                    nricExixts ? styles.disable : styles.input,
                    nricIsError ? styles.error : null,
                  ]}
                  value={nric}
                  onChangeText={text => this.changeValue('nric', text)}
                  ref={this.nric}
                  maxLength={4}
                  editable={nricExixts ? false : true}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Vehicle no.</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={carPlateItems}
                    defaultValue={carPlate}
                    placeholder="Select Vehicle no."
                    containerStyle={{height: 40}}
                    zIndex={5000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: carPlateIsError ? 2 : 0,
                      borderBottomWidth: carPlateIsError ? 2 : 0,
                      borderLeftWidth: carPlateIsError ? 2 : 0,
                      borderRightWidth: carPlateIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('carPlate', item.value)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Driving license</Text>
                <DatePicker
                  style={{
                    flex: 3,
                    textAlign: 'left',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  date={licenseDate}
                  mode="date"
                  placeholder="Select passing date"
                  format="DD MMMM YYYY"
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  androidMode="spinner"
                  customStyles={{
                    placeholderText: {
                      color: 'black',
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    },
                    dateInput: {
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                      backgroundColor: 'white',
                      borderWidth: 0,
                      borderTopWidth: licenseDateIsError ? 2 : 0,
                      borderBottomWidth: licenseDateIsError ? 2 : 0,
                      borderLeftWidth: licenseDateIsError ? 2 : 0,
                      borderRightWidth: licenseDateIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    },
                    dateText: {
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={date => {
                    this.changeValue('licenseDate', date);
                  }}
                />
                {/* <TextInput
                  placeholderTextColor="rgba(1,1,1,0.4)"
                  placeholder="Select Expiration Date"
                  style={styles.input}
                  value={extra}
                /> */}
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Maritial status</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: 'Single', value: 'Single'},
                      {label: 'Married', value: 'Married'},
                    ]}
                    defaultValue={mStatus}
                    placeholder="Select maritial status"
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
                      borderTopWidth: mStatusIsError ? 2 : 0,
                      borderBottomWidth: mStatusIsError ? 2 : 0,
                      borderLeftWidth: mStatusIsError ? 2 : 0,
                      borderRightWidth: mStatusIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('mStatus', item.value)
                    }
                  />
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>
                  NCD entitlement upon renewal
                </Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: '0%', value: '0%'},
                      {label: '10%', value: '10%'},
                      {label: '20%', value: '20%'},
                      {label: '30%', value: '30%'},
                      {label: '40%', value: '40%'},
                      {label: '50%', value: '50%'},
                    ]}
                    defaultValue={ncd}
                    placeholder="Select value"
                    containerStyle={{height: 40}}
                    zIndex={3000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: ncdIsError ? 2 : 0,
                      borderBottomWidth: ncdIsError ? 2 : 0,
                      borderLeftWidth: ncdIsError ? 2 : 0,
                      borderRightWidth: ncdIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={100}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item => this.changeValue('ncd', item.value)}
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Any claims past 3 years</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: 'Yes', value: 'Yes'},
                      {label: 'No', value: 'No'},
                    ]}
                    defaultValue={claim}
                    placeholder="Choose an option"
                    containerStyle={{height: 40}}
                    zIndex={2000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: claimIsError ? 2 : 0,
                      borderBottomWidth: claimIsError ? 2 : 0,
                      borderLeftWidth: claimIsError ? 2 : 0,
                      borderRightWidth: claimIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item => this.changeValue('claim', item.value)}
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Occupation</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter occupation"
                  style={[
                    styles.input,
                    occupationIsError ? styles.error : null,
                  ]}
                  value={occupation}
                  onChangeText={text => this.changeValue('occupation', text)}
                  ref={this.occupation}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Current insurance</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter current insurance"
                  style={[
                    styles.input,
                    currInsuranceIsError ? styles.error : null,
                  ]}
                  value={currInsurance}
                  onChangeText={text => this.changeValue('currInsurance', text)}
                  ref={this.currInsurance}
                />
              </View>
              <View
                style={{
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
              </View>
            </ScrollView>
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
    backgroundColor: 'rgb(250, 204, 4)',
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
  disable: {
    backgroundColor: 'rgba(0,0,0,0.1)',
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
