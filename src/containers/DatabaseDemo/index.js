import { result } from 'lodash';
import React from 'react';
import {
  View, Text, Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform, ToastAndroid, TextInput, ScrollView,
} from 'react-native';
import { diffClamp } from 'react-native-reanimated';
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import Geolocation from 'react-native-geolocation-service';
class DatabaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chiefMaster: [],
      chiefRecent: [],
      complaint: "",
      forceLocation: true,
      highAccuracy: true,
      locloading: false,
      showLocationDialog: true,
      significantChanges: false,
      updatesEnabled: false,
      foregroundService: false,
      location: {},
    }
  }
  componentDidMount() {
    // this.addDocToDB();
  }
  //Location function
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Prescrip", 'Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert("Prescrip", 'Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ locloading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: position, locloading: false });
          alert(JSON.stringify(position));
        },
        (error) => {
          this.setState({ locloading: false });
          alert(JSON.stringify(error));
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} top={40}>
        <ScrollView>
          <Button title={"Get Location"} onPress={this.getLocation}
            disabled={this.state.locloading || this.state.updatesEnabled}></Button>
          <View style={{ padding: 20 }}>
            <Text>Chief Complaint Demo</Text>
            <Button style={{ padding: 20 }} title={"Get All Chief Complaints"} onPress={() => this.getAllChiefComplaints(8)} />
            <TextInput style={{ padding: 20 }}
              onChangeText={(text) => {
                this.setState({
                  complaint: text
                })
              }}
              placeholder={"Enter custom chief complaint hear"} />
            <Button title={"Insert Chief Complaints"} onPress={() => this.updateRecentChiefComplaint()} />

          </View>
          <View style={{ padding: 20 }}>
            <Text>Drug Allergy Demo</Text>
            <Button style={{ padding: 20 }} title={"Get All  Drug Allergy"} />
            <TextInput style={{ padding: 20 }}
              placeholder={"Enter custom Drug Allergy hear"} />
            <Button title={"Insert Drug Allery"} />

          </View>
          <View style={{ padding: 20 }}>
            <Text>Specialization Demo</Text>
            <Button style={{ padding: 20 }} title={"Get All Specialization"} />
            <TextInput style={{ padding: 20 }}
              placeholder={"Enter custom Specialization hear"} />
            <Button title={"Insert Specialization"} />

          </View>

        </ScrollView>
      </View>
    )
  }
  addDocToDB() {
    let doc_id = this.props.doctorProfile.DoctorData._id;
    let insertQuery = "INSERT INTO Recents (_id, DoctorID) VALUES ('" + doc_id + "', '" + doc_id + "')";

    try {
      this.props.databaseContext.db.transaction((tx) => {
        tx.executeSql(insertQuery, [], (tx, result) => {
          if (result.insertId != 0) {
            alert("Doctor Inserted into DB");
          }

        });

      });
    }
    catch (e) {

    }

  }
  getAllChiefComplaints(srno) {
    let doc_id = this.props.doctorProfile.DoctorData._id;
    let masterList, recentList;
    //Get Data from Master
    let queryMaster = "SELECT Data from MasterData where Srno=" + srno;

    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(queryMaster, [], (tx, result) => {
        masterList = JSON.parse(result.rows.raw()[0].Data);

        this.setState({
          chiefMaster: masterList
        })
      })
    });
    //Get Data from Recents
    let queryRecent = "SELECT ChiefComplaints from Recents where DoctorID ='" + doc_id + "'";

    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(queryRecent, [], (tx, result) => {
        recentList = JSON.parse(result.rows.raw()[0].ChiefComplaints);

        this.setState({
          chiefRecent: recentList
        }, () => this.mergeChiefComplaints())
      })
    });




  }
  mergeChiefComplaints() {
    if (this.state.chiefRecent != null) {

      //Merger Master and Recents and bind to view
    }
  }
  updateRecentChiefComplaint() {
    let doc_id = this.props.doctorProfile.DoctorData._id;

    let data =
      { "DataInfo": ["Name", "Count"], "DataValues": [] }
    if (this.state.chiefRecent == null) {
      data =
        { "DataInfo": ["Name", "Count"], "DataValues": [] }
    }
    else {
      data = this.state.chiefRecent;
      this.setState({
        chiefRecent: data
      });
    }
    let item = [];
    item.push(this.state.complaint);
    item.push(1);
    item.push(1);
    data.DataValues.push(item);
    let updateQuery = "UPDATE Recents SET ChiefComplaints ='" + JSON.stringify(data).replace(/\'/g, "''") + "' where DoctorID= '" + doc_id + "'";
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(updateQuery, [], (tx, result) => {

        if (result.rowsAffected == 1) {
          alert("Updated successfully");
        }
      })
    });

  }
  getAllSpecialization() {

  }
  updateRecentSpecialization() {

  }
  getAllDurgAllergies() {

  }
  updateRecentDrugAllergies() {

  }

}

const mapStateToProps = state => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile
});
export default connect(
  mapStateToProps, null
)(withDb(DatabaseDemo));