//code by ravi
import React from "react";
import { ic_Orange_BG_578 } from "../../constants/images";
import { Container, Text } from "native-base";
import { StackActions, CommonActions } from '@react-navigation/native';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from "react-native";
import HeaderData from "../../components/Header/header";
import CongratsClinicComponent from "../../components/CongratsClinic/CongratsClinicComponent";
 
import { connect } from "react-redux";
import { SuccessfulTick, Clinic_setup_icon } from "../../constants/images";

import { setClinicDetails } from "../../actions/doctorProfile";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
var fabRipple = require("../../../assets/Json/verification.json");

class CongratsClinicContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConsulting: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "22 Video Consultations",
      isPendingCunsulting: false,
    };
    this.clinicName = props.doctorProfile.ClinicAddress.ClinicName;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  //back press handler
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
    //  this.props.navigation.goBack(null);
    return true;
  }
  componentDidMount() {
    //
    getScreenNameAnalytics({
      screen_name: "ClinicAddSuccess",
      screen_class: "CongratsClinicContainer",
    });
  }

  onProceedYes() {
    Keyboard.dismiss();
    this.props.navigation.dispatch(
      this.props.navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'DoctorProfileViewContainer' }]

      })));
   
  }

  onNoMayBeLater() {
    let ClinicAddress = {
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
      Latitude: 0,
      Longitude: 0,
    };

    this.props.setClinicDetails(ClinicAddress);
    
      this.props.navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Drawer' }]

      }));
  }

  onAddAnotherClinic() {
    let ClinicAddress = {
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

    this.props.setClinicDetails(ClinicAddress);
    this.props.navigation.navigate("AppointmentContainer");

    // this.props.navigation.dispatch(StackActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: "AppointmentContainer", params: { foo: true, introScreen: '' } })]
    // }));
  }

  onNoMayBeLater() {
    this.props.navigation.dispatch(
      this.props.navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Drawer' }]

      })));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexdirection: "column",
            flex: 1, width: Dimensions.get('window').width,
            backgroundColor: "#f8f8f8",
          }}
        >
          <CongratsClinicComponent
            {...this.props}
            description={this.clinicName}
            extraData={"has now been setup!"}
          />

          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column",
              position: "absolute",
              zIndex: 0,
              bottom: 0,
              width: Dimensions.get('window').width,
              paddingHorizontal: 10,
              backgroundColor: "#f8f8f8",
              paddingBottom: 18,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                marginBottom: 8,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                this.onProceedYes();
              }}
            >
              <LinearGradient
                colors={["#28b72e", "#09d313"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.8]}
                style={{
                  width: "95%",
                  borderRadius: 25,
                  backgroundColor: "#23bc29",
                  paddingVertical: 13,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    color: "#ffffff",
                    fontFamily: "NotoSans-Bold",
                    textTransform: "uppercase",
                  }}
                >
                  PROCEED
                </Text>
                {this.props.loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </LinearGradient>
            </TouchableOpacity>

            <View
              style={{
                paddingHorizontal: 10,
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.onNoMayBeLater();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    textDecorationLine: "underline",
                    fontFamily: "NotoSans-Bold",
                    fontSize: 16,
                    color: "#757575",
                  }}
                >
                  No, may be later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onAddAnotherClinic();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    textDecorationLine: "underline",
                    fontFamily: "NotoSans-Bold",
                    fontSize: 16,
                    color: "#ec6569",
                  }}
                >
                  Add Another Clinic
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  setClinicDetails: (data) => dispatch(setClinicDetails(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CongratsClinicContainer);
