//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import {
  BG,
  lefticon,
  trans_collapsed,
  trans_expand,
} from "../../constants/images";

import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  StatusBar,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  TextInput,
  ScrollView,
  BackHandler,Dimensions
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import multipleTapHandler from "../../components/MultiTapHandle/index";
import { connect } from "react-redux";
import { setClinicDetails } from "../../actions/doctorProfile";

//import react in our code.
//import all the components we are going to use.

//import Carousel from 'react-native-banner-carousel';
import Tooltip from "react-native-walkthrough-tooltip";

import styles from "../../components/Header/styles";
import Images from "../../Theme/Images";
import HeaderData from "../../components/Header/header";
import EmptyHome from "../../components/EmptyHome/EmptyHome";
import ReviewClinicComponent from "../../components/ReviewClinicComponent";

import {
  ic_Orange_BG_578,
  ic_Empty_Setup_Clinic_Icon,
} from "../../constants/images";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class ReviewClinicContainer extends React.Component {
  //Setting Screen to show in Setting Option

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      toolTipVisible: false,
      isConsulting: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "Khurana Clinic ˅ ",
      isPendingCunsulting: false,
      phonenumber: "",

      //state to control the visibility of Tooltip
    };
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
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  onProceed() {
    this.props.navigation.navigate("AppointmentContactContainer");
    //this.props.screenProps.rootNavigation.navigate('VCWhatsAppNumberContainer')
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "ReviewClinic",
      screen_class: "ReviewClinicContainer",
    });
  }

  onBackPressed() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  onGotIt() {
    //this.props.screenProps.setTooltip("VideoConsult");
  }

  render() {
    let data = true; //this.props.screenProps.data
    const setModalVisible = true;
    const modalVisible = true;
    //this.props.screenProps.data =true;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
        behavior={Platform.select({ android: undefined, ios: "padding" })}
        enabled={Platform.OS == "android" ? false : true}
      >
        <View contentContainerStyle={{ flex: 1 }} 
            style={{  flex:1 }}>
          <View
            style={{
              flexdirection: "column",
              flex: 1,  width: Dimensions.get('window').width 
            }}
          >
            <View>
              <HeaderData
                {...this.props}
                bgImage={ic_Orange_BG_578}
                imagePath={Images.ic_profile_dummy_image}
                title={this.props.doctorProfile.ClinicAddress.ClinicName}
                description={"Review clinic\nTiming"}
                onGotIt={() => this.onGotIt()}
                leftImage={lefticon}
                rightImage={Images.ic_share_button}
                stepText={"Step 2 of 3"}
                progressBarWidth={0.75}
                type={5}
                leftImageOnClick={() => this.onBackPressed()}
              />
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                backgroundColor: "#FFFFFF",
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
                  backgroundColor: "#ffffff",
                  borderTopEndRadius: 20,
                  borderTopLeftRadius: 20,
                }}
              ></View>

              <ReviewClinicComponent {...this.props} />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0.1,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.onBackPressed()}
          >
            <View
              style={{
                width: "90%",
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                alignSelf: "center",
                borderRadius: 25,
                borderColor: "#08c9f1",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  color: "#08c9f1",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                EDIT
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.onProceed()}
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
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  setClinicDetails: (clinicAddress) =>
    dispatch(setClinicDetails(clinicAddress)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewClinicContainer);
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
