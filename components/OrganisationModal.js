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
const OrganisationModal = props => {
  const [orgParam, setOrgParam] = useState('');
  const [listData, setListData] = useState(props.listData);

  const searchOrg = text => {
    setOrgParam(text);
    var newData;
    if (text) {
      newData = listData.filter(item => {
        const itemData = `${item.org.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    } else {
      newData = props.listData;
    }
    setListData(newData);
  };
  const onSelectOrg = org => {
    props.onSelectOrganisation(org);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        padding: 20,
        backgroundColor: '#e4e4e4',
      }}>
      <TextInput
        placeholderTextColor="grey"
        placeholder="Search code"
        style={{backgroundColor: 'white'}}
        onChangeText={text => searchOrg(text)}
        value={orgParam}
      />
      {listData.length > 0 ? (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 20,
              fontFamily: 'sans-serif-condensed',
              padding: 10,
            }}>
            Select from list below
          </Text>
          <View style={{flex: 1}}>
            <FlatList
              keyExtractor={(item, index) => item.org}
              data={listData}
              renderItem={itemData => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',
                    backgroundColor: 'white',
                    padding: 20,
                  }}
                  onPress={() => onSelectOrg(itemData.item.org)}>
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width / 20,
                      fontFamily: 'sans-serif-condensed',
                    }}>
                    {itemData.item.org}
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
          No list of organisation
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

export default OrganisationModal;
