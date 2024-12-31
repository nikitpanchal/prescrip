/****** code by ravi ******/

import React, { Component } from "react";
import { getAppConfig } from "../../actions/sync";
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";

import { AppState, View, TouchableOpacity, Image, Platform, Dimensions, ImageBackground, Text } from "react-native";
import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';
import { NoSubForBidden } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import { CommonActions } from '@react-navigation/native';


class NoSubscription extends Component {
  constructor(props) {
    super(props);
    this.deviceWidth = Dimensions.get('screen').width;
    this.deviceHeight = Dimensions.get('screen').height;
    this.headerBotton = this.deviceHeight * 28 / 100;
    this.subheaderBotton = this.deviceHeight * 26 / 100;
    this.Connected = true;
    this.state = {
      appState: AppState.currentState
    }

  }

  CheckConnectivity = () => {
    this.props.navigation.navigate('SettingsSubscription')
  };

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.getRemoteConfig();
      //alert("App has come to the foreground!");
    }
    this.setState({ appState: nextAppState });
  };
  componentDidMount() {

   // AppState.addEventListener('change', this._handleAppStateChange);


  }
  componentWillUnmount() {
   // AppState.addEventListener('change', this._handleAppStateChange).remove();


  }

  getRemoteConfig() {

    var assistantId = this.props.doctorProfile.DoctorData ? this.props.doctorProfile.DoctorData.AssistantId : "";

    let data = {
      doctorId: this.props.doctorProfile.DoctorData
        ? this.props.doctorProfile.DoctorData._id
        : '', assistantId
    };
    this.props.getAppConfig(data).then((response) => {
      let data = response.payload.data;
      if (data.status == 1) {

        if (data.doctorData.SubscriptionValid) {
           
            this.props.navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Drawer' }]

            }));
           
        }

      }
    });
  }
  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      this.props.retryClick(false)

      //  Alert.alert("You are offline!");
    } else {
      this.props.retryClick(true)

      //   Alert.alert("You are online!");
    }
  };



  render() {
    return (

      <View style={{
        flex: 1, justifyContent: "center", width: this.deviceWidth, flex: 1, position: 'absolute',
        height: this.deviceHeight,
      }}>
        <ImageBackground source={Images.bg_white} style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          resizeMode: 'cover',
        }}>
          <Image style={{ resizeMode: 'contain', flex: 1, alignSelf: 'center', width: '60%', marginBottom: 30 }}
            source={NoSubForBidden} />
          <View style={{ bottom: this.headerBotton }}>

            <Text style={{
              fontWeight: 'bold', fontSize: 20, color: '#3b3b3b',
              textAlign: 'center', letterSpacing: 1, paddingBottom: 20, paddingTop: 10
            }}>Account Locked</Text>

            <Text style={{
              textAlign: 'center', fontSize: 16,
              color: '#3b3b3b', paddingBottom: 20
            }}>{this.props.NoNetworkMsg ? this.props.NoNetworkMsg : "Your Prescrip Account has been temporarily locked"}</Text>

            <TouchableOpacity block style={{
              backgroundColor: "#008be0",
              fontWeight: 'normal',
              bottom: 0, alignSelf: 'center',
              marginBottom: 0,
              zIndex: 0,
              width: '50%', borderRadius: 30, paddingVertical: 10,
              marginLeft: 5
            }} onPress={() => { this.CheckConnectivity() }}>
              <Text uppercase={true} style={{ fontSize: 18, color: '#fff', textAlign: 'center', fontFamily: 'NotoSans-Bold' }}>
                {"UNLOCK"}</Text>
            </TouchableOpacity>

          </View>
        </ImageBackground>
      </View>




    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  getAppConfig: (data) => dispatch(getAppConfig(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoSubscription);
