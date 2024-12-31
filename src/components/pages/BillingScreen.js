//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import {
  BG,
  lefticon,
  trans_collapsed,
  trans_expand,
  ic_Teal_BG_578,
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  Linking,
  StatusBar,
  KeyboardAvoidingView,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { setDoctorData } from "../../actions/doctorProfile";
import SyncModal from "../../components/Modal/syncModal";
import { FloatingAction } from "react-native-floating-action";
import { ic_sync_fab, ic_sync_small } from "../../constants/images";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setCurrentTab } from "../../actions/auth";

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
import BillingComponent from "../BillingComponent/BillingComponent";
//import AddClinicPopup from '../Modal/addClinicPopup';
import { get_billing_details } from "../../actions";

import NoNetwork from "../../components/NoNetwork/noNetwork";
import AddClinicPopup from "../Modal/addClinicPopup";
const colorCode = "#881896";

class BillingScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor() {
    super();

    this.state = {
      description: "",
      showToast: false,
      defaultSelection: 0,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      isContactDetailsModal: false,

      isInternetOn: true,
      NoNetworkMsg: "",
      showSyncModal: false,
      finalArrayAfterTabClick: [],
      consultationCount: 0,
      passMothFirstDate: new Date(),
      dataIsPresent: false,
      isShowButton: false,
      EmptyHomeTitle: "Transactions not available for this month",
      EmptyHomeDescription: "No payment was done in this month",

      title: "All",

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

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.props.setCurrentTab(this.props.route.key);
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

  setVCDPage() {
    var firstDate = new Date(
      this.state.passMothFirstDate.getFullYear(),
      this.state.passMothFirstDate.getMonth(),
      1
    );

    var lastDate = new Date(
      this.state.passMothFirstDate.getFullYear(),
      this.state.passMothFirstDate.getMonth() + 1,
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
        }
        var data = payload.payload ? payload.payload.data : null;

        if (data.status == 0)
          this.setState({ invalid: true, loading: false, isRefresh: true });
        else if (data.status == 1) {
          //get values >> for monthly earning and consultaions

          var totalEarningsMonth = 0;
          var totalConsultationsMonth = 0;

          if (this.state.defaultSelection == 0) {
            totalEarningsMonth = this.sum(
              "AmountPaid",
              data.billingDetails.filter((d) => d.IsPaid == 1 || d.PayType == 4)
            );
            totalConsultationsMonth = data.billingDetails[0]
              ? data.billingDetails.filter(
                  (d) => (d.IsPaid == 1 && d.IsCancelled != 1) || d.PayType == 4
                ).length
              : 0;
          } else if (this.state.defaultSelection == 1) {
            totalEarningsMonth = this.sum(
              "AmountPaid",
              data.billingDetails.filter((d) => d.IsPaid == 1 && d.PayType != 4)
            );
            totalConsultationsMonth = data.billingDetails[0]
              ? data.billingDetails.filter(
                  (d) => d.IsPaid == 1 && d.IsCancelled != 1
                ).length
              : 0;
          } else if (this.state.defaultSelection == 2) {
            totalEarningsMonth = this.sum(
              "AmountPaid",
              data.billingDetails.filter((d) => d.PayType == 4)
            );
            totalConsultationsMonth = data.billingDetails[0]
              ? data.billingDetails.filter((d) => d.PayType == 4).length
              : 0;
          }

          var ConsultFees = 0;

          totalEarningsMonth = this.convertIntoK(totalEarningsMonth);
          data.totalEarnings = this.convertIntoK(data.totalEarnings);

          if (this.state.defaultSelection == 2) {
            var billingDetails = data.billingDetails.filter(function (
              element,
              index
            ) {
              if (element.PayType == 4) {
                return true;
              } else {
                return false;
              }
            });
            billingDetails.sort(function (a, b) {
              return new Date(b.WhenEntered) - new Date(a.WhenEntered);
            });

            //const arr1 = this.getUniqueListBy(billingDetails, '_id')

            this.filterArrayDateWise(billingDetails);
            this.setState({
              monthName: month[this.state.passMothFirstDate.getMonth()],
              monthYear: this.state.passMothFirstDate.getFullYear(),
              totalConsultations: data.totalConsultations,
              totalEarnings: data.totalEarnings ? data.totalEarnings : "0",
              //finalArrayAfterTabClick: [],
              dataIsPresent: billingDetails.length > 0 ? true : false,
              consultationCount: totalConsultationsMonth
                ? totalConsultationsMonth
                : 0,
              monthlyEarning: totalEarningsMonth ? totalEarningsMonth : 0,
            });
          } else {
            var billingDetails = data.billingDetails.filter(function (
              element,
              index
            ) {
              //  IsCancelled:1
              //  IsPaid:0
              //   IsPaidByAdmin:0
              //   IsRefunded:1
              // ConsultComplete:0

              if (
                element.AmountPaid == 0 &&
                element.ConsultComplete == 1 &&
                element.IsRefunded == null &&
                element.IsCancelled == null &&
                element.PayType == 2 &&
                element.Remarks != "clonedcancel"
              ) {
                return false;
              } else if (
                element.IsPaid == 0 &&
                element.PayType == 2 &&
                element.IsCancelled == 1 &&
                element.Remarks != "clonedcancel"
              ) {
                return false;
              } else if (
                element.IsRefunded == 1 &&
                element.IsCancelled == 1 &&
                element.PayType == 2 &&
                element.Remarks != "clonedcancel"
              ) {
                return true;
              } else if (
                element.IsPaid == 0 &&
                element.PayType == 2 &&
                element.ConsultComplete == 1
              ) {
                return true;
              } else if (defaultSelection == 1 && element.PayType == 4) {
                return false;
              } else {
                return true;
              }
            });

            if (billingDetails.length > 0) {
              billingDetails.sort(function (a, b) {
                return new Date(b.WhenEntered) - new Date(a.WhenEntered);
              });
              this.filterArrayDateWise(billingDetails);

              this.setState({
                monthName: month[this.state.passMothFirstDate.getMonth()],
                monthYear: this.state.passMothFirstDate.getFullYear(),

                consultationCount: totalConsultationsMonth,
                monthlyEarning: totalEarningsMonth,
                // monthName: month[new Date(billingDetails[0].WhenEntered).getMonth()],

                totalConsultations: data.totalConsultations,
                totalEarnings: data.totalEarnings,
                dataIsPresent: true,
              });
            } else {
              this.setState({
                monthName: month[this.state.passMothFirstDate.getMonth()],
                monthYear: this.state.passMothFirstDate.getFullYear(),

                totalConsultations: data.totalConsultations,
                finalArrayAfterTabClick: [],
                dataIsPresent: false,
                consultationCount: totalConsultationsMonth
                  ? totalConsultationsMonth
                  : 0,

                monthlyEarning: totalEarningsMonth ? totalEarningsMonth : 0,
                totalEarnings: data.totalEarnings ? data.totalEarnings : 0,
              });
            }
          }
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

    this.setState({
      finalArrayAfterTabClick: finalArray,
      data_for_list: data_for_list,
      //monthlyEarning:
    });
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
    if (data == "addReceipt") {
      this.props.setCurrentTab(this.props.route.key);
      this.setVCDPage();
    }
    //  alert(data)
  };

  viewReceptClick(clickFrom, itemData) {
    //  if (clickFrom == 'viewReceipt') {
    if (true) {
      // if(false){

      //this.props.screenProps.rootNavigation.navigate('PatientBillingReceiptContainer')
      this.props.screenProps.rootNavigation.navigate(
        "PatientBillingReceiptContainer",
        {
          updateData: this.updateData.bind(this),

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
  RightImageOnClick() {
    //alert('sda');

    let phoneNumber = this.props.sync.configData.supportNo
      ? this.props.sync.configData.supportNo
      : "+918850103807";
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }

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

  clickedOnBilling() {
    //alert('das')
    this.setState({
      isContactDetailsModal: true,
    });
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

  navigateScreen() {
    this.props.screenProps.rootNavigation.navigate(
      "AddBillingReceiptContainer",
      { updateData: this.updateData.bind(this) }
    );
  }

  render() {
    const isBankDetails = !this.props.doctorProfile.DoctorData.BankDetails
      ? true
      : false;

    this.props.screenProps.data = true;
    const setModalVisible = true;
    const modalVisible = true;

    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <AddClinicPopup
          {...this.props}
          ContactDetails1={this.state.ContactDetails1}
          isContactDetailsModal={this.state.isContactDetailsModal}
          closeClick={() => this.closeClick()}
          onClick={() => this.onClick("PopUp")}
          callFrom={"billing"}
          setCurrentClinic={(index) => this.setDefaultClinic(index)}
        />

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
            <HeaderData
              {...this.props}
              editImageOnClick={() => this.editImageOnClick()}
              bgImage={ic_Teal_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              title={getDayWishes()}
              description={
                "Dr. " + this.state.DoctorFName + "\n" + this.state.DoctorLName
              }
              onGotIt={() => this.onGotIt()}
              leftImage={Images.ic_Menu_Button}
              rightImage={icon_Help}
              type={10}
              leftImageOnClick={() => this.leftImageOnClick()}
              RightImageOnClick={() => this.RightImageOnClick()}
              thirdMenuImageOnClick={() => this.thirdMenuImageOnClick()}
              secondMenuImageOnClick={() => this.secondMenuImageOnClick()}
              //isTitle ={true}
              title={
                this.state.title == "Prescrip Pay + Video Consultations"
                  ? "Prescrip Pay + VC"
                  : this.state.title
              }
              clickedOnBilling={() => this.clickedOnBilling()}
              isBilling={true}
              isMenuName={true}
              photo={null}
              totalConsultations={this.state.totalConsultations}
              totalEarnings={this.state.totalEarnings}
              isSecondMenuNotificationIcon={isBankDetails}
              isShowConsultations={true}
              secondMenu={true}
              secondMenuImage={icon_Wallet_Icon}
              secondMenuName={"Payments"}
              isSecondMenuName={true}
              isMenuName={true}
              secondMenuImageOnClick={() => this.secondMenuImageOnClick()}
              rightImage={icon_Help}
              rightImageName={"Help"}
              //rightImageName ={}
            />
          </View>

          <View style={{ justifyContent: "flex-start", flex: 1 }}>
            <View
              style={{
                alignItems: "center",
                top: -20,
                alignSelf: "center",
                width: "100%",
                height: 50,
                backgroundColor: "#F6F9FA",
                borderTopEndRadius: 20,
                borderTopLeftRadius: 20,
              }}
            >
              {
                <View>
                  <View
                    style={{
                      marginTop: -70,
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        shadowOpacity: 0.5,
                        borderRadius: 10,
                        paddingVertical: 10,
                        justifyContent: "center",
                        flexDirection: "row",
                        marginLeft: 23,
                        marginRight: 23,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            marginTop: 10,
                            fontFamily: "NotoSans-Bold",
                            color: "#000000",
                            fontSize: 28,
                            textAlign: "center",
                          }}
                        >
                          {this.state.monthName}
                        </Text>

                        <Text
                          style={{
                            fontFamily: "NotoSans",
                            color: "#000000",
                            fontSize: 13,
                            textAlign: "center",
                          }}
                        >
                          {this.state.monthYear}
                        </Text>

                        <Text
                          style={{
                            marginTop: 10,
                            fontFamily: "NotoSans",
                            color: "#787878",
                            fontSize: 10,
                            textAlign: "center",
                          }}
                        >
                          {"Current Month"}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                          width: 1,
                          marginHorizontal: 5,
                          backgroundColor: "#ECECEC",
                        }}
                      />

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 10,
                            fontFamily: "NotoSans-Bold",
                            color: "#000000",
                            fontSize: 28,
                          }}
                        >
                          {this.state.consultationCount}
                        </Text>

                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "NotoSans",
                            color: "#000000",
                            fontSize: 13,
                          }}
                        >
                          {"Consultations"}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "NotoSans-Bold",
                            color: "#000000",
                            fontSize: 28,
                          }}
                        >
                          {this.state.monthlyEarning}
                        </Text>

                        <Text
                          style={{
                            textAlign: "center",
                            fontFamily: "NotoSans",
                            color: "#000000",
                            fontSize: 13,
                          }}
                        >
                          {"earning"}
                        </Text>

                        {/*    <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'NotoSans', color: '#787878', fontSize: 9, alignSelf: 'center' }}
                      >{'MTD via Prescrip'}</Text>*/}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: -35,
                      height: 45,
                      width: 45,
                      alignSelf: "flex-start",
                      alignItems: "center",
                      position: "absolute",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.TabClick("left");
                      }}
                    >
                      <Image
                        source={icon_Left_Button}
                        style={{
                          width: 42,
                          height: 42,
                          alignSelf: "center",
                          resizeMode: "contain",
                        }}
                      ></Image>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginTop: -35,
                      height: 45,
                      width: 45,
                      alignSelf: "flex-end",
                      alignItems: "center",
                      position: "absolute",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.TabClick("right");
                      }}
                    >
                      <Image
                        source={icon_Right_Button}
                        style={{
                          width: 42,
                          height: 42,
                          alignSelf: "center",
                          resizeMode: "contain",
                        }}
                      ></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>

            {this.state.dataIsPresent ? (
              <BillingComponent
                {...this.props}
                finalArrayAfterTabClick={this.state.finalArrayAfterTabClick}
                viewReceptClick={(clickFrom, itemData) =>
                  this.viewReceptClick(clickFrom, itemData)
                }
              />
            ) : (
              <EmptyHome
                {...this.props}
                imagePath={Images.ic_Video_Consultations_Empty_Icon}
                title={this.state.EmptyHomeTitle}
                colorCode={colorCode}
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
          </View>
        </View>
        {this.props.screenProps.IsUpdateReq ? (
          <FloatingAction
            iconHeight={45}
            iconWidth={45}
            position={"right"}
            color="transparent"
            floatingIcon={ic_sync_fab}
            buttonSize={38}
            overlayColor="transpart"
            distanceToEdge={{ horizontal: 22, vertical: 130 }}
            // actions={this.props.actions}
            onPressMain={() => this.showModal()}
          />
        ) : null}

        {
          <FloatingAction
            iconHeight={55}
            iconWidth={55}
            position={"right"}
            color="transparent"
            floatingIcon={ic_Add_Clinic_Button}
            buttonSize={50}
            overlayColor="transpart"
            distanceToEdge={{ horizontal: 22, vertical: 40 }}
            // actions={this.props.actions}
            onPressMain={() => this.navigateScreen()}
          />
        }
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
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});

const mapDispatchToProps = (dispatch) => ({
  //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
  get_billing_details: (startDate, endDate, type, doctorId) =>
    dispatch(get_billing_details(startDate, endDate, type, doctorId)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingScreen);
