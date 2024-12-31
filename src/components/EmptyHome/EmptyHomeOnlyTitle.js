/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, Image, ImageBackground, TextInput, Dimensions } from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBox: false,
      phonenumber: ''
    }
    this._checkboxsms = 0
  }


  onStart() {

    // alert('zx');
  }
  render() {
    return (
      <View
        style={{ flex: 1, marginTop: 50 ,width: Dimensions.get('window').width }}
      >




        <View style={{ justifyContent: 'center', flexDirection: 'column', alignSelf: 'center',width: Dimensions.get('window').width }}>


          <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
            <Text style={[styles.decription, { fontSize: 13, lineHeight: 25, }]}>{this.props.title}</Text>

            <Text style={[styles.title, { fontSize: 15, lineHeight: 15, }]}>{this.props.description}</Text>


          </View>


        </View>
      </View>
    );
  }
}