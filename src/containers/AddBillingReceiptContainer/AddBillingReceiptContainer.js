import React from "react";
import { View, Dimensions, Alert } from "react-native";
import AddBillingReceiptComponent from "../../components/AddBillingReceiptComponent/AddBillingReceiptComponent";
import moment from "moment";
import { connect } from "react-redux";
import { Container } from "native-base";
import { withDb } from "../../DatabaseContext/withDatabase";
import {
  setVCTransactionDetails,
  offlinepayment,
  setPaymentLink,
  setNavigationFlow,
} from "../../actions/patientVisit";
import { doctorServiceProvided } from "../../actions/doctorProfile";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import ToastComponent from "../../components/Toast/toastComponent";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  ic_Blue_BG_578,
  worldwide,
  simple_icons_paytm,
  simple_icons_phonepe,
  UPI,
  Card,
  Cash,
  Cheque,
  Google_Pay_Old,
  Insurance,
  logos_google_pay_icon,
  Net_Banking,
  wallet,
  netbanking,
} from "../../constants/images";
import Images from "../../Theme/Images";

import PrescriptionLoader from "../../components/Loading/prescriptionLoader";
import { def_prescription } from "../../commonmethods/common";
import { setPrescription } from "../../actions/patientVisit";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class AddBillingReceiptContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      setDate: "Select Date",
    };
    this.providerData = [
      "Consultation",
      "Follow up consultation",
      "Telemedicine Consultation",
    ];
    this.invoiceNo = this.props.route.params.invoiceNo;
    this.paymentData = [
      "UPI",
      "Cash",
      "Debit Card",
      "Credit Card",
      "Bank Transfer (NEFT/IMPS)",
      "Google Pay",
      "PhonePe",
      "Paytm UPI",
      "Wallets (Paytm)",
      "Cheque",
      "Insurance",
    ];

    this.iconsPayment = [
      UPI,
      Cash,
      Card,
      Card,
      worldwide,
      logos_google_pay_icon,
      simple_icons_phonepe,
      simple_icons_paytm,
      worldwide,
      Insurance,
      worldwide,
    ];
  }

  handleDate = (date) => {
    //alert(moment(date).format("DD-MMM-YYYY"))
    this.setState(
      { setDate: moment(date).format("MMM-DD-YYYY").toString() },
      () => {
        this.setState({ isDatePickerVisible: false });
      }
    );
  };

  onDateModalOpen() {
    this.setState({ isDatePickerVisible: true });
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "AddBillingReceipt",
      screen_class: "AddBillingReceiptContainer",
    });
  }
  onLeftPress = () => {
    Alert.alert(
      "Prescrip",
      "Do you want to discard your changes ?",
      [
        {
          text: "Discard",
          onPress: () => {
            let defaultPrescription = JSON.parse(
              JSON.stringify(def_prescription)
            );
            this.props.setPrescription(defaultPrescription);

            this.handleBackButtonClick("DiscardReceipt");
          },
        },
        {
          text: "Cancel",

          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  getNameFromApp() {
    this.props.setNavigationFlow("addReceipt");
    multipleTapHandler.clearNavigator();

    this.props.navigation.navigate("PatientSearchComponent", {
      returnPatientData: this.refershList, updateData: this.props.route.params.updateData,
      callFrom: "addReceipt",
    });
  }

  handleBackButtonClick(value) {
    // alert('sd')

    this.props.route.params.updateData();

    this.props.navigation.goBack(null);
    return true;
  }

  onRightIconPress(
    name,
    date,
    validProvided,
    amount,
    validPaymentType,
    remark,
    WholeAddress,
    clinicContact,
    invoiceNo
  ) {
    // alert('dgsg')
    let doctorData = this.props.doctorProfile.DoctorData;
    let itemData =
      this.props.route.params &&
        this.props.route.params.itemData
        ? this.props.route.params.itemData
        : {};

    if (!itemData) {
      return;
    }

    let data = {
      doctorId: doctorData._id,
      transactionId: "",
      digiConsultationId: "",
      amount: amount,
      consultFees: doctorData.ConsultFee,
      remarks: remark,
      patientId: itemData.PatientId,
      mode: validPaymentType,
      patient_Id: itemData._id,
      patientName: itemData.FullName,
      dob: itemData.DOB,
      gender: itemData.Gender,
      mobile: itemData.CountryCode ? itemData.CountryCode + itemData.Mobile : '+91' + itemData.Mobile,
      whatsApp: itemData.whatsApp ? itemData.whatsApp : "",
      age: itemData.age ? itemData.age : "23 Years",
      patientEmail: "",
      serviceProvided: validProvided,
      receiptDate: date,
      clinicAddress: WholeAddress,
      clinicContact: clinicContact,
      invoiceNo
    };

    this.setState({
      loading: true,
    });

    this.props.offlinepayment(data).then((response) => {
      if (response.error) {
        switch (response.error.data) {
          case "Network Error":
            this.setState({
              description: "Currently internet is not avaliable",
            });
            break;
          default:
            this.setState({
              description: "Error in gettting response from server",
            });
            break;
        }

        this.setState({
          editShow: !this.state.editShow,
          loading: false,
          showToast: true,
          toastImagePath: Images.Error,
          toastBgColor: "#d9541d",
          toastTextColor: "#fffefe",

          //   description: payload.data.msg
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        });
        return;
      } else if (response.payload.data.status == 1) {
        this.setState({
          showToast: true,
          loading: false,
          toastBgColor: "#29b62f",
          toastImagePath: Images.Success,
          toastTextColor: "#fafdfa",
          isAddedFav: true,
          description: response.payload.data.msg,
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
          let defaultPrescription = JSON.parse(
            JSON.stringify(def_prescription)
          );
          this.props.setPrescription(defaultPrescription);
          this.handleBackButtonClick("addReceipt");
        }, 1000);
        Keyboard.dismiss();
        // Toast.show({ text: "Saved Successfully.", position: 'bottom' })
      }
    });
  }

  refershList = () => {
    //  alert('dfs')
  };

  render() {
    //let { itemData } = this.props.route.params

    //  let itemData =undefined;
    let itemData =
      this.props.route.params &&
        this.props.route.params.itemData
        ? this.props.route.params.itemData
        : {};

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <AddBillingReceiptComponent
          {...this.props}
          dateHandlePress={this.handleDate}
          setDate={this.state.setDate}
          onDatePress={() => this.onDateModalOpen()}
          isDatePickerVisible={this.state.isDatePickerVisible}
          providerData={[]}
          paymentData={this.paymentData}
          iconsPayment={this.iconsPayment}
          onLeftIconPress={this.onLeftPress}
          invoiceNo={('0' + (isNaN(this.invoiceNo) ? 1 : this.invoiceNo + 1)).slice(-2)}
          onRightIconPress={(
            name,
            date,
            validProvided,
            amount,
            validPaymentType,
            remark,
            WholeAddress,
            clinicContact,
            invoiceNo
          ) =>
            this.onRightIconPress(
              name,
              date,
              validProvided,
              amount,
              validPaymentType,
              remark,
              WholeAddress,
              clinicContact, invoiceNo
            )
          }
          getNameFromApp={() => this.getNameFromApp()}
          fullName={
            itemData && itemData.FullName
              ? itemData.FullName
              : "Select Patient From here"
          }
        />

        {this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              position: "absolute",
            }}
          >
            <PrescriptionLoader
              {...this.props}
              type={"Please wait while submit details..."}
            />
          </View>
        ) : null}

        {this.state.showToast
          ? this.refs.toast.show(
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
          ref="toast"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  setNavigationFlow: (data) => dispatch(setNavigationFlow(data)),
  offlinepayment: (data) => dispatch(offlinepayment(data)),
  doctorServiceProvided: (data) => dispatch(doctorServiceProvided(data)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),

  // updateDoctorDetails: (objectValue, objectKey, doctorId) => dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
  //setDoctorData:(docorData)=>dispatch(setDoctorData(docorData))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AddBillingReceiptContainer));
