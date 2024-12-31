/// Pritish
import React, { Component } from "react";
import { Container, Content, Header } from "native-base";
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
  Alert,
} from "react-native";
import { connect } from "react-redux";
import {
  ic_Close_Button,
  Toggle_Off,
  Toggle_On,
  Black_back,
  Settings_DropDowncollapsed,
  Save_pink_btn,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import Modal from "react-native-modalbox";
import { UpdateSettings, setDoctorData } from "../../actions/doctorProfile";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsVideoConsultationContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isSearchBoxShowing: false,
      newName: "",
      onlineSelected: this.props.doctorProfile.DoctorData.DigitalConsult,
      paylater: this.props.doctorProfile.DoctorData.PayLater,
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
      time: "",
    };
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "SettingsVideoConsultation",
      screen_class: "SettingsVideoConsultationContainer",
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
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  BindTime(item, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({ time: item }, () => {
            this.modalTime.close();
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
              fontSize: 18,
              fontFamily: "NotoSans",
              color: "#000",
              paddingVertical: 10,
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // switchType(togglename) {
  //     var Type = 0

  //     switch (togglename) {
  //         case 'DigitalConsult':

  //             Type = 1
  //             return Type

  //         case 'PayLater':
  //             Type = 2
  //             Togglevalue = this.state.paylater
  //             return Type
  //         case 'Notification':
  //             Type = 3
  //             return Type
  //         default:
  //             return 0
  //     }
  // }

  Videoconsultationonline() {
    try {
      let data = {
        toggleValue: this.props.doctorProfile.DoctorData.DigitalConsult,
        doctorId: this.props.doctorProfile.DoctorData._id,
        type: 1,
      };
      this.props.UpdateSettings(data).then((response) => {
        if (response.payload.data.status == 1) {
          let doctorData = JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData)
          );
          doctorData.DigitalConsult =
            this.props.doctorProfile.DoctorData.DigitalConsult == 1
              ? this.props.doctorProfile.DoctorData.DigitalConsult
              : 2;
          this.props.setDoctorData(doctorData);
        }
      });
    } catch (e) { }
  }
  paylater() {
    try {
      let data = {
        toggleValue: this.props.doctorProfile.DoctorData.PayLater,
        doctorId: this.props.doctorProfile.DoctorData._id,
        type: 2,
      };
      this.props.UpdateSettings(data).then((response) => {
        if (response.payload.data.status == 1) {
          let doctorData = JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData)
          );
          doctorData.PayLater = this.props.doctorProfile.DoctorData.PayLater;
          this.props.setDoctorData(doctorData);
        }
      });
    } catch (e) { }
  }
  onlineSelected() {
    if (this.props.doctorProfile.DoctorData.DigitalConsult == 1) {
      this.props.doctorProfile.DoctorData.DigitalConsult = 0;
    } else {
      this.props.doctorProfile.DoctorData.DigitalConsult = 1;
    }
    this.setState({
      onlineSelected: this.props.doctorProfile.DoctorData.DigitalConsult,
    });

    this.Videoconsultationonline();
  }

  PaylaterSelected() {
    if (this.props.doctorProfile.DoctorData.PayLater == 0) {
      this.props.doctorProfile.DoctorData.PayLater = 1;
    } else {
      this.props.doctorProfile.DoctorData.PayLater = 0;
    }
    this.setState({ paylater: this.props.doctorProfile.DoctorData.PayLater });

    this.paylater();
  }

  close() {
    this.props.navigation.pop();
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
    this.Videoconsultationonline();

    // Alert.alert("ok")
  }

  render() {
    const screenHeight = Dimensions.get("window").height;
    const online = "DigitalConsult";

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ flex: 1, backgroundColor: "#fafafa", width: Dimensions.get('window').width }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            description={"Video Consultation"}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"black"}
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

          <View>
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
                style={{ flexDirection: "column", flex: 1, paddingStart: 5 }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#000000",
                    fontFamily: "NotoSans",
                  }}
                >
                  Accept Online Appointments
                </Text>
                <Text
                  style={{
                    flexWrap: "wrap",
                    fletextAlign: "justify",
                    fontSize: 12,
                    color: "#7c7c7c",
                    fontFamily: "NotoSans",
                  }}
                >
                  {this.state.onlineSelected == 1 ? "Enable" : "Disable"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.onlineSelected()}
                style={{ paddingHorizontal: 10 }}
              >
                {this.state.onlineSelected == 1 ? (
                  <Image
                    source={Toggle_On}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                ) : (
                  <Image
                    source={Toggle_Off}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                )}
              </TouchableOpacity>
            </TouchableOpacity>

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
                style={{ flexDirection: "column", flex: 1, paddingStart: 5 }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#000000",
                    fontFamily: "NotoSans",
                  }}
                >
                  Pay Later for Consultation{" "}
                </Text>
                <Text
                  style={{
                    flexWrap: "wrap",
                    fletextAlign: "justify",
                    fontSize: 12,
                    color: "#7c7c7c",
                    fontFamily: "NotoSans",
                  }}
                >
                  {this.state.paylater == 1 ? "Enable" : "Disable"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.PaylaterSelected()}
                style={{ paddingHorizontal: 10 }}
              >
                {this.state.paylater == 1 ? (
                  <Image
                    source={Toggle_On}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                ) : (
                  <Image
                    source={Toggle_Off}
                    style={{ height: 25, width: 25, resizeMode: "contain" }}
                  />
                )}
              </TouchableOpacity>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12 }} onPress={() => this.opentimemodal()}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 17, color: '#000000', fontFamily: 'NotoSans' }}>Video Consultation Duration</Text>
                            </View>
                            <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: 'row' }} onPress={() => this.opentimemodal()}>
                                <Text style={{ fontSize: 17, color: '#818181', fontFamily: 'NotoSans', alignItems: 'center', textAlign: 'center' }}>{this.state.time}</Text>
                                <Image source={Settings_DropDowncollapsed} style={{ height: 24, width: 24, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                        </TouchableOpacity> */}

            {/* <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12 }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 17, color: '#000000', fontFamily: 'NotoSans' }}>Improve Consultation Duration</Text>
                                <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 12, color: '#7c7c7c', fontFamily: 'NotoSans' }}>Studies your Consultation Duration behaviours{'\n'} over time to enhance appointment scheduling,{"\n"} </Text>
                            </View>
                            <TouchableOpacity style={{ paddingHorizontal: 10 }}>
                                <Image source={Toggle_Off} style={{ height: 25, width: 25, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                        </TouchableOpacity> */}
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
              style={{ width: "100%" }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientProfile: state.patientProfile,
});

const mapDispatchToProps = (dispatch) => ({
  UpdateSettings: (data) => dispatch(UpdateSettings(data)),
  setDoctorData: (data) => dispatch(setDoctorData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsVideoConsultationContainer);
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
