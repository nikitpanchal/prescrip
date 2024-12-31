import React from "react";
import {
  ActivityIndicator,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,Dimensions 
} from "react-native";
 
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from "../../constants/font";
import styles from "./styles";
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
const uncheckicon = require("../../../assets/Cutouts/Icon-checkbox-non-active.png");
const checkicon = require("../../../assets/certificates/save-prescription-settings.png");
import { ic_blue_calander } from "../../constants/images";
import { calculateAge } from "../../commonmethods/common";
import multipleTapHandler from "../MultiTapHandle/index";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
var fields = [];
var age = "";
var DatePickerType = "",
  TimePickerType = "";
export default class CertificateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      selectedDate: "",
      selectedTime: "",
      action: 0,
      loading: false,
      CertificateData: {},
      errors: {},
      keyboardOffset: 0,
      text: "",
    };
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "CertificateInput",
      screen_class: "CertificateForm",
    });
    for (let field of fields) {
      if (field.Name == "CheckBox") {
        this.props.setPickerValue(field.Text, "1");
      } else {
        this.props.setPickerValue(field.Text, "");
      }
    }
  }
  //Methods

  getLableValue(Text) {
    switch (Text) {
      case "Hospital":
        return "Hospital";
      case "Doctor":
        return "Doctor";
      case "Condition":
        return "Condition";
      case "Remark":
        return "Remarks";
      case "Suggestions":
        return "Suggestions";
      case "Date":
        return "Date";
      case "FollowupDate":
        return "Follow Up Date";
      case "ExamDate":
        return "Exam Date";
      case "TreatmentDate":
        return "Treatment Date";
      case "DOA":
        return "Date of Addmission";
      case "DOS":
        return "Date of Surgery";
      case "Class":
        return "Class";
      case "Surgery":
        return "Surgery";
      case "Anaesthesia":
        return "Anaesthesia";
      case "Anaesthesologist":
        return "Anaesthesologist";
      case "Comment":
        return "Comment";
      case "Nmb":
        return "NMB Form";
      case "Consent":
        return "Consent Form";
      case "Physician":
        return "Physician";
      case "Parts":
        return "Shave Parts before Surgery";
      case "SendToOT":
        return "Send to OT on call";
      case "Preoperative_order":
        return "Pre Operation Orders";
      case "SinceDate":
        return "Since Date";
      case "TillDate":
        return "Till Date";
      case "Title":
        return "Title";
      case "Procedure":
        return "Procedure";
      case "Treatment":
        return "Treatment";
      case "Amount":
        return "Amount";
      case "TimePeriod":
        return "Time Period";
      case "FromDate":
        return "From Date";
      case "issueDate":
        return "Date of Issue";
      case "startText":
        return "Enter Starting text";
      case "showName":
        return "Show Name";
      case "showAge":
        return "Show Age";
      case "showGender":
        return "Show Gender";
      case "firstPara":
        return "First Paragraph";
      case "secondPara":
        return "Second Paragraph";
      case "thirdPara":
        return "Third Paragraph";
      case "closingText":
        return "Closing Text";
      case "Remarks":
        return "Remarks";
      default:
        return Text;
    }
  }

  //Create Individual Components
  getComponent(type) {
    fields.push({ Text: type.Label, Name: type.Name });
    switch (type.Name) {
      case "TextArea":
        return (
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Text style={{ color: "#8b8b8b", fontSize: 14 }}>
              {this.getLableValue(type.Label)}
            </Text>

            <TextInput
              style={styles.inputArea}
              value={this.getTextAreaValue(type.Label)}
              onChangeText={(text) => {
                this.setTextAreaValue(type.Label, text);
              }}
              multiline={true}
              keyboardType="ascii-capable"
              autoCorrect={false}
              numberOfLines={5}
            />
          </View>
        );
      case "TextInput":
        return (
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Text style={{ color: "#8b8b8b", fontSize: 14 }}>
              {this.getLableValue(type.Label)}
            </Text>

            <TextInput
              style={styles.inputText}
              value={this.getTextAreaValue(type.Label)}
              onChangeText={(text) => {
                this.setTextAreaValue(type.Label, text);
              }}
              multiline={false}
              keyboardType="ascii-capable"
              autoCorrect={false}
            />
          </View>
        );
      case "CheckBox":
        return (
          <TouchableOpacity
            onPress={() => {
              this.toggleCheckBox(type);
            }}
            style={{
              borderBottomColor: "#ebebeb",
              borderBottomWidth: 1,
              flexDirection: "row",
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <View
              style={{ justifyContent: "center", alignItems: "flex-start" }}
            >
              {/* <CheckBox selected={false} style={{borderColor:'grey'}}/> */}
              <Image
                source={type.isChecked ? checkicon : uncheckicon}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View
              style={{ justifyContent: "center", alignItems: "flex-start" }}
            >
              <Text style={{ paddingLeft: 10, color: "#3e3e3e" }}>
                {this.getLableValue(type.Label)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      case "DatePicker":
        //Date
        return (
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
            }}
          >
            <Text style={{ color: "#8b8b8b", fontSize: 14 }}>
              Select {this.getLableValue(type.Label)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setDatePickerType(type.Label);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "#eee",
                  borderBottomWidth: 2,
                  width: "100%",
                  paddingRight: 5,
                }}
              >
                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                  <Text
                    style={{
                      color: this.props.certificates.InputFormData[type.Label]
                        ? "#000000"
                        : "#c0c0c0",
                    }}
                  >
                    {this.setDateValue(type.Label)}
                  </Text>
                </View>
                <Image
                  style={{
                    resizeMode: "contain",
                    alignSelf: "center",
                    height: 20,
                    width: 20,
                    borderColor: "#eee",
                    borderRightWidth: 1,
                  }}
                  source={ic_blue_calander}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      case "Picker":
        return (
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
            }}
          >
            <Text style={{ color: "#8b8b8b", fontSize: 14 }}>
              Select {this.getLableValue(type.Label)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("ItemPicker", {
                  component: type,
                });
                this.props.setComponentData(type);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomColor: "#eee",
                  borderBottomWidth: 2,
                  width: "100%",
                  paddingRight: 5,
                }}
              >
                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                  <Text
                    style={{
                      color: this.props.certificates.InputFormData[type.Label]
                        ? "#000000"
                        : "#c0c0c0",
                    }}
                  >
                    {this.getPickerValue(type.Label)}
                  </Text>
                </View>

                <Image
                  style={{
                    resizeMode: "contain",
                    alignSelf: "center",
                    width: 15,
                    borderColor: "#eee",
                    borderRightWidth: 1,
                  }}
                  source={require("../../../assets/certificates/dropdown-collapsed.png")}
                  name="icon-dropdown.png"
                />
              </View>
            </TouchableOpacity>

            {this.state.errors[type.Label] ? (
              <Text style={({ fontSize: "10" }, { color: "red" })}>
                Please enter {this.getLableValue(type.Label)}
              </Text>
            ) : null}
          </View>
        );

      default:
        return (
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Text style={{ color: "#b2b2b2", fontSize: 14 }}>
              {this.getLableValue(type.Label)}
            </Text>

            <TextInput
              style={styles.inputText}
              value={this.getTextAreaValue(type.Label)}
              onChangeText={(text) => {
                this.setTextAreaValue(type.Label, text);
              }}
              multiline={false}
              keyboardType="ascii-capable"
              autoCorrect={false}
            />

            {this.state.errors[type.Label] ? (
              <Text style={({ fontSize: "10" }, { color: "red" })}>
                Please enter {this.getLableValue(type.Label)}
              </Text>
            ) : null}
          </View>
        );
    }
  }
  //Create Component List
  getComponentFromList() {
    let sequence = [];
    sequence =
      this.props.certificates.selectedCertificate.Templates[0].componentid;
    let Components = this.props.certificates.selectedCertificate.Components;
    let viewsArr = sequence.map((seq) => {
      let comp = Components.find((comp) => {
        if (comp.comp_id == seq) {
          return comp;
        }
      });
      let view = this.getComponent(comp);
      return view;
    });

    return viewsArr;
  }
  //SETTERS & GETTERS
  setTextAreaValue = (type, value) => {
    this.props.setPickerValue(type, value);
    let val = this.state.CertificateData;
    val[type] = value;
    this.setState({
      CertificateData: val,
    });
  };
  getTextAreaValue = (type) => {
    return this.state.CertificateData[type]
      ? this.state.CertificateData[type]
      : "";
  };
  toggleCheckBox(type) {
    type.isChecked = !type.isChecked;
    let val = type.isChecked ? "1" : "0";
    this.props.setPickerValue(type.Label, val);
    this.props.setComponentData(type);
  }
  //Date Pickers
  setDatePickerType(type) {
    DatePickerType = type;
    this.showDatePicker;
    this.setState({ isDatePickerVisible: true });
  }
  cancelDatePicker() {
    this.setState({
      isDatePickerVisible: false,
    });
  }
  setDateValue = (type) => {
    return this.state.CertificateData[type]
      ? moment(this.state.CertificateData[type]).format("DD-MM-YYYY")
      : "Select Date";
  };
  setDate = (date) => {
    this.cancelDatePicker();

    this.props.setPickerValue(DatePickerType, new Date(date).toISOString());
    let val = this.state.CertificateData;
    val[DatePickerType] = new Date(date).toISOString();
    this.setState({
      CertificateData: val,
    });
  };
  getPickerValue = (type) => {
    let val = this.state.CertificateData;
    val[type] = this.props.certificates[type];

    return this.props.certificates.InputFormData[type]
      ? this.props.certificates.InputFormData[type].toString()
      : "Select " + this.getLableValue(type);
  };
  createCertificate(header, body, footer) {
    this.setState({
      loading: true,
    });
    let paper = this.props.certificates.paperSetting;
    let data = {
      Margin: ["10", "10", "10", "10"],
      TemplateFontSize: "16",
      papername: "A4",
      papersize: ["210", "297"],
      header: header,
      footer: footer,
      body: body,
    };
    if (paper == null) {
      this.props.setPaperSettings(data);
    } else {
      data = {
        Margin: ["10", "10", "10", "10"],
        TemplateFontSize: "16",
        papername: "A4",
        papersize: ["210", "297"],
        header: paper.header,
        footer: paper.footer,
        body: paper.body,
      };
    }

    //Call API

    let patientdetails = this.props.patientvisit.patientDetails;
    let age = calculateAge(patientdetails.CommonDetails.DOB, false);
    let { Height, Weight, HeightUnit, WeightUnit, BMI } =
      patientdetails.CommonDetails.BodyDetails;
    let PatientDetails = {
      FullName: patientdetails.CommonDetails.FullName,
      Age: age.value + " " + age.units,
      Height: Height + HeightUnit,
      Weight: Weight + WeightUnit,
      BMI: BMI,
      Mobile: patientdetails.Mobile,
      Gender: patientdetails.CommonDetails.Gender,
      ReferralDrrName: patientdetails.CommonDetails.Referredby,
      id: patientdetails.CommonDetails.id,
      EmailAddress: patientdetails.CommonDetails.EmailAddress,
      Address: patientdetails.CommonDetails.Address,
    };
    let certificate = {
      _id: this.props.certificates.id,
      PatientID: patientdetails._id,
      PatientCID: patientdetails.CommonDetails.id,
      DoctorID: this.props.doctorProfile.DoctorData._id,
      Favourite: "",
      IsFavourite: 0,
      WhenFavourite: null,
      Type: "certificate",
      PatientDetails: PatientDetails,
      CertificateType: this.props.certificates.selectedCertificate.name,
      CertificateData: this.props.certificates.InputFormData,
      PaperSettings: this.props.certificates.paperSetting
        ? this.props.certificates.paperSetting
        : data,
    };
    Keyboard.dismiss();
    if (certificate.CertificateType == "Advance Admission Certificate") {
      certificate.CertificateData["Diagnosis"] =
        certificate.CertificateData["Condition"];
    }
    this.props.createCertificate(certificate).then((response) => {
      if (response.payload.data.status == 1) {
        this.setState({
          loading: false,
        });
        this.props.navigation.navigate("CertificatePrintPreview");
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }
  //Ends
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff", width :Dimensions.get('window').width }}>
        {/*Date Modal*/}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.setDate}
          date={new Date()}
          onCancel={this.cancelDatePicker.bind(this)}
        />
        {/*Ends*/}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={65}
          behavior={Platform.select({ android: undefined, ios: "padding" })}
          enabled={Platform.OS == "android" ? false : true}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              keyboardDismissMode={"on-drag"}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ paddingBottom: 65 }}
            >
              <View style={{ flex: 1 }}>{this.getComponentFromList()}</View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        {/*NEXT Button*/}
        <TouchableOpacity
          disabled={this.state.loading}
          onPress={() => {
            multipleTapHandler.multitap(
              () => this.createCertificate(1, 1, 1),
              "CertificatePrintPreview"
            );
          }}
        >
          <LinearGradient
            colors={["#1b7cdb", "#07cef2"]}
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
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
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
                NEXT
              </Text>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*** Ends */}
      </View>
    );
  }
}
