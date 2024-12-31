import React, { Component } from "react";
import SwitchNavigator from "./SwitchNavigator";
import { View, Dimensions } from "react-native";

import MyStackNavigator from "./AppNavigator";

export default class App extends Component {
  render() {
    return (
       
        <MyStackNavigator />
      

    );
  }
}

