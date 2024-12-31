import React, { Component } from "react";
import DoctorParentTab from "../../components/DoctorProfileComponent/DoctorParentTab";
import { ic_save_button, ic_close_button } from "../../constants/images";
import { Container, Content, Header } from "native-base";
import { Text, Image, View, BackHandler, Alert } from "react-native";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import {
  updateDoctorProfile,
  setDoctorData,
  updateDoctorDetails,
} from "../../actions/doctorProfile";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";

import Toast, { DURATION } from "react-native-easy-toast";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class EditDoctorDetails extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.toast = React.createRef();
    this.state = {
      loading: false,
      errorField: false,
      tabArrayDoctor: this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
        this.props.doctorProfile.DoctorData.RoleId == 3 ?
        ["camera", "Personal", "Professional", "Practice"] : ["Practice"],
      //Toast States
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
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

  updateDoctorProfile(data, doctorData) {
    doctorData = this.props.doctorProfile.DoctorData;
    doctorData.Age = data.age;
    doctorData.City = data.city;
    doctorData.CouncilName = data.councilName;
    doctorData.DisplayQualificationCSV = data.displayQualification;
    doctorData.DisplaySpecializationCSV = data.displaySpecialization;
    doctorData.DOB = data.doctorDob;
    doctorData.DoctorEmail = data.email;
    doctorData.DoctorFName = data.firstName;
    doctorData.DoctorLName = data.lastName;
    doctorData.Gender = data.gender;
    doctorData.MICRNo = data.micrno;
    doctorData.DoctorImage = data.profilePhoto;
    doctorData.DoctorMobile = data.mobile;
    doctorData.PrimarySpecialization = data.primarySpecialization;
    try {
      this.setState({
        loading: true,
      });
      this.props.updateDoctorProfile(data).then(({ payload, error }) => {
        if (error) {
          this.setState({
            description: "Currently internet is not avaliable",
            toastBgColor: "#d9541d",
            toastTextColor: "#fffefe",
            toastImagePath: Images.Error,
          });
          switch (error.data) {
            case "Network Error":
              this.setState({
                description: "Currently internet is not avaliable",
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error,
              });
              break;
            default:
              this.setState({
                description: "Error in gettting response from server",
                toastBgColor: "#d9541d",
                toastTextColor: "#fffefe",
                toastImagePath: Images.Error,
              });
              break;
          }

          this.setState({
            showToast: true,
            loading: true,
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
            });
          }, 1500);

          return;
        } else {
          this.setState({
            showToast: true,
            description: "Doctor details updated  successfully",
            toastBgColor: "#29b62f",
            toastTextColor: "#fafdfa",
            toastImagePath: Images.Success,
            loading: true,
          });

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false,
            });
            this.closeScreen();
          }, 2000);
          //doctorData.ClinicAddresses = clinic_doc_data.ClinicAddresses["AverageTimePerConsultInMinutes"] = "";
          this.props.setDoctorData(doctorData);
        }
      });
    } catch (err) {
      this.setState({
        showToast: true,
        description: payload.data.msg,
        toastBgColor: "#d9541d",
        toastTextColor: "#fffefe",
        toastImagePath: Images.Error,
      });

      setTimeout(() => {
        this.setState({
          showToast: false,
          loading: false,
        });
      }, 1500);
    }
  }

  closeScreen() {
    this.props.navigation.push("DoctorProfileViewContainer");
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "EditDoctorProfile",
      screen_class: "EditDoctorDetails",
    });
    this.setState({ errorField: false });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <DoctorParentTab
          {...this.props}
          tabType="editDoctor"
          tabTitle="Edit Profile"
          rightImageClick={(data, doctorData) =>
            this.updateDoctorProfile(data, doctorData)
          }
          leftImageClick={() =>
            multipleTapHandler.multitap(
              () => this.closeScreen(),
              "DoctorProfileViewContainer"
            )
          }
          loading={this.state.loading}
          leftImage={ic_close_button}
          rightImage={ic_save_button}
          tabArray={this.state.tabArrayDoctor}
        />
        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toastTextColor}
              imagePath={this.state.toastImagePath}
              description={this.state.description}
            />,

            1500
          )
          : null}
        <Toast
          position="bottom"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",

            backgroundColor: this.state.toastBgColor,

            borderRadius: 15,
          }}
          ref={(ref) => this.toast = ref}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  updateDoctorProfile: (data) => dispatch(updateDoctorProfile(data)),
  setDoctorData: (data) => dispatch(setDoctorData(data)),
  updateDoctorDetails: (objectValue, objectKey, doctorId) =>
    dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(EditDoctorDetails));
