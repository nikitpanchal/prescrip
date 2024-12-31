/****** code by ravi ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import {
    StatusBar, View, TouchableOpacity, Image, Platform,
    ImageBackground, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Alert
} from "react-native";
import styles from '../VideoConsultation/styles';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { Tick_off, Tick, BG, lefticon } from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient'
import { isPhoneno } from "../../commonmethods/validation"
import Images from '../../Theme/Images'

import ToastComponent from '../../components/Toast/toastComponent'

import Toast, { DURATION } from 'react-native-easy-toast'
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class VCWhatsAppNumberComponent_Ipad extends Component {
    constructor(props) {
        super(props);
        this.errorFields = {
            "WhatsappNumber": ""

        };
        let { WANumber } = props.doctorProfile.DoctorData
        this.state = {
            checkedBox: false,
            phonenumber: WANumber ? WANumber : '',
            loading: false,
            isValid: null,
            msg: '',
            show: false,
            description: ''
        }
        this._checkboxsms = 0

    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }

    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }

    proceed() {
        multipleTapHandler.clearNavigator();
        try {
            let _id = this.props.doctorProfile.DoctorData._id
            var phoneValid = isPhoneno(this.state.phonenumber, "Phone Number")
            this.setState({ isValid: phoneValid.isvalid, msg: phoneValid.msg }, () => {
                if (this.state.isValid) {
                    this.props.updateDoctorDetails(this.state.phonenumber, "WANumber", _id).then(response => {
                        if (response.payload.data.status === 1) {

                            this.props.doctorProfile.DoctorData.WANumber = this.state.phonenumber
                            this.props.setDoctorData(this.props.doctorProfile.DoctorData)
                            this.props.navigation.navigate('VCConsultationFeeContainer');

                            return;
                        } else {


                            this.setState({
                                showToast: true,
                                description: "Something went wrong"
                            })

                            setTimeout(() => {
                                this.setState({
                                    showToast: false,
                                    loading: false
                                });

                            }, 2000);
                            return;
                            // alert(response.payload.data.msg)
                        }
                    })
                }
            })
        } catch (error) {
            this.setState({
                showToast: true,
                description: "Somerhing went wrong"
            })

            setTimeout(() => {
                this.setState({
                    showToast: false,
                    loading: false
                });

            }, 2000);
        }


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
    headerback() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }


    render() {
        let dim = Dimensions.get('window')

        return (

            <View style={{ flex: 1, }}>

                <ImageBackground style={styles.container} source={BG}>

                    <StatusBar translucent={true} backgroundColor={'transparent'} />

                    <SafeAreaView style={{ flex: 1 }}>
                    
                        <ScrollView scrollEnabled={(dim.width>dim.height?true:false)} contentContainerStyle={{flex:1,height:'100%',}} keyboardShouldPersistTaps={"handled"}
                        keyboardDismissMode={'on-drag'}>
                                <View style={{ flex: 0.3 }}>


                                    <TouchableOpacity transparent onPress={() => { this.props.navigation.goBack() }} style={[styles.headerIcon, { paddingLeft: 10, }]}>
                                        <Image source={lefticon} style={styles.consult_image_icon} />
                                    </TouchableOpacity>
                                    <View style={[styles.consult_text_view3,{marginTop : 10,flex  : 1}]}>
                                        <Text style={[styles.consult_text,{justifyContent : 'center'}]}>{`What's your \nWhatsapp Number?`}</Text>

                                    </View>

                                </View>
                                <View style={{ flex: 0.6,padding:10, backgroundColor: '#fff',borderTopLeftRadius:20,borderTopRightRadius:20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity style={{ flex: 0.1 }} onPress={() => this.checkboxClick()}>

                                            <Image resizeMode={"contain"} source={this.state.checkedBox ? Tick : Tick_off} style={styles.checkbox_tic_tickoff_style} />

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={{ fontSize: 18, color: '#000000', fontFamily: 'NotoSans' }}>My registered number and my Whatsapp {"\n"}number are the same.</Text>
                                        </View>

                                    </View>
                                    <View>

                                        <Text style={[styles.whatsapp_no__text, { marginTop: 10 }]}>Whatsapp No.</Text>
                                        <View style={{ flexDirection: 'row', borderBottomColor: (this.state.checkedBox ? "" : '#ececec'), borderBottomWidth: (this.state.checkedBox ? 0 : 2), alignItems: 'center' }}>
                                            <TextInput
                                                value="+91"
                                                ref='Duration'
                                                maxLength={3}
                                                keyboardType={"numeric"}
                                                style={styles.textinput_code} />

                                            <TextInput
                                                onChangeText={(num) => this.setState({ phonenumber: num })}
                                                ref='WANumber'
                                                value={this.state.phonenumber}
                                                maxLength={10}
                                                editable={this.state.checkedBox ? false : true}
                                                keyboardType={"numeric"}
                                                style={styles.textinput_number} />

                                        </View >
                                        {!this.state.isValid ? <Text style={{ fontSize: 12, color: "#FF0000", textAlign: 'left' }}>{this.state.msg}</Text> : null}
                                        <View style={styles.note_view}>
                                            <Text style={styles.note_text}>NOTE</Text>
                                            <Text style={styles.number_share}>This number will be shared with your patients to help them whatsapp their previous prescriptions, documents and records to you prior to the Digital Consultation</Text>
                                        </View>



                                    </View>
                                </View>
                                <TouchableOpacity style={{ flex: 0.1, backgroundColor: '#ffffff',justifyContent:'center' }}
                        onPress={() => this.props.navigation.navigate('VCConsultationFeeContainer')}>
                        <LinearGradient
                            colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                            style={styles.linear_gradient_view}>
                            <Text uppercase={true} style={styles.proceed_text}>proceed</Text>


                        </LinearGradient>
                    </TouchableOpacity>
                 </ScrollView>
                
                    </SafeAreaView>
      
                </ImageBackground>


                {
                    this.props.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={"#fafbfe"}
                                imagePath={Images.Info}
                                description={this.props.description}

                            />

                            , 800) : null
                }
                <Toast
                    style={{

                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        width: '90%',
                        backgroundColor: '#d9544f', borderRadius: 15
                    }}

                    ref="toast" />

            </View >

        );
    }
}