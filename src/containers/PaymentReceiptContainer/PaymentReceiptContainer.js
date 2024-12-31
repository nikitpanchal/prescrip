//   code by ravi
import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Linking,
  BackHandler,
} from "react-native";
import { Container, Text, Input } from "native-base";
import PaymentReceiptComponent from "../../components/PaymentReceiptComponent/PaymentReceiptComponent";
import Images from "../../Theme/Images";
import {
  icon_Help,
  Call_white,
  ic_Teal_BG_578,
  lefticon,
  supportcall,
} from "../../constants/images";
import HeaderData from "../../components/Header/header";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import {
  getCurreny,
  getDayWishes,
  month,
  getTime,
} from "../../commonmethods/validation";

import { get_receipt_details } from "../../actions";
import { connect } from "react-redux";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class PaymentReceiptContainer extends Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const { DoctorFName, DoctorLName, Age, Gender } =
      this.props.doctorProfile.DoctorData;

    this.state = {
      doctorFname: DoctorFName,
      doctorLname: DoctorLName,
      age: "-",

      transactionDetails: {},
      gender: "",
    };
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
    this.props.navigation.goBack(null);
    return true;
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();

    this.setReceiptData();
  }

  setReceiptData() {
    const { navigation } = this.props;
    const receviedAmountData = navigation.getParam("receviedAmountData", {});

    this.props
      .get_receipt_details(
        receviedAmountData.transactionId,
        receviedAmountData.patient_Id,
        receviedAmountData.patientId
      )
      .then((payload) => {
        var data = payload.payload.data;
        if (data.status == 0)
          this.setState({ invalid: true, loading: false, isRefresh: true });
        else if (data.status == 1) {
          this.setState({
            transactionDetails: data.transactionDetails,
          });
        }
      });
  }

  //share app link
  async onShare() {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
        " " +
        this.props.doctorProfile.DoctorData.DoctorLName,
      "shared_prescrip_paylink"
    );

    const { navigation } = this.props;

    const receviedAmountData = navigation.getParam("receviedAmountData", {});
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
      this.props.submitErrors("Sidebar", error, "onShare");
      alert(error.message);
    }
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  RightImageOnClick() {
    //alert('sda');

    let phoneNumber = this.props.sync.configData.supportNo
      ? this.props.sync.configData.supportNo
      : "+918850103807";
    // if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);
  }

  transactionlist() {
    const { navigation } = this.props;

    const receviedAmountData = navigation.getParam("receviedAmountData", {});

    var Transactionname = [
      {
        Transaction_name: "Transaction Time & Date",
        Transaction_detail:
          getTime(receviedAmountData.WhenEntered) +
          " " +
          new Date(receviedAmountData.WhenEntered).getDate() +
          " " +
          month[new Date(receviedAmountData.WhenEntered).getMonth()] +
          " " +
          new Date(receviedAmountData.WhenEntered).getFullYear(),
      },
      {
        Transaction_name: "Prescrip Transaction ID",
        Transaction_detail: this.state.transactionDetails.prescripTransactionId,
      },
      {
        Transaction_name: "Mode of Transaction ",
        Transaction_detail: this.state.transactionDetails.mode,
      },
      {
        Transaction_name: "From ",
        Transaction_detail: this.state.transactionDetails.fromPatient,
      },
      {
        Transaction_name: "Bank Transaction ID ",
        Transaction_detail: this.state.transactionDetails.bankTransactionId,
      },
    ];
    return (
      <View>
        {Transactionname.map((item, index) => {
          return (
            <View style={{ flexDirection: "column", paddingVertical: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                key={index}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#8b8b8b",
                    fontFamily: "NotoSans",
                  }}
                >
                  {" "}
                  {item.Transaction_name}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#4f4f4f",
                    fontFamily: "NotoSans",
                  }}
                >
                  {item.Transaction_detail}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  paymentlist() {
    const { navigation } = this.props;
    const receviedAmountData = navigation.getParam("receviedAmountData", {});

    var Amountname = [
      {
        amount_name: "Total Amount",
        amount_money: receviedAmountData.totalAmount,
        images: null,
      },

      {
        amount_name: "Received Amount",
        amount_money: receviedAmountData.receviedAmount,
        images: Images.ic_info_blue,
      },
      {
        amount_name: "Transaction Fee ",
        amount_money: receviedAmountData.transactionFee,
        images: Images.ic_info_blue,
      },
      {
        amount_name: "Platform Fee",
        amount_money:
          receviedAmountData.transactionFee + receviedAmountData.platformFee,
        images: Images.ic_info_blue,
      },
    ];
    return (
      <View>
        {Amountname.map((item, index) => {
          return (
            <View style={{ flexDirection: "column" }}>
              {index == 0 ? (
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#434343",
                      fontFamily: "NotoSans",
                    }}
                  >
                    Total Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      color: "#31aa38",
                      fontFamily: "NotoSans",
                    }}
                  >
                    {"\u20B9" + " " + item.amount_money}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#434343",
                        fontFamily: "NotoSans",
                      }}
                    >
                      {" "}
                      {item.amount_name}
                    </Text>
                    <Image
                      style={{
                        height: 10,
                        width: 10,
                        resizeMode: "contain",
                        marginStart: 5,
                      }}
                      source={item.images}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 22,
                      color: "#0c0c0c",
                      fontFamily: "NotoSans",
                    }}
                  >
                    {"\u20B9" + " " + item.amount_money}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    const { transactionDetails } = this.state;

    const { navigation } = this.props;

    const receviedAmountData = navigation.getParam("receviedAmountData", {});
    const recev_amt = this.props.route.params.receviedAmountData;

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
              bgImage={ic_Teal_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              defaultImage={Images.ic_profile_dummy_image}
              title={
                transactionDetails.fromPatient
                  ? transactionDetails.fromPatient
                  : "N/A"
              }
              receviedAmountDataName={
                transactionDetails.fromPatient
                  ? transactionDetails.fromPatient
                  : "N/A"
              }
              transactionId={receviedAmountData.transactionId}
              description={"25 Yrs " + " | male"} //this.state.age + " yrs " + " | " + this.state.gender
              onGotIt={() => this.onGotIt()}
              leftImage={lefticon}
              rightImage={icon_Help}
              type={3}
              rightImageName={"Help"}
              RightImageOnClick={() => this.RightImageOnClick()}
              leftImageOnClick={() => this.leftImageOnClick()}
              isMenuName={true}
              recev_amt={recev_amt}
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
              backgroundColor: "#fff",
              paddingHorizontal: 15,
            }}
          ></View>

          <PaymentReceiptComponent
            {...this.props}
            paymentlist={() => this.paymentlist()}
            transactionlist={() => this.transactionlist()}
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
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.onShare();
              }}
              //   onPress ={alert('das')}

              style={{
                width: "95%",
                borderRadius: 25,
                backgroundColor: "#03cece",
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
                share receipt
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
  sync: state.sync,
});

const mapDispatchToProps = (dispatch) => ({
  get_receipt_details: (transactionId, patient_Id, patientId) =>
    dispatch(get_receipt_details(transactionId, patient_Id, patientId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentReceiptContainer);
