import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  BackHandler,
  TouchableOpacity, Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { connect } from "react-redux";
import {
  Black_back,
  SelectedTimeTick,
  Settings_Next_Step_Icon,
  TimeIconSmall,
  ClinicsAndHospitalIcon,
  CalendarAndTimeSmall,
  Toggle_Off,
  Toggle_On,
  ic_close_button,
} from "../../constants/images";
import { Container } from "native-base";
import {
  setOutOfClinicsDateSlots,
  setOutOfCliniTimeSlotsNew,
  setOutOfClinicDateSlotsNew,
  getOutOfClinicData,
  resetSettings,
} from "../../actions/settings";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";

import moment from "moment";
import { Alert } from "react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsAddOutOfClinicNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      fromDate: "",
      callDatePicker: "from",
      toDate: "",
      callFrom: "",
      clinicList: "",
      toggleSwitch: true,
    };
    this.clinicIds = [];
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  handleBackButtonClick() {
    this.props.resetSettings();
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "AddOutOfClinic",
      screen_class: "SettingsAddOutOfClinicNew",
    });
    this.props.navigation.addListener("focus", () => {
      this.setState({
        clinicList: "",
      });
      this.showFilteredClinic();
    });
  }

  handleConfirm = (text) => {
    let date = moment(text).format("ddd, Do MMM YYYY");

    if (this.callFrom == "fromDate") {
      this.setState({ isDatePickerVisible: false }, () => {
        this.setState({ fromDate: date }, () => {
          let arr = this.props.getSettingsData.clinicDateSlots;
          arr[0] = date;
          this.props.setOutOfClinicDateSlotsNew(arr);
        });
      });
    } else {
      this.setState({ isDatePickerVisible: false }, () => {
        this.setState({ toDate: date }, () => {
          let arr = this.props.getSettingsData.clinicDateSlots;
          arr[1] = date;
          this.props.setOutOfClinicDateSlotsNew(arr);
        });
      });
    }
  };

  showFilteredClinic = () => {
    let arr = [];
    let clinicIdArr = [];
    this.props.getSettingsData.clinicList.map((item) => {
      if (item.clinicselected) {
        arr.push(item.ClinicName);
        clinicIdArr.push(item.ClinicId);
        this.clinicIds = clinicIdArr;
        this.setState({ clinicList: arr, callDatePicker: "from" });
      }
    });
  };
  leftImageOnClick() {
    this.props.resetSettings();
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
    return true;
  }

  getTimeValue(data) {
    if (this.state.toggleSwitch) {
      return 0;
    } else if (data) {
      return parseInt(
        moment(this.props.getSettingsData.clinicTimeSlots[0], "hh:mm A").format(
          "HHmm"
        )
      );
    } else {
      return 0;
    }
  }

  saveData() {
    try {
      let startTime = parseInt(
        this.state.toggleSwitch
          ? 0
          : moment(
            this.props.getSettingsData.clinicTimeSlots[0],
            "hh:mm A"
          ).format("HHmm")
      );
      let endTime = this.state.toggleSwitch
        ? 0
        : parseInt(
          moment(
            this.props.getSettingsData.clinicTimeSlots[1],
            "hh:mm A"
          ).format("HHmm")
        );
      if (
        this.state.fromDate == "" ||
        this.state.toDate == "" ||
        this.clinicIds.length == 0 ||
        isNaN(startTime) ||
        isNaN(endTime)
      ) {
        Alert.alert("Prescrip", "All fields required");
        //  Alert.alert('Prescrip', 'All files are required');
        return;
      }
      let data = {
        away: [
          moment(this.state.fromDate, "ddd, Do MMM, YYYY ").format(
            `YYYY-MM-DD`
          ),
          moment(this.state.toDate, "ddd, Do MMM, YYYY ").format(`YYYY-MM-DD`),
          startTime,
          endTime,
        ],
        clinicId: this.clinicIds,
        doctorId: this.props.doctorProfile.DoctorData._id,
      };
      this.props.getOutOfClinicData(data).then((res) => {
        if (res.payload.data.Status === 1) {
          //console.log(res.payload.data);
          this.props.navigation.pop();
          this.props.resetSettings();
        } else {
          Alert.alert("Prescrip", res.payload.data.msg);
        }
      });
    } catch (error) {
      //(error);
    }
  }

  getMinimumDate(date) {
    if (this.state.fromDate) {
      let minDate = moment(date, "ddd, Do MMM, YYYY ").format("YYYY-MM-DD");

      return minDate;
    }
  }

  getmaximumDate(date) {
    let maxDate = moment(date, "ddd, Do MMM, YYYY ").format("YYYY-MM-DD");

    return maxDate;
  }
  onNavigate() {
    if (this.props.getSettingsData.clinicTimeSlots[0]) {
      this.props.navigation.push("OutClinicTimeSlotsNew", {
        callFrom: "toTime",
      });
    } else {
      Alert.alert("Prescrip", "Please Select Start time first!", [
        {
          text: "OK",
          style: "cancel",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    }
  }
  setToDate() {
    if (this.state.fromDate) {
      this.setState(
        {
          isDatePickerVisible: !this.state.isDatePickerVisible,
          callDatePicker: "to",
        },
        () => {
          this.callFrom = "toDate";
        }
      );
    } else {
      Alert.alert("Prescrip", "Please Select Start Date first!", [
        {
          text: "OK",
          style: "cancel",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    }
  }
  checkDateValid() {
    if (this.state.fromDate) {
      let arr = [];
      this.props.setOutOfClinicDateSlotsNew(arr);
      this.setState({ fromDate: "", toDate: "" });
    }
    this.setState(
      {
        isDatePickerVisible: !this.state.isDatePickerVisible,
        callDatePicker: "from",
      },
      () => {
        this.callFrom = "fromDate";
      }
    );
  }

  checkTimeValid() {
    if (this.props.getSettingsData.clinicTimeSlots[0]) {
      let arr = [];
      this.props.setOutOfCliniTimeSlotsNew(arr);
    }
    this.props.navigation.push("OutClinicTimeSlotsNew", {
      callFrom: "fromTime",
    });
  }
  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ flex: 1, backgroundColor: "#fafafa" , width: Dimensions.get('window').width}}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            description={"Out of Clinic"}
            titleColor={null}
            leftImgWidth={20}
            leftImgHeight={20}
            rightImgWidth={28}
            rightImgHeight={28}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"black"}
            placeTextColor={"black"}
            placeholderTextSize={20}
            leftImage={ic_close_button}
            rightImage={SelectedTimeTick}
            rightImageCross={null}
            isSearchBoxShowing={null}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={() => this.saveData()}
          />

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SelectClinicHospital")
            }
            style={{
              flexDirection: "row",
              borderBottomColor: "#eee",
              borderBottomWidth: 1.8,
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={ClinicsAndHospitalIcon}
                style={{ resizeMode: "contain", height: 20, width: 20 }}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#636363",
                  fontFamily: "NotoSans",
                }}
              >
                Clinic and Hospital
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "NotoSans",
                  color: "#929294",
                }}
              >
                {this.state.clinicList
                  ? this.state.clinicList.length >= 2
                    ? this.state.clinicList[0] +
                    ", +" +
                    (this.state.clinicList.length - 1) +
                    " more..."
                    : this.state.clinicList[0]
                  : "Select"}
              </Text>
            </View>
            <View
              style={{
                flex: 0.15,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Image
                source={Settings_Next_Step_Icon}
                style={{ resizeMode: "contain", height: 20, width: 20 }}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#eee",
              borderBottomWidth: 1.8,
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flex: 0.15,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              <Image
                source={CalendarAndTimeSmall}
                style={{
                  resizeMode: "contain",
                  height: 20,
                  width: 20,
                }}
              />
            </View>
            <View
              style={{
                flex: 0.85,
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "NotoSans",
                    color: "#929294",
                  }}
                >
                  From
                </Text>
                <TouchableOpacity onPress={() => this.checkDateValid()}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "NotoSans",
                      color: this.state.fromDate ? "#1c1c1c" : "#929294",
                    }}
                  >
                    {this.state.fromDate ? this.state.fromDate : "Select"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "NotoSans",
                    color: "#929294",
                  }}
                >
                  To
                </Text>
                <TouchableOpacity onPress={() => this.setToDate()}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: this.state.toDate ? "#1c1c1c" : "#929294",
                    }}
                  >
                    {this.state.toDate ? this.state.toDate : "Select"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={{flex: 0.5, flexDirection: 'row'}}>
                <View style={{flex: 0.6}}>
                  <Text style={{fontSize: 20}}>From</Text>
                </View>
                <View style={{flex: 0.5}}>
                  <Text style={{fontSize: 18, color: '#1c1c1c'}}>
                    Fri, 20th may 2021
                  </Text>
                </View>
              </View> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#eee",
              borderBottomWidth: 1.8,
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flex: 0.15,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              <Image
                source={TimeIconSmall}
                style={{
                  resizeMode: "contain",
                  height: 20,
                  width: 20,
                }}
              />
            </View>
            <View
              style={{
                flex: 0.85,
                paddingRight: 10,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({ toggleSwitch: !this.state.toggleSwitch })
                }
              >
                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "NotoSans",
                      color: "#1c1c1c",
                    }}
                  >
                    All Day
                  </Text>
                  <Image
                    source={this.state.toggleSwitch ? Toggle_On : Toggle_Off}
                    style={{ resizeMode: "contain", height: 30, width: 30 }}
                  />
                </View>
              </TouchableWithoutFeedback>
              {!this.state.toggleSwitch ? (
                <TouchableOpacity
                  onPress={() => this.checkTimeValid()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "NotoSans",
                      color: "#929294",
                    }}
                  >
                    From
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "NotoSans",
                      color: this.props.getSettingsData.clinicTimeSlots[0]
                        ? "#1c1c1c"
                        : "#929294",
                    }}
                  >
                    {this.props.getSettingsData.clinicTimeSlots[0]
                      ? this.props.getSettingsData.clinicTimeSlots[0]
                      : "Select"}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {!this.state.toggleSwitch ? (
                <TouchableOpacity
                  onPress={() => this.onNavigate()}
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "NotoSans",
                      color: "#929294",
                    }}
                  >
                    To
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "NotoSans",
                      color: this.props.getSettingsData.clinicTimeSlots[1]
                        ? "#1c1c1c"
                        : "#929294",
                    }}
                  >
                    {" "}
                    {this.props.getSettingsData.clinicTimeSlots[1]
                      ? this.props.getSettingsData.clinicTimeSlots[1]
                      : "Select"}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            date={
              this.state.callDatePicker == "to"
                ? new Date(this.getMinimumDate(this.state.fromDate))
                : new Date()
            }
            minimumDate={
              this.state.callDatePicker == "to"
                ? new Date(this.getMinimumDate(this.state.fromDate))
                : new Date()
            }
            maximumDate={
              this.state.callDatePicker == "from" && this.state.toDate
                ? new Date(this.getmaximumDate(this.state.toDate))
                : null
            }
            onConfirm={this.handleConfirm}
            onCancel={() => this.setState({ isDatePickerVisible: false })}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  getSettingsData: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  resetSettings: () => dispatch(resetSettings()),
  setOutOfClinicsDateSlots: (data) => dispatch(setOutOfClinicsDateSlots(data)),
  setOutOfCliniTimeSlotsNew: (data) =>
    dispatch(setOutOfCliniTimeSlotsNew(data)),
  setOutOfClinicDateSlotsNew: (data) =>
    dispatch(setOutOfClinicDateSlotsNew(data)),

  getOutOfClinicData: (data) => dispatch(getOutOfClinicData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsAddOutOfClinicNew);
