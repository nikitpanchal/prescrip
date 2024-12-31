//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text,BackHandler } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from '../../Theme/Images'


export default class VideoCunsultingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
  
    
    Item(data) {
        return (
            <TouchableOpacity  style={{backgroundColor :'red'}}
            onPress={() => { this.props.onClick() }} >
                <View style={{ justifyContent: 'center', flexDirection: 'column'}}>
                    <Text style ={{color :'#0066D7',fontSize :24}}>{data.name}</Text>
                </View>

                <View style={{ flex: 1,justifyContent: 'space-between', flex :1, flexDirection: 'row'}}>
                    
                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <Text style ={{color :'#555454',fontSize :16}}>{data.year+" yrs"}</Text>
                    <Text style ={{color :'#555454',fontSize :18}}>{"  |  "}</Text>
                    <Text style ={{color :'#555454',fontSize :16}}>{data.gender}</Text>

                    
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>

                    <Text style ={{color :'#555454',fontSize :14}}>{data.day+" days ago"}</Text>

                    </View>

                </View>
               
            </TouchableOpacity>
        );
    }

    

    render() {
        return (
            
                
               <View
                
                style ={{flex :1, bottomMargin : 'flex-end',justifyContent :'flex-end',flexDirection :'column',}}>

               
                <FlatList

                    data={this.props.data}
                    renderItem={({ item }) => this.Item(item)}
                    keyExtractor={item => item.id} 

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
