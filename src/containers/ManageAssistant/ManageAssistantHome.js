import { Container } from "native-base";
import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  FlatList,Dimensions,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import EmptyHome from "../../components/EmptyHome/EmptyHome";
import Images from "../../Theme/Images";
import {
  Black_back,
  ic_Add_Clinic_Button,
  ic_setting_check_box_off,
  empty_PatientList,
  Empty_Assistant_List,
  ic_setting_check_box_on,
  ic_popup_Add_Button_Icon,
  Tooltip_Add_Assistant_Icon,
  Settings_Next_Step_Icon,
} from "../../constants/images";
import PatientSectionComponent from "../../components/PatientComponent/PatientSectionComponent";
import { FloatingAction } from "react-native-floating-action";
import multipleTapHandler from "../../components/MultiTapHandle";
import {
  getAssitantData,
  setAsstCliniNameList,
  setAsstRole,
  storeAssitantData,
  manageAsstData,
  deleteAssitantData,
} from "../../actions/settings";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";
import { connect } from "react-redux";
import { s3Config as config, doctorBucket } from "../../../app.json";
class ManageAssistantHome extends Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.asstData = [];
    this.state = {
      refresh: false,
      loading: false,
      isChanged: false,
    };
  }
  handleBackButtonClick() {
    // this.removeFlags();
    this.willFocusSubscription();
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
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

  getAssistData() {
    
    let self = this;
    self.props
      .getAssitantData(self.props.doctorProfile.DoctorData._id)
      .then((res) => {
        //console.log(res);
        if (res.payload.status === 200) {
          this.asstData = res.payload.data.assistantList;
          this.props.storeAssitantData(this.asstData);
          this.setState({
            refresh: !this.state.refresh,
            loading: true,
          });
        }
      })
      .catch((err) => {
       // console.log(err);
      });
  }

  componentDidMount() {
    let self = this;

    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        self.getAssistData();
        this.setState({ isChanged: true });
      }
    );
  }

  navigate() {
    this.setState({
      refresh: false,
      loading: false,
    });
    this.props.manageAsstData({
      asstProfile: "",
      asstFirstName: "",
      asstLastName: "",
      asstMobile: "",
      asstMail: "",
      asstClinicList: [],
      asstRole: {
        Header: "",
        permissions: [],
      },
    });
    this.props.storeAssitantData([]);
    this.props.navigation.navigate("AssistantDetails", {
      callFrom: "AddAssist",
    });
  }

  deleteAssistant(item) {
    try {
      this.props
        .deleteAssitantData(item._id)
        .then((res) => {
          if (res.payload.status === 200) {
            setTimeout(() => {
              this.props.navigation.pop();
            }, 1000);
            alert("Deleted Successfully");
          }
        })
        .catch((err) => {
        //  console.log(err);
        });
    } catch (error) {
     // console.log(error);
    }
  }
  arrayClinicMatch(arr1, arr2) {
    var arr = [];
    if (arr1.length > 0) {
      for (var i = 0; i < arr1.length; ++i) {
        for (var j = 0; j < arr2.length; ++j) {
          if (arr1[i].ClinicId == arr2[j].ClinicId) {
            // If element is in both the arrays
            arr.push(arr1[i]); // Push to arr array
          }
        }
      }
    }

    return arr; // Return the arr elements
  }
  itemView(item, index) {
    let arrFiltered = this.arrayClinicMatch(
      this.props.doctorProfile.DoctorData.ClinicAddresses,
      item.ClinicAddresses
    );

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("AssistantDetails", {
            callFrom: "EditAssist",
            assistID: item._id,
          })
        }
        style={{
          flexDirection: "row",
          borderBottomColor: "#f0f0f0",
          borderBottomWidth: 0.8,
          paddingVertical: 15,
          paddingHorizontal: 10,
        }}
      >
        <Image
          source={
            item.DoctorImage
              ? { uri: doctorBucket + item.DoctorImage }
              : Images.ic_profile_dummy_image
          }
          style={{
            resizeMode: "cover",
            alignSelf: "center",
            width: 40,
            height: 40,
            borderColor: "white",
            borderWidth: 2,
            borderRadius: 5,
          }}
        />
        <View style={{ flex: 0.85, marginLeft: 5 }}>
          <Text
            style={{ fontFamily: "NotoSans", color: "#262626", fontSize: 18 }}
          >
            {item.DoctorFName + " " + item.DoctorLName}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {arrFiltered.length > 0 && (
              <Text style={{ fontFamily: "NotoSans" }}>
                {item.RoleId === 1
                  ? "Receptionist"
                  : item.RoleId === 2
                  ? "Medical Assistant"
                  : "Assistant Doctor"}
              </Text>
            )}

            {item.ClinicAddresses.length > 0 && arrFiltered.length > 0 ? (
              <Text style={{ fontFamily: "NotoSans" }}>{` at ${
                arrFiltered[0].ClinicName
              } ${
                arrFiltered.length > 1
                  ? `and ${arrFiltered.length - 1} more`
                  : ""
              } `}</Text>
            ) : null}
          </View>
        </View>
        <View style={{ flex: 0.15, justifyContent: "center" }}>
          <Image
            source={Settings_Next_Step_Icon}
            style={{
              resizeMode: "contain",
              height: 24,
            }}
          />
        </View>
      </TouchableOpacity>
    );
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
          description={"Manage Assistants"}
          leftImage={Black_back}
          leftImageOnClick={() => this.handleBackButtonClick()}
          titleColor={null}
          descriptionColor={"#3D3D3D"}
          placeholderTextColor={"black"}
          placeTextColor={"black"}
        />
        {!this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height:  Dimensions.get('screen').height,
              width:  Dimensions.get('screen').width,
              position: "absolute",
            }}
          >
            <ActivityIndicator size={"large"} color="#fff" />
          </View>
        ) : null}
        <FlatList
          data={this.asstData}
          contentContainerStyle={{
            width: Dimensions.get('window').width
          }}
          extraData={this.state.refresh}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginTop: 40,
                justifyContent: "center",
              }}
            >
              <EmptyHome
                {...this.props}
                title={"Everyone needs a helping hand."}
                description={
                  "Add an assistant so they can use Prescrip for their role"
                }
                imagePath={Empty_Assistant_List}
                //imagePath={Images.ic_Video_Consultations_Empty_Icon}
              />
            </View>
          }
          renderItem={({ item, index }) => this.itemView(item, index)}
        />
        {/* this.props.tooltipStatus.assistantHomeAdd  */}
        <TouchableOpacity
          onPress={() => {
            this.navigate();
          }}
          style={{
            alignSelf: "flex-end",
            bottom: 30,
            right: 15,
            marginBottom: 36,
            position: "absolute",
          }}
        >
          <Tooltip
            topAdjustment={
              Platform.OS === "android" ? -StatusBar.currentHeight : 0
            }
            animated={true}
            isVisible={this.props.tooltipStatus.assistantHomeAdd}
            backgroundColor={"rgba(0,0,0,0.5)"}
            tooltipStyle={{ right: 20, alignItems: "flex-end" }}
            contentStyle={{ backgroundColor: "#6f6af4", height: 100 }}
            content={
              <TouchableOpacity
                style={{ backgroundColor: "#6f6af4" }}
                onPress={() => {
                  this.props.setTooltipStatus({ ["assistantHomeAdd"]: false });
                }}
              >
                <AddPatient
                  imagePath={Tooltip_Add_Assistant_Icon}
                  title={"Want to add an Assistant?"}
                  description={
                    "Let's start with adding an Assistant Tap on '+' to get started"
                  }
                />
              </TouchableOpacity>
            }
            //(Must) This is the view displayed in the tooltip
            placement="top"
            //(Must) top, bottom, left, right, auto.
            onClose={() => {
              this.props.setTooltipStatus({ ["assistantHomeAdd"]: false });
            }}
            //(Optional) Callback fired when the user taps the tooltip
          >
            <Image
              style={{
                resizeMode: "contain",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
                marginRight: 30,
                width: 55,
                height: 55,
              }}
              source={ic_Add_Clinic_Button}
            />
          </Tooltip>
        </TouchableOpacity>
         
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  getSettingsData: state.settings,
  tooltipStatus: state.tooltip.toolTipStatus,
});

const mapDispatchToProps = (dispatch) => ({
  getAssitantData: (data) => dispatch(getAssitantData(data)),
  setAsstCliniNameList: (data) => dispatch(setAsstCliniNameList(data)),
  setAsstRole: (data) => dispatch(setAsstRole(data)),
  storeAssitantData: (data) => dispatch(storeAssitantData(data)),
  manageAsstData: (data) => dispatch(manageAsstData(data)),
  deleteAssitantData: (asstID) => dispatch(deleteAssitantData(asstID)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAssistantHome);
