/****** code by ravi ******/
import React from 'react';
import { Tick_off, Tick, democlose, ic_add_blue,
     Blue_Dropdown_collapsed, Spec_Check_Non_Active, 
     Spec_Check_Active, ic_Orange_BG_578, ic_White_BG_pop_up_578, ic_profile_dummy_image, ic_Back_Button, ic_Select_city_dropdown } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, TouchableOpacity,Platform, Image, ScrollView, ImageBackground, TextInput, KeyboardAvoidingView, Dimensions, } from "react-native";
 

export default class ProfessionalComponent extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            primaryselect: 'Select',
            secondryselect: 'Select',
        };
    }

    render() {

        return (
            <KeyboardAvoidingView style={{
                flex: 1, flexDirection: 'column',
                justifyContent: 'center',
            }} behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={130} >

                <ScrollView keyboardDismissMode={"none"} keyboardShouldPersistTaps={"handled"} style={{ 
                     flex: 1, paddingHorizontal: 10, flexDirection: 'column', backgroundColor: '#fff' }} 
                showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'column', paddingTop: 20 }}>
                        <Text style={{ color: '#8b8b8b', fontSize: 11 }}>Primary Specialization <Text style={{ color: 'red', fontSize: 14 }}>*</Text></Text>
                        <TouchableOpacity onPress={this.props.showPrimarySpec} >
                            <View style={{ flexDirection: "row", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingRight: 5 }}>
                                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                                    <Text style={{ color: "#242424", fontSize: 20 }}>
                                        {this.props.doctorData.PrimarySpecialization.length != 0 ? this.props.doctorData.PrimarySpecialization : 'Select'}
                                    </Text>
                                </View>

                                <Image style={{ resizeMode: "contain", alignSelf: "center", width: 12, height: 12, borderColor: '#eee', borderRightWidth: 1, }} source={Blue_Dropdown_collapsed} />
                            </View>
                        </TouchableOpacity>
                        {this.props.errorFields.primarySpecialization.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.primarySpecialization}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}


                    </View>
                    <View style={{ flexDirection: 'column', paddingVertical: 40 }}>
                        <Text style={{ color: '#8b8b8b', fontSize: 11 }}> Specialization to Display </Text>
                        <TouchableOpacity onPress={this.props.showSecondarySpec}>
                            <View style={{ flexDirection: "row", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingRight: 5 }}>
                                <View style={{ flex: 1, paddingVertical: 5 }}>
                                    <Text style={{ color: "#242424", fontSize: 20 }}>
                                        {this.props.doctorData.DisplaySpecializationCSV.length != 0 ? this.props.doctorData.DisplaySpecializationCSV : 'Select'}
                                    </Text>
                                </View>

                                <Image style={{ resizeMode: "contain", alignSelf: "center", width: 12, height: 12, borderColor: '#eee', borderRightWidth: 1, }} source={Blue_Dropdown_collapsed} />
                            </View>
                        </TouchableOpacity>



                    </View>
                    <View style={{ flexDirection: 'column', }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Qualification  </Text>
                        <TextInput
                            defaultValue={this.props.doctorData.DisplayQualificationCSV}
                            onChangeText={(text) => this.props.onDataChanges("DisplayQualificationCSV", text)}
                            returnKeyType={"next"}
                            keyboardType="default"
                            style={{
                                fontSize: 20, color: "#242424", margin: 0, padding: 0, height: 35, borderBottomColor: '#c8c8c8', borderBottomWidth: 1
                            }} />
                        {this.props.errorFields.qulification != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.qulification}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                    </View>
                    <View style={{ flexDirection: 'column', paddingVertical: 40 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Registration Number<Text style={{ color: 'red', fontSize: 14 }}>*</Text></Text>
                        <TextInput
                            defaultValue={this.props.doctorData.MICRNo}
                            onChangeText={(text) => { this.props.onDataChanges("MICRNo", text) }}
                            // value={this.props.data}
                            returnKeyType={"next"}
                            keyboardType="default"
                            style={{
                                fontSize: 20, color: "#242424", margin: 0, padding: 0, height: 35, borderBottomColor: '#c8c8c8', borderBottomWidth: 1
                            }} />
                        {this.props.errorFields.MICRNo != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.MICRNo}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                    </View>
                    <View style={{ flexDirection: 'column', }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>State Medical Council<Text style={{ color: 'red', fontSize: 14 }}>*</Text></Text>
                        <TextInput
                            onChangeText={(text) => { this.props.onDataChanges("CouncilName", text) }}
                            defaultValue={this.props.doctorData.CouncilName}

                            returnKeyType={"next"}
                            keyboardType="default"
                            style={{
                                fontSize: 20, color: "#242424", margin: 0, padding: 0, height: 35, borderBottomColor: '#c8c8c8', borderBottomWidth: 1
                            }} />

                        {this.props.errorFields.medCouncil != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.medCouncil}</Text> : <Text style={{ fontSize: 12, color: 'red' }}></Text>}

                    </View>



                </ScrollView>
            </KeyboardAvoidingView>

        );
    }
}
