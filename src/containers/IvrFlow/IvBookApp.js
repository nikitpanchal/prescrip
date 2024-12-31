import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  StatusBar,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  ScrollView,
  FlatList,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator, Dimensions
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import { Container } from "native-base";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { withDb } from "../../DatabaseContext/withDatabase";
import {
  ic_save_button,
  ic_close_button,
  ic_Close_Button,
  Checkbox_Orange,
  Uncheckbox_Orange,
  appintement_date,
  appintement_time,
} from "../../constants/images";
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
} from "../../actions/attachment";
import { get_suggestions } from "../../actions";

import { setSuggestionData } from "../../actions/patientVisit";

import {
  get_appontment_timeslots,
  book_appointment_app,
} from "../../actions/appointments";
import HeaderTypeOne from "../../components/Header/HeaderTypeOne";
import CButton from "../../components/CommonComponents/CButton";
import CFlatListItem from "../../components/CommonComponents/CFlatListItem";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";
import {
  ic_calendar_icon,
  ic_clock,
  ic_Diagnosis,
  ic_Findings,
  ic_Investigations,
  SuggestLab_Pink_btn,
} from "../../constants/images";
import PrescriptionLoader from "../../components/Loading/prescriptionLoader";

let awayTimeDates = [];
class AdditionalAssessmentContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      loading: false,
      timeSlots: [],
      appointmentOld: [],
      isDatePickerVisible: false,
      AvailableTimeSlots: [],
      slotIdRange: [],
      slotIdRangeFinal: "",
      BookTimeSlots: [],
      NotAvailableTimeSlots: [],
      selectedDate: "Please Select Date",
      slotId: "",
      isOpenDateSlot: false,
      clinicAdd: "",
      contact: "",
      navLink: "",
      isWalkIn: false,
      selectedTiming: "Please Select Timing",
      numberValue: "",
      isOpenTimingSlot: false,
      isClickedReport: false,

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
      ],
    };
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "IVRBookAppointment",
      screen_class: "IVRBooKApp",
    });
    this.getDoctorDetails();
  }

  getDoctorDetails() {
    //this.props.doctorProfile.DoctorData._id,

    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      clinicId: this.props.appointments.clinicId,
    };

    this.props.get_appontment_timeslots(data).then((payload) => {
      var data = payload.payload.data;
      if (data.status == 0)
        this.setState({ invalid: true, loading: false, isRefresh: true });
      else if (data.status == 1) {
        let _thisAway = data.away;
        let timeSlots = data.timeSlots;

        if (data.timeSlots.length > 0) {
          if (data.away.length > 0) {
            var allDay = data.away.filter((a) => a[2] == 0 && a[3] == 0);
            // var timeBased = data.away.filter(a => a[2] != 0 && a[3] != 0);
            //Changed by nikit sir 1 July2 021
            var timeBased = data.away.filter((a) => a[3] != 0);

            allDay.forEach(function (_thisAway) {
              var startTime = new Date(_thisAway[0]).setHours(5, 30, 0);
              var endTime = new Date(_thisAway[1]).setHours(5, 30, 0);

              timeSlots = timeSlots.filter(function (x) {
                if (x.dateTimeSpan >= startTime && x.dateTimeSpan <= endTime)
                  return null;
                else return x;
              });
            });

            // console.log("timeslots :" + JSON.stringify(timeSlots));

            timeBased.forEach(function (_thisAway) {
              var startTime = new Date(_thisAway[0]).setHours(5, 30, 0);
              var endTime = new Date(_thisAway[1]).setHours(5, 30, 0);

              awayTimeDates = awayTimeDates.concat(
                timeSlots
                  .map(function (x) {
                    if (
                      x.dateTimeSpan >= startTime &&
                      x.dateTimeSpan <= endTime
                    )
                      return {
                        date: x.date,
                        st: _thisAway[2],
                        et: _thisAway[3],
                      };
                    else return null;
                  })
                  .filter((u) => u)
              );
            });
            // console.log("awayTimeDates :" + JSON.stringify(awayTimeDates));
          } else {
            timeSlots = data.timeSlots;
          }
          //bindDateDdl(timeSlots.map(x => x.date));
        }

        this.setState({
          timeSlots: timeSlots,
          appointmentOld: data.appointmentOld,
          clinicAdd: data.clinicObject.clinicAdd,
          contact: data.clinicObject.contact,
          navLink: data.clinicObject.navLink,
        });
      }
    });
  }
  componentWillMount() {
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
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }

  onPopClickTime(value, numberValue) {
    if (this.state.selectedDate != "Please Select Date" || this.state.isWalkIn) {
      if (
        this.state.AvailableTimeSlots.length > 0 &&
        this.BindTimingForCount() > 0
      ) {
        if (value == "") {
          this.setState({
            isOpenTimingSlot: !this.state.isOpenTimingSlot,
          });
        } else {
          let slotIdRangeFinal = "";
          this.state.slotIdRange.forEach(function (item, i) {
            if (numberValue >= item.range[0] && numberValue <= item.range[1]) {
              slotIdRangeFinal = item.sid;
            }
          });
          this.setState({
            selectedTiming: value,
            numberValue: numberValue,
            slotIdRangeFinal: slotIdRangeFinal,
            isOpenTimingSlot: !this.state.isOpenTimingSlot,
          });
        }
      } else {
        Alert.alert("Prescrip", "Time slots is not available for this date!");

        //   Alert.alert("Time slot is not available")
      }
    } else {
      Alert.alert("Prescrip", "Please select date first!");
    }
  }

  onPopClick(value) {

    if (value == "") {
      this.setState({
        isOpenDateSlot: !this.state.isOpenDateSlot,
      });
    } else {
      var getoldApp = this.state.appointmentOld
        .filter((x) => x[1] == value.date)
        .map((t) => t[0]);
      var newDate = new Date(value.date),
        isTodayDate =
          newDate.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);

      value.BookTimeSlots.push(...getoldApp);
      var newSet = [...new Set(value.BookTimeSlots)];
      newSet.sort(function (a, b) {
        return a > b ? 1 : -1;
      });
      value.BookTimeSlots = newSet;

      var findAwayDate = awayTimeDates.find((ad) => ad.date == value.date);
      if (findAwayDate) {
        // if (findAwayDate.st > 0 && findAwayDate.et > 0) {
        // if (findAwayDate.et > 0) {
        value.AvailableTimeSlots = value.AvailableTimeSlots.filter(function (
          x
        ) {
          if (
            parseInt(x) >= findAwayDate.st &&
            parseInt(x) <= findAwayDate.et
          ) {
            // if (parseInt(x) <= findAwayDate.et) {
            return null;
          } else return x;
        });
        // }
      }

      this.setState({
        selectedDate: value.date,
        isOpenDateSlot: !this.state.isOpenDateSlot,
        AvailableTimeSlots: value.AvailableTimeSlots,
        slotIdRange: value.slotIdRange,
        NotAvailableTimeSlots: value.NotAvailableTimeSlots
          ? value.NotAvailableTimeSlots
          : [],
        BookTimeSlots: value.BookTimeSlots,
        selectedTiming: !this.state.isWalkIn ? "Please Select Timing" : "Walk In",
        numberValue: !this.state.isWalkIn ? "" : 0,
        slotId: value.slotId,
      });
    }
  }

  checking(dateCheck, t_index) {
    let date = moment(dateCheck.date).format("DD-MM-YYYY");
    return (
      <View
        style={{
          flexDirection: "column",
          borderBottomWidth: 1,
          borderBottomColor: "#f4f4f4",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.onPopClick(dateCheck);
          }}
        >
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 10,
                width: "85%",
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: "black",
                  fontSize: 15,
                  flexWrap: "wrap",
                }}
              >
                {date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  addCustomDateOPener() {

    return (
      <View
        style={{
          flexDirection: "column",
          borderBottomWidth: 1,
          borderBottomColor: "#f4f4f4",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.toggleDatePicker(true)
          }}
        >
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 10,
                width: "85%",
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: "black",
                  fontSize: 15,
                  flexWrap: "wrap",
                }}
              >
                Custom Date
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  getFormatedTime(n) {
    if (n < 1000) {
      return "0" + n.toString();
    } else {
      return n.toString();
    }
  }

  checkingTiming(dateCheck, isInBookTimeSlots, isInNotAvailableTimeSlots) {
    let dateString = this.getFormatedTime(dateCheck);
    return (
      <View
        style={{
          flexDirection: "column",
          borderBottomWidth: 1,
          borderBottomColor: "#f4f4f4",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            isInBookTimeSlots || isInNotAvailableTimeSlots
              ? null
              : this.onPopClickTime(
                moment(dateString, "HHmm").format("hh:mm A"),
                dateCheck
              );
          }}
        >
          <View
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 10,
                width: "85%",
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color:
                    isInBookTimeSlots || isInNotAvailableTimeSlots
                      ? "gray"
                      : "black",
                  fontSize: 15,
                  flexWrap: "wrap",
                }}
              >
                {moment(dateString, "HHmm").format("hh:mm A")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  BindDate() {
    let content = [];
    content.push(this.addCustomDateOPener())
    let datesSLots = this.state.timeSlots.map((item, t_index) => {
      return this.checking(item, t_index);
    });
    content.push(datesSLots);
    return content;
  }

  BindTiming() {
    let content = this.state.AvailableTimeSlots.map((item, t_index) => {
      let isInBookTimeSlots = this.state.BookTimeSlots.includes(item);

      let isInNotAvailableTimeSlots =
        this.state.NotAvailableTimeSlots.includes(item);

      if (!isInBookTimeSlots) {
        return this.checkingTiming(
          item,
          isInBookTimeSlots,
          isInNotAvailableTimeSlots
        );
      } else {
        return null;
      }
    });

    return content;
  }
  BindTimingForCount() {
    let countOfSlots = 0;
    let content = this.state.AvailableTimeSlots.map((item, t_index) => {
      let isInBookTimeSlots = this.state.BookTimeSlots.includes(item);

      countOfSlots = isInBookTimeSlots ? countOfSlots : countOfSlots + 1;
    });

    return countOfSlots;
  }
  setCheckBox() {
    if(!this.state.isCustom)
    this.setState({
      isWalkIn: !this.state.isWalkIn,
      selectedTiming: "Walk In",
      numberValue: 0
    });
  }
  bookAppo() {
    let { itemData } = this.props.route.params;

    const { doctorProfile, patientname } = this.props;
    if (
      this.state.selectedDate == "Please Select Date" ||
      this.state.selectedTiming == "Please Select Timing" ||
      this.state.slotId == "" ||
      this.state.numberValue === ""  
    ) {
      Alert.alert("Prescrip", "Please Select Date And Timing");
    } else {
      //  this.setState({ loading: true });

      let finaldata = {
        doctorId: doctorProfile.DoctorData._id,
        mobile: itemData.Mobile,
        gender: itemData.Gender,
        countryCode: itemData.CountryCode ? itemData.CountryCode : "+91",
        whatsapp: itemData.WhatsApp ? itemData.WhatsApp : "",
        dob: itemData.DOB,
        patient_Id: itemData._id,
        patientId: itemData.Cid,
        fullName: itemData.FullName,

        appointmentDate: this.state.selectedDate,
        appointmentTime: this.state.isWalkIn ? 'Walk In' : this.state.selectedTiming,
        doctorName:
          doctorProfile.DoctorData.DoctorFName +
          " " +
          doctorProfile.DoctorData.DoctorLName,
        clinicId: this.props.appointments.clinicId,
        clinicName: this.props.appointments.ClinicName,
        clinicAddress: this.props.appointments.Address,
        slotId: this.state.slotIdRangeFinal,
        appointmentTimeNumeric: this.state.isWalkIn ? 0 : this.state.numberValue,
        clinicAdd: this.state.clinicAdd,
        contact: this.state.contact,
        navLink: this.state.navLink,
        visitReason: "",
        isWalkIn: this.state.isWalkIn
      };

      // this.props.navigation.navigate('IvSuccess', { finalData: data })
      //  return;
 
      this.props.book_appointment_app(finaldata).then((payload) => {
        var data = payload.payload.data;

        if (data.status == 0) {
          Alert.alert("Prescrip", data.msg);

          this.setState({ invalid: true, loading: false, isRefresh: true });
        } else if (data.status == 1) {
          // analytics
          logAnalytics(
            this.props.doctorProfile.DoctorData._id,
            this.props.doctorProfile.DoctorData.DoctorFName +
            " " +
            this.props.doctorProfile.DoctorData.DoctorLName,
            "confirmed_inclinic_appointment"
          );
          this.setState({ invalid: true, loading: false, isRefresh: true });

          this.props.navigation.navigate("IvSuccess", { finalData: finaldata });
        }
      });
    }
  }
  toggleDatePicker(show) {
   
    this.setState({
      isDatePickerVisible: show,
      isOpenDateSlot: false
    });
  }
  cancelDatePicker() {
    this.setState({
      isDatePickerVisible: false,
      isOpenDateSlot: false
    });
  }
  setDate = (date) => {
    let selectedDate = new Date(date).toISOString();
    this.setState({
      selectedDate: selectedDate,
      isDatePickerVisible: false,
      isOpenDateSlot: false,
      isWalkIn: true,
      numberValue: 0,
      slotId: null,
      selectedTiming: "Walk In",
      isCustom : true
    });



  };
  render() {
    const datePopup = (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
        backdrop={true}
        backdropPressToClose={false}
        animationType="slide"
        transparent={true}
        ref={"modalDate"}
        visible={this.state.isOpenDateSlot}
        onRequestClose={() => { }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              // padding: 20,
              alignItems: "center",
              width: "90%",

              flex: 0.7,
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
            <TouchableOpacity
              onPress={() => {
                this.onPopClick("");
              }}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: -10,
                right: -11,
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
            <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ededed",
                  flexDirection: "row",
                  paddingVertical: 15,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    paddingStart: 25,
                    fontFamily: "NotoSans-Bold",
                    color: "#3c3c3c",
                    fontSize: 22,
                    flex: 1,
                  }}
                >
                  {"Select Date"}
                </Text>
              </View>

              <View style={{ width: "100%", flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.BindDate()}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );

    const timingPopup = (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
        backdrop={true}
        backdropPressToClose={false}
        animationType="slide"
        transparent={true}
        ref={"modalTiming"}
        visible={this.state.isOpenTimingSlot}
        onRequestClose={() => { }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.onPopClickTime("");
            }}
            style={{
              alignSelf: "flex-end",
              marginRight: Platform.isPad ? 30 : 9,
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

          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              // padding: 20,
              alignItems: "center",
              width: "90%",

              flex: 0.7,
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
            <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ededed",
                  flexDirection: "row",
                  paddingVertical: 15,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    paddingStart: 25,
                    fontFamily: "NotoSans-Bold",
                    color: "#3c3c3c",
                    fontSize: 22,
                    flex: 1,
                  }}
                >
                  {"Select Timing"}
                </Text>
              </View>

              <View style={{ width: "100%", flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.BindTiming()}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
    return (

      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        {this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: "100%",
              width: "100%",
              position: "absolute",
            }}
          >
            <PrescriptionLoader {...this.props} type={"Saving Appointment"} />
          </View>
        ) : null}

        {datePopup}
        {timingPopup}

        <HeaderTypeOne
          navigation={this.props.navigation}
          label={"Select Time and Date"}
          subtext={
            "SET AN APPOINTMENT FOR " +
            this.props.route.params.itemData.FullName
          }
          textColor={"#d56a6e"}
        />

        <View style={{ flex: 0.9, marginHorizontal: 10, width: Dimensions.get('screen').width * 95 / 100 }}>
          <Text style={[styles.txt1, { marginTop: 30 }]}>{" Date"}</Text>

          <TouchableOpacity
            style={styles.cont}
            onPress={() => {
              this.onPopClick("");
            }}
          >
            <Text style={{ fontSize: 22, color: "#2d2f2e" }}>
              {this.state.selectedDate == "Please Select Date"
                ? this.state.selectedDate
                : moment(this.state.selectedDate).format("DD-MM-YYYY")}
            </Text>

            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => {
                this.onPopClick("");
              }}
            >
              <Image
                source={appintement_date}
                resizeMode={"contain"}
                style={{
                  height: 22,
                  width: 22,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <Text style={[styles.txt1, { marginTop: 20 }]}>{" Time"}</Text>

          <TouchableOpacity
            style={styles.cont}
            onPress={() => {
              !this.state.isWalkIn ? this.onPopClickTime("") : null;
            }}
          >
            <Text style={{ fontSize: 22, color: "#2d2f2e" }}>
              {this.state.selectedTiming}
            </Text>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => {
                !this.state.isWalkIn ? this.onPopClickTime("") : null;
              }}
            >
              <Image
                source={appintement_time}
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={[styles.txt1, { marginTop: 20 }]}>{"Please tick if the Patient is Walk in"}</Text>
          <TouchableOpacity onPress={() => this.setCheckBox()} style={{ flex: 1, flexDirection: 'column', marginTop: 10 }}>



            <View style={{ marginLeft: 5, flexDirection: 'row' }}>
              <Image source={!this.state.isWalkIn ? Uncheckbox_Orange : Checkbox_Orange}
                style={{ resizeMode: 'contain', height: 25, width: 35 }} />
              <Text style={{ color: '#2d2f2e', fontSize: 18 }} >Walk-In </Text>

            </View>

          </TouchableOpacity>
          <View style={{ flex: 0.1 }}>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => this.bookAppo()}
            >
              <LinearGradient
                colors={["#ea5e60", "#f38b4e"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.8]}
                style={styles.linear_gradient_btn_style}
              >
                <Text style={styles.linear_gradient_text_style}>
                  {"PROCEED "}
                </Text>
                {this.state.loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.setDate}
          date={
            this.state.selectedDate != 'Please Select Date' ?
              new Date(this.state.selectedDate) : new Date()
          }
          minimumDate={new Date()}
          onCancel={this.cancelDatePicker.bind(this)}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientname: state.patientvisit.patientDetails,
  appointments: state.appointments,
  patientProfile: state.patientProfile,
});

const mapDispatchToProps = (dispatch) => ({
  get_appontment_timeslots: (data) => dispatch(get_appontment_timeslots(data)),
  book_appointment_app: (data) => dispatch(book_appointment_app(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AdditionalAssessmentContainer));

const styles = StyleSheet.create({
  flat: { flex: 1, flexGrow: 1, paddingHorizontal: 15, paddingVertical: 16 },
  cflatlistitem: { marginVertical: 5 },
  btn_container: { flex: 0.1, justifyContent: "center" },
  linear_gradient_btn_style: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 25,
  },
  linear_gradient_text_style: {
    textAlign: "center",
    fontSize: 17,
    color: "#ffffff",
    fontFamily: "NotoSans-Bold",
    marginEnd: 5,
  },

  cont: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#d8dadc",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 5,
    margin: 10,
  },
  txt1: {
    color: "#9a9c9e",
    fontSize: 15,
    marginLeft: 5,
    fontFamily: "NotoSans",
    alignItems: "flex-start",
  },
});
