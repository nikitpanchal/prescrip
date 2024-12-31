import React, { Component } from "react";
import Sidebar from "../../components/sidebar";
import { Share, Linking, Platform } from "react-native";

import { connect } from "react-redux";
import { userRequestLogout } from "../../actions";
import { setTooltip } from "../../actions/home";
import { setSyncFlag } from "../../actions/sync";
import { setCurrentTab, isRefreshBilling, setToken } from "../../actions/auth";
import { clearDoctorData, setPatientCount } from "../../actions/doctorProfile";
import { androidlink, ioslink } from "../../../app.json";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { CommonActions } from '@react-navigation/native';

class SidebarContainer extends Component {
  constructor(props) {
    super(props);
    const firstnamealpha = props.doctorProfile.DoctorData
      ? props.doctorProfile.DoctorData.DoctorFName.charAt(0).toUpperCase()
      : "";
    const surfirstalpha = props.doctorProfile.DoctorData
      ? props.doctorProfile.DoctorData.DoctorLName.charAt(0).toUpperCase()
      : "";
    // const username = firstnamealpha + surfirstalpha;
    this.state = {
      doctorimage_alpha: firstnamealpha + surfirstalpha,
    };

    this.data = [
      {
        name: "Home",
        route: "Home",
        icon: "home",
      },
      {
        name: "Modal",
        route: "Modal",
        icon: "albums",
      },
      {
        name: "Logout",
        route: "Logout",
        icon: "log-out",
      },
    ];
  }
  logoutInActive() {
    let docProfile = this.props.doctorProfile;

    // if (docProfile.DoctorData.Subscription) {
    //   if (!docProfile.DoctorData.Subscription.Valid) {
    //     //this.props.navigation.navigate('NoSubscription');
    //     this.props.navigation.dispatch(CommonActions.reset({
    //       index: 0,
    //       routes: [{ name: 'NoSubscription' }]

    //     }));
    //   }
    // }
    //  this.props.navigation.navigate('NoSubscription');
    // this.props.navigation.dispatch(CommonActions.reset({
    //   index: 0,
    //   routes: [{ name: 'NoSubscription' }]

    // }));
  }

  componentDidMount() {
    this.logoutInActive();
    multipleTapHandler.clearNavigator();

  }
  //share app link
  async onShare() {
    try {
      let msg =
        "Hey doctor check this app called Prescrip, its simply amazing to manage your patient and create prescription | Download Android : " +
        androidlink +
        " | IOS : " +
        ioslink;
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
      this.props.submitErrors("Sidebar", error, "onShare");
      alert(error.message);
    }
  }

  //open app cme
  openCme(url) {
    Linking.openURL(url);
  }

  //app about
  openAbout(url) {
    Linking.openURL(url);
  }

  navigator(data) {
    if (data == "Logout") {
      this.props.setToken('');
      
      this.props.setCurrentTab("MyPatients");
      this.props.isRefreshBilling(true);
      let data = {
        lastSync: null,
        synced: false,
      };
      this.props.setSyncFlag(data);
      this.props.navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }]

      }));
    } else {
      this.props.navigation.navigate(data);
    }
  }

  //call to the app support
  Supportcall() {
    let phoneNumber = this.props.sync.configData.supportNo
      ? this.props.sync.configData.supportNo
      : "+918850103807";
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }

  //whatsapp to app support
  Supportwhatsapp() {
    Linking.openURL("whatsapp://send?phone=91" + (this.props.sync.configData.supportNo
      ? this.props.sync.configData.supportNo
      : "+918850103807"));
  }
  Feedbackbtn() {
    Linking.openURL("mailto:info@prescrip.in");
  }

  render() {
    return (
      <Sidebar
        {...this.props}
        data={this.data}
        onPress={(data) => this.navigator(data)}
        onShare={() => this.onShare()}
        openAbout={(url) => this.openAbout(url)}
        openCme={(url) => this.openCme(url)}
        Supportcall={() => this.Supportcall()}
        Supportwhatsapp={() => this.Supportwhatsapp()}
        Feedbackbtn={() => this.Feedbackbtn()}
        doctorimage_alpha={this.state.doctorimage_alpha}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userRequestLogout()),
  clearData: () => dispatch(clearDoctorData()),
  setTooltip: (tab) => dispatch(setTooltip(tab)),
  setSyncFlag: (data) => dispatch(setSyncFlag(data)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  setPatientCount: (data) => dispatch(setPatientCount(data)),
  setToken: (token) => dispatch(setToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
