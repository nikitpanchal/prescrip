/// Pritish
import React, { Component } from "react";
import { CommonActions } from '@react-navigation/native';
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions, ImageBackground, ScrollView, Alert
} from "react-native";
import { calculateAge } from '../../commonmethods/common';
import LinearGradient from "react-native-linear-gradient";
import PrescriptionHeader from "../../components/PrescriptionHeader/PrescriptionHeader";
import { connect } from "react-redux";
import { getPaymentLinkSubscription } from "../../actions/patientVisit";
import {

  subscription_doc,
  prescrip_logo_sub,
  ic_Blue_BG_578,
  Black_back, most_popular, ic_Purple_BG_578
} from "../../constants/images";
import { s3Config as config, doctorBucket } from "../../../app.json";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import Modal from "react-native-modalbox";
import { UpdateSettings, setDoctorData } from "../../actions/doctorProfile";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsSubscriptionDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.subscriptionPoints = {
      monthly: ["Complete Access to EMR Functionalities", "Unlimited Patients", "Unlimited Prescriptions",
        "Unlimited Appointments - 1 Clinic", "Multiple Language Supported", "Follow Up Reminder SMS"],
      yearly: [ "Appointment Manager (Upto 5 Clinics)",
        "Collect Payments Digitally (50+ Payment Options for your Practice)", "Patient Referral Feature"]
    };

  }
  onProceedClicdk() {
    Alert.alert("Account Upgraded Successfully !")
    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }]

    }));

  }
  onProceedClick(planType) {

    let amt = this.props.route.params.subscriptionPlans[planType];
    let age = calculateAge(
      this.props.doctorProfile.DoctorData.DOB,
      false
    );
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      transactionId: "", //this.props.patientvisit.vc_trans_id,
      digiConsultationId: "", //this.props.patientvisit.vc_consult_id,
      amount: parseFloat(amt).toFixed(2),
      consultFees: this.props.doctorProfile.DoctorData.ConsultFee
        ? parseFloat(
          this.props.doctorProfile.DoctorData.ConsultFee.toString()
        ).toFixed(2)
        : 0,
      patientId: null,
      patient_Id: 0,
      patientName:
        this.props.doctorProfile.DoctorData.DoctorFName + ' ' + this.props.doctorProfile.DoctorData.DoctorLName,
      dob: this.props.doctorProfile.DoctorData.DOB,
      gender: this.props.doctorProfile.DoctorData.Gender,
      mobile: this.props.doctorProfile.DoctorData.DoctorMobile,
      whatsApp: this.props.doctorProfile.DoctorData.WANumber
        ? this.props.doctorProfile.DoctorData.WANumber
        : "",
      age: age.value + " " + age.units,
      remarks: "Prescrip App Subscription",
      patientEmail: "", planType: (planType + 1)
    };
    this.props.getPaymentLink(data).then((response) => {
      if (response.payload.data.status == 1) {
        this.props.navigation.navigate("SettingsSubscriptionWeb", { paylink: response.payload.data.payLinkUrl });
      }
    });
  }
  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "SettingsVideoConsultation",
      screen_class: "SettingsSubscriptionDetailsContainer",
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
    this.props.navigation.goBack(null);
    return true;
  }







  close() {
    this.props.navigation.pop();
  }
  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }
  searchAction(text) {
    //alert(newData.length)
    this.setState({
      newName: text,
    });
  }

  rightImageOnClick() {
    this.Videoconsultationonline();

    // Alert.alert("ok")
  }

  render() {
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;
    const online = "DigitalConsult";

    return (
      <View
        style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#d6d6d6" />

        <View style={{
          flex: 1,
          alignSelf: "center",
          width: screenWidth,
          backgroundColor: "#f9f9f9",
          borderTopEndRadius: 20,
          borderTopLeftRadius: 20,
        }}>
          {/* for HEADER */}
          <View style={{ justifyContent: "center", flexdirection: "row", width: Dimensions.get('window').width }}>
            <ImageBackground
              style={{
                width: "100%",
                backgroundColor: this.props.bgColor,
                borderBottomColor: "#dddddd",
                borderBottomWidth: 1,
              }}
              source={null}
            >
              <View
                style={{
                  flexDirection: "column",
                  top: Platform.OS === "ios" ? null : StatusBar.currentHeight,
                  marginBottom:
                    Platform.OS === "ios" ? null : StatusBar.currentHeight,
                }}
              >
                <SafeAreaView>
                  <View style={{ width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          flex: 0.85,
                          paddingVertical: 0,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.leftImageOnClick()}
                          style={{
                            padding: 10,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            style={{
                              resizeMode: "contain",
                              alignSelf: "center",
                              justifyContent: "flex-end",
                              width: 25,
                              height: 22,
                            }}
                            source={Black_back}
                          />
                        </TouchableOpacity>

                        <View
                         
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS === "ios" ? 10 : 16,
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >

                          <View style={{ flexDirection: "column" }}>

                            <Text

                              style={{
                                fontSize: 12, color: '#676767', fontFamily: "NotoSans", paddingVertical: 5,
                                textAlign: 'center'
                              }} >{'PLANS AND PRICING FOR'}</Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Image source={prescrip_logo_sub} style={{ width: 40, height: 40 }} resizeMode="contain" />
                              <Text

                                style={{
                                  fontSize: 22, color: '#000', fontFamily: "NotoSans", marginLeft: 10,
                                  textAlign: 'center'
                                }} >{'prescrip'}</Text>
                            </View>
                          </View>
                        </View>

                      </View>


                    </View>
                  </View>

                </SafeAreaView>
              </View>
            </ImageBackground>
          </View>

          <View style={{ flex: 1, width: screenWidth }}>
            <View style={{ flexDirection: 'column', alignSelf: 'center', justifyContent: 'center' }}>

              <Image source={subscription_doc}
                style={{ resizeMode: 'contain', width: screenWidth, height: screenHeight * 27 / 100, }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"} keyboardDismissMode={"none"} >
              <View style={{
                flexDirection: 'column',
                paddingVertical: 10, backgroundColor: '#f9f9f9'
              }}>

                <View
                  style={{
                    shadowColor: '#000', shadowOffset: { height: 1 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 2,
                    alignSelf: 'center',
                    width: screenWidth * 95 / 100, backgroundColor: '#fff', marginTop: 20, borderRadius: 10, borderColor: 'transparent'

                  }}
                >
                  <ImageBackground
                    style={{
                      width: '100%', overflow: 'hidden',
                      backgroundColor: '#fff',
                      borderBottomColor: '#dddddd',
                      flexDirection: 'column',
                      borderTopWidth: 1, borderTopStartRadius: 10, borderTopEndRadius: 10,
                    }}
                    source={ic_Purple_BG_578}>
                    <Image resizeMode="contain" source={most_popular} style={{
                      width: 150, position: 'absolute',
                      right: -5, top: 15
                    }} />
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}>
                      <Text
                        style={{
                          fontSize: 35, color: '#fff', fontFamily: "NotoSans",

                        }} >{'prescrip '}</Text>
                      <Text
                        style={{
                          fontSize: 35, color: '#fff', fontFamily: "NotoSans-Bold",

                        }} >{'pro'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10  }}>
                      <Text
                        style={{
                          fontSize: 45, color: '#fff', fontFamily: "NotoSans-Bold",

                        }} >{'₹ ' + this.props.route.params.subscriptionPlans[0]}</Text><Text
                          style={{
                            fontSize: 28, color: '#fff', fontFamily: "NotoSans", marginTop: 15

                          }} >{'/year'}</Text>

                    </View>
                    <Text
                      style={{
                        fontSize: 12, color: '#fff', fontFamily: "NotoSans-Bold", paddingLeft: 10
                      }} >{'* 18% GST Applicable on yearly plan'}</Text>
                  </ImageBackground>
                  <View style={{ flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', paddingVertical: 5 }}>

                      <Text
                        style={{
                          fontSize: 15, color: '#820091', fontFamily: "NotoSans-Bold"

                        }} >{'Addition Savings from prescrip plus monthly plan & '}</Text>

                    </View>
                    {this.subscriptionPoints.yearly.map((a) => {
                      return <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                        <Text
                          style={{
                            fontSize: 8, color: '#676767', fontFamily: "NotoSans", marginTop: 5, marginRight: 10

                          }} >{'\u2B24'}</Text>
                        <Text
                          style={{
                            fontSize: 14, color: '#820091', fontFamily: "NotoSans-Bold"

                          }} >{a}</Text>

                      </View>
                    })}

                  </View>
                  <TouchableOpacity
                    style={{ paddingBottom: 10 }}
                    onPress={() => this.onProceedClick(0)}
                  >
                    <LinearGradient
                      colors={["#830391", "#a14996"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      locations={[0, 0.8]}
                      style={{
                        flexDirection: "row",
                        width: "90%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                        alignSelf: "center",
                        borderRadius: 25,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 17,
                          color: "#ffffff",
                          fontFamily: "NotoSans-Bold",
                          marginEnd: 5,
                        }}
                      >
                        {'UPGRADE NOW'}
                      </Text>

                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ width: screenWidth, flexDirection: 'column', marginTop: 20 }}>
                  <View
                    style={{
                      shadowColor: '#000', shadowOffset: { height: 1 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 2,
                      alignSelf: 'center',
                      width: screenWidth * 95 / 100, backgroundColor: '#fff', flex: 1, borderRadius: 10, borderColor: 'transparent'

                    }}
                  >
                    <ImageBackground
                      style={{
                        width: '100%', overflow: 'hidden',
                        backgroundColor: '#fff',
                        borderBottomColor: '#dddddd',
                        flexDirection: 'column',
                        borderTopWidth: 1, borderTopStartRadius: 10, borderTopEndRadius: 10,
                      }}
                      source={ic_Blue_BG_578}>

                      <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}>
                        <Text
                          style={{
                            fontSize: 35, color: '#fff', fontFamily: "NotoSans",

                          }} >{'prescrip '}</Text>
                        <Text
                          style={{
                            fontSize: 35, color: '#fff', fontFamily: "NotoSans-Bold",

                          }} >{'plus'}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                        <Text
                          style={{
                            fontSize: 45, color: '#fff', fontFamily: "NotoSans-Bold",

                          }} >{'₹ ' + this.props.route.params.subscriptionPlans[1]}</Text><Text
                            style={{
                              fontSize: 28, color: '#fff', fontFamily: "NotoSans", marginTop: 15

                            }} >{'/monthly'}</Text>

                      </View>
                      <Text
                        style={{
                          fontSize: 12, color: '#fff', fontFamily: "NotoSans-Bold", paddingLeft: 10
                        }} >{'* 18% GST Applicable on monthly plan'}</Text>
                    </ImageBackground>
                    <View style={{ flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 15 }}>
                      {this.subscriptionPoints.monthly.map((a) => {
                        return <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                          <Text
                            style={{
                              fontSize: 8, color: '#676767', fontFamily: "NotoSans", marginTop: 5, marginRight: 10

                            }} >{'\u2B24'}</Text>
                          <Text
                            style={{
                              fontSize: 14, color: '#820091', fontFamily: "NotoSans-Bold"

                            }} >{a}</Text>

                        </View>
                      })}

                    </View>
                    <TouchableOpacity
                      style={{ paddingBottom: 10 }}
                      onPress={() => this.onProceedClick(1)}
                    >
                      <LinearGradient
                        colors={["#1A3EA0", "#2253EB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={[0, 0.8]}
                        style={{
                          flexDirection: "row",
                          width: "90%",
                          height: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 10,
                          alignSelf: "center",
                          borderRadius: 25,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 17,
                            color: "#ffffff",
                            fontFamily: "NotoSans-Bold",
                            marginEnd: 5,
                          }}
                        >
                          {'UPGRADE NOW'}
                        </Text>

                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            </ScrollView>
            <View style={{
              flexDirection: 'column',
              paddingTop: 20, paddingHorizontal: 5
            }}>



            </View>
          </View>
        </View>


      </View>
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
  getPaymentLink: (data) => dispatch(getPaymentLinkSubscription(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsSubscriptionDetailsContainer);
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
