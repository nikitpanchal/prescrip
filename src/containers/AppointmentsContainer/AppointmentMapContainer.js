import React, { Component } from "react";
import { BackHandler } from "react-native";
import AppointmentMapScreen from "../../components/AppointmentComponent/AppointmentMapScreen";
import {
  setDoctorData,
  setClinicDetails,
  updateDoctorDetails,
  addClinicAddresses,
} from "../../actions/doctorProfile";
import { connect } from "react-redux";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class AppointmentMapContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "AppointmentMapScreen",
      screen_class: "AppointmentMapContainer",
    });
  }
  navigateback() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  render() {
    return (
      <AppointmentMapScreen
        {...this.props}
        clinicName={this.props.doctorProfile.ClinicAddress.ClinicName}
        navigateback={() => this.navigateback()}
      />
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
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
)(AppointmentMapContainer);
