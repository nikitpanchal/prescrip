import { Container } from "native-base";
import React, { Component } from "react";
import Modal from "react-native-modalbox";
// import { CountDown } from 'react-native-countdown-component'

import {
    StatusBar,
    View,
    Image,
    Share,
    TextInput,
    ImageBackground,
    BackHandler,
    TouchableOpacity,
    Text,
    ScrollView, StyleSheet,
    KeyboardAvoidingView, Dimensions
} from "react-native";

import SettingsHeader from "../../../../components/SettingsHeader/SettingsHeader";
import {

    ic_close_button, iconrightarrow, ic_checked, ic_unchecked

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


import { SafeAreaView, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
class AadharDetails extends Component {
    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.fileName = "";
        this.modalRole = React.createRef();
        this.allValid = false;
        this.state = {
            isSelected: false,
            aadharNoValue: '',
            mobile: '',
            abhaDetails: this.props.route.params.abhaDetails,
            txnId: this.props.route.params.txnId
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
        multipleTapHandler.clearNavigator(), this.props.navigation.navigate("PatientVisitHistoryContainer");
        return true;
    }
    setValue(type, text) {
        this.setState({
            [type]: text
        })
    }
    resendOTP() {

    }
    timerFinished() {
        this.setState({
            hideTimer: true,
            attempt: 1
        })
    }
    verify() {
        this.props.navigation.navigate('CreateAbhaAddress', { txnId: this.state.txnId, xToken : this.state.abhaDetails.tokens.token });
    }
    render() {
        // isVisible={
        //   this.props.route.params.callFrom ==
        //   "EditAssist"
        //     ? this.props.tooltipStatus.AadharAuthenticationEdit
        //     : this.props.tooltipStatus.AadharAuthenticationAdd
        // }
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
                        'Profile Completion'
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

                        <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                            <Image
                                style={{
                                    resizeMode: "contain",
                                    alignSelf: "center",
                                    justifyContent: "flex-end",
                                    width: 150,
                                    height: 150,
                                }}
                                source={{ uri: 'data:image/png;base64,' + this.state.abhaDetails.ABHAProfile.photo }}
                            />
                            <View style={{ flexDirection: "column" }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#676767",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Full Name
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        paddingTop: 2,
                                        color: "#000",
                                        fontFamily: "NotoSans-Bold",
                                    }}
                                >
                                    {this.state.abhaDetails.ABHAProfile.firstName + ' ' + this.state.abhaDetails.ABHAProfile.middleName + ' ' + this.state.abhaDetails.ABHAProfile.lastName}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "column", paddingTop: 15 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#676767",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Gender
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#000",
                                        fontFamily: "NotoSans-Bold",
                                    }}
                                >
                                    {this.state.abhaDetails.ABHAProfile.gender == 'M' ? 'Male' : 'Female'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "column", paddingTop: 15 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#676767",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Date of birth
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#000",
                                        fontFamily: "NotoSans-Bold",
                                    }}
                                >
                                    {this.state.abhaDetails.ABHAProfile.dob}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "column", paddingTop: 15 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#676767",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Address
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#000",
                                        fontFamily: "NotoSans-Bold",
                                    }}
                                >
                                    {this.state.abhaDetails.ABHAProfile.address}
                                </Text>
                            </View>
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
                                            {"NEXT"}
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
    doctorProfile: state.doctorProfile,
    getSettingsData: state.settings,
    tooltipStatus: state.tooltip.toolTipStatus,
    sync: state.sync,
});

const mapDispatchToProps = (dispatch) => ({
    resetSettings: () => dispatch(resetSettings()),
    setOutOfClinicsDateSlots: (data) => dispatch(setOutOfClinicsDateSlots(data)),
    setOutOfCliniTimeSlotsNew: (data) =>
        dispatch(setOutOfCliniTimeSlotsNew(data)),
    setOutOfClinicDateSlotsNew: (data) =>
        dispatch(setOutOfClinicDateSlotsNew(data)),
    setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
    getOutOfClinicData: (data) => dispatch(getOutOfClinicData(data)),
    setAssitantData: (data) => dispatch(setAssitantData(data)),
    updateAssitantData: (data) => dispatch(updateAssitantData(data)),
    setAsstCliniNameList: (data) => dispatch(setAsstCliniNameList(data)),
    setAsstRole: (data) => dispatch(setAsstRole(data)),
    deleteAssitantData: (data) => dispatch(deleteAssitantData(data)),
    manageAsstData: (data) => dispatch(manageAsstData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AadharDetails);
