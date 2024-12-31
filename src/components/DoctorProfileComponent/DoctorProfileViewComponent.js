/****** code by ravi ******/

import React, { Component } from "react";
import { Text, } from "native-base";
import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Linking, Platform, } from "react-native";
import { Orange_Blue_Icon, Clinic_Appointments_Icon, Direction_Button, Contact_Button, Edit_Blue_Icon, Online_Appointments_Icon, Degree_Icon, Second_specs_Icon, Specialization_Icon, Clinic_Address, Clinic_Contact, Clinic_Schedule, Direction_deactivated_button, Contact_deactivatedbutton } from '../../constants/images';
import { daysName } from '../../constants/commondata';
import { isEqual } from 'lodash';

export default class DoctorProfileViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opSlots: []

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
        //let reslots=[...opSlots];
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
            let days = slot.days//this.parseDays(slot.days)
            //let days=slot.days[0]+" - "+slot.days[slot.days.length-1];
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
    parseDays(days) {
        let isSeq = false;
        let preindex = -1;
        let currentindex = -1;
        days.forEach((day, index) => {
            currentindex = daysName.indexOf(day);
            if (index < days.length - 1) {
                if (days[index + 1] === daysName[currentindex + 1]) {
                    isSeq = true;
                }

            }


        });
        return days.length > 1 && isSeq ? days[0] + " - " + days[days.length - 1] : days.join();
        //return days.join();
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

    renderTimeSlots(slots) {

        let views = this.parseOpHoursJSON(slots);
        return views;

    }
    Item(data) {



        return (




            <View style={{
                flexDirection: 'column', flex: 1, marginTop: 5, paddingVertical: 10, alignItems: 'flex-start', justifyContent: 'flex-start',
                borderRadius: 8, backgroundColor: '#fff', borderWidth: 1,
                borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 }
            }}>
                <Text style={{ paddingTop: 15, fontSize: 25, color: '#333', fontFamily: 'NotoSans-Bold' }}>{data.item.ClinicName}</Text>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    {data.item.Address ?
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderColor: '#ececec', borderBottomWidth: 1, paddingVertical: 5, }}>
                            <View style={{ flexDirection: 'row', flex: 0.9, }}>
                                <Image style={{
                                    resizeMode: "contain", width: 13, height: 13, marginBottom: 10, marginTop: 3
                                }} source={Clinic_Address} />
                                <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10, flexWrap: 'wrap' }}>{[data.item.Address + '\n' + data.item.City + ', ' + data.item.State + " " + data.item.Pincode]}</Text>
                            </View>
                           

                        </View> : null}

                    {data.item.ContactNo ?
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderColor: '#ececec', borderBottomWidth: 1 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{
                                    resizeMode: "contain", width: 13, height: 13, marginTop: 3
                                }} source={Clinic_Contact} />
                                <View style={{ flexDirection: 'column', flex: 0.86, }}>
                                    <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10, flexWrap: 'wrap' }}>{data.item.ContactNo}</Text>
                                </View>
                            </View>
                            {/* {data.item.ContactNo ? <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center',paddingRight:5}}>
                                <Image style={{
                                    resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                                }} source={Contact_deactivatedbutton} />
                                <Text style={{ fontSize: 11, color: '#cacaca', }}>Call</Text>
                            </TouchableOpacity> : <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }}>
                                    <Image style={{
                                        resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                                    }} source={Contact_deactivatedbutton} />
                                    <Text style={{ fontSize: 11, color: '#cdcdcd', }}>Call</Text>
                                </TouchableOpacity>

                            } */}

                        </View> : null}
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

                </View>
            </View>



        );



    }




    // if add clinic setup have then show this add clinic function else show clinic
    Clinicsetup() {
        if (this.props.clinic_setup != 0) {
            return (

                <FlatList
                    style={{ paddingHorizontal: 5, marginBottom: 80 }}
                    data={this.props.data}

                    renderItem={(item) => this.Item(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />



            );

        } else {
            return (
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 2, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 7 }}>
                            <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, }}>Let's add a Clinic?  </Text>

                            <TouchableOpacity onPress={this.props.Addclinicnavigate} style={{ backgroundColor: 'rgb(239, 115, 88)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, }}>
                                <Text uppercase={true} style={{ fontSize: 13, color: '#fff', fontFamily: 'NotoSans-Bold', }}>ADD</Text>
                            </TouchableOpacity>

                        </View>
                        <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>Activate booking of appointments for patients {"\n"}via IVR and your online profile</Text>
                    </View>
                </View>
            );
        }
    }





    render() {

        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', paddingHorizontal: 13, marginTop: -5, marginBottom: 20 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image source={Degree_Icon} resizeMode="contain" style={{ height: 18, width: 18 }} />

                        <Text style={{ fontSize: 13, color: '#333', paddingLeft: 8 }}>{this.props.doctorQualification ? this.props.doctorQualification : "Qualification,Degrees,Experience"}</Text>
                    </View>




                </View>
                <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', }}>
                    <Image source={Second_specs_Icon} resizeMode="contain" style={{ height: 18, width: 18, alignSelf: 'flex-start', alignItems: 'center', }} />
                    <Text style={{ flex: 1, fontSize: 13, color: '#333', paddingLeft: 8, marginTop: -5 }}>{this.props.doctorotherspecialization ? this.props.doctorotherspecialization : "Other Specialization"}</Text>


                </View>




                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 5 }}>
                    <Image style={{
                        resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                    }} source={Online_Appointments_Icon} />

                    <Text style={{ fontSize: 13, color: '#820091', paddingLeft: 5, }}>For Online Appointments  </Text>
                </View>



                {this.props.VCsetup()}


                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{
                            resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                        }} source={Clinic_Appointments_Icon} />
                        <Text style={{ fontSize: 13, color: '#ed353a', paddingLeft: 5, }}>Clinic(s) For In Person Appointments  </Text>


                    </View>


                </View>


                {this.Clinicsetup()}

            </ScrollView>
        );
    }
}