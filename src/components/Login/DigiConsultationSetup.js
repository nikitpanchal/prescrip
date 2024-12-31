import React, { Component } from 'react'
import { View, Text, ImageBackground, Dimensions, SafeAreaView, FlatList, StatusBar, Image, TouchableOpacity, Platform } from 'react-native'
import { Container, Button } from 'native-base'
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient'
var fabRipple = require('../../../assets/Json/verification.json');
import LottieView from 'lottie-react-native';

import { StackActions, CommonActions } from '@react-navigation/native';

class DigiConsultationSetup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            specArray: []
        }



    }

    componentDidMount() {
        this.props.setVideoConsultationRegister(false)
    }


    render() {

        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />

                <ImageBackground source={Images.ic_BG} style={{ flex: 1, resizeMode: 'contain', height: '50%' }}>
                    <View style={{ flex: 0.35, margin: 25, marginTop: Platform.OS == "android" ? null : 35 }}>
                        <Text style={{ color: '#ffffff', fontSize: 30, fontFamily: 'NotoSans-Bold' }}>Congratulations!</Text>
                        <Text style={{ color: '#f7b2ff', fontSize: 45, fontFamily: 'NotoSans-Bold' }}>Video {"\n"}Consultation</Text>
                        <Text style={{ color: '#ffffff', fontSize: 16, fontFamily: 'NotoSans' }}> is now setup</Text>
                    </View>

                    <View style={{ flex: 0.65, backgroundColor: '#f8f8f8', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: 10, justifyContent: 'space-around' }}>

                        <LottieView style={{ width: '40%', paddingBottom: 5 }}
                            style={{ resizeMode: 'contain', height: 100, alignSelf: 'center', position: 'absolute', top: (Platform.OS == "android" ? -25 : -17) }}
                            source={fabRipple} loop={false} autoPlay={true} ref={animation => {
                                this.animation = animation;
                            }} />


                        <View style={{ alignItems: 'center', justifyContent: 'space-evenly', marginTop: 70, }}>
                            <Image source={Images.congrats_vc_setup} style={{ resizeMode: 'contain', width: 150, height: 130, }} />
                            <Text style={{
                                textAlign: 'center', fontSize: 20, alignSelf: 'center',
                                color: "#919191",
                                letterSpacing: 1, paddingVertical: 10
                            }}>Your patients can now book video {"\n"}appointments with you. Let's {"\n"}share the good news with them</Text>
                        </View>


                    </View>
                </ImageBackground>

                <View style={{ flex: 0.2, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DoctorProfileViewContainer')}>
                        <LinearGradient colors={["#29b62f", "#06d611"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontFamily: 'NotoSans-Bold', fontSize: 17, color: '#ffffff' }} >PROCEED</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.nevigateFrom != 'vc' ? this.props.navigation.navigate('RegistrationSuccess') :

                            
                                this.props.navigation.dispatch(CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Drawer' }]

                                }))
                        }>
                            <Text style={{ textAlign: 'center', marginTop: 10, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 15, color: '#757575' }} >No, may be later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
export default DigiConsultationSetup;

