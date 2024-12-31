/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import {ActivityIndicator,
    StatusBar, View, TouchableOpacity, Image, ImageBackground, TextInput, ScrollView, Dimensions
    , KeyboardAvoidingView, SafeAreaView
} from "react-native";
import styles from '../VideoConsultation/styles';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { Tick_off, Tick, BG, lefticon } from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient'
import { isPhoneno } from "../../commonmethods/validation"
import { Images } from "../../Theme";
 


export default class WhatsAppNumber extends Component {
    constructor(props) {
        super(props);

        let { WANumber } = props.doctorProfile.DoctorData
        this.state = {
            checkedBox: false,
            phonenumber: WANumber ? WANumber : '',
            msg: '',
            loading:false,
            isValid: null
        }
        this._checkboxsms = 0

    }

    componentDidMount()
    {
        multipleTapHandler.clearNavigator()
    }
    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
        this.props.navigation.navigate('RegisterVideoConsultation');


            //this.props.navigation.goBack()

    }

    proceed() {
        try {
            this.setState({loading:true})
            var phoneValid = isPhoneno(this.state.phonenumber, "Phone Number")
            this.setState({ isValid: phoneValid.isvalid, msg: phoneValid.msg }, () => {
                if (this.state.isValid) {

                    this.props.updateDoctorDetails(this.state.phonenumber, "WANumber", this.props.doctorProfile.DoctorData._id).then(response => {
                        if (response.payload.data.status === 1) {
                            this.setState({loading:false})
                            this.props.doctorProfile.DoctorData.WANumber = this.state.phonenumber
                            this.props.setDoctorData(this.props.doctorProfile.DoctorData)
                            this.props.navigation.navigate("ConsultationFeeContainer");

                        } else {
                            alert(response.payload.data.msg)
                            this.setState({loading:false})
                        }
                    })
                }
            })

        } catch (error) {
            this.setState({loading:false})
            alert("Something went wrong")
        }

        // this.props.navigation.navigate("ConsultationFeeContainer");
    }

    checkboxClick() {
        let { DoctorMobile, WANumber } = this.props.doctorProfile.DoctorData
        this.setState({ checkedBox: this.state.checkedBox == true ? false : true }, () => {
            if (this.state.checkedBox) {
                this.setState({ phonenumber: DoctorMobile })
            } else {
                this.setState({ phonenumber: WANumber })
            }
        })
    }

    enterPhonenumber(num) {

        this.setState({ phonenumber: num })
    }

    goback() {
        this.props.goBack()
    }



    render() {
        const screenHeight = Dimensions.get('window').height
        const screenWidth = Dimensions.get('window').width

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: undefined, ios: 'padding' })} enabled={Platform.OS == "android" ? false : true}>

                    <ImageBackground style={{ flex: 1, resizeMode: 'cover', height: screenHeight, width: screenWidth }} source={Images.bg_white}>

                    <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent"  />
                    <SafeAreaView>    
                    <View style={{
                            flexDirection: 'column',
                            top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                            marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                        }} >
                            <View style={{ height: 180, width: '100%', }}>
                                <TouchableOpacity transparent onPress={() => this.goback()} style={[styles.headerIcon, { padding: 10 }]}>
                                    <Image source={Images.ic_black_back} style={{ width: 15, height: 20, resizeMode: 'contain' }} />
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'column', paddingLeft: 10, paddingTop: 5 }}>
                                    <Text style={{ fontSize: 35, color: '#905094', fontFamily: 'NotoSans-Bold' }}>What's your</Text>
                                    <Text style={{ fontSize: 35, color: '#905094', fontFamily: 'NotoSans-Bold' }}>Whatsapp Number?</Text>
                                </View>
                            </View>
                        </View>
                        </SafeAreaView>
                        <View style={{ position: 'relative', width: '100%', justifyContent: 'center', marginTop: -19,  paddingVertical: 10, paddingHorizontal: 15 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ height: '100%', height: screenHeight }}>
                                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                        <TouchableOpacity style={styles.check_box_style} onPress={() => this.checkboxClick()}>

                                            <View style={styles.check_box_image_container}>

                                                <Image resizeMode={"contain"} source={this.state.checkedBox ? Tick : Tick_off} style={styles.checkbox_tic_tickoff_style} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.wha_register_container}>
                                            <Text style={styles.wha_register_text}>My registered number and my Whatsapp {"\n"}number are the same.</Text>
                                        </View>
                                        

                                    </View>

                                    <View style={{ justifyContent: 'flex-start', paddingTop: 40, flexDirection: "column", }}>
                                        <Text style={{ color: '#929292', fontSize: 15, paddingBottom: 3 }}>Whatsapp No.</Text>
                                        <View style={{ flexDirection: 'row', borderBottomColor: (this.state.checkedBox ? "" : '#ececec'), borderBottomWidth: (this.state.checkedBox ? 0 : 2), alignItems: 'center' }}>
                                            <TextInput
                                                value="+91"
                                                ref='Duration'
                                                maxLength={3}
                                                keyboardType={"numeric"}
                                                style={styles.textinput_code} />

                                            <TextInput
                                                onChangeText={(num) => this.enterPhonenumber(num)}
                                                ref='WANumber'
                                                value={this.state.phonenumber}
                                                editable={this.state.checkedBox ? false : true}
                                                maxLength={10}
                                                keyboardType={"numeric"}
                                                style={styles.textinput_number}/>
                                        </View >
                                        {!this.state.isValid ? <Text style={{ fontSize: 12, color: "#FF0000", textAlign: 'left' }}>{this.state.msg}</Text> : null}
                                        <View style={{ justifyContent: 'flex-start', paddingTop: 20 }}>
                                            <Text style={{ color: "#000", fontFamily: 'NotoSans-Bold', marginBottom: 5, fontSize: 19 }}>NOTE</Text>
                                            <Text style={{ color: '#929292', fontFamily: 'NotoSans', justifyContent: 'flex-start', fontSize: 14, paddingRight: 10, letterSpacing: 0.5, }}>This number will be shared with your patients to help them whatsapp their previous prescriptions, documents and records to you prior to the Digital Consultation</Text>
                                        </View>


                                    </View>
                                </View>
                            </ScrollView>
                        </View>



                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            width: '100%', marginBottom: 20, paddingHorizontal: 10, zIndex: 0, bottom: 0,

                        }} onPress={() => this.proceed()}>
                            <LinearGradient
                                colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                                style={{ width: '95%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                                <Text uppercase={true} style={{
                                    fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold'
                                }}>proceed</Text>
                                {this.props.loading ? <ActivityIndicator size="small" color="#fff" /> : null}

                            </LinearGradient>

                        </TouchableOpacity>



                    </ImageBackground>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

