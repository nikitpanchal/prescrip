import React, { Component } from "react";
import { View, BackHandler, ToastAndroid, StatusBar } from "react-native";
import Images from "../../Theme/Images";
import { lefticon } from "../../constants/images";
import CertificateFavComponent from "../../components/CertificateFavComponent/CertificateFavComponent";
import { Container } from "native-base";
import PrescriptionWebViewHeader from "../../components/Header/PrescriptionWebViewHeader";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import CertificateList from "../../components/Certificate/CertificateList";
import {
  setCertificateType,
  clearCertificate,
  setPaperSettings,
} from "../../actions/certificates";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class CertificateFavContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {};
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "SelectTemplatePreview",
      screen_class: "SelectTemplateContainer",
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
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }
  OnClick(callFrom) {
    switch (callFrom) {
      case "left":
        multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
        break;

      case "right":
        multipleTapHandler.clearNavigator(),
          ToastAndroid.show("Implementation in progress", ToastAndroid.LONG);
        break;

      case "secondRight":
        multipleTapHandler.clearNavigator(),
          ToastAndroid.show("Implementation in progress", ToastAndroid.LONG);
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={"#ffffff"}
          title={
            "ISSUE CERTIFICATE TO " +
            this.props.patientvisit.patientDetails.CommonDetails.FullName.toUpperCase()
          }
          description={"Select Template"}
          titleColor={"#919191"}
          descriptionColor={"#0b69d8"}
          leftImage={Images.ic_black_back}
          rightImage={""}
          secondRightImage={""}
          OnClick={(callFrom) => this.OnClick(callFrom)}
        />
        <CertificateFavComponent
          {...this.props}
          leftImage={lefticon}
          btnText={"Select Template"}
          title={"Select Template"}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  patientvisit: state.patientvisit,
  doctorProfile: state.doctorProfile,
  certificates: state.certificates,
});
const mapDispatchToProps = (dispatch) => ({
  setCertificateType: (certificate) =>
    dispatch(setCertificateType(certificate)),
  clearCertificate: () => dispatch(clearCertificate()),
  setPaperSettings: (setting) => dispatch(setPaperSettings(setting)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(CertificateFavContainer));
