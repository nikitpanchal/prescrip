import React, { Component } from 'react';
import {ScrollView, SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ImageBackground, Alert, FlatList, Image, Dimensions, Modal } from 'react-native';
import { ic_sync_fab, ic_sync_small } from '../../constants/images'
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';
import LinearGradient from 'react-native-linear-gradient';
import { PrescripLogo, Landing_Illustration,Landing_Bg_White,intro_bg,intro_billing } from '../../constants/images';

export default class SyncModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showIntroModal}
        ref={"introModal"}

  
      >
        <View style={{
          flex: 1,
          width: '100%',
          justifyContent: "center",
          alignItems: "center",
   
          
            }}>
                <ImageBackground style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    resizeMode: 'cover',
                 
                }} source={intro_bg}>

<SafeAreaView>   
                        <TouchableOpacity style={{ padding: 8, marginTop: 10 }}>
                            <Image source={null} style={{ alignSelf: 'center', marginTop: Platform.OS == 'ios' ? null : 35, resizeMode: 'contain', height: 35, }} />
                        </TouchableOpacity>
                        <ScrollView>

                        <View style={{ marginTop: 35, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ resizeMode: 'contain', height: 228 }} source={intro_billing} />
                            </View>


                            <View style={{ marginHorizontal: 15, marginTop: 80 }}>
                                <Text style={{ fontSize: 25, color: '#fff', fontFamily: 'NotoSans-Bold', alignSelf: 'center', textAlign: 'center' }}>{"Prescrip makes it simple\n to collect online payments\nand manage accounts "}</Text>
                                <Text style={{ marginTop :20, fontSize: 14, color: '#fff', fontFamily: 'NotoSans', alignSelf: 'center', textAlign: 'center' }}>{"Prescrip makes it simple"}</Text>

                            </View> 

                        

                        </ScrollView>

</SafeAreaView>
                </ImageBackground>
                <View style={{ flex: 0.2, flexDirection: 'column',}}>
                    <TouchableOpacity 
                         onPress={() => this.props.showModalData(false)}

                    >
                        <LinearGradient colors={["#07cdf2", "#1b7cdb"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontFamily: 'NotoSans-Bold',marginHorizontal :40, fontSize: 17, color: '#ffffff' }} >TAKE WALKTHROUGH </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                 
                </View>

         
        </View>
      </Modal>
    )
  }
}
