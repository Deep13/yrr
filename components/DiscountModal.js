import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';

const DiscountModal = props => {
  const couponSelected = item => {
    console.log(item.title);
    props.selectedItem(item);
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
          backgroundColor="black"
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
        Available Rewards
      </Text>
      {props.listData.length > 0 || props.carListData.length > 0 ? (
        <View>
          <FlatList
            keyExtractor={(item, index) => item.code}
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
                    fontSize: Dimensions.get('window').width / 15,
                    fontFamily: 'sans-serif-condensed',
                    fontWeight: '700',
                  }}>
                  {itemData.item.title}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    paddingVertical: 10,
                    fontSize: Dimensions.get('window').width / 20,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  {itemData.item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
          <FlatList
            keyExtractor={(item, index) => item.code}
            data={props.carListData}
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
                    fontSize: Dimensions.get('window').width / 15,
                    fontFamily: 'sans-serif-condensed',
                    fontWeight: '700',
                  }}>
                  {itemData.item.title}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    paddingVertical: 10,
                    fontSize: Dimensions.get('window').width / 20,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  {itemData.item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 20,
            fontFamily: 'sans-serif-condensed',
            textAlign: 'center',
          }}>
          No Rewards available
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default DiscountModal;
