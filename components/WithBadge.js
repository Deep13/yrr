import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9,
    height: 10,
    minWidth: 0,
    width: 10,
  },
  badgeContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
});

const WithBadge = (value, options = {}) => WrappedComponent =>
  class extends React.Component {
    render() {
      const {
        top = 5,
        right = 0,
        left = 0,
        bottom = 0,
        hidden = !value,
        ...badgeProps
      } = options;
      const badgeValue =
        typeof value === 'function' ? value(this.props) : value;
      return (
        <View>
          {/* <WrappedComponent {...this.props} /> */}
          <Icon.Button
            name="md-notifications"
            size={25}
            color="black"
            fontWeight={700}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              alert('ghjg');
            }}
          />
          {!hidden && (
            <Badge
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              status="error"
              containerStyle={[
                styles.badgeContainer,
                {top, right, left, bottom},
              ]}
              {...badgeProps}
            />
          )}
        </View>
      );
    }
  };

export default WithBadge;
