import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  BackHandler,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import HTML from 'react-native-render-html';
import auth from '@react-native-firebase/auth';
export default class MarketDetail extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      promotionData: null,
      allowed: false,
      aPromoData: [],
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const promotionCode = route.params.promotionData;
    const {currentUser} = auth();
    firestore()
      .collection('Promotion')
      .doc(promotionCode)
      .get()
      .then(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            var currData = documentSnapshot.data();
            currData.id = documentSnapshot.id;
            this.setState({promotionData: documentSnapshot.data()});
            firestore()
              .collection('Users')
              .doc(currentUser.uid)
              .get()
              .then(
                documentSnapshot => {
                  if (documentSnapshot.exists) {
                    var data = documentSnapshot.data();
                    var flag = true;
                    this.setState({aPromoData: data.promoKey});
                    // console.log(data.promoKey);
                    if (data.promokey) {
                      data.promoKey.forEach(val => {
                        if (
                          val.code === currData.id &&
                          currData.validUse != 0 &&
                          val.validUse >= currData.validUse
                        ) {
                          flag = false;
                        }
                      });
                    }

                    this.setState({allowed: flag});
                    // this.setState({data: documentSnapshot.data()});
                  } else {
                    console.log('nope');
                  }
                },
                error => {
                  console.log(error);
                },
              );
          }
        },
        error => {
          console.log(error);
        },
      );

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  onRedeem = promoData => {
    delete promoData.img;
    this.state.navigation.navigate('ScanBarcode', {
      promoData: promoData,
      totalPromoData: this.state.aPromoData ? this.state.aPromoData : [],
    });
  };
  handleBackButton = () => {
    this.state.navigation.navigate('Marketplace');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const {promotionData, navigation, allowed} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />

        {promotionData && (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              {promotionData.img && (
                <Image
                  style={{
                    width: Dimensions.get('window').width,
                    height: 'auto',
                    backgroundColor: 'white',
                    resizeMode: 'contain',
                    aspectRatio: 4 / 2,
                  }}
                  source={{uri: promotionData.img}}
                />
              )}
              <View style={{flex: 2, padding: 20}}>
                <Text style={styles.title}>{promotionData.title}</Text>
                <HTML
                  container
                  tagsStyles={styles}
                  html={promotionData.longDesc}
                  containerStyle={{padding: 10}}
                  onLinkPress={(data, data2) => Linking.openURL(data2)}
                />
                {/* <Text style={styles.desc}>{promotionData.desc}</Text> */}
              </View>
            </ScrollView>
            {allowed && (
              <View
                style={{
                  justifyContent: 'flex-end',
                  paddingBottom: 20,
                }}>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.4}
                  onPress={() => this.onRedeem(promotionData)}>
                  <Icon name="barcode-scan" size={30} color="black" />
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      fontSize: Dimensions.get('window').width / 15,
                      fontFamily: 'sans-serif-condensed',
                      fontWeight: '700',
                      padding: 10,
                    }}>
                    REDEEM
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!allowed && (
              <View style={{paddingVertical: 20}}>
                <Text
                  style={{
                    color: 'red',
                    fontSize: Dimensions.get('window').width / 20,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  You have exhausted your usage
                </Text>
              </View>
            )}
          </View>
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
  title: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 10,
    fontWeight: '700',
    fontFamily: 'sans-serif-condensed',
  },
  desc: {
    paddingVertical: 20,
    color: 'black',
    fontSize: Dimensions.get('window').width / 20,
    fontFamily: 'sans-serif-condensed',
  },
  button: {
    margin: 30,
    backgroundColor: 'rgb(250, 204, 4)',
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disbaledButton: {
    margin: 30,
    backgroundColor: '#828180',
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  p: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 18,
  },
});
