/****** code by ravi ******/

import React, { Component } from "react";

import io from 'socket.io-client';

import { isStagging, staging, prod } from "../../../app.json";

import { setToken } from "../../actions/auth";
import { connect } from "react-redux";

import * as RootNavigation from './RootNavigation';






class LogoutSocketHandler extends Component {
  constructor(props) {
    super(props);

    this.socketConnection = null;
  }
  navigate(name, params) {
    RootNavigation.navigate('Login');
  }
  componentDidMount() {

    let self = this;
    let socket_url = isStagging ? staging.socket : prod.socket;
    this.socketConnection = io(socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050/");


    this.socketConnection.on('connect', function (data) {
      if (self.socketConnection) {
        self.socketConnection.emit("room", self.props.doctorProfile.DoctorData._id);


      }
    });

    this.socketConnection.on('ReceiveLogoutAllDoc', function (data) {
      self.props.setToken('');
      self.navigate("SettingsContainer", null);
       

    });
  }



  render() {
    return (
      null




    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile

});

const mapDispatchToProps = (dispatch) => ({
  setToken: (data) => dispatch(setToken(data)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutSocketHandler);