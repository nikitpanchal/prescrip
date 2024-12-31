//Created by Pritish on 4/09/2020
//Custom UI for Medicine Brand Names
import React, { Component } from 'react';
import Capsule from '../Capsule';
import { View, FlatList, ActivityIndicator, Alert, TextInput, Image, TouchableOpacity, Modal, Text, KeyboardAvoidingView } from 'react-native';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';
import LinearGradient from 'react-native-linear-gradient'
import PrescriptionLoader from '../../components/Loading/prescriptionLoader';

import { ic_blue_search, Add_blue_btn, empty_vc } from '../../constants/images';
import EmptyHomePrescrip from '../../components/EmptyHome/EmptyHomePrescrip';
import _ from 'lodash';
export default class BrandName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: [],
            loading: false,
            add: false,
            showGenric: false,
            custBrand: "",
            custGeneric: "",
            customBrand: false,
            searchText: "",

        };
        this.dbData = null;
        this.Brands = null;
        this.recentBrands = null;
        this.suggestedBrands = [];
        this.mostUsed = [];

    }

    searchBrand(txt) {
        let is_avail = -1;
        if (txt.length > 0) {
            this.setState({ searchText: txt })
            let searchData = this.Brands.filter(item => {

                if (item[1].trim().toLowerCase().startsWith(txt.trim().toLowerCase(), 0)) {
                    return item;
                }

            });
            // searchData.sort((a,b)=>{
            //     let ai=a[1].trim().toLowerCase().indexOf(txt.trim().toLowerCase());
            //     let bi=b[1].trim().toLowerCase().indexOf(txt.trim().toLowerCase());
            //     return (ai > -1 && bi > -1 && (ai - bi)) || -1;
            // });
            searchData = _.orderBy(searchData, [brand => brand[1].toLowerCase()], ['asc']);
            if (this.mostUsed.length > 0) {
                let suggested = this.mostUsed;
                suggested.map((s) => {
                    let brands = [...searchData];
                    searchData.forEach(function (item, i) {
                        item[1].trim();
                        if (item[1] === s.BrandName) {

                            brands.splice(i, 1);
                            brands.unshift(item);
                        }
                    });
                    searchData = brands;
                    brands = null;


                })

                suggested = null;
            }

            is_avail = searchData.findIndex((item) => {
                if (item[1].trim().toLowerCase() == txt.trim().toLowerCase()) {
                    return item;
                }
            });
            this.setState({
                brands: searchData,
                add: is_avail > -1 ? false : true,
                custBrand: txt
            });


        }
        else {
            let len = this.suggestedBrands.length ? this.suggestedBrands.length : this.mostUsed.length ? this.mostUsed.length : 50
            this.setState({
                brands: this.Brands.slice(0, len),
                add: false,
                searchText: "",

            });
            len = null;
        }

    }
    //Create a custom medicine
    addCustomMedicine() {
        this.setState({
            showGenric: true
        });

    }
    createCustomBrand() {
        let brand = [];
        brand.push(this.state.custGeneric);
        brand.push(this.state.custBrand);
        brand.push("");
        brand.push(true);

        this.Brands.unshift(brand);
        this.setState({
            brands: this.Brands
        });
        this.props.setCustomBrand(brand);
        this.setBrandName(brand, true);
    }

    getSuggestedData() {
        let allBrands = [];
        this.Brands.map(b => {
            if (b[1]) {
                allBrands.push(b[1]);
            }
        });

        if (this.mostUsed.length > 0) {
            this.mostUsed = this.mostUsed.filter(m => {
                if (allBrands.includes(m.BrandName)) {
                    return m;
                }
            });
        }
        if (this.props.suggestionPatientData.length > 0) {

            ////// DOSE

            let uniqueArray = [];
            let mappedArrayDosge = this.props.suggestionPatientData.map(d => d.Dose);
            //mappedArrayDosge.push([["Tablet","Endocal-D Forte",4]]);
            for (let i = 0; i < mappedArrayDosge.length; i++) {
                for (let j = 0; j < mappedArrayDosge[i].length; j++) {
                    let thisBrand = mappedArrayDosge[i][j];

                    var find = uniqueArray.find(x => x[1] == thisBrand[1]);
                    if (!find) {

                        uniqueArray.push([thisBrand[0], thisBrand[1], thisBrand[2]]);
                    }
                    else {
                        find[2] = thisBrand[2] + find[2];
                    }


                }

            };

            var arr = uniqueArray;
            arr.sort(function (a, b) {
                return a[2] < b[2] ? 1 : -1
            });
            let suggested = arr.filter(a => {
                if (a[0] == this.props.dosage.medicine.form[0]) {
                    return a;
                }
            })

            //            let allBrands=[...this.Brands];
            //            suggested=suggested.filter(s=>{
            //                let bindex=-1;
            //                bindex=allBrands.findIndex(b=>{
            //                    if(b[1].toLowerCase().trim()==s.toLowerCase().trim()){
            //                        return b;
            //                    }
            //                });
            //                if(bindex>-1){
            // return s;
            //                }
            //            })
            // suggested = suggested.filter(s => {
            //     if (allBrands.includes(s[1])) {
            //         return s;
            //     }
            // })
            var fnal = suggested.slice(0, 5);
            fnal = _.orderBy(fnal, [f => f[2]], ['asc']);
            fnal.map(f => {
                if (!this.suggestedBrands.includes(f[1])) {
                    this.suggestedBrands.push(f[1]);
                }
            });


        }
    }

    componentDidMount() {
        this.mostUsed = this.props.dosage.medicine.MostUsed;
        this.getBrandName(this.props.dosage.medicine.form[1]);
        this.getDbMedecine();
        this.customBrand = this.props.dosage.customBrand;



    }
    setBrandName(item, custom) {
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

        this.setState({
            showGenric: false
        });
        if (this.customBrand) {
            custom = this.customBrand[3] ? this.customBrand[3] : false
        }
        let medicine = this.props.dosage.medicine;
        medicine.brand = item;
        medicine.generic = item[0];
        medicine.customBrand = custom;

        this.props.setMedicine(medicine, null);
        if (medicine.form[3] == 1) {
            if (custom) {
                this.addCustomBrand();
            }
            else {
                this.props.setCurrentDosageView('Dose Regimen')
            }

        }
        else {
            this.props.setCurrentDosageView('Dose')
        }
    }
    //Get All
    getAll() {
        if (this.state.searchText) {
            return;
        }
        this.setState({
            brands: this.Brands.slice(0, 50),
            add: false

        });
    }
    //Delete Brand
    confrimDeleteBrand(brand) {
        let customMedicine = this.recentBrands.filter(item => {
            if (item[3]) {
                return item
            }
        });

        if (customMedicine.includes(brand)) {
            Alert.alert("Prescrip", `Do you want to delete ${brand[1]}`, [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "YES", onPress: () => this.deleteBrand(brand) }
            ])
        }
        else {
            Alert.alert("Prescrip", `Cannot delete ${brand[1]}`);
        }

    }

    deleteBrand(brand) {
        let form = this.props.dosage.medicine.form[0];
        let doctor_id = this.props.doctorProfile.DoctorData._id;
        let data = {
            "Key": "BrandName",
            "value": brand[1].trim(),
            "DoctorId": doctor_id,
            "BrandName": "",
            "doseForm": form,
            "brandRemoving": true,
            "doseRemoving": false,
        }

        this.props.delete_custom_data(data).then(response => {

            if (response.payload.data.status) {
                let LastCloudSync = response.payload.data.LastCloudSync;
                this.addToLocalDb(doctor_id, brand, LastCloudSync, true);
            }
        });

    }
    //Method to render Brand Names
    renderBrands(item, index) {

        return (
            <Capsule color={"#0065d7"} text={item[1]} onLongClick={() => this.confrimDeleteBrand(item)} onClick={() => { this.setBrandName(item, false) }} />
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" >
                    {/*Search View*/}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#d1d1d1', borderRadius: 5, borderWidth: 2, marginVertical: 10, marginHorizontal: 20 }}>
                        <TextInput autoCorrect={false} style={{ flex: 0.9, fontSize: 16, fontFamily: NotoSans, paddingHorizontal: 5, paddingVertical: 10 }} placeholder={"Search for " + this.props.dosage.currentView} onChangeText={(text) => this.searchBrand(text)} onFocus={() => this.getAll()} />
                        <View style={{ flex: 0.1 }} >
                            <Image source={ic_blue_search} style={{ width: 20, height: 20, alignSelf: "center", paddingHorizontal: 5 }} resizeMode={"contain"}></Image>
                        </View>
                    </View>
                    {
                        this.state.add ?
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, marginHorizontal: 20 }}>
                                <View style={{ flexDirection: 'column', flex: 0.9 }} >
                                    <Text style={{ fontSize: 22, color: '#0065d7', fontFamily: 'NotoSans-Bold', }}>{this.state.custBrand}</Text>
                                    {<Text style={{ fontSize: 11, color: '#0065d7', fontFamily: 'NotoSans', paddingTop: 5 }}>Add as {this.props.dosage.currentView}</Text>}

                                </View>
                                <TouchableOpacity disabled={!this.state.add} style={{ flex: 0.1 }} onPress={() => this.addCustomMedicine()}>
                                    <Image source={this.state.add ? Add_blue_btn : ic_blue_search} style={{ width: 35, height: 35, alignSelf: "center", paddingHorizontal: 5 }} resizeMode={"contain"}></Image>
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                    {/*Search View Ends*/}
                    <Modal
                        animationType="slide"
                        transparent={true}

                        visible={this.state.showGenric}
                        ref={"generic"}


                    >
                        <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" >
                            <View style={{
                                flex: 1,
                                width: '100%',
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            }}>

                                {/*Modal View*/}
                                <View style={{

                                    backgroundColor: "#ffffff",
                                    borderRadius: 15,

                                    // padding: 20,
                                    width: '100%',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5
                                }}>
                                    <View style={{ flexDirection: 'column', alignSelf: 'flex-start', width: '100%', padding: 20 }}>
                                        {/** Title */}
                                        <Text style={{ color: '#8d8d8d', fontFamily: NotoSans, fontSize: 16 }}>{"Add Generic Name"}</Text>
                                        {/** Generic Name */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#545454' }}>
                                            <TextInput style={{ flex: 0.9, fontSize: 16, fontFamily: NotoSans, paddingHorizontal: 5, paddingVertical: 10 }} placeholder={"Enter Generic Name"} onChangeText={(text) => { this.setState({ custGeneric: text }) }} />

                                        </View>
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({
                                                showGenric: false,
                                            }, () => this.createCustomBrand())}>
                                                <Text style={{ fontSize: 16, color: '#919191', marginHorizontal: 10, fontFamily: NotoSans_Bold }}>SKIP</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.createCustomBrand()}>
                                                <Text style={{ fontSize: 16, color: '#0065d7', marginHorizontal: 10, fontFamily: NotoSans_Bold }}>ADD</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                    {
                        this.state.brands.length == 0 ?
                            <EmptyHomePrescrip

                                isLottie={true}
                                imagePath={null}
                                title={'No ' + 'Brand Name' + (this.state.custBrand == '' ? ' available ' : ' found')}
                                colorCode={'red'}
                                isShowButton={false}
                                description={this.state.custBrand == '' ? null : ("To add '" + this.state.custBrand + "' as " + "brand name" + "\nYou can click the \u2295 symbol")}
                            /> :
                            <FlatList
                                keyboardShouldPersistTaps={'handled'}
                                contentContainerStyle={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}
                                data={this.state.brands}
                                renderItem={({ item, index }) => (this.renderBrands(item, index))}
                                extraData={this.state}>
                            </FlatList>
                    }
                    {this.state.loading ? <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        opacity: 1,
                    }}>

                        <ActivityIndicator color='#0065d7'
                            size="large"></ActivityIndicator>

                        <Text style={[{ fontSize: 20, color: 'black', marginTop: 20 }]}>{'Loading Brand Names'}</Text>




                    </View> : null}
                </KeyboardAvoidingView>
            </View>

        )
    }


    //Get Brand Names for selected Dosage Form by Srno. of the Dosage Form
    //Tablets we have maintained a diffrent table 
    getBrandName(srno) {
        //let test=[["Pantoprazole 40mg+Levosulpiride 75mg Sustained Release","Volapride Plus","40mg+75mg"],["Rabeprazole 20mg+Domperidone SR 30mg","Rabib-DSR","20mg+30mg"],["Cholecalciferol 60000IU","Salmon D3","60000IU"],["Ginseng+Antioxidants+Multivitamis+Multiminerals Softgel Capsule","Cardexamin",""],["Esomeprazole-40mg+Domperidone-30mg","Protonact DSR","40mg+30mg"],["Omega 3 Fatty Acid+Lutein+Astaxanthin+Zeaxanthin","Bioret",""],["Calcium Carbonate+Calcitriol+Vitamin K2-7","Aporosis",""],["Calcium Carbonate 625mg+Calcitrol 0.23mcg+Zinc 7.5mg+Methylcobalmin 500mcg+Folic Acid 1.5mg+ Pyridoxine 3mg","Cal-Aid","625mg"]];

        //57 is srno for tablets
        this.setState({
            loading: true
        })
        this.props.databaseContext.db.transaction((tx) => {
            if (srno != 57) {
                tx.executeSql("SELECT * FROM MasterData where Srno = " + srno, [], (tx, results) => {
                    let brandDataValue1 = results.rows.raw()[0];
                    let refno = JSON.parse(brandDataValue1.ReferenceNo);
                    let values = JSON.parse(brandDataValue1.Data);
                    if (values.Value) {
                        this.Brands = values.Value
                    }
                    else {
                        tx.executeSql("Select * from MasterData where Srno= " + refno, [], (tx, results) => {
                            let brandDataValue1 = results.rows.raw()[0];
                            let values1 = JSON.parse(brandDataValue1.Data);
                            if (values1.Value) {
                                this.Brands = values1.Value
                            }
                        }, (error) => {

                        })
                    }

                    //this.getDbMedecine();



                }, (error) => {

                });
            }
            else if (srno == 57) {
                tx.executeSql('SELECT * FROM Tablets', [], (tx, results) => {
                    let row = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        row.push(results.rows.item(i));
                    }
                    let data = row[0];
                    data.Data = [JSON.parse(data.Data)];
                    data.Data[0].Value = data.Data[0].Value.concat(JSON.parse(row[1].Data).Value)
                    this.Brands = data.Data[0].Value


                }, (error) => {

                });
            }
        });
    }


    //DB FUNCTIONS
    //Get medicines from Recents

    //[["Generic Name","Brand Name","Doses String",customFlag,"Dosage Form"]]
    getDbMedecine() {

        let form = this.props.dosage.medicine.form[0];

        this.props.databaseContext.db.transaction((tx) => {
            let query = "SELECT DoctorID, newDose, LastCloudSync from Recents where DoctorID= '" + this.props.doctorProfile.DoctorData._id + "'";

            tx.executeSql(query, [], (tx, result) => {
                let resData = result.rows.raw()[0];
                this.dbData = resData;
                this.recentBrands = JSON.parse(resData.newDose);

                //Get Recent Data of Brands for selected Dose Form
                this.recentBrands = this.recentBrands.filter(item => {
                    if (item[4] == form) {

                        return item;
                    }


                })
                //Ends



                this.mergeMastRecent();


            });
        })
    }
    mergeMastRecent() {
        //Remove null elements
        //let masterData = [...this.Brands];
        // masterData = masterData.map(brand => {
        //     brand.map(item => {
        //         item = item ? item : "";
        //         return item;
        //     })
        //     return brand;

        // })
        //this.Brands = [...masterData];
        // masterData = null;

        //WRITE A SPILT FUNCTION    
        let customMedicine = this.recentBrands.filter(item => {
            if (item[3]) {
                return item
            }
        });

        //MasterData
        // let masterMedicine = this.recentBrands.filter(item => {
        //     if (item[3] == false) {
        //         return item
        //     }
        // });
        //Merge Doses
        //["Rabeprazole 20Mg + Levosulpride 75Mg", "ROBNE LS", "100", "100 mg"],
        // for (let i = 0; i < masterMedicine.length; i++) {

        //     let index = this.Brands.findIndex(b => {
        //         if (b[1] == masterMedicine[i][1]) {
        //             return b;
        //         }
        //     })

        //     if (index > -1) {
        //         let brand = this.Brands[index];
        //         brand = brand.map(item => {
        //             item = item ? item : "";
        //             return item;
        //         })
        //         let mstDose = brand[2].split(',');
        //         let rctDose = masterMedicine[i][2].split(',');
        //         let newDose = Array.from(new Set(rctDose.concat(mstDose))).toString();

        //         brand[2] = newDose;
        //         this.Brands[index] = brand;
        //         brand = null;
        //         index = null;
        //         mstDose = null;
        //         rctDose = null;
        //         newDose = null;
        //     }
        //     else {

        //         //customMedicine.push(item);

        //     }
        // }
        // masterMedicine.forEach(item => {

        //     let index = this.Brands.findIndex(b => {
        //         if (b[1] == item[1]) {
        //             return b;
        //         }
        //     })

        //     if (index > -1) {
        //         let brand = this.Brands[index];
        //         brand = brand.map(item => {
        //             item = item ? item : "";
        //             return item;
        //         })
        //         let mstDose = brand[2].split(',');
        //         let rctDose = item[2].split(',');
        //         let newDose = Array.from(new Set(rctDose.concat(mstDose))).toString();

        //         brand[2] = newDose;
        //         this.Brands[index] = brand;
        //         brand = null;
        //         index = null;
        //         mstDose = null;
        //         rctDose = null;
        //         newDose = null;
        //     }
        //     else {

        //         //customMedicine.push(item);

        //     }


        // })
        //Ends
        //Meege Custom+Master

        let newBrands = null;
        if (customMedicine) {
            newBrands = [...customMedicine, ...this.Brands];
        }
        else {
            newBrands = this.Brands
        }

        this.Brands = newBrands;
        if (this.customBrand) {
            this.Brands.unshift(this.customBrand);
        }
        //Sort alphabetically
        let sorted = _.orderBy(this.Brands, [brand => brand[1].toLowerCase()], ['asc']);
        this.Brands = sorted;
        sorted = null;
        this.getSuggestedData();

        if (this.suggestedBrands.length > 0) {
            let suggested = [...this.suggestedBrands];
            suggested.map((s) => {
                let brands = this.Brands;
                var findSuggestedBrand = brands.find(itm => itm[1] == s);
                var findBrandIndex = brands.indexOf(findSuggestedBrand);
                if (findBrandIndex > -1) {
                    brands.splice(findBrandIndex, 1);
                    brands.unshift(findSuggestedBrand);
                }
                else {

                    this.suggestedBrands.splice(this.suggestedBrands.indexOf(s), 1)
                }
                // this.Brands.forEach(function (item, i) {
                //     item[1].trim();
                //     s.trim();
                //     if (item[1].toLowerCase() == s.toLowerCase()) {


                //     }
                // });
                this.Brands = brands;
                brands = null;


            })

            suggested = null;
        }
        else if (this.mostUsed.length > 0) {
            let suggested = this.mostUsed;
            suggested.map((s) => {
                let brands = this.Brands;
                var findSuggestedBrand = brands.find(itm => itm[1] == s.BrandName);
                var findBrandIndex = brands.indexOf(findSuggestedBrand);
                if (findBrandIndex > -1) {
                    brands.splice(findBrandIndex, 1);
                    brands.unshift(findSuggestedBrand);
                }
                else {
                    this.mostUsed.splice(this.suggestedBrands.indexOf(s), 1)
                }

                this.Brands = brands;
                brands = null;


            })

            suggested = null;
        }
        //Filter out Empty
        this.Brands = this.Brands.filter((brand) => {
            if (brand[1].length > 0) {
                return brand
            }
        })
        let len = this.suggestedBrands.length ? this.suggestedBrands.length : this.mostUsed.length ? this.mostUsed.length : 50
        this.setState({
            brands: this.Brands.slice(0, len),
            loading: false
        });
        len = null;
    }


    addCustomBrand() {
        //Call API
        let brand = this.props.dosage.medicine.brand;
        // "DoctorId": doctorId,
        // "isDoseAdding": isDoseAdding,
        // "brandName": brandName,
        // "doseForm": doseForm,
        // "dose": dose,
        // "newDoseArray": newDoseArray,
        // "lastCloudSync": this.lastCloudSync
        let medicine = [brand[0], brand[1], brand[2], this.props.dosage.medicine.customBrand, this.props.dosage.medicine.form[0]];
        let doctor_id = this.props.doctorProfile.DoctorData._id;
        let data = {
            DoctorId: doctor_id,
            isDoseAdding: this.props.dosage.medicine.customBrand ? false : this.state.newDose,
            brandName: brand[1],
            doseForm: this.props.dosage.medicine.form[0],
            dose: "",
            newDoseArray: medicine,
            lastCloudSync: this.dbData.LastCloudSync

        };
        this.props.addCustomMedicine(data).then(response => {

            let syncResponse = response.payload.data;
            if (syncResponse.status == 1) {
                let cusmed = this.props.dosage.medicine;
                cusmed.customBrand = false;

                this.props.setMedicine(cusmed, null);
                this.addToLocalDb(doctor_id, medicine, syncResponse.LastCloudSync, false);
            }


        });


        //Call Sql Sync on response
        //Switch to Regimen
    }
    addToLocalDb(doc_id, medicine, LastCloudSync, isDelete) {

        let newDose = JSON.parse(this.dbData.newDose);
        let index = newDose.findIndex((item) => {
            if (item[1] != -1) {
                if (item[1] != -1 && item[1].toLowerCase() == medicine[1].toLowerCase() && item[4].toLowerCase() == medicine[4].toLowerCase()) {
                    return item
                }
            }
        });
        if (isDelete) {
            if (index > -1) {
                newDose.splice(index, 1);
            }
        }
        else {
            if (index > -1) {
                newDose[index] = medicine;
            }
            else {
                newDose.unshift(medicine);
            }
        }




        this.props.databaseContext.db.transaction((tx) => {
            let query = "UPDATE Recents SET newDose = '" + JSON.stringify(newDose).replace(/\'/g, "''") + "', LastCloudSync= '" + LastCloudSync + "' where DoctorID ='" + doc_id + "'";

            tx.executeSql(query, [], (tx, result) => {

                if (result.rowsAffected > 0 && !isDelete) {
                    this.dbData.newDose = JSON.stringify(newDose);
                    this.props.setCustomBrand(null);
                    this.props.setCurrentDosageView('Dose Regimen')
                }
                else if (isDelete) {
                    //Refresh Brands Data Set
                    let brands = [...this.state.brands];
                    brands = brands.filter(b => {
                        if (b[1].trim() != medicine[1].trim()) {
                            return b
                        }
                    })
                    this.Brands = this.Brands.filter(b => {
                        if (b[1].trim() != medicine[1].trim()) {
                            return b
                        }
                    })
                    if (brands.length > 0) {
                        this.setState({
                            brands: [...brands]
                        }, () => { brands = null })
                    }
                    else {
                        this.setState({
                            brands: this.Brands.slice(0, 50)
                        })
                    }


                }
            }, (error) => {

            })
        });
    }
}

