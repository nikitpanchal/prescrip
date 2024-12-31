/****** code by ravi ******/
import React from 'react';
import { Text, } from "native-base";
import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator,Alert } from "react-native";
import { ic_delete_time, Orange_Blue_Icon, Clinic_Appointments_Icon, Clinic_Address, Clinic_Contact, Clinic_Schedule, Direction_Button, Contact_Button, Edit_Blue_Icon, Online_Appointments_Icon, Degree_Icon, Second_specs_Icon, Specialization_Icon, Purple_Blue_Icon } from '../../constants/images';
import { daysName } from '../../constants/commondata';
import { isEqual } from 'lodash';
import multipleTapHandler from '../../components/MultiTapHandle/index';

export default class PracticeComponent extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            quali_text: '',
            qualification: '',
            opSlots: [],
            isloading: false,
            delIndex: 0

        };
    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()
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

        let views = [];
        views = opSlots.map((slot, index) => {
            let days = slot.days;//this.parseDays(slot.days)
            let timeSlots = this.parseTime(slot.slots);
            return (
                <View style={{ paddingStart: 22 }}>
                {
                    timeSlots!="Closed"?
                    <View>
                    <Text style={{ marginTop: 5, color: '#444444', fontSize: 14, fontFamily: "NotoSans-Bold" }}>{days}</Text>
                    <Text style={{ color: '#4c4c4c', fontSize: 12, fontFamily: "NotoSans" }}>{timeSlots}</Text>
                </View>
                :null}
                </View>
            );
        });
        return views;


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

    renderTimeSlots(slots) {

        let views = this.parseOpHoursJSON(slots);
        return views;

    }




    setClinic(clinic) {
        this.props.setClinicDetails(clinic);
        this.props.navigation.navigate('AppointmentContainer');

    }
    deleteClinic(item, index) {
        this.setState({
            isloading: true,
            delIndex: index
        })

        let isUpdate = 0;
        let clinics = this.props.data.filter(clinic => {
            if (clinic != item) {
                return clinic;
            }
        });
        let id = this.props.doctorProfile.DoctorData._id;
        let docData = { ...this.props.doctorProfile.DoctorData };
        if (!item.Latitude || !item.Longitude) {
            item["Latitude"] = 0;
            item["Longitude"] = 0;
        }
        if (!item.OperationHours) {
            item["OperationHours"] = [];
        }
        let clinicDetails = {
            clinicId: item.ClinicId,
            clinicAddresses: item,
            action: isUpdate,
            doctorId: id,
            fromSettings : 0,
        }
       
        this.props.addClinicAddresses(clinicDetails).then(response => {
            if (response.payload.data.status == 1) {
                docData.ClinicAddresses = clinics;
                this.setState({
                    isloading: false,
                    delIndex: 0,
                })
                this.props.setDoctorData(docData);
                this.forceUpdate();
            }
            else {
                Alert.alert("Prescrip",response.payload.data.msg)

                this.setState({
                    isloading: false,
                    delIndex: 0
                })
            }

        });


    }
    Item(data) {
        return (
            <TouchableOpacity style={{ flexDirection: 'column', flex: 1, marginTop: 5, paddingVertical: 10, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={{ fontSize: 25, color: '#333', fontFamily: 'NotoSans-Bold', flex: 1, paddingTop: 15 }}>{data.item.ClinicName}</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { multipleTapHandler.multitap(() => this.setClinic(data.item), "AppointmentContainer") }}>
                            <Image source={Orange_Blue_Icon} style={{ height: 14, width: 14, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        {this.state.isloading && this.state.delIndex == data.index ? <ActivityIndicator size="small" color="#0869D8" /> :
                            <TouchableOpacity onPress={() => this.deleteClinic(data.item, data.index)}>
                                <Image source={ic_delete_time} style={{ height: 19, width: 19, resizeMode: 'contain' }} />

                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', paddingTop: 5 }}>
                    {data.item.Address ?
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderColor: '#ececec', borderBottomWidth: 1, paddingVertical: 5, }}>
                            <View style={{ flexDirection: 'row', flex: 0.9, paddingTop: 3, paddingBottom: 8 }}>
                                <Image style={{
                                    resizeMode: "contain", width: 13, height: 13, marginBottom: 10, marginTop: 3,
                                }} source={Clinic_Address} />
                                <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10, flexWrap: 'wrap' }}>{[data.item.Address + '\n' + data.item.City + ' , ' + data.item.State + ":" + data.item.Pincode]}</Text>
                            </View>

                        </View> : null}
                    {data.item.ContactNo ?
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderColor: '#ececec', borderBottomWidth: 1, }}>
                            <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                <Image style={{
                                    resizeMode: "contain", width: 13, height: 13, marginTop: 3
                                }} source={Clinic_Contact} />
                                <View style={{ flexDirection: 'column', flex: 0.9, }}>
                                    <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10, flexWrap: 'wrap', }}>{data.item.ContactNo}</Text>
                                </View>
                            </View>

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
            </TouchableOpacity>
        );
    }
    // if  edit add clinic setup have then show edit add clinic view else show add clinic setup

    EditClinicsetup() {
        if (this.props.data.length != 0) {
            return (
                <TouchableOpacity style={{ paddingTop: 30 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{
                                resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                            }} source={Clinic_Appointments_Icon} />
                            <Text style={{ fontSize: 13, color: '#ed353a', paddingLeft: 5, }}>Clinic(s) For In Person Appointments  </Text>
                        </View>
                        <TouchableOpacity onPress={this.props.Addclinicnavigate} style={{ borderColor: '#0065d7', borderRadius: 12, borderWidth: 1 }}>
                            <Text uppercase={true} style={{ fontSize: 12, color: '#0065d7', paddingHorizontal: 12, fontFamily: 'NotoSans-Bold', }}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ paddingHorizontal: 5, marginBottom: 10 }}
                        data={this.props.data}
                        renderItem={(item) => this.Item(item)}
                        //keyExtractor={item => item.id.toString()}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                    />

                </TouchableOpacity>
            );

        } else {
            return (
                <View style={{ paddingTop: 30, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Image style={{
                            resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                        }} source={Clinic_Appointments_Icon} />
                        <Text style={{ fontSize: 13, color: '#ed353a', paddingLeft: 5, }}>Clinic(s) For In Person Appointments  </Text>
                    </View>
                    <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
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
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', paddingHorizontal: 13, marginTop: -5, flex: 1, marginBottom: 25, paddingTop: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 5 }}>
                    <Image style={{
                        resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                    }} source={Online_Appointments_Icon} />

                    <Text style={{ fontSize: 13, color: '#820091', paddingLeft: 5, fontFamily: "NotoSans" }}>For online Appointments  </Text>
                </View>
                {this.props.EditVCsetup()}

                {this.EditClinicsetup()}


            </ScrollView>

        );
    }
}
