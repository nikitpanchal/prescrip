//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import {
  BG,
  lefticon,
  icon_close_white,
  ic_back_black,
  icon_search_button_blue,
  ic_Close_Button,
  icon_Reemove_Button,
  trans_collapsed,
  trans_expand,
  ic_Teal_BG_578,
  ic_Blue_BG_578,
  icon_search_white,
  icon_Three_Dot_Menu_Button,
  Black_back,
  Search_button_light_blue,
  ic_note_delete,
  icon_List_First_Element_Add_Button_Blue,
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import Modal from "react-native-modalbox";
import {
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,

  ImageBackground,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import {
  setDoctorData,
  setClinicDetails,
  setPatientCount,
} from "../../actions/doctorProfile";
import {
  editPatentDetails,
  patientPrescriptionList,
  setPatientData,
  updatePatientOBHistory,
  discardPatient,
} from "../../actions/patientProfie";
import { setPatientId } from "../../actions/patientVisit";
import Database from "../../utils/db";
import {
  setVCTransactionDetails,
  setPaymentLink,
  setNavigationFlow,
} from "../../actions/patientVisit";
import { setCurrentTab } from "../../actions/auth";
import { add_custom_data } from "../../actions/sync";

import {
  empty_PatientList,
  ic_Add_Clinic_Button,
  blue_circle_with_plus,
  icon_Help,
  icon_Left_Button,
  icon_Right_Button,
  icon_Wallet_Icon,
  ic_clock,
  Profile_Image,
  ic_Add_Prescription,
  ic_Contact,
  ic_Mark_as_done,
  ic_Cancel_Appoointment,
  ic_Patient_Image,
  ic_whatsapp,
} from "../../constants/images";
import { ic_sync_fab, ic_sync_small } from "../../constants/images";

import { FloatingAction } from "react-native-floating-action";

import LottieView from "lottie-react-native";

import SyncModal from "../../components/Modal/syncModal";
//import react in our code.
//import all the components we are going to uddse.

//import Carousel from 'react-native-banner-carousel';
import Tooltip from "react-native-walkthrough-tooltip";
import styles from "../Header/styles";
import AddPatient from "../Tooltips";
import Images from "../../Theme/Images";
import HeaderData from "../Header/header";
import PrescriptionHeader from "../PrescriptionHeader/PrescriptionHeaderDelay";
import FAB from "../FAB/FAB";
import EmptyHome from "../EmptyHome/EmptyHome";
import VideoCunsultingComponent from "../VideoCunsultingComponent";

import { ic_Purple_BG_578 } from "../../constants/images";
import { month, isName } from "../../commonmethods/validation";
import { set } from "react-native-reanimated";
import PatientComponent from "../PatientComponent/PatientComponent";
//import AddClinicPopup from '../Modal/addClinicPopup';
import { patients_list, delete_patient, delete_patient_email } from "../../actions/auth";
const colorCode = "#881896";
const passMothFirstDate = new Date(
  new Date().setMonth(new Date().getMonth() - 1)
); // new Date();
import ToastComponent from "../../components/Toast/toastComponent";
const { height, width } = Dimensions.get("window");
import Toast, { DURATION } from "react-native-easy-toast";
import LinearGradient from "react-native-linear-gradient";
import { stubFalse } from "lodash";
import NoNetwork from "../../components/NoNetwork/noNetwork";
import multipleTapHandler from "../../components/MultiTapHandle/index";

class MyPatientsScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.myText = React.createRef();
    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;
    this.state = {
      isInternetOn: true,
      NoNetworkMsg: "",
      showSyncModal: false,
      searchText: "sourabh",
      showalertModal: false,
      finalArrayAfterTabClick: [],
      passMothFirstDate: passMothFirstDate,
      dataIsPresent: true,
      isShowButton: false,
      startIndex: 0,
      EmptyHomeTitle: "No patients",
      EmptyHomeDescription:
        "Looks like you havent added any Patient, add from here",
      toolTipVisible: false,

      isConsulting: false,
      pendingCunsultingDescription: "Khurana Clinic ˅ ",
      isPendingCunsulting: false,
      phonenumber: "",
      firstSearch: true,
      normalComplients: [],
      pastComplients: [],

      isSearchBoxShowing: true,
      selectedComplients: [],
      newName: "",
      // searchText: "",
      //Toast States
      description: "",
      showToast: false,
      patientCount: "",

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      isLoading: false,
      exactSearch: 2, delPatientId: '', delPatientFullName: '', delPatientCid: '', otp: ''

      //state to control the visibility of Tooltip
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    this.willFocusSubscription();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    if (this.props.route.params.callFrom == "AppointmentVC") {
      this.props.navigation.navigate("AppointmentTypesContainer", {
        isPatClicked: false,
      });
    } else {
      this.props.navigation.goBack(null);
    }

    if (this.props.route.params) {
      this.props.route.params.returnPatientData(true);
    }
    return true;
  }

  retryClick(isInternetOn) {
    if (isInternetOn) {
      this.setState({
        isInternetOn: true,
      });
      //this.props.dispatch({ type: 'GET_RXLIST_SUCCESS', payload: { data} });

      this.setVCDPage();

      //alert("You are online!");
    } else {
      alert("You are offline!");
    }
    // alert('sad',isInternetOn)
  }
  onClick() {
    //  this.props.screenProps.rootNavigation.navigate('VCWhatsAppNumberContainer')
  }

  leftImageOnClick() {
    //if(this.state.isSearchBoxShowing)
    //{

    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;

    this.setVCDPage();
    this.setState({
      isSearchBoxShowing: false,
      newName: "",
      startIndex: 0,
      searchText: "",
    });

    // }
    //else{
    //  Keyboard.dismiss()
    //this.props.navigation.goBack()
    multipleTapHandler.clearNavigator();
    if (this.props.route.params.callFrom == "AppointmentVC") {
      this.props.navigation.navigate("AppointmentTypesContainer", {
        isPatClicked: false,
      });
    } else {
      this.props.navigation.goBack(null);
    }
    if (this.props.route.params) {
      this.props.route.params.returnPatientData(true);
    }
    return true;
  }
  Render_Footer() {
    return this.state.isLoading ? (
      <View style={{}}>
        <ActivityIndicator size="large" color="#0066D7" />
      </View>
    ) : null;
  }

  componentDidMount() {
    this.setVCDPage();

    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        if (
          this.myText &&
          this.myText.props &&
          this.myText.props.children
        ) {
          // alert()

          this.searchText = this.myText.props.children;
        }
        //this.props.setCurrentTab(this.props.route.key);
        //this.setVCDPage();
      }
    );
  }

  hitNextData(startIndex) {
    // this.searchText ="";
    this.firstSearch = false;
    this.startIndex = startIndex;

    this.setVCDPage();
  }

  setVCDPage() {
    // alert
    this.props
      .patients_list(
        this.startIndex,
        10,
        this.searchText,
        "",
        0,
        "",
        this.props.doctorProfile.DoctorData._id,
        this.props.patientCount ? this.props.patientCount : 0
      )
      .then((payload) => {
        var data = payload.payload ? payload.payload.data : null;
        if (payload.error) {
          switch (payload.error.data) {
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
        } else if (data.status == 0) {
          this.setState({
            isInternetOn: true,
            NoNetworkMsg: "",
            exactSearch: 0,
          });
          if (this.firstSearch) {
            this.setState({
              invalid: true,
              loading: false,
              isRefresh: true,
              finalArrayAfterTabClick: [],
              dataIsPresent: false,
            });
          } else {
            /*  this.setState({
              invalid: true, loading: false, isRefresh: true,
               finalArrayAfterTabClick: [],
               dataIsPresent :false
            })*/
          }

          if (data.data.length > 5) {
            this.setState({
              isLoading: true,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        } else if (data.status == 1) {
          this.props.setPatientCount(data.patientCount);
          this.setState({
            isInternetOn: true,
            NoNetworkMsg: "",
            // isLoading: true
          });
          if (this.firstSearch) {
            this.setState({
              finalArrayAfterTabClick: [],
              firstSearch: false,
            });
          }
          if (data.data.length > 0) {
            let finalArrayAfterTabClickfinal = this.state.finalArrayAfterTabClick.concat(
              data.data
            );

            let newData3 = finalArrayAfterTabClickfinal.filter((item) => {
              const itemData1 = `${item.FullName.toUpperCase()}`;
              const textData1 = this.searchText.toUpperCase();
              return itemData1 == textData1;
            });

            this.setState({
              finalArrayAfterTabClick: this.state.finalArrayAfterTabClick.concat(
                data.data
              ),
              dataIsPresent: true,
              patientCount: data.patientCount,
              exactSearch: newData3.length,
            });

            finalArrayAfterTabClickfinal = [];
            newData3 = [];

            setTimeout(() => {
              this.setState({
                isLoading: true,
              });
            }, 1500);
          } else {
            this.setState({
              finalArrayAfterTabClick: [],
              dataIsPresent: false,
              isLoading: false,
              exactSearch: 0,
            });
          }
        } else if (Array.isArray(data)) {
          this.setState({
            finalArrayAfterTabClick: data,
            firstSearch: false,
            isLoading: false,
            exactSearch: 0,
          });
        } else {
          this.setState({
            finalArrayAfterTabClick: [],
            dataIsPresent: false,
            isLoading: false,
            exactSearch: 0,
          });
        }
      });
  }

  filterArrayDateWise(data_for_list) {
    var dateStr = null;
    var dateStrCompare = null;
    var finalArray = [];
    var dateViaArray = [];
    data_for_list.forEach(function (element, i) {
      const compareDate = new Date(element.WhenEntered);

      dateStrCompare =
        compareDate.getDate() +
        " " +
        month[compareDate.getMonth() + 1] +
        " " +
        compareDate.getFullYear();

      if (i == 0) {
        dateStr = dateStrCompare;
      }

      if (dateStr != dateStrCompare) {
        finalArray.push({ title: dateStr, data: dateViaArray });

        dateStr = dateStrCompare;
        // dateViaArray.push(element)
        dateViaArray = [];
      }

      dateViaArray.push(element);

      if (data_for_list.length == i + 1) {
        finalArray.push({ title: dateStrCompare, data: dateViaArray });
        dateViaArray = [];
      }
    });

    // alert(finalArray.data.reduce((accum,item) => accum + item.ConsultFees, 0))

    this.setState({
      finalArrayAfterTabClick: finalArray,
      //monthlyEarning:
    });
  }
  itemLongClick(item) {
    // return;

    Alert.alert(
      "Prescrip",
      "Are you sure want to delete " + item.FullName + "?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({
              isLoading: true, delPatientId: item._id, delPatientFullName: item.FullName, delPatientCid: item.Cid
            });
            this.sendEmailForOTPVerification(item._id, item.FullName, item.Cid);
          }
        },
      ],
      { cancelable: true }
    );
  }

  confirmationClick(id, PatientName, cid) {
    let doctor_id = this.props.doctorProfile.DoctorData._id;

    this.props
      .delete_patient(id, PatientName, doctor_id, cid, 1, this.state.otp)
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
          this.props.setPatientCount(this.props.patientCount - 1);
          this.modalCity.close();
          this.searchText = "";
          this.firstSearch = true;
          this.startIndex = 0;

          this.setVCDPage();

          this.setState({
            showToast: true,
            description: payload.data.message,
            toastBgColor: "#29b62f",
            toastTextColor: "#fafdfa",
            toastImagePath: Images.Success,
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
            });
          }, 1500);
          // this.setState({
          //   showToast: true,
          //   description: data.payload.data.message
          // })

          // setTimeout(() => {
          //   this.setState({
          //     showToast: false,

          //   })

          // }, 2000);
        } else {
          if (payload.data.msg != 'Incorrect OTP.') {
            this.modalCity.close();
          }
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
          }, 1500);
          // Alert.alert("Prescrip", data.payload.data.msg)
          // this.setState({
          //   loading: false
          // })
        }
      });
  }

  searchAction(text, callFrom) {
    this.searchText = text.trim();
    this.firstSearch = true;
    this.startIndex = 0;

    this.setState({
      isRefreshData: true,
    });
    //if(text.length >=3)
    //  {
    if (callFrom == "hitAPI") {
      this.setVCDPage();
    }

    //  }
  }

  rightImageOnClick() {
    if (this.state.isSearchBoxShowing) {
      this.searchText = "";
      this.firstSearch = true;
      this.startIndex = 0;

      this.setVCDPage();
    }
    this.setState({
      normalComplients: [],
      pastComplients: [],
      newName: "",
      startIndex: 0,
      isSearchBoxShowing: this.state.isSearchBoxShowing
        ? true
        : !this.state.isSearchBoxShowing,
      searchText: "",
    });
  }
  onGotIt() {
    // this.props.screenProps.setTooltip("Appointments");
  }

  filterVcData(digiConsultationId) {
    const vcData = this.state.vcData.filter(function (e) {
      return e._id != digiConsultationId;
    });

    //  const DATA1 =vcData
    this.setState({
      EmptyHomeTitle:
        vcData.length > 0
          ? this.state.EmptyHomeTitle
          : "No pending Consultations for today",
      flatListTopMonth:
        vcData.length > 0
          ? month[new Date(vcData[0].WhenEntered).getMonth()]
          : "",
      flatListTopDate:
        vcData.length > 0 ? new Date(vcData[0].WhenEntered).getDate() : "",
      pendingCunsultingDescription: vcData.length + " Video Consultations",
      invalid: true,
      loading: false,
      isRefresh: true,
      vcData: vcData,
      DigitalConsultLength: vcData.length,
    });
    this.setState({
      vcData: vcData,
      isContactDetailsModal: false,
    });
    vcData = null;
  }

  popup_click(item) {
    switch (item.name) {
      case "Mark as Done":
        this.props
          .mark_done_consultation(
            item.digiConsultationId,
            "1",
            this.props.doctorProfile.DoctorData._id
          )
          .then((payload) => {
            var data = payload.payload.data;
            if (data.status == 0)
              this.setState({ invalid: true, loading: false, isRefresh: true });
            else if (data.status == 1) {
              this.filterVcData(item.digiConsultationId);
            }
          });
        break;
      case "Cancel Appointment":
        this.props
          .cancel_consultation(
            item.digiConsultationId,
            "1",
            this.props.doctorProfile.DoctorData._id
          )
          .then((payload) => {
            var data = payload.payload.data;
            if (data.status == 0)
              this.setState({ invalid: true, loading: false, isRefresh: true });
            else if (data.status == 1) {
              this.filterVcData(item.digiConsultationId);
            }
          });
        break;
      default:
        break;
    }
  }

  meallabel() {
    var content = this.state.ContactDetails.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={() => this.popup_click(item)}
          style={{ flexDirection: "column", justifyContent: "center" }}
        >
          <View style={{ backgroundColor: "#D3D3D3", height: 1 }}></View>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Image
              style={{ width: 35, height: 35, alignSelf: "center" }}
              source={item.imagePath}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: item.colorCode,
                  fontSize: 19,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
    return content;
  }

  meallabel1() {
    var content = this.state.ContactDetails1.map((item, index) => {
      return (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={{ backgroundColor: "#D3D3D3", height: 1 }}></View>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Image
              style={{ width: 35, height: 35, alignSelf: "center" }}
              source={item.imagePath}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: item.colorCode,
                  fontSize: 19,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        </View>
      );
    });
    return content;
  }

  closeClick() {
    this.setState({
      isContactDetailsModal: false,
    });
  }

  addPatient() {
    if (isName(this.searchText) == "name") {
      if (!this.props.route.params.callFrom == "addReceipt")
        this.props.setNavigationFlow("patientList");
      this.props.navigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
        patientName: this.searchText,
        showSearch: false,
        callFrom: "addPatient",
      });
      this.props.editPatentDetails(true);
      //Clear out redux data
      this.props.discardPatient();
    } else if (isName(this.searchText) == "number") {
      if (!this.props.route.params.callFrom == "addReceipt")
        this.props.setNavigationFlow("patientList");
      this.props.navigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
        patientNumber: this.searchText,
        showSearch: false,
        callFrom: "addPatient",
      });
      this.props.editPatentDetails(true);
      //Clear out redux data
      this.props.discardPatient();
    } else {
      Alert.alert("Prescrip", "Please search either number or name");
    }

    //this.props.screenProps.rootNavigation.navigate('DoctorProfileViewContainer');
  }

  showVisitHistory(item) {
  
    if (this.props.route.params.callFrom == "addReceipt") {
      multipleTapHandler.clearNavigator();

      multipleTapHandler.multitap(
        () =>
          this.props.navigation.navigate("AddBillingReceiptContainer", {
            itemData: item, updateData: this.props.route.params.updateData
          }),
        "AddBillingReceiptContainer"
      );
    } else if (this.props.route.params.callFrom == "AppointmentVC") {
      multipleTapHandler.clearNavigator();

      multipleTapHandler.multitap(
        () =>
          this.props.navigation.navigate("AppointmentTypesContainer", {
            itemData: item,
            isPatClicked: true,
          }),
        "AppointmentTypesContainer"
      );
    } else {
      // return;

      let data = {
        id: item._id,
        patientId: item.Cid, //cid should be passed while getting RX List
      };
      let vcData = {
        consult_id: "",
        trans_id: "",
      };
      this.props.setVCTransactionDetails(vcData);
      this.props.setPaymentLink("");
      this.props.setPatientId(data);
      this.props.navigation.navigate("PatientVisitHistoryContainer", {
        returnPatientData: this.refershList,
        callFrom: "itemclick",
      });
      Keyboard.dismiss();
    }
  }
  refershList = (showSearch, callFrom) => {
    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;

    if (callFrom && callFrom != "itemclick") {
      this.setVCDPage();

      this.setState({
        isSearchBoxShowing: false,
        newName: "",
        startIndex: 0,
        searchText: "",
        exactSearch: 0,
      });
    }

    // this.setVCDPage()
  };

  showModal() {
    this.setState({
      showSyncModal: true,
    });
  }
  showalertModal() {
    this.setState({
      showalertModal: true,
    });
  }
  hideModal() {
    this.setState({
      showSyncModal: false,
    });
  }

  hidealertModal() {
    this.setState({
      showalertModal: false,
    });
  }
  sendEmailForOTPVerification(id, PatientName, cid) {
    let doctor_id = this.props.doctorProfile.DoctorData._id;
    let doctorName = this.props.doctorProfile.DoctorData.DoctorFName + ' ' + this.props.doctorProfile.DoctorData.DoctorLName;
    let doctorEmail = this.props.doctorProfile.DoctorData.DoctorEmail;
    this.props
      .delete_patient_email(doctorName, doctorEmail, id, doctor_id, cid, PatientName)
      .then(({ payload, error }) => {
        if (error) {
          this.setState({
            description: "Currently internet is not avaliable",
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            toastImagePath: Images.Error, isLoading: false
          });
          switch (error.data) {
            case "Network Error":
              this.setState({
                description: "Currently internet is not avaliable",
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error, isLoading: false
              });
              break;
            default:
              this.setState({
                description: "Error in gettting response from server",
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error, isLoading: false
              });
              break;
          }



          return;
        }
        if (payload.data.status == 1) {
          this.modalCity.open();
          this.setState({
            isLoading: false
          });
        }
        else {

          this.setState({
            description: "We are facing problem sending email currently, Please try again later",
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            toastImagePath: Images.Error, isLoading: false
          });
        }

      });
  }

  render() {
    const setModalVisible = true;
    const modalVisible = true;

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0, width: '80%', borderRadius: 10, height: 250,
            overflow: 'hidden', justifyContent: 'center', margingTop: 30
          }}

          ref={(ref) => this.modalCity = ref}
          swipeToClose={true}
          position={"center"} >
          <View style={{ flex: 1 }}>
            <View style={{

              flexDirection: 'column',
              flex: 1, paddingVertical: 20, paddingHorizontal: 10,
              justifyContent: 'flex-start', alignItems: 'center'
            }}>

              <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: 'NotoSans', color: '#000', marginTop: 20 }}>Verify to Delete Patient</Text>
              <TextInput

                maxLength={4}

                autoFocus={true}
                value={this.state.otp}
                onChangeText={(txt) => {
                  this.setState({ otp: txt })
                }}
                keyboardType="numeric"
                style={{
                  width: '80%',
                  backgroundColor: 'none',
                  marginVertical: 10,
                  letterSpacing: 30,
                  textAlign: "center",
                  color: "#06c0d7",
                  margin: 0,
                  paddingBottom: 8,
                  fontWeight: "600",
                  fontSize: 18,

                  fontFamily: "NotoSans-Bold",
                  borderBottomWidth: 1,
                }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{
                  fontSize: 14, fontFamily: 'NotoSans',
                  color: '#000', textAlign: 'center'
                }}>
                  {'To delete ' + this.state.delPatientFullName + ' please enter 4 Digit OTP sent to registered Email Id:' + this.props.doctorProfile.DoctorData.DoctorEmail}
                </Text>



              </View>
              <TouchableOpacity
                onPress={() => {
                  this.state.otp ? this.confirmationClick(this.state.delPatientId, this.state.delPatientFullName,
                    this.state.delPatientCid) : Alert.alert("Please enter OTP to delete the Patient");
                }}
                // onPress={this.handleOpenCamera}
                style={{
                  width: "45%",
                  borderRadius: 25,
                  paddingVertical: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#176dd8",
                  borderWidth: 1, marginTop: 20
                }}
              >
                <Text
                  uppercase={true}
                  style={{
                    fontSize: 14,
                    letterSpacing: 0.8,
                    color: "#176dd8",
                    fontFamily: "NotoSans-Bold",
                    alignSelf: "center",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>


          </View>
        </Modal>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 65 : 0}
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "#F6F9FA",
          }}
        >
          <View>
            <PrescriptionHeader
              {...this.props}
              title={
                "MY PATIENTS " +
                (this.state.patientCount
                  ? "(" + this.state.patientCount + ")"
                  : "")
              }
              bgImage={null}
              bgColor={"white"}
              cursorColor={"#0869d8"}
              tintColor={"#0b69d8"}
              description={"Search by patient name, mobile"}
              titleColor={"#919191"}
              descriptionColor={"#0b69d8"}
              placeholderTextColor={"black"}
              placeTextColor={"black"}
              placeholderTextSize={17}
              descriptionSize={17}
              leftImage={Black_back}
              rightImage={Search_button_light_blue}
              rightImageCross={this.searchText != "" ? ic_note_delete : null}
              isSearchBoxShowing={this.state.isSearchBoxShowing}
              type={5}
              callFrom={"search"}
              searchAction={(text, callFrom) =>
                this.searchAction(text, callFrom)
              }
              leftImageOnClick={() => this.leftImageOnClick()}
              rightImageOnClick={() => this.rightImageOnClick()}
            />
          </View>

          {
            //this.searchText.trim() != "" && (!this.state.exactSearch >0)
            this.searchText.trim() != "" ? (
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
                    marginVertical: 15,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text

                    ref={(ref) => this.myText = ref}
                    style={{
                      fontFamily: "NotoSans-Bold",
                      fontSize: 22,
                      color: "#0b69d8",
                    }}
                  >
                    {this.searchText}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#0b69d8",
                    }}
                  >
                    Add as New Patient
                  </Text>
                </View>

                <TouchableOpacity
                  style={{ flexDirection: "column", justifyContent: "center" }}
                  onPress={() => this.addPatient()}
                >
                  <Image
                    style={{ height: 35, width: 35, marginHorizontal: 20 }}
                    source={icon_List_First_Element_Add_Button_Blue}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }

          {this.state.dataIsPresent ? (
            <PatientComponent
              {...this.props}
              finalArrayAfterTabClick={this.state.finalArrayAfterTabClick}
              imagePath={Images.ic_profile_dummy_image}
              onPatientClick={(item) => this.showVisitHistory(item)}
              onAddPatientClick={() => this.addPatient()}
              itemLongClick={(item) => this.itemLongClick(item)}
              startIndex={this.startIndex}
              hitNextData={(startIndex) => this.hitNextData(startIndex)}
              Render_Footer={() => this.Render_Footer()}
              searchText={this.searchText.trim()}
              isShowAdd={this.state.exactSearch > 0 ? false : true}
            />
          ) : (
            <EmptyHome
              {...this.props}
              isLottie={true}
              imagePath={empty_PatientList}
              //imagePath={Images.ic_Video_Consultations_Empty_Icon}
              title={this.state.EmptyHomeTitle}
              
              colorCode={colorCode}
              isShowButton={this.state.isShowButton}
              description={
                this.searchText == ""
                  ? null
                  : "For adding '" +
                  this.searchText +
                  "' as New Patient\nYou can do it by clicking \u2295 symbol"
              }
              // description={this.state.EmptyHomeDescription}
              onClick={() => this.onClick()}
            />
          )}
        </KeyboardAvoidingView>

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
          ref={(ref) => this.toast = ref}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showalertModal}
          ref={"modal"}
          onRequestClose={() => {
            this.setState({ showalertModal: false });
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <TouchableOpacity
              onPress={() => this.hidealertModal()}
              style={{
                alignSelf: "flex-end",
                marginRight: 9,
                marginBottom: -10,
                justifyContent: "center",
                alignItems: "center",
                elevation: 12,
                zIndex: 1,
              }}
            >
              <Image
                source={ic_Close_Button}
                style={{ height: 23, width: 23, resizeMode: "contain" }}
              />
              {/* <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> */}
            </TouchableOpacity>

            {/*Modal View*/}

            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 15,

                // padding: 20,
                width: "90%",
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
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "flex-start",
                  width: "100%",
                  padding: 20,
                }}
              >
                {/** Title */}
                <Text
                  style={{
                    color: "#2e2e2e",
                    fontSize: 24,
                    textAlign: "left",
                    paddingVertical: 10,
                  }}
                >
                  {"Let's add a clinic?"}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    color: "#707070",
                    fontSize: 18,
                    textAlign: "left",
                  }}
                >
                  {"Please add a clinic before proceeding."}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 20,
                    paddingBottom: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.Addclinic()}
                    style={{
                      alignItems: "center",
                      width: "95%",
                    }}
                  >
                    <LinearGradient
                      colors={["#1b7cdb", "#07cef2"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      locations={[0, 0.8]}
                      style={{
                        width: "100%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        borderRadius: 25,
                      }}
                    >
                      <Text
                        uppercase={true}
                        style={{
                          fontSize: 18,
                          color: "#fff",
                          fontFamily: "NotoSans-Bold",
                        }}
                      >
                        Add clinic
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

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
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientCount: state.doctorProfile.patientCount,
});

const mapDispatchToProps = (dispatch) => ({
  //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
  patients_list: (
    skip,
    limit,
    search,
    sortby,
    age,
    gender,
    doctorid,
    patientCount
  ) =>
    dispatch(
      patients_list(
        skip,
        limit,
        search,
        sortby,
        age,
        gender,
        doctorid,
        patientCount
      )
    ),
  delete_patient: (patient_id, PatientName, doctor_id, cid, action, otp) =>
    dispatch(delete_patient(patient_id, PatientName, doctor_id, cid, action, otp)),
  delete_patient_email: (DoctorName, doctorEmail,
    PatientId,
    doctor_id,
    cid, pname) =>
    dispatch(delete_patient_email(DoctorName, doctorEmail,
      PatientId,
      doctor_id,
      cid, pname)),
  updatePatientOBHistory: (patientGender) =>
    dispatch(updatePatientOBHistory(patientGender)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setPatientId: (data) => dispatch(setPatientId(data)),
  editPatentDetails: (editPatient) => dispatch(editPatentDetails(editPatient)),
  patientPrescriptionList: (data) => dispatch(patientPrescriptionList(data)),
  setPatientData: (patientData) => dispatch(setPatientData(patientData)),
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  setVCTransactionDetails: (data) => dispatch(setVCTransactionDetails(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  discardPatient: () => dispatch(discardPatient()),
  setClinicDetails: (clinic) => dispatch(setClinicDetails(clinic)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  setNavigationFlow: (data) => dispatch(setNavigationFlow(data)),
  setPatientCount: (data) => dispatch(setPatientCount(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPatientsScreen);
