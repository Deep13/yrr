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
import HorizontalTile from './HorizontalTile';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class Vehicle extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      data: [],
    };
  }
  componentDidMount() {
    const {currentUser} = auth();
    firestore()
      .collection('carPlates')
      .where('users', 'array-contains', currentUser.uid)
      .onSnapshot(
        querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            aData.push(data);
          });
          this.setState({data: aData});
          console.log(aData);
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
  onChange = text => {
    this.setState({inValidText: ''});
    this.setState({code: text});
  };
  onSubmit = () => {};
  render() {
    const {data, navigation} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View style={{}}>
          <FlatList
            keyExtractor={(item, index) => item.id}
            data={data}
            horizontal={false}
            renderItem={itemData => (
              <View style={{alignItems: 'center'}}>
                <HorizontalTile
                  plate={itemData.item.carPlate}
                  brand={itemData.item.carBrand}
                  model={itemData.item.carModel}
                  status={itemData.item.status}
                  navigation={navigation}
                />
              </View>
            )}
          />
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
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
});
