/* Developed by Ruban on 8/10/20 */
import React, { Component } from 'react'
import {
    View, Text, TextInput, SafeAreaView, Platform, Dimensions,
    KeyboardAvoidingView, Image, ScrollView, TouchableOpacity, FlatList, Keyboard, Alert
} from 'react-native'
import { ic_dropdown_top, ic_dropdown_bottom, ic_radio_button_unselected, ic_radio_button_selected } from '../../constants/images'
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base'
import Modal from "react-native-modalbox";
import { calculateAge } from '../../commonmethods/common';

export default class PatientPersonalTab extends Component {
    constructor(props) {
        super(props);
        this.modalBloodGroup = React.createRef();
        this.state = {
            bloodModal: false,
            isFocused: false,
            less: false,
            inputAge: false,
            firstName: '',
            lastName: '',
            mobileNo: '',
            gender: '',
            patientId: '',
            age: '',
            address1: '',
            Gpal: {
                "Gravida": "",
                "Para": "",
                "Abortus": "",
                "Living": "",
                "Surgery": "",
                "Menarch": "",
                "MenustrationCycle": "",
                "Duration": "",
                "BleedingDuration": "",
                "BleedingType": "",
                "BleedingPeriods": "",
                "BleedingIntercourse": "",
                "MenustralPain": "",
                "LMP": "",
                "Pregnant": false,
                "GestationalAge": "",
                "EDD": ""
            },
            address2: '',
            radioName: ["Male", "Female", "Other"],
            city: '',
            email: '',
            radioIndex: -1,
            selectedDate: null,
            bloodGroup: 'Select Blood Group',
            yearGroup: "Years",
            bmiResult: null,
            height: .0,
            weight: .0,
            bmi: .0,
            popupObj: {
                "type": 1,
                "header": "Select Blood Group",
                "content": [
                    "O+",
                    "A+",
                    "B+",
                    "AB+",
                    "A-",
                    "O-",
                    "B-",
                    "AB-"
                ]
            },
            popupObjDate: {
                "type": 1,
                "header": "Select Year",
                "content": [
                    "Years",
                    "Months",
                    "Days"
                ]
            },

        }
    }

    //set Address
    setAddress(text, type) {
        if (type == 1) {
            this.setState({ address1: text }, () => this.setFullAddress())
        } else if (type == 2) {
            this.setState({ address2: text }, () => this.setFullAddress())
        }
    }

    //set full address
    setFullAddress() {
        let Address = (this.state.address1.length > 0 ? this.state.address1 : " ") + (this.state.address2.length > 0 ? +"\n" + this.state.address2 : " ")
        this.props.onDataChanges("Address", Address)
    }

    //Bmi calculator
    getBmi(type, data) {
        let patientData = this.props.patientDetails;

        let result = parseFloat(data)
        let weightresult = data
        if (type == "Height") {
            this.props.onDataChanges(type, result.toString())
        } else if (type == "Weight") {
            this.props.onDataChanges(type, weightresult)
        }
        if (patientData.CommonDetails.BodyDetails.Height > 0 && patientData.CommonDetails.BodyDetails.Weight > 0) {
            let bmi = (patientData.CommonDetails.BodyDetails.Weight / patientData.CommonDetails.BodyDetails.Height / patientData.CommonDetails.BodyDetails.Height) * 10000;
            this.props.onDataChanges("BMI", bmi.toFixed(3).toString())

            if (bmi >= 18.5 && bmi <= 24.9) {
                this.setState({ bmiResult: 'Normal' })
            } else if (bmi < 18.5) {
                this.setState({ bmiResult: 'Underweight' })
            } else if (bmi >= 25.0 && bmi <= 29.9) {
                this.setState({ bmiResult: 'Overweight' })
            } else if (bmi >= 30.0 && bmi <= 34.9) {
                this.setState({ bmiResult: 'Obesity' })
            } else if (bmi >= 35.0 && bmi <= 39.9) {
                this.setState({ bmiResult: 'Obesity' })
            } else if (bmi > 40) {
                this.setState({ bmiResult: 'Obesity' })
            } else {
                this.setState({ bmiResult: '' })
            }
        } else {
            this.props.onDataChanges("BMI", 0)
        }
    }

    //get and set gender
    getGender(index, item) {
        this.setState({ radioIndex: index }, () => {
            this.props.updatePatientOBHistory(item)
            if (item == "Female") {
                this.props.onDataChanges("Gpal", this.state.Gpal)
                this.props.onDataChanges("Gender", item)
            } else {
                this.props.onDataChanges("Gpal", null)
                this.props.onDataChanges("Gender", item)
            }
        })
        Keyboard.dismiss();
    }

    //set blood group
    setBloodGroup(item, index) {
        this.props.onDataChanges("BloodGroup", item)
        this.modalBloodGroup.close()
    }


    //Modal Bind Blood group 
    BindBloodGroup(item, index) {
        return (

            <TouchableOpacity onPress={() => this.setBloodGroup(item, index)} style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontFamily: 'NotoSans', color: '#000' }}>{item}</Text>
            </TouchableOpacity>
        )

    }//

    // Modal Bind years days and months
    BindYearGroup(item, index) {
        return (

            <TouchableOpacity onPress={() => this.setState({ yearGroup: item, inputAge: true }, () => {
                this.modalYearGroup.close();

                this.props.setAgeUnit(item);
            })} style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontFamily: 'NotoSans', color: '#000' }}>{item}</Text>
            </TouchableOpacity>
        )

    }
    // seperate flatlist item
    renderSeperator() {
        return (
            <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
        )
    }

    componentDidMount() {
        if (this.props.patientDetails.CommonDetails.BodyDetails.Height && this.props.patientDetails.CommonDetails.BodyDetails.Weight) {
            this.getBmi("Height", this.props.patientDetails.CommonDetails.BodyDetails.Height)
            this.getBmi("Weight", this.props.patientDetails.CommonDetails.BodyDetails.Weight)
        }
        let address = this.props.patientDetails.CommonDetails.Address.split(/\r?\n/)
        this.setState({ address1: address[0] ? address[0] : "" })
        this.setState({ address2: address[1] ? address[1] : "" })

    }

    // render Gender radio button 
    radioButton() {
        let patientData = this.props.patientDetails;

        var content = this.state.radioName.map((item, index) => {
            return (
                <TouchableOpacity onPress={() => this.getGender(index, item)}

                    style={{

                        width: '30%', borderRadius: 10,
                        flexDirection: 'row',
                        marginTop: 10, marginHorizontal: 5, borderWidth: 1,
                        borderColor: (this.state.radioIndex == index ? "#0065d7" : "#858585"), paddingVertical: 8, justifyContent: 'center', alignItems: 'center',
                    }} >

                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', }} >

                            <View style={{ flexDirection: 'row', alignSelf: "center", }}>

                                <Image source={this.state.radioIndex == index || item == patientData.CommonDetails.Gender ?
                                    ic_radio_button_selected : ic_radio_button_unselected} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
                            </View>
                            <Text style={{ fontSize: 16, color: "#616161", paddingStart: 5 }}>{item}</Text>


                        </View>


                    </View>

                </TouchableOpacity>
            )
        })
        return content


    }



    render() {
        let Dim = Dimensions.get('screen')
        let patientData = this.props.patientDetails;
        let ageObj = this.props.patientDetails.CommonDetails.DOB ? calculateAge(this.props.patientDetails.CommonDetails.DOB, true) : { value: "", units: "Years" };

        return (
            
                <View style={{
                    flex: 1,
                    width: Dimensions.get('window').width ,paddingBottom:20
                }}>
                   
                        <ScrollView

                            showsVerticalScrollIndicator={false} style={{ flex: 1 }}   
                              automaticallyAdjustKeyboardInsets= {true} keyboardShouldPersistTaps="handled" 
                              keyboardDismissMode={Platform.isPad ? "none" : "on-drag"}>
                            <View style={{ flex: 1, marginHorizontal: 15, }}>
                                <View style={{ paddingTop: 15 }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1 }}>
                                        <View style={{ flex: 0.2, paddingRight: 5 }}>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Code
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                                    *
                                                </Text>
                                            </View>
                                            <TextInput
                                                keyboardType={"phone-pad"}
                                                maxLength={4}

                                                autoCorrect={false}
                                                onChangeText={(text) => this.props.onDataChanges("CountryCode", text)}
                                                defaultValue={patientData.CommonDetails.CountryCode}
                                                style={{ fontSize: 20, fontFamily: 'NotoSans', paddingVertical: 0, borderBottomWidth: 1, borderBottomColor: '#c8c8c8' }}
                                            />
                                        </View>
                                        <View style={{ flex: 0.8 }}>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Mobile Number
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                                    *
                                                </Text>
                                            </View>
                                            <TextInput
                                                keyboardType={"numeric"}
                                                maxLength={patientData.CommonDetails.CountryCode == '+91' ? 10 : 15}
                                                autoCorrect={false}
                                                onChangeText={(text) => this.props.onDataChanges("Mobile", text)}
                                                defaultValue={patientData.Mobile}
                                                style={{ fontSize: 20, fontFamily: 'NotoSans', paddingVertical: 0, borderBottomWidth: 1, borderBottomColor: '#c8c8c8' }}
                                            />
                                        </View>
                                    </View>
                                    {this.props.errorFields.Mobile.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.Mobile}</Text> : <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>}
                                </View>

                                <View style={{ paddingTop: 15 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                            Full Name
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                            *
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>

                                        <TextInput
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            maxLength={60}
                                            onChangeText={(text) => this.props.onDataChanges("FullName", text)}
                                            defaultValue={patientData.CommonDetails.FullName}
                                            style={{ flex: 1, fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, paddingBottom: 0 }}
                                        />

                                    </View>
                                    {this.props.errorFields.FullName.length > 0 ? <Text style={{ fontSize: 12, color: 'red' }}>Please enter valid name</Text> : <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>}
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                            Age
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#FF0000' }}>
                                            *
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }} >

                                        <View style={{ flex: (Platform.isPad ? 0.9 : 0.77) }}>
                                            <TextInput
                                                keyboardType={"numeric"}
                                                maxLength={3}
                                                autoCorrect={false}
                                                onChangeText={(txt) => {
                                                    this.setState({
                                                        inputAge: true

                                                    }, () => this.props.setAgeText(txt))
                                                }}
                                                defaultValue={!this.state.inputAge ? ageObj.value.toString() : this.props.age}
                                                style={{ fontSize: 20, fontFamily: 'NotoSans', borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, paddingBottom: 0 }}
                                            />

                                        </View>
                                        <TouchableOpacity onPress={() => this.modalYearGroup.open()} style={{ flex: Platform.isPad ? 0.1 : 0.23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 20, color: '#000', fontFamily: 'NotoSans', paddingHorizontal: 6 }}>{!this.state.inputAge ? ageObj.units : this.props.ageUnit} </Text>
                                            <Image source={ic_dropdown_bottom} style={{ resizeMode: 'contain', height: 12, width: 12, }} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    {this.props.errorFields.Age.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>Age is invalid</Text> : <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>}
                                </View>

                                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
                                    this.setState({
                                        inputAge: false
                                    }, () => this.props.showDatePicker(true, "DOB"))
                                }}>
                                    <Text style={{ fontSize: 12, color: '#0065d7', fontFamily: 'NotoSans-Bold' }}>Select Date of Birth</Text>
                                </TouchableOpacity>

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

                                {
                                    !this.state.less ? <TouchableOpacity onPress={() => this.setState({ less: true })} style={{ marginTop: 20, marginBottom: 20 }}>
                                        <Text style={{ fontSize: 15, color: '#0869d8', fontFamily: 'NotoSans-Bold' }}> MORE</Text>
                                    </TouchableOpacity> :
                                        <TouchableOpacity onPress={() => this.setState({ less: false })} style={{ marginTop: 20, marginBottom: 20 }}>
                                            <Text style={{ fontSize: 15, color: '#0869d8', fontFamily: 'NotoSans-Bold' }}> LESS</Text>
                                        </TouchableOpacity>
                                }


                                {this.state.less ?
                                    <View>
                                        <View style={{
                                            paddingBottom: 30, borderBottomColor: '#f0f0f0', borderBottomWidth: 4,
                                            justifyContent: 'center',
                                        }}>
                                            <View  >
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    UHID
                                                </Text>
                                                <View style={{ marginVertical: 5 }}>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={patientData.CommonDetails.PatientUhid}
                                                        onChangeText={(text) => this.props.onDataChanges("PatientUhid", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{
                                                marginTop: 20,
                                                paddingBottom: 30, borderBottomColor: '#f0f0f0', borderBottomWidth: 4,
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Patient ID
                                                </Text>
                                                <View style={{ marginVertical: 5, }}>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={patientData.CommonDetails.PatientId}
                                                        onChangeText={(text) => this.props.onDataChanges("PatientId", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                                    />
                                                </View>
                                            </View>

                                        </View>

                                        <View style={{
                                            marginTop: 20,
                                            paddingBottom: 30, borderBottomColor: '#f0f0f0', borderBottomWidth: 4,
                                            justifyContent: 'center'
                                        }}>
                                            <View style={{}}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Email Address
                                                </Text>
                                                <View style={{ marginVertical: 5, }}>
                                                    <TextInput
                                                        keyboardType={"email-address"}
                                                        autoCapitalize={"none"}
                                                        autoCorrect={false}
                                                        maxLength={40}
                                                        defaultValue={patientData.CommonDetails.EmailAddress}
                                                        onChangeText={(text) => this.props.onDataChanges("EmailAddress", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginTop: 20, borderBottomColor: '#f0f0f0', borderBottomWidth: 4, paddingBottom: 30, }}>
                                            <View style={{ marginHorizontal: 15, flexDirection: 'row', }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        Height
                                                    </Text>
                                                    <TextInput
                                                        keyboardType={"numeric"}
                                                        maxLength={3}
                                                        autoCorrect={false}
                                                        defaultValue={(patientData.CommonDetails.BodyDetails.Height).toString() == "NaN" ? "" : (patientData.CommonDetails.BodyDetails.Height).toString()}
                                                        onChangeText={(text) => this.getBmi("Height", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans', paddingBottom: 0 }} />
                                                </View>
                                                <View style={{ flex: 0.2, alignItems: 'flex-start', justifyContent: 'center', paddingStart: 5 }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }} >
                                                        cm(s)
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 0.3 }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        Weight
                                                    </Text>
                                                    <TextInput
                                                        keyboardType={"decimal-pad"}
                                                        maxLength={7}
                                                        autoCorrect={false}
                                                        defaultValue={(patientData.CommonDetails.BodyDetails.Weight).toString() == "NaN" ? "" : (patientData.CommonDetails.BodyDetails.Weight).toString()}
                                                        onChangeText={(text) => this.getBmi("Weight", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans', paddingBottom: 0 }} />
                                                </View>
                                                <View style={{ flex: 0.2, alignItems: 'flex-start', justifyContent: 'center', paddingStart: 5 }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        kg(s)
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 0.3 }}>
                                                    <Text style={{ fontSize: 10, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        BMI
                                                    </Text>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={(patientData.CommonDetails.BodyDetails.BMI).toString() == "NaN" ? "" : (patientData.CommonDetails.BodyDetails.BMI > 0 ? (patientData.CommonDetails.BodyDetails.BMI).toString() : "")}
                                                        onChangeText={(text) => this.props.onDataChanges("BMI", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans', paddingBottom: 0 }} />
                                                    <Text style={{ fontFamily: 'NotoSans', color: (this.state.bmiResult == "Normal" ? '#0869d8' : '#FF0000'), fontSize: 12 }}>{patientData.CommonDetails.BodyDetails.BMI > 0 ? this.state.bmiResult : ""}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                marginTop: 20,
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Blood Group
                                                </Text>
                                                <TouchableOpacity onPress={() => this.modalBloodGroup.open()} style={{
                                                    marginVertical: 5, alignItems: 'center', justifyContent: 'center',
                                                    borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontFamily: 'NotoSans'
                                                }}>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <View style={{ flex: 0.9, }}>
                                                            <Text style={{ fontSize: 20, fontFamily: 'NotoSans', color: (patientData.CommonDetails.BodyDetails.BloodGroup ? '#000' : '#616161') }}>{this.props.patientDetails.CommonDetails.BodyDetails.BloodGroup ?
                                                                patientData.CommonDetails.BodyDetails.BloodGroup : "Select Blood Group"}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', }}>
                                                            <Image source={ic_dropdown_bottom} style={{ resizeMode: 'contain', height: 12, width: 12 }} />
                                                        </View>

                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>



                                        <View style={{
                                            marginTop: 20, borderBottomColor: '#f0f0f0', borderBottomWidth: 4,
                                            justifyContent: 'center', paddingBottom: 30,
                                        }}>
                                            <View style={{}}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Referred By
                                                </Text>
                                                <View style={{ marginVertical: 5, }}>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={patientData.CommonDetails.Referredby}
                                                        onChangeText={(text) => this.props.onDataChanges("Referredby", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }} />

                                                </View>
                                            </View>
                                        </View>

                                        <View style={{}}>


                                            <View style={{
                                                marginTop: 20,
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Address
                                                </Text>
                                                <View style={{ marginVertical: 5, }}>
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={this.state.address1}
                                                        onChangeText={(text) => this.setAddress(text, 1)}
                                                        style={{
                                                            borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, marginBottom: 10,
                                                            fontFamily: 'NotoSans'
                                                        }} />
                                                    <TextInput
                                                        autoCorrect={false}
                                                        defaultValue={this.state.address2}
                                                        onChangeText={(text) => this.setAddress(text, 2)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row',
                                                marginTop: 20,

                                            }}>
                                                <View style={{ flex: 0.40, }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        Pin Code
                                                    </Text>

                                                    <TextInput
                                                        autoCorrect={false}
                                                        maxLength={7}
                                                        onChangeText={(text) => this.props.onDataChanges("Pincode", text)}
                                                        defaultValue={patientData.CommonDetails.Pincode}
                                                        style={{
                                                            borderBottomColor: '#c8c8c8',
                                                            borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans'
                                                        }} />
                                                </View>
                                                <View style={{ flex: 0.60, marginLeft: 10 }}>
                                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                        City
                                                    </Text>

                                                    <TextInput
                                                        autoCorrect={false}
                                                        onChangeText={(text) => this.props.onDataChanges("City", text)}
                                                        defaultValue={patientData.CommonDetails.City}
                                                        style={{
                                                            borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20,
                                                            fontFamily: 'NotoSans', width: '100%'
                                                        }} />

                                                </View>



                                            </View>

                                            <View style={{
                                                marginTop: 20,
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>
                                                    Country
                                                </Text>
                                                <View style={{ marginVertical: 5, }}>
                                                    <TextInput
                                                        defaultValue={patientData.CommonDetails.Country}
                                                        onChangeText={(text) => this.props.onDataChanges("Country", text)}
                                                        style={{ borderBottomColor: '#c8c8c8', borderBottomWidth: 0.7, fontSize: 20, fontFamily: 'NotoSans' }} />

                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    :
                                    null}

                            </View>




                        </ScrollView>
                    
                    <Modal
                        useNativeDriver={true}
                        animationDuration={200}
                        style={{
                            borderWidth: 0, width: '50%', borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                            borderBottomLeftRadius: 20, borderTopRightRadius: 20, height: '40%', overflow: 'hidden',
                        }}
                        ref={(ref) => this.modalYearGroup = ref}

                        swipeToClose={false}
                        position={"center"}
                        onClosed={() => { this.close }}
                        onOpened={this.open}
                        onClosingState={this.onClosingState}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#616161', borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 20, color: '#616161', fontFamily: 'NotoSans' }}>{this.state.popupObjDate.header}</Text>
                            </View>
                            <View style={{ flex: 0.8, }}>
                                <FlatList
                                    data={this.state.popupObjDate.content}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={this.renderSeperator}
                                    renderItem={({ item, index }) => this.BindYearGroup(item, index)}
                                    keyExtractor={(item, i) => i.toString()}
                                />
                            </View>
                        </View>


                    </Modal>

                    <Modal
                        useNativeDriver={true}
                        animationDuration={200}
                        style={{
                            borderWidth: 0, width: '70%', borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                            borderBottomLeftRadius: 20, borderTopRightRadius: 20, height: '50%', overflow: 'hidden',
                        }}
                        ref={(ref) => this.modalBloodGroup = ref}

                        swipeToClose={false}
                        position={"center"}
                        onClosed={() => { this.close }}
                        onOpened={this.open}
                        onClosingState={this.onClosingState}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#616161', borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 20, color: '#616161', fontFamily: 'NotoSans' }}>{this.state.popupObj.header}</Text>
                            </View>
                            <View style={{ flex: 0.85 }}>
                                <FlatList
                                    data={this.state.popupObj.content}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={this.renderSeperator}
                                    renderItem={({ item, index }) => this.BindBloodGroup(item, index)}
                                    keyExtractor={(item, i) => i.toString()}
                                />
                            </View>
                        </View>


                    </Modal>
                </View>
            
        )
    }
}