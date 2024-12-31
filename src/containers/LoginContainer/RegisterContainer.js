/* Created Ruban 
Register container
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import Register from "../../components/Login/Register";
import Images from "../../Theme/Images";
import {
  View,
  Text,
  BackHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { setRegisterData } from "../../actions/auth";

import {
  userRegistrationSuccess,
  setMobile,
  setDoctorId,
  setOTPToken,
  setRegistrationData,
  requestRegisterOTP,
  checkMobileNumber,
} from "../../actions/auth";
import {
  isPhoneno,
  isEmailValid,
  isNameValid,
} from "../../commonmethods/validation";
import { Toast } from "native-base";
import { packageName } from "../../../app.json";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";
var isValidFname = false;
var isValidLname = false;
var isValidEmail = false;
var isValidPhone = false;
var isValidCouncilName = false;
var isValidMicrNo = false;
class RegisterContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchBox: true,

      mobile: "",
      email: "",
      firstName: "",
      emaillength: 0,
      emailfont: 30,
      lastName: "",
      micrNo: "",
      councilName: "",
      promoCode: "",
      isSelected: true,
      onClick: false,
      loading: false,
      showToast: false,
      description: "",
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      isExits: false,
      checkMobile: false,
    };

    this._handleBackPress = this._handleBackPress.bind(this);
    this.regsetData = [];
    this.regData = {
      firstName: this.props.auth.registerData.firstName
        ? this.props.auth.registerData.firstName
        : "",
      lastName: this.props.auth.registerData.lastName
        ? this.props.auth.registerData.lastName
        : "",
      email: this.props.auth.registerData.email
        ? this.props.auth.registerData.email
        : "",
      mobile: this.props.auth.registerData.mobile
        ? this.props.auth.registerData.mobile
        : "",
      councilName: this.props.auth.registerData.councilName
        ? this.props.auth.registerData.councilName
        : "",
      micrNo: this.props.auth.registerData.micrNo
        ? this.props.auth.registerData.micrNo
        : "",
    };
    this.regRef = React.createRef();
  }

  //back press handler
  _handleBackPress() {
    this.props.navigation.navigate("Login");

    // this.props.navigation.goBack()

    return true;
  }

  componentDidMount() {
    // this.regRef.current ? this.regRef.current.focus() : null;
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    if (this.props.auth.registerData.mobile) {
      this.verifyMobileNumber(this.props.auth.registerData.mobile);
    }

    getScreenNameAnalytics({
      screen_name: "Register",
      screen_class: "RegisterContainer",
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  // first name validity
  validityCheckFname() {
    let fName = isNameValid(
      this.props.auth.registerData.firstName,
      "First Name"
    );
    isValidFname = fName.isvalid;
    return fName.isvalid == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {fName.msg}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }
  // last name validity
  validityCheckLname() {
    let lName = isNameValid(this.props.auth.registerData.lastName, "last Name");
    isValidLname = lName.isvalid;
    return lName.isvalid == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {lName.msg}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }
  // email validity
  validityCheckEmail() {
    let email_txt = this.props.auth.registerData.email
      ? this.props.auth.registerData.email.trim()
      : "";
    let email = isEmailValid(email_txt, "Email id");
    isValidEmail = email.isvalid;
    return email.isvalid == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {email.msg}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }

  // mobile number validity
  validityCheckMobile() {
    let mobile = isPhoneno(this.props.auth.registerData.mobile, "Mobile no");
    isValidPhone = mobile.isvalid;
    return mobile.isvalid == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {mobile.msg}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }

  // council name validity
  validityCheckCouncilName() {
    if (this.state.councilName || this.props.auth.registerData.councilName) {
      isValidCouncilName = true;
    } else {
      isValidCouncilName = false;
    }
    return isValidCouncilName == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {"Please enter Council Name"}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }

  validityMicrNo() {
    if (this.state.micrNo || this.props.auth.registerData.micrNo) {
      isValidMicrNo = true;
    } else {
      isValidMicrNo = false;
    }
    return isValidMicrNo == false ? (
      <Text
        style={{ color: "red", textAlign: "left", marginTop: 5, fontSize: 12 }}
      >
        {"Please enter Registration Number"}
      </Text>
    ) : (
      <Text
        style={{
          color: "red",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      ></Text>
    );
  }

  // function to call registration api and redirect to another screen
  navigate() {
    if (this.state.isSelected) {
      this.setState({ onClick: true });

      if (
        isValidFname == true &&
        isValidLname == true &&
        isValidEmail == true &&
        isValidPhone == true &&
        isValidCouncilName == true &&
        isValidMicrNo == true &&
        this.state.isSelected == true
      ) {
        this.setState({ loading: true });
        let registerData = {
          mobile: this.props.auth.registerData.mobile,
          email: this.props.auth.registerData.email,
          firstName: this.props.auth.registerData.firstName,
          lastName: this.props.auth.registerData.lastName,
          micrNo: this.props.auth.registerData.micrNo,
          councilName: this.props.auth.registerData.councilName,
          promoCode: "",
        };

        this.props.setRegistrationData(registerData);
        //micrno: registerData.micrNo,
        //councilName: registerData.councilName
        let otpData = {
          packageName: packageName,
          mobile: this.props.auth.registerData.mobile,
          doctorName: registerData.firstName + " " + registerData.lastName,
          emailId: registerData.email,
        };
        this.props.requestRegisterOTP(otpData).then((response) => {
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
            //log analytics
            logAnalytics(
              "",
              registerData.firstName + " " + registerData.lastName,
              "registration_clicked"
            );
            this.props.setMobile(this.props.auth.registerData.mobile);
            this.props.setOTPToken(response.payload.data.prspkypo);
            this.setState({ loading: false });
            this.props.navigation.navigate("OTP", {
              callfrom: "Register",
              emailAddress: 0,
            });
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
      }
    } else {
      this.setState({
        showToast: true,
        description: "Please agree Terms and Conditions before proceeding",
        toastImagePath: Images.Info,
        toastBgColor: "#1b7cdb",
        toastTextColor: "#fafbfe",
      });
      setTimeout(() => {
        this.setState({
          showToast: false,
        });
      }, 2000);

      // Alert.alert("please check agree terms and condition")
      // this.showTnCToast("Please agree Terms and Conditions before proceeding");
    }
  }

  showTnCToast(msg) {
    return Toast.show({
      text: msg,
      style: { borderRadius: 20 },
      textStyle: { textAlign: "center" },
      duration: 2000,
      type: "danger",
    });
  }

  emailfontSize(txt) {
    this.setState({ emaillength: txt.length, email: txt }, () => {
      this.setRegData("email", this.state.email);
      if (this.state.emaillength > 18 && this.state.emaillength < 24) {
        this.setState({ emailfont: 24 });
      } else if (this.state.emaillength >= 24 && this.state.emaillength < 28) {
        this.setState({ emailfont: 22 });
      } else if (this.state.emaillength >= 28 && this.state.emaillength < 35) {
        this.setState({ emailfont: 20 });
      } else if (this.state.emaillength >= 35 && this.state.emaillength <= 40) {
        this.setState({ emailfont: 16 });
      }
    });
  }

  verifyMobileNumber(txt) {
    this.setState(
      {
        mobile: txt,
      },
      () => {
        this.setRegData("mobile", this.state.mobile);
        this.regsetData.splice(3, 0, this.state.mobile);
        this.props.setRegisterData(this.regData);
      }
    );
    if (txt.length == 10) {
      Keyboard.dismiss();
      this.regRef.current ? this.regRef.current.focus() : null;
      let data = {
        mobile: txt,
      };
      this.props.checkMobileNumber(data).then(({ payload, error }) => {
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
            //   description: payload.data.msg
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          });
        } else if (payload.data.status == 0) {
          this.setState({
            showToast: false,
            isExits: payload.data.status == 0 ? true : false,
            description: payload.data.msg,
          });
          setTimeout(() => {
            this.setState({
              showToast: false,
              description: "",
            });
          }, 5000);
        } else if (payload.data.status == 1) {
          this.setState({
            showToast: false,
            isExits: payload.data.status == 0 ? true : false,
            description: payload.data.msg,
          });
        }
      });
    }
  }
  isTextValid(str) {
    //   return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    return str.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, "");
  }
  setRegData(val, txt) {
    if (val == "firstName") {
      let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      let filteredtext = this.isTextValid(txt.trim());

      if (!regex.test(txt)) {
        if (filteredtext) {
          this.setState({ firstName: txt }, () => {
            this.regData.firstName = this.state.firstName;
            this.props.setRegisterData(this.regData);
          });
        }
      } else {
        let notString = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        Alert.alert(
          "Prescrip",
          "Special characters like" + notString + " not allowed "
        );
      }
    } else if (val == "lastName") {
      let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      let filteredtext = this.isTextValid(txt.trim());
      //console.log("textt", filteredtext);
      if (!regex.test(txt)) {
        if (filteredtext) {
          this.setState({ lastName: txt }, () => {
            this.regData.lastName = this.state.lastName;
            this.props.setRegisterData(this.regData);
          });
        }
      } else {
        let notString = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        Alert.alert(
          "Prescrip",
          "Special characters like" + notString + " not allowed "
        );
      }
    } else if (val == "email") {
      this.regData.email = this.state.email;
      this.props.setRegisterData(this.regData);
    } else if (val == "mobile") {
      this.regData.mobile = this.state.mobile;
      this.props.setRegisterData(this.regData);
    } else if (val == "micrNo") {
      this.setState({ micrNo: txt }, () => {
        this.regData.micrNo = this.state.micrNo;
        this.props.setRegisterData(this.regData);
      });
    } else if (val == "councilName") {
      this.setState({ councilName: txt }, () => {
        this.regData.councilName = this.state.councilName;
        this.props.setRegisterData(this.regData);
      });
    }
  }

  render() {
    return (
      <Register
        {...this.props}
        regRef={this.regRef}
        showToast={this.state.showToast}
        description={this.state.description}
        toastBgColor={this.state.toastBgColor}
        toastTextColor={this.state.toastTextColor}
        toastImgPath={this.state.toastImagePath}
        refs={"register"}
        title={"Let's Begin!"}
        fname={"First Name"}
        lname={"Last Name"}
        mobile={"Mobile No."}
        email={"Email"}
        micrNo={"Registration Number"}
        council={"State Medical Council"}
        emailFont={this.state.emailfont}
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        emailId={this.state.email}
        phoneNo={this.state.mobile}
        registrationNo={this.state.micrNo}
        councilName={this.state.councilName}
        regData={this.regData}
        // setState of first name
        onChangeTextFname={(txt) => this.setRegData("firstName", txt)}
        // setState of last name
        onChangeTextLname={(txt) => this.setRegData("lastName", txt)}
        // setState of email
        onChangeTextemail={(txt) => this.emailfontSize(txt)}
        // setState of mobile
        onChangeTextmobile={(txt) => this.verifyMobileNumber(txt)}
        //setState micr no
        onChangeTextmicrNo={(txt) => this.setRegData("micrNo", txt)}
        onChangeTextcouncilName={(txt) => this.setRegData("councilName", txt)}
        // on clicking register button
        onClick={this.state.onClick}
        // on clicking terms and conditions checkbox
        onSelected={() => this.setState({ isSelected: !this.state.isSelected })}
        // state of checkbox whether true or false
        isSelected={this.state.isSelected}
        //check name validation
        validityCheckFname={this.validityCheckFname()}
        //check name validation
        validityCheckLname={this.validityCheckLname()}
        //check email validation
        validityCheckEmail={this.validityCheckEmail()}
        //check mobile validation
        validityCheckMobile={this.validityCheckMobile()}
        validityCheckMicrNo={this.validityMicrNo()}
        validityCheckCouncilName={this.validityCheckCouncilName()}
        // activity indicator
        loading={this.state.loading}
        isExits={this.state.isExits}
        // set api and navigation to other screen
        navigate={() => this.navigate()}
      />
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  userRegistrationSuccess: (mobile, email, firstName, lastName, promoCode) =>
    dispatch(
      userRegistrationSuccess(mobile, email, firstName, lastName, promoCode)
    ),
  setMobile: (mobile) => dispatch(setMobile(mobile)),
  setDoctorId: (doctorid) => dispatch(setDoctorId(doctorid)),
  setOTPToken: (data) => dispatch(setOTPToken(data)),
  setRegistrationData: (data) => dispatch(setRegistrationData(data)),
  requestRegisterOTP: (data) => dispatch(requestRegisterOTP(data)),
  checkMobileNumber: (data) => dispatch(checkMobileNumber(data)),
  setRegisterData: (data) => dispatch(setRegisterData(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
