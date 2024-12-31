import { Container } from "native-base";
import React, { Component } from "react";
import {
  StatusBar,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { manageAsstData } from "../../actions/settings";

import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import {
  Black_back,
  SelectedTimeTick,
  ic_dropdown_bottom,
  ic_close_button,
  ic_radio_button_selected,
  ic_radio_button_unselected,
  ic_upload_image_tab_active,
  ic_Add_Clinic_Button,
  ic_setting_check_box_off,
  empty_PatientList,
  ic_setting_check_box_on,
  Default_Assistant_Profile_Image,
  Full_Privileges_Icon,
  No_Access_Icon,
  Partial_Privileges_Icon,
} from "../../constants/images";

class AssistantType extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      getAssistIndex: -1,
      getAsstRole: this.props.settings.manageAssistData.asstRole
        ? this.props.settings.manageAssistData.asstRole
        : {},
      //1 = Full Access 2 = Parial Access 3 = No Access
      ROLES: [
        {
          Header: "Receptionist",
          subTitle: "Could be assigned to Receptionist or Compounder",
          permissions: [
            "Appointments",
            "Patient Details (Basic Details)",
            "Medical Investications",
            "Notes",
            "Clinic Settings",
            "Invoice and Receipt",
            "Doctor Profile (Share only)",
          ],
          roleImages: [1, 2, 3, 3, 1, 1, 2],
        },

        {
          Header: "Assistant Doctor",
          subTitle: "Could be assigned to Assistant Doctor or Partner Doctor",
          permissions: ["Full Access", "Medical Investigations (no delete)"],
          roleImages: [1, 2],
        },
        {
          Header: "Medical Assistant",
          subTitle:
            "Could be assigned to Nurse, Physician or Medical Assistant",
          permissions: [
            "Appointments",
            "Patient Details (Basic Details)",
            "Medical Investications",
            "Notes",
            "Clinic Settings",
            "Invoice and Receipt",
            "Doctor Profile (Share only)",
          ],
          roleImages: [1, 1, 2, 1, 1, 1, 2],
        },
      ],
    };
  }

  componentDidMount() {
    let val =
      this.props.getSettings.manageAssistData.asstRole.Header == "Receptionist"
        ? 0
        : this.props.getSettings.manageAssistData.asstRole.Header ==
          "Assistant Doctor"
        ? 1
        : this.props.getSettings.manageAssistData.asstRole.Header ==
          "Medical Assistant"
        ? 2
        : -1;
    this.setState({ getAssistIndex: val });
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

  roleImages(RoleIndex) {
    switch (RoleIndex) {
      case 1:
        return Full_Privileges_Icon;
      case 2:
        return Partial_Privileges_Icon;
      case 3:
        return No_Access_Icon;
    }
  }

  roleView(role, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({ getAssistIndex: index, getAsstRole: role })
        }
        style={{
          borderRadius: 10,

          borderColor: "#dddddd",
          flexDirection: "row",
          borderBottomWidth: 2.8,
          borderLeftWidth: 1.2,
          borderRightWidth: 1.2,
          borderTopWidth: 1.2,
          paddingVertical: 6,
          paddingHorizontal: 8,
          margin: 10,
          justifyContent: "center",
        }}
      >
        <Image
          source={
            index == this.state.getAssistIndex
              ? ic_radio_button_selected
              : ic_radio_button_unselected
          }
          style={{ flex: 0.1, height: 18, width: 18, marginTop: 5 }}
          resizeMode="contain"
        />
        <View style={{ flex: 0.9, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 22,
              color: "#000",

              fontFamily: "NotoSans",
            }}
          >
            {role.Header}
          </Text>
          <Text
            style={{
              color: "#676767",
              fontFamily: "NotoSans",
              fontSize: 13,
              paddingBottom: 8,
            }}
          >
            {role.subTitle}
          </Text>
          {role.permissions.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={this.roleImages(role.roleImages[index])}
                style={{
                  resizeMode: "contain",
                  height: 10,
                  width: 10,
                  marginRight: 5,
                }}
              />
              <Text
                style={{
                  flex: 0.95,

                  color: "#676767",
                  fontFamily: "NotoSans",
                  fontSize: 15,
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  handleBackButtonClick() {
    // this.removeFlags();
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  leftImageOnClick() {
    //this.removeFlags();
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
    return true;
  }

  save() {
    let manageAssistData = { ...this.props.getSettings.manageAssistData };
    manageAssistData["asstRole"] = this.state.getAsstRole;
    this.props.manageAsstData(manageAssistData);
    this.props.navigation.goBack();
  }

  render() {
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
            tintColor={"#636363"}
            description={"Assistant's Role"}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"black"}
            placeTextColor={"black"}
            placeholderTextSize={20}
            subArrayData={[
              { access: "Full Privileges", img: Full_Privileges_Icon },
              { access: "Partial Privileges", img: Partial_Privileges_Icon },
              { access: "No Access", img: No_Access_Icon },
            ]}
            leftImage={ic_close_button}
            rightImage={SelectedTimeTick}
            rightImageCross={null}
            type={5}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={() => this.save()}
          />
          <FlatList
            data={this.state.ROLES}
            style={{ backgroundColor: "#fafafa" }}
            contentContainerStyle={{ margin: 10, paddingBottom: 20 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => this.roleView(item, index)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  settings: state.settings,
  getSettings: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  setSettingClinic: (clinic) => dispatch(setSettingClinic(clinic)),

  manageAsstData: (data) => dispatch(manageAsstData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssistantType);
