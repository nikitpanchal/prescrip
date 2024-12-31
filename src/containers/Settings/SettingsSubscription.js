/// Pritish
import React, { Component } from "react";
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { CommonActions } from '@react-navigation/native';
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions, ImageBackground, SafeAreaView, Alert
} from "react-native";
import { setCurrentTab, isRefreshBilling, setToken } from "../../actions/auth";
import { connect } from "react-redux";
import { setSyncFlag } from "../../actions/sync";
import {

  ic_profile_image,
  ic_Back_Button,

  ic_Blue_BG_578,
} from "../../constants/images";
import { s3Config as config, doctorBucket } from "../../../app.json";
import multipleTapHandler from "../../components/MultiTapHandle/index";

import { UpdateSettings, setDoctorData, updateDoctorSubscriptionDetails, getDoctorData, updateDoctorDetails } from "../../actions/doctorProfile";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingSubscriptionContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isSearchBoxShowing: false,
      newName: "",
      onlineSelected: this.props.doctorProfile.DoctorData.DigitalConsult,
      paylater: this.props.doctorProfile.DoctorData.PayLater,
      subscriptionPlans: [],
      Time_array: [
        "5 min",
        "10 min",
        "15 min",
        "20 min",
        "25 min",
        "30 min",
        "35 min",
        "40 min",
        "45 min",
        "50 min",
        "55 min",
        "60 min",
      ],
      time: "",
    };
  }

  componentDidMount() {
    this.focussub = this.props.navigation.addListener('focus', () => {
      this.props.getDoctorSubscriptionDetails({ doctorId: this.props.doctorProfile.DoctorData._id }).then(response => {
        if (response.payload.data.status == 1) {
          let x = response.payload.data.doctorData;
          if (x.Subscription) {
            this.props.doctorProfile.DoctorData.SubscriptionValid = true;
            let dateExpires = new Date(x.Subscription.ExpiresOn);
            let todaysDate = new Date(response.payload.data.svd);


            if (dateExpires.getTime() <= todaysDate.getTime()) {
              this.props.doctorProfile.DoctorData.SubscriptionValid = false;
            }

          }
          this.props.doctorProfile.DoctorData.svdate = response.payload.data.svd;
          this.props.doctorProfile.DoctorData.Subscription = x.Subscription;
          this.props.setDoctorData(this.props.doctorProfile.DoctorData);
          this.setState({
            subscriptionPlans: response.payload.data.subscriptionPlans ? response.payload.data.subscriptionPlans : [20000, 2000]
          })
        }



      });
    });

    getScreenNameAnalytics({
      screen_name: "SettingsVideoConsultation",
      screen_class: "SettingSubscriptionContainer",
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
    multipleTapHandler.clearNavigator();
    this.focussub();
    this.props.navigation.goBack(null);
    return true;
  }
  getExpiredTex() {
    let subscriptionDetails = this.props.doctorProfile.DoctorData.Subscription;
    let planText = '(Expired)';
    if (subscriptionDetails && subscriptionDetails.Cancelled) {

      planText = '(Cancelled)'

    }

    return planText
  }
  getPlanText() {
    let subscriptionDetails = this.props.doctorProfile.DoctorData.Subscription;
    let planText = 'Your current plan is Prescrip Plus';
    if (subscriptionDetails) {

      if (subscriptionDetails.Cancelled || !this.props.doctorProfile.DoctorData.SubscriptionValid)
        planText = 'Prescrip Plus';

      switch (parseInt(subscriptionDetails.Plan)) {
        case 1:
          planText = planText + ' ₹ 20000/year';
          break;
        case 2:
          planText = planText + ' ₹ 2000/mon';
          break;
        case 3:
          planText = 'Prescrip Trial';

          break;
      }

    }


    return planText
  }
  nth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  cancelSub() {
    Alert.alert(
      "Prescrip",
      "Are you sure want to Cancel Prescrip Subscription ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            let subscriptionData = {
              "WhenSubscribed": this.props.doctorProfile.DoctorData.Subscription.WhenSubscribed,
              "Plan": 2, Cancelled: true,
              "ExpiresOn": null, doctorId: this.props.doctorProfile.DoctorData._id
            }



            this.props.updateDoctorSubscriptionDetails(subscriptionData).then(response => {
              Alert.alert("Subscription Cancelled",
                "Your Prescrip Subscription will end tomorrow");
              this.props.doctorProfile.DoctorData.Subscription.Cancelled = true;
              this.props.doctorProfile.DoctorData.Subscription.ExpiresOn = null;
              this.props.setDoctorData(this.props.doctorProfile.DoctorData);
            });
          },
        },
      ],
      { cancelable: true }
    );

  }
  logoutAll() {
    let docId = this.props.doctorProfile.DoctorData._id;
    let arr = ["all"];


    this.props.updateDoctorDetails(arr, "LogoutDevices", docId).then(response => {
      if (response.payload.data.status === 1) {

        this.logOut()

      }
    });


  }
  getNextBillingDate() {
    let dateText = '';
    let subscriptionDetails = this.props.doctorProfile.DoctorData.Subscription;
    if (subscriptionDetails) {
      if (!subscriptionDetails.ExpiresOn)
        return "Cancelled";
      const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


      let expiredDate = new Date(subscriptionDetails.ExpiresOn);

      dateText = expiredDate.getDate() + this.nth(expiredDate.getDate()) + ' ' + month[expiredDate.getMonth()] + ' ' + expiredDate.getFullYear();
    }



    return dateText
  }
  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }
  logOut() {
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


  }
  showUpgradeBtn() {
    let returnBool = this.props.doctorProfile.DoctorData.SubscriptionValid &&
      (this.props.doctorProfile.DoctorData.Subscription && !this.props.doctorProfile.DoctorData.Subscription.Cancelled
        && this.props.doctorProfile.DoctorData.Subscription.Plan != 3);
    if (returnBool) {
      let x = this.props.doctorProfile.DoctorData;
      let dateExpires = new Date(x.Subscription.ExpiresOn);
      let todaysDate = new Date(x.svdate);

      let daysDiff = Math.floor((dateExpires - todaysDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 5) {
        returnBool = false;
      }

    }
    return returnBool;
  }
  render() {
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;
    const online = "DigitalConsult";

    return (
      <View
        style={{ flex: 1, width: screenWidth, backgroundColor: '#0b69d8' }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ justifyContent: 'center', flexdirection: 'row', width: Dimensions.get('window').width }}>
          <ImageBackground
            style={{
              width: '100%',


            }} resizeMode="cover"
            source={ic_Blue_BG_578}>
            <View
              style={{
                flexDirection: 'column',
                top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                marginBottom:
                  Platform.OS === 'ios' ? null : StatusBar.currentHeight,
              }}>
              <SafeAreaView>
                <View style={{ width: '100%', marginVertical: 10 }}>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flex: 1
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.leftImageOnClick()

                        }}
                        style={{
                          padding: 10,
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            resizeMode: 'contain',
                            alignSelf: 'center',
                            justifyContent: 'flex-end',
                            width: 25,
                            height: 22,
                          }}
                          source={ic_Back_Button}
                        />

                      </TouchableOpacity>
                      <Text

                        style={{
                          fontFamily: 'NotoSans-Bold',
                          color: '#ffff',
                          fontSize: 20, marginLeft: 10,
                          alignSelf: 'flex-start', paddingTop: 8
                        }}>
                        {'Subscription'}
                      </Text>
                    </View>

                  </View>
                </View>
              </SafeAreaView>
            </View>
          </ImageBackground>
        </View>
        <View style={{
          flex: 1,
          alignSelf: "center",
          width: screenWidth,
          backgroundColor: "#fafafa",
          borderTopEndRadius: 20,
          borderTopLeftRadius: 20,
        }}>
          {/* for HEADER */}


          <View style={{ flex: 1, width: screenWidth }}>
            <View style={{ flexDirection: 'column', paddingTop: 30, alignSelf: 'center', justifyContent: 'center' }}>
              {this.props.doctorProfile.DoctorData && this.props.doctorProfile.DoctorData.DoctorImage ?
                <Image source={{ uri: doctorBucket + this.props.doctorProfile.DoctorData.DoctorImage }}
                  style={{ resizeMode: 'contain', height: 70 }} /> :
                <Image source={ic_profile_image}
                  style={{ resizeMode: 'contain', height: 70 }} />}

              <Text style={{
                fontSize: 16, color: '#000', fontFamily: "NotoSans-Bold", paddingTop: 10,
                textAlign: 'center'
              }}>
                My Account  </Text>

              <Text style={{
                fontSize: 16, color: '#676767', fontFamily: "NotoSans", paddingVertical: 5,
                textAlign: 'center'
              }}>
                {this.props.doctorProfile.DoctorData && this.props.doctorProfile.DoctorData.DoctorMobile ?
                  this.props.doctorProfile.DoctorData.DoctorMobile : ''} </Text>
            </View>
            <View style={{
              flexDirection: 'column',
              paddingVertical: 10, paddingHorizontal: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{ fontSize: 14, color: '#676767', paddingLeft: 5, fontFamily: "NotoSans", }}>
                  MEMBERSHIP  </Text>
              </View>

              <View>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { height: 0.5 },
                    shadowOpacity: 0.4,
                    shadowRadius: 0,
                    elevation: 4,
                    paddingVertical: 5,
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    marginRight: 5,
                    marginStart: 8,
                    paddingTop: 8,
                    marginTop: 5,
                    paddingHorizontal: 8,
                    paddingBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 16, color: "#000000", paddingLeft: 5, paddingVertical: 10, fontFamily: "NotoSans" }}>
                        {this.getPlanText()}

                      </Text>
                      {
                        !this.props.doctorProfile.DoctorData.SubscriptionValid || (this.props.doctorProfile.DoctorData.Subscription && this.props.doctorProfile.DoctorData.Subscription.Cancelled) ?
                          < Text style={{ fontSize: 16, color: "red", paddingLeft: 5, paddingVertical: 10, fontFamily: "NotoSans" }}>
                            {this.getExpiredTex()}
                          </Text> : null
                      }

                    </View>

                    <Text
                      style={{
                        fontSize: 13, paddingVertical: 10,
                        color: "#676767", fontFamily: "NotoSans",
                        paddingVertical: 3,
                        paddingStart: 5,
                      }}
                    >
                      {'Next Billing DATE: ' + this.getNextBillingDate()}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: "column", marginVertical: 15,
                    borderTopColor: '#dedede', borderTopWidth: 1
                  }}></View>
                  {
                    this.showUpgradeBtn() ?
                      <TouchableOpacity onPress={() =>
                        this.cancelSub()
                      } style={{
                        flexDirection: "column", paddingVertical: 15,
                      }}>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{
                            fontSize: 16, color: "#000000", paddingLeft: 5,
                            fontFamily: "NotoSans"
                          }}>
                            Cancel Membership
                          </Text>
                        </View>
                      </TouchableOpacity> : <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate("SettingsSubscriptionDetails", { subscriptionPlans: this.state.subscriptionPlans })
                      } style={{
                        flexDirection: "column", paddingVertical: 15,
                      }}>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{
                            fontSize: 16, color: "#000000", paddingLeft: 5,
                            fontFamily: "NotoSans"
                          }}>
                            Upgrade Membership
                          </Text>
                        </View>
                      </TouchableOpacity>
                  }
                </View>
              </View>
            </View>
            <View style={{
              flexDirection: 'column',
              paddingTop: 20, paddingHorizontal: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{ fontSize: 14, color: '#676767', paddingLeft: 5, fontFamily: "NotoSans", }}>
                  ACCOUNT & SECURITY  </Text>
              </View>

              <View>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { height: 0.5 },
                    shadowOpacity: 0.4,
                    shadowRadius: 0,
                    elevation: 4,
                    paddingVertical: 5,
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    marginRight: 5,
                    marginStart: 8,
                    paddingTop: 8,
                    marginTop: 5,
                    paddingHorizontal: 8,
                    paddingBottom: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => { this.logOut() }} style={{
                    flexDirection: "column", paddingVertical: 15,
                  }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={{
                        fontSize: 16, color: "#000000", paddingLeft: 5,
                        fontFamily: "NotoSans"
                      }}>
                        Log Out
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{
                    flexDirection: "column", marginVertical: 15,
                    borderTopColor: '#dedede', borderTopWidth: 1
                  }}></View>
                  <TouchableOpacity onPress={() => { this.logoutAll() }} style={{
                    flexDirection: "column", paddingVertical: 15,
                  }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={{
                        fontSize: 16, color: "#000000", paddingLeft: 5,
                        fontFamily: "NotoSans"
                      }}>
                        Log Out All Devices
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>


      </View >
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientProfile: state.patientProfile,
});

const mapDispatchToProps = (dispatch) => ({
  UpdateSettings: (data) => dispatch(UpdateSettings(data)),
  setDoctorData: (data) => dispatch(setDoctorData(data)),
  updateDoctorSubscriptionDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorSubscriptionDetails(objectValue, objectKey, doctorId)),
  setToken: (token) => dispatch(setToken(token)),
  updateDoctorDetails: (data, key, docid) => dispatch(updateDoctorDetails(data, key, docid)),
  getDoctorSubscriptionDetails: (data) => dispatch(getDoctorData(data)),
  setTooltip: (tab) => dispatch(setTooltip(tab)),
  setSyncFlag: (data) => dispatch(setSyncFlag(data)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingSubscriptionContainer);
const styles = StyleSheet.create({
  view_style: {
    flexDirection: "row",
    backgroundColor: "#008be0",
    height: 60,
  },
  Optometry_Record: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "left",
  },
  step_2_5: {
    fontSize: 12,
    color: "#ffffff",
  },
  Next: {
    height: 18,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
  content_container: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  content_color: {
    color: "#383838",
    fontWeight: "600",
    fontSize: 16,
  },
  Next_blue: {
    height: 15,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
});
