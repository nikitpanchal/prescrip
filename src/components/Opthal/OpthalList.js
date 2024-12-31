import React, { Component } from "react";
import { Container, Icon, Text, List, } from "native-base";
import { StatusBar, View, TouchableOpacity, Platform, BackHandler, TextInput, Image, FlatList, Dimensions, Alert, KeyboardAvoidingView } from "react-native";
import styles from './style';
import { connect } from 'react-redux';

import { add_custom_data } from '../../actions/sync';
import { setOpthalListData, setOpthalData, AddRecents } from '../../actions/opthal';
import { withDb } from "../../DatabaseContext/withDatabase";
import { empty_vc, Chief_N_Data_Icon, Black_back, ic_note_delete, Search_button_light_blue, add_button_gray, icon_search_button_blue } from '../../constants/images'
import Ionicons from 'react-native-vector-icons/Ionicons'
import multipleTapHandler from '../../components/MultiTapHandle/index';
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader'
import Images from '../../Theme/Images'
import PrescriptionHeader from '../../components/PrescriptionHeader/PrescriptionHeader'

class OpthalList extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.searchText = React.createRef();
        this.state = {
            search: '',
            enterText: '',
            addView: false,
            refresh: false,
            array_data: this.props.opthallist.data,
            filteredData: []
        };
        this.db = this.props.databaseContext.db;
        this.docid = this.props.doctorProfile.DoctorData._id;
        this.specialization = this.props.doctorProfile.DoctorData.PrimarySpecialization;
    }

    componentDidMount() {
        this.getDataFromSqlite()
    }

    // loglytics(action) {
    //     var { _id, DoctorMobile, DoctorFName, DoctorLName } = this.props.doctorProfile.DoctorData;
    //     logAnalytics(_id + "_" + DoctorFName + "_" + DoctorLName, DoctorMobile, 'UserFavPrescription', action);
    // }

    getDataFromSqlite() {
        var { screen, label, section, row, column, header } = this.props.opthallist
        const data = this.getDataFromStore(), self = this, key = section;
        var _getRecentsData = function () {
            return new Promise((resolve, reject) => {
                self.db.transaction((tx) => {
                    tx.executeSql("SELECT * FROM Recents where DoctorID = '" + self.docid + "'", [], (tx, results) => {
                        var dbData = results.rows.raw()[0];
                        if (!dbData[self.specialization]) {
                            resolve()
                        } else {
                            dbData[self.specialization] = JSON.parse(dbData[self.specialization])
                        }
                        if (!dbData[self.specialization][key]) {
                            resolve()
                            self.setState({
                                refresh: true
                            })
                        }

                        var newArr = [];
                        var notfound = false
                        if (key == "spectacle_prescription") {
                            header = header.split(' / ');
                            if (!dbData[self.specialization][key][header[0]]) {
                                resolve()
                                self.setState({
                                    refresh: true
                                })
                            }

                            if (!dbData[self.specialization][key][header[0]][header[1]]) {
                                resolve()
                                self.setState({
                                    refresh: true
                                })
                            }

                            if (dbData[self.specialization][key][header[0]][header[1]].DataValues.length > 0) {

                                dbData[self.specialization][key][header[0]][header[1]].DataValues.map(i => {
                                    if (data.indexOf(i[0]) == -1) {
                                        notfound = true;
                                        data.push(i[0])
                                    }
                                })
                            }
                            resolve(data);
                            self.setState({
                                refresh: true
                            })

                        } else {
                            if (!dbData[self.specialization][key][label]) {
                                dbData[self.specialization][key][label] = { "DataInfo": ["Name", "Count"], "DataValues": [] };
                            }

                            if (dbData[self.specialization][key][label].DataValues.length > 0) {
                                dbData[self.specialization][key][label].DataValues.map(i => {
                                    if (data.indexOf(i[0]) == -1) {
                                        notfound = true;
                                        data.push(i[0])
                                    }
                                })

                            }
                            resolve(data);
                            this.setState({
                                refresh: true
                            })
                        }
                    })
                })
            })
        }

        _getRecentsData().then((result) => {
            this.searchFilterFunction(result ? result : data, "getDataFromSqlite")
        })
    }

    searchFilterFunction(val, from) {
        var data = [];
        if (from == "getDataFromSqlite") {
            data = val;
        } else {
            data = this.getDataFromStore()
            data = data.filter(item => {
                item = item.toString()
                const itemData = item.toUpperCase();
                const textData = val.toUpperCase()
                return itemData.startsWith(textData);
            });
            if (!data.includes(val)) {
                this.setState({
                    addView: true
                })
            }
            else {
                this.setState({
                    addView: false
                })


            }
        }

        this.props.setOpthalListData({ data });
        this.setState({
            refresh: true
        })
        //this.forceUpdate();
    };

    getDataFromStore() {
        const { screen, label, section, row, column } = this.props.opthallist
        var vdata = [];
        if (section == "spectacle_prescription") {
            vdata = this.props.opthal[screen][section][row][column];
        } else if (screen == "more") {
            vdata = this.props.opthal[screen].filter(i => i.label == label)[0].Value;
        } else {
            vdata = this.props.opthal[screen][section].filter(i => i.label == label)[0].Value;
        }
        return vdata
    }

    pushData(item) {
        if (item.length > 0) {
            var data = this.getDataFromStore()
            data.unshift(item);
            const { section, label, header } = this.props.opthallist;
            this.addDataToRecents(section, label, item, header, data).then(() => {
                this.props.setOpthalListData({ data });
                this.setState({ search: '' })
            })
        }
    }

    addDataToRecents(key, label, item, header, data) {
        const self = this;
        var dbData = null, tx1 = null, Value = null;
        const { screen, section, row, column } = this.props.opthallist;
        return new Promise((resolve, reject) => {
            var isFieldExist = function () {
                return new Promise((resolve, reject) => {
                    var isExist = false;
                    self.db.transaction((tx) => {
                        tx.executeSql("PRAGMA table_info(Recents)", [], (tx, results) => {
                            var raw = results.rows.raw();
                            if (raw.filter(i => i.name == self.specialization).length > 0) {
                                resolve(true)
                            } else {
                                tx.executeSql("ALTER TABLE Recents ADD COLUMN " + self.specialization + " TEXT default null", [], (tx, moddata) => {
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

            var _getRecentsData = function () {
                return new Promise((resolve, reject) => {
                    self.db.transaction((tx) => {
                        tx1 = tx;
                        tx.executeSql("SELECT * FROM Recents where DoctorID = '" + self.docid + "'", [], (tx, results) => {
                            dbData = results.rows.raw()[0];
                            if (!dbData[self.specialization]) {
                                dbData[self.specialization] = {};
                            } else {
                                dbData[self.specialization] = JSON.parse(dbData[self.specialization])
                            }
                            if (!dbData[self.specialization][key]) {
                                dbData[self.specialization][key] = {};
                            }

                            var newArr = [];
                            var notfound = false
                            if (key == "spectacle_prescription") {
                                header = header.split(' / ');
                                if (!dbData[self.specialization][key][header[0]]) {
                                    dbData[self.specialization][key][header[0]] = {}
                                }

                                if (!dbData[self.specialization][key][header[0]][header[1]]) {
                                    dbData[self.specialization][key][header[0]][header[1]] = { "DataInfo": ["Name", "Count"], "DataValues": [] };
                                }

                                if (dbData[self.specialization][key][header[0]][header[1]].DataValues.length > 0) {

                                    dbData[self.specialization][key][header[0]][header[1]].DataValues.map(i => {
                                        if (i[0] == item) {
                                            notfound = true
                                            i[1] = i[1] + 1
                                            newArr.push(i)
                                        } else {
                                            newArr.push(i)
                                        }
                                    })

                                    if (!notfound) {
                                        newArr.push([item, 1])
                                    }
                                } else {
                                    newArr.push([item, 1])
                                }
                                dbData[self.specialization][key][header[0]][header[1]].DataValues = newArr;

                            } else {
                                if (!dbData[self.specialization][key][label]) {
                                    dbData[self.specialization][key][label] = { "DataInfo": ["Name", "Count"], "DataValues": [] };
                                }

                                if (dbData[self.specialization][key][label].DataValues.length > 0) {
                                    dbData[self.specialization][key][label].DataValues.map(i => {
                                        if (i[0] == item) {
                                            i[1] = i[1] + 1
                                            newArr.push(i)
                                        } else {
                                            newArr.push(i)
                                        }
                                    })

                                    if (!notfound) {
                                        newArr.push([item, 1])
                                    }
                                } else {
                                    newArr.push([item, 1])
                                }
                                dbData[self.specialization][key][label].DataValues = newArr;
                            }
                            resolve(dbData);
                        }, (error) => {

                        });
                    });
                });
            }

            var _addRecentsData = function () {
                return new Promise((resolve, reject) => {
                    let recent_data = { DoctorId: self.docid, key: self.specialization, newData: dbData[self.specialization], lastcloudsyncDate: new Date().toISOString() };
                    self.props.add_custom_data(recent_data).then(({ payload }) => {
                        if (payload.data.status == 1) {
                            self.db.transaction((tx) => {
                                tx.executeSql("UPDATE Recents set LastCloudSync = '" + payload.data.LastCloudSync + "', " + self.specialization + " = '" + JSON.stringify(dbData[self.specialization]).replace(/\'/g, "''") + "' where DoctorID = '" + self.docid + "'", [], (txs, upresults) => {
                                    var x = ["lefteye", "righteye", "more"];
                                    x.map(j => {
                                        if (section == "spectacle_prescription" && j != "more") {
                                            self.props.opthal[j][section][row][column]["value"] = data

                                        } else if (section == "more") {
                                            self.props.opthal[section].map((i, index) => {
                                                if (i.label == label)
                                                    self.props.opthal[section][index]["Value"] = data
                                            })
                                        } else if (section == "visual_acuity" && j != "more") {
                                            self.props.opthal[j][section].map((i, index) => {
                                                if (i == label)
                                                    self.props.opthal[j][section][index]["value"] = data
                                            })
                                        }
                                    })

                                    Value = { "Datainfo": ["Type", "Name"], "Value": [{ lefteye: self.props.opthal.lefteye, righteye: self.props.opthal.righteye, more: self.props.opthal.more }] }
                                    resolve(Value);
                                }, (error) => {

                                });
                            });
                        } else {
                            Alert.alert(payload.data.msg)
                        }
                    })
                })
            }

            var _updateMasterData = function () {
                return new Promise((resolve, reject) => {
                    self.db.transaction((tx) => {
                        tx.executeSql("UPDATE MasterData set Data = '" + JSON.stringify(Value).replace(/\'/g, "''") + "' where Srno = '" + 16 + "'", [], (txs, upresults) => {
                            resolve(upresults);
                        }, (error) => {

                        });
                    });
                });
            }

            isFieldExist().then(_getRecentsData).then(_addRecentsData).then(_updateMasterData).then(() => {

                this.setState({
                    addView: false
                })
                resolve();
            })
        })
    }


    // This method will check if column exists in your table
    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };

    onBack() {
        this.props.navigation.goBack()
    }

    selectData(item) {

        // alert(!isNaN(item))
        if (typeof item === "number" || !isNaN(item)) {
            item = (item <= 0 ? "" : "+") + item;
        }

        const { header, screen, section } = this.props.opthallist;
        var { selecteddata } = this.props.opthal;
        var column = header.split(" / ");
        if (screen != "more") {
            if (!selecteddata[screen][section]) {
                selecteddata[screen][section] = {};
            }

            if (!selecteddata[screen][section][column[0]])
                selecteddata[screen][section][column[0]] = {}
        }
        if (column.length > 1) {
            //For Grid Data
            if (column.join("_") == "Near_Sphere") {
                var x = selecteddata[screen][section]["Distance"];
                if (true) {

                    //x && (x["Sphere"] ? 1 :  x["Sphere"] ==0 ? 1 :0 :0 ) 
                    if (!selecteddata[screen][section][column[0]]) {
                        selecteddata = selecteddata[screen][column[0]]
                    }


                    let dataa = selecteddata[screen][section]["Distance"] ? selecteddata[screen][section]["Distance"]["Sphere"] ? parseFloat(selecteddata[screen][section]["Distance"]["Sphere"]) + parseFloat(item) : item : item

                    selecteddata[screen][section][column[0]][column[1]] = (dataa <= 0 ? "" : "+") + parseFloat(dataa);

                    selecteddata[screen][section][column[0]]["mainValue"] = parseFloat(item)
                    /*  if(selecteddata[screen][section][column[0]][column[1]]){
                          selecteddata[screen][section][column[0]][column[1]] =selecteddata[screen][section]["Distance"] ? parseFloat(selecteddata[screen][section]["Distance"]["Sphere"]) + item: item
                         // alert(parseFloat(selecteddata[screen][section]["Distance"]["Sphere"]) + item)
  
                      }else{
                          selecteddata[screen][section][column[0]][column[1]] = item
  
                      }  */
                    this.props.setOpthalData({ selecteddata });
                    this.onBack();
                } else {
                    Alert.alert("Please add Sphere Distance to select Sphere Near")
                }
            } else if (column.join("_") == "Distance_Cylinder" || column.join("_") == "Near_Cylinder") {
                var x = selecteddata[screen][section]["Distance"];
                var y = selecteddata[screen][section]["Near"];
                if (!y) {
                    selecteddata[screen][section]["Near"] = {}
                }
                if (!x) {
                    selecteddata[screen][section]["Distance"] = {}
                }
                selecteddata[screen][section]["Distance"]["Cylinder"] = item;
                selecteddata[screen][section]["Near"]["Cylinder"] = item;
                this.props.setOpthalData({ selecteddata });
                this.onBack();

            } else if (column.join("_") == "Distance_Axis" || column.join("_") == "Near_Axis") {
                var x = selecteddata[screen][section]["Distance"];
                var y = selecteddata[screen][section]["Near"];
                if (!y) {
                    selecteddata[screen][section]["Near"] = {}
                }
                if (!x) {
                    selecteddata[screen][section]["Distance"] = {}
                }
                selecteddata[screen][section]["Distance"]["Axis"] = item;
                selecteddata[screen][section]["Near"]["Axis"] = item;
                this.props.setOpthalData({ selecteddata });
                this.onBack();
            }
            else if (column.join("_") == "Distance_Sphere") {
                selecteddata[screen][section][column[0]][column[1]] = item

                if (selecteddata[screen][section]["Near"] && selecteddata[screen][section]["Near"]["Sphere"])
                    if (selecteddata[screen][section]["Near"] && selecteddata[screen][section]["Near"]["mainValue"]) {
                        var dataa1 = parseFloat(selecteddata[screen][section][column[0]][column[1]]) + parseFloat(selecteddata[screen][section]["Near"]["mainValue"])

                        selecteddata[screen][section]["Near"][column[1]] = (dataa1 <= 0 ? "" : "+") + parseFloat(dataa1);

                    }

                this.props.setOpthalData({ selecteddata });
                this.onBack();
            }
            else {

                selecteddata[screen][section][column[0]][column[1]] = item
                this.props.setOpthalData({ selecteddata });
                this.onBack();
            }
        } else if (screen == "more") {
            //For Normal Pickers
            selecteddata[screen][column[0]] = item;
            this.props.setOpthalData({ selecteddata });
            this.onBack();

        } else {
            //For Normal Pickers
            selecteddata[screen][section][column[0]] = item;
            this.props.setOpthalData({ selecteddata });
            this.onBack();
        }

    }

    _renderItem = ({ item }) => {
        return <TouchableOpacity style={styles.option} onPress={() => this.props.onRedirect('Assessment', item)}>
            <View style={[{ borderBottomColor: '#eee', borderBottomWidth: 4, paddingVertical: 10, paddingHorizontal: 15, flexDirection: "row" }]}>
                <View style={{ flex: 0.9, flexDirection: 'column' }}>
                    <Text style={[styles.sectionhead]}>{item.Favourite}</Text>
                    <Text style={[styles.sectioncont]}>{(item.PrescriptionList.map((item1) => { return item1.BrandName })).join(", ")}</Text>
                </View>
                <View style={{ flex: 0.1, alignContent: 'center', justifyContent: "center" }}>
                    <Icon as={Ionicons} style={{ fontSize: 22, right: -5, color: '#008be0' }} name="ios-arrow-forward" />
                </View>
            </View>
        </TouchableOpacity>
    };



    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {

        multipleTapHandler.clearNavigator()
        this.props.navigation.goBack()
        return true;
    }

    OnClick() {
        multipleTapHandler.clearNavigator()
        this.props.navigation.goBack()
    }
    rightImageOnClick() {

        this.setState({ enterText: '' });
        this.getDataFromStore();
        this.searchData('')
        this.textInput.clear()
    }

    searchData(txt) {
        this.searchFilterFunction(txt)
        this.setState({
            enterText: txt,

        });
    }
    render() {
        const { header, data } = this.props.opthallist;
        let { statusBarHeight } = this.props.databaseContext;
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={statusBarHeight}
                behavior={Platform.select({ android: undefined, ios: 'padding' })} enabled={Platform.OS == "android" ? false : true}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
                <View
                    style={{ flex: 1, backgroundColor: '#ffffff' }}>


                    <View style={{
                        paddingHorizontal: 9, marginTop: statusBarHeight || 0 + 45, paddingBottom: 15, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 2,

                    }} >
                        <TouchableOpacity onPress={() => this.OnClick()} style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={Images.ic_black_back} style={{ resizeMode: 'contain', height: 20 }} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1, }} >
                            <Text style={{ fontSize: 12, color: '#919191', fontFamily: 'NotoSans', textTransform: 'uppercase', }}>{this.props.searchTitle}</Text>
                            <View style={{ flex: 1, }} >
                                <TextInput
                                    //autoCompleteType={false}
                                    ref={input => { this.textInput = input }}
                                    autoCorrect={false}
                                    placeholder={"Search for " + header}
                                    placeholderTextColor="#00C953"
                                    onChangeText={(txt) => this.searchData(txt)}
                                    style={styles.searchinput}
                                    Value={this.state.txt}
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.rightImageOnClick()}>
                                <Image source={this.state.addView ? ic_note_delete : icon_search_button_blue} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#00C953' }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Header Ends */}
                    {this.state.enterText.trim().length > 0 && this.state.addView ?

                        <View style={{ flexDirection: 'column', backgroundColor: '#f1f1f1', }}>
                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fff', paddingStart: 8, paddingVertical: 18 }}>
                                <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, }}>
                                        <View style={{ flexDirection: 'column', backgroundColor: '#fff', paddingRight: 5, flex: 1 }} >
                                            <Text style={{ fontSize: 24, color: '#00C953', fontFamily: 'NotoSans-Bold', paddingTop: 5 }}>{this.state.enterText}</Text>
                                            <Text style={{ fontSize: 11, color: '#00C953', fontFamily: 'NotoSans', paddingTop: 5 }}>{"Add as " + header}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.pushData(this.state.enterText)} >
                                            <Image source={add_button_gray} style={{ resizeMode: 'contain', height: 35, width: 35, tintColor: '#00C953' }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </View>

                        : null}
                    <FlatList
                        style={{ paddingBottom: 50, flex: 1 }}
                        data={data}
                        renderItem={({ item, index }) => (
                            // Single Comes here which will be repeatative for the FlatListItems
                            <TouchableOpacity onPress={() => { this.selectData(item) }}
                                style={{ width: "100%", paddingVertical: 10, paddingLeft: 20, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                                <Text style={{ fontSize: 18, alignSelf: 'flex-start', color: "#404040", width: '100%' }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        keyboardShouldPersistTaps={'handled'}
                        extraData={this.state}
                    />

                </View>
            </KeyboardAvoidingView>
        )
    }
}


OpthalList.propTypes = {
};

const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    opthallist: state.opthallist,
    opthal: state.opthal
});

const mapDispatchToProps = dispatch => ({
    setOpthalListData: (data) => dispatch(setOpthalListData(data)),
    add_custom_data: (data) => dispatch(add_custom_data(data)),
    //AddRecents: (DoctorId, key, newData, lastcloudsyncDate) => dispatch(AddRecents(DoctorId, key, newData, lastcloudsyncDate)),
    setOpthalData: (data) => dispatch(setOpthalData(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(OpthalList));

