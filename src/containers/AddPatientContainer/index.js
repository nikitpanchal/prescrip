/* Developed by Ruban 
  on 8/10/20 */

import React, { Component, useRef } from "react";
import PatientParentTab from "../../components/PatientProfileComponent/PatientParentTab";
import { ic_save_button, ic_close_button } from "../../constants/images";
import { Container, Content, Header } from "native-base";
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";
import {
  updatePatientOBHistory,
  addPatient,
  updatePatientDetails,
  setAllergyType,
  discardPatient,
  addNotes,
  getNotes,
  deleteNote,
  setPatientData,
  setPatientHabits,
  setPatientHistory,
} from "../../actions/patientProfie";
import {
  setPatientId,
  getRxList,
  setPrescription,
} from "../../actions/patientVisit";
import {
  setVCTransactionDetails,
  setPaymentLink,
} from "../../actions/patientVisit";
import { setPatientCount } from "../../actions/doctorProfile";
import { Gpal } from "../../commonmethods/common";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddPatientContainer extends Component {
  constructor(props) {
    super(props);
    let { params } = props.route;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      errorField: false,
      loading: false,
      tabArrayFemale: [
        "camera",
        "Personal",
        "Allergies",
        "History",
        "OB History",
        "Habits",
      ],
      tabArrayMale: ["camera", "Personal", "Allergies", "History", "Habits"],
      //Toast States
      description: "",
      showToast: false,
      previous_screen: params ? params.previous_screen : "",
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
    };
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
    if (this.props.route.params) {
      if (this.props.route.params.returnPatientData) {
        this.props.route.params.returnPatientData(true);
      }
    }
    return true;
  }

  //Patient Visit History
  showVisitHistory(item) {
    let data = {
      id: item.id,
      patientId: item.patientId, //cid should be passed while getting RX List
    };
    let vcData = {
      consult_id: "",
      trans_id: "",
    };
    this.props.setVCTransactionDetails(vcData);
    this.props.setPaymentLink("");
    this.props.setPatientId(data);
    this.setState({
      loading: false,
    });
    //this.props.navigation.pop();
    this.props.setPatientCount(this.props.patientCount + 1);

    if (this.props.navFrom == "Appointments") {
      multipleTapHandler.multitap(
        () => this.props.navigation.replace("IvBookApp", { itemData: item }),
        "IvBookApp"
      );
    } else if (this.props.navFrom == "addReceipt") {
      multipleTapHandler.clearNavigator();

      multipleTapHandler.multitap(
        () =>
          this.props.navigation.navigate("AddBillingReceiptContainer", {
            itemData: item,
          }),
        "AddBillingReceiptContainer"
      );

      // multipleTapHandler.multitap(() => this.props.navigation.replace('AddBillingReceiptContainer',{ itemData: item }), "AddBillingReceiptContainer")
    } else if (this.props.navFrom == "patientList") {
      if (this.props.route.params) {
        multipleTapHandler.multitap(
          () =>
            this.props.navigation.replace("PatientVisitHistoryContainer", {
              returnPatientData: this.refershList.bind(this),
              callFrom: this.props.route.params.callFrom
                ? this.props.route.params.callFrom
                : null,
            }),

          "PatientVisitHistoryContainer"
        );
      }
    }
  }
  refershList() {
    if (this.props.route.params) {
      this.props.route.params.returnPatientData(true);
    }
  }
  //save
  saveButton(patientData) {
    let history = this.props.patientProfile.history;

    let FamilyHistory = [];
    let PersonalHistory = [];
    history.forEach((item) => {
      if (item.Relation == "Self" || item.Relation == "") {
        let obj = {
          Disease: item.Disease,
          Duration: item.Duration,
        };
        PersonalHistory.push(obj);
        obj = null;
      } else {
        let obj = {
          Disease: item.Disease,
          Relation: item.Relation,
          Duration: item.Duration,
        };
        FamilyHistory.push(obj);
        obj = null;
      }
    });

    //Set Allergy
    patientData.CommonDetails.Allergy =
      this.props.patientProfile.selectedAllergy;
    //Set History
    patientData.CommonDetails.PersonalHistory = PersonalHistory;
    patientData.CommonDetails.FamilyHistory = FamilyHistory;
    //Set Habits
    let p_habits = this.props.patientProfile.habits.map((habit) => {
      delete habit.id;
      return habit;
    });
    patientData.CommonDetails.PatientHabits = [...p_habits]; //this.props.patientProfile.habits;
    let bmi = patientData.CommonDetails.BodyDetails.BMI;
    if (bmi == 0) {
      bmi = "";
    }
    patientData.CommonDetails.BodyDetails.BMI =
      typeof bmi == "string" ? bmi : bmi.toString();
    this.addPatientData(patientData);
  }

  getPatientHistory() {
    this.setState({
      loading: true,
    });
    let data = {
      patient_Id: this.props.patientvisit.patientId,
      doctorId: this.props.doctorProfile.DoctorData._id,
      patientId: this.props.patientvisit.Commonid,
      skip: 0,
      limit: 20,
    };
    this.props.getRxList(data).then(({ response, error }) => {
      if (error) {
        switch (error.data) {
          case "Network Error":
            this.setState({
              isInternetOn: false,
              NoNetworkMsg: "Currently internet is not avaliable",
            });
            break;
          default:
            this.setState({

              NoNetworkMsg: "Error in gettting response from server",
            });
            break;
        }

        return;

        // alert(JSON.stringify(error))
      }
      let patientDetails = { ...this.props.patientvisit.patientDetails };
      let gpal = null;
      if (patientDetails.CommonDetails.Gender == "Female") {
        if (patientDetails.CommonDetails.Gpal) {
          gpal = { ...Gpal, ...patientDetails.CommonDetails.Gpal };
        } else {
          gpal = { ...Gpal };
        }
      } else {
        gpal = null;
      }
      patientDetails.CommonDetails.Gpal = gpal ? { ...gpal } : null;
      this.props.setPatientData(patientDetails);
      this.closeScreen();
    });
  }

  // Api call
  addPatientData(patientData) {


    if (!this.props.patientProfile.editPatient) {
      logAnalytics(
        this.props.doctorProfile.DoctorData._id,
        this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
        "add_patient"
      );
    }
    AsyncStorage.getItem("registered_doctor").then((registered_doctor) => {
      if (registered_doctor) {

        logAnalytics(
          this.props.doctorProfile.DoctorData._id,
          this.props.doctorProfile.DoctorData.DoctorFName +
          " " +
          this.props.doctorProfile.DoctorData.DoctorLName,
          "registered_add_patient"
        );

      }
    });

    try {
      this.setState({
        loading: true,
      });
      if (this.props.patientProfile.editPatient == true) {
        let editData = {
          CommonDetails: patientData.CommonDetails,
          Mobile: patientData.Mobile,
        };
        this.props
          .updatePatientDetails(patientData._id, editData)
          .then(({ payload, error }) => {
            if (error) {
              this.setState({
                description: "Currently internet is not avaliable",
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error,
              });
              switch (error.data) {
                case "Network Error":
                  this.setState({
                    description: "Currently internet is not avaliable",
                    toastBgColor: "#d9541d",
                    toastTextColor: "#fffefe",
                    toastImagePath: Images.Error,
                  });
                  break;
                default:
                  this.setState({
                    description: "Error in gettting response from server",
                    toastBgColor: "#d9541d",
                    toastTextColor: "#fffefe",
                    toastImagePath: Images.Error,
                  });
                  break;
              }

              this.setState({
                showToast: true,
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                  loading: false,
                });
              }, 1500);

              return;
            }
            if (payload.data.status == 2000) {
              this.props.setPatientData(patientData);

              // alert(this.state.previous_screen)

              if (this.state.previous_screen === "PrintPreview") {
                this.getPatientHistory();
              }

              this.setState({
                showToast: true,
                description: payload.data.msg,
                toastBgColor: "#29b62f",
                toastTextColor: "#fafdfa",
                toastImagePath: Images.Success,
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                  loading: false,
                });

                if (this.state.previous_screen != "PrintPreview") {
                  this.closeScreen();
                }
              }, 2000);
              // Toast.show({ text: "Patient Updated successfully", duration: 1000, position: 'bottom', style: { textAlign: 'center' } })
            } else {
              this.setState({
                loading: false,
              });
              this.setState({
                showToast: true,
                description: payload.data.msg,
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error,
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                  loading: false,
                });

                this.closeScreen();
              }, 2000);
            }
          });
      } else {
        this.props.addPatient(patientData).then(({ payload, error }) => {
          if (error) {
            this.setState({
              description: "Currently internet is not avaliable",
              toastBgColor: "#d9541d",
              toastTextColor: "#fffefe",
              toastImagePath: Images.Error,
            });
            switch (error.data) {
              case "Network Error":
                this.setState({
                  description: "Currently internet is not avaliable",
                  toastBgColor: "#d9541d",
                  toastTextColor: "#fffefe",
                  toastImagePath: Images.Error,
                });
                break;
              default:
                this.setState({
                  description: "Error in gettting response from server",
                  toastBgColor: "#d9541d",
                  toastTextColor: "#fffefe",
                  toastImagePath: Images.Error,
                });
                break;
            }

            this.setState({
              showToast: true,
            });

            setTimeout(() => {
              this.setState({
                showToast: false,
                loading: false,
              });
            }, 1500);

            return;
          }
          let responseData = payload.data.data;
          let pid = payload.data.patient_Id;
          if (payload.data.status == 2000) {
            //Toast.show({ text: "Patient Added successfully", duration: 1000, position: 'bottom', style: { textAlign: 'center' } })
            //this.props.navigation.goBack();
            this.setState({
              showToast: true,
              description: payload.data.msg,
              toastBgColor: "#29b62f",
              toastTextColor: "#fafdfa",
              toastImagePath: Images.Success,
            });

            setTimeout(() => {
              this.setState({
                showToast: false,
              });
              let item;
              if (this.props.navFrom == "Appointments") {
                item = {
                  Mobile: patientData.CommonDetails.Whatsapp ? patientData.CommonDetails.Whatsapp : (patientData.CommonDetails.CountryCode ? patientData.CommonDetails.CountryCode + patientData.Mobile
                    : '+91' + patientData.Mobile),
                  Gender: patientData.CommonDetails.Gender,
                  CountryCode: patientData.CommonDetails.CountryCode
                    ? patientData.CommonDetails.CountryCode
                    : "+91",
                  Whatsapp: patientData.CommonDetails.Whatsapp
                    ? patientData.CommonDetails.Whatsapp
                    : "",
                  DOB: patientData.CommonDetails.DOB,
                  _id: pid,
                  Cid: responseData.id,
                  FullName: patientData.CommonDetails.FullName,
                };
              } else if (this.props.navFrom == "patientList") {
                item = {
                  id: pid,
                  patientId: responseData.id,
                };
              } else if (this.props.navFrom == "addReceipt") {
                item = {
                  Mobile: patientData.CommonDetails.CountryCode ? patientData.CommonDetails.CountryCode + patientData.Mobile : '+91' + patientData.Mobile,
                  Gender: patientData.CommonDetails.Gender,
                  CountryCode: patientData.CommonDetails.CountryCode
                    ? patientData.CommonDetails.CountryCode
                    : "+91",
                  Whatsapp: patientData.CommonDetails.Whatsapp
                    ? patientData.CommonDetails.Whatsapp
                    : "",
                  DOB: patientData.CommonDetails.DOB,
                  _id: pid,
                  Cid: responseData.id,
                  PatientId: responseData.id,
                  FullName: patientData.CommonDetails.FullName,
                };
              }

              this.showVisitHistory(item);
              //this.closeScreen();
            }, 2000);
          } else {
            //Toast.show({ text: response.payload.data.message, duration: 1000, position: 'bottom', style: { textAlign: 'center' } })
            //this.props.navigation.goBack(null);
            this.setState({
              showToast: true,
              description: payload.data.message,
              toastBgColor: "#d9541d",
              toastTextColor: "#fffefe",
              toastImagePath: Images.Error,
            });

            setTimeout(() => {
              this.setState({
                showToast: false,
                loading: false,
              });
              // this.closeScreen();
            }, 2000);
          }
        });
      }
    } catch (err) {
      this.setState({
        showToast: true,
        description: payload.data.message,
        toastBgColor: "#d9541d",
        toastTextColor: "#fffefe",
        toastImagePath: Images.Error,
      });

      setTimeout(() => {
        this.setState({
          showToast: false,
          loading: false,
        });
      }, 2000);
    }
  }
  closeScreen() {
    this.handleBackButtonClick();
    if (!this.props.patientProfile.editPatient) {
      this.props.discardPatient();
    }
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();

    if (this.props.patientProfile.editPatient) {
      getScreenNameAnalytics({
        screen_name: "EditPatient",
        screen_class: "AddPatientContainer",
      });
      let tabArrayFemale = [
        "camera",
        "Personal",
        "Allergies",
        "History",
        "OB History",
        "Habits",
        "Notes",
      ];
      let tabArrayMale = [
        "camera",
        "Personal",
        "Allergies",
        "History",
        "Habits",
        "Notes",
      ];
      this.setState({
        tabArrayFemale: tabArrayFemale,
        tabArrayMale: tabArrayMale,
        errorField: false,
      });
    } else {
      getScreenNameAnalytics({
        screen_name: "AddPatient",
        screen_class: "AddPatientContainer",
      });
    }

    this.setState({ errorField: false });
  }
  render() {
    return (
      <View contentContainerStyle={{ flex: 1, backgroundColor: '#fffff' }}
        style={{ flex: 1, backgroundColor: '#fffff' }}>
        <View
          style={{
            flex: 1, justifyContent: "center", alignItems: "center",
            alignSelf: "center", width: Dimensions.get('window').width
          }}>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            translucent={true}
            backgroundColor="transparent"
          />

          <PatientParentTab
            {...this.props}
            tabTitle={
              this.props.patientProfile.editPatient
                ? "Edit Patient"
                : "Add Patient"
            }
            leftImage={ic_close_button}
            rightImage={ic_save_button}
            loading={this.state.loading}
            pNumber={
              this.props.route.params &&
                this.props.route.params.patientNumber
                ? this.props.route.params.patientNumber
                : ""
            }
            pName={
              this.props.route.params &&
                this.props.route.params.patientName
                ? this.props.route.params.patientName
                : ""
            }
            leftImageClick={() => this.closeScreen()}
            rightImageClick={(patientData) => this.saveButton(patientData)}
            tabArray={

              this.state.tabArrayFemale

            }
          />
          <Toast
            position="bottom"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1, flex: 1,
              justifyContent: 'center',
              alignItems: 'center',

              backgroundColor: this.state.toastBgColor,
              borderRadius: 15
            }}
            ref={(toast) => this.toast = toast} />
        </View>
        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toastTextColor}
              imagePath={this.state.toastImagePath}
              description={this.state.description}
            />,

            1500
          )
          : null}

      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientCount: state.doctorProfile.patientCount,

  patientProfile: state.patientProfile,
  navFrom: state.patientvisit.navFrom,
  patientvisit: state.patientvisit,
});

const mapDispatchToProps = (dispatch) => ({
  getRxList: (data) => dispatch(getRxList(data)),

  addPatient: (data) => dispatch(addPatient(data)),
  setPatientData: (data) => dispatch(setPatientData(data)),
  updatePatientOBHistory: (patientGender) =>
    dispatch(updatePatientOBHistory(patientGender)),
  updatePatientDetails: (patientid, data) =>
    dispatch(updatePatientDetails(patientid, data)),
  setAllergyType: (allergyType) => dispatch(setAllergyType(allergyType)),
  getNotes: (data) => dispatch(getNotes(data)),
  addNotes: (data) => dispatch(addNotes(data)),
  setPatientHabits: (data) => dispatch(setPatientHabits(data)),
  setPatientHistory: (data) => dispatch(setPatientHistory(data)),
  setVCTransactionDetails: (data) => dispatch(setVCTransactionDetails(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  setPatientId: (data) => dispatch(setPatientId(data)),
  deleteNote: (data) => dispatch(deleteNote(data)),
  discardPatient: () => dispatch(discardPatient()),
  setPatientCount: (data) => dispatch(setPatientCount(data)),
  setPrescription: (data) => dispatch(setPrescription(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AddPatientContainer));
