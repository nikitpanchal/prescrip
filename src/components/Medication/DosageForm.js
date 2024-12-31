//Created by Pritish on 4/09/2020
//Component view for selection of Dosage Form
import React, { Component } from 'react';
import Capsule from '../Capsule';
import { View, FlatList, ActivityIndicator, TextInput, Image, Text } from 'react-native';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';
import PrescriptionLoader from '../../components/Loading/prescriptionLoader';
import _ from 'lodash';
import { ic_blue_search } from '../../constants/images';


export default class DosageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dosageform: [],
            loading: true,
            search: ""
        }
        this.DosageForm = [];
        this.suggestedForm = [];
        this.mostUsed = [];
    }
    searchDosageForm(txt) {
        if (txt.length > 0) {
            let searchData = this.DosageForm.filter(item => {

                if (item[0].toLowerCase().indexOf(txt.toLowerCase()) > -1) {
                    return item;
                }

            });
            this.setState({
                dosageform: searchData
            });

        }
        else {
            this.setState({
                dosageform: this.DosageForm,

            });
        }

    }
    componentWillMount() {

        this.getDosageForm();
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
            var fnal = arr.slice(0, 5);
            //fnal=_.orderBy(fnal,[f=>f[2]],['asc']);
            fnal.map(f => {
                if (!this.suggestedForm.includes(f[0])) {
                    this.suggestedForm.push(f[0]);
                }
            });
            this.suggestedForm.reverse();

        }

        this.getMostUsed();



    }

    setDosageForm(item) {
        let medicine = this.props.dosage.medicine;
        medicine.form = item;
        if (this.mostUsed) {
            let form = item[0];
            medicine.MostUsed = this.mostUsed[form] ? this.mostUsed[form] : [];
        }
        else {
            medicine.MostUsed = [];
        }
        this.props.setMedicine(medicine, null);
        this.props.setCurrentDosageView('Brand Name')
    }
    renderDosageForm(item, index) {

        return (
            <Capsule color={"#0065d7"} text={item[0]} onClick={() => { this.setDosageForm(item) }} />
        )


    }
    renderTextView(item, index) {
        return (
            <Text>{item[0]}</Text>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, marginBottom: 10 }}>
                {/*Search View*/}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#d1d1d1', borderRadius: 5, borderWidth: 2, marginVertical: 10, marginHorizontal: 20 }}>
                    <TextInput style={{ flex: 0.9, fontSize: 16, fontFamily: NotoSans, paddingHorizontal: 5, paddingVertical: 10 }} placeholder={"Search for " + this.props.dosage.currentView} onChangeText={(text) => this.searchDosageForm(text)} />
                    <Image source={ic_blue_search} style={{ flex: 0.1, width: 20, height: 20, alignSelf: "center", paddingHorizontal: 5 }} resizeMode={"contain"}></Image>
                </View>
                {/*Search View Ends*/}
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}
                    data={this.state.dosageform}
                    renderItem={({ item, index }) => (this.renderDosageForm(item, index))}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}>
                </FlatList>

            </View>

        )
    }

    //Get Most Used
    getMostUsed() {
        let query = `SELECT Dose from MostUsed where DoctorId='${this.props.doctorProfile.DoctorData._id}'`;

        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql(query, [], (tx, result) => {
                let data = result.rows.raw()[0];
                this.mostUsed = data.Dose ? JSON.parse(data.Dose) : [];
            });
        })
    }
    //Get all dosageform from Local DB
    getDosageForm() {
        //
        // this.setState({
        //     loading: true
        // })
        //101 is Srno for DosageForm array
        /*
        Gum Paint-33  : Denotes Form name and srno to look for brand name
        For Tablet-57, look brand name in different table 
        */
        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT DATA FROM MasterData where Srno = 101", [], (tx, results) => {
                let brandDataValue1 = results.rows.raw()[0];
                let values = JSON.parse(brandDataValue1.Data)
                let sortArr = this.props.sync.configData.doseFormData.filter(s => {
                    if (s.Sort > 0) {
                        return s
                    }
                })
                this.DosageForm = values.map((val) => {
                    let item = val.split('-');
                    let sort = sortArr.find(s => {
                        if (s.Name === item[0]) {
                            return s
                        }
                    });
                    if (sort) {
                        item.push(sort.Sort);
                        item.push(sort.IsSkip ? sort.IsSkip : 0);
                    }
                    return item;

                });

                //Bring Tablet to top

                let sorted = _.sortBy(this.DosageForm, d => d[2]);
                this.DosageForm = sorted;
                sorted = null;
                if (this.suggestedForm.length > 0) {

                    let suggested = this.suggestedForm;
                    suggested.map(s => {
                        let dosages = this.DosageForm;
                        this.DosageForm.forEach(function (item, i) {
                            if (item[0] === s) {

                                dosages.splice(i, 1);
                                dosages.unshift(item);
                            }
                        });
                        this.DosageForm = dosages;
                        dosages = null;


                    })

                    suggested = null;
                }


                this.setState({
                    dosageform: this.DosageForm,
                    loading: false,

                });


            }, (error) => {

            });
        });
    }
}