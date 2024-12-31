import { Container } from "native-base";
import React, { Component } from "react";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  Linking,
} from "react-native";
import SettingsHeader from "../SettingsHeader/SettingsHeader";
import {
  Black_back,
  In_Clinic_Consult_Button,
  Video_Consult_Button,
  Billing_From_Contacts,
  ic_more_icon,
  ic_sms_icon,
  ic_whatsapp_icon,
  ic_mail_icon,
  contacts_button_blue,
} from "../../constants/images";
import { Image, Modal as RModal } from "react-native";
import Modal from "react-native-modalbox";
import LinearGradient from "react-native-linear-gradient";

export default class AppointmentTypesComponent extends Component {
  constructor(props) {
    super(props);
    this.modalViewRef = React.createRef();
    this.state = {
      phone: "",
      mobileIsValid: false,
      shareModal: false,
      share: [
        {
          img: ic_sms_icon,
          title: "SMS",
        },
        {
          img: ic_whatsapp_icon,
          title: "Whatsapp",
        },

        {
          img: ic_more_icon,
          title: "More",
        },
      ],
    };
  }
  async onShare(item) {
    try {
      let msg =
        "Hello, you can view my clinic(s) and take an appointment for consultation using below link " +
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
      //this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }
  sendLinkFun(type, item) {
    switch (type) {
      case "whatsapp":
        Linking.openURL(
          "whatsapp://send?text=" +
            "Hello, you can view my clinic(s) and take an appointment for consultation using below link " +
            this.props.doctorProfile.DoctorData.ShortUrl +
            "&phone=" +
            parseInt("+91" + this.state.phone)
        );

        //   Linking.openURL('whatsapp://send?phone=+91' + parseInt(number) + "?text=" + msg + "\n" + url)
        break;

      case "sms":
        let msg =
          "Hello, you can view my clinic(s) and take an appointment for consultation using below link \n" +
          this.props.doctorProfile.DoctorData.ShortUrl;
        Platform.OS == "android"
          ? Linking.openURL("sms:" + "+91" + this.state.phone + "?body=" + msg)
          : Linking.openURL("sms:" + "+91" + this.state.phone + "&body=" + msg);

        //  Linking.openURL('sms:' + number + '?sms_body=' + msg + "\n" + url);
        break;

      default:
        this.onShare(item);
    }
  }
  getTypeoFsend(item) {
    switch (item) {
      case "SMS":
        return "sms";

      case "Whatsapp":
        return "whatsapp";

      default:
        return "more";
    }
  }

  componentWillUnmount() {
    // this.removeFlags();
    this.willFocusSubscription();
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        if (this.props.mobile && this.props.patientClicked) {
          this.setState({ phone: this.props.mobile });
        }
      }
    );
  }

  sendLinkMobile() {
    if (this.state.phone && this.state.phone.length == 10) {
      this.setState({ shareModal: true, mobileIsValid: false });
    } else {
      this.setState({ mobileIsValid: true });
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
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
          tintColor={"#636363"}
          description={"Schedule Appointment"}
          titleColor={null}
          descriptionColor={"#3D3D3D"}
          placeholderTextColor={"black"}
          placeTextColor={"black"}
          placeholderTextSize={20}
          leftImage={Black_back}
          type={5}
          leftImageOnClick={this.props.leftImageClick}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => this.refs.modalPatientNumber.open()}>
            <Image
              source={Video_Consult_Button}
              style={{ resizeMode: "contain", height: 150, width: 150 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "NotoSans-Bold",
                fontSize: 25,
                marginTop: 5,
                color: "#810091",
                zIndex: 1000,
              }}
            >
              {"Video \n Consultation"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              top: "50%",
              zIndex: -1000,
              borderTopColor: "#c6c6c6",
              borderTopWidth: 0.5,
              width: 150,
            }}
          ></View>
          <View style={{ backgroundColor: "#fff", paddingHorizontal: 15 }}>
            <Text
              style={{
                marginVertical: 5,
                textAlign: "center",
                fontFamily: "NotoSans-Bold",
                fontSize: 25,
                backgroundColor: "transparent",
                color: "#6a6a6a",
              }}
            >
              {"OR"}
            </Text>
          </View>

          <TouchableOpacity onPress={this.props.onClickBtn2}>
            <Image
              source={In_Clinic_Consult_Button}
              style={{ resizeMode: "contain", height: 150, width: 150 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "NotoSans-Bold",
                fontSize: 25,
                color: "#ec5d61",
                marginTop: 5,
              }}
            >
              {"  In-Clinic \n Consultation"}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: "100%",

            height: "40%",
            overflow: "hidden",
          }}
          ref={"modalPatientNumber"}
          backdropPressToClose={false}
          swipeToClose={false}
          position={"bottom"}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => this.refs.modalPatientNumber.close()}
              style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 5 }}
            >
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 15,
                  color: "#ffffff",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,

                padding: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans-Bold",
                  color: "#3b3b3b",
                  fontSize: 16,
                }}
              >
                Provide the Patient's Contact Number
              </Text>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomColor: "#d7d7d7",
                    color: "#242424",
                    borderBottomWidth: 0.7,

                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#757575",
                        fontFamily: "NotoSans",
                      }}
                    >
                      +91{" "}
                    </Text>
                  </View>
                  <View style={{ flex: 0.88, flexDirection: "row" }}>
                    <TextInput
                      keyboardType={"numeric"}
                      maxLength={10}
                      onChangeText={(txt) => this.setState({ phone: txt })}
                      autoFocus={true}
                      defaultValue={this.state.phone}
                      style={{
                        flex: 0.95,
                        fontSize: 20,
                        color: "#242424",
                        fontFamily: "NotoSans",
                      }}
                    />
                    <TouchableOpacity
                      style={{ flex: 0.05, justifyContent: "center" }}
                      onPress={this.props.onContactSearch}
                    >
                      <Image
                        source={contacts_button_blue}
                        style={{
                          resizeMode: "contain",
                          height: 20,
                          width: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.mobileIsValid ? (
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: "#FF0000",
                      fontSize: 12,
                      paddingTop: 3,
                    }}
                  >
                    Please provide patient's mobile
                  </Text>
                ) : null}
              </View>
              <View
                style={{ flex: 1, marginTop: 10, justifyContent: "center" }}
              >
                <TouchableOpacity
                  onPress={() => this.sendLinkMobile()}
                  style={{
                    justifyContent: "center",
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
                      marginBottom: 10,
                      alignSelf: "center",
                      borderRadius: 25,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                        fontSize: 17,
                        color: "#ffffff",
                        fontFamily: "NotoSans-Bold",
                      }}
                    >
                      Send Link
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <RModal
          animationType="slide"
          transparent={true}
          visible={this.state.shareModal}
          ref={"meal"}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : null}
          >
            <View
              style={{
                flex: 1,
                width: "100%",

                justifyContent: "flex-end",

                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              {/*Close Button*/}
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    shareModal: false,
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
                    color: "#ffffff",
                    fontFamily: "NotoSans-Bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
              {/*Close Button Ends*/}

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {this.state.share.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.sendLinkFun(
                          this.getTypeoFsend(item.title),
                          this.props.itemData
                        )
                      }
                      style={{
                        flex: 0.25,
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Image
                        source={item.img}
                        style={{ height: 50, resizeMode: "contain" }}
                      />
                      <Text
                        style={{
                          color: item.color,
                          fontSize: 12,
                          fontFamily: "NotoSans",
                          color: "#737373",
                        }}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </KeyboardAvoidingView>
        </RModal>
      </View>
    );
  }
}
