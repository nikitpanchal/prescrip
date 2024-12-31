/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { View, Text, BackHandler } from 'react-native'
import FlatlistSearch from '../../components/FlatlistModeule/FlatlistModule'
import { icon_search_button_blue, icon_List_First_Element_Add_Button_Blue, ic_add_blue } from '../../constants/images'
import Images from '../../Theme/Images'
import { connect } from 'react-redux'
import { withDb } from "../../DatabaseContext/withDatabase";
import { updatePatientHistory, setPatientHistory } from "../../actions/patientProfie";
import { add_custom_data } from '../../actions/sync';
import multipleTapHandler from '../../components/MultiTapHandle/index';
class FlatlistSearchHistoryContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      //REmove enterData if all is fine
      enterData: {
        entertext: '',
        duration: '',
        period: '',
        relatedto: ''
      },
      value: "",
      addView: false,
    }
    this.historyArr = this.props.patientProfile.patientHistory;
    this.db = this.props.databaseContext.db;
    this.LastCloudSync = null;
    this.searchArray = [];
    this.recentArr = [];
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }


  componentDidMount() {
    multipleTapHandler.clearNavigator()

    this.getDbData();
  }
  enterHistory(txt) {

    if (this.props.patientProfile.patientHistory.length > 0 && txt.trim() != '') {
      this.searchArray = [...this.props.patientProfile.patientHistory[0].Value];


      if (txt != '') {
        this.searchArray = this.searchArray.filter(x => x.toLowerCase().startsWith(txt.toLowerCase()));
      }
      else {
        this.searchArray= this.props.patientProfile.patientHistory[0].Value
      }

    }
    else {
      this.searchArray = [];
    }
    this.setState({
      addView: true,
      value: txt
    });
  }
  getDbData() {
    this.db.transaction((tx) => {
      let masterQuery = "SELECT Data from MasterData where Srno=69";
      tx.executeSql(masterQuery, [], (tx, result) => {
        let resData = result.rows.raw()[0];

        this.historyArr = JSON.parse(resData.Data);
        //this.LastCloudSync=resData.LastCloudSync;
        let recentQuery = "SELECT FamilyHistory, LastCloudSync from Recents where DoctorID ='" + this.props.doctorProfile.DoctorData._id + "'";

        tx.executeSql(recentQuery, [], (tx, result) => {
          let recData = result.rows.raw()[0];

          this.recentArr = JSON.parse(recData.FamilyHistory);
          this.LastCloudSync = recData.LastCloudSync;

          let masterArr = this.historyArr[0].Value;
          this.historyArr[0].Value = [...this.recentArr, ...masterArr];
          this.props.updatePatientHistory(this.historyArr);
          this.setState({ addView: false })
        }, (error) => {

        })


      }, (error) => {

      })
    });
  }
  addItemFun() {
    this.addHistoryDb("FamilyHistory", this.state.value)


  }
  addHistoryDb(key, history) {
    // "DoctorId": doctorId,
    // "key": key,
    // "newData": newData,
    // "lastCloudSync": this.lastCloudSync

    let historyData = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      key: key,
      newData: history,
      lastCloudSync: this.LastCloudSync

    }
    this.props.add_custom_data(historyData).then(response => {

      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(key, history);

      }
    });

  }
  updateRecentDb(key, value) {
    let newData = this.recentArr;
    newData.unshift(value);
    
    this.db.transaction((tx) => {
      let allergyQuery = "UPDATE Recents SET " + key + " = '" + JSON.stringify(newData).replace(/\'/g, "''") + "', LastCloudSync= " + JSON.stringify(this.LastCloudSync) + " where DoctorID ='" + this.props.doctorProfile.DoctorData._id + "'";

      tx.executeSql(allergyQuery, [], (tx, result) => {

        let historyValues = this.historyArr[0].Value;
        historyValues.push(value);

        this.historyArr[0].Value = historyValues;
        this.props.updatePatientHistory(this.historyArr);
        this.setState({ addView: false, value: ""  });

      }, (error) => {

      })

    });

  }

  render() {
    return (
      <FlatlistSearch {...this.props}
        leftImage={Images.ic_black_back}
        rightImage={icon_search_button_blue}
        searchTitle={"Search for history"}
        searchText={(txt) => this.enterHistory(txt)}
        enterText={this.state.value}
        patientData={this.props.patientProfile.history}
        subTitle={"Add as history"}
        type={"History"}
        filterData={
          this.state.value.length == 0 ? (this.props.patientProfile.patientHistory.length > 0 ?
            this.props.patientProfile.patientHistory[0].Value : []) : this.searchArray}
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

  updatePatientHistory: (patientHistory) => dispatch(updatePatientHistory(patientHistory)),
  setPatientHistory: (history) => dispatch(setPatientHistory(history)),
  add_custom_data: (history) => dispatch(add_custom_data(history)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(FlatlistSearchHistoryContainer));