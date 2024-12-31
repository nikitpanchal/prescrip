//   code by ravi
import React, { Component } from "react"
import { View, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'
import { Text } from 'native-base'
import Images from '../../Theme/Images'

export default class PaymentReceiptComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }

  }
  
  render() {

    return (

      <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', paddingHorizontal: 12, paddingBottom:20,}} showsVerticalScrollIndicator={false}>
      
        {this.props.paymentlist()}
        <View style={{ borderBottomColor: '#ececec', borderBottomWidth: 1, flex: 1, height: 1 ,marginVertical:8}}></View>
        {this.props.transactionlist()}
        <View style={{ borderBottomColor: '#ececec', borderBottomWidth: 1, flex: 1, height: 1 ,paddingTop:5}}></View>
         <View style={{paddingTop:20,}}>
      <Text style={{fontSize:11,color:'#888888',fontFamily:'NotoSans',textAlign:'center',paddingBottom:20,}}>Payments may take up to three days to be reflected {'\n'} in your account.Check your or your recipient's bank {'\n'} statement for latest status of your transaction.</Text>
         </View>
      </ScrollView>


    )
  }

}
