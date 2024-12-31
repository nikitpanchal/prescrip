/* created by Ruban */

import React, { Component } from "react";
import { ic_Orange_BG_578, Clinic_setup_icon } from "../../constants/images";
import { StackActions, CommonActions } from '@react-navigation/native';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  View,
  Text,
  TextInput,
  FlatList,
  Linking,
  TouchableOpacity,
  ScrollView,
  Share,
  SafeAreaView,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Container, Accordion, Button } from "native-base";
import Images from "../../Theme/Images";


import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  saveQuickRxFavourites,
  setlab,
  addAsFav,
} from "../../actions/patientVisit";
import { connect } from "react-redux";
import LottieView from "lottie-react-native";
var success_tick = require("../../../assets/Json/Success-Tick-Big.json");
import LinearGradient from "react-native-linear-gradient";
import { ic_calendar_icon, ic_clock } from "../../constants/images";
import moment from "moment";
import HeaderData from "../../components/Header/header";
var fabRipple = require("../../../assets/Json/verification.json");

import multipleTapHandler from "../../components/MultiTapHandle/index";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class IvSuccess extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {};
    this.toast = React.createRef();
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "IVRBookSuccess",
      screen_class: "IvSuccess",
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
  render() {
    let { finalData } = this.props.route.params;

    return (
      <View
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />

        <View style={{ flex: 1, backgroundColor: "#f8f8f8", width: Dimensions.get('window').width }}>
          <ImageBackground
            source={ic_Orange_BG_578}
            style={{ flex: 1, resizeMode: "contain", height: "60%" }}
          >
            <View
              style={{
                flex: 0.4,
                margin: 25,

                alignSelf: Platform.isPad ? "flex-start" : "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 28,
                  fontFamily: "NotoSans-Bold",
                }}
              >
                Appointment Scheduled for
              </Text>
              <Text
                style={{
                  color: "#fee8eb",
                  fontSize: 45,
                  fontFamily: "NotoSans-Bold",
                }}
              >
                {finalData.fullName}
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                backgroundColor: "#f8f8f8",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                marginTop: 10,
                justifyContent: "space-evenly",
              }}
            >
              <LottieView
                style={{ width: "40%" }}
                style={{
                  resizeMode: "contain",
                  height: 100,
                  alignSelf: "center",
                  position: "absolute",
                  top: -20,
                }}
                source={fabRipple}
                loop={false}
                autoPlay={true}
                ref={(animation) => {
                  this.animation = animation;
                }}
              />

              <View
                style={{
                  justifyContent: "center",
                  marginTop: 60,
                  flexDirection: "column",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    alignSelf: "center",
                    color: "#b0b0b0",
                    paddingBottom: 6,
                    paddingTop: 10,
                  }}
                >
                  Date and Time
                </Text>
                <Text
                  style={{
                    fontFamily: "NotoSans",
                    textAlign: "center",
                    fontSize: 20,
                    alignSelf: "center",
                    color: "#646464",
                    paddingBottom: 5,
                  }}
                >
                  {finalData.appointmentTime}
                </Text>
                <Text
                  style={{
                    fontFamily: "NotoSans",
                    textAlign: "center",
                    fontSize: 20,
                    alignSelf: "center",
                    color: "#646464",
                    paddingBottom: 10,
                  }}
                >
                  {moment(finalData.appointmentDate).format(
                    "dddd, Do MMMM  YYYY"
                  )}{" "}
                </Text>
                {
                  !finalData.isWalkIn ?
                    <Text
                      style={{
                        fontFamily: "NotoSans",
                        textAlign: "center",
                        fontSize: 18,
                        alignSelf: "center",
                        color: "#8e8e8e",
                        paddingVertical: 10,
                        textAlign: "center",
                      }}
                    >
                      Your patients will be reminded about{"\n"} the appointment
                      through SMS.
                    </Text>
                    : null
                }

              </View>
            </View>
          </ImageBackground>
          <TouchableOpacity
            style={{ flex: 0.1, backgroundColor: "#f8f8f8" }}
            disabled={this.state.loading}
            onPress={() =>
              this.props.navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: 'Drawer' }]

              }))
            }
          >
            <LinearGradient
              colors={["#28B62E", "#0cd214"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.8]}
              style={styles.linear_gradient_btn_style}
            >
              <Text style={styles.linear_gradient_text_style}>{"DONE"}</Text>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
            </LinearGradient>
          </TouchableOpacity>
        </View>



        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={"#fafbfe"}
              imagePath={this.state.copyToast ? Images.Info : Images.Success}
              description={this.state.description}
            />,

            1500
          )
          : null}
        <Toast
          position="center"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            backgroundColor: this.state.copyToast ? "#4D99E3" : "#4BB543",
            borderRadius: 15,
          }}
           
          ref={(ref) => this.toast = ref}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  saveQuickRxFavourites: (patientvisitid, data) =>
    dispatch(saveQuickRxFavourites(patientvisitid, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IvSuccess);

const styles = StyleSheet.create({
  bgimg: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  lott: { resizeMode: "contain", height: 100, alignSelf: "center" },
  save: {
    color: "#ffffff",
    fontFamily: "NotoSans-Bold",
    marginVertical: 10,
    fontSize: 20,
    textAlign: "center",
  },
  name: { color: "#ffffff", fontSize: 14, marginTop: 10 },
  flatl: {
    flex: 0.65,
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 10,
  },
  txtinput: {
    fontSize: 25,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.8,
    fontFamily: "NotoSans-Bold",
    color: "#444444",
  },
  done: {
    alignSelf: "flex-end",
    fontFamily: "NotoSans",
    color: "#0065d7",
    fontSize: 20,
    margin: 10,
  },
  itemview: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    borderLeftColor: "#cccccc",
    borderLeftWidth: 1,
    borderRightColor: "#cccccc",
    borderRightWidth: 1,
    borderRadius: 10,
    margin: 12,
  },
  cardcont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dtls: {
    fontFamily: "NotoSans",
    fontSize: 13,
    color: "#636363",
    marginLeft: 5,
  },
  linear_gradient_btn_style: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 25,
  },
  linear_gradient_text_style: {
    textAlign: "center",
    fontSize: 17,
    color: "#ffffff",
    fontFamily: "NotoSans-Bold",
    marginEnd: 5,
  },
});
