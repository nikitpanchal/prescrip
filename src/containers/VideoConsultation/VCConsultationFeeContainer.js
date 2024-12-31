/****** code by ravi ******/
import React, { Component } from "react";
import VCConsultationFeeComponent from "../../components/VideoConsultation/VCConsultationFeeComponent";
import VCConsultationFeeComponent_Ipad from "../../components/VideoConsultation/VCConsultationFeeComponent_Ipad";
import {
  BackHandler,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";

import multipleTapHandler from "../../components/MultiTapHandle/index";

 
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

export default class VCConsultationFeeContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {};
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
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "VCConsultation",
      screen_class: "VCConsultationFeeContainer",
    });
  }
  onClick() {
    this.props.navigation.navigate("RegistrationSuccess");
    // this.props.navigation.dispatch(StackActions.reset({
    //     index: 0,

    //     actions: [NavigationActions.navigate({ routeName: "Drawer",params: { foo: true,introScreen :'' }  })]
    //     }));
  }

  render() {
    return (
      <VCConsultationFeeComponent
        {...this.props}
        onClick={() => {
          multipleTapHandler.multitap(
            () => this.onClick(),
            "RegistrationSuccess"
          );
        }}
      />
    );
  }
}
