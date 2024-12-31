import React, { Component } from "react";
import {
  Text,
  StatusBar,
  View, Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import {
  Black_back,
  SelectedTimeTick,
  Settings_Next_Step_Icon,
  TimeIconSmall,
  ClinicsAndHospitalIcon,
  CalendarAndTimeSmall,
} from "../../constants/images";
import { setOutOfCliniTimeSlotsNew } from "../../actions/settings";
import { connect } from "react-redux";
import moment from "moment";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

export class OutClinicTimeSlotsNew extends Component {
  constructor(props) {
    super(props);
    this.interval = 30; //minutes interval
    this.times = []; // time array
    this.callfrom = this.props.route.params.callFrom;

    //console.log(this.callfrom);
    this.startTime = 0; // start time
    this.ap = [" AM", " PM"];
    this.state = {
      setSelectedTime:
        this.callfrom == "fromTime"
          ? this.props.getSettingsData.clinicTimeSlots[0]
          : this.props.getSettingsData.clinicTimeSlots[1],
      setIndex: -1,
    };
    // AM-PM
  }

  renderTimeSlot() {
    //loop to increment the time and push results in array
    for (var i = 0; this.startTime < 24 * 60; i++) {
      let hh = Math.floor(this.startTime / 60);
      // getting hours of day in 0-24 format
      let mm = this.startTime % 60; // getting minutes of the hour in 0-55 format
      this.times[i] =
        (hh == 0 ? 12 : ("0" + (hh % 12)).slice(-2)) +
        ":" +
        ("0" + mm).slice(-2) +
        this.ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      this.startTime = this.startTime + this.interval;
    }
  }

  setTime(item, index) {
    let arr = this.props.getSettingsData.clinicTimeSlots;
    this.setState({ setSelectedTime: item }, () => {
      if (this.callfrom == "fromTime") {
        arr[0] = item;
        this.props.setOutOfCliniTimeSlotsNew(arr);
      } else {
        arr[1] = item;
        this.props.setOutOfCliniTimeSlotsNew(arr);
      }
      this.props.navigation.pop();
    });
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "SelectTimeSlot",
      screen_class: "OutClinicTimeSlotsNew",
    });
  }
  componentWillMount() {
    this.renderTimeSlot();
  }

  checkTime(time) {
    if (this.callfrom == "toTime") {
      return moment(
        this.props.getSettingsData.clinicTimeSlots[0],
        "hh:mm A"
      ).isBefore(moment(time, "hh:mm A"));
    } else {
      return true;
    }
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
        <SettingsHeader
          {...this.props}
          bgImage={null}
          bgColor={"white"}
          cursorColor={"#0869d8"}
          tintColor={"#0b69d8"}
          subtitle={`Select ${this.callfrom == "fromTime" ? "Start Time" : "End Time"
            } of Out of Clinic`}
          description={this.callfrom == "fromTime" ? "Start Time" : "End Time"}
          titleColor={null}
          descriptionColor={"#3D3D3D"}
          placeholderTextColor={"black"}
          placeTextColor={"black"}
          placeholderTextSize={20}
          leftImage={Black_back}
          rightImageCross={null}
          isSearchBoxShowing={null}
          leftImageOnClick={() => this.props.navigation.pop()}
          rightImageOnClick={null}
        />

        <FlatList
          style={{ flex: 1 }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ justifyContent: "center" }}
          data={this.times}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.setTime(item.toString())}
              disabled={!this.checkTime(item)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 20,
                borderBottomColor: "#eee",
                borderBottomWidth: 1.5,
                paddingHorizontal: 20,
              }}
            >
              {
                <Text
                  style={{
                    fontSize: 16,
                    color: this.checkTime(item) ? "#000" : "#929294",
                  }}
                >
                  {item}
                </Text>
              }
              <Image
                source={
                  this.state.setSelectedTime == item.toString()
                    ? SelectedTimeTick
                    : null
                }
                style={{ resizeMode: "contain", height: 18, width: 18 }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  getSettingsData: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  setOutOfClinicsDateSlots: (data) => dispatch(setOutOfClinicsDateSlots(data)),
  setOutOfCliniTimeSlotsNew: (data) =>
    dispatch(setOutOfCliniTimeSlotsNew(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutClinicTimeSlotsNew);
