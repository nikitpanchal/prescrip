import React, { Component } from "react";
import AppointmentTypesComponent from "../../components/AppointmentComponent/AppointmentTypesComponent";
import {
  KeyboardAvoidingView,
  Modal as RModal,
  Share,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  BackHandler,
} from "react-native";
import { androidlink, ioslink } from "../../../app.json";
import {
  ic_more_icon,
  ic_sms_icon,
  ic_whatsapp_icon,
  ic_mail_icon,
} from "../../constants/images";
import {
  setVCTransactionDetails,
  offlinepayment,
  setPaymentLink,
  setNavigationFlow,
} from "../../actions/patientVisit";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { toHumanSize } from "i18n-js";

class AppointmentTypesContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    (this.phone = ""),
      (this.state = {
        shareModal: false,
      });
  }
  handleBackButtonClick() {
    // this.removeFlags();
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }
  async onShare(item) {
    try {
      let msg =
        "Hello, you can view my clinic(s) & take an appointment for consultation using below link " +
        this.props.doctorProfile.DoctorData.ShortUrl;

      const result = await Share.share({
        message: msg,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }

  refershList = () => {
    //  alert('dfs')
  };

  onContactSearch() {
    this.props.setNavigationFlow("AppointmentVC");
    multipleTapHandler.clearNavigator();

    this.props.navigation.navigate("PatientSearchComponent", {
      returnPatientData: this.refershList,
      callFrom: "AppointmentVC",
    });
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
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
    return true;
  }

  render() {
    let isPatClicked =
      this.props.route.params &&
      this.props.route.params.isPatClicked
        ? this.props.route.params.isPatClicked
        : false;
    let itemData =
      this.props.route.params &&
      this.props.route.params.itemData
        ? this.props.route.params.itemData
        : {};
    return (
      <>
        <AppointmentTypesComponent
          {...this.props}
          onClickBtn2={() => this.props.navigation.push("IvMyPatientsScreen")}
          onContactSearch={() => this.onContactSearch()}
          leftImageClick={() => this.leftImageOnClick()}
          itemData={itemData}
          patientClicked={isPatClicked}
          mobile={itemData && itemData.Mobile ? itemData.Mobile : ""}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  setNavigationFlow: (data) => dispatch(setNavigationFlow(data)),

  // updateDoctorDetails: (objectValue, objectKey, doctorId) => dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  //setDoctorData:(docorData)=>dispatch(setDoctorData(docorData))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AppointmentTypesContainer));
