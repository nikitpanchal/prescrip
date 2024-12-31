/****** code by Sourabh ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import {
  StatusBar, View, TouchableOpacity, SafeAreaView,
  Image, ImageBackground, Dimensions, ScrollView, Platform
} from "react-native";
import Images from '../../Theme/Images'
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../Tooltips'


//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (Congrats screen)
//5.progress bar ,title ,description

export default class PrescriptionHeader extends Component {
  constructor(props) {
    super(props);


    this.state = {
      checkedBox: false,
      phonenumber: '',
      search: ""
    }
    this._checkboxsms = 0
  }



  changeData(text) {
    this.setState({ text });
    this.props.searchAction(text);
  }
  render() {
    const { search } = this.state;

    return (

      <View style={{
        justifyContent: 'center', flexdirection: 'row',
        width: Dimensions.get('window').width,
        borderBottomWidth: this.props.callFrom == "fav" ? 0 : 1, borderBottomColor: '#d9d9d9',

      }}>
        <ImageBackground style={{ width: '100%', backgroundColor: this.props.bgColor }} source={this.props.bgImage}>

          <View style={{
            flexDirection: 'column',
            top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
            marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,



          }} >
            <SafeAreaView >


              <View style={{ width: '100%'}}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>


                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 0.8 }}>


                    <TouchableOpacity
                      onPress={() => { this.props.OnClick('left') }}
                      style={{ padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                      <Image style={{
                        resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                      }} source={this.props.leftImage} />


                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}
                      onPress={() => { this.props.OnClick('left') }}>

                      <View
                        style={{ paddingHorizontal: 10, paddingVertical: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                        {
                          !this.props.isShowTitle ? null :
                            <Text style={{ fontFamily: 'NotoSans', color: this.props.titleColor, fontSize: this.props.titleSize ? this.props.titleSize : 12, alignSelf: 'flex-start' }}>{this.props.title}</Text>

                        }


                        <Text style={{ fontFamily: 'NotoSans', color: this.props.descriptionColor, fontSize: this.props.descriptionSize ? this.props.descriptionSize : 20, alignSelf: 'flex-start' }}>{this.props.description}</Text>

                      </View>




                    </View>

                  </View>


                  {
                    !this.props.issecondRightImage ? null :

                      <TouchableOpacity
                        onPress={() => { this.props.OnClick('secondRight') }}

                        style={{ padding: 5, flex: 0.1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                        <Image style={{
                          resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 25
                        }} source={this.props.secondRightImage} />

                      </TouchableOpacity>

                  }



                  <TouchableOpacity
                    onPress={() => { this.props.OnClick('right') }}
                    style={{ padding: 5, flex: 0.1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                    <Image style={{
                      resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                    }} source={this.props.rightImage} />

                  </TouchableOpacity>



                </View>




              </View>

            </SafeAreaView>
          </View>
        </ImageBackground>

      </View>


    );
  }
}









