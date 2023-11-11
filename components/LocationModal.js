import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import * as Animatable from 'react-native-animatable';
Geocoder.init('AIzaSyCRPrgF2Wj7GhBhJn8dHbG_h008LouAiyo', {types: ['address']});
import MapView, {
  Marker,
  Polyline,
  Callout,
  PROVIDER_GOOGLE,
  OverlayComponent,
} from 'react-native-maps';
const LocationModal = props => {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState(props.region);
  const [predictionResults, setVisiblePrediction] = useState(false);
  const [data, setData] = useState([]);
  const getPredictions = text => {
    setSearchText(text);
    setVisiblePrediction(text.length > 0 ? true : false);

    RNGooglePlaces.getAutocompletePredictions(text, {
      // type: 'geocode',
      locationRestriction: {
        latitudeSW: 0.104766,
        longitudeSW: 99.748898,
        latitudeNE: 6.899554,
        longitudeNE: 104.231319,
      },
    })
      .then(results => {
        setData(results);
      })
      .catch(error => console.log(error.message));
  };

  const getAddressByLocation = (lat, long) => {
    console.log(lat, long);
    Geocoder.from(lat, long)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        props.setAddress({
          address: addressComponent,
          location: {latitude: lat, longitude: long},
        });
      })
      .catch(error => console.log(error));
  };
  const getLocationById = placeID => {
    RNGooglePlaces.lookUpPlaceByID(placeID, ['location', 'address'])
      .then(
        results => {
          console.log(results);
          props.setAddress({
            address: results.address,
            location: {
              latitude: results.location.latitude,
              longitude: results.location.longitude,
            },
          });
          props.hideModal();
        },
        // setRegion({
        //   latitude: results.location.latitude,
        //   longitude: results.location.longitude,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }),
      )
      .catch(error => console.log(error.message));
  };

  const onClickMarker = () => {
    console.log(region.latitude, region.longitude);
    getAddressByLocation(region.latitude, region.longitude);
    // props.setRegion({
    //   latitude: region.latitude,
    //   longitude: region.longitude,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // });
    props.hideModal();
  };

  const onMoveMap = place => {
    console.log(place);
    setRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}>
      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        <TouchableOpacity
          onPress={props.hideModal}
          style={{justifyContent: 'center'}}>
          <Icon name="chevron-left" color="grey" size={30} />
        </TouchableOpacity>
        <TextInput
          placeholder="Start typing here"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontSize: Dimensions.get('window').width / 18,
            fontFamily: 'sans-serif-condensed',
            flex: 1,
            marginHorizontal: 20,
          }}
          onChangeText={getPredictions}
          value={searchText}
        />
        <TouchableOpacity
          onPress={() => getPredictions('')}
          style={{justifyContent: 'center'}}>
          <Icon name="close" color="grey" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          style={styles.map}
          onRegionChangeComplete={onMoveMap}
          initialRegion={region}
        />
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: Dimensions.get('window').width / 28 + 50,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity
            onPress={onClickMarker}
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                padding: 10,
                fontSize: Dimensions.get('window').width / 28,
                fontFamily: 'sans-serif-condensed',
              }}>
              Select this Location
            </Text>
            <Icon name="chevron-right" color="black" size={30} />
          </TouchableOpacity>
          <Icon name="location-on" color="red" size={40} />
        </View>
      </View>
      {predictionResults && (
        <Animatable.View
          style={{flex: 1, backgroundColor: 'white'}}
          animation="slideInUp"
          duration={500}>
          <Text
            style={{
              fontSize: Dimensions.get('window').width / 28,
              fontFamily: 'sans-serif-condensed',
            }}>
            powered by Google
          </Text>
          <FlatList
            keyExtractor={(item, index) => item.placeID}
            data={data}
            renderItem={itemData => (
              <TouchableOpacity
                onPress={() => getLocationById(itemData.item.placeID)}>
                <Text
                  style={{
                    borderBottomWidth: 1,
                    backgroundColor: 'white',
                    padding: 20,
                    fontSize: Dimensions.get('window').width / 28,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  {itemData.item.fullText}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default LocationModal;
