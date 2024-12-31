/// Pritish
import React, { Component } from "react";
import { Container, Content, Header, Button } from "native-base";
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import {
  ic_Close_Button,
  Toggle_Off,
  Toggle_On,
  Black_back,
  Settings_DropDowncollapsed,
  Minus_Remove_Icon,
  Settings_Next_Step_Icon,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";

import Toast, { DURATION } from "react-native-easy-toast";

import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import Modal from "react-native-modalbox";
import {
  updateDoctorDetails,
  setDoctorData,
  setClinicDetails,
  addClinicAddresses,
} from "../../actions/doctorProfile";

import { setOutOfClinic } from "../../actions/settings";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsClinicConsultation extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.modalTime = React.createRef();
    this.state = {
      isSearchBoxShowing: false,
      newName: "",
      onlineSelected: false,
      paylater: false,
      Time_array: [
        "5 min",
        "10 min",
        "15 min",
        "20 min",
        "25 min",
        "30 min",
        "35 min",
        "40 min",
        "45 min",
        "50 min",
        "55 min",
        "60 min",
      ],
      time: "Select",
      showAlert: false,
      //Toast States
      description: "",
      showToast: false,
      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
    };
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
  componentDidMount() {
    this.modalTime.open();
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    if (this.state.showAlert) {
      this.setState(
        {
          showAlert: false,
        },
        () => {
          this.clinicModal.close();
        }
      );
      return true;
    } else if (!this.state.showAlert) {
      this.props.navigation.goBack(null);
      return true;
    }
  }
  close() {
    multipleTapHandler.clearNavigator(), this.props.navigation.pop();
    return true;
  }
  addoutofclinicscreen(clinicCall) {
    multipleTapHandler.clearNavigator();
    if (clinicCall == "Edit") {
      multipleTapHandler.multitap(
        () => this.props.navigation.navigate("OutofClinicDateSlots"),
        "OutofClinicDateSlots"
      );
      this.showOutOfClinicAlert(false);
    }
    // else if(clinicCall=="Remove"){
    //   this.clinicModal.close();
    // }

    return true;
  }

  resetOutOfClinic(clinicCall) {
    let data = {
      slotIds: [],
      doctorId: this.props.doctorProfile.DoctorData._id,
      slotTimes: [],
      type: 1,
      active: 0,
    };
    this.props.setOutOfClinic(data).then((response) => {
      if (response.payload.data.status == 1) {
        let doctorData = JSON.parse(
          JSON.stringify(this.props.doctorProfile.DoctorData)
        );
        this.props.setDoctorData(doctorData);
        //call on edit
        if (clinicCall == "Edit") {
          multipleTapHandler.multitap(
            () => this.props.navigation.navigate("OutofClinicDateSlots"),
            "OutofClinicDateSlots"
          );
          this.clinicModal.close();
        } else if (clinicCall == "Remove") {
          this.setState({
            showToast: true,
            description: "Out of Clinic removed", //payload.data.msg,
            toastBgColor: "#29b62f",
            toastTextColor: "#fafdfa",
            toastImagePath: Images.Success,
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
            });
          }, 2000);
        }
      }
    });
  }
  showOutOfClinicAlert(flag) {
    this.setState(
      {
        showAlert: flag,
      },
      () => {
        if (flag) {
          this.clinicModal.open();
        } else {
          this.clinicModal.close();
        }
      }
    );
  }
  Alertforclinic() {
    Alert.alert(
      "Do you want to delete this clinic ?",
      "",
      [
        {
          text: "No ",
        },
        {
          text: "Yes",
          style: "cancel",
          onPress: () => {
            this.deleteClinic();
          },
        },
      ],
      { cancelable: false }
    );
  }

  deleteClinic() {
    let item = this.props.route.params;
    let isUpdate = 0;
    let clinics = this.props.doctorProfile.DoctorData.ClinicAddresses.filter(
      (clinic) => {
        if (clinic != item) {
          return clinic;
        }
      }
    );
    let id = this.props.doctorProfile.DoctorData._id;
    let docData = JSON.parse(
      JSON.stringify(this.props.doctorProfile.DoctorData)
    );
    if (!item.Latitude || !item.Longitude) {
      item["Latitude"] = 0;
      item["Longitude"] = 0;
    }
    if (!item.OperationHours) {
      item["OperationHours"] = [];
    }
    let clinicDetails = {
      clinicId: item.ClinicId,
      clinicAddresses: item,
      action: isUpdate,
      doctorId: id,
      fromSettings: 1,
    };

    this.props.addClinicAddresses(clinicDetails).then((response) => {
      if (response.payload.data.status == 1) {
        docData.ClinicAddresses = clinics;

        this.props.setDoctorData(docData);

        this.close();
      } else {
        Alert.alert("Prescrip", response.payload.data.msg);
        this.setState({
          isloading: false,
          delIndex: 0,
        });
      }
    });
  }

  BindTime(item, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({ time: item }, () => {
            this.modalTime.close();
            this.averagetime(item);
          })
        }
      >
        <View
          style={{
            borderBottomColor: "#cccccc",
            borderBottomWidth: 1,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              height: 50, paddingTop: 10,
              fontFamily: "NotoSans",
              color: "#000",
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  averagetime(item) {
    let slot_time = item.split(" ")[0];
    let adidress = this.props.route.params;
    adidress.AverageTimePerConsultInMinutes = parseInt(slot_time);

    let id = this.props.doctorProfile.DoctorData._id;
    let isUpdate = 2;
    let clinicDetails = {
      clinicId: adidress.ClinicId,
      // this.props.doctorProfile.DoctorData._id,
      clinicAddresses: adidress,
      action: isUpdate,
      doctorId: id,
      fromSettings: 1,
    };

    this.props.addClinicAddresses(clinicDetails).then((response) => {
      if (response.payload.data.status == 1) {
        let docData = JSON.parse(
          JSON.stringify(this.props.doctorProfile.DoctorData)
        );
        let addressList = docData.ClinicAddresses;
        let index = addressList.findIndex((item) => {
          if (item.ClinicId == adidress.ClinicId) {
            return item;
          }
        });
        addressList[index] = adidress;
        docData.ClinicAddresses = addressList;

        this.props.setDoctorData(docData);
      } else {
        this.setState({
          isloading: false,
          delIndex: 0,
        });
      }
    });
    //this.props.addClinicAddresses()
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }
  searchAction(text) {
    //alert(newData.length)
    this.setState({
      newName: text,
    });
  }

  opentimemodal() {
    this.modalTime.open();
  }

  closetimemodal() {
    this.modalTime.close();
  }
  rightImageOnClick() {
    Alert.alert("ok");
  }

  render() {
    const screenHeight = Dimensions.get("window").height;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
          {this.state.showToast
            ? this.toast.show(
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

              backgroundColor: this.state.toastBgColor,

              borderRadius: 15,
            }}
            ref="toast"
          />
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            description={this.props.route.params.ClinicName}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"#000000"}
            placeTextColor={"black"}
            placeholderTextSize={20}
            leftImage={Black_back}
            rightImage={null}
            rightImageCross={null}
            isSearchBoxShowing={null}
            type={5}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={null}
          />

          <View style={{ width: Dimensions.get('window').width }}>


            <TouchableOpacity
              onPress={() => this.opentimemodal()}
              style={{
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#fafafa",
                borderRadius: 5,
                paddingHorizontal: 14,
                paddingVertical: 11,
                marginVertical: 12,
              }}
            >
              <View
                style={{ flexDirection: "column", paddingStart: 5 }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#000000",
                    fontFamily: "NotoSans",
                  }}
                >
                  Clinic Consultation Duration
                </Text>
              </View>
              <TouchableOpacity
                style={{ paddingHorizontal: 10, flexDirection: "row" }}
                onPress={() => this.opentimemodal()}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#818181",
                    fontFamily: "NotoSans",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {this.props.route.params
                    .AverageTimePerConsultInMinutes
                    ? this.props.route.params
                      .AverageTimePerConsultInMinutes + " mins"
                    : this.state.time}
                </Text>
                <Image
                  source={Settings_DropDowncollapsed}
                  style={{ height: 24, width: 24, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </TouchableOpacity>


            <View
              style={{
                borderTopColor: "#d9d9d9",
                borderTopWidth: 1,
                flex: 1,
                marginHorizontal: 20,
                marginVertical: 10, width: Dimensions.get('window').width
              }}
            ></View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#fafafa",
                borderRadius: 5,
                paddingHorizontal: 14,
                paddingVertical: 11,
                marginVertical: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  paddingStart: 5,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#d84b4a",
                    fontFamily: "NotoSans",
                  }}
                >
                  Delete Clinic
                </Text>
                <TouchableOpacity
                  onPress={() => this.Alertforclinic()}
                  style={{ paddingHorizontal: 15 }}
                >
                  <Image
                    source={Minus_Remove_Icon}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", paddingStart: 20, marginTop: -20 }}
            >
              <Text
                style={{
                  flexWrap: "wrap",
                  fletextAlign: "justify",
                  fontSize: 12,
                  color: "#7c7c7c",
                  fontFamily: "NotoSans",
                }}
              >
                Delete of clinic will require you to finish the existing{"\n"}
                appointments related to the clinic and additional 48 hours{"\n"}
                of retrival period to make sure any kind of issue doesn't{"\n"}
                arises in case of unintentional deletion.
              </Text>
            </View>
          </View>
          <Modal
            useNativeDriver={true}
            animationDuration={200}
            style={{
              borderWidth: 0,
              width: "80%",
              borderRadius: 10,
              height: screenHeight / 1.6,
              justifyContent: "center",
              margingTop: 30,
            }}
            ref={(ref) => this.modalTime = ref}
             
            swipeToClose={false}
            position={"center"}
            //swipeToClose={this.state.swipeToClose}
            onClosed={() => {
              this.close;
            }}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => this.closetimemodal()}
                style={{
                  alignSelf: "flex-end",
                  marginTop: -10,
                  right: -10,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 12,
                  zIndex: 2,
                  position: "absolute",
                }}
              >
                <Image
                  source={ic_Close_Button}
                  style={{ height: 23, width: 23, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: "#dcdcdc",
                  flexDirection: "row",
                  borderBottomWidth: 2,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 0.9,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "#000",
                      alignItems: "center",
                      fontFamily: "NotoSans-Bold",
                    }}
                  >
                    Select Timing
                  </Text>
                </View>
              </View>
              <FlatList
                data={this.state.Time_array}
                extraData={this.state}
                renderItem={({ item, index }) => this.BindTime(item, index)}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}

              />
            </View>
          </Modal>
        </View>


        <Modal
          useNativeDriver={true}
          visible={this.state.showAlert}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: "90%",
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 200,
            overflow: "hidden",
          }}
          ref={(ref) => this.clinicModal = ref}
          
          swipeToClose={false}
          position={"center"}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onRequestClose={() => { }}
          onOpened={this.open}
          onClosingState={this.onClosingState}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: "#2e2e2e",
                  fontFamily: "NotoSans",
                  fontSize: 24,
                  textAlign: "left",
                  paddingVertical: 10,
                  marginTop: 20,
                }}
              >
                Prescrip
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  color: "#707070",
                  fontFamily: "NotoSans",
                  fontSize: 18,
                  textAlign: "left",
                }}
              >
                Out of clinic is active. Do you want to edit the selected dates.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 20,
                paddingBottom: 10,
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.showOutOfClinicAlert(false);
                }}
                style={{
                  alignItems: "center",

                  width: "30%",
                }}
              >
                <LinearGradient
                  colors={["#fff", "#fff"]}
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
                      fontSize: 18,
                      color: "#237ed9",
                      fontFamily: "NotoSans-Bold",
                    }}
                  >
                    NO
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.addoutofclinicscreen("Edit");
                }}
                style={{
                  alignItems: "center",
                  width: "40%",
                }}
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
                      fontSize: 18,
                      color: "#fff",
                      fontFamily: "NotoSans-Bold",
                    }}
                  >
                    YES
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  settings: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  setDoctorData: (docorData) => dispatch(setDoctorData(docorData)),
  setClinicDetails: (clinicAddress) =>
    dispatch(setClinicDetails(clinicAddress)),
  addClinicAddresses: (data) => dispatch(addClinicAddresses(data)),
  setOutOfClinic: (data) => dispatch(setOutOfClinic(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsClinicConsultation);
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
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
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
});
