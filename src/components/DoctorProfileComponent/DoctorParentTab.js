import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  ic_upload_image_inactive,
  ic_upload_image_tab_active,
  Spec_Check_Active,
  Spec_Check_Non_Active,
  ic_add_blue,
} from "../../constants/images";
import {
  Container,

} from "native-base";
import Modal from "react-native-modalbox";
import Images from "../../Theme/Images";
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { add_custom_data } from "../../actions/sync";

import DoctorCameraTab from "./DoctorCameraTab";
import PersonalTab from "./DoctorPersonalTab";
import ProfessionalComponent from "./ProfessionalComponent";
import DateTimePicker from "react-native-modal-datetime-picker";
import PracticeContainer from "../../containers/DoctorProfileContainer/PracticeContainer";
import {
  isNameValid,
  isEmailValid,
  isPhoneno,
} from "../../commonmethods/validation";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
const { height, width } = Dimensions.get("window");
class DoctorParentTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrimaryVisible: false,
      OrientationStatus: "",
      Height_Layout: "",
      Width_Layout: "",
      doctorData: { ...this.props.doctorProfile.DoctorData },
      errorFields: {
        personal: {
          err: false,
          DoctorFName: "",
          DoctorLName: "",
          DOB: "",
          Age: "",
          Mobile: "",
          City: "",
          Gender: "",
          DoctorEmail: "",
        },
        profession: {
          err: false,
          primarySpecialization: "",
          secondarySpecialization: "",
          qulification: "",
          MICRNo: "",
          medCouncil: "",
        },
      },
      isDatePickerVisible: false,
      camerastate: 1,
      checkedBox: false,
      specArray: [],
      specializeArr: [],
      primaryselect: "Select",
      secondryselect: "Select",
      arrayPrimary_Spec: [
        "Dentist",
        "CardioLogist",
        "Dermatologist",
        "Diabetologist",
        "Hepatologist",
        "Dermatologist",
        "Diabetologist",
        "Hepatologist",
      ],
      arraySecondory_Spec: [
        "Dentist",
        "CardioLogist",
        "Dermatologist",
        "Diabetologist",
        "Hepatologist",
        "Dermatologist",
        "Diabetologist",
        "Hepatologist",
      ],
      srchText: "",
      selectedSecondarySpec: [],
      SuggSpecialization: [],
      specializeArr: [],
      btnIndex: -1,
      ExactEqualLength: 1,
    };
    this.specializationlist = null;
  }
  componentDidMount() {
    this.getDataforSpecialization();
    // this.DetectOrientation();
    let selectedSecondarySpec = this.state.doctorData.DisplaySpecializationCSV.split(
      ","
    );
    this.setState({
      selectedSecondarySpec: selectedSecondarySpec,
    });
  }
  DetectOrientation() {
    setTimeout(this._tabs.goToPage.bind(this._tabs, this.state.camerastate));
    if (this.state.Width_Layout > this.state.Height_Layout) {
      // Write Your own code here, which you want to execute on Landscape Mode.

      this.setState({
        OrientationStatus: "Landscape Mode",
      });
    } else {
      // Write Your own code here, which you want to execute on Portrait Mode.

      this.setState({
        OrientationStatus: "Portrait Mode",
      });
    }
  }
  //On Data changes in Child Component
  onDataChanges(key, value) {
    if (key == "DoctorFName" || key == "DoctorLName") {
      let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      let filteredtext = this.isTextValid(value.trim());

      // console.log("textt", filteredtext);
      if (!regex.test(value)) {
        if (filteredtext != undefined) {
          this.state.doctorData[key] = value;

          if (key == "Age") {
            let dob = this.getDOB(value);
          }
          this.setState({
            doctorData: this.state.doctorData,
          });
        }
      } else {
        let notString = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        Alert.alert(
          "Prescrip",
          "Special characters like" + notString + " not allowed "
        );
      }
    } else {
      this.state.doctorData[key] = value;

      if (key == "Age") {
        let dob = this.getDOB(value);
      }
      this.setState({
        doctorData: this.state.doctorData,
      });
    }
  }
  toggleDatePicker(show) {
    this.setState({
      isDatePickerVisible: show,
    });
  }
  setDate = (date) => {
    let age = new Date().getFullYear() - new Date(date).getFullYear();

    this.state.doctorData.DOB = new Date(date).toISOString();
    this.state.doctorData.Age = age.toString();

    this.setState({
      isDatePickerVisible: false,
      doctorData: this.state.doctorData,
    });
  };

  getDOB(age) {
    if (isNaN(age)) {
      return;
    } else {
      if (age) {
        let year = new Date().getFullYear() - parseInt(age);
        let dob = new Date().setFullYear(year);
        this.state.doctorData.DOB = new Date(dob).toISOString();
        this.state.doctorData.Age = age.toString();
        this.setState({
          doctorData: this.state.doctorData,
        });
        return dob;
      } else {
        return "";
      }
    }
  }
  cancelDatePicker() {
    this.setState({
      isDatePickerVisible: false,
    });
  }
  validateInputs() {
    let isFName = isNameValid(this.state.doctorData.DoctorFName);
    let isLName = isNameValid(this.state.doctorData.DoctorLName);
    let isEmail = isEmailValid(this.state.doctorData.DoctorEmail);
    let isMobile = isPhoneno(this.state.doctorData.DoctorMobile);
    let isAge = parseInt(this.state.doctorData.Age);
    let isGender = this.state.doctorData.Gender.length != 0 ? true : false;
    let isCity = this.state.doctorData["City"]
      ? this.state.doctorData["City"]
      : "";
    if (
      isFName.isvalid &&
      isLName.isvalid &&
      isEmail.isvalid &&
      isMobile.isvalid &&
      isAge &&
      Number.isInteger(isAge) &&
      isAge > 17 &&
      isCity.length > 0 &&
      isGender
    ) {
      this.state.errorFields.personal.err = false;
    } else {
      this.state.errorFields.personal.err = true;
    }
    if (!isFName.isvalid) {
      this.state.errorFields.personal.DoctorFName =
        "Please enter valid First Name";
    } else {
      this.state.errorFields.personal.DoctorFName = "";
    }
    if (!isLName.isvalid) {
      this.state.errorFields.personal.DoctorLName =
        "Please enter valid Last Name";
    } else {
      this.state.errorFields.personal.DoctorLName = "";
    }
    if (!isEmail.isvalid) {
      this.state.errorFields.personal.DoctorEmail =
        "Please ente valid Email Address";
    } else {
      this.state.errorFields.personal.DoctorEmail = "";
    }
    if (!isMobile.isvalid) {
      this.state.errorFields.personal.Mobile =
        "Please ente valid Mobile Number";
    } else {
      this.state.errorFields.personal.Mobile = "";
    }
    if (!Number.isInteger(isAge) || isAge < 18) {
      this.state.errorFields.personal.Age =
        "Age should be greater than 18 years";
    } else {
      this.state.errorFields.personal.Age = "";
    }
    if (isCity == "") {
      this.state.errorFields.personal.City = "Please enter City name";
    } else {
      this.state.errorFields.personal.City = "";
    }
    if (!isGender) {
      this.state.errorFields.personal.Gender = "Please select a gender";
    } else {
      this.state.errorFields.personal.Gender = "";
    }
    if (this.state.doctorData.PrimarySpecialization.length == 0) {
      this.state.errorFields.profession.primarySpecialization =
        "Please select Primary Specializtion";
    } else {
      this.state.errorFields.profession.primarySpecialization = "";
    }

    if (this.state.doctorData.MICRNo.length == 0) {
      this.state.errorFields.profession.MICRNo =
        "Please enter your Registration Number";
    } else {
      this.state.errorFields.profession.MICRNo = "";
    }
    if (this.state.doctorData.CouncilName.length == 0) {
      this.state.errorFields.profession.medCouncil =
        "Please enter Medical Council Name";
    } else {
      this.state.errorFields.profession.medCouncil = "";
    }
    if (
      this.state.errorFields.profession.qulification.length != 0 ||
      this.state.errorFields.profession.primarySpecialization.length != 0 ||
      this.state.errorFields.profession.medCouncil.length != 0 ||
      this.state.errorFields.profession.MICRNo.length != 0
    ) {
      this.state.errorFields.profession.err = true;
    } else {
      this.state.errorFields.profession.err = false;
    }
    this.setState(
      {
        errorFields: this.state.errorFields,
      },
      () => {
        if (
          !this.state.errorFields.personal.err &&
          !this.state.errorFields.profession.err
        ) {
          this.updateDoctorProfile();
        }
      }
    );
  }
  //Sent data to API and update Props
  updateDoctorProfile() {
    let data = {
      doctorId: this.state.doctorData._id,
      email: this.state.doctorData.DoctorEmail,
      mobile: this.state.doctorData.DoctorMobile,
      firstName: this.state.doctorData.DoctorFName,
      lastName: this.state.doctorData.DoctorLName,
      age: this.state.doctorData.Age,
      doctorDob: this.state.doctorData.DOB,
      gender: this.state.doctorData.Gender,
      city: this.state.doctorData["City"],
      primarySpecialization: this.state.doctorData.PrimarySpecialization,
      displaySpecialization: this.state.doctorData.DisplaySpecializationCSV.split(
        "1,"
      ).join(""),
      displayQualification: this.state.doctorData.DisplayQualificationCSV,
      micrno: this.state.doctorData.MICRNo,
      councilName: this.state.doctorData.CouncilName,
      profilePhoto: this.state.doctorData.DoctorImage,
    };

    this.props.rightImageClick(data, this.state.doctorData);
  }

  selectDisplaySpecializatio(index, item) {
    this.setState({ btnIndex: index });
    this.setState({ checkedBox: this.state.checkedBox == true ? false : true });
  }

  onSave() {
    this.validateInputs();
  }
  isTextValid(str) {
    //   return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    return str.replace(/[~`@!#$%¥£€¢\^*+=_\()\[\]\\';,/{}|\\":<>\?]/, "");
  }
  searchSpecilialization(text1) {
    let regex = /[~`@!#$%¥£€¢\^*+=_\()\[\]\\';,/{}|\\":<>\?]/;
    let filteredtext = this.isTextValid(text1.trim());
    // console.log("textt", filteredtext);
    // let isValidText = this.isTextValid(text);
    this.setState(
      {
        srchText: filteredtext,
      },
      () => {
        // console.log(this.state.srchText);
      }
    );
    if (!regex.test(text1)) {
      if (filteredtext) {
        let newData = this.specializationlist.filter((item) => {
          const itemData = item.toLowerCase();
          const textData = filteredtext.toLowerCase();

          return itemData.includes(textData);
        });

        this.setState({ specArray: newData, specializeArr: newData });
      } else {
        this.setState({
          specArray: this.specializationlist,
          specializeArr: this.specializationlist,
        });
      }
    } else {
      let notString = "[~`@!#$%¥£€¢^*+=_()]';,/{}|:<>:?";
      Alert.alert(
        "Prescrip",
        "Special characters like" + notString + " not allowed "
      );
    }
  }
  addItemInSpecialization(name, callForm) {
    if (this.state.specArray.every((item) => item !== name)) {
      this.state.specArray.push(name);

      this.setState({
        specArray: this.state.specArray,
        srchText: "",
      });
      if (callForm == "custom")
        this.addNewCustomDataServer(
          this.props.doctorProfile.DoctorData._id,
          name,
          "Specialization"
        );
    } else {
      if (callForm != "") {
        Alert.alert(
          "Prescrip",
          name + " already added",
          [
            {
              text: "OK",
              onPress: () => { },
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  }

  addNewCustomDataServer(doctorId, newData, key) {
    this.props.databaseContext.db.transaction((tx) => {
      let lastSync = "";
      let selectQuery = `SELECT LastCloudSync from Recents WHERE DoctorId='${this.props.doctorProfile.DoctorData._id}'`;
      tx.executeSql(selectQuery, [], (tx, results) => {
        let syncData = results.rows.raw()[0];
        lastSync = syncData.lastCloudSync ? syncData.lastCloudSync : "";
        let final_Data = this.state.SuggSpecialization;
        final_Data.unshift(newData);
        let data = {
          DoctorId: doctorId,
          key: key,
          newData: newData,
          lastCloudSync: lastSync,
        };
        this.props.add_custom_data(data).then((response) => {
          if (response.payload.data.status == 1) {
            this.updateDoctorRecentsCustom(
              key,
              response.payload.data.LastCloudSync,
              response.payload.data.IsUpdateReq,
              doctorId,
              final_Data
            );
          } else {
            alert(response.payload.data.msg);
          }
        });
      });
    });
  }

  filterSpecialization(item) {
    return this.state.SuggSpecialization.indexOf(item) > -1;
  }

  updateDoctorRecentsCustom(
    key,
    lastCloudSync,
    isUpdateReq,
    doctorId,
    final_Data
  ) {
    var self = this;

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
              self.getDataforSpecialization();
            }
          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

  //db
  getDataforSpecialization() {
    var self = this;
    self.props.databaseContext.db.transaction((tx) => {
      let query =
        "SELECT Specialization from Recents where DoctorId = '" +
        self.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(query, [], (tx, results) => {
        let brandDataValue1 = results.rows.raw()[0];
        let checkType =
          typeof brandDataValue1.Specialization == "string"
            ? brandDataValue1.Specialization?.DataInfo
            : brandDataValue1.Specialization;
        self.setState({
          SuggSpecialization: JSON.parse(checkType),

          //JSON.parse(brandDataValue1.Specialization).DataType == 'ArrayString' ? JSON.parse(brandDataValue1.Specialization):JSON.parse(brandDataValue1.Specialization).split(',')
        });
      });

      self.props.databaseContext.db.transaction((tx) => {
        tx.executeSql(
          "SELECT Data FROM MasterData where Srno=2",
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              self.specializationlist = JSON.parse(
                results.rows.raw()[0].Data
              ).Value;

              var content = [];

              self.specializationlist.map((item, index) => {
                content.push(item[1]);
              });
              self.specializationlist = self.state.SuggSpecialization.concat(
                content
              );

              self.setState(
                {
                  specArray: self.specializationlist,
                  specializeArr: self.specializationlist,
                },
                () => { }
              );
              resolve(specializationlist);
            }
          },
          (error) => {
            resolve(specializationlist);
          }
        );
      });
    });
  }

  cameraColor(tab) {
    this.setState({ camerastate: tab.i });
  }

  BindPrimary_Spec() {
    {
      var content = this.state.specializeArr.map((item) => {
        if (!this.filterSpecialization(item)) {
          return (
            <TouchableOpacity
              onPress={() => {
                this.onDataChanges("PrimarySpecialization", item);
                this.primary.close();
                this.setState(
                  { specializeArr: this.specializationlist },
                  () => {
                    this.forceUpdate();
                  }
                );
              }}
            >
              {/* <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1, height: 40, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NotoSans', color: '#000', paddingHorizontal: 20, }}>{item}</Text>
                        </View> */}
              <View
                style={{
                  borderBottomColor: "#cccccc",
                  borderBottomWidth: 1,
                  alignItems: "flex-start",
                  paddingStart: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    height: 50,
                    fontFamily: "NotoSans",
                    paddingTop: 8,
                    color: "#000",
                  }}
                >
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }
      });

      return content;
    }
  }
  BindSecondory_Spec() {
    {
      var content = this.state.specArray.map((item, index) => {
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                this.state.selectedSecondarySpec.indexOf(item) > -1
                  ? this.removeSecondarySpec(item)
                  : this.pushSecondarySpec(item);
              }}
              style={{
                borderBottomColor: "#cccccc",
                borderBottomWidth: 1,
                height: 50,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View style={{ paddingHorizontal: 8 }}>
                <Image
                  resizeMode={"contain"}
                  source={
                    this.state.selectedSecondarySpec.indexOf(item) > -1
                      ? Spec_Check_Active
                      : Spec_Check_Non_Active
                  }
                  style={{ height: 18, width: 18, resizeMode: "contain" }}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "NotoSans",
                  color: "#000",
                  alignItems: "center",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return content;
    }
  }
  pushSecondarySpec(item) {
    let secSpec = this.state.selectedSecondarySpec;
    secSpec.push(item);
    secSpec = secSpec.filter((item) => {
      if (item.length > 0) {
        return item;
      }
    });
    this.setState({
      selectedSecondarySpec: secSpec,
    });
    this.forceUpdate();
  }

  removeSecondarySpec(item) {
    let secSpec = this.state.selectedSecondarySpec;
    let index = secSpec.indexOf(item);
    secSpec.splice(index, 1);
    this.setState({
      selectedSecondarySpec: secSpec,
    });
    this.forceUpdate();
  }
  setSecondarySpec() {
    let spec = this.state.selectedSecondarySpec.filter((item) => {
      if (item.length > 0) {
        return item;
      }
    });
    let secSpec = spec.join();
    this.onDataChanges("DisplaySpecializationCSV", secSpec);
    this.secondary.close();
    this.setState({ specArray: this.specializationlist }, () => {
      this.forceUpdate();
    });
  }
  pritogglemodal() {
    this.modalPrimary_Specialization.open();
  }

  showSecondarySpecialization() {
    this.secondary.open();
  }
  // end//
  showPrimarySpecialization() {
    this.setState({ specArray: this.specializationlist }, () => {
      this.forceUpdate();
    });
    this.primary.open();
  }
  ReturnComponent(props) {
    let i = this.props.tabArray.findIndex(x => x == props.route.name);
    return (
      i == 0 ?
        <PatientCameraTab  {...this.props}
          onDataChanges={(key, value) => this.onDataChanges(key, value)}
          patientDetails={this.state.patientDetails} /> : i == 1 ?
          <PatientPersonalTab
            {...this.props}
            onDataChanges={(key, value) => this.onDataChanges(key, value)}
            showDatePicker={(show, param) => this.toggleDatePicker(show, param)}
            patientDetails={this.state.patientDetails}
            errorFields={this.state.errorFields.personal}
            age={this.state.age}
            ageUnit={this.state.ageUnit}
            setAgeText={(text) => this.setAgeText(text)}
            setAgeUnit={(unit) => this.setAgeUnit(unit)} />
          : i == 2 ?
            <PatientAllergyTab
              {...this.props}
              onDataChanges={(key, value) => this.onDataChanges(key, value)}
              patientDetails={this.state.patientDetails} />
            : i == 3 ?
              <PatientHistoryTab
                {...this.props}
                onDataChanges={(key, value) => this.onDataChanges(key, value)}
                patientDetails={this.state.patientDetails} />
              : i == 4 ?
                <PatientOBHistoryTab
                  {...this.props}
                  onDataChanges={(key, value) => this.onDataChanges(key, value)}
                  showDatePicker={(show, param) => this.toggleDatePicker(show, param)}
                  patientDetails={this.state.patientDetails}
                  errorFields={this.state.errorFields.personal}
                />
                : i == 5 ? <PatientHabitTab
                  {...this.props}
                  onDataChanges={(key, value) => this.onDataChanges(key, value)}
                  patientDetails={this.state.patientDetails} />
                  : i == 6 ? <PatientNotesTab
                    {...this.props}
                    onDataChanges={(key, value) => this.onDataChanges(key, value)}
                    patientDetails={this.state.patientDetails}
                    errorFields={this.state.errorFields.personal}
                  /> : null
    )

  }
  returnTabAppContainer(bottomTabObject) {
   
    let dd = [];
    const self = this;
    let initialParamsTosEND = {
      ...this.props,
      onDataChanges: (key, value) => this.onDataChanges(key, value),
      patientDetails: this.state.patientDetails,
      errorFields: this.state.errorFields.personal
    }

    dd = bottomTabObject.map((item, i) => {

      return (
        item == "camera" ?
          <Tab.Screen
            name={item}
            children={(props) =>
              <DoctorCameraTab
                {...this.props}
                onDataChanges={(key, value) => this.onDataChanges(key, value)}
                showDatePicker={(show) => this.toggleDatePicker(show)}
                doctorData={this.state.doctorData}
                errorFields={this.state.errorFields.personal}
              />
            }
            options={{
              headerShown: false

            }} /> : item == "Personal" ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                <PersonalTab
                  {...this.props}
                  onDataChanges={(key, value) =>
                    this.onDataChanges(key, value)
                  }
                  showDatePicker={(show) => this.toggleDatePicker(show)}
                  doctorData={this.state.doctorData}
                  errorFields={this.state.errorFields.personal}
                />
              }
              options={{
                headerShown: false
              }}


            /> : item == "Professional" ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                <ProfessionalComponent
                  {...this.props}
                  onDataChanges={(key, value) =>
                    this.onDataChanges(key, value)
                  }
                  doctorData={this.state.doctorData}
                  errorFields={this.state.errorFields.profession}
                  showPrimarySpec={() => this.showPrimarySpecialization()}
                  showSecondarySpec={() => this.showSecondarySpecialization()}
                  primaryselect={this.state.primaryselect}
                  secondryselect={this.state.secondryselect}
                />
              }
              options={{
                headerShown: false
              }}


            /> : item == "Practice" ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                <PracticeContainer {...this.props} />
              }
              options={{
                headerShown: false
              }}


            /> : null
      )
    });

    return dd;
  }
  MyTabBar({ state, descriptors, navigation, position, screenState }) {
    return (
      <View style={{
        flexDirection: 'row', borderBottomColor: "#cccccc",
        borderBottomWidth: 2,
        backgroundColor: "#ffffff",
      }}>
        <ScrollView contentContainerStyle={{
          justifyContent: 'center', alignItems: 'center', flexGrow: 1
        }} showsHorizontalScrollIndicator={false} horizontal={true}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };


            return (
              index == 0 && route.name == "camera"?
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={isFocused ? styles.activeCamTab : styles.deactiveCamTab}
                >

                  <Image source={(screenState.camerastate == index ? ic_upload_image_tab_active : ic_upload_image_inactive)}
                    style={{ resizeMode: 'cover', height: 30, width: 30, marginBottom: 10 }} />

                </TouchableOpacity>
                :
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={isFocused ? styles.activeTab : styles.deactiveTab}
                >
                  {screenState.errorFields.personal.err && index == 1 && route.name == "Personal" ? <View style={{
                    backgroundColor: 'red', height: 8, alignSelf: 'flex-end',
                    width: 8, borderRadius: 8
                  }}></View> :
                    screenState.errorFields.profession.err && index == 2 && route.name == "Professional" ?
                      <View style={{
                        backgroundColor: 'red', height: 8, alignSelf: 'flex-end',
                        width: 8, borderRadius: 8
                      }}></View> :
                      <View style={{
                        backgroundColor: 'transparent', height: 8, alignSelf: 'flex-end',
                        width: 8, borderRadius: 8
                      }}></View>
                  }
                  < Text style={isFocused ? styles.activeTabText : styles.tabText}>{label}</Text>




                </TouchableOpacity>
            );

          })}
        </ScrollView>
      </View >
    );
  }
  render() {
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <View style={{ backgroundColor: '#fff', width: Dimensions.get('window').width, marginTop: 22, flex: 0.07, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={this.props.leftImageClick}
            style={styles.ViewImage}
          >
            <Image style={styles.Image} source={this.props.leftImage} />
          </TouchableOpacity>
          <View style={styles.ViewText}>
            <Text style={styles.subtitle}>{this.props.tabTitle}</Text>
          </View>
          {!this.props.menuState ? (
            this.props.loading ? (
              <ActivityIndicator
                size="large"
                color="#0065d7"
                style={{
                  alignSelf: "flex-end",
                  justifyContent: "flex-end",
                  position: "absolute",
                  zIndex: 1,
                  bottom: 5,
                  right: 10,
                }}
              />
            ) : this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
              this.props.doctorProfile.DoctorData.RoleId == 3 ? (
              <TouchableOpacity
                onPress={() => {
                  this.validateInputs();
                }}
                style={styles.ViewImage}
              >
                <Image style={styles.Image} source={this.props.rightImage} />
              </TouchableOpacity>
            ) : null
          ) : null}
        </View>
        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS == "ios" ? -50 : 0}
          >
            <Tab.Navigator lazy={false} initialRouteName="Personal" tabBar={props => <this.MyTabBar screenState={this.state} {...props} />}
              screenOptions={{
                lazy: false
              }}>
              {this.returnTabAppContainer(this.props.tabArray)}
            </Tab.Navigator>


          </KeyboardAvoidingView>
        </View>
        {/*Primary Specialization*/}
        <Modal
          translucent={true}
          useNativeDriver={true}
          animationDuration={80}
          style={{
            borderWidth: 0,
            width: "80%",
            borderRadius: 10,
            height: screenHeight / 1.6,
            overflow: "hidden",
            marginTop: 30,
          }}
          ref={(ref) => this.primary = ref}
          swipeToClose={false}
          transparent={true}
          position={"center"}
          // isOpen={true}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                borderBottomColor: "#dcdcdc",
                shadowOffset: { width: 2, height: 1 },
                shadowColor: "#dcdcdc",
                flexDirection: "row",
                shadowOpacity: 2,
                borderBottomWidth: 2,
                paddingVertical: 15,
                paddingHorizontal: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 0.9 }}>
                <TextInput
                  value={this.state.srchText}
                  onChangeText={(txt) => this.searchSpecilialization(txt)}
                  style={{ fontSize: 14, textAlign: "left" }}
                  placeholder=" Select Primary Specialization"
                />
              </View>
              <View
                style={{
                  flex: 0.1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {this.state.specArray.length!=-1 &&this.state.srchText.trim()=="" || this.state.specArray.indexOf(this.state.srchText.trim())!=-1? <Image source={Images.new_search} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                  :
                  <TouchableOpacity onPress={()=>this.addItemInSpecialization(this.state.srchText.trim(), "custom")}>
                    <Image source={ic_add_blue} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                  </TouchableOpacity>} */}
                <Image
                  source={Images.new_search}
                  style={{ resizeMode: "contain", height: 25, width: 25 }}
                />
              </View>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ width: "100%" }}
            >
              {this.BindPrimary_Spec()}
            </ScrollView>
          </View>
        </Modal>
        {/*Ends*/}

        {/*Secondary Specialization*/}
        <Modal
          useNativeDriver={true}
          animationDuration={80}
          style={{
            borderWidth: 0,
            width: "80%",
            borderRadius: 10,
            height: screenHeight / 1.6,
            overflow: "hidden",
            marginTop: 30,
          }}
          ref={(ref) => this.secondary = ref}

          swipeToClose={false}
          position={"center"}
          //swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                borderBottomColor: "#dcdcdc",
                shadowOffset: { width: 2, height: 1 },
                shadowColor: "#dcdcdc",
                flexDirection: "row",
                shadowOpacity: 2,
                borderBottomWidth: 2,
                paddingVertical: 15,
                paddingHorizontal: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 0.9 }}>
                <TextInput
                  value={this.state.srchText}
                  onChangeText={(txt) => this.searchSpecilialization(txt)}
                  style={{ fontSize: 14, textAlign: "left" }}
                  placeholder=" Select Secondary Specialization"
                />
              </View>
              <View
                style={{
                  flex: 0.1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {(this.state.specArray.length != -1 &&
                  this.state.srchText.trim() == "") ||
                  this.state.specArray.indexOf(this.state.srchText.trim()) !=
                  -1 ? (
                  <Image
                    source={Images.new_search}
                    style={{ resizeMode: "contain", height: 25, width: 25 }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.addItemInSpecialization(
                        this.state.srchText.trim(),
                        "custom"
                      )
                    }
                  >
                    <Image
                      source={ic_add_blue}
                      style={{ resizeMode: "contain", height: 25, width: 25 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ width: "100%" }}
            >
              {this.BindSecondory_Spec()}
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={() => this.setSecondarySpec()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              bottom: 0,
              position: "absolute",
              backgroundColor: "#0065d7",
              width: "100%",
            }}
          >
            <Text
              uppercase={true}
              style={{ paddingVertical: 10, fontSize: 14, color: "#fff" }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </Modal>

        {/*Ends*/}
        {/*OTP Modal*/}
        {/*Ends*/}
        {/*Date Modal*/}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.setDate}
          maximumDate={new Date()}
          onCancel={this.cancelDatePicker.bind(this)}
        />
        {/*Ends*/}
      </View >
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  setSuggestionPatientData: (prescription) =>
    dispatch(setSuggestionPatientData(prescription)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(DoctorParentTab));

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#ffffff",
  },
  activeCamTab: {
    borderBottomWidth: 4, borderColor: "#0869d8", paddingRight: 10, paddingLeft: 10
  },
  deactiveCamTab: {
    borderBottomWidth: 4, borderColor: "transparent", paddingRight: 10, paddingLeft: 10
  },
  tabText: {
    textTransform: "uppercase",
    color: "#959595", fontSize: 14,
    fontFamily: 'NotoSans', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },
  deactiveTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "transparent"
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0869d8",
    fontSize: 14,
    fontFamily: 'NotoSans-Bold', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flex: 0.1,
    flexDirection: "row",
  },
  ViewImage: {
    flex: 0.12,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ViewText: {
    flex: 0.76,
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    color: "grey",
  },
  subtitle: {
    fontSize: 20,
    color: "#717171",
    fontFamily: "NotoSans",
  },
  Image: {
    resizeMode: "contain",
    height: 20,
    width: 20,
  },
});
