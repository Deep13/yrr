import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  Platform,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
const VehicleModal = props => {
  const [carPlate, setCarPlate] = useState('');
  const [carModel, setCarModel] = useState(null);
  const [carBrand, setCarBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inValidText, setinValidText] = useState(null);
  const [carBrandItems, setcarBrandItems] = useState(props.carBrandItems);
  const [carModelItems, setcarModelItems] = useState(props.carModelItems);
  const [carBrandIsError, setcarBrandIsError] = useState(false);
  const [carModelIsError, setcarModelIsError] = useState(false);
  const [carPlateIsError, setcarPlateIsError] = useState(false);
  const [open, setOpen] = useState(false);
  const couponSelected = item => {
    console.log(item.carPlate);
    props.selectedItem(item);
  };
  const onClickOthers = () => {
    setinValidText(null);
    setOpen(open ? false : true);
  };
  const changeValue = (field, value) => {
    if (field === 'carBrand') {
      setCarBrand(value);
      setcarBrandIsError(false);
      setCarModel(null);
    } else if (field === 'carModel') {
      setCarModel(value);
      setcarModelIsError(false);
    } else {
      setCarPlate(value);
      setcarPlateIsError(false);
    }
  };
  const submitOtherCar = () => {
    if (!carPlate) {
      setcarPlateIsError(true);
      setinValidText('Vehicle no. cannot be empty');
    } else if (!carBrand) {
      setcarBrandIsError(true);
      setinValidText('Car make cannot be empty');
    } else if (!carModel) {
      setcarModelIsError(true);
      setinValidText('Car model cannot be empty');
      // setLoading(true);
    } else {
      props.selectedItem({
        carPlate: carPlate,
        carBrand: carBrand,
        carModel: carModel,
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        padding: 20,
        backgroundColor: '#e4e4e4',
      }}>
      <TouchableOpacity
        style={{position: 'absolute', top: 20, right: 20, zIndex: 1000}}
        onPress={props.hideModal}>
        <Icon
          backgroundColor="white"
          name="close"
          color="black"
          style={{padding: 5}}
          size={50}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: 'black',
          padding: 20,
          textAlign: 'center',
          fontSize: Dimensions.get('window').width / 15,
          fontFamily: 'sans-serif-condensed',
        }}>
        Available Vehicle
      </Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} size="large" color="red" />
        </View>
      ) : null}
      <Text
        style={{
          color: 'red',
          paddingBottom: 10,
          fontSize: Dimensions.get('window').width / 24,
          fontFamily: 'sans-serif-condensed',
          display: inValidText ? 'flex' : 'none',
          textAlign: 'center',
        }}>
        {inValidText}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
        onPress={onClickOthers}>
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 20,
            fontFamily: 'sans-serif-condensed',
            padding: 10,
          }}>
          Add Others
        </Text>
        {open ? (
          <Icon
            backgroundColor="white"
            name="keyboard-arrow-down"
            color="black"
            style={{padding: 5}}
            size={30}
          />
        ) : (
          <Icon
            backgroundColor="white"
            name="keyboard-arrow-right"
            color="black"
            style={{padding: 5}}
            size={30}
          />
        )}
      </TouchableOpacity>
      {open && (
        <Animatable.View
          style={{flex: 1}}
          animation="fadeInDown"
          duration={500}>
          <View
            style={[
              {
                padding: 10,
              },
            ]}>
            <TextInput
              placeholderTextColor="rgba(1,1,1,0.4)"
              placeholder="Vehicle no."
              style={[styles.input, carPlateIsError ? styles.error : null]}
              onChangeText={text => changeValue('carPlate', text)}
              value={carPlate}
            />
            <DropDownPicker
              items={carBrandItems}
              defaultValue={carBrand}
              placeholder="Select car make"
              containerStyle={{height: 40, marginBottom: 10}}
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
              }}
              dropDownMaxHeight={150}
              dropDownStyle={{marginTop: 2}}
              itemStyle={{fontSize: 10}}
              onChangeItem={item => changeValue('carBrand', item.label)}
            />
            <DropDownPicker
              items={carBrand ? carModelItems[carBrand] : []}
              defaultValue={carModel}
              placeholder="Select car model"
              containerStyle={{height: 40, marginBottom: 10}}
              zIndex={4000}
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
              }}
              dropDownMaxHeight={150}
              dropDownStyle={{marginTop: 2}}
              itemStyle={{fontSize: 10}}
              onChangeItem={item => changeValue('carModel', item.label)}
            />
          </View>
          <View
            style={{
              paddingBottom: 20,
              width: '100%',
            }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.6}
              onPress={submitOtherCar}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 20,
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '700',
                  paddingVertical: 10,
                }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
      {props.listData.length > 0 ? (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 20,
              fontFamily: 'sans-serif-condensed',
              padding: 10,
            }}>
            Select from available vehicles
          </Text>
          <View style={{flex: 1}}>
            <FlatList
              keyExtractor={(item, index) => item.carPlate}
              data={props.listData}
              renderItem={itemData => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',
                    backgroundColor: 'white',
                    padding: 20,
                  }}
                  onPress={() => couponSelected(itemData.item)}>
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width / 20,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {itemData.item.carBrand}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(0,0,0,0.7)',
                      fontSize: Dimensions.get('window').width / 28,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {itemData.item.carModel}
                  </Text>
                  <Text
                    style={{
                      color: 'red',
                      paddingVertical: 10,
                      fontSize: Dimensions.get('window').width / 20,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {itemData.item.carPlate}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      ) : (
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 20,
            fontFamily: 'sans-serif-condensed',
            textAlign: 'center',
          }}>
          No Vehicles available
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: 'rgb(250, 204, 4)',
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
    marginBottom: 10,
  },
  error: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default VehicleModal;
