//Sourabh chanages
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Image,
  Alert,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import SelectTemplate from "../../components/SelectTemplate";
import { Toast } from "native-base";
import {
  updateSelectedTemplate,
  AddPatientVisitData,
  submitError,
} from "../../actions";
import { logAnalytics } from "../../constants/analytics";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SelectTemplateForm extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);
    this.state = {
      counter: 0,
      isloaded: false,
      doctordata: null,
    };

    this.focusListner = this.props.navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
      this.getDoctorData();
    });
  }

  componentDidMount() {
    this.loglytics("Screen_Load");
  }

  loglytics(action) {
    var { _id, DoctorMobile, DoctorFName, DoctorLName } =
      this.props.patientvisitdetails.doctordata;
    logAnalytics(
      _id + "_" + DoctorFName + "_" + DoctorLName,
      DoctorMobile,
      "Select_Template",
      action
    );
  }

  submitErrors(url, error, section) {
    var { _id } = this.props.patientvisitdetails.doctordata;
    let data = {
      docid: _id,
      url: url,
      ex: {
        message: error.message || "",
        stack: error.stack || "",
      },
      sectionname: section,
    };
    this.props.submitError(data);
  }

  async _storeGetData(key, callback) {
    try {
      await AsyncStorage.getItem(key).then((val) => {
        callback(val);
      });
    } catch (error) {
      this.submitErrors("SelectTemplateContainer", error, "_storeGetData");
    }
  }

  getDoctorData() {
    this._storeGetData("doctordata", (val) => {
      if (val != null) {
        let doctordata = JSON.parse(val);
        this.setState({ doctordata: doctordata });
      }
    });
  }

  getDerivedStateFromProps(nextProps, nextState) {
    if (this.props.auth.isFailed !== nextProps.auth.isFailed) {
      if (nextProps.auth.isFailed && !nextProps.auth.isAuthenticating) {
        let message = nextProps.auth.error;
        if (message != "")
          setTimeout(() => {
            Alert.alert("", message);
          }, 100);
      }
    }

    if (
      nextProps.auth.status == 1 &&
      !nextProps.auth.isRequesting &&
      nextProps.auth.screen == "SelectTemplate"
    ) {
    }

    if (
      nextProps &&
      nextProps.auth.status != undefined &&
      nextProps.auth.status != 1 &&
      nextProps.auth.screen == "SelectTemplate"
    ) {
      Toast.show({
        text: nextProps.auth.msg,
        duration: 2000,
        position: "bottom",
        textStyle: { textAlign: "center" },
      });
    }
  }

  componentWillUnmount() {
    // to remove the back listener
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  _handleBackPress() {
    this.props.navigation.goBack();
    return true;
  }
  async _storeData(key, val) {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      this.submitErrors("SelectTemplateContainer", error, "_storeData");
    }
  }

  selectTemplate = async (data) => {
    var { PrimarySpecialization } = this.props.patientvisitdetails.doctordata;

    if (data.length > 0) {
      var action = 0;
      let doctorid = await AsyncStorage.getItem("doctorid");
      if (doctorid) {
        var data1 = null;
        //let patientid = "5cacb4dcba2e16161ce2083e";

        if (data.length >= 4) {
          //seq. changed for PrimarySpecialization ==Ophthalmologist
          //29/7/2020 @sourabh

          if (PrimarySpecialization == "Ophthalmologist") {
            data1 = {
              footer: data[data.length - 1],
              header: data[data.length - 3],
              body: data[data.length - 2],
            };
          } else {
            data1 = {
              footer: data[data.length - 3],
              header: data[data.length - 2],
              body: data[data.length - 1],
            };
          }
        } else {
          data1 = {
            header: this.state.doctordata.PaperSettings.header || 1,
            body: this.state.doctordata.PaperSettings.body || 1,
            footer: this.state.doctordata.PaperSettings.footer || 1,
          };
        }
        Object.keys(data1).forEach(function (key) {
          let value = data1[key];
          value = !value ? 1 : value;
          value = value == "undefined" || value == "null" ? 1 : value;
          data1[key] = value;
        });

        data = data1;

        let self = this;
        this.props
          .updateSelectedTemplate({ action, doctorid, data })
          .then((pay) => {
            let apidata = pay.payload.data.data;
            let PatientVisitsMaster1 = null;
            if (this.props.patientvisitdetails.PatientVisitsMaster1) {
              PatientVisitsMaster1 =
                self.props.patientvisitdetails.PatientVisitsMaster1;
              PatientVisitsMaster1.PaperSettings = apidata.PaperSettings;
            }
            self.props.dispatch({
              type: "ADDPATIENTVISITDATA",
              payload: {
                doctordata: apidata,
                PatientVisitsMaster1: PatientVisitsMaster1,
              },
            });
            self._storeData("doctordata", JSON.stringify(apidata));
            self.props.navigation.goBack();
          });
      } else {
        Toast.show({
          text: "Some error occurred please try later",
          duration: 2000,
          position: "bottom",
          textStyle: { textAlign: "center" },
        });
      }
    } else {
      Toast.show({
        text: "Please Select Template",
        duration: 2000,
        position: "bottom",
        textStyle: { textAlign: "center" },
      });
    }
  };

  render() {
    const form = <View></View>;
    var paperSettings = this.state.doctordata
      ? this.state.doctordata.PaperSettings
      : null;
    return (
      <SelectTemplate
        {...this.props}
        navigation={this.props.navigation}
        doctordata={this.state.doctordata}
        onsave={(data) => this.selectTemplate(data)}
        headertype={paperSettings ? paperSettings.header : 1}
        bodytype={paperSettings ? paperSettings.body : 1}
        footertype={paperSettings ? paperSettings.footer : 1}
        PatientData={this.PatientData}
        onRedirect={(data) => this.addNotes(data)}
        loglytics={(event) => this.loglytics(event)}
        submitErrors={(arg1, arg2, arg3) => this.submitErrors(arg1, arg2, arg3)}
      />
    );
  }
}

// SelectTemplateForm.propTypes = {
//   auth: PropTypes.object,
//   patientvisitdetails: PropTypes.object,
//   selecttemplateForm: PropTypes.object,
//   //addnotes: PropTypes.func
// };

// const SelectTemplateConatiner = reduxForm({
//   form: "selecttemplate"
// })(SelectTemplateForm);

const mapStateToProps = (state) => ({
  auth: state.auth,
  patientvisitdetails: state.patientvisitdetails,
  //selecttemplateForm: state.form.selecttemplate,
});

const mapDispatchToProps = (dispatch) => ({
  updateSelectedTemplate: ({ action, doctorid, data }) =>
    dispatch(updateSelectedTemplate({ action, doctorid, data })),
  userRedirectRequest: () => dispatch(userRedirectRequest()),
  AddPatientVisitData: () => dispatch(AddPatientVisitData()),
  submitError: (userdata) => dispatch(submitError(userdata)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectTemplateForm);
