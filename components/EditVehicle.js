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
export default class EditVehicle extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.carModel = React.createRef();
    this.carBrand = React.createRef();
    this.carPlate = React.createRef();
    this.state = {
      carModel: null,
      carBrand: null,
      insEXPDateString: null,
      carModelItems: [],
      carBrandItems: [],
      carPlate: '',
      roadTaxEXPMonth: null,
      carModelIsError: false,
      carBrandIsError: false,
      insEXPDateStringIsError: false,
      carPlateIsError: false,
      roadTaxEXPMonthIsError: false,
      inValidText: '',
      loading: false,
      status: 1,
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    console.log(route.params.plate);
    firestore()
      .collection('carBrands')
      .get()
      .then(
        querySnapshot => {
          var aModels = [];
          var aBrands = [];
          querySnapshot.forEach(documentSnapshot => {
            var brand = documentSnapshot.id;
            var data = documentSnapshot.data();
            aBrands.push({label: brand, value: brand});
            aModels[brand] = [];
            data.carModel.forEach(function(val) {
              aModels[brand].push({label: val, value: val});
            });
          });
          this.setState({carBrandItems: aBrands, carModelItems: aModels});
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
                    carModel: data.carModel ? data.carModel : null,
                    carBrand: data.carBrand ? data.carBrand : null,
                    insEXPDateString: data.InsExpMonth
                      ? data.InsExpMonth
                      : null,
                    carPlate: data.carPlate,
                    status: data.status,
                    roadTaxEXPMonth: data.RDTaxExpMonth
                      ? data.RDTaxExpMonth
                      : null,
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
        },
        error => {
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton = () => {
    this.state.navigation.navigate('Vehicle');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  checkOnSubmit = () => {
    this.setState({inValidText: ''});
    const fieldArray = [
      'carPlate',
      'carBrand',
      'carModel',
      'roadTaxEXPMonth',
      'insEXPDateString',
    ];
    var text = '';
    for (var i = 0; i < fieldArray.length; i++) {
      if (!this.state[fieldArray[i]]) {
        this.setState({[fieldArray[i] + 'IsError']: true});
        text = 'All fields are mandatory';
        this.setState({inValidText: text});
        if (
          fieldArray[i] != 'roadTaxEXPMonth' &&
          fieldArray[i] != 'carModel' &&
          fieldArray[i] != 'carBrand' &&
          fieldArray[i] != 'insEXPDateString'
        ) {
          this[fieldArray[i]].current.focus();
        }
        return;
      }
    }

    console.log('No Error');
    console.log(this.props.userId);

    this.setState({loading: true});
    const {
      carModel,
      carPlate,
      carBrand,
      insEXPDateString,
      roadTaxEXPMonth,
      status,
    } = this.state;
    var currCarPlate = carPlate.toUpperCase();
    firestore()
      .collection('carPlates')
      .doc(carPlate)
      .update({
        carModel: carModel,
        carBrand: carBrand,
        InsExpMonth: insEXPDateString,
        status: 1,
        RDTaxExpMonth: roadTaxEXPMonth,
        modifiedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.setState({inValidText: 'Vehicle updated', loading: false});
        this.state.navigation.navigate('Vehicle');
        console.log('Vehicle updated!');
      })
      .catch(() => {
        this.setState({inValidText: 'Vehicle not updated', loading: false});
      });
  };
  changeValue = (field, value) => {
    this.setState({[field]: value});
    this.setState({[field + 'IsError']: false});
    this.setState({inValidText: ''});
    if (field === 'carBrand') {
      this.setState({carModel: null});
    }
  };
  render() {
    const {
      carModel,
      carBrand,
      insEXPDateString,
      carPlate,
      carModelItems,
      carBrandItems,
      roadTaxEXPMonth,
      carModelIsError,
      carBrandIsError,
      insEXPDateStringIsError,
      carPlateIsError,
      roadTaxEXPMonthIsError,
      inValidText,
      loading,
      status,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}>
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
              paddingTop: 20,
            }}>
            Please fill the details!!
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
          <View style={{paddingTop: 20, flex: 4, width: '100%'}}>
            <ScrollView contentContainerStyle={{minHeight: '100%'}}>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Vehicle no.</Text>
                <TextInput
                  placeholderTextColor="black"
                  placeholder="Enter vehicle no."
                  style={[
                    styles.disable,
                    carPlateIsError ? styles.error : null,
                  ]}
                  onChangeText={text => this.changeValue('carPlate', text)}
                  value={carPlate}
                  ref={this.carPlate}
                  editable={false}
                />
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car make</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={carBrandItems}
                    defaultValue={carBrand}
                    disabled={status == 1 ? true : false}
                    placeholder="Select car make"
                    containerStyle={{height: 40}}
                    zIndex={5000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: carBrandIsError ? 2 : 0,
                      borderBottomWidth: carBrandIsError ? 2 : 0,
                      borderLeftWidth: carBrandIsError ? 2 : 0,
                      borderRightWidth: carBrandIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('carBrand', item.label)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Car model</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={carBrand ? carModelItems[carBrand] : []}
                    defaultValue={carModel}
                    placeholder="Select car model"
                    containerStyle={{height: 40}}
                    zIndex={4000}
                    disabled={status == 1 ? true : false}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: carModelIsError ? 2 : 0,
                      borderBottomWidth: carModelIsError ? 2 : 0,
                      borderLeftWidth: carModelIsError ? 2 : 0,
                      borderRightWidth: carModelIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    itemStyle={{fontSize: 10}}
                    onChangeItem={item =>
                      this.changeValue('carModel', item.label)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Road tax expiry month</Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: 'Jan', value: 'Jan'},
                      {label: 'Feb', value: 'Feb'},
                      {label: 'Mar', value: 'Mar'},
                      {label: 'Apr', value: 'Apr'},
                      {label: 'May', value: 'May'},
                      {label: 'Jun', value: 'Jun'},
                      {label: 'Jul', value: 'Jul'},
                      {label: 'Aug', value: 'Aug'},
                      {label: 'Sep', value: 'Sep'},
                      {label: 'Oct', value: 'Oct'},
                      {label: 'Nov', value: 'Nov'},
                      {label: 'Dec', value: 'Dec'},
                    ]}
                    defaultValue={roadTaxEXPMonth}
                    disabled={status == 1 ? true : false}
                    placeholder="Select month"
                    containerStyle={{height: 40}}
                    zIndex={3000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: roadTaxEXPMonthIsError ? 2 : 0,
                      borderBottomWidth: roadTaxEXPMonthIsError ? 2 : 0,
                      borderLeftWidth: roadTaxEXPMonthIsError ? 2 : 0,
                      borderRightWidth: roadTaxEXPMonthIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    onChangeItem={item =>
                      this.changeValue('roadTaxEXPMonth', item.label)
                    }
                  />
                </View>
              </View>
              <View style={styles.formElement}>
                <Text style={styles.formLabel}>Insurance expiry month </Text>
                <View
                  style={{
                    flex: 3,
                  }}>
                  <DropDownPicker
                    items={[
                      {label: 'Jan', value: 'Jan'},
                      {label: 'Feb', value: 'Feb'},
                      {label: 'Mar', value: 'Mar'},
                      {label: 'Apr', value: 'Apr'},
                      {label: 'May', value: 'May'},
                      {label: 'Jun', value: 'Jun'},
                      {label: 'Jul', value: 'Jul'},
                      {label: 'Aug', value: 'Aug'},
                      {label: 'Sep', value: 'Sep'},
                      {label: 'Oct', value: 'Oct'},
                      {label: 'Nov', value: 'Nov'},
                      {label: 'Dec', value: 'Dec'},
                    ]}
                    defaultValue={insEXPDateString}
                    disabled={status == 1 ? true : false}
                    placeholder="Select month"
                    containerStyle={{height: 40}}
                    zIndex={2000}
                    labelStyle={{
                      fontSize: Dimensions.get('window').width / 24,
                      fontFamily: 'sans-serif-condensed',
                    }}
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopWidth: insEXPDateStringIsError ? 2 : 0,
                      borderBottomWidth: insEXPDateStringIsError ? 2 : 0,
                      borderLeftWidth: insEXPDateStringIsError ? 2 : 0,
                      borderRightWidth: insEXPDateStringIsError ? 2 : 0,
                      borderColor: 'red',
                      backgroundColor: 'rgb(250, 204, 4)',
                    }}
                    dropDownMaxHeight={240}
                    onChangeItem={item =>
                      this.changeValue('insEXPDateString', item.label)
                    }
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 20,
              width: '100%',
              display: status == 1 ? 'none' : 'flex',
            }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.6}
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
    marginHorizontal: 30,
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
  nric: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  mobile: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
  mobileCode: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 1,
    marginRight: 10,
  },
  disable: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    flex: 3,
  },
});
