/****** code by ravi ******/

import React, { Component } from "react";
import { Text, } from "native-base";
import { View, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { For_Clinic_Appointments, Clinic_Address, Clinic_Contact, Clinic_Schedule, Direction_Button, Contact_Button } from '../../constants/images';


export default class PatientClinicAPComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.data = [
            {
                id: '1',
                name: 'Khurana Clinic',
                address: '116-A Techno Park,GhatKopar(E),Mumbai-400 086',
                phonenumber: '022 2315 3964 - 2564',
                MobileNumber: '+91 9769835624',
                day: 'Thursday - Saturday',
                Time: 'Morning: 10:00 am to 02:30 pm '
            },
            {
                id: '2',
                name: 'Mahesh Clinic',
                address: '116-A Techno Park,GhatKopar(E),Mumbai-400 086',
                phonenumber: '022 2315 3964 - 2564',
                MobileNumber: '+91 9769835624',
                day: 'Thursday',
                Time: 'Morning: 10:00 am to 02:30 pm '
            },
            {
                id: '3',
                name: 'Kiran Clinic',
                address: '116-A Techno Park,GhatKopar(E),Mumbai-400 086',
                phonenumber: '022 2315 3964 - 2564',
                MobileNumber: '+91 9769835624',
                day: 'Thursday',
                Time: 'Morning: 10:00 am to 02:30 pm '
            },

        ]

    }

componentDidMount()
{
    multipleTapHandler.clearNavigator()
}

    Item(data) {
        return (
            <TouchableOpacity onPress={() => { this.navigate(data) }} style={{ flexDirection: 'column', flex: 1, marginTop: 5, paddingVertical: 10, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#d9d9d9", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                <Text style={{ fontSize: 18, color: '#333', fontFamily: 'NotoSans-Bold' }}>{data.name}</Text>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View style={{ flexWrap: 'wrap',  flex: 1, justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderColor: '#ececec', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Address} />
                        </View>
                        <View style={{  flex:1,}}>
                            <Text numberOfLines={2}  style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10, flexWrap: 'wrap', }}>{data.address}</Text>

                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={{
                                resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                            }} source={Direction_Button} />
                            <Text style={{ fontSize: 9, color: '#26b82d', fontFamily: 'NotoSans-Bold' }}>Direction</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderColor: '#ececec', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Contact} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>{data.phonenumber}</Text>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>{data.MobileNumber}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={{
                                resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                            }} source={Contact_Button} />
                            <Text style={{ fontSize: 9, color: '#26b82d', fontFamily: 'NotoSans-Bold' }}>Call</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Schedule} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>{data.day}</Text>
                                <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10 }}>{data.Time}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row',
                        width: '100%', backgroundColor: '#fff', paddingTop: 10, paddingBottom: 5
                    }}>

                        <TouchableOpacity
                            onPress={() => { this.props.onBookAppointmentClick() }}
                            style={{ width: '100%', borderRadius: 25, backgroundColor: "#26b82d", paddingVertical: 8, justifyContent: 'center', alignItems: 'center', }} >
                            <Text uppercase={true} style={{ fontSize: 14, color: "#fff", fontFamily: 'NotoSans-Bold' }}>BOOK APPOINTMENT</Text>

                        </TouchableOpacity>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        return (

            // <View style={{ flexDirection: 'column', position: 'relative', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 10, backgroundColor: '#fafafa', paddingHorizontal: 15, }}>

            //             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', paddingTop: 10 }}>
            //                 <Image style={{
            //                     resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
            //                 }} source={For_Clinic_Appointments} />

            //                 <Text style={{ fontSize: 14, color: '#ed353a', paddingLeft: 5, }}>Book In Person Appointments  </Text>
            //             </View>

            <FlatList
                style={{ paddingHorizontal: 15 }}
                data={this.data}
                renderItem={({ item }) => this.Item(item)}
                //keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />











        );
    }
}