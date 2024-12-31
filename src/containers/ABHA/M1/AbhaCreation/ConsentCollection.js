
import React, { Component } from "react";


import {
    StatusBar,
    View,
    Image,
    Share,
    TextInput,
    ActivityIndicator,
    BackHandler,
    TouchableOpacity,
    Text,
    ScrollView,
    KeyboardAvoidingView, StyleSheet
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
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


import { Alert } from "react-native";
import { Platform } from "react-native";

import { setTooltipStatus } from "../../../../actions/tooltip";


import { SafeAreaView } from "react-native";

import { abdmRequest } from './abdmApiRequest'
class AbhaConsentCollection extends Component {
    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.fileName = "";
        this.modalRole = React.createRef();
        this.allValid = false;
        this.state = {
            loading: false,
            isSelected: false,
            aadharNoValue: '',
            patientId: this.props.route?.params?.patientId,
            commonId: this.props.route?.params?.commonId
        };
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
            aadharNoValue: text ? text.match(/\d{4}(?=\d{1,4})|\d+/g).join("-") : ''
        })
    }
    next() {

        if (!this.state.aadharNoValue) {
            Alert.alert("Error", "All Fields are Required")
            return false;
        }

        if (this.state.isSelected) {
            this.setState({
                loading: true
            });
            let aadharNo = this.state.aadharNoValue.split('-').join('');
            let data = JSON.stringify({
                "aadharNo": aadharNo
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

                    if (response.data.txnId) {
                        this.props.navigation.navigate('LinkMobileWithAbha', { txnId: response.data.txnId, aadharNo: aadharNo })
                    }

                    this.setState({
                        loading: false
                    });
                })
                .catch((data) => {
                    Alert.alert('Error', data.message);
                    this.setState({
                        loading: false
                    });
                });



        }
        else {


            Alert.alert('Required', 'Please agree Terms & Conditions')
        }
    }
    render() {
        // isVisible={
        //   this.props.route.params.callFrom ==
        //   "EditAssist"
        //     ? this.props.tooltipStatus.AbhaConsentCollectionEdit
        //     : this.props.tooltipStatus.AbhaConsentCollectionAdd
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
                        'Consent Collection'
                    }
                    subtitle={

                        null
                    }
                    placeholderTextColor={"black"}
                    placeTextColor={"black"}
                    placeholderTextSize={20}
                    leftImage={ic_close_button}
                    leftImageOnClick={() => this.leftImageOnClick()}
                    rightImage={null}
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
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#8B8B8B",
                                        fontFamily: "NotoSans",
                                    }}
                                >
                                    Aadhaar number
                                </Text>
                                <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                    *
                                </Text>
                            </View>
                            <TextInput
                                onChangeText={(text) =>
                                    this.setValue("aadhar", text)
                                }

                                keyboardType="numeric"

                                value={this.state.aadharNoValue}
                                maxLength={14}
                                style={{
                                    borderBottomColor: "#d7d7d7",
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
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#6554C0",
                                    fontFamily: "NotoSans",
                                }}
                            >

                                Please ensure that mobile number is linked with Aadhaar as it will be required for OTP authentication.
                            </Text>
                        </View >
                        <View
                            style={{
                                flexDirection: "column",
                                marginTop: 20, flex: 1,

                                paddingLeft: 15, paddingRight: 15
                            }}
                        >

                            <View style={{
                                flexDirection: "column", flex: 0.8, justifyContent: "center",
                                alignItems: "center" 
                            }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "#000",
                                        fontFamily: "NotoSans-Bold",

                                    }}
                                >
                                    Terms and Conditions
                                </Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <ScrollView>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#757575",
                                                fontFamily: "NotoSans"
                                            }}
                                        >
                                            I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number.
                                            {"\n"}I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services.
                                            {"\n"}Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under.
                                            {"\n"}I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.

                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2
                            }}>
                                <TouchableOpacity
                                    style={{ marginRight: 20 }}
                                    onPress={() => {
                                        this.setState({
                                            isSelected: !this.state.isSelected
                                        })
                                    }}
                                >
                                    {this.state.isSelected ? (
                                        <Image
                                            style={{ resizeMode: "contain", height: 24, width: 24 }}
                                            source={ic_checked}
                                        />
                                    ) : (
                                        <Image
                                            style={{ resizeMode: "contain", height: 24, width: 24 }}
                                            source={ic_unchecked}
                                        />
                                    )}
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#757575",
                                        fontFamily: "NotoSans-Bold"
                                    }}
                                >I agree</Text>
                            </View>
                            <View style={{   }}>
                            <TouchableOpacity
                                disabled={this.state.loading}
                                onPress={() => this.next()}
                            >
                                <LinearGradient
                                    colors={["#1b7cdb", "#07cef2"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    locations={[0, 0.8]}
                                    style={styles.linear_gradient_btn_style}
                                >
                                    <Text style={styles.linear_gradient_text_style}>
                                        {"Next"}
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
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AbhaConsentCollection);
