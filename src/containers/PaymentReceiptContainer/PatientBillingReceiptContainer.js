import React from "react";
import { View, Text, Alert } from "react-native";
import {
  SafeAreaView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Image,
  Platform,
  StatusBar,
   
  Linking,
  BackHandler,
} from "react-native";
//import Share from 'react-native-share';
import Share from "react-native-share";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import {
  Payment_Pending_Indication,
  Sucessfull_Received,
  ic_profile_image,
  UPI_Icon,
} from "../../constants/images";
import {
  BillingHeader,
  PatientBillingReceiptPending,
  PatientBillingReceiptReceived,
} from "../../components/PaymentReceiptComponent/PatientBillingReceipt";
import { getPaymentLink } from "../../actions/patientVisit";

import { S3BaseUrl } from "../../../app.json";

import fs from "react-native-fs";

import RNHTMLtoPDF from "react-native-html-to-pdf";
import { get_receipt_details } from "../../actions";
import { connect } from "react-redux";
import { getCurreny, getTime, month } from "../../commonmethods/validation";
import { calculateAge } from "../../commonmethods/common";
import { indexOf } from "lodash";
import {
  wallet,
  netbanking,
  Emi,
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
  refund_indication,
} from "../../constants/images";
import { ScrollView } from "react-native-gesture-handler";
import {
  getScreenNameAnalytics,
  logAnalytics,
} from "../../commonmethods/analytics";
import {
  ic_whatsapp_icon,
  ic_sms_icon,
  ic_mail_icon,
  ic_more_icon,
} from "../../constants/images";
class PatientBillingReceiptContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const { DoctorFName, DoctorLName, Age, Gender } =
      this.props.doctorProfile.DoctorData;
    this.paymentData = [
      "UPI",
      "Cash",
      "Debit Card",
      "Credit Card",
      "Bank Transfer (NEFT/IMPS)",
      " Google Pay",
      "PhonePe",
      "Paytm UPI",
      "Wallets (Paytm)",
      "Cheque",
      "Insurance",

      "Card",
      "Net Banking",
      "wallet",
      "emi",
      "UPI",
      "cash",
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

      Card,
      netbanking,
      Insurance,
      Emi,
      UPI,
      Cash,
    ];

    this.state = {
      doctorFname: DoctorFName,
      doctorLname: DoctorLName,
      age: "-",
      transactionDetails: {},
      gender: "",
      amount: "500",
      shareModal: false,
      share: [
        /*{
        "img": ic_sms_icon,
        "title": "SMS"
      }*/
        {
          img: ic_whatsapp_icon,
          title: "Whatsapp",
        },
        {
          img: ic_mail_icon,
          title: "Mail",
        },
        {
          img: ic_more_icon,
          title: "More",
        },
      ],
    };
  }

  leftImageOnClick() {
    let filterMonth = this.props.route.params.filterMonth;

    this.props.route.params.updateData(filterMonth);
    this.props.navigation.goBack(null);
    return true;
  }

  //back press handler
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
    // alert('sd')
    if (this.state.shareModal) {
      this.setState();
    } else {
      let filterMonth = this.props.route.params.filterMonth;

      this.props.route.params.updateData(filterMonth);
      this.props.navigation.goBack(null);
      return true;
    }
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "BillingReceipt",
      screen_class: "PatientBillingReceiptContainer",
    });
    this.setReceiptData();
  }

  async convertPdf(htmldata, callfrom) {
    let receviedAmountData = this.props.route.params.receviedAmountData;
    let options = {
      html: htmldata,
      fileName: "payment-receipt" + receviedAmountData._id,
      base64: true,
      // backgroundColor: '#FFFFF',
      // paddingRight: parseInt(settings[1]) * 1.35, //Right
      // paddingLeft: parseInt(settings[0]) * 2, //Top
      // paddingTop: parseInt(settings[3]) * 1.35,//Left,
      // paddingBottom: parseInt(settings[2]) * 1.35, //Bottom
    };
    let file = '';

    RNHTMLtoPDF.convert(options)
      .then((fileData) => {
        file = fileData;
        let patientMobile = this.state.transactionDetails.patientMobile;

        if (file && file.filePath && file.filePath != "") {
          switch (callfrom) {
            case "Whatsapp":
              const shareOptions = {
                title: "Share via",
                message: "Please your receipt",
                url: "file://" + file.filePath,
                social: Share.Social.WHATSAPP,
                whatsAppNumber: patientMobile, // country code + phone number
                filename: "prescrip-pay-receipt", // only for base64 file in Android
              };

              Share.shareSingle(shareOptions)
                .then((res) => {
                  var x = ''
                })
                .catch((err) => {
                  var x = ''
                });

              break;

            case "SMS":
              if (Platform.OS == "android") {
                const shareOptions1 = {
                  title: "Share via",
                  type: "application/pdf",
                  message: "Receipt",
                  url: "file://" + file.filePath,
                  social: Share.Social.SMS,
                  recipient: patientMobile,
                  filename: "prescrip-pay-receipt", // only for base64 file in Android
                };

                Share.shareSingle(shareOptions1)
                  .then((res) => { })
                  .catch((err) => { });
              } else {
                Share.open({ url: "file://" + file.filePath })
                  .then((res) => { })
                  .catch((ex) => { });
              }


              break;

            case "Mail":
              let receviedAmountData = this.props.route.params.receviedAmountData;

              let subject =
                "Payment Receipt for " +
                (receviedAmountData.PayType == 1 || receviedAmountData.PayType == 2
                  ? `Video Consultation`
                  : receviedAmountData.PayType == 3
                    ? "Prescrip Pay Link"
                    : `${this.state.transactionDetails.serviceProvided
                      ? this.state.transactionDetails.serviceProvided
                      : "N/A"
                    } `);
              // if(Platform.OS == "android")
              // {

              const shareOptions2 = {
                title: "Share via",
                type: "application/pdf",
                message: subject ? subject : "Receipt",
                url: "file://" + file.filePath,
                social: Share.Social.EMAIL,
                recipient: patientMobile,
                filename: "prescrip-pay-receipt", // only for base64 file in Android
              };

              Share.shareSingle(shareOptions2)
                .then((res) => {
                  this.setState({
                    shareModal: false,
                  });
                })
                .catch((err) => {
                  var x = '';

                });

              /* }else{
       
               
                   Share.open({ url: "file://" + file.filePath }).then((res) => {
       
                   }).catch((ex) => {
         
                   });
       
                 }*/

              break;

            default:
              Share.open({ url: "file://" + file.filePath })
                .then((res) => { })
                .catch((ex) => {
                  this.setState({
                    shareModal: false,
                  });
                });

              break;
          }
        } else {

        }
      }).catch((e) => {
        alert("File not found");
      });





  }

  findDefaultClinicAddress(address) {
    for (let i = 0; i < address.length; i++) {
      if (address[i].IsDefault == 1) {
        let data = `${address[i].ClinicName} ${address[i].Address} ${address[i].City} ${address[i].State} ${address[i].Pincode}`;

        return data;
      }
    }
    // address.map(i => {
    //   if (i.IsDefault == 1) {
    //     var data = `${i.ClinicName} ${i.Address} ${i.City} ${i.State} ${i.Pincode}`
    //     return data
    //   } else {

    //   }
    // })
  }

  htmlReplace(htmlcontent, callfrom) {
    let transactionDetails = this.state.transactionDetails;
    let receviedAmountData = this.props.route.params.receviedAmountData;
    var clinicContact = transactionDetails.clinicContact;
    if (receviedAmountData.PayType == 4) {
      if (clinicContact == '') {
        var getDefaultClinic = this.props.doctorProfile.DoctorData.ClinicAddresses.find(x => x.IsDefault == 1);

        if (getDefaultClinic)
          clinicContact = getDefaultClinic.ContactNo;
        else
          clinicContact = this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ?
            this.props.doctorProfile.DoctorData.ClinicAddresses[0].ContactNo : "";
      }
      htmlcontent = htmlcontent.replace(
        /DateTime/,
        `${new Date(transactionDetails.receiptDate).getDate() +
        " " +
        month[new Date(transactionDetails.receiptDate).getMonth()] +
        " " +
        new Date(transactionDetails.receiptDate).getFullYear()
        }`
      );
    } else {
      var getDefaultClinic = this.props.doctorProfile.DoctorData.ClinicAddresses.find(x => x.IsDefault == 1);

      if (getDefaultClinic)
        clinicContact = getDefaultClinic.ContactNo;
      else
        clinicContact = this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ?
          this.props.doctorProfile.DoctorData.ClinicAddresses[0].ContactNo : "";
      htmlcontent = htmlcontent.replace(
        /DateTime/,
        `${getTime(receviedAmountData.WhenEntered)} ${new Date(receviedAmountData.WhenEntered).getDate() +
        " " +
        month[new Date(receviedAmountData.WhenEntered).getMonth()] +
        " " +
        new Date(receviedAmountData.WhenEntered).getFullYear()
        }`
      );
    }

    htmlcontent = htmlcontent.replace(
      /ReceiptNo/,
      `${transactionDetails.invoiceNo
        ? transactionDetails.invoiceNo
        : "N/A"
      } `
    );
    htmlcontent = htmlcontent.replace(
      /DoctorName/,
      `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`
    );
    htmlcontent = htmlcontent.replace(
      /DisplayQualificationCSV/,
      `${this.props.doctorProfile.DoctorData.DisplayQualificationCSV} `
    );
    htmlcontent = htmlcontent.replace(
      /DisplaySpecializationCSV/,
      `${this.props.doctorProfile.DoctorData.DisplaySpecializationCSV} `
    );
    let clinicDetails = receviedAmountData.PayType == 1 ||
      receviedAmountData.PayType == 2 ||
      receviedAmountData.PayType == 3
      ? this.props.doctorProfile.DoctorData.ClinicAddresses
        ? this.findDefaultClinicAddress(
          this.props.doctorProfile.DoctorData.ClinicAddresses
        )
        : "N/A"
      : receviedAmountData.PayType == 7 ? "PRESCRIP HEALTH TECHNOLOGY LLP" : `${transactionDetails.clinicAddress
        ? transactionDetails.clinicAddress
        : "N/A"
        } `;
    htmlcontent = htmlcontent.replace(
      /DoctorAddress/,
      clinicDetails
    );
    htmlcontent = htmlcontent.replace(
      /<%docclinicheader%>/,
      clinicDetails
    );
    htmlcontent = htmlcontent.replace(
      /DoctorEmail/,
      `${receviedAmountData.PayType == 7 ? "" : this.props.doctorProfile.DoctorData.DoctorEmail} `
    );
    htmlcontent = htmlcontent.replace(
      /DoctorMobile/,
      `${receviedAmountData.PayType == 7 ? "" : clinicContact} `
    );
    htmlcontent = htmlcontent.replace(
      /PatientName/,
      `${transactionDetails.commonDetails ? transactionDetails.commonDetails.FullName : this.props.doctorProfile.DoctorData.DoctorFName + ' ' + this.props.doctorProfile.DoctorData.DoctorLName} `
    );
    htmlcontent = htmlcontent.replace(
      /TransactionNo/,
      `${receviedAmountData.transactionId} `
    );
    htmlcontent = htmlcontent.replace(
      /TotalFee/,
      `${receviedAmountData.totalAmount} `
    );
    htmlcontent = htmlcontent.replace(
      /ConsultFees/,
      `${receviedAmountData.totalAmount} `
    );
    htmlcontent = htmlcontent.replace(
      /<%remarks%>/,
      `${transactionDetails.Remarks ? transactionDetails.Remarks : ""} `
    );
    htmlcontent = htmlcontent.replace(
      /PaymentMethod/,
      `${transactionDetails.mode ? transactionDetails.mode : "N/A"} `
    );
    htmlcontent = htmlcontent.replace(
      /<%description%>/,
      receviedAmountData.PayType == 1 || receviedAmountData.PayType == 2
        ? `Video Consultation`
        : receviedAmountData.PayType == 3
          ? "Prescrip Pay Link"
          : receviedAmountData.PayType == 7
            ? this.state.transactionDetails.Remarks
            : `${this.state.transactionDetails.serviceProvided
              ? this.state.transactionDetails.serviceProvided
              : "N/A"
            } `
    );
    htmlcontent = htmlcontent.replace(
      /PaymentStatus/,
      `${receviedAmountData.IsRefunded == 1 &&
        receviedAmountData.IsCancelled == null
        ? "Refunded"
        : receviedAmountData.callfrom == "viewReceipt"
          ? "Received"
          : "Pending"
      } `
    );
    htmlcontent = htmlcontent.replace(
      /DoctorWhatsapp/,
      `${receviedAmountData.PayType == 7 ? "" : this.props.doctorProfile.DoctorData.DoctorWhatsapp
        ? this.props.doctorProfile.DoctorData.DoctorWhatsapp
        : "N/A"
      } `
    );

    htmlcontent = htmlcontent.replace(
      /<%doctorLogo%>/,
      `${receviedAmountData.PayType == 7 ? `<img src="https://web.prescrip.in/images/pcd_logo.png"
      style='width: 80px; margin-bottom: 10px; floar:left;'
      alt='LOGO' />` : this.props.doctorProfile.DoctorData.Logo
        ? `<img src='` + "https://s3-ap-southeast-1.amazonaws.com/prescripimage/images/" + this.props.doctorProfile.DoctorData.Logo + `'
        style='width: 80px; margin-bottom: 10px; floar:left;'
        alt='LOGO' />`
        : ""
      } `
    );

    this.convertPdf(htmlcontent, callfrom);

  }
  getFileTxt(callfrom) {

    if (Platform.OS == "android") {
      fs.readFileAssets("Receipt.txt")
        .then((result) => {
          var htmlcontent = result.toString();

          this.htmlReplace(htmlcontent, callfrom);
        })
        .catch((err) => {
          let x = ''
        });
    } else {
      this.readFile(callfrom);
      /*
      
      fs.readFile(fs.MainBundlePath + "/AntDesign.ttf",).then(result => {
        
        var htmlcontent = result[36].path + "/Receipt.txt".toString();
  
        this.htmlReplace(htmlcontent)
        
  
  
  
        this.convertPdf(htmlcontent)
  
      }).catch(err =>
        
  
  */
    }
  }

  readFile = async (callfrom) => {
    try {

      const path = fs.MainBundlePath + "/db/Receipt.txt";
      const contents = await fs.readFile(path, "utf8");

      var htmlcontent = contents.toString();

      this.htmlReplace(
        htmlcontent,
        Platform.OS != "android" && callfrom == "Whatsapp" ? "more" : callfrom
      );

      return "" + contents;
    } catch (e) {
      alert("" + e);
    }
  };
  setReceiptData() {
    const day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const { navigation } = this.props;
    const receviedAmountData = this.props.route.params.receviedAmountData;

    this.props
      .get_receipt_details(
        receviedAmountData.transactionId,
        receviedAmountData.patient_Id == '' ? '6009cb85e65f6dce28fb3e51' : receviedAmountData.patient_Id,
        receviedAmountData.patientId == '' ? 0 : receviedAmountData.patientId
      )
      .then((payload) => {
        var data = payload.payload.data;
        if (data.status == 0)
          this.setState({ invalid: true, loading: false, isRefresh: true });
        else if (data.status == 1) {
          let transactionDetails = data.transactionDetails;
          transactionDetails.mode =
            transactionDetails.mode == "netbanking"
              ? "Net Banking"
              : transactionDetails.mode == "card"
                ? "Card"
                : transactionDetails.mode == "upi"
                  ? "UPI"
                  : transactionDetails.mode == "wallet"
                    ? "Wallet"
                    : transactionDetails.mode;

          let serviceProvided = transactionDetails.serviceProvided
            ? transactionDetails.serviceProvided.split(",")
            : [];

          serviceProvided.forEach(function (item, i) {
            if (item === "Video Consulation") {
              serviceProvided.splice(i, 1);
              serviceProvided.unshift(item);
            }
            if (item === "Clinic Appointment") {
              serviceProvided.splice(i, 1);
              serviceProvided.unshift(item);
            }
          });

          transactionDetails.serviceProvided = serviceProvided;
          // alert('dsf')
          this.setState({
            transactionDetails: transactionDetails,
          });
        }
      });
  }

  RightImageOnClick() {
    //alert('sda');

    let phoneNumber = this.props.sync.configData.supportNo
      ? this.props.sync.configData.supportNo
      : "+918850103807";
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }

  shareLink() {
    const receviedAmountData = this.props.route.params.receviedAmountData;

    if (receviedAmountData.PayType == 3 || receviedAmountData.PayType == 7) {
      let msg =
        "Hello, you can make payment using the below link \n" +
        receviedAmountData.PayLink;

      this.onshare1(msg);
    } else {
      let transactionDetails = this.state.transactionDetails;

      let age = calculateAge(transactionDetails.commonDetails.DOB, false);

      let data = {
        doctorId: this.props.doctorProfile.DoctorData._id,

        transactionId: transactionDetails.prescripTransactionId, //this.props.patientvisit.vc_trans_id,
        digiConsultationId: receviedAmountData._id,

        amount: parseFloat(receviedAmountData.totalAmount.toString()).toFixed(
          2
        ),
        consultFees: this.props.doctorProfile.DoctorData.ConsultFee
          ? parseFloat(
            this.props.doctorProfile.DoctorData.ConsultFee.toString()
          ).toFixed(2)
          : 0,
        patientId: transactionDetails.commonDetails.id,
        patient_Id: receviedAmountData.patient_Id,
        patientName: transactionDetails.commonDetails.FullName,
        dob: transactionDetails.commonDetails.DOB,
        gender: transactionDetails.commonDetails.Gender,
        mobile: transactionDetails.Mobile ? transactionDetails.Mobile : "",
        whatsApp: transactionDetails.commonDetails.Whatsapp
          ? transactionDetails.commonDetails.Whatsapp
          : "",
        age: age.value + " " + age.units,
        remarks: "",
        patientEmail: transactionDetails.commonDetails.EmailAddress,
      };

      this.props.getPaymentLink(data).then((response) => {
        if (response.payload.data.status == 1) {
          let msg =
            "Hello, you can make payment using the below link \n" +
            response.payload.data.payLink;

          this.onshare1(msg);
        }
      });
    }
  }

  async onshare1(msg) {
    try {
      logAnalytics(
        this.props.doctorProfile.DoctorData._id,
        this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
        "shared_billing_receipt"
      );
      // let msg = 'Hello, you can view my clinic(s) & take an appointment for Video Consultation using below link \n'+this.state.transactionDetails.receiptUri;
      const result = await rShare.share({
        message: msg,
      });

      if (result.action === rShare.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === rShare.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }

  //share app link
  async onShare() {
    const { navigation } = this.props;

    const receviedAmountData = this.props.route.params.receviedAmountData;
    const { DoctorFName, DoctorLName, Age, Gender } =
      this.props.doctorProfile.DoctorData;

    try {
      let msg = "";
      if (receviedAmountData.IsPaid == 0) {
        msg =
          "Payment of " +
          getCurreny() +
          receviedAmountData.totalAmount +
          " is pending to " +
          DoctorFName +
          " " +
          DoctorLName +
          ". The details can be viewed using the link below \n" +
          this.state.transactionDetails.receiptUri;
      } else {
        msg =
          getCurreny() +
          receviedAmountData.totalAmount +
          " was paid to " +
          DoctorFName +
          " " +
          DoctorLName +
          ". The receipt for the same can be view using the link below \n" +
          this.state.transactionDetails.receiptUri;
      }

      // let msg = 'Hello, you can view my clinic(s) & take an appointment for Video Consultation using below link \n'+this.state.transactionDetails.receiptUri;
      const result = await rShare.share({
        message: msg,
      });

      if (result.action === rShare.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === rShare.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }

  render() {
    const day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const { navigation } = this.props;
    const receviedAmountData = this.props.route.params.receviedAmountData;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />

        <ScrollView
          style={{
            flex: 1,
            top: Platform.OS === "ios" ? null : StatusBar.currentHeight,
            marginBottom:
              Platform.OS === "ios" ? null : StatusBar.currentHeight,
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.shareModal}
            ref={"meal"}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS == "ios" ? "padding" : null}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              >
                {/*Close Button*/}
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      shareModal: false,
                      showMealModal: true,
                    })
                  }
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#ffffff",
                      fontFamily: "NotoSans-Bold",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
                {/*Close Button Ends*/}

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.state.share.map((item) => {
                    return (
                      <TouchableOpacity
                        onPress={() => this.getFileTxt(item.title)}
                        style={{
                          flex: 0.33,
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <Image
                          source={item.img}
                          style={{ height: 50, resizeMode: "contain" }}
                        />
                        <Text
                          style={{
                            color: item.color,
                            fontSize: 12,
                            fontFamily: "NotoSans",
                            color: "#737373",
                          }}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          <BillingHeader
            {...this.props}
            amount={receviedAmountData.totalAmount}
            paymentStatus={
              receviedAmountData.PayType == 5
                ? "Refunded"
                : receviedAmountData.IsRefunded == 1 &&
                  receviedAmountData.IsCancelled == null
                  ? "Refunded"
                  : receviedAmountData.callfrom == "viewReceipt"
                    ? "Received"
                    : "Pending"
            }
            paymentType={"UPI Payment"}
            paymentTypeImg={UPI_Icon}
            PayType={receviedAmountData.PayType}
            IsRefunded={
              receviedAmountData.PayType == 5
                ? true
                : receviedAmountData.IsRefunded
            }
            IsCancelled={
              receviedAmountData.PayType == 5
                ? true
                : receviedAmountData.IsCancelled
            }
            fees={"30.25"}
            leftImageOnClick={() => this.leftImageOnClick()}
            serviceProvided={this.state.transactionDetails.serviceProvided}
            amountReceived={receviedAmountData.totalAmount}
            statusImg={
              receviedAmountData.PayType == 5
                ? refund_indication
                : receviedAmountData.callfrom == "viewReceipt"
                  ? Sucessfull_Received
                  : Payment_Pending_Indication
            }
            //  statusImg={receviedAmountData.IsRefunded || receviedAmountData.IsCancelled ?  refund_indication :receviedAmountData.callfrom == "viewReceipt" ? Sucessfull_Received : Payment_Pending_Indication}

            //statusImg={Payment_Pending_Indication}

            prescripTxt={
              receviedAmountData.PayType == 1 || receviedAmountData.PayType == 2
                ? " Video Consulation "
                : receviedAmountData.PayType == 3
                  ? " Precrip Pay Link "
                  : receviedAmountData.PayType == 7
                    ? " Precrip Subscription "
                    : receviedAmountData.PayType == 4
                      ? " Offline Payment "
                      : ""
            }
            borderColorCode={
              receviedAmountData.PayType == 1 || receviedAmountData.PayType == 2
                ? "#820091"
                : receviedAmountData.PayType == 3 || receviedAmountData.PayType == 7
                  ? "#02798a"
                  : "gray"
            }
            profileImg={
              this.state.transactionDetails.userImage
                ? {
                  uri:
                    S3BaseUrl +
                    "patientimg/" +
                    this.state.transactionDetails.userImage,
                }
                : ic_profile_image
            }
            isReceived={
              receviedAmountData.callfrom == "viewReceipt" ? true : false
            }
            patientName={receviedAmountData.Name}
            day={day[new Date(receviedAmountData.WhenEntered).getDay()] + " "}
            // shareReceipt={() => alert('dfsdfs')}
            time={
              receviedAmountData.PayType != 4
                ? getTime(receviedAmountData.WhenEntered) + " "
                : ""
            }
            // this.state.transactionDetails.receiptDate?  getTime(this.state.transactionDetails.receiptDate) + " ":''}
            date={
              receviedAmountData.PayType == 4
                ? this.state.transactionDetails.receiptDate
                  ? new Date(
                    this.state.transactionDetails.receiptDate
                  ).getDate() +
                  " " +
                  month[
                  new Date(
                    this.state.transactionDetails.receiptDate
                  ).getMonth()
                  ] +
                  " " +
                  new Date(
                    this.state.transactionDetails.receiptDate
                  ).getFullYear()
                  : "-"
                : new Date(receviedAmountData.WhenEntered).getDate() +
                " " +
                month[new Date(receviedAmountData.WhenEntered).getMonth()] +
                " " +
                new Date(receviedAmountData.WhenEntered).getFullYear()
            }
          // date={"20-Sep-2020"}
          />
          <View style={{ flex: 0.7, padding: 20 }}>
            {receviedAmountData.callfrom == "viewReceipt" ? (
              <PatientBillingReceiptReceived
                {...this.props}
                // leftImageOnClick={() => this.leftImageOnClick()}

                amount={receviedAmountData.totalAmount}
                IsRefunded={
                  receviedAmountData.PayType == 5
                    ? true
                    : receviedAmountData.IsRefunded
                }
                IsCancelled={
                  receviedAmountData.PayType == 5
                    ? true
                    : receviedAmountData.IsCancelled
                }
                paymentType={
                  this.state.transactionDetails.mode
                    ? this.state.transactionDetails.mode
                    : "N/A"
                }
                paymentTypeImg={
                  this.iconsPayment[
                    this.paymentData.indexOf(this.state.transactionDetails.mode)
                  ]
                    ? this.iconsPayment[
                    this.paymentData.indexOf(
                      this.state.transactionDetails.mode
                    )
                    ]
                    : UPI_Icon
                }
                transactionFee={receviedAmountData.transactionFee}
                platformFee={receviedAmountData.platformFee}
                fees={
                  receviedAmountData.transactionFee +
                  receviedAmountData.platformFee
                }
                amountReceived={receviedAmountData.receviedAmount}
                statusImg={Sucessfull_Received}
                remark={
                  receviedAmountData.IsRefunded == 1 &&
                    receviedAmountData.IsCancelled == null
                    ? "Remarks: Appointment has been cancelled by you"
                    : receviedAmountData.PayType == 4 || receviedAmountData.PayType == 7
                      ? "Remarks: " +
                      (this.state.transactionDetails.Remarks
                        ? this.state.transactionDetails.Remarks
                        : "")
                      : "Remarks: For Video Consultation on " +
                      day[new Date(receviedAmountData.WhenEntered).getDay()] +
                      " " +
                      new Date(receviedAmountData.WhenEntered).getDate() +
                      " " +
                      month[
                      new Date(receviedAmountData.WhenEntered).getMonth()
                      ] +
                      " " +
                      new Date(receviedAmountData.WhenEntered).getFullYear() +
                      (this.state.transactionDetails.Remarks
                        ? "(" + this.state.transactionDetails.Remarks + ")"
                        : "")
                }
                profileImg={
                  this.state.transactionDetails.userImage
                    ? {
                      uri:
                        S3BaseUrl +
                        "patientimg/" +
                        this.state.transactionDetails.userImage,
                    }
                    : ic_profile_image
                }
                isReceived={true}
                patientName={receviedAmountData.Name}
                transactionId={receviedAmountData.transactionId}
                day={day[new Date(receviedAmountData.WhenEntered).getDay()]}
                // shareReceipt={() => alert('dfsdfs')}
                shareReceipt={() => {
                  logAnalytics(
                    this.props.doctorProfile.DoctorData._id,
                    this.props.doctorProfile.DoctorData.DoctorFName +
                    " " +
                    this.props.doctorProfile.DoctorData.DoctorLName,
                    "shared_billing_receipt"
                  ),
                    this.getFileTxt("More");
                }}
                RightImageOnClick={() => {
                  this.RightImageOnClick();
                }}
                PayType={receviedAmountData.PayType}
                time={getTime(receviedAmountData.WhenEntered) + " "}
                date={
                  new Date(receviedAmountData.WhenEntered).getDate() +
                  " " +
                  month[new Date(receviedAmountData.WhenEntered).getMonth()] +
                  " " +
                  new Date(receviedAmountData.WhenEntered).getFullYear()
                }
              />
            ) : (
              <PatientBillingReceiptPending
                {...this.props}
                // leftImageOnClick={() => this.leftImageOnClick()}

                amount={receviedAmountData.totalAmount}
                paymentStatus={"Pending"}
                paymentType={
                  this.state.transactionDetails.mode
                    ? this.state.transactionDetails.mode
                    : "N/A"
                }
                paymentTypeImg={UPI_Icon}
                fees={
                  receviedAmountData.transactionFee +
                  receviedAmountData.platformFee
                }
                amountReceived={receviedAmountData.receviedAmount}
                statusImg={Payment_Pending_Indication}
                prescripTxt={"prescrip pay link"}
                profileImg={
                  this.state.transactionDetails.userImage
                    ? {
                      uri:
                        S3BaseUrl +
                        "patientimg/" +
                        this.state.transactionDetails.userImage,
                    }
                    : ic_profile_image
                }
                isReceived={true}
                patientName={receviedAmountData.Name}
                transactionId={receviedAmountData.transactionId}
                day={day[new Date(receviedAmountData.WhenEntered).getDay()]}
                // shareReceipt={() => alert('dfsdfs')}
                shareLink={() => {
                  this.shareLink();
                }}
                RightImageOnClick={() => {
                  this.RightImageOnClick();
                }}
                time={getTime(receviedAmountData.WhenEntered) + " "}
                date={
                  new Date(receviedAmountData.WhenEntered).getDate() +
                  " " +
                  month[new Date(receviedAmountData.WhenEntered).getMonth()] +
                  " " +
                  new Date(receviedAmountData.WhenEntered).getFullYear()
                }
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});

const mapDispatchToProps = (dispatch) => ({
  get_receipt_details: (transactionId, patient_Id, patientId) =>
    dispatch(get_receipt_details(transactionId, patient_Id, patientId)),
  getPaymentLink: (data) => dispatch(getPaymentLink(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientBillingReceiptContainer);
