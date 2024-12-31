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
  SelectedTimeTick,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import {
  setSettingClinic,
  setAsstCliniNameList,
  manageAsstData,
} from "../../actions/settings";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class ManageAssistantClinic extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      ic_setting_check_box_off: false,
      newarray: [],
      setClinicId: [],
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
    let self = this;

    this.props.navigation.addListener("focus", () => {
      if (self.props.settings.manageAssistData.asstClinicList.length > 0) {
        let newClinicArray = [
          ...self.props.doctorProfile.DoctorData.ClinicAddresses,
        ];
        this.setState({
          newclinicaddress: JSON.parse(JSON.stringify(newClinicArray)),
          setClinicId: self.props.settings.manageAssistData.asstClinicList.map(
            (c) => c.ClinicId
          ),
        });
      } else {
        //console.log(this.props.doctorProfile.DoctorData.ClinicAddresses);
        this.setState({
          newclinicaddress: JSON.parse(
            JSON.stringify(self.props.doctorProfile.DoctorData.ClinicAddresses)
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

    let indexFound = this.state.setClinicId.findIndex(
      (i) => i === item.ClinicId
    );
    if (indexFound > -1) {
      this.state.setClinicId.splice(indexFound, 1);
      this.setState({ setClinicId: this.state.setClinicId });
    } else {
      this.setState({
        setClinicId: [...this.state.setClinicId, item.ClinicId],
      });
    }

    // let data = [...this.state.newclinicaddress];
    // item = data[index];
    // item["clinicselected"] = item.hasOwnProperty("clinicselected")
    //   ? !item.clinicselected
    //   : true;
    // data[index] = item;

    // this.setState(
    //   {
    //     newclinicaddress: [...data],
    //   },
    //   () => {
    //     data = null;
    //   }
    // );
    // console.log(this.props.doctorProfile.DoctorData.ClinicAddresses);
  }
  save() {
    //this.removeFlags();

    if (this.state.setClinicId.length > 0) {
      let data = { ...this.props.settings.manageAssistData };

      data["asstClinicList"] = this.state.newclinicaddress.filter((itm) => {
        return (
          itm.ClinicId == this.state.setClinicId.find((i) => i == itm.ClinicId)
        );
      });
      this.props.manageAsstData(data);
      this.props.navigation.pop();
    } else {
      alert("Please choose an clinic for assistant");
    }
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
                this.state.setClinicId.includes(item.ClinicId)
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
            description={"Asst. Clinic(s)/Hospital"}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"black"}
            placeTextColor={"black"}
            placeholderTextSize={20}
            leftImage={Black_back}
            rightImage={SelectedTimeTick}
            rightImageCross={null}
            type={5}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={() => this.save()}
          />

          <View style={{ backgroundColor: "#fafafa", flex: 1 }}>
            <FlatList
              data={this.state.newclinicaddress}
              renderItem={({ item, index }) => this.Item(item, index)}
              keyExtractor={(item, index) => index}
            />
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
  setAsstCliniNameList: (data) => dispatch(setAsstCliniNameList(data)),
  manageAsstData: (data) => dispatch(manageAsstData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAssistantClinic);

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
