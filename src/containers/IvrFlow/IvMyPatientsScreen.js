//This is an example code for Bottom Navigation//
import React from "react";
//import react in our code.
//import all the basic component we have used

import {
  BG,
  lefticon,
  icon_close_white,
  ic_back_black,
  icon_search_button_blue,
  ic_Close_Button,
  icon_Reemove_Button,
  trans_collapsed,
  trans_expand,
  ic_Teal_BG_578,
  ic_Blue_BG_578,
  icon_search_white,
  icon_Three_Dot_Menu_Button,
  ic_Purple_BG_578,
  ic_black_back,
  ic_Orange_BG_578,
  icon_List_First_Element_Add_Button_Blue,
} from "../../constants/images";
import {
  get_pending_videoconsultation,
  mark_done_consultation,
  cancel_consultation,
} from "../../actions";
import { Container, Text, Icon, Button } from "native-base";
import {
  Alert,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
 
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import { setDoctorData } from "../../actions/doctorProfile";
import {
  editPatentDetails,
  patientPrescriptionList,
  setPatientData,
  updatePatientOBHistory,
  discardPatient,
} from "../../actions/patientProfie";
import { setPatientId, getRxList } from "../../actions/patientVisit";
import Database from "../../utils/db";
import {
  setVCTransactionDetails,
  setPaymentLink,
  setNavigationFlow,
} from "../../actions/patientVisit";
import multipleTapHandler from "../../components/MultiTapHandle/index";

import { add_custom_data } from "../../actions/sync";

import {
  empty_PatientList,
  ic_Add_Clinic_Button,
  blue_circle_with_plus,
  icon_Help,
  icon_Left_Button,
  icon_Right_Button,
  icon_Wallet_Icon,
  ic_clock,
  Profile_Image,
  ic_Add_Prescription,
  ic_Contact,
  ic_Mark_as_done,
  ic_Cancel_Appoointment,
  ic_Patient_Image,
  ic_whatsapp,
} from "../../constants/images";
import { ic_sync_fab, ic_sync_small } from "../../constants/images";

import { FloatingAction } from "react-native-floating-action";

import LottieView from "lottie-react-native";

import SyncModal from "../../components/Modal/syncModal";
//import react in our code.
//import all the components we are going to uddse.

import Images from "../../Theme/Images";
import PrescriptionHeader from "../../components/PrescriptionHeader/PrescriptionHeader";
import EmptyHome from "../../components/EmptyHome/EmptyHome";

import {
  getCurreny,
  getDayWishes,
  month,
  isName,
} from "../../commonmethods/validation";
import { set } from "react-native-reanimated";
import PatientComponent from "../../components/PatientComponent/PatientComponent";
//import AddClinicPopup from '../Modal/addClinicPopup';
import { patients_list, delete_patient } from "../../actions";
const colorCode = "#881896";
const passMothFirstDate = new Date(
  new Date().setMonth(new Date().getMonth() - 1)
); // new Date();
import ToastComponent from "../../components/Toast/toastComponent";
const { height, width } = Dimensions.get("window");
import Toast, { DURATION } from "react-native-easy-toast";
import { Gpal } from "../../commonmethods/common";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class MyPatientsScreen extends React.Component {
  //Setting Screen to show in Setting Option

  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;
    this.toast = React.createRef();
    this.myText  = React.createRef();
    this.state = {
      showSyncModal: false,
      finalArrayAfterTabClick: [],
      passMothFirstDate: passMothFirstDate,
      dataIsPresent: true,
      isShowButton: false,
      startIndex: 0,
      EmptyHomeTitle: "No patients",
      EmptyHomeDescription:
        "Looks like you havent added any Patient, add from here",
      toolTipVisible: false,
      isConsulting: false,
      pendingCunsultingTitle: false
        ? "Showing pending consultations"
        : "No consultation yet",
      pendingCunsultingDescription: "Khurana Clinic ˅ ",
      isPendingCunsulting: false,
      phonenumber: "",
      firstSearch: true,
      normalComplients: [],
      pastComplients: [],
      isSearchBoxShowing: false,
      selectedComplients: [],
      newName: "",
      searchText: "",
      //state to control the visibility of Tooltip
    };
  }

  onClick() {
    this.props.screenProps.rootNavigation.navigate("VCWhatsAppNumberContainer");
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
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }
  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    return true;
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "MyPatients",
      screen_class: "IvMyPatientsScreen",
    });
    this.setVCDPage();

     
  }

   

  addPatientCustom() {
    if (isName(this.searchText) == "name") {
      this.props.setNavigationFlow("Appointments");
      this.props.navigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
        patientName: this.searchText,
        showSearch: false,
      });
      this.props.editPatentDetails(true);
      //Clear out redux data
      this.props.discardPatient();
    } else if (isName(this.searchText) == "number") {
      this.props.setNavigationFlow("Appointments");
      this.props.navigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
        patientNumber: this.searchText,
        showSearch: false,
      });
      this.props.editPatentDetails(true);
      //Clear out redux data
      this.props.discardPatient();
    } else {
      Alert.alert("Prescrip", "Please search either number or name");
    }

    //this.props.screenProps.rootNavigation.navigate('DoctorProfileViewContainer');
  }

  addPatient() {
    if (this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0) {
      //this.props.screenProps.rootNavigation.navigate('DoctorProfileViewContainer');

      this.props.setNavigationFlow("Appointments");
      this.props.navigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
      });
      this.props.editPatentDetails(true);
      //Clear out redux data
      this.props.discardPatient();
    } else {
      Alert.alert("Prescrip", "Please add a clinic before proceeding.");
      //this.showalertModal()
    }
  }

  hitNextData(startIndex) {
    // this.searchText ="";
    this.firstSearch = false;
    this.startIndex = startIndex;

    this.setVCDPage();
  }

  setVCDPage() {
    
    this.props
      .patients_list(
        this.startIndex,
        10,
        this.searchText,
        "",
        0,
        "",
        this.props.doctorProfile.DoctorData._id
      )
      .then((payload) => {
         
        var data = payload.payload.data;
      
        if (data.status == 0) {
          if (this.firstSearch) {
            this.setState({
              invalid: true,
              loading: false,
              isRefresh: true,
              finalArrayAfterTabClick: [],
              dataIsPresent: false,
            });
          }  
        } else if (data.status == 1) {
          if (this.firstSearch) {
            this.setState({
              finalArrayAfterTabClick: [],
              firstSearch: false,
            });
          }
          if (data.data.length > 0) {
            this.setState({
              finalArrayAfterTabClick:
                this.state.finalArrayAfterTabClick.concat(data.data),
              dataIsPresent: true,
            });
          } else {
            this.setState({
              finalArrayAfterTabClick: [],
              dataIsPresent: false,
            });
          }
        } else if (Array.isArray(data)) {
          this.setState({
            finalArrayAfterTabClick: data,
            firstSearch: false,
          });
        }
      });
  }

  filterArrayDateWise(data_for_list) {
    var dateStr = null;
    var dateStrCompare = null;
    var finalArray = [];
    var dateViaArray = [];
    data_for_list.forEach(function (element, i) {
      const compareDate = new Date(element.WhenEntered);

      dateStrCompare =
        compareDate.getDate() +
        " " +
        month[compareDate.getMonth() + 1] +
        " " +
        compareDate.getFullYear();

      if (i == 0) {
        dateStr = dateStrCompare;
      }

      if (dateStr != dateStrCompare) {
        finalArray.push({ title: dateStr, data: dateViaArray });

        dateStr = dateStrCompare;
        // dateViaArray.push(element)
        dateViaArray = [];
      }

      dateViaArray.push(element);

      if (data_for_list.length == i + 1) {
        finalArray.push({ title: dateStrCompare, data: dateViaArray });
        dateViaArray = [];
      }
    });

    // alert(finalArray.data.reduce((accum,item) => accum + item.ConsultFees, 0))

    this.setState({
      finalArrayAfterTabClick: finalArray,
      //monthlyEarning:
    });
  }

  itemLongClick(item) {
    Alert.alert(
      "Prescrip",
      "Are you sure want to delete " + item.FullName + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.confirmationClick(item._id, item.Cid),
        },
      ],
      { cancelable: true }
    );
  }

  confirmationClick(id, cid) {
    let doctor_id = this.props.doctorProfile.DoctorData._id;
    this.props.delete_patient(id, doctor_id, cid, 1).then((data) => {
      if (data.payload.data.status == 2000) {
        this.searchText = "";
        this.firstSearch = true;
        this.startIndex = 0;

        this.setVCDPage();

        this.setState({
          showToast: true,
          description: data.payload.data.message,
        });

        setTimeout(() => {
          this.setState({
            showToast: false,
          });
        }, 2000);
      } else {
        Alert.alert("Prescrip", data.payload.data.msg);
        this.setState({
          loading: false,
        });
      }
    });
  }
  secondMenuImageOnClick() {
    // alert('dsa');
    this.props.screenProps.rootNavigation.navigate("BankDetailContainer");
  }

  searchAction(text) {
    this.searchText = text;
    this.firstSearch = true;
    this.startIndex = 0;

    //if(text.length >=3)
    //  {
    this.setVCDPage();

    //  }
  }

  rightImageOnClick() {
    if (this.state.isSearchBoxShowing) {
      this.searchText = "";
      this.firstSearch = true;
      this.startIndex = 0;

      this.setVCDPage();
    }
    this.setState({
      normalComplients: [],
      pastComplients: [],
      newName: "",
      startIndex: 0,
      isSearchBoxShowing: !this.state.isSearchBoxShowing,
      searchText: "",
    });
  }
  onGotIt() {
    this.props.screenProps.setTooltip("Appointments");
  }

  filterVcData(digiConsultationId) {
    const vcData = this.state.vcData.filter(function (e) {
      return e._id != digiConsultationId;
    });

    //  const DATA1 =vcData
    this.setState({
      EmptyHomeTitle:
        vcData.length > 0
          ? this.state.EmptyHomeTitle
          : "No pending Consultations for today",
      flatListTopMonth:
        vcData.length > 0
          ? month[new Date(vcData[0].WhenEntered).getMonth()]
          : "",
      flatListTopDate:
        vcData.length > 0 ? new Date(vcData[0].WhenEntered).getDate() : "",
      pendingCunsultingDescription: vcData.length + " Video Consultations",
      invalid: true,
      loading: false,
      isRefresh: true,
      vcData: vcData,
      DigitalConsultLength: vcData.length,
    });
    this.setState({
      vcData: vcData,
      isContactDetailsModal: false,
    });
    vcData = null;
  }

  popup_click(item) {
    switch (item.name) {
      case "Mark as Done":
        this.props
          .mark_done_consultation(
            item.digiConsultationId,
            "1",
            this.props.doctorProfile.DoctorData._id
          )
          .then((payload) => {
            var data = payload.payload.data;
            if (data.status == 0)
              this.setState({ invalid: true, loading: false, isRefresh: true });
            else if (data.status == 1) {
              this.filterVcData(item.digiConsultationId);
            }
          });
        break;
      case "Cancel Appointment":
        this.props
          .cancel_consultation(
            item.digiConsultationId,
            "1",
            this.props.doctorProfile.DoctorData._id
          )
          .then((payload) => {
            var data = payload.payload.data;
            if (data.status == 0)
              this.setState({ invalid: true, loading: false, isRefresh: true });
            else if (data.status == 1) {
              this.filterVcData(item.digiConsultationId);
            }
          });
        break;
      default:
        break;
    }
  }

  meallabel() {
    var content = this.state.ContactDetails.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={() => this.popup_click(item)}
          style={{ flexDirection: "column", justifyContent: "center" }}
        >
          <View style={{ backgroundColor: "#D3D3D3", height: 1 }}></View>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Image
              style={{ width: 35, height: 35, alignSelf: "center" }}
              source={item.imagePath}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: item.colorCode,
                  fontSize: 19,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
    return content;
  }

  meallabel1() {
    var content = this.state.ContactDetails1.map((item, index) => {
      return (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={{ backgroundColor: "#D3D3D3", height: 1 }}></View>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Image
              style={{ width: 35, height: 35, alignSelf: "center" }}
              source={item.imagePath}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSans",
                  color: item.colorCode,
                  fontSize: 19,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        </View>
      );
    });
    return content;
  }

  closeClick() {
    this.setState({
      isContactDetailsModal: false,
    });
  }

  // get patient info api
  getPatientInfo(item) {
    //  this.props.navigate("PatientVisitHistoryContainer")
    // this.props.screenProps.rootNavigation.navigate('PatientVisitHistoryContainer')
    // return;
    let data = {
      patient_Id: item._id,
      doctorId: this.props.doctorProfile.DoctorData._id,
      patientId: item.PatientId,
      skip: 0,
      limit: 20,
    };
    this.props.patientPrescriptionList(data).then((response) => {
      if (response.payload.data.status == 1) {
        if (
          response.payload.data.patientDetails[0].CommonDetails.Gender ==
          "Female"
        ) {
          this.props.updatePatientOBHistory("Female");
          let patientDetails = response.payload.data.patientDetails;
          let gpal = null;
          if (patientDetails.CommonDetails.Gender == "Female") {
            if (patientDetails.CommonDetails.Gpal) {
              gpal = { ...Gpal, ...patientDetails.CommonDetails.Gpal };
            } else {
              gpal = { ...Gpal };
            }
          } else {
            gpal = null;
          }
          patientDetails.CommonDetails.Gpal = gpal ? { ...gpal } : null;
        }
        this.props.setPatientData(patientDetails);
        this.editPatient(true);
      }
    });
  }
  showVisitHistory(item) {
     
    let data = {
      id: item._id,
      patientId: item.Cid, //cid should be passed while getting RX List
    };
    let vcData = {
      consult_id: "",
      trans_id: "",
    };
    this.props.setVCTransactionDetails(vcData);
    this.props.setPaymentLink("");
    this.props.setPatientId(data);

    this.props.navigation.navigate("IvBookApp", {
      itemData: item,
      callFrom: "itemclick",
    });
  }
  refershList = (showSearch, callFrom) => {
    this.searchText = "";
    this.firstSearch = true;
    this.startIndex = 0;

    if (callFrom && callFrom != "itemclick") {
      this.setVCDPage();

      this.setState({
        isSearchBoxShowing: false,
        newName: "",
        startIndex: 0,
        searchText: "",
        exactSearch: 0,
      });
    }

    //  this.setVCDPage()
    //
  };

  fabtouch(name) {
    switch (name) {
      case "Add Patient":
        this.props.screenProps.rootNavigation.navigate("AddPatientContainer", {
          returnPatientData: this.refershList,
        });
        break;
      case "Add Prescription":
        break;
      default:
        break;
    }
  }

  editPatient(val) {
    this.props.editPatentDetails(val);
    if (val) {
      this.props.screenProps.rootNavigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
      });
    } else {
      this.props.updatePatientOBHistory(null);
      this.props.screenProps.rootNavigation.navigate("AddPatientContainer", {
        returnPatientData: this.refershList,
      });
    }
  }

  showModal() {
    this.setState({
      showSyncModal: true,
    });
  }
  hideModal() {
    this.setState({
      showSyncModal: false,
    });
  }

  render() {
    //const isBankDetails = !this.props.doctorProfile.DoctorData.BankDetails ? true : false;
    // this.props.screenProps.data = true;
    const setModalVisible = true;
    const modalVisible = true;

    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        {this.state.showSyncModal ? (
          <SyncModal
            {...this.props}
            syncData={() => this.props.screenProps.getRecents()}
            showModal={() => this.showModal()}
            hideModal={() => this.hideModal()}
          ></SyncModal>
        ) : null}
        <View
          style={{
            flexdirection: "column",
            backgroundColor: "#F6F9FA",
            flex: 1,
          }}
        >
          <View>
            <PrescriptionHeader
              {...this.props}
              bgImage={ic_Orange_BG_578}
              bgColor={null}
              title={"My Patients"}
              titleSize={20}
              cursorColor={"#ffffff"}
              description={"Search patient name"}
              descriptionSize={15}
              titleColor={"#fff"}
              descriptionColor={"#fff"}
              leftImage={ic_black_back}
              rightImage={icon_search_white}
              rightImageCross={icon_close_white}
              isSearchBoxShowing={this.state.isSearchBoxShowing}
              type={5}
              searchAction={(text) => this.searchAction(text)}
              leftImageOnClick={() => this.leftImageOnClick()}
              rightImageOnClick={() => this.rightImageOnClick()}
            />
          </View>

          {
            //this.searchText.trim() != "" && (!this.state.exactSearch >0)
            this.searchText.trim() != "" ? (
              <View
                style={{
                  paddingLeft: 10,
                  flexDirection: "row",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                  borderBottomColor: "#cccccc",
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    marginVertical: 15,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                  
                    ref={(ref) => this.myText = ref}
                    style={{
                      fontFamily: "NotoSans-Bold",
                      fontSize: 22,
                      color: "#0b69d8",
                    }}
                  >
                    {this.searchText}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      fontSize: 12,
                      color: "#0b69d8",
                    }}
                  >
                    Add as New Patient
                  </Text>
                </View>

                <TouchableOpacity
                  style={{ flexDirection: "column", justifyContent: "center" }}
                  onPress={() => this.addPatientCustom()}
                >
                  <Image
                    style={{ height: 35, width: 35, marginHorizontal: 20 }}
                    source={icon_List_First_Element_Add_Button_Blue}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }

          {this.state.dataIsPresent ? (
            <PatientComponent
              {...this.props}
              finalArrayAfterTabClick={this.state.finalArrayAfterTabClick}
              imagePath={Images.ic_profile_dummy_image}
              onPatientClick={(item) => this.showVisitHistory(item)}
              itemLongClick={(item) => this.itemLongClick(item)}
              startIndex={this.startIndex}
              hitNextData={(startIndex) => this.hitNextData(startIndex)}
            />
          ) : (
            <EmptyHome
              {...this.props}
              isLottie={true}
              imagePath={empty_PatientList}
              //imagePath={Images.ic_Video_Consultations_Empty_Icon}
              title={this.state.EmptyHomeTitle}
              colorCode={colorCode}
              isShowButton={this.state.isShowButton}
              description={this.state.EmptyHomeDescription}
              onClick={() => this.onClick()}
            />
          )}
          <FloatingAction
            iconHeight={55}
            iconWidth={55}
            position={"right"}
            color="transparent"
            floatingIcon={ic_Add_Clinic_Button}
            overlayColor="transpart"
            distanceToEdge={{ horizontal: 30, vertical: 40 }}
            // actions={this.props.actions}
            onPressMain={() => this.addPatient()}
          />
        </View>

        {this.state.showToast
          ? this.toast.show(
              <ToastComponent
                {...this.props}
                textColorCode={"#fafbfe"}
                imagePath={Images.Info}
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
            backgroundColor: "#4D99E3",
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
  patientvisit: state.patientvisit,
  patientProfile: state.patientProfile,
});

const mapDispatchToProps = (dispatch) => ({
  //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
  patients_list: (skip, limit, search, sortby, age, gender, doctorid) =>
    dispatch(patients_list(skip, limit, search, sortby, age, gender, doctorid)),
  delete_patient: (patient_id, doctor_id, cid, action) =>
    dispatch(delete_patient(patient_id, doctor_id, cid, action)),
  updatePatientOBHistory: (patientGender) =>
    dispatch(updatePatientOBHistory(patientGender)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setPatientId: (data) => dispatch(setPatientId(data)),
  editPatentDetails: (editPatient) => dispatch(editPatentDetails(editPatient)),
  patientPrescriptionList: (data) => dispatch(patientPrescriptionList(data)),
  setPatientData: (patientData) => dispatch(setPatientData(patientData)),
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  setVCTransactionDetails: (data) => dispatch(setVCTransactionDetails(data)),
  setPaymentLink: (link) => dispatch(setPaymentLink(link)),
  discardPatient: () => dispatch(discardPatient()),
  getRxList: (data) => dispatch(getRxList(data)),
  setNavigationFlow: (data) => dispatch(setNavigationFlow(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPatientsScreen);
