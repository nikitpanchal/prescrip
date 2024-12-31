import { Container } from "native-base";
import React, { Component } from "react";
import { BackHandler, StatusBar, Dimensions } from "react-native";
import {
  Text,
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  Illustration_assistant,
  Assistant_added_successfully_Bg,
} from "../../constants/images";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

class AssistantSuccess extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
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
        <ImageBackground
          source={Assistant_added_successfully_Bg}
          style={{ flex: 1, resizeMode: "contain", alignItems: "center", width: Dimensions.get('window').width }}
        >
          <Image
            source={Illustration_assistant}
            style={{
              marginTop: 80,
              marginBottom: 40,
              resizeMode: "contain",
              height: 250,
              width: 250,
            }}
          />
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center",
              fontSize: 28,
              fontFamily: "NotoSans-Bold",
            }}
          >
            {`Assistant Added \n Successfully`}
          </Text>
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center",
              fontSize: 16,
              marginVertical: 18,
              marginHorizontal: 12,
              letterSpacing: 0.4,
              fontFamily: "NotoSans",
            }}
          >
            {`${this.props.route.params.userData.ops[0].DoctorFName
              } ${this.props.route.params.userData.ops[0].DoctorLName
              } has been added as a ${this.props.getSettings.manageAssistData.asstRole.Header
              } at  ${this.props.getSettings.manageAssistData.asstClinicList
                .map((item) => {
                  return item.ClinicName;
                })
                .join(", ")} clinics`}
          </Text>
          <View style={{ marginVertical: 18, alignItems: "center" }}>
            <Text
              style={{
                color: `rgba(255, 255, 255, 0.67)`,
                textAlign: "center",
                fontSize: 14,
                marginHorizontal: 12,
                fontFamily: "NotoSans",
              }}
            >
              {`An invite link has been shared with ${this.props.route.params.userData.ops[0].DoctorFName} ${this.props.route.params.userData.ops[0].DoctorLName} `}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: `rgba(255, 255, 255, 0.67)`,
                  textAlign: "center",
                  fontSize: 16,

                  fontFamily: "NotoSans",
                }}
              >
                {`on `}
              </Text>
              <Text
                style={{
                  color: `rgba(255, 255, 255, 0.67)`,
                  textAlign: "center",
                  fontSize: 18,

                  fontFamily: "NotoSans-Bold",
                }}
              >
                {`${this.props.route.params.userData.ops[0].DoctorMobile}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ManageAssistantHome")
            }
            style={{
              paddingVertical: 30,
              width: "100%",
              height: 50,
              flex: 0.2,
            }}
          >
            <LinearGradient
              colors={["#1b7cdb", "#07cef2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.8]}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                alignSelf: "center",

                width: "90%",
                height: 50,
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
                Okay
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ImageBackground>
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

export default connect(mapStateToProps, mapDispatchToProps)(AssistantSuccess);
