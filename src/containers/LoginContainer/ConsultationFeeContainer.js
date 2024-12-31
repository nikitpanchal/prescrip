/****** code by ravi ******/
import React, { Component } from "react";
import ConsultationFeeComponent from "../../components/Login/ConsultationFee";
import { BackHandler } from "react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

export default class ConsultationFeeContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);

    this.state = {};
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    getScreenNameAnalytics({
      screen_name: "ConsultationFee",
      screen_class: "ConsultationFeeContainer",
    });
  }

  _handleBackPress() {
    // this.props.navigation.goBack()
    this.props.navigation.navigate("WhatsAppNumContainer");

    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  render() {
    return (
      <ConsultationFeeComponent
        {...this.props}
        back={() => this._handleBackPress()}
      />
    );
  }
}
