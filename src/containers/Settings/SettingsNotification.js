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
  Alert,Dimensions
} from "react-native";
import { connect } from "react-redux";
import {
  Toggle_Off,
  Toggle_On,
  Black_back,
  Settings_DropDowncollapsed,
  Minus_Remove_Icon,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import { UpdateSettings, setDoctorData } from "../../actions/doctorProfile";
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class SettingsNotification extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isSearchBoxShowing: false,
      newName: "",
      notification: this.props.doctorProfile.DoctorData.NotifyStatus,
      paylater: false,
      newnotdata: "",
    };
  }
  componentDidMount() {
    // const updatenotidata = this.props.doctorProfile.settingnotificationdata.toggleValue;

    getScreenNameAnalytics({
      screen_name: "SettingsNotification",
      screen_class: "SettingsNotification",
    });
  }

  receivenotification() {
    try {
      let data = {
        toggleValue: this.props.doctorProfile.DoctorData.NotifyStatus,
        doctorId: this.props.doctorProfile.DoctorData._id,
        type: 3,
      };
      this.props.UpdateSettings(data).then((response) => {
        if (response.payload.data.status == 1) {
          let doctorData = JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData)
          );
          doctorData.NotifyStatus =
            this.props.doctorProfile.DoctorData.NotifyStatus;
          OneSignal.User.addTags({
            doctorid: this.props.doctorProfile.DoctorData._id,
            enabled:
              this.props.doctorProfile.DoctorData.NotifyStatus == 1
                ? "true"
                : "false",
          });

          this.props.setDoctorData(doctorData);
          // Alert.alert(response.payload.data.msg + "" + response.payload.config.data + " ")
        }
      });
    } catch (e) {}
  }

  componentWillMount(data) {
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

  notificationSelected() {
    if (this.props.doctorProfile.DoctorData.NotifyStatus == 1) {
      this.props.doctorProfile.DoctorData.NotifyStatus = 0;
    } else {
      this.props.doctorProfile.DoctorData.NotifyStatus = 1;
    }
    this.setState({
      notification: this.props.doctorProfile.DoctorData.NotifyStatus,
    });

    this.receivenotification();
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

  render() {
    // const updatenotidata = this.props.doctorProfile.settingnotificationdata.toggleValue;
    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            description={"Notification"}
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
                  Receive Notification
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
                  {this.state.notification == 1 ? "Enable" : "Disable"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.notificationSelected()}
                style={{ paddingHorizontal: 10 }}
              >
                {this.state.notification == 1 ? (
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

            {/* <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12 }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 17, color: '#000000', fontFamily: 'NotoSans' }}>Clinic Consultation Duration</Text>
                                <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 12, color: '#7c7c7c', fontFamily: 'NotoSans' }}>Do Not Disturb,Norifiactions are{'\n'}desavle for desire schedule</Text>

                            </View>
                            <TouchableOpacity style={{ paddingHorizontal: 10 }}>
                                <Image source={Settings_DropDowncollapsed} style={{ height: 24, width: 24, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12, }}>

                            <View style={{ flexDirection: 'row', flex: 1, paddingStart: 5, justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 17, color: '#000000', fontFamily: 'NotoSans' }}>Schedule DND</Text>
                                <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                                    <Image source={Settings_DropDowncollapsed} style={{ height: 25, width: 25, resizeMode: 'contain', }} />
                                </TouchableOpacity>

                            </View>

                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', paddingStart: 20, marginTop: -20 }}>

                            <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 12, color: '#7c7c7c', fontFamily: 'NotoSans' }}>Do Not Disturb,Norifiactions are{'\n'}desavle for desire schedule</Text>

                        </View> */}
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientVisit: state.patientvisit,
});

const mapDispatchToProps = (dispatch) => ({
  UpdateSettings: (data) => dispatch(UpdateSettings(data)),
  setDoctorData: (data) => dispatch(setDoctorData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsNotification);
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
