import React, { Component } from "react";
import { Image, TouchableOpacity, ImageBackground, Dimensions, Platform, SafeAreaView } from "react-native";
import { Content, Text, Icon, Container, View } from "native-base";
import _ from 'lodash';
import styles from "./styles";
import {

    versionAndroid, versionIOS

} from "../../../app.json";
import { newshareprofileicon, leftmenubg, backbutton, newprofileimage, supportcall, supportwhatsappcall, Profile_Image } from '../../constants/images';
const avatarImage = require("../../../assets/avatar.png");
import multipleTapHandler from '../../components/MultiTapHandle/index';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { S3BaseUrl, termsLink, aboutLink, prescripSite } from '../../../app.json'


class SideBar extends Component {
    giveFeedback() {
        return true;
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {this.props.doctorProfile.DoctorData ?
                    <View  >
                        <ImageBackground resizeMode="cover" style={[styles.drawerCover, {
                            flexDirection: 'column',
                            top: Platform.OS === 'ios' ? null : null,
                            marginBottom: Platform.OS === 'ios' ? null : null,

                            flexDirection: 'column', alignSelf: 'baseline'
                        }]}
                            source={leftmenubg} >



                            <TouchableOpacity onPress={this.props.onShare} style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 15, paddingTop: Platform.OS === 'ios' ? 40 : 25
                            }}>
                                <Image style={{
                                    resizeMode: "cover", alignSelf: 'flex-end', justifyContent: 'flex-end', width: 30, height: 25
                                }} source={newshareprofileicon} />
                                <Text style={{ textAlign: "center", color: '#fff', fontSize: 12, marginTop: 3, fontWeight: 'bold' }}>Share</Text>

                            </TouchableOpacity>

                            <View style={{ alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
                                {
                                    this.props.doctorProfile.DoctorData ? this.props.doctorProfile.DoctorData.DoctorImage == "" ?
                                        <View style={{ alignItems: 'center', justifyContent: 'space-around', width: 70, height: 70, borderRadius: 10, borderWidth: 2, borderColor: '#fff', backgroundColor: '#2ca4c1' }}>
                                            <Text uppercase={true} style={{ fontSize: 30, color: '#fff', fontFamily: 'NotoSans-Bold', alignSelf: 'center', paddingTop: 20 }}>{this.props.doctorimage_alpha}</Text>

                                        </View> :
                                        <Image
                                            source={{ uri: S3BaseUrl + "doctorimg/" + this.props.doctorProfile.DoctorData.DoctorImage }}
                                            style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                        />
                                        : <View style={{ alignItems: 'center', justifyContent: 'space-around', width: 70, height: 70, borderRadius: 10, borderWidth: 2, borderColor: '#fff', backgroundColor: '#2ca4c1' }}>
                                            <Text uppercase={true} style={{ fontSize: 30, color: '#fff', fontFamily: 'NotoSans-Bold', alignSelf: 'center' }}>{this.props.doctorimage_alpha}</Text>

                                        </View>
                                }
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ paddingTop: 2, color: '#fff', fontSize: 16, lineHeight: 16, fontWeight: 'bold' }}>Dr.</Text>
                                    <Text style={{ paddingTop: 2, color: '#fff', fontSize: 25, lineHeight: 25, fontWeight: 'bold', }}>{this.props.doctorProfile.DoctorData.DoctorFName + " " + this.props.doctorProfile.DoctorData.DoctorLName}</Text>

                                </View>


                            </View>

                            <TouchableOpacity

                                onPress={() => this.props.navigation.navigate('DoctorProfileViewContainer')}
                                style={{
                                    marginTop: 10, paddingTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#dcdcdc', flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text uppercase={true} style={{ fontFamily: 'NotoSans-Bold', fontSize: 14, color: '#fff', fontWeight: '800' }}>
                                        View & Edit profile
                                    </Text>
                                    <Text style={{ fontFamily: 'NotoSans', fontSize: 12, color: '#fff', }}>
                                        {(this.props.doctorProfile.DoctorData.DigitalConsult == 1 && this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ? "100" : "50") + "% Completed"}
                                    </Text>
                                </View>
                                <Icon as={FontAwesome} style={{ fontSize: 24, color: '#ffffff' }} name="angle-right" type="FontAwesome" />
                            </TouchableOpacity>



                        </ImageBackground>

                    </View>

                    : null}
                {this.props.doctorProfile.DoctorData ?
                    <View style={{ marginTop: 20, flex: 1 }}>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingBottom: 25,
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#ffffff"
                        }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                    Support
                                </Text>
                            </View>
                            {/* <Icon style={{ fontSize: 18, color: '#888888' }} name="ios-arrow-forward" /> */}
                            <TouchableOpacity style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={this.props.Supportcall}>
                                    <Image source={supportcall} style={{ width: 35, height: 35, resizeMode: 'contain', marginRight: 15 }} />

                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.props.Supportwhatsapp}>
                                    <Image source={supportwhatsappcall} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        {
                            this.props.doctorProfile.DoctorData.RoleId != 1 ?

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsContainer')}>
                                    <View style={{
                                        flexDirection: "row",
                                        paddingHorizontal: 15, paddingBottom: 30,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "#fff"
                                    }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                                Settings
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity> : null}

                        <TouchableOpacity onPress={() => this.props.openCme('https://sites.google.com/view/prescripcme/home')}>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: 15, paddingBottom: 30,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff"
                            }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                        CME
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.openAbout(prescripSite)}>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: 15, paddingBottom: 30,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff"
                            }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                        About
                                    </Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.onPress("Logout")}>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: 15, paddingBottom: 30,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff"
                            }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                        Logout
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View> : null}
                <View style={{ flex: 0.1 }}>

                    <TouchableOpacity onPress={() => { this.giveFeedback() }} style={[styles.footer,
                    { paddingTop: 10, paddingLeft: 5, flex: 0.5, paddingBottom: 10, flexDirection: 'row' }]}>
                        <TouchableOpacity onPress={this.props.Feedbackbtn} style={{ flex: 0.5 }}>
                            <Text style={{ fontSize: 12, color: '#212121', }}>Feedback</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 12, color: '#212121', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', flex: 0.4 }}>{"v" + (Platform.OS == "ios" ? versionIOS : versionAndroid)}</Text>
                    </TouchableOpacity></View>
            </View>

        );
    }
}

export default SideBar;
