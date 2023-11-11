import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {FlatList, Platform, StatusBar, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {SideBarContent} from './sideBarContent';
import Dashboard from './Dashboard';
import Insurance from './Insurance';
import ChangePassword from './ChangePassword';
import Contact from './Contact';
import UpdateProfile from './UpdateProfile';
import Rewards from './Rewards';
import Marketplace from './Marketplace';
import MarketDetail from './MarketDetail';
import ScanBarcode from './ScanBarcode';
import CarAssistance from './CarAssistance';
import AddVehicle from './AddVehicle';
import AddBenificiary from './AddBenificiary';
import BenificiaryAdd from './BenificiaryAdd';
import EditVehicle from './EditVehicle';
import VehicleDetail from './VehicleDetail';
import Vehicle from './Vehicles';
import UpdateVehicle from './UpdateVehicle';
import BookService from './BookService';
import Notifications from './Notifications';
import NotificationItem from './NotificationItem';
import TrackBooking from './TrackBooking';
import Bookings from './Bookings';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MainStackNavigator = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerTitleAlign: 'center',
        title: 'Dashboard',
        headerShown: false,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerRight: () => (
          <Icon.Button
            name="md-notifications"
            size={25}
            color="black"
            fontWeight={700}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.navigate('Notifications');
            }}
          />
        ),
      }}
    />
    <Stack.Screen
      name="Dashboard1"
      component={Dashboard}
      options={{
        headerTitleAlign: 'center',
        title: 'Dashboard',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerRight: () => (
          <Icon.Button
            name="md-notifications"
            size={25}
            color="black"
            fontWeight={700}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.navigate('Notifications');
            }}
          />
        ),
      }}
    />
    <Stack.Screen
      name="Insurance"
      component={Insurance}
      options={{
        headerTitleAlign: 'center',
        title: 'Car Insurance',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerTitleAlign: 'center',
        title: 'Change password',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="Contact"
      component={Contact}
      options={{
        headerTitleAlign: 'center',
        title: 'Contact Us',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="UpdateProfile"
      component={UpdateProfile}
      options={{
        headerTitleAlign: 'center',
        title: 'Update Profile',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="Rewards"
      component={Rewards}
      options={{
        headerTitleAlign: 'center',
        title: 'Rewards',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="Marketplace"
      component={Marketplace}
      options={{
        headerTitleAlign: 'center',
        title: 'Marketplace',
        headerShown: true,
        headerTintColor: 'black',
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="MarketDetail"
      component={MarketDetail}
      options={{
        headerTitleAlign: 'center',
        title: 'Marketplace',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="ScanBarcode"
      component={ScanBarcode}
      options={{
        headerTitleAlign: 'center',
        title: 'Scan Barcode',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="CarAssistance"
      component={CarAssistance}
      options={{
        headerTitleAlign: 'center',
        title: 'Roadside Assistance',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="AddVehicle"
      component={AddVehicle}
      options={{
        headerTitleAlign: 'center',
        title: 'Vehicle',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="AddBenificiary"
      component={AddBenificiary}
      options={{
        headerTitleAlign: 'center',
        title: 'Add Benificiary',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="BenificiaryAdd"
      component={BenificiaryAdd}
      options={{
        headerTitleAlign: 'center',
        title: 'Add Benificiary',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="EditVehicle"
      component={EditVehicle}
      options={{
        headerTitleAlign: 'center',
        title: 'Vehicle',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="VehicleDetail"
      component={VehicleDetail}
      options={{
        headerTitleAlign: 'center',
        title: 'Vehicle',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="Vehicle"
      component={Vehicle}
      options={{
        headerTitleAlign: 'center',
        title: 'My Vehicles',
        headerShown: true,
        headerTintColor: 'black',
        headerRight: () => (
          <Icon.Button
            name="md-add"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.navigate('AddVehicle', {plate: undefined});
            }}
          />
        ),
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="UpdateVehicle"
      component={UpdateVehicle}
      options={{
        headerTitleAlign: 'center',
        title: 'Car Insurance',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="BookService"
      component={BookService}
      options={{
        headerTitleAlign: 'center',
        title: 'Roadside Assistance',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{
        headerTitleAlign: 'center',
        title: 'Notifications',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="NotificationItem"
      component={NotificationItem}
      options={{
        headerTitleAlign: 'center',
        title: 'Notifications',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
    <Stack.Screen
      name="TrackBooking"
      component={TrackBooking}
      options={{
        headerTitleAlign: 'center',
        title: 'Track Booking',
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => (
          <FeatherIcon.Button
            name="arrow-left"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.navigate('Bookings');
            }}
          />
        ),
      }}
    />
    <Stack.Screen
      name="Bookings"
      component={Bookings}
      options={{
        headerTitleAlign: 'center',
        title: 'My Bookings',
        headerShown: true,
        headerLeft: () => (
          <Icon.Button
            name="md-menu"
            size={25}
            color="black"
            iconStyle={{fontWeight: 700}}
            backgroundColor="rgb(250, 204, 4)"
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        ),
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'rgb(250, 204, 4)',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
  </Stack.Navigator>
);
const Main = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <SideBarContent {...props} />}
      unmountOnBlur={true}>
      <Drawer.Screen name="DashboardStack" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
};

export default Main;
