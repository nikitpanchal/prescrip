import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  StatusBar,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { Container } from "native-base";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import LinearGradient from "react-native-linear-gradient";
import Images from "../../Theme/Images";

import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import { setTooltipStatus } from "../../actions/tooltip";

import { withDb } from "../../DatabaseContext/withDatabase";
import {
  ic_save_button,
  ic_close_button,
  ic_Visual_Acuity,
} from "../../constants/images";
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
} from "../../actions/attachment";
import { get_suggestions } from "../../actions";

import {
  setSuggestionData,
  create_update_prescription,
} from "../../actions/patientVisit";

import {
  setPatientVisitKeyData,
  setDiagnosis,
  setAdditionalAssesstment,
  setPrescription,
} from "../../actions/patientVisit";
import HeaderTypeOne from "../../components/Header/HeaderTypeOne";
import CButton from "../../components/CommonComponents/CButton";
import CFlatListItem from "../../components/CommonComponents/CFlatListItem";
import {
  ic_Diagnosis,
  ic_Findings,
  ic_Investigations,
  SuggestLab_Pink_btn,
  ic_take_notes_outline_icon,
} from "../../constants/images";
import _ from "lodash";
import { getScreenNameAnalytics, logAnalytics } from "../../commonmethods/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
let timer = null;

class AdditionalAssessmentContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",

      loadingBack: false,

      loading: false,
      data: [
        {
          name: "Findings",
          imagePath: ic_Findings,
          description: "",
        },
        {
          name: "Investigation",
          imagePath: ic_Investigations,
          description: "",
        },
        {
          name: "Diagnosis",
          imagePath: ic_Diagnosis,
          description: "",
        },
        {
          name: "Visual Acuity",
          imagePath: ic_Visual_Acuity,
          description: "",
        },
      ],
    };
  }

  nextButton(type) {
    let {
      Srno,
      displayname,
      defaultlabel,
      subtext,
      patientname,
      mdata,
      ChiefComplaints,
      Findings,
      Investigation,
      Diagnosis,
      navigation,
      RecommendedLabTest,
      Advice,
      setPatientVisitKeyData,
      setAttachmentData,
      setAdditionalAssesstment,
      patientvisit,
      suggesticon,
      suggestname,
      colorCode,
    } = this.props;
    let nextscreenname = "";
    switch (type.name) {
      case "ChiefComplaints":
        //this.createChiefComplienentObj(element);      //Uncomment after internet connection opens
        break;
      case "Findings":
        type = "Findings";
        nextscreenname = "FindingsContainer";
        displayname = "Findings";
        defaultlabel = "Suggestions";
        subtext = "what are " + patientname + "'s " + displayname + "? ";
        mdata = Findings || [];
        Srno = 9;
        colorCode = "#0ab2b2";

        break;
      case "Investigation":
        type = "Investigation";
        nextscreenname = "InvestigationContainer";
        displayname = "Investigation";
        defaultlabel = "Suggested";
        subtext = "what are " + patientname + " " + displayname + "? ";
        mdata = Investigation || [];
        Srno = 10;
        colorCode = "#ab47bc";

        break;
      case "Diagnosis":
        type = "Diagnosis";
        nextscreenname = "DiagnosisContainer";
        displayname = "Diagnosis";
        defaultlabel = "Suggested";
        subtext = "what are " + patientname + " " + displayname + "? ";
        mdata = Diagnosis || [];
        Srno = 12;
        colorCode = "#ff7043";

        break;
      case "RecommendedLabTest":
        type = "RecommendedLabTest";
        displayname = "Lab Test";
        nextscreenname = "RecommendedLabTestContainer";
        defaultlabel = "Suggested";
        mdata = RecommendedLabTest || [];
        Srno = 11;
        subtext = "RECOMMEND LAB TESTS";
        suggesticon = SuggestLab_Pink_btn;
        suggestname = "Suggest Laboratory";
        colorCode = "#0aadad";

        break;
      case "Advice":
        type = "Advice";
        displayname = "Advice";
        nextscreenname = "AdviceContainer";
        defaultlabel = "Suggested";
        subtext = "ANY ADVICE FOR " + patientname + "?";
        mdata = Advice || [];
        Srno = 13;
        suggesticon = SuggestLab_Pink_btn;
        suggestname = "Refer to Specialist";
        colorCode = "#0aadad";

        break;
      case "Visual Acuity":
        type = "Visual Acuity";
        displayname = "Visual Acuity";
        nextscreenname = "OpthalHome";
        //multipleTapHandler.multitap(() => this.props.navigation.navigate('OpthalHome'), 'OpthalHome');
        //alert("Hi");
        break;
      default:
        type = "ChiefComplaints";
        displayname = "Complaints";
        nextscreenname = "InvestigationContainer";
        mdata = ChiefComplaints || [];
        Srno = 8;
        defaultlabel = "Past Complaints";
        subtext = "what are " + patientname + " " + displayname + "? ";
        colorCode = "#0aadad";
    }

    setPatientVisitKeyData({ [type]: mdata });
    setAttachmentData({
      type,
      DataType: "",
      Graph: "",
      Unit: "",
      Upload: [],
      Name: "",
      Value: "",
      mdata,
      Srno,
      subtext,
      displayname,
      colorCode,
      defaultlabel,
      suggestname,
      suggesticon,
    });

    multipleTapHandler.multitap(
      () => this.props.navigation.navigate(nextscreenname),
      nextscreenname
    );

    // navigation.navigate(nextscreenname)
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    clearTimeout(timer);
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }

  // Api call
  addPatientData(data, patientData) {
    try {
    } catch (err) { }
  }

  closeScreen() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    timer = setTimeout(() => {
      this.setState({
        showTooltip: true,
      });
    }, 1000);

    //         if(this.props.opthal.selecteddata){
    //             try{
    // this.selecteddata=_.isEmpty(this.props.opthal.selecteddata.lefteye) || _.isEmpty(this.props.opthal.selecteddata.righteye) || _.isEmpty(this.props.opthal.selecteddata.more)?true:false
    //             }
    //             catch(error){
    // this.selecteddata=false;
    //             }
    //         }
    //         else{
    //             this.selecteddata=false;
    //         }
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "AdditionalAssessment",
      screen_class: "AdditionalAssessmentContainer",
    });
    //this.get_suggestions();
    // this.setData();
    //  this.setState({ errorField: false })
  }

  setData(item) {
    return this.props.patientvisit.prescription[item.name]
      .map((i) => {
        if (typeof i === "string") {
          return i;
        } else {
          return i.Name;
        }
      })
      .join(", ");
  }

  getSearchArray() {
    const searchArray = [];
    for (
      let index = 0;
      index < this.props.patientvisit.prescription.ChiefComplaints.length;
      index++
    ) {
      const element =
        this.props.patientvisit.prescription.ChiefComplaints[index].Name;
      searchArray.push(element);
    }
    return searchArray;
  }

  //get_suggestions API @Sourabh
  get_suggestions() {
    //Check search array here
    alert(JSON.stringify(this.getSearchArray()));
    // Use test doctor ID and search array for proper testing
    //"5ebbc887651369101c612672"  , ["Loss of Appetite "]
    this.props
      .get_suggestions(
        this.props.doctorProfile.DoctorData._id,
        this.getSearchArray()
      )
      .then((payload) => {
        var data = payload.payload.data;
        if (data.status == 0) {
        } else if (data.status == 1) {
          this.props.setSuggestionData(data.suggesstion);
        }
      });
  }

  onPress(callFrom) {
    if (callFrom !== "quick") {
      this.setState({
        loading: true,
      });
    }
    let {
      navigation,
      RecommendedLabTest,
      Advice,
      setAdditionalAssesstment,
      patientvisit,
      PrescriptionList,
      prescription,
      create_update_prescription,
    } = this.props;

    setTimeout(() => {
      if (callFrom !== "quick") {
        this.setState({
          loading: true,
        });
      }
    }, 2000);

    let Investigation = [];
    let Findings = [];
    let Dosages = [];
    let ChiefComplaints = [];

    prescription.PrescriptionList.forEach((element) => {
      Dosages.push([element.DosageForms, element.BrandName]);
    });

    delete prescription.Provider;
    //prescription.WhenEntered = new Date().toISOString();
    prescription.Investigation.forEach((element) => {
      Investigation.push(element.Name);
    });
    prescription.Findings.forEach((element) => {
      Findings.push(element.Name);
    });

    prescription.ChiefComplaints.forEach((element) => {
      ChiefComplaints.push(element.Name);
    });
    if (prescription.Type == "Ophthalmologist") {
      prescription[prescription.Type] = this.props.opthal.selecteddata;
    }
    if (prescription["Visual Acuity"]) {
      delete prescription["Visual Acuity"];
    }
    if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
      prescription.DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
      prescription.DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
    }
    let rxData = {
      Diagnosis: prescription.Diagnosis,
      Findings: Findings,
      Investigation: Investigation,
      LabTest: prescription.RecommendedLabTest,
      Dose: Dosages,
    };
    /*    lefteye:{}
        more:{}
        righteye:{spectacle_prescription: {…}}
*/
    if (
      prescription.Diagnosis.length == 0 &&
      Findings.length == 0 &&
      Investigation.length == 0 &&
      ChiefComplaints.length == 0 &&
      callFrom == "quick"
    ) {
      if (prescription.Type == "Ophthalmologist") {
        if (
          Object.keys(this.props.opthal.selecteddata.lefteye).length === 0 &&
          this.props.opthal.selecteddata.lefteye.constructor === Object &&
          Object.keys(this.props.opthal.selecteddata.righteye).length === 0 &&
          this.props.opthal.selecteddata.righteye.constructor === Object &&
          Object.keys(this.props.opthal.selecteddata.more).length === 0 &&
          this.props.opthal.selecteddata.more.constructor === Object
        ) {
          Alert.alert(
            "Prescrip",
            "Please Select Chief Complaints Or Additional Assesment"
          );
          return;
        }
      } else {
        Alert.alert(
          "Prescrip",
          "Please Select Chief Complaints Or Additional Assesment"
        );
        return;
      }
    }

    const sugg_data = {
      step: 1,
      prescriptionObject: prescription,
      rxData: rxData,
      searchArray: ChiefComplaints,
    };

    create_update_prescription(sugg_data).then(({ payload, error }) => {
      if (error) {
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
          //  description: "Some error occurred."
        });
        setTimeout(() => {
          this.setState({
            showToast: false,
            loading: false,
            loadingBack: false,
          });
        }, 2000);
      } else {
        if (payload.data.status == 1) {
          let prescriptionFinal = prescription;
          prescriptionFinal.WhenEntered = payload.data.whenEntered ? payload.data.whenEntered : new Date().toISOString();
          prescriptionFinal._id = payload.data.prescriptionId;
          //prescriptionFinal.url=payload.data.url;

          this.props.setPrescription(prescriptionFinal);

          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 2000);

          if (callFrom == "quick") {
            multipleTapHandler.clearNavigator(),
              this.props.navigation.navigate("PatientVisitHistoryContainer");
            logAnalytics(
              this.props.doctorProfile.DoctorData._id,
              this.props.doctorProfile.DoctorData.DoctorFName +
              " " +
              this.props.doctorProfile.DoctorData.DoctorLName,
              "saved_draft_assesment"
            );
            AsyncStorage.getItem("registered_doctor").then((registered_doctor) => {
              if (registered_doctor) {

                logAnalytics(
                  this.props.doctorProfile.DoctorData._id,
                  this.props.doctorProfile.DoctorData.DoctorFName +
                  " " +
                  this.props.doctorProfile.DoctorData.DoctorLName,
                  "registered_doctor_saved_draft_assesment"
                );


              }
            });
          } else {
            this.props.navigation.push("PrintPreview");
            logAnalytics(
              this.props.doctorProfile.DoctorData._id,
              this.props.doctorProfile.DoctorData.DoctorFName +
              " " +
              this.props.doctorProfile.DoctorData.DoctorLName,
              "next_assesment"
            );
            AsyncStorage.getItem("registered_doctor").then((registered_doctor) => {
              if (registered_doctor) {

                logAnalytics(
                  this.props.doctorProfile.DoctorData._id,
                  this.props.doctorProfile.DoctorData.DoctorFName +
                  " " +
                  this.props.doctorProfile.DoctorData.DoctorLName,
                  "registered_doctor_next_assesment"
                );


              }
            });
          }
        }
      }
      //  navigation.push('PrintPreview')
    });
  }

  notesNavigate() {
    this.props.navigation.push("PatientNotes", {
      previous_screen: "AdditionalAssessment",
    });
  }

  render() {
    let { data } = this.state;
    let { selecteddata } = this.props.opthal;
    let { statusBarHeight } = this.props.databaseContext;
    let { prescription } = this.props.patientvisit;
    return (
      <View contentContainerStyle={{ flex: 1 }} 
        style={{
          flex: 1, height:  Dimensions.get('window').height, width: Dimensions.get('window').width,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <HeaderTypeOne
          navigation={this.props.navigation}
          label={"Additional Assessments"}
          subtext={"MORE INFORMATION"}
          NotesTooltip={this.props.NotesTooltip}
          showTooltip={this.state.showTooltip}
          tooltipClck={() =>
            this.props.setTooltipStatus({ ["NotesTooltip"]: false })
          }
          rightImage={ic_take_notes_outline_icon}
          rightImageClick={() => this.notesNavigate()}
        />
        <View
          style={{  height:  Dimensions.get('window').height, width: Dimensions.get('window').width,flex: 0.9, marginBottom: 5, justifyContent: "flex-start" }}
        >
          <View>
            <FlatList
              scrollEnabled={false}
              data={data.slice(0, 3)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flat}
              // ListHeaderComponent={}
              renderItem={({ item }) => (
                <CFlatListItem
                  {...this.props}
                  style={[styles.cflatlistitem]}
                  imagePath={item.imagePath}
                  label={item.name}
                  onPress={this.nextButton.bind(this, item)}
                  extracomponent={
                    prescription[item.name] &&
                      prescription[item.name].length > 0 ? (
                      <Text style={{ fontSize: 14, color: "#737373" }}>
                        {this.setData(item)}
                      </Text>
                    ) : null
                  }
                />
              )}
              keyExtractor={(item, index) => {
                "additionalrowitem" + index.toString();
              }}
              extraData={data}
            />

            {prescription.Type == "Ophthalmologist" ? (
              <View>
                <View
                  style={{
                    height: 0.5,
                    width: "100%",
                    marginBottom: 15,
                    backgroundColor: "#dcdcdc",
                  }}
                />
                <CFlatListItem
                  {...this.props}
                  style={[
                    styles.cflatlistitem,
                    { marginEnd: 15, marginStart: 15 },
                  ]}
                  imagePath={data[3].imagePath}
                  label={data[3].name}
                  onPress={this.nextButton.bind(this, data[3])}
                  selecteddata={
                    this.props.opthal.selecteddata
                      ? !_.isEmpty(this.props.opthal.selecteddata.lefteye) ||
                        !_.isEmpty(this.props.opthal.selecteddata.righteye) ||
                        !_.isEmpty(this.props.opthal.selecteddata.more)
                        ? true
                        : false
                      : false
                  }
                  extracomponent={
                    prescription[data[3].name] &&
                      prescription[data[3].name].length > 0
                      ? null
                      : null
                  }
                />
              </View>
            ) : null}
          </View>
        </View>

        {/* for bottom button*/}

        <View style={styles.btn_container}>
          <TouchableOpacity
            style={{ flex: 1  }}
            disabled={this.state.loading}
            onPress={() => this.onPress("quick")}
          >
            <View style={styles.linear_gradient_Quick_btn_style}>
              {
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={[
                      styles.linear_gradient_text_style,
                      { color: "#1b7cdb" },
                    ]}
                  >
                    {"SAVE DRAFT"}
                  </Text>
                  <Text
                    style={[
                      styles.linear_gradient_text_style,
                      {
                        color: "#1b7cdb",
                        fontSize: 12,
                        fontFamily: "NotoSans",
                      },
                    ]}
                  >
                    {"For Doctors"}
                  </Text>
                </View>
              }
            </View>
          </TouchableOpacity>
          {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
            this.props.doctorProfile.DoctorData.RoleId == 3 ? <TouchableOpacity
              style={{ flex: 1 }}
              disabled={this.state.loading}
              onPress={() =>
                multipleTapHandler.multitap(() => this.onPress(), "PrintPreview")
              }
            >

            <LinearGradient
              colors={["#1b7cdb", "#07cef2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.8]}
              style={styles.linear_gradient_btn_style}
            >
              {
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.linear_gradient_text_style}>
                    {this.state.loading ? "Generating" : "NEXT"}
                  </Text>

                  {/*
                                        this.state.loading ?
                                            <Text style={styles.linear_gradient_text_style_1} >{'your interactive prescription'}</Text>
                                            : null
                                    */}
                </View>
              }
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
            </LinearGradient>
          </TouchableOpacity> : null}
        </View>

        {this.state.showToast
          ? this.refs.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toastTextColor}
              imagePath={this.state.toastImagePath}
              description={this.state.description}
            />,
            1500
          )
          : null}
        <Toast
          position="bottom"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            backgroundColor: this.state.toastBgColor,
            borderRadius: 15,
          }}
          ref="toast"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  type: state.attachment.type,
  displayname: state.attachment.displayname,
  colorCode: state.attachment.colorCode,
  defaultlabel: state.attachment.defaultlabel,
  subtext: state.attachment.subtext,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  Srno: state.attachment.Srno,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  mdata: state.attachment.mdata,
  patientvisit: state.patientvisit,
  ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
  Findings: state.patientvisit.prescription.Findings,
  Investigation: state.patientvisit.prescription.Investigation,
  Diagnosis: state.patientvisit.prescription.Diagnosis,
  DoctorHeaderDetails: state.patientvisit.prescription.DoctorHeaderDetails,
  PrescriptionList: state.patientvisit.prescription.PrescriptionList,
  prescription: state.patientvisit.prescription,

  RecommendedLabTest: state.patientvisit.prescription.RecommendedLabTest,
  Advice: state.patientvisit.prescription.Advice,
  opthal: state.opthal,
  NotesTooltip: state.tooltip.toolTipStatus.NotesTooltip,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentData: (data) => dispatch(setAttachmentData(data)),
  setMData: (data) => dispatch(setMData(data)),
  setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
  resetAttachmentData: () => dispatch(resetAttachmentData()),
  get_suggestions: (doctorId, searchArray) =>
    dispatch(get_suggestions(doctorId, searchArray)),
  setSuggestionData: (prescription) =>
    dispatch(setSuggestionData(prescription)),
  setAdditionalAssesstment: (id, data) =>
    dispatch(setAdditionalAssesstment(id, data)),
  create_update_prescription: (data) =>
    dispatch(create_update_prescription(data)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AdditionalAssessmentContainer));

const styles = StyleSheet.create({
  flat: { paddingHorizontal: 15, paddingVertical: 16 },
  cflatlistitem: {
    marginVertical: 8,
    borderBottomColor: "#d9d9d9",
    borderBottomWidth: 1.8,
    borderRightColor: "#d9d9d9",
    borderRightWidth: 0.8,
    borderLeftColor: "#d9d9d9",
    borderLeftWidth: 0.8,
  },
  btn_container: {
    flex: 0.1, width: Dimensions.get('window').width- (Dimensions.get('window').width * 10 / 100),
    marginHorizontal : 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: 'center' 
  },
  linear_gradient_btn_style: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 25,
  },
  linear_gradient_Quick_btn_style: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 25,
    borderColor: "#1b7cdb",
    borderWidth: 1,
  },
  linear_gradient_text_style: {
    textAlign: "center",
    fontSize: 17,
    color: "#ffffff",
    fontFamily: "NotoSans-Bold",
    marginEnd: 5,
  },

  linear_gradient_text_style_1: {
    textAlign: "center",
    fontSize: 13,
    color: "#eae8e8",
    fontFamily: "NotoSans",
    marginEnd: 5,
  },
});
