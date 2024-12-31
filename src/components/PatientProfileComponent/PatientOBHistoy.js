
/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image,ScrollView, FlatList, KeyboardAvoidingView} from 'react-native'
import {
    ic_dropdown_top, ic_calendar_icon, ic_dropdown_bottom, ic_calendar_icon_off, ic_calendar_icon_on,
    ic_radio_button_unselected, ic_radio_button_selected, ic_checkbox_on
} from '../../constants/images'
import Modal from 'react-native-modalbox'
import { times } from 'lodash'
var moment = require('moment');
import {Gpal} from '../../commonmethods/common';
import { Platform } from 'react-native'
export default class PatientOBHistoryTab extends Component {
    constructor(props) {

        super(props);
        this.modalBloodGroup = React.createRef();
        this.state = {
            Gpal: this.props.patientDetails.CommonDetails.Gpal?{ ...this.props.patientDetails.CommonDetails.Gpal }:JSON.parse(JSON.stringify(Gpal)),
            bleedingType: 'Select',
            MenustralPain: 'Select',
            isPregnant: this.props.patientDetails.CommonDetails.Gpal?this.props.patientDetails.CommonDetails.Gpal.Pregnant:false,
            modalType: '',
            MenustrationCycle: ["Regular", "Irregular"],
            BleedingPeriods: ["Yes", "No"],
            BleedingIntercourse: ["Yes", "No"],
            radioMenustralIndex: -1,
            radioBleedingIndex: -1,
            radioIntercourseIndex: -1,
            popupObjMenustral: {
                "type": 1,
                "header": "Menstural Pain",
                "content": [
                    "Before Menses",
                    "During Menses",
                    "Both Before & During Menses",
                    "Occassionally Painful",
                    "No Pain ",
                ]
            },
            popupObjBleeding: {
                "type": 2,
                "header": "Bleeding Type",
                "content": [
                    "Heavy",
                    "Regular",
                    "Low",
                ]
            },
        }
    }


    //onpress radio button index => Set
    setIndex(type, item, index) {

        switch (type) {
            case "MenustrationCycle":
                // this.setState({ radioMenustralIndex: index })
                this.gpalValue("MenustrationCycle", item)
                break;

            case "BleedingPeriods":
                //this.setState({ radioBleedingIndex: index })
                this.gpalValue("BleedingPeriods", item)
                break;

            case "BleedingIntercourse":
                // this.setState({ radioIntercourseIndex: index })
                this.gpalValue("BleedingIntercourse", item)
                break;

            default:
                null

        }


    }

    //assign radio button index => GET
    getIndex(type) {
        let Gpal = this.props.patientDetails.CommonDetails.Gpal ? this.props.patientDetails.CommonDetails.Gpal : ""
        switch (type) {
            case "MenustrationCycle":
                return Gpal.MenustrationCycle ? Gpal.MenustrationCycle : ""


            case "BleedingPeriods":
                return Gpal.BleedingPeriods ? Gpal.BleedingPeriods : ""

            case "BleedingIntercourse":
                return Gpal.BleedingIntercourse ? Gpal.BleedingIntercourse : ""


            default:
                null

        }
    }

    gpalValue(key, value) {

        this.state.Gpal[key] = value
        this.props.onDataChanges("Gpal", this.state.Gpal)

    }

    //set Modal value
    setValueModal(item, index) {
        if (this.state.modalType == "Bleeding") {

            this.gpalValue("BleedingType", item)
            this.modalType.close()
        } else {

            this.gpalValue("MenustralPain", item)
            this.modalType.close()
        }

    }

    BindModal(item, index) {
        return (
            <TouchableOpacity onPress={() => this.setValueModal(item, index)} style={{ alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomColor: '#616161', borderBottomWidth: 0.7 }}>
                <Text style={{ fontSize: 18 }}>{item}</Text>
            </TouchableOpacity>
        )

    }

    isPregnant() {
        this.setState({ isPregnant: !this.state.isPregnant }, () => {
            this.gpalValue("Pregnant", this.state.isPregnant)
        })
    }

    modalOpener(type) {
        if (type == "Bleeding") {
            this.setState({ modalType: type }, () => {
                this.modalType.open()
            })
        } else {
            this.setState({ modalType: type }, () => {
                this.modalType.open()
            })
        }
    }

    //render radio button
    radioButton(radioType) {

        var content = this.state[radioType].map((item, index) => {

            return (
                <TouchableOpacity onPress={() => this.setIndex(radioType, item, index)}
                    key={index.toString()}
                    style={{

                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 8,
                        marginTop: 10, marginHorizontal: 5, borderWidth: 1,
                        borderColor: (this.getIndex(radioType) == item ? "#0065d7" : "#858585"), justifyContent: 'flex-start', alignItems: 'center',
                    }} >


                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, justifyContent: 'flex-start', }}  >

                        <View style={{ flexDirection: 'row', alignSelf: "center", }}>

                            <Image source={this.getIndex(radioType) == item ?
                                ic_radio_button_selected : ic_radio_button_unselected} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
                        </View>
                        <Text style={{ fontSize: 16, color: "#616161", marginStart: 5 }}>{item}</Text>


                    </View>




                </TouchableOpacity>
            )
        })
        return content

    }

    render() {
        let Gpal = this.props.patientDetails.CommonDetails.Gpal ? this.props.patientDetails.CommonDetails.Gpal : Gpal

        return (
            <View style={{ flex: 1 }}>
                       <KeyboardAvoidingView 
                  behavior={Platform.OS === "ios" ? "padding" : null}
                  keyboardVerticalOffset={(Platform.isPad?0: (Platform.OS === "ios" ? 65 : 0))}
                style={{
                    flex: 1, flexDirection: 'column',
                    justifyContent: 'center',
                }} >
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    {/* gravida and para */}
                    <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 15 }}>
                        {/* gravida  */}
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Gravida
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={3}
                                autoCorrect={false}
                                defaultValue={Gpal.Gravida}
                                onChangeText={(text) => this.gpalValue("Gravida", text)}
                                style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, paddingBottom: 0 }}                            />
                        </View>
                        {/* para  */}
                        <View style={{ flex: 0.5, marginLeft: 20, }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Para
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={3}
                                autoCorrect={false}
                                defaultValue={Gpal.Para}
                                onChangeText={(text) => this.gpalValue("Para", text)}
                                style={{
                                    fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8',
                                    borderBottomWidth: 0.7, paddingBottom: 0
                                }}
                            />
                        </View>

                    </View>
                    {/* Abortus and living */}
                    <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 15 }}>
                        {/* Abortus */}
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Abortus
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={3}
                                autoCorrect={false}
                                defaultValue={Gpal.Abortus}
                                onChangeText={(text) => this.gpalValue("Abortus", text)}
                                style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, paddingBottom: 0 }}
                            />
                        </View>
                        {/* Abortus */}
                        <View style={{ flex: 0.5, marginLeft: 20, }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Living
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={3}
                                autoCorrect={false}
                                defaultValue={Gpal.Living}
                                onChangeText={(text) => this.gpalValue("Living", text)}
                                style={{
                                    fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8',
                                    borderBottomWidth: 0.7, paddingBottom: 0
                                }}
                            />
                        </View>

                    </View>
                    {/* Surgery */}
                    <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Surgery
                           </Text>
                            <TextInput
                                defaultValue={Gpal.Surgery}
                                autoCorrect={false}
                                onChangeText={(text) => this.gpalValue("Surgery", text)}
                                style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, paddingBottom: 0 }}
                            />
                        </View>


                    </View>
                    {/* Menarch age */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginTop: 20, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                            *Menarch
                           </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.85 }}>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        maxLength={3}
                                        autoCorrect={false}
                                        defaultValue={Gpal.Menarch}
                                        onChangeText={(text) => this.gpalValue("Menarch", text)}
                                        style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7,paddingBottom:0 }}
                                    />
                                </View>
                                <View style={{ flex: 0.15 ,alignItems:'center',justifyContent:'center',}}>
                                    <Text style={{ fontSize: 16, color: '#616161', fontFamily: 'NotoSans',}}>

                                        Years
                           </Text>
                                </View>

                            </View>

                        </View>


                    </View>
                    {/* Menarch Cycle */}
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                            Menustral Cycle
                           </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItem: 'center', justifyContent: 'flex-start', marginHorizontal: 12, }}>

                        {this.radioButton("MenustrationCycle")}

                    </View>

                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Menustral Pain
                           </Text>
                            <TouchableOpacity onPress={() => this.modalOpener("menustral")} style={{ flexDirection: 'row', borderBottomColor: '#c8c8c8', alignItems: 'center', borderBottomWidth: 0.7, }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'NotoSans', }}
                                    >{Gpal.MenustralPain ? Gpal.MenustralPain : "Select"}</Text>
                                </View>
                                <View style={{ flex: 0.1,alignItems:'flex-end' }}>
                                    <Image source={ic_dropdown_bottom} style={{ resizeMode: 'contain', height: 12,width:12 }} />

                                </View>

                            </TouchableOpacity>

                        </View>


                    </View>
                    {/* Duration of bleeding*/}
                    <View style={{ flexDirection: 'row', marginHorizontal: 12, marginTop: 20, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Duration of Bleeding
                           </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.85 }}>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        maxLength={3}
                                        autoCorrect={false}
                                        defaultValue={Gpal.BleedingDuration}
                                        onChangeText={(text) => this.gpalValue("BleedingDuration", text)}
                                        style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7,paddingBottom:0 }}
                                    />
                                </View>
                                <View style={{ flex: 0.15,alignItems:'center',justifyContent:'center', }}>
                                    <Text style={{ fontSize: 14, color: '#616161', fontFamily: 'NotoSans', }}>
                                        Days
                           </Text>
                                </View>

                            </View>

                        </View>


                    </View>
                    {/* Type of bleeding*/}
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Bleeding Type
                           </Text>
                            <TouchableOpacity onPress={() => this.modalOpener('Bleeding')} style={{ flexDirection: 'row', borderBottomColor: '#c8c8c8', alignItems: 'center', borderBottomWidth: 0.7, }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'NotoSans', }}
                                    >{Gpal.BleedingType ? Gpal.BleedingType : "Select"}</Text>
                                </View>
                                <View style={{ flex: 0.1 ,alignItems:'flex-end'}}>
                                    <Image source={ic_dropdown_bottom} style={{ resizeMode: 'contain', height: 12,width:12 }} />

                                </View>

                            </TouchableOpacity>

                        </View>


                    </View>

                    {/*  bleeding periods*/}
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                            Bleeding/Spotting between Periods
                           </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItem: 'center', justifyContent: 'flex-start', marginHorizontal: 12, }}>

                        {this.radioButton("BleedingPeriods")}

                    </View>


                    {/*  bleeding intercourse*/}
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                            Bleeding/Spotting after Intercourse
                           </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItem: 'center', justifyContent: 'flex-start', marginHorizontal: 12, }}>

                        {this.radioButton("BleedingIntercourse")}

                    </View>


                    {/*  LMP */}
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                LMP
                           </Text>
                            <TouchableOpacity onPress={() => this.props.showDatePicker(true, "LMP")} style={{ flexDirection: 'row', borderBottomColor: '#c8c8c8', alignItems: 'center', borderBottomWidth: 0.7, }}>
                                <View style={{ flex: 0.85 }}>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        editable={false}
                                        autoCorrect={false}
                                        value={Gpal.LMP != "" ? moment(Gpal.LMP).format('DD-MM-YYYY') : "Select"}
                                        defaultValue={"Select"}
                                        style={{ fontSize: 20, fontFamily: 'NotoSans', color: '#000',paddingBottom:0 }}
                                    />
                                </View>
                                <View style={{ flex: 0.18,alignItems:'flex-end'}}>
                                    <Image source={ic_calendar_icon} style={{ resizeMode: 'contain', height: 20,width:20 }} />
                                </View>

                            </TouchableOpacity>

                        </View>


                    </View>
                    {/* // Preganant */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => this.isPregnant()} style={{ flex: 0.15 }}>
                            <Image source={!this.state.isPregnant ? ic_calendar_icon_off : ic_checkbox_on} style={{ resizeMode: 'contain', height: 20 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.85 }}>
                            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'NotoSans', }}>
                                Preganant
                           </Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, marginBottom: 20, }}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Gestational Age
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                maxLength={3}
                                autoCorrect={false}
                                defaultValue={Gpal.GestationalAge}
                                onChangeText={(text) => this.gpalValue("GestationalAge", text)}
                                style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7,paddingBottom:0 }}
                            />
                        </View>
                        <View style={{ flex: 0.5, marginLeft: 20, }}>
                            <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                Estimated date of delivery
                           </Text>
                            <TextInput
                                keyboardType={"numeric"}
                                editable={false}
                                autoCorrect={false}
                                defaultValue={Gpal.EDD? moment(Gpal.EDD).format('DD-MM-YYYY') : ""}
                                style={{
                                    fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8',
                                    borderBottomWidth: 0.7, color: '#000',paddingBottom:0 
                                }}
                            />
                        </View>

                    </View>
                    {/* <Modal
                        useNativeDriver={true}
                        animationDuration={200}
                        style={{ borderWidth: 0, width: '80%', borderRadius: 10, height: 500, overflow: 'hidden', justifyContent: 'center' }}
                        ref={"modalType"}
                        swipeToClose={false}
                        position={"center"}
                        //swipeToClose={this.state.swipeToClose}
                        onClosed={() => { this.close }}
                        onOpened={this.onOpen}
                        onClosingState={this.onClosingState}>
                        <View style={{ flex: 1 }}>
                            <View style={{
                                borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, },
                                shadowColor: '#dcdcdc', flexDirection: 'row',
                                shadowOpacity: 2, borderBottomWidth: 2, paddingVertical: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center', alignItems: 'center'
                            }}><Text>fegfeg</Text></View>
                                <View style={{ flex: 0.9 }}>
                                 {this.BleedingType()}

                                </View>

                            </View>


                    </Modal> */}
                </ScrollView>

                <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{
                        borderWidth: 0, width: '70%', borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20, borderTopRightRadius: 20, height: (this.state.modalType == "Bleeding" ? '40%' : '60%'), overflow: 'hidden',
                    }}
                    ref={(ref) => this.modalType = ref}
                     
                    swipeToClose={false}
                    position={"center"}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={() => { this.close }}
                    onOpened={this.open}
                    onClosingState={this.onClosingState}>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#616161', borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 20, color: '#616161', fontFamily: 'NotoSans' }}>{this.state.modalType == "Bleeding" ? this.state.popupObjBleeding.header : this.state.popupObjMenustral.header}</Text>
                        </View>
                        <View style={{ flex: 0.85 }}>
                            <FlatList
                                data={this.state.modalType == "Bleeding" ? this.state.popupObjBleeding.content : this.state.popupObjMenustral.content}
                                ItemSeparatorComponent={this.renderSeperator}
                                renderItem={({ item, index }) => this.BindModal(item, index)}
                                keyExtractor={(item, i) => i.toString()}
                            />
                        </View>
                    </View>


                </Modal>
                </KeyboardAvoidingView>
            </View>
        )
    }
}