import React, { Component } from 'react';

import { View, StyleSheet, Text, TouchableOpacity, Alert,FlatList, Image, Dimensions,Modal } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { ic_sync_fab,ic_sync_small } from '../../constants/images'
import {NotoSans,NotoSans_BoldItalic,NotoSans_Italic,NotoSans_Bold} from '../../constants/font';
import LinearGradient from 'react-native-linear-gradient'
import SyncModal from '../../components/Modal/syncModal';

export default class Settings_Activity extends React.Component {
constructor(props){
  super(props);
  this.state={
    showSyncModal : false
  }
}
showModal(){
  this.setState({
    showSyncModal : true
  });
}
hideModal(){
  this.setState({
    showSyncModal : false
  })
}
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {
          this.state.showSyncModal?<SyncModal
          {...this.props}
          syncData={()=>this.props.screenProps.getRecents()}
          showModal={()=>this.showModal()}
          hideModal={()=>this.hideModal()}>
          </SyncModal>:null
        }
      <Text style={{ marginTop: 50, fontSize: 25 }}>Analysis screen</Text>
        {this.props.screenProps.IsUpdateReq?<FloatingAction
        iconHeight={55}
        iconWidth={55}
        position={"right"}
        color="transparent"
        buttonSize={50}
        floatingIcon={ic_sync_fab}
        overlayColor="transpart"
        distanceToEdge={{ horizontal: 30, vertical: 30 }}
        // actions={this.props.actions}
        onPressMain={() =>this.showModal()}
    />:null}
      </View>
    );  
  }  
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});
