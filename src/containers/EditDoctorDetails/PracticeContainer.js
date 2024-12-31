/****** code by ravi ******/
import React from 'react';
import { Edit_White_Icon, ic_icon_Edit_Button, ic_Blue_BG_578, lefticon, icon_profile_photo_edit_button, Purple_Blue_Icon } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, TouchableOpacity, Image, BackHandler} from "react-native";
import { generateGuid } from '../../commonmethods/common';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { connect } from "react-redux";
import PracticeComponent from '../../components/DoctorProfileComponent/PracticeComponent'
import { RNS3 } from 'react-native-aws3';
import { s3Config as config } from "../../../app.json";
import { updateDoctorDetails, setDoctorData, setClinicDetails } from '../../actions/doctorProfile';


class PracticeContainer extends React.Component {



    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            edit_vcsetup: 1,
            edit_clinic_setup: 1,
            doctorQualification: '',
            isEditClick: false,
            DoctorNameAfterEdit: ''
        };
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        }
        componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        }
        handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
        }
    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }

    componentDidMount()
    {
    multipleTapHandler.clearNavigator()

    }

    // if  edit video consultation setup have then show edit VCsetup view else show video consultation setup
    EditVCsetup() {
        if (this.state.edit_vcsetup != 0) {
            return (
                <TouchableOpacity>
                    <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, flex: 1 }}>Online Consultation </Text>
                            <TouchableOpacity onPress={() => {   multipleTapHandler.multitap(()=> this.VCnavigate(),"VCWhatsAppNumberContainer")}}>
                                <Image source={Purple_Blue_Icon} resizeMode="contain" style={{ height: 14, width: 14 }} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>
                            {/* {"\u20B9 " + this.props.doctorProfile.DoctorData.ConsultFee + " Consultation Fee, includes Audio and Video Calls."} */}
                            {this.props.doctorProfile.DoctorData.ConsultFee==0 ||this.props.doctorProfile.DoctorData.ConsultFee==undefined?"Consults conducted by either audio or video calls.":("Consultation Fee -"+" \u20B9 "+(this.props.doctorProfile.DoctorData.ConsultFee)+" (includes audio or video calls)")}

                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity>
                    <View style={{ shadowColor: '#000', shadowOffset: { height: 0.5 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 4, paddingVertical: 5, flexDirection: 'column', backgroundColor: '#fff', borderRadius: 8, marginRight: 5, marginStart: 8, paddingTop: 8, marginTop: 5, paddingHorizontal: 8, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, color: '#000000', paddingLeft: 5, }}>Setup Video Consultation?  </Text>

                            <TouchableOpacity onPress={() => { this.VCnavigate()}} style={{ backgroundColor: '#870b91', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, }}>
                                <Text uppercase={true} style={{ fontSize: 13, color: '#fff', fontFamily: 'NotoSans-Bold', backgroundColor: '#870b91' }}>setup</Text>
                            </TouchableOpacity>

                        </View>
                        <Text style={{ fontSize: 13, color: '#676767', paddingVertical: 3, paddingStart: 5 }}>Treating your patient in the comfort of their home {"\n"} has never been this easy !</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }
    DonePress() {
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
            <View >
                <View style={{
                    flexdirection: 'column', flex: 1, backgroundColor: '#fafafa'}}>
                    <PracticeComponent
                        {...this.props}
                        data={this.props.doctorProfile.DoctorData.ClinicAddresses}
                        edit_vcsetup={this.state.edit_vcsetup}
                        edit_clinic_setup={this.state.edit_clinic_setup}
                        EditVCsetup={() => this.EditVCsetup()}
                        Addclinicnavigate={() =>   multipleTapHandler.multitap(()=>this.Addclinicnavigate(),"AppointmentContainer")}
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

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PracticeContainer);