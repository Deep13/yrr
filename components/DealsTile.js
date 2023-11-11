import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';

const DealsTile = props => {
  return (
    <View
      style={{
        minHeight: 200,
        padding: 20,
      }}>
      <ImageBackground
        style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}
        source={{uri: props.img}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            // shadowColor: 'rgba(0,0,0,1)', // IOS
            // shadowOffset: {height: 15, width: 15}, // IOS
            // shadowOpacity: 1, // IOS
            // shadowRadius: 5, //IOS
            // elevation: 15, // Android
            // borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: Dimensions.get('window').width / 15,
              textAlign: 'center',
            }}>
            {props.title}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: Dimensions.get('window').width / 24,
              textAlign: 'center',
            }}>
            {props.description}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DealsTile;
