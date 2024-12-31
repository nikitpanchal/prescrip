import React, { Component } from "react";
import { Container } from "native-base";
import { Dimensions, StatusBar, View } from "react-native";
import { BackHandler } from "react-native";
import Capsule from "../../components/Capsule";
import DosageHeader from "../../components/Medication/DosageHeader";
import SearchBar from "../../components/Medication/SearchBar";
import DosageForm from "../../components/Medication/DosageForm";
import BrandName from "../../components/Medication/BrandName";
import DoseRegimen from "../../components/Medication/DoseRegimen";
import TherapyDuration from "../../components/Medication/TherapyDuration";
import Dose from "../../components/Medication/Dose";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { setPrescription } from "../../actions/patientVisit";
import { add_custom_data, delete_custom_data } from "../../actions/sync";

import ToastComponent from "../../components/Toast/toastComponent";

import Toast, { DURATION } from "react-native-easy-toast";
import {
  setMedicine,
  setCurrentDosageView,
  setCustomBrand,
  addToPrescription,
  addCustomMedicine,
  resetMedicine,
} from "../../actions/dosage";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class SelectMedication extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      toastTextColor: "",
      toastImgPath: "",
      description: "",
      showToast: "",
      toastBgColor: "",
    };
    this.toast = React.createRef();
  }
  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "AddMedicine",
      screen_class: "SelectMedicine",
    });
    this.props.suggestionPatientData;

    let prescrpition = this.props.patientvisit.prescription;

    if (prescrpition.PrescriptionList.length == 0) {
      this.props.resetMedicine();
    }
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
    this.props.navigation.pop();
    this.props.resetMedicine();
    return true;
  }
  onCapClick() {
    alert("Hi");
  }
  setupToast(toast) {
    this.setState({
      toastTextColor: toast.toastTextColor,
      toastImgPath: toast.toastImgPath,
      description: toast.description,
      showToast: toast.showToast,
      toastBgColor: toast.toastBgColor,
    });
  }
  /*Method to render varois medicine selection stages
   */
  renderStags() {
    switch (this.props.dosage.currentView) {
      case "Dosage Form":
        return <DosageForm {...this.props} />;
      case "Brand Name":
        return <BrandName {...this.props} />;
      case "Dose":
        return <Dose {...this.props} />;
      case "Dose Regimen":
        return <DoseRegimen {...this.props} />;
      case "Duration":
        return <TherapyDuration {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <View style={{ width: Dimensions.get("window").width, flex: 1 }}>
          <DosageHeader
            {...this.props}
            setupToast={(toast) => this.setupToast(toast)}
          />
       
          <View style={{  flex: 1, backgroundColor : '#fafafa' }}>
          <SearchBar {...this.props} />
            {this.renderStags()}</View>
          {this.state.showToast
            ? this.toast.show(
              <ToastComponent
                {...this.props}
                textColorCode={this.state.toastTextColor}
                imagePath={this.state.toastImgPath}
                description={this.state.description}
              />,

              1500
            )
            : null}
          <Toast
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
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  dosage: state.dosage,
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  suggestionPatientData: state.patientvisit.suggestionPatientData,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  setMedicine: (medicine, flow) => dispatch(setMedicine(medicine, flow)),
  setCurrentDosageView: (view) => dispatch(setCurrentDosageView(view)),
  addToPrescription: (list) => dispatch(addToPrescription(list)),
  addCustomMedicine: (medicine) => dispatch(addCustomMedicine(medicine)),
  setPrescription: (data) => dispatch(setPrescription(data)),
  resetMedicine: () => dispatch(resetMedicine()),
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  delete_custom_data: (data) => dispatch(delete_custom_data(data)),
  setCustomBrand: (brand) => dispatch(setCustomBrand(brand)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(SelectMedication));
