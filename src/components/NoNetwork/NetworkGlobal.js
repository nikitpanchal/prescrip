/****** code by ravi ******/

import React, { Component } from "react";

import io from 'socket.io-client';
import NetInfo, { NetInfoCellularGeneration } from "@react-native-community/netinfo";
import { isStagging, staging, prod } from "../../../app.json";
import { StatusBar, View, TouchableOpacity, Image, Platform, Dimensions, Button, Text } from "react-native";
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';
import { prescrip_loader } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import { setToken } from "../../actions/auth";
import { connect } from "react-redux";
var NoNetwork = require('../../../assets/NoNetwork/No-Connection.png');



class noNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isconnected: true
    }
    this.deviceWidth = Dimensions.get('screen').width;
    this.deviceHeight = Dimensions.get('screen').height;
    this.headerBotton = this.deviceHeight * 28 / 100;
    this.subheaderBotton = this.deviceHeight * 26 / 100;
    this.Connected = true;
    this.netInfoListener = null;

  }
  componentDidMount() {

    this.CheckConnectivity();
    fetch('https://www.google.com')
      .then((data) => {
        this.setState({ isconnected: true })
      }).catch(err => {
        this.setState({ isconnected: false })
      });


  }
  componentWillUnmount() {
    this.netInfoListener ? this.netInfoListener() : null;
  }
  CheckConnectivity = (isRetry) => {


    if (isRetry)
      NetInfo.fetch().then(isConnected => {
        this.setState({ isconnected: isConnected.isConnected });
      });
    else {
      this.netInfoListener = NetInfo.addEventListener(this.handleFirstConnectivityChange);
    }

  };


  handleFirstConnectivityChange = isConnected => {
    this.setState({ isconnected: isConnected.isConnected });

  };



  render() {
    return (
      !this.state.isconnected ?
        <View style={{
          flex: 1, justifyContent: "center", width: this.deviceWidth, flex: 1, position: 'absolute', backgroundColor: '#fff',
          height: this.deviceHeight, zIndex: 99999, backgroundColor: '#f5f5f5'
        }}>
          <Image style={{ resizeMode: 'contain', flex: 1, alignSelf: 'center', height: '100%', width: '100%' }}
            source={NoNetwork} />
          <View style={{ bottom: this.headerBotton }}>

            <Text style={{
              fontWeight: 'bold', fontSize: 20, color: '#3b3b3b',
              textAlign: 'center', letterSpacing: 1, paddingBottom: 10, paddingTop: 10
            }}>No Connection</Text>

            <Text style={{
              textAlign: 'center', fontSize: 16,
              color: '#3b3b3b', paddingBottom: 10
            }}>{this.props.NoNetworkMsg ? this.props.NoNetworkMsg : "Your Internet Connection was interupted,\nPlease Retry"}</Text>

            <TouchableOpacity block style={{
              backgroundColor: "#008be0",
              fontWeight: 'normal',
              bottom: 0,
              marginBottom: 0,
              zIndex: 0,
              width: '30%', borderRadius: 30, paddingVertical: 10,
              left: this.deviceWidth / 3, zIndex: 999999, marginLeft: 5
            }} onPress={() => { this.CheckConnectivity(true) }}>
              <Text uppercase={true} style={{ fontSize: 18, color: '#fff', textAlign: 'center' }}>
                {"RETRY"}</Text>
            </TouchableOpacity>

          </View>

        </View>

        : null


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
)(noNetwork);