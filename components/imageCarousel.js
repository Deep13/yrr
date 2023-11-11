import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;

class ImageCarousel extends Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }
  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.textTitle.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            y: 0,
            x: DEVICE_WIDTH * this.state.selectedIndex,
          });
        },
      );
    }, 3000);
  };
  setSelectIndex = event => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize);
    this.setState({selectedIndex});
  };

  render() {
    const {textTitle} = this.props;
    const {selectedIndex} = this.state;
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          flex: 1,
        }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.setSelectIndex}
          ref={this.scrollRef}>
          {textTitle.map(textTitle => (
            <TouchableOpacity
              key={textTitle.id}
              activeOpacity={textTitle.type ? 0.7 : 1}
              onPress={() => this.props.imagePressed(textTitle)}>
              <Image
                style={{
                  width: DEVICE_WIDTH,
                  backgroundColor: 'white',
                  flex: 1,
                }}
                source={{uri: textTitle.src}}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.circleDiv}>
          {textTitle.map((textTitle, i) => (
            <View
              key={textTitle.id}
              style={[
                styles.whiteCircle,
                {opacity: i == selectedIndex ? 1 : 0.5},
              ]}
            />
          ))}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  circleDiv: {
    position: 'absolute',
    bottom: 20,
    height: 10,
    width: DEVICE_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#FFF',
  },
});
export default ImageCarousel;
