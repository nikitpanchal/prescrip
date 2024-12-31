import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
import VC_SetupComponent from "../../components/Login/VC_SetupComponent";
import Images from "../../Theme/Images";

class VC_SetupContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "VC_Setup",
      screen_class: "VC_SetupContainer",
    });
  }
  render() {
    return <VC_SetupComponent {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
export default connect(mapStateToProps)(VC_SetupContainer);
