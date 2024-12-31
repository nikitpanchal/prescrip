/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, Image, ImageBackground, TextInput, ScrollView ,Platform} from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';


import {data_not_found} from '../../constants/images';

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

    alert('zx');
  }
  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', }}
      >
      {
        this.props.imagePath !=null?
      
        <View style={{ justifyContent: 'center', flexDirection: 'column', alignSelf: 'center', }}>
          <LottieView
            style={{ height: 150 }}
            source={data_not_found} loop={false} autoPlay={true} ref={animation => {
              this.animation = animation;
            }} />

        </View>
        :null}


{

   // style={{marginTop:Platform.isPad?20:-80,marginLeft:Platform.isPad?-45:0, justifyContent:Platform.isPad?'center': 'flex-end', flexDirection: 'column',width: Platform.isPad?null:165, position:Platform.isPad?null:'absolute', alignSelf:Platform.isPad?'center': 'flex-end', }}>

  this.props.sectionImg ? <View 
  
  style={{justifyContent:'flex-end',

  flexDirection: 'column',width : 165, position:'absolute', alignSelf: 'center',alignItems :'flex-end' }}>
  
  <Image
    source={this.props.sectionImg}
    style={{ resizeMode: 'contain', width: 40,marginRight :20, height: 40,}}
  ></Image>

</View>
:null
}
      

      <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
        <Text style={[styles.title, { fontSize: 20, lineHeight: 30, }]}>{this.props.title}</Text>
        <Text style={[styles.decription, { fontSize: 14, lineHeight: 25, }]}>{this.props.description}</Text>

</View>


      </View>
    );
  }
}