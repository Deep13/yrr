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
import auth from '@react-native-firebase/auth';
export default class Marketplace extends Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      data: [],
      textStatus: 'Loading the\n best offers for you...',
    };
  }

  componentDidMount() {
    firestore()
      .collection('Promotion')
      .where('expiryDate', '>=', new Date())
      .onSnapshot(
        querySnapshot => {
          var aData = [];
          // console.log(querySnapshot.size);
          if (querySnapshot.size > 0) {
            querySnapshot.forEach(documentSnapshot => {
              var data = documentSnapshot.data();
              data.id = documentSnapshot.id;
              aData.push(data);
            });
            this.setState({data: aData});
          } else {
            this.setState({textStatus: 'No promotions today!!'});
          }
        },
        error => {
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  goToDetail = code => {
    console.log(code);
    this.state.navigation.navigate('MarketDetail', {promotionData: code});
  };
  handleBackButton = () => {
    this.state.navigation.navigate('Dashboard');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const {data, textStatus} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View style={styles.container}>
          {data.length > 0 ? (
            <View style={{flex: 1, width: '100%'}}>
              <FlatList
                keyExtractor={(item, index) => item.id}
                data={data}
                renderItem={itemData => (
                  <View>
                    <PromoTile
                      data={itemData.item}
                      navigation={this.state.navigation}
                      goToDetail={this.goToDetail}
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
                  textAlign: 'center',
                }}>
                {textStatus}
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
});
