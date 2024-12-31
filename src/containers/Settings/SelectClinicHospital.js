/// Ravi
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
} from "react-native";
import { connect } from "react-redux";
import {
  Black_back,
  ic_setting_check_box_off,
  ic_setting_check_box_on,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import {
  setSettingClinic,
  setOutOfCliniNameList,
} from "../../actions/settings";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SelectClinicHospital extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      ic_setting_check_box_off: false,
      newarray: [],
      newclinicaddress: [],
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
    getScreenNameAnalytics({
      screen_name: "SelectClinic",
      screen_class: "SelectClinicContainer",
    });
    this.props.navigation.addListener("focus", () => {
      if (this.props.settings.clinicList.length > 0) {
        //console.log(this.props.settings.clinicList);
        this.setState({
          newclinicaddress: JSON.parse(
            JSON.stringify(this.props.settings.clinicList)
          ),
        });
      } else {
        //console.log(this.props.doctorProfile.DoctorData.ClinicAddresses);
        this.setState({
          newclinicaddress: JSON.parse(
            JSON.stringify(this.props.doctorProfile.DoctorData.ClinicAddresses)
          ),
        });
      }
    });
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

  setCheckBox(item, index) {
    //
    let data = [...this.state.newclinicaddress];
    item = data[index];
    item["clinicselected"] = item.hasOwnProperty("clinicselected")
      ? !item.clinicselected
      : true;
    data[index] = item;

    this.setState(
      {
        newclinicaddress: [...data],
      },
      () => {
        data = null;
      }
    );
    // console.log(this.props.doctorProfile.DoctorData.ClinicAddresses);
  }
  navigate() {
    //this.removeFlags();
    //console.log(this.props.doctorProfile.DoctorData.ClinicAddresses);
    let data = [...this.state.newclinicaddress];
    this.props.setOutOfCliniNameList(data);
    this.props.navigation.navigate("SettingsAddOutOfClinicNew");
  }
  removeFlags() {
    let data = [...this.state.newclinicaddress];
    this.props.doctorProfile.DoctorData.ClinicAddresses = data.map((clinic) => {
      delete clinic["clinicselected"];
      return clinic;
    });
  }
  Item(item, index) {
    return (
      <TouchableOpacity
        style={{ flexDirection: "column", backgroundColor: "#fff" }}
        onPress={() => this.setCheckBox(item, index)}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: 5,
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              paddingStart: 5,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#242424",
                fontFamily: "NotoSans",
                paddingStart: 8,
              }}
            >
              {item.ClinicName}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Image
              source={
                item.clinicselected
                  ? ic_setting_check_box_on
                  : ic_setting_check_box_off
              }
              style={{ height: 18, width: 18, resizeMode: "contain" }}
            />
          </View>
        </View>
        <View
          style={{ borderTopColor: "#d9d9d9", borderTopWidth: 1, flex: 1 }}
        />
      </TouchableOpacity>
    );
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
        <View style={{ flex: 1, backgroundColor: "#fafafa", width: Dimensions.get('window').width }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#636363"}
            description={"Select Clinic(s)/Hospital"}
            subtitle={"To setup Out of Clinic on"}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"black"}
            placeTextColor={"black"}
            placeholderTextSize={20}
            leftImage={Black_back}
            rightImage={null}
            rightImageCross={null}
            type={5}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={null}
          />

          <View style={{ backgroundColor: "#fafafa", flex: 1 }}>
            <FlatList
              data={this.state.newclinicaddress}
              renderItem={({ item, index }) => this.Item(item, index)}
              keyExtractor={(item, index) => index}
            />
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 10, width: Dimensions.get('window').width * 80 / 100 }}
              onPress={() => this.navigate()}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#0065d7",
                  borderRadius: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "NotoSans-Bold",
                    color: "#0065d7",
                    fontSize: 16,
                  }}
                >
                  DONE
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  settings: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  setSettingClinic: (clinic) => dispatch(setSettingClinic(clinic)),
  setOutOfCliniNameList: (data) => dispatch(setOutOfCliniNameList(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectClinicHospital);

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
