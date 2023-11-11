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
  ActivityIndicator,
} from 'react-native';

const LoadingModal = props => {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator animating={true} size="large" color="red" />
    </View>
  );
};

const styles = StyleSheet.create({});

export default LoadingModal;
