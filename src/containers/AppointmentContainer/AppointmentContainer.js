//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  StatusBar,
  Dimensions,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  TextInput,
  ScrollView,
  BackHandler,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import multipleTapHandler from "../../components/MultiTapHandle/index";

import Tooltip from "react-native-walkthrough-tooltip";
import { setDoctorData, setClinicDetails } from "../../actions/doctorProfile";

import styles from "../../components/Header/styles";
import Images from "../../Theme/Images";
import HeaderData from "../../components/Header/header";
import FooterData from "../../components/Footer/FooterData";
import EmptyHome from "../../components/EmptyHome/EmptyHome";
import AppointmentComponent from "../../components/AppointmentComponent";
import { isNameValid, isAddressValid } from "../../commonmethods/validation";
import { lefticon, ic_Orange_BG_578 } from "../../constants/images";
import { connect } from "react-redux";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

const colorCode = "#EB5E60";

const DATA = [
  {
    id: "1",
    name: "Sourabh Patil",
    year: "2",
    gender: "Male",
    day: "3",
    srno: "01",
    isActive: false,
  },
  {
    id: "2",
    name: "Pritish Patil",
    year: "3",
    gender: "Male",
    day: "3",
    srno: "02",
    isActive: true,
  },
  {
    id: "3",
    name: "Ravi",
    year: "5",
    gender: "Male",
    day: "3",
    srno: "04",
    isActive: false,
  },
  {
    id: "4",
    name: "Ruben",
    year: "4",
    gender: "Male",
    day: "1",
    srno: "05",
    isActive: false,
  },
  {
    id: "1",
    name: "Sourabh Patil",
    year: "2",
    gender: "Male",
    day: "3",
    srno: "06",
    isActive: false,
  },
  {
    id: "2",
    name: "Pritish Patil",
    year: "3",
    gender: "Male",
    day: "3",
    srno: "07",
    isActive: false,
  },
  {
    id: "3",
    name: "Ravi",
    year: "5",
    gender: "Male",
    day: "3",
    srno: "08",
    isActive: false,
  },
  {
    id: "4",
    name: "Ruben",
    year: "4",
    gender: "Male",
    day: "1",
    srno: "09",
    isActive: false,
  },
];

class AppointmentContainer extends React.Component {
  //Setting Screen to show in Setting Option

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      toolTipVisible: false,
      isConsulting: false,
      msg: "",
      isValid: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      //  / pendingCunsultingDescription: 'Khurana Clinic  ',
      isPendingCunsulting: false,
      phonenumber: "",
      fullname: "",
      //state to control the visibility of Tooltip
    };
    this.ClinicAddress = {
      IsDefault: 0,
      ClinicId: 0,
      ClinicName: "",
      Address: "",
      City: "",
      State: "",
      Pincode: "",
      ContactNo: "",
      OperationHours: null,
      OpenAndClosingTime: "",
      AverageTimePerConsultInMinutes: "",
      Latitude: 0,
      Longitude: 0,
    };
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "AddClinic",
      screen_class: "AppointmentContainer",
    });
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    this.props.navigation.addListener("focus", () => {
      if (this.props.doctorProfile.ClinicAddress) {
        this.ClinicAddress = { ...this.props.doctorProfile.ClinicAddress };
        if (!this.ClinicAddress.Latitude) {
          this.ClinicAddress["Latitude"] = 0;
          this.ClinicAddress["Longitude"] = 0;
        }
        if (!this.ClinicAddress.OperationHours) {
          this.ClinicAddress["OperationHours"] = [];
        }
      } else {
        this.ClinicAddress = {
          IsDefault: 0,
          ClinicId: 0,
          ClinicName: "",
          Address: "",
          City: "",
          State: "",
          Pincode: "",
          ContactNo: "",
          OperationHours: [],
          OpenAndClosingTime: "",
          AverageTimePerConsultInMinutes: "",
          Latitude: 0,
          Longitude: 0,
        };
      }
      this.props.setClinicDetails(this.ClinicAddress);
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }
  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  // onGotIt() {
  //   //this.props.screenProps.setTooltip("VideoConsult");
  // }

  proceed() {
    Keyboard.dismiss();
    let doctorData = { ...this.props.doctorProfile.DoctorData };
    let clinicId = 0;
    if (doctorData.ClinicAddresses.length > 0) {
      let cliniclength = doctorData.ClinicAddresses.length - 1;
      clinicId = doctorData.ClinicAddresses[cliniclength].ClinicId;
    }
    // let valid = isAddressValid(this.ClinicAddress.ClinicName, "Clinic Name")
    let valid;
    if (this.ClinicAddress.ClinicName) {
      valid = true;
    }

    this.setState(
      { isValid: valid, msg: "Please enter valid Clinic Name" },
      () => {
        if (this.state.isValid) {
          this.ClinicAddress.ClinicId = this.ClinicAddress.ClinicId
            ? this.ClinicAddress.ClinicId
            : clinicId + 1;

          this.props.setClinicDetails(this.ClinicAddress);
          this.props.navigation.navigate("OperatingHours");
        }
      }
    );
  }
  setClinicName(text) {
    this.ClinicAddress.ClinicName = text;
  }
  render() {
    //this.props.screenProps.data =true;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
        behavior={Platform.select({ android: undefined, ios: "padding" })}
        enabled={Platform.OS == "android" ? false : true}
      >
        <View contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1  }}>
          <View
            style={{
              flexdirection: "column",
              flex: 1, width: Dimensions.get('window').width
            }}
          >
            <ScrollView
              style={{
                flexdirection: "column",
                flex: 1,
              }}
            >
              <View>
                <HeaderData
                  {...this.props}
                  bgImage={ic_Orange_BG_578}
                  imagePath={Images.ic_profile_dummy_image}
                  title={
                    this.ClinicAddress.ClinicId != 0
                      ? "Edit Clinic"
                      : "Add Clinic"
                  }
                  description={"What is the name of your clinic / hosptial?"}
                  onGotIt={() => this.onGotIt()}
                  leftImage={lefticon}
                  rightImage={Images.ic_share_button}
                  stepText={"Step 1 of 3"}
                  progressBarWidth={0.25}
                  type={5}
                  leftImageOnClick={() => this.leftImageOnClick()}
                />
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  backgroundColor: "#fffff",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    top: -20,
                    alignSelf: "center",
                    width: "100%",
                    height: 50,
                    backgroundColor: "#fffff",
                    borderTopEndRadius: 20,
                    borderTopLeftRadius: 20,
                  }}
                ></View>
                <View
                  style={{
                    marginRight: 20,
                    marginLeft: 20,

                    borderBottomWidth: 1,
                    borderBottomColor: "#06c0d7",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: "#8b8b8b",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      Clinic Name{" "}
                    </Text>
                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      *
                    </Text>
                  </View>

                  <TextInput
                    onChangeText={(txt) => this.setClinicName(txt)}
                    keyboardType="default"
                    defaultValue={this.ClinicAddress.ClinicName}
                    style={{
                      fontSize: 16,
                      color: "#242424",
                      marginVertical: 5,
                      padding: 0,
                      fontSize: 30,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>

                {/* {this.state.onClick ? this.nameValid() : null} */}
                {!this.state.isValid ? (
                  <Text
                    style={{
                      marginRight: 20,
                      marginLeft: 20,
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {this.state.msg}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
            <View style={{ paddingVertical: 20 }} />
            <View style={{ flex: 0.1, justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() =>
                multipleTapHandler.multitap(
                  () => this.proceed(),
                  "OperatingHours"
                )
              }
            >
              <LinearGradient
                colors={["#1b7cdb", "#07cef2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.8]}
                style={{
                  width: "90%",
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  alignSelf: "center",
                  borderRadius: 25,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    color: "#ffffff",
                    fontFamily: "NotoSans-Bold",
                  }}
                >
                  PROCEED
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setClinicDetails: (clinicAddress) =>
    dispatch(setClinicDetails(clinicAddress)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentContainer);
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
