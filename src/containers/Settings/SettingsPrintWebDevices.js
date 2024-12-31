/// Pritish
import React, { Component } from 'react'
import { Container, Content, Header } from 'native-base'
import { Text, Image, View, StatusBar, BackHandler, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native'
import { connect } from "react-redux";
import { Minus_Remove_Icon, Firefox_Icon, Chrome_Icon, Blue_Plus_Icon, VideoConsultation_Icon, PrintViaWeb_Icon, Notifications_Icon, Clinic_Consultation_Icon, empty_vc, Chief_N_Data_Icon, Black_back, ic_note_delete, Search_button_light_blue, lefticon, rightblueIcon } from '../../constants/images'
import multipleTapHandler from '../../components/MultiTapHandle/index';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import io from 'socket.io-client';
import _ from 'lodash';
import { isStagging, staging, prod } from "../../../app.json";
var chrome = require('../../../assets/Settings/dev-ico/chrome.png');
var firefox = require('../../../assets/Settings/dev-ico/firefox.png');
var internetexplorer = require('../../../assets/Settings/dev-ico/internetexplorer.png');
var safari = require('../../../assets/Settings/dev-ico/safari.png');
var others = require('../../../assets/Settings/dev-ico/domain.png');
var logout = require('../../../assets/Settings/dev-ico/logoutscan.png')
var imageData = {
    "chrome": chrome,
    "firefox": firefox,
    "internetexplorer": internetexplorer,
    "safari": safari,
    "others": others,
    "logout": logout
}
class SettingsPrintWebDevices extends Component {
    constructor(props) {
        super(props)
        this.socketConnection = null;
        this.activeDevicesData = [];
        this.Received = false;
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.onscanned = this.onscanned.bind(this);
        this.docid = '';
        this.state = {
            isSearchBoxShowing: false,
            newName: '',
            deskActive: false,
            loadComplete: false


        }
        this.data = [];
    }
    onscanned = (data) => {
        this.setState({
            deskActive: data
        })
        setTimeout(() => {

            this.getActiveDevices();
        }, 1500)

    }

    componentDidMount() {
        this.docid = this.props.doctorProfile.DoctorData._id;
        const self = this;
        let socket_url = isStagging ? staging.socket : prod.socket;
        this.socketConnection = io(socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050/");


        this.socketConnection.on('connect', function (data) {
            if (self.socketConnection) {
                self.socketConnection.emit("room", self.docid);
                self.socketConnection.emit("CheckActiveLogins", {
                    "DocId": self.docid
                });
                self.getActiveDevices();
            }
        });

        this.socketConnection.on('ReceiveComfirmation', function (data) {
            self.setState({
                deskActive: true
            })
        });
    }
    getActiveDevices() {
        const self = this;
        if (this.socketConnection) {
            //self.socketConnection.emit("room", val);
            this.socketConnection.emit("AskActiveDevices", {
                "DocId": this.props.doctorProfile.DoctorData._id
            });
            setTimeout(() => {
                if (this.activeDevicesData.length > 0) {
                    var dups = [];
                    var arr = this.activeDevicesData.filter(function (el) {
                        // If it is not a duplicate, return true
                        if (dups.length > 0) {
                            if (dups[0].indexOf(el[3]) == -1) {
                                dups.unshift(el);
                                return true;
                            }
                        }
                        else {
                            dups.push(el);
                            return true;
                        }

                        return false;

                    });
                    this.activeDevicesData = dups;

                }
                this.setState({
                    loadComplete: true
                })

            }, 2000);
            this.socketConnection.on('ReceiveSendActiveDevices', function (data) {
                self.Received = true;
                //  clearTimeout(self.timeoutCheck);
                self.activeDevicesData.push(data.activeData)
                // self.setState({
                //     loadComplete: true
                // })

            });
        }
        else {
            alert("No socket");
        }
    }

    logoutAllDocs() {
        const self = this;
        self.activeDevicesData = [];

        self.socketConnection.emit("LogoutAllDoc", {
            "DocId": self.props.doctorProfile.DoctorData._id
        });
        self.setState({
            loadComplete: true
        })

    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator()
        this.props.navigation.goBack(null);
        return true;
    }


    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }
    searchAction(text) {
        //alert(newData.length)
        this.setState({
            newName: text
        });

    }
    navigate = (data) => {

        //multipleTapHandler.multitap(() => this.props.navigation.navigate(data.navigation, data));
    }

    QrscanNavigate() {


        this.props.navigation.push('ScanQrCode', {
            "SockConobj": this.socketConnection, returnScanData: this.onscanned, "DocId": this.props.doctorProfile.DoctorData._id

        })
    }

    Item(data) {

        return (


            <TouchableOpacity onPress={() => { this.navigate(data) }} style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12 }}>
                <TouchableOpacity >
                    <Image source={imageData[data[0]]} style={{ height: 23, width: 23, resizeMode: 'contain', }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                    <Text style={{ fontSize: 17, color: '#000000', fontFamily: 'NotoSans', paddingStart: 8 }}>{`${_.capitalize(data[0])} on ${data[2]}`}</Text>
                </View>
                <TouchableOpacity onPress={() => this.onlineSelected()} style={{ paddingHorizontal: 10 }}>
                    <Image source={data.sec_images} style={{ height: 25, width: 25, resizeMode: 'contain', }} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#dcdcdc" />
                <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    {/* for HEADER */}<SettingsHeader
                        {...this.props}
                        bgImage={null}
                        bgColor={'white'}
                        cursorColor={"#0869d8"}
                        tintColor={"#0b69d8"}
                        description={"Print via Web Devices"}
                        titleColor={null}
                        descriptionColor={'#3D3D3D'}
                        placeholderTextColor={'black'}
                        placeTextColor={'black'}
                        placeholderTextSize={20}
                        leftImage={Black_back}
                        rightImage={null}
                        rightImageCross={null}
                        isSearchBoxShowing={null}
                        type={5}
                        leftImageOnClick={() => this.leftImageOnClick()}
                        rightImageOnClick={null}
                    />


                    <View>
                        <TouchableOpacity onPress={() => this.QrscanNavigate()} style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 11, marginVertical: 12 }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 17, color: '#0065D7', fontFamily: 'NotoSans' }}>Add New Print Device</Text>
                            </View>

                            <Image source={Blue_Plus_Icon} style={{ height: 25, width: 25, resizeMode: 'contain', paddingHorizontal: 10 }} />

                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 2, marginVertical: 5 }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 13, color: '#575757', fontFamily: 'NotoSans-Bold' }}>{this.state.deskActive ? "Connected" : "Not Connected"}</Text>
                            </View>

                        </View>

                        {this.state.deskActive ? <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#fafafa', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 2, marginVertical: 10 }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingStart: 5, }}>
                                <Text style={{ fontSize: 13, color: '#575757', fontFamily: 'NotoSans-Bold' }}>{this.activeDevicesData.length > 0 ? "Existing Printing Device(s)" : "No Active Printing Devices"}</Text>
                            </View>

                        </View> : null
                        }
                        <FlatList

                            data={this.activeDevicesData}
                            renderItem={({ item }) => this.Item(item)}
                            keyExtractor={item => item.id}
                            extraData={this.state}

                            contentContainerStyle={{ marginBottom: 60 }}
                        />

                    </View>

                </View>

                {this.activeDevicesData.length ? <TouchableOpacity onPress={() => this.logoutAllDocs()} style={{ bottom: 0, height: 55, marginBottom: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                    <Image source={imageData["logout"]} style={{ height: 23, width: 23, resizeMode: 'contain', }} />
                    <Text style={{ paddingHorizontal: 10, fontSize: 13, color: '#575757', fontFamily: 'NotoSans-Bold' }}>LOGOUT FROM ALL CONNECTED PRINTING DEVICES</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }



}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,


});

const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPrintWebDevices);
const styles = StyleSheet.create({
    view_style: {
        flexDirection: "row",
        backgroundColor: '#008be0',
        height: 60
    },
    Optometry_Record: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: 'bold',
        textAlign: 'left'
    },
    step_2_5: {
        fontSize: 12,
        color: '#ffffff'
    },
    Next: {
        height: 18,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain'

    },
    content_container: {
        flexDirection: "row",
        paddingVertical: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    content_color: {
        color: '#383838',
        fontWeight: "600",
        fontSize: 16
    },
    Next_blue: {
        height: 15,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain',

    }
});
