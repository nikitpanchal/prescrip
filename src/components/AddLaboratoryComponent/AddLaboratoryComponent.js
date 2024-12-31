//   code by ravi
import React, { Component } from 'react'
import { View, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { Container, Text } from 'native-base'
import { Picklocation_pink_btn, Contact_btn_pink, contact_green, contact_blue, dropdown_green, contact_btn } from '../../constants/images';
import ToastComponent from '../Toast/toastComponent'
import Images from '../../Theme/Images'
import Toast, { DURATION } from 'react-native-easy-toast'

export default class AddLaboratoryComponent extends Component {
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


    // Coantact() {

    //     this.props.getContactDetails.map((data) => {
    //         return (
    //             <View><Text>{data.time}</Text></View>
    //         )
    //     })

    // }
    Morelessfunction() {
        if (this.state.show == true) {
            return (
                <View style={{ flexDirection: 'column' }}>
                    {/* ** Landline Number** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 12 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Landline Number</Text>
                        <View style={styles.mobile_text_input_view}>
                            <TextInput
                                value="+91"
                                ref='Duration'
                                maxLength={3}
                                keyboardType={"numeric"}
                                style={styles.mobile_nine_one_text} />
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("Alternateno", text)}
                                defaultValue={this.props.laboratorydata.Alternateno}
                                returnKeyType={"next"}
                                maxLength={10}
                                keyboardType="numeric"
                                style={styles.mobile_ten_digit} />
                        </View>



                    </View>

                    {/* ** Email ID** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Email ID</Text>
                        <View style={{ paddingTop: 8, }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("Email", text)}
                                defaultValue={this.props.laboratorydata.Email}
                                returnKeyType={"next"}
                                keyboardType='email-address'
                                style={{
                                    fontSize: 20, color: "#242424", flex: 0.9, borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 2
                                }} />
                        </View>
                        {this.props.errorFields.Email ? <Text style={styles.spec_name_error}>{this.props.errorFields.Email}</Text> : null}
                    </View>

                    {/* ** Address** */}
                    <View style={{ flexDirection: 'column', alignContent: 'center', paddingVertical: 15 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, color: '#8b8b8b' }}>Address</Text>
                            </View>

                        </View>
                        <TextInput
                            onChangeText={(text) => this.props.onDataChanges("Address", text)}
                            defaultValue={this.props.laboratorydata.Address}
                            returnKeyType={"next"}
                            keyboardType='default'
                            style={{
                                textAlign: 'justify',
                                fontSize: 20, color: "#242424", paddingTop: 8, flex: 0.9, flexWrap: 'wrap', borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 2
                            }} />
                    </View>

                    <View style={{ flexDirection: 'row', paddingVertical: 15, flex: 1 }}>
                        {/* ** PinCode** */}
                        <View style={{ flexDirection: 'column', flex: 0.4, }}>
                            <Text style={{ fontSize: 12, color: '#8b8b8b' }}>PinCode</Text>
                            <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.props.onDataChanges("Pincode", text)}
                                    defaultValue={this.props.laboratorydata.Pincode}
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
                            <Text style={{ fontSize: 12, color: '#8b8b8b' }}>City</Text>
                            <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.props.onDataChanges("City", text)}
                                    defaultValue={this.props.laboratorydata.City}
                                    returnKeyType={"next"}
                                    keyboardType='default'
                                    style={{
                                        fontSize: 20, color: "#242424", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                    }} />
                            </View>

                        </View>
                    </View>
                    {/* ** State** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>State</Text>
                        <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("State", text)}
                                defaultValue={this.props.laboratorydata.State}
                                returnKeyType={"next"}
                                keyboardType='default'
                                style={{
                                    fontSize: 20, color: "#242424", flex: 0.9, borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingBottom: 5
                                }} />
                        </View>

                    </View>
                    {/* ** PCI Registrtation No.** */}
                    <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                        <Text style={{ fontSize: 12, color: '#8b8b8b' }}>PCI Registrtation No.</Text>
                        <View style={{ paddingTop: 8, paddingBottom: 5 }}>
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("MICRNo", text)}
                                defaultValue={this.props.laboratorydata.MICRNo}
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
                <KeyboardAvoidingView style={{ flex: 1, }}  >
                    {/* **Name Of Specialist*** */}
                    <View>
                        {this.props.Page_type == 'Specialist' ?
                            <View style={styles.nameofspec_view}>
                                <Text style={styles.name_spe_text}>Specialization <Text style={{ color: 'red', fontSize: 14 }}>*</Text></Text>
                                <TouchableOpacity onPress={this.props.showSpec}>
                                    <View style={styles.namespe_modal_view}>
                                        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                                            <Text style={{ color: "#242424", fontSize: 20 }}>
                                                {this.props.laboratorydata.Specialization ? this.props.laboratorydata.Specialization : this.props.laboratorydata ? this.props.laboratorydata.Specialist ? this.props.laboratorydata.Specialist : "Select" : "Select"}
                                            </Text>
                                        </View>

                                        <Image style={styles.contact_green_images} source={dropdown_green} />
                                    </View>
                                    {this.props.errorFields.Specialist ? <Text style={styles.spec_name_error}>{this.props.errorFields.Specialist}</Text> : null}

                                </TouchableOpacity>

                            </View> : null}
                    </View>

                    <View style={styles.nameofspec_view}>
                        <Text style={styles.name_spe_text}>Name Of {this.props.Page_type} <Text style={{ color: 'red', fontSize: 14 }}>*</Text></Text>
                        <TouchableOpacity onPress={this.props.openmodal} >
                            <View style={styles.namespe_modal_view}>
                                <View style={styles.namespe_modal_input_view}>
                                    <TextInput
                                        onChangeText={(text) => this.props.onDataChanges("Name", text)}
                                        defaultValue={this.props.laboratorydata.Name}
                                        returnKeyType={"next"}
                                        keyboardType='default'
                                        style={styles.namspe_textinput_style_view} />
                                </View>

                                <Image style={[styles.contact_pink_images, { tintColor: this.props.Page_color_code }]} source={contact_blue} />

                            </View>
                            {this.props.errorFields.Name.length != 0 ? <Text style={styles.spec_name_error}>{this.props.errorFields.Name}</Text> : null}
                        </TouchableOpacity>
                        {/* {this.props.errorFields.nameofspecialist.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.nameofspecialist}</Text> : null} */}
                    </View>
                    {/* **Mobile Number*** */}
                    <View style={styles.mobile_number_view}>
                        <Text style={styles.mob_text}>Mobile Number  <Text style={styles.mobile_text_error}>*</Text></Text>
                        <View style={styles.mobile_text_input_view}>
                        <TextInput
                                onChangeText={(text) => this.props.onDataChanges("CountryCode", text)}
                                ref='Duration'
                                maxLength={4}

                                keyboardType={"phone-pad"}
                                defaultValue={Object.keys(this.props.Contactdata).length > 0 ? this.props.Contactdata.CountryCode : this.props.laboratorydata.CountryCode}
                                style={styles.mobile_nine_one_text} />
                            <TextInput
                                onChangeText={(text) => this.props.onDataChanges("Mobile", text)}
                                defaultValue={Object.keys(this.props.Contactdata).length > 0 ? this.props.Contactdata.Mobile : this.props.laboratorydata.Mobile}
                                returnKeyType={"next"}
                                maxLength={15}
                                keyboardType="numeric"
                                style={styles.mobile_ten_digit} />
                        </View>
                        {this.props.errorFields.Mobile.length != 0 ? <Text style={{ fontSize: 12, color: 'red' }}>{this.props.errorFields.Mobile}</Text> : null}

                    </View>
                    <TouchableOpacity onPress={this.ToggleFunction} style={{ paddingVertical: 15 }}>
                        <Text uppercase={true} style={{ fontSize: 14, fontFamily: 'NotoSans-Bold', color: this.props.Page_color_code }}>{this.state.less_more_text == true ? 'Less' : 'More'}</Text>
                    </TouchableOpacity>
                    {this.Morelessfunction()}


                </KeyboardAvoidingView>
                {
                    this.props.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={"#fafbfe"}
                                imagePath={Images.Info}
                                description={this.props.description}

                            />

                            , 800) : null
                }
                <Toast

                    position='bottom'
                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        bottom: 70,
                        backgroundColor: '#4D99E3', borderRadius: 15
                    }}
                    ref="toast" />
            </ScrollView>
        )
    }

}
const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: 15, marginBottom: 20, flexDirection: 'column', backgroundColor: '#fafafa' },
    nameofspec_view: { flexDirection: 'column', paddingVertical: 20 },
    name_spe_text: { color: '#8b8b8b', fontSize: 11 },
    namespe_modal_view: { flexDirection: "row", borderBottomColor: '#c8c8c8', borderBottomWidth: 1, paddingRight: 5, alignItems: 'center', paddingBottom: 2 },
    namespe_modal_input_view: { flex: 1, paddingBottom: 2 },
    namspe_textinput_style_view: { fontSize: 20, color: "#242424", paddingBottom: 0 },
    contact_pink_images: { resizeMode: "contain", width: 18, height: 18, borderColor: '#eee', borderRightWidth: 1, alignSelf: 'center', },
    spec_name_error: { fontSize: 12, color: 'red' },
    mobile_number_view: { flexDirection: 'column', paddingVertical: 12 },
    mob_text: { fontSize: 12, color: '#8b8b8b' },
    mobile_text_error: { color: 'red', fontSize: 14 },
    mobile_text_input_view: { flexDirection: 'row', borderBottomColor: '#d3d3d3', borderBottomWidth: 1, paddingTop: 8, },
    mobile_nine_one_text: { fontSize: 20, color: "#242424",flex: 0.2, paddingBottom: 2 },
    mobile_ten_digit: { fontSize: 20, color: "#242424", flex: 0.8, marginStart: 5, paddingBottom: 2 },
    contact_green_images: { resizeMode: "contain", alignSelf: "center", width: 14, height: 14, borderColor: '#eee', borderRightWidth: 1, },
    moreless: { fontSize: 14, fontFamily: 'NotoSans-Bold', }
})