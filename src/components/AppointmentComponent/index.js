//code by ravi

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  Linking,
  BackHandler,
  Alert,
} from "react-native";
import { calculateAge, Difference_In_Days } from "../../commonmethods/common";
import {
  ic_clock,
  Profile_Image,
  ic_Add_Prescription,
  ic_Contact,
  ic_Mark_as_done,
  ic_Cancel_Appoointment,
  ic_Patient_Image,
  ic_whatsapp,
} from "../../constants/images";

import { ic_Close_Button } from "../../constants/images";
import { weekdays, monthFull } from "../../commonmethods/validation";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";
import Toast, { DURATION } from "react-native-easy-toast";
import multipleTapHandler from "../../components/MultiTapHandle/index";

export default class AppointmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.DataAppointment = this.props.data;
    this.state = {
      selectedIndex: {},
      showModal: false,
      ContactDetails: [],
      description: "",
      showToast: false,
    };

    this._handleBackPress = this._handleBackPress.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  _handleBackPress() {
    if (this.state.showModal) {
      this.setState({
        showModal: false,
      });
    }
  }

  GetSectionListItem = (item) => {
    //Function for click on an item
  };
  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{ height: 0.0, width: "100%" }} />
    );
  };

  connectPhoneCall(phoneNumber) {
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
    this.setState({
      showModal: false,
    });
  }
  connectWhats(number) {
    var waNum = number;
    if (number.length == 10)
      waNum = number;
    Linking.openURL("whatsapp://send?phone=" + waNum);
    this.setState({
      showModal: false,
    });
  }
  makePrescription() {
    this.setState({
      showToast: true,
      description: "To be integrated later",
    });

    setTimeout(() => {
      this.setState({
        showToast: false,
      });
    }, 2000);
  }
  markAsDone(item) {
    Alert.alert(
      "Prescrip",
      "Do you want to mark this appointment as done? The appointment will be archived and no longer available in list.",
      [
        {
          text: "CANCEL",
          onPress: () => {
            this.setState({
              showModal: false,
            });
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({
              selectedIndex: 0,
            });
            this.props.markAppointmentDone(item);
            this.setState({
              showModal: false,
            });
          },
        },
      ]
    );
  }
  cancelAppointment(item) {
    Alert.alert(
      "Prescrip",
      "Do you want to cancel this appointment? The appointment will be archived and no longer available in list.",
      [
        {
          text: "CANCEL",
          onPress: () => {
            this.setState({
              showModal: false,
            });
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({
              selectedIndex: 0,
            });
            this.props.cancelAppointment(item);
            this.setState({
              showModal: false,
            });
          },
        },
      ]
    );
  }

  moveToSection(index, selectedDate) {
    this.sectionList.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: index,
      viewOffset: 0,
    });
    this.props.topItem(selectedDate);
  }

  showModal(data) {
    this.setState({
      selectedIndex: data,
      showModal: true,
      age: calculateAge(data.PatientDob, false),
      ContactDetails: [
        {
          id: "1",
          name: this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
            this.props.doctorProfile.DoctorData.RoleId != 1 ? "Add Prescription" : "View Patient",
          des: data,
          colorCode: "#000000",
          imagePath: ic_Add_Prescription,
          ConsultationId: data._id,
          PatientCid: data.PatientCid,
        },
        {
          id: "2",
          name: "Contact via Call",
          des: data.CountryCode ? data.CountryCode + data.From : '+91' + data.From,
          colorCode: "#0065d7",
          imagePath: ic_Contact,
          ConsultationId: data._id,
          PatientCid: data.PatientCid,
        },
        {
          id: "3",
          name: "Contact via Whatsapp",
          des: data.PatientWhatsapp ? data.PatientWhatsapp : (
            data.CountryCode ? data.CountryCode + data.From : '+91' + data.From),
          colorCode: "#0065d7",
          imagePath: ic_whatsapp,
          ConsultationId: data._id,
          PatientCid: data.PatientCid,
        },
        {
          id: "4",
          name: "Cancel Appointment",
          des: data,
          colorCode: "#e6342e",
          imagePath: ic_Cancel_Appoointment,
          ConsultationId: data._id,
          PatientCid: data.PatientCid,
        },
      ],
    });
  }

  handleScroll = (event) => {
    let index = Math.ceil(event.nativeEvent.contentOffset.y / 70);

    this.props.topItem(index);
  };

  renderItem(data, index) {
    let age = calculateAge(data.PatientDob, false);
    return (
      <TouchableOpacity
        style={styles.content_container}
        onPress={() => this.showModal(data)}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              marginRight: 20,
              alignItems: "center",
              alignContent: 'center',
              alignSelf: 'center',
              flex: 0.3,
              backgroundColor: data.AppointmentTime == 'Walk In' ? "#3eb88a" : "#2ca4c1",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                marginRight: 10,

                color: "#0066D7",
                fontFamily: "NotoSans-Bold",
                color: "#ffffff",
                fontSize: 17,
                textAlign: "center",
              }}
            >
              {data.AppointmentTime}
            </Text>
          </View>

          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{ color: "#000000", fontSize: 20, fontFamily: "NotoSans" }}
            >
              {data.PatientName}
            </Text>

            <View
              style={{
                flex: 0.7,
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: "#555454", fontSize: 16 }}>
                  {age.value + " " + age.units}
                </Text>
                <Text style={{ color: "#555454", fontSize: 18 }}>
                  {"  |  "}
                </Text>
                <Text style={{ color: "#555454", fontSize: 16 }}>
                  {data.PatientGender}
                </Text>
                {data.isActive ? (
                  <View
                    style={{
                      marginLeft: 5,
                      alignSelf: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      backgroundColor: "#E0F8E1",
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        color: "#3eb88a",
                        fontFamily: "NotoSans",
                        fontSize: 11,
                      }}
                    >
                      {"Walk In"}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  popup_click(item, index) {
    switch (index) {
      case 1:
        this.connectPhoneCall(item.des);
        break;
      case 2:
        this.connectWhats(item.des);
        break;
      case 0:
        this.setState({
          showModal: false,
        });
        this.props.makePrescription(item);
        break;
      case 4:
        this.markAsDone(item.des);
        break;
      case 3:
        this.cancelAppointment(item.des);
        break;
        break;
    }
  }

  GetDates(startDate, daysToAdd) {
    var aryDates = [];

    for (var i = 0; i <= daysToAdd; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);

      aryDates.push(currentDate);
      //  aryDates.push(weekdays[currentDate.getDay()] + ", " + currentDate.getDate() + " " + monthFull[currentDate.getMonth()] + " " + currentDate.getFullYear());
    }
    return aryDates;
  }

  checking(dateCheck, t_index) {
    //var startDate = new Date();
    //var aryDates = this.GetDates(startDate, 7);
    let content = this.props.data.map((item, index) => {
      // for (let index = 0; index < this.props.data.length; index++) {

      var startDate = new Date(item.date);

      const nameTosave =
        weekdays[startDate.getDay()] +
        ", " +
        startDate.getDate() +
        " " +
        monthFull[startDate.getMonth()] +
        " " +
        startDate.getFullYear();
      //   if (item.date.getDate() === dateCheck.getDate()) {
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
              this.moveToSection(index, dateCheck);
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
                  {nameTosave}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
      //  }
    });

    return content;
    // const nameTosave = weekdays[dateCheck.getDay()] + ", " + dateCheck.getDate() + " " + monthFull[dateCheck.getMonth()] + " " + dateCheck.getFullYear();
    //  return (
    //    null
    /*  <View
        style={{ flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: '#f4f4f4' }}>
        <TouchableOpacity onPress={() => { }}>
          <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }} >
            <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 10, width: '85%' }} >
              <Text style={{ fontFamily: 'NotoSans', color: '#D3D3D3', fontSize: 15, flexWrap: 'wrap' }}
              >{nameTosave}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>*/
    //  );
  }

  BindTiming() {
    //  var startDate = new Date();
    //  var aryDates = this.GetDates(startDate, 30);  //As as discussion by nikit sir,pritish sir @5Feb2021
    //  let content = aryDates.map((item, t_index) => {
    //  return (

    //    )
    // })
    return this.checking();
  }

  modalOptions() {
    {
      var content = this.state.ContactDetails.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => this.popup_click(item, index)}
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

  render() {
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
        visible={this.props.showTimingModal}
        onRequestClose={() => {
          this.setState({
            showTimingModal: false,
          });
        }}
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
            onPress={() => this.props.topItem()}
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
                  {"Select Date"}
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
        {timingPopup}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          ref={"options"}
          onRequestClose={() => {
            this.setState({
              showModal: false,
            });
          }}
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
                  showModal: false,
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
                backgroundColor: "#ffffff",
                borderTopLeftRadius: 15,
                borderTopEndRadius: 15,
                // padding: 20,
                width: "100%",
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
                }}
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
                    {this.props.data.length > 0 && this.state.selectedIndex
                      ? this.state.selectedIndex.PatientName
                      : ""}
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
                    {this.state.selectedIndex.PatientDob != null
                      ? calculateAge(this.state.selectedIndex.PatientDob, false)
                        .value +
                      " " +
                      calculateAge(this.state.selectedIndex.PatientDob)
                        .units +
                      " | " +
                      this.state.selectedIndex.PatientGender
                      : ""}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#3c3b3b",
                      fontSize: 16,
                    }}
                  >
                    {this.props.data.length > 0 && this.state.selectedIndex
                      ? this.state.selectedIndex.AppointmentTime
                      : ""}
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
                  {/*<Text
                      style={{ fontFamily: 'NotoSans', color: '#555454', fontSize: 14 }}
  
                    >{'Txn ID: ' + this.state.pendingVCitemClickProfileData.TransID}</Text>*/}

                  {/*<Text
                      style={{ fontFamily: 'NotoSans', color: '#555454', fontSize: 14 }}
  
                    >{'Paid ' + getCurreny() + ' ' + this.state.pendingVCitemClickProfileData.AmountPaid}</Text>*/}
                </View>

                {this.modalOptions()}
              </View>
            </View>
          </View>
        </Modal>

        <SectionList
          ItemSeparatorComponent={this.FlatListItemSeparator}
          sections={this.props.data}
          ref={(s) => (this.sectionList = s)}
          stickySectionHeadersEnabled={true}
          scrollEnabled={true}
          style={{ marginTop: -30 }}
          refreshing={this.props.refresh}
          onRefresh={() => this.props.onRefresh()}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                marginVertical: 7,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
                elevation: 1,
                backgroundColor: "#fef8ec",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 70, marginTop: 30,
              }}
            >
              <Text
                style={[
                  {
                    color: "#ec6669",
                    paddingHorizontal: 15,
                    paddingVertical: 3,
                    fontSize: 13,
                    fontFamily: "NotoSans",
                  },
                ]}
              >
                {Difference_In_Days(section.date) == -1
                  ? "TODAY"
                  : Difference_In_Days(section.date) == -2
                    ? "YESTERDAY"
                    : Difference_In_Days(section.date) == 0
                      ? "TOMORROW"
                      : section.title}
              </Text>
            </View>
          )}
          //  onScroll={this.handleScroll}
          onScrollBeginDrag={() => this.props.scrollStart()}
          onScrollEndDrag={() => this.props.scrollEnd()}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index}
        />

        {this.state.showToast
          ? this.refs.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={"#fafbfe"}
              imagePath={Images.Info}
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
            backgroundColor: "#4D99E3",
            borderRadius: 15,
          }}
          ref="toast"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view_style: {
    flexDirection: "row",
    backgroundColor: "#008be0",
    height: 60,
  },
  Optometry_Record: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "left",
  },
  step_2_5: {
    fontSize: 12,
    color: "#ffffff",
  },
  Next: {
    height: 18,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
  content_container: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#e3e3e3",
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  content_color: {
    color: "#383838",
    fontWeight: "600",
    fontSize: 16,
  },
  Next_blue: {
    height: 15,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
  centeredView: {
    backgroundColor: "#CC000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 20,
    // paddingHorizontal : 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
    fontSize: 20,
  },
});
