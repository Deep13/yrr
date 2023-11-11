import React, {Component, useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {Alert} from 'react-native';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignUpExtra from './components/SignUpExtra';
import SocialSignUp from './components/SocialSignUp';
import ForgotPassword from './components/ForgotPassword';
import Contact from './components/Contact';
import Main from './components/Main';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SocialSignUp"
          component={SocialSignUp}
          options={{
            headerTitleAlign: 'center',
            title: 'Complete Profile',
            headerShown: true,
            headerTintColor: 'black',
            headerLeft: null,
            headerStyle: {
              backgroundColor: 'rgb(250, 204, 4)',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerTitleAlign: 'center',
            title: 'Sign Up',
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
          name="SignUpExtra"
          component={SignUpExtra}
          options={{
            headerTitleAlign: 'center',
            title: 'Additional Details',
            headerShown: true,
            headerLeft: null,
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
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerTitleAlign: 'center',
            title: 'Forgot Password',
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
          name="Contact"
          component={Contact}
          options={{
            headerTitleAlign: 'center',
            title: 'Contact Us',
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
          name="DashboardStack"
          component={Main}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
