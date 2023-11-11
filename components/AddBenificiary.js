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
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Dialog, {
  ScaleAnimation,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
export default class AddBenificiary extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      data: [],
      locationVisible: false,
    };
  }
  componentDidMount() {
    const {currentUser} = auth();
    firestore()
      .collection('carPlates')
      .where('users', 'array-contains', currentUser.uid)
      .where('role', 'in', ['SG', 'SGMY'])
      .onSnapshot(
        querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            aData.push(data);
          });
          this.setState({data: aData});
          // console.log(aData);
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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  onVehicleSelect = data => {
    if (data.users.length < 4) {
      this.state.navigation.navigate('BenificiaryAdd', {
        plate: data.carPlate,
      });
    } else {
      this.setState({locationVisible: true});
    }
  };
  onSubmit = () => {};
  render() {
    const {data, navigation, locationVisible} = this.state;
    return (
      <View style={styles.container}>
        <Dialog
          visible={locationVisible}
          dialogAnimation={
            new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })
          }
          onHardwareBackPress={() => {
            this.setState({locationVisible: false});
            return true;
          }}
          dialogTitle={<DialogTitle title="Limit exceeded" />}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {
                  this.setState({locationVisible: false});
                }}
              />
            </DialogFooter>
          }>
          <DialogContent>
            <Text
              style={{
                fontSize: Dimensions.get('window').width / 28,
                fontFamily: 'sans-serif-condensed',
                padding: 10,
                alignItems: 'center',
              }}>
              You can add maximum of 4 benificiary
            </Text>
          </DialogContent>
        </Dialog>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        {data.length > 0 ? (
          <View style={{}}>
            <FlatList
              keyExtractor={(item, index) => item.id}
              data={data}
              horizontal={false}
              renderItem={itemData => (
                <View
                  style={{
                    alignItems: 'center',
                  }}
                  visible={false}>
                  <View style={{alignItems: 'center', padding: 20}}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={{
                        backgroundColor: 'black',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        shadowColor: 'rgba(0,0,0,1)', // IOS
                        shadowOffset: {height: 15, width: 15}, // IOS
                        shadowOpacity: 1, // IOS
                        shadowRadius: 5, //IOS
                        elevation: 15, // Android
                        borderRadius: 10,
                        width: Dimensions.get('window').width - 20,
                        flexDirection: 'row',
                      }}
                      onPress={() => this.onVehicleSelect(itemData.item)}>
                      <View style={{alignItems: 'flex-start'}}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: Dimensions.get('window').width / 15,
                            fontFamily: 'sans-serif-condensed',
                            textAlign: 'left',
                          }}>
                          {itemData.item.carPlate}
                        </Text>
                        {itemData.item.carBrand && (
                          <View style={{}}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: Dimensions.get('window').width / 28,
                                fontFamily: 'sans-serif-condensed',
                                textAlign: 'left',
                              }}>
                              {itemData.item.carBrand}
                            </Text>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: Dimensions.get('window').width / 28,
                                fontFamily: 'sans-serif-condensed',
                                textAlign: 'left',
                              }}>
                              {itemData.item.carModel}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                          name="ios-arrow-forward"
                          size={40}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 15,
              fontFamily: 'sans-serif-condensed',
              paddingTop: 20,
            }}>
            No vehicle available
          </Text>
        )}
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
