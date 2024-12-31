/****** code by ravi ******/

import React, { Component } from "react";
import {  Text,  } from "native-base";
import {  View, TouchableOpacity, Image,} from "react-native";
import styles from '../Share/styles';
import { Video_Consultation,  } from '../../constants/images';


export default class ShareBAComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }
    
    render() {

        return (
            <View>

            <View style={{ position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 6, backgroundColor: '#fff', paddingHorizontal: 15, }}>

                <View style={{ flexDirection: 'column', height: '100%', }}>
                    <View style={styles.wha_register_container}>
                        <Text style={{ fontSize: 18, color: '#820091',}}>Book Online Appointments  </Text>
                        <Text style={{ fontSize: 30, color: '#333', fontFamily: 'NotoSans-Bold' }}>Online Consulatation  </Text>
                        <Text style={{ fontSize: 18, color: '#676767', letterSpacing: 0.1 }}>{"\u20B9" + "1000 Consultation Fee, includes Audio and Video Calls."}  </Text>

                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '60%' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, alignSelf: 'center',  }}>
                            <Image style={{
                                    resizeMode: "contain", width: 190, height: 190, alignSelf: 'center'
                                }} source={Video_Consultation} />
                        </View>
                        <TouchableOpacity style={{
                                justifyContent: 'space-around',
                                alignItems: 'center', flexDirection: 'row',
                                width: '100%', marginBottom: 10, paddingHorizontal: 10, marginTop: 20
                            }} >
                                
                                <View
                                    onPress={() => {  this.props.RightImageOnClick()}}
                                    style={{ width: '95%', borderRadius: 25, backgroundColor: "#820091", paddingVertical: 10, justifyContent: 'center', alignItems: 'center', }} >
                                    <Text uppercase={true} style={ { fontSize: 15, color: "#fff", fontFamily: 'NotoSans-Bold' }}>Book Appointment</Text>

                                </View>

                            </TouchableOpacity>

                    </View>

                </View>
            </View>

        </View>
        );
    }
}