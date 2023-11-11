import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  Dimensions,
  BackHandler,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import HTML from 'react-native-render-html';
import {RNCamera as Camera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import auth from '@react-native-firebase/auth';
export default class ScanBarcode extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.handleTourch = this.handleTourch.bind(this);
    this.scan = React.createRef();
    this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      navigation: props.navigation,
      code: '',
      torchOn: false,
      isBarcodeScannerEnabled: false,
      showAlert: false,
      loading: true,
      resultText: 'Analyzing',
      resultState: false,
      fullPromoData: null,
      promoData: null,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    this.setState({
      code: route.params.promoData.id,
      promoData: route.params.promoData,
      fullPromoData: route.params.totalPromoData,
    });
    setTimeout(() => {
      this.setState({isBarcodeScannerEnabled: true});
    }, 2000);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleTourch(value) {
    if (value === true) {
      this.setState({torchOn: false});
    } else {
      this.setState({torchOn: true});
    }
  }
  isJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  onBarCodeRead = ({data, rawData, type}) => {
    if (this.state.isBarcodeScannerEnabled) {
      console.log(data, rawData, type);
      // if (barcodes[0].data.indexOf('errorCode') == -1) {
      this.setState({
        isBarcodeScannerEnabled: false,
        showAlert: true,
      });
      if (data === this.state.code) {
        const {currentUser} = auth();
        var finalPromoData = [];
        const userData = this.state.fullPromoData;
        var currPromoData = this.state.promoData;
        if (currPromoData.validUse != 0) {
          currPromoData.validUse = 1;
        }
        userData.forEach(val => {
          if (val.code != this.state.code) {
            finalPromoData.push({code: val.code, validUse: val.validUse});
          } else {
            currPromoData.validUse = val.validUse + 1;
          }
        });

        finalPromoData.push({
          code: currPromoData.id,
          validUse: currPromoData.validUse,
        });
        firestore()
          .collection('Users')
          .doc(currentUser.uid)
          .update({
            promoKey: finalPromoData,
          })
          .then(() => {
            this.setState({
              resultText:
                'Service Availed!!' + '\n' + 'from ' + currPromoData.title,
              loading: false,
              resultState: true,
            });
          });
      } else {
        this.setState({
          resultText: 'Invalid Code!!' + '\n' + 'Try Again?',
          loading: false,
          resultState: false,
        });
      }
      // }
    }
  };
  onCancel = () => {
    this.setState({
      showAlert: false,
      loading: true,
      resultText: 'Analyzing',
    });
    this.state.navigation.navigate('Marketplace');
  };
  pressAction = () => {
    if (!this.state.resultState) {
      this.setState({
        showAlert: false,
        loading: true,
        resultText: 'Analyzing',
      });
      setTimeout(() => {
        this.setState({isBarcodeScannerEnabled: true});
      }, 2000);
    } else {
      this.setState({
        showAlert: false,
        loading: true,
        resultText: 'Analyzing',
      });
      this.state.navigation.navigate('Marketplace');
    }
  };
  handleBackButton = () => {
    this.state.navigation.navigate('Marketplace');
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const {
      data,
      torchOn,
      showAlert,
      loading,
      resultText,
      resultState,
      navigation,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgb(250, 204, 4)" />
        <Modal
          onRequestClose={this.onCancel}
          animationType="fade"
          transparent={true}
          visible={showAlert}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                width: '70%',
                paddingVertical: 20,
                borderRadius: 6,
              }}>
              {loading ? (
                <View style={styles.loading}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="red"
                  />
                </View>
              ) : null}
              <Text
                style={{
                  color: resultState ? 'green' : 'red',
                  fontSize: Dimensions.get('window').width / 15,
                  fontFamily: 'sans-serif-condensed',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                {resultText}
              </Text>
              {resultState && (
                <Text
                  style={{
                    color: 'black',
                    fontSize: Dimensions.get('window').width / 24,
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  Have you showed it to the Merchant?
                </Text>
              )}
              {!loading && resultState && (
                <TouchableOpacity onPress={this.pressAction}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Dimensions.get('window').width / 20,
                      fontFamily: 'sans-serif-condensed',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      textAlign: 'center',
                      margin: 10,
                      backgroundColor: 'black',
                      borderRadius: 10,
                      fontWeight: '700',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              )}
              {!loading && !resultState && (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={this.pressAction}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Dimensions.get('window').width / 20,
                        fontFamily: 'sans-serif-condensed',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        margin: 10,
                        backgroundColor: 'black',
                        borderRadius: 10,
                        fontWeight: '700',
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onCancel}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Dimensions.get('window').width / 20,
                        fontFamily: 'sans-serif-condensed',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        textAlign: 'center',
                        margin: 10,
                        backgroundColor: 'black',
                        borderRadius: 10,
                        fontWeight: '700',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            <Camera
              ref={this.scan}
              style={styles.preview}
              onBarCodeRead={this.onBarCodeRead}
              flashMode={
                this.state.torchOn ? Camera.Constants.FlashMode.torch : null
              }
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              ref={cam => (this.camera = cam)}>
              <BarcodeMask
                edgeColor={'rgb(250, 204, 4)'}
                outerMaskOpacity={0}
              />
            </Camera>
          </View>
          <View style={styles.bottomOverlay}>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: 'rgb(250, 204, 4)',
                margin: 10,
                borderRadius: 10,
              }}
              onPress={() => this.handleTourch(this.state.torchOn)}>
              <Icon
                name="ios-flash"
                size={30}
                color={this.state.torchOn ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  preview: {
    flex: 1,
    width: '100%',
  },
  cameraIcon: {
    height: 40,
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  bottomOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
