/****** code by ravi ******/
import React from "react";
import {
  Edit_White_Icon,
  ic_icon_Edit_Button,
  ic_Blue_BG_578,
  lefticon,
  icon_profile_photo_edit_button,
  Clinic_Address,
  ic_Close_Button,
  ScrollView,
} from "../../constants/images";
import { Container, Text } from "native-base";
import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  StatusBar,
  Share,
  BackHandler,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import Images from "../../Theme/Images";
import HeaderData from "../../components/Header/header";
import DoctorProfileViewComponent from "../../components/DoctorProfileComponent/DoctorProfileViewComponent";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { connect } from "react-redux";
import { generateGuid } from "../../commonmethods/common";
import { RNS3 } from "react-native-aws3";
import { s3Config as config } from "../../../app.json";
import {
  updateDoctorDetails,
  setDoctorData,
  setClinicDetails,
} from "../../actions/doctorProfile";
import { CommonActions } from "@react-navigation/native";
//import * as app from '../../../app.json'
import { setTooltip } from "../../actions/home";
import { setTooltipStatus } from "../../actions/tooltip";

import ToastComponent from "../../components/Toast/toastComponent";

import Toast, { DURATION } from "react-native-easy-toast";

import ImagePicker from "react-native-image-crop-picker";
import { Component } from "react";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class DoctorProfileViewContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);
    const firstnamealpha =
      props.doctorProfile.DoctorData.DoctorFName.charAt(0).toUpperCase();
    const surfirstalpha =
      props.doctorProfile.DoctorData.DoctorLName.charAt(0).toUpperCase();
    this.toast = React.createRef();
    this.state = {
      vcsetup: this.props.doctorProfile.DoctorData.DigitalConsult
        ? this.props.doctorProfile.DoctorData.DigitalConsult == 1
          ? 1
          : 0
        : 0,
      clinic_setup: this.props.doctorProfile.DoctorData.ClinicAddresses
        ? this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0
          ? 1
          : 0
        : 0,
      add_clinicsetup: 0,
      photo: null,
      latitude: null,
      currentLongitude: "unknown", //Initial Longitude
      currentLatitude: "unknown", //Initial Latitude
      doctorimage_alpha: firstnamealpha + surfirstalpha,
      show: false,
    };
  }

  componentWillUnmount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  }
  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "DoctorProfile",
      screen_class: "DoctorProfileViewContainer",
    });
    multipleTapHandler.clearNavigator();
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    this.props.navigation.addListener("focus", () => {
      if (this.props.auth.tooltip != "Exit") {
        this.props.setTooltip("Profile");
      }
    });
  }
  _handleBackPress() {
    this.modalclose();
    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Drawer' }]

    }));
    return true;
  }
  leftImageOnClick() {
    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Drawer' }]

    }));
  }
  onGotIt() {
    this.props.setTooltipStatus({ ["shareDoctorProfile"]: false });
    this.setState({
      shareDoctorProfile: false,
    });
  }
  //choose photo from gallery
  choosePhoto() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        if (image != null) {
          this.setState({ photo: image.path }, () => {
            this.uploadImage();
          });
        }
      })
      .catch((err) => {
        var x = ''
      });
  }

  //choose photo from camera
  cameraImageOnClick() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      if (image != null) {
        this.setState({ photo: image.path }, () => {
          this.uploadImage();
        });
      }
    });
  }
  uploadImage() {
    let file = {
      uri: this.state.photo,
      name: generateGuid() + ".jpeg",
      type: "image/jpeg",
    };
    let profileImage = "";
    RNS3.put(file, config).then((response) => {
      if (response.status == 201) {
        try {
          this.props
            .updateDoctorDetails(
              file.name,
              "DoctorImage",
              this.props.doctorProfile.DoctorData._id
            )
            .then((response) => {
              if (response.payload.data.status === 1) {
                this.props.doctorProfile.DoctorData.DoctorImage = file.name;

                this.props.setDoctorData(this.props.doctorProfile.DoctorData);
              }
            });
        } catch (ex) { }
      }
    });
    this.modalclose();
  }

  //share app link
  async onShare() {
    if (this.props.doctorProfile.DoctorData.ShortUrl) {
      try {
        let msg =
          "Hello, you can view my clinic(s) & take an appointment for consultation using below link \n" +
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
    } else {
      this.toast.show(
        <ToastComponent
          {...this.props}
          textColorCode={"#fafbfe"}
          imagePath={Images.Info}
          description={"Please register for video consultation or add a clinic"}
        />,

        1500
      );
      //Alert.alert("Prescrip", "Please register for video consultation or add a clinic")
    }
  }

  dialCall() {
    let phoneNumber = this.props.doctorProfile.DoctorData.DoctorMobile;
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }

  RightImageOnClick() {
    this.props.navigation.push("EditDoctorDetails");
  }

  VCnavigate() {
    this.props.navigation.navigate("VCWhatsAppNumberContainer");
  }
  Addclinicnavigate() {
    this.props.setClinicDetails(null);
    this.props.navigation.navigate("AppointmentContainer");
  }

  modalopen() {
    this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
      this.props.doctorProfile.DoctorData.RoleId == 3 ?
      this.setState({ show: true }) : null;
  }
  modalclose() {
    this.setState({ show: false });
  }

  ///hide and show alert when video consultation and add clinic not registered
  onViewAsPatient() {
    if (this.props.doctorProfile.DoctorData.ShortUrl) {
      this.props.navigation.navigate("PatientProfileViewContainer");
    } else {
      this.toast.show(
        <ToastComponent
          {...this.props}
          textColorCode={"#fafbfe"}
          imagePath={Images.Info}
          description={"Please register for video consultation or add a clinic"}
        />,

        1500
      );

      //alert('safsaf');

      //   Alert.alert("Prescrip", "Please register for video consultation or add a clinic")
    }
  }

  // if video consultation setup have then show this VCsetup view else show video consultation setup
  VCsetup() {
    if (this.state.vcsetup != 0) {
      return (
        <View>
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { height: 0.5 },
              shadowOpacity: 0.4,
              shadowRadius: 0,
              elevation: 4,
              paddingVertical: 5,
              flexDirection: "column",
              backgroundColor: "#fff",
              borderRadius: 8,
              marginRight: 5,
              marginStart: 8,
              paddingTop: 8,
              marginTop: 5,
              paddingHorizontal: 8,
              paddingBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 18, color: "#000000", paddingLeft: 5 }}>
                Online Consultation{" "}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                color: "#676767",
                paddingVertical: 3,
                paddingStart: 5,
              }}
            >
              {this.props.doctorProfile.DoctorData.ConsultFee == 0 ||
                this.props.doctorProfile.DoctorData.ConsultFee == undefined
                ? "Consults conducted by either audio or video calls."
                : "Consultation Fee -" +
                " \u20B9 " +
                this.props.doctorProfile.DoctorData.ConsultFee +
                " (includes audio or video calls)"}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={{
              marginTop: 10,
              shadowColor: "#000",
              shadowOffset: { height: 0.5 },
              shadowOpacity: 0.4,
              shadowRadius: 0,
              elevation: 4,
              paddingVertical: 5,
              flexDirection: "column",
              backgroundColor: "#fff",
              borderRadius: 8,
              marginRight: 5,
              marginStart: 8,
              paddingTop: 8,
              marginTop: 5,
              paddingHorizontal: 8,
              paddingBottom: 10,
            }}
          >
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={{ fontSize: 18, color: "#000000", paddingLeft: 5 }}>
                Setup Video Consultation?{" "}
              </Text>
              {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                this.props.doctorProfile.DoctorData.RoleId == 3 ?
                <TouchableOpacity
                  onPress={() => {
                    multipleTapHandler.multitap(
                      () => this.VCnavigate(),
                      "VCWhatsAppNumberContainer"
                    );
                  }}
                  style={{
                    backgroundColor: "#870b91",
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    uppercase={true}
                    style={{
                      fontSize: 13,
                      color: "#fff",
                      fontFamily: "NotoSans-Bold",
                      backgroundColor: "#870b91",
                    }}
                  >
                    setup
                  </Text>
                </TouchableOpacity> : null}
            </View>
            <Text
              style={{
                fontSize: 13,
                color: "#676767",
                paddingVertical: 3,
                paddingStart: 5,
              }}
            >
              Treating your patient in the comfort of their home {"\n"} has
              never been this easy !
            </Text>
          </View>
        </View>
      );
    }
  }

  render() {
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />
        <View
          style={{
            flexdirection: "column",
            flex: 1, width: Dimensions.get('window').width,
            backgroundColor: "#fafafa",
          }}
        >
          <View>
            <HeaderData
              {...this.props}
              bgImage={ic_Blue_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              defaultImage={Images.ic_profile_dummy_image}
              // title={"Dr."+this.state.doctorFname +" "+ this.state.doctorLname}
              title={
                "Dr. " +
                this.props.doctorProfile.DoctorData.DoctorFName +
                " " +
                this.props.doctorProfile.DoctorData.DoctorLName
              }
              description={
                this.props.doctorProfile.DoctorData.PrimarySpecialization
              }
              onGotIt={() => this.onGotIt()}
              leftImage={lefticon}
              rightImage={ic_icon_Edit_Button}
              type={3}
              shareProfile={this.props.shareProfile}
              rightImageName={"Edit"}
              RightImageOnClick={() =>
                multipleTapHandler.multitap(
                  () => this.RightImageOnClick(),
                  "EditDoctorDetails"
                )
              }
              leftImageOnClick={() => this.leftImageOnClick()}
              cameraImageOnClick={() => this.modalopen()}
              iscameraImage={true}
              cameraImage={icon_profile_photo_edit_button}
              isMenuName={true}
              photo={this.state.photo}
              doctorimage_alpha={this.state.doctorimage_alpha}
            />
          </View>

          <View
            style={{
              position: "relative",
              width: "100%",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              justifyContent: "center",
              marginTop: -19,
              paddingVertical: 10,
              backgroundColor: "#fafafa",
              paddingHorizontal: 15,
            }}
          ></View>
          <DoctorProfileViewComponent
            {...this.props}
            data={this.props.doctorProfile.DoctorData.ClinicAddresses}
            vcsetup={this.state.vcsetup}
            clinic_setup={this.state.clinic_setup}
            VCsetup={() => this.VCsetup()}
            doctorQualification={
              this.props.doctorProfile.DoctorData.DisplayQualificationCSV
            }
            doctorotherspecialization={
              this.props.doctorProfile.DoctorData.DisplaySpecializationCSV
            }
            Addclinicnavigate={() =>
              multipleTapHandler.multitap(
                () => this.Addclinicnavigate(),
                "AppointmentContainer"
              )
            }
            latitude={() => this.state.latitude}
            dialCall={() => this.dialCall()}
          />

          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
              position: "absolute",
              zIndex: 0,
              bottom: 0,
              width: "100%",
              paddingHorizontal: 10,
              backgroundColor: "#fff",
              paddingVertical: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                multipleTapHandler.multitap(
                  () => this.onViewAsPatient(),
                  "PatientProfileViewContainer"
                );
              }}
              // onPress={this.handleOpenCamera}
              style={{
                width: "45%",
                borderRadius: 25,
                paddingVertical: 3,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#176dd8",
                borderWidth: 1,
              }}
            >
              <Text
                uppercase={true}
                style={{
                  fontSize: 14,
                  letterSpacing: 0.8,
                  color: "#176dd8",
                  fontFamily: "NotoSans-Bold",
                  alignSelf: "center",
                }}
              >
                VIEW AS{"\n"}PATIENT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.onShare();
              }}
              style={{
                width: "45%",
                borderRadius: 25,
                backgroundColor: "#26b82d",
                paddingVertical: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                uppercase={true}
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                SHARE
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          backdrop={true}
          backdropPressToClose={false}
          animationType="slide"
          transparent={true}
          //  ref={"modalDate"}
          visible={this.state.show}
          onRequestClose={() => { }}

        // backdrop={true}
        // backdropPressToClose={false}

        // animationType="slide"
        // transparent={true}
        // visible={this.state.show}

        // onRequestClose={() => this.setState({
        //   show: false,
        // })}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 8,
                // padding: 20,
                alignItems: "center",
                width: "90%",

                flex: Platform.isPad ? 0.25 : 0.3,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => this.modalclose()}
                style={{
                  alignSelf: "flex-end",
                  position: "absolute",
                  top: -10,
                  right: -11,
                  elevation: 12,
                  zIndex: 1,
                }}
              >
                <Image
                  source={ic_Close_Button}
                  style={{ height: 23, width: 23, resizeMode: "contain" }}
                />
                {/* <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> */}
              </TouchableOpacity>

              <View
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#ededed",
                    flexDirection: "row",
                    paddingVertical: 15,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      paddingStart: 15,
                      fontFamily: "NotoSans-Bold",
                      color: "#3c3c3c",
                      fontSize: 22,
                      flex: 1,
                    }}
                  >
                    Select Image
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.cameraImageOnClick()}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#ededed",
                    flexDirection: "row",
                    paddingVertical: 15,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      paddingStart: 15,
                      fontFamily: "NotoSans",
                      color: "#3c3c3c",
                      fontSize: 18,
                      flex: 1,
                    }}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.choosePhoto()}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#ededed",
                    flexDirection: "row",
                    paddingVertical: 15,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      paddingStart: 15,
                      fontFamily: "NotoSans",
                      color: "#3c3c3c",
                      fontSize: 18,
                      flex: 1,
                    }}
                  >
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Toast
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            width: "90%",
            backgroundColor: "#4D99E3",
            borderRadius: 15,
          }}
          ref={(ref) => this.toast = ref}
        />

        {/* <Modal
          backdrop={true}
          backdropPressToClose={false}

          animationType="slide"
          transparent={true}
          visible={this.props.isContactDetailsModal}
          ref={"modalpicchoose"}

          onRequestClose={() => {

          }}
        >
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          
            <View style={{

              backgroundColor: "#ffffff",
              borderRadius: 8,
              alignItems: "center",
              width: '90%',

              flex: 5 ,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}>

              <TouchableOpacity 
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute', top: -10, right: -11,
                  elevation: 12, zIndex: 1,
                }}>
                <Image source={ic_Close_Button} style={{ height: 23, width: 23, resizeMode: 'contain', }} />
              </TouchableOpacity>


              <View style={{ flexDirection: 'column', alignSelf: 'flex-start', }}>

                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ededed', flexDirection: 'row', paddingVertical: 15, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start' }} >


                  <Text
                    style={{ paddingStart: 15, fontFamily: 'NotoSans-Bold', color: '#3c3c3c', fontSize: 22, flex: 1 }}
                  >{'Select a Clinic'}</Text>
                </View>


                <View style={{ width: '100%', flex: 1 }}>
                  <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity  style={{ bottom: 0, flexDirection: 'row', backgroundColor: 'white', height: 60, borderBottomColor: '#dcdcdc', borderBottomWidth: 1, paddingLeft: 2 }}>
                    
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'flex-start', color:"#000", fontSize: 21, fontFamily: 'NotoSans' }}></Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>

                </View>

              </View>

            </View>


          </View>
        </Modal> */}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  auth: state.auth,
  shareProfile: state.tooltip.toolTipStatus.shareDoctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  setDoctorData: (docorData) => dispatch(setDoctorData(docorData)),
  setTooltip: (tab) => dispatch(setTooltip(tab)),
  setClinicDetails: (clinicAddress) =>
    dispatch(setClinicDetails(clinicAddress)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorProfileViewContainer);
