/****** code by ravi ******/

import React, { Component } from "react";
import {  Text,  } from "native-base";
import { View,  Image, } from "react-native";
import styles from '../Share/styles';
import {Video_Consultation,} from '../../constants/images';

export default class ShareComponent extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
           
        }

    }
   
  

    render() {

        return (
            <View>

                <View style={{ position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 10, backgroundColor: '#fff', paddingHorizontal: 15, }}>

                    <View style={{ flexDirection: 'column',}}>
                        <View style={{justifyContent: 'flex-start', alignSelf: "flex-start", paddingLeft: 10,flexDirection:'column'}}>
                            <Text style={{ fontSize: 18, color: '#820091', fontFamily: 'NotoSans'   }}>Book Online Appointments  </Text>
                            <Text style={{ fontSize: 30, color: '#333', fontFamily: 'NotoSans-Bold' }}>Online Consulatation  </Text>
                            <Text style={{ fontSize: 18, color: '#676767', letterSpacing: 0.1 }}>{"\u20B9" + "1000 Consultation Fee, includes Audio and Video Calls."}  </Text>

                        </View>
                        <View style={{ flexDirection: 'column', height:'65%',alignItems:'center',justifyContent:'center'}}>
                            <View style={{ justifyContent: 'center', alignItems: 'center',  alignSelf: 'center',  }}>
                                <Image style={{
                                    resizeMode: "contain", width: 200, height: 200, alignSelf: 'center'
                                }} source={Video_Consultation} />
                            </View>
                        </View>

                    </View>

                </View>

            </View>
        );
    }
}