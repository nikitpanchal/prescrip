import React, { Component } from "react";
import { Keyboard, BackHandler } from "react-native";
import { connect } from "react-redux";
import AppointmentContactComponent from "../../components/AppointmentComponent/AppointmentContactComponent";
import { hasSpecialCharacter, isPhoneno } from "../../commonmethods/validation";
import {
  setClinicDetails,
  setDoctorData,
  updateDoctorDetails,
  addClinicAddresses,
} from "../../actions/doctorProfile";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class AppointmentContactContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    var ClinicName = props.doctorProfile.ClinicAddress.ClinicName;
    this.state = {
      clinicName: ClinicName,
      address: "",
      contactNo: "",
      msg: "",
      msg2: "",
    };
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "AppointmentContact",
      screen_class: "AppointmentContactContainer",
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
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    return (
      <AppointmentContactComponent
        {...this.props}
        clinicName={this.state.clinicName}
        // onProceedYes={() => this.onProceedYes(state, name, state2, name2)}
        // onProceedNo={() => this.onProceedNo(state, name, state2, name2)}
        msg1={this.state.msg}
        msg2={this.state.msg2}
        isValidAddress={this.state.isValidAddress}
        isValidContactNo={this.state.isValidContactNo}
      />
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
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  addClinicAddresses: (data) => dispatch(addClinicAddresses(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentContactContainer);
