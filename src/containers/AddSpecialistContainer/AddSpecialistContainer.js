//   code by ravi
import React, { Component } from "react"
import { View, TouchableOpacity, Image, StatusBar, Dimensions, TextInput, ScrollView, Platform, Alert } from 'react-native'
import { Container, Text, Input } from 'native-base'
import AddSpecialistComponent from '../../components/AddSpecialistComponent/AddSpecialistComponent'
import { gray_search, ic_close_button, save_btn_green, ic_add_blue, ic_upload_image_inactive, ic_upload_image_tab_active, Spec_Check_Active, Spec_Check_Non_Active } from '../../constants/images'
import { connect } from "react-redux";
import Images from '../../Theme/Images'
import Modal from "react-native-modalbox";
import { withDb } from "../../DatabaseContext/withDatabase";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { isNameValid, isEmailValid, isPhoneno, isAddressValid, isPincodeValid, isValidContactNo, isCityValid, isStateValid, isRegistrationValid, isSpecializationValid } from '../../commonmethods/validation';
import styles from "./styles";
import Contacts from 'react-native-contacts';
import ContactModal from '../../components/CommonComponents/ContactModal'
import { setspecialistdata } from '../../actions/patientVisit'

class AddSpecialistContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NAME: '',
            EMAIL: '',
            MOBILE: '',
            PINCODE: '',
            CITY: '',
            STATE: '',
            ADDRESS: '',
            REGISTRATION_NO: '',
            LANDLINE_NO: '',
            primaryselect: 'Select',
            secondryselect: 'Select',
            arrayPrimary_Spec: ['Dentist', 'CardioLogist', 'Dermatologist', 'Diabetologist', 'Hepatologist', 'Dermatologist', 'Diabetologist', 'Hepatologist'],
            arraySecondory_Spec: ['Dentist', 'CardioLogist', 'Dermatologist', 'Diabetologist', 'Hepatologist', 'Dermatologist', 'Diabetologist', 'Hepatologist'],
            srchText: '',
            specialistdata: {},
            
            LocationName: '',
            deviceHeight: Dimensions.get('window').height,
            errorFields: {
                specialist: {
                    err: false,
                    NAME: '',
                    EMAIL: '',
                    MOBILE: '',
                    PINCODE: '',
                    CITY: '',
                    STATE: '',
                    ADDRESS: '',
                    REGISTRATION_NO: '',
                    LANDLINE_NO: '',
                }
            },
            contactloading: false,
            contactList: [],
            arrayPrimary_Spec: [],
            specArray: [],
            contactModalOpen: false

        };
        this.contactmodal = React.createRef()
        this.searchCntList = [];
        this.Contactsearchtxt = "";
        this.searchspcList = [];
        this.specializationlist = null;
        this.primary = React.createRef();
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

        this.getDataforSpecialization();
    }
    getContactDetails(data) {
        let name = data.Name;
        let mobile = data.Phone;

    }
    //db
    getDataforSpecialization() {

        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT Data FROM MasterData where Srno=2", [], (tx, results) => {
                if (results.rows.length > 0) {
                    this.specializationlist = JSON.parse(results.rows.raw()[0].Data).Value;


                    this.setState({ specArray: this.specializationlist }, () => {
                    })
                    resolve(specializationlist);
                }
            }, (error) => {
                resolve(specializationlist);
            });
        });
    }

    onDataChanges(key, value) {
        this.state.specialistdata[key] = value;
Alert.alert(key)
        this.setState({
            specialistdata: this.state.specialistdata
        })
    }

    searchSpecilialization(text) {

        if (text) {
            let newData = this.state.specArray.filter(item => {

                return item[1].indexOf(text) > -1;
            });

            this.setState({ specArray: newData }, () => {
                this.forceUpdate();
            });

        } else {
            this.setState({ specArray: this.specializationlist }, () => {
                this.forceUpdate();
            })
        }
        this.setState({
            srchText: text
        });
    }

    BindPrimary_Spec() {
        {
            var content = this.state.specArray.map(item => {
                return (
                    <TouchableOpacity onPress={() => {
                        this.onDataChanges("PrimarySpecialization", item[1])
                        this.primary.close();
                        this.setState({ specArray: this.specializationlist }, () => {
                            this.forceUpdate();
                        })
                    }}>
                        <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1, alignItems: 'flex-start', paddingStart: 8 }}>
                            <Text style={{ fontSize: 18, height: 50, fontFamily: 'NotoSans', paddingTop: 8, color: '#000' }}>{item[1]}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
            return content
        }
    }

    showPrimarySpecialization() {
        this.setState({ specArray: this.specializationlist }, () => {
            this.forceUpdate();
        })
        this.primary.open();
    }
    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }
    submit() {
        // this.validateInputs()

        this.updatespecialist();
    }
    //On Data changes in Child Component
    validateInputs() {
        let isEmail = isEmailValid(this.state.specialistdata.EMAIL)
        let isMobile = isPhoneno(this.state.specialistdata.MOBILE)
        let isName = isNameValid(this.state.specialistdata.NAME)
        // let isSPECIALIZATION = this.state.specialistdata.SPECIALIZATION
        if (isEmail.isvalid && isMobile.isvalid && isName.isvalid) {
            this.state.errorFields.specialist.err = false
        } else {
            this.state.errorFields.specialist.err = true
        }
        if (!isEmail.isvalid) {
            this.state.errorFields.specialist.EMAIL = "Please enter valid Email Address"
        } else {
            this.state.errorFields.specialist.EMAIL = ""
        }
        if (!isMobile.isvalid) {
            this.state.errorFields.specialist.MOBILE = "Please enter valid Mobile number"
        } else {
            this.state.errorFields.specialist.MOBILE = ""
        }
        if (!isName.isvalid) {
            this.state.errorFields.specialist.NAME = "Please enter  Name"
        } else {
            this.state.errorFields.specialist.NAME = ""
        }
        // if (isSPECIALIZATION == "") {
        //     this.state.errorFields.specialist.SPECIALIZATION = "Please select specialization"
        // } else {
        //     this.state.errorFields.specialist.SPECIALIZATION = ""
        // }
        this.setState({
            errorFields: this.state.errorFields
        }, () => {
            if (!this.state.errorFields.specialist) {
                this.updatespecialist();
            }
        })
    }

    updatespecialist() {


        let data = {
            "name": this.state.specialistdata.NAME,
            "mobile": this.state.specialistdata.MOBILE,
            "emailid": this.state.specialistdata.EMAIL,
            "primaryspecialization": this.state.specialistdata.SPECIALIZATION,
            "address": this.state.specialistdata.ADDRESS,
            "pincode": this.state.specialistdata.PINCODE,
            "city": this.state.specialistdata.CITY,
            "state": this.state.specialistdata.STATE,
            "landlineno": this.state.specialistdata.LANDLINE_NO,
            "registrationno": this.state.specialistdata.REGISTRATION_NO,
            countryCode:  this.state.specialistdata.countryCode,
        }


        this.props.setspecialistdata(data)
    }

    open() {
        this.setState({
            contactModalOpen: !this.state.contactModalOpen
        })
    }


    render() {
        const screenHeight = Dimensions.get('window').height
        dHeight = this.state.deviceHeight

        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff"
                    />
                    <View style={{ backgroundColor: '#fff', justifyContent: 'space-between', marginTop: 22, flex: 0.07, flexDirection: 'row', alignContent: 'center', paddingHorizontal: 14, paddingBottom: 5, borderBottomColor: '#dedede', borderBottomWidth: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <TouchableOpacity onPress={this.Navigateback}>
                                <Image source={ic_close_button} style={{ height: 18, width: 18, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, paddingStart: 15, color: '#636363' }}>Add Specialist</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.submit()} style={{ alignSelf: 'center' }}>

                            <Image source={save_btn_green} style={{ height: 25, width: 25, resizeMode: 'contain', }} />
                        </TouchableOpacity>
                    </View>
                    <AddSpecialistComponent
                        {...this.props}
                        onDataChanges={(key, value) => this.onDataChanges(key, value)}
                        specArray={this.state.specArray}
                        showSecondarySpec={() => this.showSecondarySpecialization()}
                        primaryselect={this.state.primaryselect}
                        specialistdata={this.state.specialistdata}
                        errorFields={this.state.errorFields.specialist}
                        openmodal={() => this.open()}
                        closemodal={() => { this.closeModal() }}
                        showPrimarySpec={() => this.showPrimarySpecialization()}
                        modalopen={() => this.openModel()}
                        onFocusgetData={() => this.onFocusgetData(1)}
                    />
                    <ContactModal
                        {...this.props}
                        openmodal={() => this.open()}
                        contactModalOpen={this.state.contactModalOpen}
                        getContactDetails={(data) => { this.getContactDetails(data) }}
                    />
                </View>

                {/* <Modal useNativeDriver={true} animationDuration={200} style={{ borderWidth: 0, width: '80%', height: dHeight - 240, justifyContent: 'center' }}
                        ref={"modal2"} position={"center"} //swipeToClose={this.state.swipeToClose}
                        onClosed={this.onClose} onOpened={this.onOpen} onClosingState={this.onClosingState}>
                        <View style={{ flex: 1 }}>
                            <View style={{ borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, }, shadowColor: '#dcdcdc', shadowOpacity: 2, borderBottomWidth: 2, padding: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center' }}>
                                <Text style={[styles.text, { shadowOpacity: 0 }]}> Select a Contact</Text>
                            </View>
                            <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                                <View style={{ flexDirection: "row", borderBottomColor: '#eee', borderBottomWidth: 2, width: '100%', paddingRight: 5 }}>
                                    <Input style={{}}
                                        placeholder="Search"
                                        maxLength={20}
                                        onChangeText={text => this.onChangeTextfilter(text)}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {this.BindData()}

                        </View>
                    </Modal> */}




                {/*Primary Specialization*/}
                <Modal
                    translucent={true}
                    useNativeDriver={true}
                    animationDuration={80}
                    style={{
                        borderWidth: 0, width: '80%', borderRadius: 10, height: screenHeight / 1.6, overflow: 'hidden', marginTop: 30
                    }}
                    ref={(ref) => this.primary = ref}
                    swipeToClose={false}
                    transparent={true}
                    position={"center"}

                    onClosed={() => { this.close }}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>
                    <View style={{ flex: 1 }}>

                        <View style={{
                            borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, },
                            shadowColor: '#dcdcdc', flexDirection: 'row',
                            shadowOpacity: 2, borderBottomWidth: 2, paddingVertical: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center', alignItems: 'center'
                        }}>
                            <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                                <TextInput onChangeText={(txt) => this.searchSpecilialization(txt)} style={{ fontSize: 16, textAlign: 'center' }} placeholder=" Select Primary Specialization" />

                            </View>

                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                {this.state.arrayPrimary_Spec.length > 0 ? <Image source={gray_search} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                                    :
                                    <TouchableOpacity>
                                        {/* <Image source={ic_add_blue} style={{ resizeMode: 'contain', height: 25, width: 25 }} /> */}
                                    </TouchableOpacity>}

                            </View>
                        </View>
                        <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                            {this.BindPrimary_Spec()}
                        </ScrollView>
                    </View>
                </Modal>
                {/*Ends*/}


            </View>
        )
    }

}
const mapStateToProps = state => ({
    patientvisit: state.patientvisit,

});

const mapDispatchToProps = dispatch => ({
    setspecialistdata: (specialistdata) => dispatch(setspecialistdata(specialistdata)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(AddSpecialistContainer));