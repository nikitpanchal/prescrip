//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text,BackHandler,AsyncStorage } from "react-native"

import Images from '../../Theme/Images'
import moment from 'react-moment';
import { getDateDiffFromToday } from "../../commonmethods/validation";
import {calculateAge} from '../../commonmethods/common';

export default class VideoCunsultingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


  

    
    Item(data,index) {
        let p_age=calculateAge(data.PatientMaster.CommonDetails.DOB,false);
        return (
            <TouchableOpacity  style={styles.content_container}
            onPress={() => { this.props.pendingVCitemClick(data) }}
          
            >
                <View style={{ justifyContent: 'center', flexDirection: 'column'}}>
                    <Text style ={{color :'#0066D7',fontSize :24}}>{data.PatientMaster.CommonDetails.FullName}</Text>
                </View>

                <View style={{ flex: 1,justifyContent: 'space-between', flexDirection: 'row'}}>
                    
                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <Text style ={{color :'#555454',fontSize :16}}>{p_age.value.toString()+" "+p_age.units}</Text>
                    <Text style ={{color :'#555454',fontSize :18}}>{"  |  "}</Text>
                    <Text style ={{color :'#555454',fontSize :16}}>{data.PatientMaster.CommonDetails.Gender}</Text>

                    
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>

                    <Text style ={{color :'#555454',fontSize :14}}>{ getDateDiffFromToday(data.WhenEntered) ==0 ?'Today': getDateDiffFromToday(data.WhenEntered) ==1 ?'Yesterday': getDateDiffFromToday(data.WhenEntered)+" days ago"}</Text>

                    </View>

                </View>
               
            </TouchableOpacity>
        );
    }


    onViewableItemsChanged = ({ viewableItems, changed }) => {
        
      }


    onScrollEndDrag(){

     //   alert('dgd');
    }
    handleScroll = (event) => {
        let index = Math.ceil(
            event.nativeEvent.contentOffset.y / 90
          );
         
          this.props.topItem(index)


          
       
    }


    render() {
        return (
            <View style={{ flex: 1,top :-20 }}>
                
                 
                <FlatList
                    data={this.props.data}
                    extraData ={this.props.isRefresh}
                    renderItem={({item, index}) => this.Item(item, index)}
                    onRefresh={() => { this.props.refreshEvent() }} 
                    keyExtractor={(item, index) => 'vcc' + index.toString()} 
                    onScroll={this.handleScroll}
                    refreshing={this.props.refreshing}
                    onScrollEndDrag ={()=>this.onScrollEndDrag()}
                 
                   
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view_style: {
        flexDirection: "row",
        backgroundColor: '#008be0',
        height: 60
    },
    Optometry_Record: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: 'bold',
        textAlign: 'left'
    },
    step_2_5: {
        fontSize: 12,
        color: '#ffffff'
    },
    Next: {
        height: 18,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain'

    },
    content_container: {
        flexDirection: "column",
        paddingVertical: 20,
        paddingHorizontal :10,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    content_color: {
        color: '#383838',
        fontWeight: "600",
        fontSize: 16
    },
    Next_blue: {
        height: 15,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain',

    }
});
