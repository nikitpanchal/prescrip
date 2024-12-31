import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { ic_dropdown_top, ic_dropdown_bottom, ic_radio_button_unselected, ic_radio_button_selected } from '../../constants/images'
import CustomizeComponent from '../CustomizeComponents/CustomizeComponents'
import { Container } from 'native-base'
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modalbox";


export default class PersonalTab extends Component {
    constructor(props) {
        super(props)

        {
            this.state = {
                isFocused: false,
                less: false,

                firstName: '',
                lastName: '',
                mobileNo: '',
                gender: '',
                patientId: '',
                age: '',
                radioName: ["Male", "Female", "Other"],
                city: '',
                email: '',
                radioIndex: -1,
                selectedDate: null

            }

            this.onDateChange = this.onDateChange.bind(this);
        }
    }



    openCalendar() {
       
        alert("calendar")
    }



    onDateChange(date) {
        // alert(date)
        this.setState({ selectedDate: date })

    }

    radioButton() {
        var content = this.state.radioName.map((item, index) => {

            return (
                <TouchableOpacity
                    key={index.toString()}
                    style={{

                        width: '30%', borderRadius: 10,

                        flexDirection: 'row',
                        marginTop: 10, marginHorizontal: 5, borderWidth: 1,
                        borderColor: (this.state.radioIndex == -1 && item == this.props.doctorData.Gender ? "#0065d7" : (this.state.radioIndex == index ? "#0065d7" : "#858585")), paddingVertical: 8, justifyContent: 'center', alignItems: 'center',
                    }} >

                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', }} onPress={() => this.props.onDataChanges('Gender', item)}>

                            <View style={{ flexDirection: 'row', alignSelf: "center", }}>

                                <Image source={this.state.radioIndex == -1 && item == this.props.doctorData.Gender ?
                                    ic_radio_button_selected : (this.state.radioIndex == index ?
                                        ic_radio_button_selected : ic_radio_button_unselected)} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
                            </View>
                            <Text style={{ fontSize: 16, color: "#616161", paddingStart: 5 }}>{item}</Text>


                        </TouchableOpacity>


                    </View>

                </TouchableOpacity>
            )
        })
        return content

    }
    isTextValid(str) {
        return str.replace(/[~`@!#$%¥£€¢\^*+=_\()\[\]\\';,/{}|\\":<>\?]/, '');
    }
    render() {

        // const { label, ...props } = this.props;
        // const { isFocused } = this.state;
        // const labelStyle = {
        //     position: 'absolute',
        //     left: !isFocused ? 30 : 0,
        //     top: !isFocused ? 1 : -18,
        //     fontSize: !isFocused ? 20 : 10,
        //     color: !isFocused ? '#aaa' : '#616161',
        // };
        return (
            <View
                style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 0} style={{
                        flex: 1,
                        height: '100%',

                    }} >
                    <ScrollView

                        showsVerticalScrollIndicator={false} style={{ flex: 1,   width: Dimensions.get('window').width,height: '100%', backgroundColor: '#fafafa' }}>



                        <View style={{ flex: 1, marginHorizontal: 15}}>

                            {/* //first name */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                        First Name
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                        *
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 5, borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, alignItems: 'center' }}>
                                    <View style={{}}>
                                        <Text style={{ fontSize: 20, color: '#757575', fontFamily: 'NotoSans' }}>Dr. </Text>
                                    </View>
                                    <View style={{ flex: 0.9 }}>
                                        <TextInput
                                            defaultValue={this.props.doctorData.DoctorFName}
                                            maxLength={50}
                                            onChangeText={(text) => this.props.onDataChanges("DoctorFName", text)}
                                            style={{ fontSize: 20, fontFamily: 'NotoSans' }}
                                        />
                                    </View>

                                </View>
                                {this.props.errorFields.DoctorFName.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.DoctorFName}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                            </View>

                            {/* //Last name */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                        Last Name
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                        *
                                    </Text>
                                </View>
                                <View style={{ marginTop: 5, }}>
                                    <TextInput
                                        defaultValue={this.props.doctorData.DoctorLName}
                                        maxLength={50}
                                        onChangeText={(text) => this.props.onDataChanges("DoctorLName", text)}
                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                    />
                                </View>
                            </View>
                            {this.props.errorFields.DoctorLName.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.DoctorLName}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}







                            {/* //mobile Number */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                        Mobile Number
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                        *
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, marginTop: 5, alignItems: 'center' }}>
                                    <View style={{}}>
                                        <Text style={{ fontSize: 20, color: '#757575', fontFamily: 'NotoSans' }}>+91 </Text>
                                    </View>
                                    <View style={{ flex: 0.88, }}>
                                        <TextInput
                                            keyboardType={"numeric"}
                                            maxLength={10}
                                            defaultValue={this.props.doctorData.DoctorMobile}
                                            onChangeText={(text) => this.props.onDataChanges("DoctorMobile", text)}
                                            style={{ fontSize: 20, fontFamily: 'NotoSans' }}
                                        />
                                    </View>

                                </View>
                                {this.props.errorFields.Mobile.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.Mobile}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}
                            </View>


                            {/* Age textinput */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                        Age
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                        *
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>

                                    <View style={{ flex: 0.80, }}>
                                        <TextInput
                                            keyboardType={"numeric"}
                                            maxLength={3}
                                            defaultValue={this.props.doctorData.Age}
                                            onChangeText={(text) => this.props.onDataChanges("Age", text)}
                                            style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.20, }}>
                                        <Text style={{ fontSize: 20, color: '#000', alignSelf: 'flex-end', fontFamily: 'NotoSans' }}>Years </Text>
                                    </View>

                                </View>
                                {this.props.errorFields.Age.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.Age}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                            </View>
                            {/* // calendar open text */}
                            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { this.props.showDatePicker(true) }}>
                                <Text style={{ fontSize: 12, color: '#0065d7', fontFamily: 'NotoSans-Bold' }}>Select Date of Birth</Text>
                            </TouchableOpacity>

                            {/* radio group */}
                            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', }}>
                                    Gender
                                </Text>
                                <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                    *
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItem: 'center', justifyContent: 'space-between' }}>

                                {this.radioButton()}

                            </View>
                            {this.props.errorFields.Gender.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.Gender}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}


                            {/* without validation City*/}
                            <View style={{ marginTop: 20, }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                        City
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                        *
                                    </Text>
                                </View>

                                <View style={{ marginTop: 5, }}>
                                    <TextInput
                                        defaultValue={this.props.doctorData.City}
                                        onChangeText={(text) => this.props.onDataChanges("City", text)}
                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                    />
                                </View>
                            </View>
                            {this.props.errorFields.City.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.City}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}




                            {/* {!this.state.less ? <TouchableOpacity onPress={() => this.setState({ less: true })} style={{ marginTop: 20, marginBottom: 20 }}>
                                <Text style={{ fontSize: 15, color: '#0869d8', fontFamily: 'NotoSans-Bold' }}> MORE</Text>
                            </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.setState({ less: false })} style={{ marginTop: 20, marginBottom: 20 }}>
                                    <Text style={{ fontSize: 15, color: '#0869d8', fontFamily: 'NotoSans-Bold' }}> LESS</Text>
                                </TouchableOpacity>} */}

                            {/* Email Address textinput */}
                            <View>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                            Email Address
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                            *
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: 5, }}>
                                        <TextInput
                                            keyboardType={"email-address"}
                                            autoCapitalize={"none"}
                                            maxLength={40}
                                            defaultValue={this.props.doctorData.DoctorEmail}
                                            onChangeText={(text) => this.props.onDataChanges("DoctorEmail", text)}
                                            style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                        />
                                    </View>
                                    {this.props.errorFields.DoctorEmail.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.DoctorEmail}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                                </View>
                            </View>



                        </View>

                    </ScrollView >
                </KeyboardAvoidingView>
            </View>
        )
    }
}
