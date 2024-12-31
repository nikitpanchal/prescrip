import React, { Component } from 'react'
import {
    View, Text, TextInput, Image, ImageBackground, SafeAreaView, StatusBar, BackHandler, Dimensions,
    StyleSheet, TouchableOpacity, KeyboardAvoidingView,Platform
} from 'react-native'
//import { bg_newLogin, back_button_new, congrats_vc_setup } from '../../constants/images'
import { Button, Container, } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient'


export default class VideoConsultation extends Component {

    constructor(props) {
        super(props)

    }

    _handleBackPress() {

        this.props.navigation.navigate("RegisterSpecialization");

        return true;
    }


    registerLater() {
        let docData = { ...this.props.doctorProfile.DoctorData };
        let doc_id = docData._id;
        let features = [2];
        this.props.updateDoctorDetails(0, "DigitalConsult", doc_id).then(response => {
            docData.DigitalConsult = 0;
            this.props.setDoctorData(docData);
            this.props.navigation.navigate('RegistrationSuccess');
        });

    }
    render() {

        return (
            <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />

                <ImageBackground style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    resizeMode: 'cover',
                    backgroundColor: '#fff'
                }} source={Images.bg_white} >
<SafeAreaView>
                    <TouchableOpacity onPress={() => this._handleBackPress()} style={{padding:8}}>
                        <Image source={Images.ic_black_back} style={{ alignSelf: 'flex-start', marginTop: Platform.OS=='ios'?null:35, resizeMode: 'contain', height: 20 }} />
                    </TouchableOpacity>
                    <ScrollView>
                        <View style={{ marginHorizontal: 15, marginTop: 8 }}>
                            <Text style={{ fontSize: 35, fontWeight: '600', color: '#905094', fontFamily: 'NotoSans-Bold' }}>Let's Activate{"\n"}Video Consulting?</Text>

                        </View>
                        <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                          {!Platform.isPad?  <Text style={{
                                fontSize: 21,
                                color: "#919191",
                                fontFamily: 'NotoSans',
                                letterSpacing: 1,


                            }}>Minimise travel, support social {"\n"}distancing, higher productivity, {"\n"}comfortable and easy for {"\n"}your patients</Text>:
                              <Text style={{
                                fontSize: 21,
                                color: "#919191",
                                fontFamily: 'NotoSans',
                                letterSpacing: 1,


                            }}>Minimise travel, support social distancing, higher productivity, comfortable and easy for your patients</Text>}
                        </View>
                        <View style={{ marginTop: 35, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ resizeMode: 'contain', height: 228 }} source={Images.congrats_vc_setup} />
                        </View>


                    </ScrollView>
                    </SafeAreaView>
                </ImageBackground>
                <View style={{ flex: 0.2, flexDirection: 'column', }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('App')}>
                        <LinearGradient colors={["#29b62f", "#06d611"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontFamily: 'NotoSans-Bold', fontSize: 17, color: '#ffffff' }} >GET STARTED</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.registerLater()}>
                            <Text style={{ textAlign: 'center', marginTop: 10, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 15, color: '#757575' }} >No, may be later</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    imgBG: {
        flex: 1,
        resizeMode: "cover",
    },
    button: {
        width: '70%',
        height: 45,
    },
    text: {
        color: 'white',
        fontSize: 16
    }
})