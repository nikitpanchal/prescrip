/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { RefreshControl, View, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
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

    alert('zx');
  }
  render() {
    return (

      <ScrollView style={{ flex: 0, height: 0 }}

        refreshControl={
          <RefreshControl refreshing={this.props.refreshing ? this.props.refreshing : false} onRefresh={() => { this.props.refreshEvent ?
            this.props.refreshEvent() : null }} />
        }>

        <View style={{ flex: 1, width: Dimensions.get('window').width, }}>



          <View style={{
            flexDirection: 'column', alignSelf: 'center', marginTop: this.props.topmargin ?
              this.props.topmargin : null
          }}>

            {
              this.props.isLottie
                ?
                <LottieView
                  style={{ height: 150 }}
                  source={this.props.imagePath} loop={true} autoPlay={true} ref={animation => {
                    this.animation = animation;
                  }} /> :
                <Image
                  source={this.props.imagePath}
                  style={{ resizeMode: 'contain', height: 150 }}
                ></Image>
            }
          </View>
          <View style={{ flexDirection: 'column', alignSelf: 'center', flex: 0.7 }}>
            <Text style={[styles.title, { fontSize: 20, lineHeight: 30, }]}>{this.props.title}</Text>
            <Text style={[styles.decription, { fontSize: 13, lineHeight: 25, }]}>{this.props.description}</Text>


            {
              this.props.isShowButton ?

                <TouchableOpacity
                  style={{ marginTop: 15, marginBottom: 15, flexDirection: 'column', alignItems: 'center', alignSelf: 'center', borderColor: this.props.colorCode, borderRadius: 70, borderWidth: 2 }}

                  onPress={() => { this.props.onClick() }} >



                  <Text

                    style={{
                      fontSize: 16,
                      color: this.props.colorCode,
                      fontFamily: "NotoSans-Bold",
                      textAlign: 'center',
                      paddingLeft: 40,
                      paddingTop: 5,
                      paddingBottom: 5,

                      paddingRight: 40,

                      alignSelf: 'center'
                    }
                    }
                  >{this.props.getStarted ? this.props.getStarted : 'GET STARTED'}</Text>




                </TouchableOpacity> : null
            }


          </View>


        </View>
      </ScrollView>
    );
  }
}