import React, { Component } from "react";
import SplashScreen from "react-native-splash-screen";
import Loading from "../../components/Loading";
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import { logAnalytics } from "../../commonmethods/analytics";
import { getAppConfig, setConfigData } from "../../actions/sync";
import appsFlyer from "react-native-appsflyer";
import {

  version as mobileVersion, versionAndroid, versionIOS

} from "../../../app.json";
import { getUserDetailsAnalytics } from "../../commonmethods/analytics";



class LoadingContainer extends Component {
  componentDidMount() {
    if (this.props.doctorProfile.DoctorData) {
      getUserDetailsAnalytics({
        userId: this.props.doctorProfile.DoctorData._id,
        doctorName: `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`,
      });
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 300);

    this.getRemoteConfig();
    if (this.props.tooltip.firstrun) {
      this.props.navigation.navigate("LandingScreen");
      // this.props.navigation.navigate(this.props.auth.token ? "OTP" : "OTP");
    } else {
      this.props.navigation.navigate(this.props.auth.token ? "Drawer" : "Login");
      //this.props.navigation.navigate(this.props.auth.token ? "OTP" : "OTP");
    }
    //this.props.navigation.navigate(this.props.auth.firstrun==true?"LandingScreen":"Login"|| this.props.auth.token? "App" : "Login");
  }

  //v1 --> Current App Version on Store. v2 --> App Version on Device
  compareVersion(v1, v2) {
    if (typeof v1 !== "string") return false;
    if (typeof v2 !== "string") return false;
    v1 = v1.split(".");
    v2 = v2.split(".");
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) return 1;
      if (v1[i] < v2[i]) return -1;
    }
    return v1.length == v2.length ? 0 : v1.length < v2.length ? -1 : 1;
  }

  //Get Config Data
  getRemoteConfig() {
    let data = {
      doctorId: "",
    };
    this.props.getAppConfig(data).then((response) => {
      let data = response.payload.data;
      if (data.status == 1) {
        this.props.setConfigData(data);

        let andriodfup =
          this.compareVersion(
            response.payload.data.data.Android,
            versionAndroid
          ) == 1
            ? true
            : false;
        let iosfup =
          this.compareVersion(response.payload.data.data.IOS, versionIOS) ==
            1
            ? true
            : false;

        if (Platform.OS == "ios" && iosfup) {
          //if (parseInt(response.payload.data.data.IOS) > parseInt(mobileVersion)) {

          this.props.navigation.navigate("ForceUpdateContainer");
          return;
          //}
        } else if (Platform.OS == "android" && andriodfup) {
          //if (parseInt(response.payload.data.data.Android) > parseInt(mobileVersion)) {
          this.props.navigation.navigate("ForceUpdateContainer");
          return;
          //}
        }
      }
    });
  }
  //
  //AppFlyer

  render() {
    return <Loading navigation={this.props.navigation} />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tooltip: state.tooltip,
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  getAppConfig: (data) => dispatch(getAppConfig(data)),
  setConfigData: (data) => dispatch(setConfigData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(LoadingContainer));
