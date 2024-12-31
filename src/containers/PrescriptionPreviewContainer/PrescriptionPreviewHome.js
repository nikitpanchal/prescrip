//OFFLINE
import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import {
  Container,
  Button,
  Icon,
  Picker,
  CheckBox,
  Label,
  Item,
  Input,
} from "native-base";
import {
  setDoctorData,
  setHeader,
  setFooter,
} from "../../actions/doctorProfile";
import LottieView from "lottie-react-native";
import { withDb } from "../../DatabaseContext/withDatabase";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import PrescriptionLoader from "../../components/Loading/prescriptionLoader";

import { resetOpthalData } from "../../actions/opthal";

import {
  Tooltip_Edit_Icon,
  Pinch_to_zoom,
  Click_Sections,
  Triangle_Tip_Tooltip,
} from "../../constants/images";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips/custom";
import { setTooltipStatus } from "../../actions/tooltip";
import { resetMedicine } from "../../actions/dosage";
import {
  ic_Diagnosis,
  ic_Findings,
  ic_Investigations,
  SuggestLab_Pink_btn,
  Refer_Green_icon,
} from "../../constants/images";
import {
  prescrip_save,
  ic_Add_Prescription,
  ic_Reset,
  ic_Apply,
  ic_clock,
  ic_add_button,
  ic_close_button,
  ic_prescription_menu,
  ic_save_button,
  ic_follow_up_icon,
  ic_give_advice,
  ic_take_notes_outline_icon,
  ic_medication_icon,
  ic_recommend_lab_test_icon,
  ic_Add_Clinic_Button,
  ic_Quick_Rx_Heart_Filled,
  ic_Quick_Rx_Heart,
  ic_take_notes_icon,
  ic_add_digi_sign_icon,
  ic_add_clinic_logo_icon,
  ic_settings_Print_icon,
} from "../../constants/images";
import ParentTab from "../../components/PrescriptionPreviewComponent/ParentTab";
import NoNetwork from "../../components/NoNetwork/noNetwork";
import {
  deletePatientVisit,
  onTemplateSave,
  tabDataStore,
  loadPrescription,
  resetTemplateData,
} from "../../actions/previewSettings";
import { FloatingAction } from "react-native-floating-action";
import { MenuProvider, MenuContext, MenuOption } from "react-native-popup-menu";
import {
  setPatientVisitKeyData,
  saveQuickRxFavourites,
  create_update_prescription,
  setlab,
  update_suggestion,
  setDiagnosis,
  setPrescription,
  isFinish,
  setPrintClickCount,
} from "../../actions/patientVisit";
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
} from "../../actions/attachment";
import { addToPrescription } from "../../actions/dosage";
import { connect } from "react-redux";
import PrescriptionPreviewHeader from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewHeader";
import PrescriptionPreviewFooter from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewFooter";
import PrescriptionPreviewBody from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewBody";
import Images from "../../Theme/Images";
import Modal from "react-native-modalbox";

import { LogBox } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNPrint from "react-native-print";

import Share from "react-native-share";
import { setWebdata } from "../../actions/previewSettings";
import io from "socket.io-client";
import { isStagging, staging, prod } from "../../../app.json";
import { RNS3 } from "react-native-aws3";
import { s3DocSignConfig as config, signBucket } from "../../../app.json";
import { generateGuid } from "../../commonmethods/common";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";

import AsyncStorage from "@react-native-async-storage/async-storage";
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs();

var rxloading = require("../../../assets/Json/Rx-Loader.json");
var prescrip_loader_4 = require("../../../assets/Json/Prescription-Loader-4.json");

class PrescriptionPreviewHome extends Component {
  constructor(props) {
    super(props);
    this.modal2 = React.createRef();
    this.modalfloatMenu = React.createRef();
    this.modalsettings = React.createRef();
    this.onscanned = this.onscanned.bind(this);
    this.socketConnection = null;
    this.Signature = "";
    this.DisplayLabel = {
      ChiefComplaints: "Chief Complaints",
      History: "History",
      Findings: "Findings",
      Investigation: "Investigation",
      LabTest: "LabTest",
      Notes: "Notes",
      Diagnosis: "Diagnosis",
      Prescription: "Prescription",
      DisplayGenericName: "Display Generic Name",
      Advice: "Advice",
      Followup: "Followup",
      DoctorDetails: "Doctor Details",
      DigitalImageSignature: "Digital Image Signature",
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.tempData = { ...this.props.previewReducer.templateData };
    this.tempData["DisplayPreferences"] = [
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
    ];
    this.printData = { ...this.props.previewReducer.templateData };
    this.state = {
      isInternetOn: true,
      openTooltip: false,
      prescriptionSaveloading: false,
      OrientationStatus: "",

      Height_Layout: "",
      //update Data bw
      updatedData: {
        PaperSettings: {
          IsBW: 0,
          Margin: ["10", "10", "10", "10"],
          papername: "A4",
          papersize: ["210", "297"],
          TemplateFontSize: "14",
          header: 1,
          footer: 1,
          body: 1,
        },
        PrescriptionList:
          this.props.patientvisit.prescription.PrescriptionList.length > 0
            ? this.props.patientvisit.prescription.PrescriptionList
            : [],
        Language: this.props.patientvisit.prescription.Language,
        DisplayLabel: {
          ChiefComplaints: "Chief Complaints",
          History: "History",
          Findings: "Findings",
          Investigation: "Investigation",
          LabTest: "LabTest",
          Notes: "Notes",
          Diagnosis: "Diagnosis",
          Prescription: "Prescription",
          DisplayGenericName: "Display Generic Name",
          Advice: "Advice",
          Followup: "Followup",
          DoctorDetails: "Doctor Details",
          DigitalImageSignature: "Digital Image Signature",
        },
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
      },

      Width_Layout: "",
      NoNetworkMsg: "",
      tabSwitch: 0,
      getDataFromTab: null,
      loading: false,
      fabClick: false,
      showToast: false,
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      errorToast: false,
      reset: false,
      dataChanged: false,
      description: "",
      editShow: false,
      favNamePopup: "",
      isFavPrescription: this.props.IsFavourite,
      printing: false,
      isSettingsClicked: false,
      templateData:
        Object.keys(this.tempData).length > 0
          ? { ...this.tempData }
          : {
            PaperSettings: {
              ...this.props.doctorProfile.DoctorData.PaperSettings,
            },
            Language: this.props.patientvisit.prescription.Language,
            PrescriptionList:
              this.props.patientvisit.prescription.PrescriptionList.length > 0
                ? this.props.patientvisit.prescription.PrescriptionList
                : [],
            DisplayLabel: {
              ChiefComplaints: "Chief Complaints",
              History: "History",
              Findings: "Findings",
              Investigation: "Investigation",
              LabTest: "LabTest",
              Notes: "Notes",
              Diagnosis: "Diagnosis",
              Prescription: "Prescription",
              DisplayGenericName: "Display Generic Name",
              Advice: "Advice",
              Followup: "Followup",
              DoctorDetails: "Doctor Details",
              DigitalImageSignature: "Digital Image Signature",
            },
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
          },
      DoctorFName: this.props.doctorProfile.DoctorData.DoctorFName,
      DoctorLName: this.props.doctorProfile.DoctorData.DoctorLName,
      arrayItem: ["Share", "Settings", "Discard", "Print using QR Code"],
      arrayModalItem: [
        {
          img: ic_medication_icon,
          name: "Add Medication",
        },
        {
          img: ic_take_notes_icon,
          name: "Add Notes",
        },
        {
          img: ic_recommend_lab_test_icon,
          name: "Recommend Lab Test",
        },
        {
          img: ic_follow_up_icon,
          name: "Set follow Up Date",
        },
        {
          img: ic_give_advice,
          name: "Provide Advice",
        },
        {
          img: ic_add_clinic_logo_icon,
          name: "Add Clinic Logo",
        },
        {
          img: ic_add_digi_sign_icon,
          name: "Add Digital Signature",
        },
      ],
    };
    this.filepath = "";
    this._unsubscribe = "";

    this.imagePath = null;
    this.Languages = [];
    this.db = this.props.databaseContext.db;
    //this.spinValue = new Animated.Value(1)
    //this.mode = new Animated.Value(0)

    this.WebViewRef = React.createRef();
  }
  showReset() {
    this.setState({
      dataChanged: true,
    });
  }

  componentDidMount() {
    //this.DetectOrientation();
    multipleTapHandler.clearNavigator();

    let self = this;
    this.SocketIO();
    this.getLanguages();
    this.props.navigation.addListener("focus", () => {
      // this.forceUpdate();
      //Set template Data
      getScreenNameAnalytics({
        screen_name: "PrescriptionPreview",
        screen_class: "PrescriptionPreviewHome",
      });
      let paperSetting = JSON.parse(
        JSON.stringify(self.props.doctorProfile.DoctorData.PaperSettings)
      );

      if (self.props.doctorProfile.DoctorData.PaperSettings.footer !== 0) {
        this.props.setFooter(true);
      } else {
        this.props.setFooter(false);
      }
      if (self.props.doctorProfile.DoctorData.PaperSettings.header !== 0) {
        this.props.setHeader(true);
      } else {
        this.props.setHeader(false);
      }

      let DisplayLabel = JSON.parse(
        JSON.stringify(self.props.doctorProfile.DoctorData.DisplayLabel)
      );
      DisplayLabel = { ...this.DisplayLabel, ...DisplayLabel };
      let Signature = this.props.doctorProfile.DoctorData.Signature
        ? this.props.doctorProfile.DoctorData.Signature
        : "";
      let Logo = this.props.doctorProfile.DoctorData.Logo
        ? this.props.doctorProfile.DoctorData.Logo
        : "";
      let PrescriptionList =
        this.props.patientvisit.prescription.PrescriptionList.length > 0
          ? this.props.patientvisit.prescription.PrescriptionList
          : [];
      // paperSetting.header == 0 ? this.props.setHeader(false) : this.props.setHeader(true);
      //paperSetting.footer == 0 ? this.props.setFooter(false) : this.props.setFooter(true);
      self.tempData["PaperSettings"] = paperSetting;
      self.tempData["Signature"] = Signature;
      self.tempData["Logo"] = Logo;
      self.tempData["PrescriptionList"] = PrescriptionList;
      self.tempData["DisplayLabel"] = DisplayLabel;
      if (this.props.doctorProfile.DoctorData.DisplayPreferences) {
        self.tempData[
          "DisplayPreferences"
        ] = this.props.doctorProfile.DoctorData.DisplayPreferences;
      }
      //this.printData={...this.tempData};
      this.props.tabDataStore(self.tempData);

      self.fixPaperSettings();

      this.printData = self.tempData;

      let data = [];
      this.props.setWebdata(data);
      this.showLoader();

      //this.reloadView();
      self.WebViewRef.current ? self.WebViewRef.current.reload() : null;
    });
    let refill =
      this.props.route.params &&
        this.props.route.params.refill
        ? this.props.route.params.refill
        : false;
    if (!refill) {
      this.onFabBtnClick();
    }
  }
  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;

    //
  }
  //Get Languages from Local DB
  getLanguages() {
    this.db.transaction((tx) => {
      tx.executeSql(
        "SELECT DATA FROM MasterData where Srno =17",
        [],
        (tx, results) => {
          let DataValue1 = results.rows.raw()[0];
          let values = JSON.parse(DataValue1.Data);

          this.Languages = values.Value;
        },
        (error) => { }
      );
    });
  }

  //Create Statement
  createRemarks(medicine, selectedlang) {
    let val = medicine.Therapy;
    const self = this;
    let languages = this.Languages; //this.props.patientvisitdetails;

    let mealValue = "",
      flowStatment = "",
      Meal = medicine.Intake.split(" ")[0],
      DoseFormValue = medicine.DosageForms,
      BrandGenericName = medicine.Generic, //need this
      DoseValue = medicine.Dose,
      NofDaysValue = medicine.StartFrom,
      DoseRegimeValue = medicine.DoseRegimen,
      therapySelected = val,
      brandSelected = medicine.BrandName;
    var stm = "";
    var regimes = Meal + " ";
    //DoseRegimeValue = DoseRegimeValue.split(' ').join('')

    if (DoseRegimeValue == "1/2 - 0 - 0") {
      DoseRegimeValue = "1-0-0";
    } else if (DoseRegimeValue == "0 - 1/2 - 0") {
      DoseRegimeValue = "0-1-0";
    } else if (DoseRegimeValue == "0 - 0 - 1/2") {
      DoseRegimeValue = "0-0-1";
    } else if (DoseRegimeValue == "0 - 1/2 - 1/2") {
      DoseRegimeValue = "0-1-1";
    } else if (DoseRegimeValue == "1/2 - 1/2 - 0") {
      DoseRegimeValue = "1-1-0";
    } else if (DoseRegimeValue == "1/2 - 0 - 1/2") {
      DoseRegimeValue = "1-0-1";
    } else if (
      DoseRegimeValue == "1/2 - 1/2 - 1/2" ||
      DoseRegimeValue == "2-1-1"
    ) {
      DoseRegimeValue = "1-1-1";
    }

    switch (DoseRegimeValue) {
      case "1-0-0":
        regimes = regimes + "breakfast";
        break;

      case "0-1-0":
        regimes = regimes + "lunch";
        break;

      case "0-0-1":
        regimes = regimes + "dinner";
        break;

      case "1-1-0":
        regimes = regimes + "breakfast + " + regimes + "lunch";
        break;

      case "0-1-1":
        regimes = regimes + "lunch + " + regimes + "dinner";
        break;

      case "1-0-1":
        regimes = regimes + "breakfast + " + regimes + "dinner";
        break;

      case "1-1-1":
        regimes =
          regimes + "breakfast + " + regimes + "lunch + " + regimes + "dinner";
        break;

      case "1-1-1-1":
        regimes = "Four times a day (1-1-1-1)";
        break;
      case "1-1-1-1-1":
        regimes = "Five times a day (1-1-1-1-1)";
        break;
      case "1-1-1-1-1-1":
        regimes = "Six times a day (1-1-1-1-1-1)";
        break;
      case "1-1-1-1-1-1":
        regimes = "Six times a day (1-1-1-1-1-1)";
        break;

      // case 'SOS':
      //     regimes = 'Six times a day (1-1-1-1-1-1)';
      //     break;
      default:
        regimes = DoseRegimeValue;
    }

    if (DoseFormValue === "Injection" || DoseFormValue === "Infusion") {
      flowStatment = "Injection/Infusion";
      stm = "As directed by the physician";
    } else if (
      DoseFormValue === "Powder (Topical)" ||
      DoseFormValue === "Cream" ||
      DoseFormValue === "Ointment" ||
      DoseFormValue === "Lotion" ||
      DoseFormValue === "Gel" ||
      DoseFormValue === "Shampoo" ||
      DoseFormValue === "Soap/Bar"
    ) {
      flowStatment = "PowderTopical";
      stm =
        "To be applied (topically) as directed by the physician(Not to be consumed orally)";
    } else if (
      DoseFormValue === "Drop" ||
      DoseFormValue === "Nasal Drops" ||
      DoseFormValue === "Ear Drops" ||
      DoseFormValue === "Eye Drops" ||
      DoseFormValue === "Oral Drops"
    ) {
      flowStatment = "Drop";
      stm = "As directed by the Physician";
    } else if (DoseFormValue === "Inhaler" || DoseFormValue === "Rotacap") {
      flowStatment = "Inhaler/Rotacap";
      stm = "As directed by the Physician";
    } else if (
      DoseFormValue === "Other" ||
      DoseFormValue === "Nebulizer" ||
      DoseFormValue === "Powder (Oral)"
    ) {
      stm = "As directed by the Physician";
    } else {
      //stm = regimes
    }
    if (Meal == "NA") {
      regimes = "As advised by Physician";
    }
    selectedlang = selectedlang || "English";
    selectedlang = languages.filter((i) => i.Name == selectedlang)[0];
    stm = stm.replace("BrandName", medicine.BrandName);
    stm = stm.replace("DoseForm", medicine.DosageForms);
    stm = stm.replace("DoseValue", medicine.Dose);
    stm = stm.replace("Regime", medicine.DoseRegimen);
    stm = stm.replace("Therapy", medicine.Therapy);
    var sen_eng = languages[0].Sentences.toString().toLowerCase().split(",");
    var rep_eng = languages[0].Replacements.toString().toLowerCase().split(",");
    if (stm == "") {
      stm = regimes.toLowerCase();
    }
    if (selectedlang && selectedlang.Name != "English") {
      stm = stm.toLowerCase();

      sen_eng.map((i) => {
        if (stm.indexOf(i) != -1) {
          stm = stm.replace(i, selectedlang.Sentences[sen_eng.indexOf(i)] || i);
        }
      });
      rep_eng.map((i, index) => {
        if (stm.indexOf(i) != -1) {
          stm = stm.replace(i, selectedlang.Replacements[index]);
          stm = stm
            .split("")
            .map((j) => j.replace(i, selectedlang.Replacements[index]))
            .join("");
        }
      });
    }
    return stm;
  }

  retryClick(isInternetOn) {
    if (isInternetOn) {
      this.setState({
        isInternetOn: true,
      });

      //alert("You are online!");
    } else {
      alert("You are offline!");
    }
    // alert('sad',isInternetOn)
  }

  rightSecondImageClick() {
    if (this.state.isSettingsClicked) {
      this.setState({ isSettingsClicked: false });
      this.modalsettings.close();
      this.props.resetTemplateData();
      this.setState({ reset: true }, () => {
        this.save();
      });
    } else {
      this.props.navigation.push("PatientNotes", {
        previous_screen: "PrintPreview",
        clearNotes: true,
      });
      // if (this.state.isFavPrescription) {
      //     this.saveQuickRx();
      // } else {
      //     this.modalfloatMenu.close()
      //     this.floatingAction.reset();
      //     this.modal2.open()
      // }
    }
  }

  saveQuickRx() {
    let { rxid, saveQuickRxFavourites, IsFavourite } = this.props;
    let data = {
      IsFavourite: this.state.isFavPrescription ? 0 : 1,
      Favourite: this.state.favNamePopup,
      WhenFavourite: new Date().toISOString(),
    };
    saveQuickRxFavourites(rxid, data).then(({ payload, error }) => {
      if (error) {
        this.setState({
          showToast: true,
          toastImagePath: Images.Error,
          toastBgColor: "#d9541d",
          toastTextColor: "#fffefe",
          description: "Some error occurred.",
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 2000);
        //  Toast.show({ text: "Some error occurred.", position: 'bottom' })
        this.modal2.close();
        this.setState({
          isFavPrescription: false,
          //  favNamePopup :''
        });
      } else if (payload.data && payload.status == 200) {
        this.setState({
          showToast: true,
          toastImagePath: Images.Success,
          toastBgColor: "#29b62f",
          toastTextColor: "#fafdfa",
          description: "Saved Successfully.",
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 2000);
        //  Toast.show({ text: "Saved Successfully.", position: 'bottom' })

        this.modal2.close();

        this.setState({
          isFavPrescription: !this.state.isFavPrescription,
          favNamePopup: "",
        });
      }
    });
  }

  addLabel(callFrom) {
    switch (callFrom) {
      case "add":
        if (this.state.favNamePopup == "") {
          Alert.alert("Please enter name for favourite");
        } else {
          // this.props.rxid

          this.saveQuickRx();
        }

        break;
      case "skip":
        this.modal2.close();

        break;

      default:
        break;
    }
  }

  // float button state change
  onFabBtnClick() {
    this.setState({ fabClick: true }, () => {
      if (this.state.fabClick) {
        this.modalfloatMenu.open();
      }
    });
  }

  changeStateMenu() {
    if (this.state.fabClick) {
      this.setState({ fabClick: false }, () => {
        //this.floatingAction.reset();

        this.modalfloatMenu.close();
        this.floatingAction.reset();
      });
      // this.floatingAction.reset();
    }
    if (!this.state.isSettingsClicked) {
      this.setState({ editShow: !this.state.editShow });
    } else {
      this.setState({ isSettingsClicked: false }, () => {
        this.uploadSignature();
      });
    }
  }

  onDiscard(patientid, data) {
    this.props.deletePatientVisit(patientid, data).then((response) => {
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
          editShow: !this.state.editShow,
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
      } else if (response.payload.data.status == 2000) {
        this.setState({ editShow: !this.state.editShow });
        let referName = { Lab: null, Pharma: null, Specialist: null };
        this.props.setlab(referName);
        this.setState({
          showToast: true,
          toastImagePath: Images.Success,
          toastBgColor: "#29b62f",
          toastTextColor: "#fafdfa",
          description: `patient visit ${response.payload.data.message}`,
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 2000);
        this.props.navigation.navigate("PatientVisitHistoryContainer");

      } else {
        this.setState({ editShow: !this.state.editShow });
        this.setState({
          showToast: true,
          toastImagePath: Images.Error,
          toastBgColor: "#d9541d",
          toastTextColor: "#fffefe",
          description: `Something went wrong`,
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 2000);
        // Toast.show({ text: `Something went wrong`, duration: 1000, position: 'bottom' })
      }
    });
  }

  async onShare(data) {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      " " +
      this.props.doctorProfile.DoctorData.DoctorLName,
      "shared_rx"
    );
    this.props.webdata;
    this.setState({ editShow: !this.state.editShow });

    let fileNameAdd = this.props.patientvisit.patientVisitId + "_" + new Date().getTime();
    let options = {
      html: data,
      fileName: "rx_" + fileNameAdd,
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
  //Scan QR
  SocketIO() {
    let socket_url = isStagging ? staging.socket : prod.socket;
    this.socketConnection = io(
      socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050/"
    );
    const self = this;
    this.socketConnection.on("connect", function (data) {
      if (this.socketConnection && this.socketConnection.connected) {
        this.socketConnection.emit("room", self.state.doctordata._id);
        this.socketConnection.emit("CheckActiveLogins", {
          DocId: this.props.doctorProfile.DoctorData._id,
        });
      }
    });

    this.socketConnection.on("ReceiveComfirmation", function (data) {
      self.setState({
        deskActive: true,
      });
    });
  }
  callSockettoprint() {
    let arr =
      this.state.getDataFromTab &&
        Object.keys(this.state.getDataFromTab).length > 0
        ? this.state.getDataFromTab
        : this.state.templateData;
    let PaperSettings = arr.PaperSettings;
    var data = {
      header: PaperSettings.header,
      body: PaperSettings.body,
      footer: PaperSettings.footer,
      patientid: this.props.rxid, //(this.props.patientvisitdetails.PatientVisitsMaster1._id) ? this.props.patientvisitdetails.PatientVisitsMaster1._id : this.props.patientvisitdetails.PatientVisitsMaster1._id,
      DocId: this.props.doctorProfile.DoctorData._id,
      FullName: this.props.patientname,
    };
    this.socketConnection.emit("SendDataToPrint", data);
    this.socketConnection.disconnect();
  }
  onscanned() {
    this.setState({
      deskActive: true,
    });
  }
  scanQrCode() {
    this.setState({ editShow: false });
    //alert('Scan Qr Code');
    this.props.navigation.push("ScanQrCode", {
      SockConobj: this.socketConnection,
      returnScanData: this.onscanned,
      DocId: this.props.doctorProfile.DoctorData._id,
    });
  }

  //Menu navigation
  navigateMenu(item) {
    // this.setState({ editShow: false })
    switch (item) {
      case "Settings":
        let DisplayLabel = JSON.parse(
          JSON.stringify(this.props.doctorProfile.DoctorData.DisplayLabel)
        );
        let papersettings = JSON.parse(
          JSON.stringify(this.props.doctorProfile.DoctorData.PaperSettings)
        );
        DisplayLabel = { ...this.DisplayLabel, ...DisplayLabel };
        this.tempData["DisplayLabel"] = DisplayLabel;
        this.tempData["PaperSettings"] = papersettings;
        this.props.tabDataStore(this.tempData);

        this.setState(
          {
            editShow: !this.state.editShow,
            isSettingsClicked: true,
            fabClick: false,
            tabSwitch: 0,
          },
          () => {
            this.modalsettings.open();

            setTimeout(() => {
              this.setState({
                openTooltip: true,
              });
            }, 1000);
            this.modalfloatMenu.close();
            this.floatingAction.reset();
            //this.props.navigation.navigate('PrescriptionPreviewSetting')
          }
        );

        break;
      case "Discard":
        Alert.alert(
          "Prescrip",
          "Do you want to dicard the prescription? It won't available once discarded",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () =>
                this.onDiscard(this.props.rxid, {
                  action: 0,
                  doctorId: this.props.doctorProfile.DoctorData._id,
                  PatientName: this.props.patientname,
                }),
            },
          ]
        );

        break;
      case "Share":
        this.onShare(this.props.webdata[0]);
        break;
      case "Print using QR Code":
        this.scanQrCode();
        break;
      default:
        this.setState({ editShow: false });
    }
  }

  menuArray() {
    return this.state.arrayItem.map((item, index) => {
      return (
        <MenuOption
          key={"menu" + index.toString()}
          customStyles={{ height: 48, width: 100 }}
          onSelect={() => this.navigateMenu(item)}
        >
          <Text
            style={{
              margin: 5,
              color: index == 2 ? "tomato" : "#666666",
              fontFamily: "NotoSans",
            }}
          >
            {item}
          </Text>
        </MenuOption>
      );
    });
  }

  leftImageOnClick() {
    this.setState({ dataChanged: false, reset: false });
    multipleTapHandler.clearNavigator();
    if (this.state.isSettingsClicked) {
      this.setState({ isSettingsClicked: false }, () => {
        this.modalsettings.close();
        this.floatingAction.reset();
      });
    } else if (this.state.fabClick) {
      this.setState({ fabClick: false }, () => {
        //this.floatingAction.reset();

        this.modalfloatMenu.close();
        this.floatingAction.reset();
      });
      // this.floatingAction.reset();
    } else {
      this.props.navigation.goBack(null);
    }
  }

  // function for onPress Menu button to show Menu Modal

  // function for onPress Menu button to show Menu Modal

  onFinishClick = (callFrom) => {
    let analyticsValue =
      callFrom == "finish"
        ? "prescription_created"
        : callFrom == "print"
          ? "prescription_print"
          : "saved_draft";
    if (analyticsValue) {
      logAnalytics(
        this.props.doctorProfile.DoctorData._id,
        this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
        analyticsValue
      );
    }
    AsyncStorage.getItem("registered_doctor").then((registered_doctor) => {
      if (registered_doctor) {
        if (analyticsValue) {
          logAnalytics(
            this.props.doctorProfile.DoctorData._id,
            this.props.doctorProfile.DoctorData.DoctorFName +
            " " +
            this.props.doctorProfile.DoctorData.DoctorLName,
            "registered_prescription_created"
          );
          AsyncStorage.removeItem("registered_doctor");
        }
      }
    });

    if (callFrom != "print") {
      this.setState({
        prescriptionSaveloading: true,
      });
    }

    let { prescription, referName } = this.props;

    if (referName.Lab != null) {
      prescription.ReferredPathLabDetails = {
        Name: referName.Lab.Name,
        Mobile: referName.Lab.Mobile,
        Email: referName.Lab.Email,
        Address: referName.Lab.Address,
      };
    }
    if (referName.Pharma != null) {
      prescription.ReferredPharmacyDetails = {
        Name: referName.Pharma.Name,
        Mobile: referName.Pharma.Mobile,
        Email: referName.Pharma.Email,
        Address: referName.Pharma.Address,
      };
    }

    if (referName.Specialist != null) {
      prescription.ReferredDoctorDetails = {
        Name: referName.Specialist.Name,
        Mobile: referName.Specialist.Mobile,
        Email: referName.Specialist.Email,
        Address: referName.Specialist.Address,
      };
    }

    this.props.addToPrescription([]);
    let Investigation = [];
    let Findings = [];
    let Dosages = [];
    let ChiefComplaints = [];

    let Dose = [];
    let DosageRegimen = [];
    let Therapy = [];

    prescription.PrescriptionList.forEach((element) => {
      Dosages.push([
        element.DosageForms,
        element.BrandName,
        element.Dose,
        element.DoseRegimen,
        element.Therapy,
      ]);
    });

    prescription.Investigation.forEach((element) => {
      Investigation.push(element.Name);
    });
    prescription.Findings.forEach((element) => {
      Findings.push(element.Name);
    });

    prescription.ChiefComplaints.forEach((element) => {
      ChiefComplaints.push(element.Name);
    });

    prescription.PrescriptionList.forEach((element) => {
      DosageRegimen.push(element.DoseRegimen);
      Therapy.push(element.Therapy);
    });
    if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
      prescription.DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
      prescription.DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
    }
    prescription.SentTOAbdhm = 0;
    let rxData = {
      Diagnosis: prescription.Diagnosis,
      Findings: Findings,
      Investigation: Investigation,
      LabTest: prescription.RecommendedLabTest,
      Dose: Dosages,
    };

    let rxDataForMostUsed = [
      ["Diagnosis", prescription.Diagnosis],
      ["Findings", Findings],
      ["Investigation", Investigation],
      ["RecommendedLabTest", prescription.RecommendedLabTest],
      ["Advice", prescription.Advice],
      ["Dose", prescription.PrescriptionList],
      ["DoseTherapy", Therapy],
      ["ChiefComplaints", ChiefComplaints],
      ["DosageRegimen", DosageRegimen],
    ];

    const sugg_data = {
      step: callFrom == "quick" ? 1 : 2,
      prescriptionObject: prescription,
      rxData: rxData,
      searchArray: ChiefComplaints,
      printClickCount: this.props.printClickCount,
    };

    this.props
      .create_update_prescription(sugg_data)
      .then(({ payload, error }) => {
        if (error) {
          this.setState({
            showToast: true,
            toastImagePath: Images.Error,
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            description: "Some error occurred.",
          });
          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
              prescriptionSaveloading: false,
            });
          }, 2000);
        } else {
          let finalPrescription = JSON.parse(
            JSON.stringify(this.props.patientvisit.prescription)
          );
          finalPrescription.url = payload.data.url;
          this.props.setPrescription(finalPrescription);
          finalPrescription = null;

          rxDataForMostUsed.forEach((element) => {
            this.returnSortedData1(element[0], "MostUsed", (mostUsed) => {
              //  this.returnSortedData1("ChiefComplaints", "MostUsed", (mostUsed) => {
              if (element[0] != "Dose") {
                var searchArray = [];
                //most used returns array from mostused table with repective table name

                element[1].forEach((mostUsedTestelement) => {
                  searchArray.push(mostUsedTestelement);
                });

                mostUsed.forEach((mostUsedelement) => {
                  for (let index = 1; index <= mostUsedelement[1]; index++) {
                    searchArray.push(mostUsedelement[0]);
                  }
                });
                var suggesstionFromLocal = null;
                if (
                  element[0] == "DoseTherapy" ||
                  element[0] == "DosageRegimen"
                ) {
                  suggesstionFromLocal = this.getUniqueChiefComplaints(
                    searchArray,
                    25
                  );
                } else {
                  suggesstionFromLocal = this.getUniqueChiefComplaints(
                    searchArray,
                    5
                  );
                }

                if (searchArray.length > 0) {
                  this.updateMostUsedTable(
                    element[0],
                    this.props.doctorProfile.DoctorData._id,
                    suggesstionFromLocal
                  );
                }
              } else {
                //Parsing of Dosage

                mostUsed = mostUsed ? mostUsed : {};
                element[1].map((med) => {
                  if (mostUsed[med.DosageForms]) {
                    let array = mostUsed[med.DosageForms];
                    let drug = null;
                    let drug_index = array.findIndex((brand) => {
                      if (
                        brand.BrandName.trim().toLowerCase() ==
                        med.BrandName.trim().toLowerCase()
                      ) {
                        return brand;
                      }
                    });
                    drug = array[drug_index];
                    if (drug) {
                      let doses = [];
                      drug.Dose.map((d) => {
                        // for(let i=0;i<d[1];i++){
                        //     doses.push(d[0]);
                        // }
                        doses = [...doses, ...Array(d[1]).fill(d[0])];
                      });
                      doses.push(med.Dose);
                      doses = this.getUniqueChiefComplaints(doses, 25);
                      drug.BrandNameCount++;
                      drug.Dose = doses;
                      array[drug_index] = drug;
                    } else {
                      let drug_na = {
                        BrandName: med.BrandName,
                        Dose: [[med.Dose, 1]],
                        BrandNameCount: 1,
                      };
                      array.push(drug_na);
                    }
                    mostUsed[med.DosageForms] = [...array];
                    array = null;
                  } else {
                    mostUsed[med.DosageForms] = [];
                    let drug_new = {
                      BrandName: med.BrandName,
                      Dose: [[med.Dose, 1]],
                      BrandNameCount: 1,
                    };
                    mostUsed[med.DosageForms].push(drug_new);
                  }
                });

                if (callFrom != "quick") {
                  this.updateMostUsedTable(
                    element[0],
                    this.props.doctorProfile.DoctorData._id,
                    mostUsed
                  );
                }
              }
            });
          });

          if (callFrom == "print") {
            this.props.setPrintClickCount(
              parseInt(this.props.printClickCount) + 1
            );
            this.printHTML(
              this.props.webdata[0],
              this.state.templateData.PaperSettings
            );
          } else {
            this.setState({
              prescriptionSaveloading: false,
            });
            this.callSockettoprint();
            this.props.setPrintClickCount(1);
            this.props.resetOpthalData();
            if (callFrom == "quick") {
              multipleTapHandler.clearNavigator(),
                this.props.navigation.navigate("PatientVisitHistoryContainer");
            } else {
              this.props.navigation.push("FinalPrescriptionContainer", {
                item: "Prescription",
              });
            }
          }

          // navigation.pop();
        }
      });
  };

  getUniqueChiefComplaints(array, count) {
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
    var fnal = arr.slice(0, count);
    return fnal;
  }

  returnSortedData1(key, tableName, _callback) {
    const self = this;
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(
        "SELECT " +
        key +
        ", LastCloudSync FROM " +
        tableName +
        " where DoctorID = '" +
        self.props.doctorProfile.DoctorData._id +
        "'",
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            let brandDataValue1 = results.rows.raw()[0];

            switch (key) {
              case "Findings":
                _callback(
                  !brandDataValue1.Findings
                    ? []
                    : JSON.parse(brandDataValue1.Findings)
                );

                break;

              case "Investigation":
                _callback(
                  !brandDataValue1.Investigation
                    ? []
                    : JSON.parse(brandDataValue1.Investigation)
                );
                break;
              case "Diagnosis":
                _callback(
                  !brandDataValue1.Diagnosis
                    ? []
                    : JSON.parse(brandDataValue1.Diagnosis)
                );
                break;

              case "RecommendedLabTest":
                _callback(
                  !brandDataValue1.RecommendedLabTest
                    ? []
                    : JSON.parse(brandDataValue1.RecommendedLabTest)
                );
                break;

              case "Advice":
                _callback(
                  !brandDataValue1.Advice
                    ? []
                    : JSON.parse(brandDataValue1.Advice)
                );
                break;

              case "ChiefComplaints":
                _callback(
                  !brandDataValue1.ChiefComplaints
                    ? []
                    : JSON.parse(brandDataValue1.ChiefComplaints)
                );
                break;
              case "DosageRegimen":
                _callback(
                  !brandDataValue1.DosageRegimen
                    ? []
                    : JSON.parse(brandDataValue1.DosageRegimen)
                );
                break;
              case "DoseTherapy":
                _callback(
                  !brandDataValue1.DoseTherapy
                    ? []
                    : JSON.parse(brandDataValue1.DoseTherapy)
                );
                break;
              case "Dose":
                _callback(
                  !brandDataValue1.Dose
                    ? null
                    : JSON.parse(brandDataValue1.Dose)
                );
                break;

              default:
                _callback([]);
                break;
            }
          } else {
            _callback([]);
          }
        },
        (error) => {
          _callback([]);
        }
      );
    });
  }

  updateMostUsedTable(key, doctorId, final_Data) {
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
              //  alert(key + " Updated successfully");
              //self.getChiefComplients()
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  /*
    onFinishClick = () => {
     
        this.props.isFinish(this.props.rxid).then(({ payload, error }) => {
            if (error) {
                this.setState({ 
                          showToast5: true ,
                         description :"Some error occurred."
                        })
                        setTimeout(() => {
                            this.setState({
                                showToast : false,
                                loading: false
                            })
                          }, 2000);
            } else {
                this.callSockettoprint();
                this.props.navigation.push('FinalPrescriptionContainer')
        
             // navigation.pop();
            }
        });
    }
    */
  //
  floatnavigation(val, index) {
    this.modalClose();
    let type = val.name;
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
      suggestname,
      Pharmacy,
      suggesticon,
      colorCode,
    } = this.props;
    let nextscreenname = "";
    switch (type) {
      case "Recommend Lab Test":
        type = "RecommendedLabTest";
        displayname = "Lab Test";
        nextscreenname = "RecommendedLabTestContainer";
        defaultlabel = "Suggested";
        mdata = RecommendedLabTest || [];
        Srno = 11;
        subtext = "RECOMMEND LAB TESTS";
        suggesticon = SuggestLab_Pink_btn;
        suggestname = "Suggest Laboratory";

        colorCode = "#f21c68";
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          this.redirectSpecific(
            nextscreenname,
            type,
            displayname,
            defaultlabel,
            subtext,
            Srno,
            mdata,
            suggestname,
            colorCode,
            suggesticon
          );
        });
        break;
      case "RecommendedLabTest":
        type = "RecommendedLabTest";
        displayname = "Lab Test";
        nextscreenname = "RecommendedLabTestContainer";
        subtext = "RECOMMEND LAB TESTS";
        defaultlabel = "Suggested";
        suggestname = "Suggest Laboratory";
        mdata = RecommendedLabTest || [];
        Srno = 11;
        suggesticon = SuggestLab_Pink_btn;
        colorCode = "#f21c68";
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          this.redirectSpecific(
            nextscreenname,
            type,
            displayname,
            defaultlabel,
            subtext,
            Srno,
            mdata,
            suggestname,
            colorCode,
            suggesticon
          );
        });
        break;

      case "Provide Advice":
        type = "Advice";
        displayname = "Advice";
        nextscreenname = "AdviceContainer";
        defaultlabel = "Referred Doctor";
        suggestname = "Refer to Specialist";
        subtext = "ANY ADVICE FOR " + patientname + "?";
        mdata = Advice || [];
        Srno = 13;
        suggesticon = Refer_Green_icon;
        colorCode = "#1DB07A";
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          this.redirectSpecific(
            nextscreenname,
            type,
            displayname,
            defaultlabel,
            subtext,
            Srno,
            mdata,
            suggestname,
            colorCode,
            suggesticon
          );
        });
        break;

      case "Set follow Up Date":
        type = "Followup";
        displayname = "Followup";
        nextscreenname = "FollowUpContainer";
        defaultlabel = "Suggested";
        subtext = "ANY Followup FOR " + patientname + "?";
        mdata = Advice || [];
        Srno = 13;
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          navigation.push(nextscreenname, { previous_screen: "PrintPreview" });
        });
        // this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata)
        break;

      case "Add Medication":
        this.props.resetMedicine();
        type = "Pharmacy";
        displayname = "Pharmacy";
        nextscreenname =
          this.props.patientvisit.prescription.PrescriptionList.length > 0
            ? "ListMedication"
            : "SelectMedication";
        defaultlabel = "Suggested";
        subtext = "RECOMMEND PHARMACY";
        mdata = Pharmacy || [];
        Srno = 11;
        suggesticon = null;
        colorCode = "#f21c68";
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          this.redirectSpecific(
            nextscreenname,
            type,
            displayname,
            defaultlabel,
            subtext,
            Srno,
            mdata,
            suggestname,
            colorCode,
            suggesticon
          );
        });
        break;
      case "Add Notes":
        type = "PatientNotes";
        displayname = "PatientNotes";
        nextscreenname = "PatientNotes";
        defaultlabel = "Suggested";
        subtext = "PatientNotes";
        suggesticon = null;
        colorCode = "#f21c68";
        this.setState({ fabClick: false }, () => {
          this.floatingAction.reset();
          this.redirectSpecific(
            nextscreenname,
            type,
            displayname,
            defaultlabel,
            subtext,
            Srno,
            mdata,
            suggestname,
            colorCode,
            suggesticon
          );
        });
        break;

      case "Add Clinic Logo":
        this.setState({ isSettingsClicked: true, tabSwitch: 4 }, () => {
          this.modalsettings.open();
        });
        break;

      case "Add Digital Signature":
        this.setState({ isSettingsClicked: true, tabSwitch: 5 }, () => {
          this.modalsettings.open();
        });
        break;
      // this.props.navigation.navigate('ListMedication');
      // break;
      default:
        type = "";
        break;
      //     type = 'ChiefComplaints'
      //     displayname = 'Complaints'
      //     nextscreenname = 'ChiefComplaintContainer'
      //     mdata = ChiefComplaints || []
      //     Srno = 8
      //     defaultlabel = 'Past Complaints'
      //     subtext = "what are " + patientname + " " + displayname + "? "
    }
  }

  redirectSpecific(
    nextscreenname,
    type,
    displayname,
    defaultlabel,
    subtext,
    Srno,
    mdata,
    suggestname,
    colorCode,
    suggesticon
  ) {
    this.floatingAction.reset();
    this.modalfloatMenu.close();
    let { navigation, setPatientVisitKeyData, setAttachmentData } = this.props;
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

    navigation.push(nextscreenname, { previous_screen: "PrintPreview" });
  }

  // function for onPress float button to show Modal
  bindfloatBtn() {
    var content = this.state.arrayModalItem.map((item, index) => {
      if (
        item.name == "Add Clinic Logo" &&
        this.props.doctorProfile.DoctorData.Logo
      ) {
        return null;
      } else if (
        item.name == "Add Digital Signature" &&
        this.props.doctorProfile.DoctorData.Signature
      ) {
        return null;
      } else {
        return (
          <TouchableOpacity
            onPress={() => this.floatnavigation(item, index)}
            key={"floatBtn" + index.toString()}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              borderBottomColor:
                item.name == "Provide Advice" ? "#cccccc" : null,
              borderBottomWidth: item.name == "Provide Advice" ? 0.7 : null,
            }}
          >
            <View
              style={{
                flex: 0.2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={item.img}
                style={{ resizeMode: "contain", height: 30 }}
              />
            </View>
            <View style={{ flex: 0.8, justifyContent: "center" }}>
              <Text
                style={{ fontSize: 18, alignItems: "center", color: "#3f3e3e" }}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });
    return content;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    if (this.filepath != "") {
      RNFS.unlink(this.filepath);
    }
  }
  DetectOrientation() {
    if (this.state.Width_Layout > this.state.Height_Layout) {
      // Write Your own code here, which you want to execute on Landscape Mode.

      this.setState({
        OrientationStatus: "Landscape Mode",
      });
    } else {
      // Write Your own code here, which you want to execute on Portrait Mode.

      this.setState({
        OrientationStatus: "Portrait Mode",
      });
    }
  }
  changebackdropState() {
    this.setState({ fabClick: !this.state.fabClick });
    return true;
  }

  async printHTML(data, pSets) {
    if (!data) {
      Alert.alert("Prescrip", "Unable to print this prescription");
      return;
    }
    try {
      if (Platform.OS === "android") {
        await RNPrint.print({ html: data});
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
  onDataChange(data) {
    this.printData = data;
  }
  setImagePath(path) {
    this.imagePath = path;
  }
  uploadSignature() {
    if (this.imagePath) {
      this.guid = generateGuid();
      let file = {
        uri: this.imagePath,
        name: this.guid + ".jpeg",
        type: "image/jpeg",
      };
      RNS3.put(file, config).then((response) => {
        if (response.status == 201) {
          this.Signature = file.name;
          let settings = this.props.previewReducer.templateData;
          settings.Signature = this.Signature;
          this.props.tabDataStore(settings);
          this.imagePath = null;
          this.save();
        }
      });
    } else {
      this.save();
    }
  }
  fixPaperSettings() {
    let paperSettings = {
      ...this.props.doctorProfile.DoctorData.PaperSettings,
    };
    let { onTemplateSave, rxid } = this.props;
    let arr = [];

    let newMargin = [...paperSettings.Margin];
    var res = newMargin.every(function (element) {
      return typeof element === "number";
    });
    if (res) {
      newMargin = newMargin.map((m) => {
        return m.toString();
      });
      paperSettings.Margin = newMargin;
      arr = JSON.parse(JSON.stringify(this.state.templateData));
      arr.PaperSettings = { ...paperSettings };
      delete arr.DisplayLabel["DisplayGenericName"];
      delete arr.DisplayLabel["DigitalImageSignature"];
      delete arr.DisplayLabel["DoctorDetails"];
      onTemplateSave(rxid, arr).then(({ payload, error }) => {
        delete arr["doctorId"];
        if (payload.data.status == 1) {
          let doctorData = JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData)
          );

          doctorData.PaperSettings = arr.PaperSettings;

          this.props.setDoctorData(doctorData);
        }
      });
    } else {
      return;
    }
  }

  onDataResetToDefault() {
    this.setState({
      showToast: true,
      toastImagePath: Images.Success,
      toastBgColor: "#29b62f",
      toastTextColor: "#fafdfa",
      updatedData: { ...this.state.updatedData },

      description: "Settings reset successfully",
    });
  }
  save() {
    try {
      let self = this;
      let { previewReducer, onTemplateSave, navigation, rxid } = this.props;

      //let arr = Object.keys(previewReducer.templateData).length > 0 ? previewReducer.templateData : this.state.templateData
      // let arr = this.state.getDataFromTab!=null ? this.state.getDataFromTab : previewReducer.templateData
      let arr = [];
      let header = 0;
      let footer = 0;
      if (this.state.reset) {
        this.props.setHeader(true);
        this.props.setFooter(true);
        arr = JSON.parse(JSON.stringify(this.state.templateData));
      } else {
        this.props.previewReducer.templateData.DisplayPreferences;
        arr = JSON.parse(JSON.stringify(this.printData)); //previewReducer.templateData;
        arr["doctorId"] = this.props.doctorProfile.DoctorData._id;
        arr["Logo"] =
          previewReducer.templateData["Logo"] != ""
            ? previewReducer.templateData["Logo"]
            : this.props.doctorProfile.DoctorData.Logo
              ? this.props.doctorProfile.DoctorData.Logo
              : "";
        arr["Signature"] =
          previewReducer.templateData["Signature"] != ""
            ? previewReducer.templateData["Signature"]
            : this.props.doctorProfile.DoctorData.Signature
              ? this.props.doctorProfile.DoctorData.Signature
              : "";
      }
      //Set Paper Settings to prescription
      //Set Paper Settings to prescription
      let upDatePaperSettings = { ...arr.PaperSettings };
      let newMargin = [...upDatePaperSettings.Margin];
      newMargin = newMargin.map((m) => {
        return m.toString();
      });
      upDatePaperSettings.Margin = [...newMargin];
      arr.PaperSettings = { ...upDatePaperSettings };
      let prescription = JSON.parse(JSON.stringify(this.props.prescription));
      prescription.PaperSettings = arr.PaperSettings;
      prescription.DisplayPreferences = arr.DisplayPreferences;
      if (prescription.Language != arr.Language) {
        //Change Remarks
        let medicines = prescription.PrescriptionList.map((med) => {
          med.Remarks = this.createRemarks(med, arr.Language);

          return med;
        });
        prescription.PrescriptionList = medicines;
        prescription.Language = arr.Language;
      }

      delete arr.DisplayLabel["DisplayGenericName"];
      delete arr.DisplayLabel["DigitalImageSignature"];
      delete arr.DisplayLabel["DoctorDetails"];
      prescription.DoctorHeaderDetails.DisplayLabel = arr.DisplayLabel;
      if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
        prescription.DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
        prescription.DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
      }

      prescription.DoctorHeaderDetails.Signature = arr.Signature;
      prescription.DoctorHeaderDetails.Logo = arr.Logo;

      this.props.setPrescription(prescription);
      //After setting prescription set Arr object
      if (!this.state.reset) {
        header =
          arr.PaperSettings.header != 0
            ? arr.PaperSettings.header
            : this.props.doctorProfile.DoctorData.PaperSettings.header;
        footer =
          arr.PaperSettings.footer != 0
            ? arr.PaperSettings.footer
            : this.props.doctorProfile.DoctorData.PaperSettings.footer;
        arr.PaperSettings.header = this.props.doctorProfile.showHeader
          ? header == 0
            ? 1
            : header
          : 0;
        arr.PaperSettings.footer = this.props.doctorProfile.showFooter
          ? footer == 0
            ? 1
            : footer
          : 0;
      }
      this.modalsettings.close();
      let data = [];
      this.props.setWebdata(data);
      this.showLoader();
      self.WebViewRef.current ? self.WebViewRef.current.reload() : null;
      //this.reloadView();
      onTemplateSave(rxid, arr).then(({ payload, error }) => {
        delete arr["doctorId"];
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
            toastImagePath: Images.Error,
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            showToast: true,
            //  description: 'Some error occured'
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          }, 2000);
          // Toast.show({ text: 'Some error occured', duration: 1000, position: 'bottom' })
          this.modalsettings.close();
        } else if (payload.data.status == 1) {
          let doctorData = JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData)
          );
          doctorData["Signature"] = arr.Signature; //?arr.Signature:doctorData["Signature"]?doctorData["Signature"]:"";
          doctorData.Logo = arr.Logo
            ? arr.Logo
            : doctorData.Logo
              ? doctorData.Logo
              : "";
          doctorData.DisplayLabel = arr.DisplayLabel;

          arr.PaperSettings.header =
            header == 0 ? doctorData.PaperSettings.header : header;
          arr.PaperSettings.footer =
            footer == 0 ? doctorData.PaperSettings.footer : footer;
          doctorData.PaperSettings = arr.PaperSettings;
          doctorData["DisplayPreferences"] = [...arr.DisplayPreferences];

          self.state.reset
            ? this.onDataResetToDefault()
            : self.setState({
              updatedData: JSON.parse(
                JSON.stringify(self.props.previewReducer.templateData)
              ),

              showToast: true,
              toastImagePath: Images.Success,
              toastBgColor: "#29b62f",
              toastTextColor: "#fafdfa",
              description: "Settings updated successfully",
            });

          self.props.setDoctorData(doctorData);
          this.props.tabDataStore(arr);

          this.forceUpdate();
          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          }, 2000);

          // navigation.pop();
          this.modalsettings.close();
          //this.forceUpdate();
        } else {
          !this.state.isSettingsClicked
            ? this.setState({
              showToast: true,
              description: payload.data,
              toastImagePath: Images.Error,
              toastBgColor: "#d9541d",
              toastTextColor: "#fffefe",
            })
            : null;

          setTimeout(() => {
            this.setState({
              showToast: false,
            });
          }, 2000);
          this.modalsettings.close();
        }
        this.setState({ reset: false, dataChanged: false });
      });
    } catch (err) {
      this.setState({
        toastImagePath: Images.Error,
        toastBgColor: "#d9541d",
        toastTextColor: "#fffefe",
        showToast: true,
        description: "Some error occured",
      });
    }
  }

  handleerror(err) { }

  modalClose() {
    this.setState({ fabClick: false }, () => {
      //this.floatingAction.reset();

      this.modalfloatMenu.close();
    });
    this.floatingAction.reset();
  }
  showLoader() {
    if (this.web) {
      this.web.showRxLoader();
    }
  }
  reloadView() {
    if (this.web) {
      this.web.resetWebViewToInitialUrl();
    }
  }
  dismissMenu() {
    if (this.state.editShow) {
      this.setState({
        editShow: false,
      });
    }
  }

  modalHeight() {
    let Dim = Dimensions.get("screen");
    if (
      this.props.doctorProfile.DoctorData.Logo &&
      this.props.doctorProfile.DoctorData.Signature
    ) {
      return Dim.width >= Dim.height ? 400 : 350;
    } else if (
      this.props.doctorProfile.DoctorData.Logo ||
      this.props.doctorProfile.DoctorData.Signature
    ) {
      return Dim.width >= Dim.height ? 450 : 400;
    } else {
      return Dim.width >= Dim.height ? 550 : 500;
    }
  }

  setDataFromChild(data) {
    if (data == "Logo") {
      let val = {
        img: "",
        name: "Add Clinic Logo",
      };
      this.floatnavigation(val);
    } else {
      let val = {
        img: "",
        name: "Add Digital Signature",
      };
      this.floatnavigation(val);
    }
  }

  render() {
    // const spin = { transform: [{ scale: this.spinValue }] }
    // const rotate = this.mode.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ["0deg", "45deg"]
    // })
    var dim = Dimensions.get("screen");

    return (
      <Container
        style={{ flex: 1 }} >
        <StatusBar translucent backgroundColor="#ffffff" />
        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: "80%",
            height: 180,
            overflow: "hidden",
            justifyContent: "center",
          }}
          ref={(ref) => this.modal2 = ref}

          position={"center"}
          //swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View
              style={{
                padding: 15,
                paddingBottom: 0,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#212121", fontSize: 20 }}>
                Favourite Name
              </Text>
            </View>
            <View
              style={{
                padding: 15,
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Item stackedLabel style={{}}>
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "#545454",
                    fontSize: 15,
                  }}
                >
                  Enter the name
                </Text>

                <Input
                  autoFocus
                  onChangeText={(text) => {
                    this.setState({ favNamePopup: text });
                  }}
                  defaultValue={
                    this.state.favNamePopup != null
                      ? this.state.favNamePopup
                      : ""
                  }
                  style={[
                    {
                      fontSize: 17,
                      color: "#404040",
                      margin: 0,
                      padding: 0,
                      height: "auto",
                      borderBottomColor: "#d3d3d3",
                      borderBottomWidth: 1,
                      height: 40,
                      left: -3,
                      borderBottomWidth: 0,
                    },
                  ]}
                  keyboardType="default"
                  returnKeyType={"next"}
                />
              </Item>
            </View>
            <View style={{ flexDirection: "row", flex: 0.5 }}>
              <View
                style={[
                  {
                    flexDirection: "row",
                    paddingRight: 0,
                    flex: 1,
                    justifyContent: "flex-end",
                    marginRight: 15,
                    alignSelf: "stretch",
                    paddingTop: 0,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => this.addLabel("add")}>
                  <Text
                    style={[
                      {
                        color: "#008bdf",
                        fontSize: 17,
                        lineHeight: 20,
                        letterSpacing: 0.5,
                        paddingRight: 30,
                        fontSize: 15,
                      },
                    ]}
                  >
                    Add as Favourite
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addLabel("skip")}>
                  <Text
                    style={[
                      {
                        color: "#7f7f7f",
                        fontSize: 17,
                        lineHeight: 20,
                        letterSpacing: 0.5,
                        fontSize: 15,
                      },
                    ]}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {this.state.prescriptionSaveloading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
              position: "absolute",
            }}
          >
            <PrescriptionLoader {...this.props} type={"Saving Prescription"} />
          </View>
        ) : null}

        {!this.state.isInternetOn ? (
          <View
            style={{
              flex: 1,
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
              retryClick={(isInternetOn) => this.retryClick(isInternetOn)}
            />
          </View>
        ) : null}

        <SafeAreaView>
          {this.state.loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                style={{ width: "100%" }}
                source={prescrip_loader_4}
                loop={true}
                autoPlay={true}
                ref={(animation) => {
                  this.animation = animation;
                }}
              />
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: "transparent", width: Dimensions.get('window').width, }}>


              <PrescriptionPreviewHeader
                {...this.props}
                type={1}
                fabClick={this.state.fabClick}
                parentClick={() => this.setState({ editShow: false })}
                title={"INTERACTIVE Rx PREVIEW FOR"}
                subtitle={
                  this.props.patientvisit.patientDetails.CommonDetails.FullName
                  /* +
                  "'s" +
                  ' Prescription'*/
                }
                dismissMenu={() => this.dismissMenu()}
                arrayItem={this.state.arrayItem}
                leftImage={Images.ic_black_back}
                menuState={this.state.editShow}
                menuArray={this.menuArray()}
                isSettingsClicked={this.state.isSettingsClicked}
                rightImage={
                  this.state.isSettingsClicked && this.state.dataChanged
                    ? prescrip_save
                    : !this.state.isSettingsClicked
                      ? ic_prescription_menu
                      : null
                }
                navigateMenu={(item) => this.navigateMenu(item)}
                rightImageClick={() => this.changeStateMenu()}
                leftImageOnClick={() => this.leftImageOnClick()}
                rightSecondImageClick={() => this.rightSecondImageClick()}
                rightSecondImage={
                  this.state.isSettingsClicked
                    ? ic_Reset
                    : !this.state.isSettingsClicked
                      ? ic_take_notes_outline_icon
                      : null
                }
                rightThirdImageClick={() => this.onFinishClick("print")}
                rightThirdImage={ic_settings_Print_icon}

              //rightSecondImage={this.state.isSettingsClicked ? ic_Reset : (this.state.isFavPrescription ? ic_Quick_Rx_Heart_Filled : ic_Quick_Rx_Heart)}
              />
              <View style={{ flex: 1 }}>
                {/*  body component for prescription preview */}
                 
                  <PrescriptionPreviewBody
                    {...this.props}
                    onRef={(ref) => (this.web = ref)}
                    WebViewRef={this.WebViewRef}
                    fabClick={this.state.fabClick}
                    createRemarks={(med, lang) => this.createRemarks(med, lang)}
                    type={1}
                    fabPosition={"center"}
                    iconHeight={35}
                    iconWidth={35}
                    dataFromChild={(data) => this.setDataFromChild(data)}
                    errorToast={this.state.errorToast}
                    toastBgColor={this.state.toastBgColor}
                    toastTextColor={this.state.toastTextColor}
                    toastImgPath={this.state.toastImagePath}
                    showToast={this.state.showToast}
                    description={this.state.description}
                    onFabStateChange={this.state.fabClick}
                    tempData={this.tempData}
                  />

                  {!this.state.fabClick &&
                    (this.props.printPreviewPinch ||
                      this.props.printPreviewAddSection) ? (
                    <View
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      {this.props.printPreviewPinch ? (


                        <View
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            marginTop: 40,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#6f6af4",
                            }}
                            onPress={() => {
                              this.props.setTooltipStatus({
                                ["printPreviewPinch"]: false,
                              });
                            }}
                          >
                            <AddPatient
                              imagePath={Pinch_to_zoom}
                              title={"Pinch to Zoom"}
                              description={
                                "Your INTERACTIVE PRESCRIPTION  easily lets you zoom in & out of the Rx to take a closer look"
                              }
                            />
                          </TouchableOpacity>

                          <Image
                            source={Triangle_Tip_Tooltip}
                            style={{
                              width: 25,
                              height: 10,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>
                      ) : !this.props.printPreviewPinch &&
                        this.props.printPreviewAddSection ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            marginTop: 40,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#6f6af4",
                            }}
                            onPress={() => {
                              this.props.setTooltipStatus({
                                ["printPreviewAddSection"]: false,
                              });
                            }}
                          >
                            <AddPatient
                              isLottie={true}
                              imagePath={Click_Sections}
                              title={"Interactive Prescription"}
                              description={
                                "Simply TAP on any section e.g. Chief Complaints, Findings, Investigations, Diagnosis, Medication TO ADD or EDIT"
                              }
                            />
                          </TouchableOpacity>

                          <Image
                            source={Triangle_Tip_Tooltip}
                            style={{
                              width: 25,
                              height: 10,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  <View
                    style={{
                      position: "absolute",
                      bottom: 6,
                      borderRadius: 999,
                      alignSelf: "center",
                      height: 65,
                      width: 65,
                    }}
                  ></View>

                  {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                    this.props.doctorProfile.DoctorData.RoleId == 3 ? (
                    <FloatingAction
                      position={Platform.isPad ? "center" : "center"}
                      iconHeight={Platform.isPad ? 65 : 55}
                      iconWidth={Platform.isPad ? 65 : 55}
                      animated={false}
                      showBackground={false}
                      floatingIcon={ic_Add_Clinic_Button}
                      distanceToEdge={{
                        vertical: Platform.isPad ? 45 : 25,
                        horizontal: this.state.Width_Layout / 2 - 30,
                      }}
                      dismissKeyboardOnPress={true}
                      //color={this.state.fabClick?"#ffffff":"#0064d7"}
                      icon={ic_Add_Clinic_Button}
                      ref={(ref) => {
                        this.floatingAction = ref;
                      }}
                      onPressMain={() => this.onFabBtnClick()}
                    />
                  ) : null}

                  <PrescriptionPreviewFooter
                    {...this.props}
                    type={1}
                    btnText1={"Save draft"}
                    btnText2={
                      this.state.prescriptionSaveloading
                        ? "finishing..."
                        : "finish"
                    }
                    onClickFinish={() => this.onFinishClick("finish")}
                    onClickDraft={() => this.onFinishClick("quick")}
                  />

                  <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{
                      backgroundColor: "transparent",
                      width: Platform.isPad ? "35%" : "65%",
                      height: this.modalHeight(),
                      overflow: "hidden",
                      justifyContent: "center",
                    }}
                    ref={(ref) => this.modalfloatMenu = ref}

                    swipeToClose={false}
                    position={"bottom"}
                    backdrop={true}
                    backdropColor={"#000000"}
                    backdropOpacity={0.5}
                    backdropPressToClose={false}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={this.close}
                    onOpened={this.onOpen}
                    coverScreen={false}
                    onClosingState={() => {
                      this.setState({
                        fabClick: false,
                      });
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flex: 0.6,
                          backgroundColor: "#fff",
                          borderRadius: 10,
                        }}
                      >
                        {this.bindfloatBtn()}
                      </View>

                      <TouchableOpacity
                        onPress={() => this.modalClose()}
                        style={{
                          flex: 0.1,
                          position: "absolute",
                          bottom: Platform.isPad ? 40 : 25,
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                          height: Platform.isPad ? 70 : 60,
                          width: Platform.isPad ? 70 : 60,
                          backgroundColor: "#fff",
                          borderRadius: 999,
                        }}
                      >
                        <Image
                          source={ic_close_button}
                          style={{
                            resizeMode: "contain",
                            height: Platform.isPad ? 40 : 30,
                            width: Platform.isPad ? 40 : 30,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>

                  <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{
                      borderWidth: 0,
                      width: "100%",
                      height: "60%",
                      justifyContent: "center",
                    }}
                    ref={(ref) => this.modalsettings = ref}

                    swipeToClose={false}
                    position={"bottom"}
                    backdrop={true}
                    backdropOpacity={0.5}
                    backdropPressToClose={false}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={() => {
                      this.forceUpdate();
                    }}
                    onOpened={this.open}
                    onClosingState={this.onClosingState}
                  >
                    <View style={{ flex: 1 }}>
                      <ParentTab
                        {...this.props}
                        type={1}
                        updatedData={this.state.updatedData}
                        openTooltip={this.state.openTooltip}
                        uploadSignature={(path) => this.setImagePath(path)}
                        onChange={(data) => this.onDataChange(data)}
                        tabSwitch={this.state.tabSwitch}
                        dataChanged={this.state.dataChanged}
                        showReset={() => this.showReset()}
                        languages={this.Languages}
                      // settingDatastore={(data) => this.setState({ getDataFromTab: data }, () => {
                      //     this.save()
                      // })}
                      />
                    </View>
                  </Modal>
                
              </View>
            </View>
          )}
        </SafeAreaView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  patientvisit: state.patientvisit,

  printPreviewPinch: state.tooltip.toolTipStatus.printPreviewPinch,
  printPreviewAddSection: state.tooltip.toolTipStatus.printPreviewAddSection,

  previewReducer: state.previewReducer,
  rxid: state.patientvisit.prescription._id,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  IsFavourite: state.patientvisit.prescription.IsFavourite,
  doctorProfile: state.doctorProfile,
  subtext: state.attachment.subtext,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  Srno: state.attachment.Srno,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  webdata: state.previewReducer.webdata,
  mdata: state.attachment.mdata,
  displayname: state.attachment.displayname,
  colorCode: state.attachment.colorCode,
  defaultlabel: state.attachment.defaultlabel,
  ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
  Findings: state.patientvisit.prescription.Findings,
  Investigation: state.patientvisit.prescription.Investigation,
  Diagnosis: state.patientvisit.prescription.Diagnosis,
  Advice: state.patientvisit.prescription.Advice,
  RecommendedLabTest: state.patientvisit.prescription.RecommendedLabTest,
  prescription: state.patientvisit.prescription,
  printClickCount: state.patientvisit.printClickCount,

  referName: state.patientvisit.referName,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentData: (data) => dispatch(setAttachmentData(data)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
  setMData: (data) => dispatch(setMData(data)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
  deletePatientVisit: (patientvisitid, data) =>
    dispatch(deletePatientVisit(patientvisitid, data)),
  setlab: (Name) => dispatch(setlab(Name)),
  saveQuickRxFavourites: (patientvisitid, data) =>
    dispatch(saveQuickRxFavourites(patientvisitid, data)),
  setWebdata: (data) => dispatch(setWebdata(data)),
  resetOpthalData: () => dispatch(resetOpthalData()),

  tabDataStore: (templateData) => dispatch(tabDataStore(templateData)),
  onTemplateSave: (rxid, data) => dispatch(onTemplateSave(rxid, data)),
  resetTemplateData: () => dispatch(resetTemplateData()),
  loadPrescription: () => dispatch(loadPrescription()),
  isFinish: (prescriptionId) => dispatch(isFinish(prescriptionId)),
  addToPrescription: (list) => dispatch(addToPrescription(list)),
  create_update_prescription: (data) =>
    dispatch(create_update_prescription(data)),
  setHeader: (data) => dispatch(setHeader(data)),
  setFooter: (data) => dispatch(setFooter(data)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),
  resetMedicine: () => dispatch(resetMedicine()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(PrescriptionPreviewHome));
