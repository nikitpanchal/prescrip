/* created by Ruban */
import React, { Component } from "react";
import { View, BackHandler, Dimensions,StatusBar, Alert } from "react-native";
import { Container } from "native-base";
import {
  ic_share_icon,
  ic_refer_icon,
  ic_link_icon,
  ic_quickrx_icon,
} from "../../constants/images";
import FinalPrescription from "../../components/FinalPrescription/FinalPrescription";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { connect } from "react-redux";
import { StackActions, CommonActions } from '@react-navigation/native';
import { clearCertificate, loadCertificates } from "../../actions/certificates";
import {
  setVCTransactionDetails,
  setPaymentLink,
  getPaymentLink,
  setlab,
  submitRefer,
} from "../../actions/patientVisit";
import { resetTemplateData } from "../../actions/previewSettings";
import { resetOpthalData } from "../../actions/opthal";
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import Images from "../../Theme/Images";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class FinalPrescriptionContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.toastRef= React.createRef();
    this.state = {
      loading: false,
      //Toast States
      description: "",
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: "#4D99E3",
      data: [
        {
          img: ic_refer_icon,
          title: "Refer to",
          details: "Laboratory, Specialist, Pharmacy",
        },
        {
          img: ic_share_icon,
          title: "Share Prescription",
          details: "Via. SMS,Whatsapp,Email & more",
        },
        {
          img: ic_link_icon,
          title: "Share Payment Link",
          details: "Via. SMS,Whatsapp,Email & more",
        },
        {
          img: ic_quickrx_icon,
          title: "Add to QuickRx",
          details: "Save your Rx use multiple times",
        },
      ],
    };
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "PostPrescription",
      screen_class: "PostPrescriptionContainer",
    });
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
    //this.props.navigation.goBack(null);
    return true;
  }

  navigate() {
    this.props.resetOpthalData();
    if (this.props.route.params.item == "Certificate") {
      this.props.resetTemplateData();
      this.props.clearCertificate();
    }
    let referName = { Lab: null, Pharma: null, Specialist: null };
    this.props.setlab(referName);
    multipleTapHandler.clearNavigator();

    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Drawer' }]

    }));

  }
  submitReferData() {
    if (this.props.route.params.item == "Certificate") {
      this.navigate();
      return;
    }
    this.setState({
      loading: true,
    });
    let refer = this.props.patientvisit.referName;
    let prescrip_id = this.props.patientvisit.prescription._id;
    let doctorName =
      this.props.doctorProfile.DoctorData.DoctorFName +
      " " +
      this.props.doctorProfile.DoctorData.DoctorLName;
    let PatientDetails = {
      Mobile: this.props.patientvisit.patientDetails.Mobile,
      FullName: this.props.patientvisit.patientDetails.CommonDetails.FullName,
      Address: this.props.patientvisit.patientDetails.CommonDetails.Address,
    };
    let ReferredDoctorDetails = null;
    if (refer.Specialist) {
      ReferredDoctorDetails = {
        Name: refer.Specialist.Name,
        Mobile: refer.Specialist.Mobile,
        Email: refer.Specialist.Email,
        Address: refer.Specialist.Address,
      };
    }
    let ReferredPharmacyDetails = null;
    if (refer.Pharma) {
      ReferredPharmacyDetails = {
        Name: refer.Pharma.Name,
        Mobile: refer.Pharma.Mobile,
        Email: refer.Pharma.Email,
        Address: refer.Pharma.Address,
      };
    }
    let ReferredPathLabDetails = null;
    if (refer.Lab) {
      ReferredPathLabDetails = {
        Name: refer.Lab.Name,
        Mobile: refer.Lab.Mobile,
        Email: refer.Lab.Email,
        Address: refer.Lab.Address,
      };
    }
    let data = {
      prescriptionId: prescrip_id,
      doctorName: doctorName,
      PatientDetails: PatientDetails,
      ReferredPathLabDetails: ReferredPathLabDetails,
      ReferredPharmacyDetails: ReferredPharmacyDetails,
      ReferredDoctorDetails: ReferredDoctorDetails,
    };
    //Alert.alert(JSON.stringify(data))
    this.props.submitRefer(data).then((response) => {
      let referName = { Lab: null, Pharma: null, Specialist: null };
      this.props.setlab(referName);
      this.setState({
        loading: false,
      });
    });
    multipleTapHandler.multitap(() => this.navigate(), "Drawer");
  }
  showToast(message, textColor, bgColor, image) {
    this.setState({
      showToast: true,
      description: message,
      toastBgColor: bgColor,
      toastTextColor: textColor,
      toastImagePath: image,
      showMealModal: false,
    });
    setTimeout(() => {
      this.setState({
        showToast: false,
        loading: false,
      });
    }, 2500);
  }
  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex:1,  width: Dimensions.get('window').width }}>
              <StatusBar translucent backgroundColor="transparent" />
        <FinalPrescription
          {...this.props}
          data={this.state.data}
          loading={this.state.loading}
          name={this.props.patientname}
          showToast={(message, textColor, bgColor, image) =>
            this.showToast(message, textColor, bgColor, image)
          }
          done={() => this.submitReferData()}
        />
        {this.state.showToast
          ? this.toastRef.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toastTextColor}
              imagePath={this.state.toastImagePath}
              description={this.state.description}
            />,

            2000
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
            width: "95%",
            zIndex: 1000,

            backgroundColor: this.state.toastBgColor,

            borderRadius: 15,
          }}
          ref={(ref) => this.toastRef = ref} 
          // ref="toast"
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
});
const mapDispatchToProps = (dispatch) => ({
  setVCTransactionDetails: (data) => dispatch(setVCTransactionDetails(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  getPaymentLink: (data) => dispatch(getPaymentLink(data)),
  resetTemplateData: () => dispatch(resetTemplateData()),
  clearCertificate: () => dispatch(clearCertificate()),
  setlab: (Name) => dispatch(setlab(Name)),
  submitRefer: (data) => dispatch(submitRefer(data)),
  resetOpthalData: () => dispatch(resetOpthalData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinalPrescriptionContainer);
