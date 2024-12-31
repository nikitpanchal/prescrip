/*created by Ruban
Login Container

*/
import React, { Component } from "react";
import { Alert, BackHandler, ToastAndroid, Text } from "react-native";

import NoNetwork from "../../components/NoNetwork/noNetwork";
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import { userLoginSuccess, setMobile, setDoctorId, setToken } from "../../actions/auth";
import { isPhoneno } from "../../commonmethods/validation";
import Login from "../../components/Login/Login";
import { packageName } from "../../../app.json";
import Images from "../../Theme/Images";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
import { setTooltip } from "../../actions/home";
import { setSyncFlag } from "../../actions/sync";
import { setCurrentTab, isRefreshBilling } from "../../actions/auth";
import { clearDoctorData } from "../../actions/doctorProfile";
import { userRequestLogout } from '../../actions';
var isValid = false;
let currentCount = 0;

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      val: "",
      onClick: false,
      isValid: false,
      loading: false,
      counter: 0,
      description: "",
      isInternetOn: true,
      NoNetworkMsg: "",
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      showToast: false,
    };
    this._handleBackPress = this._handleBackPress.bind(this);

    this.mobileCheck = this.mobileCheck.bind(this);
  }

  //back press handler
  _handleBackPress() {
    // this.props.navigation.goBack()
    // alert('xzvv')

    this.onBackButtonPressAndroid();

    return true;
  }
  logoutInActive() {

    this.props.setToken('')
  }
  // mobile number set value
  mobileVal(text) {
    this.setState({ val: text });
  }

  //mobile number validation
  mobileValid() {
    var valid = isPhoneno(this.state.val, "Mobile number");
    isValid = valid.isvalid;
    return valid.isvalid == false ? (
      <Text
        style={{
          color: "#FF0000",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      >
        {valid.msg}
      </Text>
    ) : (
      <Text
        style={{
          color: "#FF0000",
          textAlign: "left",
          marginTop: 5,
          fontSize: 12,
        }}
      >
        {""}
      </Text>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    if (this.props.doctorProfile.DoctorData){
      this.props.logout();
      this.props.clearData();
      this.props.setTooltip("Exit");
      this.props.setCurrentTab("MyPatients");
      let data = {
        lastSync: null,
        synced: false,
      };
     // this.props.setSyncFlag(data);
      this.props.isRefreshBilling(true);
    }
    
    this.setState({ onClick: false });
    getScreenNameAnalytics({
      screen_name: "Login",
      screen_class: "LoginContainer",
    });

  }

  //mobile number Api  Authentication
  mobileCheck = () => {
    this.setState({ onClick: true }, () => {
      if (isValid == true) {
        this.setState({ loading: true });
        this.props.setMobile(this.state.val);
        let data = {
          packageName: packageName,
          mobile: this.state.val,
        };
        try {
          this.props.userLoginSuccess(data).then(({ error, payload }) => {
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
                toastImagePath: Images.Error,
                toastTextColor: "#fffefe",
                toastBgColor: "#d9541d",
                //   description: payload.data.msg
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                });
              });
            } else if (payload && payload.data.status == 1) {
              this.setState({ loading: false });
              this.props.setMobile(this.state.val);
              this.props.setDoctorId(payload.data.doctorId);

              this.props.navigation.navigate("OTP", {
                callfrom: "Login",
                emailAddress: payload.data.emailAvailable,
              });
            } else {
              this.setState({
                loading: false,
                showToast: true,
                toastImagePath: Images.Success,
                toastTextColor: "#fafdfa",
                toastBgColor: "#29b62f",
                description: payload.data.msg,
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                });
              }, 2000);

              //   Alert.alert("Prescrip", response.payload.data.msg)
            }
          });
        } catch (err) {
          this.setState({
            loading: false,
            showToast: true,
            description: "Something went wrong",
            toastImagePath: Images.Error,
            toastTextColor: "#fffefe",
            toastBgColor: "#d9541d",
            
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          }, 2000);
        }
      }
    });
  };

  onBackButtonPressAndroid = () => {
    if (currentCount < 1) {
      currentCount += 1;
      //alert('dsg')
      ToastAndroid.showWithGravityAndOffset(
        "Press again to close!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        200
      );
      // Toast.show({ text: 'Press again to close!', duration: 1000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      currentCount = 0;
    }, 2000);
  };

  render() {
    return (
      <Login
        {...this.props}
        title={"Login"}
        text={"Mobile No."}
        newUser={"New User?"}
        register={"Register"}
        btnTxt={"Login"}
        // setstate of login button
        onClick={this.state.onClick}
        //Activity indicator
        loading={this.state.loading}
        // mobile no validation
        mobileValid={this.mobileValid()}
        //setState of mobile number
        mobileVal={(text) => this.mobileVal(text)}
        showToast={this.state.showToast}
        description={this.state.description}
        toastBgColor={this.state.toastBgColor}
        toastTextColor={this.state.toastTextColor}
        toastImgPath={this.state.toastImagePath}
        //set api navigation to other screen
        mobileCheck={this.mobileCheck.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
  //loginForm: state.form.login
});

const mapDispatchToProps = (dispatch) => ({
  userLoginSuccess: (mobile) => dispatch(userLoginSuccess(mobile)),
  setMobile: (mobile) => dispatch(setMobile(mobile)),
  setDoctorId: (doctorid) => dispatch(setDoctorId(doctorid)),
  logout: () => dispatch(userRequestLogout()),
  clearData: () => dispatch(clearDoctorData()),
  setTooltip: (tab) => dispatch(setTooltip(tab)),
  setSyncFlag: (data) => dispatch(setSyncFlag(data)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  setToken: (token) => dispatch(setToken(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(LoginContainer));
