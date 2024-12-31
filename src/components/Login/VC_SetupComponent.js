import React, { Component } from 'react'
import { View, Text, ImageBackground, TextInput, SafeAreaView, Dimensions, StatusBar, Image, TouchableOpacity } from 'react-native'
import { Container, Button } from 'native-base'
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient'

class VC_SetupComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            specArray: []
        }



    }




    render() {

        return (
            <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <ImageBackground source={Images.ic_BG} style={{ flex: 1, resizeMode: 'cover' }}>
                <SafeAreaView>
                <View style={{ flex: 0.35, margin: 25,marginTop :Platform.OS == "android" ?  null :null }}>
                        <Text style={{ color: '#ffffff', fontSize: 30, fontFamily: 'NotoSans-Bold' }}>!</Text>
                        <Text style={{ color: '#f7b2ff', fontSize: 45, fontFamily: 'NotoSans-Bold' }}>Video Consultation</Text>
                        <Text style={{ color: '#ffffff', fontSize: 16, fontFamily: 'NotoSans' }}>is now setup</Text>
                    </View>

                    <View style={{ flex: 0.65, backgroundColor: '#f8f8f8', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: 10 }}>
                        <Image source={Images.success} style={{ resizeMode: 'contain', height: 85, alignSelf: 'center', position: 'absolute', top: -40 }} />
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={Images.congrats_vc_setup} style={{ marginTop: 50, resizeMode: 'contain', height: 150 }} />
                            <Text style={{
                                textAlign: 'center', fontSize: 20, alignSelf: 'center',
                                color: "#919191",
                                letterSpacing: 1,
                            }}>Your patients can now book video appointments with you.Lets share the good news with them</Text>
                        </View>


                        <View style={{ marginVertical: 18 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Drawer')}>
                                <LinearGradient colors={["#29b62f", "#06d611"]} start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17, color: '#ffffff' }} >PROCEED</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 15, color: '#757575' }} >No,may be later</Text>
                        </View>
                    </View>
                    </SafeAreaView>
                </ImageBackground>
                
            </View>
        )
    }
}
export default VC_SetupComponent;

