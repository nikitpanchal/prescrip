import React from 'react';
import { Text, Container } from "native-base";
import { View, SafeAreaView, ScrollView, StatusBar, Alert, TouchableOpacity, Dimensions, Image, BackHandler, StyleSheet } from "react-native";

import { Black_back, save_blue_btn } from '../../constants/images'
import { withDb } from "../../DatabaseContext/withDatabase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { connect } from "react-redux";
import Attachment from "../../components/Module/Attachment";
import Reading from "../../components/Module/Reading";
import History from "../../components/Module/History";

import { add_custom_data } from '../../actions/sync';
import PrescriptionLoader from '../../components/Loading/prescriptionLoader';

import { RNS3 } from 'react-native-aws3'
import { generateGuid, getSizeOfDoc, calculateAge } from '../../commonmethods/common';

import multipleTapHandler from '../../components/MultiTapHandle/index';
 
import { get_chief_suggestions, patientvisits, setPrescription } from "../../actions/patientVisit";
import { setAttachmentData, setUploadImages, resetAttachmentData, setItem, setMData } from "../../actions/attachment";
import { setReadingUnit, setReading, setAttachmentDataS3, setDataEditing, setAttachmentEditing } from "../../actions/attachment";

import CButton from "../../components/CommonComponents/CButton";
 
var Value = "";
var Unit = "";
var attachmentArray = [];
const Tab = createMaterialTopTabNavigator();
class AttachmentsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);

    this.state = {
      Value: "",
      Unit: "",
      attachmentArray: [],
      loading: false
    };
  }

  Navigateback = () => {

    this.handleBackButtonClick()

  }



  componentDidMount() {
    multipleTapHandler.clearNavigator();
    if (this.props.isDataEditing) {
      this.props.setAttachmentDataS3(this.props.Upload)

    } else {
      this.props.setAttachmentDataS3([])

    }
    this.props.setAttachmentEditing(false)
  }


  //First upload images on S3
  uploadToAws(file) {
    return new Promise((resolve, reject) => {
      let options = {
        keyPrefix: "investigationImg/",
        bucket: "prescripimage",
        region: "ap-southeast-1",
        accessKey: "AKIA2P5O2LH6PGYG3CI3",
        secretKey: "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",
        successActionStatus: 201,
        awsUrl: "s3.amazonaws.com/"
      };
      RNS3.put(file, options).then(response => {
        if (response.status == 201) {
          //  alert(response.status);
          // this.onFilesReceived(response.body.postResponse.key.split('/')[1])
          resolve(response.body.postResponse.key.split('/')[1])
        } else {
          alert("Failed to upload image");
        }
      });
    });
  }

  uploadImages(attachmentDataS3) {
    return new Promise((resolve, reject) => {
      let uploadArray = [];
      let t = 0;
      attachmentDataS3.map((i, index) => {
        // alert(JSON.stringify(i))

        let ext = '';


        if (!i.type) {
          uploadArray.push(i);
          if (t === (attachmentDataS3.length - 1)) {

            resolve(uploadArray)
          } else {
            t += 1

          }

        } else {


          if (i.type == "application/pdf")
            ext = i.name.split('.')[i.name.split('.').length - 1]
          else
            ext = i.fileName.split('.')[i.fileName.split('.').length - 1] == '' ? 'jpg' : i.fileName.split('.')[i.fileName.split('.').length - 1]


          let file = {
            uri: i.uri,
            name: generateGuid() + "_" + i.titleName + "." + ext,
            type: i.type
          }
          this.uploadToAws(file).then((val) => {
            let uploadData = {
              image: val,
              imageName: generateGuid() + "_" + i.titleName + "." + ext,
              titleName: i.titleName,
              base64Data : i.base64
            
            }
            uploadArray.push(uploadData);
            uploadData = {};

            if (t === (attachmentDataS3.length - 1)) {

              resolve(uploadArray)
            } else {
              t += 1

            }


          })
          //  alert(JSON.stringify(uploadArray));

        }
      });


    })
  }

  setCalData(uploadArray) {
    let { type, Name, Value, Graph, Unit, callFrom, keyBoradType, Upload, DataType, mdata, attachmentDataS3, setUploadImages } = this.props, tempData;
    type = 'Findings'
    let x = {};
    switch (type) {
      case 'ChiefComplaints':
        x = {
          Name,
          Value
        }
        break;
      case 'Findings':
        x = {
          DataType,
          Graph,
          Unit,
          Upload: uploadArray,
          Name,
          callFrom,
          keyBoradType
        }
        break;
      case 'Investigation':
        x = {
          DataType,
          Graph,
          Unit,
          Upload: uploadArray,
          Name,
          callFrom,
          keyBoradType
        }
        break;
      default:
      // code block
    }

    let isfound = false
    tempData = mdata.map(i => {
      if (i.Name === x.Name) {
        isfound = true
        return x
      } else {
        return i
      }
    })
    if (!isfound) {
      tempData.push(x)
    }
    return tempData
  }
  onDataChange(data) {
    if (data.key == "Unit") {
      Unit = data.value;

      // this.setState({

      //   Unit : data.value

      // });
    }
    else {
      Value = data.value;
      // this.setState({
      //   Value : data.value
      // })
    }

  }




  returnSortedData(key, _callback) {
    const self = this;
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql("SELECT " + key + ", LastCloudSync FROM Recents where DoctorID = '" + self.props.doctorProfile.DoctorData._id + "'", [], (tx, results) => {
        if (results.rows.length > 0) {

          let brandDataValue1 = results.rows.raw()[0];
          var lstCsycndate = results.rows.raw()[0].LastCloudSync;

          switch (key) {
            case "Findings":

              _callback([], JSON.parse(brandDataValue1.Findings), lstCsycndate, "");


              break;

            case "Investigation":

              _callback([], JSON.parse(brandDataValue1.Investigation), lstCsycndate, "");
              break;

            default:
              _callback([], [], lstCsycndate, "");
              break;
          }

        }

        else {
          _callback(jsonData, [], lstCsycndate, "");
        }




      }, (error) => {
        _callback([], [], "");
      });
    });
  }
  addNewCustomDataServer() {

    let { DoctorData } = this.props.doctorProfile
    let RecentData = this.props.route.params.RecentData
    let key = this.props.route.params.type
    let newData = [this.props.route.params.data[0], Unit]
    let data = {
      "DoctorId": DoctorData._id,
      "key": key,
      "newData": newData,
      "lastCloudSync": new Date()
    }


    RecentData.unshift(newData)

    this.props.add_custom_data(data).then(response => {

      if (response.payload.data.status == 1) {
        this.updateDoctorRecentsCustom(key, response.payload.data.LastCloudSync, response.payload.data.IsUpdateReq, DoctorData._id, RecentData)
      } else {
        alert(response.payload.data.msg)
      }
    })
  }


  addNewCustomDataServer1(data, RecentData) {




    this.props.add_custom_data(data).then(response => {

      if (response.payload.data.status == 1) {


        this.updateDoctorRecentsCustom(data.key, response.payload.data.LastCloudSync, response.payload.data.IsUpdateReq, data.DoctorId, RecentData)


      } else {
        alert(response.payload.data.msg)

      }


    })


  }

  updateDoctorRecentsCustom(key, lastCloudSync1, isUpdateReq, doctorId, final_Data) {
    var self = this;
    lastCloudSync = lastCloudSync1 ? lastCloudSync1 : new Date();

    this.props.databaseContext.db.transaction((tx) => {
      let query = "UPDATE Recents SET " +
        key + " = '" + JSON.stringify(final_Data).replace(/\'/g, "''") + "'," +
        "LastCloudSync = '" + lastCloudSync.replace(/\'/g, "''") +
        "' where DoctorID = '" + doctorId + "'";


      tx.executeSql(query, [], (tx, results) => {

        if (results.rowsAffected == 1) {
          // alert("Updated successfully");
          // self.getChiefComplients()
        }

      }, (error) => {

      });
    }, (error) => {

    });




  }



  onSubmitClick() {

    if (this.props.route.params.callFrom == "custom") {
      this.addNewCustomDataServer()
    } else if (this.props.callFrom == 'recent') {

      this.returnSortedData(this.props.type, (data1, recents, lastsyncDate, addedbydoc) => {

        let newArray = [];
        let oldArray = [];


        recents.forEach((element, index) => {

          if (this.props.type == "Investigation" || this.props.type == "Findings") {

            if (Array.isArray(element)) {
              if (element[0] == this.props.Name) {
                oldArray = recents[index];

                recents[index] = [element[0], this.props.Unit]
                newArray = recents[index];
              }
            } else if (element == this.props.Name) {
              oldArray = recents[index];

              newArray = [element, this.props.Unit];
              recents[index] = [element, this.props.Unit];
            }

          }

        });





        if (Array.isArray(oldArray)) {

          if (oldArray != '' && newArray != []) {
            let values = {
              "DoctorId": this.props.doctorProfile.DoctorData._id,
              "key": this.props.type,
              "newData": newArray,
              "oldData": oldArray,
              "lastCloudSync": new Date()
            }
            if (oldArray[1] != newArray[1]) {
              this.addNewCustomDataServer1(values, recents)
            }

          }


        } else {
          if (newArray != []) {
            let values = {
              "DoctorId": this.props.doctorProfile.DoctorData._id,
              "key": this.props.type,
              "newData": newArray,
              "oldData": oldArray,
              "lastCloudSync": new Date()
            }
            this.addNewCustomDataServer1(values, recents)


          }

        }



        //Merge Data of recents @addData

        resolve(

          //   this.updateDoctorRecentsCustom(this.props.type, new Date(), '', this.props.doctorProfile.DoctorData._id, recents)


        )
      });

    }
    // alert(this.props.route.params.callFrom);

    if (Value) {
      this.props.setReading(Value);
      Value = '';
    }
    if (Unit) {
      this.props.setReadingUnit(Unit);
      Unit = '';

    }
    setTimeout(() => {
      this.submitData();
    }, 100)
  }


  resetAttachmentDataForAllTab() {
    this.props.setReadingUnit('');
    Unit = '';
    this.props.setReading('');
    Value = '';
    this.props.setAttachmentDataS3([])
    this.props.setDataEditing(false)
    attachmentArray = [];
  }
  submitData = () => {

    let { resetAttachmentData, setMData, isAttachmentEditing, isDataEditing, attachmentDataS3, route, navigation, setUploadImages } = this.props, tempData;
    route.params.updateData("value");

    if (attachmentDataS3.length > 0 && isAttachmentEditing) {

      this.setState({
        loading: true
      })
      this.uploadImages(attachmentDataS3).then((uploadArray) => {
        setUploadImages(uploadArray);
        tempData = this.setCalData(uploadArray)
        resetAttachmentData()
        this.resetAttachmentDataForAllTab()
        setMData(tempData)
        this.props.setReading('');
        this.props.setReadingUnit('');
        this.setState({
          loading: false
        })
        navigation.pop()
      })
    }
    else if (isDataEditing && !isAttachmentEditing) {
      setUploadImages(attachmentDataS3);
      tempData = this.setCalData(attachmentDataS3)
      this.resetAttachmentDataForAllTab()
      setMData(tempData)
      this.props.setReading('');
      this.props.setReadingUnit('');
      this.setState({
        loading: false
      })
      navigation.pop()
    }
    else {

      setUploadImages([]);
      tempData = this.setCalData([])
      this.resetAttachmentDataForAllTab()
      setMData(tempData)
      this.props.setReading('');
      this.props.setReadingUnit('');
      this.setState({
        loading: false
      })
      navigation.pop()
    }



  }


  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {


    Alert.alert(

      "Prescrip",
      "Are you sure you want to go back will discard all changes?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () =>

            this.backClick()
        }
      ],
      { cancelable: false }
    );

    return true;




  }

  backClick() {
    resetAttachmentData()
    this.resetAttachmentDataForAllTab();
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack();
    return true;
  }
  MyTabBar({ state, descriptors, navigation, position, screenState, _color }) {
    return (
      <View style={{
        flexDirection: 'row', backgroundColor: _color ? _color : '#0065d7'
      }}
        style={{
          backgroundColor: '#fff', borderBottomWidth: 1
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

              <TouchableOpacity
                activeTextStyle={{ color: _color ? _color : '#0065d7', fontFamily: 'NotoSans-Bold' }}
                textStyle={{ color: '#919191', fontSize: 16, fontFamily: 'NotoSans-Bold' }}
                tabStyle={{ backgroundColor: '#fff' }}
                activeTabStyle={{ backgroundColor: '#fff' }}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={isFocused ? styles.activeCamTab : styles.deactiveCamTab}
              >
                <View style={{
                  backgroundColor: '#fff', height: 8, alignSelf: 'flex-end',
                  width: 8, borderRadius: 8
                }}></View>
                < Text style={{
                  color: isFocused ? (_color ? _color : '#0065d7') : '#919191', fontSize: 16, padding: 10, fontFamily: 'NotoSans-Bold'
                }}>{label}</Text>
              </TouchableOpacity>
            );

          })}
        </ScrollView>
      </View >
    );
  }
  render() {
    let { data } = this.props.route.params
    let { statusBarHeight } = this.props.databaseContext
    let self = this;
    let { colorCode, patientname, patientDetails } = this.props

    let FullName, Gender = 'Other', DOB = new Date();
    if (patientDetails) {
      let { CommonDetails } = patientDetails
      FullName = CommonDetails.FullName;
      Gender = CommonDetails.Gender;
      DOB = CommonDetails.DOB ? calculateAge(CommonDetails.DOB, false) : '';
    }

    return (

      <Container
        style={{ flex: 1, width:Dimensions.get('window').width }}>

        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
        <SafeAreaView>
          <View style={{
            backgroundColor: '#fff', marginTop: statusBarHeight || 0 + 23, flex: 1,width: Dimensions.get('screen').width

          }}>
            {
              this.state.loading ?

                <View style={{
                  zIndex: 99, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  height: Dimensions.get('screen').height, width: Dimensions.get('screen').width, position: 'absolute'
                }}>
                  <PrescriptionLoader
                    {...this.props}
                    type={'Uploading ' + this.props.type}
                  />
                </View>
                : null
            }


            <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: "space-between", marginTop : statusBarHeight -10 }} >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.9, padding: 0 }}>
                <TouchableOpacity onPress={() => this.handleBackButtonClick()} >
                  <Image source={Black_back} style={{ height: 20, width: 20, resizeMode: 'contain', }} />
                </TouchableOpacity>
                <View style={{}}>
                  <Text style={{ fontSize: 18, paddingStart: 15, color: '#636363', fontFamily: 'NotoSans-Bold', }}>{this.props.Name || data[0]}</Text>
                  <Text style={{ fontSize: 11, paddingStart: 15, color: '#919191', fontFamily: 'NotoSans' }}>{FullName + " | " + DOB.value + " " + DOB.units + " | " + Gender}</Text>
                </View>
              </View>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { multipleTapHandler.multitap(() => this.onSubmitClick(), "FindingSubmit") }} >

                <Image source={save_blue_btn} style={[styles.save_btn_style, { tintColor: colorCode ? colorCode : '#0aadad' }]} />
              </TouchableOpacity>
              {/* <CButton label={'done'} style={{ width: 100,  }} onPress={this.onSubmitClick.bind(this)} /> */}
            </View>


            <View style={{ flex: 1 }}>
              <Tab.Navigator lazy={false} tabBar={props => <this.MyTabBar screenState={this.state}
                {...props} _color={this.props.colorCode} />} sceneContainerStyle={{
                  backgroundColor: "#fff", width: Dimensions.get('window').width,
                }} >

                <Tab.Screen
                  name={'READING'}
                  children={(props) =>
                    <Reading
                      {...self.props}
                      rootNavigation={self.props.route}
                      onDataChange={(data) => self.onDataChange(data)}

                    />

                  }
                  options={{
                    headerShown: false
                  }} />
                <Tab.Screen
                  name={'ATTACHTMENT'}
                  children={(props) =>
                    <Attachment
                      {...self.props}
                      Uploaded={self.props.Upload}
                      rootNavigation={self.props.route}
                      onDataChange={(data) => self.onDataChange(data)}

                    />
                  }
                  options={{
                    headerShown: false
                  }} />
                <Tab.Screen
                  name={'HISTORY'}
                  children={(props) =>
                    <History
                      {...this.props}
                      rootNavigation={this.props.navigation}
                      onDataChange={(data) => this.onDataChange(data)} />
                  }
                  options={{
                    headerShown: false
                  }} />
              </Tab.Navigator>
            </View>

          </View>
        </SafeAreaView>

      </Container>



    );
  }
}

const mapStateToProps = state => ({
  doctorProfile: state.doctorProfile,
  type: state.attachment.type,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  callFrom: state.attachment.callFrom,
  keyBoradType: state.attachment.keyBoradType,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  isAttachmentEditing: state.attachment.isAttachmentEditing,
  isDataEditing: state.attachment.isDataEditing,
  mdata: state.attachment.mdata,


  colorCode: state.attachment.colorCode,
  attachmentDataS3: state.attachment.attachmentDataS3,
  patientDetails: state.patientvisit.patientDetails,

});

const mapDispatchToProps = dispatch => ({
  add_custom_data: (data) => dispatch(add_custom_data(data)),
  resetAttachmentData: () => dispatch(resetAttachmentData()),


  // setKeyboardValue: (userdata) => dispatch(setKeyboardValue(userdata)),


  setMData: (data) => dispatch(setMData(data)),
  setUploadImages: (data) => dispatch(setUploadImages(data)),
  setReading: (userdata) => dispatch(setReading(userdata)),
  setReadingUnit: (userdata) => dispatch(setReadingUnit(userdata)),

  setAttachmentDataS3: (data) => dispatch(setAttachmentDataS3(data)),
  setDataEditing: (data) => dispatch(setDataEditing(data)),
  setAttachmentEditing: (data) => dispatch(setAttachmentEditing(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AttachmentsContainer));

const styles = StyleSheet.create({
  save_btn_style: { height: 23, width: 23, resizeMode: 'contain', },
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
    borderBottomWidth: 4, borderColor: '#0ab2b2', paddingRight: 10, paddingLeft: 10
  },
  deactiveCamTab: {
    borderBottomWidth: 4, borderColor: "transparent", paddingRight: 10, paddingLeft: 10,
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },

})