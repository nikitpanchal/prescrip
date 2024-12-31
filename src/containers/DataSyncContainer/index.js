import React from 'react';
import { View, Dimensions, Text, AppState, BackHandler, Animated, StyleSheet, Platform } from 'react-native';
import { connect } from "react-redux";

import { withDb } from "../../DatabaseContext/withDatabase";
import { StackActions, CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { setSyncFlag } from '../../actions/sync';
import _, { result } from 'lodash';
import nextFrame from 'next-frame';
var blazing = require('../../../assets/Json/cloudjson.json');


class DataSync extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      appState: AppState.currentState,
      issynced: false,
      progressStatus: 45,
      currentText: "...."
    };
    this.deviceWidth = Dimensions.get('window').width;
    this.deviceHeight = Dimensions.get('window').height;
    this.lwid = this.deviceWidth;
    this.ldt = this.deviceHeight * 55 / 100;
    this.syncData = null;
    this.db = null;
    this.datalength = 0;
    this.progressCount = 0;
    this.toltalTabCount = 0;
    this.tabData = null;
    this.tabSync = null;
    this.rowCount = -1;
    this.initialRow = -1;
    this.delCount = 0;
    this.insertCount = 0;
    this.modifyCount = 0;
    this.specialization = "";
    this.sampleData = null;
    this.progressTime = 0;
    this.anim = new Animated.Value(0);
    this.currentText = "....";
    this.syncText = {
      "57": "Tablets",
      "1": "...",
      "2": "Specialization",
      "3": "...",
      "4": "Dose Therapy",
      "5": "Family History",
      "6": "Qualification",
      "7": "Dosage Regime",
      "8": "Chief Complaints",
      "9": "Findings",
      "10": "Investigation",
      "11": "LabTest",
      "12": "Diagnosis",
      "13": "Advice",
      "14": "....",
      "15": "Certificates",
      "16": "Ophthalmologist",
      "17": "Languages",
      "18": "...",
      "19": "...",
      "20": "...",
      "21": "...",
      "22": "Dosage Forms",
      "23": "Aplicaps",
      "24": "Capsule",
      "25": "Cream",
      "26": "Drop",
      "27": "Elixir",
      "28": "Enema",
      "29": "Expectorant",
      "30": "Gel",
      "31": "Glue",
      "32": "Granules",
      "33": "Gum Paint",
      "34": "Infusion",
      "35": "Inhaler",
      "36": "Injection",
      "37": "Kit",
      "38": "Linctus",
      "39": "Lotion",
      "40": "Lozenges",
      "41": "Mouth Paint",
      "42": "Mouth Wash/Gargle",
      "43": "Ointment",
      "44": "Patch",
      "45": "Pessary",
      "46": "Powder (Topical)",
      "47": "Respules",
      "48": "Rotacap",
      "49": "Sachet",
      "50": "Shampoo",
      "51": "Soap/Bar",
      "52": "Solution",
      "53": "Spray",
      "54": "Suppository",
      "55": "Suspension",
      "56": "Syrup",
      "58": "Tooth Paste",
      "59": "Powder(Oral)",
      "60": "Nasal Drops",
      "61": "Ear Drops",
      "62": "Eye Drops",
      "63": "Oral Drops",
      "64": "Nebulizer",
      "65": "Other",
      "66": "Medical Devices",
      "67": "Eye Ointment",
      "68": "Habits",
      "69": "History",
      "101": "..."
    }


  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick).remove();
  }
  //Disable android back
  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    return true;
  }
  componentWillMount() {
    this.progressTime = this.props.route.params.time;
    //this.onAnimate();
  }
  componentDidMount() {
    //this.syncData=this.props.route.params.recentData;


    this.db = this.props.databaseContext.db;
    let type = this.props.route.params.type;
    if (this.props.doctorProfile.DoctorData) {

      const self = this;
      let specialization = this.props.doctorProfile.DoctorData.PrimarySpecialization;
      this.specialization = specialization;
      var isFieldExist = function () {
        return new Promise((resolve, reject) => {
          var isExist = false;
          self.db.transaction((tx) => {
            tx.executeSql("PRAGMA table_info(Recents)", [], (tx, results) => {
              var raw = results.rows.raw();
              if (raw.filter(i => i.name == specialization).length > 0) {
                resolve(true)
              } else {
                tx.executeSql("ALTER TABLE Recents ADD COLUMN " + specialization + " TEXT default null", [], (tx, moddata) => {
                  if (moddata) {
                    resolve(true)
                  } else {

                  }
                })
              }
            })
          })
        })
      }
      if (this.specialization == "Ophthalmologist") {
        isFieldExist().then(() => {
          if (type == "both") {
            this.sampleData = this.props.route.params.masterData;
            //this.recentData=self.props.route.params.recentData
            this.checkDoctorDetails(self.props.route.params.recentData);
          }
          else if (type == 'recent') {
            this.checkDoctorDetails(self.props.route.params.recentData);
          }
          else if (type == 'master') {
            //this.parseMasterData(this.props.route.params.recentData);
            this.sampleData = this.props.route.params.recentData;
            if (this.sampleData) {
              this.datalength = this.sampleData.length;
              this.syncMasterData(this.sampleData);
            }
          }
        })
      }
      else {
        if (type == "both") {
          this.sampleData = this.props.route.params.masterData;
          //this.recentData=self.props.route.params.recentData
          this.checkDoctorDetails(self.props.route.params.recentData);
        }
        else if (type == 'recent') {
          this.checkDoctorDetails(self.props.route.params.recentData);
        }
        else if (type == 'master') {
          //this.parseMasterData(this.props.route.params.recentData);
          this.sampleData = this.props.route.params.recentData;
          if (this.sampleData) {
            this.datalength = this.sampleData.length;
            this.syncMasterData(this.sampleData);
          }
        }
      }
    }

    // setTimeout(()=>{
    //     this.onSyncComplete();
    // },5000);
  }
  //NEW MASTER SYNCED
  async syncMasterData(data) {

    var tp = performance.now();
    const self = this;
    var groupCruds = _.groupBy(data, (item) => {
      return item.Srno
    });
    //var groupCruds = this.groupBy(data.masterData, "Srno");
    var getOnlySrNosQuery = Object.entries(groupCruds).filter(x => x[0] != 2 && x[0] != 57 && x[0] != 17).map(x => ['SELECT * FROM MasterData where Srno=' + x[0].toString(), x[0]]);

    await this.db.transaction(tx => {
      Promise.all(getOnlySrNosQuery.map(async (q) => {
        try {

          let results = await tx.executeSql(q[0], []);
          var thisSrObj = groupCruds[q[1]];
          // let whenEntered = Math.max.apply(Math, groupCruds[q[1]].map(function (o) { return new Date(o.WhenEntered); }))
          // whenEntered = new Date(whenEntered).toISOString();
          var finalData = await this.getFinalData(thisSrObj, results[1].rows.raw()[0], q[1]);

          var queryForUpdate = "UPDATE MasterData set " +
            "Data = '" + finalData.Data.replace(/\'/g, "''") + "'," +
            "LastUpdated = '" + finalData.LastUpdated + "'" +
            "where Srno = '" + q[1].toString() + "'";

          await this.db.transaction(async (tx1) => {

            try {
              var xUP = await tx1.executeSql(queryForUpdate, []);
              await nextFrame();


            } catch (err) {
              //console.log(err);
            }

          });

          //    let results1 = await tx.executeSql(queryForUpdate, []);  

        } catch (err) {
          //console.log(err);
        }
      })).then(function () {
        var t1 = performance.now();

        self.setState({
          "otherstart": (t1 - tp) + " milliseconds.",
          currentText: '.....'
        })
        if (groupCruds["57"]) {
          self.getTabletData().then(results => {

            self.parseTabletData(data);
          })
        }
        else {
          self.onSyncComplete();
        }
        // self.seggregateTabletsDataToProcess(data, db).then(function () {

        // });
      });
    });
  }
  // PARSE TABLET DATA1

  async parseTabletData(data) {
    var tp = performance.now();

    const self = this;
    var groupCruds = _.groupBy(data, (item) => {
      return item.Srno
    });
    var tabObj = groupCruds["57"];
    let whenEntered = Math.max.apply(Math, groupCruds["57"].map(function (o) { return new Date(o.WhenEntered); }))
    whenEntered = new Date(whenEntered).toISOString();
    this.tabSync = whenEntered;

    var tabTypeData = _.groupBy(tabObj, (item) => {
      return item.Type;
    });
    var insertTabs = tabTypeData["1"];
    if (insertTabs) {
      insertTabs.map(async item => {
        // await nextFrame();
        this.progressCount++;
        this.updateProgress();
        self.insertTablet(item);

      })
    }
    let modifyTabs = [];
    if (tabTypeData["2"]) {
      modifyTabs = [...modifyTabs, ...tabTypeData["2"]];
    }
    if (tabTypeData["3"]) {
      modifyTabs = [...modifyTabs, ...tabTypeData["3"]];
    }
    if (modifyTabs.length > 0) {
      this.datalength = this.datalength + (modifyTabs.length * (this.tabData.length - 1))
      await Promise.all(this.tabData.map(async (row, index) => {
        //await nextFrame();
        let finalData = await this.getFinalData(modifyTabs, row, 57);
        this.tabData[index] = finalData;
      }));
    }
    await this.updateTabletTab();
    var t1 = performance.now();

    self.setState({
      "tabletend": (t1 - tp) + " milliseconds."
    })
    this.onSyncComplete();




  }
  updateProgress() {
    let progress = (this.progressCount / this.datalength) * 100;
    this.setState({ progressStatus: parseInt(progress), currentText: this.currentText })
  }
  //MODIFY ROWS

  async getFinalData(crudData, masterData, srno) {
    if (srno) {
      if (this.syncText[srno]) {
        this.currentText = this.syncText[srno];
      }
      else {
        this.currentText = "...."
      }
    }
    else {
      this.currentText = "...."
    }
    var parsedMasterData = masterData;
    var parsredData = JSON.parse(parsedMasterData.Data);
    var dataInfo = parsedMasterData.DataType != "ArrayString" ? parsredData.Value
      : parsredData;


    for (let cLop = 0; cLop < crudData.length; cLop++) {
      this.progressCount++;
      this.updateProgress();
      await nextFrame();
      var thisInstance = crudData[cLop];
      if (Array.isArray(thisInstance.ArrayValue)) {
        let value = [...thisInstance.ArrayValue];
        value = value.map(item => {
          item = item ? item : "";
          return item;
        })
        thisInstance.ArrayValue = [...value];

        value = null;
      }
      if (thisInstance.Type == 1) {
        dataInfo.unshift(thisInstance.ArrayValue);


      } else if (thisInstance.Type == 2) {
        var indexOfThis = -1;
        if (parsedMasterData.DataType == "ArrayString")
          indexOfThis = dataInfo.findIndex(c => c.trim() == thisInstance.Name.trim());
        else {

          indexOfThis = dataInfo.findIndex((c) => {
            if (Array.isArray(c)) {
              c[0] = c[0] ? c[0] : "";
              c[1] = c[1] ? c[1] : "";
              if (c[0].trim() ==
                thisInstance.Name.trim() || c[1].trim()
                == thisInstance.Name.trim()) {
                return c;
              }
            }
          })

        }

        if (indexOfThis > -1) {
          dataInfo[indexOfThis] = thisInstance.ArrayValue;
        }


      }
      else if (thisInstance.Type == 3) {
        var indexOfThis = -1;
        if (parsedMasterData.DataType == "ArrayString")
          indexOfThis = dataInfo.findIndex(c => c.trim() == thisInstance.Name.trim());
        else {
          indexOfThis = dataInfo.findIndex((c) => {
            if (Array.isArray(c)) {
              c[0] = c[0] ? c[0] : "";
              c[1] = c[1] ? c[1] : "";
              if (c[0].trim() ==
                thisInstance.Name.trim() || c[1].trim()
                == thisInstance.Name.trim()) {
                return c;
              }
            }
          })
        }

        if (indexOfThis > -1) {

          dataInfo.splice(indexOfThis, 1);
        }
      }
    }
    if (parsedMasterData.DataType == "ArrayString") {
      parsredData = dataInfo;
    }
    else {
      parsredData.Value = dataInfo;
    }

    parsedMasterData.Data = JSON.stringify(parsredData);

    parsedMasterData.LastUpdated = crudData[crudData.length - 1].WhenEntered;
    return parsedMasterData;


  }
  //NEW MASTER SYNCED ENDS

  onSyncComplete() {
    //Cleae stack on home to move
    this.props.navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Drawer' }]

    }));
  }
  //Optimized
  getTabletData() {
    let tabletPromise = new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql("SELECT * from Tablets", [], (tx, result) => {
          let data = result.rows.raw();
          this.tabData = result.rows.raw();
          this.rowCount = result.rows.length;
          this.initialRow = result.rows.length;

          resolve("Tablets fetched");
        }, (error) => {
          reject("Error in getting tablets " + JSON.stringify(error));
        });
      })
    });

    return tabletPromise;
  }
  old_syncMasterData() {

    let groupedData = _.groupBy(this.sampleData, (item) => {
      return item.Srno
    });

    let SyncPromises = Object.keys(groupedData).map(key => {
      //Max WhenEntered


      let whenEntered = Math.max.apply(Math, groupedData[key].map(function (o) { return new Date(o.WhenEntered); }))
      whenEntered = new Date(whenEntered).toISOString();
      //For non tablet data
      if (key == 57) {
        this.tabSync = whenEntered;

        let promiseTab = new Promise((resolve, reject) => {
          Promise.resolve(this.getTabletData()).then(result => {

            groupedData[key].map(item => {
              /**
                                         * Type 1 : insert
                                         * Type 2 : update
                                         * Type 3 : delete
                                         * 
                                         */

              switch (item.Type) {
                case 1:
                  this.insertCount++;
                  this.insertTablet(item);
                  break;
                case 2:
                  this.modifyCount++;
                  this.modifyTablet(item, item.Type)
                  break;
                case 3:
                  this.modifyCount++;
                  this.modifyTablet(item, item.Type)
                  break;
                default:
                  break;
              }
            })


            resolve("Tablet sync successfull");
          }).catch(error => {

            reject("Tablet error " + JSON.stringify(error));
          })
        });
        return promiseTab;
      }
      else if (key != 57) {
        let promiseOthers = new Promise((resolve, reject) => {
          Promise.resolve(this.getMasterData(key)).then(result => {
            let masterData = JSON.parse(result.Data);
            groupedData[key].map(item => {
              /**
                     * Type 1 : insert
                     * Type 2 : update
                     * Type 3 : delete
                     * 
                     */

              let type = item.Type;
              let value = item.ArrayValue;
              let oldValue = item.OldArrayValue;
              let name = item.Name ? item.Name : "";
              if (Array.isArray(value)) {
                switch (type) {
                  case 1:
                    //Insert
                    masterData.Value.push(value);
                    break;
                  case 2:
                    let index = masterData.Value.findIndex(val => {
                      if (val[1] == name) {
                        return val;
                      }
                    });
                    if (index > -1) {
                      masterData.Value[index] = value;

                    }
                    else {
                      masterData.Value.push(value);

                    }
                    break;
                  case 3:
                    let modifyValue = masterData.Value.filter((val) => {
                      if (val[1] != name) {
                        return val;
                      }


                    })
                    masterData.Value = [...modifyValue];
                    modifyValue = null;
                    break;
                  default:
                    break;
                }
              }
              else {
                switch (type) {
                  case 1:
                    masterData.push(value);
                    break;
                  case 2:
                    let index = masterData.findIndex(val => {
                      if (val[1] == name) {
                        return val;
                      }
                    });
                    if (index > -1) {
                      masterData[index] = value;

                    }
                    else {
                      masterData.push(value);

                    }
                    break;
                  case 3:
                    let modifyValue = masterData.filter((val) => {
                      if (val[1] != name) {
                        return val;
                      }


                    })
                    masterData = [...modifyValue];
                    modifyValue = null;
                    break;
                  default:
                    break;
                }
              }

            })
            result.Data = JSON.stringify(masterData).replace(/\'/g, "''");
            result.LastUpdated = whenEntered;
            let query = "UPDATE MasterData SET Data = '" + JSON.stringify(masterData).replace(/\'/g, "''") + "', LastUpdated = '" + whenEntered.toString() + "' where Srno = " + key;
            let updatePromise = new Promise((resolve, reject) => {
              this.db.transaction((tx) => {
                tx.executeSql(query, [], (tx, result) => {
                  resolve("Insert success " + key)
                }, (error) => {
                  reject("Error in update " + key + " Error " + JSON.stringify(error));
                })
              })
            })
            Promise.resolve(updatePromise).then(result => {

              resolve("Master Synced");
            }).catch(error => {

              reject("Eror in master Sync " + JSON.stringify(error));

            })
          }).catch(error => {

            reject("Eror in master Sync " + JSON.stringify(error));
          })
        })
        return promiseOthers;
      }
    })
    Promise.all(SyncPromises).then((result) => {

      return Promise.all(this.updateTabletTab())
    }).then((result) => {

      setTimeout(() => {

        this.onSyncComplete()
      }, 1000)
    }).catch(error => {

    })

  }
  getMasterData(srno) {
    let masterPromise = new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql("SELECT * from MasterData where Srno=" + srno, [], (tx, result) => {
          resolve(result.rows.raw()[0]);
        }, (error) => {
          reject("Error in getting master data");

        });
      })
    })
    return masterPromise;

  }
  //Old
  parseMasterData(data) {
    this.rowCount = 0;
    this.tabData = [];
    //
    var getTabletData = new Promise((resolve, reject) => {
      //Parse Tablets
      this.db.transaction((tx) => {
        let tabQuery = "SELECT Data from Tablets";
        tx.executeSql(tabQuery, [], (tx, result) => {

          this.tabData = result.rows.raw();
          this.rowCount = result.rows.length;
          this.initialRow = result.rows.length;


          resolve('success promise completed')
        }, (error) => {
          reject('ERROR , work could not be completed')

        })
      });
    })

    getTabletData.then(() => {
      // var parsePromise=new Promise((resolve,reject)=>{
      data.map((item) => {
        /**
         * Type 1 : insert
         * Type 2 : update
         * Type 3 : delete
         * 
         */

        let type = item.Type;
        let value = item.ArrayValue;
        let oldValue = item.OldArrayValue;
        let lastSync = item.WhenEntered;
        let srno = item.Srno;
        if (srno != 57) {
          this.db.transaction((tx) => {
            let query = "SELECT Data from MasterData where Srno= " + srno;
            tx.executeSql(query, [], (tx, result) => {
              let dbData = result.rows.raw()[0];
              if (Array.isArray(value)) {
                dbData = JSON.parse(dbData.Data);
                let dbValue = dbData.Value;
                if (type == 1) {
                  dbValue.push(value);
                  dbData.Value = dbValue;
                }
                if (type == 2) {
                  let index = dbValue.findIndex(val => {
                    if (val[0] == oldValue[0]) {
                      return val;
                    }
                  });
                  if (index > -1) {
                    dbValue[index] = value;
                    dbData.Value = dbValue;
                  }
                  else {
                    dbValue.push(value);
                    dbData.Value = dbValue;
                  }
                }

                let query = "UPDATE MasterData SET Data = '" + JSON.stringify(dbData).replace(/\'/g, "''") + "', LastUpdated = '" + lastSync.toString() + "' where Srno = " + srno;
                tx.executeSql(query, [], (tx, result) => {

                }, (error) => {

                })
                //this.storeToDB(srno,dbValue,"MasterData",lastSync);
              }
              else {

                let dbValue = JSON.parse(dbData.Data);
                if (type == 1) {
                  dbValue.push(value);
                }
                if (type == 2) {
                  let index = dbValue.findIndex(val => {
                    if (val == oldValue) {
                      return val;
                    }
                  });
                  if (index > -1) {
                    dbValue[index] = value;
                  }
                  else {
                    dbValue.push(value);
                  }
                }

                let query = "UPDATE MasterData SET Data = '" + JSON.stringify(dbValue).replace(/\'/g, "''") + "', LastUpdated = '" + lastSync.toString() + "' where Srno = " + srno;
                tx.executeSql(query, [], (tx, result) => {

                }, (error) => {

                })

              }
            }, (error) => {

            })
          });
        }
        else if (srno == 57) {

          switch (type) {
            case 1:
              this.insertTablet(item);
              break;
            case 2:
              this.modifyTablet(item, type);
              break;

            case 3:
              this.modifyTablet(item, type);
              break;
          }


        }
      });
      //resolve('success promise completed')


    }).then(() => {
      this.updateTabletTab();
    }).then(() => {
      setTimeout(() => {
        this.onSyncComplete()
      }, 2000)

    });
  }


  insertTablet(item) {
    //let type = item.Type;
    let newValue = item.ArrayValue;
    //let oldValue = item.OldArrayValue;
    //let lastSync = item.WhenEntered;
    //let srno = item.Srno;
    let Data = JSON.parse(this.tabData[this.rowCount - 1].Data);
    let Value = Data.Value;
    if (Value.length >= 35000) {
      //Create a new row in tablets
      let row = {
        Datainfo: ["GenericName", "Brand", "Dose"],
        Value: []
      };

      row.Value.push(newValue);
      let newRow = {
        Data: JSON.stringify(row)
      }
      this.tabData.push(newRow);
      this.rowCount++;
    }
    else {
      Value.push(newValue);
      Data.Value = Value;
      this.tabData[this.rowCount - 1].Data = JSON.stringify(Data);
    }
    //this.tabSync = lastSync;
  }


  //Delete tablet
  modifyTablet(item, type) {

    let newValue = item.ArrayValue;
    let oldValue = item.OldArrayValue;
    let lastSync = item.WhenEntered;
    let srno = item.Srno;
    let tabindex = -1;
    let rowindex = -1;

    for (let t = 0; t < this.tabData.length; t++) {
      tabindex = -1;
      let Data = JSON.parse(this.tabData[t].Data);
      let Value = Data.Value;
      tabindex = Value.findIndex(val => val[1].toLowerCase() == item.Name.toLowerCase());

      if (tabindex > -1) {
        if (type == 3) {
          Value.splice(tabindex, 1);
        }
        else if (type == 2) {
          Value[tabindex] = newValue;
        }
      }
      Data.Value = Value;
      this.tabData[t].Data = JSON.stringify(Data);
      Data = null;
      Value = null;


    }
  }

  updateTabletTab() {
    //INSERT INTO Tablets (Srno,Name,Data,ReferenceNo,DataType,ExcelDownload,S3FileAccessLink,Sort,LastUpdated) VALUES ( 0, 'Tablet','HI' ,0, 'ArrayObject', '','',1, '2020-12-19T05:54:27.244Z' )
    let tabPromises = this.tabData.map((row, index) => {
      if (index > this.initialRow) {

      }
      else {
        let tabs = new Promise((resolve, reject) => {
          this.db.transaction((tx) => {
            let query = "UPDATE Tablets SET Data= '" + row.Data.replace(/\'/g, "''") + "' , LastUpdated ='" + this.tabSync.toString() + "' WHERE Srno= " + index;
            tx.executeSql(query, [], (tx, result) => {


              resolve("Tab updated " + index);
            }, (error) => {

              reject("Tab updated error " + index);
            });
          });
        })
        return tabs;
      }
    });
    return tabPromises;
  }
  storeToDB(srno, data, table, lastSync) {
    this.db.transaction((tx) => {
      let query = "UPDATE " + table + " SET Data = '" + JSON.stringify(data).replace(/\'/g, "''") + "', LastUpdated = '" + lastSync.toString() + "' where Srno = " + srno;
      tx.executeSql(query, [], (tx, result) => {

      }, (error) => {

      })
    });

  }

  updateDoctorRecents(doc_id, key, value) {
    this.db.transaction((tx) => {
      let query = "UPDATE Recents SET " + key + " = '" + value + "' where DoctorID ='" + doc_id + "'";

      tx.executeSql(query, [], (tx, result) => {



      }, (error) => {

      })


    });
  }
  checkDoctorDetails(syncData) {
    //alert("Recent sync started at "+ new Date());
    let type = this.props.route.params.type;
    let doc_id = syncData.DoctorID;
    let query = "SELECT _id, DoctorID, LastCloudSync from Recents where DoctorId = '" + doc_id + "'";

    this.db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {

        let resData = result.rows.raw()[0];

        if (!resData) {
          //Insert Data for new Doctor
          if (this.specialization == "Ophthalmologist") {
            tx.executeSql("INSERT INTO Recents ( "
              + " _id,"
              + "DoctorID,"
              + "EnvAllergy,"
              + "FoodAllergy,"
              + "DrugsAllergy,"
              + "RecommendedLabTest,"
              + "OthersAllergy,"
              + "PatientHabits,"
              + "FamilyHistory,"
              + "ChiefComplaints,"
              + "Findings,"
              + "Investigation,"
              + "Diagnosis,"
              + "Advice,"


              + "DosageRegimen,"
              + "DoseTherapy,"
              + "newDose,"
              + "LastCloudSync,"
              + "Synced,"
              + "certificate,"
              + "Specialization," + "Ophthalmologist"
              + "  ) VALUES  ( "
              + " '" + syncData._id.toString() + "',"
              + " '" + syncData.DoctorID.toString() + "',"
              + " '" + JSON.stringify(syncData.EnvAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.FoodAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.DrugsAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.RecommendedLabTest).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.OthersAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.PatientHabits).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.FamilyHistory).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.ChiefComplaints).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Findings).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Investigation).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Diagnosis).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Advice).replace(/\'/g, "''") + "',"


              + " '" + JSON.stringify(syncData.DosageRegimen).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.DoseTherapy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.newDose).replace(/\'/g, "''") + "',"
              + " " + JSON.stringify(syncData.LastCloudSync) + ","
              + " '" + syncData.Synced.toString() + "',"
              + " '" + JSON.stringify(syncData.certificate).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Specialization).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Ophthalmologist).replace(/\'/g, "''") + "'"
              + "  ) ", [], (tx, result) => {

                let data = {
                  lastSync: syncData.LastCloudSync,
                  synced: true
                }
                this.props.setSyncFlag(data);
                if (type == "both" && this.sampleData) {
                  this.datalength = this.sampleData.length;
                  this.syncMasterData(this.sampleData);
                }
                else {
                  this.onSyncComplete();
                }


              }, (error) => {
                let data = {
                  lastSync: null,
                  synced: false
                }
                if (type == "both" && this.sampleData) {
                  this.datalength = this.sampleData.length;
                  this.syncMasterData(this.sampleData);
                }
                else {
                  this.onSyncComplete();
                }

              });
          }
          else {
            tx.executeSql("INSERT INTO Recents ( "
              + " _id,"
              + "DoctorID,"
              + "EnvAllergy,"
              + "FoodAllergy,"
              + "DrugsAllergy,"
              + "RecommendedLabTest,"
              + "OthersAllergy,"
              + "PatientHabits,"
              + "FamilyHistory,"
              + "ChiefComplaints,"
              + "Findings,"
              + "Investigation,"
              + "Diagnosis,"
              + "Advice,"


              + "DosageRegimen,"
              + "DoseTherapy,"
              + "newDose,"
              + "LastCloudSync,"
              + "Synced,"
              + "certificate,"
              + "Specialization"
              + "  ) VALUES  ( "
              + " '" + syncData._id.toString() + "',"
              + " '" + syncData.DoctorID.toString() + "',"
              + " '" + JSON.stringify(syncData.EnvAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.FoodAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.DrugsAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.RecommendedLabTest).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.OthersAllergy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.PatientHabits).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.FamilyHistory).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.ChiefComplaints).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Findings).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Investigation).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Diagnosis).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Advice).replace(/\'/g, "''") + "',"


              + " '" + JSON.stringify(syncData.DosageRegimen).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.DoseTherapy).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.newDose).replace(/\'/g, "''") + "',"
              + " " + JSON.stringify(syncData.LastCloudSync) + ","
              + " '" + syncData.Synced.toString() + "',"
              + " '" + JSON.stringify(syncData.certificate).replace(/\'/g, "''") + "',"
              + " '" + JSON.stringify(syncData.Specialization).replace(/\'/g, "''") + "'"

              + "  ) ", [], (tx, result) => {

                let data = {
                  lastSync: syncData.LastCloudSync,
                  synced: true
                }
                this.props.setSyncFlag(data);
                if (type == "both" && this.sampleData) {
                  this.datalength = this.sampleData.length;
                  this.syncMasterData(this.sampleData);
                }
                else {
                  this.onSyncComplete();
                }


              }, (error) => {

                let data = {
                  lastSync: null,
                  synced: false
                }
                this.props.setSyncFlag(data);


              });
          }

        }
        else if (resData.DoctorID == syncData.DoctorID && resData.LastCloudSync != syncData.LastCloudSync) {

          let del_query = "DELETE FROM Recents where DoctorID='" + syncData.DoctorID + "'";

          tx.executeSql(del_query, [], (tx, result) => {

            if (this.specialization == "Ophthalmologist") {
              tx.executeSql("INSERT INTO Recents ( "
                + " _id,"
                + "DoctorID,"
                + "EnvAllergy,"
                + "FoodAllergy,"
                + "DrugsAllergy,"
                + "RecommendedLabTest,"
                + "OthersAllergy,"
                + "PatientHabits,"
                + "FamilyHistory,"
                + "ChiefComplaints,"
                + "Findings,"
                + "Investigation,"
                + "Diagnosis,"
                + "Advice,"


                + "DosageRegimen,"
                + "DoseTherapy,"
                + "newDose,"
                + "LastCloudSync,"
                + "Synced,"
                + "certificate,"
                + "Specialization," + "Ophthalmologist"
                + "  ) VALUES  ( "
                + " '" + syncData._id.toString() + "',"
                + " '" + syncData.DoctorID.toString() + "',"
                + " '" + JSON.stringify(syncData.EnvAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.FoodAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.DrugsAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.RecommendedLabTest).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.OthersAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.PatientHabits).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.FamilyHistory).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.ChiefComplaints).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Findings).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Investigation).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Diagnosis).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Advice).replace(/\'/g, "''") + "',"


                + " '" + JSON.stringify(syncData.DosageRegimen).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.DoseTherapy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.newDose).replace(/\'/g, "''") + "',"
                + " " + JSON.stringify(syncData.LastCloudSync) + ","
                + " '" + syncData.Synced.toString() + "',"
                + " '" + JSON.stringify(syncData.certificate).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Specialization).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Ophthalmologist).replace(/\'/g, "''") + "'"
                + "  ) ", [], (tx, result) => {

                  let data = {
                    lastSync: syncData.LastCloudSync,
                    synced: true
                  }
                  this.props.setSyncFlag(data);
                  if (type == "both" && this.sampleData) {
                    this.datalength = this.sampleData.length;
                    this.syncMasterData(this.sampleData);
                  }
                  else {
                    this.onSyncComplete();
                  }


                }, (error) => {

                  let data = {
                    lastSync: null,
                    synced: false
                  }
                  this.props.setSyncFlag(data);

                });
            }
            else {
              tx.executeSql("INSERT INTO Recents ( "
                + " _id,"
                + "DoctorID,"
                + "EnvAllergy,"
                + "FoodAllergy,"
                + "DrugsAllergy,"
                + "RecommendedLabTest,"
                + "OthersAllergy,"
                + "PatientHabits,"
                + "FamilyHistory,"
                + "ChiefComplaints,"
                + "Findings,"
                + "Investigation,"
                + "Diagnosis,"
                + "Advice,"

                + "DosageRegimen,"
                + "DoseTherapy,"
                + "newDose,"
                + "LastCloudSync,"
                + "Synced,"
                + "certificate,"
                + "Specialization"
                + "  ) VALUES  ( "
                + " '" + syncData._id.toString() + "',"
                + " '" + syncData.DoctorID.toString() + "',"
                + " '" + JSON.stringify(syncData.EnvAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.FoodAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.DrugsAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.RecommendedLabTest).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.OthersAllergy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.PatientHabits).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.FamilyHistory).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.ChiefComplaints).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Findings).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Investigation).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Diagnosis).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Advice).replace(/\'/g, "''") + "',"

                + " '" + JSON.stringify(syncData.DosageRegimen).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.DoseTherapy).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.newDose).replace(/\'/g, "''") + "',"
                + " " + JSON.stringify(syncData.LastCloudSync) + ","
                + " '" + syncData.Synced.toString() + "',"
                + " '" + JSON.stringify(syncData.certificate).replace(/\'/g, "''") + "',"
                + " '" + JSON.stringify(syncData.Specialization).replace(/\'/g, "''") + "'"

                + "  ) ", [], (tx, result) => {

                  setTimeout(() => {
                    let data = {
                      lastSync: syncData.LastCloudSync,
                      synced: true
                    }
                    this.props.setSyncFlag(data);
                    if (type == "both" && this.sampleData) {
                      this.datalength = this.sampleData.length;
                      this.syncMasterData(this.sampleData);
                    }
                    else {
                      this.onSyncComplete();
                    }
                  }, 1000);



                }, (error) => {

                  let data = {
                    lastSync: null,
                    synced: false
                  }
                  this.props.setSyncFlag(data);
                  if (type == "both" && this.sampleData) {
                    this.datalength = this.sampleData.length;
                    this.syncMasterData(this.sampleData);
                  }
                  else {
                    this.onSyncComplete();
                  }

                });
            }


          }, (error) => {

          })

          //this.updateDoctorRecents(doc_id);
        }
        else if (resData.LastCloudSync === syncData.LastCloudSync) {
          //Already Synced
          //alert("Recent sync complete at "+ new Date());
          let data = {
            lastSync: syncData.LastCloudSync,
            synced: true
          }
          this.props.setSyncFlag(data);
          if (type == "both" && this.sampleData) {
            this.datalength = this.sampleData.length;
            this.syncMasterData(this.sampleData);
          }
          else {
            this.onSyncComplete();
          }


        }
      }, (error) => {

      });
    });
  }

  //Insert lastSync at end

  render() {
    let type = this.props.route.params.type;
    return (
      <View style={{ flex: 1, backgroundColor: "#008be0" }}>
        <View style={{ marginTop: 25, flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
          <Text style={{ alignSelf: "center", fontSize: 22, color: "#fff", fontWeight: "bold" }}>
            Update in Progress
          </Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 55 }}>
            <LottieView style={{ width: this.lwid, height: this.ldt }} source={blazing} autoPlay loop />
          </View>
        </View>
        {(type == "master" || type == "both") ?
          <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, paddingBottom: 55, padding: 10 }}>
            <Text style={{ alignSelf: "flex-start", fontSize: 22, color: "#ffffff", fontFamily: 'NotoSans', }}>
              {`Completed`}
            </Text>
            <View style={{ alignSelf: "flex-start" }}>
              <Animated.Text style={styles.label}>
                {this.state.progressStatus}%
              </Animated.Text>
            </View>
            <View style={styles.container}>
              <Animated.View
                style={[
                  styles.inner, { width: this.state.progressStatus + "%" },
                ]}
              />
            </View>

          </View>
          : null}
      </View>
    )
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  sync: state.sync,
  doctorProfile: state.doctorProfile,
  //loginForm: state.form.login
});

const mapDispatchToProps = dispatch => ({
  setSyncFlag: (data) => dispatch(setSyncFlag(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(DataSync));

//StyleSheet
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginTop: 45,
    width: '100%',
    height: 8,

    backgroundColor: '#78c1ed',
    borderColor: "#78c1ed",
    borderWidth: 2,
    borderRadius: 4,

    justifyContent: "center",
  },
  inner: {
    width: "100%",
    height: 8,

    backgroundColor: '#f1f1f1',
    borderColor: "#f1f1f1",
    borderWidth: 2,
    borderRadius: 4,
  },
  label: {
    fontSize: 35,
    color: "#ffffff",
    position: "absolute",
    zIndex: 1,
    fontFamily: 'NotoSans-Bold',
    alignSelf: "flex-start",
  }
});