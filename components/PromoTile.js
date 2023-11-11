import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HTML from 'react-native-render-html';
const PromoTitle = props => {
  return (
    <View
      style={{
        minHeight: 160,
        padding: 10,
        // height: 300,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          shadowColor: 'rgba(0,0,0,1)', // IOS
          shadowOffset: {height: 15, width: 15}, // IOS
          shadowOpacity: 1, // IOS
          shadowRadius: 5, //IOS
          elevation: 15, // Android
          // paddingBottom: 10,
          flexDirection: 'row',
        }}
        onPress={() => props.goToDetail(props.data.id)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 10,
          }}>
          <Image
            resizeMode="contain"
            style={{
              height: '100%',
              flex: 1,
              width: '100%',
              borderRadius: 10,
            }}
            source={{uri: props.data.img}}
          />
        </View>
        <View style={{flex: 1, padding: 10, alignItems: 'flex-start'}}>
          <Text
            numberOfLines={2}
            style={{
              width: '100%',
              color: 'black',
              fontSize: Dimensions.get('window').width / 25,
              textAlign: 'left',
              // padding: 10,
              fontWeight: '700',
              fontFamily: 'sans-serif-condensed',
            }}>
            {props.data.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              color: 'black',
              // padding: 10,
              fontSize: Dimensions.get('window').width / 27,
              textAlign: 'left',
              fontFamily: 'sans-serif-condensed',
            }}>
            {props.data.desc}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  p: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 18,
  },
});

export default PromoTitle;
