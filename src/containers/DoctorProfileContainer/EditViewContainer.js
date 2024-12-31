/****** code by ravi ******/
import React from "react";
import {
  Edit_White_Icon,
  ic_icon_Edit_Button,
  ic_Blue_BG_578,
  lefticon,
  icon_profile_photo_edit_button,
  Purple_Blue_Icon,
} from "../../constants/images";
import { Container, Text } from "native-base";
import { View, Dimensions,TouchableOpacity, Image, BackHandler } from "react-native";
import Images from "../../Theme/Images";
import HeaderData from "../../components/Header/header";
import EditViewComponent from "../../components/DoctorProfileComponent/EditViewComponent";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { connect } from "react-redux";
import { generateGuid } from "../../commonmethods/common";
import { RNS3 } from "react-native-aws3";
import { s3Config as config } from "../../../app.json";
import {
  updateDoctorDetails,
  setDoctorData,
  setClinicDetails,
  addClinicAddresses,
} from "../../actions/doctorProfile";
import ImagePicker from "react-native-image-crop-picker";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class EditViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      edit_vcsetup: 1,
      edit_clinic_setup: 1,
      doctorQualification: "",
      isEditClick: false,
      DoctorNameAfterEdit: "",
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
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "DoctorEditProfile",
      screen_class: "EditViewContainer",
    });
  }
  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  Navigateback = () => {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  };

  Navigate() {
    multipleTapHandler.multitap(
      () => this.props.navigation.navigate("DoctorProfileViewContainer"),
      "DoctorProfileViewContainer"
    );
  }

  VCnavigate() {
    this.props.navigation.navigate("VCWhatsAppNumberContainer");
  }

  Addclinicnavigate() {
    this.props.setClinicDetails(null);
    this.props.navigation.navigate("AppointmentContainer");
  }

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
  }

  // if  edit video consultation setup have then show edit VCsetup view else show video consultation setup

  EditVCsetup() {
    if (this.state.edit_vcsetup != 0) {
      return (
        <TouchableOpacity>
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
              <Text
                style={{
                  fontSize: 18,
                  color: "#000000",
                  paddingLeft: 5,
                  flex: 1,
                }}
              >
                Video Consultation{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  multipleTapHandler.multitap(
                    () => this.VCnavigate(),
                    "VCWhatsAppNumberContainer"
                  );
                }}
              >
                <Image
                  source={Purple_Blue_Icon}
                  resizeMode="contain"
                  style={{ height: 15, width: 15 }}
                />
              </TouchableOpacity>
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
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18, color: "#000000", paddingLeft: 5 }}>
                Setup Video Consultation?{" "}
              </Text>
              {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                this.props.doctorProfile.DoctorData.RoleId == 3 ?
                <TouchableOpacity
                  onPress={() => {
                    this.VCnavigate();
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
        </TouchableOpacity>
      );
    }
  }
  DonePress() {
    // alert(this.state.DoctorNameAfterEdit)

    this.props.navigation.goBack();
  }
  editImageOnClick(isEditClick) {
    this.setState({
      isEditClick: !isEditClick,
      DoctorNameAfterEdit:
        this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
    });
  }
  setDoctorName(DoctorName) {
    this.setState({
      DoctorNameAfterEdit: DoctorName,
    });
  }

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <View
          style={{
            flexdirection: "column",
            flex: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <View>
            <HeaderData
              {...this.props}
              isEditClick={this.state.isEditClick}
              bgImage={ic_Blue_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              showIntials={true}
              DoctorFName={this.props.doctorProfile.DoctorData.DoctorFName}
              DoctorLName={this.props.doctorProfile.DoctorData.DoctorLName}
              title={
                "Dr. " +
                this.props.doctorProfile.DoctorData.DoctorFName +
                " " +
                this.props.doctorProfile.DoctorData.DoctorLName
              }
              onGotIt={() => this.onGotIt()}
              leftImage={lefticon}
              // rightImage={Edit_White_Icon}
              type={3}
              // rightImageName={""}
              leftImageOnClick={() => this.leftImageOnClick()}
              iscameraImage={true}
              cameraImage={icon_profile_photo_edit_button}
              cameraImageOnClick={() => this.cameraImageOnClick()}
              photo={this.state.photo}
              iseditImage={true}
              editImage={Edit_White_Icon}
              editImageOnClick={(isEditClick) =>
                this.editImageOnClick(isEditClick)
              }
              setDoctorName={(DoctorName) => this.setDoctorName(DoctorName)}
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
          <EditViewComponent
            {...this.props}
            data={this.props.doctorProfile.DoctorData.ClinicAddresses}
            edit_vcsetup={this.state.edit_vcsetup}
            edit_clinic_setup={this.state.edit_clinic_setup}
            EditVCsetup={() => this.EditVCsetup()}
            Addclinicnavigate={() =>
              multipleTapHandler.multitap(
                () => this.Addclinicnavigate(),
                "AppointmentContainer"
              )
            }
            doctorQualification={this.state.doctorQualification}
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
              paddingVertical: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.DonePress();
              }}
              style={{
                width: "95%",
                borderRadius: 25,
                backgroundColor: "#11cc19",
                paddingVertical: 13,
                alignSelf: "center",
                marginBottom: 5,
              }}
            >
              <Text
                uppercase={true}
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontFamily: "NotoSans-Bold",
                  alignSelf: "center",
                }}
              >
                DONE
              </Text>
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
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  setDoctorData: (docorData) => dispatch(setDoctorData(docorData)),
  setClinicDetails: (clinicAddress) =>
    dispatch(setClinicDetails(clinicAddress)),
  addClinicAddresses: (data) => dispatch(addClinicAddresses(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditViewContainer);
