import React, { Component } from "react";
import { connect } from "react-redux";
import { withDb } from "../DatabaseContext/withDatabase";
import App from "./AppNavigator";
import Drawer from "./DrawerNavigator";
import Loading from "../containers/LoadingContainer";
import Login from "../containers/LoginContainer";
import RegisterContainer from "../containers/LoginContainer/RegisterContainer";
import DigiConsultationSetupContainer from "../containers/LoginContainer/DigiConsultationSetupContainer";
import OTPContainer from "../containers/LoginContainer/OTPContainer";
import SpecializationContainer from "../containers/LoginContainer/SpecializationContainer";
import VideoConsultContainer from "../containers/LoginContainer/VideoConsultContainer";
import CongratsContainer from '../containers/LoginContainer/CongratsContainer';
import WhatsAppNumContainer from '../containers/LoginContainer/WhatsAppNumContainer';
import ConsultationFeeContainer from '../containers/LoginContainer/ConsultationFeeContainer';
import LandingScreen from '../components/Login/LandingScreen';
import WhatsNewContainer from '../containers/WhatsNewContainer/WhatsNewContainer'
import AppointmentContainer from '../containers/AppointmentContainer/AppointmentContainer'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions } from "react-native";

const Switch = createNativeStackNavigator();
const config = {
  screens: {
    "s": 'SettingsSubscription',
    
  },
};

const linking = {
  prefixes: ["https://rx.prescrip.in/app/s"],
  screens: config,
   
};
const switchcontainer =
{
  Loading: { screen: Loading },
  App: { screen: App },

  Login: { screen: Login },
  Register: { screen: RegisterContainer, },
  OTP: { screen: OTPContainer },
  RegisterSpecialization: { screen: SpecializationContainer },
  RegisterVideoConsultation: { screen: VideoConsultContainer },
  AppointmentContainer: { screen: AppointmentContainer },
  RegistrationSuccess: { screen: CongratsContainer },
  DigiConsultationSetupContainer: { screen: DigiConsultationSetupContainer },

  WhatsAppNumContainer: { screen: WhatsAppNumContainer },
  ConsultationFeeContainer: { screen: ConsultationFeeContainer },
  LandingScreen: { screen: LandingScreen },
  ForceUpdateContainer: { screen: WhatsNewContainer },
};
const dd = []
Object.keys(switchcontainer).forEach(element => {


  dd.push(<Switch.Screen
    name={element}
    component={switchcontainer[element].screen}
    options={{
      headerBackVisible: false,
      headerShown: false
    }}
  />)


});

function SwitchNavigator({ auth }) {
  if (!auth.token)
    return <NavigationContainer  >
      <Switch.Navigator screenOptions={{
        contentStyle: { backgroundColor: '#fff' }
      }} initialRouteName="Loading">
        {dd}
      </Switch.Navigator>
    </NavigationContainer>
  else
    return <NavigationContainer >
      <Switch.Navigator screenOptions={{
        contentStyle: { backgroundColor: '#fff' }
      }} initialRouteName="App">
        {dd}
      </Switch.Navigator>
    </NavigationContainer>
};
const main = SwitchNavigator;
 

const mapStateToProps = (state) => ({
  auth: state.auth
});


export default connect(
  mapStateToProps
)(withDb(main));

