import React from "react";
import { Container, Text, Icon, Button, ScrollableTab } from "native-base";
import {
  Alert,
  StatusBar,
  ActivityIndicator,
  TouchableHighlight,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CenterModal from "../../components/Modal/centerModal";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { get_chief_suggestions, get_suggestions } from "../../actions";
import {
  setPrescription,
  setPrintClickCount,
  setSuggestionPatientData,
  setChiefComplaints,
  updateChief,
  setPatientVisitKeyData,
  isDiscard,
} from "../../actions/patientVisit";
import NoNetwork from "../../components/NoNetwork/noNetwork";

import { add_custom_data, delete_custom_data } from "../../actions/sync";
import Database from "../../utils/db";
import PrescriptionLoader from "../../components/Loading/prescriptionLoader";

import styles from "../../components/Header/styles";
import Images from "../../Theme/Images";
import PrescriptionHeader from "../../components/PrescriptionHeader/PrescriptionHeader";
import EmptyHome from "../../components/EmptyHome/EmptyHome";
import ChiefComplientComponent from "../../components/ChiefComplientComponent";
import FlatListForPrescription from "../../components/FlatListForPrescription";
import FlatListForSelectedPrescription from "../../components/FlatListForSelectedPrescriptionChief";
import {
  def_prescription,
  offline_def_prescription,
} from "../../commonmethods/common";
import { resetOpthalData } from "../../actions/opthal";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import EmptyHomePrescrip from "../../components/EmptyHome/EmptyHomePrescrip";
import {
  empty_vc,
  Chief_N_Data_Icon,
  Black_back,
  ic_note_delete,
  Search_button_light_blue,
} from "../../constants/images";
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
import { oneToNinenine, period, getAge } from "../../commonmethods/validation";
const colorCode = "#0b69d8";
const selectedComplients = [];
let form = [];
let pastComplients = [];
let SuggComplients = [];

const maxSize = 50;
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";

import { Add_the_typed } from "../../constants/images";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
import { toHumanSize } from "i18n-js";

class ChiefComplaintContainer extends React.Component {
  constructor(props) {
    super(props);
    let { params } = props.route;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    this.state = {
      isInternetOn: true,
      NoNetworkMsg: "",
      deletedData: [],
      firstCall: false,
      loading: true,
      isShowDurationModal: false,
      isShowPariodModal: false,
      normalComplients: [],
      pastComplients: [],
      SuggComplients: [],
      ExactEqualLength: 1,
      isSearchBoxShowing: false,
      selectedComplients: [],
      splNotAvalible: false,
      newName: "",
      pastComplText: "Suggested Complaints",
      previous_screen: params ? params.previous_screen : "",
      docterLocalRecent: [],
      //Toast States
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      RecentData: [],

      loadingBack: false,
    };
  }

  //*********** GET PAST CHIF COMPLIENTS ************/

  forceUpdateHandler() {
    this.forceUpdate();
  }

  //*********** GET PAST CHIF COMPLIENTS ************/

  setSuggChiefCompliement(specialization) {
    let patient_details = {
      patient_Id: this.props.patientvisit.patientId,
      doctorId: this.props.doctorProfile.DoctorData._id,
      patientId: this.props.patientvisit.Commonid,
      skip: 0,
      limit: 20,
    };

    this.props
      .get_chief_suggestions(
        patient_details.patient_Id,
        patient_details.doctorId,
        patient_details.patientId,
        specialization
      )
      .then((payload, error) => {
        if (error) {
          this.getChiefComplients(true);
        } else {
          var data = payload.payload.data;
          if (data.status == 0) {
            //if (0 == 0) {
            this.getChiefComplients(true);
          } else if (data.status == 1) {
            const count = 0;

            //  data.suggesstion.sort((a, b) => a[0].localeCompare(b[0]))
            pastComplients = data.suggesstion.map((val) => {
              let item = {
                name: Array.isArray(val) ? val[0] : val,
                id: count + 1,
              };
              return item;
            });
            this.setState({
              pastComplients: pastComplients,
              loading: false,
              pastComplText: specialization
                ? "Complaints"
                : this.state.pastComplText,
            });
          }
        }
      });
  }

  flatten(arr) {
    var flat = [];
    for (var i = 0; i < arr.length; i++) {
      flat = flat.concat(arr[i]);
    }
    return flat;
  }

  getUniqueChiefComplaints(array) {
    var uniqueArray = [];

    // Removing dubs values in case multiple Dose added for a Brand
    for (var i = 0; i < array.length; i++) {
      //  for (var j = 0; j < array[i].length; j++) {
      var thisBrand = array[i];

      var find = uniqueArray.find((x) => x[0] == thisBrand);
      if (!find) {
        uniqueArray.push([thisBrand, 1]);
      } else {
        find[1] = find[1] + 1;
      }

      //  }
    }
    var arr = uniqueArray;
    arr.sort(function (a, b) {
      return a[1] < b[1] ? 1 : -1;
    });
    var fnal = arr.slice(0, 5);
    return fnal;
  }

  componentDidMount() {

    getScreenNameAnalytics({
      screen_name: "ChiefComplaint",
      screen_class: "ChiefComplaintContainer",
    });

    multipleTapHandler.clearNavigator();
    this.getChiefComplients(false);

    // this.props.navigation.addListener("focus", () => {});
  }

  fetchMainData(callfromData) {
    let doc_id = this.props.doctorProfile.DoctorData._id;
    let insertQuery =
      "INSERT INTO MostUsed (_id, DoctorID) VALUES ('" +
      doc_id +
      "', '" +
      doc_id +
      "')";

    try {
      this.props.databaseContext.db.transaction((tx) => {
        tx.executeSql(insertQuery, [], (tx, result) => {
          if (result.insertId != 0) {
            // alert("Doctor Inserted into DB");
          }
        });
      });
    } catch (e) { }

    if (this.props.patientRxList.length == 0) {
      // if (true) {

      //Check recents data is avalible for doctor or not

      if (this.state.RecentData.length > 0) {
        var count = 0;
        pastComplients = [];

        let dataForarray = this.state.docterLocalRecent.map((val) => {
          let item = {
            name: Array.isArray(val) ? val[0] : val,
            id: count,
          };
          count = count + 1;
          return item;
        });

        dataForarray.map((b) => {
          let indexFound = form.findIndex((a) => a.name === b.name);
          if (indexFound != -1) {
            count = count + 1;
            pastComplients.push({
              name: b.name,
              id: count,
            });
          }
        });
        //  alert(JSON.stringify(pastComplients))

        if (pastComplients.length > 0) {
          this.setState({
            pastComplients: pastComplients,
            pastComplText: "Recent Complaints",
            loading: false
          });
        } else {
          this.setSuggChiefCompliement(
            this.props.doctorProfile.DoctorData.PrimarySpecialization
          );
        }
      } else {
        //Add doctor recents >>>
        this.setSuggChiefCompliement(
          this.props.doctorProfile.DoctorData.PrimarySpecialization
        );
      }
    } else if (this.props.patientRxList.length < 20) {
      //  else if (true) {

      //Add patient suggestions from local rx list >>>

      var suggesstionFromLocal = this.getUniqueChiefComplaints(
        this.flatten(
          this.props.patientRxList.map((x) => x.ChiefComplaints.map((f) => f))
        )
      );
      suggesstionFromLocal.sort((a, b) => a[0].localeCompare(b[0]));

      if (suggesstionFromLocal.length == 0) {
        if (this.state.RecentData.length > 0) {
          var count = 0;
          pastComplients = [];

          let dataForarray = this.state.docterLocalRecent.map((val) => {
            let item = {
              name: Array.isArray(val) ? val[0] : val,
              id: count,
            };
            count = count + 1;
            return item;
          });
          pastComplients = [];
          dataForarray.map((b) => {
            let indexFound = form.findIndex((a) => a.name === b.name);
            if (indexFound != -1) {
              count = count + 1;
              pastComplients.push({
                name: b.name,
                id: count,
              });
            }
          });
          //  alert(JSON.stringify(pastComplients))

          if (pastComplients.length > 0) {
            this.setState({
              pastComplients: pastComplients,
              pastComplText: "Recent Complaints",
              loading: false
            });
          } else {
            this.setSuggChiefCompliement(
              this.props.doctorProfile.DoctorData.PrimarySpecialization
            );
          }
        } else {
          //Add doctor recents >>>
          this.setSuggChiefCompliement(
            this.props.doctorProfile.DoctorData.PrimarySpecialization
          );
        }

      } else {
        var dataForarray = suggesstionFromLocal.map((val) => {
          let item = {
            name: Array.isArray(val) ? val[0] : val,
            id: 1,
          };
          return item;
        });
        var count = 0;
        pastComplients = [];
        dataForarray.map((b) => {
          let indexFound = form.findIndex((a) => a.name === b.name);
          if (indexFound != -1) {
            pastComplients.push({
              name: b.name,
              id: count,
            });
            count = count + 1;
          }
        });

        if (pastComplients.length > 0) {

          this.setState({
            pastComplients: pastComplients,
            pastComplText: "Suggested Complaints",
            loading: false
          });
        } else {
          this.setSuggChiefCompliement(
            this.props.doctorProfile.DoctorData.PrimarySpecialization
          );
        }
      }
    } else {
      this.setSuggChiefCompliement();
      this.setState({
        pastComplText: "Suggested Complaints",
      });
    }

    if (callfromData == "willFocus") {
      this.Fav_data();
    }
  }

  componentWillMount() {
    //  alert('d');
    //this.getChiefComplients();
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
    if (this.state.previous_screen != "PrintPreview") {
      Alert.alert(
        "Prescrip",
        "Are you sure you want to go back will discard all Changes?",
        [
          {
            text: "Cancel",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => this.discardPrescription(),
          },
        ],
        { cancelable: false }
      );
    } else {
      this.goback();
    }

    //   this.refs.discardModal.open()

    // multipleTapHandler.clearNavigator(),
    //   this.props.navigation.goBack()

    return true;
  }

  discardPrescription() {
    let { prescriptionFav, navigation } = this.props;
    this.props.resetOpthalData();
    this.setState({
      loadingBack: true,
    });
    if (prescriptionFav._id && prescriptionFav._id != "") {
      this.props.isDiscard(prescriptionFav._id).then(({ payload, error }) => {
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
          });
          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
              loadingBack: false,
            });
          }, 2000);
        } else {
          this.setState({
            loadingBack: false,
          });
          // this.goback();
          let defaultPrescription = JSON.parse(
            JSON.stringify(def_prescription)
          );
          this.props.setPrescription(defaultPrescription);
          this.props.setPrintClickCount(1);

          multipleTapHandler.clearNavigator();
          navigation.pop();
        }
      });
    } else {
      multipleTapHandler.clearNavigator();
      navigation.pop();
      // this.goback();
    }
  }

  //*********** Remove CHIF COMPLIENTS ************/
  crossClick_selectedItem(id, indexItem) {
    this.state.deletedData.push(
      this.state.selectedComplients.splice(indexItem, 1)[0]
    );
    this.setState({ deletedData: this.state.deletedData });
    const filteredData = this.state.selectedComplients.filter(
      (item) => item.id !== id
    );
    // const findData = this.state.selectedComplients.find((itm) => itm.id == id);
    // this.deleteNewCustomDataServer(findData, "ChiefComplaints");
    this.setState({ selectedComplients: filteredData });
    //selectedComplients =[];
  }

  //*********** Create CHIF COMPLIENTS API************/
  onProceedClick() {
    const element = [];

    for (let index = 0; index < this.state.selectedComplients.length; index++) {
      element.push({
        Name: this.state.selectedComplients[index].name,
        Value:
          this.state.selectedComplients[index].duration == "" ||
            this.state.selectedComplients[index].period == ""
            ? ""
            : this.state.selectedComplients[index].duration +
            " " +
            this.state.selectedComplients[index].period,
      });
    }
    multipleTapHandler.multitap(
      () => this.createChiefComplienentObj(element),
      "AdditionalAssessmentContainer"
    );
    //this.createChiefComplienentObj(element);
  }

  //*********** CREATE OBJECT FOR CHIF COMPLIENTS ************/
  createChiefComplienentObj(element) {
    if (false /*element.length == 0*/) {
      this.setState({
        showToast: true,
        description: "Please add atleast one chief compliment.",
      });
      setTimeout(() => {
        this.setState({
          showToast: false,
          loading: false,
        });
      }, 2000);
    } else {
      this.setState({
        loading: false,
      });

      let {
        patientvisit,
        doctorProfile,
        prescriptionFav,
        templateData,
        ChiefComplaints,
      } = this.props;
      let { patientDetails } = patientvisit;
      let PatientDetails = {
        id: patientvisit.Commonid,
        FullName: patientDetails.CommonDetails.FullName,
        Age: getAge(patientDetails.CommonDetails.DOB) + " yrs",
        Height: patientDetails.CommonDetails.BodyDetails.Height,
        Weight: patientDetails.CommonDetails.BodyDetails.Weight,
        BMI: patientDetails.CommonDetails.BodyDetails.BMI,
        Mobile: patientDetails.CountryCode ? patientDetails.CountryCode : '+91' + patientDetails.Mobile,
        Gender: patientDetails.CommonDetails.Gender,
        ReferralDrrName: patientDetails.CommonDetails.Referredby,
        PatientId: this.props.patientvisit.patientId,
        EmailAddress: patientDetails.CommonDetails.EmailAddress,
        Address: patientDetails.CommonDetails.Address,
      };
      let clinics = [...doctorProfile.DoctorData.ClinicAddresses];
      clinics.forEach((v) => {
        delete v.OperationHours;
      });
      let DoctorHeaderDetails = {
        Logo: doctorProfile.DoctorData.Logo,
        DoctorEmail: doctorProfile.DoctorData.DoctorEmail,
        DoctorName:
          doctorProfile.DoctorData.DoctorFName +
          " " +
          doctorProfile.DoctorData.DoctorLName,
        Specialist: doctorProfile.DoctorData.DisplaySpecializationCSV,
        Qualification: doctorProfile.DoctorData.DisplayQualificationCSV,
        MICRNo: doctorProfile.DoctorData.MICRNo,
        CouncilName: doctorProfile.DoctorData.CouncilName,
        Clinic: clinics,
        Signature: doctorProfile.DoctorData.Signature
          ? doctorProfile.DoctorData.Signature
          : "",
        DisplayLabel: doctorProfile.DoctorData.DisplayLabel,
      };
      DoctorHeaderDetails["Specialist"] = DoctorHeaderDetails[
        "Specialist"
      ].trim();
      let createChiefComplienentObj = {
        PatientID: patientvisit.patientId,
        DoctorID: doctorProfile.DoctorData._id,
        DoctorHeaderDetails: DoctorHeaderDetails,
        DoctorFooterDetails: "",
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
        //this.props.doctorProfile.DoctorData.PaperSettings,
        Allergy: patientDetails.CommonDetails.Allergy,
        PatientDetails: PatientDetails,
        FamilyHistory: patientDetails.CommonDetails.FamilyHistory,
        Habits: [],
        ChiefComplaints: element,
        PatientHabits: patientDetails.CommonDetails.PatientHabits,
        PersonalHistory: patientDetails.CommonDetails.PersonalHistory,
        Gpal: patientDetails.CommonDetails.Gpal,
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

        Type: this.props.doctorProfile.DoctorData.PrimarySpecialization,
      };

      let { navigation } = this.props;
      let { prescription } = this.props.patientvisit;

      let offlinePrescrip_data_1 = {
        ...offline_def_prescription,
        ...prescription,
      };
      let offlinePrescrip_data = {
        ...offlinePrescrip_data_1,
        ...createChiefComplienentObj,
      };

      //Adding current patient,and doctor details in object
      this.props.setPrescription(offlinePrescrip_data);

      let searchArray = [];
      for (let index = 0; index < element.length; index++) {
        searchArray.push(element[index].Name);
      }

      if (searchArray.length > 0) {
        if (this.state.previous_screen === "PrintPreview") {
          this.setSuggSugg("PrintPreview", {
            doctorId: this.props.doctorProfile.DoctorData._id,
            searchArray: searchArray,
          });

          this.props.navigation.pop();
        } else {
          //this.props.setPrintClickCount(1)

          this.setSuggSugg("AdditionalAssessmentContainer", {
            doctorId: this.props.doctorProfile.DoctorData._id,
            searchArray: searchArray,
          });

          this.props.navigation.push("AdditionalAssessmentContainer");
        }

        //Code for update mostUsed table

        for (
          let index = 0;
          index < this.state.docterLocalRecent.length;
          index++
        ) {
          searchArray.push(this.state.docterLocalRecent[index][0]);
        }

        var suggesstionFromLocal = this.getUniqueChiefComplaints(searchArray);

        //this.updateMostUsedTable("ChiefComplaints", new Date(), this.props.doctorProfile.DoctorData._id, suggesstionFromLocal)
      } else {
        this.props.setSuggestionPatientData([]);
        this.setState({
          loading: false,
        });
        if (this.state.previous_screen === "PrintPreview") {
          this.props.navigation.pop();
        } else {
          //this.props.setPrintClickCount(1)
          this.props.navigation.push("AdditionalAssessmentContainer");
        }
      }
    }
  }

  //*********** CANCEL SEARCH CHIF COMPLIENTS ************/
  rightImageOnClick() {
    this.setState({
      normalComplients: form,
      pastComplients: pastComplients,
      newName: "",
      isSearchBoxShowing: !this.state.isSearchBoxShowing,
    });
  }

  setSuggSugg(callFrom, patient_details) {
    this.props.get_suggestions(patient_details).then(({ payload, error }) => {
      var data = payload.data;

      if (error) {
        this.props.setSuggestionPatientData([]);
        if (callFrom == "PrintPreview") {
          //  this.props.navigation.pop();
        } else {
          //multipleTapHandler.multitap(() => this.props.navigation.push('AdditionalAssessmentContainer'), "AdditionalAssessmentContainer");
        }

        this.setState({
          loading: false,
        });
      } else if (data.status == 0) {
        this.props.setSuggestionPatientData([]);
        if (callFrom == "PrintPreview") {
          //this.props.navigation.pop();
        } else {
          // multipleTapHandler.multitap(() => this.props.navigation.push('AdditionalAssessmentContainer'), "AdditionalAssessmentContainer");
        }
        this.setState({
          loading: false,
        });
      } else if (data.status == 1) {
        try {
          this.props.setSuggestionPatientData(data.suggesstion);
        } catch (error) { }

        if (callFrom == "PrintPreview") {
          let { prescriptionFav } = this.props;
          //this.props.navigation.pop();
        } else {
          //  multipleTapHandler.multitap(() => this.props.navigation.push('AdditionalAssessmentContainer'), "AdditionalAssessmentContainer");
        }
        this.setState({
          loading: false,
        });
      }
    });
  }

  //*********** GO BACK ************/
  leftImageOnClick() {
    if (this.state.previous_screen != "PrintPreview") {
      Alert.alert(
        "Prescrip",
        "Are you sure you want to go back will discard all Changes?",
        [
          {
            text: "Cancel",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => this.discardPrescription(),
          },
        ],
        { cancelable: false }
      );
    } else {
      this.goback();
    }

    //   this.refs.discardModal.open()

    // multipleTapHandler.clearNavigator(),
    //   this.props.navigation.goBack()
  }

  goback() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  //*********** SEARCH ACTION FOR CHIF COMPLIENTS ************/
  searchAction(text1) {
    let text = text1.trim();

    let newData = form.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    let newData1 = pastComplients.filter((item) => {
      const itemData1 = `${item.name.toUpperCase()}`;
      const textData1 = text.toUpperCase();
      return itemData1.indexOf(textData1) > -1;
    });

    let newData2 = form.filter((item) => {
      const itemData1 = `${item.name.toUpperCase()}`;
      const textData1 = text.toUpperCase();
      return itemData1 == textData1;
    });

    let newData3 = pastComplients.filter((item) => {
      const itemData1 = `${item.name.toUpperCase()}`;
      const textData1 = text.toUpperCase();
      return itemData1 == textData1;
    });

    this.setState({
      normalComplients: newData,
      pastComplients: newData1,
      ExactEqualLength: newData2.length + newData3.length,
      newName: text,
    });

    newData = null;
    newData1 = null;
    newData2 = null;
    newData3 = null;
  }

  ///DB Call in container
  //Get all getChiefComplients from Local DB

  getChiefComplients(splNotAvalible) {
    //8 is Srno for DosageForm array
    this.props.databaseContext.db.transaction((tx) => {
      let query =
        "SELECT ChiefComplaints from Recents where DoctorId = '" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(query, [], (tx, results) => {
        let brandDataValue1 = results.rows.raw()[0];
        var mapToCountStyle = JSON.parse(brandDataValue1.ChiefComplaints)
          .map((x) => [x, 1])
          .slice(0, 20);
        this.setState({
          RecentData: JSON.parse(brandDataValue1.ChiefComplaints),
          SuggComplients: JSON.parse(brandDataValue1.ChiefComplaints),
          docterLocalRecent: !brandDataValue1.ChiefComplaints
            ? []
            : mapToCountStyle,
        });
      });
      tx.executeSql(
        "SELECT DATA FROM MasterData where Srno = 8",
        [],
        (tx, results) => {
          let brandDataValue1 = results.rows.raw()[0];
          let SuggComplients = this.state.SuggComplients;
          let values = this.state.SuggComplients.concat(
            JSON.parse(brandDataValue1.Data)
          );
          // values.maxLength =7;
          var count = 0;
          values.sort();
          form = [];
          form = values.map((val) => {
            let item = {
              name: val,
              id: count + 1,
            };
            return item;
          });
          this.setState({
            normalComplients: form,
            splNotAvalible: splNotAvalible ? true : false,
            // pastComplients: form,
          });
          this.fetchMainData("willFocus");
        },
        (error) => { }
      );
    });
  }

  addNewCustomDataServer(doctorId, newData, key) {
    let data = {
      DoctorId: doctorId,
      key: key,
      newData: newData,
      lastCloudSync: new Date(),
    };

    let final_Data = this.state.SuggComplients;
    final_Data.unshift(newData);

    this.props.add_custom_data(data).then((response) => {
      if (response.payload.data.status == 1) {
        this.updateDoctorRecentsCustom(
          key,
          response.payload.data.LastCloudSync,
          response.payload.data.IsUpdateReq,
          doctorId,
          final_Data
        );
      } else {
        alert(response.payload.data.msg);
      }
    });
  }

  updateMostUsedTable(key, lastCloudSync, doctorId, final_Data) {
    var self = this;

    this.props.databaseContext.db.transaction(
      (tx) => {
        let query =
          "UPDATE MostUsed SET " +
          key +
          " = '" +
          JSON.stringify(final_Data).replace(/\'/g, "''") +
          "' where DoctorID = '" +
          doctorId +
          "'";

        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rowsAffected == 1) {
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  updateDoctorRecentsCustom(
    key,
    lastCloudSync,
    isUpdateReq,
    doctorId,
    final_Data
  ) {
    var self = this;

    this.props.databaseContext.db.transaction(
      (tx) => {
        let query =
          "UPDATE Recents SET " +
          key +
          " = '" +
          JSON.stringify(final_Data).replace(/\'/g, "''") +
          "'," +
          "LastCloudSync = '" +
          lastCloudSync.replace(/\'/g, "''") +
          "' where DoctorID = '" +
          doctorId +
          "'";

        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rowsAffected == 1) {
              //alert("Updated successfully");
              self.getChiefComplients(false);
              setTimeout(() => {
                self.fetchMainData("other");
              }, 1000);
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  Fav_data() {
    const prescriptionFav = this.props.prescriptionFav.ChiefComplaints
      ? this.props.prescriptionFav.ChiefComplaints
      : [];

    for (let index = 0; index < prescriptionFav.length; index++) {
      this.addItemInSelctedFlatList(
        prescriptionFav[index].Name,
        "",
        prescriptionFav[index].Value
      );
    }
  }

  //*********** REMOVE ITEM ON SELECETED CHIEF COMPLIENTS LIST ************/
  deleteItemInSelctedFlatList(data, indexNumber) {
    if (this.state.selectedComplients.every((item) => item.name !== data)) {
      if (this.state.RecentData.includes(data)) {
        Alert.alert(
          "Prescrip",
          "Do you want to delete " + data + " ?",
          [
            {
              text: "Delete",
              onPress: () => {
                this.deleteNewCustomDataServer(data, "ChiefComplaints");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          }
        );
      } else {
        Alert.alert("Prescrip", "Cannot delete " + data);
      }
    } else {
      Alert.alert(
        "Prescrip",
        data + " already added",
        [
          {
            text: "OK",
            onPress: () => { },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );

      //  alert(name + ' already added')
    }
  }

  deleteNewCustomDataServer(data, type) {
    let { DoctorData } = this.props.doctorProfile;
    let RecentData1 = this.state.RecentData;
    let key = type;

    let newData = null;

    let dataCheck = RecentData1.filter((element) => {
      if (Array.isArray(element)) {
        if (element[0] == data[0]) {
          newData = element;
          return false;
        } else {
          return true;
        }
      } else if (type == "Investigation" || type == "Findings") {
        if (element == data[0]) {
          newData = element;
          return false;
        } else {
          return true;
        }
      } else if (element == data) {
        newData = element;
        return false;
      } else {
        return true;
      }
    });

    let data1 = {
      Key: key,
      value: newData,
      DoctorId: DoctorData._id,
      brandName: "",
      doseForm: "",
      brandRemoving: false,
      doseRemoving: false,
    };

    this.props.delete_custom_data(data1).then((response) => {
      if (response.payload.data.status == 1) {
        this.updateDoctorRecentsCustom(
          key,
          response.payload.data.LastCloudSync,
          response.payload.data.IsUpdateReq,
          DoctorData._id,
          dataCheck
        );
        this.rightImageOnClick();
      } else {
        alert(response.payload.data.msg);
      }
    });
  }

  //*********** ADD ITEM ON SELECETED CHIEF COMPLIENTS LIST ************/
  addItemInSelctedFlatList(name, callForm, Value) {
    //alert(callForm);
    // return;
    let self = this;
    if (this.state.deletedData.length > 0 && callForm == "") {
      if (this.state.deletedData.every((el) => el.name != name)) {
        this.getDataForList(name, callForm, Value);
      }
    } else {
      this.getDataForList(name, callForm, Value);
    }
  }

  getDataForList(name, callForm, Value) {
    if (this.state.selectedComplients.every((item) => item.name !== name)) {
      this.state.selectedComplients.push({
        id: this.state.selectedComplients.length + 1,
        name: name,
        duration: Value ? Value.substr(0, Value.indexOf(" ")) : "",
        period: Value ? Value.substr(Value.indexOf(" ") + 1) : "",
      });

      // if (self.state.deletedData.length > 0) {
      //   self.state.selectedComplients.map((item) => {
      //     let index = self.state.deletedData.findIndex(
      //       (cl) => cl?.name == item?.name
      //     );
      //     {
      //       if (index > -1) {
      //         this.state.selectedComplients.splice(index, 1);
      //         this.setState({
      //           selectedComplients: this.state.selectedComplients,
      //         });
      //       }
      //     }
      //   });
      // }
      this.setState({
        selectedComplients: this.state.selectedComplients,
        isSearchBoxShowing: false,
        newName: "",
      });

      if (callForm == "custom")
        this.addNewCustomDataServer(
          this.props.doctorProfile.DoctorData._id,
          name,
          "ChiefComplaints"
        );

      this.searchAction("");
      if (this.scrollListReftop) {
        this.scrollListReftop.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      if (callForm != "") {
        Alert.alert(
          "Prescrip",
          name + " already added",
          [
            {
              text: "OK",
              onPress: () => { },
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }

      //  alert(name + ' already added')
    }
  }

  ouSideClick(callForm) {
    this.setState({
      isShowDurationModal: false,
      isShowPariodModal: false,
    });

    switch (callForm) {
      case "outside":
        this.setState({
          isShowDurationModal: false,
          isShowPariodModal: false,
        });
        break;
      default:
        break;
    }
  }

  //*********** POPUP MODAL RESULT (period and duration)************/
  modalResultValue(item, callForm) {
    this.setState({
      isShowDurationModal: false,
      isShowPariodModal: false,
    });

    if (callForm == "duration" && item != "cross") {
      this.state.selectedComplients[
        this.state.indexOfFlatList - 1
      ].duration = item;
    } else if (callForm == "period" && item != "cross") {
      this.state.selectedComplients[
        this.state.indexOfFlatList - 1
      ].period = item;
    }
    // alert(JSON.stringify(this.state.selectedComplients))
  }

  //*********** WHEN MODAL CLCIK************/
  clickData(callForm, index) {
    //alert(callForm +" "+index)
    switch (callForm) {
      case "Duration":
        this.setState({
          isShowDurationModal: true,
          indexOfFlatList: index,
        });
        break;
      case "Period":
        this.setState({
          isShowPariodModal: true,
          indexOfFlatList: index,
        });
        break;
    }
  }

  render() {
    const { isShowDurationModal } = this.state;
    return (
      <View
        style={{ flex: 1 }}>
        {this.state.loadingBack ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: Dimensions.get("screen").height,
              width: Dimensions.get("screen").width,
              position: "absolute",
            }}
          >
            <PrescriptionLoader
              {...this.props}
              type={"Discarding Current Prescription"}
            />
          </View>
        ) : null}
        {this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: Dimensions.get("screen").height,
              width: Dimensions.get("screen").width,
              position: "absolute",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : null}
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <View style={{ position: "absolute" }}>
          {/* for duration */}
          <CenterModal
            {...this.props}
            modalResultValue={(value) =>
              this.modalResultValue(value, "duration")
            }
            data={oneToNinenine}
            header={"Select Duration"}
            show={this.state.isShowDurationModal}
            indexOfFlatList={this.state.indexOfFlatList}
          />

          {/* for Period */}
          <CenterModal
            {...this.props}
            modalResultValue={(value) => this.modalResultValue(value, "period")}
            data={period}
            header={"Select Period"}
            show={this.state.isShowPariodModal}
          />

          {!this.state.isInternetOn ? (
            <View
              style={{
                zIndex: 99,
                justifyContent: "center",
                backgroundColor: "white",
                height: "100%",
                width: "100%",
                position: "absolute",
              }}
            >
              <NoNetwork
                {...this.props}
                NoNetworkMsg={this.state.NoNetworkMsg}
                retryClick={(isInternetOn) =>
                  this.retryClick(isInternetOn, "psetting")
                }
              />
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexdirection: "column",
            flex: 1,
            backgroundColor: "#F6F9FA",
          }}
        >
          <View
            style={{
              flexdirection: "column",
              flex: this.state.newName != "" ? 1.0 : 0.9,
              backgroundColor: "#F6F9FA",
            }}
          >
            <View>
              {/* for HEADER */}
              <PrescriptionHeader
                {...this.props}
                bgImage={null}
                bgColor={"white"}
                cursorColor={"#0869d8"}
                tintColor={"#0b69d8"}
                title={(
                  "What are the " +
                  this.props.patientvisit.patientDetails.CommonDetails
                    .FullName +
                  "'s Complaints?"
                ).toUpperCase()}
                description={"Search for Chief Complaints..."}
                titleColor={"#919191"}
                descriptionColor={"#0b69d8"}
                placeholderTextColor={"black"}
                placeTextColor={"black"}
                placeholderTextSize={20}
                //this.props.placeholderTextColor ? this.props.placeholderTextColor :
                leftImage={Black_back}
                rightImage={Search_button_light_blue}
                rightImageCross={ic_note_delete}
                isSearchBoxShowing={this.state.isSearchBoxShowing}
                type={5}
                searchAction={(text) => this.searchAction(text)}
                leftImageOnClick={() => this.leftImageOnClick()}
                rightImageOnClick={() => this.rightImageOnClick()}
              />
            </View>
            <ScrollView
              ref={(ref) => {
                this.scrollListReftop = ref;
              }}
            >
              {this.state.selectedComplients.length > 0 &&
                this.state.newName == "" ? (
                <View>
                  {/* for Selected Complaints Flatlist*/}
                  <Text
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 10,
                      color: "#c4c4c4",
                    }}
                  >
                    Selected
                  </Text>
                  <FlatListForSelectedPrescription
                    {...this.props}
                    data={this.state.selectedComplients}
                    leftImage={icon_Chief_Complaints_Duration_Button}
                    rightImage={icon_Reemove_Button}
                    crossClick_selectedItem={(id, index) =>
                      this.crossClick_selectedItem(id, index)
                    }
                    clickData={(callForm, index) =>
                      this.clickData(callForm, index)
                    }
                  />
                </View>
              ) : null}

              {/* for custom add chief complinent*/}
              {this.state.newName == "" ||
                this.state.ExactEqualLength > 0 ? null : (
                <View
                  style={{
                    paddingLeft: 10,
                    flexDirection: "row",
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    borderBottomColor: "#cccccc",
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      paddingVertical: 15,
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "NotoSans-Bold",
                        fontSize: 22,
                        paddingVertical: 5,
                        color: colorCode,
                      }}
                    >
                      {this.state.newName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "NotoSans",
                        fontSize: 12,
                        color: colorCode,
                      }}
                    >
                      Add as Chief Complaint
                    </Text>
                  </View>

                  {this.props.chiefComplaintContainerAdd ? (
                    <TouchableOpacity
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip
                        topAdjustment={
                          Platform.OS === "android"
                            ? -StatusBar.currentHeight
                            : 0
                        }
                        animated={true}
                        isVisible={this.props.chiefComplaintContainerAdd}
                        backgroundColor={"rgba(0,0,0,0)"}
                        contentStyle={{
                          backgroundColor: "#6f6af4",
                          height: "100%",
                        }}
                        tooltipStyle={{ right: 20, alignItems: "flex-end" }}
                        content={
                          <TouchableOpacity
                            style={{ backgroundColor: "#6f6af4" }}
                            onPress={() => {
                              this.props.setTooltipStatus({
                                ["chiefComplaintContainerAdd"]: false,
                              });
                            }}
                          >
                            <AddPatient
                              imagePath={Add_the_typed}
                              title={"Add To Chief Complaints"}
                              description={
                                "Can't find it in our list? You can add the Chief Complaint from here and it will be autosaved for usage in the future.."
                              }
                            />
                          </TouchableOpacity>
                        }
                        //(Must) This is the view displayed in the tooltip
                        placement="bottom"
                        //(Must) top, bottom, left, right, auto.
                        onClose={() =>
                          this.props.setTooltipStatus({
                            ["chiefComplaintContainerAdd"]: false,
                          })
                        }
                      //(Optional) Callback fired when the user taps the tooltip
                      >
                        <Image
                          style={{
                            height: 35,
                            width: 35,
                            marginHorizontal: 20,
                          }}
                          source={icon_List_First_Element_Add_Button_Blue}
                        />
                      </Tooltip>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        this.addItemInSelctedFlatList(
                          this.state.newName,
                          "custom"
                        )
                      }
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ height: 35, width: 35, marginHorizontal: 20 }}
                        source={icon_List_First_Element_Add_Button_Blue}
                      ></Image>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* for past chief complinent list*/}

              {this.state.pastComplients.length > 0 ? (
                <View>
                  <Text
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 10,
                      color: "#c4c4c4",
                    }}
                  >
                    {this.state.pastComplText}
                  </Text>
                  <FlatListForPrescription
                    {...this.props}
                    data={this.state.pastComplients}
                    rightImage={ic_back_black}
                    deleteItemInSelctedFlatList={(title, index) =>
                      this.deleteItemInSelctedFlatList(title, index)
                    }
                    addItemInSelctedFlatList={(title, index) =>
                      this.addItemInSelctedFlatList(title, "past")
                    }
                  />
                </View>
              ) : null}

              {/* for past chief complinent list*/}
              {this.state.newName && this.state.isSearchBoxShowing ? (
                <View>
                  {this.state.normalComplients.length > 0 ? (
                    <View>
                      <Text
                        style={{
                          marginHorizontal: 20,
                          marginVertical: 10,
                          color: "#c4c4c4",
                        }}
                      >
                        Complaints
                      </Text>
                      <FlatListForPrescription
                        {...this.props}
                        data={this.state.normalComplients.slice(0, maxSize)}
                        rightImage={ic_back_black}
                        deleteItemInSelctedFlatList={(title, index) =>
                          this.deleteItemInSelctedFlatList(title, index)
                        }
                        addItemInSelctedFlatList={(title) =>
                          this.addItemInSelctedFlatList(title, "Complaints")
                        }
                      />
                    </View>
                  ) : this.state.pastComplients.length == 0 ? (
                    <View>
                      <Text
                        style={{
                          marginHorizontal: 20,
                          marginVertical: 10,
                          color: "#c4c4c4",
                        }}
                      >
                        Complaints
                      </Text>
                      <EmptyHomePrescrip
                        isLottie={true}
                        imagePath={empty_vc}
                        sectionImg={
                          this.state.newName == "" ? null : Chief_N_Data_Icon
                        }
                        title={
                          this.state.newName == ""
                            ? "Fetching Chief Complaints"
                            : "No " + "Chief Complaints" + " found"
                        }
                        colorCode={"red"}
                        isShowButton={false}
                        description={
                          this.state.newName == ""
                            ? null
                            : "For adding '" +
                            this.state.newName +
                            "' as Chief Complaints\nYou can do it by clicking \u2295 symbol"
                        }
                      />
                    </View>
                  ) : null}
                </View>
              ) : this.state.splNotAvalible ? (
                <View>
                  <Text
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 10,
                      color: "#c4c4c4",
                    }}
                  >
                    Complaints
                  </Text>
                  <FlatListForPrescription
                    {...this.props}
                    data={this.state.normalComplients.slice(0, maxSize)}
                    rightImage={ic_back_black}
                    deleteItemInSelctedFlatList={(title, index) =>
                      this.deleteItemInSelctedFlatList(title, index)
                    }
                    addItemInSelctedFlatList={(title) =>
                      this.addItemInSelctedFlatList(title, "Complaints")
                    }
                  />
                </View>
              ) : null}
            </ScrollView>
          </View>

          {/* for bottom button*/}

          {this.state.newName == "" ? (
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={() => this.onProceedClick()}
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
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      color: "#ffffff",
                      fontFamily: "NotoSans-Bold",
                      marginEnd: 5,
                    }}
                  >
                    {this.state.selectedComplients.length > 0 ? "NEXT" : "SKIP"}
                  </Text>

                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null}
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
  patientvisit: state.patientvisit,

  prescriptionFav: state.patientvisit.prescription,
  templateData: state.doctorProfile.DoctorData.PaperSettings,
  ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
  chiefComplaintContainerAdd:
    state.tooltip.toolTipStatus.chiefComplaintContainerAdd,
  chiefComplaintContainerClock:
    state.tooltip.toolTipStatus.chiefComplaintContainerClock,
  patientRxList: state.patientvisit.patientRxList,
});

const mapDispatchToProps = (dispatch) => ({
  get_chief_suggestions: (patient_Id, doctorId, patientId, specialization) =>
    dispatch(
      get_chief_suggestions(patient_Id, doctorId, patientId, specialization)
    ),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),
  delete_custom_data: (data) => dispatch(delete_custom_data(data)),

  add_custom_data: (data) => dispatch(add_custom_data(data)),
  isDiscard: (prescriptionId) => dispatch(isDiscard(prescriptionId)),
  get_suggestions: (data) => dispatch(get_suggestions(data)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
  resetOpthalData: () => dispatch(resetOpthalData()),
  setSuggestionPatientData: (prescription) =>
    dispatch(setSuggestionPatientData(prescription)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(ChiefComplaintContainer));
