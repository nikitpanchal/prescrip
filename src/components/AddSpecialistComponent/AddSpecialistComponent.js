//   code by ravi
import React, { Component } from 'react'
import { View, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { Container, Text, Label } from 'native-base'
import { Picklocation_pink_btn, contact_green,dropdown_green } from '../../constants/images';

export default class AddSpecialistComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            less_more_text: false,
        }
    }

    ToggleFunction = () => {
        this.setState({ show: this.state.show == true ? false : true, less_more_text: this.state.less_more_text == true ? false : true })
    }

    Morelessfunction() {
        if (this.state.show == true) {
            return (
                <View style={{ flexDirection: 'column' }}>
                    {/* ** Landline Number** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 12 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Landline Number</Text>
                        <View style={{ flexDirection: 'row', borderBottomColor: '#d3d3d3', borderBottomWidth: 1, paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                value="+91"
                                ref='Duration'
                                maxLength={3}
                                keyboardType={"numeric"}
                                style={{ fontSize: 20, color: "#8b8b8b", }} />
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("LANDLINE_NO", text)}
                                defaultValue={this.props.specialistdata.LANDLINE_NO}
                                returnKeyType={"next"}
                                maxLength={10}
                                keyboardType="numeric"
                                style={{
                                    flex: 0.9,
                                    fontSize: 20, color: "#242424", flex: 0.9, marginStart: 5,
                                }} />
                        </View>

                    </View>

                    {/* ** Email ID** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
                        <Label style={{ fontSize: 12, color: '#8b8b8b' }}>Email ID</Label>
                        <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("EMAIL", text)}
                                defaultValue={this.props.specialistdata.EMAIL}
                                returnKeyType={"next"}
                                keyboardType='email-address'
                                style={{
                                    fontSize: 20, color: "#242424", flex: 0.9, borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                }} />
                        </View>

                    </View>

                    {/* ** Address** */}
                    <View style={{ flexDirection: 'column', alignContent: 'center', paddingVertical: 20 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Label style={{ fontSize: 12, color: '#8b8b8b' }}>Address</Label>
                            </View>

                        </View>
                        <TextInput
                            onChangeText={(text) => this.props.onDataChanges("ADDRESS", text)}
                            defaultValue={this.props.specialistdata.ADDRESS}
                            returnKeyType={"next"}
                            keyboardType='default'
                            style={{
                                textAlign: 'justify',
                                fontSize: 20, color: "#242424", paddingVertical: 8, flex: 0.9, flexWrap: 'wrap', borderBottomColor: '#c8c8c8', borderBottomWidth: 1
                            }} />

                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 20, flex: 1 }}>
                        {/* ** PinCode** */}
                        <View style={{ flexDirection: 'column', flex: 0.4, }}>
                            <Label style={{ fontSize: 12, color: '#8b8b8b' }}>PinCode</Label>
                            <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.props.onDataChanges("PINCODE", text)}
                                    defaultValue={this.props.specialistdata.PINCODE}
                                    returnKeyType={"next"}
                                    keyboardType='numeric'
                                    maxLength={6}
                                    style={{
                                        fontSize: 20, color: "#242424", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                    }} />
                            </View>
                        </View>
                        {/* ** City** */}
                        <View style={{ flexDirection: 'column', paddingStart: 12, flex: 0.6, }}>
                            <Label style={{ fontSize: 12, color: '#8b8b8b' }}>City</Label>
                            <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.props.onDataChanges("CITY", text)}
                                    defaultValue={this.props.specialistdata.CITY}
                                    returnKeyType={"next"}
                                    keyboardType='default'
                                    style={{
                                        fontSize: 20, color: "#242424", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                    }} />
                            </View>

                        </View>
                    </View>
                    {/* ** State** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
                        <Label style={{ fontSize: 12, color: '#8b8b8b' }}>State</Label>
                        <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("STATE", text)}
                                defaultValue={this.props.specialistdata.STATE}
                                returnKeyType={"next"}
                                keyboardType='default'
                                style={{
                                    fontSize: 20, color: "#242424", flex: 0.9, borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                }} />
                        </View>

                    </View>
                    {/* ** PCI Registrtation No.** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
                        <Label style={{ fontSize: 12, color: '#8b8b8b' }}>PCI Registrtation No.</Label>
                        <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("REGISTRATION_NO", text)}
                                defaultValue={this.props.specialistdata.REGISTRATION_NO}
                                returnKeyType={"next"}
                                keyboardType='numeric'
                                maxLength={15}
                                style={{
                                    fontSize: 20, color: "#242424", flex: 0.9, borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                }} />
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" >
                    {/* **Name Of Specialist*** */}
                    <View style={styles.nameofspec_view}>
                        <Label style={styles.name_spe_text}>Specialization <Text style={{ color: 'red', fontSize: 14 }}>*</Text></Label>
                        <TouchableOpacity onPress={this.props.showPrimarySpec}>
                            <View style={styles.namespe_modal_view}>
                                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                                    <Label style={{ color: "#242424", fontSize: 20 }}>
                                    { this.props.specialistdata.PrimarySpecialization}
                                    </Label>
                                </View>
                               
                                <Image style={styles.contact_green_images} source={dropdown_green} />
                            </View>
                            {/* {this.props.errorFields.SPECIALIZATION.length!=0 ? <Text style={styles.spec_name_error}>{this.props.errorFields.SPECIALIZATION}</Text> : null} */}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameofspec_view}>
                        <Label style={styles.name_spe_text}>Name Of Specialist <Text style={{ color: 'red', fontSize: 14 }}>*</Text></Label>
                        <TouchableOpacity onPress={this.props.openmodal}>
                            <View style={styles.namespe_modal_view}>
                                <View style={styles.namespe_modal_input_view}>
                                    <TextInput
                                        onChangeText={(text) => this.props.onDataChanges("NAME", text)}
                                        defaultValue={this.props.patientvisit.contact_name}
                                        returnKeyType={"next"}
                                        keyboardType='default'
                                        style={styles.namspe_textinput_style_view} />
                                </View>
                                <Image style={styles.contact_green_pic} source={contact_green} />
                            </View>
                            {this.props.errorFields.NAME.length != 0 ? <Text style={styles.spec_name_error}>{this.props.errorFields.NAME}</Text> : null}
                        </TouchableOpacity>
                        {/* {this.props.errorFields.nameofspecialist.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.nameofspecialist}</Text> : null} */}
                    </View>
                    {/* **Mobile Number*** */}
                    <View style={styles.mobile_number_view}>
                        <Text style={styles.mob_text}>Mobile Number  <Text style={styles.mobile_text_error}>*</Text></Text>
                        <View style={styles.mobile_text_input_view}>
                            <TextInput
                                value="+91"
                                ref='Duration'
                                maxLength={3}
                                keyboardType={"numeric"}
                                style={styles.mobile_nine_one_text} />
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("MOBILE", text)}
                                defaultValue={this.props.patientvisit.contact_mob}
                                returnKeyType={"next"}
                                maxLength={10}
                                keyboardType="numeric"
                                style={styles.mobile_ten_digit} />
                        </View>
                        {this.props.errorFields.MOBILE.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.MOBILE}</Text> : null}

                    </View>
                    <TouchableOpacity onPress={this.ToggleFunction} style={{ paddingVertical: 20 }}>
                        <Text uppercase={true} style={{ fontSize: 14, fontFamily: 'NotoSans-Bold', color: '#1cb07a' }}>{this.state.less_more_text == true ? 'Less' : 'More'}</Text>
                    </TouchableOpacity>
                    {this.Morelessfunction()}
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }

}
const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: 15, marginBottom: 20, flexDirection: 'column', backgroundColor: '#fafafa' },
    nameofspec_view: { flexDirection: 'column', paddingVertical: 25 },
    name_spe_text: { color: '#8b8b8b', fontSize: 11 },
    namespe_modal_view: { flexDirection: "row", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingRight: 5 },
    namespe_modal_input_view: { flex: 1, paddingTop: 5, paddingBottom: 5 },
    namspe_textinput_style_view: { fontSize: 20, color: "#242424", paddingBottom: 5 },
    contact_green_images: { resizeMode: "contain", alignSelf: "center", width: 14, height: 14, borderColor: '#eee', borderRightWidth: 1, },
    contact_green_pic: { resizeMode: "contain", alignSelf: "center", width: 18, height: 18, borderColor: '#eee', borderRightWidth: 1, },
    spec_name_error: { fontSize: 12, color: 'red' },
    mobile_number_view: { flexDirection: 'column', paddingVertical: 12 },
    mob_text: { fontSize: 12, color: '#8b8b8b' },
    mobile_text_error: { color: 'red', fontSize: 14 },
    mobile_text_input_view: { flexDirection: 'row', borderBottomColor: '#d3d3d3', borderBottomWidth: 1, paddingTop: 8, paddingBottom: 5 },
    mobile_nine_one_text: { fontSize: 20, color: "#8b8b8b", },
    mobile_ten_digit: { flex: 0.9, fontSize: 20, color: "#242424", flex: 0.9, marginStart: 5, },
})