/****** code by ravi ******/
import React, { Component } from "react";
import { Container, Text, Icon, Button } from "native-base";
import {
    ActivityIndicator,
    StatusBar, BackHandler, View, TouchableOpacity, Image, ImageBackground,
    TextInput, ScrollView, Dimensions, KeyboardAvoidingView, SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from '../VideoConsultation/styles';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import LinearGradient from 'react-native-linear-gradient'
import Images from '../../Theme/Images'
import { setVideoConsultationRegister } from '../../actions/auth'
import { updateConsultationFee } from '../../actions/vc_VideoConsultation'
import { setDoctorData, setVideoConsult } from '../../actions/doctorProfile'
import { connect } from 'react-redux'



import ToastComponent from '../../components/Toast/toastComponent'
import Toast from 'react-native-easy-toast';

class VCConsultationFeeComponent extends Component {
    constructor(props) {
        super(props);
        var { _id, ConsultFee, FollowupFee, ShortUrl } = props.doctorProfile.DoctorData
        var { conFee, techFee } = props.doctorProfile.DoctorFees
        this.state = {
            show: false,
            doctorId: _id,
            consult_text: ConsultFee ? parseFloat(ConsultFee) : .0,
            follow_text: FollowupFee ? parseFloat(FollowupFee) : .0,
            url: ShortUrl,
            conFee: conFee,
            techFee: techFee,
            totalfees: techFee + conFee,
            finalConsult: (isNaN(ConsultFee) ? 0 : (ConsultFee - (ConsultFee * conFee / 100) - techFee) < 0.0 ? 0.0 : ConsultFee - (ConsultFee * conFee / 100) - techFee),
            finalFollowup: (isNaN(FollowupFee) ? 0 : (FollowupFee - (ConsultFee * conFee / 100) - techFee) < 0.0 ? 0.0 : FollowupFee - (ConsultFee * conFee / 100) - techFee),
            followshow: false,
            hasFocus: false,
            borderColor: '',
            color: '',
            opacity: 0.5,
            backgroundColor: '',
            donevisible: false,
            selectionConsult: { start: ConsultFee ? ConsultFee.length : 0, end: ConsultFee ? ConsultFee.length : 0 },
            selectionFollowup: { start: FollowupFee ? FollowupFee : 0, end: FollowupFee ? FollowupFee : 0 },


        }
        this._checkboxsms = 0

    }

    showCancel = () => {
        this.setState({ show: true, followshow: true })
    };

    hideCancel = () => {
        this.setState({ show: false, followshow: false })
    };




    validateConsultFee(fee) {
        let { conFee, techFee } = this.props.doctorProfile.DoctorFees

        this.setState({ consult_text: fee });
        let fees = fee == "" ? 0 : parseFloat(fee).toFixed(2) - (parseFloat(fee).toFixed(2) * conFee / 100) - techFee

        if (fees <= 0) {
            this.setState({ finalConsult: 0 })

        } else {
            this.setState({ finalConsult: fees.toFixed(2) })
        }
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
        this.props.setVideoConsultationRegister(false)
    }

    validateFollowUpFee(fee) {
        let { conFee, techFee } = this.props.doctorProfile.DoctorFees

        this.setState({ follow_text: fee, borderColor: this.state.follow_text });
        let fees = fee == "" ? 0 : parseFloat(fee).toFixed(2) - (parseFloat(fee).toFixed(2) * conFee / 100) - techFee

        if (fees <= 0) {
            this.setState({ finalFollowup: 0 })
        } else {
            this.setState({ finalFollowup: fees.toFixed(2) })
        }
    }

    onClick() {
        if (parseFloat(this.state.consult_text) < parseFloat(this.state.follow_text)) {
            this.refs.toast.show(


                <ToastComponent
                    {...this.props}

                    textColorCode={"#fffefe"}
                    imagePath={Images.Error}
                    description={"Followup fee must be less than consultation fee"}

                />

                , 1500)



            // Alert.alert("Prescrip", "Followup fee must be less than consultation fee")
        } else {
            const val = AsyncStorage.getItem('token')
            this.setState({ loading: true })
            if (this.state.consult_text == 0 || this.state.consult_text > 0) {

                this.props.updateConsultationFee(this.state.doctorId, parseFloat(this.state.consult_text),
                    parseFloat(this.state.follow_text), this.state.url).then(response => {
                        if (response.payload.data.status == 1) {
                            this.setState({ loading: false })
                            this.props.doctorProfile.DoctorData.ConsultFee = parseFloat(this.state.consult_text)
                            this.props.doctorProfile.DoctorData.FollowupFee = parseFloat(this.state.follow_text)
                            this.props.doctorProfile.DoctorData.DigitalConsult = 1;
                            //this.props.doctorProfile.DoctorData.DoctorFeatures = doctorFeatures;


                            this.props.setDoctorData(this.props.doctorProfile.DoctorData)

                            this.props.navigation.navigate('DigiConsultationSetupContainer',
                                {
                                    nevigateFrom: 'login',
                                }
                            )

                            //  this.props.navigation.navigate('DigiConsultationSetupContainer');



                        }
                    })
            }
        }

    }

    onFocus() {
        this.setState({
            borderColor: '#0c9bad', color: '#333', opacity: 1, backgroundColor: '#10a9e8', donevisible: true, hasFocus: false
        })
    }

    onBlur() {
        this.setState({
            borderColor: '#8c8c8c', color: '#d8d8d8', backgroundColor: '#c1c1c1', donevisible: false, hasFocus: true
        })
    }




    showConsultationBreakup() {
        if (this.state.show) {
            return (
                <TouchableOpacity style={{ flexDirection: 'column', paddingVertical: 8 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={{ color: "#333", marginBottom: 5, fontSize: 13 }}>{"-"} Payment Gateway Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + this.state.conFee}  </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 15 }}>
                        <Text style={{ color: "#333", marginBottom: 5, fontSize: 13 }}>{"-"} Technology Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + this.state.techFee} </Text>

                        </View>
                    </View>
                </TouchableOpacity>


            );

        }
        return null;

    }
    showfollowBreakup() {
        if (this.state.followshow) {
            return (
                <TouchableOpacity style={{ flexDirection: 'column', paddingVertical: 8 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={{ color: "#333", marginBottom: 5, fontSize: 13 }}>{"-"} Payment Gateway Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + this.state.conFee}  </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={{ color: "#333", marginBottom: 5, fontSize: 13 }}>{"-"} Technology Fee</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + this.state.techFee}  </Text>
                        </View>
                    </View>
                </TouchableOpacity>

            );

        }
        return null;

    }

    goback() {
        this.props.navigation.goBack()
    }
    setSelection = () => {
        this.setState({ selectionConsult: { start: this.state.consult_text.length, end: this.state.consult_text.length } });
    }
    setFollowSelection = () => {
        this.setState({ selectionFollowup: { start: this.state.follow_text.length, end: this.state.follow_text.length } });
    }
    render() {
        const screenHeight = Dimensions.get('window').height
        const screenWidth = Dimensions.get('window').width
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled={Platform.OS == "android" ? false : true}>

                    <ImageBackground style={{ flex: 1, resizeMode: 'cover', height: screenHeight, width: screenWidth }} source={Images.bg_white}>
                        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />
                        <SafeAreaView>
                            <View style={{
                                height: 45, alignItems: 'center', top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                                marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                            }}>
                                <View style={{ flex: 1, flexDirection: "row", paddingRight: 10, height: 45, justifyContent: 'center', alignItems: 'center' }} >
                                    <View style={{ flexDirection: 'row', flex: 1, }}>
                                        <TouchableOpacity transparent onPress={this.props.back} style={[styles.headerIcon, { padding: 10, }]}>
                                            <Image source={Images.ic_black_back} style={{ width: 15, height: 20, marginHorizontal: 5, resizeMode: 'contain' }} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                        <View style={{ flexDirection: 'column', }}>
                            <View style={{ height: 160, width: '100%', flexDirection: 'column', }}>
                                <View style={{ flexDirection: 'column', marginHorizontal: 15, }}>
                                    <Text style={{ color: '#905094', fontWeight: 'bold', fontSize: 35, fontFamily: 'NotoSans-Bold' }}>What's your</Text>
                                    <Text style={{ color: '#905094', fontWeight: 'bold', fontSize: 35, fontFamily: 'NotoSans-Bold' }}>Consulting Fee?</Text>
                                    <Text style={{ color: '#905094', fontWeight: 'bold', fontSize: 20, fontFamily: 'NotoSans' }}>Fee per Video Consultation</Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                            <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }} >
                                <View elevation={5} style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                                    <Text style={{ fontSize: 18, color: '#bbbbbb' }}>Consultation fee</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0c9bad', height: 70, }}>
                                        <Text style={{ fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', color: '#929292', fontFamily: 'NotoSans-Bold' }} >{"\u20B9"}</Text>
                                        <TextInput
                                            onChangeText={(consult_text) => this.validateConsultFee(consult_text)}
                                            ref='ConsultationFee'
                                            defaultValue={String(this.state.consult_text)}
                                            maxLength={6}
                                            onFocus={() => this.state.consult_text == "0" ? this.setState({
                                                consult_text: ""
                                            }) : null}
                                            selection={this.state.selectionConsult}
                                            onSelectionChange={() => this.setSelection()}
                                            keyboardType={"numeric"}
                                            style={{ textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' }}
                                        />
                                    </View>

                                    {this.showConsultationBreakup()}

                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }} onPress={() => this.setState({ show: this.state.show == true ? false : true })}>
                                        <Text style={{ color: "#333", fontFamily: 'NotoSans-Bold', marginBottom: 5, fontSize: 19 }}>You will receive</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Text style={{ color: '#404040', fontSize: 18, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + 123} </Text> */}
                                            <Text style={{ color: '#333', fontSize: 19, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}> {"\u20B9 " + (this.state.consult_text == 0 || this.state.consult_text == "NaN" ? 0 : parseFloat(this.state.finalConsult).toFixed(2))} </Text>
                                            <Image source={this.state.show ? Images.ic_up_arrow : Images.ic_info_blue} style={{ resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 }} />


                                        </View>


                                    </TouchableOpacity>

                                </View>




                            </View>
                            {this.state.consult_text > 0 && this.state.consult_text <= 27.5 ? <Text style={{ fontSize: 12, marginLeft: 20, color: "#FF0000", textAlign: 'left' }}>Please enter consult fee 0 or greater than {"\u20B9"}27.5</Text> : null}
                            <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }} >
                                <View onBlur={() => this.onBlur()} onFocus={() => this.onFocus()} elevation={5} style={{
                                    opacity: this.state.opacity, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'grey', borderRadius: 8,
                                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 10, shadowColor: "#dadada", shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { height: 1, width: 1 }
                                }}>
                                    <Text style={{ fontSize: 18, color: '#bbbbbb' }}>Follow-up fee</Text>
                                    <View onBlur={() => this.onBlur()} onFocus={() => this.onFocus()} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, height: 70, borderColor: this.state.isFocus ? "#8c8c8c" : "#0c9bad", }}>
                                        <Text style={{ fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: 'NotoSans-Bold', color: '#929292' }} >{"\u20B9"}</Text>
                                        <TextInput
                                            onChangeText={(follow_text) => this.validateFollowUpFee(follow_text)}
                                            ref='FollowFee'
                                            selection={this.state.selectionFollowup}
                                            onSelectionChange={() => this.setFollowSelection()}
                                            onBlur={() => this.onBlur()}
                                            onFocus={() => this.state.follow_text == "0" ? this.setState({
                                                follow_text: ""
                                            }) : null}
                                            defaultValue={this.state.follow_text.toString()}
                                            maxLength={6}
                                            keyboardType={"numeric"}
                                            style={{ textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' }}
                                        />
                                    </View>

                                    {this.showfollowBreakup()}

                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }} onPress={() => this.setState({ followshow: this.state.followshow == true ? false : true, hasFocus: this.state.hasFocus == true ? false : true })}>
                                        <Text style={{ color: this.state.color, marginBottom: 5, fontSize: 19, fontFamily: 'NotoSans-Bold' }} onBlur={() => this.onBlur()} onFocus={() => this.onFocus()}>You will receive</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: this.state.color, fontSize: 18, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }} onBlur={() => this.onBlur()} onFocus={() => this.onFocus()}> {"\u20B9 " + (this.state.consult_text == 0 || this.state.consult_text < 27.5 || this.state.follow_text == "NaN" ? 0 : parseFloat(this.state.finalFollowup).toFixed(2))} </Text>
                                            <Image source={this.state.followshow ? Images.ic_up_arrow : (this.state.followshow && this.state.hasFocus) ? Images.ic_info_grey : Images.ic_info_blue} style={{ resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 }} />


                                        </View>


                                    </TouchableOpacity>
                                    {parseFloat(this.state.follow_text) > parseFloat(this.state.consult_text) ? <Text style={{ fontSize: 12, color: "#FF0000", textAlign: 'left' }}>Followup fees must be less than consultation fee</Text> : null}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{ flex: 0.15, justifyContent: 'center' }}>
                            <TouchableOpacity disabled={this.state.consult_text > 27.5 || this.state.consult_text == 0 ? false : true} onPress={() => this.onClick()}>
                                <LinearGradient colors={(this.state.consult_text > 27.5 || this.state.consult_text == 0 ? ["#1b7cdb", "#07cef2"] : ["#c1c1c1", "#a5a4a3"])} start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{
                                        flexDirection: 'row',
                                        width: '90%',
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 10,
                                        alignSelf: 'center',
                                        borderRadius: 25
                                    }}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                                        <Text uppercase={true} style={{
                                            textAlign: 'center',
                                            fontSize: 17,
                                            color: '#ffffff',
                                            fontFamily: 'NotoSans-Bold',
                                            marginEnd: 5,
                                        }} >Done</Text>
                                        {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                                    </View>


                                </LinearGradient>
                            </TouchableOpacity>


                        </View>




                    </ImageBackground>
                </KeyboardAvoidingView>

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

            </View>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    doctorProfile: state.doctorProfile,

});
const mapDispatchToProps = dispatch => ({
    updateConsultationFee: (doctorId, consultationFee, followUpFee, url) => dispatch(updateConsultationFee(doctorId, consultationFee, followUpFee, url)),
    setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
    setVideoConsult: (videoConsult) => dispatch(setVideoConsult(videoConsult)),
    setVideoConsultationRegister: (vcRegister) => dispatch(setVideoConsultationRegister(vcRegister)),
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VCConsultationFeeComponent);