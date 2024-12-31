
import React, { Component } from "react";

import EventSource from "react-native-sse";
import { CameraScreen as CameraKitCameraScreen } from 'react-native-camera-kit';
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
    KeyboardAvoidingView, Dimensions, Keyboard
} from "react-native";

import SettingsHeader from "../../../../components/SettingsHeader/SettingsHeader";
import {

    ic_close_button, iconrightarrow, ic_radio_button_selected, ic_radio_button_unselected

} from "../../../../constants/images";


import multipleTapHandler from "../../../../components/MultiTapHandle";
import { connect } from "react-redux";

import { Platform } from "react-native";

import { setTooltipStatus } from "../../../../actions/tooltip";

import { abdmRequest } from './abdmApiRequest'
import { SafeAreaView, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { updatePatientAbhaDetails } from "../../../../actions/patientProfie";
const es = new EventSource("https://your-sse-server.com/.well-known/mercure");

class AddCareContext extends Component {
    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.fileName = "";
        this.modalRole = React.createRef();
        this.allValid = false;
        this.state = {
            isSelected: false,
            displayName: '',
            refNum: this.props.route?.params?.patientId + ':' + this.props.route?.params?.commonId,
            loading: false,
            loadingResend: false,
            mobile: '',
            step: 0,
            abhaNumber: this.props.route?.params?.abhaNumber,
            txnId: this.props.route?.params?.txnId,

            radioIndex: 1,
            stepTwoRes: {

            },
            stepOneRes: {

            },
            scannedData: null
        };
    }

    componentDidUpdate(prevProps, prevState) {

    }
    componentDidMount() {
        //  Alert.alert('',this.state.txnId)
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

    verify() {
        this.setState({
            loading: true
        });
        let postUrl = 'https://stagingapi2.prescrip.in/apiv2/abdm-add-carecontext';

        let data = JSON.stringify({
            "referenceNumber": this.state.refNum,
            "display": this.state.displayName,
            txnId: this.state.txnId,
            patientId: this.props.route?.params?.patientId,
            commonId: this.props.route?.params?.commonId,
        });




        let config = {
            method: 'post',
            url: postUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        abdmRequest(data, config)
            .then((responseData) => {
                responseData = responseData.data;
                if (responseData.requestId) {
                    this.setState({
                        loading: false, refNum: '', displayName: ''
                    });
                    Alert.alert("Sucess", "Care Context has been added sucessfully");
                    this.leftImageOnClick();
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false
                });
                Alert.alert('Error', error.messsage);
            });



    }
    handleRadion(value) {
        this.setState({
            radioIndex: value == 'demo' ? 2 : 1,

        })
    }
    onQR_Code_Scan_Done = (message) => {
        this.setState({ opencamera: false });
        if (Keyboard)
            Keyboard.dismiss()
        let scannedData = JSON.parse(message);
        let postBody = JSON.stringify({
            name: scannedData.name,
            gender: scannedData.gender,
            dob: scannedData.dob,
            requestId: this.state.requestId
        });
        let config = {
            method: 'post',
            url: 'https://stagingapi2.prescrip.in/apiv2/abdm-verify-abhaauthdemo',
            headers: {
                'Content-Type': 'application/json'
            },
            data: postBody
        };

        abdmRequest(postBody, config)
            .then((responseData) => {
                responseData = responseData.data;
                if (responseData.txnId) {
                    this.setState({
                        loading: false, step: this.state.radioIndex == 1 ? 1 : 0,
                        txnId: responseData.txnId

                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false
                });
                Alert.alert('Error', error.messsage);
            });

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
                        'Add Care Context'
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
                        <View style={{ flex: 1 }}>


                            <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#8B8B8B",
                                            fontFamily: "NotoSans",
                                        }}
                                    >
                                        Reference Number
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                        *
                                    </Text>
                                </View>
                                <TextInput

                                    keyboardType="email-address"
                                    placeholder="example: visit_234"
                                    value={this.state.refNum}
                                    editable={false}
                                    style={{
                                        borderBottomColor: "#d7d7d7",
                                        letterSpacing: 1,
                                        paddingTop: 5,
                                        textAlign: 'left',
                                        paddingBottom: 0,
                                        paddingTopLeft: 0,
                                        borderBottomWidth: 1,
                                        fontSize: 16,
                                        color: "#242424",
                                        fontFamily: "NotoSans",
                                    }}
                                />

                            </View>
                            <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#8B8B8B",
                                            fontFamily: "NotoSans",
                                        }}
                                    >
                                        Display Name
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                        *
                                    </Text>
                                </View>
                                <TextInput
                                    onChangeText={(text) =>
                                        this.setValue("displayName", text)
                                    }

                                    keyboardType="email-address"
                                    placeholder="example: patient_John_Rx"
                                    value={this.state.displayName}
                                    maxLength={30}
                                    style={{
                                        borderBottomColor: "#d7d7d7",
                                        letterSpacing: 1,
                                        paddingTop: 5,
                                        textAlign: 'left',
                                        paddingBottom: 0,
                                        paddingTopLeft: 0,
                                        borderBottomWidth: 1,
                                        fontSize: 16,
                                        color: "#242424",
                                        fontFamily: "NotoSans",
                                    }}
                                />

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
                                            {
                                                'Submit'}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCareContext);
