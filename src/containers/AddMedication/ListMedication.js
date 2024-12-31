import React from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Platform,
  Dimensions,
} from "react-native";
import DraggableFlatList from "react-native-draggable-dynamic-flatlist";
import { Container } from "native-base";
import { FloatingAction } from "react-native-floating-action";

import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { setPrescription } from "../../actions/patientVisit";
import {
  setMedicine,
  setCurrentDosageView,
  addToPrescription,
  resetMedicine,
  setPrescriptionMedicine,
} from "../../actions/dosage";
import {
  Black_back,
  ic_Add_Clinic_Button,
  ic_med_info,
  ic_med_pharam,
  ic_drag,
  icon_Reemove_Button,
  ic_suggest_gray,
} from "../../constants/images";
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from "../../constants/font";
import { calculateAge } from "../../commonmethods/common";
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";
import Toast, { DURATION } from "react-native-easy-toast";
import _ from "lodash";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class ListMedication extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      data: [],
      loading: false,
    };
    this.dbData = null;
    this.Brands = null;
    this.recentBrands = null;
    this.suggestedBrands = [];
    this.mostUsed = [];
    this.toast = React.createRef();
  }
  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "ListMedication",
      screen_class: "ListMedication",
    });
    this.props.navigation.addListener("focus", () => {
      this.getMedicineList();
    });
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  getMedicineList() {
    this.props.dosage.medicineList;
    let prescrpition = this.props.patientvisit.prescription;
    prescrpition.PrescriptionList;
    this.setState({
      data: prescrpition.PrescriptionList,
    });
  }
  addMedicine() {
    this.props.resetMedicine();
    this.props.navigation.navigate("SelectMedication");
  }
  getBackground(isActive) {
    return isActive ? "#addbf7" : "#ffffff";
  }
  handleBackButtonClick() {
    this.props.navigation.pop();
    //this.props.navigation.navigate('PrescriptionPreviewHome');
    return true;
  }

  setPrescriptionList() {
    this.setState({
      loading: true,
    });
    let Pharma = null;
    if (this.props.patientvisit.referName.Pharma) {
      Pharma = {
        Name: this.props.patientvisit.referName.Pharma.Name,
        Mobile: this.props.patientvisit.referName.Pharma.Mobile,
        Email: this.props.patientvisit.referName.Pharma.Email,
        Address: this.props.patientvisit.referName.Pharma.Address,
      };
    }
    let prescrpition = this.props.patientvisit.prescription;
    prescrpition.PrescriptionList = this.state.data;
    //prescrpition.ReferredPharmacyDetails=data.ReferredPharmacyDetails;
    this.props.setPrescription(prescrpition);
    this.handleBackButtonClick();

    return;
    // this.props.addToPrescription(this.state.data);
    // let data = {
    //     PrescriptionList: this.state.data,
    //     doctorName: this.props.doctorProfile.DoctorData.DoctorFName + " " + this.props.doctorProfile.DoctorData.DoctorLName,
    //     patientName: this.props.patientvisit.patientDetails.CommonDetails.FullName,
    //     patientMobile: this.props.patientvisit.patientDetails.Mobile,
    //     patientCommonId: this.props.patientvisit.patientDetails.CommonDetails.id,
    //     patient_Id : this.props.patientvisit.patientId,
    //     ReferredPharmacyDetails : Pharma
    // };
    // let prescrpition = this.props.patientvisit.prescription;
    // let visitid = prescrpition._id;
    // this.props.setPrescriptionMedicine(visitid, data).then(({payload,error}) => {
    //     this.setState({
    //         loading: false
    //     });
    //     if(error){
    //         switch (error.data) {
    //             case 'Network Error':
    //               this.setState({
    //                 description: 'Currently internet is not avaliable'
    //               })
    //               break;
    //             default:
    //               this.setState({
    //                 description: 'Error in gettting response from server'
    //               })
    //               break;
    //           }

    //           this.setState({
    //             loading: false,
    //             showToast: true,
    //             toastBgColor:"#d9541d",
    //             toastTextColor:"#ffffff",
    //             toastImagePath:Images.Error
    //             //   description: payload.data.msg
    //           })

    //           setTimeout(() => {
    //             this.setState({
    //               showToast: false
    //             })
    //           })
    //           return
    //         }

    //     if (payload.data.status == 2000) {
    //         this.setState({
    //             loading: false,
    //             showToast: false,
    //             toastBgColor:"#d9541d",
    //             toastTextColor:"#ffffff",
    //             toastImagePath:Images.Error,
    //               description: '',
    //           })
    //         let PrescriptionList = payload.data.data.PrescriptionList;
    //         prescrpition.PrescriptionList = PrescriptionList;
    //         prescrpition.ReferredPharmacyDetails=data.ReferredPharmacyDetails;
    //         this.props.setPrescription(prescrpition);
    //         this.handleBackButtonClick();

    //     }
    // })
  }
  removeMedicine(index) {
    let data = this.state.data;
    data = data.filter((item, i) => {
      if (i != index) {
        return item;
      }
    });
    let prescrpition = this.props.patientvisit.prescription;
    prescrpition.PrescriptionList = [...data];

    this.props.setPrescription(prescrpition);
    this.props.addToPrescription(data);

    this.setState({
      data: data,
    });
  }
  //DB FUNCTIONS
  //Get Brand Names for selected Dosage Form by Srno. of the Dosage Form
  //Tablets we have maintained a diffrent table
  getBrandName(srno) {
    //let test=[["Pantoprazole 40mg+Levosulpiride 75mg Sustained Release","Volapride Plus","40mg+75mg"],["Rabeprazole 20mg+Domperidone SR 30mg","Rabib-DSR","20mg+30mg"],["Cholecalciferol 60000IU","Salmon D3","60000IU"],["Ginseng+Antioxidants+Multivitamis+Multiminerals Softgel Capsule","Cardexamin",""],["Esomeprazole-40mg+Domperidone-30mg","Protonact DSR","40mg+30mg"],["Omega 3 Fatty Acid+Lutein+Astaxanthin+Zeaxanthin","Bioret",""],["Calcium Carbonate+Calcitriol+Vitamin K2-7","Aporosis",""],["Calcium Carbonate 625mg+Calcitrol 0.23mcg+Zinc 7.5mg+Methylcobalmin 500mcg+Folic Acid 1.5mg+ Pyridoxine 3mg","Cal-Aid","625mg"]];

    //57 is srno for tablets

    this.props.databaseContext.db.transaction((tx) => {
      if (srno != 57) {
        tx.executeSql(
          "SELECT * FROM MasterData where Srno = " + srno,
          [],
          (tx, results) => {
            let brandDataValue1 = results.rows.raw()[0];
            let refno = JSON.parse(brandDataValue1.ReferenceNo);
            let values = JSON.parse(brandDataValue1.Data);
            if (values.Value) {
              this.Brands = values.Value;
            } else {
              tx.executeSql(
                "Select * from MasterData where Srno= " + refno,
                [],
                (tx, results) => {
                  let brandDataValue1 = results.rows.raw()[0];
                  let values1 = JSON.parse(brandDataValue1.Data);
                  if (values1.Value) {
                    this.Brands = values1.Value;
                  }
                },
                (error) => { }
              );
            }

            //this.getDbMedecine();
          },
          (error) => { }
        );
      } else if (srno == 57) {
        tx.executeSql(
          "SELECT * FROM Tablets",
          [],
          (tx, results) => {
            let row = [];
            for (let i = 0; i < results.rows.length; i++) {
              row.push(results.rows.item(i));
            }
            let data = row[0];
            data.Data = [JSON.parse(data.Data)];
            data.Data[0].Value = data.Data[0].Value.concat(
              JSON.parse(row[1].Data).Value
            );
            this.Brands = data.Data[0].Value;
          },
          (error) => { }
        );
      }
    });
  }

  //Get medicines from Recents
  getDbMedecine(item, index) {
    let form = item.DosageForms; //this.props.dosage.medicine.form[0];

    this.props.databaseContext.db.transaction((tx) => {
      let query =
        "SELECT DoctorID, newDose, LastCloudSync from Recents where DoctorID= '" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(query, [], (tx, result) => {
        let resData = result.rows.raw()[0];
        this.dbData = resData;
        this.recentBrands = JSON.parse(resData.newDose);
        ///console.log(this.recentBrands);
        //Get Recent Data of Brands for selected Dose Form
        this.recentBrands = this.recentBrands.filter((b) => {
          if (b[4] == form) {
            return b;
          }
        });
        //Ends

        this.mergeMastRecent(item, index);
      });
    });
  }
  mergeMastRecent(item, index) {
    //Remove null elements
    // let masterData = [...this.Brands];
    // masterData = masterData.map((brand) => {
    //   brand.map((item) => {
    //     item = item ? item : "";
    //     return item;
    //   });
    //   return brand;
    // });
    // this.Brands = [...masterData];
    // masterData = null;
    //WRITE A SPILT FUNCTION
    let customMedicine = this.recentBrands.filter((item) => {
      if (item[3]) {
        return item;
      }
    });

    //MasterData
    // let masterMedicine = this.recentBrands.filter((item) => {
    //   if (item[3] == false) {
    //     return item;
    //   }
    // });
    //Merge Doses
    // masterMedicine.forEach((item) => {
    //   let index = this.Brands.findIndex((b) => {
    //     if (b[1] == item[1]) {
    //       return b;
    //     }
    //   });

    //   if (index > -1) {
    //     let brand = this.Brands[index];
    //     brand = brand.map((item) => {
    //       item = item ? item : "";
    //       return item;
    //     });
    //     let mstDose = brand[2].split(",");
    //     let rctDose = item[2].split(",");
    //     let newDose = Array.from(new Set(rctDose.concat(mstDose))).toString();

    //     brand[2] = newDose;
    //     this.Brands[index] = brand;
    //     brand = null;
    //     index = null;
    //     mstDose = null;
    //     rctDose = null;
    //     newDose = null;
    //   } else {
    //     customMedicine.push(item);
    //   }
    // });
    //Ends
    //Meege Custom+Master

    let newBrands = null;
    if (customMedicine) {
      newBrands = [...customMedicine, ...this.Brands];
    } else {
      newBrands = this.Brands;
    }

    this.Brands = newBrands;
    if (this.customBrand) {
      this.Brands.unshift(this.customBrand);
    }
    //Sort alphabetically
    // let sorted = _.orderBy(
    //   this.Brands,
    //   [(brand) => brand[1].toLowerCase()],
    //   ["asc"]
    // );
    // this.Brands = sorted;
    // sorted = null;

    //Filter out Empty
    this.Brands = this.Brands.filter((brand) => {
      if (brand[1].length > 0) {
        return brand;
      }
    });
    let doses = "";
    let genericName = "";
    let sel_brand = this.Brands.find((brand) => {
      if (brand[1] == item.BrandName) {
        return brand;
      }
    });
    if (sel_brand) {
      doses = sel_brand[2];
      genericName = sel_brand[0];
    }
    var findCustDoseIfAny = this.recentBrands.filter(_item => {
      if (_item[3] == false && _item[1] == item[1]) {
        return _item
      }
    });
    var newDose = item;
    if (findCustDoseIfAny.length > 0) {


      let mstDose = item[2].split(',');
      let rctDose = findCustDoseIfAny[0][2].split(',');
      newDose = Array.from(new Set(rctDose.concat(mstDose))).toString();
      item[2] = newDose;
    }
    if (item[2])
      item[2] = [...new Set(item[2].split(','))].toString();
    //Get Dose for selected Brand
    let medicine = {
      form: [null, -1],
      brand: [null, null, -1],
      generic: null,
      dose: [null, -1],
      regimen: [null, -1],
      duration: [null, -1],
      startfrom: null,
      reminder: false,
      schedule: null,
      customBrand: false,
    };
    medicine.form[0] = item.DosageForms;
    medicine.form[1] = item.Srno;
    medicine.brand[0] = item.Generic;
    medicine.brand[1] = item.BrandName;
    medicine.brand[2] = doses ? doses : item.Dose; //Need to get from db on Edit
    medicine.generic = genericName;
    medicine.dose[0] = item.Dose;
    medicine.MostUsed = [];
    let regimen = [];
    regimen.push(item.DoseRegimen);
    medicine.regimen[0] = regimen; //Need to get from db on Edit
    medicine.duration[0] = item.Therapy;
    medicine.startfrom = item.StartFrom;
    medicine.reminder = item.DosageReminder;
    medicine.schedule = item.Intake;
    medicine.remarks = item.Remarks;
    medicine.editIndex = index;

    this.props.setMedicine(medicine, null);
    this.props.addToPrescription(this.state.data);
    this.props.navigation.navigate("SelectMedication");
  }

  //Get Srno from Database

  async getSrno(doseForm) {
    let srno;
    let query = `SELECT Srno FROM MasterData where Name= '${doseForm}'`;
    let srnPromise = new Promise((resolve, reject) => {
      this.props.databaseContext.db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (tx, result) => {
            let data = result.rows.raw()[0];
            srno = JSON.parse(data.Srno);
            resolve(srno);
          },
          (error) => {
            reject();
          }
        );
      });
    });
    srnPromise.then((res) => { });
  }

  //Edit Medicine
  editMedicine(item, index) {
    let dbSrno = 0;
    let query = "";
    if (item.DosageForms.trim().toLowerCase() == "Tablets".toLowerCase) {
      dbSrno = 57;
    } else {
      dbSrno = undefined;
    }

    let configDoseForm = this.props.sync.configData.doseFormData.filter((s) => {
      if (s.Sort > 0) {
        return s;
      }
    });
    let doseForm = configDoseForm.find((d) => {
      if (
        d.Name.trim().toLowerCase() == item.DosageForms.trim().toLowerCase()
      ) {
        return d;
      }
    });
    if (doseForm.Srno) {
      if (doseForm.Srno > 0) {
        item.Srno = doseForm.Srno;
        query = "SELECT * FROM MasterData where Srno = " + doseForm.Srno;
      }
    } else {
      item.Srno = item.DosageForms == "Tablets" ? 57 : undefined;
      query = `SELECT * FROM MasterData where Name= '${item.DosageForms}`;
    }

    let brandPromise = new Promise((resolve, reject) => {
      let srno = item.Srno;
      this.props.databaseContext.db.transaction((tx) => {
        if (srno != 57) {
          tx.executeSql(
            query,
            [],
            (tx, results) => {
              let brandDataValue1 = results.rows.raw()[0];
              let refno = JSON.parse(brandDataValue1.ReferenceNo);
              let values = JSON.parse(brandDataValue1.Data);
              let srno = JSON.parse(brandDataValue1.Srno);
              item.Srno = srno;
              if (values.Value) {
                this.Brands = values.Value;
                resolve(this.Brands);
              } else {
                tx.executeSql(
                  "Select * from MasterData where Srno= " + refno,
                  [],
                  (tx, results) => {
                    let brandDataValue1 = results.rows.raw()[0];
                    let values1 = JSON.parse(brandDataValue1.Data);
                    if (values1.Value) {
                      this.Brands = values1.Value;
                      resolve(this.Brands);
                    }
                  },
                  (error) => {
                    reject(JSON.stringify(error));
                  }
                );
              }

              //this.getDbMedecine();
            },
            (error) => {
              reject(JSON.stringify(error));
            }
          );
        } else if (srno == 57) {
          tx.executeSql(
            "SELECT * FROM Tablets",
            [],
            (tx, results) => {
              let row = [];
              for (let i = 0; i < results.rows.length; i++) {
                row.push(results.rows.item(i));
              }
              let data = row[0];
              data.Data = [JSON.parse(data.Data)];
              data.Data[0].Value = data.Data[0].Value.concat(
                JSON.parse(row[1].Data).Value
              );
              this.Brands = data.Data[0].Value;
              resolve(this.Brands);
            },
            (error) => {
              reject(JSON.stringify(error));
            }
          );
        }
      });
    });
    brandPromise.then((result) => {
      this.getDbMedecine(item, index);
    });
  }
  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        onPress={() => this.editMedicine(item, index)}
        onLongPress={move}
        onPressOut={moveEnd}
      //onPressOut={moveEnd}
      >
        <View
          style={{
            backgroundColor: this.getBackground(isActive),
            shadowColor: "#d9d9d9",
            shadowOffset: {
              width: 0,
              height: 3,
            },

            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            marginTop: 15,
            marginHorizontal: 15,
            borderBottomColor: "#cccccc",
            borderBottomWidth: 0.8,
            borderLeftColor: "#cccccc",
            borderLeftWidth: 0.8,
            borderRightColor: "#cccccc",
            borderRightWidth: 0.8,
            borderRadius: 8,
            elevation: 8,
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: "column", padding: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={ic_drag}
                style={{
                  resizeMode: "contain",
                  width: 15,
                  height: 15,
                  marginRight: 10,
                }}
              />
              <View
                style={{ flex: 2, flexDirection: "column", marginRight: 10 }}
              >
                <Text
                  style={{
                    color: "#0057df",
                    fontSize: 14,
                    fontFamily: NotoSans,
                  }}
                >
                  {item.DosageForms}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      color: "#3f3e3e",
                      fontSize: 20,
                      fontFamily: NotoSans_Bold,
                    }}
                  >
                    {item.BrandName}
                  </Text>
                  <Text
                    style={{
                      color: "#3f3e3e",
                      fontSize: 18,
                      fontFamily: NotoSans,
                      paddingHorizontal: 5,
                    }}
                  >
                    {item.Dose ? "(" + item.Dose + ")" : ""}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => this.removeMedicine(index)}
              >
                <Image
                  source={icon_Reemove_Button}
                  style={{ resizeMode: "contain", width: 20, height: 20 }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  Pharmanavigate() {
    var { type, displayname } = this.props;

    switch (displayname) {
      case "Pharmacy":
        type = "Pharmacy";
        this.props.navigation.push("LaboratoryContainer", {
          type: "Pharmacy",
          color: "#0065d7",
        });
        break;

      default:
    }
  }
  render() {
    let age = calculateAge(
      this.props.patientvisit.patientDetails.CommonDetails.DOB,
      false
    );
    return (
      <View
        style={{
          flex: 1,
          paddingTop:
            Platform.OS == "android"
              ? this.props.databaseContext.statusBarHeight || 23
              : this.props.databaseContext.statusBarHeight || 37,
          backgroundColor: "#fffff" 
        }}
      >
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />

        <View style={{ flex: 1, backgroundColor: "#fafafa", width: Dimensions.get('window').width }}>
          {/*Header View*/}
          <View
            style={{
              backgroundColor: "#ffffff",
              flexDirection: "row",
              flex: 0.12,
            }}
          >
            <TouchableOpacity
              onPress={() => this.handleBackButtonClick()}
              style={{
                padding: 5,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  resizeMode: "contain",
                  alignSelf: "center",
                  justifyContent: "flex-end",
                  width: 25,
                  height: 20,
                }}
                source={Black_back}
              />
            </TouchableOpacity>
            {/*Title*/}
            <View style={{ justifyContent: "center", marginVertical: 10 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: NotoSans_Bold,
                  color: "#5d5e5f",
                }}
              >
                {"Add Medication"}
              </Text>
              <Text
                style={{
                  fontFamily: NotoSans,
                  fontSize: 12,
                  color: "#545454",
                  marginBottom: 5,
                }}
              >
                {this.props.patientvisit.patientDetails.CommonDetails.FullName +
                  " | " +
                  age.value +
                  " " +
                  age.units +
                  " | " +
                  this.props.patientvisit.patientDetails.CommonDetails.Gender}
              </Text>
            </View>
            {/*Title Ends*/}
          </View>
          {/*Div*/}
          <View style={{ height: 1, backgroundColor: "#cdcdcd" }}></View>
          {/*Div Ends*/}

          {/*Ends*/}
          <DraggableFlatList
            style={{ marginBottom: 55, backgroundColor: "#fafafa" }}
            data={this.state.data}
            renderItem={this.renderItem}
            scrollPercent={10}
            onMoveEnd={({ data }) => this.setState({ data })}
          />
          <View style={{ backgroundColor: "#fafafa" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: 20,
              }}
              onPress={() => this.Pharmanavigate()}
            >
              {this.props.patientvisit.referName.Pharma ? (
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={ic_suggest_gray}
                      style={{
                        resizeMode: "contain",
                        height: 10,
                        width: 10,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: NotoSans,
                        fontSize: 14,
                        color: "#8b8b8b",
                      }}
                    >
                      {"Suggested"}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: NotoSans,
                      fontSize: 16,
                      color: "#0065d7",
                    }}
                  >
                    {this.props.patientvisit.referName.Pharma
                      ? this.props.patientvisit.referName.Pharma.Name
                      : "Suggest Pharmacy"}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={ic_med_pharam}
                    style={{
                      resizeMode: "contain",
                      height: 20,
                      width: 20,
                      paddingHorizontal: 20,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: NotoSans,
                      fontSize: 16,
                      color: "#0065d7",
                    }}
                  >
                    {this.props.patientvisit.referName.Pharma
                      ? this.props.patientvisit.referName.Pharma.Name
                      : "Suggest Pharmacy"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {/*NEXT Button*/}
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => {
                this.setPrescriptionList();
              }}
            >
              <LinearGradient
                colors={["#1b7cdb", "#07cef2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.8]}
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("window").width * 90 / 100,
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
                      color: "#ffffff",
                      fontFamily: "NotoSans-Bold",
                      marginEnd: 5,
                    }}
                  >
                    DONE
                  </Text>
                  {this.state.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/*** Ends */}
          </View>
        </View>
        <FloatingAction
          iconHeight={55}
          iconWidth={55}
          position={"right"}
          color="transparent"
          floatingIcon={ic_Add_Clinic_Button}
          overlayColor="transpart"
          distanceToEdge={{ horizontal: 30, vertical: 140 }}
          // actions={this.props.actions}
          onPressMain={() => this.addMedicine()}
        />
        {this.props.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.state.toasttextColor}
              imagePath={this.state.toastImgPath}
              description={this.state.description}
            />,

            1500
          )
          : null}
        <Toast
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
            width: Dimensions.get("window").width * 90 / 100,

            backgroundColor: this.state.toastBgColor,
            borderRadius: 15,
          }}
          ref={(ref) => this.toast = ref}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  dosage: state.dosage,
  patientvisit: state.patientvisit,
  doctorProfile: state.doctorProfile,
  displayname: state.attachment.displayname,
  subtext: state.attachment.subtext,
  type: state.attachment.type,
  sync: state.sync,
  suggestionPatientData: state.patientvisit.suggestionPatientData,
});
const mapDispatchToProps = (dispatch) => ({
  setMedicine: (medicine, flow) => dispatch(setMedicine(medicine, flow)),
  setCurrentDosageView: (view) => dispatch(setCurrentDosageView(view)),
  addToPrescription: (list) => dispatch(addToPrescription(list)),
  resetMedicine: () => dispatch(resetMedicine()),
  setPrescription: (data) => dispatch(setPrescription(data)),

  setPrescriptionMedicine: (visitid, data) =>
    dispatch(setPrescriptionMedicine(visitid, data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(ListMedication));
