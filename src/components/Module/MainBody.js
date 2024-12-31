
import React, { Component, useRef } from "react"
import { Text, FlatList, TouchableOpacity, View, Alert,Dimensions, Image, TouchableWithoutFeedback, StatusBar, StyleSheet, Platform } from "react-native"
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import db from "../../utils/db";
import { Black_back, add_button_gray, Search_button_light_blue, icon_Chief_Complaints_Duration_Button, icon_Reemove_Button, Add_Button_Light_Blue, Add_Button_Orange, Add_Button_Purple, ic_note_delete, Attachment_clip, Show_all } from '../../constants/images'
//Importing Custom Components
import SelectedItem from "./SelectedItem";
import { setItem, setMData } from "../../actions/attachment"
import { ic_Empty_Setup_Clinic_Icon, Findings_N_Data_Icon, Invetigations_N_Data_Icon, Diagnosis_N_Data_Icon, Laboratory_N_Data_Icon, Lab_N_Data_Icon } from '../../constants/images';
import FlatListForSelectedPrescription from "../../components/FlatListForSelectedPrescription";
import { oneToNinenine, period, getAge } from '../../commonmethods/validation';

import { Container } from "native-base";
import { add_custom_data, getdoctor_svc } from '../../actions/sync';

import EmptyHomePrescrip from '../EmptyHome/EmptyHomePrescrip'
import { empty_vc } from '../../constants/images'


import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';

const maxSize = 50;

/*
List of Types used in Module: ChiefComplaints, Findings, Investigation, Diagnosis, RecommendedLabTest, Advice
1. Get Data from Db
2. Set Data in Db
3. Update to Api
4. If started searching directly, When Suggestions is seen. Load all data from masterdata
5. Remove Item from Selected List
6. Prefill data in attachment if clicked on selected item
7. Load suggestions data according to Types
8. Set labels such as Search for Findings, What are Patients Findings according to Types ChiefComplaints, Findings, Investigation, Diagnosis, RecommendedLabTest, Advice
9. Load data for Suggest PathLabs, Pharmacy for screens RecommendedLabTest
10. In Attachment Load data of History api according to Types
*/

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],                    //Suggestions 
            masterdata: [],                 //Actual JSON received from masterdata
            //selecteddata: [],               //Selected from List shown in flatlist
            recentsyncdate: '',             //recentsyncdate for storing to server
            flatlistData: [],               //Actual List with count of 20, used for Flatlist
            skip: 0,
            limit: 20,
            showall: false,
            searchCompletedIndex: 0,        //Optimization for search
            text_input_Holder: '',                 //Saved Search text 
            searchskip: 0,                   //Optimization for search

            ismostUsedDataAval: false,
            RecentData: [],
            providerData: [],
            apiHit: false,
            callFromDelete: false
        }
        //this.db = this.props.databaseContext.db;
        this.db = new db()
        this.getCombinedRecentAndMaster.bind(this)
        this.getDataFromLocal.bind(this)
        this.toggleFlalist.bind(this)
        this.setSuggChiefCompliement.bind(this)
    }


    hitForProvider() {
        let getdoctor_data = {
            "doctorId": this.props.doctorProfile.DoctorData._id

        }


        this.props.getdoctor_svc(getdoctor_data).then(response => {

            if (response.payload.data.status == 1) {

                this.setState({
                    providerData: response.payload.data.serviceProvided, apiHit: true
                }, () => {

                    this.setData();
                    this.props.onRef(this);
                })
            } else {
                alert(response.payload.data.msg)

            }


        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Do something if any updates
        if (prevProps.refreshType !== "updateFlatList" && this.props.refreshType == "updateFlatList") {
            this.setData(true);

        }
    }


    componentDidMount() {

        let { type, Srno, displayname, subtext, patientname, suggestname, navigation, defaultlabel } = this.props



        if (type == "Provider") {

            this.hitForProvider()


        } else {
            this.setData();
            this.props.onRef(this);

        }

        // this.setData();
        //this.props.onRef(this);
    }

    setData(callFromDelete) {
        const self = this;
        var history, masterdata, selecteddata, recentsyncdate;
        // self.setState({ callFromDelete: callFromDelete ? callFromDelete : false }, () => {
        this.getCombinedRecentAndMaster(callFromDelete).then(({ history, masterdata, RecentData, recentSyncdate }) => {
            let skip = 0;
            self.setState({ history, masterdata, RecentData, recentSyncdate }, () => {
                if (callFromDelete) {
                    this.toggleToMasterFlalist()
                } else {
                    this.getFilteredDataForBinding()

                }
            })
        })
        //  })
    }

    setEmptyPlaceHolder() {

        this.setState({
            text_input_Holder: '',
        })
    }


    Search() {
        let { searchtext } = this.props
        let { masterdata, skip, limit, flatlistData, } = this.state;
        let newData = this.getSearchedData(this.getOnlyValue(masterdata), searchtext.toLowerCase(), 0, 0);
        this.setState({
            showall: true,
            text_input_Holder: searchtext,
            flatlistData: newData.arrayOfData,
            searchCompletedIndex: newData.searchCompletedIndex,
            searchskip: newData.searchskip          //Because everytime search text will be changed 
        })
    }

    // When user reaches bottom of list will call this function
    loadMoreSearch() {
        let { searchtext } = this.props
        let { masterdata, skip, limit, flatlistData, searchskip, searchCompletedIndex } = this.state;
        let newData = this.getSearchedData(this.getOnlyValue(masterdata), searchtext.toLowerCase(), searchskip, searchCompletedIndex);
        this.setState({
            text_input_Holder: searchtext,
            flatlistData: newData.arrayOfData,
            searchCompletedIndex: newData.searchCompletedIndex,
            searchskip: newData.searchskip          //Because everytime search text will be changed 
        })
    }

    getSearchedData(data, search, searchskip, searchCompletedIndex) {
        let { limit } = this.state;
        let arrayOfData = []
        for (let i = searchCompletedIndex; i < data.length; i++) {
            let element = data[i]
            if (element) {
                if (Array.isArray(element)) {
                    if (element[0].toLowerCase().indexOf(search) != -1) {
                        arrayOfData.push(element)
                    }
                } else if (element.toLowerCase().indexOf(search) != -1) {
                    arrayOfData.push(element)
                }
            }
            if (arrayOfData.length == limit) {
                //Search Completes
                searchskip += limit
                searchCompletedIndex = i;
                break
            };
        }
        return { arrayOfData, searchCompletedIndex, searchskip }
    }

    getOnlyValue(masterdata, callForm) {
        if (masterdata.Data) {
            return masterdata.DataType == 'ArrayString' ? callForm && callForm == "history" ? masterdata.Data : masterdata.Data.sort() :
                callForm && callForm == "history" ? masterdata.Data[0].Value : masterdata.Data[0].Value.sort((a, b) => a[0].localeCompare(b[0]));
        } else {
            return []
        }
    }
    //callFromDelete: callFromDelete ? callFromDelete : false
    getFilteredDataForBinding(callFromDelete) {

        let { RecentData, masterdata, skip, limit, flatlistData, showall, history } = this.state;

        if (flatlistData.length > 0)
            skip += limit;
        if (showall) {
            Array.prototype.push.apply(flatlistData, this.getOnlyValue(masterdata).slice(skip, skip + limit));
        } else {

            Array.prototype.push.apply(flatlistData, this.getOnlyValue(history, "history").slice(skip, skip + limit));


            // flatlistData = [...history];
            // Array.prototype.push.apply(flatlistData, this.getOnlyValue(history));

            // alert(JSON.stringify(history))


        }
        // flatlistData.unshift(RecentData)
        this.setState({ skip, flatlistData });

    }

    loadMoreData() {
        let { searchtext } = this.props;
        let { text_input_Holder } = this.state;
        if (searchtext != '' && searchtext == text_input_Holder) {
            this.loadMoreSearch()
        } else {
            this.getFilteredDataForBinding()
        }
    }




    getUniqueChiefComplaints3(array) {
        var uniqueArray = [];

        // Removing dubs values in case multiple Dose added for a Brand
        for (i = 0; i < array.length; i++) {
            for (j = 0; j < array[i].length; j++) {
                var thisBrand = array[i][j][0];

                var findIndex = uniqueArray.findIndex(x => x[0] == thisBrand);
                if (findIndex == -1) {

                    uniqueArray.push([thisBrand, array[i][j][1]]);
                }
                else {
                    uniqueArray[findIndex] = [thisBrand, (uniqueArray[findIndex][1] + array[i][j][1])]

                }
            }

        };
        var arr = uniqueArray;
        arr.sort(function (a, b) {
            return a[1] < b[1] ? 1 : -1
        });
        var fnal = arr.slice(0, 5)
        return fnal;
    }

    //combines data from recent and master, Also gets history data from api
    getCombinedRecentAndMaster(callFromDelete) {
        return new Promise((resolve, reject) => {
            const { type, Srno } = this.props;
            var data = null;
            let query = Srno == 57 ? 'SELECT * FROM Tablets' : 'SELECT * FROM MasterData WHERE Srno=' + JSON.stringify(Srno)




            this.getDataFromLocal(query).then((results) => {

                if (Srno == 57) {
                    let row = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        row.push(results.rows.item(i));
                    }
                    data = row[0];
                    data.Data = [JSON.parse(data.Data)];
                    data.Data[0].Value = data.Data[0].Value.concat(JSON.parse(row[1].Data).Value)
                    resolve([], data, data.LastUpdated);
                } else {
                    //data flattening for flatlist

                    if (type == "Provider") {
                        data = {
                            "S3FileAccessLink": "",
                            "Data": this.state.providerData,
                            "LastUpdated": "2020-05-20T08:53:52.925Z",
                            "ReferenceNo": 0,
                            "Srno": 12,
                            "ExcelDownload": "",
                            "DataType": "ArrayString",
                            "Name": "Diagnosis",
                            "Sort": 0
                        }
                        let dataForSuggestion = data;
                        var mappedArray = [];
                    } else {
                        data = results.rows.raw()[0];



                        let dataForSuggestion = JSON.parse(JSON.stringify(data));
                        var mappedArray = [];
                        if (data.DataType == "ArrayObject") {
                            data.Data = [JSON.parse(data.Data)];
                        } else {
                            data.Data = JSON.parse(data.Data);
                        }
                    }


                    this.returnSortedData1(type, "MostUsed", (mostUsed) => {


                        this.returnSortedData(data, type, "Recents", (data1, recents, lastsyncDate, addedbydoc) => {

                            let recentData = []
                            recents.forEach(element => {
                                if (type == "Investigation" || type == "Findings") {
                                    recentData.push(

                                        [

                                            Array.isArray(element) ? element[0] ? element[0] : "" : element, "Alpha-numeric",
                                            Array.isArray(element) ? element[1] ? element[1] : '' : '',
                                            "",
                                            "0",
                                            "recent"
                                        ]);

                                } else {
                                    data.Data.unshift(element);

                                }

                            });

                            if (type == "Investigation" || type == "Findings") {
                                data.Data[0].Value = recentData.concat(data.Data[0].Value)
                            }

                            var uniqueArray = [];





                            if (type == "Findings" || type == "Investigation" || type == "Diagnosis" || type == "RecommendedLabTest" || type == "Advice")

                                if (this.props.suggestionPatientData != []) {
                                    mappedArray = this.props.suggestionPatientData.map(d =>

                                        type == "Findings" ? d.Findings :
                                            type == "Investigation" ? d.Investigation :
                                                type == "Diagnosis" ? d.Diagnosis :
                                                    type == "RecommendedLabTest" ? d.LabTest :
                                                        type == "Dose" ? d.Dose :
                                                            []

                                    );

                                }

                            if (mappedArray.length == 0) //|| (mappedArray.length > 0 && Array.isArray(mappedArray[0]))
                            {
                                //Get recents that are priviously clicked by

                                if (mostUsed && mostUsed.length > 0) {
                                    mappedArray = [mostUsed];
                                    this.setState({
                                        ismostUsedDataAval: true
                                    })
                                }
                                //  idmostUsedTrue 
                            }




                            let suggestData = []


                            if (mappedArray.length > 0) {

                                mappedArray = this.getUniqueChiefComplaints3(mappedArray)

                                mappedArray.forEach(element => {

                                    //let isAvalaible =false;
                                    let isAvalaibleUnit = '';
                                    let isKeyboardType = "Alpha-numeric";
                                    let fromWhichDB = 'custom';

                                    if (type == "Investigation" || type == "Findings") {
                                        var dataMasterFinalSet = [];
                                        data.Data[0].Value.forEach(elementFinal => {

                                            if (Array.isArray(elementFinal)) {
                                                dataMasterFinalSet.push(elementFinal[0])
                                            } else {
                                                dataMasterFinalSet.push(elementFinal)
                                            }

                                            if (elementFinal[0] == element[0]) {

                                                isAvalaibleUnit = elementFinal[2];
                                                isKeyboardType = elementFinal[1];
                                                fromWhichDB = elementFinal[5] && elementFinal[5] == 'recent' ? 'recent' : 'custom';
                                                return true
                                            }

                                        });

                                        var dataFinalSet = [];
                                        recents.map(element => {
                                            if (Array.isArray(element)) {

                                                dataFinalSet.push(element[0])
                                            } else {
                                                dataFinalSet.push(element)
                                            }
                                        });


                                        if (dataFinalSet.includes(Array.isArray(element) ? element[0] ? element[0] : "" : element)) {
                                            suggestData.push([Array.isArray(element) ? element[0] ? element[0] : "" : element,
                                                isKeyboardType,
                                                isAvalaibleUnit,
                                                "",
                                                "0",
                                                fromWhichDB
                                            ]);
                                        } else if (dataMasterFinalSet.includes(Array.isArray(element) ? element[0] ? element[0] : "" : element)) {
                                            suggestData.push([Array.isArray(element) ? element[0] ? element[0] : "" : element,
                                                isKeyboardType,
                                                isAvalaibleUnit,
                                                "",
                                                "0",
                                                fromWhichDB
                                            ]);
                                            dataMasterFinalSet
                                        }


                                    } else {

                                        if (recents.includes(element[0])) {
                                            suggestData.push(element[0]);

                                        } else if (data.Data.includes(element[0])) {
                                            suggestData.push(element[0]);

                                        }
                                    }

                                });



                                if (type == "Investigation" || type == "Findings") {

                                    // let dataForSuggestion = data;

                                    dataForSuggestion = JSON.parse(JSON.stringify(data));

                                    // JSON.parse(data.Data);
                                    dataForSuggestion.Data[0].Value = suggestData


                                } else {

                                    // let dataForSuggestion = data;

                                    dataForSuggestion = JSON.parse(JSON.stringify(data));

                                    // JSON.parse(data.Data);
                                    dataForSuggestion.Data = suggestData



                                }

                            }








                            //Merge Data of recents @addData


   
                            if(!callFromDelete){
                                this.setState({
                                    showall: suggestData.length == 0 ? true : false,
                                    isFromRecent: suggestData.length == 0 ? true : false,
                                    callFromDelete: false
                                })
                            }else if(callFromDelete && suggestData.length == 0 ){
                                this.setState({
                                    showall: suggestData.length == 0 ? true : false,
                                    isFromRecent: suggestData.length == 0 ? true : false,
                                    callFromDelete: false
                                })
                            }
                           




                            resolve({
                                history: mappedArray.length == 0 ? [] : JSON.parse(JSON.stringify(dataForSuggestion)), //[]
                                masterdata: data,
                                RecentData: recents,

                                recentSyncdate: data.LastUpdated
                            })
                        });
                    });
                }
            }).catch((err) => this.handleError('getDataFromLocal', err))
        })
    }

    //Set Past Complaints, Suggestions,
    setHistory() {
        switch (type) {
            case 'ChiefComplaints':
                this.setSuggChiefCompliement()
                break;
            case 'Findings':

                break;
            case 'Investigation':

                break;
            case 'Diagnosis':

                break;
            case 'RecommendedLabTest':

                break;
            case 'Advice':

                break;
            default:
            // code block
        }
    }

    //*********** GET PAST CHIEF COMPLAINTS ************/
    setSuggChiefCompliement() {
        return new Promise((resolve, reject) => {
            let patient_details = {
                "patient_Id": this.props.patientvisit.id,
                "doctorId": this.props.doctorProfile.DoctorData._id,
                "patientId": this.props.patientvisit.patientId,
                "skip": 0,
                "limit": 20
            };

            this.props.get_chief_suggestions(patient_details.patient_Id, patient_details.doctorId, patient_details.patientId).then((payload) => {
                var data = payload.payload.data;
                if (data.status == 0) {
                    resolve([]) // If error from server
                } else if (data.status == 1) {
                    const count = 0;
                    pastComplaints = data.suggesstion.map((val) => {
                        let item = {
                            name: val[0],
                            id: count + 1
                        }
                        return item;
                    });
                    resolve(pastComplaints)
                }
            });
        })
    }

    //Common function to handle error and report to firebase
    handleError(funcName, err) {

    }


    returnSortedData(jsonData, key, tableName, _callback) {
        const self = this;
        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT " + key + ", LastCloudSync FROM " + tableName + " where DoctorID = '" + self.props.doctorProfile.DoctorData._id + "'", [], (tx, results) => {
                if (results.rows.length > 0) {

                    let brandDataValue1 = results.rows.raw()[0];
                    var lstCsycndate = results.rows.raw()[0].LastCloudSync;

                    switch (key) {
                        case "Findings":

                            _callback([], JSON.parse(brandDataValue1.Findings), lstCsycndate, "");


                            break;

                        case "Investigation":

                            _callback([], JSON.parse(brandDataValue1.Investigation), lstCsycndate, "");
                            break;
                        case "Diagnosis":

                            _callback([], JSON.parse(brandDataValue1.Diagnosis), lstCsycndate, "");
                            break;

                        case "RecommendedLabTest":

                            _callback([], JSON.parse(brandDataValue1.RecommendedLabTest), lstCsycndate, "");
                            break;

                        case "Advice":

                            _callback([], JSON.parse(brandDataValue1.Advice), lstCsycndate, "");
                            break;



                        default:
                            _callback([], [], lstCsycndate, "");
                            break;
                    }

                }

                else {
                    _callback(jsonData, [], lstCsycndate, "");
                }



                /*   var ss = JSON.parse(results.rows.raw()[0][key]).DataValues.sort(this.sortbyCount);
                   var addedbydoc = ss.filter(function (i) {
                       return i[2] == 1
                   }).map((value) => { return value[0] });
                   var lstCsycndate = results.rows.raw()[0].LastCloudSync;
                   if (ss.length > 0) {
                       var modified = [],
                           savedJson = [...jsonData];
                       for (i = 0; i < ss.length; i++) {
                           var filtered = savedJson.filter(function (item) {
                               return item === ss[i][0]
                           })
                           if (filtered.length > 0) {
                               modified.push(filtered[0]);
                               var index = savedJson.indexOf(filtered[0]);
                               if (index !== -1) savedJson.splice(index, 1);
                           }
                       }

                       
                       _callback(savedJson, modified, lstCsycndate, addedbydoc);
                       */

            }, (error) => {
                _callback(jsonData, [], "");
            });
        });
    }

    returnSortedData1(key, tableName, _callback) {
        const self = this;
        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT " + key + ", LastCloudSync FROM " + tableName + " where DoctorID = '" + self.props.doctorProfile.DoctorData._id + "'", [], (tx, results) => {
                if (results.rows.length > 0) {

                    let brandDataValue1 = results.rows.raw()[0];

                    switch (key) {
                        case "Findings":

                            _callback(JSON.parse(brandDataValue1.Findings));


                            break;

                        case "Investigation":

                            _callback(JSON.parse(brandDataValue1.Investigation));
                            break;
                        case "Diagnosis":

                            _callback(JSON.parse(brandDataValue1.Diagnosis));
                            break;

                        case "RecommendedLabTest":

                            _callback(JSON.parse(brandDataValue1.RecommendedLabTest));
                            break;

                        case "Advice":

                            _callback(JSON.parse(brandDataValue1.Advice));
                            break;



                        default:
                            _callback([]);
                            break;
                    }

                }

                else {
                    _callback([]);
                }



            }, (error) => {
                _callback([]);
            });
        });
    }



    returnMostUsedData(key, tableName) {
        const self = this;
        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT " + key + " FROM " + tableName + " where DoctorID = '" + self.props.doctorProfile.DoctorData._id + "'", [], (tx, results) => {
                if (results.rows.length > 0) {

                    let brandDataValue1 = results.rows.raw()[0];

                    switch (key) {
                        case "Findings":

                            return JSON.parse(brandDataValue1.Findings);


                            break;

                        case "Investigation":

                            return JSON.parse(brandDataValue1.Investigation);

                            break;
                        case "Diagnosis":

                            return JSON.parse(brandDataValue1.Diagnosis);
                            break;

                        case "RecommendedLabTest":

                            return JSON.parse(brandDataValue1.RecommendedLabTest);
                            break;

                        case "Advice":
                            return JSON.parse(brandDataValue1.Advice);

                            break;



                        default:
                            return [];
                            break;
                    }

                }

                else {
                    return [];
                }


            }, (error) => {
                return [];
            });
        });
    }


    //Gets data from local
    getDataFromLocal(query) {
        return new Promise((resolve, reject) => {
            this.db.findData(query).then((data) => {
                resolve(data)
            });
        }).catch(ex => {

        })
    }

    deleleitem(filename, index) {
        DATA.splice(index, 1)
        this.setState({
            menuIndex: -1,
            attachdata: DATA
        });
    }

    //Remove from Selected Items
    removeItem = (data, index) => {
        let { mdata } = this.props
        mdata.splice(index, 1)
        this.props.setMData(mdata)
        //this.forceUpdate()
    }

    //Create new Item for Masterdata and set the data for attachments, On done click of attachment api will be called for new data
    insertNewData = () => {
        alert('insert new data');
    }

    toggleFlalist = () => {
        let { showall } = this.state;
        this.setState({ showall: !showall, skip: 0, flatlistData: [] }, () => {
            this.getFilteredDataForBinding()
        })
    }


    toggleToMasterFlalist() {
        let { showall,isFromRecent } = this.state;
        this.setState({
            showall: showall,
          //  isFromRecent: isFromRecent,
            skip: 0, flatlistData: []
        }, () => {
            this.getFilteredDataForBinding()
        })
    }

    setDataOnToggle() {
        let { masterdata, showall } = this.state
        if (!showall) {
            if (masterdata.length === 0) {
                this.setData()
            } else {
                this.setState({ showall: !showall })
            }
        }
    }

    filterArray(flatlistData, searchtext) {

        let newData3 = flatlistData.filter(item => {
            const itemData1 = `${Array.isArray(item) ? item[0] : item}`;
            return searchtext.toUpperCase() == itemData1.toUpperCase();

        });

        let newData3Length = newData3.length;
        newData3 = null;
        return newData3Length == 0 ? true : false;

    }



    clickData(callForm, index) {
        switch (callForm) {
            case "Duration":
                this.setState({
                    isShowDurationModal: true,
                    indexOfFlatList: index,
                })
                break;
            case "Period":
                this.setState({
                    isShowPariodModal: true,
                    indexOfFlatList: index,
                })
                break;
        }
    }

    checkIfAlreadyExistsInSelected(x) {
        return this.props.mdata.filter(i => i.Name === x.Name).length > 0
    }


    longClick(item) {

        if (this.props.type == "Investigation" || this.props.type == "Findings") {

            let x = {
                "DataType": '',
                "Graph": item[3],
                "Unit": item[2],
                "Upload": [],
                "Name": item[0],
                "keyBoradType": item[1],
                "callFrom": item[5] ? item[5] : 'master',
            }

            if (!this.checkIfAlreadyExistsInSelected(x)) {
                if (item[5] == "recent") {
                    Alert.alert(
                        "Prescrip",
                        "Do you want to delete "+x.Name+ " ?",
                        [
                            {
                                text: 'Delete',
                                onPress: () => {

                                    this.props.navigatetoscreen(item, "", this.state.RecentData, "longPress")
                                    // this.setData(true);
                                }
                            },
                            {
                                text: "Cancel",
                                style: "cancel",
                            }

                        ],
                        {
                            cancelable: true,

                        }
                    );
                } else {
                    Alert.alert("Prescrip", "Cannot delete "+x.Name);
                
                }
            } else {
                Alert.alert("Prescrip",
                    x.Name + ' already added'
                )
            }
        }
        else {
            let tempData = this.props.mdata;
            let x = tempData.filter(i => i === item)

            if (x.length === 0) {


                if (this.state.RecentData.includes(item)) {
                    Alert.alert(
                        "Prescrip",
                        "Do you want to delete "+item+ " ?",
                        [
                            {
                                text: 'Delete',
                                onPress: () => {

                                    this.props.navigatetoscreen(item, "", this.state.RecentData, "longPress")
                                    //  this.setData(true);
                                }
                            },
                            {
                                text: "Cancel",
                                style: "cancel",
                            }

                        ],
                        {
                            cancelable: true,

                        }
                    );
                } else {

                    Alert.alert("Prescrip", "Cannot delete "+item);

                    
                }
            } else {
                Alert.alert("Prescrip",
                item + ' already added')
            }
        }



    }
    comeToTop() {
        //alert("I am child");
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }
    render() {
        const { previous_screen,searchEnabled, navigatetoscreen, mdata, type, colorCode, searchtext, attachment, defaultlabel, displayname, editItem, setTooltipStatus, searchFindingContainerShowAll } = this.props;
        const { providerData, apiHit, flatlistData, RecentData, history, selecteddata, text_input_Holder, showall, ismostUsedDataAval } = this.state;

        //  if(type =="Provider")
        //this.getCombinedRecentAndMaster(providerData);


        searchtext != '' && searchtext != text_input_Holder ? this.Search() : searchtext == '' && searchtext != text_input_Holder ? this.Search() : null;




        return (
            <View  style={{ flex:1, backgroundColor: '#fafafa' 
             }}>

                <View style={styles.flatcontainer}>
                    <FlatList
                        ref={(ref) => { this.flatListRef = ref; }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}
                        data={flatlistData.slice(0, maxSize)}
                        showsHorizontalScrollIndicator={false}
                        style={styles.flat}

                        contentContainerStyle={{ flexGrow: 1 }}
                        ListHeaderComponent={
                            <HeaderComp
                                setTooltipStatus={setTooltipStatus}
                                searchFindingContainerShowAll={searchFindingContainerShowAll}
                                historyLength={this.getOnlyValue(history, "history").length}
                                RecentData={RecentData}
                                navigatetoscreen={navigatetoscreen}
                                displayname={displayname}
                                defaultlabel={defaultlabel}
                                data={attachment.mdata}
                                previous_screen ={previous_screen}
                                showaddbutton={searchtext.length > 0 && this.filterArray(flatlistData.slice(0, maxSize), searchtext)}
                                // showaddbutton={flatlistData.length === 0 && searchtext.length > 0}
                                remove={this.removeItem.bind(this)}

                                searchtext={searchtext}
                                colorCode={colorCode}
                                insertNewData={this.insertNewData}
                                searchEnabled={searchtext.length > 0 ? true : searchEnabled ? true : false}
                                toggleFlalist={this.toggleFlalist}
                                showall={showall}
                                ismostUsedDataAval={ismostUsedDataAval}
                                clickData={(callForm, index) => { this.clickData(callForm, index) }}
                                type={type}
                                editItem={editItem}
                            />}
                        renderItem={({ item }) => <Item
                            item={item}
                            RecentData={RecentData}
                            navigatetoscreen={navigatetoscreen}
                            longClick={(item) => { this.longClick(item, type) }}

                        />}
                        ListEmptyComponent={<Empty
                            type={type}
                            searchtext={searchtext}
                            providerData={providerData}
                            apiHit={apiHit}
                        />}
                        keyExtractor={(item, index) => { 'rowitem' + index.toString() }}
                        extraData={flatlistData.slice(0, maxSize)}


                        ItemSeparatorComponent={this.FlatListSeparator}
                        onEndReachedThreshold={0.3}
                        onEndReached={() => this.loadMoreData()}
                    />
                </View>
            </View>
        );
    }
}

const Empty = ({ type, searchtext, providerData, apiHit }) => {

    type = type == "RecommendedLabTest" ? "Lab Test" : type;
    return <EmptyHomePrescrip

        isLottie={true}
        imagePath={empty_vc}
        sectionImg={type == "Findings" ? Findings_N_Data_Icon : type == "Investigation" ? Invetigations_N_Data_Icon : type == "Diagnosis" ? Diagnosis_N_Data_Icon : type == "Lab Test" ? Lab_N_Data_Icon : null}
        title={type == "Provider" && searchtext == '' && providerData.length == 0 ? apiHit ? "No Services Found" : "Fetching Provider" : searchtext == '' ? ('Fetching ' + type) : ('No ' + type + ' found')}
        colorCode={'red'}
        isShowButton={false}
        description={searchtext == '' ? null : ("For adding '" + searchtext + "' as " + type + "\nYou can do it by clicking \u2295 symbol")}
    />
}

const Item = ({ item, RecentData, navigatetoscreen, longClick }) => {
    return <TouchableWithoutFeedback onPress={() => navigatetoscreen(item)}
        onLongPress={() => longClick(item)
        }
    >
        <View style={{ paddingVertical: 18, paddingHorizontal: 18, borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 16, color: '#595757' }}>
                {Array.isArray(item) ? item[0] : item}
            </Text>
        </View>
    </TouchableWithoutFeedback>
}


const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    type: state.attachment.type,
    Srno: state.attachment.Srno,
    defaultlabel: state.attachment.defaultlabel,
    displayname: state.attachment.displayname,
    colorCode: state.attachment.colorCode,
    mdata: state.attachment.mdata,
    attachment: state.attachment,
    patientvisit: state.patientvisit,
    suggestionPatientData: state.patientvisit.suggestionPatientData,
    searchFindingContainerShowAll: state.tooltip.toolTipStatus.searchFindingContainerShowAll,


});

const mapDispatchToProps = dispatch => ({
    setItem: (data) => dispatch(setItem(data)),
    setMData: (data) => dispatch(setMData(data)),
    setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
    getdoctor_svc: (data) => dispatch(getdoctor_svc(data)),


});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(MainBody));

/*
    HeaderComp Cases 
    1. Show suggestion & show all when Search is enabled 
    2. Add Button should be seen when Search is enabled and no data found in flatList 
    
*/
class HeaderComp extends React.PureComponent {

    render() {
        let { data, remove, RecentData, setTooltipStatus, searchFindingContainerShowAll, searchtext, clickData, navigatetoscreen, showaddbutton, insertNewData, searchEnabled, toggleFlalist, showall, ismostUsedDataAval, defaultlabel, displayname, type, editItem, historyLength,previous_screen } = this.props
        let colorCode = this.props.colorCode;
        switch (displayname) {
            case 'Lab Test':
                colorCode = "#f21c68"
                break;
            case 'Advice':
                colorCode = "#1DB07A"
                break;

            default:
        }
        let elements = type !== 'ChiefComplaints' ? data.map((i, index) => <SelectedItem


            key={'selected' + index}

            index={index}
            colorCode={type == 'RecommendedLabTest' || type == 'Advice' ? "#000" : colorCode}

            data={i} remove={remove} editItem={editItem} />) :

            <FlatListForSelectedPrescription
                {...this.props}
                data={data}
                leftImage={icon_Chief_Complaints_Duration_Button}
                rightImage={icon_Reemove_Button}
                crossClick_selectedItem={(id) => remove(id)}
                clickData={(callForm, index) => clickData(callForm, index)}
            />
        return (
            <View style={{ width: Dimensions.get('window').width}}>

                {
                    searchEnabled ? <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 18 }}>
                        <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                            <Text style={{ fontSize: 22, color: this.props.colorCode ? this.props.colorCode : colorCode ? colorCode : '#17afaf', fontFamily: 'NotoSans-Bold', }}>{searchtext}</Text>
                            {showaddbutton && <Text style={{ fontSize: 11, color: this.props.colorCode ? this.props.colorCode : colorCode ? colorCode : '#17afaf', fontFamily: 'NotoSans', paddingTop: 5 }}>Add as {displayname}</Text>}
                        </View>
                        {showaddbutton ? <AddButton
                            type={type}
                            colorCode={colorCode}
                            onPress={insertNewData}
                            RecentData={RecentData}
                            item={
                                type == "Investigation" || type == "Findings" ?
                                    [searchtext,
                                        "Alpha-numeric",
                                        "",
                                        "n",
                                        "0",
                                        "recent"
                                    ] : searchtext}
                            navigatetoscreen={navigatetoscreen}
                        /> : null}
                    </View> :
                        <View>
                            {data.length > 0 && <View style={{ padding: 10, backgroundColor: '#fafafa' }}>
                                <Text style={{ fontSize: 18, color: '#c4c4c4', fontFamily: 'NotoSans', paddingVertical: 10 }}>Selected</Text>
                                {
                                    elements
                                }
                            </View>
                            }
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fafafa', paddingHorizontal: 18, paddingVertical: 18 }}>
                                <Text style={{ fontSize: 16, color: '#c4c4c4', fontFamily: 'NotoSans' }}>{showall ? 'All' : ismostUsedDataAval ? "Recents" : defaultlabel}</Text>

                                {
                                    searchFindingContainerShowAll && historyLength > 0 && (previous_screen !=undefined && previous_screen != 'PrintPreview')
                                        ?

                                        <TouchableOpacity
                                            style={{ flexDirection: 'column', justifyContent: 'center'}}
                                          onPress={() => { setTooltipStatus({ ["searchFindingContainerShowAll"]: false }) }}>
                                              
                                            <Tooltip
                                                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                                animated={true}
                                                isVisible={true}
                                                backgroundColor={"rgba(0,0,0,0)"}
                                                contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
                                                tooltipStyle={{ right: 20, alignItems: 'flex-end' }}

                                                content={
                                                <TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                                                    onPress={() => { setTooltipStatus({ ["searchFindingContainerShowAll"]: false }) }}
                                                >
                                                    <AddPatient
                                                        imagePath={Show_all}
                                                        title={"Show all " + type}
                                                        description={"View all " + type + " in alphabetical order"}
                                                    />
                                                </TouchableOpacity>}
                                                //(Must) This is the view displayed in the tooltip
                                                placement="bottom"
                                            //(Must) top, bottom, left, right, auto.
                                             onClose={() => setTooltipStatus({ ["searchFindingContainerShowAll"]: false })}
                                            //(Optional) Callback fired when the user taps the tooltip
                                            >



                                                <TouchableWithoutFeedback onPress={toggleFlalist}>
                                                    <Text style={{ fontSize: 13, color: colorCode, fontFamily: 'NotoSans' }}>show {showall ? ismostUsedDataAval ? "Recents" : defaultlabel.toLowerCase() : 'all'}</Text>
                                                </TouchableWithoutFeedback>

                                            </Tooltip>

                                        </TouchableOpacity>

                                        :

                                        historyLength > 0 ?
                                            <TouchableWithoutFeedback onPress={toggleFlalist}>
                                                <Text style={{ fontSize: 13, color: colorCode, fontFamily: 'NotoSans' }}>show {showall ? ismostUsedDataAval ? "Recents" : defaultlabel.toLowerCase() : 'all'}</Text>

                                            </TouchableWithoutFeedback>
                                            : null
                                }

                            </View>
                        </View>
                }

            </View>
        )
    }

}

const AddButton = ({ colorCode, item, navigatetoscreen, RecentData, type }) => {
    return <TouchableOpacity
        onPress={() => navigatetoscreen(item, "custom", RecentData)}>
        <Image source={add_button_gray} style={{ height: 35, width: 35, tintColor: colorCode ? colorCode : 'blue', resizeMode: 'contain', }} />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    suggest_lab_view: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 50 },
    flat: { flex: 1, },
    flatcontainer: { flex: 1, backgroundColor: '#fafafa'  
    ,width: Dimensions.get('window').width },
    suggest_pink_image: { height: 15, width: 15, resizeMode: 'contain' },
    suggestion_laboratory_text: { fontSize: 15, color: '#f21c68', fontFamily: 'NotoSans', paddingStart: 5 },
})