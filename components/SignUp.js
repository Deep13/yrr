import React, {Component, useState} from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import OrganisationModal from './OrganisationModal';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.Name = React.createRef();
    this.Email = React.createRef();
    this.Mobile = React.createRef();
    this.Password = React.createRef();
    this.confirmPassword = React.createRef();
    this.MobileCode = React.createRef();
    this.state = {
      showDate: false,
      organisationModalVisible: false,
      Name: '',
      Email: '',
      DOBString: '',
      DOB: null,
      Mobile: '',
      Password: '',
      confirmPassword: '',
      gender: null,
      NameIsError: false,
      organisation: null,
      organisationList: [],
      organisationIsError: false,
      EmailIsError: false,
      DOBStringIsError: false,
      MobileIsError: false,
      PasswordIsError: false,
      confirmPasswordIsError: false,
      genderIsError: false,
      inValidText: '',
      loading: false,
      MobileCodeIsError: false,
      navigation: props.navigation,
      MobileCode: '+65',
    };
  }

  componentDidMount = () => {
    firestore()
      .collection('Organization')
      .get()
      .then(
        querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.id;
            aData.push({org: data});
          });
          this.setState({
            organisationList: aData,
          });
        },
        error => {
          console.log(error);
        },
      );
  };
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = [
      'Name',
      'Email',
      'DOB',
      'gender',
      'MobileCode',
      'Mobile',
      'Password',
      'confirmPassword',
    ];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (
          fieldArray[i] != 'DOB' &&
          fieldArray[i] != 'gender' &&
          fieldArray[i] != 'MobileCode' &&
          fieldArray[i] != 'organisation'
        ) {
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
      } else if (fieldArray[i] === 'Mobile') {
        var reg = /^\(?([0-9]{9,10})$/;
        if (this.state.MobileCode == '+65') {
          reg = /^\(?([0-9]{8,10})$/;
        }
        if (reg.test(this.state.Mobile) === false) {
          this.setState({MobileIsError: true});
          text = 'Mobile Number is invalid';
          this.setState({inValidText: text});
          return;
        }
      } else if (fieldArray[i] === 'Password') {
        if (this.state.Password.length < 6) {
          this.setState({PasswordIsError: true});
          text = 'Password should be atleast 6 characters';
          this.setState({inValidText: text});
          return;
        }
      } else if (fieldArray[i] === 'confirmPassword') {
        if (this.state.confirmPassword !== this.state.Password) {
          this.setState({confirmPasswordIsError: true});
          text = 'Passwords did not match';
          this.setState({inValidText: text});
          return;
        }
      }
    }
    this.setState({loading: true});
    console.log('Validated with No Error');
    auth()
      .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
      .then(data => {
        console.log('User account created & signed in!');
        console.log(data.user.uid);
        //create User
        firestore()
          .collection('Users')
          .doc(data.user.uid)
          .set({
            modifiedAt: firestore.FieldValue.serverTimestamp(),
            nric: null,
            reward: null,
            promoKey: null,
            userName: this.state.Name,
            email: this.state.Email.toLowerCase(),
            dob: new Date(this.state.DOB),
            mobCode: this.state.MobileCode,
            mob: this.state.Mobile,
            address: null,
            organisation: this.state.organisation
              ? this.state.organisation
              : 'NA',
            gender: this.state.gender,
            createdAt: firestore.FieldValue.serverTimestamp(),
            userID: data.user.uid,
            userStatus: 0,
          })
          .then(() => {
            console.log('User added!');
            //create CarPlate
            // firestore()
            //   .collection('carPlates')
            //   .doc(carPlate)
            //   .set({
            //     userID: data.user.uid,
            //     carPlate: carPlate,
            //     createdAt: firestore.FieldValue.serverTimestamp(),
            //     status: 0,
            //   })
            //   .then(() => {
            //     console.log('Car Plate added!');
            this.setState({loading: false});
            this.state.navigation.navigate('SignUpExtra');
            //   })
            //   .catch(error => {
            //     this.setState({loading: false});
            //     this.setState({
            //       inValidText: error,
            //     });
            //   });
          })
          .catch(error => {
            this.setState({loading: false});
            this.setState({
              inValidText: error,
            });
          });
      })
      .catch(error => {
        this.setState({loading: false});
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          this.setState({
            inValidText: 'That email address is already in use!',
          });
        } else if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          this.setState({
            inValidText: 'That email address is invalid!',
          });
        } else {
          this.setState({inValidText: error});
        }
        this.setState({loading: false});
        // console.error(error);
      });
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.setState({loading: false});
    //     this.setState({inValidText: error});
    //   },
    // )
    // .catch(error => {
    //   console.log(error);
    // });
  };
  openOrganisation = () => {
    // var aData = [];
    // this.setState({loading: true});
    // firestore()
    //   .collection('Organization')
    //   .get()
    //   .then(
    //     querySnapshot => {
    //       var aData = [];
    //       querySnapshot.forEach(documentSnapshot => {
    //         var data = documentSnapshot.id;
    //         aData.push({org: data});
    //       });
    this.setState({
      organisationIsError: false,
      organisationModalVisible: true,
    });
    //   },
    //   error => {
    //     console.log(error);
    //   },
    // );
  };
  onOrgSelected = org => {
    this.setState({
      organisation: org,
      organisationModalVisible: false,
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
      Mobile,
      organisationModalVisible,
      organisationList,
      Password,
      confirmPassword,
      DOBString,
      gender,
      NameIsError,
      EmailIsError,
      MobileIsError,
      PasswordIsError,
      confirmPasswordIsError,
      DOBStringIsError,
      genderIsError,
      inValidText,
      loading,
      MobileCode,
      MobileCodeIsError,
      organisation,
      organisationIsError,
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
          <View style={{paddingVertical: 20}}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
                fontWeight: '700',
              }}>
              Welcome!
            </Text>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
              }}>
              It takes only a few minutes to sign up!
            </Text>
          </View>
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
                <Text style={styles.formLabel}>Name:</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter full name"
                  style={[styles.input, NameIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Name', text)}
                  value={Name}
                  ref={this.Name}
                />
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Email:</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter email address"
                  style={[styles.input, EmailIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Email', text)}
                  value={Email}
                  ref={this.Email}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>DOB:</Text>
                <DatePicker
                  style={{flex: 3}}
                  date={DOB}
                  mode="date"
                  placeholder="Select DOB"
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
                      backgroundColor: 'rgb(250, 204, 4)',
                      borderWidth: 0,
                    },
                    dateText: {
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={date => {
                    this.changeValue('DOB', date);
                  }}
                />
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
                    ]}
                    defaultValue={gender}
                    placeholder="Select your gender"
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
                      borderTopWidth: genderIsError ? 2 : 0,
                      borderBottomWidth: genderIsError ? 2 : 0,
                      borderLeftWidth: genderIsError ? 2 : 0,
                      borderRightWidth: genderIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    onChangeItem={item =>
                      this.changeValue('gender', item.value)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Mobile No:</Text>
                <View style={{flex: 3, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <DropDownPicker
                      items={[
                        {label: '+65', value: '+65'},
                        {label: '+60', value: '+60'},
                      ]}
                      defaultValue={MobileCode}
                      placeholder="Code"
                      containerStyle={{
                        height: Dimensions.get('window').width / 24 + 30,
                      }}
                      labelStyle={{
                        fontSize: Dimensions.get('window').width / 24,
                        fontFamily: 'sans-serif-condensed',
                      }}
                      style={{
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopWidth: MobileCodeIsError ? 2 : 0,
                        borderBottomWidth: MobileCodeIsError ? 2 : 0,
                        borderLeftWidth: MobileCodeIsError ? 2 : 0,
                        borderRightWidth: MobileCodeIsError ? 2 : 0,
                        borderColor: 'red',
                        backgroundColor: 'rgb(250, 204, 4)',
                      }}
                      dropDownMaxHeight={240}
                      onChangeItem={item =>
                        this.changeValue('MobileCode', item.value)
                      }
                    />
                  </View>
                  <TextInput
                    placeholderTextColor="black"
                    placeholder="Enter mobile no."
                    style={[styles.mobile, MobileIsError ? styles.error : null]}
                    onChangeText={text => this.changeValue('Mobile', text)}
                    value={Mobile}
                    keyboardType="numeric"
                    ref={this.Mobile}
                    maxLength={MobileCode == '+65' ? 8 : 10}
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Ref Code:</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    organisationIsError ? styles.error : null,
                  ]}
                  onPress={this.openOrganisation}>
                  <Text
                    style={{
                      padding: 10,
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {organisation ? organisation : 'Select your code'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Password:</Text>
                <TextInput
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  placeholder="At least 6 characters"
                  style={[styles.input, PasswordIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Password', text)}
                  value={Password}
                  ref={this.Password}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Confirm Password:</Text>
                <TextInput
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  placeholder="Re-type password"
                  style={[
                    styles.input,
                    confirmPasswordIsError ? styles.error : null,
                  ]}
                  onChangeText={text =>
                    this.changeValue('confirmPassword', text)
                  }
                  value={confirmPassword}
                  ref={this.confirmPassword}
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
              paddingHorizontal: 40,
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
                  paddingVertical: 10,
                }}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={organisationModalVisible}
          onRequestClose={() =>
            this.setState({organisationModalVisible: false})
          }>
          <OrganisationModal
            listData={organisationList}
            onSelectOrganisation={org => this.onOrgSelected(org)}
          />
        </Modal>
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
    marginBottom: 10,
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
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 2,
    marginLeft: 5,
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
