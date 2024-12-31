/* created by ruban 
 otp component */
import React, { Component } from 'react'
import {
        View, Text, ImageBackground, Dimensions, ActivityIndicator, Platform,
        KeyboardAvoidingView, TextInput, SafeAreaView, StatusBar, Image, TouchableOpacity
} from 'react-native'
import { userLoginSuccess, userOTPVerification, setToken } from '../../actions/auth'
import { setDoctorData } from '../../actions/doctorProfile'
import { Container, Input } from 'native-base';
import { connect } from 'react-redux'
import Images from '../../Theme/Images'
import { CountDown } from 'react-native-countdown-component'

import ToastComponent from '../Toast/toastComponent'

import Toast, { DURATION } from 'react-native-easy-toast'
class OTP extends Component {
        constructor(props) {
                super(props)
                const { mobileNo, doctorid } = props.auth
                this.state = {
                        hideTimer: false,
                        restart: true,
                        otp: [],
                        loading: false,
                        mobile: mobileNo,

                        doctorID: doctorid
                }
                this.otpTextInput = [];

        }



        render() {
                const mobile = this.props.mobile

                return (
                        <View contentContainerStyle={{ flex: 1 }}
                                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />
                                <ImageBackground source={Images.bg_white} style={{
                                        flex: 1,
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height,
                                        resizeMode: 'cover',
                                        backgroundColor: '#fff'
                                }}>

                                        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={20} behavior={Platform.select({ android: undefined, ios: 'padding' })} enabled={Platform.OS == "android" ? false : true}>
                                                <View style={{ marginTop: 10, marginHorizontal: 18 }}>

                                                        <Text style={{ fontSize: 35, color: '#905094', fontFamily: 'NotoSans-Bold', marginTop: 40 }}>{this.props.title}</Text>
                                                        {Platform.isPad ? null : <Text style={{ color: '#4a4a4a', fontSize: 18, marginTop: 20, fontFamily: 'NotoSans' }}>{this.props.text}</Text>}
                                                        <View style={{ flexDirection: 'row' }}>
                                                                {Platform.isPad ? <Text style={{ color: '#4a4a4a', fontSize: 18, marginTop: (Platform.isPad ? null : 20), fontFamily: 'NotoSans', alignSelf: 'center' }}>{this.props.text}</Text> : null}
                                                                <Text style={{ color: '#4a4a4a', fontSize: 18, fontFamily: 'NotoSans' }}>sent to</Text>
                                                                <Text style={{ color: '#040404', fontSize: 18, fontWeight: 'bold', marginLeft: 5, fontFamily: 'NotoSans' }}>{"+91 " + mobile}</Text>
                                                                <TouchableOpacity onPress={this.props.change}>
                                                                        <Text style={{ color: '#06b7cc', fontSize: 18, textDecorationLine: "underline", marginLeft: 8, fontFamily: 'NotoSans' }}>Change</Text>
                                                                </TouchableOpacity>
                                                        </View>
                                                </View>

                                                <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                                        {this.props.renderOtp}
                                                </View>

                                                {this.props.restart && !this.props.hideTimer ? <View style={{ flexDirection: 'row', marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: 16, color: '#757575', fontFamily: "NotoSans", fontFamily: 'NotoSans' }}>Enter your code in</Text>

                                                        <CountDown
                                                                style={{ padding: 0, flexDirection: 'row' }}
                                                                digitStyle={{ padding: 0, margin: 0 }}
                                                                digitTxtStyle={{ fontSize: 15, color: '#757575', fontFamily: "NotoSans" }}
                                                                until={30} timeToShow={['M', 'S']} size={14}
                                                                timeLabels={{ m: null, s: null }}
                                                                timeLabelStyle={{}}
                                                                showSeparator
                                                                sRemaining={1000 * 30} onFinish={this.props.finish} allowFontScaling={true} />

                                                </View>
                                                        : null}
                                                {!this.props.restart && this.props.hideTimer ? <View style={{ marginTop: 100, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                                        <Text style={{ color: '#4a4a4a', fontSize: 18, fontFamily: 'NotoSans' }}>{this.props.attempt == 2 ? "Send OTP to your email id ?" : "Didn't receive OTP ?"} </Text>
                                                        <Text onPress={this.props.resend} style={{ color: '#06b7cc', fontSize: 18, textDecorationLine: "underline", fontFamily: 'NotoSans' }}>Resend</Text>
                                                </View> : null}

                                        </KeyboardAvoidingView>
                                </ImageBackground>

                                {
                                        this.props.showToast ?
                                                this.refs.toast.show(


                                                        <ToastComponent
                                                                {...this.props}

                                                                textColorCode={this.props.toastTextColor}
                                                                imagePath={this.props.toastImgPath}
                                                                description={this.props.description}

                                                        />

                                                        , 1500) : null
                                }
                                <Toast
                                        style={{
                                                shadowColor: '#fff',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.8,
                                                shadowRadius: 2,
                                                elevation: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '90%',

                                                backgroundColor: this.props.toastBgColor, borderRadius: 15
                                        }}

                                        ref="toast" />
                        </View>
                )
        }
}
const mapStateToProps = state => ({
        auth: state.auth,

});
const mapDispatchToProps = dispatch => ({
        userLoginSuccess: (mobile) => dispatch(userLoginSuccess(mobile)),
        userOTPVerification: (doctorid, otp) => dispatch(userOTPVerification(doctorid, otp)),
        setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
        setToken: (token) => dispatch(setToken(token))
})
export default connect(
        mapStateToProps,
        mapDispatchToProps
)((OTP));
