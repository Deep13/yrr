import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import HTML from 'react-native-render-html';
export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      data: null,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const id = route.params.item.id;
    firestore()
      .collection('Notification')
      .doc(id)
      .get()
      .then(
        documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            // console.log(documentSnapshot.data());
            this.setState({data: documentSnapshot.data()});
          } else {
            console.log('nope');
          }
        },
        error => {
          console.log(error);
        },
      );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.state.navigation.navigate('Notifications');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const {data, navigation} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <View style={styles.container}>
          {data && (
            <ScrollView>
              <Image
                style={{
                  width: Dimensions.get('window').width,
                  height: 'auto',
                  backgroundColor: 'white',
                  resizeMode: 'contain',
                  aspectRatio: 4 / 2,
                }}
                source={{uri: data.img}}
              />
              <View style={{flex: 1, padding: 20}}>
                <Text style={styles.title}>{data.title}</Text>
                <HTML
                  container
                  tagsStyles={styles}
                  html={data.longText}
                  containerStyle={{padding: 10}}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 10,
    fontWeight: '700',
    fontFamily: 'sans-serif-condensed',
  },
  desc: {
    paddingVertical: 20,
    color: 'black',
    fontSize: Dimensions.get('window').width / 20,
    fontFamily: 'sans-serif-condensed',
  },
  button: {
    margin: 30,
    backgroundColor: 'rgb(250, 204, 4)',
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  p: {
    color: 'black',
    fontSize: Dimensions.get('window').width / 18,
  },
});
