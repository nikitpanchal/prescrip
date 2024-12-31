import React from "react";
import {
  BG,
  lefticon,
  trans_collapsed,
  trans_expand,
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  StatusBar,
  ScrollView,
  Linking,
  View,
  TouchableOpacity,
  Share,
  Image,
  Modal as RModal,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  RefreshControl,
  BackHandler
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import { connect } from "react-redux";
import { setDoctorData } from "../../actions/doctorProfile";
import {
  ic_clock,
  Profile_Image,
  ic_Purple_BG_578,
  ic_Add_Prescription,
  ic_Contact,
  ic_Mark_as_done,
  ic_Cancel_Appoointment,
  ic_Patient_Image,
  ic_whatsapp,
} from "../../constants/images";


import Tooltip from "react-native-walkthrough-tooltip";
import styles from "../Header/styles";
import AddPatient from "../Tooltips";
import Images from "../../Theme/Images";
import HeaderData from "../Header/header";
import EmptyHome from "../EmptyHome/EmptyHome";
import {
  setPatientId,
  setVCTransactionDetails,
  setPaymentLink,
  getPaymentLink,
} from "../../actions/patientVisit";
import { calculateAge } from "../../commonmethods/common";
import { setCurrentTab, isRefreshBilling } from "../../actions/auth";
import { FloatingAction } from "react-native-floating-action";
import LinearGradient from "react-native-linear-gradient";
import {
  empty_vc,
  ic_sync_fab,
  ic_sync_small,
  ic_whatsapp_icon,
  ic_sms_icon,
  ic_mail_icon,
  ic_more_icon,
} from "../../constants/images";
import VideoCunsultingComponent from "../VideoCunsultingComponent";

import {
  getCurreny,
  getDayWishes,
  month,
  getTime,
} from "../../commonmethods/validation";
import SyncModal from "../../components/Modal/syncModal";
import NoNetwork from "../../components/NoNetwork/noNetwork";
import {
  getScreenNameAnalytics,
  logAnalytics,
  logAnalyticsConsultation,
} from "../../commonmethods/analytics";

const colorCode = "#881896";

class VideoCunsulationScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor(props) {
    super(props);
    const firstnamealpha =
      props.doctorProfile.DoctorData.DoctorFName.charAt(0).toUpperCase();
    const surfirstalpha =
      props.doctorProfile.DoctorData.DoctorLName.charAt(0).toUpperCase();
    this.focusEvent = null;
    this.state = {
      showSyncModal: false,
      toolTipVisible: false,
      refresh: false, isPullTextHide: false,
      isConsulting: true,
      isInternetOn: true,
      shareModal: false,
      NoNetworkMsg: "",
      isModalShareOpen: false,
      vcData: [],
      pendingCunsultingTitle: true
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "",
      consultationType: ["First Time", "Follow Up", "Custom"],
      isPendingCunsulting: true,
      isRefresh: false,
      flatListTopMonth: "May",
      flatListTopDate: "8",
      isContactDetailsModal: false,
      ContactDetails: [],
      DoctorFName: "",
      DoctorLName: "",
      getStarted: null,
      DigitalConsult: 1,
      consultTypeIndex: 0,
      consultTypeText: "",
      remarks: "",
      DigitalConsultListLength: 0,
      isShowButton: false,
      EmptyHomeTitle: "It's a good day to start Video Consulting",
      EmptyHomeDescription:
        "You are just 1 step away from starting with Video Consultation",
      pendingVCitemClickProfileData: {},
      doctorimage_alpha: firstnamealpha + surfirstalpha,
      getPatientData: null,
      ismodalmarkdone: false,
      isconsultFeeModal: false,
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
    this._handleBackPress = this._handleBackPress.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }
  shouldComponentUpdate(nextProps, nextState) {

    var currentProps = this.props;
    if (nextProps.screenProps.currentComponent == 'VideoConsult' && nextProps.screenProps.switchTime
      != currentProps.screenProps.switchTime) {
      this.setVCDPage();
    }
    return true;


  }
  _handleBackPress() {
    if (this.state.isModalShareOpen) {
      this.setState({ isModalShareOpen: false }, () => {
        this.setState({
          ismodalmarkdone: false,
          isconsultFeeModal: false,
        });
      });

    }

    // this.refs.modalCity.onRequestClose();
  }

  //share app link
  async onShare() {
    if (this.props.doctorProfile.DoctorData.ShortUrl) {
      try {
        let msg =
          "Hello, you can view my clinic(s) & take an appointment for consultation using below link \n" +
          this.props.doctorProfile.DoctorData.ShortUrl;
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
        this.props.submitErrors("Sidebar", error, "onShare");
        alert(error.message);
      }
    }
  }

  onClick(callFrom) {
    if (callFrom == "share") {
      this.onShare();
    } else {
      this.props.screenProps.rootNavigation.navigate(
        "VCWhatsAppNumberContainer"
      );
    }
  }

  leftImageOnClick() {
    this.props.screenProps.rootNavigation.openDrawer();
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
  pendingVCitemClick(itemData) {
    let p_age = calculateAge(itemData.PatientMaster.CommonDetails.DOB, false);
    const pendingVCitemClickProfileData = {
      FullName: itemData.PatientMaster.CommonDetails.FullName,
      Gender: itemData.PatientMaster.CommonDetails.Gender,

      Age: p_age.value.toString() + " " + p_age.units,
      WhenEntered: itemData.WhenEntered,

      TransID: itemData.TransID,
      AmountPaid: itemData.AmountPaid,
    };

    const ContactDetails = [
      {
        id: "1",
        name: "Contact via Call",
        des: itemData.PatientMaster.Mobile,
        colorCode: "#0065d7",
        imagePath: ic_Contact,
        digiConsultationId: itemData._id,
      },
      {
        id: "2",
        name: "Contact via Whatsapp",
        des:
          itemData.PatientMaster.CommonDetails.Whatsapp &&
            itemData.PatientMaster.CommonDetails.Whatsapp != "+91"
            ? itemData.PatientMaster.CommonDetails.Whatsapp
            : itemData.PatientMaster.Mobile,
        colorCode: "#0065d7",
        imagePath: ic_whatsapp,
        digiConsultationId: itemData._id,
      },
      {
        id: "3",
        name: "Add Prescription",
        des: "",
        colorCode: "#000000",
        imagePath: ic_Add_Prescription,
        digiConsultationId: itemData._id,
        transactionId: itemData.MasterTransactionId,
        PatientID: itemData.PatientID,
        PatientCID: itemData.PatientCID,
      },
      {
        id: "4",
        name: "Mark as Done",
        des: "",
        colorCode: "#29b62f",
        imagePath: ic_Mark_as_done,
        digiConsultationId: itemData._id,
        data: itemData,
        transactionId: itemData.MasterTransactionId,
      },
      {
        id: "5",
        name: "Cancel Appointment",
        des: "",
        colorCode: "#e6342e",
        imagePath: ic_Cancel_Appoointment,
        digiConsultationId: itemData._id,
        data: itemData,
        transactionId: itemData.MasterTransactionId,
      },
    ];
    // alert('safas');
    this.setState({
      pendingVCitemClickProfileData: pendingVCitemClickProfileData,
      ContactDetails: ContactDetails,
      isContactDetailsModal: true,
    });
  }



  componentDidMount() {

    setTimeout(() => {
      this.setState({ isPullTextHide: true })
    }, 3000)
    getScreenNameAnalytics({
      screen_name: "Video Consult",
      screen_class: "VideoConsultationScreen",
    });
    this.props.setCurrentTab(this.props.route.key);
    this.props.isRefreshBilling(true);
    this.IsUpdateReq = this.props.screenProps.IsUpdateReq;

    // if(this.props.doctorProfile.DoctorData.ClinicAddresses){
    this.setVCDPage();

  }

  setVCDPage() {
    //const DigitalConsult1 =0;

    const {
      DoctorFName,
      DoctorLName,
      DigitalConsult,
      DisplayQualificationCSV,
      DisplaySpecializationCSV,
      DoctorMobile,
    } = this.props.doctorProfile.DoctorData;

    // const DigitalConsult =1;

    this.setState({
      DoctorFName: DoctorFName,
      DoctorLName: DoctorLName,
      //DigitalConsult: DigitalConsult,
    });

    let isDigiOn = this.props.doctorProfile.DoctorData.DigitalConsult
      ? this.props.doctorProfile.DoctorData.DigitalConsult == 1
        ? 1
        : this.props.doctorProfile.DoctorData.DigitalConsult == 2
          ? 2
          : 0
      : 0;
    //this.props.setDoctorData(this.props.doctorProfile.DoctorData)
    //   var checkDigitalConsult = isDigiOn.indexOf(2);

    // alert(isDigiOn);

    if (isDigiOn == 0) {
      this.setState({
        DigitalConsult: 0,
        isShowButton: true,
      });
    } /*else if (isDigiOn == 2) {
      this.setState({

        DigitalConsult: 2,
        isShowButton: false,
        EmptyHomeTitle: "Video Consulting",
        EmptyHomeDescription: "Video consultation is disabled by you\nPlease enable it from Settings",



      })



    }*/

    // put the number in the object (as a key)

    if (isDigiOn == 1 || isDigiOn == 2) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!

      var pmm = String(today.getMonth()).padStart(2, "0"); //January is 0!

      var yyyy = today.getFullYear();

      today = mm + "-" + dd + "-" + yyyy;

      var pmtoday = pmm + "-" + dd + "-" + yyyy;

      //alert(today)
      this.props
        .get_pending_videoconsultation(
          pmtoday,
          today,
          this.props.doctorProfile.DoctorData._id
        )
        .then((payload, error) => {
          if (payload.error) {
            switch (payload.error.data) {
              case "Network Error":
                this.setState({
                  isInternetOn: false,
                  NoNetworkMsg: "Currently internet is not avaliable",
                  refresh: false
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

            // alert(JSON.stringify(error))
          } else {
            var data = payload.payload.data;
            this.setState({
              isInternetOn: true, refresh: false,
              NoNetworkMsg: "",
            });

            if (data.status == 0) {
              this.setState({ invalid: true, loading: false, isRefresh: true });
            } else if (data.status == 1) {
              //  const DATA1 =data.data
              this.setState({
                refresh: false,
                EmptyHomeTitle:
                  data.data.length > 0
                    ? this.state.EmptyHomeTitle
                    : "No Video Consultations - It seems all Your Patients are fit & fine",
                EmptyHomeDescription: "",
                isShowButton: data.data.length > 0 ? false : true,
                getStarted: data.data.length == 0 ? "SHARE PROFILE" : null,
                flatListTopMonth:
                  data.data.length > 0
                    ? month[new Date(data.data[0].WhenEntered).getMonth()]
                    : "",
                flatListTopDate:
                  data.data.length > 0
                    ? new Date(data.data[0].WhenEntered).getDate()
                    : "",
                pendingCunsultingDescription:
                  data.data.length + " Video Consultations",
                invalid: true,
                loading: false,
                isRefresh: true,
                vcData: data.data,
                DigitalConsultLength: data.data.length,
              });
            } else {
            }
          }
        });
    }
  }

  topItem(index) {
    if (index < 1) {
      this.setState({
        flatListTopMonth:
          month[new Date(this.state.vcData[0].WhenEntered).getMonth()],
        flatListTopDate: new Date(this.state.vcData[0].WhenEntered).getDate(),
      });
    } else {
      this.setState({
        flatListTopMonth:
          month[new Date(this.state.vcData[index - 1].WhenEntered).getMonth()],
        flatListTopDate: new Date(
          this.state.vcData[index - 1].WhenEntered
        ).getDate(),
      });
    }
  }

  RightImageOnClick() {
    // this.onShare()

    // "startDate":
    //"endDate":
    // "doctorId" :

    // this.props.navigation.navigate('DoctorProfileViewContainer')
    this.props.screenProps.rootNavigation.navigate(
      "DoctorProfileViewContainer"
    );
  }
  onGotIt() {
    this.props.screenProps.setTooltip("Appointments");
  }

  filterVcData(digiConsultationId) {
    let vcData = this.state.vcData.filter(function (e) {
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

  markAsDoneFun() {
    this.setState({
      ismodalmarkdone: false,
    });
    return;
    this.props
      .mark_done_consultation(
        this.state.getPatientData._id,
        this.props.doctorProfile.DoctorData._id,
        this.state.getPatientData.AmountPaid,
        this.props.doctorProfile.DoctorFees.conFee,
        this.props.doctorProfile.DoctorFees.techFee,
        this.state.getPatientData.PayId,
        this.state.getPatientData.TransID,
        this.state.getPatientData.PatientMaster.CommonDetails.FullName,
        this.state.getPatientData.PatientMaster.Mobile,
        "1",
        this.state.getPatientData.MasterTransactionId
      )
      .then((payload) => {
        var data = payload.payload.data;
        if (data.status == 0)
          this.setState({ invalid: true, loading: false, isRefresh: true });
        else if (data.status == 1) {
          this.setState({
            ismodalmarkdone: false,
          });
          this.filterVcData(this.state.getPatientData._id);
        }
      });
  }
  alertMarkAsDone(item) {
    Alert.alert(
      "Prescrip",
      "Do you want to mark this consultation as done? The consultation will be archived and no long available in the list.",
      [
        {
          text: "CANCEL",
          onPress: () =>
            this.setState({
              isContactDetailsModal: false,
            }),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const markAsData_data = {
              digiConsultationId: item.digiConsultationId,
              doctorId: this.props.doctorProfile.DoctorData._id,
              amt: item.data.AmountPaid,
              convenienceFee: this.props.doctorProfile.DoctorFees.conFee,
              technologyFee: this.props.doctorProfile.DoctorFees.techFee,

              payId: item.data.PayId,
              orderId: item.data.MasterTransactionId,
              patientName: item.data.PatientMaster.CommonDetails.FullName,
              patientMobile: item.data.PatientMaster.Mobile,
              consultComplete: "1",
            };

            this.props
              .mark_done_consultation(
                item.digiConsultationId,
                this.props.doctorProfile.DoctorData._id,
                item.data.AmountPaid,
                this.props.doctorProfile.DoctorFees.conFee,
                this.props.doctorProfile.DoctorFees.techFee,
                item.data.PayId,
                item.data.TransID,
                item.data.PatientMaster.CommonDetails.FullName,
                item.data.PatientMaster.Mobile,
                "1",
                item.data.MasterTransactionId
              )
              .then((payload) => {
                var data = payload.payload.data;
                if (data.status == 0)
                  this.setState({
                    invalid: true,
                    loading: false,
                    isRefresh: true,
                  });
                else if (data.status == 1) {
                  this.filterVcData(item.digiConsultationId);
                  if (item.data.IsPaid === 1 && item.data.AmountPaid > 0.0) {
                    logAnalytics(
                      this.props.doctorProfile.DoctorData._id,
                      this.props.doctorProfile.DoctorData.DoctorFName +
                      " " +
                      this.props.doctorProfile.DoctorData.DoctorLName,
                      "markdone_paidvideo_consultation"
                    );

                    logAnalyticsConsultation("purchase", {
                      currency: "INR",
                      transaction_id: item.data.TransID,
                      value: item.data.AmountPaid,
                      affiliation: {
                        doctorId: this.props.doctorProfile.DoctorData._id,
                        doctorName:
                          this.props.doctorProfile.DoctorData.DoctorFName +
                          " " +
                          this.props.doctorProfile.DoctorData.DoctorLName,
                      },
                      coupon: "",
                      shipping: 0,
                      tax: 0,
                      items: [
                        {
                          item_id: item.data.TransID,
                          item_name: "",
                          price: item.data.AmountPaid,
                          currency: "INR",
                          quantity: 1,
                        },
                      ],
                    });
                  } else {
                    logAnalytics(
                      this.props.doctorProfile.DoctorData._id,
                      this.props.doctorProfile.DoctorData.DoctorFName +
                      " " +
                      this.props.doctorProfile.DoctorData.DoctorLName,
                      "markdone_unpaidvideo_consultation"
                    );
                  }

                  if (item.data.IsPaid == 0)
                    this.setState({ isContactDetailsModal: false }, () => {
                      this.openConsultFeeModal(item.data);
                    });
                }
              });
          },
        },
      ]
    );
  }
  markConsultDone(item) {
    let itemData = item.data;
    let p_age = calculateAge(itemData.PatientMaster.CommonDetails.DOB, false);
    if (!this.state.isContactDetailsModal) {
      //this.pendingVCitemClick(item.data);
      const pendingVCitemClickProfileData = {
        FullName: itemData.PatientMaster.CommonDetails.FullName,
        Gender: itemData.PatientMaster.CommonDetails.Gender,

        Age: p_age.value.toString() + " " + p_age.units,
        WhenEntered: itemData.WhenEntered,

        TransID: itemData.TransID,
        AmountPaid: itemData.AmountPaid,
      };

      const ContactDetails = [
        {
          id: "1",
          name: "Contact via Call",
          des : itemData.PatientMaster.CommonDetails.Whatsapp ? itemData.PatientMaster.CommonDetails.Whatsapp : 
          (itemData.PatientMaster.CommonDetails.CountryCode ? itemData.PatientMaster.CommonDetails.CountryCode + itemData.PatientMaster.Mobile
            : '+91' + itemData.PatientMaster.Mobile),
          des: itemData.PatientMaster.Mobile,
          colorCode: "#0065d7",
          imagePath: ic_Contact,
          digiConsultationId: itemData._id,
        },
        {
          id: "2",
          name: "Contact via Whatsapp",
          des : itemData.PatientMaster.CommonDetails.Whatsapp ? itemData.PatientMaster.CommonDetails.Whatsapp : 
          (itemData.PatientMaster.CommonDetails.CountryCode ? itemData.PatientMaster.CommonDetails.CountryCode + itemData.PatientMaster.Mobile
            : '+91' + itemData.PatientMaster.Mobile),
          colorCode: "#0065d7",
          imagePath: ic_whatsapp,
          digiConsultationId: itemData._id,
        },
        {
          id: "3",
          name: "Add Prescription",
          des: "",
          colorCode: "#000000",
          imagePath: ic_Add_Prescription,
          digiConsultationId: itemData._id,
          transactionId: itemData.MasterTransactionId,
          PatientID: itemData.PatientID,
          PatientCID: itemData.PatientCID,
        },
        {
          id: "4",
          name: "Mark as Done",
          des: "",
          colorCode: "#29b62f",
          imagePath: ic_Mark_as_done,
          digiConsultationId: itemData._id,
          data: itemData,
          transactionId: itemData.MasterTransactionId,
        },
        {
          id: "5",
          name: "Cancel Appointment",
          des: "",
          colorCode: "#e6342e",
          imagePath: ic_Cancel_Appoointment,
          digiConsultationId: itemData._id,
          data: itemData,
          transactionId: itemData.MasterTransactionId,
        },
      ];
      // alert('safas');
      this.setState(
        {
          pendingVCitemClickProfileData: pendingVCitemClickProfileData,
          ContactDetails: ContactDetails,
          isContactDetailsModal: true,
        },
        () => {
          setTimeout(() => {
            this.alertMarkAsDone(item);
          }, 100);
        }
      );
    }
  }

  openConsultFeeModal(item) {
    this.setState({ getPatientData: item, isModalShareOpen: true }, () => {
      this.setState({
        ismodalmarkdone: true,
      });
    });
  }

  popup_click(item) {
    switch (item.name) {
      case "Contact via Call":
        let phoneNumber = item.des;
        //if (Platform.OS === 'android') {
        phoneNumber = `tel:${phoneNumber}`;
        //}
        Linking.openURL(phoneNumber);

        break;

      case "Contact via Whatsapp":
        //this.loglytics("PendingConsultation", "WhatsappIcon_click");

        if (item.des != "") {
          let Mobile = item.des;

          // if (Mobile.indexOf("+") > -1) {
          //   Mobile = Mobile.replace('+', '');
          // }
          Linking.openURL("whatsapp://send?phone=" + parseInt(Mobile));
        }

        break;

      case "Add Prescription":
        let data = {
          id: item.PatientID,
          patientId: item.PatientCID, //cid should be passed while getting RX List
        };
        let vcData = {
          consult_id: item.digiConsultationId,
          trans_id: item.transactionId,
        };
        this.props.setVCTransactionDetails(vcData);
        this.props.setPaymentLink("");
        this.props.setPatientId(data);
        this.setState({
          isContactDetailsModal: false,
        });
        this.props.screenProps.rootNavigation.navigate(
          "PatientVisitHistoryContainer"
        );

        break;

      case "Mark as Done":
        if (
          this.props.doctorProfile.DoctorData.BankDetails &&
          this.props.doctorProfile.DoctorData.BankDetails.MerchantId
        ) {
          this.alertMarkAsDone(item);
        } else {
          this.setState({
            isContactDetailsModal: false,
          });

          this.props.screenProps.rootNavigation.navigate(
            "BankDetailContainer",
            {
              calledFrom: "addBankDetails",
              conItem: item,
              callAfterAdd: this.markConsultDone.bind(this),
            }
          );
        }

        break;

      case "Cancel Appointment":
        Alert.alert(
          "Prescrip",
          "Do you want to cancel this consultation? The consultation will be archived and no longer available in the list.",
          [
            {
              text: "CANCEL",
              onPress: () => { },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                this.props
                  .cancel_consultation(
                    item.digiConsultationId,
                    "1",
                    this.props.doctorProfile.DoctorData._id,
                    item.data.PayId
                  )
                  .then((payload) => {
                    var data = payload.payload.data;
                    if (data.status == 0)
                      this.setState({
                        invalid: true,
                        loading: false,
                        isRefresh: true,
                      });
                    else if (data.status == 1) {
                      logAnalytics(
                        this.props.doctorProfile.DoctorData._id,
                        this.props.doctorProfile.DoctorData.DoctorFName +
                        " " +
                        this.props.doctorProfile.DoctorData.DoctorLName,
                        "cancel_video_consultation"
                      );
                      this.filterVcData(item.digiConsultationId);
                    }
                  });
              },
            },
          ]
        );

        break;

      default:
        break;
    }
  }
  meallabel() {
    {
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

                {item.des ? (
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: item.colorCode,
                      fontSize: 12,
                    }}
                  >
                    {item.des}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        );
      });

      return content;
    }
  }

  closeClick() {
    this.setState({
      isContactDetailsModal: false,
    });
  }

  sharePaymentLink() {
    // this.props.showToast("Payment Link is being generated", "#FFFFFF", "#4D99E3", Images.Info);
    // this.setState({ loading: true })

    //  this.setState({ loading: false })

    let age = calculateAge(
      this.state.getPatientData.PatientMaster.CommonDetails.DOB,
      false
    );
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,

      //As per nikit sir changes>> 2/4/2021
      transactionId: "",
      digiConsultationId: "",

      // transactionId: this.state.getPatientData.MasterTransactionId,
      //digiConsultationId: this.state.getPatientData._id,
      // amount: this.state.getPatientData.AmountPaid,
      amount:
        this.state.consultTypeIndex == 0
          ? parseFloat(
            this.props.doctorProfile.DoctorData.ConsultFee.toString()
          ).toFixed(2)
          : this.state.consultTypeIndex == 1
            ? parseFloat(
              this.props.doctorProfile.DoctorData.FollowupFee.toString()
            ).toFixed(2)
            : this.state.consultTypeIndex == 2
              ? this.state.consultTypeText
              : 0,
      consultFees: this.props.doctorProfile.DoctorData.ConsultFee
        ? parseFloat(
          this.props.doctorProfile.DoctorData.ConsultFee.toString()
        ).toFixed(2)
        : 0,

      patientId: this.state.getPatientData.PatientCID,
      patient_Id: this.state.getPatientData.PatientID,
      patientName:
        this.state.getPatientData.PatientMaster.CommonDetails.FullName,
      dob: this.state.getPatientData.PatientMaster.CommonDetails.DOB,
      gender: this.state.getPatientData.PatientMaster.CommonDetails.Gender,
      mobile: this.state.getPatientData.PatientMaster.Mobile
        ? this.state.getPatientData.PatientMaster.Mobile
        : "",
      whatsApp: this.state.getPatientData.PatientMaster.CommonDetails.Whatsapp
        ? this.props.patientvisit.patientDetails.CommonDetails.Whatsapp
        : "",
      age: age.value + " " + age.units,
      remarks: this.state.remarks,
      patientEmail: this.state.getPatientData.PatientMaster.CommonDetails
        .EmailAddress
        ? this.state.getPatientData.PatientMaster.CommonDetails.EmailAddress
        : "",
    };

    this.props.getPaymentLink(data).then((response) => {
      if (response.payload.data.status == 1) {
        let paylink = response.payload.data.payLink;
        this.props.setPaymentLink(paylink);

        this.setState({
          ismodalmarkdone: false,
          isconsultFeeModal: false,
        });

        let msg =
          "Hello, you can make payment using the below link \n" +
          response.payload.data.payLink;
        setTimeout(() => {
          this.onshare1(msg);
        }, 500);
      }
    });
  }

  async onshare1(msg) {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      " " +
      this.props.doctorProfile.DoctorData.DoctorLName,
      "shared_prescrip_paylink"
    );
    try {
      // let msg = 'Hello, you can view my clinic(s) & take an appointment for Video Consultation using below link \n'+this.state.transactionDetails.receiptUri;
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
  // send message type
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
        return this.props.patientmobile;

      case "Whatsapp":
        return this.props.patientmobile;

      case "Mail":
        return this.props.patientmail;

      default:
        return "more";
    }
  }

  disableShareButton(type) {
    switch (type) {
      case 0:
        return this.props.doctorProfile.DoctorData.ConsultFee < 1
          ? true
          : false;

      case 1:
        return this.props.doctorProfile.DoctorData.FollowupFee < 1
          ? true
          : false;

      case 2:
        return this.state.consultTypeText ? false : true;
    }
  }

  modalCloseFun() {
    this.setState({ isModalShareOpen: false }, () => {
      this.setState({
        ismodalmarkdone: false,
      });
    });
  }

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
  onRefresh() {
    this.setState({ refresh: true }, () => {
      this.setVCDPage();
    });
  }
  render() {
    this.props.screenProps.data = true;
    const setModalVisible = true;
    const modalVisible = true;

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        {this.state.showSyncModal ? (
          <SyncModal
            {...this.props}
            syncData={() => this.props.screenProps.getRecents()}
            showModal={() => this.showModal()}
            hideModal={() => this.hideModal()}
          ></SyncModal>
        ) : null}

        <RModal
          animationType="slide"
          transparent={true}
          visible={this.state.isContactDetailsModal}
          ref={"modalCity"}
          onRequestClose={() =>
            this.setState({
              isContactDetailsModal: false,
            })
          }
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
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isContactDetailsModal: false,
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
                  color: "white",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 15,
                borderTopEndRadius: 15,
                // padding: 20,
                width: "100%",
                alignItems: "center",
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
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                  }}
                >
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={ic_Patient_Image}
                  />

                  <Text
                    style={{
                      marginLeft: 10,
                      alignSelf: "center",
                      fontFamily: "NotoSans-Bold",
                      color: "#000000",
                      fontSize: 22,
                    }}
                  >
                    {this.state.pendingVCitemClickProfileData.FullName}
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 20,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#3c3b3b",
                      fontSize: 16,
                    }}
                  >
                    {" "}
                    {this.state.pendingVCitemClickProfileData.Age +
                      " yrs | " +
                      this.state.pendingVCitemClickProfileData.Gender}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#3c3b3b",
                      fontSize: 16,
                    }}
                  >
                    {getTime(
                      this.state.pendingVCitemClickProfileData.WhenEntered
                    ) +
                      ", " +
                      new Date(
                        this.state.pendingVCitemClickProfileData.WhenEntered
                      ).getDate() +
                      " " +
                      month[
                      new Date(
                        this.state.pendingVCitemClickProfileData.WhenEntered
                      ).getMonth()
                      ] +
                      " " +
                      new Date(
                        this.state.pendingVCitemClickProfileData.WhenEntered
                      ).getFullYear()}
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 20,
                    width: "100%",
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#555454",
                      fontSize: 12,
                    }}
                  >
                    {"Txn ID: " +
                      this.state.pendingVCitemClickProfileData.TransID}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#555454",
                      fontSize: 12,
                    }}
                  >
                    {"Paid " +
                      getCurreny() +
                      " " +
                      this.state.pendingVCitemClickProfileData.AmountPaid}
                  </Text>
                </View>
                {this.meallabel()}
              </View>
            </View>
          </View>
        </RModal>

        <RModal
          animationType="slide"
          transparent={true}
          visible={this.state.shareModal}
          ref={"meal"}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 0}
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
                        this.sendPrescrip1(
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
        </RModal>

        <View
          style={{
            flexdirection: "column",
            flex: 1,
          }}
        >
          <View>
            <HeaderData
              {...this.props}
              editImageOnClick={() => this.editImageOnClick()}
              bgImage={ic_Purple_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              title={getDayWishes()}
              description={
                "Dr. " + this.state.DoctorFName + "\n" + this.state.DoctorLName
              }
              onGotIt={() => this.onGotIt()}
              leftImage={Images.ic_Menu_Button}
              rightImage={Images.ic_share_button}
              type={1}
              showProfile={() => this.RightImageOnClick()}
              leftImageOnClick={() => this.leftImageOnClick()}
              RightImageOnClick={() => this.onClick("share")}
              isMenuName={true}
              rightImageName={"Share"}
              photo={null}
              nameClick={() => this.RightImageOnClick()}
              doctorimage_alpha={this.state.doctorimage_alpha}

            //rightImageName ={}
            />
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              backgroundColor: "#FFFFFF",
              flex: 1,
            }}
          >
            <View
              style={{
                alignItems: "center",
                top: -20,
                alignSelf: "center",
                width: "100%",
                height: 50,
                backgroundColor: "#ffffff",
                borderTopEndRadius: 20,
                borderTopLeftRadius: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 10,
                  flex: 1,
                  justifyContent: "space-between",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "center",
                  }}
                >
                  {!this.state.isPullTextHide ? <Text style={{
                    width: '100%', textAlign: 'center', position: 'absolute', fontSize: 12, top: 40, zIndex: 1,
                    fontFamily: "NotoSans-Bold", color: "#3d3d3d"
                  }}>{'Swipe down to Refresh'}</Text> : null}
                  {this.state.DigitalConsultLength > 0 ? (
                    <Text
                      style={[styles.title, { fontSize: 13, color: "#000000" }]}
                    >
                      {"Showing pending consultations"}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.title,
                        {
                          fontSize: 17,
                          color: "#a4a4a4",
                          fontFamily: "NotoSans-Bold",
                        },
                      ]}
                    >
                      {"No consultation yet"}
                    </Text>
                  )}

                  {this.state.DigitalConsultLength > 0 ? (
                    <Text
                      style={[
                        styles.title,
                        {
                          fontFamily: "NotoSans-Bold",
                          fontSize: 20,
                          color: "#820091",
                        },
                      ]}
                    >
                      {this.state.pendingCunsultingDescription}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    alignSelf: "center",
                    borderColor: colorCode,
                    borderRadius: 5,
                    borderWidth: 1,
                  }}
                >
                  {this.state.DigitalConsult == 1 &&
                    this.state.DigitalConsultLength > 0 ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 7,
                        marginRight: 7,
                      }}
                    >
                      <Text
                        style={[
                          styles.title,
                          {
                            color: colorCode,
                            fontSize: 15,
                            fontFamily: "NotoSans-Bold",
                          },
                        ]}
                      >
                        {this.state.flatListTopDate}
                      </Text>

                      <Text
                        style={[
                          styles.title,
                          {
                            color: colorCode,
                            top: -5,
                            fontSize: 11,
                            fontFamily: "NotoSans",
                          },
                        ]}
                      >
                        {this.state.flatListTopMonth}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={{ bottom: 10, backgroundColor: "#ececec" }} />




            {this.state.DigitalConsult == 1 &&
              this.state.DigitalConsultLength > 0 ? (
              <VideoCunsultingComponent
                {...this.props}
                pendingVCitemClick={(itemData) =>
                  this.pendingVCitemClick(itemData)
                }
                refreshEvent={() => { this.onRefresh() }}
                refreshing={this.state.refresh}
                refresh={true}
                topItem={(itemData) => this.topItem(itemData)}
                data={this.state.vcData}

              />
            ) : (
              <EmptyHome
                {...this.props}
                isLottie={true}
                imagePath={empty_vc}
                title={this.state.EmptyHomeTitle}
                colorCode={colorCode}
                getStarted={this.state.getStarted}
                isShowButton={this.state.isShowButton}
                refreshEvent={() => { this.onRefresh() }}
                refreshing={this.state.refresh}
                description={this.state.EmptyHomeDescription}
                onClick={() =>
                  this.onClick(
                    this.state.getStarted == "SHARE PROFILE" ? "share" : "start"
                  )
                }
              />
            )}
            {/* </ScrollView> */}
          </View>
        </View>
        {this.props.screenProps.IsUpdateReq ? (
          <FloatingAction
            iconHeight={55}
            iconWidth={55}
            position={"right"}
            color="transparent"
            floatingIcon={ic_sync_fab}
            buttonSize={50}
            overlayColor="transpart"
            distanceToEdge={{ horizontal: 30, vertical: 30 }}
            // actions={this.props.actions}
            onPressMain={() => this.showModal()}
          />
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

        <RModal
          transparent={true}
          visible={this.state.ismodalmarkdone}
          ref={"modalmarkdone"}
          onRequestClose={() =>
            this.setState({
              ismodalmarkdone: false,
            })
          }
          position={"bottom"}
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
            <View
              style={{
                borderTopLeftRadius: 10,
                backgroundColor: "white",
                padding: 20,
                borderTopRightRadius: 10,
                height: 275,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text style={{ fontFamily: "NotoSans-Bold", color: "#3d3d3d" }}>
                  Consultation Fee
                </Text>
                <Text
                  style={{
                    fontFamily: "NotoSans",
                    color: "#585858",
                  }}
                >{`The Fee of \u20B9${this.props.doctorProfile.DoctorData.ConsultFee
                  ? this.props.doctorProfile.DoctorData.ConsultFee
                  : ""
                  } for the consultation has not yet been received Would you like to share payment link with ${this.state.getPatientData
                    ? this.state.getPatientData.PatientMaster.CommonDetails
                      .FullName
                    : ""
                  } (+91${this.state.getPatientData
                    ? this.state.getPatientData.PatientMaster.Mobile
                    : ""
                  })`}</Text>
              </View>

              <View style={{ flex: 0.4 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      ismodalmarkdone: false,
                      isconsultFeeModal: true,
                    });
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
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 17,
                        color: "#ffffff",
                        fontFamily: "NotoSans-Bold",
                        textTransform: "uppercase",
                        marginEnd: 5,
                      }}
                    >
                      Share Payment Link
                    </Text>
                    {this.props.loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.markAsDoneFun()}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "center",
                      fontFamily: "NotoSans-Bold",
                      color: "#757575",
                      textDecorationLine: "underline",
                    }}
                  >
                    Skip, I will take offline payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RModal>
        <RModal
          transparent={true}
          visible={this.state.isconsultFeeModal}
          ref={"consultFeeModal"}
          onRequestClose={() =>
            this.setState({
              isconsultFeeModal: false,
            })
          }
          position={"bottom"}
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
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                width: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: 400,
              }}
            >
              <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
                <Text style={{ fontFamily: "NotoSans-Bold", color: "#3d3d3d" }}>
                  Generate Payment Link
                </Text>
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#8d8d8d",
                      fontSize: 12,
                    }}
                  >{`Consultation Type`}</Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {this.state.consultationType.map((itm, ind) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({ consultTypeIndex: ind })
                          }
                          style={{
                            flex: 1,
                            justifyContent: "space-evenly",
                            borderColor:
                              this.state.consultTypeIndex == ind
                                ? "#0064d7"
                                : "#8d8d8d",
                            marginHorizontal: 10,
                            borderWidth: 1.2,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "NotoSans",
                              padding: 2,
                              color:
                                this.state.consultTypeIndex == ind
                                  ? "#0064d7"
                                  : "#8d8d8d",
                            }}
                          >
                            {itm}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    borderBottomColor: "#cccccc",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#8d8d8d",
                    }}
                  >
                    Consultation Fee
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flex: 0.2 }}>
                      <Text
                        style={{
                          fontFamily: "NotoSans",
                          color: "#444444",
                          fontSize: 24,
                        }}
                      >
                        {"\u20B9"}
                      </Text>
                    </View>
                    <View style={{ flex: 0.8, width: "100%" }}>
                      <TextInput
                        keyboardType={"numeric"}
                        ref={(ref) => (this.consultFeeInput = ref)}
                        onSubmitEditing={() => this.remarkInput.focus()}
                        editable={
                          this.state.consultTypeIndex == 0 ||
                            this.state.consultTypeIndex == 1
                            ? false
                            : true
                        }
                        onChangeText={(val) =>
                          this.setState({ consultTypeText: val })
                        }
                        defaultValue={
                          this.state.consultTypeIndex == 0
                            ? this.props.doctorProfile.DoctorData.ConsultFee
                              ? this.props.doctorProfile.DoctorData.ConsultFee.toString()
                              : ""
                            : this.state.consultTypeIndex == 1
                              ? this.props.doctorProfile.DoctorData.FollowupFee.toString()
                              : ""
                        }
                        style={{
                          textAlign: "right",
                          fontSize: 24,
                          fontFamily: "NotoSans-Bold",
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    borderBottomColor: "#cccccc",
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#8d8d8d",
                    }}
                  >
                    Remarks
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flex: 1, width: "100%" }}>
                      <TextInput
                        ref={(ref) => (this.remarkInput = ref)}
                        onSubmitEditing={() => this.sharePaymentLink()}
                        onChangeText={(val) => this.setState({ remarks: val })}
                        style={{ fontSize: 20, fontFamily: "NotoSans" }}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={this.disableShareButton(
                    this.state.consultTypeIndex
                  )}
                  style={{ marginTop: 20 }}
                  onPress={() => this.sharePaymentLink()}
                >
                  <LinearGradient
                    colors={
                      this.disableShareButton(this.state.consultTypeIndex)
                        ? ["#c1c1c1", "#a5a4a3"]
                        : ["#1b7cdb", "#07cef2"]
                    }
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
                        textTransform: "uppercase",
                        marginEnd: 5,
                      }}
                    >
                      Share Payment Link
                    </Text>
                    {this.props.loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </LinearGradient>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </RModal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  auth: state.auth,
  patientvisit: state.patientvisit,
});

const mapDispatchToProps = (dispatch) => ({
  cancel_consultation: (digiConsultationId, consultComplete, doctorId, payId) =>
    dispatch(
      cancel_consultation(digiConsultationId, consultComplete, doctorId, payId)
    ),
  mark_done_consultation: (
    digiConsultationId,
    doctorId,
    amt,
    convenienceFee,
    technologyFee,
    payId,
    orderId,
    patientName,
    patientMobile,
    consultComplete,
    transactionId
  ) =>
    dispatch(
      mark_done_consultation(
        digiConsultationId,
        doctorId,
        amt,
        convenienceFee,
        technologyFee,
        payId,
        orderId,
        patientName,
        patientMobile,
        consultComplete,
        transactionId
      )
    ),
  get_pending_videoconsultation: (startDate, endDate, doctorId) =>
    dispatch(get_pending_videoconsultation(startDate, endDate, doctorId)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setPatientId: (data) => dispatch(setPatientId(data)),
  setVCTransactionDetails: (data) => dispatch(setVCTransactionDetails(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  getPaymentLink: (data) => dispatch(getPaymentLink(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCunsulationScreen);
