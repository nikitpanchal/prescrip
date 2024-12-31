import React, { Component } from "react";
import { Image, TouchableOpacity, Linking, Share, ImageBackground } from "react-native";
import { Content, Text, List, Left, ListItem, Thumbnail, Body, Icon, Container, View, Button, Accordion, Item, Label, Input } from "native-base";
import * as app from '../../../app.json'
import _ from "lodash";
import styles from "../VCSidebar/styles";
import Modal from 'react-native-modalbox';
 
import { newshareprofileicon, leftmenubg, backbutton, newprofileimage, supportcall, supportwhatsappcall } from '../../constants/images';
import Ionicons from 'react-native-vector-icons/Ionicons'
class VCSideBar extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <View style={styles.container}>

                <Modal useNativeDriver={true}
                    animationDuration={200}
                    style={{ borderWidth: 0, width: '80%', height: 180, overflow: 'hidden', justifyContent: 'center' }}
                    ref={"modal2"}
                    position={"center"}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View style={{ padding: 15, paddingBottom: 0, justifyContent: 'center' }}>
                                <Text style={{ color: '#212121', fontSize: 20 }}>Confirmation</Text>
                            </View>
                            <View style={{ padding: 15, justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ color: '#212121', fontSize: 14, textAlign: 'left' }}>Are you sure you want to go back, going back will discard all Changes?</Text>
                            </View>

                        </View>

                    </View>
                </Modal>

                <ImageBackground style={[styles.drawerCover, { flexDirection: 'column', width: '100%', height: 100, }]}
                    source={leftmenubg} >
                    <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 15, paddingTop: 10 }}>
                        <Image style={{
                            resizeMode: "cover", alignSelf: 'flex-end', justifyContent: 'flex-end', width: 25, height: 25
                        }} source={newshareprofileicon} />
                        <Text style={{ textAlign: "center", color: '#fff', fontSize: 12, marginTop: 3, fontWeight: 'bold' }}>Share</Text>

                    </TouchableOpacity>
                    <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, }}>
                        <View style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image style={{
                                resizeMode: "cover", width: 80, height: 80, borderRadius: 10, borderWidth: 2, borderColor: '#fff',
                            }} source={newprofileimage} />
                        </View>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 10, alignItems: 'flex-start' }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Dr. </Text>
                            <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>Ravivishwakarma</Text>
                            <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>Vishwakarmaversma</Text>
                        </View>


                    </View>

                    <TouchableOpacity style={{
                        marginTop: 10, paddingTop: 8, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#dcdcdc', flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text uppercase={true} style={{ fontSize: 14, color: '#fff', fontWeight: '800' }}>
                                view & edit profile
                            </Text>
                            <Text style={{ fontSize: 10, color: '#fff', }}>
                                100% Completed
                            </Text>
                        </View>
                        <Icon as={Ionicons} style={{ fontSize: 18, color: '#fff' }} name="ios-arrow-forward" />
                    </TouchableOpacity>



                </ImageBackground>




                <Content bounces={false} >

                    <TouchableOpacity>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingVertical: 12,
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
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={supportcall} style={{ width: 35, height: 35, resizeMode: 'cover', marginRight: 15 }} />
                                <Image source={supportwhatsappcall} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingVertical: 12,
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
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingVertical: 12,
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#fff"
                        }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#3b3b3b' }}>
                                    Referrals
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingVertical: 12,
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
                    <TouchableOpacity>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15, paddingVertical: 15,
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


                </Content>
                <TouchableOpacity onPress={() => { this.redirectpS() }} style={[styles.footer, { height: null, paddingTop: 10, paddingLeft: 5, paddingBottom: 10, flexDirection: 'row' }]}>
                    <Text style={{ fontSize: 12, color: '#212121', flex: 0.7 }}>Feedback</Text>
                    <Text style={{ fontSize: 12, color: '#212121', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right', flex: 0.2 }}>v3.269</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default VCSideBar;