import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import Modal from "react-native-modalbox";
import { FloatingAction } from "react-native-floating-action";

export default class CenterModalComponent extends Component {


    bindfloatBtn() {
        var content = this.props.arrayItem.map((item, index) => {
            return (
                <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                    <View style={{flex:0.2}}>
                    <Text style={{ fontSize: 18,  alignItems: 'center', justifyContent: 'center', color: 'tomato' }}>{item.img}</Text>
                    </View>
                    <View style={{flex:0.8}}>
                    <Text style={{ fontSize: 18,  alignItems: 'center', justifyContent: 'center', color: '#000000' }}>{item.name}</Text>
                    </View>
                </TouchableOpacity>

            )
        })
        return content

    }



    openModal() {

        
        this.props.fabClick ? this.refs.modalFloatbtn.open() : null
    }

    render() {
      
        this.openModal()
        return (
           
            <Modal
                useNativeDriver={true}
                animationDuration={200}
                style={{ borderWidth: 0, width: '70%', borderRadius: 10, height: 250,position:'absolute',top:100, overflow: 'hidden', justifyContent: 'center' }}
                ref={this.props.modalName}
                swipeToClose={false}
                position={this.props.position}
                //swipeToClose={this.state.swipeToClose}
                onClosed={() => { this.close }}
                backdropPressToClose={false}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}>
                <View style={{ flex: 1 }}>

                    {this.bindfloatBtn()}
            
                </View>
              
            </Modal>
         
        )
    }
}