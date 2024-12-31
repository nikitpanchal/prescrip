/****** code by ravi ******/

import React, { Component } from "react";
import VCWhatsAppNumberComponent from "../../components/VideoConsultation/VCWhatsAppNumberComponent";
import VCWhatsAppNumberComponent_Ipad from "../../components/VideoConsultation/VCWhatsAppNumberComponent_Ipad";
import {
  setDoctorData,
  updateDoctorDetails,
} from "../../actions/doctorProfile";
import { connect } from "react-redux";
import { BackHandler, Platform } from "react-native";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class VCWhatsAppNumberContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);

    this.state = {};
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "AddWhatsAppNumber",
      screen_class: "WhatsAppNumContainer",
    });
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  _handleBackPress() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }

  render() {
    return <VCWhatsAppNumberComponent {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  setDoctorData: (docorData) => dispatch(setDoctorData(docorData)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VCWhatsAppNumberContainer);
