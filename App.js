/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Setup from "./src/boot";
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from "react-native-gesture-handler"
import getTheme from "./native-base-theme/components";
import material from "./native-base-theme/variables/material";
import { NativeBaseProvider, Container, extendTheme } from "native-base";

const theme = getTheme(material);
export default class App extends Component {
  render() {
    return (
    
        <GestureHandlerRootView style={{ flex: 1 }}>

          <NativeBaseProvider theme={theme}>

            <MenuProvider>
              <Setup />
            </MenuProvider>

          </NativeBaseProvider>
        </GestureHandlerRootView>
     
    );
  }
}
