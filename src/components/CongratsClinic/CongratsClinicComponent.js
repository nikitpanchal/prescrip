/****** code by ravi ******/

import React, { Component } from "react";
import { Text, Container } from "native-base";
import { ic_Orange_BG_578, Clinic_setup_icon } from '../../constants/images'
import {
    ActivityIndicator,
    BackHandler, Platform,
    View, TextInput, FlatList, Linking, TouchableOpacity, ScrollView,
    Share, SafeAreaView, ImageBackground, Image, StyleSheet, Dimensions, StatusBar
} from 'react-native'
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';
var fabRipple = require('../../../assets/Json/verification.json');

// import FooterData from '../Footer/footerData'


export default class CongratsClinicComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />


                <View style={{ flex: 1, backgroundColor: '#f8f8f8' }} >
                    <ImageBackground source={ic_Orange_BG_578} style={{ flex: 0.4, resizeMode: 'contain', width: Dimensions.get('window').width }}>
                        <View style={{
                            flex: 1, paddingHorizontal: 20,
                            alignSelf: Platform.isPad ? 'flex-start' : 'flex-start',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ color: '#ffffff', fontSize: 28, fontFamily: 'NotoSans-Bold', lineHeight: 20, paddingTop: 20  }}>Congratulations!</Text>
                            <Text style={{ color: '#fee8eb', fontSize: 45, lineHeight: 45, fontFamily: 'NotoSans-Bold', paddingTop: 20  }}>{this.props.description}</Text>
                            <Text style={{ fontFamily: 'NotoSans', color: '#ffffff', lineHeight: 20, fontSize: 20 , paddingTop: 20 }}>{this.props.extraData}</Text>

                        </View>
                    </ImageBackground>
                    <View style={{
                        flex: 0.6, backgroundColor: '#f8f8f8', borderTopLeftRadius: 32, borderTopRightRadius: 32,
                        marginTop: 10, justifyContent: 'space-evenly'
                    }}>
                        <LottieView style={{ width: '40%' }}
                            style={{ resizeMode: 'contain', height: 100, alignSelf: 'center', position: 'absolute', top: -20 }}
                            source={fabRipple} loop={false} autoPlay={true} ref={animation => {
                                this.animation = animation;
                            }} />

                        <View style={{
                            justifyContent: 'center', flexDirection: 'column', borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                        }}>
                            <Image style={{
                                resizeMode: "contain", width: 150, height: 140, alignSelf: 'center'
                            }} source={Clinic_setup_icon} />
                            <Text style={{
                                fontFamily: 'NotoSans', textAlign: 'center', marginTop: 20, fontSize: 18, color: '#8d8d8d',
                                letterSpacing: 0.5
                            }} >Your patients can now book{"\n"}appointments at this clinic. Let's{"\n"}share
                                the good news with them </Text>

                        </View>

                    </View>




                </View>


            </View>



        );
    }
}

const styles = StyleSheet.create({
    bgimg: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',

    },
    lott: { resizeMode: 'contain', height: 100, alignSelf: 'center' },
    save: { color: '#ffffff', fontFamily: 'NotoSans-Bold', marginVertical: 10, fontSize: 20, textAlign: 'center' },
    name: { color: '#ffffff', fontSize: 14, marginTop: 10 },
    flatl: { flex: 0.65, backgroundColor: '#f8f8f8', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 10 },
    txtinput: { fontSize: 25, borderBottomColor: '#cccccc', borderBottomWidth: 0.8, fontFamily: 'NotoSans-Bold', color: '#444444' },
    done: { alignSelf: 'flex-end', fontFamily: 'NotoSans', color: '#0065d7', fontSize: 20, margin: 10 },
    itemview: {
        borderBottomColor: '#cccccc', borderBottomWidth: 1, borderLeftColor: '#cccccc', borderLeftWidth: 1,
        borderRightColor: '#cccccc', borderRightWidth: 1, borderRadius: 10, margin: 12
    },
    cardcont: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    dtls: { fontFamily: 'NotoSans', fontSize: 13, color: '#636363', marginLeft: 5 },
    linear_gradient_btn_style: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        borderRadius: 25
    },
    linear_gradient_text_style: {
        textAlign: 'center',
        fontSize: 17,
        color: '#ffffff',
        fontFamily: 'NotoSans-Bold',
        marginEnd: 5
    },

})