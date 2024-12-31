import { DatabaseContext } from "./database-context";
import React, { Component } from "react";
import { NativeModules, StatusBarIOS, Platform, Dimensions, StatusBar } from "react-native";
 
import SQLite from 'react-native-sqlite-storage';
//SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class DBProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setDb: this.setDb.bind(this),
      db: null,
      statusBarHeight: Platform.OS === "android" ? StatusBar.currentHeight : 0
    };
  }

  componentDidMount() {
    this.setDb();
    //this.setStatusBarHeight();
  }
  setStatusBarHeight() {
    const d = Dimensions.get("window")
    const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false

    if (Platform.isPad) {
      this.setState({ statusBarHeight: 24 });
      return
    }
    if (StatusBarManager.getHeight) {
      StatusBarManager.getHeight((statusBarFrameData) => {
        //this.statusBarHeight = statusBarFrameData.height;
        if (statusBarFrameData.height > 45) {
          this.setState({ statusBarHeight: 0 });
        }
        else {
          this.setState({ statusBarHeight: statusBarFrameData.height });
        }
      });
      Dimensions.addEventListener('change', () => {
        if (Dimensions.get('window').width < Dimensions.get('window').height) {
          this.setState({ orientation: 'portrait' }, () => {
            if (isX) {
              this.setState({ statusBarHeight: 44 });
            }
            else {
              this.setState({ statusBarHeight: 22 });
            }

          });
        }
        else {
          this.setState({ orientation: 'landscape' }, () => {
            //this.setState({ statusBarHeight: 0 });
          });
        }
      });
      this.statusBarListener = StatusBarIOS.addListener('statusBarFrameWillChange', (statusBarData) => {
        this.statusBarHeight = statusBarData.frame.height;
        if (this.statusBarHeight) {
          if (isX) {
            if (this.statusBarHeight > 45) {
              this.setState({ statusBarHeight: 0 });
            }
            else if (Dimensions.get('window').width < Dimensions.get('window').height) {
              this.setState({ statusBarHeight: 44 });
            }
            else {
              this.setState({ statusBarHeight: this.statusBarHeight });
            }

          }
          else {
            if (this.statusBarHeight > 22) {
              this.statusBarHeight = 20;
            }
            this.setState({ statusBarHeight: this.statusBarHeight });
          }
        }
      });


    }

  }

  setDb() {
    const self = this;
    SQLite.echoTest()
      .then(() => {
        console.log("Opening database ...");
        SQLite.openDatabase({ name: "prescrip_db", createFromLocation: "~db/prescrip_v3db.sqlite" })
          .then(db => {
            self.setState({ db });
            console.log("Database opened ...");
          })
          .catch(error => {


          });
      })
      .catch(error => {

      });
  }
  render() {
    return (
      <DatabaseContext.Provider
        value={{
          databaseContext: {
            ...this.state
          }
        }}
      >
        {this.state.db ? this.props.children : null}
      </DatabaseContext.Provider>
    );
  }
}
