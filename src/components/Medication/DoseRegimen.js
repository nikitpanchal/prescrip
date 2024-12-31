//Created by Pritish on 7/09/2020
//Custom UI for Dosage Regimen
import React, { Component } from "react";
import Capsule from "../Capsule";
import { ic_checked, ic_unchecked } from "../../constants/images";
import LinearGradient from "react-native-linear-gradient";
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from "../../constants/font";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
} from "react-native";
import _ from "lodash";
import { ic_blue_search, Add_blue_btn } from "../../constants/images";

//Custom UI for Dosage Regimen
export default class DoseRegimen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regimenIndex: 7,
      regimen: [],
      loadAllData: [],
      onMomentumEnd: 0,
      forcerRender: false,
      renderedTillNow: 1,
      showMealModal: false,
      reminder: false,
      searchText: "",
      txtRegimen: "",
      distanceEnd: 0.1,
      meals: [
        {
          type: "Before Meal",
          select: false,
        },
        {
          type: "With Meal",
          select: false,
        },
        {
          type: "After Meal",
          select: true,
        },
        {
          type: "N/A",
          select: false,
        },
      ],
    };
    this.maxData = 0;

    this.regimenIndex = 7;
    this.Regimen = [];
    this.Master = [];
    this.Recents = [];
    this.mostUsed = [];
    this.suggestedRegimen = [];
    this.LastCloudSync = null;
    this.db = this.props.databaseContext.db;
  }
  componentDidMount() {
    this.getSuggestedData();
    this.getMostUsed();
    this.getDoseRegimen();
  }

  searchRegimen(txt) {
    let regimen = null;
    if (txt) {
      this.setState({ searchText: txt });
      let searchData = this.Regimen.filter((item) => {
        if (item[0].toLowerCase().startsWith(txt.toLowerCase())) {
          return item;
        }
      });

      //Bring mostUsed on top
      let suggested = this.mostUsed;
      suggested = suggested.filter((s) => {
        if (s[0] != "") {
          return s;
        }
      });
      suggested.map((s) => {
        regimen = [...searchData];
        searchData.forEach(function (item, i) {
          item[0].trim();
          if (item[0] === s[0]) {
            regimen.splice(i, 1);
            regimen.unshift(item);
          }
        });

        searchData = regimen;
        regimen = null;
      });
      regimen = [...searchData];
      regimen = _.uniqBy(regimen, (item) => {
        return item[0];
      });
      searchData = [...regimen];
      regimen = null;
      suggested = null;
      let is_avail = searchData.findIndex((item) => {
        if (item[0].trim().toLowerCase() == txt.trim().toLowerCase()) {
          return item;
        }
      });
      this.setState({
        regimen: searchData,
        txtRegimen: txt,
        add: is_avail > -1 ? false : true,
      });
    } else {
      this.setState({
        regimen: this.Regimen,
        add: false,
        txtRegimen: txt,
        searchText: "",
      });
    }
  }
  addNewRegimen() {
    let data = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      key: "DosageRegimen",
      newData: this.state.txtRegimen,
      lastCloudSync: this.LastCloudSync ? this.LastCloudSync : "",
    };
    this.props.add_custom_data(data).then((response) => {
      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(data.key, this.state.txtRegimen, false);
      }
    });
  }
  updateRecentDb(key, value, isDelete) {
    let reg_index = -1;
    if (isDelete) {
      reg_index = this.Recents.findIndex((reg) => {
        if (reg[0].trim() == value.trim()) {
          return reg;
        }
      });
      if (reg_index > -1) {
        this.Recents.splice(reg_index, 1);
      }
    } else {
      let rec = [value, "", ""];
      this.Recents.unshift(rec);
    }

    this.db.transaction((tx) => {
      let query =
        "UPDATE Recents SET " +
        key +
        " = '" +
        JSON.stringify(this.Recents).replace(/\'/g, "''") +
        "', LastCloudSync= " +
        JSON.stringify(this.LastCloudSync) +
        " where DoctorID ='" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(query, [], (tx, results) => {
        if (isDelete) {
          reg_index = -1;
          reg_index = this.Regimen.findIndex((reg) => {
            if (reg[0].trim() == value.trim()) {
              return reg;
            }
          });
          if (reg_index > -1) {
            this.Regimen.splice(reg_index, 1);
          }
          let regimen_new = [...this.state.regimen];
          regimen_new = regimen_new.filter((reg) => {
            if (reg[0].trim() != value.trim()) {
              return reg;
            }
          });
          if (regimen_new.length > 0) {
            this.setState(
              {
                regimen: [...regimen_new],
              },
              () => {
                regimen_new = null;
              }
            );
          } else {
            this.setState({
              regimen: this.Regimen,
            });
          }
        } else {
          let rec = [value, "", ""];
          this.Regimen.unshift(rec);
          this.setState(
            {
              regimen: this.Regimen,
            },
            () => this.setRegimen(rec, 0)
          );
        }
      });
    });
  }
  setRegimen(item, index) {
    let medicine = { ...this.props.dosage.medicine };
    let old_regime = medicine.regimen[0] ? medicine.regimen[0][0] : "";
    medicine.regimen = [item, index];
    if (
      typeof this.props.dosage.medicine.regimen[0] == "string" &&
      this.props.dosage.medicine.regimen[0] != item[0]
    ) {
      medicine.remarks = "";
    } else if (old_regime != item[0]) {
      medicine.remarks = "";
    }

    this.props.setMedicine(medicine, null);
    this.showMealModal();
    //this.props.setCurrentDosageView('Duration')
  }
  //show Meal Modal
  showMealModal() {
    this.setState({
      showMealModal: true,
    });
  }

  //confrimDelete

  confrimDelete(item) {
    if (this.Recents.includes(item)) {
      Alert.alert("Prescrip", `Do you want to delete ${item[0]}`, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "YES", onPress: () => this.deleteRegimen(item) },
      ]);
    } else {
      Alert.alert("Prescrip", `Cannot delete ${item[0]}`);
    }
  }

  //Delete Regimen
  deleteRegimen(item) {
    let doctor_id = this.props.doctorProfile.DoctorData._id;
    let data = {
      Key: "DosageRegimen",
      value: item[0],
      DoctorId: doctor_id,
      brandName: "",
      doseForm: "",
      brandRemoving: false,
      doseRemoving: false,
    };
    // console.log(data);
    this.props.delete_custom_data(data).then((response) => {
      //  console.log(response);
      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(data.Key, data.value, true);
      }
    });
  }

  //Render Regimen
  renderRegimen(item, index) {
    return (
      <Capsule
        color={"#0065d7"}
        text={item[0]}
        onLongClick={() => this.confrimDelete(item)}
        onClick={() => {
          this.setRegimen(item, index);
        }}
      />
    );
  }
  renderMeals() {
    let meals = this.state.meals.map((meal, index) => {
      return (
        <TouchableOpacity
          keyboardShouldPersistTaps="handled"
          onPress={() => this.setMeal(index)}
          style={{
            backgroundColor: meal.select ? "#0065d7" : "#ffffff",
            alignSelf: "baseline",
            borderRadius: 20,
            margin: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
        >
          <Text
            style={{
              color: meal.select ? "#ffffff" : "#0065d7",
              paddingHorizontal: meal.type == "N/A" ? 40 : 20,
              paddingVertical: 10,
              textAlign: "center",
            }}
          >
            {meal.type}
          </Text>
        </TouchableOpacity>
      );
    });
    return meals;
  }
  //Set meal
  setMeal(index) {
    //this.state.meals[index].select=!this.state.meals[index].select;
    let meals = this.state.meals.map((meal, i) => {
      if (i == index) {
        meal.select = !meal.select;
      } else {
        meal.select = false;
      }
      return meal;
    });
    this.setState({
      meals: meals,
    });
  }
  setReminder() {
    this.state.reminder = !this.state.reminder;
    this.setState({
      reminder: this.state.reminder,
    });
  }
  goToDuration() {
    let medicine = this.props.dosage.medicine;
    let schedule = this.state.meals.find((meal) => {
      if (meal.select) {
        return meal;
      }
    });
    medicine.schedule = schedule
      ? schedule.type == "N/A"
        ? "NA"
        : schedule.type
      : "";

    medicine.reminder = this.state.reminder;
    this.props.setMedicine(medicine, null);
    this.setState(
      {
        showMealModal: false,
      },
      () => this.props.setCurrentDosageView("Duration")
    );
  }

  renderOnBottom(end) {
    this.setState({
      renderedTillNow: this.state.renderedTillNow + 1,
    });
  }
  getAll() {
    if (this.state.searchText) {
      return;
    } else {
      this.setState({
        regimen: this.Regimen,
        add: false,
        txtRegimen: "",
      });
    }
  }
  getRecentRegime() {
    this.db.transaction((tx) => {
      let query =
        "SELECT DosageRegimen,LastCloudSync from Recents where DoctorID= '" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(
        query,
        [],
        (tx, results) => {
          let recents = results.rows.raw()[0];
          this.Recents = JSON.parse(recents.DosageRegimen);
          this.Recents = this.Recents.map((rec) => {
            if (typeof rec == "string") {
              return [rec, "", ""];
            } else {
              return [rec[0], "", ""];
            }
          });
          this.LastCloudSync = recents.LastCloudSync;

          if (this.Recents.length > 0) {
            this.Regimen = [...this.Recents, ...this.Regimen];
          }
          let suggested = [];
          if (this.suggestedRegimen.length > 0) {
            //Show Suggestion on top

            this.suggestedRegimen = _.uniqBy(this.suggestedRegimen, (item) => {
              return item[1];
            });
            this.suggestedRegimen = _.orderBy(
              this.suggestedRegimen,
              [(r) => r[3]],
              ["asc"]
            );
            suggested = [...this.suggestedRegimen];
            suggested.map((s) => {
              let regimen = this.Regimen;
              this.Regimen.forEach(function (item, i) {
                item[0].trim();
                s[1].trim();
                if (item[0] === s[1]) {
                  regimen.splice(i, 1);
                  regimen.unshift(item);
                }
              });

              this.Regimen = regimen;
              regimen = null;
            });
            regimen = [...this.Regimen];
            regimen = _.uniqBy(regimen, (item) => {
              return item[0];
            });
            this.Regimen = [...regimen];
            regimen = null;
            let len = suggested.length ? suggested.length : this.Regimen.length;
            suggested = null;

            this.setState({
              regimen: this.Regimen.slice(0, len),
            });

            //Suggestion ends
          } else {
            //Bring mostUsed on top
            suggested = this.mostUsed;
            suggested = suggested.filter((s) => {
              if (s[0] != "") {
                return s;
              }
            });
            suggested.map((s) => {
              let regimen = this.Regimen;
              this.Regimen.forEach(function (item, i) {
                item[0].trim();
                if (item[0] === s[0]) {
                  regimen.splice(i, 1);
                  regimen.unshift(item);
                }
              });

              this.Regimen = regimen;
              regimen = null;
            });
            regimen = [...this.Regimen];
            regimen = _.uniqBy(regimen, (item) => {
              return item[0];
            });
            this.Regimen = [...regimen];
            regimen = null;
            let len = suggested.length ? suggested.length : this.Regimen.length;
            suggested = null;

            this.setState({
              regimen: this.Regimen,
            });
          }
        },
        (error) => {}
      );
    });
  }
  render() {
    let isSelected = this.state.meals.find((meal) => {
      if (meal.select) {
        return meal;
      }
    });
    return (
      <View style={{ flex: 1 }}>
        {/*Search View*/}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor: "#d1d1d1",
            borderRadius: 5,
            borderWidth: 2,
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <TextInput
            style={{
              flex: 0.9,
              fontSize: 16,
              fontFamily: NotoSans,
              paddingHorizontal: 5,
              paddingVertical: 10,
            }}
            placeholder={"Search for " + this.props.dosage.currentView}
            onChangeText={(text) => this.searchRegimen(text)}
            onFocus={() => this.getAll()}
          />
          <View style={{ flex: 0.1 }}>
            <Image
              source={ic_blue_search}
              style={{
                width: 20,
                height: 20,
                alignSelf: "center",
                paddingHorizontal: 5,
              }}
              resizeMode={"contain"}
            ></Image>
          </View>
        </View>
        {this.state.add ? (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
              marginHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: "column", flex: 0.9 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: "#0065d7",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                {this.state.txtRegimen}
              </Text>
              {
                <Text
                  style={{
                    fontSize: 11,
                    color: "#0065d7",
                    fontFamily: "NotoSans",
                    paddingTop: 5,
                  }}
                >
                  Add as {this.props.dosage.currentView}
                </Text>
              }
            </View>
            <TouchableOpacity
              disabled={!this.state.add}
              style={{ flex: 0.1 }}
              onPress={() => {
                this.addNewRegimen();
              }}
            >
              <Image
                source={this.state.add ? Add_blue_btn : ic_blue_search}
                style={{
                  width: 35,
                  height: 35,
                  alignSelf: "center",
                  paddingHorizontal: 5,
                }}
                resizeMode={"contain"}
              ></Image>
            </TouchableOpacity>
          </View>
        ) : null}
        {/*Search View Ends*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showMealModal}
          ref={"meal"}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            {/*Close Button*/}
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  showMealModal: false,
                })
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#ffffff",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
            {/*Close Button Ends*/}
            {/*Modal View*/}
            <View
              style={{
                backgroundColor: "#ffffff",
                borderTopLeftRadius: 15,
                borderTopEndRadius: 15,
                // padding: 20,
                width: "100%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "flex-start",
                  width: "100%",
                  padding: 20,
                }}
              >
                {/** Title */}
                <Text
                  style={{
                    color: "#000000",
                    fontFamily: NotoSans,
                    fontSize: 20,
                  }}
                >
                  {"When should the medication be consumed ?"}
                </Text>
                {/** Options View */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  {this.renderMeals()}
                </View>
                {/*** Dose Reminder */}
                <TouchableOpacity
                  onPress={() => this.setReminder()}
                  style={{ flexDirection: "row", marginVertical: 20 }}
                >
                  <Image
                    source={this.state.reminder ? ic_checked : ic_unchecked}
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                  />
                  <Text
                    style={{
                      color: "#000000",
                      fontFamily: NotoSans,
                      fontSize: 22,
                      paddingLeft: 10,
                    }}
                  >
                    Send Dose Reminder{" "}
                  </Text>
                </TouchableOpacity>
                {/*NEXT Button*/}
                <TouchableOpacity
                  disabled={!isSelected}
                  onPress={() => this.goToDuration()}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? ["#1b7cdb", "#07cef2"]
                        : ["#A8A8A8", "#A8A8A8"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.8]}
                    style={{
                      flexDirection: "row",
                      width: "90%",
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                      alignSelf: "center",
                      borderRadius: 25,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 17,
                          color: isSelected ? "#ffffff" : "#7F7E7E",
                          fontFamily: "NotoSans-Bold",
                          marginEnd: 5,
                        }}
                      >
                        NEXT
                      </Text>
                      {this.state.loading ? (
                        <View>
                          <ActivityIndicator size="small" color="#fff" />

                          <Text
                            style={[
                              { fontSize: 20, color: "black", marginTop: 20 },
                            ]}
                          >
                            {"Loading Regimen"}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/*** Ends */}
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{
            alignItems: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
          data={this.state.regimen.slice(0, this.state.maxData)}
          onEndReachedThreshold={0.0}
          renderItem={({ item, index }) => this.renderRegimen(item, index)}
          extraData={this.state.regimen}
        />
      </View>
    );
  }
  //Get Most Used
  getMostUsed() {
    let query = `SELECT DosageRegimen from MostUsed where DoctorId='${this.props.doctorProfile.DoctorData._id}'`;

    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        let data = result.rows.raw()[0];
        this.mostUsed = data.DosageRegimen
          ? JSON.parse(data.DosageRegimen)
          : [];
        this.mostUsed =
          this.mostUsed.length > 0
            ? _.orderBy(this.mostUsed, [(reg) => reg[1]], ["asc"])
            : [];
      });
    });
  }

  //Get Suggested Data
  getSuggestedData() {
    let suggestedPromise = new Promise((resolve, reject) => {
      this.props.databaseContext.db.transaction((tx) => {
        let brand = this.props.dosage.medicine.brand[1];
        let dose = this.props.dosage.medicine.dose[0]
          ? this.props.dosage.medicine.dose[0]
          : "";
        let query = `SELECT * from Suggestions where DoctorId='${this.props.doctorProfile.DoctorData._id}' and BrandName = '${brand}' and Dose = '${dose}'`;

        tx.executeSql(query, [], (tx, result) => {
          let data = result.rows.raw();

          resolve(data);
        });
      });
    });
    suggestedPromise.then((result) => {
      let dbData = result.map((item) => {
        return JSON.parse(item.Data);
      });

      let filterData = dbData[0].filter((item) => {
        if (item[0] === this.props.dosage.medicine.form[0] && item[1] != "") {
          return item;
        }
      });
      if (Array.isArray(filterData) && filterData.length > 0) {
        this.suggestedRegimen = _.orderBy(filterData, [(r) => r[3]], ["desc"]);
      }
    });
  }

  //Get Dose Regimen from Local DB
  getDoseRegimen() {
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(
        "SELECT DATA FROM MasterData where Srno = " + this.regimenIndex,
        [],
        (tx, results) => {
          let brandDataValue1 = results.rows.raw()[0];
          let values = JSON.parse(brandDataValue1.Data);

          this.Regimen = values.Value;
          this.getRecentRegime();
        },
        (error) => {}
      );
    });
  }

  getRecentRegime() {
    this.db.transaction((tx) => {
      let query =
        "SELECT DosageRegimen,LastCloudSync from Recents where DoctorID= '" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(
        query,
        [],
        (tx, results) => {
          let recents = results.rows.raw()[0];
          this.Recents = JSON.parse(recents.DosageRegimen);
          this.Recents = this.Recents.map((rec) => {
            if (typeof rec == "string") {
              return [rec, "", ""];
            } else {
              return [rec[0], "", ""];
            }
          });
          this.LastCloudSync = recents.LastCloudSync;

          if (this.Recents.length > 0) {
            this.Regimen = [...this.Recents, ...this.Regimen];
          }
          let suggested = [];
          if (this.suggestedRegimen.length > 0) {
            //Show Suggestion on top

            this.suggestedRegimen = _.uniqBy(this.suggestedRegimen, (item) => {
              return item[1];
            });
            this.suggestedRegimen = _.orderBy(
              this.suggestedRegimen,
              [(r) => r[3]],
              ["asc"]
            );
            suggested = [...this.suggestedRegimen];
            suggested.map((s) => {
              let regimen = this.Regimen;
              this.Regimen.forEach(function (item, i) {
                item[0].trim();
                s[1].trim();
                if (item[0] === s[1]) {
                  regimen.splice(i, 1);
                  regimen.unshift(item);
                }
              });

              this.Regimen = regimen;
              regimen = null;
            });
            regimen = [...this.Regimen];
            regimen = _.uniqBy(regimen, (item) => {
              return item[0];
            });
            this.Regimen = [...regimen];
            regimen = null;
            let len = suggested.length ? suggested.length : this.Regimen.length;
            suggested = null;

            this.setState({
              regimen: this.Regimen.slice(0, len),
            });

            //Suggestion ends
          } else {
            //Bring mostUsed on top
            suggested = this.mostUsed;
            suggested = suggested.filter((s) => {
              if (s[0] != "") {
                return s;
              }
            });
            suggested.map((s) => {
              let regimen = this.Regimen;
              this.Regimen.forEach(function (item, i) {
                item[0].trim();
                if (item[0] === s[0]) {
                  regimen.splice(i, 1);
                  regimen.unshift(item);
                }
              });

              this.Regimen = regimen;
              regimen = null;
            });
            regimen = [...this.Regimen];
            regimen = _.uniqBy(regimen, (item) => {
              return item[0];
            });
            this.Regimen = [...regimen];
            regimen = null;
            let len = suggested.length ? suggested.length : this.Regimen.length;
            suggested = null;

            this.setState({
              regimen: this.Regimen.slice(0, len),
            });
          }
        },
        (error) => {}
      );
    });
  }
}
