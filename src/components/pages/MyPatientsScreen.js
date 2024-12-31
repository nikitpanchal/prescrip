//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used
import Modal from "react-native-modalbox";
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
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import {
  Header,
  Content,
  Tab,
  TabHeading,
  Tabs,
  ScrollableTab,
} from "native-base";
import Tab1 from "../../containers/UseFavourite/UseFav";
import Tab2 from "../../containers/UseFavourite/UseCerti";
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
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import {
  setDoctorData,
  setClinicDetails,
  setPatientCount,
  setRecentPatient,
} from "../../actions/doctorProfile";
import {
  editPatentDetails,
  patientPrescriptionList,
  setPatientData,
  updatePatientOBHistory,
  discardPatient
} from "../../actions/patientProfie";
import { setPatientId } from "../../actions/patientVisit";
import Database from "../../utils/db";
import {
  setVCTransactionDetails,
  setPaymentLink,
  setNavigationFlow,
} from "../../actions/patientVisit";
import { setCurrentTab, isRefreshBilling } from "../../actions/auth";
import { add_custom_data } from "../../actions/sync";
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
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
import PrescriptionHeader from "../PrescriptionHeader/PrescriptionHeader";
import FAB from "../FAB/FAB";
import EmptyHome from "../EmptyHome/EmptyHome";
import VideoCunsultingComponent from "../VideoCunsultingComponent";

import { ic_Purple_BG_578 } from "../../constants/images";
import { month } from "../../commonmethods/validation";
import { set } from "react-native-reanimated";
import PatientComponent from "../PatientComponent/PatientComponent";
import PatientSectionComponent from "../PatientComponent/PatientSectionComponent";

//import AddClinicPopup from '../Modal/addClinicPopup';
import {
  patients_list,
  patients_recent_list,
  delete_patient, delete_patient_email
} from "../../actions/auth";
const colorCode = "#881896";
const passMothFirstDate = new Date(
  new Date().setMonth(new Date().getMonth() - 1)
); // new Date();
import ToastComponent from "../../components/Toast/toastComponent";
const { height, width } = Dimensions.get("window");
import Toast, { DURATION } from "react-native-easy-toast";
import LinearGradient from "react-native-linear-gradient";

import NoNetwork from "../../components/NoNetwork/NetworkGlobal";
import NoSubscription from "../../components/NoNetwork/NoSubscription";
import PatientSearchComponent from "../PatientComponent/PatientSearchComponent";
import { Difference_In_Days1 } from "../../commonmethods/common";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class MyPatientsScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor() {
    super();

    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;
    this.state = {
      isInternetOn: true,
      otp: '',
      NoNetworkMsg: "",
      showSyncModal: false,
      showalertModal: false,
      finalArrayAfterTabClick: [],
      finalArrayAfterTabClickRecent: [],
      isRecent: 0,
      passMothFirstDate: passMothFirstDate,
      dataIsPresent: true,
      isShowButton: false,
      startIndex: 0,
      EmptyHomeTitle: "No patients",
      EmptyHomeDescription:
        "Looks like you havent added any Patient, add from here",
      toolTipVisible: false,
      isConsulting: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "Khurana Clinic ˅ ",
      isPendingCunsulting: false,
      phonenumber: "",
      firstSearch: true,
      normalComplients: [],
      pastComplients: [],
      isSearchBoxShowing: false,
      selectedComplients: [],
      newName: "",
      searchText: "",
      //Toast States
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      isLoading: false,
      refresh: false, delPatientId: '', delPatientFullName: '', delPatientCid: ''

      //state to control the visibility of Tooltip
    };
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
    this.props.screenProps.rootNavigation.navigate("VCWhatsAppNumberContainer");
  }

  leftImageOnClick() {
    Keyboard.dismiss();
    if (this.state.isSearchBoxShowing) {
      this.searchText = "";
      this.firstSearch = true;
      this.startIndex = 0;
      this.setState({ isSearchBoxShowing: !this.state.isSearchBoxShowing });
      this.setVCDPage();
    }
    //this.props.screenProps.rootNavigation.openDrawer();
    this.props.screenProps.rootNavigation.dispatch(DrawerActions.openDrawer());

  }

  Render_Footer() {
    return this.state.isLoading ? (
      <View style={{}}>
        <ActivityIndicator size="large" color="#0066D7" />
      </View>
    ) : null;
  }
  shouldComponentUpdate(nextProps, nextState) {

    var currentProps = this.props;
    if (nextProps.screenProps.currentComponent == 'MyPatients' && nextProps.screenProps.switchTime
      != currentProps.screenProps.switchTime) {

      this.setVCDPage();
    }
    else if (nextProps.screenProps.switchTime
      == 0 && currentProps.screenProps.switchTime == 0) {
     // this.setVCDPage();
    }

    return true;


  }
  componentDidMount() {

    // getScreenNameAnalytics({
    //   screen_name: "MyPatient",
    //   screen_class: "MyPatientScreen",
    // });
    // this.props.setCurrentTab(this.props.route.key);
    // this.props.isRefreshBilling(true);
    // this.setVCDPage();
    this.unsubListener = this.props.navigation.addListener(
      "focus",
      () => {
        getScreenNameAnalytics({
          screen_name: "MyPatient",
          screen_class: "MyPatientScreen",
        });
        this.props.setCurrentTab(this.props.route.key);
        this.props.isRefreshBilling(true);
        this.setVCDPage();
      }
    );
  }
  componentWillUnmount() {
    if (this.unsubListener)
      this.unsubListener();
  }

  // hitNextData(startIndex) {
  //   // this.searchText ="";
  //   this.firstSearch = false;
  //   this.startIndex = startIndex;

  //   this.setVCDPage();
  //   console.log('vc 4');
  // }

  setVCDPage(cfrom) {
   
    this.props
      .patients_recent_list(
        this.startIndex,
        50,
        this.searchText,
        "",
        0,
        "",
        this.props.doctorProfile.DoctorData._id
      )
      .then((payload) => {
        var data = payload.payload ? payload.payload.data : null;
        if (payload.error) {
          switch (payload.error.data) {
            case "Network Error":
              this.setState({
                refresh: false,
                isInternetOn: false,
                NoNetworkMsg: "Currently internet is not avaliable",
              });
              break;
            default:
              this.setState({
                refresh: false,

                NoNetworkMsg: "Error in gettting response from server",
              });
              break;
          }

          return;
        } else if (data.status == 0) {
          this.setState({
            isInternetOn: true,
            NoNetworkMsg: "",
            refresh: false,
          });

          if (data.data.length > 5) {
            this.setState({
              // isLoading: true
            });
          } else {
            this.setState({
              //  isLoading: false
            });
          }
        } else if (data.status == 1) {
          //  this.props.setPatientCount(data.patientCount)
          this.setState({
            isInternetOn: true,
            NoNetworkMsg: "",
            refresh: false,
            isRecent: data.isRecent,
            // isLoading: true
          });
          /*
            data.recentPatients = [{
               "_id": "600966c325459d15dcb199b2",
               "Mobile": "9975535319",
               "FullName": "Cxzxzc",
               "Gender": "Male",
               "DOB": "2009-02-01T12:01:03.962Z",
               "PatientId": 3,
               "WhenEntered": "2021-02-01T12:01:06.644Z",
               "Userimage": "",
               "Cid": 3,
               "LastSeen": "2021-02-04T05:07:14.545Z"
             }, {
               "_id": "600966c325459d15dcb199b2",
               "Mobile": "9975535319",
               "FullName": "Sourya Patil",
               "Gender": "Male",
               "DOB": "1996-02-02T13:53:50.739Z",
               "PatientId": 14,
               "WhenEntered": "2021-02-02T13:53:53.543Z",
               "Userimage": "",
               "Cid": 14,
               "LastSeen": "2021-02-03T05:06:27.266Z"
             }, {
               "_id": "5f86db70884675131c15428f",
               "Mobile": "7272801008",
               "FullName": "Abhib atil",
               "Gender": "Male",
               "DOB": "1999-02-02T14:33:23.660Z",
               "PatientId": 16,
               "WhenEntered": "2021-02-02T14:33:33.164Z",
               "Userimage": "",
               "Cid": 16,
               "LastSeen": "2021-02-03T05:05:59.903Z"
             }, {
               "_id": "5da42b392a811b1090a450b6",
               "Mobile": "9322562228",
               "FullName": "Ni",
               "Gender": "Male",
               "DOB": "1999-01-22T00:00:00.000Z",
               "PatientId": 22,
               "WhenEntered": "2021-01-22T10:48:59.280Z",
               "Userimage": "",
               "Cid": 22,
               "WhatsApp": "9322562216",
               "LastSeen": "2021-02-03T05:05:51.844Z"
             }, {
               "_id": "600966c325459d15dcb199b2",
               "Mobile": "9975535319",
               "FullName": "Sourabh Patil",
               "Gender": "Male",
               "DOB": "1995-02-02T13:20:52.533Z",
               "PatientId": 12,
               "WhenEntered": "2021-02-02T13:20:56.686Z",
               "Userimage": "",
               "Cid": 12,
               "LastSeen": "2021-02-02T13:53:31.319Z"
             }, {
               "_id": "600966c325459d15dcb199b2",
               "Mobile": "9975535319",
               "FullName": "Sourabh Patils",
               "Gender": "Male",
               "DOB": "1996-02-02T13:21:22.383Z",
               "PatientId": 13,
               "WhenEntered": "2021-02-02T13:21:32.357Z",
               "Userimage": "",
               "Cid": 13,
               "LastSeen": "2021-02-02T13:48:46.141Z"
             }, {
               "_id": "5f86db70884675131c15428f",
               "Mobile": "7272801008",
               "FullName": "Sourabh as",
               "Gender": "Male",
               "DOB": "1996-01-13T08:09:47.577Z",
               "PatientId": 10,
               "WhenEntered": "2021-01-13T08:09:50.051Z",
               "Userimage": "",
               "Cid": 10,
               "LastSeen": "2021-02-02T13:18:18.952Z"
             }, {
               "_id": "6017f049a54a07088457d3cc",
               "Mobile": "8877665544",
               "FullName": "Ds",
               "Gender": "Male",
               "DOB": "2009-02-02T05:29:25.342Z",
               "PatientId": 2,
               "WhenEntered": "2021-02-02T05:29:27.508Z",
               "Userimage": "",
               "Cid": 2,
               "LastSeen": "2021-02-02T13:12:32.619Z"
             }, {
               "_id": "600966c325459d15dcb199b2",
               "Mobile": "9975535319",
               "FullName": "Ads",
               "Gender": "Male",
               "DOB": "1997-02-01T12:01:44.803Z",
               "PatientId": 4,
               "WhenEntered": "2021-02-01T12:01:52.620Z",
               "Userimage": "",
               "Cid": 4,
               "LastSeen": "2021-02-01T13:01:51.766Z"
             }, {
               "_id": "6017f049a54a07088457d3cc",
               "Mobile": "8877665544",
               "FullName": "Ff",
               "Gender": "Male",
               "DOB": "1996-02-02T12:11:14.924Z",
               "PatientId": 3,
               "WhenEntered": "2021-02-02T12:11:18.199Z",
               "Userimage": "",
               "Cid": 3,
               "LastSeen": "2021-01-30T12:27:42.369Z"
             }];  */

          if (data.recentPatients.length > 0) {
            data.recentPatients.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.LastSeen) - new Date(a.LastSeen);
            });

            if (data.isRecent == 0) {
              var finalArray = [];

              finalArray.push({
                title: "All Patients",

                data: data.recentPatients,
              });

              this.setState({
                finalArrayAfterTabClick: finalArray,
                dataIsPresent: true,
              });
            } else {
              this.filterArrayDateWise(data.recentPatients);
            }

            /* this.setState({
             finalArrayAfterTabClick: data.recentPatients,
             dataIsPresent: true,
 
           })
           setTimeout(() => {
             this.setState({
               isLoading: true
             });
 
           }, 1500);*/
          } else {
            this.setState({
              finalArrayAfterTabClick: [],
              dataIsPresent: false,
              refresh: false,
              //   isLoading: false
            });
          }
        }
      });
  }

  filterArrayDateWise(data_for_list) {
    var dateStr = null;
    var dateStrCompare = null;
    var finalArray = [];
    var dateViaArray = [];
    var dateViaArray1 = [];
    data_for_list.forEach(function (element, i) {
      const compareDate = new Date(element.LastSeen);

      /*  let diff =Difference_In_Days1(new Date(element.LastSeen));
        if( diff > 1){
  
          dateViaArray1.push(element);
  
  
        }else{  */
      dateStrCompare =
        compareDate.getDate() +
        " " +
        month[compareDate.getMonth()] +
        " " +
        compareDate.getFullYear();

      if (i == 0) {
        dateStr = dateStrCompare;
      }

      if (dateStr != dateStrCompare) {
        finalArray.push({
          title: Difference_In_Days1(new Date(dateStr)) > 1 ? "older" : dateStr,

          data: dateViaArray,
        });

        dateStr = dateStrCompare;
        // dateViaArray.push(element)
        dateViaArray = [];
      }
      dateViaArray.push(element);

      if (data_for_list.length == i + 1) {
        finalArray.push({
          title:
            Difference_In_Days1(new Date(dateStrCompare)) > 1
              ? "older"
              : dateStrCompare,
          data: dateViaArray,
        });
        dateViaArray = [];
      }

      //}
    });

    /*  if(dateViaArray1.length >1 ){
        finalArray.push(
          { title: 'Older', data: dateViaArray1 }
        )
      }
  */
    // alert(finalArray.data.reduce((accum,item) => accum + item.ConsultFees, 0))

    var olderArray = [];

    finalArray.forEach(function (value, index) {
      // var olderArray1 =[];
      if (value.title == "older") {
        olderArray = olderArray.concat(value.data);
      }
    });

    finalArray = finalArray.filter(function (obj) {
      if (obj.title == "older") {
        return false;
      } else {
        return true;
      }
    });

    if (olderArray.length > 0) {
      finalArray.push({ title: "Older", data: olderArray });
    }

    this.setState({
      finalArrayAfterTabClick: finalArray,
      //monthlyEarning:
    });
  }

  addPatient() {
    //this.props.screenProps.rootNavigation.navigate('DoctorProfileViewContainer');
    this.props.setNavigationFlow("patientList");
    this.props.screenProps.rootNavigation.navigate("AddPatientContainer", {
      returnPatientData: this.refershList,
    });
    this.props.editPatentDetails(true);
    //Clear out redux data
    this.props.discardPatient();
  }

  itemLongClick(item) {
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
            if (this.props.doctorProfile.DoctorData.DoctorEmail) {
              this.setState({
                isLoading: true, delPatientId: item._id, delPatientFullName: item.FullName, delPatientCid: item.Cid
              });
              this.sendEmailForOTPVerification(item._id, item.FullName, item.Cid);

            }
            else {
              Alert.alert("Delete patients required email OTP verifcation, please update your Email Id")
            }
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
          this.modalCity.close();
          this.setVCDPage(679);

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
  onRefresh() {
    this.setState({ refresh: true }, () => {
      this.setVCDPage();
    });
  }
  rightImageOnClick() {
    //alert(this.props.home.currentTab =="MyPatients")

    this.props.setNavigationFlow("patientList");
    this.props.screenProps.rootNavigation.navigate("PatientSearchComponent", {
      returnPatientData: this.refershList,
      callFrom: "",
    });

    //this.props.screenProps.rootNavigation.navigate('PatientSearchComponent')
  }
  onGotIt() {
    this.props.screenProps.setTooltip("MyPatient");
  }

  showVisitHistory(item) {
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
    this.props.screenProps.rootNavigation.navigate(
      "PatientVisitHistoryContainer",
      { returnPatientData: this.refershList }
    );
  }
  refershList = () => {
    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;
    // this.setVCDPage();
  };

  showModal() {
    this.setState({
      showSyncModal: true,
    });
  }
  hideModal() {
    this.setState({
      showSyncModal: false,
    });
  }
  render() {


    this.props.screenProps.data = true;

    // Alert.alert(this.props.screenProps.IsUpdateReq.toString())
    return (
      <View style={{ flex: 1 }}>

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
        {this.state.showSyncModal ? (
          <SyncModal
            {...this.props}
            syncData={() => this.props.screenProps.getRecents()}
            showModal={() => this.showModal()}
            hideModal={() => this.hideModal()}
          ></SyncModal>
        ) : null}
        <View
          style={{
            flexdirection: "column",
            backgroundColor: "#F6F9FA",
            flex: 1,
          }}
        >
          <View>
            <PrescriptionHeader
              {...this.props}
              bgImage={ic_Blue_BG_578}
              bgColor={null}
              title={"My Patients"}
              currentTab={this.props.home.currentTab}
              titleSize={20}
              cursorColor={"#ffffff"}
              subscriptionDetails={this.props.doctorProfile.DoctorData.Subscription}
              description={null}
              descriptionSize={15}
              titleColor={"#fff"}
              descriptionColor={"#fff"}
              leftImage={Images.ic_Menu_Button}
              rightImage={icon_search_white}
              rightImageCross={icon_close_white}
              isSearchBoxShowing={this.state.isSearchBoxShowing}
              type={5}
              searchAction={(text) => this.searchAction(text)}
              leftImageOnClick={() => this.leftImageOnClick()}
              rightImageOnClick={() => this.rightImageOnClick()}
            />
          </View>
          {this.state.isLoading ? <View style={{
            zIndex: 99, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '100%', width: '100%', position: 'absolute'
          }}>
            <ActivityIndicator size="large" color="#0077c0" />
          </View>
            :
            null}
          {this.state.finalArrayAfterTabClick.length > 0 ? (
            <PatientSectionComponent
              {...this.props}
              finalArrayAfterTabClick={this.state.finalArrayAfterTabClick}
              isRecent={this.state.isRecent}
              onPatientClick={(item) => this.showVisitHistory(item)}
              itemLongClick={(item) => this.itemLongClick(item)}
              imagePath={Images.ic_profile_dummy_image}
              rightImageOnClick={() => this.rightImageOnClick()}
              onRefresh={() => this.onRefresh()}
              refresh={this.state.refresh}
            />
          ) : (
            <EmptyHome
              {...this.props}
              isLottie={true}
              refreshEvent={() => { this.onRefresh() }}
              refreshing={this.state.refresh}
              imagePath={empty_PatientList}
              //imagePath={Images.ic_Video_Consultations_Empty_Icon}
              title={this.state.EmptyHomeTitle}
              colorCode={colorCode}
              isShowButton={this.state.isShowButton}
              description={this.state.EmptyHomeDescription}
              onClick={() => this.onClick()}
            />
          )}
        </View>
        {this.props.screenProps.IsUpdateReq ? (
          <FloatingAction
            iconHeight={45}
            iconWidth={45}
            position={"right"}
            color="transparent"
            floatingIcon={ic_sync_fab}
            buttonSize={38}
            overlayColor="transparent"
            distanceToEdge={{ horizontal: 45, vertical: 120 }}
            // actions={this.props.actions}
            onPressMain={() => this.showModal()}
          />
        ) : null}
        {this.state.dataIsPresent ? (
          <FloatingAction
            iconHeight={55}
            iconWidth={55}
            position={"right"}
            color="transparent"
            floatingIcon={ic_Add_Clinic_Button}
            overlayColor="transparent"
            buttonSize={50}
            distanceToEdge={{ horizontal: 40, vertical: 50 }}
            // actions={this.props.actions}
            onPressMain={() => this.addPatient()}
          />
        ) : (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              position: "absolute",
              bottom: 30,
              right: 20,
              height: 70,
              backgroundColor: "#f5f9fa",
            }}
            onPress={() => this.addPatient()}
          >
            <LottieView
              resizeMode="cover"
              style={{}}
              source={blue_circle_with_plus}
              loop={true}
              autoPlay={true}
            ></LottieView>
          </TouchableOpacity>
        )}

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
            bottom: 50,

            backgroundColor: this.state.toastBgColor,

            borderRadius: 15,
          }}
          ref="toast"
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
  RecentPatient: state.doctorProfile.RecentPatient,
  home: state.home,
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

  patients_recent_list: (skip, limit, search, sortby, age, gender, doctorid) =>
    dispatch(
      patients_recent_list(skip, limit, search, sortby, age, gender, doctorid)
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
  isRefreshBilling: (refreshBilling) =>
    dispatch(isRefreshBilling(refreshBilling)),
  setNavigationFlow: (data) => dispatch(setNavigationFlow(data)),
  setPatientCount: (data) => dispatch(setPatientCount(data)),
  setRecentPatient: (data) => dispatch(setRecentPatient(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPatientsScreen);
