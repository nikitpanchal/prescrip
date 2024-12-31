/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, Image, ImageBackground, TextInput, ScrollView } from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';
import { prescrip_loader } from '../../constants/images'


export default class prescriptionLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (      
    

      <View style={{ flex :1 ,flexDirection :'column', alignItems :'center',justifyContent :'center' }}>

<LottieView 
                        style ={{height :100}}
                        source={prescrip_loader} loop={true} autoPlay={true} ref={animation => {
                            this.animation = animation;
                        }} />
          <Text style={[styles.title,{fontSize :20,color :'white',marginTop :20}]}>{(this.props.type?' '+this.props.type:'')}</Text>
          
      </View>
    );
  }
}