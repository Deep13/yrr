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
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import OrganisationModal from './OrganisationModal';
export default class SocialSignUp extends Component {
  constructor(props) {
    super(props);
    this.Name = React.createRef();
    this.Mobile = React.createRef();
    this.MobileCode = React.createRef();
    const {route} = this.props;
    const userInfo = route.params.userInfo;
    this.state = {
      showDate: false,
      organisationModalVisible: false,
      Name: userInfo.user.displayName,
      Email: userInfo.user.email,
      DOB: null,
      Mobile: '',
      gender: null,
      NameIsError: false,
      isEmail: userInfo.user.email ? true : false,
      DOBIsError: false,
      EmailIsError: false,
      MobileIsError: false,
      genderIsError: false,
      inValidText: '',
      loading: false,
      MobileCodeIsError: false,
      navigation: props.navigation,
      MobileCode: '+65',
    };
  }

  componentDidMount = () => {
    const {route} = this.props;
    const userInfo = route.params.userInfo;
    // console.log(userInfo.user);
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };
  checkOnSubmit = async () => {
    const {route} = this.props;
    const cred = route.params.cred;
    this.setState({inValidText: ''});
    const fieldArray = ['Email', 'DOB', 'gender', 'MobileCode', 'Mobile'];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (
          fieldArray[i] != 'DOB' &&
          fieldArray[i] != 'gender' &&
          fieldArray[i] != 'MobileCode'
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
      }
    }
    this.setState({loading: true});
    // console.log('Validated with No Error');
    const userInfo = route.params.userInfo;
    const type = route.params.type;
    // console.log(userInfo);
    auth()
      .signInWithCredential(cred)
      .then(data => {
        // console.log('data', data);
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
            organisation: 'NA',
            gender: this.state.gender,
            createdAt: firestore.FieldValue.serverTimestamp(),
            userID: data.user.uid,
            userStatus: 0,
          })
          .then(() => {
            // console.log('User added!');
            this.setState({loading: false});
            this.state.navigation.navigate('SignUpExtra');
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
        this.setState({
          inValidText: error,
        });
        // console.log(error);
      });
    // if (type == 'google') {
    //   const googleCredential = auth.GoogleAuthProvider.credential(
    //     userInfo.idToken,
    //   );
    //   this.setState({loading: true});
    //   await auth()
    //     .signInWithCredential(googleCredential)
    //     .then(data => {
    //       //   this.state.navigation.navigate('DashboardStack');
    //       //create User
    //       firestore()
    //         .collection('Users')
    //         .doc(data.user.uid)
    //         .set({
    //           modifiedAt: firestore.FieldValue.serverTimestamp(),
    //           nric: null,
    //           reward: null,
    //           promoKey: null,
    //           userName: this.state.Name,
    //           email: this.state.Email.toLowerCase(),
    //           dob: new Date(this.state.DOB),
    //           mobCode: this.state.MobileCode,
    //           mob: this.state.Mobile,
    //           address: null,
    //           organisation: 'NA',
    //           gender: this.state.gender,
    //           createdAt: firestore.FieldValue.serverTimestamp(),
    //           userID: data.user.uid,
    //           userStatus: 0,
    //         })
    //         .then(() => {
    // console.log('User added!');
    //           this.setState({loading: false});
    //           this.state.navigation.navigate('SignUpExtra');
    //         })
    //         .catch(error => {
    //           this.setState({loading: false});
    //           this.setState({
    //             inValidText: error,
    //           });
    //         });
    //     })
    //     .catch(error => {
    //       this.setState({loading: false});
    //       this.setState({
    //         inValidText: error,
    //       });
    //     });
    // } else {
    //   firestore()
    //     .collection('Users')
    //     .doc(userInfo.user.uid)
    //     .set({
    //       modifiedAt: firestore.FieldValue.serverTimestamp(),
    //       nric: null,
    //       reward: null,
    //       promoKey: null,
    //       userName: this.state.Name,
    //       email: this.state.Email.toLowerCase(),
    //       dob: new Date(this.state.DOB),
    //       mobCode: this.state.MobileCode,
    //       mob: this.state.Mobile,
    //       address: null,
    //       organisation: 'NA',
    //       gender: this.state.gender,
    //       createdAt: firestore.FieldValue.serverTimestamp(),
    //       userID: userInfo.user.uid,
    //       userStatus: 0,
    //     })
    //     .then(() => {
    // console.log('User added!');
    //       this.setState({loading: false});
    //       this.state.navigation.navigate('SignUpExtra');
    //     })
    //     .catch(error => {
    //       this.setState({loading: false});
    //       this.setState({
    //         inValidText: error,
    //       });
    //     });
    // }
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {
      Name,
      Email,
      DOB,
      Mobile,
      gender,
      NameIsError,
      EmailIsError,
      MobileIsError,
      genderIsError,
      inValidText,
      DOBIsError,
      isEmail,
      loading,
      MobileCode,
      MobileCodeIsError,
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
                  style={[
                    styles.inputDisabled,
                    NameIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('Name', text)}
                  value={Name}
                  editable={false}
                />
              </View>

              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Email:</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter email address"
                  style={[
                    isEmail ? styles.inputDisabled : styles.input,
                    EmailIsError ? styles.error : null,
                  ]}
                  value={Email}
                  keyboardType="email-address"
                  editable={isEmail ? false : true}
                  onChangeText={text => this.changeValue('Email', text)}
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
                      borderTopWidth: DOBIsError ? 2 : 0,
                      borderBottomWidth: DOBIsError ? 2 : 0,
                      borderLeftWidth: DOBIsError ? 2 : 0,
                      borderRightWidth: DOBIsError ? 2 : 0,
                      borderColor: 'red',
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
  inputDisabled: {
    backgroundColor: 'rgba(250, 204, 4,0.5)',
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
