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
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.OldPassword = React.createRef();
    this.Password = React.createRef();
    this.confirmPassword = React.createRef();
    this.state = {
      OldPassword: '',
      Password: '',
      confirmPassword: '',
      PasswordIsError: false,
      OldPasswordIsError: false,
      confirmPasswordIsError: false,
      inValidText: '',
      loading: false,
      navigation: props.navigation,
    };
  }

  componentDidMount() {
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
    const fieldArray = ['OldPassword', 'Password', 'confirmPassword'];
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
      } else if (fieldArray[i] === 'OldPassword') {
        if (this.state.OldPassword.length < 6) {
          this.setState({OldPasswordIsError: true});
          text = 'Password should be atleast 6 characters';
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

    console.log('Validated with No Error');

    this.setState({loading: true});
    this.reauthenticate(this.state.OldPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updatePassword(this.state.Password)
          .then(() => {
            this.setState({loading: false});
            this.setState({
              inValidText: 'Password has been updated successfully',
              OldPassword: '',
              Password: '',
              confirmPassword: '',
            });
            console.log('Password updated!');
          })
          .catch(error => {
            this.setState({loading: false});
            this.setState({inValidText: 'Check your network connection'});
            console.log('undar' + error);
          });
      })
      .catch(error => {
        this.setState({loading: false});
        if (error.code === 'auth/wrong-password') {
          this.setState({inValidText: 'Incorrect Password'});
          this.OldPassword.current.focus();
          this.setState({OldPasswordIsError: true});
        } else {
          this.setState({loading: false});
          this.setState({inValidText: 'Check your network connection'});
        }
      });
  };
  reauthenticate = currentPassword => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
  };
  render() {
    const {
      OldPassword,
      Password,
      confirmPassword,
      PasswordIsError,
      OldPasswordIsError,
      confirmPasswordIsError,
      inValidText,
      loading,
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
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingVertical: 10,
            }}
          />
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
                <Text style={styles.formLabel}>Old password</Text>
                <TextInput
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  placeholder="Atleast 6 characters"
                  style={[
                    styles.input,
                    OldPasswordIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('OldPassword', text)}
                  value={OldPassword}
                  ref={this.OldPassword}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>New password</Text>
                <TextInput
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  placeholder="Atleast 6 characters"
                  style={[styles.input, PasswordIsError ? styles.error : null]}
                  onChangeText={text => this.changeValue('Password', text)}
                  value={Password}
                  ref={this.Password}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Confirm password</Text>
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
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
    width: Dimensions.get('window').width * 0.7,
  },
  button: {
    margin: 30,
    backgroundColor: 'rgb(250, 204, 4)',
  },
  formElement: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  formLabel: {
    color: 'black',
    textAlign: 'left',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    paddingVertical: 10,
    flex: 1,
    width: Dimensions.get('window').width * 0.7,
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
