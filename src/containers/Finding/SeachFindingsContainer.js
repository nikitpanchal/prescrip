//**code by ravi */
import React, { Component, PureComponent, useRef } from "react";
import {
  View,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  TextInput,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
  SafeAreaView, Dimensions
} from "react-native";
import {
  save_btn_green,
  Save_pink_btn,
  Contact_btn_pink,
  contact_green,
  Black_back,
  Search_button_light_blue,
  SuggestLab_Pink_btn,
  ic_note_delete,
  Attachment_clip,
  ic_Cancel_Appoointment,
  Refer_Green_icon,
  Suggest_Laboratory,
  Refer_Specialist,
} from "../../constants/images";
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import { Container } from "native-base";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
  setDataEditing,
} from "../../actions/attachment";
import {
  get_chief_suggestions,
  patientvisits,
  setPrescription,
} from "../../actions";
import {
  setPatientVisitKeyData,
  setDiagnosis,
  setAdvice,
  setFindings,
  setInvestigation,
  setLabTest,
  setChiefComplaints,
} from "../../actions/patientVisit";
import MainBody from "../../components/Module/MainBody";
import CButton from "../../components/CommonComponents/CButton";

import BackButton from "../../components/CommonComponents/BackButton";
import { oneToNinenine, period, getAge } from "../../commonmethods/validation";
import { color } from "react-native-reanimated";
import {
  add_custom_data,
  add_custom_data_svc,
  delete_custom_data,
  getdoctor_svc,
} from "../../actions/sync";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";
import Toast, { DURATION } from "react-native-easy-toast";

import {
  delete_icon,
  Tooltip_Edit_Icon,
  ic_Add_Clinic_Button,
} from "../../constants/images";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";
import { element } from "prop-types";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

let timer = null;
class SearchFindingsContainer extends Component {
  constructor(props) {
    super(props);
    let { params } = props.route;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.MainBody = null;
    this.toast = React.createRef();
    this.state = {
      providerData: [],
      arryaHolder: [],
      searchEnabled: false,
      text_input_Holder: "",
      text: "",
      menuIndex: -1,
      type: params,
      previous_screen: params ? params.previous_screen : "",
      RecentData: [],
      description: "",
      showToast: false,
      showTooltip: false,
      refreshType: null,
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
    clearTimeout(timer);
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack();
    return true;
    this.proceed();
  }

  Navigateback = () => {
    this.proceed();

    //   multipleTapHandler.clearNavigator();
    // this.props.navigation.goBack();
  };

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: this.props.displayname,
      screen_class: `SearchFindingsContainer`,
    });
    timer = setTimeout(() => {
      this.setState({
        showTooltip: true,
      });
    }, 1500);

    //alert(type)
  }

  SearchFilterFunction = (text) => {
    let self = this;
    if (text == "") {
      Keyboard.dismiss();
    }

    self.setState({ text_input_Holder: text });
  };
  onTop() { }

  navigatetoscreen(data, callFrom, RecentData, onLongPress) {
    // this.MainBody.current.comeToTop();
    //  if(this.props.children. flatListRef )
    //   this.flatListRef.scrollToOffset({ animated: true, offset: 0 });

    let self = this;
    multipleTapHandler.multitapFunctionHandler(
      "AttachementContainer",
      function () {
        let { type } = self.props;
        self.setState({
          searchEnabled: false,
          text_input_Holder: "",
        });

        // setTimeout(() => {

        switch (type) {
          case "ChiefComplaints":
            self.checkSelectedObjectArray1(data);
            break;
          case "Findings":
            self.checkSelectedObjectArray2(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          case "Investigation":
            self.checkSelectedObjectArray3(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          case "Diagnosis":
            self.checkSelectedStringArray(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          case "Provider":
            self.checkSelectedStringArray(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          case "Advice":
            self.checkSelectedStringArray(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          case "RecommendedLabTest":
            self.checkSelectedStringArray(
              data,
              callFrom,
              RecentData,
              onLongPress
            );
            break;
          default:
          // code block
        }
        // }, 2000);

        self.MainBody.comeToTop();
      }
    );
  }

  //For Labtest, Diagnosis, Ad5vice
  checkSelectedStringArray(data, callFrom, RecentData, onLongPress) {
    let { mdata, setMData, type, doctorProfile } = this.props,
      tempData = mdata,
      x;
    x = tempData.filter((i) => i === data);
    if (x.length === 0) {
      if (callFrom == "custom") {
        tempData.push(data);
        setMData(tempData);
        this.addNewCustomDataServer(
          doctorProfile.DoctorData._id,
          data,
          type,
          RecentData
        );
      } else {
        //Changes in customDelete

        if (onLongPress == "longPress") {
          this.deleteNewCustomDataServer(data, type, RecentData);
        } else {
          tempData.push(data);
          setMData(tempData);
        }
      }
    } else {
      Alert.alert("Prescrip", x + " already added");
      //   Alert.alert('Already Exists')
    }
    multipleTapHandler.clearNavigator();
  }

  //For ChiefComplaints
  checkSelectedObjectArray1(data) {
    let { mdata, setMData, type, doctorProfile } = this.props,
      x = {};

    let tempData = mdata;
    x = {
      Name: data,
      Value: "",
    };
    if (!this.checkIfAlreadyExistsInSelected(x)) {
      tempData.push(x);
      setMData(tempData);
    } else {
      Alert.alert("Prescrip", x.Name + " already added");
      //  Alert.alert( "Prescrip",'Already Exists')
    }
    multipleTapHandler.clearNavigator();
  }

  updateData = (data) => {
    this.setState({
      refreshType: "updateFlatList",
      text_input_Holder: "",
    });

    setTimeout(() => {
      this.setState({
        refreshType: "",
      });
    }, 2000);
  };

  //For Investigations
  checkSelectedObjectArray3(data, callFrom, RecentData, onLongPress) {
    let {
      type,
      setAttachmentData,
      navigation,
      colorCode,
      setMData,
      doctorProfile,
    } = this.props,
      x = {};

    //  let tempData = mdata
    x = {
      DataType: "",
      Graph: data[3],
      Unit: data[2],
      Upload: [],
      Name: data[0],
      keyBoradType: data[1],
      callFrom: data[5] ? data[5] : "master",
    };

    if (!this.checkIfAlreadyExistsInSelected(x)) {
      if (callFrom == "custom") {
        setAttachmentData(x);
        this.props.navigation.push("AttachmentsContainer", {
          data,
          type,
          colorCode,
          callFrom,
          RecentData,
          updateData: this.updateData.bind(this),
        });
      } else {
        if (onLongPress == "longPress") {
          this.deleteNewCustomDataServer(data, type, RecentData);
        } else {
          setAttachmentData(x);
          this.props.navigation.push("AttachmentsContainer", {
            data,
            type,
            colorCode,
            callFrom,
            RecentData,
            updateData: this.updateData.bind(this),
          });
        }
      }
      //  navigation.push('AttachmentsContainer', { data, type, colorCode, callFrom, RecentData });
    } else {
      Alert.alert("Prescrip", x.Name + " already added");
      //  Alert.alert( "Prescrip",'Already Exists')
    }
    multipleTapHandler.clearNavigator();
  }

  //For , Findings
  checkSelectedObjectArray2(data, callFrom, RecentData, onLongPress) {
    let {
      mdata,
      type,
      setAttachmentData,
      navigation,
      colorCode,
      setMData,
      doctorProfile,
    } = this.props,
      x = {};

    let tempData = mdata;
    x = {
      DataType: "",
      Graph: data[3],
      Unit: data[2],
      Upload: [],
      Name: data[0],
      keyBoradType: data[1],
      callFrom: data[5] ? data[5] : "master",
    };

    if (!this.checkIfAlreadyExistsInSelected(x)) {
      if (callFrom == "custom") {
        this.addNewCustomDataServer1(
          data,
          type,
          colorCode,
          callFrom,
          RecentData
        );
        setAttachmentData(x);
        tempData.push(x);
        setMData(tempData);

        //                this.addNewCustomDataServer(doctorProfile.DoctorData._id, data[0], type, RecentData)
      } else {
        if (onLongPress == "longPress") {
          this.deleteNewCustomDataServer(data, type, RecentData);
        } else {
          setAttachmentData(x);
          tempData.push(x);
          setMData(tempData);
        }
      }

      /*
                        setAttachmentData(x)
                      this.props.navigation.push('AttachmentsContainer', { data, type, colorCode, callFrom, RecentData });
            */
      //  navigation.push('AttachmentsContainer', { data, type, colorCode, callFrom, RecentData });
    } else {
      Alert.alert("Prescrip", x.Name + " already added");
    }
    multipleTapHandler.clearNavigator();
  }

  checkIfAlreadyExistsInSelected(x) {
    return this.props.mdata.filter((i) => i.Name === x.Name).length > 0;
  }

  addNewCustomDataServer1(data, type, colorCode, callFrom, RecentData) {
    let { DoctorData } = this.props.doctorProfile;
    let RecentData1 = RecentData;
    let key = type;
    let newData = [data[0], ""];
    let data1 = {
      DoctorId: DoctorData._id,
      key: key,
      newData: newData,
      lastCloudSync: new Date(),
    };

    RecentData1.unshift(newData);

    this.props.add_custom_data(data1).then((response) => {
      if (response.payload.data.status == 1) {
        this.updateDoctorRecentsCustom(
          key,
          response.payload.data.LastCloudSync,
          response.payload.data.IsUpdateReq,
          DoctorData._id,
          RecentData1
        );
        this.setState({
          refreshType: "updateFlatList",
          text_input_Holder: "",
        });

        setTimeout(() => {
          this.setState({
            refreshType: "",
          });
        }, 2000);
      } else {
        alert(response.payload.data.msg);
      }
    });
  }

  deleteNewCustomDataServer(data, type, RecentData) {
    let { DoctorData } = this.props.doctorProfile;
    let RecentData1 = RecentData;
    let key = type;

    let newData = null;

    let dataCheck = RecentData1.filter((element) => {
      if (Array.isArray(element)) {
        if (element[0] == data[0]) {
          newData = element;
          return false;
        } else {
          return true;
        }
      } else if (type == "Investigation" || type == "Findings") {
        if (element == data[0]) {
          newData = element;
          return false;
        } else {
          return true;
        }
      } else if (element == data) {
        newData = element;
        return false;
      } else {
        return true;
      }
    });

    let data1 = {
      Key: key == "Provider" ? "ServiceProvided" : key,
      value: newData,
      DoctorId: DoctorData._id,
      brandName: "",
      doseForm: "",
      brandRemoving: false,
      doseRemoving: false,
    };

    if (key == "Provider") {
      this.props.delete_custom_data(data).then((response) => {
        if (response.payload.data.status == 1) {
          /*  this.setState({
                          text_input_Holder :''
                      })
                      this.forceUpdate()*/
        } else {
          alert(response.payload.data.msg);
        }
      });
    } else {
      this.props.delete_custom_data(data1).then((response) => {
        if (response.payload.data.status == 1) {
          this.updateDoctorRecentsCustom(
            key,
            response.payload.data.LastCloudSync,
            response.payload.data.IsUpdateReq,
            DoctorData._id,
            dataCheck
          );
          this.setState({
            refreshType: "updateFlatList",
            text_input_Holder: "",
          });

          setTimeout(() => {
            this.setState({
              refreshType: "",
            });
          }, 2000);
        } else {
          alert(response.payload.data.msg);
        }
      });
    }
  }

  addNewCustomDataServer(doctorId, newData, key, RecentData) {
    let data = {
      DoctorId: doctorId,
      key: key == "Provider" ? "ServiceProvided" : key,
      newData: newData,
      lastCloudSync: new Date(),
    };

    RecentData.unshift(newData);

    if (key == "Provider") {
      this.props.add_custom_data_svc(data).then((response) => {
        if (response.payload.data.status == 1) {
          this.setState({
            text_input_Holder: "",
          });
          //  this.forceUpdate();
        } else {
          alert(response.payload.data.msg);
        }
      });
    } else {
      this.props.add_custom_data(data).then((response) => {
        if (response.payload.data.status == 1) {
          this.updateDoctorRecentsCustom(
            key,
            response.payload.data.LastCloudSync,
            response.payload.data.IsUpdateReq,
            doctorId,
            RecentData
          );
          this.setState({
            refreshType: "updateFlatList",
          });

          setTimeout(() => {
            this.setState({
              refreshType: "",
              text_input_Holder: "",
            });
          }, 2000);
        } else {
          alert(response.payload.data.msg);
        }
      });
    }
  }

  updateDoctorRecentsCustom(
    key,
    lastCloudSync1,
    isUpdateReq,
    doctorId,
    final_Data
  ) {
    var self = this;

    lastCloudSync = lastCloudSync1 ? lastCloudSync1 : new Date();

    this.props.databaseContext.db.transaction(
      (tx) => {
        let query =
          "UPDATE Recents SET " +
          key +
          " = '" +
          JSON.stringify(final_Data).replace(/\'/g, "''") +
          "'," +
          "LastCloudSync = '" +
          lastCloudSync.replace(/\'/g, "''") +
          "' where DoctorID = '" +
          doctorId +
          "'";

        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rowsAffected == 1) {
              // alert("Updated successfully");
              // self.getChiefComplients()
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  editItem(data, index) {
    let {
      type,
      name,
      value,
      graphtype,
      unit,
      attachments,
      mdata,
      setMData,
      navigation,
      setAttachmentData,
    } = this.props;
    let x = {
      DataType: data.DataType,
      Value: data.DataType,
      Graph: data.Graph,
      Unit: data.Unit,
      Upload: data.Upload,
      Name: data.Name,
      callFrom: data.callFrom,
      keyBoradType: data.keyBoradType,
      reading: data.DataType, //Value for selected item
      attachments: data.Upload, //Upload key
      graphtype: data.Graph,
    };
    switch (type) {
      case "Findings":
        type = "findings";
        break;
      case "Investigation":
        type = "Investigation";
        break;
      default:
      // code block
    }
    setAttachmentData(x);
    if (type == "findings" || type == "Investigation") {
      this.props.setDataEditing(true);
      this.props.navigation.push("AttachmentsContainer", {
        data,
        type,
        updateData: this.updateData.bind(this),
      });

      // multipleTapHandler.multitap(() => this.props.navigation.push('AttachmentsContainer', { data, type }), "AttachmentsContainer");

      // navigation.push('AttachmentsContainer', { data, type });
    }
  }

  proceed() {
    let {
      type,
      Srno,
      displayname,
      defaultlabel,
      subtext,
      patientname,
      mdata,
      navigation,
      suggesticon,
      suggestname,
      setPatientVisitKeyData,
      setAttachmentData,
    } = this.props;
    let nextscreenname = "AdditionalAssessmentContainer";
    let { previous_screen } = this.state;
    let funcType;
    switch (type) {
      case "Findings":
        type = "Findings";
        nextscreenname = "AdditionalAssessmentContainer";
        displayname = "Findings";
        defaultlabel = "Suggestions";
        subtext = "what are " + patientname + "'s " + displayname + "? ";
        //mdata = Findings || []
        Srno = 9;
        //  funcType = setFindings
        break;
      case "Investigation":
        type = "Investigation";
        displayname = "Investigation";
        defaultlabel = "Suggested";
        subtext = "what are " + patientname + " " + displayname + "? ";
        //mdata = Investigation || []
        Srno = 10;
        // funcType = setInvestigation
        break;
      case "Diagnosis":
        type = "Diagnosis";
        displayname = "Diagnosis";
        defaultlabel = "Suggested";
        subtext = "what are " + patientname + " " + displayname + "? ";
        //mdata = Diagnosis || []
        Srno = 12;
        // funcType = setDiagnosis
        break;
      case "Provider":
        type = "Provider";
        nextscreenname = "ProviderContainer";
        displayname = "Services";
        defaultlabel = "Suggested";
        subtext = "Service Provided  to " + patientname;
        //   mdata = Diagnosis || []
        Srno = 12;
        //   colorCode = "#ff7043"

        break;

      case "RecommendedLabTest":
        type = "RecommendedLabTest";
        displayname = "Lab Test";
        //nextscreenname = 'RecommendedLabTestContainer'
        defaultlabel = "Suggested";
        //mdata = RecommendedLabTest || []
        Srno = 11;
        subtext = "RECOMMEND LAB TESTS";
        suggesticon = SuggestLab_Pink_btn;
        suggestname = "Suggest Laboratory";
        // funcType = setLabTest
        break;
      case "Advice":
        type = "Advice";
        displayname = "Advice";
        defaultlabel = "Referred Doctor";
        subtext = "ANY ADVICE FOR " + patientname + "?";
        //mdata = Advice || []
        Srno = 13;
        suggesticon = Refer_Green_icon;
        suggestname = "Refer to Specialist";
        // funcType = setAdvice
        break;
      default:
    }
    setPatientVisitKeyData({ [type]: mdata });
    multipleTapHandler.clearNavigator();
    let refer = null;
    let data = {
      [type]: mdata,
    };
    if (type == "Advice" && this.props.patientvisit.referName.Specialist) {
      refer = {
        Name: this.props.patientvisit.referName.Specialist
          ? this.props.patientvisit.referName.Specialist.Name
          : "",
        Mobile: this.props.patientvisit.referName.Specialist
          ? this.props.patientvisit.referName.Specialist.Mobile
          : "",
        Email: this.props.patientvisit.referName.Specialist
          ? this.props.patientvisit.referName.Specialist.Email
          : "",
        Address: this.props.patientvisit.referName.Specialist
          ? this.props.patientvisit.referName.Specialist.Address
          : "",
      };
      data["ReferredDoctorDetails"] = refer;
    } else if (
      type == "RecommendedLabTest" &&
      this.props.patientvisit.referName.Lab
    ) {
      refer = {
        Name: this.props.patientvisit.referName.Lab
          ? this.props.patientvisit.referName.Lab.Name
          : "",
        Mobile: this.props.patientvisit.referName.Lab
          ? this.props.patientvisit.referName.Lab.Mobile
          : "",
        Email: this.props.patientvisit.referName.Lab
          ? this.props.patientvisit.referName.Lab.Email
          : "",
        Address: this.props.patientvisit.referName.Lab
          ? this.props.patientvisit.referName.Lab.Address
          : "",
      };
      data["ReferredPathLabDetails"] = refer;
    }
    //if (previous_screen === 'PrintPreview') {
    /* funcType(data, rxid)
             .then(({ payload, error }) => {
                 if (error) {
                     this.setState({
                         showToast: true,
                         description: "Some error occurred!"
                     })
                     setTimeout(() => {
                         this.setState({
                             showToast: false,
                         })
 
                     }, 2000);
                 }
             })*/
    //   this.props.navigation.goBack();
    //  navigation.pop()
    //} else {

    if (previous_screen !== "PrintPreview") {
      setAttachmentData({
        type,
        DataType: "",
        Graph: "",
        Unit: "",
        Upload: [],
        Name: "",
        Value: "",
        mdata,
        Srno,
        subtext,
        displayname,
        defaultlabel,
      });
    }

    if (
      type == "Investigation" ||
      type == "Findings" ||
      type == "Diagnosis" ||
      type == "RecommendedLabTest" ||
      type == "Advice" ||
      type == "Provider"
    ) {
      var searchArray = [];

      this.props.databaseContext.db.transaction(
        (tx) => {
          let query =
            "SELECT " +
            type +
            " from MostUsed where DoctorId = '" +
            this.props.doctorProfile.DoctorData._id +
            "'";

          tx.executeSql(query, [], (tx, results) => {
            let brandDataValue1 = results.rows.raw()[0];

            let docterLocalRecent = [];
            if (brandDataValue1) {
              docterLocalRecent =
                type == "Findings"
                  ? !brandDataValue1.Findings
                    ? []
                    : JSON.parse(brandDataValue1.Findings)
                  : type == "Investigation"
                    ? !brandDataValue1.Investigation
                      ? []
                      : JSON.parse(brandDataValue1.Investigation)
                    : type == "Diagnosis"
                      ? !brandDataValue1.Diagnosis
                        ? []
                        : JSON.parse(brandDataValue1.Diagnosis)
                      : type == "RecommendedLabTest"
                        ? !brandDataValue1.LabTest
                          ? []
                          : JSON.parse(brandDataValue1.LabTest)
                        : type == "Advice"
                          ? !brandDataValue1.Advice
                            ? []
                            : JSON.parse(brandDataValue1.Advice)
                          : type == "Dose"
                            ? !brandDataValue1.Dose
                              ? []
                              : JSON.parse(brandDataValue1.Dose)
                            : [];
            }

            for (let index = 0; index < mdata.length; index++) {
              var element = mdata[index];
              searchArray.push(
                typeof element === "string" ? element : element.Name
              );
            }

            for (let index = 0; index < docterLocalRecent.length; index++) {
              searchArray.push(docterLocalRecent[index][0]);
            }

           
          });
        },
        (error) => { }
      );
      // var dataToLoadInMostUsed
    }
    this.props.navigation.goBack();
    //  navigation.navigate(nextscreenname, { type, })
  }

  updateMostUsedTable(key, lastCloudSync, doctorId, final_Data) {
    var self = this;

    this.props.databaseContext.db.transaction(
      (tx) => {
        let query =
          "UPDATE MostUsed SET " +
          key +
          " = '" +
          JSON.stringify(final_Data).replace(/\'/g, "''") +
          "' where DoctorID = '" +
          doctorId +
          "'";

        tx.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rowsAffected == 1) {
              //  alert("Updated successfully");
              //self.getChiefComplients()
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  getUniqueChiefComplaints(array) {
    var uniqueArray = [];

    // Removing dubs values in case multiple Dose added for a Brand
    for (var i = 0; i < array.length; i++) {
      //  for (var j = 0; j < array[i].length; j++) {
      var thisBrand = array[i];

      var find = uniqueArray.find((x) => x[0] == thisBrand);
      if (!find) {
        uniqueArray.push([thisBrand, 1]);
      } else {
        find[1] = find[1] + 1;
      }

      //  }
    }
    var arr = uniqueArray;
    arr.sort(function (a, b) {
      return a[1] < b[1] ? 1 : -1;
    });
    var fnal = arr.slice(0, 5);
    return fnal;
  }

  redirectsuggest(suggestname) {
    let type,
      color,
      newsuggestednameicon,
      newsuggesticon,
      x = suggestname.split(" ");

    switch (x[x.length - 1]) {
      case "Laboratory":
        type = "Laboratory";
        color = "#f21c68";
        newsuggestednameicon = Contact_btn_pink;
        newsuggesticon = Save_pink_btn;
        break;
      case "Pharmacy":
        type = "Pharmacy";
        color = "#0065d7";
        break;
      case "Specialist":
        type = "Specialist";
        color = "#1cb07a";
        newsuggestednameicon = contact_green;
        newsuggesticon = save_btn_green;
        break;
      default:
      // code block
    }
    let screen = type + "Container";
    multipleTapHandler.multitap(
      () => this.props.navigation.push(screen, { type, color }),
      screen
    );

    //  this.props.navigation.push(screen, { type, color })
  }

  render() {
    let {
      type,
      Srno,
      displayname,
      subtext,
      patientname,
      suggestname,
      navigation,
      defaultlabel,
    } = this.props;
    let referName = this.props.patientvisit.referName;
    let selectedName = null;
    let colorCode = this.props.colorCode;
    let suggesticon = "";
    switch (displayname) {
      case "Lab Test":
        colorCode = "#f21c68";
        selectedName = referName.Lab ? referName.Lab.Name : null;
        suggesticon = SuggestLab_Pink_btn;
        break;
      case "Advice":
        colorCode = "#1DB07A";
        selectedName = referName.Specialist ? referName.Specialist.Name : null;
        suggesticon = Refer_Green_icon;
        break;
      case "Pharmacy":
        colorCode = "#0aadad";
        selectedName = referName.Pharma ? referName.Pharma.Name : null;
        suggesticon = Refer_Green_icon;
        break;

      default:
        break;
    }
    if (Srno == 8) {
      type = "ChiefComplaints";
      displayname = "Complaints";
      subtext = "what are " + patientname + "'s " + displayname + "? ";
    }
    let { statusBarHeight } = this.props.databaseContext;
    return (
      <View style={{
        backgroundColor: "#fff", flex: 1
      }}>
        <View style={{ backgroundColor: "#fff" }}>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            translucent={true}
            backgroundColor="#fff"
          />
          <SafeAreaView>
            <View
              style={{
                paddingTop:
                  Platform.OS == "android"
                    ? statusBarHeight || 0 + 23
                    : statusBarHeight || 0 + 0, width: Dimensions.get('window').width
              }}
            >
              <SearchComponent
                {...this.props}
                SearchFilterFunction={this.SearchFilterFunction.bind(this)}
                Navigateback={this.Navigateback.bind(this)}
                ref={"Myinput"}
                subtext={subtext}
                colorCode={colorCode}
                displayname={displayname}
                stext={this.state.text_input_Holder}
              />
            </View>
          </SafeAreaView>
        </View>

        <MainBody
          onRef={(ref) => (this.MainBody = ref)}
          type={type}
          Srno={Srno}
          refreshType={this.state.refreshType}
          colorCode={colorCode}
          searchtext={this.state.text_input_Holder.trim()}
          navigatetoscreen={this.navigatetoscreen.bind(this)}
          searchEnabled={this.state.searchEnabled}
          editItem={this.editItem.bind(this)}
          previous_screen={this.state.previous_screen}
        />
        <View
          style={{
            backgroundColor: "#f5f5f5",
            flexDirection: "column",
            bottom: 20,
          }}
        >
          {displayname == "Lab Test" ||
            displayname == "Advice" ||
            displayname == "Pharmacy" ? (
            <View
              style={{
                backgroundColor: "#f5f5f5",
                flexDirection: "column",
                paddingVertical: 30,
              }}
            >
              {this.state.text_input_Holder == "" && (
                <TouchableWithoutFeedback
                  onPress={() => this.redirectsuggest(suggestname)}
                >
                  <View style={styles.suggest_lab_view}>
                    {selectedName == null ? (
                      <View
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', width: Dimensions.get('window').width }}
                      >
                        <Image
                          source={suggesticon}
                          style={styles.suggest_pink_image}
                        />

                        {this.state.showTooltip &&
                          this.props.searchFindingContainerRefer &&
                          selectedName == null ? (
                          <Tooltip
                            topAdjustment={
                              Platform.OS === "android"
                                ? -StatusBar.currentHeight
                                : 0
                            }
                            // animated={true}
                            isVisible={true}
                            backgroundColor={"rgba(0,0,0,0)"}
                            contentStyle={{
                              marginTop: 7,
                              backgroundColor: "#6f6af4",
                              height: "100%",
                            }}
                            tooltipStyle={{ alignItems: "center" }}
                            content={
                              <TouchableOpacity
                                style={{ backgroundColor: "#6f6af4" }}
                                onPress={() => {
                                  this.props.setTooltipStatus({
                                    ["searchFindingContainerRefer"]: false,
                                  });
                                }}
                              >
                                <AddPatient
                                  imagePath={
                                    displayname == "Lab Test"
                                      ? Suggest_Laboratory
                                      : Refer_Specialist
                                  }
                                  title={"Suggest " + displayname}
                                  description={
                                    "Reccomend your patients, to your preferred " +
                                    (displayname == "Lab Test"
                                      ? "Laboratories"
                                      : displayname == "Advice"
                                        ? "Specialist"
                                        : displayname)
                                  }
                                />
                              </TouchableOpacity>
                            }
                            //(Must) This is the view displayed in the tooltip
                            placement="auto"
                            //(Must) top, bottom, left, right, auto.
                            onClose={() => {
                              this.props.setTooltipStatus({
                                ["searchFindingContainerRefer"]: false,
                              });
                            }}
                          //(Optional) Callback fired when the user taps the tooltip
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: colorCode,
                                fontFamily: "NotoSans",
                                paddingStart: 5, textAlign: 'center'
                              }}
                            >
                              {suggestname}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text
                            style={{
                              fontSize: 15,
                              color: colorCode,
                              fontFamily: "NotoSans",
                              paddingStart: 5, textAlign: 'center'
                            }}
                          >
                            {suggestname}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={{ flexDirection: "column" }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            source={selectedName ? suggesticon : ""}
                            style={[
                              styles.suggest_pink_image_ref,
                              { tintColor: "#8b8b8b" },
                            ]}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#8b8b8b",
                              fontFamily: "NotoSans",
                              paddingStart: 3,
                            }}
                          >
                            {selectedName ? defaultlabel : ""}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 15,
                            color: colorCode,
                            fontFamily: "NotoSans",
                            paddingStart: 5,
                          }}
                        >
                          {type == "Advice"
                            ? selectedName
                              ? "Dr. " + selectedName
                              : suggestname
                            : selectedName
                              ? selectedName + " Laboratories "
                              : suggestname}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          ) : null}
          <View></View>
        </View>

        {this.state.text_input_Holder == "" ? (
          <CButton
            onPress={() => this.proceed()}
            colorCode={colorCode}
            label={"Done"}
            style={{}}
          />
        ) : null}

        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={"#fffefe"}
              imagePath={Images.Error}
              description={this.state.description}
            />,

            1500
          )
          : null}
        <Toast
          position="center"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            backgroundColor: "#d9541d",
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
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  type: state.attachment.type,
  displayname: state.attachment.displayname,
  colorCode: state.attachment.colorCode,
  defaultlabel: state.attachment.defaultlabel,
  subtext: state.attachment.subtext,
  Name: state.attachment.Name,
  suggestscreen: state.attachment.suggestscreen,
  suggestname: state.attachment.suggestname,
  suggesticon: state.attachment.suggesticon,
  Unit: state.attachment.Unit,
  Srno: state.attachment.Srno,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  mdata: state.attachment.mdata,
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  searchFindingContainerRefer:
    state.tooltip.toolTipStatus.searchFindingContainerRefer,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentData: (data) => dispatch(setAttachmentData(data)),
  setMData: (data) => dispatch(setMData(data)),
  setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  delete_custom_data: (data) => dispatch(delete_custom_data(data)),

  add_custom_data_svc: (data) => dispatch(add_custom_data_svc(data)),

  getdoctor_svc: (data) => dispatch(getdoctor_svc(data)),

  setDataEditing: (data) => dispatch(setDataEditing(data)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(SearchFindingsContainer));

const styles = StyleSheet.create({
  cont: {
    flex: 0.4,
    flexDirection: "column",
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fafafa",
  },
  first: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 14,
    borderBottomColor: "#dedede",
    borderBottomWidth: 2,
    paddingVertical: 18,
  },
  searchinput: {
    includeFontPadding: false,
    letterSpacing: 0.3,
    textAlign: "justify",
    fontSize: 20,
    color: "#242424",
    width: "87%",
    padding: 0,
  },
  suggest_lab_view: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  flat: { paddingHorizontal: 10, flex: 1 },
  suggest_pink_image: { height: 15, width: 15, resizeMode: "contain" },
  suggest_pink_image_ref: {
    height: 9,
    width: 9,
    resizeMode: "contain",
    marginTop: 2,
  },
  suggestion_laboratory_text: {
    fontSize: 15,
    color: "#f21c68",
    fontFamily: "NotoSans",
    paddingStart: 5,
  },
});

class SearchComponent extends PureComponent {
  constructor(props) {
    super();
    this.myRef = React.createRef();
    this.txt = "";
  }
  render() {
    let {
      type,
      Navigateback,
      suggestednameicon,
      suggesticon,
      SearchFilterFunction,
      ref,
      subtext,
      displayname,
      stext,
      colorCode,
    } = this.props;
    let istextfilled = this.myRef ? stext != "" : false;
    switch (displayname) {
      case "Lab Test":
        colorCode = "#f21c68";
        suggestednameicon = Contact_btn_pink;
        suggesticon = Save_pink_btn;
        break;
      case "Advice":
        colorCode = "#1DB07A";
        suggestednameicon = contact_green;
        suggesticon = save_btn_green;
        break;
      case "Pharmacy":
        //  colorCode = "#0aadad"

        break;

      default:
    }

    return (
      <View style={styles.first}>
        <TouchableOpacity
          onPress={() => {
            istextfilled ? SearchFilterFunction("") : Navigateback();
          }}
        >
          <Image
            source={Black_back}
            style={{ height: 25, width: 22, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <View style={{ flex: 0.97 }} keyboardShouldPersistTaps="handled">
          <Text
            style={{
              fontSize: 11,
              color: "#919191",
              fontFamily: "NotoSans",
              textTransform: "uppercase",
            }}
          >
            {subtext}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextInput
              onChangeText={(text) => SearchFilterFunction(text)}
              placeholder={"Search For " + displayname + "..."}
              placeholderTextColor={colorCode}
              defaultValue={stext}
              returnKeyType={"done"}
              keyboardType="default"
              ref={(r) => (this.myRef = r)}
              autoFocus={false}
              style={[styles.searchinput, { color: "black" }]}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                istextfilled ? SearchFilterFunction("") : this.myRef.focus();
              }}
            >
              <Image
                source={
                  istextfilled ? ic_note_delete : Search_button_light_blue
                }
                style={{
                  height: 20,
                  width: 20,
                  tintColor: colorCode,
                  resizeMode: "contain",
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
