// code by ravi
import React from "react";
import {
  leftmenubg,
  ic_icon_Edit_Button,
  ic_Blue_BG_578,
  lefticon,
  icon_profile_photo_edit_button,
  Edit_White_Icon,
  ic_Notes,
  ic_Menu,
} from "../../constants/images";
import { Container, Text } from "native-base";
import { S3BaseUrl } from "../../../app.json";
import { StackActions, CommonActions } from '@react-navigation/native';
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";

import { Gpal } from "../../commonmethods/common";
import { deletePatientVisit } from "../../actions/previewSettings";

import {
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  Linking,
  Modal,
  ToastAndroid,
  BackHandler,
  Share,
  ActivityIndicator,
  TextInput,
  Image, Dimensions,
  Clipboard,
} from "react-native";
import Images from "../../Theme/Images";
import { MenuProvider } from "react-native-popup-menu";
import { ic_checked, ic_unchecked } from "../../constants/images";
import LinearGradient from "react-native-linear-gradient";
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from "../../constants/font";

import PatientVisitHeader from "../../components/Header/PatientVistHeader";
import PatientVisitHistoryComponent from "../../components/PatientVisitHistoryComponent/PatientVisitHistoryComponent";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import FAB from "../../components/FAB/FAB";
import { connect } from "react-redux";

import EmptyHomeOnlyTitle from "../../components/EmptyHome/EmptyHomeOnlyTitle";
import { empty_vc } from "../../constants/images";
import {
  getRxList,
  setPrescription,
  setPrintClickCount,
  resetRxLit,
  sendPaymentLink,
  deletePatient,
  loadMoreRxList,
  setPrescriptionVisitId,
  getPaymentLink,
  setPaymentLink,
  resetRxList,
  setlab,
} from "../../actions/patientVisit";
import {
  editPatentDetails,
  setPatientHabits,
  setPatientHistory,
  updatePatientDetails,
  setPatientData,
  addPatientAllergy,
  updatePatientOBHistory,
} from "../../actions/patientProfie";
import { updatePatient } from "../../actions/patientdetails";
import { delete_patient } from "../../actions/auth";
import { resetOpthalData } from "../../actions/opthal";
import moment from "moment";
import { RNS3 } from "react-native-aws3";
import ImagePicker from "react-native-image-crop-picker";
import {
  sendToApps,
  calculateAge,
  def_prescription,
} from "../../commonmethods/common";
import {
  Refer_Green_icon,
  Refer_Grey_icon,
  ic_arrow_decrease,
  ic_arrow_increase,
  ic_laboratory_icon,
  SuggestLab_Pink_btn,
  ic_pharamacy_icon,
  ic_specialist_icon,
  ic_whatsapp_icon,
  ic_sms_icon,
  ic_mail_icon,
  ic_more_icon,
  ic_content_copy,
  ic_content_share,
  ic_saveRX_icon,
  Contact_btn_pink,
  contact_green,
  Save_pink_btn,
  save_btn_green,
} from "../../constants/images";
import {
  setMedicine,
  setCurrentDosageView,
  setCustomBrand,
  addToPrescription,
  addCustomMedicine,
  resetMedicine,
} from "../../actions/dosage";
import _ from 'lodash';
import PrescriptionLoader from "../../components/Loading/prescriptionLoader";
import NoNetwork from "../../components/NoNetwork/noNetwork";

import {
  ic_popup_Add_Button_Icon,
  ic_Add_Clinic_Button,
} from "../../constants/images";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";
import { Platform } from "react-native";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";

var age = {
  value: "",
  units: "",
};
let timer = null;

var graphData = [];
let actions = [
  {
    text: "Issue Certificate",
    icon: require("../../../assets/fab_btn_new/add_Certificate_Icon.png"),
    position: 4,
    name: "Issue Certificate",
    textColor: "#000",

    textStyle: {
      fontSize: 16,
      fontFamily: "NotoSans-Bold",
    },
    textElevation: 0,
    textBackground: "transparent",
  },
  {
    text: "Use Favourite",
    name: "Use Favourite",
    icon: require("../../../assets/fab_btn_new/add_Favourite_Icon.png"),
    position: 3,
    textColor: "#000",
    textStyle: {
      fontSize: 16,
      fontFamily: "NotoSans-Bold",
    },
    textElevation: 0,
    textBackground: "transparent",
  },
  {
    text: "Create Prescription",
    name: "Create Prescription",
    icon: require("../../../assets/fab_btn_new/add_Prescription_Icon.png"),

    position: 2,
    textColor: "#000",
    textStyle: {
      fontSize: 16,
      fontFamily: "NotoSans-Bold",
    },
    textElevation: 0,
    textBackground: "transparent",
    overlayColor: "rgba(255,255,255,0)",
  },
  // {
  //   text: "Create ABHA Address",
  //   name: "Create ABHA Address",
  //   icon: require("../../../assets/fab_btn_new/add_Prescription_Icon.png"),

  //   position: 1,
  //   textColor: "#000",
  //   textStyle: {
  //     fontSize: 16,
  //     fontFamily: "NotoSans-Bold",
  //   },
  //   textElevation: 0,
  //   textBackground: "transparent",
  //   overlayColor: "rgba(255,255,255,0)",
  // },
  // {
  //   text: "Verify ABHA Address",
  //   name: "Verify ABHA Address",
  //   icon: require("../../../assets/fab_btn_new/add_Prescription_Icon.png"),

  //   position: 1,
  //   textColor: "#000",
  //   textStyle: {
  //     fontSize: 16,
  //     fontFamily: "NotoSans-Bold",
  //   },
  //   textElevation: 0,
  //   textBackground: "transparent",
  //   overlayColor: "rgba(255,255,255,0)",
  // }
];

class PatientVisitHistoryContainer extends React.Component {
  //Setting Screen to show in Setting Option
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.skip = 0;
    this.limit = 20;
    this.toast = React.createRef();
    this.meal = React.createRef();
    this.header = React.createRef();
    this.state = {
      //For no network
      isInternetOn: true,
      NoNetworkMsg: "",
      consultationType: ["First Time", "Follow Up", "Custom"],
      consultTypeIndex: 0,
      menuShow: false,
      isVisible: true,
      togglePop: false,
      photo: null,
      remarkInput: "",
      findData: [],
      investData: [],
      image: null,
      showMealModal: false,
      age: age,
      loading: false,
      listcount: 1,
      loadText: "Loading Patient Visit History",
      paymsg: "Hello, you can make payment using the below link \n",
      consultFee: this.props.doctorProfile.DoctorData.ConsultFee
        ? this.props.doctorProfile.DoctorData.ConsultFee.toString()
        : "0",
      shareModal: false,
      //Toast States
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      share: [
        {
          img: ic_sms_icon,
          title: "SMS",
        },
        {
          img: ic_whatsapp_icon,
          title: "Whatsapp",
        },
        {
          img: ic_mail_icon,
          title: "Mail",
        },
        {
          img: ic_more_icon,
          title: "More",
        },
      ],
      //state to control the visibility of Tooltip
    };
    this.tempImage = "";
  }
  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    multipleTapHandler.clearNavigator();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    clearTimeout(timer);
  }
  fixPatientDetails() {
    let patientDetails = { ...this.props.patientvisit.patientDetails };
    let fixbmi = false;
    let fixhistory = false;

    //Fix BMI
    if (typeof patientDetails.CommonDetails.BodyDetails.BMI != "string") {
      let bmi = patientDetails.CommonDetails.BodyDetails.BMI;
      if (bmi == 0) {
        bmi = "";
      }
      patientDetails.CommonDetails.BodyDetails.BMI =
        typeof bmi == "string" ? bmi : bmi.toString();
      fixbmi = true;
    }
    //Fix Personal History
    let PatientHabits = [...patientDetails.CommonDetails.PatientHabits];
    let p_habits = PatientHabits.map((habit) => {
      if (habit.id) {
        fixPatientHistory = true;
      }
      delete habit.id;
      return habit;
    });
    //isDiff=_.isEqual(p_habits,patientDetails.CommonDetails.PatientHabits);
    patientDetails.CommonDetails.PatientHabits = [...p_habits];
    let _id = patientDetails._id;
    if (fixhistory || fixbmi) {
      let editData = {
        CommonDetails: patientDetails.CommonDetails,
        Mobile: patientDetails.Mobile,
      };
      this.props.updatePatientDetails(_id, editData).then((response) => {
        this.forceUpdate();
      });
    }
  }
  handleBackButtonClick() {
    this.props.navigation.goBack();

    if (this.props.route.params) {
      this.props.route.params.returnPatientData(
        true,
        this.props.route.params.callFrom
          ? this.props.route.params.callFrom
          : null
      );
    }

    return true;
  }

  getPatientHistory() {
    const self = this;
    this.setState({
      loading: true,
    });
    let data = {
      patient_Id: this.props.patientvisit.patientId,
      doctorId: this.props.doctorProfile.DoctorData._id,
      patientId: this.props.patientvisit.Commonid,
      skip: this.skip,
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

      //console.log(JSON.stringify(this.props.patientvisit.patientRxList));
      this.parseGraphData(this.props.patientvisit.patientRxList);


      this.setState({
        listcount: this.props.patientvisit.patientRxList.length,
      });
      age = calculateAge(
        this.props.patientvisit.patientDetails.CommonDetails.DOB,
        false
      );

      this.skip = this.skip + this.limit;

      this.setState(
        {
          age: age,
          loading: false,
        },
        () => { }
      );

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
      self.fixPatientDetails();
      if (this.props.patientvisit.patientDetails.CommonDetails.Userimage) {
        let photo = {
          path:
            S3BaseUrl +
            "patientimg/" +
            this.props.patientvisit.patientDetails.CommonDetails.Userimage,

          //     path: "https://prescripimage.s3.amazonaws.com/patientimg/" + this.props.patientvisit.patientDetails.CommonDetails.Userimage
        };
        this.setState({
          photo: photo,
        });
      }
    });
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "PatientVisit",
      screen_class: "PatientVisitHistoryContainer",
    });
    //multipleTapHandler.clearNavigator();
    let patientDetails = [];
    patientDetails[0] = null;
    let patientRxList = [];
    let data = {
      patientDetails,
      patientRxList,
    };
    //this.props.resetRxLit(data);
    //this.props.dispatch({ type: 'GET_RXLIST_SUCCESS', payload: { data} });

    this.props.navigation.addListener("focus", () => {
      this.props.resetRxList();
      this.skip = 0;
      this.getPatientHistory();
    });

    timer = setTimeout(() => {
      this.setState({
        showTooltip: true,
      });
    }, 200);
  }

  toolTipClick(listcount) {
    this.props.setTooltipStatus({ ["patientVisitHistryFAB"]: false });
  }
  leftImageOnClick() {
    // alert(this.props.route.params.callFrom)

    if (
      this.props.route.params &&
      this.props.route.params.callFrom &&
      this.props.route.params.callFrom == "addPatient"
    ) {

      this.props.navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Drawer' }]

      }));

    } else {
      multipleTapHandler.clearNavigator();
      this.handleBackButtonClick();
      //this.props.navigation.goBack()
    }
  }

  Navigateback = () => {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack();
  };

  //hide and show the edit,refer,sendsms view
  ToggleFunction = () => {
    this.setState((state) => ({ isVisible: !state.isVisible }));
  };

  editPatient = () => {
    //Created different function for analytics
    //this.props.screenProps.rootNavigation.navigate('EditPatient')
    //this.props.navigation.push('EditPatient')
  };

  //dropdown on right image click
  RightImageOnClick = () => {
    this.setState({ togglePop: !this.state.togglePop });
  };

  sendPaymentLink() {
    let dlink = this.props.doctorProfile.url;
    let mobile = this.props.patientvisit.patientDetails.CommonDetails.CountryCode ?
      this.props.patientvisit.patientDetails.CommonDetails.CountryCode + this.props.patientvisit.patientDetails.Mobile :
      this.props.patientvisit.patientDetails.Mobile;

    this.props.sendPaymentLink(mobile, dlink);
  }

  deletePatient() {
    const self = this;
    let { CommonDetails, _id } = this.props.patientvisit.patientDetails;
    let doctor_id = this.props.doctorProfile.DoctorData._id;
    let PatientName = CommonDetails.FullName;

    this.props
      .delete_patient(_id, PatientName, doctor_id, CommonDetails.id, 1)
      .then((resp) => {
        self.props.navigation.pop();
      });
  }

  popOver = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: 100,
          backgroundColor: "#f1f1f1",
          paddingHorizontal: 12,
          paddingTop: 5,
          borderRadius: 5,
          top: 12,
          position: "absolute",
          right: 10,
        }}
      >
        <TouchableOpacity onPress={this.editPatient}>
          <Text style={{ fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Refer");
          }}
        >
          <Text style={{ fontSize: 12, paddingTop: 12 }}>Refer</Text>
        </TouchableOpacity>
        <View
          style={{
            borderColor: "#D0D3D4",
            borderWidth: 0.5,
            width: "100%",
            marginVertical: 15,
          }}
        ></View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert("Send SMS");
          }}
        >
          <Text style={{ fontSize: 12 }}>Send SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Send Whatsapp");
          }}
        >
          <Text style={{ fontSize: 12, marginVertical: 14 }}>
            Send Whatsapp
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  secondMenuImageOnClick() {
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
    this.props.navigation.navigate("PatientNotes", {
      previous_screen: "patientVisitHistory",
    });
  }

  cameraImageOnClick = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image) => {
        this.setState({ photo: image });
        this.uploadPhoto(image);
      })
      .catch((err) => { });
  };

  generateGuid() {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
      i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + i;
    }
    return result;
  }

  uploadPhoto(image) {
    let self = this;
    this.setState({ loading: true });
    let file = {
      uri: image.path,
      name: this.generateGuid() + ".jpeg",
      type: "image/jpeg",
    };
    let options = {
      keyPrefix: "patientimg/",
      bucket: "prescripimage",
      region: "ap-southeast-1",
      accessKey: "AKIA2P5O2LH6PGYG3CI3",
      secretKey: "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",
      successActionStatus: 201,
      awsUrl: "s3.amazonaws.com/",
    };
    var PD = JSON.parse(JSON.stringify(this.props.patientvisit.patientDetails));
    //delete PD["_id"]
    RNS3.put(file, options).then((response) => {
      if (response.status == 201) {
        self.tempImage = response.body.postResponse.key.split("/")[1];
        self.setState({ loading: false });
        PD.CommonDetails.Userimage = self.tempImage;
        let editData = {
          CommonDetails: PD.CommonDetails,
          Mobile: PD.Mobile,
        };
        this.props.updatePatientDetails(PD._id, editData).then((response) => {
          self.forceUpdate();
        });

        //patch to api
        // self.props.updatePatient(this.props.patientvisit.patientDetails._id, PD).then((resp) => {
        //     self.forceUpdate();
        // })
      } else {
        Alert.alert("Prescrip", "Failed to upload image");
      }
    });
  }

  click(cond) {
    if (cond == "Refer") {
      //Open Refer Modal
    } else if (cond == "Edit") {
      //Redirect to Edit Patient
    } else if (cond == "Delete") {
      this.deletePatient();
    } else if (cond == "Send Payment Link") {
      this.sendPaymentLink();
    } else if (cond == "Send Sms") {
      sendToApps(`sms:&addresses=null&body=My sms text`, "Sms App");
    } else if (cond == "Send Whatsapp") {
      sendToApps("whatsapp://send?text=hello&phone=", "Whatsapp");
    }
    this.setState({ togglePop: !this.state.togglePop });
  }

  //FAB btn click

  fabtouch(name) {
    let referName = { Lab: null, Pharma: null, Specialist: null };
    switch (name) {
      case "Verify ABHA Address":
        this.props.navigation.navigate("VerifyAbhaAddress", {
          patientId: this.props.patientvisit.patientDetails._id,
          commonId: this.props.patientvisit.patientDetails.CommonDetails.id
        });
        break;
      case "Create ABHA Address":
        this.props.navigation.navigate("AbhaConsentCollection", {
          patientId: this.props.patientvisit.patientDetails._id,
          commonId: this.props.patientvisit.patientDetails.CommonDetails.id
        });
        break;
      case "Add Patient":
        this.props.screenProps.rootNavigation.navigate("AddPatientContainer");
        break;
      case "Create Prescription":
        let defaultPrescription = JSON.parse(JSON.stringify(def_prescription));
        this.props.setPrescription(defaultPrescription);
        this.props.resetMedicine();
        this.props.resetOpthalData();
        this.props.addToPrescription([]);
        this.props.setPrintClickCount(1);

        this.props.setlab(referName);

        multipleTapHandler.multitap(
          () => this.props.navigation.push("ChiefComplaintContainer"),
          "ChiefComplaintContainer"
        );
        break;
      case "Issue Certificate":
        multipleTapHandler.multitap(
          () => this.props.navigation.navigate("SelectCertificate"),
          "SelectCertificate"
        );
        break;

      case "Use Favourite":
        this.props.resetOpthalData();
        this.props.setlab(referName);
        multipleTapHandler.multitap(
          () => this.props.navigation.push("UseFavourite"),
          "UseFavourite"
        );
        break;

      default:
        break;
    }
    //  this.props.editPatentDetails(val)
  }
  tooltipClicked(clicked) {
    this.props.setTooltipStatus({ ["patientVisitHistryIncomplete"]: false });
  }
  itemLongClick(item) {
    Alert.alert(
      "Prescrip",
      "Do you want to delete the prescription? It won't available once discarded",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            this.onDiscard(item, {
              action: 0,
              doctorId: this.props.doctorProfile.DoctorData._id,
              PatientName:
                this.props.patientvisit.patientDetails.CommonDetails.FullName,
            }),
        },
      ]
    );

    //  alert(item)
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
 
        return;
      } else if (response.payload.data.status == 2000) {
        this.props.resetRxList();
        this.skip = 0;
        this.getPatientHistory();

        //alert(response.payload.data.msg)
      } else {
        // Toast.show({ text: `Something went wrong`, duration: 1000, position: 'bottom' })
      }
    });
  }

  itemClick(callFrom, type) {
    switch (callFrom) {
      case "item":
        if (type == "certificate") {
          multipleTapHandler.multitap(
            () => this.props.navigation.navigate("PrescriptionWebView"),
            "PrescriptionWebView"
          );
        } else {
          multipleTapHandler.multitap(
            () => this.props.navigation.navigate("ShowVisitHistory"),
            "ShowVisitHistory"
          );
        }
        break;
      default:
        break;
    }
  }

  loadMore() {
    //let {skip} = this.props.patientvisit.patientRxList
    let data = {
      patient_Id: this.props.patientvisit.patientId,
      doctorId: this.props.doctorProfile.DoctorData._id,
      patientId: this.props.patientvisit.Commonid,
      skip: this.skip,
      limit: this.limit,
    };
    this.props.loadMoreRxList(data).then((response) => {
      if (response.payload.data.status == 1) {
        this.skip = this.skip + this.limit;
      }
    });
  }

  parseGraphData(data) {
    let investarr = [];
    let findarr = [];
    let findsGr = [];
    let investGr = [];
    data.forEach((rx) => {
      rx.Investigation = rx.Investigation.map((i) => ({
        ...i,
        DataType: !isNaN(i.DataType) ? Number(i.DataType) : i.DataType,
        date: moment(rx.WhenEntered).format("DD-MM-YY"),
      }));
      rx.Findings = rx.Findings.map((f) => ({
        ...f,
        DataType: !isNaN(f.DataType) ? Number(f.DataType) : f.DataType,
        date: moment(rx.WhenEntered).format("DD-MM-YY"),
      }));
      investarr = investarr.concat(rx.Investigation);
      findarr = findarr.concat(rx.Findings);
      findsGr = _.chain(findarr)
        .groupBy("Name")
        .map((item) => {
          return item;
        });
      investGr = _.chain(investarr)
        .groupBy("Name")
        .map((item) => {
          return item;
        });
    });
    //Filter Objects containing Data Type is number and array length >5
    findsGr = findsGr.filter((item) => {
      if (item.length > 4 && item.every(this.parseAllNumbers)) {
        return item;
      }
    });

    investGr = investGr.filter((item) => {
      if (item.length > 4 && item.every(this.parseAllNumbers)) {
        return item;
      }
    });
    let findsGrShort = findsGr.map((f) => {
      f = f.slice(0, 5);
      return f;
    });
    let investGrShort = investGr.map((i) => {
      i = i.slice(0, 5);
      return i;
    });
    let findArr = JSON.parse(JSON.stringify(findsGrShort));
    let investArr = JSON.parse(JSON.stringify(investGrShort));

    this.setState({
      findData: findArr,
      investData: investArr,
    });
  }
  //share app link
  async onShare() {
    try {
      let msg =
        "Hello, you can make payment using the below link \n" +
        this.props.patientvisit.payment_link;
      const result = await Share.share({
        message: msg,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }
  connectWhatsApp(number) {
    Linking.openURL("whatsapp://send?phone=" + number);
  }
  callAPhoneNumber(number) {
   
    let phoneNumber = number;
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }
  sharePaymentLink() {
    if (this.props.doctorProfile.DoctorData.BankDetails) {
      this.setState({
        showMealModal: true,
      });
    } else {
      multipleTapHandler.multitap(
        () =>
          this.props.navigation.navigate("BankDetailContainer", {
            calledFrom: "addBankDetails",
            callAfterAdd: this.togglePaymentPop.bind(this),
          }),
        "BankDetailContainer"
      );
    }
  }
  togglePaymentPop() {
    multipleTapHandler.multitap(
      () => this.sharePaymentLink(),
      "BankDetailContainer"
    );
  }
  menuSelectName(name) {
    switch (name) {
      case "Edit":
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

        this.props.updatePatientOBHistory(patientDetails.CommonDetails.Gender);
        let allery = patientDetails.CommonDetails.Allergy;
        let habits = patientDetails.CommonDetails.PatientHabits;
        let selfHistory = patientDetails.CommonDetails.PersonalHistory;
        let familyHistory = patientDetails.CommonDetails.FamilyHistory;
        let history = [];
        selfHistory = selfHistory.map((item) => {
          item["Relation"] = "Self";
          return item;
        });
        if (allery.length == 0) {
          allery = [
            {
              Environmental: "",
              Food: "",
              Drugs: "",
              Other: "",
            },
          ];
        }
        history = [...selfHistory, ...familyHistory];
        this.props.editPatentDetails(true);
        this.props.setPatientData(patientDetails);
        this.props.addPatientAllergy(allery);
        this.props.setPatientHabits(habits);
        this.props.setPatientHistory(history);
        multipleTapHandler.multitap(
          () =>
            this.props.navigation.navigate("AddPatientContainer", {
              previous_screen: "patientVisitHistory",
            }),
          "AddPatientContainer"
        );

        break;

      case "Refer":
        let type = "Specialist";
        let color = "#1cb07a";
        let screen = type + "Container";
        this.props.navigation.push(screen, { type, color });
        break;
      case "Delete":
        Alert.alert(
          "Prescrip",
          "Are you sure want to delete " +
          this.props.patientvisit.patientDetails.CommonDetails.FullName +
          "?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => this.deletePatient(),
            },
          ],
          { cancelable: true }
        );

        break;
      case "Send Payment Link":
        this.sharePaymentLink();
        //this.onShare();
        break;
      case "Make a phone call":
        this.callAPhoneNumber(this.props.patientvisit.patientDetails.CommonDetails.CountryCode ?
          this.props.patientvisit.patientDetails.CommonDetails.CountryCode  + this.props.patientvisit.patientDetails.Mobile : this.props.patientvisit.patientDetails.Mobile);
        break;
      case "Send SMS":
        let mobile = this.props.patientvisit.patientDetails.Mobile;
        let url = "sms:" + mobile;
        Linking.openURL(url);
        break;
      case "Send Whatsapp":
        //let mobile=this.props.patientvisit.patientDetails.Mobile;
        this.connectWhatsApp(this.props.patientvisit.patientDetails.CommonDetails.Whatsapp && this.props.patientvisit.patientDetails.CommonDetails.Whatsapp != '' ? this.props.patientvisit.patientDetails.CommonDetails.Whatsapp : (this.props.patientvisit.patientDetails.CommonDetails.CountryCode ?
          this.props.patientvisit.patientDetails.CommonDetails.CountryCode + this.props.patientvisit.patientDetails.Mobile : this.props.patientvisit.patientDetails.Mobile));
        break;
      default:
        ToastAndroid.show("Implementation in progress", ToastAndroid.LONG);
        break;
    }
  }

  retryClick(isInternetOn) {
    if (isInternetOn) {
      this.setState({
        isInternetOn: true,
      });
      //this.props.dispatch({ type: 'GET_RXLIST_SUCCESS', payload: { data} });

      this.getPatientHistory();

      //alert("You are online!");
    } else {
      alert("You are offline!");
    }
    // alert('sad',isInternetOn)
  }

  parseAllNumbers(value) {
    return !isNaN(value.DataType);
  }
  getPaymentLink(type) {
    this.setState({
      showToast: true,
      loading: true,
      description: "Payment Link is being generated",
      loadText: "Payment Link is being generated",
      toastBgColor: "#4D99E3",
      toastTextColor: "#FFFFFF",
      showMealModal: false,
    });

    let age = calculateAge(
      this.props.patientvisit.patientDetails.CommonDetails.DOB,
      false
    );
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      transactionId: "", //this.props.patientvisit.vc_trans_id,
      digiConsultationId: "", //this.props.patientvisit.vc_consult_id,
      amount: parseFloat(this.state.consultFee.toString()).toFixed(2),
      consultFees: this.props.doctorProfile.DoctorData.ConsultFee
        ? parseFloat(
          this.props.doctorProfile.DoctorData.ConsultFee.toString()
        ).toFixed(2)
        : 0,
      patientId: this.props.patientvisit.patientDetails.CommonDetails.id,
      patient_Id: this.props.patientvisit.patientDetails._id,
      patientName:
        this.props.patientvisit.patientDetails.CommonDetails.FullName,
      dob: this.props.patientvisit.patientDetails.CommonDetails.DOB,
      gender: this.props.patientvisit.patientDetails.CommonDetails.Gender,
      mobile: this.props.patientvisit.patientDetails.Mobile,
      whatsApp: this.props.patientvisit.patientDetails.CommonDetails.Whatsapp
        ? this.props.patientvisit.patientDetails.CommonDetails.Whatsapp
        : "",
      age: age.value + " " + age.units,
      remarks: this.state.remarkInput,
      patientEmail:
        this.props.patientvisit.patientDetails.CommonDetails.EmailAddress,
    };
    this.props.getPaymentLink(data).then((response) => {
      if (response.payload.data.status == 1) {
        logAnalytics(
          this.props.doctorProfile.DoctorData._id,
          this.props.doctorProfile.DoctorData.DoctorFName +
          " " +
          this.props.doctorProfile.DoctorData.DoctorLName,
          "shared_prescrip_paylink"
        );
        let paylink = response.payload.data.payLink;
        this.props.setPaymentLink(paylink);
        switch (type) {
          case "share":
            //  this.onShare();

            this.setState({
              shareModal: true,
              showMealModal: false,
              showToast: false,
              loading: false,
              loadText: "Loading Patient Visit History",
            });
            break;
          case "copy":
            this.setState({
              showToast: true,
              description: "Payment Link copied",
              showToast: false,
              loadText: "Loading Patient Visit History",
              loading: false,
              toastBgColor: "#29b62f",
              toastTextColor: "#fafdfa",
            });
            setTimeout(() => {
              this.setState({
                showToast: false,
                showToast: false,
                loading: false, loadText: "Loading Patient Visit History",
              });
            }, 2000);
            Clipboard.setString(this.props.patientvisit.payment_link);
            break;
        }
      }
    });
  }
  dismissOptionMenu() {
    dismissMenu();
  }

  //Share payment link

  getTypeoFsend(item) {
    switch (item) {
      case "SMS":
        return "sms";

      case "Whatsapp":
        return "whatsapp";

      case "Mail":
        return "mail";

      default:
        return "more";
    }
  }
  // send numer type
  getNumberForsend(item) {
    switch (item) {
      case "SMS":
        return this.props.patientvisit.patientDetails.Mobile;
      case "Whatsapp":
        return this.props.patientvisit.patientDetails.CommonDetails.Whatsapp && this.props.patientvisit.patientDetails.CommonDetails.Whatsapp != '' ?
          this.props.patientvisit.patientDetails.CommonDetails.Whatsapp : this.props.patientvisit.patientDetails.CommonDetails.CountryCode ?
            this.props.patientvisit.patientDetails.CommonDetails.CountryCode + this.props.patientvisit.patientDetails.Mobile :
            '+91' + this.props.patientvisit.patientDetails.Mobile;

      case "Mail":
        return this.props.patientvisit.patientDetails.CommonDetails.EmailAddres;

      default:
        return "more";
    }
  }
  sendPrescrip(type, number) {
    Alert.alert(number)
    const separator = Platform.OS === "ios" ? "&" : "?";
    let url = this.props.patientvisit.payment_link;

    let msg = "Hello, you can make payment using the below link \n";

    // let msg = "Hello, " + this.props.patientvisit.patientDetails.CommonDetails.FullName + " Hope you get well under my care, please find a copy of your prescription";

    switch (type) {
      case "whatsapp":
        Linking.openURL(
          "whatsapp://send?text=" +
          msg +
          "\n" +
          url +
          "&phone=" +
          parseInt(number)
        );


        break;

      case "sms":
        Platform.OS == "android"
          ? Linking.openURL("sms:" + number + "?body=" + msg + "\n" + url)
          : Linking.openURL("sms:" + number + "&body=" + msg + "\n" + url);

        //  Linking.openURL('sms:' + number + '?sms_body=' + msg + "\n" + url);
        break;

      case "mail":
        Linking.openURL(
          "mailto:" +
          this.props.patientvisit.patientDetails.CommonDetails.Email +
          "?subject=" +
          this.props.patientvisit.patientDetails.CommonDetails.FullName +
          " prescription" +
          "&body=" +
          msg +
          "\n" +
          url
        );
        break;

      default:
        this.onShare();
    }
  }

  render() {
    let FullName,
      Gender = "Other",
      DOB = new Date();
    if (this.props.patientvisit.patientDetails) {
      let { CommonDetails } = this.props.patientvisit.patientDetails;
      FullName = CommonDetails.FullName;
      Gender = CommonDetails.Gender;
      DOB = CommonDetails.DOB;
      this.tempImage =
        this.tempImage != "" ? this.tempImage : CommonDetails.Userimage;
    }
    if (this.props.patientvisit.patientDetails.CommonDetails.PatientUhid &&
      this.props.patientvisit.patientDetails.CommonDetails.PatientUhid != '') {
      // actions = actions.filter(x => x.text != 'Create ABHA Address');
    }
    // else { actions = actions.filter(x => x.text != 'Verify ABHA Address'); }


    return (

      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showMealModal}

          ref={(ref) => this.meal = ref}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : null}
          >
            <View
              style={{
                flex: 1, width: Dimensions.get('window').width,

                justifyContent: "flex-end",
                alignItems: "flex-end",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              {/*Close Button*/}
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showMealModal: false,
                  })
                }
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#ffffff",
                    fontFamily: "NotoSans-Bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
              {/*Close Button Ends*/}
              {/*Modal View*/}
              <View
                style={{
                  backgroundColor: "#ffffff",
                  borderTopLeftRadius: 15,
                  borderTopEndRadius: 15,
                  // padding: 20,
                  flex: 1, width: Dimensions.get('window').width,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                {/*Title*/}
                <View style={{ margin: 10, justifyContent: "center" }}>
                  <Text style={{ fontFamily: "NotoSans-Bold", fontSize: 20 }}>
                    {"Share Payment Link"}
                  </Text>
                </View>
                {/*Title Ends*/}
                {/*Input*/}

                <View style={{ padding: 10 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#8d8d8d",
                        fontFamily: "NotoSans",
                      }}
                    >
                      Consultation Type
                    </Text>
                    <View style={{ marginTop: 10, flexDirection: "row" }}>
                      {this.state.consultationType.map((item, ind) => {
                        return item == "First Time" || item == "Custom" ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState(
                                {
                                  consultTypeIndex: ind,
                                  consultFee:
                                    ind == 0
                                      ? this.props.doctorProfile.DoctorData
                                        .ConsultFee
                                      : ind == 1
                                        ? this.props.doctorProfile.DoctorData
                                          .FollowupFee
                                          ? this.props.doctorProfile.DoctorData
                                            .FollowupFee
                                          : ""
                                        : "",
                                },
                                () => {
                                  this.state.consultTypeIndex == 2 ||
                                    this.state.consultFee == "" ||
                                    this.props.doctorProfile.DoctorData
                                      .FollowupFee == ""
                                    ? this.consultInput.focus()
                                    : null;
                                }
                              )
                            }
                            style={{
                              width: 95,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "center",
                              borderColor:
                                this.state.consultTypeIndex == ind
                                  ? "#0064d7"
                                  : "#8d8d8d",
                              borderWidth: 1.2,
                              borderRadius: 6,
                              marginHorizontal: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "NotoSans",
                                fontSize: 16,
                                color:
                                  this.state.consultTypeIndex == ind
                                    ? "#0064d7"
                                    : "#8d8d8d",
                              }}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ) : item == "Follow Up" &&
                          this.props.doctorProfile.DoctorData.FollowupFee ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState(
                                {
                                  consultTypeIndex: ind,
                                  consultFee:
                                    ind == 0
                                      ? this.props.doctorProfile.DoctorData
                                        .ConsultFee
                                      : ind == 1
                                        ? this.props.doctorProfile.DoctorData
                                          .FollowupFee
                                          ? this.props.doctorProfile.DoctorData
                                            .FollowupFee
                                          : ""
                                        : "",
                                },
                                () => {
                                  this.state.consultTypeIndex == 2 ||
                                    this.state.consultFee == "" ||
                                    this.props.doctorProfile.DoctorData
                                      .FollowupFee == ""
                                    ? this.consultInput.focus()
                                    : null;
                                }
                              )
                            }
                            style={{
                              width: 95,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "center",
                              borderColor:
                                this.state.consultTypeIndex == ind
                                  ? "#0064d7"
                                  : "#8d8d8d",
                              borderWidth: 1.2,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "NotoSans",
                                fontSize: 16,
                                color:
                                  this.state.consultTypeIndex == ind
                                    ? "#0064d7"
                                    : "#8d8d8d",
                              }}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ) : null;
                      })}
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#8d8d8d",
                      marginTop: 20,
                    }}
                  >
                    Consultation Amount
                  </Text>
                  <View
                    style={{
                      margin: 10,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      flexDirection: "row",
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 0.8,
                    }}
                  >
                    <View style={{ flex: 0.2 }}>
                      <Text
                        style={{
                          color: "#444444",
                          fontSize: 22,
                          alignSelf: "flex-start",
                        }}
                      >
                        {"\u20B9"}
                      </Text>
                    </View>
                    <View style={{ flex: 0.8 }}>
                      <TextInput
                        keyboardType={"numeric"}
                        ref={(ref) => this.consultInput = ref}

                        defaultValue={this.state.consultFee.toString()}
                        style={{
                          fontSize: 22,
                          fontFamily: "NotoSans-Bold",
                          textAlign: "right",
                        }}
                        onChangeText={(txt) =>
                          this.setState({
                            consultFee: txt,
                          })
                        }
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#8d8d8d",
                      marginTop: 10,
                    }}
                  >
                    Remarks
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 0.8,
                    }}
                  >
                    <TextInput
                      ref={(ref) => (this.remarkInput = ref)}
                      defaultValue={this.state.remarkInput.toString()}
                      onFocus={() => this.setState({ focus: true })}
                      onBlur={() => this.setState({ focus: false })}
                      onChangeText={(txt) =>
                        this.setState({
                          remarkInput: txt,
                        })
                      }
                      style={{
                        borderBottomColor: "#c8c8c8",
                        borderBottomWidth: 0.7,
                        fontSize: 20,
                        fontFamily: "NotoSans-Bold",
                      }}
                    />
                    {/* 
                                                <TextInput keyboardType={"default"}

                                                    ref={ref => this.remarkInput = ref}
                                                    defaultValue={this.state.remarkInput.toString()}
                                                    onFocus={() => this.setState({ focus: true })}
                                                    onBlur={() => this.setState({ focus: false })}
                                                    onChangeText={(txt) => this.setState({
                                                        remarkInput: txt
                                                    })}

                                                    style={{ fontSize: 22, fontFamily: 'NotoSans-Bold', alignSelf: 'flex-end' }} /> */}
                  </View>
                </View>

                {/*Ends*/}
                {/*OP*/}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    margin: 10,
                  }}
                >
                  <TouchableOpacity
                    disabled={
                      parseFloat(this.state.consultFee) > 0 ? false : true
                    }
                    onPress={() => this.getPaymentLink("copy")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      height: 35,
                    }}
                  >
                    <Image
                      source={ic_content_copy}
                      style={{
                        resizeMode: "contain",
                        height: 18,
                        tintColor:
                          parseFloat(this.state.consultFee) > 0
                            ? "#0065d7"
                            : "#a2a2a2",
                      }}
                    />
                    <Text
                      style={{
                        textTransform: "uppercase",
                        color:
                          parseFloat(this.state.consultFee) > 0
                            ? "#0065d7"
                            : "#a2a2a2",
                        fontFamily: "NotoSans-Bold",
                      }}
                    >
                      Copy Link
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity
                      disabled={
                        parseFloat(this.state.consultFee) > 0 ? false : true
                      }
                      onPress={() => this.getPaymentLink("share")}
                      style={{
                        borderRadius: 20,

                        paddingHorizontal: 10,
                        height: 35, paddingTop: 8,
                        alignSelf: "flex-end",
                        marginTop: 10,
                        backgroundColor:
                          parseFloat(this.state.consultFee) > 0
                            ? "#0065d7"
                            : "#a2a2a2",
                      }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}>

                        <Image
                          source={ic_content_share}
                          style={{ resizeMode: 'contain', height: 18 }}
                        />

                        <Text
                          style={{
                            textTransform: 'uppercase',
                            color: '#fff',
                            fontFamily: 'NotoSans-Bold'
                          }}>
                          Share Link
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.shareModal}

          ref={(ref) => this.meal = ref}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : null}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              {/*Close Button*/}
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    shareModal: false,
                    showMealModal: true,
                  })
                }
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#ffffff",
                    fontFamily: "NotoSans-Bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
              {/*Close Button Ends*/}

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {this.state.share.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.sendPrescrip(
                          this.getTypeoFsend(item.title),
                          this.getNumberForsend(item.title)
                        )
                      }
                      style={{
                        flex: 0.25,
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Image
                        source={item.img}
                        style={{ height: 50, resizeMode: "contain" }}
                      />
                      <Text
                        style={{
                          color: item.color,
                          fontSize: 12,
                          fontFamily: "NotoSans",
                          color: "#737373",
                        }}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

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
            <PrescriptionLoader
              {...this.props}
              type={this.state.loadText}
            />
          </View>
        ) : null}

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
              retryClick={(isInternetOn) => this.retryClick(isInternetOn)}
            />
          </View>
        ) : null}
        {
          <View
            style={{ flex: 1, backgroundColor: "#f1f1f1" }}
            onTouchStart={() => this.header.dismissMenu()}
          >
            <PatientVisitHeader
              {...this.props}

              ref={(ref) => this.header = ref}
              menuSelectName={(name) => this.menuSelectName(name)}
              menuNameList={this.props.doctorProfile.DoctorData.IsAssistant != 1 ? [
                "Edit",
                "Refer",
                "Delete",
                "Send Payment Link",
                "Send SMS",
                "Make a phone call",
                "Send Whatsapp",
              ] : [
                "Edit",
                "Refer",

                "Send Payment Link",
                "Send SMS",
                "Make a phone call",
                "Send Whatsapp",
              ]}
              menuShow={this.state.menuShow}
              bgImage={ic_Blue_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              title={FullName}
              description={
                this.state.age.value +
                " " +
                (this.state.age.units == "Years"
                  ? "Yrs"
                  : this.state.age.units) +
                " | " +
                Gender
              }
              leftImage={lefticon}
              rightImage={ic_Menu}
              RightImageOnClick={this.RightImageOnClick}
              leftImageOnClick={() => this.leftImageOnClick()}
              iscameraImage={true}
              cameraImage={icon_profile_photo_edit_button}
              cameraImageOnClick={() => this.cameraImageOnClick()}
              secondMenu={true}
              secondMenuImage={ic_Notes}
              secondMenuImageOnClick={() =>
                multipleTapHandler.multitap(
                  () => this.secondMenuImageOnClick(),
                  "PatientNotes"
                )
              }
              isPatient={true}
              photo={this.state.photo ? this.state.photo.path : null}
            />

            {this.state.listcount == 0 ? (
              <EmptyHomeOnlyTitle
                isLottie={true}
                imagePath={empty_vc}
                title={"Seems like you have no\nrecords for " + FullName}
                colorCode={"red"}
                isShowButton={false}
                description={"Let's get started"}
              />
            ) : (
              <PatientVisitHistoryComponent
                {...this.props}
                data={this.props.patientvisit.patientRxList}
                findGraph={this.state.findData}
                investGraph={this.state.investData}
                loadMore={this.loadMore.bind(this)}
                itemLongClick={(item) => this.itemLongClick(item)}
                tooltipClicked={(item) => this.tooltipClicked(item)}
                patientVisitHistryIncomplete={
                  this.props.patientVisitHistryIncomplete
                }
                itemClick={(callFrom, type) => this.itemClick(callFrom, type)}
              />
            )}

            {this.state.showTooltip && this.props.patientVisitHistryFAB ? (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 5,
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: Platform.isPad ? 80 : 25,
                  marginBottom: Platform.isPad ? 80 : 36,
                }}
              >
                <Tooltip
                  topAdjustment={
                    Platform.OS === "android" ? -StatusBar.currentHeight : 0
                  }
                  animated={true}
                  isVisible={this.props.patientVisitHistryFAB}
                  backgroundColor={"rgba(0,0,0,0.5)"}
                  contentStyle={{
                    backgroundColor: "#6f6af4",
                    height: "100%",
                  }}
                  tooltipStyle={{ right: 20, alignItems: "flex-end" }}
                  content={
                    <TouchableOpacity
                      style={{ backgroundColor: "#6f6af4" }}
                      onPress={() => {
                        this.toolTipClick(this.state.listcount);
                      }}
                    >
                      <AddPatient
                        imagePath={ic_popup_Add_Button_Icon}
                        title={"Quick Add"}
                        description={
                          "Create Precriptions, Appointments or add Patients using this option"
                        }
                      />
                    </TouchableOpacity>
                  }
                  //(Must) This is the view displayed in the tooltip
                  placement="top"
                  //(Must) top, bottom, left, right, auto.
                  onClose={() => this.toolTipClick(this.state.listcount)}
                //(Optional) Callback fired when the user taps the tooltip
                >
                  <View>
                    <Image
                      style={{
                        resizeMode: "contain",
                        alignSelf: "flex-end",
                        justifyContent: "flex-end",
                        width: 55,
                        height: 55,
                      }}
                      source={ic_Add_Clinic_Button}
                    />
                  </View>
                </Tooltip>
              </TouchableOpacity>
            ) : (
              this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                this.props.doctorProfile.DoctorData.RoleId != 1 ?
                <FAB
                  {...this.props}
                  actions={this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                    this.props.doctorProfile.DoctorData.RoleId == 3 ? actions :
                    actions.filter(x => x.text == "Create Prescription")}
                  fabtouch={(name) => this.fabtouch(name)}
                  listcount={this.state.listcount}
                /> : null
            )}
          </View>
        }
        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toastTextColor}
              imagePath={this.state.toastImagePath}
              description={this.state.description}
            />,

            2000
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
            width: "95%",
            zIndex: 1000,

            backgroundColor: this.state.toastBgColor,

            borderRadius: 15,
          }}

          ref={(ref) => this.toast = ref}
        />
      </View>

    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  patientProfile: state.patientProfile,
  patientVisitHistryIncomplete:
    state.tooltip.toolTipStatus.patientVisitHistryIncomplete,
  patientVisitHistryFAB: state.tooltip.toolTipStatus.patientVisitHistryFAB,
  //  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  // patientmobile: state.patientvisit.patientDetails.Mobile,
  // patientmail: state.patientvisit.patientDetails.CommonDetails.EmailAddres,
});

const mapDispatchToProps = (dispatch) => ({
  getRxList: (data) => dispatch(getRxList(data)),
  resetRxLit: (data) => dispatch(resetRxLit(data)),
  resetRxList: () => dispatch(resetRxList()),
  loadMoreRxList: (data) => dispatch(loadMoreRxList(data)),
  sendPaymentLink: (mobile, dlink) => dispatch(sendPaymentLink(mobile, dlink)),
  deletePatient: (id, data) => dispatch(deletePatient(id, data)),
  deletePatientVisit: (patientvisitid, data) =>
    dispatch(deletePatientVisit(patientvisitid, data)),

  delete_patient: (patient_id, PatientName, doctor_id, cid, action) =>
    dispatch(delete_patient(patient_id, PatientName, doctor_id, cid, action)),
  updatePatientDetails: (patientid, data) =>
    dispatch(updatePatientDetails(patientid, data)),
  editPatentDetails: (val) => dispatch(editPatentDetails(val)),
  setPatientHabits: (habits) => dispatch(setPatientHabits(habits)),
  setPatientHistory: (history) => dispatch(setPatientHistory(history)),
  setPatientData: (data) => dispatch(setPatientData(data)),
  addPatientAllergy: (allery) => dispatch(addPatientAllergy(allery)),
  setPrescriptionVisitId: (id) => dispatch(setPrescriptionVisitId(id)),
  getPaymentLink: (data) => dispatch(getPaymentLink(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  resetMedicine: () => dispatch(resetMedicine()),
  addToPrescription: (list) => dispatch(addToPrescription(list)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  updatePatientOBHistory: (patientGender) =>
    dispatch(updatePatientOBHistory(patientGender)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
  setlab: (data) => dispatch(setlab(data)),
  resetOpthalData: () => dispatch(resetOpthalData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientVisitHistoryContainer);
