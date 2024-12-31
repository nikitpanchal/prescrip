/* Developed by Ruban 
  on 8/10/20 */
//FlatList for Allergies Container
import React, { Component } from 'react'
import { View, Text, Alert, BackHandler } from 'react-native'
import AllergyFlatList from '../../components/FlatlistModeule/AllergyFlatList'
import { icon_search_button_blue, icon_List_First_Element_Add_Button_Blue, ic_add_blue } from '../../constants/images'
import Images from '../../Theme/Images'
import { connect } from 'react-redux'
import { withDb } from "../../DatabaseContext/withDatabase";
import { setPatientAllergy, addPatientAllergy } from "../../actions/patientProfie";
import { add_custom_data } from '../../actions/sync';
import multipleTapHandler from '../../components/MultiTapHandle/index';
class FlatlistSearchAllergyContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      enterData: "",
      addView: false,
      refresh: false,
    }
    this.allergyArr = [];
    this.LastCloudSync = null;
    this.recentEnv = [];
    this.recentFood = [];
    this.recentDrugs = [];
    this.recentOthers = [];
    this.searchText = [];
    this.db = this.props.databaseContext.db;

  }

  // onpress save data
  //   _storeDB(sr, tbname, data) {
  //     this.props.databaseContext.db.transaction((tx) => {
  //      let  query =  'INSERT INTO '+ tbname + ' (_id, PatientHabits) VALUES (?,?)';
  //      

  //         tx.executeSql(query, [5, data], (tx, results) => {
  //           
  //           if (results.rowsAffected > 0) {
  //             Alert.alert(
  //               'Success',
  //               'You are Registered Successfully',
  //               [
  //                 {
  //                   text: 'Ok',
  //                   onPress: () => navigation.navigate('HomeScreen'),
  //                 },
  //               ],
  //               { cancelable: false }
  //             );
  //           } else alert('Registration Failed');
  //         }
  //       );
  //     });

  // }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack();
    return true;
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator()

    this.allergyArr = this.props.patientProfile.patientAllergy ? this.props.patientProfile.patientAllergy : {};
    this.getDbData();

  }
  getDbData() {
    let AlleryData = {};
    let masterData = null;
    let recentData = null;
    this.db.transaction((tx) => {
      let masterQuery = "SELECT Data from MasterData where Srno=18";
      tx.executeSql(masterQuery, [], (tx, result) => {
        let resData = result.rows.raw()[0];

        masterData = JSON.parse(resData.Data);
        if (masterData.length > 0) {
          masterData = masterData[0].Value;

          masterData.forEach(item => {
            AlleryData[item[0] == "Others" ? "Other" : item[0]] = item[1] ? JSON.parse(item[1]) : [];
          });

        }
        else {
          AlleryData["Environmental"] = [];
          AlleryData["Food"] = [];
          AlleryData["Drugs"] = [];
          AlleryData["Other"] = []
        }
        let recentQuery = "SELECT EnvAllergy, FoodAllergy, DrugsAllergy, OthersAllergy, LastCloudSync from Recents where DoctorID ='" + this.props.doctorProfile.DoctorData._id + "'";

        tx.executeSql(recentQuery, [], (tx, result) => {
          let resRecent = result.rows.raw()[0];

          this.LastCloudSync = resRecent.LastCloudSync;
          this.recentEnv = JSON.parse(resRecent.EnvAllergy);
          this.recentFood = JSON.parse(resRecent.FoodAllergy);
          this.recentDrugs = JSON.parse(resRecent.DrugsAllergy);
          this.recentOthers = JSON.parse(resRecent.OthersAllergy);

          AlleryData.Environmental = [...AlleryData.Environmental, ...this.recentEnv];
          AlleryData.Food = [...AlleryData.Food, ...this.recentFood];
          AlleryData.Drugs = [...AlleryData.Drugs, ...this.recentDrugs];
          AlleryData.Other = [...AlleryData.Other, ...this.recentOthers];

          this.allergyArr = AlleryData;
          this.setState({
            refresh: true
          })


        }, (error) => {

        })


      }, (error) => {

      })

    });
  }
  enterAllergy(txt) {
    this.searchText = [... this.allergyArr[this.props.patientProfile.allergyType]];
    if (this.allergyArr[this.props.patientProfile.allergyType].length > 0 && txt.trim() != '') {
      this.searchArray = [... this.allergyArr[this.props.patientProfile.allergyType]];


      if (txt != '') {
        this.searchArray = this.searchArray.filter(x => x.toLowerCase().startsWith(txt.toLowerCase()));
      }
      else {
        this.searchArray = this.allergyArr[this.props.patientProfile.allergyType];
      }

    }
    else {
      this.searchArray = [];
    }
    this.setState({ enterData: txt, addView: true })

  }

  addItemFun() {
    if (!this.allergyArr[this.props.patientProfile.allergyType]) {
      this.allergyArr[this.props.patientProfile.allergyType] = [];
    }
    //this.setArr.splice(0,0,item);
    if (this.allergyArr[this.props.patientProfile.allergyType].indexOf(this.state.enterData) > -1) {
      Alert.alert("Prescrip", "Already added");
    }
    else {
      let key = "";
      switch (this.props.patientProfile.allergyType) {
        case 'Environmental':
          key = "EnvAllergy";
          break;
        case 'Food':
          key = "FoodAllergy";
          break;
        case 'Drugs':
          key = "DrugsAllergy";
          break;
        case 'Other':
          key = "OthersAllergy"
          break;
      }

      this.addAllergyDb(key, this.state.enterData);
      this.setState({ addView: false, enterData: "" })
      //this.allergyArr[this.props.patientProfile.allergyType].splice(0, 0, this.state.enterData)

    }

    //this.props.setPatientAllergy(this.allergyArr)
    //this.setState({ addView: false, enterData: "" })

  }
  addAllergyDb(key, allergy) {
    // "DoctorId": doctorId,
    // "key": key,
    // "newData": newData,
    // "lastCloudSync": this.lastCloudSync

    let allergydata = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      key: key,
      newData: allergy,
      lastCloudSync: this.LastCloudSync

    }
    this.props.add_custom_data(allergydata).then(response => {

      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(key, allergy);

      }
    });

  }
  updateRecentDb(key, value) {
    let newData = [];
    switch (key) {
      case 'EnvAllergy':
        newData = this.recentEnv;
        newData.unshift(value);

        break
      case 'FoodAllergy':
        newData = this.recentFood;
        newData.unshift(value);
        break;
      case 'DrugsAllergy':
        newData = this.recentDrugs;
        newData.unshift(value);
        break;
      case 'OthersAllergy':
        newData = this.recentOthers;
        newData.unshift(value);

        break;
    }
    let self = this;
    this.db.transaction((tx) => {
      let allergyQuery = "UPDATE Recents SET " + key + " = '" + JSON.stringify(newData).replace(/\'/g, "''") + "', LastCloudSync= " + JSON.stringify(this.LastCloudSync) + " where DoctorID ='" + this.props.doctorProfile.DoctorData._id + "'";

      tx.executeSql(allergyQuery, [], (tx, result) => {

        this.allergyArr[this.props.patientProfile.allergyType].splice(0, 0, value)



        self.props.setPatientAllergy(this.allergyArr)
       

      }, (error) => {

      })

    });




  }


  render() {
    return (

      <AllergyFlatList {...this.props}
        leftImage={Images.ic_black_back}
        rightImage={icon_search_button_blue}
        searchTitle={"Search for " + this.props.patientProfile.allergyType + " based Allergen"}
        searchText={(txt) => this.enterAllergy(txt)}
        enterText={this.state.enterData}
        patientData={this.props.patientProfile.habits}
        subTitle={"Add as Allergen"}
        filterData={this.state.enterData.trim().length == 0 ? (this.allergyArr[this.props.patientProfile.allergyType] ?
          this.allergyArr[this.props.patientProfile.allergyType] : []) : this.searchArray}
        backPress={() => this.handleBackButtonClick()}
        addImage={ic_add_blue}
        addView={this.state.addView}
        addImgClick={() => this.addItemFun()}
      />
    )
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  patientProfile: state.patientProfile,
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = dispatch => ({

  updatePatientHabits: (patientHabits) => dispatch(updatePatientHabits(patientHabits)),
  setPatientAllergy: (patientAllergy) => dispatch(setPatientAllergy(patientAllergy)),
  addPatientAllergy: (allergy) => dispatch(addPatientAllergy(allergy)),
  add_custom_data: (allergy) => dispatch(add_custom_data(allergy)),

});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(FlatlistSearchAllergyContainer));