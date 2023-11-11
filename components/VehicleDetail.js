import React, {Component, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class VehicleDetail extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      carModel: null,
      carBrand: null,
      insEXPDateString: null,
      carPlate: '',
      roadTaxEXPMonth: null,
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    console.log(route.params.plate);
    firestore()
      .collection('carPlates')
      .doc(route.params.plate)
      .get()
      .then(
        documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            let data = documentSnapshot.data();
            this.setState({
              carModel: data.carModel,
              carBrand: data.carBrand,
              insEXPDateString: data.InsExpMonth,
              carPlate: data.carPlate,
              roadTaxEXPMonth: data.RDTaxExpMonth,
            });
          } else {
            console.log('nope');
          }
        },
        error => {
          console.log(error);
        },
      );
    // console.log(aBrands);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    this.state.navigation.navigate('Vehicle');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  render() {
    const {
      carModel,
      carBrand,
      insEXPDateString,
      carPlate,
      roadTaxEXPMonth,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
        <View style={styles.container}>
          <View style={{paddingTop: 20, flex: 4, width: '100%'}}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Vehicle no:</Text>
                <Text style={styles.text}>{carPlate}</Text>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car make:</Text>
                <Text style={styles.text}>{carBrand}</Text>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car model:</Text>
                <Text style={styles.text}>{carModel}</Text>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Road tax expiry month:</Text>
                <Text style={styles.text}>{roadTaxEXPMonth}</Text>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Insurance expiry month:</Text>
                <Text style={styles.text}>{insEXPDateString}</Text>
              </View>
            </ScrollView>
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
    paddingRight: 24,
    flex: 1,
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    color: 'black',
    fontSize: Dimensions.get('window').width / 20,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
});
