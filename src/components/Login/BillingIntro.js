import React, { Component } from 'react'
import {
    View, Text, TextInput, Image, ImageBackground, SafeAreaView, StatusBar, BackHandler, Dimensions,
    StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native'
//import { bg_newLogin, back_button_new, congrats_vc_setup } from '../../constants/images'
import { Button, Container, } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'
import Images from '../../Theme/Images'
import LinearGradient from 'react-native-linear-gradient';
import {userRequestLogout} from '../../actions/auth';
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import { PrescripLogo, Landing_Illustration,Landing_Bg_White } from '../../constants/images';


class LandingScreen extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount(){
        this.props.logout();
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
                }} source={Landing_Bg_White}>
                    <SafeAreaView>
                    <TouchableOpacity  style={{padding:8,marginTop:10}}>
                        <Image source={PrescripLogo} style={{ alignSelf: 'center', marginTop: Platform.OS=='ios'?null:35, resizeMode: 'contain', height: 27, }} />
                    </TouchableOpacity>
                        <ScrollView>
                            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
            <Text style={{ fontSize: 30, color: '#282828', fontFamily: 'NotoSans', alignSelf:'center',textAlign:'center'}}>India's simplest app {"\n"}to give appointments,{"\n"}manage patients & {"\n"}create prescriptions. </Text>

                            </View>
                           
                            <View style={{ marginTop: 35, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ resizeMode: 'contain', height: 228 }} source={Landing_Illustration} />
                            </View>


                        </ScrollView>
                    </SafeAreaView>
                </ImageBackground>
                <View style={{ flex: 0.2, flexDirection: 'column', }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <LinearGradient colors={["#29b62f", "#06d611"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontFamily: 'NotoSans-Bold', fontSize: 17, color: '#ffffff' }} >REGISTER NOW</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center',flexDirection: 'row', }}>

                    <Text style={{ color: '#4a4a4a', alignSelf: 'center', fontSize: 16, fontFamily: 'NotoSans' }}>Already a user? </Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                    <Text style={{ color: '#06b7cc', alignSelf: 'center', fontSize: 16, textDecorationLine: "underline", fontFamily: 'NotoSans' }}>Login</Text>
                                </TouchableOpacity>
                       
                    </View>
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

const mapStateToProps = state => ({
    auth: state.auth,
    
  
  });
  const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userRequestLogout()),
  });
export default connect(
    mapStateToProps,
    mapDispatchToProps)
    (withDb(LandingScreen));