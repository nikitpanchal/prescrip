//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used
import CalendarPicker from "react-native-calendar-picker";

import {
  Tooltip_Add_Receipt,
  Tooltip_More_Option,
  Tooltip_Payment_Calendar,
  Tooltip_Payment_Filter,
  Tooltip_Pending,
  Tooltip_Received,
  Tooltip_Refunded,
  icon_Three_Dot_Menu_Button,
  Billing_Dropdown_Collapse,
  Billing_Dropdown_Expand,
  Billing_Menu_Button,
  Billing_Payment_Pending_Icon,
  Billing_Payment_Received_Icon,
  BG,
  lefticon,
  intro_bg,
  intro_billing,
  ic_popup_Add_Button_Icon,
  trans_collapsed,
  trans_expand,
  ic_Teal_BG_578,
  icon_search_white,
  icon_close_white,
  ic_Blue_BG_578,
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import {
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
  Linking,
  StatusBar,

  TouchableHighlight,
  View,
  Image,
  Modal,
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { connect } from "react-redux";
import { setDoctorData } from "../../actions/doctorProfile";
import SyncModal from "../../components/Modal/syncModal";
import BillingIntro from "../../components/Modal/BillingIntro";
import { FloatingAction } from "react-native-floating-action";
import { ic_sync_fab, ic_sync_small } from "../../constants/images";
import { setCurrentTab, isRefreshBilling } from "../../actions/auth";
import PrescriptionHeader from "../PrescriptionHeader/PrescriptionHeader";
import MonthPicker from "react-native-month-year-picker";
import { MenuProvider } from "react-native-popup-menu";

import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import { setTooltipStatus } from "../../actions/tooltip";

import {
  icon_Help,
  icon_Left_Button,
  ic_Add_Clinic_Button,
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

//import react in our code.
//import all the components we are going to uddse.

//import Carousel from 'react-native-banner-carousel';
import Tooltip from "react-native-walkthrough-tooltip";

import styles from "../Header/styles";
import AddPatient from "../Tooltips";
import Images from "../../Theme/Images";
import HeaderData from "../Header/header";
import EmptyHome from "../EmptyHome/EmptyHome";
import VideoCunsultingComponent from "../VideoCunsultingComponent";

import { ic_Purple_BG_578 } from "../../constants/images";
import {
  getCurreny,
  getDayWishes,
  month,
} from "../../commonmethods/validation";
import { set } from "react-native-reanimated";
import BillingComponent from "../BillingComponent/BillingRevamp";
//import AddClinicPopup from '../Modal/addClinicPopup';
import { get_billing_details, delete_custom_receipt } from "../../actions";

import NoNetwork from "../../components/NoNetwork/noNetwork";
import AddClinicPopup from "../Modal/addClinicPopup";
import { monthsShort } from "moment";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
const colorCode = "#881896";
let defaultSelction = "All";

let tooltipData = {
  status: 1,
  billingDetails: [
    {
      _id: "60c749d20942f811002d5913",
      PatientID: "600966c325459d15dcb199b2",
      PatientCID: 148,
      WhenEntered: "2021-06-14T12:21:24.981Z",
      GlobalTFApplied: 1,
      GlobalCFApplied: 1,
      ConsultFees: 500,
      ConvenienceFee: 2.5,
      TechnologyFee: 25,
      IsPaidByAdmin: 1,
      ConsultComplete: 1,
      ReimbursementAmount: 462.5,
      RemainingAmount: 462.5,
      AmountPaid: 500,
      PatientMobile: "9975535319",
      IsPaid: 1,
      IsRefunded: null,
      IsCancelled: null,
      PayType: 1,
      PayLink: null,
      TransactionId: "order_HMwBvMCAxYztd6",
      PatientId: "600966c325459d15dcb199b2",
      ServiceProvided: null,
      Name: "Manik Singh",
    },

    {
      _id: "60c7023c0942f819c4a6f430",
      PatientID: "60801dc56b5d6a0674adf95e",
      PatientCID: 9,
      WhenEntered: "2021-06-14T06:52:38.368Z",

      GlobalTFApplied: 1,
      GlobalCFApplied: 1,
      ConsultFees: 300,
      ConvenienceFee: 2.5,
      TechnologyFee: 25,
      IsPaidByAdmin: 0,
      ConsultComplete: 0,
      ReimbursementAmount: 0,
      RemainingAmount: 0,
      AmountPaid: 0,
      PatientMobile: "9152752164",
      IsPaid: 0,
      IsRefunded: null,
      IsCancelled: null,
      PayType: 2,
      PayLink: null,
      TransactionId: "60c7023c0942f819c4a6f42c",
      PatientId: "60801dc56b5d6a0674adf95e",
      ServiceProvided: null,
      Name: "Vinay Kumar",
    },
    {
      _id: "60c6fcb64e1be10488a1e9b1",
      PatientID: "60801dc56b5d6a0674adf95e",
      PatientCID: 8,
      WhenEntered: "2021-06-14T06:51:41.863Z",
      GlobalTFApplied: 1,
      GlobalCFApplied: 1,
      ConsultFees: 30,
      ConvenienceFee: 2.5,
      TechnologyFee: 25,
      IsPaidByAdmin: 0,
      ConsultComplete: 0,
      ReimbursementAmount: 0,
      RemainingAmount: 0,
      AmountPaid: 0,
      PatientMobile: "9152752164",
      IsPaid: 0,
      IsRefunded: 1,
      IsCancelled: null,
      PayType: 5,
      PayLink: null,
      TransactionId: "order_HMqZdV0biV809G",
      PatientId: "60801dc56b5d6a0674adf95e",
      ServiceProvided: null,
      Name: "Rajesh Gupta",
    },
  ],
};
class BillingScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor() {
    super();

    this.state = {
      isPullTextHide: false,
      refresh: false,
      description: "",
      showToast: false,
      defaultSelection: 0,
      togglePop: false,

      defaultSelectionFinal: { displayname: "All", querykey: "", value: "" },
      billingDetails: [],

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      isContactDetailsModal: false,

      isInternetOn: true,
      NoNetworkMsg: "",
      showSyncModal: false,
      showIntroModal: true,
      finalArrayAfterTabClick: [],
      consultationCount: 0,
      passMothFirstDate: new Date(),
      dataIsPresent: false,
      isShowButton: false,
      pageCallfrom: "test",

      show: false,
      dateForShowData: new Date(),
      dateForShowDataMonthChange: new Date(),

      EmptyHomeTitle: "Transactions not available for this month",
      EmptyHomeDescription: "No payment was done in this month",

      title: "All",
      tooltipSteps: 10,

      ContactDetails1: [
        {
          id: 1,
          name: "All",
          des: "",
          colorCode: "#0065d7",
          imagePath: ic_Mark_as_done,
        },
        {
          id: 2,
          name: "Prescrip Pay + Video Consultations",
          des: "",
          colorCode: "#000000",
          imagePath: "",
        },
        {
          id: 3,
          name: "Direct Payments",
          des: "",
          colorCode: "#000000",
          imagePath: "",
        },
        {
          id: 4,
          name: "Offline",
          des: "",
          colorCode: false ? "#0065d7" : "#000000",
          imagePath: true ? ic_Mark_as_done : "",
        },
      ],

      //state to control the visibility of Tooltip
    };
  }

  onClick() {
    this.props.screenProps.rootNavigation.navigate("VCWhatsAppNumberContainer");
  }

  clickedOnBilling(flag) {
    this.setState({
      show: flag,
    });
  }

  onDateChange(newDate, callFrom) {
    if (callFrom == "onMonthChange") {
      this.setState({
        dateForShowDataMonthChange: newDate
          ? new Date(newDate)
          : this.state.dateForShowData,
      });
    } else {
      this.setState(
        {
          dateForShowData:
            callFrom == "onDoneClick"
              ? this.state.dateForShowDataMonthChange
              : newDate
                ? new Date(newDate)
                : this.state.dateForShowData,
          dateForShowDataMonthChange: newDate
            ? new Date(newDate)
            : this.state.dateForShowData,
          show: false,
          defaultSelectionFinal: {
            displayname: "All",
            querykey: "",
            value: "",
          },
        },
        () => {
          const self = this;
          let newDateValue = new Date(newDate);
          if (this.props.sync.configData.filtersBilling.length > 0) {
            this.flatListRef.scrollToIndex({ animated: true, index: 0 });
          }
          this.setVCDPage();

          setTimeout(() => {
            this.state.finalArrayAfterTabClick.forEach(function (element, i) {
              let arrayCheck = element.title.split(" ");

              if (
                arrayCheck[0] == newDateValue.getDate() &&
                month.indexOf(arrayCheck[1]) == newDateValue.getMonth() &&
                arrayCheck[2] == newDateValue.getFullYear()
              ) {
                // self.triggerChildAlert(i)
                // self.refs.child.showAlert(i);
              }
            });
          }, 2000);
        }
      );
    }
  }

  onValueChange(event, newDate) {
    this.setState(
      {
        dateForShowData: newDate ? newDate : this.state.dateForShowData,
        show: false,
        defaultSelectionFinal: { displayname: "All", querykey: "", value: "" },
      },
      () => {
        if (this.props.sync.configData.filtersBilling.length > 0) {
          this.flatListRef.scrollToIndex({ animated: true, index: 0 });
        }
        this.setVCDPage();
      }
    );
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
  onRefresh() {
    this.setState({ refresh: true }, () => {
      this.setVCDPage();
    });
  }
  shouldComponentUpdate(nextProps, nextState) {

    var currentProps = this.props;
    if (nextProps.screenProps.currentComponent == 'Billing' && nextProps.screenProps.switchTime
      != currentProps.screenProps.switchTime) {
      this.setVCDPage();
    }
    return true;


  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isPullTextHide: true })
    }, 3000)
    getScreenNameAnalytics({
      screen_name: "Billing",
      screen_class: "BillingScreenNew",
    });
    this.props.setCurrentTab(this.props.route.key);
    this.setState(
      {
        dateForShowData: this.props.home.refreshBilling
          ? new Date()
          : this.state.dateForShowData,

        defaultSelectionFinal: {
          displayname: "All",
          querykey: "",
          value: "",
        },
      },
      () => {
        if (this.props.sync.configData.filtersBilling.length > 0) {
          this.flatListRef.scrollToIndex({ animated: true, index: 0 });
        }
        if (this.state.pageCallfrom != "updateData") {
          if (this.props.billingTooltip) {
            this.setVCDPage("fromTooltip");
          } else {
            this.setVCDPage();
          }
        }
      }
    );
    this.props.isRefreshBilling(true);
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.setVCDPage();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  convertIntoK(value) {
    if (value >= 1000000) {
      value = (value / 1000000).toFixed(2) + "M";
    } else if (value >= 1000) {
      value = (value / 1000).toFixed(2) + "K";
    }
    return value;
  }

  sum(prop, a) {
    var total = 0;
    for (var i in a) {
      total += a[i][prop];
    }
    return total;
  }

  setVCDPage(whereFrom) {
    var firstDate = new Date(
      this.state.dateForShowData.getFullYear(),
      this.state.dateForShowData.getMonth(),
      1
    );

    var lastDate = new Date(
      this.state.dateForShowData.getFullYear(),
      this.state.dateForShowData.getMonth() + 1,
      0
    );

    var firstdd = String(firstDate.getDate()).padStart(2, "0");
    var lastdd = String(lastDate.getDate()).padStart(2, "0");

    var mm = String(firstDate.getMonth() + 1).padStart(2, "0"); //January is 0!

    var yyyy = firstDate.getFullYear();

    var today = mm + "-" + firstdd + "-" + yyyy;

    var last = mm + "-" + lastdd + "-" + yyyy;

    var defaultSelection = this.state.defaultSelection;
    // alert(last);
    //return

    if (whereFrom == "fromTooltip") {
      tooltipData.billingDetails.sort(function (a, b) {
        return new Date(b.WhenEntered) - new Date(a.WhenEntered);
      });
      this.filterArrayDateWise(tooltipData.billingDetails);

      this.setState({
        billingDetails: tooltipData.billingDetails
          ? tooltipData.billingDetails
          : [],
        dataIsPresent: true,
      });
    } else {
      this.props
        .get_billing_details(
          today,
          last,
          this.state.defaultSelection,
          this.props.doctorProfile.DoctorData._id
        )
        .then((payload) => {
          if (payload.error) {
            switch (payload.error.data) {
              case "Network Error":
                this.setState({
                  isInternetOn: false, refresh: false,
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
          } else {
            var data = payload.payload ? payload.payload.data : null;

            if (data.status == 0)
              this.setState({
                finalArrayAfterTabClick: [],
                dataIsPresent: false,
                billingDetails: [],
                invalid: true,
                loading: false,
                isRefresh: true, refresh: false
              });
            else if (data.status == 1) {
              //get values >> for monthly earning and consultaions

              var billingDetails = data.billingDetails.filter(function (
                element
              ) {
                if (
                  element.AmountPaid == 0 &&
                  element.ConsultComplete == 1 &&
                  element.IsRefunded == null &&
                  element.IsCancelled == null &&
                  (element.PayType == 2 || element.PayType == 5)
                ) {
                  return false;
                } else if (
                  element.IsPaid == 0 &&
                  element.PayType == 2 &&
                  element.IsCancelled == 1 &&
                  element.IsRefunded == 0 &&
                  element.IsPaidByAdmin == 0
                ) {
                  return false;
                } else if (
                  element.IsPaid == 0 &&
                  element.PayType == 2 &&
                  element.IsCancelled == 1
                ) {
                  return true;
                } else if (
                  element.IsRefunded == 1 &&
                  element.IsCancelled == 1 &&
                  (element.PayType == 2 || element.PayType == 5)
                ) {
                  return true;
                } else {
                  return true;
                }
                //     else if (element.IsPaid == 0 && element.PayType == 2 && element.ConsultComplete == 1
                //          ) {
                ///   return true;
                // }
                //else if (defaultSelection == 1 && element.PayType == 4) {
                //  return false;
                // }
              });

              if (billingDetails.length > 0) {
                billingDetails.sort(function (a, b) {
                  return new Date(b.WhenEntered) - new Date(a.WhenEntered);
                });
                this.filterArrayDateWise(billingDetails);

                this.setState({
                  billingDetails: billingDetails ? billingDetails : [],
                  dataIsPresent: true, refresh: false,
                });
              } else {
                this.setState({
                  finalArrayAfterTabClick: [],
                  dataIsPresent: false,
                  billingDetails: [], refresh: false,
                });
              }
            }
          }
        });
    }
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
        month[compareDate.getMonth()] +
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

    this.setState(
      {
        finalArrayAfterTabClick: finalArray,
        data_for_list: data_for_list,
        //monthlyEarning:
      },
      () => { }
    );

    //this.refs.child.showAlert(passIndex);
  }
  TabClick(position) {
    //return

    if (position == "left") {
      //   makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

      this.setState(
        {
          passMothFirstDate: new Date(
            this.state.passMothFirstDate.setMonth(
              this.state.passMothFirstDate.getMonth() - 1
            )
          ),
        },
        () => {
          this.setVCDPage();
        }
      );
    } else {
      if (
        this.state.passMothFirstDate.getFullYear() ==
        new Date().getFullYear() &&
        this.state.passMothFirstDate.getMonth() == new Date().getMonth()
      ) {
        Alert.alert("Prescrip", "No transactions found for other months");

        //  alert('this is latest month update')
      } else {
        this.setState(
          {
            passMothFirstDate: new Date(
              this.state.passMothFirstDate.setMonth(
                this.state.passMothFirstDate.getMonth() + 1
              )
            ),
          },
          () => {
            this.setVCDPage();
          }
        );
      }
    }
  }

  updateData = (data) => {

    //this.props.setCurrentTab(this.props.route.key);
    this.setVCDPage();

  };

  viewReceptClick(clickFrom, itemData) {
    //  if (clickFrom == 'viewReceipt') {
    if (true) {
      // if(false){

      if (!itemData.PayType) {
        itemData.PayType = 1;
      }
      //this.props.screenProps.rootNavigation.navigate('PatientBillingReceiptContainer')
      this.props.isRefreshBilling(false);
      this.props.screenProps.rootNavigation.navigate(
        "PatientBillingReceiptContainer",
        {
          updateData: this.updateData.bind(this),
          filterMonth: this.state.dateForShowData,
          receviedAmountData: {
            receviedAmount:
              itemData.ReimbursementAmount != null &&
                itemData.ReimbursementAmount != undefined
                ? itemData.ReimbursementAmount
                : "",
            platformFee:
              itemData.TechnologyFee != null &&
                itemData.TechnologyFee != undefined
                ? itemData.TechnologyFee
                : "",
            transactionFee:
              itemData.ConvenienceFee != null &&
                itemData.ConvenienceFee != undefined
                ? (itemData.ConvenienceFee / 100) * itemData.ConsultFees
                : "",
            totalAmount:
              itemData.ConsultFees != null && itemData.ConsultFees != undefined
                ? itemData.ConsultFees
                : "",
            transactionId: itemData.TransactionId ? itemData.TransactionId : "",
            Name: itemData.Name ? itemData.Name : "N/A",
            WhenEntered: itemData.WhenEntered ? itemData.WhenEntered : "",
            patient_Id: itemData.PatientId ? itemData.PatientId : "",
            callfrom: clickFrom,
            patientId: itemData.PatientCID ? itemData.PatientCID : "",
            // patientId: itemData.PatientId,
            IsPaid:
              itemData.IsPaid != null && itemData.IsPaid != undefined
                ? itemData.IsPaid
                : "",
            PayType:
              itemData.PayType != null && itemData.PayType != undefined
                ? itemData.PayType
                : "",
            IsRefunded:
              itemData.Remarks && itemData.Remarks == "clonedcancel"
                ? 1
                : itemData.IsRefunded,
            IsCancelled:
              itemData.Remarks && itemData.Remarks == "clonedcancel"
                ? null
                : itemData.IsCancelled,

            _id: itemData._id ? itemData._id : "",
            PayLink: itemData.PayLink,
          },
        }
      );

      // alert('sad')
    } else {
      this.setState({
        description: "Feature in progress",
        toastBgColor: "#d9541d",
        toastTextColor: "#fffefe",
        toastImagePath: Images.Error,
      });

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

      // Alert.alert("Prescrip", "Under Development")
    }
  }

  secondMenuImageOnClick() {
    // alert('dsa');
    this.props.screenProps.rootNavigation.navigate("BankDetailContainer");
  }

  toolTipClick(value) {
    if (value == 8) {
      this.setState(
        {
          tooltipSteps: value,
        },
        () => {
          this.props.setTooltipStatus({ ["billingTooltip"]: false });

          this.setVCDPage();
        }
      );
    } else {
      this.setState({
        tooltipSteps: value,
      });
    }
  }

  rightImageOnClick = () => {
    if (this.state.dataIsPresent) {
      if (this.state.data_for_list.length > 0) {
        var result = this.groupBy(this.state.data_for_list, function (item) {
          return [item.PatientID, item.PatientCID];
        });

        this.props.screenProps.rootNavigation.navigate("BillingContainer", {
          resultOfMonth: result,
        });
      }
    } else {
      Alert.alert("Prescrip", "No transactions found for this month");
    }
  };

  // let phoneNumber = '+918850103807';
  // //if (Platform.OS === 'android') {
  // phoneNumber = `tel:${phoneNumber}`;
  // //}
  // Linking.openURL(phoneNumber);

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }

  thirdMenuImageOnClick = () => {
    if (this.state.dataIsPresent) {
      if (this.state.data_for_list.length > 0) {
        var result = this.groupBy(this.state.data_for_list, function (item) {
          return [item.PatientID, item.PatientCID];
        });

        this.props.screenProps.rootNavigation.navigate("BillingContainer", {
          resultOfMonth: result,
        });
      }
    } else {
      Alert.alert("Prescrip", "No transactions found for this month");
    }
  };

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

  calBilled() {
    let amount = 0;
    for (let i = 0; i < this.state.billingDetails.length; i++) {
      const selectedArray = this.state.billingDetails[i];
      //  for (let index = 0; index < selectedArray.length; index++) {
      //     const element = selectedArray[index];
      /*  if (element.Remarks && element.Remarks == 'clonedcancel') {
              } else if (element.IsRefunded == 1 && element.IsCancelled == null) {
              } else {
                amount = amount + element.ConsultFees;
              }*/
      if (selectedArray.PayType != 4) {
        amount = amount + selectedArray.AmountPaid;
      }

      //    }
    }
    return getCurreny() + " " + amount.toFixed(2);
  }
  calRecevied() {
    let amount = 0;
    for (let i = 0; i < this.state.billingDetails.length; i++) {
      const selectedArray = this.state.billingDetails[i];
      //  for (let index = 0; index < selectedArray.length; index++) {
      //     const element = selectedArray[index];
      /*  if (element.Remarks && element.Remarks == 'clonedcancel') {
              } else if (element.IsRefunded == 1 && element.IsCancelled == null) {
              } else {
                amount = amount + element.ConsultFees;
              }*/
      if (selectedArray.PayType != 4) {
        amount = amount + selectedArray.ReimbursementAmount;
      }

      //    }
    }
    return getCurreny() + " " + amount.toFixed(2);
  }

  filterClick(displayname, index) {
    let finalData = [];
    this.setState(
      {
        defaultSelectionFinal: displayname,
      },
      () => {
        if (this.props.sync.configData.filtersBilling.length > 0) {
          this.flatListRef.scrollToIndex({ animated: true, index: index });
        }
        switch (this.state.defaultSelectionFinal.displayname) {
          case "Paid":
            finalData = this.state.billingDetails.filter(
              (d) => d.IsPaidByAdmin == 1 && d.PayType != 4
            );
            break;
          case "UnPaid":
            finalData = this.state.billingDetails.filter((d) =>
              d.IsPaid == 0
                ? d.PayType != 5 && d.PayType != 4
                  ? d.IsRefunded != 1 && d.IsCancelled != 1
                    ? true
                    : false
                  : false
                : false
            );
            break;
          case "Prescrip Pay Link":
            finalData = this.state.billingDetails.filter((d) => d.PayType == 3);
            break;

          case "Video Consultation":
            finalData = this.state.billingDetails.filter((d) =>
              d.PayType == 2
                ? d.IsRefunded != 1 || d.IsCancelled != 1
                  ? true
                  : false
                : d.PayType == 1
                  ? d.IsRefunded != 1 || d.IsCancelled != 1
                    ? true
                    : false
                  : false
            );
            break;
          case "Refunds":
            finalData = this.state.billingDetails.filter((d) => d.PayType == 5);
            break;
          case "Offline Payment":
            finalData = this.state.billingDetails.filter((d) => d.PayType == 4);
            break;

          default:
            finalData = this.state.billingDetails;
            break;
        }

        this.filterArrayDateWise(finalData);

        this.setState({
          dataIsPresent: finalData.length > 0 ? true : false,
        });
      }
    );
  }

  ListItem(item, index) {
    return index == 0 ? (
      <Tooltip
        topAdjustment={Platform.OS === "android" ? -StatusBar.currentHeight : 0}
        animated={true}
        isVisible={this.state.tooltipSteps == 7 ? true : false}
        backgroundColor={"rgba(0,0,0,0.5)"}
        contentStyle={{
          backgroundColor: "#6f6af4",
          height: "100%",
        }}
        tooltipStyle={{ left: 15, alignItems: "flex-start" }}
        content={
          <TouchableOpacity
            style={{ backgroundColor: "#6f6af4" }}
            onPress={() => {
              this.toolTipClick(2);
            }}
          >
            <AddPatient
              imagePath={Tooltip_Payment_Filter}
              title={"Filters"}
              description={
                "Filter your results by the type of transaction and service provided "
              }
            />
          </TouchableOpacity>
        }
        //(Must) This is the view displayed in the tooltip
        placement="bottom"
        //(Must) top, bottom, left, right, auto.
        onClose={() => {
          this.toolTipClick(2);
        }}

      //(Optional) Callback fired when the user taps the tooltip
      >
        <TouchableOpacity
          onPress={() => this.filterClick(item, index)}
          style={{
            backgroundColor:
              this.state.defaultSelectionFinal.displayname == item.displayname
                ? "#0065d7"
                : "white",
            borderRadius: 20,
            marginVertical: 15,
            marginHorizontal: 10,
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 1,
          }}
        >
          <Text
            style={{
              marginHorizontal: 18,
              marginVertical: 8,
              color:
                this.state.defaultSelectionFinal.displayname != item.displayname
                  ? "#0065d7"
                  : "white",
              fontFamily: "NotoSans",
            }}
          >
            {item.displayname == "Paid"
              ? "Transferred"
              : item.displayname == "UnPaid"
                ? "Unpaid"
                : item.displayname == "Offline Payment"
                  ? "Offline Receipts"
                  : item.displayname}
          </Text>
        </TouchableOpacity>
      </Tooltip>
    ) : (
      <TouchableOpacity
        onPress={() => this.filterClick(item, index)}
        style={{
          backgroundColor:
            this.state.defaultSelectionFinal.displayname == item.displayname
              ? "#0065d7"
              : "white",
          borderRadius: 20,
          marginVertical: 15,
          marginHorizontal: 10,
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          elevation: 1,
        }}
      >
        <Text
          style={{
            marginHorizontal: 18,
            marginVertical: 8,
            color:
              this.state.defaultSelectionFinal.displayname != item.displayname
                ? "#0065d7"
                : "white",
            fontFamily: "NotoSans",
          }}
        >
          {item.displayname == "Paid"
            ? "Transferred"
            : item.displayname == "UnPaid"
              ? "Unpaid"
              : item.displayname == "Offline Payment"
                ? "Offline Receipts"
                : item.displayname}
        </Text>
      </TouchableOpacity>
    );
  }

  setDefaultClinic(indexFromPopup) {
    //  alert(indexFromPopup)

    let ContactDetails = this.state.ContactDetails1;

    ContactDetails.map(function (item, index) {
      if (index == indexFromPopup) {
        item.colorCode = "#0065d7";
        item.imagePath = ic_Mark_as_done;
      } else {
        item.colorCode = "#000000";
        item.imagePath = "";
      }
    });

    this.setState(
      {
        ContactDetails1: ContactDetails,
        isContactDetailsModal: false,
        defaultSelection: indexFromPopup,
        title: ContactDetails[indexFromPopup].name,
      },
      () => {
        this.setVCDPage();
      }
    );
  }

  deleteCustomData(data) {
    if (data.PayType == 4) {
      Alert.alert(
        "Prescrip",
        "Do you want to delete the custom receipt ? It won't available once discarded",
        [
          {
            text: "Cancel",
            onPress: () => console.log(""),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => this.onDiscard(data._id),
          },
        ]
      );

      //  alert(item)
    }
  }

  onDiscard(digiID) {
    this.props.delete_custom_receipt(digiID).then((response) => {
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

          //  description: payload.data.msg
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        });
        return;
      } else if (response.payload.data.status == 1) {
        this.setVCDPage();

        this.setState({
          showToast: true,
          loading: false,
          toastBgColor: "#29b62f",
          toastImagePath: Images.Success,
          toastTextColor: "#fafdfa",
          isAddedFav: true,
          description: response.payload.data.msg,
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });

          //this.props.navigation.goBack()
        }, 2000);

        //alert(response.payload.data.msg)
      } else {
        // Toast.show({ text: `Something went wrong`, duration: 1000, position: 'bottom' })
      }
    });
  }

  triggerChildAlert(value) {
    // alert(value)
    // setTimeout(() => {
    this.refs.child.showAlert(value);
    //  }, 500);
  }

  closeCalender() {
    this.setState({ show: !this.state.show });
  }

  showModalData(value) {
    this.setState(
      {
        showIntroModal: value,
        tooltipSteps: 1,
      },
      () => {
        this.forceUpdate();
      }
    );
  }
  navigateScreen() {
    this.props.isRefreshBilling(true);
    this.props.screenProps.rootNavigation.navigate(
      "AddBillingReceiptContainer",
      {
        updateData: this.updateData.bind(this),
        filterMonth: this.state.dateForShowData
      }
    );
  }

  menuSelectName(name) {
    if (name == "Payment") {
      this.props.screenProps.rootNavigation.navigate("BankDetailContainer");
    } else {
      let phoneNumber = this.props.sync.configData.supportNo
        ? this.props.sync.configData.supportNo
        : "+918850103807";
      //if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
      //}
      Linking.openURL(phoneNumber);
    }
  }

  render() {
    const isBankDetails = !this.props.doctorProfile.DoctorData.BankDetails
      ? true
      : false;

    this.props.screenProps.data = true;
    const setModalVisible = true;
    const modalVisible = true;

    return (

      <View style={{ flex: 1, width: Dimensions.get('window').width }}  >
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
            flex: 1, width: Dimensions.get('window').width
          }}
        >
          {/*Header Code*/}
          <View  >
            <PrescriptionHeader
              {...this.props}
              bgImage={ic_Teal_BG_578}
              bgColor={null}
              title={
                monthsShort(this.state.dateForShowData.getMonth()) +
                ", " +
                this.state.dateForShowData.getFullYear()
              }
              //alert(this.props.home.currentTab =="MyPatients")

              currentTab={this.props.home.currentTab}
              titleSize={20}
              cursorColor={"#ffffff"}
              description={null}
              descriptionSize={15}
              titleColor={"#fff"}
              calRecevied={this.calRecevied()}
              calBilled={this.calBilled()}
              descriptionColor={"#fff"}
              show={this.state.show}
              leftImage={Images.ic_Menu_Button}
              isVisible={this.props.tooltipSteps == 1 ? true : false}
              rightImage={icon_Three_Dot_Menu_Button}
              menuList={["Payment", "Support"]}
              menuSelectName={(name) => this.menuSelectName(name)}
              rightSecondImage={icon_search_white}
              rightImageCross={icon_close_white}
              isSearchBoxShowing={this.state.isSearchBoxShowing}
              type={6}
              searchAction={(text) => this.searchAction(text)}
              closeCalender={() => this.closeCalender()}
              leftImageOnClick={() => this.leftImageOnClick()}
              clickedOnBilling={(flag) => this.clickedOnBilling(flag)}
              onDateChange={(value, callFrom) =>
                this.onDateChange(value, callFrom)
              }
              initialDate={new Date(this.state.dateForShowData)}
              rightImageOnClick={() => this.rightImageOnClick()}
              tooltipSteps={this.state.tooltipSteps}
              toolTipClick={(value) => this.toolTipClick(value)}
              isSecondMenuNotificationIcon={isBankDetails}
            />
          </View>

          {

            <View style={{ flex: 1 }}>

              {
                <View>
                  <FlatList
                    horizontal

                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    data={this.props.sync.configData.filtersBilling}
                    renderItem={({ item, index }) =>
                      this.ListItem(item, index)
                    }
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              }

              {this.state.dataIsPresent ? (
                <View style={{ flex: 1 }}>

                  {!this.state.isPullTextHide ? <Text style={{
                    width: '100%', textAlign: 'center', position: 'absolute', fontSize: 12, top: 0,
                    fontFamily: "NotoSans-Bold", color: "#3d3d3d"
                  }}>{'Swipe down to Refresh'}</Text> : null}
                  <BillingComponent
                    {...this.props}
                    ref="child"
                    defaultSelectionFinal={
                      this.state.defaultSelectionFinal.displayname
                    }
                    refresh={this.state.refresh}
                    onRefresh={() => { this.onRefresh() }}
                    tooltipSteps={this.state.tooltipSteps}
                    toolTipClick={(value) => this.toolTipClick(value)}
                    deleteCustomData={(value) => this.deleteCustomData(value)}
                    finalArrayAfterTabClick={this.state.finalArrayAfterTabClick}
                    viewReceptClick={(clickFrom, itemData) =>
                      this.viewReceptClick(clickFrom, itemData)
                    }
                  />
                </View>
              ) : (
                <EmptyHome
                  {...this.props}
                  imagePath={Images.ic_Video_Consultations_Empty_Icon}
                  title={this.state.EmptyHomeTitle}
                  colorCode={colorCode}
                  refreshing={this.state.refresh}
                  refreshEvent={() => { this.onRefresh() }}
                  isShowButton={this.state.isShowButton}
                  description={
                    this.state.EmptyHomeDescription +
                    (this.state.defaultSelection == 1
                      ? "\nvia\nPrescrip Pay + Video Consultations"
                      : this.state.defaultSelection == 2
                        ? "\nvia\nDirect Payment"
                        : "")
                  }
                  onClick={() => this.onClick()}
                />
              )}
              {this.state.show ? (
                <View
                  style={{
                    flex: 1,
                    position: "absolute",
                    left: 0,
                    top: -1,
                    opacity: 0.5,
                    width: 1000,
                    height: 1000,
                    backgroundColor: "black",
                  }}
                />
              ) : null}

            </View>

          }

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
            distanceToEdge={{ horizontal: 40, vertical: 120 }}
            // actions={this.props.actions}
            onPressMain={() => this.showModal()}
          />
        ) : null}

        {this.state.tooltipSteps == 6 ? (
          <TouchableOpacity
            onPress={() => {
              this.navigateScreen();
            }}
            style={{
              alignSelf: "flex-end",
              bottom: 0,
              marginBottom: 36,
              position: "absolute",
            }}
          >
            <Tooltip
              topAdjustment={
                Platform.OS === "android" ? -StatusBar.currentHeight : 0
              }
              animated={true}
              isVisible={true}
              backgroundColor={"rgba(0,0,0,0.5)"}
              tooltipStyle={{ right: 20, alignItems: "flex-end" }}
              contentStyle={{ backgroundColor: "#6f6af4", height: "100%" }}
              content={
                <TouchableOpacity
                  style={{ backgroundColor: "#6f6af4" }}
                  onPress={() => {
                    this.toolTipClick(7);
                  }}
                >
                  <AddPatient
                    imagePath={Tooltip_Add_Receipt}
                    title={"Add Custom Receipt"}
                    description={
                      "Keep record of payments received outside of prescrip as well"
                    }
                  />
                </TouchableOpacity>
              }
              //(Must) This is the view displayed in the tooltip
              placement="top"
              //(Must) top, bottom, left, right, auto.
              onClose={() => {
                this.toolTipClick(7);
              }}
            //(Optional) Callback fired when the user taps the tooltip
            >
              <Image
                style={{
                  resizeMode: "contain",
                  alignSelf: "flex-end",
                  justifyContent: "flex-end",
                  marginRight: 30,
                  width: 55,
                  height: 55,
                }}
                source={ic_Add_Clinic_Button}
              />
            </Tooltip>
          </TouchableOpacity>
        ) : !this.state.show ? (
          <TouchableOpacity
            onPress={() => {
              this.navigateScreen();
            }}
            style={{
              alignSelf: "flex-end",
              bottom: 50,
              right: 30,
              position: "absolute",
            }}
          >
            <Image
              style={{
                resizeMode: "contain",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
                marginRight: 0,
                width: 55,
                height: 55,
              }}
              source={ic_Add_Clinic_Button}
            />
          </TouchableOpacity>
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
            bottom: 50,
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

        {this.state.showIntroModal && this.props.billingTooltip ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute", width: Dimensions.get("window").width
            }}
          >
            <ImageBackground
              style={{
                flex: 1,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                resizeMode: "cover",
                flexDirection: "column",
              }}
              source={intro_bg}
            >
              <View
                style={{
                  // backgroundColor: 'red',
                  flex: 0.7,
                  marginHorizontal: 15,
                  marginTop: 10,
                  alignItems: "center",
                  flexDirection: "column-reverse",
                  alignItems: "flex-start"
                }}
              >
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    color: "#fff",
                    fontFamily: "NotoSans",
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  {"Keep a track of your payments"}
                </Text>

                <Text
                  style={{
                    fontSize: 23,
                    color: "#fff",
                    fontFamily: "NotoSans-Bold",
                    alignSelf: "center",
                    textAlign: "center",
                    paddingTop: 5
                  }}
                >
                  {
                    "Prescrip makes it simple\n to collect online payments\nand manage accounts "
                  }
                </Text>

                <Image
                  style={{
                    marginBottom: 30,
                    alignSelf: "center",
                    resizeMode: "contain",
                    height: Dimensions.get("window").width / 1.9,
                    width: Dimensions.get("window").width / 1.9,
                  }}
                  source={intro_billing}
                />
              </View>

              <View
                style={{
                  flex: 0.2,

                  //  backgroundColor: 'green',
                  marginHorizontal: 30,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity onPress={() => this.showModalData(false)}>
                  <LinearGradient
                    colors={["#1b7cdb", "#07cdf2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.8]}
                    style={{
                      marginTop: 50,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 25,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: "NotoSans-Bold",
                        marginHorizontal: 40,
                        fontSize: 17,
                        color: "#ffffff",
                      }}
                    >
                      TAKE WALKTHROUGH{" "}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ) : null}
      </View>

    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  sync: state.sync,
  billingTooltip: state.tooltip.toolTipStatus.billingTooltip,
  home: state.home,
});

const mapDispatchToProps = (dispatch) => ({
  //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
  get_billing_details: (startDate, endDate, type, doctorId) =>
    dispatch(get_billing_details(startDate, endDate, type, doctorId)),

  delete_custom_receipt: (digiId) => dispatch(delete_custom_receipt(digiId)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingScreen);
