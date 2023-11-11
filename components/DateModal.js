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
const DateModal = props => {
  const listData = useState(props.listData);
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const onSelectMonth = month => {
    props.onSelectDate(month);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        padding: 20,
        backgroundColor: '#e4e4e4',
      }}>
      <FlatList
        keyExtractor={(item, index) => index}
        data={month}
        renderItem={itemData => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'grey',
              backgroundColor: 'white',
              padding: 20,
            }}
            onPress={() => onSelectMonth(itemData.item)}>
            <Text
              style={{
                fontSize: Dimensions.get('window').width / 20,
                fontFamily: 'sans-serif-condensed',
              }}>
              {itemData.item}
            </Text>
          </TouchableOpacity>
        )}
      />
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

export default DateModal;
