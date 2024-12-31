import React, { Component } from "react";
import WhatsAppNumber from "../../components/Login/WhatsAppNumber";
import {
  setDoctorData,
  updateDoctorDetails,
} from "../../actions/doctorProfile";
import { connect } from "react-redux";
import { View, Text, BackHandler } from "react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class WhatsAppNumContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    getScreenNameAnalytics({
      screen_name: "AddWhatsAppNumber",
      screen_class: "WhatsAppNumContainer",
    });
  }

  _handleBackPress() {
    // this.props.navigation.goBack()
    this.props.navigation.navigate("RegisterVideoConsultation");

    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  render() {
    return (
      <WhatsAppNumber {...this.props} goBack={() => this._handleBackPress()} />
    );
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
)(WhatsAppNumContainer);
