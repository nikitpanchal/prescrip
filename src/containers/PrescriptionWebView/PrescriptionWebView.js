//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import { Container, Text, Icon, Button } from "native-base";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
  Alert,
  Platform, Dimensions
} from "react-native";

import WebView from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";
import CenterModal from "../../components/Modal/centerModal";
import {
  ic_Quick_Rx_Heart,
  ic_prescription_menu,
  ic_share_prescrip,
} from "../../constants/images";

import moment from "moment";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { setOpthalData } from "../../actions/opthal";
import { StackActions, CommonActions } from '@react-navigation/native';
import {
  getVisitPrescription,
  setPrescription,
  setPrintClickCount,
  createRefill,
  setSuggestionPatientData,
} from "../../actions/patientVisit";
import {
  get_chief_suggestions,
  patientvisits,
  get_suggestions,
} from "../../actions";

//import react in our code.
//import all the components we are going to use.

//import Carousel from 'react-native-banner-carousel';

import Images from "../../Theme/Images";

import PrescriptionWebViewHeader from "../../components/Header/PrescriptionWebViewHeader";

import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { isStagging, staging, prod } from "../../../app.json";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNPrint from "react-native-print";
import Share from "react-native-share";
import { offline_def_prescription } from "../../commonmethods/common";

import { calculateAge } from "../../commonmethods/common";
import {
  icon_search_button_blue,
  lefticon,
  ic_Close_Button,
  icon_Reemove_Button,
  ic_cancle_selected,
  ic_back_black,
  ic_Orange_BG_578,
  ic_Empty_Setup_Clinic_Icon,
  icon_List_First_Element_Add_Button_Blue,
  icon_Chief_Complaints_Duration_Button,
} from "../../constants/images";
import { def_prescription } from "../../commonmethods/common";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";

const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export class PrescripWebView extends React.Component {
  constructor() {
    super();
    this.filepath = "";
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      url: "",
      issueDate: "",
      loading: true,
      data: null,
      PaperSettings: {},
    };
    this.webdata = [];
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "PrescriptionView",
      screen_class: "PrescriptionWebView",
    });
    this.getVisitDetails();
  }
  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    if (this.filepath != "") {
      RNFS.unlink(this.filepath);
    }
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    let defaultPrescription = JSON.parse(JSON.stringify(def_prescription));
    this.props.setPrescription(defaultPrescription);

    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  closePreview() {

    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Drawer' }]

    }));
  }
  OnClick(callFrom) {
    if (this.state.data && !this.state.data.IsPrint && callFrom == "refill") {
      logAnalytics(
        this.props.doctorProfile.DoctorData._id,
        this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
        "edit_prescription"
      );
    }

    switch (callFrom) {
      case "left":
        this.handleBackButtonClick();
        break;

      case "right":
        multipleTapHandler.clearNavigator();
        this.onShare(this.webdata[0]);

        break;

      case "secondRight":
        multipleTapHandler.clearNavigator(),
          ToastAndroid.show("Implementation in progress", ToastAndroid.LONG);
        break;

      case "refill":
        multipleTapHandler.clearNavigator();
        if (this.state.type == "certificate") {
          this.closePreview();
        } else {
          this.setState({
            loading: true,
          });
          let data = this.state.data;
          data._id = data && !data.IsPrint ? data._id : "";
          let { templateData, patientvisit } = this.props;
          let { patientDetails } = this.props.patientvisit;
          let p_age = calculateAge(patientDetails.CommonDetails.DOB, false);
          let PatientDetails = {
            id: patientvisit.Commonid,
            FullName: patientDetails.CommonDetails.FullName,
            Age: p_age.value.toString() + " " + p_age.units,
            Height: patientDetails.CommonDetails.BodyDetails.Height,
            Weight: patientDetails.CommonDetails.BodyDetails.Weight,
            BMI: patientDetails.CommonDetails.BodyDetails.BMI,
            Mobile: patientDetails.Mobile,
            Gender: patientDetails.CommonDetails.Gender,
            ReferralDrrName: patientDetails.CommonDetails.Referredby,
            PatientId: this.props.patientvisit.patientId,
            EmailAddress: patientDetails.CommonDetails.EmailAddress,
            Address: patientDetails.CommonDetails.Address,
          };

          let clinics = [
            ...this.props.doctorProfile.DoctorData.ClinicAddresses,
          ];
          clinics.forEach((v) => {
            delete v.OperationHours;
          });
          let DoctorHeaderDetails = {
            Logo: this.props.doctorProfile.DoctorData.Logo,
            DoctorEmail: this.props.doctorProfile.DoctorData.DoctorEmail,
            DoctorName:
              this.props.doctorProfile.DoctorData.DoctorFName +
              " " +
              this.props.doctorProfile.DoctorData.DoctorLName,
            Specialist: this.props.doctorProfile.DoctorData.DisplaySpecializationCSV,
            Qualification:
              this.props.doctorProfile.DoctorData.DisplayQualificationCSV,
            MICRNo: this.props.doctorProfile.DoctorData.MICRNo,
            CouncilName: this.props.doctorProfile.DoctorData.CouncilName,
            Clinic: clinics,
            Signature: this.props.doctorProfile.DoctorData.Signature
              ? this.props.doctorProfile.DoctorData.Signature
              : "",
            DisplayLabel: this.props.doctorProfile.DoctorData.DisplayLabel,
            /* "DisplayPreferences": ["Chief Complaints",
               "Patient History / Family History",
               "On Examination / Findings",
               "Investigations",
               "Recommend Clinical Tests",
               "Diagnosis",
               "Notes",
               "Prescription",
               "Display Generic Name",
               "Advice",
               "Follow up",
               "Doctor Details",
               "Digital Image Signature"]*/
          };
          if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
            DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
            DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
          }
          let final_Data = {
            PatientDetails: PatientDetails,
            PaperSettings:
              templateData || templateData != {}
                ? templateData
                : {
                  Margin: ["10", "10", "10", "10"],
                  TemplateFontSize: "14",
                  papername: "A4",
                  papersize: ["210", "297"],
                  header: 1,
                  footer: 1,
                  body: 1,
                },
            DoctorHeaderDetails: DoctorHeaderDetails,
            Allergy: patientDetails.CommonDetails.Allergy,
            FamilyHistory: patientDetails.CommonDetails.FamilyHistory,
            Habits: [],
            Gpal: patientDetails.CommonDetails.Gpal,
            PatientHabits: patientDetails.CommonDetails.PatientHabits,
            PersonalHistory: patientDetails.CommonDetails.PersonalHistory,
            Type: data.Type,

            DisplayPreferences: [
              "Chief Complaints",
              "Patient History / Family History",
              "On Examination / Findings",
              "Investigations",
              "Recommend Clinical Tests",
              "Diagnosis",
              "Notes",
              "Prescription",
              "Display Generic Name",
              "Advice",
              "Follow up",
              "Doctor Details",
              "Digital Image Signature",
            ],
          };

          let offlinePrescrip_data = { ...offline_def_prescription, ...data };

          if (offlinePrescrip_data.FollowUpText && offlinePrescrip_data.FollowUpText != '' && this.state.data.IsPrint) {

            var day_forFollowup = this.getSunday(offlinePrescrip_data.FollowUpText);
            if (day_forFollowup != 'Sunday') {
              offlinePrescrip_data.FollowupDate = this.convertWeeksToDays(day_forFollowup, offlinePrescrip_data.FollowUpText);
            }
            else {
              offlinePrescrip_data.FollowupDate = null;
            }


          }

          offlinePrescrip_data.WhenEntered = new Date();
          let offlinePrescrip_data_1 = {
            ...offlinePrescrip_data,
            ...final_Data,
          };
          delete offlinePrescrip_data_1.Provider;
          if (data && !data.IsPrint) {
            this.props.setPrescription(offlinePrescrip_data_1);
            this.props.setPrintClickCount(1);

            let searchArray = [];
            let element = this.props.patientvisit.prescription.ChiefComplaints;
            for (let index = 0; index < element.length; index++) {
              searchArray.push(element[index].Name);
            }

            let prescriptionTest = JSON.parse(
              JSON.stringify(this.props.patientvisit.prescription)
            );
            if (
              prescriptionTest.Type == "Ophthalmologist" &&
              prescriptionTest["Ophthalmologist"]
            ) {
              let opthalData = JSON.parse(
                JSON.stringify(prescriptionTest["Ophthalmologist"])
              );

              this.props.setOpthalData({ selecteddata: opthalData });
            }

            if (searchArray.length > 0) {
              this.setSuggSugg("PrintPreview", {
                doctorId: this.props.doctorProfile.DoctorData._id,
                searchArray: searchArray,
              });
            } else {
              this.props.setSuggestionPatientData([]);
              this.props.navigation.navigate("PrescriptionPreviewHome", {
                refill: true,
              });

              this.setState({
                loading: false,
              });
            }
          } else {
            this.props.createRefill(offlinePrescrip_data_1).then((response) => {
              if (response.payload.data.status == 1) {
                this.setState({
                  loading: false,
                });
                offlinePrescrip_data_1.WhenEntered = response.payload.data.whenEntered ? response.payload.data.whenEntered : new Date().toISOString();
                offlinePrescrip_data_1._id = response.payload.data.rxId;
                this.props.setPrescription(offlinePrescrip_data_1);
                this.props.navigation.navigate("PrescriptionPreviewHome", {
                  refill: true,
                });
              } else {
                this.setState({
                  loading: false,
                });
              }
            });
          }
        }

        break;

      default:
        break;
    }
  }
  getSunday(data) {
    let moment = require('moment')
    let num = data.split(" ")
    let day = moment().add(parseInt(num), num[1]).format('dddd');
    let date = moment().add(parseInt(num), num[1]).toISOString();
    this.date = date
    return day
  }
  convertWeeksToDays(day, item) {

    var date = "";
    item = item.toLowerCase()
    let x = new Date();
    let arr = item.split(' ');
    if (item.indexOf('day') != -1) {

      date = new Date(x.setDate(x.getDate() + parseInt(arr[0])))

    } else if (item.indexOf('month') != -1) {

      date = moment().add(parseInt(item.split(" ")[0]), 'M');

    } else if (item.indexOf('week') != -1) {


      date = new Date(x.setDate(x.getDate() + (parseInt(arr[0]) * 7)))

    } else if (item.indexOf('year') != -1) {

      date = moment().add(parseInt(item.split(" ")[0]), 'y');

    } else {
      date = day;
    }
    return date;

  }
  //Share

  async onShare(data) {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      " " +
      this.props.doctorProfile.DoctorData.DoctorLName,
      "shared_rx"
    );
    this.setState({ editShow: !this.state.editShow });

    let fileNameAdd = this.props.patientvisit.patientVisitId + "_" + new Date().getTime();
    let options = {
      html: data,
      fileName: "Rx_" + fileNameAdd,
      base64: true,
      // backgroundColor: '#FFFFF',
      // paddingRight: parseInt(settings[1]) * 1.35, //Right
      // paddingLeft: parseInt(settings[0]) * 2, //Top
      // paddingTop: parseInt(settings[3]) * 1.35,//Left,
      // paddingBottom: parseInt(settings[2]) * 1.35, //Bottom
    };
    let file = await RNHTMLtoPDF.convert(options);
    if (file && file.filePath && file.filePath != "") {
      Share.open({ url: "file://" + file.filePath })
        .then((res) => { })
        .catch((ex) => { });
    } else {
      Alert.alert("File not found");
    }
  }
  //Pritnts

  async printHTML(data, pSets) {
    if (!data) {
      Alert.alert("Prescrip", "Print functionality is in progress");
      return;
    }
    try {
      if (Platform.OS === "android") {
        await RNPrint.print({ html: data });
      } else {
        this.printHTMLios(data, pSets);
      }
    } catch (error) {
      this.handleerror(error);
    }
  }

  async printHTMLios(data, pSets) {
    try {
      let settings = pSets.Margin;

      this.setState({ printing: true });
      let dname = this.state.DoctorFName + this.state.DoctorLName;
      //top ,right,bottom,left
      // dname = "Dr" + dname + "_" + this.getDate(this.state.PrintPreviewData.WhenEntered);
      let options = {
        html: data,
        fileName: "Prescrip_" + dname,
        base64: true,
        // backgroundColor: '#FFFFF',
        // paddingRight: parseInt(settings[1]) * 1.35, //Right
        // paddingLeft: parseInt(settings[0]) * 2, //Top
        // paddingTop: parseInt(settings[3]) * 1.35,//Left,
        // paddingBottom: parseInt(settings[2]) * 1.35, //Bottom
      };

      let file = await RNHTMLtoPDF.convert(options);

      if (this.filepath == "") {
        if (file && file.filePath && file.filePath != "") {
          this.setState({ printing: false });
          await RNPrint.print({ filePath: file.filePath });
          //   this.props.updatePrintStatus(this.state.PrintPreviewData.patientVisitId).then((data) => {

          //   });
        } else {
          Alert.alert("File not found");
        }
      } else {
      }
    } catch (error) {
      this.handleerror(error);
    }
  }
  _onMessage(message) {
    //headerType - TemplatebodyType - HeaderType - print
    this.webdata.push(message.nativeEvent.data);
    sleep(1000).then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  //set sugg data

  setSuggSugg(callFrom, patient_details) {
    this.props.get_suggestions(patient_details).then(({ payload, error }) => {
      var data = payload.data;

      if (error) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate("PrescriptionPreviewHome", {
          refill: true,
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } else if (data.status == 0) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate("PrescriptionPreviewHome", {
          refill: true,
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } else if (data.status == 1) {
        this.props.setSuggestionPatientData(data.suggesstion);

        this.props.navigation.navigate("PrescriptionPreviewHome", {
          refill: true,
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      }
    });
  }

  getVisitDetails() {
    this.setState({
      loading: true,
    });
    // https://stagingtemplate.prescrip.in/template/report.html?HeaderType=1&TemplatebodyType=3&FooterType=1&print=1&patientid=5fa535d7583cfa13c45ba5df
    this.props
      .getVisitPrescription(this.props.patientvisit.patientVisitId)
      .then((response) => {
        let data = response.payload.data;
        data.DoctorHeaderDetails.Specialist = this.props.doctorProfile.DoctorData.DisplaySpecializationCSV;
        this.setState({
          data: data,
        });
        if (data.Type == "Ophthalmologist" && data["Ophthalmologist"]) {
          let opthalData = JSON.parse(JSON.stringify(data["Ophthalmologist"]));
          data[data.Type] = opthalData;
          this.props.setOpthalData({ selecteddata: opthalData });
        }
        this.props.setPrescription(data);

        let issueDate = "";
        let url = "";
        if (data._id && data.Type == "Ophthalmologist") {
          issueDate = moment(data.WhenEntered).format("DD-MM-YYYY");
          let { PaperSettings, _id, CertificateType } = data;
          url =
            (isStagging ? staging.printTemplate : prod.printTemplate) +
            "/template/specialization/Ophthalmologist.html?" +
            "?HeaderType=" +
            data.PaperSettings.header +
            "&TemplatebodyType=" +
            data.PaperSettings.body +
            "&FooterType=" +
            data.PaperSettings.footer +
            "&print=1" +
            "&shownavs=0" +
            "&patientid=" +
            this.props.patientvisit.patientVisitId;

          this.setState({
            issueDate: issueDate,
            url: url,
            //url : "https://stagingtemplate.prescrip.in/template/report.html?HeaderType=1&TemplatebodyType=1&FooterType=1&print=1&patientid=5fc638ad7c26c70bbc13beeb&guid=F81BEDB1-CF7E-5CC2-D035-4F04DEF30D81",//url,
            PaperSettings: PaperSettings,
            type: data.Type,
          });
        } else if (data._id && data.Type != "certificate") {
          issueDate = moment(data.WhenEntered).format("DD-MM-YYYY");
          let { PaperSettings, _id, CertificateType } = data;
          url =
            (isStagging ? staging.printTemplate : prod.printTemplate) +
            "/template/report.html" +
            "?HeaderType=" +
            data.PaperSettings.header +
            "&TemplatebodyType=" +
            data.PaperSettings.body +
            "&FooterType=" +
            data.PaperSettings.footer +
            "&print=1" +
            "&shownavs=0" +
            "&patientid=" +
            this.props.patientvisit.patientVisitId;

          this.setState({
            issueDate: issueDate,
            url: url,
            //url : "https://stagingtemplate.prescrip.in/template/report.html?HeaderType=1&TemplatebodyType=1&FooterType=1&print=1&patientid=5fc638ad7c26c70bbc13beeb&guid=F81BEDB1-CF7E-5CC2-D035-4F04DEF30D81",//url,
            PaperSettings: PaperSettings,
            type: data.Type,
          });
        } else if (data._id && data.Type == "certificate") {
          issueDate = moment(data.WhenEntered).format("DD-MM-YYYY");
          let domain = isStagging ? staging.printTemplate : prod.printTemplate;

          let { PaperSettings, _id, CertificateType } = data;

          let type = CertificateType.replace(/\s/g, "") + ".html?";
          url =
            domain +
            "template/Certificates/" +
            type +
            "HeaderType=" +
            PaperSettings.header +
            "&TemplatebodyType=" +
            PaperSettings.body +
            "&FooterType=" +
            PaperSettings.footer +
            "&print=1" +
            "&patientid=" +
            _id;

          this.setState({
            issueDate: issueDate,
            url: url,
            PaperSettings: PaperSettings,
            type: data.Type,
          });
        }
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              position: "absolute",
            }}
          >
            <ActivityIndicator size={"large"} color="#fff" />
          </View>
        ) : null}

        {/* for HEADER */}

        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={"#ffffff"}
          title={"ISSUE DATE " + this.state.issueDate}
          description={
            this.props.patientvisit.patientDetails.CommonDetails.FullName +
            "'s " +
            (this.state.type == "certificate" ? "Certificate" : "Prescription")
          }
          titleColor={"#919191"}
          descriptionColor={"#0b69d8"}
          leftImage={Images.ic_black_back}
          rightImage={ic_share_prescrip}
          secondRightImage={ic_Quick_Rx_Heart}
          isShowTitle={true}
          OnClick={(callFrom) => this.OnClick(callFrom)}
        />

        <View style={{ flex: 1, marginBottom: 50, backgroundColor: "#fffff", width: Dimensions.get('window').width }}>
          <WebView
            androidLayerType="software"
            source={{ uri: this.state.url ? this.state.url  : ''   }}
            
            // injectedJavaScript={INJECTEDJAVASCRIPT}
            scalesPageToFit={true}
            onLoad={() => {
              this.webdata = [];
            }}
            onMessage={this._onMessage.bind(this)}
            style={{ justifyContent: "center", flex: 1, zIndex: 1 , alignItems: "center" }}
          //onMessage={this._onMessage.bind(this)}
          />
        </View>

        {/* for bottom button*/}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexDirection: "row", width: Dimensions.get('window').width
          }}
        >
          {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
            this.props.doctorProfile.DoctorData.RoleId == 3 ?
            <View style={{ flex: 1, backgroundColor: "#ffffff", width: Dimensions.get('window').width }}>
              <TouchableOpacity onPress={() => this.OnClick("refill")}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderWidth: 2,
                    borderColor: "#07cef2",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      color: "#07cef2",
                      fontFamily: "NotoSans-Bold",
                      marginEnd: 5,
                    }}
                  >
                    {this.state.type == "certificate"
                      ? "FINISH"
                      : this.state.data && !this.state.data.IsPrint
                        ? "EDIT"
                        : "REFILL"}
                  </Text>
                  {this.props.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null}
                </View>
              </TouchableOpacity>
            </View> : null}

          <View style={{ flex: 1, width: Dimensions.get('window').width, }}>
            <TouchableOpacity
              onPress={() => {
                // this.onShare(this.webdata[0]);
                this.printHTML(this.webdata[0], this.state.PaperSettings);
              }}
            >
              <LinearGradient
                colors={["#1b7cdb", "#07cef2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.8]}
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
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
                  {"PRINT"}
                </Text>
                {this.props.loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  patientProfile: state.patientProfile,
  templateData: state.doctorProfile.DoctorData.PaperSettings,
});
const mapDispatchToProps = (dispatch) => ({
  get_chief_suggestions: (patient_Id, doctorId, patientId) =>
    dispatch(get_chief_suggestions(patient_Id, doctorId, patientId)),
  getVisitPrescription: (patientvisits) =>
    dispatch(getVisitPrescription(patientvisits)),
  patientvisits: (prescriptionObj) => dispatch(patientvisits(prescriptionObj)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  createRefill: (data) => dispatch(createRefill(data)),
  setOpthalData: (data) => dispatch(setOpthalData(data)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),

  get_suggestions: (data) => dispatch(get_suggestions(data)),
  setSuggestionPatientData: (prescription) =>
    dispatch(setSuggestionPatientData(prescription)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(PrescripWebView));
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
