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
export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.Subject = React.createRef();
    this.Content = React.createRef();
    this.name = React.createRef();
    this.email = React.createRef();
    this.state = {
      name: '',
      email: '',
      Subject: '',
      Content: '',
      SubjectlIsError: false,
      nameIsError: false,
      emailIsError: false,
      ContentIsError: false,
      currentUser: null,
      inValidText: '',
      loading: false,
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    const {currentUser} = auth();
    console.log(currentUser);
    if (currentUser) {
      this.setState({currentUser: currentUser});
      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            const profileData = documentSnapshot.data();
            this.setState({
              name: profileData.userName,
              email: profileData.email,
            });
          }
        });
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    if (this.state.currentUser) {
      this.state.navigation.navigate('Dashboard');
    } else {
      this.state.navigation.navigate('Home');
    }
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = ['name', 'email', 'Subject', 'Content'];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]].trim()) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        this[fieldArray[i]].current.focus();
        return;
      } else if (fieldArray[i] === 'email') {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.email) === false) {
          this.setState({emailIsError: true});
          text = 'Email is invalid';
          this.setState({inValidText: text});
          return;
        }
      }
    }

    console.log('No Error');
    // console.log(this.props.userId);

    this.setState({loading: true});
    const {name, email, Subject, Content} = this.state;
    firestore()
      .collection('enquiry')
      .doc()
      .set({
        timestamp: firestore.Timestamp.now(),
        name: name,
        email: email,
        subject: Subject,
        content: Content,
        status: 0,
      })
      .then(
        () => {
          this.setState({loading: false});
          this.setState({inValidText: 'Enquiry sent'});
        },
        error => {
          this.setState({loading: false});
          this.setState({inValidText: 'Check your network connection'});
          console.log(error);
        },
      );
  };

  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {
      name,
      email,
      Subject,
      Content,
      nameIsError,
      emailIsError,
      currentUser,
      SubjectIsError,
      ContentIsError,
      inValidText,
      loading,
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
          <View style={{width: '100%', padding: 20}}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
              }}>
              Please fill up the enquiry form.
            </Text>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
              }}>
              Our team will get back to you shortly
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
          <View style={{flex: 4, width: '100%'}}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Name"
                  style={[
                    currentUser ? styles.nric : styles.input,
                    nameIsError ? styles.error : null,
                  ]}
                  value={name}
                  onChangeText={text => this.changeValue('name', text)}
                  editable={currentUser ? false : true}
                  ref={this.name}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Email"
                  style={[
                    currentUser ? styles.nric : styles.input,
                    emailIsError ? styles.error : null,
                  ]}
                  value={email}
                  onChangeText={text => this.changeValue('email', text)}
                  editable={currentUser ? false : true}
                  ref={this.email}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Subject</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Subject"
                  style={[styles.input, SubjectIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Subject', text)}
                  value={Subject}
                  ref={this.Subject}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                }}>
                <Text style={styles.formLabel}>Content</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Content"
                  style={[
                    {
                      backgroundColor: 'rgb(250, 204, 4)',
                      color: 'black',
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                      flex: 3,
                      textAlignVertical: 'top',
                    },
                    ContentIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('Content', text)}
                  value={Content}
                  ref={this.Content}
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
                  paddingVertical: 10,
                }}>
                SEND ENQUIRY
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 30,
              width: '100%',
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
              }}>
              For general enquiries, email us at
            </Text>
            <Text
              style={{
                color: 'rgb(250, 204, 4)',
                fontSize: Dimensions.get('window').width / 30,
                fontFamily: 'sans-serif-condensed',
                paddingBottom: 20,
              }}
              onPress={() =>
                Linking.openURL('mailto:info@yellowroadrangers.com')
              }>
              info@yellowroadrangers.com
            </Text>
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  mobileCode: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
    marginRight: 10,
  },
});
