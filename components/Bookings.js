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
import PromoTile from './PromoTile';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import LoadingModal from './LoadingModal';

export default class Bookings extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      data: [],
      loading: true,
      statusString: {
        0: {status: 'Assigning driver', color: 'red'},
        1: {status: 'Driver assigned', color: 'orange'},
        2: {status: 'Assigning driver', color: 'red'},
        3: {status: 'Driver accepted', color: 'orange'},
        4: {status: 'Driver arrived', color: 'blue'},
        5: {status: 'Completed', color: 'green'},
        6: {status: 'Booking cancelled', color: 'red'},
      },
    };
  }

  componentDidMount() {
    const {currentUser} = auth();
    console.log('aya');
    firestore()
      .collection('Transaction')
      .where('userID', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          console.log('aya1');
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            data.id = documentSnapshot.id;
            aData.push(data);
          });
          this.setState({data: aData, loading: false});
        },
        error => {
          console.log('aya2');
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
  getStatusString = status => {};

  render() {
    const {data, navigation, statusString, loading} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View style={styles.container}>
          {data.length > 0 ? (
            <View style={{flex: 1, width: '100%', marginVertical: 20}}>
              <FlatList
                keyExtractor={(item, index) => item.id}
                data={data}
                renderItem={itemData => (
                  <TouchableOpacity
                    disabled={itemData.item.servStatus == 6 ? true : false}
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      margin: 10,
                      flexDirection: 'row',
                      flex: 1,
                      shadowColor: 'rgba(0,0,0,1)', // IOS
                      shadowOffset: {height: 15, width: 15}, // IOS
                      shadowOpacity: 1, // IOS
                      shadowRadius: 5, //IOS
                      elevation: 15, // Android
                      borderRadius: 10,
                    }}
                    onPress={() =>
                      navigation.navigate('TrackBooking', {
                        transactionId: itemData.item.id,
                      })
                    }>
                    <View>
                      <Text
                        style={{
                          fontSize: Dimensions.get('window').width / 28,
                          fontFamily: 'sans-serif-condensed',
                          fontWeight: '700',
                        }}>
                        {itemData.item.createdAt.toDate().toDateString() +
                          ' ' +
                          itemData.item.createdAt.toDate().toLocaleTimeString()}
                      </Text>
                      {/* <Text
                      style={{
                        fontSize: Dimensions.get('window').width / 28,
                        fontFamily: 'sans-serif-condensed',
                      }}>
                      Booking Id: {itemData.item.id}
                    </Text> */}
                      <Text
                        style={{
                          fontSize: Dimensions.get('window').width / 28,
                          fontFamily: 'sans-serif-condensed',
                          paddingVertical: 10,
                        }}>
                        Service Availed: {itemData.item.servType}
                      </Text>
                      <View style={{width: '95%'}}>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            name="location-on"
                            color="red"
                            size={Dimensions.get('window').width / 30}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: Dimensions.get('window').width / 30,
                              fontFamily: 'sans-serif-condensed',
                            }}>
                            {itemData.item.loc_from.address}
                          </Text>
                        </View>
                        {itemData.item.loc_to && (
                          <View style={{flexDirection: 'row'}}>
                            <Icon
                              name="location-on"
                              color="green"
                              size={Dimensions.get('window').width / 30}
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: Dimensions.get('window').width / 30,
                                fontFamily: 'sans-serif-condensed',
                              }}>
                              {itemData.item.loc_to.address}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: Dimensions.get('window').width / 24,
                          fontFamily: 'sans-serif-condensed',
                          color: statusString[itemData.item.servStatus].color,
                          paddingVertical: 10,
                        }}>
                        {statusString[itemData.item.servStatus].status}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
                You have no bookings
              </Text>

              {loading && <LoadingModal />}
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
});
