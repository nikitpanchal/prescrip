//Created by Pritish
//Component to display time slots in operating hours
import React, { Component } from "react";
import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import styles from "./style";
import HeaderData from "../Header/header";
import Images from "../../Theme/Images";
import {
  ic_Orange_BG_578,
  ic_active_dropdown,
  ic_selected_day,
  ic_unselected_day,
  ic_delete_time,
  ic_inactive_dropdown,
  ic_remove_time_row,
  lefticon,
  ic_unavialable,
} from "../../constants/images";
import LinearGradient from "react-native-linear-gradient";
import { color } from "react-native-reanimated";

import Modal from "react-native-modalbox";

import multipleTapHandler from "../../components/MultiTapHandle/index";
import { isEqual } from "lodash";
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
//import daysName from '../../constants/commondata';
import _ from "lodash";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
var moment = require("moment");
var opJson = [
  //SUNDAY
  [
    ["11:30 AM", "05:30 PM", "1130", "1730", 1],
    ["06:00 PM", "09:30 PM", "1800", "2130", 1],
  ],
  //MONDAY
  [
    ["11:00 AM", "12:30 PM", "1100", "1230", 1],
    ["03:00 PM", "05:30 PM", "1500", "1730", 1],
    ["06:30 PM", "09:30 PM", "1830", "2130", 1],
  ],
  //TUESDAY
  [
    ["11:00 AM", "12:30 PM", "1100", "1230", 1],
    ["03:00 PM", "05:30 PM", "1500", "1730", 1],
    ["06:30 PM", "09:30 PM", "1830", "2130", 1],
  ],
  //WEDS
  [
    ["11:30 AM", "05:30 PM", "1130", "1730", 1],
    ["06:00 PM", "09:30 PM", "1800", "2130", 1],
  ],
  //THRUS
  [
    ["11:30 AM", "05:30 PM", "1130", "1730", 1],
    ["06:00 PM", "09:30 PM", "1800", "2130", 1],
  ],
  //FRIDAY
  [
    ["11:30 AM", "05:30 PM", "1130", "1730", 1],
    ["06:00 PM", "09:30 PM", "1800", "2130", 1],
  ],

  //SAT
  [],
];
export default class OperatingHours extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openTimingModel: false,
      arrayTiming: [],
      timeSlots: [],
      selectedDays: [],
      callfrom: "",
      currentIndex: -1,
    };
    this.startTime = "0:00";
    this.endTime = "24:00";
    this.slotInterval = 30;
    this.opSlots = [];
    this.timeSlots = [];
    this.ophours = [];
    this.renderSlots = [];
    this.slotList = React.createRef();
    this.modalTiming = React.createRef();
    this.toast = React.createRef();
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "OperatingHours",
      screen_class: "OperatingHours",
    });
    this.props.navigation.addListener("focus", () => {
      if (this.props.doctorProfile.ClinicAddress.OperationHours) {
        this.createTimeSlots();
      }
    });
  }
  //Pasrse for all days
  parseAllDaysJSON(op_arr) {
    this.opSlots = [];
    this.timeSlots = [];
    this.ophours = [];
    this.renderSlots = [];
    this.ophours = op_arr;
    let selected = this.state.selectedDays;
    this.ophours.forEach((schedule, index) => {
      if (schedule.length >= 0) {
        let day = this.getIndex(schedule);

        //Add days to block days array

        selected = selected.concat(day);

        let slot = {
          days: day,
          slots: schedule,
        };
        if (!this.checkItem(slot)) {
          this.opSlots.push(slot);
          this.renderSlots.push(slot);
        }
      } else {
        let slot = {
          days: [index],
          slots: [],
        };
        this.opSlots.push(slot);
      }
    });

    this.renderSlots.forEach((render, index) => {
      let scheduleDays = [
        {
          index: 1,
          rowIndex: -1,
          day: "Mon",
          full: "Monday",
          added: render.days.indexOf(1) != -1 ? true : false,
        },
        {
          index: 2,
          rowIndex: -1,
          day: "Tue",
          full: "Tuesday",
          added: render.days.indexOf(2) != -1 ? true : false,
        },
        {
          index: 3,
          rowIndex: -1,
          day: "Wed",
          full: "Wednesday",
          added: render.days.indexOf(3) != -1 ? true : false,
        },
        {
          index: 4,
          rowIndex: -1,
          day: "Thu",
          full: "Thursday",
          added: render.days.indexOf(4) != -1 ? true : false,
        },
        {
          index: 5,
          rowIndex: -1,
          day: "Fri",
          full: "Friday",
          added: render.days.indexOf(5) != -1 ? true : false,
        },
        {
          index: 6,
          rowIndex: -1,
          day: "Sat",
          full: "Saturday",
          added: render.days.indexOf(6) != -1 ? true : false,
        },
        {
          index: 0,
          rowIndex: -1,
          day: "Sun",
          full: "Sunday",
          added: false, //render.days.indexOf(0) != -1 ? true : false,
        },
      ];

      let slots = [];
      //  render.slots.forEach((slot)=>{
      //    let times={"from":slot[0],"to":slot[1]}

      //    slots.push(times);
      //  })
      //  let lasttime=slots[slots.length-1].to;
      //  let letindex=this.state.arrayTiming.indexOf(lasttime);
      let item = {
        days: scheduleDays,
        blockIndex: -1,
        slots: [],
      };
      this.timeSlots.push(item);
    });
    //Solts to render
    let temp = new Set(selected);
    selected = Array.from(temp);
    selected = selected.filter((item) => {
      if (item != 0) {
        return item;
      }
    });
    temp = null;

    if (this.timeSlots.length > 0) {
      this.setState({
        timeSlots: this.timeSlots,
        selectedDays: selected,
      });
      selected = null;
    }

    //Solts to render
  }

  //Parse Operating Hours JSON received from props
  parseOpHoursJSON(op_arr) {
    this.opSlots = [];
    this.timeSlots = [];
    this.ophours = [];
    this.renderSlots = [];
    this.ophours = op_arr;
    let selected = this.state.selectedDays;
    this.ophours.forEach((schedule, index) => {
      if (schedule.length > 0) {
        let day = this.getIndex(schedule);

        selected = selected.concat(day);

        let slot = {
          days: day,
          slots: schedule,
        };
        if (!this.checkItem(slot)) {
          this.opSlots.push(slot);
          this.renderSlots.push(slot);
        }
      } else {
        let slot = {
          days: [index],
          slots: [],
        };
        this.opSlots.push(slot);
      }
    });

    this.renderSlots.forEach((render, index) => {
      let scheduleDays = [
        {
          index: 1,
          rowIndex: -1,
          day: "Mon",
          full: "Monday",
          added: render.days.indexOf(1) != -1 ? true : false,
        },
        {
          index: 2,
          rowIndex: -1,
          day: "Tue",
          full: "Tuesday",
          added: render.days.indexOf(2) != -1 ? true : false,
        },
        {
          index: 3,
          rowIndex: -1,
          day: "Wed",
          full: "Wednesday",
          added: render.days.indexOf(3) != -1 ? true : false,
        },
        {
          index: 4,
          rowIndex: -1,
          day: "Thu",
          full: "Thursday",
          added: render.days.indexOf(4) != -1 ? true : false,
        },
        {
          index: 5,
          rowIndex: -1,
          day: "Fri",
          full: "Friday",
          added: render.days.indexOf(5) != -1 ? true : false,
        },
        {
          index: 6,
          rowIndex: -1,
          day: "Sat",
          full: "Saturday",
          added: render.days.indexOf(6) != -1 ? true : false,
        },
        {
          index: 0,
          rowIndex: -1,
          day: "Sun",
          full: "Sunday",
          added: render.days.indexOf(0) != -1 ? true : false,
        },
      ];

      let slots = [];
      render.slots.forEach((slot) => {
        let times = { from: slot[0], to: slot[1] };

        slots.push(times);
      });
      let lasttime = slots[slots.length - 1].to;
      let letindex = this.state.arrayTiming.indexOf(lasttime);
      let item = {
        days: scheduleDays,
        blockIndex: letindex,
        slots: slots,
      };
      this.timeSlots.push(item);
    });

    //Solts to render
    let temp = new Set(selected);
    selected = Array.from(temp);
    temp = null;
    if (this.timeSlots.length > 0) {
      this.setState({
        timeSlots: this.timeSlots,
        selectedDays: selected,
      });
      selected = null;
    } else {
      this.addSchedule();
    }
  }
  getIndex(schedule) {
    let days = this.ophours
      .map((s1, i) => (isEqual(s1, schedule) ? i : -1))
      .filter((index) => index !== -1);
    return days;
  }
  checkItem(check) {
    let index;
    let isValid;
    isValid = this.opSlots.some(function (item, i) {
      return isEqual(check, item) ? ((index = i), true) : false;
    });

    return isValid;
  }
  //Create Time Interval Slots to show in modal
  createTimeSlots() {
    var startTime = moment(this.startTime, "HH:mm");
    var endTime = moment(this.endTime, "HH:mm");
    let times = [];
    while (startTime.isBefore(endTime)) {
      times.push(startTime.format("hh:mm A"));
      startTime = startTime.add(this.slotInterval, "minutes");
    }
    this.setState(
      {
        arrayTiming: times,
      },
      () => {
        let op_arr = this.props.doctorProfile.ClinicAddress.OperationHours;
        if (op_arr.length > 0) {
          this.parseOpHoursJSON(op_arr);
        } else {
          let ophours = [[], [], [], [], [], [], []];
          this.parseAllDaysJSON(ophours);
          //this.addSchedule();
        }
      }
    );
    times = null;
  }
  //Add new schedule
  addSchedule() {
    //Check if day is select for earlier schedule before adding a new one
    if (this.state.timeSlots.length > 0) {
      let prevSlot = this.state.timeSlots[this.state.timeSlots.length - 1];
      let isDaySelected = prevSlot.days.find((day) => {
        if (day.added) {
          return day;
        }
      });
      if (!isDaySelected) {
        this.toast.show(
          <ToastComponent
            {...this.props}
            textColorCode={"#fffefe"}
            imagePath={Images.Info}
            description={
              "Please select a day for previous schedule before adding a new one"
            }
          />,
          1500
        );
        //Alert.alert("Prescrip","Please select a day for previous schedule before adding a new one ");
        return;
      }
    }
    //Ends
    //Add a schedule to list
    let scheduleDays = [
      {
        index: 1,
        rowIndex: -1,
        day: "Mon",
        full: "Monday",
        added: false,
      },
      {
        index: 2,
        rowIndex: -1,
        day: "Tue",
        full: "Tuesday",
        added: false,
      },
      {
        index: 3,
        rowIndex: -1,
        day: "Wed",
        full: "Wednesday",
        added: false,
      },
      {
        index: 4,
        rowIndex: -1,
        day: "Thu",
        full: "Thursday",
        added: false,
      },
      {
        index: 5,
        rowIndex: -1,
        day: "Fri",
        full: "Friday",
        added: false,
      },
      {
        index: 6,
        rowIndex: -1,
        day: "Sat",
        full: "Saturday",
        added: false,
      },
      {
        index: 0,
        rowIndex: -1,
        day: "Sun",
        full: "Sunday",
        added: false,
      },
    ];
    let schedule = this.state.timeSlots;
    let item = {
      days: scheduleDays,
      blockIndex: -1,
      slots: [],
    };
    schedule.push(item);
    this.setState(
      {
        timeSlots: schedule,
      },
      () => {
        scheduleDays = null;
      }
    );
  }

  //Parsing logic
  //Parse Server JSON
  getIndex(schedule) {
    let days = this.ophours
      .map((s1, i) => (isEqual(s1, schedule) ? i : -1))
      .filter((index) => index !== -1);
    return days;
  }
  checkItem(check) {
    let index;
    let isValid;
    isValid = this.opSlots.some(function (item, i) {
      return isEqual(check, item) ? ((index = i), true) : false;
    });

    return isValid;
  }
  parseScheduleJSON() {
    let timeSlots = [];
    this.ophours.forEach((schedule, index) => {
      if (schedule.length > 0) {
        let day = this.getIndex(schedule);
        let slot = {
          days: day,
          slots: schedule,
        };
        if (!this.checkItem(slot)) {
          this.opSlots.push(slot);
        }
      }
    });
  }

  renderTimeSlots(index, item) {
    let slots = [];
    if (item.slots.length > 0) {
      slots = item.slots.map((slot, slot_index) => {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
              <View style={{ alignSelf: "stretch", marginEnd: 10 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "NotoSans",
                      color: "#bbbbbb",
                    }}
                  >
                    Start Time
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.openTimePicker("from", index, item, slot_index);
                  }}
                  style={{
                    borderWidth: 2,
                    borderRadius: 5,
                    padding: 8,
                    borderColor: "#0c9bad",
                    justifyContent: Platform.isPad ? "center" : "space-evenly",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                      color: "#000",
                      fontFamily: "NotoSans-Bold",
                      padding: 10,
                    }}
                  >
                    {slot.from}
                  </Text>
                  <Image
                    source={ic_active_dropdown}
                    resizeMode={"contain"}
                    style={{ width: 20, height: 10, marginEnd: 5 }}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
              <View style={{ alignSelf: "stretch", marginEnd: 10 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "NotoSans",
                      color: "#bbbbbb",
                    }}
                  >
                    Closing Time
                  </Text>
                  {slot_index >= 0 ? (
                    <TouchableOpacity
                      onPress={() => this.deleteTimeSlot(index, slot_index)}
                    >
                      <Image
                        source={ic_delete_time}
                        resizeMode={"contain"}
                        style={{ width: 20, height: 20 }}
                      ></Image>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.openTimePicker("to", index, item, slot_index);
                  }}
                  style={{
                    borderWidth: 2,
                    borderRadius: 5,
                    padding: 8,
                    borderColor: "#0c9bad",
                    alignItems: "center",
                    justifyContent: Platform.isPad ? "center" : "space-evenly",
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                      color: "#000",
                      fontFamily: "NotoSans-Bold",
                      padding: 10,
                    }}
                  >
                    {slot.to}
                  </Text>
                  <Image
                    source={ic_active_dropdown}
                    resizeMode={"contain"}
                    style={{ width: 20, height: 10, marginEnd: 5 }}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      });
      if (
        item.blockIndex < this.state.arrayTiming.length - 2 &&
        item.slots[item.slots.length - 1].to != "" &&
        item.slots[item.slots.length - 1].to != "Select"
      ) {
        let select = this.selectView(index, item);
        slots.push(select);
      }
    } else {
      let select = this.selectView(index, item);
      slots.push(select);
    }

    return slots;
  }
  deleteTimeSlot(row_index, slot_index) {
    let slots = this.state.timeSlots;
    let slot = slots[row_index];
    slot.slots.splice(slot_index, 1);
    slot.blockIndex =
      slot_index == 0
        ? -1
        : this.state.arrayTiming.indexOf(slot.slots[slot.slots.length - 1].to);
    slots[row_index] = slot;
    this.setState({
      timeSlots: slots,
    });
  }

  //Validate time and call to open time modal
  openTimePicker(callfrom, row_index, item, slot_index) {
    //Validate
    let isValid = true;

    if (isValid) {
      this.setState(
        {
          callfrom: callfrom,
          currentIndex: row_index,
          slot_index: slot_index,
          currentItem: item,
        },
        () => {
          this.openTimeModal();
        }
      );
    }
  }
  selectView(index, item) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingTop: 5,
        }}
      >
        <View style={{ flex: 0.5, alignItems: "flex-start" }}>
          <View style={{ alignSelf: "stretch", marginEnd: 10 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "NotoSans",
                  color: "#bbbbbb",
                }}
              >
                Start Time
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.openTimePicker("from", index, item, -1)}
              style={{
                borderWidth: 2,
                borderRadius: 5,
                padding: 8,
                borderColor: "#bbbbbb",
                alignItems: "center",
                justifyContent: Platform.isPad ? "center" : "space-evenly",
                flexDirection: "row",
                marginTop: 5,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 21,
                  color: "#bbbbbb",
                  fontFamily: "NotoSans-Bold",
                  padding: 10,
                }}
              >
                Select
              </Text>
              <Image
                source={ic_inactive_dropdown}
                resizeMode={"contain"}
                style={{ width: 20, height: 10, marginEnd: 5 }}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.5, alignItems: "flex-start" }}>
          <View style={{ alignSelf: "stretch", marginEnd: 10 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "NotoSans",
                  color: "#bbbbbb",
                }}
              >
                Closing Time
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.openTimePicker("to", index, item, -1)}
              style={{
                borderWidth: 2,
                borderRadius: 5,
                padding: 8,
                borderColor: "#bbbbbb",
                alignItems: "center",
                justifyContent: Platform.isPad ? "center" : "space-evenly",
                flexDirection: "row",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 21,
                  color: "#bbbbbb",
                  fontFamily: "NotoSans-Bold",
                  padding: 10,
                }}
              >
                Select
              </Text>
              <Image
                source={ic_inactive_dropdown}
                resizeMode={"contain"}
                style={{ width: 20, height: 10, marginEnd: 5 }}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  blockDay(row_index, item, index, day) {
    let addindex = -1;

    let slots = this.state.timeSlots;
    let days = this.state.selectedDays;
    addindex = days.indexOf(day.index);
    if (addindex > -1 && !day.added) {
      return true;
    } else {
      return false;
    }
  }
  //Select a day
  setDay(row_index, item, index, day) {
    let addindex = -1;

    let slots = this.state.timeSlots;
    let days = this.state.selectedDays;
    addindex = days.indexOf(day.index);
    if (addindex > -1 && !day.added) {
      this.toast.show(
        <ToastComponent
          {...this.props}
          textColorCode={"#fffefe"}
          imagePath={Images.Info}
          description={day.full + " already added to schedule"}
        />,
        1500
      );

      //Alert.alert("Prescrip",day.full+" already added to schedule");
    } else {
      day.added = !day.added;
      item.days[index] = day;

      addindex = days.indexOf(day.index);
      addindex > -1 ? days.splice(addindex, 1) : days.push(day.index);
      addindex = null;
      slots[row_index] = item;

      this.setState({
        timeSlots: slots,
        selectedDays: days,
      });
      days = null;
      slots = null;
    }
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  renderDays(row_index, item) {
    let days = item.days.map((day, index) => {
      return (
        <TouchableOpacity
          disabled={this.blockDay(row_index, item, index, day)}
          onPress={() => this.setDay(row_index, item, index, day)}
          style={{ alignItems: "center" }}
        >
          <Image
            source={
              day.added
                ? ic_selected_day
                : this.blockDay(row_index, item, index, day)
                  ? ic_unavialable
                  : ic_unselected_day
            }
            resizeMode={"contain"}
            style={{ width: 30, height: 30 }}
          ></Image>
          <Text
            style={{
              fontFamily: "NotoSans",
              fontSize: 14,
              color: this.blockDay(row_index, item, index, day)
                ? "#a4a4a4"
                : "#4c4c4c",
            }}
          >
            {day.day}
          </Text>
        </TouchableOpacity>
      );
    });
    return days;
  }

  openTimeModal() {
    setTimeout(() => {
      this.goIndex();
    }, 700);

    this.modalTiming.open();
  }
  onScrollFailed() {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      this.slotList.current?.scrollToIndex({ index: 0, animated: true });
    });
  }
  goIndex = () => {
    let block = 0;
    if (this.state.currentIndex > -1) {
      block = this.state.timeSlots[this.state.currentIndex].blockIndex;
    }
    block = block > 0 ? block : 0;
    this.slotList.current.scrollToIndex({ animated: false, index: block });
    block = 0;
  };

  deepEquals(a, b) {
    if (a instanceof Array && b instanceof Array) return this.arraysEqual(a, b);
    if (
      Object.getPrototypeOf(a) === Object.prototype &&
      Object.getPrototypeOf(b) === Object.prototype
    )
      return objectsEqual(a, b);
    if (a instanceof Map && b instanceof Map) return mapsEqual(a, b);
    if (a instanceof Set && b instanceof Set)
      throw "Error: set equality by hashing not implemented.";
    if (
      (a instanceof ArrayBuffer || ArrayBuffer.isView(a)) &&
      (b instanceof ArrayBuffer || ArrayBuffer.isView(b))
    )
      return typedArraysEqual(a, b);
    return a == b; // see note[1] -- IMPORTANT
  }
  arraysEqual(a, b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++)
      if (!this.deepEquals(a[i], b[i])) return false;
    return true;
  }

  getTimingsString(operationHours) {
    var collectedbindData = [];
    let daysName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    operationHours.forEach(function (itm) {
      var copyArray = [...operationHours];
      for (var i = 0; i < copyArray.length; i++) {
        var ok = _.isEqual(itm, copyArray[i]);
        if (ok) {
          var findDay = daysName[operationHours.indexOf(itm)];

          var checkKey = collectedbindData.find((x) => x.key == findDay);
          var indexRemove = copyArray.indexOf(copyArray[i]);
          var check = collectedbindData.find(
            (x) =>
              x.value.indexOf(
                daysName[operationHours.indexOf(operationHours[indexRemove])]
              ) > -1
          );
          if (!checkKey && !check) {
            collectedbindData.push({
              key: findDay,
              value: [findDay],
              timing:
                operationHours[indexRemove].length > 0
                  ? operationHours[indexRemove].map(function (x) {
                    return x[0] + " - " + x[1];
                  })
                  : "Closed",
            });
          } else if (!check) {
            checkKey.value.push(
              daysName[operationHours.indexOf(operationHours[indexRemove])]
            );
          }
        }
      }
    });
    return collectedbindData;
  }

  createOperatingJSON() {
    let ophours = [[], [], [], [], [], [], []];
    let timeSlots = this.state.timeSlots;
    //Remove empty slots
    timeSlots = timeSlots.filter((time) => {
      return time.slots.length != 0;
    });
    if (timeSlots.length > 0) {
      //Parse
      timeSlots.forEach((schedule) => {
        schedule.days.forEach((day) => {
          if (day.added) {
            let times = [];

            schedule.slots.forEach((slot) => {
              if (slot.from != "Select" && slot.to != "Select") {
                let time = [];
                time.push(slot.from);
                time.push(slot.to);
                let hrsformat = moment(slot.from, "hh:mm A").format("HHmm");
                time.push(parseInt(hrsformat));
                let s_dayslot = this.getTimeOfDay(hrsformat);
                hrsformat = moment(slot.to, "hh:mm A").format("HHmm");
                let e_dayslot = this.getTimeOfDay(hrsformat);
                time.push(parseInt(hrsformat));
                hrsformat = null;
                let daySlot = s_dayslot.concat(
                  e_dayslot.filter((item) => s_dayslot.indexOf(item) < 0)
                );
                if (daySlot[0] == "morning" && daySlot[1] == "evening") {
                  daySlot[1] = "afternoon";
                  daySlot[2] = "evening";
                }

                time.push(1);
                time.push(daySlot);
                times.push(time);

                time = null;
                daySlot = null;
              }
            });
            ophours[day.index] = times;
            times = null;
          }
        });
      });

      let clinicAdress = this.props.doctorProfile.ClinicAddress;
      clinicAdress.OperationHours = ophours;
      let timingStr = '';

      let timearr = this.getTimingsString(clinicAdress.OperationHours);
      let time = '';
      let excludingClosed = timearr.filter(x => x.timing != 'Closed');
      if (excludingClosed.length == 1) {
        if (excludingClosed[0].key == 'Sunday' || excludingClosed[0].key == 'Monday'
          && excludingClosed[0].value.length >= 4) {

          // time = excludingClosed[0].value[0] + ' To ' +
          //   excludingClosed[0].value[excludingClosed[0].value.length - 1] + ' ' + excludingClosed[0].timing.join(', ');
        }
      }
      if (time == '') {
        timearr = timearr.filter(x => x.timing != 'Closed');
        time = timearr.map((x) => this.getToText(x));

      }
      let OpenAndClosingTime = time.toString();
      clinicAdress.OpenAndClosingTime = OpenAndClosingTime;
      this.props.setClinicDetails(clinicAdress);
      ophours = null;
      clinicAdress = null;
      this.props.navigation.navigate("ReviewClinicContainer");
    } else {
      this.toast.show(
        <ToastComponent
          {...this.props}
          textColorCode={"#fffefe"}
          imagePath={Images.Info}
          description={"Please select atleast one time slot to proceed"}
        />,
        1500
      );

      //Alert.alert("Prescrip","Please select atleast one time slot to proceed");
    }
  }
  getToText(data) {
    let weeks = data.value;
    let timings = data.timing;
    let daysName = [
      'Sunday',
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    let done = false;
    if (weeks.length > 1) {
      for (let index = 0; index < weeks.length; index++) {
        let elem = weeks[index];
        let elemNext = weeks[index + 1];
        let prevElem = weeks[index - 1];
        let pos = daysName.findIndex(x => x == elem);
        let posNext = daysName.findIndex(x => x == (elemNext ? elemNext : prevElem));

        if (Math.abs((posNext - pos)) == 1)
          done = true;
        else
          done = false;
      }
    }
    if (!done) {
      return data.value.toString() + ' - ' + data.timing.toString();
    }
    return data.value[0] + ' to ' + data.value[data.value.length - 1] + ' ' + data.timing.toString();

  }
  getTimeOfDay(time) {
    let timeOfDay = [];
    if (time >= 0 && time < 1200) {
      timeOfDay.push("morning");
    }
    if (time >= 1200 && time < 1700) {
      timeOfDay.push("afternoon");
    }
    if (time >= 1700 && time < 2359) {
      timeOfDay.push("evening");
    }
    return timeOfDay;
  }
  UpdateOperationHours() {
    if (this.state.selectedDays.length > 0) {
      this.createOperatingJSON();
    } else {
      this.toast.show(
        <ToastComponent
          {...this.props}
          textColorCode={"#fffefe"}
          imagePath={Images.Info}
          description={"Please add schedule for atleast one day"}
        />,
        1500
      );

      //Alert.alert("Prescrip","Please add schedule for atleast one day");
    }
    //this.parseScheduleJSON();
  }
  setTimeSlot(callform, item, t_index) {
    let currentIndex = this.state.currentIndex;
    let currentItem = this.state.currentItem;
    let slot_index = this.state.slot_index;
    let othercall = callform == "from" ? "to" : "from";

    if (slot_index != -1) {
      let time = currentItem.slots[slot_index];
      time[callform] = item;
      currentItem.slots[slot_index] = time;
    } else {
      let time = {
        [callform]: item,
        [othercall]: "Select",
      };
      currentItem.slots.push(time);
    }
    currentItem.blockIndex = t_index;
    let slots = this.state.timeSlots;
    slots[currentIndex] = currentItem;
    this.setState({ timing: item, timeSlots: slots }, () => {
      this.modalTiming.close();
    });
  }
  renderSlotItem(item, t_index, callfrom) {
    let block = -1;
    if (this.state.currentIndex > -1) {
      block = this.state.timeSlots[this.state.currentIndex].blockIndex;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          t_index > block ? this.setTimeSlot(callfrom, item, t_index) : null;
        }}
      >
        <View
          style={{
            paddingHorizontal: 50,
            borderBottomColor: "#cccccc",
            borderBottomWidth: 1,
            paddingVertical: 10,
            justifyContent: 'center', //Centered vertically
            alignItems: 'center', //Centered horizontally
            flex: 1, flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontSize: 22, paddingTop: 5,
              textAlign: 'center',
              fontFamily: "NotoSans",
              color: t_index > block ? "#000" : "#cdcdcd",
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  BindTiming(callfrom) {
    {
      let block = -1;
      if (this.state.currentIndex > -1) {
        block = this.state.timeSlots[this.state.currentIndex].blockIndex;
      }

      let content = this.state.arrayTiming.map((item, t_index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              t_index > block
                ? this.setTimeSlot(callfrom, item, t_index)
                : null;
            }}
          >
            <View
              style={{
                paddingHorizontal: 50,
                borderBottomColor: "#cccccc",
                borderBottomWidth: 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  height: 50,
                  fontFamily: "NotoSans",
                  color: t_index > block ? "#000" : "#cdcdcd",
                }}
              >
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });

      return content;
    }
  }
  deleteRow(item, index) {
    let selected = this.state.selectedDays;
    item.days.forEach((day) => {
      if (day.added) {
        let del = selected.indexOf(day.index);

        selected.splice(del, 1);
      }
    });

    let slots = this.state.timeSlots.filter((slot) => {
      return slot != item;
    });

    this.setState({
      timeSlots: slots,
      selectedDays: selected,
    });
  }
  renderItem(item, index) {
    return (
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 3,
          flex: 1,
          margin: 10,
          borderRadius: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <View style={{ margin: 10 }}>
          {/*Delete Row*/}
          {index > 0 ? (
            <TouchableOpacity
              onPress={() => this.deleteRow(item, index)}
              style={{ alignItems: "flex-end", paddingBottom: 10 }}
            >
              <Image
                source={ic_remove_time_row}
                resizeMode={"contain"}
                style={{ width: 20, height: 20 }}
              ></Image>
            </TouchableOpacity>
          ) : null}
          {/*Delete Row Ends*/}
          {/*Days view*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            {this.renderDays(index, item)}
          </View>
          {/*Days Ends*/}
          {/*Slot View*/}
          {this.renderTimeSlots(index, item)}
          {/*Slot View Ends*/}
        </View>
      </View>
    );
  }
  listFooterView() {
    return (
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          marginBottom: 20,
          elevation: 3,
          flex: 1,
          margin: 10,
          borderRadius: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <View
          style={{
            width: "100%",
            borderBottomColor: "#cccccc",
            borderBottomWidth: 1,
            alignItems: "center",
            backgroundColor: "#fff",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "NotoSans",
              fontSize: 16,
              color: "#8e8e8e",
              marginTop: 10,
            }}
          >
            I have a different schedule on other days
          </Text>
          <View
            style={{
              borderBottomColor: "#cdcdcd",
              borderBottomWidth: 1,
              width: "100%",

              marginVertical: 10,
            }}
          />
          <TouchableOpacity onPress={() => this.addSchedule()}>
            <Text
              uppercase={true}
              style={{
                textDecorationLine: "underline",
                fontSize: 16,
                color: "#1b7cdb",
                marginBottom: 10,
                fontFamily: "NotoSans-Bold",
              }}
            >
              Add Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const timingPopup = (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: Dimensions.get('window').width,
          backgroundColor: "transparent",
        }}
        backdrop={true}
        ref={(ref) => this.modalTiming = ref}
        backdropPressToClose={true}
        animationType="slide"
        transparent={true}

        //   visible={}
        onRequestClose={() => { }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Timing</Text>

            <View style={{ flex: 1 }}>
              <FlatList
                slotlist={this.slotList}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                data={this.state.arrayTiming}
                ref={this.slotList}
                initialNumToRender={60}
                initialScrollIndex={0}
                onScrollFailed={() => this.onScrollFailed()}
                renderItem={({ item, index }) =>
                  this.renderSlotItem(item, index, this.state.callfrom)
                }
              ></FlatList>
            </View>
          </View>
        </View>
      </Modal>
    );
    return (
      <View style={[styles.container]}>
        {timingPopup}
        <HeaderData
          {...this.props}
          bgImage={ic_Orange_BG_578}
          imagePath={Images.ic_profile_dummy_image}
          title={this.props.doctorProfile.ClinicAddress.ClinicName}
          description={"What's your schedule at this location ?"}
          onGotIt={() => this.onGotIt()}
          leftImage={lefticon}
          rightImage={Images.ic_share_button}
          stepText={"Step 2 of 3"}
          progressBarWidth={0.5}
          type={5}
          leftImageOnClick={() => this.leftImageOnClick()}
        />

        <View style={[styles.curve_view]}>
          <FlatList

            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={this.state.timeSlots}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            extraData={this.state}
            keyExtractor={(item, i) => i.toString()}
            ListFooterComponent={this.listFooterView()}
          />
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            backgroundColor: "#f7f7f7",
            width: Dimensions.get('window').width,
            marginBottom: 20,
            bottom: 0,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, width: "95%", marginBottom: 3 }}
            onPress={() => this.UpdateOperationHours()}
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
                  fontSize: 16,
                  color: "#fff",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/*Blue : '1b7cdb',Green : '29b62f', Red : d9544f*/}
        <Toast
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            width: "90%",
            backgroundColor: "#1b7cdb",
            borderRadius: 15,
          }}
          ref={(ref) => this.toast = ref}

        />
      </View>
    );
  }
}
