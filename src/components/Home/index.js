


import React, { Component } from "react";



import Tooltip from 'react-native-walkthrough-tooltip';
export { default as Icon } from "./Icon";

import AddPatient from '../Tooltips'
import { StatusBar, Dimensions, ActivityIndicator, View, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { tooltip_PatientList, tooltip_Billing, Warning, tooltip_appo, tooltip_vc } from '../../constants/images'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Images from '../../Theme/Images'


import VideoConsultScreen from '../pages/VideoCunsulationScreen';
import Appointments from '../pages/AppointmentsScreen';

import Billing from '../pages/BillingScreenNew';
import MyPatients from '../pages/MyPatientsScreen';

//import MyReward from '../Myvsreward';
const Tab = createBottomTabNavigator();

const ACTIVE_TAB_COLOR = '#60C3FF'
const INACTIVE_TAB_COLOR = '#aaa'
let currentTab = "MyPatients";
let showTab = "Vid";
const getCurrentTab = () => {
  return currentTab;
}
let TabContainer = null;




export default class Home extends Component {
  constructor(props) {
    super(props)


    this.name = '',


      this.state = {
        toolTipVisible: true,
        width: 28,
        name: '',
        endTour: false,
        componentChanged: '', switchTime: 0
      }




  }
  createTabs = (isAsst, roleId, docData) => {

    let BottomTabs =

    {
      ...(isAsst == 0) || (roleId == 3 || roleId == 2) ? {
        MyPatients: {
          screen: MyPatients,
          navigationOptions: {
            tabBarOptions: {
              activeTintColor: '#0066D7',
              labelStyle: {
                fontSize: 10, paddingHorizontal: 3
              },

              style: {
                backgroundColor: '#fffff',

                //----------add this line------------------------//
                height: 60,
                borderTopWidth: 2,
                borderTopColor: '#f0f0f0',
                shadowColor: '#f0f0f0'
              },

            },
          }
        }
      } : null,
      ...(docData) ? {
        Appointments: {

          screen: Appointments,
          navigationOptions: {
            tabBarOptions: {
              activeTintColor: '#EB5D61',
              labelStyle: {
                fontSize: 10, paddingHorizontal: 3
              },

              style: {
                backgroundColor: '#fffff',

                //----------add this line------------------------//
                height: 60,
                borderTopWidth: 2,
                borderTopColor: '#f0f0f0',
                shadowColor: '#f0f0f0'
              },

            },
          }
        }
      } : null,



      ...(isAsst == 0 || roleId == 3) ? {
        VideoConsult: {
          screen: VideoConsultScreen,
          navigationOptions: {
            tabBarLabel: 'Video Consult',
            tabBarOptions: {
              activeTintColor: '#881896',
              labelStyle: {
                fontSize: 10, paddingHorizontal: 3
              },

              style: {
                backgroundColor: '#fffff',

                //----------add this line------------------------//
                height: 60,
                borderTopWidth: 2,
                borderTopColor: '#f0f0f0',
                shadowColor: '#f0f0f0'
              },

            },
          }
        }
      } : null,
      ...(docData) ? {
        Billing: {
          screen: Billing,
          navigationOptions: {
            tabBarOptions: {
              activeTintColor: '#28B62F',
              labelStyle: {
                fontSize: 10, paddingHorizontal: 3
              },

              style: {
                backgroundColor: '#fffff',

                //----------add this line------------------------//
                height: 60,
                borderTopWidth: 2,
                borderTopColor: '#f0f0f0',
                shadowColor: '#f0f0f0'
              },

            },
          }
        },
      } : null
    };


    return BottomTabs;
  }
  triggerFocus(component) {
    this.setState({ componentChanged: component.split('-')[0], switchTime: new Date().getTime() })
  }
  returnTabAppContainer() {

    const dd = [];
    const self = this;

    let screenProps = {
      rootNavigation: self.props.navigation,
      IsUpdateReq: self.props.IsUpdateReq,
      currentTab: self.props.home.currentTab,
      tooltip: self.props.route.params ? self.props.route.params.introScreen : self.props.auth.tooltip,
      data: self.props.route.params ? self.props.route.params.foo : false,
      doctorData: self.props.doctorProfile,
      currentComponent: this.state.componentChanged,
      switchTime: this.state.switchTime,
      getRecents: () => { this.props.getRecents() },
      setTooltip: (tab) => { this.setCurrenTooltip(tab) }
    }
    let isAssistant = this.props.doctorProfile.DoctorData ? (this.props.doctorProfile.DoctorData.IsAssistant ? this.props.doctorProfile.DoctorData.IsAssistant : 0) : 0;
    let roleId = this.props.doctorProfile.DoctorData ? (this.props.doctorProfile.DoctorData.RoleId ? this.props.doctorProfile.DoctorData.RoleId : 0) : 0;
    let bottomTabObject = this.createTabs(isAssistant, roleId, this.props.doctorProfile.DoctorData);
    // Alert.alert(JSON.stringify([isAssistant, roleId]));
    // Alert.alert(JSON.stringify(Object.keys(bottomTabObject)));
    Object.keys(bottomTabObject).forEach(element => {
      let tab = bottomTabObject[element];

      dd.push(<Tab.Screen name={element}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            this.triggerFocus(e.target);

          },
        })}
        children={(props) => <tab.screen screenProps={screenProps}
          {...this.props} />} options={{
            headerShown: false
          }} />)
    });
    return dd;
  }
  componentDidMount() {

    let self = this;
    this.unsubscribeFoucs = this.props.navigation.addListener('focus', () => {
      //console.log(this.props.home.refreshBilling);

      if (self.props.home.refreshBilling) {
        currentTab = self.props.home.currentTab;


      }
    })

  }

  setCurrenTooltip(tab) {
    this.props.setTooltip(tab)

    this.forceUpdate();
  }
  componentWillUnmount() {
    this.unsubscribeFoucs();
  }

  render() {
    let endTour = this.props.auth.tooltip == "Exit" || this.props.auth.tooltip == "Others" || this.props.auth.tooltip == "Analytics" || this.props.auth.tooltip == "Profile";
    let toolTip = this.props.route.params ? this.props.route.params.introScreen : this.props.auth.tooltip;
    return (

      <>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />

        <Tab.Navigator screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ focused }) => {
            const routeName = route.name;

            if (routeName === 'MyPatients') {
              return (


                <View style={{ flex: 1 }}
                >

                  <Tooltip
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}

                    animated={true}
                    //(Optional) When true, tooltip will animate in/out when showing/hiding
                    arrowSize={{ width: 16, height: 8 }}
                    //(Optional) Dimensions of arrow bubble pointing to the highlighted element
                    backgroundColor="rgba(0,0,0,0)"
                    //(Optional) Color of the fullscreen background beneath the tooltip.
                    isVisible={toolTip == "MyPatients" ? true : false}
                    //(Must) When true, tooltip is displayed
                    contentStyle={{ backgroundColor: '#6f6af4' }}
                    displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
                    width={500}
                    height={200}
                    content={<TouchableOpacity style={{ flex: 1, backgroundColor: "#6f6af4" }}
                      onPress={() => { this.setCurrenTooltip("Appointments") }}>
                      <AddPatient
                        //VideoConsult
                        isLottie={true}
                        imagePath={tooltip_PatientList}
                        title={"Your Patient List"}
                        description={"View, add & manage your Patients and their Prescriptions from here."}
                      />
                    </TouchableOpacity>}
                    //(Must) This is the view displayed in the tooltip
                    placement="top"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() => { this.setCurrenTooltip("Appointments") }}

                  //(Optional) Callback fired when the user taps the tooltip
                  >

                    <Image
                      source={
                        (toolTip == "MyPatients" || focused)
                          ? Images.ic_Patients_Color
                          : Images.ic_Patients_Grey
                      }

                      style={{ alignSelf: 'center', width: 25, height: 25, top: 10 }} />

                  </Tooltip>

                </View>


              );
            }
            if (routeName === 'Appointments') {
              return (

                <View style={{ flex: 1 }}>
                  <Tooltip
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}

                    animated={true}
                    contentStyle={{ backgroundColor: '#6f6af4' }}
                    //(Optional) When true, tooltip will animate in/out when showing/hiding
                    arrowSize={{ width: 16, height: 8 }}
                    //(Optional) Dimensions of arrow bubble pointing to the highlighted element
                    backgroundColor="rgba(0,0,0,0)"
                    //(Optional) Color of the fullscreen background beneath the tooltip.
                    isVisible={toolTip == "Appointments" ? true : false}
                    tooltipStyle={{ left: 20, alignItems: 'flex-start' }}

                    //(Must) When true, tooltip is displayed
                    displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
                    width={500}
                    height={200}
                    content={<TouchableOpacity style={{ flex: 1, backgroundColor: "#6f6af4" }}
                      onPress={() => { this.setCurrenTooltip("VideoConsult") }}>
                      <AddPatient
                        isLottie={true}
                        imagePath={tooltip_appo}
                        title={"In Clinic Appointments"}
                        description={"Your patient appointments at the selected clinic will appear here with pre-allocated tokens"}
                      />
                    </TouchableOpacity>}
                    //(Must) This is the view displayed in the tooltip
                    placement="top"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() => { this.setCurrenTooltip("VideoConsult") }}

                  //(Optional) Callback fired when the user taps the tooltip
                  >
                    <Image
                      source={
                        (toolTip == "Appointments" || focused)
                          ? Images.ic_My_Appt_Color
                          : Images.ic_My_Appt_Grey
                      }

                      style={{ alignSelf: 'center', width: 25, height: 25, top: 10 }} />


                  </Tooltip>

                </View>
              );
            }
            else if (routeName === 'VideoConsult') {


              return (
                <View style={{ flex: 1 }}>
                  <Tooltip
                    animated={true}
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}


                    //(Optional) When true, tooltip will animate in/out when showing/hiding
                    arrowSize={{ width: 16, height: 8 }}
                    //(Optional) Dimensions of arrow bubble pointing to the highlighted element
                    contentStyle={{ backgroundColor: '#6f6af4' }}
                    backgroundColor="rgba(0,0,0,0)"
                    displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
                    //(Optional) Color of the fullscreen background beneath the tooltip.
                    isVisible={toolTip == "VideoConsult" ? true : false}
                    //(Must) When true, tooltip is displayed
                    width={500}
                    height={200}
                    content={<TouchableOpacity style={{ flex: 1, backgroundColor: "#6f6af4" }}
                      onPress={() => { this.setCurrenTooltip("Billing") }}>
                      <AddPatient
                        isLottie={true}
                        imagePath={tooltip_vc}
                        title={"Video Consultation Appointments"}
                        description={"The appointments queue for Video Consultations will appear here."}
                      />
                    </TouchableOpacity>}
                    //(Must) This is the view displayed in the tooltip
                    placement="top"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() => { this.setCurrenTooltip("Billing") }}

                  //(Optional) Callback fired when the user taps the tooltip
                  >

                    <Image
                      source={
                        (toolTip == "VideoConsult" || focused)
                          ? Images.ic_Video_Consult_Color
                          : Images.ic_Video_Consult_Grey
                      }

                      style={{ alignSelf: 'center', width: 25, height: 25, top: 10 }} />


                  </Tooltip>
                </View>
              );
            }
            else if (routeName === 'Billing') {
              return (


                <View style={{ flex: 1 }}
                >

                  <Tooltip
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                    animated={true}
                    //(Optional) When true, tooltip will animate in/out when showing/hiding
                    arrowSize={{ width: 16, height: 8 }}
                    tooltipStyle={{ right: 20, alignItems: 'flex-end' }}

                    //(Optional) Dimensions of arrow bubble pointing to the highlighted element
                    backgroundColor="rgba(0,0,0,0)"
                    //(Optional) Color of the fullscreen background beneath the tooltip.
                    isVisible={toolTip == "Billing" ? true : false}
                    //(Must) When true, tooltip is displayed
                    contentStyle={{ backgroundColor: '#6f6af4' }}
                    displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
                    width={500}
                    height={200}
                    content={<TouchableOpacity style={{ flex: 1, backgroundColor: "#6f6af4" }}
                      onPress={() => { this.setCurrenTooltip("Others") }}>
                      <AddPatient
                        isLottie={true}
                        imagePath={tooltip_Billing}
                        // imagePath={Images.ic_popup_Billing_Icon}
                        title={"Billing Details"}
                        description={"Keep a track of the payments you have received via your consultations from here."}
                      />
                    </TouchableOpacity>}
                    //(Must) This is the view displayed in the tooltip
                    placement="top"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() => { this.setCurrenTooltip("Others") }}

                  //(Optional) Callback fired when the user taps the tooltip
                  >
                    <Image
                      source={
                        (toolTip == "Billing" || focused)
                          ? Images.ic_Billing_Color
                          : Images.ic_Billing_Grey
                      }

                      style={{ alignSelf: 'center', width: 25, height: 25, top: 10 }} />

                  </Tooltip>
                </View>

              );
            }



          }
        })} initialRouteName="MyPatients">

          {this.returnTabAppContainer()}

        </Tab.Navigator>
        {!endTour ? <View style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: '#000000',
          opacity: 0.5,
        }}></View> : null}



      </>
    )
  }
}








