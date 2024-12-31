import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, FlatList, Image, Dimensions, Modal } from 'react-native';
import { ic_sync_fab, ic_sync_small } from '../../constants/images'
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';
import LinearGradient from 'react-native-linear-gradient';
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
        visible={this.state.showSyncModal}
        ref={"sync"}


      >
        <View style={{
          flex: 1,
          width: '100%',
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0,0,0,0.7)',
            }}>

          {/*Modal View*/}
          <TouchableOpacity style={{
            alignSelf: 'flex-end',
            marginRight: 30, marginBottom: -40,
            justifyContent: 'center', alignItems: 'center', elevation: 12, zIndex: 1,
          }}>
            <Image source={ic_sync_small} style={{ height: 80, width: 80, resizeMode: 'contain' }} ></Image>
          </TouchableOpacity>
          <View style={{

            backgroundColor: "#ffffff",
            borderRadius: 15,

            // padding: 20,
            width: '90%',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}>
            <View style={{ flexDirection: 'column', alignSelf: 'flex-start', width: '100%', padding: 20 }}>
              {/** Title */}
              <Text style={{ color: '#2e2e2e', fontFamily: NotoSans, fontSize: 24, textAlign: 'left', paddingVertical: 10 }}>{"Sync with Prescrip Cloud"}</Text>
              <Text style={{ marginTop: 10, color: '#707070', fontFamily: NotoSans, fontSize: 18, textAlign: 'left' }}>{"Data on this device is not up to date. Please sync to get get the recently added data."}</Text>
              <View style={{ flexDirection: 'row', paddingTop:20,paddingBottom:10, justifyContent: 'space-between', }}>
              <TouchableOpacity 
              onPress={()=>{this.props.hideModal()}}
              style={{
                  alignItems: 'center',
          
                  width: '35%', 
                }} >
                  <LinearGradient
                    colors={["#fff", "#fff"]} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                    style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                    <Text uppercase={true} style={{
                      fontSize: 18, color: "#237ed9", fontFamily: 'NotoSans-Bold'
                    }}>NOT NOW</Text>


                  </LinearGradient>

                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{this.props.syncData();this.props.hideModal()}}
                style={{
                  alignItems: 'center',
                  width: '45%', 
                }} >
                  <LinearGradient
                    colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                    style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                    <Text uppercase={true} style={{
                      fontSize: 18, color: "#fff", fontFamily: 'NotoSans-Bold'
                    }}>SYNC NOW</Text>


                  </LinearGradient>

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
