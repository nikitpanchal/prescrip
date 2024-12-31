//Tab Example
import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { SafeAreaView, View, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';

const TabScreen = createMaterialTopTabNavigator(
  {
    "Right Eye": { screen: FirstPage },
    "Left Eye": { screen: SecondPage },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#008bdf',
      inactiveTintColor: '#666666',
      upperCaseLabel: false,
      style: {
        backgroundColor: '#fff',

      },
      labelStyle: {
        textAlign: 'center',
        fontSize: 18,


      },

      indicatorStyle: {
        borderBottomColor: '#008bdf',
        borderBottomWidth: 2,
      },
    },
  }
);
//making a StackNavigator to export as default
const TabStack = createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      header: null
    },
  },
});
export default class Tabs extends Component {
  constructor(props) {
    super(props)
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('rgb(34,137,34)')
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' />
      </View>
    )
  }
}
const TabContainer = createAppContainer(TabStack);