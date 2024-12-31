import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Image,
  Animated,
  Platform,
} from "react-native";
import { Toast, Button, Container } from "native-base";
import {
  prescrip_save,
  ic_reset_icon,
  ic_Quick_Rx_Heart,
  ic_clock,
  ic_add_button,
  ic_close_button,
  ic_prescription_menu,
  ic_save_button,
  ic_follow_up_icon,
  ic_give_advice,
  add_Favourite_Icon,
  ic_medication_icon,
  ic_recommend_lab_test_icon,
  ic_Add_Clinic_Button,
  ic_Quick_Rx_Heart_Filled,
} from "../../constants/images";
import ParentTab from "../../components/CertificatePreviewComponent/ParentTab";
import {
  deletePatientVisit,
  onTemplateSave,
  tabDataStore,
  resetTemplateData,
} from "../../actions/previewSettings";
import { FloatingAction } from "react-native-floating-action";
import { MenuProvider, MenuContext, MenuOption } from "react-native-popup-menu";
import {
  setPatientVisitKeyData,
  setlab,
  setDiagnosis,
  setAdditionalAssesstment,
} from "../../actions/patientVisit";
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
} from "../../actions/attachment";
import { clearCertificate, loadCertificates } from "../../actions/certificates";
import { addToFavourite } from "../../actions/certificates";
import { setDoctorData } from "../../actions/doctorProfile";
import multipleTapHandler from "../../components/MultiTapHandle/index";

import { connect } from "react-redux";
import PrescriptionPreviewHeader from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewHeader";
import PrescriptionPreviewFooter from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewFooter";
import PrescriptionPreviewBody from "../../components/PrescriptionPreviewComponent/PrescriptionPreviewBody";
import Images from "../../Theme/Images";
import Modal from "react-native-modalbox";
import { LogBox } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNPrint from "react-native-print";
import { StackActions, CommonActions } from '@react-navigation/native';
import { calculateAge, generateGuid } from "../../commonmethods/common";
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs();
import io from "socket.io-client";
import { isStagging, staging, prod } from "../../../app.json";
import Share from "react-native-share";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
class CertificatePreviewHome extends Component {
  constructor(props) {
    super(props);
    this.onscanned = this.onscanned.bind(this);
    this.socketConnection = null;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    let tempData = this.props.previewReducer.templateData;
    this.modalsettings = React.createRef();
    this.state = {
      getDataFromTab: this.props.certificates.certificateResponse,
      loading: false,
      fabClick: false,
      fabActiveClick: false,
      editShow: false,
      printing: false,
      isSettingsClicked: false,
      url: "",
      isFavPrescription: false,
      templateData:
        Object.keys(tempData).length > 0
          ? tempData
          : this.props.certificates.certificateResponse,

      DoctorFName: this.props.doctorProfile.DoctorData.DoctorFName,
      DoctorLName: this.props.doctorProfile.DoctorData.DoctorLName,
      arrayItem: ["Share", "Settings", "Print using QR Code"],
    };
    this.filepath = "";
    this._unsubscribe = "";
    this.rxid = "";
    this.spinValue = new Animated.Value(1);
    this.mode = new Animated.Value(0);
    this.WebViewRef = React.createRef();
    
  }
  getUrl() {
    let guid = generateGuid();
    let domain = isStagging ? staging.printTemplate : prod.printTemplate;
    let self = this;
    var {
      PaperSettings,
      _id,
      Type,
      CertificateType,
      DoctorHeaderDetails,
      url,
    } = this.props.certificates.certificateResponse;
    this.rxid = _id;
    let type = CertificateType.replace(/\s/g, "") + ".html?";
    url =
      domain +
      "template/Certificates/" +
      type +
      "HeaderType=" +
      (this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.header
        : PaperSettings.header) +
      "&TemplatebodyType=" +
      (this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.body
        : PaperSettings.body) +
      "&FooterType=" +
      (this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.footer
        : PaperSettings.footer) +
      "&guid=" +
      guid +
      "&print=1" +
      "&patientid=" +
      _id;

    this.setState(
      {
        url: url,
      },
      () => {
        self.WebViewRef.current ? self.WebViewRef.current.reload() : null;
      }
    );
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "CertificatePreview",
      screen_class: "CertificatePreviewHome",
    });
    this.SocketIO();
    //   this.props.loadCertificates().then(response=>{
    //        if(response)
    //        {
    //
    //        }
    //     })

    this.getUrl(); // this.forceUpdate();
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    // this._unsubscribe.remove()
    if (this.filepath != "") {
      RNFS.unlink(this.filepath);
    }
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick()
    );
  }

  changeStateMenu() {
    if (!this.state.isSettingsClicked) {
      this.setState({ editShow: !this.state.editShow });
    } else {
      this.setState({ isSettingsClicked: false }, () => {
        this.save();
      });
    }
  }

  onDiscard(patientid, data) {
    // this.props.deletePatientVisit(patientid, data).then(response => {
    //     if (response.payload.data.status == 2000) {
    //         Toast.show({ text: `patient visit ${data.message}`, duration: 1000, position: 'bottom' })
    //         this.props.navigation.dispatch(StackActions.reset({
    //             index: 0,
    //             actions: [NavigationActions.navigate({ routeName: 'PatientVisitHistoryContainer' })]   //OptometryRecord
    //         }));
    //     }
    // })

    this.props
      .deletePatientVisit(patientid, data)
      .then(({ payload, error }) => {
        if (error) {
          //.show({ text: `patient visit ${payload.data.message}`, duration: 1000, position: 'bottom' })
          this.setState({ editShow: !this.state.editShow });
        } else if (payload.data.status == 2000) {
          this.setState({ editShow: !this.state.editShow });
          let referName = { Lab: null, Pharma: null, Specialist: null };
          this.props.setlab(referName);
          Toast.show({
            text: `patient visit ${payload.data.message}`,
            duration: 1000,
            position: "bottom",
          });
          this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'PatientVisitHistoryContainer' }]

          }));

        } else {
          this.setState({ editShow: !this.state.editShow });
          Alert.alert("Prescrip", "Something went wrong");
          Toast.show({
            text: `Something went wrong`,
            duration: 1000,
            position: "bottom",
          });
        }
      });
  }

  async onShare(data) {
    this.setState({ editShow: !this.state.editShow });
    let fileNameAdd = this.props.patientvisit.patientVisitId + "_" + new Date().getTime();
    let options = {
      html: data,
      fileName: "cer_" + fileNameAdd,
      base64: true,
      // backgroundColor: '#FFFFF',
      // paddingRight: parseInt(settings[1]) * 1.35, //Right
      // paddingLeft: parseInt(settings[0]) * 2, //Top
      // paddingTop: parseInt(settings[3]) * 1.35,//Left,
      // paddingBottom: parseInt(settings[2]) * 1.35, //Bottom
    };
    let file = await RNHTMLtoPDF.convert(options);
    if (file && file.filePath && file.filePath != "") {
      Share.open({ url: "file://" + file.filePath })
        .then((res) => { })
        .catch((ex) => { });
    } else {
      Alert.alert("File not found");
    }
  }
  //Scan QR
  SocketIO() {
    let socket_url = isStagging ? staging.socket : prod.socket;
    this.socketConnection = io(
      socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050/"
    );
    const self = this;
    this.socketConnection.on("connect", function (data) {
      if (this.socketConnection && this.socketConnection.connected) {
        this.socketConnection.emit("room", self.state.doctordata._id);
        this.socketConnection.emit("CheckActiveLogins", {
          DocId: this.props.doctorProfile.DoctorData._id,
        });
      }
    });

    this.socketConnection.on("ReceiveComfirmation", function (data) {
      self.setState({
        deskActive: true,
      });
    });
  }
  callSockettoprint() {
    let PaperSettings = this.props.previewReducer.templateData.PaperSettings;
    var data = {
      header: PaperSettings.header,
      body: PaperSettings.body,
      footer: PaperSettings.footer,
      patientid: this.rxid, //(this.props.patientvisitdetails.PatientVisitsMaster1._id) ? this.props.patientvisitdetails.PatientVisitsMaster1._id : this.props.patientvisitdetails.PatientVisitsMaster1._id,
      DocId: this.props.doctorProfile.DoctorData._id,
      FullName: this.props.patientname,
    };
    this.socketConnection.emit("SendDataToPrint", data);
    this.socketConnection.disconnect();
  }
  onscanned() {
    this.setState({
      deskActive: true,
    });
  }
  scanQrCode() {
    this.setState({ editShow: false });
    //alert('Scan Qr Code');
    this.props.navigation.push("ScanQrCode", {
      SockConobj: this.socketConnection,
      returnScanData: this.onscanned,
      DocId: this.props.doctorProfile.DoctorData._id,
    });
  }
  //Menu navigation
  navigateMenu(item) {
    // this.setState({ editShow: false })
    switch (item) {
      case "Settings":
        this.setState(
          { editShow: !this.state.editShow, isSettingsClicked: true },
          () => {
            this.modalsettings.open();
            //this.props.navigation.navigate('PrescriptionPreviewSetting')
          }
        );

        break;
      case "Discard":
        this.onDiscard(this.props.rxid, { action: 0 });
        break;
      case "Share":
        this.onShare(this.props.webdata[0]);
        break;
      case "Print using QR Code":
        this.scanQrCode();
        break;
      default:
        this.setState({ editShow: false });
    }
  }

  menuArray() {
    return this.state.arrayItem.map((item, index) => {
      return (
        <MenuOption
          key={"menu" + index.toString()}
          customStyles={{ height: 48, width: 100 }}
          onSelect={() => this.navigateMenu(item)}
        >
          <Text style={{ margin: 5, color: "#666666", fontFamily: "NotoSans" }}>
            {item}
          </Text>
        </MenuOption>
      );
    });
  }
  //backhandler
  handleBackButtonClick() {
    this.props.resetTemplateData();
    this.props.navigation.pop();
    this.socketConnection.disconnect();
    return true;
  }

  leftImageOnClick() {
    if (this.state.isSettingsClicked) {
      this.setState({ isSettingsClicked: false }, () => {
        this.modalsettings.close();
      });
    } else {
      this.props.resetTemplateData();
      multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
    }
  }

  
  closePreview() {
    this.callSockettoprint();
    //   this.props.clearCertificate();
    //this.props.resetTemplateData()
    this.props.navigation.push("FinalPrescriptionContainer", {
      item: "Certificate",
    });
    // this.props.navigation.dispatch(StackActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: 'Drawer' })]   //OptometryRecord
    // }));
  }

  changebackdropState() {
    this.setState({ fabClick: !this.state.fabClick });
    return true;
  }

  async printHTML(data, pSets) {
    if (!data) {
      Alert.alert("Prescrip", "Print functionality is in progress");
      return;
    }
    try {
      if (Platform.OS === "android") {
        await RNPrint.print({ html: data });
      } else {
        this.printHTMLios(data, pSets);
      }
    } catch (error) {
      this.handleerror(error);
    }
  }

  async printHTMLios(data, pSets) {
    try {
      let settings = pSets.Margin;

      this.setState({ printing: true });
      let dname = this.state.DoctorFName + this.state.DoctorLName;
      //top ,right,bottom,left
      // dname = "Dr" + dname + "_" + this.getDate(this.state.PrintPreviewData.WhenEntered);
      let options = {
        html: data,
        fileName: "Prescrip_" + dname,
        base64: true,
        // backgroundColor: '#FFFFF',
        // paddingRight: parseInt(settings[1]) * 1.35, //Right
        // paddingLeft: parseInt(settings[0]) * 2, //Top
        // paddingTop: parseInt(settings[3]) * 1.35,//Left,
        // paddingBottom: parseInt(settings[2]) * 1.35, //Bottom
      };

      let file = await RNHTMLtoPDF.convert(options);

      if (this.filepath == "") {
        if (file && file.filePath && file.filePath != "") {
          this.setState({ printing: false });
          await RNPrint.print({ filePath: file.filePath });
          //   this.props.updatePrintStatus(this.state.PrintPreviewData.patientVisitId).then((data) => {

          //   });
        } else {
          Alert.alert("File not found");
        }
      } else {
      }
    } catch (error) {
      this.handleerror(error);
    }
  }

  save() {
    this.props.previewReducer.templateData;
    let { previewReducer, onTemplateSave, navigation } = this.props;
    let paperSettings = {
      ...this.props.previewReducer.templateData.PaperSettings,
    };
    let newMargin = [...paperSettings.Margin];
    newMargin = newMargin.map((m) => {
      return m.toString();
    });
    paperSettings["Margin"] = [...newMargin];

    let data = {
      DisplayLabel: this.props.doctorProfile.DoctorData.DisplayLabel,
      DisplayPreferences: [],
      Language: "English",
      PaperSettings: paperSettings,
      PrescriptionList: [],
    };
    //let arr = Object.keys(this.state.getDataFromTab).length > 0 ? this.state.getDataFromTab : this.state.templateData
    //let arr=this.state.templateData;
    onTemplateSave(this.rxid, data).then(({ payload, error }) => {
      if (error) {
        Toast.show({
          text: "Some error occured",
          duration: 1000,
          position: "bottom",
        });
        this.modalsettings.close();
      } else if (payload.data.status == 1) {
        this.props.tabDataStore(this.state.getDataFromTab);
        //Toast.show({ text: 'Settings updated successfully ', duration: 1000, position: 'bottom' })
        // navigation.pop();
        this.modalsettings.close();
        //this.forceUpdate();
        this.getUrl();
      } else {
         
        this.modalsettings.close();
      }
    });
    !this.state.isSettingsClicked ? this.modalsettings.close() : null;
  }

  setSettingsData(data) {
    this.setState({ getDataFromTab: data }, () => {
      this.save();
    });
  }

  handleerror(err) { }
  rightSecondImageClick() {
    var {
      PaperSettings,
      _id,
      Type,
      CertificateType,
      DoctorHeaderDetails,
      url,
    } = this.props.certificates.certificateResponse;

    let type = CertificateType.replace(/\s/g, "");
    this.state.getDataFromTab;
    let data = {
      DoctorID: this.props.doctorProfile.DoctorData._id,
      CertificatesTypes: type,
      header: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.header
        : this.state.templateData.PaperSettings.header,
      footer: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.footer
        : this.state.templateData.PaperSettings.footer,
      body: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.body
        : this.state.templateData.PaperSettings.body,
      type: 1,
    };

    this.props.addToFavourite(data).then((response) => {
      if (response.payload.data.status == 1) {
        let { CertificatesFav } = response.payload.data.data;
        let doctorData = this.props.doctorProfile.DoctorData;
        doctorData.CertificatesFav = CertificatesFav;
        this.props.setDoctorData(doctorData);
        this.setState({
          isFavPrescription: true,
        });
      }
    });
  }

  dismissMenu() {
    if (this.state.editShow) {
      this.setState({
        editShow: false,
      });
    }
  }

  render() {
    // const spin = { transform: [{ scale: this.spinValue }] }
    // const rotate = this.mode.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ["0deg", "45deg"]
    // })
    let age = calculateAge(
      this.props.patientvisit.patientDetails.CommonDetails.DOB,
      false
    );

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <SafeAreaView style={{ flex: 1 }}>
          {this.state.loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={"large"} color={"#fff"} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {/*  header component for prescription preview */}
              <PrescriptionPreviewHeader
                {...this.props}
                type={2}
                parentClick={() => this.setState({ editShow: false })}
                title={"Issue Certificate"}
                name={
                  this.props.patientvisit.patientDetails.CommonDetails.FullName
                }
                age={age.value + " " + age.units}
                gender={
                  this.props.patientvisit.patientDetails.CommonDetails.Gender
                }
                dismissMenu={() => this.dismissMenu()}
                arrayItem={this.state.arrayItem}
                leftImage={Images.ic_black_back}
                menuState={this.state.editShow}
                menuArray={this.menuArray()}
                rightSecondImage={
                  this.state.isSettingsClicked
                    ? ic_reset_icon
                    : this.state.isFavPrescription
                      ? ic_Quick_Rx_Heart_Filled
                      : ic_Quick_Rx_Heart
                }
                rightSecondImageClick={() => this.rightSecondImageClick()}
                rightImage={
                  this.state.isSettingsClicked
                    ? prescrip_save
                    : ic_prescription_menu
                }
                navigateMenu={(item) => this.navigateMenu(item)}
                rightImageClick={() => this.changeStateMenu()}
                leftImageOnClick={() => this.leftImageOnClick()}
              />

              {/*  body component for prescription preview */}

              <PrescriptionPreviewBody
                {...this.props}
                WebViewRef={this.WebViewRef}
                type={2}
                url={this.state.url}
                onRef={(ref) => (this.web = ref)}
                fabPosition={"center"}
                iconHeight={35}
                iconWidth={35}
                onFabStateChange={this.state.fabClick}
                dataChange={this.state.settingDatastore}
              />

              <PrescriptionPreviewFooter
                {...this.props}
                type={2}
                onClickFinish={() => {
                  this.printHTML(
                    this.props.webdata[0],
                    this.state.templateData.PaperSettings
                  );
                }}
                onClickDraft={() => this.closePreview()}
                btnText1={"finish"}
                btnText2={"print"}
              />

              <Modal
                useNativeDriver={true}
                animationDuration={200}
                style={{
                  borderWidth: 0,
                  width: "100%",
                  height: Dimensions.get("window").height / 2.2,
                  overflow: "hidden",
                  justifyContent: "center",
                }}
                ref={(ref) => this.modalsettings = ref}
                 
                swipeToClose={false}
                position={"bottom"}
                backdrop={false}
                backdropOpacity={0.5}
                backdropPressToClose={false}
                //swipeToClose={this.state.swipeToClose}
                onClosed={() => {
                  this.close;
                }}
                onOpened={this.open}
                onClosingState={this.onClosingState}
              >
                <View style={{ flex: 1 }}>
                  <ParentTab
                    {...this.props}
                    type={2}
                    WebViewRef={this.WebViewRef}
                  />
                </View>
              </Modal>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  patientvisit: state.patientvisit,
  doctorProfile: state.doctorProfile,
  previewReducer: state.previewReducer,
  rxid: state.patientvisit.prescription._id,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  patient: state.patientProfile.patientDetails.CommonDetails,
  subtext: state.attachment.subtext,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  Srno: state.attachment.Srno,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  webdata: state.previewReducer.webdata,
  certificates: state.certificates,
  mdata: state.attachment.mdata,
  ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
  Findings: state.patientvisit.prescription.Findings,
  Investigation: state.patientvisit.prescription.Investigation,
  Diagnosis: state.patientvisit.prescription.Diagnosis,
  RecommendedLabTest: state.patientvisit.prescription.RecommendedLabTest,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentData: (data) => dispatch(setAttachmentData(data)),
  setMData: (data) => dispatch(setMData(data)),
  setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
  deletePatientVisit: (patientvisitid, data) =>
    dispatch(deletePatientVisit(patientvisitid, data)),
  setlab: (Name) => dispatch(setlab(Name)),
  tabDataStore: (templateData) => dispatch(tabDataStore(templateData)),
  onTemplateSave: (doctorid, data) => dispatch(onTemplateSave(doctorid, data)),
  addToFavourite: (data) => dispatch(addToFavourite(data)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  clearCertificate: () => dispatch(clearCertificate()),
  loadCertificates: () => dispatch(loadCertificates()),
  resetTemplateData: () => dispatch(resetTemplateData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CertificatePreviewHome);
