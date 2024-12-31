/****** code by Ruban ******/
import React, { Component } from "react";
import { Container, Text, Icon, Button } from "native-base";
import {
    ActivityIndicator,
    StatusBar, BackHandler,
    SafeAreaView,
    View, TouchableOpacity, Image, ImageBackground, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Alert
} from "react-native";
import styles from '../VideoConsultation/styles';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { BG, lefticon, trans_collapsed, trans_expand, } from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient'
import Images from '../../Theme/Images'
import { updateConsultationFee } from '../../actions/vc_VideoConsultation'
import { setVideoConsultationRegister } from '../../actions/auth'
import { setDoctorData, setVideoConsult } from '../../actions/doctorProfile'
import { connect } from 'react-redux'
import { StackActions, CommonActions } from '@react-navigation/native';

import ToastComponent from '../../components/Toast/toastComponent'

import Toast, { DURATION } from 'react-native-easy-toast'
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Keyboard } from "react-native";


class VCConsultationFeeComponent extends Component {
    constructor(props) {
        super(props);
        var { _id, ConsultFee, FollowupFee, ShortUrl } = props.doctorProfile.DoctorData
        var { conFee, techFee } = props.doctorProfile.DoctorFees
        this.state = {
            show: false,
            doctorId: _id,
            consult_text: ConsultFee ? parseFloat(ConsultFee) : 0.0,
            follow_text: FollowupFee ? parseFloat(FollowupFee) : 0.0,
            followshow: false,
            url: ShortUrl,
            hasFocus: false,
            borderColor: '',
            conFee: conFee,
            techFee: techFee,
            totalfees: techFee + conFee,
            finalConsult: (isNaN(ConsultFee) ? 0 : (ConsultFee - (ConsultFee * conFee / 100) - techFee) < 0.0 ? 0.0 : ConsultFee - (ConsultFee * conFee / 100) - techFee),
            finalFollowup: (isNaN(FollowupFee) ? 0 : (FollowupFee - (FollowupFee * conFee / 100) - techFee) < 0.0 ? 0.0 : FollowupFee - (ConsultFee * conFee / 100) - techFee),
            color: '',
            opacity: 0.5,
            backgroundColor: '',
            loading: false,
            donevisible: false,
            isFocus: true,
            selectionConsult: { start: ConsultFee ? ConsultFee.length : 0, end: ConsultFee ? ConsultFee.length : 0 },
            selectionFollowup: { start: FollowupFee ? FollowupFee : 0, end: FollowupFee ? FollowupFee : 0 },
            //Toast States
            description: '',
            showToast: false,

            toastImagePath: Images.Info,
            toastTextColor: "#fafbfe",
            toastBgColor: '#4D99E3',



        }
        this._checkboxsms = 0
        this._handleBackPress = this._handleBackPress.bind(this)

    }
    onClick() {

        try {
            if (parseFloat(this.state.consult_text) < parseFloat(this.state.follow_text)) {




                this.setState({
                    showToast: true,
                    description: 'Followup fee must be less than consultation fee',
                    toastBgColor: "#1b7cdb",
                    toastTextColor: '#fafbfe',
                    toastImagePath: Images.Info
                })

                setTimeout(() => {
                    this.setState({
                        showToast: false,
                        loading: false
                    });

                }, 1500);

            }
            else {

                if (this.state.consult_text >= 0) {
                    this.setState({ loading: true })

                    let vcRegister = this.props.auth.vcRegister;
                    this.props.updateConsultationFee(this.state.doctorId, parseFloat(this.state.consult_text),
                        parseFloat(this.state.follow_text), this.state.url).then(({ payload, error }) => {

                            if (error) {

                                this.setState({
                                    description: 'Currently internet is not avaliable',
                                    toastBgColor: "#d9541d",
                                    toastTextColor: '#fffefe',
                                    toastImagePath: Images.Error

                                })
                                switch (error.data) {
                                    case 'Network Error':
                                        this.setState({
                                            description: 'Currently internet is not avaliable',
                                            toastBgColor: "#d9541d",
                                            toastTextColor: '#fffefe',
                                            toastImagePath: Images.Error

                                        })
                                        break;
                                    default:
                                        this.setState({
                                            description: 'Error in gettting response from server',
                                            toastBgColor: "#d9541d",
                                            toastTextColor: '#fffefe',
                                            toastImagePath: Images.Error
                                        })
                                        break;
                                }

                                this.setState({
                                    showToast: true,
                                })

                                setTimeout(() => {
                                    this.setState({
                                        showToast: false,
                                        loading: false
                                    });

                                }, 1500);

                                return;
                            }

                            if (payload.data.status == 1) {


                                this.setState({ loading: false })
                                this.props.doctorProfile.DoctorData.ConsultFee = parseFloat(this.state.consult_text)
                                this.props.doctorProfile.DoctorData.FollowupFee = parseFloat(this.state.follow_text)
                                this.props.doctorProfile.DoctorData.DigitalConsult = 1;
                                //this.props.doctorProfile.DoctorData.DoctorFeatures = doctorFeatures;

                                let videoConsultUrl = payload.data.videoConsultUrl
                                this.props.setVideoConsult(videoConsultUrl)
                                this.props.setDoctorData(this.props.doctorProfile.DoctorData)


                                if (this.props.auth.vcRegister == false) // digi consult is present
                                {

                                    this.props.navigation.navigate('DigiConsultationSetupContainer', { nevigateFrom: 'vc', });


                                }
                                else {

                                    this.setState({
                                        showToast: true,
                                        description: "Updated successfully",
                                        toastBgColor: "#29b62f",
                                        toastTextColor: '#fafdfa',
                                        toastImagePath: Images.Success

                                    })

                                    setTimeout(() => {
                                        this.setState({
                                            showToast: false,
                                            loading: false
                                        });

                                        this.props.navigation.dispatch(CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'Drawer' }]

                                        }));

                                    }, 500);


                                }

                                this.props.setVideoConsultationRegister(true);


                                // this.props.onClick();
                            }
                        })
                }
            }
        } catch (e) {
            this.setState({
                showToast: true,
                description: "Something went wrong",
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error
            })

            setTimeout(() => {
                this.setState({
                    showToast: false,
                    loading: false
                });

            }, 2000);
            this.setState({ loading: false })

        }



    }



    showCancel = () => {
        this.setState({ show: true, followshow: true })
    };

    hideCancel = () => {
        this.setState({ show: false, followshow: false })
    };

    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }


    _handleBackPress() {
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack()

        return true;
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    onFocus() {
        this.setState({
            borderColor: '#0c9bad', color: '#333', opacity: 1, backgroundColor: '#10a9e8', donevisible: true, hasFocus: false, isFocus: false
        })
    }

    onBlur() {
        this.setState({
            borderColor: '#8c8c8c', color: '#d8d8d8', backgroundColor: '#c1c1c1', donevisible: false, hasFocus: true, isFocus: true
        })
    }





    showConsultationBreakup() {
        if (this.state.show) {
            return (
                <TouchableOpacity style={styles.consult_showhide_view} >
                    <View style={styles.consult_showhide_view2}>
                        <Text style={styles.gateway_fee}>{"-"} Payment Gateway Fee</Text>
                        <View style={styles.gateway_fee_moneyview}>
                            <Text style={styles.fee_moneyview}>{this.state.conFee + "%"} </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 15 }}>
                        <Text style={styles.gateway_fee}>{"-"} Technology Fee</Text>
                        <View style={styles.gateway_fee_moneyview}>
                            <Text style={styles.fee_moneyview}>{"\u20B9" + " " + this.state.techFee} </Text>

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
                <TouchableOpacity style={styles.consult_showhide_view} >
                    <View style={styles.consult_showhide_view2}>
                        <Text style={styles.gateway_fee}>{"-"} Payment Gateway Fee</Text>
                        <View style={styles.gateway_fee_moneyview}>
                            <Text style={styles.fee_moneyview}>{this.state.conFee + "%"} </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={styles.gateway_fee}>{"-"} Technology Fee</Text>
                        <View style={styles.gateway_fee_moneyview}>
                            <Text style={styles.fee_moneyview}>{"\u20B9" + " " + this.state.techFee} </Text>
                        </View>
                    </View>
                </TouchableOpacity>


            );

        }
        return null;

    }


    validateConsultFee(fee) {
        let { conFee, techFee } = this.props.doctorProfile.DoctorFees
        this.setState({ consult_text: fee });
        let fees = fee == "" ? 0 : parseFloat(fee).toFixed(2) - (parseFloat(fee).toFixed(2) * conFee / 100) - techFee
        if (fees <= 0) {

            this.setState({ finalConsult: 0 })


        } else {
            this.setState({ finalConsult: parseFloat(fees.toFixed(2)) })
        }
    }


    validateFollowUpFee(fee) {
        let { conFee, techFee } = this.props.doctorProfile.DoctorFees
        this.setState({ follow_text: fee, borderColor: this.state.follow_text });
        let fees = fee == "" ? 0 : parseFloat(fee).toFixed(2) - (parseFloat(fee).toFixed(2) * conFee / 100) - techFee
        if (fees <= 0) {
            this.setState({ finalFollowup: 0 })
        } else {
            this.setState({ finalFollowup: parseFloat(fees.toFixed(2)) })
        }
    }
    setSelection = () => {
        this.setState({ selectionConsult: { start: this.state.consult_text.length, end: this.state.consult_text.length } });
    }
    setFollowSelection = () => {
        this.setState({ selectionFollowup: { start: this.state.follow_text.length, end: this.state.follow_text.length } });
    }

    render() {
        const dim = Dimensions.get('window')



        return (

            <View style={styles.consultmain_view}>

                <ImageBackground style={styles.container} source={BG}>
                    <StatusBar translucent={true} backgroundColor={'transparent'} />
                    <ScrollView scrollEnabled={((Platform.isPad && dim.width > dim.height) ? true : false)} contentContainerStyle={{ flex: 1, height: '100%', }}
                        keyboardShouldPersistTaps={"handled"}
                        keyboardDismissMode={'on-drag'}>
                        <SafeAreaView style={{ flex: 1, marginTop: Platform.OS == "ios" ? null : 30 }}>
                            <View style={{ flex: 0.25, paddingLeft: 10 }}>


                                <TouchableOpacity transparent onPress={() => {
                                    this.props.navigation.goBack()
                                }}
                                    style={[styles.headerIcon, { paddingBottom: 2, paddingTop: 12 }]}>
                                    <Image source={lefticon} style={styles.consult_image_icon} />
                                </TouchableOpacity>
                                {Platform.isPad ? <View style={{ flex: 0.8, fontSize: 30, fontFamily: 'NotoSans-Bold', justifyContent: 'center' }}>
                                    <Text style={[styles.consult_text, { paddingTop: 10, lineHeight: 35 }]}>{`What's your Consulting Fee?`}</Text>
                                    <Text style={[styles.consult_vide_text]}>Fee per Video Consultation</Text>
                                </View> :
                                    <View style={styles.consult_text_view3}>
                                        <Text style={[styles.consult_text, { paddingTop: 10, lineHeight: 35 }]}>{`What's your Consulting Fee?`}</Text>
                                        <Text style={styles.consult_vide_text}>Fee per Video Consultation</Text>
                                    </View>}

                            </View>

                            <View style={{ flex: 0.65, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                                <KeyboardAwareScrollView

                                    style={{ flex: 1, height: '100%' }}>

                                    <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flex: 0.4 }} >
                                        <View elevation={5} style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                                            <Text style={{ fontSize: 18, color: '#bbbbbb' }}>Consultation fee</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0c9bad', height: 70, }}>
                                                <Text style={{ fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', color: '#929292', fontFamily: 'NotoSans-Bold' }} >{"\u20B9"}</Text>
                                                <TextInput
                                                    onChangeText={(consult_text) => this.validateConsultFee(consult_text)}
                                                    ref={(ref) => this.consultFeeRef = ref}
                                                    defaultValue={String(this.state.consult_text)}
                                                    maxLength={6}
                                                    onFocus={() => this.state.consult_text == "0" ? this.setState({
                                                        consult_text: ""
                                                    }) : null}
                                                    selection={this.state.selectionConsult}
                                                    onSubmitEditing={() => this.followFeeRef.focus()}
                                                    onSelectionChange={() => this.setSelection()}
                                                    keyboardType={"numeric"}
                                                    style={{ includeFontPadding: false, textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' }}
                                                />
                                            </View>

                                            {this.showConsultationBreakup()}

                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }} onPress={() => this.setState({ show: this.state.show == true ? false : true })}>
                                                <Text style={{ color: "#333", fontFamily: 'NotoSans-Bold', marginBottom: 5, fontSize: 19 }}>You will receive</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {/* <Text style={{ color: '#404040', fontSize: 18, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}>{"\u20B9" + " " + 123} </Text> */}
                                                    <Text style={{ color: '#333', fontSize: 19, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}> {"\u20B9 " + (this.state.consult_text == 0 || this.state.consult_text == "NaN" ? 0 : parseFloat(this.state.finalConsult).toFixed(2))}  </Text>
                                                    <Image source={this.state.show ? Images.ic_up_arrow : Images.ic_info_blue} style={{ resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 }} />


                                                </View>


                                            </TouchableOpacity>

                                        </View>




                                    </View>
                                    {this.state.consult_text > 0 && this.state.consult_text <= 27.5 ? <Text style={{ fontSize: 12, marginLeft: 20, color: "#FF0000", textAlign: 'left' }}>Please enter consult fee 0 or greater than {"\u20B9"}27.5</Text> : null}
                                    <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flex: 0.4 }} >
                                        <View onBlur={() => this.onBlur()} onFocus={() => this.onFocus()} elevation={5} style={{ opacity: this.state.opacity, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'grey', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 10, shadowColor: "#dadada", shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                                            <Text style={{ fontSize: 18, color: '#bbbbbb' }}>Follow-up fee</Text>
                                            <View onBlur={() => this.onBlur()} onFocus={() => this.onFocus()} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, height: 70, borderColor: this.state.isFocus ? "#8c8c8c" : "#0c9bad", }}>
                                                <Text style={{ fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', fontFamily: 'NotoSans-Bold', color: '#929292' }} >{"\u20B9"}</Text>
                                                <TextInput

                                                    onChangeText={(follow_text) => this.validateFollowUpFee(follow_text)}
                                                    ref={(ref) => this.followFeeRef = ref}
                                                    returnKeyLabel={'done'}
                                                    returnKeyType={'done'}
                                                    selection={this.state.selectionFollowup}
                                                    onSelectionChange={() => this.setFollowSelection()}
                                                    onFocus={() => this.state.follow_text == "0" ? this.setState({
                                                        follow_text: ""
                                                    }) : null}

                                                    defaultValue={this.state.follow_text.toString()}
                                                    maxLength={6}
                                                    keyboardType={"numeric"}
                                                    style={{ includeFontPadding: false, textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' }}
                                                />
                                            </View>

                                            {this.showfollowBreakup()}

                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }} onPress={() => this.setState({ followshow: this.state.followshow == true ? false : true, hasFocus: this.state.hasFocus == true ? false : true })}>
                                                <Text style={{ color: this.state.color, marginBottom: 5, fontSize: 19, fontFamily: 'NotoSans-Bold' }} onBlur={() => this.onBlur()} onFocus={() => this.onFocus()}>You will receive</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ color: this.state.color, fontSize: 18, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }} onBlur={() => this.onBlur()} onFocus={() => this.onFocus()}> {"\u20B9 " + (this.state.consult_text == 0 || this.state.consult_text < 27.5 || this.state.follow_text == NaN ? 0 : parseFloat(this.state.finalFollowup).toFixed(2))} </Text>
                                                    <Image source={this.state.followshow ? Images.ic_up_arrow : (this.state.followshow && this.state.hasFocus) ? Images.ic_info_grey : Images.ic_info_blue} style={{ resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 }} />


                                                </View>


                                            </TouchableOpacity>
                                            {parseFloat(this.state.follow_text) > parseFloat(this.state.consult_text) ? <Text style={{ fontSize: 12, color: "#FF0000", textAlign: 'left' }}>Followup fees must be less than consultation fee</Text> : null}

                                        </View>

                                    </View>






                                </KeyboardAwareScrollView>

                            </View>
                            <View style={{ flex: 0.1, backgroundColor: '#fff' }}>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: '#fff', }} disabled={this.state.consult_text > 27.5 || this.state.consult_text == 0 ? false : true} onPress={() => this.onClick()}>
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
                                                marginEnd: 5
                                            }} >Done</Text>
                                            {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                                        </View>

                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </SafeAreaView>
                    </ScrollView>
                </ImageBackground>



                {
                    this.state.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={this.state.toastTextColor}

                                imagePath={this.state.toastImagePath}
                                description={this.state.description}

                            />

                            , 1500) : null
                }
                <Toast

                    position='bottom'
                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',

                        backgroundColor: this.state.toastBgColor,


                        borderRadius: 15
                    }}
                    ref="toast" />

            </View>


        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    doctorProfile: state.doctorProfile
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