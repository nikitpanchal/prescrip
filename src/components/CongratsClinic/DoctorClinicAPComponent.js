/****** code by ravi ******/

import React, { Component } from "react";
import { Text,  } from "native-base";
import { View, Image, ScrollView, TouchableOpacity, FlatList} from "react-native";
import { For_Clinic_Appointments,Clinic_Address ,Clinic_Contact,Clinic_Schedule,Direction_deactivated_button,Contact_deactivatedbutton} from '../../constants/images';


export default class DoctorClinicAPComponent extends Component {
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
   


    Item(data) {
        return (
  
            <TouchableOpacity onPress={() => { this.navigate(data) }} style={{ flexDirection: 'column', flex: 1, marginTop: 5, paddingVertical: 10, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                <Text style={{ fontSize: 18, color: '#333', fontFamily: 'NotoSans-Bold' }}>{data.name}</Text>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center',  borderColor: '#ececec', borderBottomWidth: 1 , paddingVertical: 5,}}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Address} />
                            <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10 }}>116-A Techno Park,GhatKopar(E),{"\n"}Mumbai-400 086</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={{
                                resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                            }} source={Direction_deactivated_button} />
                            <Text style={{ fontSize: 11, color: '#cacaca', }}>Direction</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderColor: '#ececec', borderBottomWidth: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Contact} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>022 2315 3964 - 2564</Text>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>+91 9769835624</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={{
                                resizeMode: "contain", width: 35, height: 35, alignSelf: 'center'
                            }} source={Contact_deactivatedbutton} />
                            <Text style={{ fontSize: 11, color: '#cacaca', }}>Call</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{
                                resizeMode: "contain", width: 13, height: 13, alignSelf: 'center', marginBottom: 10
                            }} source={Clinic_Schedule} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 13, color: '#000', paddingHorizontal: 10 }}>Thursday - Saturday</Text>
                                <Text style={{ fontSize: 13, color: '#676767', paddingHorizontal: 10 }}>Morning: 10:00 am to 02:30 pm</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
         
        );
    }

    render() {
        return (
           

                    <FlatList
                        style={{marginBottom:60,paddingHorizontal:15}}
                        data={this.data}
                        renderItem={({ item }) => this.Item(item)}
                        //keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                       
                    />
           








        );
    }
}