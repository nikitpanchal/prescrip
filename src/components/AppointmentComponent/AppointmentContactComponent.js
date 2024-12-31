/* created by ruban 
Appointment Contact component */
import React, { Component, createRef } from 'react'
import {
    View, Text, Image, ScrollView, StatusBar, ImageBackground, TouchableOpacity,
    ActivityIndicator, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, FlatList, Alert, Platform,
} from 'react-native'
import { Container } from 'native-base'
import { lefticon, ic_Orange_BG_578, ic_White_BG_pop_up_578, ic_profile_dummy_image, ic_Back_Button, ic_Select_city_dropdown } from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient'
import Modal from "react-native-modalbox";
import Images from '../../Theme/Images'
import { democlose, ic_add_blue } from '../../constants/images'
import { cities } from '../../constants/cities.json'
import HeaderData from '../Header/header'
import { isNameValid, isValidContactNo, isAddressValid, isPincodeValid } from '../../commonmethods/validation'
import multipleTapHandler from '../../components/MultiTapHandle/index';
import ToastComponent from '../../components/Toast/toastComponent'
import Toast, { DURATION } from 'react-native-easy-toast'

var sortcity = cities.sort((a, b) => {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
})
export default class AppointmentContactComponent extends Component {


    constructor(props) {
        super(props)
        var { City, ClinicName, ContactNo } = props.doctorProfile.ClinicAddress
        this.contacts = ContactNo ? ContactNo.split(",") : []
        this.state = {
            isFilled: false,
            city: City ? City : 'Select',
            message: 'Are you currently at ' + "\n" + ClinicName + '?',
            arrayCity: sortcity.slice(0, 100),
            FullAddress: '',
            Address1: '',
            Address2: '',
            Address3: '',
            selectState: '',
            selectPin: '',
            numConFields: ContactNo ? (this.contacts.length) : 1,
            AddressValid: true,
            CityValid: true,
            StateValid: true,
            pinValid: true,
            phoneValid: true,
            msg: "",
            msg2: "",
            msg3: "",
            msg4: "",
            msg5: "",
            contactTxt: '',
            filterData: false,
            loading: false,
            arrayState: false,
            srchText: '',
            //Toast States
            description: '',
            showToast: false,

            toastImagePath: Images.Info,
            toastTextColor: "#fafbfe",
            toastBgColor: '#4D99E3',
        }
        this.clinicAddress = props.doctorProfile.ClinicAddress

        this.filtercity = []
        this.modalGps = createRef();
        this.toast = createRef();
        this.modalCity = createRef();
        this.add2 = createRef();
        this.add3 = createRef();
        this.pin = createRef();
        this.contact = createRef();
        this.stateRef = createRef();
    }


    // set state of address
    setAddress(txt, line) {

        if (line === 1) {
            this.setState({ Address1: txt }, () => {
                this.setFullAddress();
            })
        } else if (line === 2) {
            this.setState({ Address2: txt }, () => {
                this.setFullAddress();
            })
        } else {
            this.setState({ Address3: txt }, () => {
                this.setFullAddress();
            })
        }


        // if (this.state.Address1 || this.state.Address2 || this.state.Address3) {
        //     let address = this.state.Address1 + "\n" + this.state.Address2 + "\n" + this.state.Address3
        //     this.setState({ FullAddress: address })
        // }


    }
    setFullAddress() {
        let address = this.state.Address1 + (this.state.Address2.length > 0 ? "\n" + this.state.Address2 : "") + (this.state.Address3.length > 0 ? "\n" + this.state.Address3 : "");
        this.setState({
            FullAddress: address

        });
    }
    // remove contact field
    removeField(val) {
        let index = val
        if (index > -1) {
            this.contacts.splice(index, 1);
            this.clinicAddress.ContactNo = this.contacts.toString()
            this.props.setClinicDetails(this.clinicAddress)
            let { ContactNo } = this.props.doctorProfile.ClinicAddress
            this.setState({ numConFields: (ContactNo ? (this.contacts.length) : 1) }, () => {
                this.setState({ arrayState: true })
            })

        }
    }

    // create multi fields for contact on press another
    createContactField() {

        let views = [];

        for (let i = 0; i < this.state.numConFields; i++) {

            views.push(

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextInput
                        defaultValue={this.contacts[i]}
                        returnKeyType="next"

                        ref={(ref) => this.contact = ref}
                        onSubmitEditing={() => this.checkAllFilled()}
                        onChangeText={(text) => this.getContactNumber(text, i)}
                        onBlur={() => this.checkAllFilled()}
                        maxLength={11} returnKeyType='next' keyboardType='numeric'
                        style={{
                            borderBottomColor: '#cccccc', borderBottomWidth: 1,
                            color: '#444444', fontFamily: 'NotoSans-Bold',
                            fontSize: 25, marginBottom: 8, width: '90%'
                        }} />
                    <TouchableOpacity onPress={() => this.removeField(i)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {this.contacts.indexOf(this.contacts[i]) > 0 ?


                            <Image source={democlose} style={{ resizeMode: 'contain', height: 10 }} />
                            : null
                        }
                    </TouchableOpacity>
                </View>

            )
        }


        return views;
    }
    //add another contact click function
    addanother() {
        this.setState({ numConFields: this.state.numConFields + 1 }, () => {
            this.createContactField()
        })

    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
        this.setState({ arrayState: true })
        if (this.clinicAddress.Address && this.clinicAddress.City && this.clinicAddress.State && this.clinicAddress.Pincode && this.clinicAddress.ContactNo) {
            // set clinic address in state
            this.setState({ FullAddress: this.clinicAddress.Address }, () => {
                let splitAddress = this.state.FullAddress.split(/\r?\n/)
                this.setState({ Address1: splitAddress[0] })
                this.setState({ Address2: splitAddress[1] ? splitAddress[1] : "" })
                this.setState({ Address3: splitAddress[2] ? splitAddress[2] : "" })
            })

            // set clinic state in state
            this.setState({ selectState: this.clinicAddress.State })

            // set clinic PinCode in state
            this.setState({ selectPin: this.clinicAddress.Pincode }, () => this.checkAllFilled())
        }
    }

    //search city in modal
    searchCity(text) {

        if (text) {
            let newData = sortcity.filter(item => {

                return item.name.indexOf(text) > -1;
            });

            this.setState({ filterData: true, arrayCity: newData }, () => {
                this.filtercity = newData
            });
        } else {
            this.setState({ filterData: false, arrayCity: sortcity.slice(0, 100) })
        }
        this.setState({
            srchText: text
        });
    }





    //set state of contact list
    getContactNumber(text, index) {
        if (text.length > 0) {
            this.contacts[index] = text;
        }
        // else if (text.length > 0) {
        //     this.contacts[index] = text;
        // }

        this.contacts = this.contacts.filter(con => {
            return con != undefined

        })

        this.checkAllFilled();

    }


    //on clicking proceed button
    onProceed(address, city, state, pincode, contact) {
        Keyboard.dismiss()
        //this.getContactNumber()
        this.validateClinic(address, city, state, pincode, contact)

    }
    checkAllFilled() {

        if (this.state.FullAddress.length > 0 &&
            this.state.city != "Select" &&
            this.state.city &&
            this.state.selectState &&
            this.state.selectPin &&
            this.contacts.length > 0
            && this.contacts[0].length > 5) {
            this.setState({
                isFilled: true
            })
        }
        else {
            this.setState({
                isFilled: false
            })
        }


    }

    hasNumber(myString, type) {
        if (type == "contacts" && Array.isArray(myString)) {
            return myString.every(this.isPhoneno);

        } else {
            return /^\d+$/.test(myString);
        }

    }

    isPhoneno(number) {

        return /^\d+$/.test(number);
    }


    phoneValidate() {
        if (this.contacts.length == 1) {
            if (this.contacts[0].length > 5)          // condition 1 check array index 0 greater than 5

                return true                           // if the index 0 of array greater than 5 return true
            else
                return false                         // if the index 0 of array less than 5 return false

        } else {
            let result = false
            for (let i = 0; i < this.contacts.length; i++) {
                if (this.contacts[i] == "" || this.contacts[i] == " ") {
                    this.contacts.splice(i, 1)

                }
                else if (this.contacts[i].length > 5) {
                    result = true
                } else {
                    result = false
                    break
                }
            }

            return result
        }

    }
    //validation on proceed click
    validateClinic(address, city, state, pincode, contact) {

        var checkAddress, checkCity, checkState, checkPincode
        // Address validation check
        if (this.state.FullAddress.length > 0) {
            checkAddress = isAddressValid(this.state.FullAddress, address)
            this.setState({ AddressValid: true, msg: "" })
        } else {
            this.setState({ AddressValid: false, msg: "please enter valid " + address })

        }
        // City validation check
        if ((this.state.city != "Select" && this.state.city) || (this.clinicAddress.City != "Select" && this.clinicAddress.city)) {
            checkCity = isNameValid(this.state.city, city)
            this.setState({ CityValid: checkCity.isvalid, msg2: checkCity.msg })
        } else {

            this.setState({ CityValid: false, msg2: "please enter valid " + city })
        }
        // state validation check
        if (this.state.selectState || this.clinicAddress.State) {
            checkState = isNameValid(this.state.selectState, state)
            this.setState({ StateValid: checkState.isvalid, msg3: checkState.msg })
        } else {
            this.setState({ StateValid: false, msg3: "please enter valid " + state })

        }
        // pincode validation check
        if ((this.state.selectPin || this.clinicAddress.Pincode) && this.hasNumber(this.state.selectPin ? this.state.selectPin : this.clinicAddress.Pincode, "pincode")) {
            checkPincode = isPincodeValid(this.state.selectPin, pincode)
            this.setState({ pinValid: checkPincode.isvalid, msg4: checkPincode.msg })
        } else {
            this.setState({ pinValid: false, msg4: "please enter valid " + pincode })

        }

        if (this.phoneValidate() && this.hasNumber(this.contacts, "contacts")) {
            this.setState({ phoneValid: true })
        } else {
            this.setState({ phoneValid: false, msg5: "Please enter valid " + contact })
        }

        if (checkAddress && checkCity && checkState && this.phoneValidate() && checkPincode && this.state.phoneValid) {
            this.clinicAddress.Address = this.state.FullAddress
            this.clinicAddress.City = this.state.city
            this.clinicAddress.State = this.state.selectState
            this.clinicAddress.Pincode = this.state.selectPin
            this.clinicAddress.ContactNo = this.contacts.toString()
            this.modalGps.open()
        }
    }

    //city modal
    BindCity(item, index) {

        return (

            <TouchableOpacity onPress={() => this.setState({ city: item.name, selectState: item.state, arrayCity: sortcity.slice(0, 100) }, () => {
                this.modalCity.close();
                this.checkAllFilled();

            })}>
                <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, height: 50, fontFamily: 'NotoSans', paddingTop: 8, color: '#000' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )



    }


    //on clicking proceed yes on bottom modal
    onProceedYes() {
        try {
            this.setState({ loading: true })
            if (this.state.FullAddress && this.state.city != "Select" && this.contacts && this.state.selectState && this.state.selectPin) {
                this.props.setClinicDetails(this.clinicAddress)
                this.setState({ loading: false })
                this.props.navigation.navigate("AppointmentMapContainer")

            }
        } catch {
            this.toast.show(


                <ToastComponent
                    {...this.props}

                    textColorCode={"#fffefe"}
                    imagePath={Images.Error}
                    description={"Prescrip", "Something went wrong"}

                />
                , 1500)
            this.modalGps.close();
            // Alert.alert("Prescrip", "something went wrong")
            this.setState({ loading: false })
        }

    }

    //on clicking proceed No on bottom modal
    onProceedNo() {
        try {
            this.setState({ loading: true })
            let doctorData = { ...this.props.doctorProfile.DoctorData }
            this.props.setClinicDetails(this.clinicAddress);
            let isUpdate = 0;
            if (this.clinicAddress) {
                let index = -1;
                index = doctorData.ClinicAddresses.findIndex((item) => {
                    return item.ClinicId == this.clinicAddress.ClinicId;

                });


                if (index > -1) {
                    doctorData.ClinicAddresses[index] = this.clinicAddress;
                    isUpdate = 2;

                }
                else {
                    doctorData.ClinicAddresses.push(this.clinicAddress);
                    isUpdate = 1;
                }
            }
            let clinicDetails = {
                clinicId: this.clinicAddress.ClinicId,
                clinicAddresses: this.clinicAddress,
                action: isUpdate,
                doctorId: doctorData._id
            }

            this.props.addClinicAddresses(clinicDetails).then(({ payload, error }) => {

                if (error) {
                    this.setState({
                        description: 'Currently internet is not avaliable',
                        toastBgColor: "#d9541d",
                        toastTextColor: '#fffefe',
                        toastImagePath: Images.Error

                    })
                    switch (error.data) {
                        case 'Network Error':
                            this.setState({
                                description: 'Currently internet is not avaliable',
                                toastBgColor: "#d9541d",
                                toastTextColor: '#fffefe',
                                toastImagePath: Images.Error

                            })
                            this.modalGps.close();
                            break;
                        default:
                            this.setState({
                                description: 'Error in gettting response from server',
                                toastBgColor: "#d9541d",
                                toastTextColor: '#fffefe',
                                toastImagePath: Images.Error
                            })
                            this.modalGps.close();
                            break;
                    }

                    this.setState({
                        showToast: true,
                    })

                    setTimeout(() => {
                        this.setState({
                            showToast: false,
                            loading: false
                        });

                    }, 1500);

                    this.setState({ loading: false })
                    return;
                }
                if (payload.data.status == 1) {
                    this.setState({ loading: false })
                    this.props.setDoctorData(doctorData)
                    this.props.navigation.navigate("CongratsClinicContainer")

                } else {
                    this.setState({
                        showToast: true,
                        description: payload.data.msg,
                        toastBgColor: "#29b62f",
                        toastTextColor: '#fafdfa',
                        toastImagePath: Images.Success
                    })

                    setTimeout(() => {
                        this.setState({
                            showToast: false,
                            loading: false
                        });

                    }, 1500);
                    // alert(response.payload.data.msg)
                    this.setState({ loading: false })

                }
            })
        }
        catch (error) {
            this.setState({
                showToast: true,
                description: "Something went wrong",
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error
            })

            this.modalGps.close();
            // Alert.alert("Prescrip", "Something went wrong " + JSON.stringify(error));
            this.setState({ loading: false });


        }
    }

    //open city modal
    cityModal() {

        this.modalCity.open()
    }


    //go back
    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }
    setCustomCity() {
        this.setState({
            city: this.state.srchText,
            selectState: "",
            arrayCity: sortcity.slice(0, 100)
        });
        this.modalCity.close();
    }


    render() {
        const screenHeight = Dimensions.get('window').height
        const screenWidth = Dimensions.get('window').width
        return (

            <View style={{ flex: 1 }}>
                {this.state.loading ? <View style={{ zIndex: 99, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%', position: 'absolute' }}>
                    <ActivityIndicator size="large" color="#0077c0" />
                </View>
                    :
                    null}
                <View contentContainerStyle={{ flex: 1 }}
                    style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                    <View style={{
                        flexdirection: 'column',
                        flex: 1,
                    }}>


                        <HeaderData
                            {...this.props}
                            bgImage={ic_Orange_BG_578}
                            imagePath={ic_profile_dummy_image}
                            title={this.props.clinicName}
                            description={"The contact details for the clinic are ?"}
                            leftImage={lefticon}
                            stepText={"Step 3 of 3"}
                            progressBarWidth={1}
                            type={5}
                            leftImageOnClick={() => this.leftImageOnClick()}

                        />

                        <KeyboardAvoidingView style={{ flex: 1 }}
                            behavior='padding' enabled={Platform.OS == "android" ? false : true}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                                flexGrow: 1,
                            }} keyboardShouldPersistTaps={"handled"} keyboardDismissMode={"none"}
                                style={{ flex: 1 }}>
                                <View style={{ justifyContent: 'flex-start', backgroundColor: '#FFFFFF', flex: 1 }} >
                                    <View style={{
                                        flex: 1, top: -20, alignSelf: 'center', width: Dimensions.get('screen').width,
                                        backgroundColor: '#ffffff', borderTopEndRadius: 20, borderTopLeftRadius: 20
                                    }} >

                                        <View style={{ flex: 0.2, marginHorizontal: 20, marginTop: 26, }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, color: '#9e9e9e' }}>Address</Text>
                                                <Text style={{ fontSize: 20, color: '#FF0000' }}>*</Text>
                                            </View>

                                            <TextInput
                                                defaultValue={this.state.Address1}
                                                returnKeyType="next"
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.add2.focus(); this.checkAllFilled() }}

                                                onChangeText={(txt) => this.setAddress(txt, 1)}
                                                style={{
                                                    borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold',
                                                    borderBottomWidth: 1, fontSize: 25, marginBottom: 8
                                                }} />
                                            <TextInput
                                                defaultValue={this.state.Address2}
                                                returnKeyType="next"

                                                ref={(ref) => this.add2 = ref}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.add3.focus(); this.checkAllFilled() }}

                                                onChangeText={(txt) => this.setAddress(txt, 2)}
                                                style={{
                                                    borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold',
                                                    borderBottomWidth: 1, fontSize: 25, marginBottom: 8
                                                }} />

                                            <TextInput
                                                defaultValue={this.state.Address3}
                                                returnKeyType="next"

                                                ref={(ref) => this.add3 = ref}
                                                blurOnSubmit={true}
                                                onSubmitEditing={() => this.checkAllFilled()}
                                                onChangeText={(txt) => this.setAddress(txt, 3)}
                                                style={{
                                                    borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold',
                                                    borderBottomWidth: 1, fontSize: 25, marginBottom: 8
                                                }} />

                                        </View>
                                        {!this.state.AddressValid ? <Text style={{
                                            marginRight: 20,
                                            marginLeft: 20, color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12,
                                        }}>{this.state.msg}</Text> : null}
                                        <View style={{ flex: 1, marginHorizontal: 20, justifyContent: 'center', marginTop: 26 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, color: '#9e9e9e', marginBottom: 10 }}>City</Text>
                                                <Text style={{ fontSize: 20, color: '#FF0000', marginBottom: 10 }}>*</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.cityModal()}>
                                                <View style={{ flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 }}>
                                                    <View style={{ flex: 0.9 }}>
                                                        {/* {this.clinicAddress.City ? <Text style={{ fontSize: 25, color: '#444444', fontFamily: "NotoSans" }}>{this.clinicAddress.City}</Text> : */}
                                                        <Text style={{ fontSize: 25, color: (this.state.city != "Select" ? '#444444' : '#717171'), fontFamily: (this.state.city != "Select" ? 'NotoSans-Bold' : 'NotoSans') }}>{this.state.city}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.1, alignItems: Platform.isPad ? 'flex-end' : 'center', justifyContent: 'center', marginVertical: 5, }}>
                                                        <Image source={ic_Select_city_dropdown} style={{ width: Platform.isPad ? 20 : 0, height: 10, resizeMode: 'contain' }} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>


                                        {!this.state.CityValid ? <Text style={{
                                            marginRight: 20,
                                            marginLeft: 20, color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12,
                                        }}>{this.state.msg2}</Text> : null}
                                        <View style={{ flex: 0.2, marginHorizontal: 20, marginTop: 26, }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, color: '#9e9e9e' }}>State</Text>
                                                <Text style={{ fontSize: 20, color: '#FF0000' }}>*</Text>
                                            </View>

                                            <TextInput
                                                defaultValue={this.state.selectState}
                                                returnKeyType="next"
                                               
                                                ref={(ref) => this.stateRef = ref}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.stateRef.focus(); this.checkAllFilled() }}

                                                onChangeText={(txt) => this.setState({ selectState: txt })}
                                                style={{
                                                    borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold',
                                                    borderBottomWidth: 1, fontSize: 25, marginBottom: 8
                                                }} />


                                        </View>
                                        {!this.state.StateValid ? <Text style={{
                                            marginRight: 20,
                                            marginLeft: 20, color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12,
                                        }}>{this.state.msg3}</Text> : null}
                                        <View style={{ flex: 0.2, marginHorizontal: 20, marginTop: 26, }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, color: '#9e9e9e' }}>Pincode</Text>
                                                <Text style={{ fontSize: 20, color: '#FF0000' }}>*</Text>
                                            </View>

                                            <TextInput
                                                defaultValue={this.clinicAddress.Pincode}
                                                returnKeyType="next"
                                                keyboardType="numeric"

                                                ref={(ref) => this.pin = ref}
                                                onSubmitEditing={() => { this.pin.focus(), this.checkAllFilled() }}
                                                maxLength={6}
                                                onChangeText={(txt) => this.setState({ selectPin: txt })}
                                                style={{
                                                    borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold',
                                                    borderBottomWidth: 1, fontSize: 25, marginBottom: 8
                                                }} />

                                        </View>
                                        {!this.state.pinValid ? <Text style={{
                                            marginRight: 20,
                                            marginLeft: 20, color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12,
                                        }}>{this.state.msg4}</Text> : null}
                                        <View style={{ flex: 0.2, justifyContent: 'center', marginHorizontal: 20, marginTop: 26 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, color: '#9e9e9e' }}>Contact Number</Text>
                                                <Text style={{ fontSize: 20, color: '#FF0000' }}>*</Text>
                                            </View>
                                            {/* <TextInput returnKeyType='next' maxLength={10} keyboardType='numeric' style={{ borderBottomColor: '#cccccc', color: '#444444', fontFamily: 'NotoSans-Bold', borderBottomWidth: 1, fontSize: 25, marginBottom: 8 }} /> */}

                                            {this.createContactField()}


                                            {!this.state.phoneValid ? <Text style={{
                                                color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12,
                                            }}>{this.state.msg5}</Text> : null}

                                        </View>

                                        <TouchableOpacity onPress={() => this.addanother()} style={{ paddingHorizontal: 20, alignSelf: 'baseline' }}>
                                            <Text style={{ textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', color: '#0c9bad', marginTop: 10, fontSize: 16 }}>Add another number</Text>
                                        </TouchableOpacity>


                                        {this.state.isFilled ?
                                            <TouchableOpacity onPress={() => this.onProceed("Clinic Address", "City", "State", "Pincode", "Contact number")} style={{ flex: 0.07, marginHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                                <LinearGradient colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                                                    <Text style={{ textAlign: 'center', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >PROCEED</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            : null}

                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                        {/* </ImageBackground> */}
                        <Modal
                            useNativeDriver={true}
                            animationDuration={200}
                            style={{ borderWidth: 0, width: '80%', borderRadius: 10, height: screenHeight / 1.6, overflow: 'hidden', justifyContent: 'center', margingTop: 30 }}
                             
                            ref={(ref) => this.modalCity = ref}
                            swipeToClose={false}
                            position={"center"}
                            //swipeToClose={this.state.swipeToClose}
                            onClosed={() => { this.close }}
                            onOpened={this.onOpen}
                            onClosingState={this.onClosingState}>
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, },
                                    shadowColor: '#dcdcdc', flexDirection: 'row',
                                    shadowOpacity: 2, borderBottomWidth: 2, paddingVertical: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <View style={{ flex: 0.9, paddingLeft: Platform.isPad ? 60 : 0 }}>
                                        <TextInput onChangeText={(txt) => this.searchCity(txt)} returnKeyType="next" style={{ fontSize: 20, textAlign: 'center', }} placeholder=" Search City" />

                                    </View>
                                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                        {this.state.arrayCity.length > 0 ? <Image source={Images.new_search} style={{ resizeMode: 'contain', height: 20, }} />
                                            : <TouchableOpacity onPress={() => { this.setCustomCity(); this.checkAllFilled() }}>
                                                <Image source={ic_add_blue} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                                            </TouchableOpacity>}

                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.arrayCity}
                                    extraData={this.state}
                                    renderItem={({ item, index }) => this.BindCity(item, index)}
                                    keyboardShouldPersistTaps="always"
                                    showsVerticalScrollIndicator={false} style={{ width: "100%" }}
                                    keyExtractor={(item, i) => i.toString()}
                                />

                            </View>
                        </Modal>
                        <Modal
                            useNativeDriver={true}
                            animationDuration={200}
                            style={{ borderWidth: 0, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 20, height: '32%', overflow: 'hidden', justifyContent: 'center' }}

                            ref={(ref) => this.modalGps = ref}
                            swipeToClose={false}
                            position={"bottom"}
                            //swipeToClose={this.state.swipeToClose}
                            onClosed={() => { this.close }}
                            onOpened={this.open}
                            onClosingState={this.onClosingState}>
                            <ImageBackground style={{ flex: 1 }} source={ic_White_BG_pop_up_578}>

                                <View style={{
                                    flex: 0.6,
                                    width: "100%", alignItems: 'flex-start', padding: 8
                                }}>
                                    <Text style={{ fontSize: 28, fontFamily: 'NotoSans', color: '#000', textAlign: 'left', padding: 5 }}>{this.state.message}
                                    </Text>
                                </View>

                                <View style={{ flex: 0.4, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => this.onProceedYes()} style={{ flex: 0.5 }}>
                                        <LinearGradient colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '80%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                                            <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >Yes</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.5, }} onPress={() => this.onProceedNo()}>
                                        <LinearGradient colors={["#ffffff", "#ffffff"]} start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '80%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderColor: '#07cef2', borderWidth: 1, borderRadius: 25 }}>

                                            <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: 17, color: '#07cef2', fontFamily: 'NotoSans-Bold' }} >No</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                </View>

                            </ImageBackground>
                        </Modal>

                    </View>
                    {
                        this.state.showToast ?
                            this.toast.show(


                                <ToastComponent
                                    {...this.props}

                                    textColorCode={this.state.toastTextColor}

                                    imagePath={this.state.toastImagePath}
                                    description={this.state.description}

                                />

                                , 1500) : null
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

                            backgroundColor: this.state.toastBgColor,


                            borderRadius: 15
                        }}
                        ref="toast" />
                </View>


            </View >

        )

    }
}
