//
/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { S3BaseUrl } from '../../../app.json'

import {
  Platform,
  View, Text, TextInput, StatusBar, Dimensions, Image, StyleSheet,
  ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard, ActivityIndicator, Alert
} from 'react-native'
import { ic_Mark_as_done, ic_upload_image_inactive, ic_upload_image_tab_active, ic_profile_image } from '../../constants/images'
import { Container } from 'native-base';

import { connect } from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import { withDb } from "../../DatabaseContext/withDatabase";
import { isNameValid, isValidCountryCode, isPhoneno } from '../../commonmethods/validation';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import PatientCameraTab from './PatientCameraTab'
import PatientPersonalTab from './PatientPersonalTab'
import PatientAllergyTab from './PatientAllergyTab'
import PatientHistoryTab from './PatientHistoryTab'
import PatientHabitTab from './PatientHabitTab'
import PatientOBHistoryTab from './PatientOBHistoy'
import PatientNotesTab from './PatientNotesTab';
import { calculateAge, getDOB, Gpal } from '../../commonmethods/common';
import { isNumber } from 'lodash';

var moment = require('moment');
const { height, width } = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();
class PatientParentTab extends Component {
  constructor(props) {
    super(props)
    let patientData = props.patientProfile.editPatient ? props.patientProfile.patientDetails : null;
    this.ReturnComponent = this.ReturnComponent.bind(this);
    this.state = {
      OrientationStatus: '',
      Height_Layout: '',
      Width_Layout: '',
      camerastate: 1,
      currenttab: -1,
      ageUnit: "Year",
      age: "",
      showDateModal: false,
      errorFields: {
        personal: {
          err: false,
          FullName: "",
          DOB: "",
          Age: "",
          Mobile: "",
          Gender: "",
          EmailAddress: "",
          CountryCode: ''


        }
      },
      popupObj: {
        "type": 1,
        "header": "Select Blood Group",
        "content": [
          "O+",
          "A+",
          "B+",
          "AB+",
          "A-",
          "O-",
          "B-",
          "AB-"
        ]
      },

      patientDetails: {
        "_id": patientData ? patientData._id : "",
        "Mobile": this.props.pNumber ? this.props.pNumber : patientData ? patientData.Mobile : "",
        "CommonDetails": {
          "id": patientData ? patientData.CommonDetails.id : "",
          "Email": patientData ? patientData.CommonDetails.id : "",
          "DOB": patientData ? patientData.CommonDetails.DOB : null,
          "FullName": this.props.pName ? this.props.pName.trim() : patientData ? patientData.CommonDetails.FullName.trim() : "",
          "Userimage": patientData ? patientData.CommonDetails.Userimage : "",
          "Gender": patientData ? patientData.CommonDetails.Gender : "",
          "DoctorId": this.props.doctorProfile.DoctorData._id,
          "Referredby": patientData ? patientData.CommonDetails.Referredby : "",
          "PatientId": patientData ? patientData.CommonDetails.PatientId : "",
          "PatientUhid": patientData ? patientData.CommonDetails.PatientUhid : "",
          "PatientHabits": [],
          "Allergy": [
            {
              "Environmental": "",
              "Food": "",
              "Drugs": "",
              "Other": ""
            }
          ],
          "Gpal": patientData ? patientData.CommonDetails.Gender == "Female" ? patientData.CommonDetails.Gpal ? patientData.CommonDetails.Gpal : JSON.parse(JSON.stringify(Gpal)) : null : null,
          "BodyDetails": {
            "BloodGroup": patientData ? patientData.CommonDetails.BodyDetails.BloodGroup : "",
            "Height": patientData ? patientData.CommonDetails.BodyDetails.Height : "",
            "Weight": patientData ? patientData.CommonDetails.BodyDetails.Weight : "",
            "BMI": patientData ? patientData.CommonDetails.BodyDetails.BMI : "",
            "HeightUnit": "Cm(s)",
            "WeightUnit": "Kg(s)"
          },
          "PersonalHistory": [],
          "FamilyHistory": [],
          "Notes": patientData ? patientData.CommonDetails.Notes : [],
          "CountryCode": patientData && patientData.CommonDetails.CountryCode ? patientData.CommonDetails.CountryCode : '+91',
          "Locality": patientData ? patientData.CommonDetails.Locality : "",
          "City": patientData ? patientData.CommonDetails.City : "",
          "Country": patientData ? patientData.CommonDetails.Country : "",
          "Address": patientData ? patientData.CommonDetails.Address : "",
          "EmailAddress": patientData ? patientData.CommonDetails.EmailAddress : "",
          "PersonalHistoryOther": [],
          "FamilyHistoryOther": [],
          "Pincode": patientData ? patientData.CommonDetails.Pincode : "",
        }
      },


      isDatePickerVisible: false,
      dateFor: "DOB",
    }
  }

  componentDidMount() {
    //this.DetectOrientation();
    let ageObj = calculateAge(this.state.patientDetails.CommonDetails.DOB, false);
    this.setState({
      age: ageObj.value.toString(),
      ageUnit: ageObj.units
    })
  }
  DetectOrientation() {
    setTimeout(this._tabs.goToPage.bind(this._tabs, this.state.camerastate))
    if (this.state.Width_Layout > this.state.Height_Layout) {

      // Write Your own code here, which you want to execute on Landscape Mode.

      this.setState({
        OrientationStatus: 'Landscape Mode'
      });
    }
    else {

      // Write Your own code here, which you want to execute on Portrait Mode.

      this.setState({
        OrientationStatus: 'Portrait Mode'
      });
    }

  }
  onDataChanges(key, value) {

    if (key == "Mobile") {
      this.state.patientDetails[key] = value;
    } else if (key == "BloodGroup" || key == "Height" || key == "Weight" || key == "BMI") {
      this.state.patientDetails.CommonDetails.BodyDetails[key] = value
    }

    else {
      this.state.patientDetails.CommonDetails[key] = value;

    }

    this.setState({
      patientDetails: this.state.patientDetails
    }, () => {

      if (this.state.patientDetails.CommonDetails.Gender == "Female") {
        this.setPregencyDates();
      }

    })

  }
  //Set age and ageUnit
  setAgeText(text) {
    this.setState({
      age: text
    }, () => this.getDateofBirth())
  }
  setAgeUnit(unit) {
    this.setState({
      ageUnit: unit
    }, () => this.getDateofBirth())
  }
  getDateofBirth() {
    if (!isNaN(this.state.age)) {
      let age = {
        value: this.state.age,
        units: this.state.ageUnit
      }
      let ageDate = getDOB(age);

      //let ageObj = calculateAge(ageDate,true);
      let patientDetails = this.state.patientDetails;
      patientDetails.CommonDetails.DOB = new Date(ageDate).toISOString();
      this.setState({
        isDatePickerVisible: false,
        selectedDate: new Date(ageDate).toISOString(),
        patientDetails: patientDetails,
        //  age: ageObj.value.toString(),
        //   ageUnit: ageObj.units

      });
      this.state.errorFields.personal.Age = "";
      this.setState({
        errorFields: this.state.errorFields
      });
    }
    else if (this.state.age.length > 0) {
      this.state.errorFields.personal.Age = "Age should be a valid number";
      this.setState({
        errorFields: this.state.errorFields
      });

    }
  }
  toggleDatePicker(show, param) {
    this.setState({
      isDatePickerVisible: show,
      dateFor: param

    })
  };
  cancelDatePicker() {
    this.setState({
      isDatePickerVisible: false
    })
  };

  setDate = date => {

    if (this.state.dateFor == "DOB") {
      //Set DOB
      let ageObj = calculateAge(date, false);

      let patientDetails = this.state.patientDetails;
      patientDetails.CommonDetails.DOB = new Date(date).toISOString();
      this.setState({
        isDatePickerVisible: false,
        selectedDate: new Date(date).toISOString(),
        patientDetails: patientDetails,
        age: ageObj.value.toString(),
        ageUnit: ageObj.units

      });
    }
    else if (this.state.dateFor == "LMP") {
      //Set LMP Dates

      let patientDetails = this.state.patientDetails;

      patientDetails.CommonDetails.Gpal["LMP"] = new Date(date).toISOString();
      this.setState({
        isDatePickerVisible: false,
        selectedDate: new Date().toISOString(),
        patientDetails: patientDetails,


      }, () => this.setPregencyDates());

    }

  }
  setPregencyDates() {
    if (this.state.patientDetails.CommonDetails.Gpal) {
      if (this.state.patientDetails.CommonDetails.Gpal.Pregnant && this.state.patientDetails.CommonDetails.Gpal["LMP"]) {
        let LMP = new Date(this.state.patientDetails.CommonDetails.Gpal["LMP"]);

        let current = new Date().toISOString();

        let lmpDay = moment(LMP);
        let toDay = moment(current);
        let days = toDay.diff(lmpDay, 'days');
        this.state.patientDetails.CommonDetails.Gpal.GestationalAge = days + " days";

        let EDD_date = LMP.getDate() + 280;
        let EDD = LMP.setDate(EDD_date);
        EDD = new Date(EDD).toISOString();

        this.state.patientDetails.CommonDetails.Gpal["EDD"] = EDD;




      }

    }
    if (!this.state.patientDetails.CommonDetails.Gpal.Pregnant) {
      this.state.patientDetails.CommonDetails.Gpal["EDD"] = "";
      this.state.patientDetails.CommonDetails.Gpal.GestationalAge = ""

    }
    this.setState({
      patientDetails: this.state.patientDetails
    })

  }
  //modal bind blood group

  // BindBloodGroup() {
  //   this.state.popupObj.content.map((item, index) => {
  //     return (
  //       <View>
  //         <Text>{item}</Text>
  //       </View>
  //     )
  //   })
  // }


  validateInputs() {

    let isFName = isNameValid(this.state.patientDetails.CommonDetails.FullName.trim());
    // let isLName=isNameValid(this.state.doctorData.DoctorLName);
    let isMobile = isPhoneno(this.state.patientDetails.Mobile);
    let cCode = isValidCountryCode(this.state.patientDetails.CommonDetails.CountryCode);

    let isAge = parseInt(this.state.patientDetails.CommonDetails.DOB);
    let isGender = this.state.patientDetails.CommonDetails.Gender.length != 0 ? true : false;

    if (isFName.isvalid && isMobile.isvalid && isAge && Number.isInteger(isAge) && isAge > 17 && isGender) {
      this.state.errorFields.personal.err = false;
    }
    else {
      this.state.errorFields.personal.err = true;
    }
    if (!isFName.isvalid) {
      this.state.errorFields.personal.FullName = "Please enter valid First Name"
    }
    else {
      this.state.errorFields.personal.FullName = ""
    }



    if (!cCode.isvalid && !isMobile.isvalid) {

      this.state.errorFields.personal.Mobile = "Invalid Country code & Mobile Number";
    }
    else if (!isMobile.isvalid) {

      this.state.errorFields.personal.Mobile = "Please enter valid Mobile Number";
    }
    else if (!cCode.isvalid) {
      this.state.errorFields.personal.Mobile = "Invalid Country code";
    }
    else {
      this.state.errorFields.personal.Mobile = "";
    }


    if (!Number.isInteger(isAge)) {
      this.state.errorFields.personal.Age = "Age should be a valid number";
    }
    else {
      this.state.errorFields.personal.Age = "";
    }

    if (!isGender) {
      this.state.errorFields.personal.Gender = "Please select a gender";

    }
    else {
      this.state.errorFields.personal.Gender = "";
    }



    this.setState({
      errorFields: this.state.errorFields
    }, () => {
      if (!this.state.errorFields.personal.err) {
        this.updatePatientProfile();

      }
    });

  }



  // getDOB(age) {
  //   if (age != "") {
  //     let year = new Date().getFullYear() - parseInt(age);
  //     let dob = new Date().setFullYear(year);
  //     this.state.patientDetails.CommonDetails.DOB = new Date(dob).toISOString();
  //     this.state.patientDetails.CommonDetails.Age = age.toString();
  //     return dob;

  //   }
  // }


  updatePatientProfile() {



    this.props.rightImageClick(this.state.patientDetails);
  }


  cameraColor(tab) {
    if (tab.i == 0) {
      this.setState({ camerastate: tab.i })
    } else {
      this.setState({ camerastate: tab.i })
    }
  }
  MyTabBar({ state, descriptors, navigation, position, screenState }) {
    return (
      <View style={{
        flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 2
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
              index == 0 ?
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
                  {screenState.errorFields.personal.err && index == 1 ? <View style={{
                    backgroundColor: 'red', height: 8, alignSelf: 'flex-end',
                    width: 8, borderRadius: 8
                  }}></View> : <View style={{
                    backgroundColor: 'transparent', height: 8, alignSelf: 'flex-end',
                    width: 8, borderRadius: 8
                  }}></View>}
                  < Text style={isFocused ? styles.activeTabText : styles.tabText}>{label}</Text>




                </TouchableOpacity>
            );

          })}
        </ScrollView>
      </View >
    );
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
        i == 0 ?
          <Tab.Screen
            name={item}
            children={(props) =>
              this.ReturnComponent(props)
            }
            options={{
              headerShown: false

            }} /> : i == 1 ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : i == 2 ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : i == 3 ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : (i == 4 && this.props.patientProfile.patientGender == "Female") ? <Tab.Screen
              name={item} initialParams={initialParamsTosEND}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : i == 5 ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : i == 6 ? <Tab.Screen initialParams={initialParamsTosEND}
              name={item}
              children={(props) =>
                this.ReturnComponent(props)
              }
              options={{
                headerShown: false
              }}


            /> : null
      )
    });

    return dd;
  }
  render() {

    return (
      <View
        style={{ flex: 1 }}>

        <View style={{ width: Dimensions.get('window').width, flex: (Platform.OS == "android" ? 0.13 : 0.1), marginTop: Platform.OS == "android" ? null : 20 }}>
          {this.props.patientProfile.editPatient ?

            <View style={styles.container} >
              <TouchableOpacity onPress={this.props.leftImageClick} style={styles.ViewImage}>
                <Image style={styles.Image} source={this.props.leftImage} />
              </TouchableOpacity>
              <View style={{ flex: Platform.isPad ? 0.8 : 0.76, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>

                <View style={{ flex: 0.2, alignItems: 'flex-start', }}>
                  {this.props.patientProfile.patientDetails.CommonDetails.Userimage ? <Image source={{ uri: S3BaseUrl + "patientimg/" + this.props.patientProfile.patientDetails.CommonDetails.Userimage }} style={{ resizeMode: 'cover', height: 40, width: 40 }} /> :
                    <Image source={ic_profile_image} style={{ resizeMode: 'contain', height: 40, width: 40 }} />}
                </View>
                <View style={{ flex: Platform.isPad ? 2 : 0.9, flexDirection: 'column' }}>
                  <Text style={styles.subtitle}>{this.props.patientProfile.patientDetails.CommonDetails.FullName.trim()}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.subtitle2}>{this.props.tabTitle}</Text>
                    <Text style={styles.subtitle2}>|</Text>
                    <Text style={styles.subtitle2}>{this.props.patientProfile.patientDetails.CommonDetails.Gender}</Text>
                  </View>

                </View>

              </View>
              {!this.props.menuState ? (this.props.loading ? <ActivityIndicator size="large" style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', position: 'absolute', zIndex: 1, bottom: 20, right: 10, }} color="#0065d7" /> : <TouchableOpacity onPress={() => this.validateInputs()} style={styles.ViewImage}>
                <Image style={styles.Image} source={this.props.rightImage} />
              </TouchableOpacity>) : null}

            </View >
            :
            <View style={styles.container} >

              <TouchableOpacity onPress={this.props.leftImageClick} style={styles.ViewImage}>
                <Image style={styles.Image} source={this.props.leftImage} />
              </TouchableOpacity>
              <View style={styles.ViewText}>
                <Text style={styles.subtitle}>{this.props.tabTitle}</Text>

              </View>
              {!this.props.menuState ? (this.props.loading ? <ActivityIndicator size="large" color="#0065d7" style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', position: 'absolute', zIndex: 1, bottom: 20, right: 10, }} />
                : <TouchableOpacity onPress={() => this.validateInputs()} style={styles.ViewImage}>
                  <Image style={styles.Image} source={this.props.rightImage} />
                </TouchableOpacity>) : null}

            </View >}
        </View>


        <View style={{ flex: (Platform.OS == "android" ? 0.87 : 0.9), height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS == "ios" ? -50 : 0}>


            <Tab.Navigator lazy={false} s tabBar={props => <this.MyTabBar screenState={this.state} {...props} />}
              screenOptions={{
                lazy: false
              }}>

              {this.returnTabAppContainer(this.props.tabArray)}
            </Tab.Navigator>


          </KeyboardAvoidingView>
        </View>

        {/*Date Modal*/}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.setDate}
          date={this.state.dateFor == "LMP" ? new Date() : this.state.patientDetails.CommonDetails.DOB ?
            new Date(this.state.patientDetails.CommonDetails.DOB) : new Date()}
          maximumDate={new Date()}
          onCancel={this.cancelDatePicker.bind(this)}
        />
        {/*Ends*/}
      </View>
    )
  }
}
const mapStateToProps = state => ({
  auth: state.auth,

});


export default connect(
  mapStateToProps,
  null
)(withDb(PatientParentTab));

const styles = StyleSheet.create({
  tabStyle: {

    backgroundColor: '#ffffff'
  },
  tabText: {
    textTransform: "uppercase",
    color: "#959595", fontSize: 14,
    fontFamily: 'NotoSans', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0869d8",
    fontSize: 14,
    fontFamily: 'NotoSans-Bold', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeCamTab: {
    borderBottomWidth: 4, borderColor: "#0869d8", paddingRight: 10, paddingLeft: 10
  },
  deactiveCamTab: {
    borderBottomWidth: 4, borderColor: "transparent", paddingRight: 10, paddingLeft: 10
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },
  deactiveTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "transparent"
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: (Platform.OS == "android" ? 20 : 0)


  },
  ViewImage: {
    flex: 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  ViewText: {
    flex: 0.76,
    justifyContent: 'center'
  },
  title: {
    fontSize: 12,
    color: 'grey'
  },
  subtitle: {
    fontSize: 20,
    color: '#717171',
    fontFamily: 'NotoSans'
  },
  subtitle2: {
    fontSize: 12,
    color: '#717171',
    fontFamily: 'NotoSans'
  },
  Image: {
    resizeMode: 'contain',
    height: 20
  }
});

