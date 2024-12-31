/****** code by ravi ******/
import React from 'react';
import { Purple_Blue_Icon } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, TouchableOpacity, Image, BackHandler, Dimensions } from "react-native";
import { generateGuid } from '../../commonmethods/common';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { connect } from "react-redux";
import PracticeComponent from '../../components/DoctorProfileComponent/PracticeComponent'
import { RNS3 } from 'react-native-aws3';
import { s3Config as config } from "../../../app.json";
import { updateDoctorDetails, setDoctorData, setClinicDetails, addClinicAddresses } from '../../actions/doctorProfile';


class PracticeContainer extends React.Component {



    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            edit_vcsetup: this.props.doctorProfile.DoctorData.DigitalConsult ? this.props.doctorProfile.DoctorData.DigitalConsult : 0,
            edit_clinic_setup: this.props.doctorProfile.DoctorData.ClinicAddresses ? this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0 ? 1 : 0 : 0,
            doctorQualification: '',
            isEditClick: false,
            DoctorNameAfterEdit: ''
        };
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }
    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack(null);
        return true;
    }
    // if  edit video consultation setup have then show edit VCsetup view else show video consultation setup
    EditVCsetup() {
        if (this.state.edit_vcsetup != 0) {
            return (

                <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, flex: 1 }}>Online Consultation </Text>
                        {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                            (this.props.doctorProfile.DoctorData.RoleId == 3 || this.props.doctorProfile.DoctorData.RoleId == 1) ? <TouchableOpacity style={{ paddingStart: 10 }} onPress={() => {
                                multipleTapHandler.multitap(() => this.VCnavigate(), "VCWhatsAppNumberContainer")
                            }}>
                            <Image source={Purple_Blue_Icon} resizeMode="contain" style={{ height: 14, width: 14 }} />
                        </TouchableOpacity> : null
                        }
                    </View>
                    <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>
                        {this.props.doctorProfile.DoctorData.ConsultFee == 0 || this.props.doctorProfile.DoctorData.ConsultFee == undefined ? "Consults conducted by either audio or video calls." : ("Consultation Fee -" + " \u20B9 " + (this.props.doctorProfile.DoctorData.ConsultFee) + " (includes audio or video calls)")}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, }}>Setup Video Consultation?  </Text>
                        {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                            this.props.doctorProfile.DoctorData.RoleId == 3 ?
                            <TouchableOpacity onPress={() => {
                                this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
                                    (this.props.doctorProfile.DoctorData.RoleId == 3 || this.props.doctorProfile.DoctorData.RoleId == 1) ? this.VCnavigate() : null
                            }} style={{ backgroundColor: '#870b91', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, }}>
                                <Text uppercase={true} style={{ fontSize: 13, color: '#fff', fontFamily: 'NotoSans-Bold', backgroundColor: '#870b91' }}>setup</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>Treating your patient in the comfort of their home {"\n"} has never been this easy !</Text>
                </View>
            );
        }
    }
    DonePress() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack();
    }

    VCnavigate() {
        this.props.navigation.navigate('VCWhatsAppNumberContainer');
    }

    Addclinicnavigate() {
        this.props.setClinicDetails(null);
        this.props.navigation.navigate('AppointmentContainer');

    }

    render() {
        return (

            <View contentContainerStyle={{ flex: 1 }}
                style={{ flex: 1 }}>
                <View style={{
                    flexdirection: 'column', flex: 1, backgroundColor: '#fafafa', width: Dimensions.get('window').width
                }}>
                    <PracticeComponent
                        {...this.props}
                        data={this.props.doctorProfile.DoctorData.ClinicAddresses}
                        edit_vcsetup={this.state.edit_vcsetup}
                        edit_clinic_setup={this.state.edit_clinic_setup}
                        EditVCsetup={() => this.EditVCsetup()}
                        Addclinicnavigate={() => multipleTapHandler.multitap(() => this.Addclinicnavigate(), "AppointmentContainer")}
                        doctorQualification={this.state.doctorQualification}
                    />
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile

});

const mapDispatchToProps = dispatch => ({
    updateDoctorDetails: (objectValue, objectKey, doctorId) => dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
    setDoctorData: (docorData) => dispatch(setDoctorData(docorData)),
    setClinicDetails: (clinicAddress) => dispatch(setClinicDetails(clinicAddress)),
    addClinicAddresses: (data) => dispatch(addClinicAddresses(data))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PracticeContainer);