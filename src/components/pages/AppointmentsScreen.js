//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import {
  getDayWishes,
  month,
  monthFull,
  getDateDiffFromToday,
} from "../../commonmethods/validation";
import { Container, Text, Icon, Button } from "native-base";

import { ic_popup_Add_Button_Icon } from "../../constants/images";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { delete_icon, Tooltip_Edit_Icon } from "../../constants/images";
import {
  Alert,
  StatusBar,
  Dimensions,
  View,
  TouchableOpacity,
  BackHandler,
  Image,
  Modal,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Share,
  Platform,
} from "react-native";
import AddClinicPopup from "../Modal/addClinicPopup";
import DateTimePicker from "react-native-modal-datetime-picker";
import Tooltip from "react-native-walkthrough-tooltip";
import styles from "../Header/styles";
import AddPatient from "../Tooltips";
import Images from "../../Theme/Images";
import HeaderData from "../Header/header";
import EmptyHome from "../EmptyHome/EmptyHome";
import AppointmentComponent from "../AppointmentComponent";
import { connect } from "react-redux";

import { setTooltipStatus } from "../../actions/tooltip";

import { setDoctorData, setClinicDetails } from "../../actions/doctorProfile";
import {
  getAppointmentList,
  markAppointmentDone,
  cancelAppointment,
  setAppointmentClinic,
} from "../../actions/appointments";
import { setPatientId } from "../../actions/patientVisit";
import { FloatingAction } from "react-native-floating-action";
import {
  ic_sync_fab,
  ic_sync_small,
  Add_green_btn,
  Add_Pink_btn,
} from "../../constants/images";
import SyncModal from "../../components/Modal/syncModal";
import NoNetwork from "../../components/NoNetwork/noNetwork";
import {
  ic_Add_Clinic_Button,
  ic_Orange_BG_578,
  ic_Empty_Setup_Clinic_Icon,
  ic_Add_Prescription,
  ic_Mark_as_done,
  ic_add_blue,
  empty_appo,
} from "../../constants/images";
import { setCurrentTab, isRefreshBilling } from "../../actions/auth";
import { setNotificationFlags } from "../../actions/home";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";
const colorCode = "#EB5E60";
const testapp = {
  _id: "5f88763481e4da0b94625853",

  AppointmentTime: "10:00 PM",

  AppointmentTimeNumeric: 2200,

  ClinicId: 1,

  From: "8850371217",

  PatientCid: 33,

  PatientDob: "1992-01-01T00:00:00.000Z",

  PatientGender: "Male",

  PatientId: "5df9fb227d6a981220e7f3a6",

  PatientName: "Lucky Diwan",

  PatientWhatsapp: "8097411607",

  SlotId: "5f8875e181e4da0b94625845",
};
var moment = require("moment");
class AppointmentsScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const firstnamealpha = props.doctorProfile.DoctorData.DoctorFName.charAt(
      0
    ).toUpperCase();
    const surfirstalpha = props.doctorProfile.DoctorData.DoctorLName.charAt(
      0
    ).toUpperCase();
    this.state = {
      isInternetOn: true,
      NoNetworkMsg: "",
      refresh: false, isPullTextHide: false,
      showSyncModal: false,
      selectedDate: new Date().toISOString(),
      maxDate: new Date(
        new Date().setDate(new Date().getDate() + 30)
      ).toISOString(), //As as discussion by nikit sir,pritish sir @5Feb2021
      toolTipVisible: false,
      isConsulting: false,
      appointmentList: [],
      isDatePickerVisible: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "No Clinics ",
      isPendingCunsulting: false,
      ContactDetails1: [],
      currentClinic: 0,
      isContactDetailsModal: false,
      flatListTopMonth: month[new Date().getMonth()],
      flatListTopDate: new Date().getDate(),
      isVisibleDatshow: false,
      finalArrayAfterTabClick: [],
      showTimingModal: false,
      doctorimage_alpha: firstnamealpha + surfirstalpha,
      createAppointment: false,

      //state to control the visibility of Tooltip
    };
  }

  componentWillMount() {

    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  componentWillReceiveProps(nextProps) {
    // if (nextProps.home.currentTab == "Appointments") {
    //   if (nextProps.doctorProfile.DoctorData.ClinicAddresses) {
    //     this.getClinicList();
    //   }
    // }
  }
  retryClick(isInternetOn) {
    if (isInternetOn) {
      this.setState({
        isInternetOn: true,
      });
      //this.props.dispatch({ type: 'GET_RXLIST_SUCCESS', payload: { data} });

      if (this.props.doctorProfile.DoctorData.ClinicAddresses) {
        this.getClinicList();
      }

      //alert("You are online!");
    } else {
      alert("You are offline!");
    }
    // alert('sad',isInternetOn)
  }
  handleBackButtonClick() {
    this.setState({
      isContactDetailsModal: false,
      showTimingModal: false,
    });
    //alert('sda')
  }
  onRefresh() {
    this.setState({ refresh: true }, () => {
      this.getClinicList();
    });
  }
  shouldComponentUpdate(nextProps, nextState) {

    var currentProps = this.props;
    if (nextProps.screenProps.currentComponent == 'Appointments' && nextProps.screenProps.switchTime
      != currentProps.screenProps.switchTime) {
        if (this.props.doctorProfile.DoctorData.ClinicAddresses) {
          this.getClinicList();
        }
    }
    return true;


  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isPullTextHide: true })
    }, 3000)
    getScreenNameAnalytics({
      screen_name: "Appointments",
      screen_class: "AppointmentsScreen",
    });

    if (this.props.doctorProfile.DoctorData.ClinicAddresses) {
      this.getClinicList();
    }

  }

  RightImageOnClick() {
    this.props.screenProps.rootNavigation.navigate(
      "DoctorProfileViewContainer"
    );
    //this.props.screenProps.rootNavigation.navigate('SelectMedication')
  }

  getClinicList() {
    if (this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0) {
      let clinics = this.props.doctorProfile.DoctorData.ClinicAddresses;

      let defclinic = clinics.find((clinic) => {
        return clinic.IsDefault == 1;
      });
      if (this.props.appointments.clinicId == 0) {
        this.setDefaultClinic(0);
      } else {
        let clinics = [...this.props.doctorProfile.DoctorData.ClinicAddresses];
        let index = -1;
        let clinic = clinics.find((c, i) => {
          if (c.ClinicId == this.props.appointments.clinicId) {
            index = i;
          }
        });
        if (index == -1) {
          index = 0;
        }
        this.setDefaultClinic(index);
      }
      this.props.setCurrentTab(this.props.route.key);
      this.props.isRefreshBilling(true);
      this.setState({
        createAppointment: this.props.createAppointment, refresh: false
      });
    }
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
      this.props.setClinicDetails(null);
      this.props.screenProps.rootNavigation.navigate("AppointmentContainer");
      this.setState({
        isContactDetailsModal: false,
      });
    }
  }
  setTestList() {
    let apps = [];
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    apps.push(testapp);
    this.setState({
      appointmentList: apps,
    });
  }
  setDefaultClinic(index) {
    if (index == -1) {
      index = 0;
    }

    let clinics = [...this.props.doctorProfile.DoctorData.ClinicAddresses];
    let data = {
      clinicId: clinics[index].ClinicId,
      ClinicName: clinics[index].ClinicName,
      Address: clinics[index].Address,
      selectedDate: this.props.appointments.selectedDate
        ? this.props.appointments.selectedDate
        : new Date().toISOString(),
    };
    this.props.setAppointmentClinic(data);
    this.setState(
      {
        pendingCunsultingDescription: clinics[index].ClinicName + "  ",
        currentClinic: clinics[index].ClinicId, refresh: false,
        isContactDetailsModal: false,
        selectedDate: data.selectedDate,
        flatListTopMonth: month[moment(data.selectedDate).month()],
        flatListTopDate: moment(data.selectedDate).date(),
        showTimingModal: false,
        upperdateTag:
          monthFull[moment(data.selectedDate).month()] +
          " " +
          moment(data.selectedDate).date() +
          "," +
          moment(data.selectedDate).year(),
      },
      () => {
        this.getClinicAppointment(clinics[index].ClinicId);
      }
    );
    //this.setTestList();

    let renderClinics = [];
    for (let c = 0; c < clinics.length; c++) {
      c == index ? (clinics[c].IsDefault = 1) : (clinics[c].IsDefault = 0);
      let item = {
        id: c + 1,
        name: clinics[c].ClinicName,
        des: "",
        colorCode: clinics[c].IsDefault ? "#0065d7" : "#000000",
        imagePath: clinics[c].IsDefault ? ic_Mark_as_done : "",
      };
      renderClinics.push(item);
    }
    renderClinics.push({
      id: "4",
      name: "Add New Clinic",
      des: "",
      colorCode: "#0065d7",
      imagePath: ic_add_blue,
    });
    this.setState({
      ContactDetails1: renderClinics,
    });
  }
  leftImageOnClick() {
    this.props.screenProps.rootNavigation.openDrawer();
  }

  onGotIt() {
    this.props.screenProps.setTooltip("Appointments");
  }
  closeClick() {
    this.setState({
      isContactDetailsModal: false,
    });
  }

  filterArrayDateWise(data_for_list) {
    var dateStr = null;
    var dateStrCompare = null;

    var dateStrFinal = null;
    var dateStrFinalCompare = null;

    var finalArray = [];
    var dateViaArray = [];
    data_for_list.forEach(function (element, i) {

      const compareDate = new Date(element.AppointmentDate);
      dateStrFinalCompare = compareDate;
      dateStrCompare =
        compareDate.getDate() +
        " " +
        month[compareDate.getMonth()].toUpperCase() +
        " " +
        +compareDate.getFullYear();

      if (i == 0) {
        dateStr = dateStrCompare;
        dateStrFinal = dateStrFinalCompare;
      }

      if (dateStr != dateStrCompare) {
        finalArray.push({
          title: dateStr,
          date: dateStrFinal,

          data: dateViaArray,
        });

        dateStr = dateStrCompare;
        dateStrFinal = dateStrFinalCompare;
        // dateViaArray.push(element)
        dateViaArray = [];
      }

      dateViaArray.push(element);

      if (data_for_list.length == i + 1) {
        finalArray.push({
          title: dateStrCompare,

          date: dateStrFinalCompare,
          data: dateViaArray,
        });
        dateViaArray = [];
      }

    });

    finalArray.forEach((element) => {
      let dd = element.data.filter(x => x.AppointmentTimeNumeric == 0).sort((a, b) => {
        return new Date(a.WhenEntered).getTime() > new Date(b.WhenEntered).getTime() ? 1 : -1
      });
      let nonWalkings = element.data.filter(x => x.AppointmentTimeNumeric > 0);
      element.data = nonWalkings.concat(dd);

    })

    this.setState({
      appointmentList: finalArray,
    });
  }

  getClinicAppointment(clinicId) {
    this.props.setNotificationFlags(false);
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      clinicId: clinicId,
      startDate: moment(this.state.selectedDate).format("MM-DD-YYYY"),
      endDate: moment(this.state.maxDate).format("MM-DD-YYYY"),
    };
    this.props.getAppointmentList(data).then(({ payload, error }) => {
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
      } else if (payload.data.status == 1) {
        this.setState({
          isInternetOn: true,
          NoNetworkMsg: "",
        });

        this.filterArrayDateWise(payload.data.responseAppointments);
        //let appointments = DataView;// response.payload.data.responseAppointments;
      } else {
        this.setState({
          appointmentList: [],
        });
      }
    });
  }

  makePrescription(item) {
    // return;

    let data = {
      id: item.des.PatientId,
      patientId: item.des.PatientCid, //cid should be passed while getting RX List
    };
    this.props.setPatientId(data);
    this.props.screenProps.rootNavigation.navigate(
      "PatientVisitHistoryContainer"
    );
  }

  cancelAppointment(item) {
    let data = {
      appointmentId: item._id,
      doctorId: this.props.doctorProfile.DoctorData._id,
      from: item.From,
      clinicId: this.state.currentClinic,
      slotId: item.SlotId,
      appointmentTimeNumeric: item.AppointmentTimeNumeric,
    };
    this.props.cancelAppointment(data).then((response) => {
      if (response.payload.data.Status == 1) {
        this.removeItem(item);
        logAnalytics(
          this.props.doctorProfile.DoctorData._id,
          this.props.doctorProfile.DoctorData.DoctorFName +
          " " +
          this.props.doctorProfile.DoctorData.DoctorLName,
          "cancel_inclinic_appointment"
        );
      }
    });
  }

  markAppointmentDone(item) {
    let data = {
      appointmentId: item._id,
    };
    this.props.markAppointmentDone(data).then((response) => {
      if (response.payload.data.Status == 1) {
        this.removeItem(item);
      }
    });
  }
  removeItem(item) {
    let newList = this.state.appointmentList.map((list, index) => {
      let appointList = list.data;
      let appointments = appointList.filter(function (e) {
        return e._id != item._id;
      });

      list.data = appointments;
      return list;
    });

    for (var i = 0; i < newList.length; i++) {
      if (newList[i].data.length == 0) {
        newList.splice(i, 1);
      }
    }

    this.setState({
      appointmentList: newList,
    });
  }
  toggleDatePicker(show) {
    this.setState({
      isDatePickerVisible: show,
    });
  }
  cancelDatePicker() {
    this.setState({
      isDatePickerVisible: false,
    });
  }
  setDate = (date) => {
    selectedDate = new Date(date).toISOString();

    this.setState(
      {
        selectedDate: selectedDate,
        flatListTopMonth: month[moment(date).month()],
        flatListTopDate: moment(date).date(),
        upperdateTag:
          monthFull[new Date().getMonth()] +
          " " +
          new Date().getDate() +
          "," +
          new Date().getFullYear(),

        isDatePickerVisible: false,
      },
      () => {
        this.getClinicAppointment(this.state.currentClinic);
      }
    );
    let data = {
      clinicId: this.props.appointments.clinicId,
      selectedDate: selectedDate,
    };
    this.props.setAppointmentClinic(data);
  };

  topItem(selectedDate) {
    if (selectedDate) {
      this.setState({
        showTimingModal: false,
        flatListTopMonth: month[moment(selectedDate).month()],
        flatListTopDate: moment(selectedDate).date(),
      });
    } else {
      this.setState({
        showTimingModal: false,
      });
    }
  }

  scrollStart() {
    this.setState({
      isVisibleDatshow: true,
    });
  }

  scrollEnd() {
    setTimeout(() => {
      this.setState({
        isVisibleDatshow: false,
      });
    }, 2000);
  }

  showTimingModal() {
    this.setState({
      showTimingModal: !this.state.showTimingModal,
    });
  }

  moveToIVRFlow() {
    if (this.props.doctorProfile.DoctorData.RoleId == 0)
      this.props.screenProps.rootNavigation.navigate("IvMyPatientsScreen")
    else
      this.props.screenProps.rootNavigation.navigate("AppointmentTypesContainer");
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

  changeState() {
    this.props.setTooltipStatus({ ["createAppointment"]: false });
    this.setState({
      createAppointment: false,
    });
  }

  render() {
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
        {/*Date Modal*/}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.setDate}
          date={
            this.props.appointments.selectedDate
              ? new Date(this.state.selectedDate)
              : new Date()
          }
          maximumDate={this.state.maxDate}
          onCancel={this.cancelDatePicker.bind(this)}
        />
        {/*Ends*/}

        <AddClinicPopup
          {...this.props}
          ContactDetails1={this.state.ContactDetails1}
          isContactDetailsModal={this.state.isContactDetailsModal}
          closeClick={() => this.closeClick()}
          onClick={() => this.onClick("PopUp")}
          setCurrentClinic={(index) => this.setDefaultClinic(index)}
        />
        <View
          style={{
            flexdirection: "column",
            flex: 1,
          }}
        >
          <View>
            <HeaderData
              {...this.props}
              bgImage={ic_Orange_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              title={getDayWishes()}
              description={
                "Dr. " +
                this.props.doctorProfile.DoctorData.DoctorFName +
                "\n" +
                this.props.doctorProfile.DoctorData.DoctorLName
              }
              onGotIt={() => this.onGotIt()}
              leftImage={Images.ic_Menu_Button}
              rightImage={Images.ic_share_button}
              type={1}
              isMenuName={true}
              rightImageName={"Share"}
              showProfile={() => this.RightImageOnClick()}
              leftImageOnClick={() => this.leftImageOnClick()}
              RightImageOnClick={() => this.onClick("share")}
              doctorimage_alpha={this.state.doctorimage_alpha}
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 10,
                  justifyContent: "space-between",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                {!this.state.isPullTextHide ? <Text style={{
                  width: '100%', textAlign: 'center', position: 'absolute',
                  fontSize: 12, top: 40,
                  fontFamily: "NotoSans-Bold", color: "#3d3d3d"
                }}>{'Swipe down to Refresh'}</Text> : null}
                <View
                  style={{
                    flex: 0.75,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "center",
                  }}
                >
                  {this.state.ContactDetails1.length > 0 ? (
                    <Text
                      style={[
                        styles.title,
                        {
                          fontFamily: "NotoSans",
                          fontSize: 13,
                          color: "#000000",
                        },
                      ]}
                    >
                      {"Showing Appointments for"}
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

                  {this.state.ContactDetails1.length > 0 ? (
                    //  this.refs.modalTiming.open();
                    <TouchableOpacity
                      onPress={() => {
                        if (this.state.ContactDetails1.length > 0) {
                          this.setState({
                            isContactDetailsModal: true,
                          });
                        } else {
                          this.onClick("popup");
                        }
                      }}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          {
                            flex: 0.9,
                            textAlign: "left",
                            fontFamily: "NotoSans-Bold",
                            fontSize: 20,
                            color: colorCode,
                          },
                        ]}
                      >
                        {this.state.pendingCunsultingDescription.trim()}
                      </Text>
                      {this.state.ContactDetails1.length > 0 ? (
                        <Icon as={FontAwesome}
                          style={{
                            flex: 0.1,
                            fontSize: 24,
                            paddingLeft: 10,
                            color: colorCode,
                            height: 30,
                            width: 30,
                            paddingTop: 2,
                          }}
                          name="angle-down"
                          type="FontAwesome"
                        />
                      ) : (
                        <Icon as={FontAwesome}
                          style={{
                            flex: 0.1,
                            paddingLeft: 10,
                            fontSize: 24,
                            color: colorCode,
                            height: 30,
                            width: 30,
                            paddingTop: 3,
                          }}
                          name="plus"
                          type="FontAwesome"
                        />
                      )}
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View
                  style={{
                    flex: 0.25,
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-end",
                      borderColor: colorCode,
                      borderRadius: 5,
                      borderWidth: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.showTimingModal();
                      }}
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
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{ top: -20, backgroundColor: "#ececec", width: Dimensions.get('window').width }}
            />
            

              {this.state.appointmentList.length == 0 ||
                this.state.ContactDetails1.length == 0 ? (
                <EmptyHome
                  {...this.props}
                  isLottie={true}
                  imagePath={empty_appo}
                  refreshEvent={() => { this.onRefresh() }}
                  refreshing={this.state.refresh}
                  // imagePath={ic_Empty_Setup_Clinic_Icon}
                  title={
                    this.state.ContactDetails1.length == 0
                      ? "Let's  setup your first Clinic to enable Appointments."
                      : "No Appointments - It seems all Your Patients are fit & fine"
                  }
                  colorCode={colorCode}
                  description={
                    this.state.ContactDetails1.length == 0
                      ? "Enable smart queuing with social distancing for peace of mind"
                      : ""
                  }
                  onClick={() =>
                    this.onClick(
                      this.props.doctorProfile.DoctorData.ClinicAddresses.length >
                        0 &&
                        (this.state.ContactDetails1.length == 0 ||
                          this.state.appointmentList.length == 0)
                        ? "share"
                        : "empty"
                    )
                  }
                  getStarted={
                    this.props.doctorProfile.DoctorData.ClinicAddresses.length >
                      0 &&
                      (this.state.ContactDetails1.length == 0 ||
                        this.state.appointmentList.length == 0)
                      ? "SHARE PROFILE"
                      : null
                  }
                  isShowButton={
                    this.props.doctorProfile.DoctorData.ClinicAddresses.length >
                      0 &&
                      (this.state.ContactDetails1.length == 0 ||
                        this.state.appointmentList.length == 0)
                      ? true
                      : this.state.ContactDetails1.length == 0
                        ? true
                        : false
                  }
                />
              ) : (
                <AppointmentComponent
                  {...this.props}
                  refresh={this.state.refresh}
                  onRefresh={() => { this.onRefresh() }}
                  data={this.state.appointmentList}
                  scrollEnd={() => this.scrollEnd()}
                  scrollStart={() => this.scrollStart()}
                  markAppointmentDone={(item) => this.markAppointmentDone(item)}
                  showTimingModal={this.state.showTimingModal}
                  topItem={(selectedDate) => this.topItem(selectedDate)}
                  cancelAppointment={(item) => this.cancelAppointment(item)}
                  makePrescription={(item) => this.makePrescription(item)}
                />
              )}
            
            {this.props.screenProps.IsUpdateReq ? (
              <FloatingAction
                iconHeight={45}
                iconWidth={45}
                position={"right"}
                color="transparent"
                floatingIcon={ic_sync_fab}
                buttonSize={38}
                overlayColor="transparent"
                distanceToEdge={{ horizontal: 45, vertical: 155 }}
                // actions={this.props.actions}
                onPressMain={() => this.showModal()}
              />
            ) : null}

            {!Platform.isPad &&
              this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 &&
              this.state.createAppointment &&
              this.props.auth.tooltip == "Others" ? (
              <TouchableOpacity
                onPress={() => {
                  this.moveToIVRFlow();
                }}
                style={{
                  alignSelf: "flex-end",
                  bottom: 30,
                  marginBottom: 36,
                  position: "absolute",
                }}
              >
                <Tooltip
                  topAdjustment={
                    Platform.OS === "android" ? -StatusBar.currentHeight : 0
                  }
                  animated={true}
                  isVisible={this.state.createAppointment}
                  backgroundColor={"rgba(0,0,0,0.5)"}
                  tooltipStyle={{ right: 20, alignItems: "flex-end" }}
                  contentStyle={{ backgroundColor: "#6f6af4", height: "100%" }}
                  content={
                    <TouchableOpacity
                      style={{ backgroundColor: "#6f6af4" }}
                      onPress={() => {
                        this.changeState();
                      }}
                    >
                      <AddPatient
                        imagePath={ic_popup_Add_Button_Icon}
                        title={"Quick Add"}
                        description={
                          "Add new appointments for your patients and include them in the queue.."
                        }
                      />
                    </TouchableOpacity>
                  }
                  //(Must) This is the view displayed in the tooltip
                  placement="top"
                  //(Must) top, bottom, left, right, auto.
                  onClose={() => {
                    this.changeState();
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
            ) : this.props.doctorProfile.DoctorData.ClinicAddresses.length >
              0 ? (

              <TouchableOpacity
                onPress={() => {
                  this.moveToIVRFlow();
                }}
                style={{
                  alignSelf: "flex-end",
                  bottom: 50,
                  right: 5,
                  marginBottom: 36,
                  position: "absolute",
                }}
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
              </TouchableOpacity>
            ) : null}
          </View>

        </View>

        {
          !this.state.isInternetOn ? (
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
          ) : null
        }
      </View >
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  home: state.home,
  appointments: state.appointments,
  createAppointment: state.tooltip.toolTipStatus.createAppointment,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setClinicDetails: (clinic) => dispatch(setClinicDetails(clinic)),
  getAppointmentList: (data) => dispatch(getAppointmentList(data)),
  cancelAppointment: (data) => dispatch(cancelAppointment(data)),
  markAppointmentDone: (data) => dispatch(markAppointmentDone(data)),
  setAppointmentClinic: (data) => dispatch(setAppointmentClinic(data)),
  setPatientId: (data) => dispatch(setPatientId(data)),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  setNotificationFlags: (flag) => dispatch(setNotificationFlags(flag)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppointmentsScreen);

//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
