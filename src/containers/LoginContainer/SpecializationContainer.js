/* created by ruban
specialization container  */
import React, { Component } from "react";
import { View, Dimensions, BackHandler, ToastAndroid } from "react-native";
import { withDb } from "../../DatabaseContext/withDatabase";
import Specialization from "../../components/Login/Specification";
import {
  setDoctorData,
  setDoctorSpecialization,
} from "../../actions/doctorProfile";
import { connect } from "react-redux";
import { Container } from "native-base";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

let currentCount = 0;
class SpecializationContainer extends Component {
  constructor(props) {
    super(props);
    this._handleBackPress = this._handleBackPress.bind(this);
    this.state = {
      doctorId: props.auth.doctorid,
      primarySpecialization: props.doctorProfile.DoctorData
        .PrimarySpecialization
        ? props.doctorProfile.DoctorData.PrimarySpecialization
        : "",
      specArray: [],
      primarySpecUpdate: "",
    };
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "Doctor Specialization",
      screen_class: "SpecializationContainer",
    });
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);

    this.getDataforSpecialization();
  }

  // retrieving specialization from db
  getDataforSpecialization() {
    //const self = this;
    var specializationlist = [];
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(
        "SELECT Data FROM MasterData where Srno=2",
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            specializationlist = JSON.parse(results.rows.raw()[0].Data).Value;

            this.setState({ specArray: specializationlist.sort() });
            resolve(specializationlist);
          }
        },
        (error) => {
          resolve(specializationlist);
        }
      );
    });
  }
  onBackButtonPressAndroid = () => {
    if (currentCount < 1) {
      currentCount += 1;
      //alert('dsg')
      ToastAndroid.showWithGravityAndOffset(
        "Press again to close!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        200
      );
      // Toast.show({ text: 'Press again to close!', duration: 1000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      currentCount = 0;
    }, 2000);
  };
  //back press handler
  _handleBackPress() {
    // this.props.navigation.goBack()
    if (
      this.props.auth.token &&
      this.props.doctorProfile.DoctorData.PrimarySpecialization
    ) {
      this.props.navigation.navigate("Login");
    } else {
      this.onBackButtonPressAndroid();
    }

    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }

  // navigation to next page

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <Specialization
          {...this.props}
          //array of specialization
          specArray={this.state.specArray}
          //doctor id
          doctorId={this.state.doctorId}
          //navigation props
          onNavigate={() => this.onNavigate()}
          //default specialization of doctor stored in doctorProfile reducer
          primarySpecialization={this.state.primarySpecialization}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  setDoctorSpecialization: (doctorId, primarySpecialization) =>
    dispatch(setDoctorSpecialization(doctorId, primarySpecialization)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(SpecializationContainer));
