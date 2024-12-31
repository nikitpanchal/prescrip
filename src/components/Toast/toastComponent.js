


/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, Image, ImageBackground, TextInput, ScrollView } from "react-native";
import Images from '../../Theme/Images'


export default class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }


  render() {
    return (


      <View
        style={{
          flexDirection: 'row',  flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20 
        }}
      >

        <Image
          source={this.props.imagePath} style={{ width: 30, height: 30, alignSelf: 'center', marginHorizontal: 5, resizeMode: 'contain' }} />


        <Text style={{ alignSelf: 'center', justifyContent: 'center', fontFamily: 'NotoSans', color: this.props.textColorCode, marginLeft: 20, fontSize: 15 }} >{this.props.description}</Text>

      </View>

    );
  }
}


