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
  Save_pink_btn,
  Firefox_Icon,
  Chrome_Icon,
  Blue_Plus_Icon,
  Settings_Next_Step_Icon,
  PrintViaWeb_Icon,
  Notifications_Icon,
  Clinic_Consultation_Icon,
  empty_vc,
  Chief_N_Data_Icon,
  Black_back,
  ic_note_delete,
  Search_button_light_blue,
  lefticon,
  rightblueIcon,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import { setClinicDetails } from "../../actions/doctorProfile";
import { setSettingClinic } from "../../actions/settings";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsClinicNameConsultation extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isSearchBoxShowing: false,
      newName: "",
    };
    this.data = [
      {
        id: "1",
        title: "Chrome on Windows",
        images: Settings_Next_Step_Icon,
      },
      {
        id: "2",
        title: "Firefox on MacOs",
        images: Settings_Next_Step_Icon,
      },
    ];
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
    getScreenNameAnalytics({
      screen_name: "SettingsClinicConsultation",
      screen_class: "SettingsClinicConsultation",
    });
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  AddClinic() {
    this.props.setClinicDetails(null);

    multipleTapHandler.clearNavigator();
    multipleTapHandler.multitap(
      () => this.props.navigation.navigate("AppointmentContainer"),
      "AppointmentContainer"
    );
    return true;
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
    return true;
  }
  searchAction(text) {
    //alert(newData.length)
    this.setState({
      newName: text,
    });
  }
  navigate = (data) => {
    this.props.setSettingClinic(data);
    multipleTapHandler.multitap(
      () => this.props.navigation.navigate("SettingsClinicConsultation", data),
      "SettingsClinicConsultation"
    );
    // this.props.navigation.navigate('SettingsClinicConsultation', data)
  };

  Item(data) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.navigate(data);
        }}
        style={{
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "#fafafa",
          borderRadius: 5,
          paddingHorizontal: 14,
          paddingVertical: 8,
          marginVertical: 12,
        }}
      >
        <View style={{ flexDirection: "column", flex: 1, paddingStart: 5 }}>
          <Text
            style={{
              fontSize: 17,
              color: "#000000",
              fontFamily: "NotoSans",
              paddingStart: 8,
            }}
          >
            {data.ClinicName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.navigate(data);
          }}
          style={{ paddingHorizontal: 10 }}
        >
          <Image
            source={Settings_Next_Step_Icon}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{  flex:1  }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />
        <View style={{ flex: 1, backgroundColor: "#fafafa", width: Dimensions.get('screen').width }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            description={"Clinic Consultation"}
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
            <FlatList
              data={this.props.doctorProfile.DoctorData.ClinicAddresses}
              renderItem={({ item }) => this.Item(item)}
              keyExtractor={(item) => item.id}
            />
            {this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ? (
              <View
                style={{
                  borderTopColor: "#d9d9d9",
                  borderTopWidth: 1,
                  flex: 1,
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}
              />
            ) : null}

            <TouchableOpacity
              onPress={() => this.AddClinic()}
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
                    color: "#0065D7",
                    fontFamily: "NotoSans",
                  }}
                >
                  Add New Clinic
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.AddClinic()}
                style={{ paddingHorizontal: 10 }}
              >
                <Image
                  source={Blue_Plus_Icon}
                  style={{ height: 25, width: 25, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  setClinicDetails: (clinic) => dispatch(setClinicDetails(clinic)),
  setSettingClinic: (clinic) => dispatch(setSettingClinic(clinic)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsClinicNameConsultation);
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
