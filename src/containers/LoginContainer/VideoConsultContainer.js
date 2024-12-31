import React, { Component } from "react";
import { View, Text, BackHandler } from "react-native";

import VideoConsultation from "../../components/Login/VideoConsultation";
import { connect } from "react-redux";
import {
  setDoctorData,
  updateDoctorDetails,
} from "../../actions/doctorProfile";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class VideoConsultContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    getScreenNameAnalytics({
      screen_name: "VCConsultation",
      screen_class: "VCConsultationFeeContainer",
    });
  }

  _handleBackPress() {
    // this.props.navigation.goBack()
    this.props.navigation.navigate("RegisterSpecialization");

    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  render() {
    return <VideoConsultation {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoConsultContainer);
