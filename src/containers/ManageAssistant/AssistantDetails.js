import { Container } from "native-base";
import React, { Component } from "react";
import Modal from "react-native-modalbox";

import {
  StatusBar,
  View,
  Image,
  Share,
  TextInput,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView, Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import {
  Black_back,
  SelectedTimeTick,
  ic_dropdown_bottom,
  Edit_Button,
  ic_close_button,
  ic_upload_image_tab_active,
  icon_profile_photo_edit_button,
  ic_Add_Clinic_Button,
  ic_setting_check_box_off,
  Tooltip_Edit_Assistant_Icon,
  empty_PatientList,
  Tooltip_Add_Assistant_Image_Icon,
  Tooltip_Role_Icon,
  ic_setting_check_box_on,
  Default_Assistant_Profile_Image,
} from "../../constants/images";
import Images from "../../Theme/Images";
import multipleTapHandler from "../../components/MultiTapHandle";
import {
  setAssitantData,
  updateAssitantData,
  setAsstCliniNameList,
  setAsstRole,
  manageAsstData,
  deleteAssitantData,
} from "../../actions/settings";
import { generateGuid } from "../../commonmethods/common";
import {
  isNameValid,
  isEmailValid,
  isPhoneno,
} from "../../commonmethods/validation";
import { RNS3 } from "react-native-aws3";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

import { Alert } from "react-native";
import { Platform } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getAssistantRoleData } from "../../constants/assistantRoles";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";
import {
  s3Config as config,
  doctorBucket,
  androidlink,
  ioslink,
} from "../../../app.json";
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import moment from "moment";
import { SafeAreaView } from "react-native";

class AssistantDetails extends Component {
  constructor(props) {
    super(props);
    this.forceUpdate();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.fileName = "";
    this.modalRole = React.createRef();
    this.allValid = false;
    this.state = {
      showToast: true,
      refresh: false,
      isChanged: false,
      isEditable: false,
      lastActive: "",
      isModalOpen: false,
      assistID: "",
      validationNameOutput: { valType: 0, view: "", isvalid: "" },
      validationLNameOutput: { valType: 0, view: "", isvalid: "" },
      validationMailOutput: { valType: 1, view: "", isvalid: "" },
      validationMobileOutput: { valType: 2, view: "", isvalid: "" },
      getClinicData: {
        asstProfile: "",
        asstFirstName: "",
        asstLastName: "",
        asstMobile: "",
        asstMail: "",
        asstRole: { Header: "", permissions: [] },
        asstClinicList: [],
      },
      imgPath: "",
      role: "",
      roleData: [
        "-Add Appointment/Cancel Appointment",
        "-Add/Edit Patient",
        "-Add/Edit Clinic & Fees",
        "-Add/Edit Clinic Address",
        "-Add/Edit Clinic Timings",
        "-Ability to Call Patients",
        "-Share Profile",
        "-Edit Clinic ",
        "-Add/Edit Out of Clinic Settings",
        "-Add /Edit Invoice/Receipt",
      ],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.getSettingsData.manageAssistData.asstRole.Header !=
      this.props.getSettingsData.manageAssistData.asstRole.Header
    ) {
      this.setState({ isChanged: true }, () => {
        this.getDataForAssistant();
      });
    }

    if (
      this.props.getSettingsData.manageAssistData.asstClinicList.length !=
      prevProps.getSettingsData.manageAssistData.asstClinicList.length
    ) {
      this.setState({ isChanged: true }, () => {
        this.getDataForAssistant();
      });
    }

    prevProps.getSettingsData.manageAssistData.asstClinicList.map(
      (item, index) => {
        this.props.getSettingsData.manageAssistData.asstClinicList.map(
          (child, childIndex) => {
            if (index === childIndex) {
              if (item["ClinicId"] != child["ClinicId"]) {
                this.setState({ isChanged: true }, () => {
                  this.getDataForAssistant();
                });
              }
            }
          }
        );
      }
    );
  }

  getClinicLengthData() {
    if (this.props.doctorProfile.DoctorData.ClinicAddresses.length === 1) {
      return this.props.doctorProfile.DoctorData.ClinicAddresses;
    } else {
      return this.props.getSettingsData.manageAssistData.asstClinicList;
    }
  }

  getDataForAssistant() {
    try {
      let self = this;
      let foundItem;
      let lastSeen;

      if (
        self.props.getSettingsData.assistantData &&
        self.props.getSettingsData.assistantData.length > 0
      ) {
        foundItem = self.props.getSettingsData.assistantData.find(
          (item) => item._id == this.props.route.params.assistID
        );
        lastSeen = foundItem.LastActive ? foundItem.LastActive : "";
      }

      if (lastSeen) {
        let dateCapture = moment(lastSeen).format("YYYY-MM-DD");
        let isToday = moment(dateCapture).isSame(moment().format("YYYY-MM-DD"));
        let activeDate = isToday
          ? moment(lastSeen).format("hh:mm a")
          : moment(lastSeen).format("dddd  hh:mm a");
        this.setState({
          lastActive: activeDate,
        });
      }

      let defData =
        this.props.route.params.callFrom == "EditAssist"
          ? {
            asstProfile:
              this.state.isChanged &&
                this.props.getSettingsData.manageAssistData.asstProfile
                ? this.props.getSettingsData.manageAssistData.asstProfile
                : foundItem.DoctorImage,
            asstFirstName:
              this.state.isChanged &&
                this.props.getSettingsData.manageAssistData.asstFirstName
                ? this.props.getSettingsData.manageAssistData.asstFirstName
                : foundItem.DoctorFName,
            asstLastName:
              this.state.isChanged &&
                this.props.getSettingsData.manageAssistData.asstLastName
                ? this.props.getSettingsData.manageAssistData.asstLastName
                : foundItem.DoctorLName,
            asstMail: foundItem.DoctorEmail
              ? this.state.isChanged &&
                this.props.getSettingsData.manageAssistData.asstMail
                ? this.props.getSettingsData.manageAssistData.asstMail
                : foundItem.DoctorEmail
              : "",
            asstMobile:
              this.state.isChanged &&
                this.props.getSettingsData.manageAssistData.asstMobile
                ? this.props.getSettingsData.manageAssistData.asstMobile
                : foundItem.DoctorMobile,
            asstRole: {
              Header: this.state.isChanged
                ? this.props.getSettingsData.manageAssistData.asstRole.Header
                : foundItem.RoleId === 1
                  ? "Receptionist"
                  : foundItem.RoleId === 2
                    ? "Medical Assistant"
                    : "Assistant Doctor",
              permissions: getAssistantRoleData(
                self.props.getSettingsData.manageAssistData.asstRole.Header
              ).permissions,
            },
            asstClinicList: this.state.isChanged
              ? self.props.getSettingsData.manageAssistData.asstClinicList
              : foundItem.ClinicAddresses,
          }
          : {
            asstProfile: self.state.getClinicData.asstProfile,
            asstFirstName: self.state.getClinicData.asstFirstName,
            asstLastName: self.state.getClinicData.asstLastName,
            asstMail: self.state.getClinicData.asstMail
              ? self.state.getClinicData.asstMail
              : "",
            asstMobile: self.state.getClinicData.asstMobile,
            asstRole: {
              Header: self.props.getSettingsData.manageAssistData.asstRole
                .Header
                ? self.props.getSettingsData.manageAssistData.asstRole.Header
                : "",
              permissions:
                self.props.getSettingsData.manageAssistData.asstRole
                  .permissions.length > 0
                  ? self.props.getSettingsData.manageAssistData.asstRole
                    .permissions
                  : [],
            },
            asstClinicList: this.getClinicLengthData(),
          };

      this.state.isChanged ? null : this.props.manageAsstData(defData);
      this.setState({
        getClinicData: defData,
        assistID:
          this.props.route.params.callFrom == "EditAssist"
            ? foundItem._id
            : "",
        imgPath:
          this.props.route.params.callFrom == "EditAssist"
            ? foundItem.DoctorImage
            : "",
        isChanged: false,
      });
    } catch (err) {
      // console.log(err);
    }
  }

  componentDidMount() {
    this.setState({
      isEditable:
        this.props.route.params.callFrom == "EditAssist"
          ? false
          : true,
    });
    this.getDataForAssistant();
    // this.subscription = this.props.navigation.addListener(
    //   "willFocus",
    //   () => {}
    // );
  }

  handleBackButtonClick() {
    // this.removeFlags();
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: !this.state.isModalOpen }, () => {
        this.modalRole.close();
      });
    } else {
      multipleTapHandler.clearNavigator();

      this.props.navigation.goBack(null);
      return true;
    }
    this.setState({ isChanged: false });
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
  cameraImageOnClick() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      if (image != null) {
        this.setState({ imgPath: image.path }, () => {
          this.uploadImage();
        });
      }
    });
  }

  leftImageOnClick() {
    //this.removeFlags();
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
    return true;
  }

  uploadImage() {
    let file = {
      uri: this.state.imgPath,
      name: generateGuid() + ".jpeg",
      type: "image/jpeg",
    };
    this.fileName = file.name;

    RNS3.put(file, config)
      .then((response) => {
        if (response.status == 201) {
          try {
            let data = { ...this.props.getSettingsData.manageAssistData };
            data["asstProfile"] = file.name;
            this.props.manageAsstData(data);
            this.setState({ getClinicData: data });
          } catch (ex) {
            //  console.log(ex);
          }
        }
      })
      .catch((ex) => {
        //console.log(ex);
      });
  }
  arrayClinicMatch(arr1, arr2) {
    var arr = []; // Array to contain match elements
    for (var i = 0; i < arr1.length; ++i) {
      for (var j = 0; j < arr2.length; ++j) {
        if (arr1[i].ClinicId == arr2[j].ClinicId) {
          // If element is in both the arrays
          arr.push(arr1[i]); // Push to arr array
        }
      }
    }

    return arr; // Return the arr elements
  }
  getClinicList() {
    if (this.state.getClinicData.asstClinicList.length > 0) {
      let arrFiltered = this.arrayClinicMatch(
        this.props.doctorProfile.DoctorData.ClinicAddresses,
        this.state.getClinicData.asstClinicList
      );

      let foundVal = arrFiltered.find((item, index) => index === 0);
      let clinicLength = arrFiltered.length;
      // let foundArr = this.state.getClinicData.asstClinicList.filter(
      //   (item) => item.clinicselected
      // );

      return (
        <View style={{ flex: 0.9, flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "NotoSans",
              color: "#242424",
            }}
          >
            {`${foundVal ? foundVal.ClinicName : ""}`}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "NotoSans",
              color: "#242424",
            }}
          >
            {clinicLength > 1
              ? `, +${(clinicLength - 1).toString()} more...`
              : ""}
          </Text>
        </View>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: 18,
            fontFamily: "NotoSans",
            color: "#242424",
          }}
        >
          {""}
        </Text>
      );
    }
  }
  AddEditAssistant() {
    try {
      let data = {
        mainDoctorName: this.props.doctorProfile.DoctorData.DoctorFName + ' ' + this.props.doctorProfile.DoctorData.DoctorLName,
        mobile: this.state.getClinicData.asstMobile,
        email: this.state.getClinicData.asstMail,
        firstName: this.state.getClinicData.asstFirstName,
        lastName: this.state.getClinicData.asstLastName,
        profilePhoto: this.fileName
          ? this.fileName
          : this.state.imgPath
            ? this.state.imgPath
            : "",
        clinicData: this.props.getSettingsData.manageAssistData.asstClinicList.filter(
          (item) => {
            delete item.Address;
            delete item.AverageTimePerConsultInMinutes;
            delete item.City;
            delete item.ContactNo;
            delete item.IsDefault;
            delete item.Latitude;
            delete item.Longitude;
            delete item.OpenAndClosingTime;
            delete item.OperationHours;
            delete item.Pincode;
            delete item.State;

            return item;
          }
        ),
        roleId:
          this.props.getSettingsData.manageAssistData.asstRole.Header ==
            "Receptionist"
            ? 1
            : this.props.getSettingsData.manageAssistData.asstRole.Header ==
              "Medical Assistant"
              ? 2
              : 3,
        doctorId: this.props.doctorProfile.DoctorData._id,
      };

      if (this.props.route.params.callFrom == "EditAssist") {
        data["assistantId"] = this.state.assistID;
        this.props
          .updateAssitantData(data)
          .then((res) => {
            if (res.payload.data.status === 1) {
              Alert.alert("Prescrip", "Assistant updated successfully");
              this.props.navigation.goBack();
            } else {
              Alert.alert("Prescrip", res.payload.data.msg);
            }
          })
          .catch((error) => {
            // console.log(error);
          });
      } else {
        this.props
          .setAssitantData(data)
          .then((res) => {
            if (res.payload.status === 200) {
              if (res.payload.data.data) {
                this.props.navigation.push("AssistantSuccess", {
                  userData: res.payload.data.data,
                });
              } else {
                Alert.alert("Prescrip", res.payload.data.msg);
              }
            }
          })
          .catch((error) => {
            Alert.alert("Prescrip", "Something went wrong!");
          });
      }
    } catch (err) {
      Alert.alert("Prescrip", "Something went wrong");
    }
  }

  setAsstData(type, text) {
    let asstData = { ...this.state.getClinicData };
    asstData[type] = text;
    this.props.manageAsstData(asstData);
    this.setState({ getClinicData: asstData });
  }

  validityCheckData(name, type, valType) {
    let validName =
      valType == 0
        ? isNameValid(name, type)
        : valType == 1
          ? isEmailValid(name, type)
          : isPhoneno(name, type);

    return {
      valType: valType,
      view: validName.msg,
      isvalid: validName.isvalid,
    };
  }
  checkValidation() {
    let valName = this.validityCheckData(
      this.state.getClinicData.asstFirstName,
      "First Name",
      0
    );

    let valLName = this.state.getClinicData.asstLastName
      ? this.validityCheckData(
        this.state.getClinicData.asstLastName,
        "Last Name",
        0
      )
      : {
        valType: 0,
        view: "",
        isvalid: true,
      };

    let valMail = this.state.getClinicData.asstMail
      ? this.validityCheckData(this.state.getClinicData.asstMail, "Email Id", 1)
      : {
        valType: 1,
        view: "",
        isvalid: true,
      };

    let valMobile = this.validityCheckData(
      this.state.getClinicData.asstMobile,
      "Mobile No",
      2
    );

    this.setState(
      {
        validationNameOutput: valName,
        validationLNameOutput: valLName,
        validationMobileOutput: valMobile,
        validationMailOutput: valMail,
      },
      () => {
        if (
          this.state.validationNameOutput.isvalid &&
          this.state.validationMailOutput.isvalid &&
          this.state.validationMobileOutput.isvalid &&
          this.state.validationLNameOutput.isvalid
        ) {
          this.AddEditAssistant();
        }
      }
    );
  }

  async navigate() {
    if (
      this.props.getSettingsData.manageAssistData.asstRole.Header &&
      this.props.getSettingsData.manageAssistData.asstClinicList.length > 0 &&
      this.state.getClinicData.asstMobile &&
      this.state.getClinicData.asstFirstName
    ) {
      this.checkValidation();
    } else {
      Alert.alert("Prescrip", "Please fill all mandatory fields");
    }
  }

  async onShare() {
    try {
      let msg = `Hi ${this.state.getClinicData.asstFirstName},\nDr ${this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName
        } is inviting you to Prescrip to help run ${this.props.getSettingsData.manageAssistData.asstClinicList
          .map((e) => e.ClinicName)
          .join(
            ", "
          )}. If you have any difficulties please contact Prescrip Support at ${this.props.sync.configData.supportNo
            ? this.props.sync.configData.supportNo
            : "+918850103807"
        }.\nClick here to Download: http://onelink.to/eprescrip`;

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
      alert(error.message);
    }
  }

  deleteAssistant() {
    try {
      Alert.alert(
        "Prescrip",
        "Are you sure you really want to delete this assistant?",
        [
          {
            text: "CANCEL",
            onPress: () => {
              console.log("delete");
            },
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              this.props
                .deleteAssitantData(this.state.assistID)
                .then((res) => {
                  if (res.payload.status === 200) {
                    setTimeout(() => {
                      this.props.navigation.pop();
                    }, 1000);
                  }
                })
                .catch((err) => {
                  // console.log(err);
                });
            },
          },
        ]
      );
    } catch (error) {
      //console.log(error);
    }
  }
  getImage() {
    if (this.state.imgPath.startsWith("https://")) {
      return doctorBucket + this.fileName;
    } else if (this.state.imgPath.startsWith("file://")) {
      return this.state.imgPath;
    }
  }

  openModal() {
    this.modalRole.open();
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }
  onCancelTooltip() {
    if (this.props.route.params.callFrom == "EditAssist") {
      this.props.setTooltipStatus({ ["assistantDetailsEdit"]: false });
    } else {
      this.props.setTooltipStatus({ ["assistantDetailsAdd"]: false });
    }
  }
  render() {
    // isVisible={
    //   this.props.route.params.callFrom ==
    //   "EditAssist"
    //     ? this.props.tooltipStatus.assistantDetailsEdit
    //     : this.props.tooltipStatus.assistantDetailsAdd
    // }
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
          tintColor={"#0b69d8"}
          titleColor={null}
          descriptionColor={"#3D3D3D"}
          description={
            this.props.route.params.callFrom == "EditAssist"
              ? "Assistant's Profile "
              : "Add Assistant"
          }
          subtitle={
            this.state.lastActive
              ? "Last Active " + this.state.lastActive
              : null
          }
          placeholderTextColor={"black"}
          placeTextColor={"black"}
          placeholderTextSize={20}
          leftImage={ic_close_button}
          leftImageOnClick={() => this.leftImageOnClick()}
          rightImage={this.state.isEditable ? SelectedTimeTick : null}
          rightImageCross={null}
          isSearchBoxShowing={null}
          type={5}
          rightImageOnClick={() => this.navigate()}
        />
        <FlatList
          style={{ flex: 1, width: Dimensions.get('window').width }}
          ListHeaderComponentStyle={{
            flex: 1,
            flexGrow: 1,
            paddingBottom: 50,
          }}
          ListHeaderComponent={
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "position" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{
                  flex: 1,
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  <View style={{ flex: 1, flexGrow: 1 }}>
                    <ImageBackground
                      source={
                        !this.state.imgPath
                          ? Default_Assistant_Profile_Image
                          : null
                      }
                      style={{
                        backgroundColor: "#cccccc",
                        flex: 0.3,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            doctorBucket +
                            this.props.getSettingsData.manageAssistData
                              .asstProfile,
                        }}
                        style={{
                          resizeMode: "contain",
                          paddingTop: 200,
                        }}
                      />

                      <TouchableOpacity
                        style={{
                          bottom: -20,
                          right: 25,
                          position: "absolute",
                        }}
                        onPress={() =>
                          this.state.isEditable
                            ? this.cameraImageOnClick()
                            : this.setState({ isEditable: true })
                        }
                      >
                        <Tooltip
                          topAdjustment={
                            Platform.OS === "android"
                              ? -StatusBar.currentHeight
                              : 0
                          }
                          animated={true}
                          isVisible={
                            this.props.route.params.callFrom ==
                              "EditAssist"
                              ? this.props.tooltipStatus.assistantDetailsEdit
                              : this.props.tooltipStatus.assistantDetailsAdd
                          }
                          backgroundColor={"rgba(0,0,0,0.5)"}
                          tooltipStyle={{ right: 20, alignItems: "center" }}
                          contentStyle={{
                            backgroundColor: "#6f6af4",
                            height: 100,
                          }}
                          content={
                            <AddPatient
                              isLottie={false}
                              imgWidth={70}
                              imgHeight={70}
                              imagePath={
                                this.props.route.params.callFrom ==
                                  "EditAssist"
                                  ? Tooltip_Edit_Assistant_Icon
                                  : Tooltip_Add_Assistant_Image_Icon
                              }
                              title={
                                this.props.route.params.callFrom ==
                                  "EditAssist"
                                  ? "Edit Assistant Details"
                                  : "Add an Assistant Photo"
                              }
                              description={
                                this.props.route.params.callFrom ==
                                  "EditAssist"
                                  ? "Tap to change any details related to your Assistant"
                                  : "Assistant Photo makes easier to identify and manage it"
                              }
                              textBtnVisible={false}
                            />
                          }
                          //(Must) This is the view displayed in the tooltip
                          placement="bottom"
                          //(Must) top, bottom, left, right, auto.
                          onClose={() => this.onCancelTooltip()}
                        //(Optional) Callback fired when the user taps the tooltip
                        >
                          <Image
                            source={
                              this.state.isEditable
                                ? ic_upload_image_tab_active
                                : Edit_Button
                            }
                            style={{
                              resizeMode: "contain",
                              height: 55,
                              width: 55,
                            }}
                          />
                        </Tooltip>
                      </TouchableOpacity>
                    </ImageBackground>

                    <View
                      style={{ flex: 0.75, marginHorizontal: 20 }}
                      pointerEvents={this.state.isEditable ? "auto" : "none"}
                    >
                      <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8B8B8B",
                              fontFamily: "NotoSans",
                            }}
                          >
                            First Name
                          </Text>
                          <Text style={{ fontSize: 12, color: "#FF0000" }}>
                            *
                          </Text>
                        </View>

                        <View>
                          <TextInput
                            onChangeText={(text) =>
                              this.setAsstData("asstFirstName", text)
                            }
                            ref={(input) => {
                              this.firstName = input;
                            }}
                            onSubmitEditing={() => {
                              this.lastName.focus();
                            }}
                            defaultValue={

                              this.props.getSettingsData.manageAssistData
                                .asstFirstName
                            }
                            returnKeyType={"next"}
                            maxLength={50}
                            style={{
                              borderBottomColor: "#d7d7d7",
                              paddingTop: 5,
                              paddingBottom: 0,
                              paddingTopLeft: 0,
                              borderBottomWidth: this.state.isEditable
                                ? 0.7
                                : null,
                              fontSize: 20,
                              color: "#242424",
                              fontFamily: "NotoSans",
                            }}
                          />
                        </View>
                        {!this.state.validationNameOutput.isvalid ? (
                          <Text
                            style={{
                              color: "#ff0000",
                              textAlign: "left",
                              fontFamily: "NotoSans",
                              fontSize: 12,
                            }}
                          >
                            {this.state.validationNameOutput.view}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8B8B8B",
                              fontFamily: "NotoSans",
                            }}
                          >
                            Last Name
                          </Text>
                          <Text style={{ fontSize: 12, color: "#FF0000" }}>
                            *
                          </Text>
                        </View>
                        <View>
                          <TextInput
                            onChangeText={(text) =>
                              this.setAsstData("asstLastName", text)
                            }
                            defaultValue={
                              this.props.getSettingsData.manageAssistData
                                .asstLastName
                            }
                            maxLength={50}
                            ref={(input) => {
                              this.lastName = input;
                            }}
                            returnKeyType={"next"}
                            onSubmitEditing={() => {
                              this.mobile.focus();
                            }}
                            style={{
                              color: "#242424",
                              borderBottomColor: "#d7d7d7",
                              paddingTop: 5,
                              paddingBottom: 0,
                              paddingTopLeft: 0,
                              paddingBottom: 0,
                              borderBottomWidth: this.state.isEditable
                                ? 0.7
                                : null,
                              fontSize: 20,
                              fontFamily: "NotoSans",
                            }}
                          />
                        </View>
                        {!this.state.validationLNameOutput.isvalid ? (
                          <Text
                            style={{
                              color: "#ff0000",
                              textAlign: "left",
                              fontFamily: "NotoSans",

                              fontSize: 12,
                            }}
                          >
                            {this.state.validationLNameOutput.view}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8B8B8B",
                              fontFamily: "NotoSans",
                            }}
                          >
                            Mobile Number
                          </Text>
                          <Text style={{ fontSize: 12, color: "#FF0000" }}>
                            *
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            borderBottomColor: "#d7d7d7",
                            color: "#242424",
                            borderBottomWidth: this.state.isEditable
                              ? 0.7
                              : null,

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
                          <View style={{ flex: 0.88 }}>
                            <TextInput
                              onChangeText={(text) =>
                                this.setAsstData("asstMobile", text)
                              }
                              defaultValue={
                                this.props.getSettingsData.manageAssistData
                                  .asstMobile
                              }
                              ref={(input) => {
                                this.mobile = input;
                              }}
                              onSubmitEditing={() => {
                                this.email.focus();
                              }}
                              returnKeyType={"next"}
                              keyboardType={"numeric"}
                              maxLength={10}
                              style={{
                                fontSize: 20,
                                color: "#242424",
                                fontFamily: "NotoSans",
                              }}
                            />
                          </View>
                        </View>
                        {!this.state.validationMobileOutput.isvalid ? (
                          <Text
                            style={{
                              color: "#ff0000",
                              textAlign: "left",
                              fontFamily: "NotoSans",

                              fontSize: 12,
                            }}
                          >
                            {this.state.validationMobileOutput.view}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#8B8B8B",
                            fontFamily: "NotoSans",
                          }}
                        >
                          Email Id
                        </Text>

                        <View>
                          <TextInput
                            onChangeText={(text) =>
                              this.setAsstData("asstMail", text)
                            }
                            defaultValue={
                              this.props.getSettingsData.manageAssistData
                                .asstMail
                            }
                            keyboardType="email-address"
                            maxLength={50}
                            ref={(input) => {
                              this.email = input;
                            }}
                            style={{
                              borderBottomColor: "#d7d7d7",
                              color: "#242424",
                              borderBottomWidth: this.state.isEditable
                                ? 0.7
                                : null,
                              fontSize: 20,
                              paddingTop: 5,
                              paddingBottom: 0,
                              paddingTopLeft: 0,
                              paddingBottom: 0,
                              fontFamily: "NotoSans",
                            }}
                          />
                        </View>
                        {!this.state.validationMailOutput.isvalid ? (
                          <Text
                            style={{
                              color: "#ff0000",
                              textAlign: "left",
                              fontFamily: "NotoSans",

                              fontSize: 12,
                            }}
                          >
                            {this.state.validationMailOutput.view}
                          </Text>
                        ) : null}
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8B8B8B",
                              fontFamily: "NotoSans",
                            }}
                          >
                            Assistant's Role
                          </Text>
                          <Text style={{ fontSize: 12, color: "#FF0000" }}>
                            *
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.push("AssistantType")
                          }
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            borderBottomColor: "#d7d7d7",
                            borderBottomWidth: this.state.isEditable
                              ? 0.7
                              : null,
                          }}
                        >
                          <View style={{ flex: 0.9 }}>
                            <Text
                              maxLength={50}
                              style={{
                                fontSize: 20,
                                fontFamily: "NotoSans",
                                color: "#242424",
                              }}
                            >
                              {this.state.getClinicData.asstRole.Header}
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 0.1,
                              alignItems: "flex-end",

                              justifyContent: "flex-start",
                            }}
                          >
                            <Tooltip
                              topAdjustment={
                                Platform.OS === "android"
                                  ? -StatusBar.currentHeight
                                  : 0
                              }
                              tooltipStyle={{
                                right: 20,
                                alignItems: "flex-end",
                              }}
                              animated={true}
                              isVisible={
                                !this.props.tooltipStatus.assistantDetailsAdd
                                  ? this.props.tooltipStatus
                                    .assistantDetailsRole
                                  : null
                              }
                              backgroundColor={"rgba(0,0,0,0.5)"}
                              contentStyle={{
                                backgroundColor: "#6f6af4",
                                height: 100,
                                bottom: -0,
                                justifyContent: "center",
                              }}
                              content={
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: "#6f6af4",
                                  }}
                                  onPress={() =>
                                    this.props.setTooltipStatus({
                                      ["assistantDetailsRole"]: false,
                                    })
                                  }
                                >
                                  <AddPatient
                                    isLottie={false}
                                    imgWidth={70}
                                    imgHeight={70}
                                    imagePath={Tooltip_Role_Icon}
                                    title={"Select an Role for your Assistant"}
                                    description={
                                      this.props.route.params
                                        .callFrom == "EditAssist"
                                        ? ""
                                        : "Tap to change any details related to your Assistant"
                                    }
                                    textBtnVisible={false}
                                  />
                                </TouchableOpacity>
                              }
                              //(Must) This is the view displayed in the tooltip
                              placement="top"
                              //(Must) top, bottom, left, right, auto.
                              onClose={() =>
                                this.props.setTooltipStatus({
                                  ["assistantDetailsRole"]: false,
                                })
                              }

                            //(Optional) Callback fired when the user taps the tooltip
                            >
                              <Image
                                source={
                                  this.state.isEditable
                                    ? ic_dropdown_bottom
                                    : null
                                }
                                style={{
                                  resizeMode: "contain",
                                  height: 12,
                                  width: 12,
                                }}
                              />
                            </Tooltip>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.getClinicData.asstRole.Header
                              ? this.openModal()
                              : alert("Please select an role");
                          }}
                          style={{ marginTop: 5 }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#0869d8",
                              fontFamily: "NotoSans-Bold",
                            }}
                          >
                            {" "}
                            Know about role
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8B8B8B",
                              fontFamily: "NotoSans",
                            }}
                          >
                            Assign Clinic / Hospital
                          </Text>
                          <Text style={{ fontSize: 12, color: "#FF0000" }}>
                            *
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.push("ManageAssistantClinic")
                          }
                          style={{
                            borderBottomColor: "#d7d7d7",
                            marginTop: 15,
                            borderBottomWidth: this.state.isEditable
                              ? 0.7
                              : null,
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {this.getClinicList()}
                          </View>
                          {this.state.isEditable ? (
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#0869d8",
                                alignSelf: "center",

                                fontFamily: "NotoSans-Bold",
                              }}
                            >
                              Edit
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          }
          ListFooterComponent={
            this.props.route.params.callFrom == "EditAssist" && (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => this.onShare()}
                  style={{
                    borderColor: "#0065D7",
                    borderWidth: 2,
                    width: "90%",

                    borderRadius: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "#0065D7",
                      fontSize: 16,
                      paddingVertical: 12,
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontFamily: "NotoSans-Bold",
                    }}
                  >
                    Share Invite
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.deleteAssistant()}
                  style={{ paddingVertical: 30 }}
                >
                  <Text
                    style={{
                      color: "#D32F2F",
                      fontFamily: "NotoSans-Bold",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        />



        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: "100%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 20,
            height: "40%",
            overflow: "hidden",
            justifyContent: "center",
          }}

          ref={(ref) => this.modalRole = ref}
          swipeToClose={false}
          position={"bottom"}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.open}
          onClosingState={this.onClosingState}
        >
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View
              style={{
                flex: 0.1,
                width: "100%",
                alignItems: "flex-start",
                paddingVertical: 5,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "NotoSans-Bold",
                  color: "#3a3a3a",
                  textAlign: "left",
                }}
              >
                About {this.state.getClinicData.asstRole.Header.split("/")[0]}{" "}
                Role
              </Text>
            </View>
            <View style={{ flex: 0.7, paddingHorizontal: 10 }}>
              {getAssistantRoleData(
                this.state.getClinicData.asstRole.Header
              ).permissions.map((item, index) => (
                <Text
                  style={{
                    color: "#6b6b6b",
                    fontFamily: "NotoSans",
                    lineHeight: 25,
                  }}
                >
                  {item}
                </Text>
              ))}
            </View>
            <View
              style={{
                flex: 0.2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => this.modalRole.close()}
                style={{ flex: 0.9 }}
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
                    Okay
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
  getSettingsData: state.settings,
  tooltipStatus: state.tooltip.toolTipStatus,
  sync: state.sync,
});

const mapDispatchToProps = (dispatch) => ({
  resetSettings: () => dispatch(resetSettings()),
  setOutOfClinicsDateSlots: (data) => dispatch(setOutOfClinicsDateSlots(data)),
  setOutOfCliniTimeSlotsNew: (data) =>
    dispatch(setOutOfCliniTimeSlotsNew(data)),
  setOutOfClinicDateSlotsNew: (data) =>
    dispatch(setOutOfClinicDateSlotsNew(data)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
  getOutOfClinicData: (data) => dispatch(getOutOfClinicData(data)),
  setAssitantData: (data) => dispatch(setAssitantData(data)),
  updateAssitantData: (data) => dispatch(updateAssitantData(data)),
  setAsstCliniNameList: (data) => dispatch(setAsstCliniNameList(data)),
  setAsstRole: (data) => dispatch(setAsstRole(data)),
  deleteAssitantData: (data) => dispatch(deleteAssitantData(data)),
  manageAsstData: (data) => dispatch(manageAsstData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssistantDetails);
