import React, { Component } from 'react';
import Home from '../../components/Home';
import { connect } from 'react-redux';
import { setTooltip, setNotificationFlags } from '../../actions/home';
import { userRequestLogout } from '../../actions';
import { setCurrentTab, isRefreshBilling, setToken } from '../../actions/auth';
import { clearDoctorData } from '../../actions/doctorProfile';
import { CommonActions } from '@react-navigation/native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Warning } from '../../constants/images'
import { getPaymentLinkSubscription } from "../../actions/patientVisit";
import {
  getRecentData,
  checkSyncRequired,
  getMasterData,
  getAllData,
} from '../../actions/sync';
import { ActivityIndicator, Alert, Linking } from 'react-native';
import { withDb } from '../../DatabaseContext/withDatabase';
import {
  Platform,
  Dimensions,
  View,
  BackHandler,
  ToastAndroid,
  AppState, Image, Text
} from 'react-native';
import {
  isStagging,
  staging,
  prod,
  versionAndroid, versionIOS
} from '../../../app.json';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { setSyncFlag, getAppConfig, setConfigData } from '../../actions/sync';
import {
  setDoctorData,
  setDoctorFees,
  setVideoConsult,
  setHeader,
  setFooter,
} from '../../actions/doctorProfile';
import _, { result } from 'lodash';
import { syncMasterData } from '../DataSyncContainer/asyncDataSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

//For error reporting
import { reportError  } from '../../../app.json';
import axios from 'axios/index';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

let currentCount = 0;
var doctorid = '';
var token = '';
let syncFields = [
  'EnvAllergy',
  'FoodAllergy',
  'DrugsAllergy',
  'RecommendedLabTest',
  'OthersAllergy',
  'PatientHabits',
  'FamilyHistory',
  'ChiefComplaints',
  'Findings',
  'Investigation',
  'Diagnosis',
  'Advice',
  'DosageRegimen',
  'DoseTherapy',
  'newDose',
  'Specialization',
];
function myiOSPromptCallback(permission) {
  // do something with permission value
}

//Error reporting functions
const errorHandler = (e, isFatal) => {
  let apikey = 'RXKSIbnjklOp19PIKNnsmkOrosxkWO==';

  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    apikey: apikey,
    authorization: '',
  };

  if (token) {
    headers.authorization = token;
  }
  if (isFatal) {
    let config = { headers };
    let domain = isStagging ? staging.baseURL : prod.baseURL;

    let userData = {
      urlparameter: null,
      url: '',
      error: JSON.stringify(e.stack), //JSON Object
      doctorid: doctorid,

      source: 'app_v_' + (Platform.OS == "ios" ? versionIOS : versionAndroid),
      errormessage: e.message,
      sectionname: 'app',
      ex: {
        message: e.message,
        stack: JSON.stringify(e.stack),
      },
      whenenterd: new Date().toISOString(),
    };

    axios
      .post(domain + 'submit-bug', userData, config)
      .then(function (response) { })
      .catch(function (error) { });
    Alert.alert(
      'Unexpected error occurred',
      'We have reported this to our team ! Please close the app and start again!',
      [
        {
          text: 'Close',
        },
      ],
    );
  } else {
  }
};
setJSExceptionHandler(errorHandler, reportError);
//Ends
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsUpdateReq: false,
      appState: AppState.currentState

    };
    this.masterData = null;
    this.masterDataSyncs = [];
    this.db = props.databaseContext.db;
    this.IsUpdateReq = false;
    this.isMasterReq = false;
    this.isSync = false;
    this.suggestedData = [];
    this.lastSuggSyncDate = '';
    this.suggestLocalData = [];
    this._handleBackPress = this._handleBackPress.bind(this);










  }

  //back press handler
  _handleBackPress() {
    // this.props.navigation.goBack()
    // alert('xzvv')
    this.onBackButtonPressAndroid();

    return true;
  }
  handleDeepLink = (url) => {
    //Alert.alert(url)
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    if (routeName === 'profile') {
      const username = route.split('/')[1];
      navigation.navigate('Profile', { username });
    }
  };
  onBackButtonPressAndroid = () => {
    if (currentCount < 1) {
      currentCount += 1;
      //alert('dsg')
      ToastAndroid.showWithGravityAndOffset(
        'Press again to close!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        200,
      );
      // Toast.show({ text: 'Press again to close!', duration: 1000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      currentCount = 0;
    }, 2000);
  };
  getMasterLastUpdate() {
    this.IsUpdateReq = false;
    this.isMasterReq = false;
    let query = 'SELECT Srno, LastUpdated from MasterData';
    this.db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          this.masterDataSyncs = result.rows.raw();
          let tabQuery = 'SELECT LastUpdated from Tablets';
          tx.executeSql(
            tabQuery,
            [],
            (tx, result) => {
              let tabSync = result.rows.raw()[0];

              let tabObj = {
                Srno: 57,
                LastUpdated: tabSync.LastUpdated,
              };
              this.masterDataSyncs.push(tabObj);
              let recentQuery =
                "SELECT LastCloudSync from Recents where DoctorID= '" +
                this.props.doctorProfile.DoctorData._id +
                "'";
              tx.executeSql(
                recentQuery,
                [],
                (tx, result) => {
                  let data = result.rows.raw()[0];

                  let syncdata = {
                    lastSync: data ? data.LastCloudSync : null,
                    synced: this.props.sync.synced,
                  };
                  this.props.setSyncFlag(syncdata);
                  this.checkRecents();
                },
                (error) => {
                  let data = {
                    lastSync: null,
                    synced: this.props.sync.synced,
                  };
                  this.props.setSyncFlag(data);
                  this.checkRecents();
                },
              );
            },
            (error) => { },
          );
        },
        (error) => { },
      );
    });
  }
  //Sync All Recent + Master Data
  getAllData() {
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      masterDataDates: this.masterDataSyncs,
      lastCloudSync: this.props.sync.lastSync ? this.props.sync.lastSync : '',
    };
    this.props.getAllData(data).then((response) => {
      let syncdata = response.payload.data.data;
      //Configure Sync Data
      for (let row of syncFields) {
        if (!syncdata[row]) {
          syncdata[row] = [];
        }
      }

      syncdata['certificate'] = syncdata['certificate']
        ? syncdata['certificate']
        : {};
      let isDataAvailable = false;
      let specialization = this.props.doctorProfile.DoctorData
        .PrimarySpecialization;
      if (specialization == 'Ophthalmologist') {
        syncdata[specialization] = syncdata[specialization]
          ? syncdata[specialization].length == 0
            ? {}
            : syncdata[specialization]
          : {};
      }
      Object.keys(syncdata).forEach(function (k) {
        if (k != '_id' && k != 'Synced' && k != 'DoctorID') {
          if (syncdata[k]) {
            isDataAvailable = true;
          }
        }
      });
      //NEED TO CHECK
      // if (isDataAvailable) {

      //   this.props.navigation.navigate('DataSync', { recentData: syncdata, type: 'recent',time : 0.5 });

      // }
      // else {
      //   let data = {
      //     lastSync: syncData.LastCloudSync ? syncData.LastCloudSync : null,
      //     synced: true
      //   }
      //   this.props.setSyncFlag(data);

      // }
      let masterData = response.payload.data.masterData
        ? response.payload.data.masterData
        : [];
      if (isDataAvailable && masterData.length > 0) {
         
        this.props.navigation.navigate('DataSync', {
          recentData: syncdata,
          masterData: masterData,
          type: 'both',
          time: this.getTime(masterData.length),
        });
      } else if (isDataAvailable) {
        
        this.props.navigation.navigate('DataSync', {
          recentData: syncdata,
          type: 'recent',
          time: 0.5,
        });
      } else if (masterData.length > 0) {
        this.masterData = masterData;
        
        this.props.navigation.navigate('DataSync', {
          recentData: masterData,
          type: 'master',
          time: this.getTime(masterData.length),
        });
      } else {
        this.isMasterReq = false;
        let data = {
          lastSync: this.props.sync.lastSync ? this.props.sync.lastSync : '',
          synced: true,
        };
        this.props.setSyncFlag(data);
        if (this.props.sync.synced && !this.isMasterReq) {
          if (this.props.auth.tooltip == '') {
            this.props.doctorProfile.DoctorData.IsAssistant != 1 || this.props.doctorProfile.DoctorData.RoleId == 3 ?
              this.props.setTooltip('MyPatients') : this.props.setTooltip('Exit');
          }

          this.forceUpdate();
        }
      }
    });
  }
  //Get Recents
  getRecentData() {
    let mobile = this.props.doctorProfile.DoctorData.DoctorMobile;

    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
    };
    this.props.getRecentData(data).then((response) => {
      let syncdata = response.payload.data.data;
      for (let row of syncFields) {
        if (!syncdata[row]) {
          syncdata[row] = [];
        }
      }

      syncdata['certificate'] = syncdata['certificate']
        ? syncdata['certificate']
        : {};
      let isDataAvailable = false;
      let specialization = this.props.doctorProfile.DoctorData
        .PrimarySpecialization;
      if (specialization == 'Ophthalmologist') {
        syncdata[specialization] = syncdata[specialization]
          ? syncdata[specialization].length == 0
            ? {}
            : syncdata[specialization]
          : {};
      }
      Object.keys(syncdata).forEach(function (k) {
        if (k != '_id' && k != 'Synced' && k != 'DoctorID') {
          if (syncdata[k]) {
            isDataAvailable = true;
          }
        }
      });
      if (isDataAvailable) {
        Alert.alert('385')
        this.props.navigation.navigate('DataSync', {
          recentData: syncdata,
          type: 'recent',
          time: 0.5,
        });
      } else {
        let data = {
          lastSync: syncData.LastCloudSync ? syncData.LastCloudSync : null,
          synced: true,
        };
        this.props.setSyncFlag(data);
      }
    });
  }
  createMostUsed() {
    let doc_id = this.props.doctorProfile.DoctorData._id;
    let insertQuery =
      "INSERT INTO MostUsed (_id, DoctorID) VALUES ('" +
      doc_id +
      "', '" +
      doc_id +
      "')";

    try {
      this.props.databaseContext.db.transaction((tx) => {
        let query = `SELECT * from MostUsed where _id='${doc_id}'`;
        tx.executeSql(
          query,
          [],
          (tx, result) => {
            let dbData = result.rows.raw();
            if (dbData.length == 0)
              tx.executeSql(insertQuery)
          },
          (error) => {
            reject(error);
          },
        );


      });
    } catch (e) {
      var x = '';
    }
  }
  getSuggestedData() {
    this.isSync = true;
    let dbData;
    let suggestPromise = new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        let query = `SELECT * from Suggestions where DoctorId='${this.props.doctorProfile.DoctorData._id}'`;
        tx.executeSql(
          query,
          [],
          (tx, result) => {
            dbData = result.rows.raw();
            if (dbData) {
              resolve(dbData);
            } else {
              resolve([]);
            }
          },
          (error) => {
            reject(error);
          },
        );
      });
    });
    suggestPromise.then((result) => {
      if (Array.isArray(result) && result.length > 0) {
        this.suggestLocalData = result;
        let whenUpdated = Math.max.apply(
          Math,
          this.suggestLocalData.map(function (o) {
            return new Date(o.WhenUpdated);
          }),
        );
        whenUpdated = new Date(whenUpdated).toISOString();
        this.lastSuggSyncDate = whenUpdated;
      } else {
        this.suggestLocalData = [];
        this.lastSuggSyncDate = '';
      }
      whenUpdated = null;
      result = null;
      this.getMasterLastUpdate();
      this.createMostUsed();
    });
  }
  async backGroundSyn(masterData) {
    //await nextFrame();
    syncMasterData(masterData, this.db);
  }
  getTime(num_records) {
    let time = (num_records * 30.55) / 1000;
    return time;
  }
  getMasterData() {
    let data = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      masterDataDates: this.masterDataSyncs,
      lastCloudSync: this.props.sync.lastSync ? this.props.sync.lastSync : '',
    };
    this.props.getMasterData(data).then((response) => {
      let masterData = response.payload.data.masterData
        ? response.payload.data.masterData
        : [];

      if (masterData.length > 0) {
        this.masterData = masterData;
         
        this.props.navigation.navigate('DataSync', {
          recentData: masterData,
          type: 'master',
          time: this.getTime(masterData.length),
        });
      } else {
        this.isMasterReq = false;
        let data = {
          lastSync: this.props.sync.lastSync ? this.props.sync.lastSync : '',
          synced: true,
        };
        this.props.setSyncFlag(data);
        if (this.props.sync.synced && !this.isMasterReq) {
          if (this.props.auth.tooltip == '') {
            this.props.doctorProfile.DoctorData.IsAssistant != 1 || this.props.doctorProfile.DoctorData.RoleId == 3 ?
              this.props.setTooltip('MyPatients') : this.props.setTooltip('Exit');
          }


          this.forceUpdate();
        }
      }
    });
  }

  checkRecents() {
    let data = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      masterDataDates: this.masterDataSyncs,
      lastCloudSync: this.props.sync.lastSync ? this.props.sync.lastSync : '',
      lastSuggSyncDate: this.lastSuggSyncDate ? this.lastSuggSyncDate : '',
    };
    this.props.checkSyncRequired(data).then((response) => {
      this.suggestedData = response.payload.data.regTheSugg
        ? response.payload.data.regTheSugg
        : [];

      this.setState({
        IsUpdateReq: response.payload.data.IsUpdateReq,
      });

      this.isMasterReq = response.payload.data.IsMasterUpdateReq;

      if (!this.props.sync.synced) {
        this.isSync = false;
        this.getAllData();
      } else if (response.payload.data.IsUpdateReq) {
        if (!this.props.sync.synced) {
          this.isSync = false;
          this.getRecentData();
        }
      } else if (this.isMasterReq) {
        this.isSync = false;
        this.getMasterData();
      }

      else if (this.props.sync.synced && !this.isMasterReq) {
        if (this.props.auth.tooltip == '') {
          this.isSync = false;

          this.props.doctorProfile.DoctorData.IsAssistant != 1 || this.props.doctorProfile.DoctorData.RoleId == 3 ?
            this.props.setTooltip('MyPatients') : this.props.setTooltip('Exit');
        }

        this.forceUpdate();
      }
      this.parseSuggestedData();
    });
  }
  parseSuggestedData() {
    this.suggestLocalData.forEach((item) => {
      item['Data'] = JSON.parse(item['Data']);
    });

    this.suggestedData.forEach((item) => {
      let local = [...this.suggestLocalData];
      local = local.filter((l) => {
        if (l._id != item._id) {
          return l;
        }
      });
      this.suggestLocalData = [...local];
    });
    let dbData = [...this.suggestLocalData, ...this.suggestedData];
    dbData = _.uniqBy(dbData, (item) => {
      return item._id;
    });

    let clearSuggestions = new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM Suggestions',
          [],
          (tx, result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          },
        );
      });
    });

    //Batch insert
    let batchInsert = new Promise((resolve, reject) => {
      let batch = [];
      batch = dbData.map((item) => {
        let ins =
          "('" +
          item._id +
          "','" +
          JSON.stringify(item.Data).replace(/\'/g, "''") +
          "','" +
          item.DoctorId +
          "','" +
          item.BrandName.replace(/\'/g, "''") +
          "','" +
          item.Dose.replace(/\'/g, "''") +
          "','" +
          item.WhenEntered +
          "','" +
          item.WhenUpdated +
          "')";
        return ins;
      });
      if (batch.length > 0) {
        let insertQuery =
          'INSERT into Suggestions (_id, Data, DoctorId, BrandName, Dose, WhenEntered, WhenUpdated) VALUES' +
          batch.toString();

        this.db.transaction((tx) => {
          tx.executeSql(insertQuery, [], (tx, result) => {
            resolve(result);
          });
        });
      } else {
        resolve();
      }
    });

    clearSuggestions.then((result) => {
      batchInsert.then((result) => { });
    });
  }

  //v1 --> Current App Version on Store. v2 --> App Version on Device
  compareVersion(v1, v2) {
    if (typeof v1 !== 'string') return false;
    if (typeof v2 !== 'string') return false;
    v1 = v1.split('.');
    v2 = v2.split('.');
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) return 1;
      if (v1[i] < v2[i]) return -1;
    }

    return v1.length == v2.length ? 0 : v1.length < v2.length ? -1 : 1;
  }
  getRemoteConfig() {

    var assistantId = this.props.doctorProfile.DoctorData ? this.props.doctorProfile.DoctorData.AssistantId : "";

    let data = {
      doctorId: this.props.doctorProfile.DoctorData
        ? this.props.doctorProfile.DoctorData._id
        : '', assistantId, appVersion: 4
    };
    this.props.getAppConfig(data).then((response) => {
      let data = response.payload.data;
      if (data.status == 1) {
        //if (!this.props.sync.isAppStatus) {
        // Alert.alert("inremoteconfig")
        let andriodfup =
          this.compareVersion(
            response.payload.data.data.Android,
            versionAndroid,
          ) == 1
            ? true
            : false;
        let iosfup =
          this.compareVersion(response.payload.data.data.IOS, versionIOS) ==
            1
            ? true
            : false;

        if (Platform.OS == 'ios' && iosfup) {
          //if (parseInt(response.payload.data.data.IOS) > parseInt(mobileVersion)) {

          this.props.navigation.navigate('ForceUpdateContainer');
          return;
          //}
        } else if (Platform.OS == 'android' && andriodfup) {
          //if (parseInt(response.payload.data.data.Android) > parseInt(mobileVersion)) {
          this.props.navigation.navigate('ForceUpdateContainer');
          return;
          //}
        }

        // }


        let conFee = 0;
        let techFee = 0;

        //ConFee
        if (data.doctorData.DoctorConvenienceFee) {
          if (data.doctorData.DoctorConvenienceFee > 0) {
            conFee = data.doctorData.DoctorConvenienceFee;
          } else {
            conFee = data.data.ConvenienceFee;
          }
        } else {
          conFee = data.data.ConvenienceFee;
        }
        //TechFee
        if (data.doctorData.DoctorTechnologyFee) {
          if (data.doctorData.DoctorTechnologyFee > 0) {
            techFee = data.doctorData.DoctorTechnologyFee;
          } else {
            techFee = data.data.TechnologyFee;
          }
        } else {
          techFee = data.data.TechnologyFee;
        }
        let fees = {
          conFee: conFee, //data.data.ConvenienceFee?data.data.ConvenienceFee:0
          techFee: techFee, //techFee=data.data.TechnologyFee?techFee=data.data.TechnologyFee:0,
        };
        this.props.setDoctorFees(fees);
        if (!data.doctorData.PayLater) {
          data.doctorData['PayLater'] = 0;
        }
        if (!data.doctorData.PaperSettings) {
          data.doctorData['PaperSettings'] = {
            IsBW: 0,
            Margin: ['10', '10', '10', '10'],
            TemplateFontSize: '14',
            papername: 'A4',
            papersize: ['210', '297'],
            header: 1,
            footer: 1,
            body: 1,
          };
        }
        if (!data.doctorData.PaperSettings.hasOwnProperty('IsBW')) {
          data.doctorData.PaperSettings['IsBW'] = 0;
        }
        // data.doctorData.IsAssistant = isAssistant;
        // data.doctorData.AssistantId = assistantId;
        // data.doctorData.AssistantName = assistantName;
        // data.doctorData.RoleId = roleId;
        // data.doctorData.AssistanntClinics = assistantClinic;
        var assClinicId = data.doctorData.AssistantClinics.map(x => x.ClinicId);
        if (assClinicId.length > 0)
          data.doctorData.ClinicAddresses = data.doctorData.ClinicAddresses.filter(c => assClinicId.includes(c.ClinicId));
        this.props.setDoctorData(data.doctorData);

        this.props.setVideoConsult(data.doctorData.ShortUrl);

        this.props.setConfigData(data);
        if (this.props.doctorProfile.DoctorData.NotifyStatus) {
          OneSignal.User.addTags({
            doctorid: this.props.doctorProfile.DoctorData._id,
            enabled:
              this.props.doctorProfile.DoctorData.NotifyStatus == 1
                ? 'true'
                : 'false',
          });
        } else {
          OneSignal.User.addTags({
            doctorid: this.props.doctorProfile.DoctorData._id,
            enabled: 'false',
          });
        }
        if (!data.doctorData.SubscriptionValid) {
          this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'NoSubscription' }]

          }));
        }
        let logoutDevices = data.doctorData.LogoutDevices;
        if (data.doctorData.IsActive == 0) {

          this.props.setToken('');

          this.props.setCurrentTab("MyPatients");

          this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }]

          }));


        }

        else if (logoutDevices && logoutDevices.length > 0) {
          let findDevice = logoutDevices.find(x => x == 'all');
          if (findDevice) {
            this.props.setToken('');

            this.props.setCurrentTab("MyPatients");


            this.props.navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }]

            }));
          }
          else {

            getUniqueId().then((data) => {

              let findDevice = logoutDevices.find(x => x == data);
              if (!findDevice) {
                this.sqlLiteOp();
                // this.props.setToken('');
                // this.props.navigation.dispatch(CommonActions.reset({
                //   index: 0,
                //   routes: [{ name: 'Login' }]

                // }));
              }
              else {
                // Alert.alert(data)
                this.sqlLiteOp();
              }

            });
          }

        }
        else {
          this.sqlLiteOp();
        }
        //  this.openSubscriptionWarning();
      }
    });
  }
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.getRemoteConfig();

      //alert("App has come to the foreground!");
    }
    this.setState({ appState: nextAppState });
  };
  componentDidMount() {

    const self = this;
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    OneSignal.initialize(isStagging ? staging.oneSignalID : prod.oneSignalID, {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.Notifications.requestPermission(true);

    OneSignal.User.addTags({
      doctorid: this.props.doctorProfile.DoctorData._id,
      enabled:
        this.props.doctorProfile.DoctorData.NotifyStatus == 1
          ? 'true'
          : 'false',
    });
    Linking.addEventListener('url', this.handleDeepLink);
    OneSignal.Notifications.addEventListener('click', (notificationResponse) => {
      const { notification } = notificationResponse;
      if (notification) {
        const { additionalData = null } = notification;
        if (additionalData) {
          let planttype = self.props.doctorProfile.DoctorData.Subscription.Plan;
          let amt = planttype == 3 ? 2000 :
            [20000, 2000][planttype - 1];
          const { type } = additionalData;
          if (type == 'subscription') {
            let data = {
              doctorId: self.props.doctorProfile.DoctorData._id,
              transactionId: "", //this.props.patientvisit.vc_trans_id,
              digiConsultationId: "", //this.props.patientvisit.vc_consult_id,
              amount: parseFloat(amt ? amt : 2000).toFixed(2),
              consultFees: self.props.doctorProfile.DoctorData.ConsultFee
                ? parseFloat(
                  self.props.doctorProfile.DoctorData.ConsultFee.toString()
                ).toFixed(2)
                : 0,
              patientId: null,
              patient_Id: 0,
              patientName:
                self.props.doctorProfile.DoctorData.DoctorFName + ' ' + self.props.doctorProfile.DoctorData.DoctorLName,
              dob: self.props.doctorProfile.DoctorData.DOB,
              gender: self.props.doctorProfile.DoctorData.Gender,
              mobile: self.props.doctorProfile.DoctorData.DoctorMobile,
              whatsApp: self.props.doctorProfile.DoctorData.WANumber
                ? self.props.doctorProfile.DoctorData.WANumber
                : "",
              age: "",
              remarks: "Prescrip App Subscription",
              patientEmail: "", planType: planttype == 3 ? 2 : planttype
            };

            self.props.getPaymentLink(data).then((response) => {
              if (response.payload.data.status == 1) {
                Linking.openURL(response.payload.data.payLinkUrl);
              }
            });
          }
        }
      }
    });
    // Alert.alert('beforeremoteconfig')
    this.getRemoteConfig();
    //  AppState.addEventListener('change', this._handleAppStateChange);

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //this.sqlLiteOp();
    });

    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }
  //ONESIGNAL CODE
  sqlLiteOp() {
    this.db = this.props.databaseContext.db;

    //this.props.navigation.navigate('DataSync', { recentData: null,masterData:null, type: 'both',time: 10 });
    if (this.db) {

      setTimeout(() => {
        if (!this.isSync) {
          this.getSuggestedData();
        }
      }, 100);
    } else {
      Alert.alert("notthis.db")
      setTimeout(() => {
        this.db = this.props.databaseContext.db;
        this.getSuggestedData();

        // this.forceUpdate();
      }, 500);
    }
  }
  componentWillUnmount() {
    // AppState.addEventListener('change', this._handleAppStateChange).remove();
    // OneSignal.Notifications.removeEventListener();
    if (this._unsubscribe)
      this._unsubscribe();
    Linking.removeAllListeners('url', this.handleDeepLink);
  }

  onReceived(notification) {
    setTimeout(() => { }, 1000);
    this.forceUpdate();
  }

  onOpened(openResult) {
    setTimeout(() => {
      this.props.setNotificationFlags(true);
    }, 200);

    this.forceUpdate();
  }

  openSubscriptionWarning() {

    let lastShownCount = this.getSubscriptionEndWarning(true);
    let newDate = new Date(this.props.doctorProfile.DoctorData.svdate ?
      this.props.doctorProfile.DoctorData.svdate : new Date().toDateString());
    if (lastShownCount <= 5 && lastShownCount != 0) {
      try {

        AsyncStorage.getItem("subwarn").then((val) => {
          if (!val) {
            this.modalCity.open();
            AsyncStorage.setItem("subwarn", this.props.doctorProfile.DoctorData.svdate);
          }
          else {
            let lastShownDate = new Date(new Date(val));



            let diffDays = Math.floor((newDate - lastShownDate) / (1000 * 60 * 60 * 24));;

            if (diffDays == 1) {
              this.modalCity.open();
              AsyncStorage.setItem("subwarn", this.props.doctorProfile.DoctorData.svdate);
            }
            else if (diffDays > 1)
              AsyncStorage.removeItem("subwarn");
          }
        });
      } catch (error) {
        AsyncStorage.removeItem("subwarn");
      }
    }
    else if (lastShownCount == 0) {
      AsyncStorage.removeItem("subwarn");
    }
  }
  getSubscriptionEndWarning(isday) {
    if (this.props.doctorProfile.DoctorData.Subscription) {
      let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let dateExpires = new Date(new Date(this.props.doctorProfile.DoctorData.Subscription.ExpiresOn));
      let todaysDate = new Date(new Date(this.props.doctorProfile.DoctorData.svdate));
      if (isday) {



        let diffDays = Math.ceil((dateExpires - todaysDate) / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return 'Your Prescrip subscription expires on ' + (dateExpires.getDate() > 9 ? dateExpires.getDate() : '0' + dateExpires.getDate()) + '-' +
        month[dateExpires.getMonth()] + '-' +
        dateExpires.getFullYear() + ' ' + (dateExpires.getHours() > 9 ? dateExpires.getHours() : '0' + dateExpires.getHours()) + ':' + (dateExpires.getMinutes() > 10 ? dateExpires.getMinutes() : '0' + dateExpires.getMinutes());
    }
  }

  render() {
    return (


      this.props.doctorProfile.DoctorData && this.props.doctorProfile.DoctorData.IsAssistant != null ?
        <Home
          {...this.props}
          getRecents={() => this.getRecentData()}
          IsUpdateReq={this.state.IsUpdateReq}
          navigation={this.props.navigation}
        />
        : null


    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  home: state.home,
  doctorProfile: state.doctorProfile,
  sync: state.sync,
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userRequestLogout()),
  setCurrentTab: (tab) => dispatch(setCurrentTab(tab)),
  isRefreshBilling: (refresh) => dispatch(isRefreshBilling(refresh)),
  clearData: () => dispatch(clearDoctorData()),
  setTooltip: (tab) => dispatch(setTooltip(tab)),
  setToken: (token) => dispatch(setToken(token)),
  getRecentData: (data) => dispatch(getRecentData(data)),
  checkSyncRequired: (data) => dispatch(checkSyncRequired(data)),
  getMasterData: (data) => dispatch(getMasterData(data)),
  getAllData: (data) => dispatch(getAllData(data)),
  setSyncFlag: (data) => dispatch(setSyncFlag(data)),
  getAppConfig: (data) => dispatch(getAppConfig(data)),
  setConfigData: (data) => dispatch(setConfigData(data)),
  setDoctorFees: (TechFee) => dispatch(setDoctorFees(TechFee)),
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setHeader: (data) => dispatch(setHeader(data)),
  setFooter: (data) => dispatch(setFooter(data)),
  setNotificationFlags: (flag) => dispatch(setNotificationFlags(flag)),
  setVideoConsult: (url) => dispatch(setVideoConsult(url)),
  getPaymentLink: (data) => dispatch(getPaymentLinkSubscription(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withDb(HomeContainer));
