
import React, { Component } from "react";

import { CountDown } from 'react-native-countdown-component'

import {
    StatusBar,
    View,
    Image,
    Alert,
    TextInput,

    BackHandler,
    TouchableOpacity,
    Text,
    StyleSheet,
    KeyboardAvoidingView
} from "react-native";

import SettingsHeader from "../../../../components/SettingsHeader/SettingsHeader";
import {

    ic_close_button, iconrightarrow

} from "../../../../constants/images";

import {
    setAssitantData,
    updateAssitantData,
    setAsstCliniNameList,
    setAsstRole,
    manageAsstData,
    deleteAssitantData,
} from "../../../../actions/settings";
import multipleTapHandler from "../../../../components/MultiTapHandle";
import { connect } from "react-redux";

import { Platform } from "react-native";

import { setTooltipStatus } from "../../../../actions/tooltip";

import { abdmRequest } from './abdmApiRequest'
import { SafeAreaView, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { updatePatientAbhaDetails } from "../../../../actions/patientProfie";
class LinkMobileWithAbha extends Component {
    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.fileName = "";
        this.modalRole = React.createRef();
        this.allValid = false;
        this.state = {
            isSelected: false,
            secondMobile: '',
            otpValue: '',
            loading: false, attempt: 1,
            loadingResend: false,
            mobile: '',
            step: 1,
            aadharNo: this.props.route?.params?.aadharNo,
            txnId: this.props.route?.params?.txnId,
            stepTwoRes: {

            },
            stepOneRes: {

            }
        };
    }

    componentDidUpdate(prevProps, prevState) {

    }


    handleBackButtonClick() {
        // this.removeFlags();
        if (this.state.isModalOpen) {
            this.setState({ isModalOpen: !this.state.isModalOpen }, () => {
                this.modalRole.close();
            });
        } else {
            multipleTapHandler.clearNavigator();

            this.props.navigation.goBack(null);
            return true;
        }
        this.setState({ isChanged: false });
    }
    componentWillMount() {
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    }
    leftImageOnClick() {
        //this.removeFlags();
        this.props.navigation.navigate("PatientVisitHistoryContainer");
        return true;
    }
    setValue(type, text) {
        this.setState({
            [type]: text
        })
    }
    resendOTP() {

        if (this.state.step == 1) {
            this.setState({
                loadingResend: true, restart: true, hideTimer: false, attempt: this.state.attempt + 1
            });
            let data = JSON.stringify({
                "aadharNo": this.state.aadharNo
            });

            let config = {
                method: 'post',

                url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-aadhar-otp',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            abdmRequest(data, config)
                .then((response) => {
                    response= response.data;
                    if (response.txnId) {
                        this.setState({
                            txnId: response.txnId, loadingResend: false
                        })
                    }

                })
                .catch((error) => {
                    Alert.alert('Error', error.messsage);
                    this.setState({
                        loadingResend: false
                    })
                });
        }
        else {
            let data = JSON.stringify({

                "txnId": this.state.txnId,
                "mobile": this.state.secondMobile
            });

            let config = {
                method: 'post',
                url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-mobile-otp',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            abdmRequest(data, config)
                .then((response) => {
                    if (response.txnId) {
                        response = response.data;
                        this.setState({
                            txnId: response.txnId, loadingResend: false
                        })
                    }


                })
                .catch((error) => {
                    Alert.alert('Error', error.messsage);
                });
        }
    }
    timerFinished() {
        this.setState({
            hideTimer: true,
            restart: false
            
        })
    }
    uadpteAatientAbhaDetails(abhaReposne) {
        let abhaDetails = {

            abhaNumber: abhaReposne.ABHANumber,
            address: abhaReposne.address,
            dob: abhaReposne.dob,
            pinCode: abhaReposne.pinCode,
            gender: abhaReposne.gender,
            fullName: abhaReposne.firstName + ' ' + abhaReposne.lastName,
            state: abhaReposne.stateName,
            mobile: abhaReposne.mobile
        }
        let postData = {
            abhaDetails,
            patientId: this.props.patientvisit.patientDetails._id,
            commonId: this.props.patientvisit.patientDetails.CommonDetails.id,
        }
        this.props.updatePatientAbhaDetailsDispatch(postData);
    }
    verify() {
        if (!this.state.otpValue && !this.state.mobile) {
            Alert.alert("Error", "All Fields are Required")
            return false;
        }
        this.setState({
            loading: true
        });

        if (this.state.step == 1) {

            let data = JSON.stringify({
                "otpValue": this.state.otpValue,
                "txnId": this.state.txnId,
                "mobile": this.state.mobile
            });

            let config = {
                method: 'post',
                url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-aadhar-otpverify',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            abdmRequest(data, config)
                .then((responseData) => {
                    responseData = responseData.data;
                    if (responseData.txnId && responseData.ABHAProfile.abhaStatus != 'DEACTIVATED') {
                        this.uadpteAatientAbhaDetails(responseData.ABHAProfile);
                        if (responseData.ABHAProfile.mobile != this.state.mobile) {
                            this.setState({
                                step: 2, stepOneRes: responseData, txnId: responseData.txnId, loading: false
                            })
                        }
                        else {
                            this.setState({
                                stepOneRes: responseData, txnId: responseData.txnId, loading: false
                            });
                            this.props.navigation.navigate('AadharDetails', { abhaDetails: responseData, txnId: responseData.txnId });
                        }

                    }
                    else {
                        Alert.alert('NDHM Error', responseData.ABHAProfile.abhaStatus)
                    }
                })
                .catch((data) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', data.message);
                });

        }
        else if (this.state.step == 2) {

            this.setState({
                loading: true
            });

            let data = JSON.stringify({

                "txnId": this.state.txnId,
                "mobile": this.state.secondMobile
            });

            let config = {
                method: 'post',
                url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-mobile-otp',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            abdmRequest(data, config)
                .then((response) => {
                    if (response.txnId) {
                        this.setState({
                            stepTwoRes: response, step: 3, txnId: response.txnId, otpValue: '', loading: false
                        })
                    }


                })
                .catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', error.messsage);
                });

        }
        else if (this.state.step == 3) {
            this.setState({
                loading: true
            })
            let data = JSON.stringify({

                "otpValue": this.state.otpValue,
                "txnId": this.state.txnId,
                "mobile": this.state.mobile
            });


            let config = {
                method: 'post',
                url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-mobile-otpverify',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            abdmRequest(data, config)
                .then((response) => {
                    this.setState({
                        loading: false
                    });
                    if (response.authResult && response.authResult == 'success') {
                        this.props.navigation.navigate('AadharDetails',
                            { abhaDetails: this.state.stepOneRes, txnId: this.state.txnId });
                    }

                })
                .catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', error.messsage);
                });

        }

    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    translucent={true}
                    backgroundColor="#dcdcdc"
                />
                <SettingsHeader
                    {...this.props}
                    bgImage={null}
                    bgColor={"white"}
                    cursorColor={"#0869d8"}
                    tintColor={"#0b69d8"}
                    titleColor={null}
                    descriptionColor={"#3D3D3D"}
                    description={
                        'Aadhar Authentication'
                    }
                    subtitle={

                        null
                    }
                    placeholderTextColor={"black"}
                    placeTextColor={"black"}
                    placeholderTextSize={20}
                    leftImage={ic_close_button}
                    leftImageOnClick={() => this.leftImageOnClick()}
                    rightImage={iconrightarrow}
                    rightImageCross={null}
                    isSearchBoxShowing={null}
                    type={5}
                    rightImageOnClick={() => null}
                />



                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : null}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                        style={{
                            flex: 1
                        }}
                    >
                        {this.state.step == 1 || this.state.step == 3 ?
                            <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#8B8B8B",
                                            fontFamily: "NotoSans",
                                        }}
                                    >
                                        Confirm OTP
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                        *
                                    </Text>
                                </View>
                                <TextInput
                                    onChangeText={(text) =>
                                        this.setValue("otpValue", text)
                                    }

                                    keyboardType="numeric"

                                    value={this.state.otpValue}
                                    maxLength={6}
                                    style={{
                                        borderBottomColor: "#d7d7d7",
                                        letterSpacing: 10,
                                        paddingTop: 5,
                                        textAlign: 'center',
                                        paddingBottom: 0,
                                        paddingTopLeft: 0,
                                        borderBottomWidth: 1,
                                        fontSize: 30,
                                        color: "#242424",
                                        fontFamily: "NotoSans",
                                    }}
                                />

                            </View> : null}
                        {this.state.step == 1 || this.state.step == 3 ?
                            <View style={{
                                marginTop: 5, paddingLeft: 15, paddingRight: 15, flexDirection: 'row',
                                justifyContent: 'center', alignItems: 'center'
                            }}>

                                {!this.state.restart && this.state.hideTimer && this.state.attempt <= 2 ?
                                    <View style={{

                                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                                    }}>

                                        <Text onPress={() => this.resendOTP()}
                                            style={{ color: '#06b7cc', fontSize: 18, textDecorationLine: "underline", fontFamily: 'NotoSans' }}>Resend OTP</Text>
                                        {this.state.loadingResend ? (
                                            <ActivityIndicator size="small" color="#000" />
                                        ) : null}
                                    </View> : <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                        <Text style={{ fontSize: 16, color: '#757575', fontFamily: 'NotoSans' }}>
                                            Didn’t receive OTP?<Text style={{ fontWeight: "bold" }}> Resend In</Text></Text>
                                        <CountDown
                                            style={{ padding: 0, flexDirection: 'row' }}
                                            digitStyle={{ padding: 0, margin: 0 }}
                                            digitTxtStyle={{ fontSize: 15, color: '#757575', fontFamily: "NotoSans" }}
                                            until={2} timeToShow={['M', 'S']}
                                            timeLabels={{ m: null, s: null }}
                                            timeLabelStyle={{}}
                                            showSeparator
                                            sRemaining={20000} onFinish={() => this.timerFinished()} allowFontScaling={true} />
                                    </View>

                                }



                            </View> : null}
                        <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                            {this.state.step != 3 ? <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#8B8B8B",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Mobile number

                                </Text>
                                <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                    *
                                </Text>
                            </View> : null}
                            {this.state.step == 2 || this.state.step == 3 ?
                                <>
                                    <TextInput
                                        onChangeText={(text) =>
                                            this.setValue("secondMobile", text)
                                        }

                                        keyboardType="numeric"
                                        editable={this.state.step == 2}
                                        value={this.state.secondMobile}
                                        maxLength={10}
                                        style={{
                                            borderBottomColor: "#d7d7d7",
                                            letterSpacing: 2,
                                            paddingTop: 5,
                                            textAlign: 'left',
                                            paddingBottom: 0,
                                            paddingTopLeft: 0,
                                            borderBottomWidth: 1,
                                            fontSize: 30,
                                            color: "#242424",
                                            fontFamily: "NotoSans",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#6554C0",
                                            fontFamily: "NotoSans",
                                        }}

                                    >

                                        Mobile number {this.state.mobile} is not same as mobile linked with your Aadhar,  This mobile number will be used for all the communications related to ABHA.
                                    </Text>
                                </> : this.state.step == 1 ?
                                    <>
                                        <TextInput
                                            onChangeText={(text) =>
                                                this.setValue("mobile", text)
                                            }

                                            keyboardType="numeric"

                                            value={this.state.mobile}
                                            maxLength={10}
                                            style={{
                                                borderBottomColor: "#d7d7d7",
                                                letterSpacing: 2,
                                                paddingTop: 5,
                                                textAlign: 'left',
                                                paddingBottom: 0,
                                                paddingTopLeft: 0,
                                                borderBottomWidth: 1,
                                                fontSize: 30,
                                                color: "#242424",
                                                fontFamily: "NotoSans",
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#6554C0",
                                                fontFamily: "NotoSans",
                                            }}

                                        >

                                            This mobile number will be used for all the communications related to ABHA.

                                        </Text>
                                    </> : null
                            }



                            <View style={{ flex: 0.1, marginTop: 20 }}>
                                <TouchableOpacity
                                    disabled={this.state.loading}
                                    onPress={() => this.verify()}
                                >
                                    <LinearGradient
                                        colors={["#1b7cdb", "#07cef2"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        locations={[0, 0.8]}
                                        style={styles.linear_gradient_btn_style}
                                    >
                                        <Text style={styles.linear_gradient_text_style}>
                                            {this.state.step == 2 ? 'VERIFY' : 'NEXT'}
                                        </Text>
                                        {this.state.loading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : null}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>




                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    flat: { flex: 1, flexGrow: 1, paddingHorizontal: 15, paddingVertical: 16 },
    cflatlistitem: { marginVertical: 5 },
    btn_container: { flex: 0.1, justifyContent: "center" },
    linear_gradient_btn_style: {
        flexDirection: "row",
        width: "90%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        alignSelf: "center",
        borderRadius: 25,
    },
    linear_gradient_text_style: {
        textAlign: "center",
        fontSize: 17,
        color: "#ffffff",
        fontFamily: "NotoSans-Bold",
        marginEnd: 5,
    },

    cont: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#d8dadc",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 5,
        margin: 10,
    },
    txt1: {
        color: "#9a9c9e",
        fontSize: 15,
        marginLeft: 5,
        fontFamily: "NotoSans",
        alignItems: "flex-start",
    },
});

const mapStateToProps = (state) => ({
    patientvisit: state.patientvisit

});

const mapDispatchToProps = (dispatch) => ({
    updatePatientAbhaDetailsDispatch: (data) => dispatch(updatePatientAbhaDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LinkMobileWithAbha);
