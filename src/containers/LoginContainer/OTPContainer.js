/* created by Ruban 
Otp container */
import React, { Component } from "react";
import OTP from "../../components/Login/OTP";
import { CommonActions } from '@react-navigation/native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import {
  userLoginSuccess,
  userOTPVerification,
  setToken,
  registrationVerify,
  requestRegisterOTP,
  setOTPToken,
  setMobile,
  setDoctorId,
} from "../../actions/auth";
import {
  setDoctorData,
  setDoctorFees,
  setVideoConsult,
} from "../../actions/doctorProfile";
import { BackHandler, Alert, Keyboard, Platform, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "native-base";
import { connect } from "react-redux";
import RNOtpVerify from "react-native-otp-verify";
import Images from "../../Theme/Images";
import { setfirstrun } from "../../actions/tooltip";
import { setUpdateApp } from "../../actions/sync";
import { packageName } from "../../../app.json";
import {
  getScreenNameAnalytics,
  getUserDetailsAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";

class OTPContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTimer: false,
      restart: true,
      otp: "",
      loading: false,
      retry: 1,
      showToast: false,
      description: "",
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
    };
    this._handleBackPress = this._handleBackPress.bind(this);
    this.otpTextInput = [];
    this.callfrom = null;
    this.emailAddress = 0;
  }
  //back press handler
  _handleBackPress() {
    // this.props.navigation.goBack()
    this.props.navigation.navigate(this.callfrom);

    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    this.props.navigation.addListener("focus", () => {
      getScreenNameAnalytics({
        screen_name: "Otp",
        screen_class: "OtpContainer",
      });
      let { params } = this.props.route;
      this.callfrom = params.callfrom;
      this.emailAddress = params.emailAddress;
    });

    if (Platform.OS == "android") {
      RNOtpVerify.getOtp()
        .then((p) => RNOtpVerify.addListener(this.otpHandler))
        .catch((p) => console.log(""));
    }
    //this.autoTestLogin();

  }
  autoTestLogin() {
    this.props
      .userOTPVerification("5d6fc6c54a0695146c7721d0", 1583)
      .then(({ error, payload }) => {
        if (error) {
          switch (error.data) {
            case "Network Error":
              this.setState({
                description: "Currently internet is not avaliable",
              });
              break;
            default:
              this.setState({
                description: "Error in gettting response from server",
              });
              break;
          }

          this.setState({
            loading: false,
            showToast: true,
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            toastImagePath: Images.Error,
            //   description: payload.data.msg
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          });
        }
        if (payload.data.status == 1) {
          
          this.setState({ loading: false });
          let fees = {
            conFee: payload.data.ConFee,
            techFee: payload.data.TechnologyFee,
          };
          this.props.setDoctorFees(fees);
          if (!payload.data.doctorData.PayLater) {
            payload.data.doctorData["PayLater"] = 0;
          }
          if (!payload.data.doctorData.PaperSettings) {
            payload.data.doctorData["PaperSettings"] = {
              IsBW: 0,
              Margin: ["10", "10", "10", "10"],
              TemplateFontSize: "14",
              papername: "A4",
              papersize: ["210", "297"],
              header: 1,
              footer: 1,
              body: 1,
            };
          } else if (!payload.data.doctorData.PaperSettings.IsBW) {
            payload.data.doctorData["PaperSettings"] = {
              IsBW: 0,
              Margin: ["10", "10", "10", "10"],
              TemplateFontSize: "14",
              papername: "A4",
              papersize: ["210", "297"],
              header: 1,
              footer: 1,
              body: 1,
            };
          }

          this.props.setDoctorData(payload.data.doctorData);
          this.props.setToken(payload.data.drklop190);
          this.props.setVideoConsult(payload.data.doctorData.ShortUrl);
          //setPropertyAnalytics
          getUserDetailsAnalytics({
            userId: this.props.doctorProfile.DoctorData._id,
            doctorName: `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`,
          });
          AsyncStorage.removeItem("subwarn");
          this._storeData("token", payload.data.drklop190, this.props.doctorProfile.DoctorData.SubscriptionValid);
        } else {
          this.setState({
            showToast: true,
            loading: false,
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            toastImagePath: Images.Error,
            description: payload ? payload.data.msg : "Network Error",
          });
          setTimeout(() => {
            this.setState({
              showToast: false,
              description: "",
            });
          }, 5000);

          //  set

          // Alert.alert("Prescrip", response.payload.data.msg)
        }
      });
  }
  otpHandler = (message) => {
    if (message) {
      let messageFinal = JSON.stringify(message);
      if (messageFinal[1]) {
        const otp = /(\d{4})/g.exec(messageFinal)[1];
        this.setState({ otp: otp }, () => {
          this.focusNext(otp);
        });
        RNOtpVerify.removeListener();
        Keyboard.dismiss();
      }
    }

  };

  componentWillUnmount() {
    if (Platform.OS == "android") {
      RNOtpVerify.removeListener();
    }
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
    this.setState({ restart: false });
    //callthis function to render otp view
  }

  //it will render the view of Otp textinput
  renderOTPInput() {
    const inputs = Array(1).fill(0);
    const txt = inputs.map((i, j) => (
      <TextInput
        key={"otp" + j.toString()}
        maxLength={4}
        onChangeText={(txt) => this.focusNext(txt)}
        autoFocus={true}
        value={this.state.otp}

        keyboardType="numeric"
        style={{
          flex: 0.9,
          backgroundColor: 'none',

          letterSpacing: 30,
          textAlign: "center",
          color: "#06c0d7",
          margin: 0,
          paddingBottom: 8,
          fontWeight: "600",
          fontSize: 70,
          height: 120,
          fontFamily: "NotoSans-Bold",
          borderBottomWidth: 1,
        }}
      />
    ));
    return txt;
  }

  _storeData(key, val, subValid) {
    try {
      AsyncStorage.setItem(key, val);
      setTimeout(() => {
        if (!subValid) {
          this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'NoSubscription' }]

          }));
        }
        else {
          this.props.setfirstrun(false);
          // this._storeData("firstRun","false");
          if (
            this.props.doctorProfile.DoctorData.PrimarySpecialization &&
            this.props.doctorProfile.DoctorData.PrimarySpecialization.length != 0
          ) {
            this.props.setUpdateApp(false);
            this.props.navigation.navigate("Drawer");
            //this.props.navigation.navigate("RegisterSpecialization");
          } else {
            this.props.navigation.navigate("RegisterSpecialization");
          }
        }
      }, 1000);
    } catch (error) {
      Alert.alert("Prescrip", "Some error occurred");
    }
  }

  /// OTP Api call after entering otp
  focusNext(otp) {
    let doctorId = this.props.auth.doctorid;

    this.setState({ otp }, () => {
      let otpVal = this.state.otp;
      if (otpVal.length == 4) {
        //this.setState({ loading: true })
        try {
          Keyboard.dismiss();
          if (!this.state.loading && this.callfrom == "Register") {
            let data = this.props.auth.registerData;
            data.otp = otpVal;

            data.prspkypo = JSON.stringify(this.props.auth.otpToken);
            this.setState({
              loading: true,
            });
            data.appVersion = 4;
            getUniqueId().then((deviceId) => {
              data.deviceId = deviceId;
              this.props.registrationVerify(data).then(({ error, payload }) => {
                if (error) {
                  switch (error.data) {
                    case "Network Error":
                      this.setState({
                        description: "Currently internet is not avaliable",
                      });
                      break;
                    default:
                      this.setState({
                        description: "Error in gettting response from server",
                      });
                      break;
                  }

                  this.setState({
                    loading: false,
                    showToast: true,
                    toastBgColor: "#d9541d",
                    toastTextColor: "#fffefe",
                    toastImagePath: Images.Error,
                    //   description: payload.data.msg
                  });

                  setTimeout(() => {
                    this.setState({
                      showToast: false,
                    });
                  });
                } else if (payload.data.status == 1) {
                  logAnalytics(
                    payload.data.doctorData._id,
                    payload.data.doctorData.DoctorFName +
                    " " +
                    payload.data.doctorData.DoctorLName,
                    "doctor_registered"
                  );
                  this.setState({ loading: false });
                  let fees = {
                    conFee: payload.data.ConFee,
                    techFee: payload.data.TechnologyFee,
                  };
                  this.props.setDoctorFees(fees);
                  if (!payload.data.doctorData.PayLater) {
                    payload.data.doctorData["PayLater"] = 0;
                  }
                  if (!payload.data.doctorData.PaperSettings) {
                    //IsBW
                    payload.data.doctorData["PaperSettings"] = {
                      IsBW: 0,
                      Margin: ["10", "10", "10", "10"],
                      TemplateFontSize: "14",
                      papername: "A4",
                      papersize: ["210", "297"],
                      header: 1,
                      footer: 1,
                      body: 1,
                    };
                  } else if (!payload.data.doctorData.PaperSettings.IsBW) {
                    payload.data.doctorData["PaperSettings"] = {
                      IsBW: 0,
                      Margin: ["10", "10", "10", "10"],
                      TemplateFontSize: "14",
                      papername: "A4",
                      papersize: ["210", "297"],
                      header: 1,
                      footer: 1,
                      body: 1,
                    };
                  }

                  this.props.setDoctorData(payload.data.doctorData);
                  this.props.setToken(payload.data.drklop190);
                  this.props.setVideoConsult(payload.data.doctorData.ShortUrl);
                  //setPropertyAnalytics
                  getUserDetailsAnalytics({
                    userId: this.props.doctorProfile.DoctorData._id,
                    doctorName: `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`,
                  });
                  this._storeData("token", payload.data.drklop190, true);
                  AsyncStorage.removeItem("subwarn");
                } else {
                  this.setState({
                    showToast: true,
                    loading: false,
                    toastBgColor: "#d9541d",
                    toastTextColor: "#fffefe",
                    toastImagePath: Images.Error,
                    description: payload ? payload.data.msg : "Network Error",
                  });
                  setTimeout(() => {
                    this.setState({
                      showToast: false,
                      description: "",
                    });
                  }, 5000);

                  //  set

                  // Alert.alert("Prescrip", response.payload.data.msg)
                }
              });
            });
          } else if (!this.state.loading && this.callfrom == "Login") {
            this.setState({
              loading: true,
            });
            getUniqueId().then((deviceId) => {

              this.props
                .userOTPVerification(doctorId, otpVal, deviceId, 4)
                .then(({ error, payload }) => {
                  if (error) {
                    switch (error.data) {
                      case "Network Error":
                        this.setState({
                          description: "Currently internet is not avaliable",
                        });
                        break;
                      default:
                        this.setState({
                          description: "Error in gettting response from server",
                        });
                        break;
                    }

                    this.setState({
                      loading: false,
                      showToast: true,
                      toastBgColor: "#d9541d",
                      toastTextColor: "#fffefe",
                      toastImagePath: Images.Error,
                      //   description: payload.data.msg
                    });

                    setTimeout(() => {
                      this.setState({
                        showToast: false,
                      });
                    });
                  }
                  if (payload.data.status == 1) {
                    this.setState({ loading: false });
                    let fees = {
                      conFee: payload.data.ConFee,
                      techFee: payload.data.TechnologyFee,
                    };
                    this.props.setDoctorFees(fees);
                    if (!payload.data.doctorData.PayLater) {
                      payload.data.doctorData["PayLater"] = 0;
                    }
                    if (!payload.data.doctorData.PaperSettings) {
                      payload.data.doctorData["PaperSettings"] = {
                        IsBW: 0,
                        Margin: ["10", "10", "10", "10"],
                        TemplateFontSize: "14",
                        papername: "A4",
                        papersize: ["210", "297"],
                        header: 1,
                        footer: 1,
                        body: 1,
                      };
                    } else if (!payload.data.doctorData.PaperSettings.IsBW) {
                      payload.data.doctorData["PaperSettings"] = {
                        IsBW: 0,
                        Margin: ["10", "10", "10", "10"],
                        TemplateFontSize: "14",
                        papername: "A4",
                        papersize: ["210", "297"],
                        header: 1,
                        footer: 1,
                        body: 1,
                      };
                    }

                    this.props.setDoctorData(payload.data.doctorData);
                    this.props.setToken(payload.data.drklop190);
                    this.props.setVideoConsult(payload.data.doctorData.ShortUrl);
                    //setPropertyAnalytics
                    getUserDetailsAnalytics({
                      userId: this.props.doctorProfile.DoctorData._id,
                      doctorName: `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`,
                    });
                    AsyncStorage.removeItem("subwarn");
                    this._storeData("token", payload.data.drklop190, this.props.doctorProfile.DoctorData.SubscriptionValid);

                  } else {
                    this.setState({
                      showToast: true,
                      loading: false,
                      toastBgColor: "#d9541d",
                      toastTextColor: "#fffefe",
                      toastImagePath: Images.Error,
                      description: payload ? payload.data.msg : "Network Error",
                    });
                    setTimeout(() => {
                      this.setState({
                        showToast: false,
                        description: "",
                      });
                    }, 5000);

                    //  set

                    // Alert.alert("Prescrip", response.payload.data.msg)
                  }
                });
            });
          }
        } catch (error) {
          this.setState({ loading: false });
          alert.log(error);
        }
      }
    });
  }

  //  resend Otp api call
  resend() {
    const mobileNo = this.props.auth.mobileNo;

    try {
      this.setState(
        { restart: !this.state.restart, hideTimer: !this.state.hideTimer },
        () => {
          if (this.callfrom == "Register") {
            let data = {
              packageName: packageName,
              mobile: this.props.auth.registerData.mobile,
              doctorName:
                this.props.auth.registerData.firstName +
                " " +
                this.props.auth.registerData.lastName,
              emailId: this.props.auth.registerData.email,
              isRetry: this.state.retry,
            };

            this.props.requestRegisterOTP(data).then((response) => {
              if (this.state.retry == 1 && this.emailAddress == 1) {
                this.setState({
                  retry: 2,
                  otp: "",
                });
              }
              if (response.error) {
                switch (response.error.data) {
                  case "Network Error":
                    this.setState({
                      description: "Currently internet is not avaliable",
                    });
                    break;
                  default:
                    this.setState({
                      description: "Error in gettting response from server",
                    });
                    break;
                }

                this.setState({
                  loading: false,
                  showToast: true,
                  toastImagePath: Images.Error,
                  toastBgColor: "#d9541d",
                  toastTextColor: "#fffefe",

                  //   description: payload.data.msg
                });

                setTimeout(() => {
                  this.setState({
                    showToast: false,
                  });
                });
                return;
              } else if (response.payload.data.status == 1) {
                this.props.setMobile(this.props.auth.registerData.mobile);
                this.props.setOTPToken(response.payload.data.prspkypo);
                this.setState({ loading: false });
              } else {
                this.setState({
                  loading: false,
                  showToast: true,
                  toastImagePath: Images.Error,
                  toastBgColor: "#d9541d",
                  toastTextColor: "#fffefe",
                  description: "Something went wrong",
                });

                setTimeout(() => {
                  this.setState({
                    showToast: false,
                  });
                }, 2000);
              }
            });
          } else {
            let data = {
              packageName: packageName,
              mobile: mobileNo,
              isRetry: this.state.retry,
            };
            this.props.userLoginSuccess(data).then(({ error, payload }) => {
              if (this.state.retry == 1 && this.emailAddress == 1) {
                this.setState({
                  retry: 2,
                  otp: "",
                });
              }
              if (error) {
                switch (error.data) {
                  case "Network Error":
                    this.setState({
                      description: "Currently internet is not avaliable",
                    });
                    break;
                  default:
                    this.setState({
                      description: "Error in gettting response from server",
                    });
                    break;
                }

                this.setState({
                  loading: false,
                  showToast: true,
                  toastBgColor: "#d9541d",
                  toastTextColor: "#fffefe",
                  toastImagePath: Images.Error,
                  //   description: payload.data.msg
                });

                setTimeout(() => {
                  this.setState({
                    showToast: false,
                  });
                });
              } else if (payload.data.status == 1) {
                this.props.setDoctorId(payload.data.doctorId);
              } else {
                alert(payload.data.msg);
              }
            });
          }
        }
      );
    } catch (error) {
      alert("Something went wrong");
    }
  }

  //function to setState countdown
  countDownState() {
    this.setState({
      hideTimer: !this.state.hideTimer,
      restart: !this.state.restart,
    });
  }

  //navigate to login form on clicking change
  navigateToLogin() {
    this.props.navigation.navigate(this.callfrom);
  }

  render() {
    const mobileNo = this.props.auth.mobileNo;
    return (
      <OTP
        {...this.props}
        title={"OTP"}
        text={"Please enter the verification code "}
        // get the text of mobile number the user entered
        mobile={mobileNo}
        //function passing in props for rendering otp textinput
        renderOtp={this.renderOTPInput()}
        //navigation props to login form
        change={() => this.navigateToLogin()}
        // activity indicator state
        loading={this.state.loading}
        // restart timer state
        restart={this.state.restart}
        showToast={this.state.showToast}
        toastBgColor={this.state.toastBgColor}
        toastTextColor={this.state.toastTextColor}
        toastImgPath={this.state.toastImagePath}
        // hid/show timer state
        hideTimer={this.state.hideTimer}
        // calling timer function again
        finish={() => this.countDownState()}
        // resend otp function
        resend={() => this.resend()}
        attempt={this.state.retry}
        description={this.state.description}
      />
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  userLoginSuccess: (mobile) => dispatch(userLoginSuccess(mobile)),
  userOTPVerification: (doctorid, otp, deviceId, appVersion) =>
    dispatch(userOTPVerification(doctorid, otp, deviceId, appVersion)),
  setDoctorFees: (TechFee) => dispatch(setDoctorFees(TechFee)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setToken: (token) => dispatch(setToken(token)),
  registrationVerify: (data) => dispatch(registrationVerify(data)),
  setfirstrun: (flag) => dispatch(setfirstrun(flag)),
  setVideoConsult: (url) => dispatch(setVideoConsult(url)),
  requestRegisterOTP: (data) => dispatch(requestRegisterOTP(data)),
  setMobile: (mobile) => dispatch(setMobile(mobile)),
  setOTPToken: (mobile) => dispatch(setOTPToken(mobile)),
  setDoctorId: (doctorid) => dispatch(setDoctorId(doctorid)),
  setUpdateApp: (data) => dispatch(setUpdateApp(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(OTPContainer);
