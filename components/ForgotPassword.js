import React, {Component} from 'react';
import {
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
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.state = {
      email: '',
      emailIsError: false,
      inValidText: '',
      loading: false,
      navigation: props.navigation,
    };
  }

  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = ['email'];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'Empty Field';
        this.setState({inValidText: text});
        if (fieldArray[i] != 'DOBString' && fieldArray[i] != 'gender') {
          this[fieldArray[i]].current.focus();
        }
        return;
      }
    }

    console.log('Validated with No Error');
    this.setState({loading: true});
    auth()
      .sendPasswordResetEmail(this.state.email)
      .then(response => {
        this.setState({loading: false});
        console.log(response);
        console.log('Mail sent');
        this.setState({inValidText: 'Reset password mail sent'});
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
        if (error.code === 'auth/user-not-found') {
          this.setState({inValidText: 'Incorrect Email Id'});
        } else {
          this.setState({inValidText: 'Check your network connection'});
        }
      });
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {email, emailIsError, inValidText, loading} = this.state;
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
              color: 'white',
              textAlign: 'center',
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingVertical: 20,
            }}>
            Please enter your email address
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
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Email"
                  style={[styles.input, emailIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('email', text)}
                  value={email}
                  ref={this.email}
                  keyboardType="email-address"
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
                Submit
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 30,
                width: '100%',
              }}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 25,
                  fontFamily: 'sans-serif-condensed',
                }}>
                For general enquiries, email us at
              </Text>
              <Text
                style={{
                  color: 'rgb(250, 204, 4)',
                  fontSize: Dimensions.get('window').width / 25,
                  fontFamily: 'sans-serif-condensed',
                  paddingBottom: 20,
                  textAlign: 'center',
                }}
                onPress={() =>
                  Linking.openURL('mailto:info@yellowroadrangers.com')
                }>
                info@yellowroadrangers.com
              </Text>
            </View>
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
  mobileCode: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
    marginRight: 10,
  },
});
