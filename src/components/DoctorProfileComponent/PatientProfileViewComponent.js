/****** code by ravi ******/

import React, { Component } from "react";
import { Text, } from "native-base";
import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, Linking } from "react-native";
import { ic_black_back, ic_Pick_Clinic_Location, ic_Pick_Clinic_Location_BG, Orange_Blue_Icon, Clinic_Appointments_Icon, Direction_Button, Contact_Button, Edit_Blue_Icon, Online_Appointments_Icon, Degree_Icon, Second_specs_Icon, Specialization_Icon, Clinic_Address, Clinic_Contact, Clinic_Schedule, Direction_deactivated_button, Contact_deactivatedbutton } from '../../constants/images';
import { daysName } from '../../constants/commondata';
import { isEqual } from 'lodash';
import LinearGradient from 'react-native-linear-gradient'

export default class PatientProfileViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opSlots: [],

        }



    }

    getIndex(schedule, ophours) {
        let days = ophours.map((s1, i) => isEqual(s1, schedule) ? i : -1).filter(index => index !== -1)
        return days;
    }
    checkItem(check, opSlots) {
        let index;
        let isValid;
        isValid = opSlots.some(function (item, i) {
            return isEqual(check, item) ? (index = i, true) : false;
        });

        return isValid;
    }
    //Parse the time slots
    parseOpHoursJSON(ophours) {
        let opSlots = [];

        ophours.forEach((schedule, index) => {
            if (schedule.length > 0) {
                let day = this.getIndex(schedule, ophours);
                let slot = {
                    days: daysName[index],
                    slots: schedule
                };
                if (!this.checkItem(slot, opSlots)) {

                    opSlots.push(slot);
                    //renderSlots.push(slot);
                }

            }
            else {
                let slot = {
                    days: daysName[index],
                    slots: []
                }
                opSlots.push(slot);
            }


        });
        //CONVERT TO NAME
        // opSlots.forEach((op) => {
        //     op.days = op.days.map((day) => {
        //         return daysName[day];
        //     })
        // });
        let re_views = [];
        for (let i = 0; i < opSlots.length; i++) {
            if (i == 0) {
                re_views[6] = { ...opSlots[i] };

            }
            else {
                re_views[i - 1] = { ...opSlots[i] };
            }
        }
        opSlots = re_views;

        re_reviews = null;
        let views = [];
        views = opSlots.map((slot, index) => {
            let days = slot.days;//this.parseDays(slot.days)
            let timeSlots = this.parseTime(slot.slots);
            return (
                <View style={{ paddingStart: 22 }}>
                    {
                        timeSlots != "Closed" ?
                            <View>
                                <Text style={{ marginTop: 5, color: '#444444', fontSize: 14, fontFamily: "NotoSans-Bold" }}>{days}</Text>
                                <Text style={{ color: '#4c4c4c', fontSize: 12, fontFamily: "NotoSans" }}>{timeSlots}</Text>
                            </View>
                            : null}
                </View>
            );
        });
        return views;


    }
    //open contact 
    dialCall(contact) {
        let phoneNumber = contact
        //if (Platform.OS === 'android') {
        phoneNumber = `tel:${phoneNumber}`;
        //}
        Linking.openURL(phoneNumber);
    };


    ContactList = (contactList) => {
        let cons = contactList.split(',');

        return cons.map(contact => {
            return (

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderColor: '#ececec', borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: 'row', }} >
                        <Image style={{
                            resizeMode: "contain", width: 13, height: 13, marginTop: 3
                        }} source={Clinic_Contact} />
                        <View style={{ flexDirection: 'column', flex: 0.86, }}>
                            <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10, flexWrap: 'wrap' }}>{contact}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', paddingRight: 5 }} onPress={() => this.dialCall(contact)}>
                        <Image style={{
                            resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                        }} source={Contact_Button} />
                        <Text style={{ fontSize: 11, color: '#26b82d', }}>Call</Text>
                    </TouchableOpacity>
                </View>




            );
        }
        )

    }


    parseTime(slots) {
        let time = "";
        if (slots.length > 0) {
            slots.forEach((slot) => {
                time = time + slot[0] + " to " + slot[1] + "\n";
            });
        }
        else {
            time = "Closed"
        }
        return time;
    }
    parseDays(days) {
        return days.join();
    }

    renderTimeSlots(slots) {

        let views = this.parseOpHoursJSON(slots);
        return views;

    }



    openGps = (lat, lng) => {
        var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        var url = scheme + `${lat},${lng}`;
        Linking.openURL(url);

    }




    Item(data) {
        return (
            <TouchableOpacity style={{ flexDirection: 'column', flex: 1, marginTop: 5, paddingVertical: 10, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                <Text style={{ paddingTop :10, fontSize: 25, color: '#333', fontFamily: 'NotoSans-Bold' }}>{data.item.ClinicName}</Text>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    {data.item.Address ?
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderColor: '#ececec', borderBottomWidth: 1, paddingVertical: 5, }}>
                            <View style={{ flexDirection: 'row', flex: 0.9, }}>
                                <Image style={{
                                    resizeMode: "contain", width: 13, height: 13, marginBottom: 10, marginTop: 3
                                }} source={Clinic_Address} />
                                <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10, flexWrap: 'wrap' }}>{[data.item.Address + '\n' + data.item.City + ', ' + data.item.State + " " + data.item.Pincode]}</Text>
                            </View>

                        </View> : null}

                    {this.ContactList(data.item.ContactNo)}
                    {data.item.OperationHours ?
                        <View style={{ paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'baseline' }}>
                                <Image style={{

                                    resizeMode: "contain", width: 13, height: 13, alignSelf: 'center',
                                }} source={Clinic_Schedule} />
                                <Text style={{ fontSize: 14, fontFamily: 'NotoSans-Bold', color: '#000', paddingHorizontal: 10 }}>{"Operating Hours"}</Text>
                            </View>
                            <View style={{}}>
                                {this.parseOpHoursJSON(data.item.OperationHours)}
                            </View>
                        </View>
                        : null
                    }
                    {/* <View style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row',
                        width: '100%', backgroundColor: '#fff', paddingTop: 12, paddingBottom: 3
                    }}>

                        <TouchableOpacity

                            style={{ width: '100%', borderRadius: 25, backgroundColor: "#26b82d", paddingVertical: 10, justifyContent: 'center', alignItems: 'center', }} >
                            <Text uppercase={true} style={{ fontSize: 14, color: "#fff", fontFamily: 'NotoSans-Bold' }}>Book Appointment</Text>

                        </TouchableOpacity>

                    </View> */}
                    <TouchableOpacity style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row',
                        width: '100%', backgroundColor: '#fff', paddingTop: 10, paddingBottom: 5
                    }}>
                        <LinearGradient colors={["#29b62f", "#0ad214"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '100%', height: 45, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>

                            <Text uppercase={true} style={{ fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold' }}>BOOK APPOINTMENT</Text>
                        </LinearGradient>



                    </TouchableOpacity>

                </View>
            </TouchableOpacity>

        );
    }

    render() {



        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', paddingHorizontal: 15, marginTop: -5, }}>
                {this.props.doctorProfile.DoctorData.DisplayQualificationCSV ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image source={Degree_Icon} resizeMode="contain" style={{ height: 18, width: 18 }} />

                            <Text style={{ fontSize: 13, color: '#333', paddingLeft: 8 }}>{this.props.doctorProfile.DoctorData.DisplayQualificationCSV ? this.props.doctorProfile.DoctorData.DisplayQualificationCSV : "Qualification,Degrees,Experience"}</Text>
                        </View>

                    </View> : null}
                {this.props.doctorotherspecialization ?
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', }}>
                        <Image source={Second_specs_Icon} resizeMode="contain" style={{ height: 18, width: 18, alignSelf: 'flex-start', alignItems: 'center', }} />
                        <Text style={{ flex: 1, fontSize: 13, color: '#333', paddingLeft: 8, marginTop: -5 }}>{this.props.doctorotherspecialization ? this.props.doctorotherspecialization : "Other Specialization"}</Text>


                    </View> : null}


                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 5 }}>
                    <Image style={{
                        resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                    }} source={Online_Appointments_Icon} />

                    <Text style={{ fontSize: 13, color: '#820091', paddingLeft: 5, }}>Book online Appointments  </Text>
                </View>


                <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10, marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, }}>Online Consultation </Text>

                    </View>
                    <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>
                        {this.props.doctorProfile.DoctorData.ConsultFee == 0 || this.props.doctorProfile.DoctorData.ConsultFee == undefined ? "Consults conducted by either audio or video calls." : ("Consultation Fee -" + " \u20B9 " + (this.props.doctorProfile.DoctorData.ConsultFee) + " (includes audio or video calls)")}
                    </Text>

                    <TouchableOpacity style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row',
                        width: '100%', backgroundColor: '#fff', paddingTop: 10, paddingBottom: 5
                    }}>
                        <LinearGradient colors={["#830391", "#a14996"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '100%', height: 45, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>

                            <Text uppercase={true} style={{ fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold' }}>BOOK APPOINTMENT</Text>
                        </LinearGradient>



                    </TouchableOpacity>

                </View>

                {this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ?
                    <View style={{ paddingHorizontal: 8, paddingVertical: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{
                                resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                            }} source={Clinic_Appointments_Icon} />
                            <Text style={{ fontSize: 13, color: '#ed353a', paddingLeft: 5, }}>Book In Person Appointments  </Text>


                        </View>


                    </View>

                    : null}

                {this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ?
                    <FlatList
                        style={{ paddingHorizontal: 7, marginBottom: 80 }}
                        data={this.props.data}
                        renderItem={(item) => this.Item(item)}
                        //keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                    : null}

            </ScrollView>
        );
    }
}