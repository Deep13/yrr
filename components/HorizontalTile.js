import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const HorizontalTile = props => {
  const statusData = {
    '0': {text: 'Incomplete', color: 'red'},
    '1': {text: 'Complete', color: 'green'},
  };
  const onSelectVehicle = () => {
    if (props.status == 0) {
      props.navigation.navigate('EditVehicle', {plate: props.plate});
    } else {
      props.navigation.navigate('VehicleDetail', {plate: props.plate});
    }
  };
  return (
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
        onPress={onSelectVehicle}>
        <View style={{alignItems: 'flex-start'}}>
          <Text
            style={{
              color: 'white',
              fontSize: Dimensions.get('window').width / 15,
              fontFamily: 'sans-serif-condensed',
              textAlign: 'left',
            }}>
            {props.plate}
          </Text>
          {props.brand && (
            <View style={{}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: Dimensions.get('window').width / 28,
                  fontFamily: 'sans-serif-condensed',
                  textAlign: 'left',
                }}>
                {props.brand}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: Dimensions.get('window').width / 28,
                  fontFamily: 'sans-serif-condensed',
                  textAlign: 'left',
                }}>
                {props.model}
              </Text>
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: statusData[props.status].color,
              fontSize: Dimensions.get('window').width / 20,
              fontFamily: 'sans-serif-condensed',
              textAlign: 'center',
              paddingHorizontal: 10,
            }}>
            {statusData[props.status].text}
          </Text>
          <Icon name="ios-arrow-forward" size={40} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HorizontalTile;
