import React from 'react';
import { View, TouchableOpacity, StatusBar, Text, Image, BackHandler, Platform } from 'react-native';
import { Container } from 'native-base';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";

import { add_custom_data } from '../../actions/sync';
import { setCertificateType, setPickerValue, setComponentData, setCustomData, setPaperSettings } from '../../actions/certificates';
import ItemPickerList from '../../components/Certificate/ItemPicker';
import { icon_search_button_blue, icon_List_First_Element_Add_Button_Blue, ic_add_blue } from '../../constants/images'
import Images from '../../Theme/Images'
var component = null;
class ItemPicker extends React.Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.db = this.props.databaseContext.db;
        this.state = {
            getCertificateData: null,
            data: [],
            value: "",
            addView: false,
            component: null,
        }
        this.masterValues = [];
        this.recentValues = [];
        this.certiData = null;
        this.values = [];
        this.LastCloudSync = "";
    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()

        component = this.props.route.params.component;
        this.setState({
            component: component
        });
        //this.values = this.props.certificates.customData[component.Label];
        // if (this.values && this.values.length > 0) {
        //     this.setState({
        //         data: this.values
        //     });
        // }

        this.getDbData();

    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }


    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }



    storeinDb(data, certData)  //data=merged certificate data, certdata= non-merged data  lastsync got from db
    {

        this.db.transaction((tx) => {
            let updateQuery = "UPDATE Recents SET " +
                "certificate" + " = '" + JSON.stringify(data).replace(/\'/g, "''") + "'," +
                "LastCloudSync = '" + certData.lastcloudsyncDate +
                "' where DoctorID = '" + certData.DoctorId + "'";
            tx.executeSql(updateQuery, [], (tx, result) => {


                if (result.rowsAffected > 0) {

                }
            })

        })
    }


    sendToApi(data, certdata) {  //data=merged certificate data, certdata= non-merged data  lastsync got from db
        certdata.newData = data
        this.props.add_custom_data(certdata).then(res => { //sending merged data to api
            if (res.payload.data.status === 1) {
                certdata.lastcloudsyncDate = res.payload.data.LastCloudSync // assigning lastsync from api to non-merged data
                this.storeinDb(data, certdata)
            } else {

            }

        }).catch(err => {

        })
    }

    addItem() {
        let lastsync = ""
        let item = this.state.value;
        //Add the entired text to Component Values
        this.values = this.state.data;
        this.values.unshift(item);
        let certificateType = this.props.certificates.selectedCertificate.name.split(" ").join("")
        let recents = this.props.certificates.customData;
        recents[component.Label] = this.values;
        if (this.recentValues[certificateType]) {
            let certiData = this.recentValues[certificateType];
            if (certiData[component.Label]) {
                certiData[component.Label].unshift(item);
            }
            else {
                certiData[component.Label] = [];
                certiData[component.Label].push(item);
            }
            this.recentValues[certificateType] = certiData;

        }
        else {
            this.recentValues[certificateType] = {};
            let certiData = this.recentValues[certificateType];
            certiData[component.Label] = [];
            certiData[component.Label].push(item);
            this.recentValues[certificateType] = certiData;



        }
        let params = {
            "key": "certificate",
            "DoctorId": this.props.doctorProfile.DoctorData._id,
            "lastcloudsyncDate": this.LastCloudSync,  //db lastsyncDate
            "newData": { ...this.recentValues }

        }


        this.sendToApi(this.recentValues, params);
        this.props.setCustomData(recents);
        this.setState({
            data: this.values ? this.values : [],
            value: "",
            addView: false
        });


    }

    searchText(txt) {
        if (!txt) {
            this.setState({
                data: this.values ? this.values : [],
                value: "",
            });
            return;
        }
        let search = this.values.filter(item => {
            if (item.toLowerCase().indexOf(txt.toLowerCase()) > -1) {
                return item
            }
        });
        if (search.length > 0) {
            this.setState({
                data: search
            });
        }
        else {
            this.setState({
                value: txt,
                addView: true,
                data: this.values ? this.values : []
            });
        }
    }

    selectValue(item) {
        this.props.setPickerValue(component.Label, item);
        this.handleBackButtonClick();
    }
    render() {
        return (
            <View style={{
                flex: 1, paddingTop: Platform.OS == "android" ?
                    this.props.databaseContext.statusBarHeight || 23 : this.props.databaseContext.statusBarHeight || 37, backgroundColor: '#ffffff'
            }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
                <ItemPickerList
                    {...this.props}
                    leftImage={Images.ic_black_back}
                    rightImage={icon_search_button_blue}
                    searchTitle={"Search for " + this.props.route.params.component.Label}
                    searchText={(txt) => this.searchText(txt)}
                    enterText={this.state.value}
                    patientData={[]}
                    subTitle={"Add as " + this.props.route.params.component.Label}
                    type={this.props.route.params.component.Label}
                    data={this.state.data}
                    backPress={() => this.props.navigation.goBack()}
                    addImage={ic_add_blue}
                    addView={this.state.addView}
                    itemSelected={(item) => this.selectValue(item)}
                    addImgClick={() => this.addItem()}>
                </ItemPickerList>
            </View>
        )
    }

    //DB Function
    getDbData() {
        //Get MasterData

        this.masterValues = component.Values;
        this.getRecentData();

    }
    getRecentData() {
        this.db.transaction((tx) => {
            let query = "SELECT certificate,LastCloudSync from Recents where DoctorID ='" + this.props.doctorProfile.DoctorData._id + "'";
            tx.executeSql(query, [], (tx, result) => {

                resData = result.rows.raw()[0];
                if (resData.LastCloudSync) {
                    this.LastCloudSync = resData.LastCloudSync;
                }
                if (resData.certificate) {
                    let recentData = JSON.parse(resData.certificate);
                    this.recentValues = recentData;
                    let certificateType = this.props.certificates.selectedCertificate.name.split(" ").join("");
                    recentData = null;
                    let data = this.recentValues[certificateType];
                    let compData = data[component.Label] ? data[component.Label] : [];
                    this.values = [...compData];
                    this.setState({
                        data: compData
                    });


                }

                // this.setState({
                //     data: [...this.masterValues, ...this.recentData]
                // });

            }, (error) => {

            })
        })
    }

}
const mapStateToProps = state => ({

    patientvisit: state.patientvisit,
    doctorProfile: state.doctorProfile,
    certificates: state.certificates

});


const mapDispatchToProps = dispatch => ({
    setCertificateType: (certificate) => dispatch(setCertificateType(certificate)),
    setPickerValue: (key, value) => dispatch(setPickerValue(key, value)),
    setComponentData: (data) => dispatch(setComponentData(data)),
    setCustomData: (data) => dispatch(setCustomData(data)),
    add_custom_data: (data) => dispatch(add_custom_data(data)),
    setPaperSettings: (setting) => dispatch(setPaperSettings(setting))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(ItemPicker));