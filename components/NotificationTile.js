import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const NotificationTile = props => {
  const onPressTile = () => {
    if (props.active) {
      props.navigation.navigate('NotificationItem', {
        item: {id: props.data.id},
      });
    }
  };
  return (
    <View style={{alignItems: 'center', padding: 10}}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          padding: 20,
          shadowColor: 'rgba(0,0,0,1)', // IOS
          shadowOffset: {height: 15, width: 15}, // IOS
          shadowOpacity: 1, // IOS
          shadowRadius: 5, //IOS
          elevation: 15, // Android
          borderRadius: 10,
          flexDirection: 'row',
        }}
        onPress={onPressTile}>
        <View style={{flexDirection: 'row'}}>
          {props.active && (
            <Image
              style={{
                backgroundColor: 'white',
                height: 80,
                flex: 1,
              }}
              source={{uri: props.data.img}}
            />
          )}
          <View
            style={{
              alignItems: 'flex-start',
              flex: 2,
              paddingLeft: 10,
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: Dimensions.get('window').width / 20,
                fontFamily: 'sans-serif-condensed',
                textAlign: 'left',
              }}>
              {props.data.title}
            </Text>
            {props.data.desc !== '' && (
              <View style={{}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                    textAlign: 'left',
                  }}>
                  {props.data.desc}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationTile;
