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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class BenificiaryAdd extends Component {
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
    const {currentUser} = auth();
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'Empty Field';
        this.setState({inValidText: text});
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
      if (this.state.email.toLowerCase() == currentUser.email) {
        this.setState({emailIsError: true});
        text = 'You cannot add yourself as benificiary';
        this.setState({inValidText: text});
        return;
      }
    }

    console.log('Validated with No Error');
    this.setState({loading: true});
    const {route} = this.props;
    var email = this.state.email.toLowerCase();
    var that = this;
    auth()
      .currentUser.getIdToken(true)
      .then(function(idToken) {
        fetch(
          'https://asia-east2-yellow-road-rangers.cloudfunctions.net/userLogin?USERNAME=' +
            email +
            '&TOKEN=' +
            idToken,
        )
          .then(response => response.text())
          .then(json => {
            console.log('data', json);
            if (json == 'false') {
              that.setState({inValidText: 'User does not exist'});
              that.setState({loading: false});
            } else if (json == 'Unauthorized') {
              that.setState({inValidText: 'Operation Failed. Try again!'});
              that.setState({loading: false});
            } else {
              firestore()
                .collection('carPlates')
                .doc(route.params.plate)
                .update({
                  users: firestore.FieldValue.arrayUnion(json),
                  modifiedAt: firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  that.setState({
                    inValidText: 'Beneficiary added',
                    loading: false,
                  });
                })
                .catch(error => {
                  console.log(error);
                  that.setState({
                    inValidText: 'Operation failed',
                    loading: false,
                  });
                });
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(function(error) {
        // Handle error
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
              color: 'black',
              textAlign: 'center',
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              paddingVertical: 20,
            }}>
            Please enter benificiary email address
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
});
