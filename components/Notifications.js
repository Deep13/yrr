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
import NotificationTile from './NotificationTile';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      notificationList: [],
    };
  }
  componentDidMount() {
    // console.log(Operations.getUser());
    firestore()
      .collection('Notification')
      .onSnapshot(
        querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            data.timestamp = data.timestamp.toDate().toLocaleDateString();
            data.id = documentSnapshot.id;
            aData.push(data);
          });
          this.setState({notificationList: aData});
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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  render() {
    const {notificationList, navigation} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
          {notificationList.length > 0 ? (
            <View style={{paddingBottom: 20}}>
              {notificationList.map(itemData => {
                return (
                  <View style={{alignItems: 'center'}}>
                    <NotificationTile
                      data={itemData}
                      navigation={navigation}
                      active={true}
                    />
                  </View>
                );
              })}
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
                No new notification
              </Text>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
});
