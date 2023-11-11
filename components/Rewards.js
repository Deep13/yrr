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
  FlatList,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DealsTile from './DealsTile';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class Rewards extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      inValidText: '',
      loading: false,
      code: '',
      data: [],
      usedRewards: [],
      unUsedRewards: [],
    };
  }
  getRewards = () => {
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log(documentSnapshot.data().reward);
          if (documentSnapshot.data().reward != 'NA') {
            console.log('sds');
            this.setState({data: documentSnapshot.data().reward});
          }
        } else {
          console.log('nope');
        }
      });
  };
  componentDidMount() {
    const {currentUser} = auth();
    firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            if (documentSnapshot.data().reward) {
              var aRewards = [];
              var usedRewards = [];
              var unUsedRewards = [];
              documentSnapshot.data().reward.forEach(val => {
                if (val.status == 0) {
                  aRewards.push(val);
                  unUsedRewards.push(val.id);
                } else if (val.status == 1) {
                  usedRewards.push(val.id);
                }
              });
              this.setState({
                data: aRewards,
                usedRewards: usedRewards,
                unUsedRewards: unUsedRewards,
              });
              // this.setState({data: documentSnapshot.data().reward});
            }
          } else {
            console.log('nope');
          }
        },
        error => {
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentDidUpdate() {
    // this.getRewards();
  }
  handleBackButton = () => {
    this.state.navigation.navigate('Dashboard');
    return true;
  };
  componentWillUnmount() {
    console.log('left');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  onChange = text => {
    this.setState({inValidText: ''});
    this.setState({code: text});
  };
  onSubmit = () => {
    if (this.state.code.trim()) {
      this.setState({loading: true});
      console.log(this.state.usedRewards, this.state.code);
      if (this.state.unUsedRewards.includes(this.state.code)) {
        this.setState({inValidText: 'Coupon already applied', loading: false});
      } else if (this.state.usedRewards.includes(this.state.code)) {
        this.setState({inValidText: 'Coupon already used', loading: false});
      } else {
        firestore()
          .collection('Rewards')
          .doc(this.state.code)
          .get()
          .then(documentSnapshot => {
            // console.log('User exists: ', documentSnapshot.exists);
            if (documentSnapshot.exists) {
              const {currentUser} = auth();
              console.log(currentUser.uid);
              var data = documentSnapshot.data();
              // console.log(data);
              firestore()
                .collection('Users')
                .doc(currentUser.uid)
                .update({
                  reward: firestore.FieldValue.arrayUnion({
                    id: data.code,
                    title: data.title,
                    description: data.desc,
                    img: data.img,
                    status: 0,
                  }),
                })
                .then(() => {
                  this.setState({
                    loading: false,
                    code: '',
                    inValidText: 'Coupon Applied',
                  });
                  console.log('Coupon applied');
                })
                .catch(error => {
                  console.log('Error occured:', error);
                });
            } else {
              this.setState({loading: false});
              this.setState({inValidText: 'Invalid Coupon'});
            }
          });
      }
    }
  };
  render() {
    const {data, inValidText, loading, code} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator animating={true} size="large" color="red" />
            </View>
          ) : null}
          <Text
            style={{
              color: 'red',
              paddingVertical: 10,
              fontSize: Dimensions.get('window').width / 24,
              fontFamily: 'sans-serif-condensed',
              display: inValidText ? 'flex' : 'none',
            }}>
            {inValidText}
          </Text>
          <View style={styles.formElement}>
            <TextInput
              placeholderTextColor="black"
              placeholder="Enter coupon code"
              style={styles.input}
              onChangeText={text => this.onChange(text)}
              value={code}
            />
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(250, 204, 4)',
                padding: 20,
                margin: 10,
                borderRadius: 10,
              }}
              onPress={this.onSubmit}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontWeight: '700',
                  fontSize: Dimensions.get('window').width / 24,
                  fontFamily: 'sans-serif-condensed',
                }}>
                Go
              </Text>
            </TouchableOpacity>
          </View>
          {data.length > 0 ? (
            <View style={{flex: 3, width: '100%'}}>
              <FlatList
                numColumns="2"
                keyExtractor={(item, index) => item.id}
                data={data}
                renderItem={itemData => (
                  <View
                    style={{
                      width: '50%',
                    }}>
                    <DealsTile
                      title={itemData.item.title}
                      description={itemData.item.description}
                      img={itemData.item.img}
                    />
                  </View>
                )}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: 30,
              }}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 15,
                  fontFamily: 'sans-serif-condensed',
                }}>
                You need to add rewards
              </Text>
            </View>
          )}
        </View>
      </View>
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
  formElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  input: {
    backgroundColor: 'rgb(250, 204, 4)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
});
