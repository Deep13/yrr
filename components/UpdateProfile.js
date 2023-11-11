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
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.NRIC = React.createRef();
    this.Mobile = React.createRef();
    this.Address = React.createRef();
    this.MobileCode = React.createRef();
    this.state = {
      showDate: false,
      name: '',
      email: '',
      nricEdit: false,
      NRIC: '',
      NRICIsError: false,
      organisation: '',
      Mobile: '',
      Address: '',
      MobileIsError: false,
      AddressIsError: false,
      MobileCodeIsError: false,
      MobileCode: '+65',
      inValidText: '',
      loading: false,
      profileComplete: 1,
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const profileData = documentSnapshot.data();

          this.setState({
            name: profileData.userName,
            email: profileData.email,
            MobileCode: profileData.mobCode,
            organisation: profileData.organisation,
            Mobile: profileData.mob,
            Address: profileData.address,
            NRIC: profileData.nric,
            nricEdit: profileData.nric ? false : true,
          });
        }
      });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    this.state.navigation.navigate('Dashboard');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = ['MobileCode', 'Mobile', 'NRIC', 'Address'];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        this[fieldArray[i]].current.focus();
        return;
      } else if (fieldArray[i] === 'NRIC') {
        const reg = /^\d{3}[a-zA-Z]$/;
        if (reg.test(this.state.NRIC) === false) {
          this.setState({NRICIsError: true});
          text = 'NRIC last 4 digit ex:123A';
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
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .update({
        mobCode: this.state.MobileCode,
        mob: this.state.Mobile,
        address: this.state.Address,
        modifiedAt: firestore.Timestamp.now(),
        nric: this.state.NRIC.toUpperCase(),
      })
      .then(
        () => {
          this.setState({loading: false});
          console.log('User updated!');
          this.setState({inValidText: 'Profile updated successfully'});
        },
        error => {
          this.setState({loading: false});
          this.setState({inValidText: 'Check your network connection'});
        },
      );
  };

  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
    if (field == 'MobileCode') {
      this.setState({Mobile: null});
    }
  };
  render() {
    const {
      name,
      email,
      organisation,
      NRIC,
      nricEdit,
      NRICIsError,
      Mobile,
      Address,
      MobileIsError,
      AddressIsError,
      MobileCode,
      MobileCodeIsError,
      inValidText,
      loading,
      profileComplete,
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
          <View style={{flex: 4, width: '100%'}}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Name"
                  style={styles.nric}
                  value={name}
                  editable={false}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Email"
                  style={styles.nric}
                  value={email}
                  editable={false}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Ref code</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Code"
                  style={styles.nric}
                  value={organisation}
                  editable={false}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>NRIC</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Last 4 digits ex:123A"
                  style={[
                    nricEdit ? styles.input : styles.nric,
                    NRICIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('NRIC', text)}
                  value={NRIC}
                  maxLength={4}
                  ref={this.NRIC}
                  editable={nricEdit}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Mobile:</Text>
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
                    maxLength={MobileCode == '65' ? 8 : 10}
                  />
                </View>
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
                    ,
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
                UPDATE
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
  nric: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  mobile: {
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 2,
    marginLeft: 10,
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
