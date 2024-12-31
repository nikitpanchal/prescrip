/// Pritish
import React, { Component } from 'react'
import { Container, Content, Header } from 'native-base'
import { Text, Dimensions, View, StatusBar, BackHandler, TouchableOpacity } from 'react-native'
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import ToastComponent from '../../components/Toast/toastComponent'
import { Black_back } from '../../constants/images';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font'
import Toast, { DURATION } from 'react-native-easy-toast'
let timer = null;

import {
    updatePatientOBHistory, addPatient, updatePatientDetails, setAllergyType, discardPatient, addNotes, getNotes,
    deleteNote
} from '../../actions/patientProfie';

import { setTooltipStatus } from '../../actions/tooltip';

import { setPrescription } from '../../actions/patientVisit'
import PatientNotesTab from '../../components/PatientProfileComponent/PatientNotesTab';
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader';
import Images from '../../Theme/Images';

class PatientNotes extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {

        }
    }

    //take notes on preint preview


    componentDidMount() {
        timer = setTimeout(() => {
            this.setState({
                showTooltip: true
            })
        }, 1000);

        multipleTapHandler.clearNavigator()

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }


    componentWillUnmount() {
        clearTimeout(timer);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator()
        this.props.navigation.goBack(null);
        return true;
    }



    OnClick(callFrom) {


        switch (callFrom) {
            case 'left':
                this.handleBackButtonClick();
                break;

        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
                {/** Header */}
                <PrescriptionWebViewHeader
                    {...this.props}
                    bgImage={null}
                    bgColor={'#ffffff'}
                    title={""}
                    description={this.props.patientProfile.patientDetails.CommonDetails.FullName + "'s Notes"}
                    titleColor={'#919191'}
                    descriptionColor={'#0b69d8'}
                    leftImage={Images.ic_black_back}
                    rightImage={""}
                    secondRightImage={""}


                    OnClick={(callFrom) => this.OnClick(callFrom)}


                />

                {/** Header Ends*/}
                <PatientNotesTab
                    {...this.props}

                    createNotesTooltip={this.props.createNotesTooltip}
                    showTooltip={this.state.showTooltip}
                    tooltipClck={() => this.props.setTooltipStatus({ ["createNotesTooltip"]: false })}

                ></PatientNotesTab>

            </View>
        )
    }



}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    patientProfile: state.patientProfile,
    patientvisit: state.patientvisit,
    createNotesTooltip: state.tooltip.toolTipStatus.createNotesTooltip,

});

const mapDispatchToProps = dispatch => ({
    setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),


    addPatient: (data) => dispatch(addPatient(data)),
    updatePatientOBHistory: (patientGender) => dispatch(updatePatientOBHistory(patientGender)),
    updatePatientDetails: (patientid, data) => dispatch(updatePatientDetails(patientid, data)),
    setAllergyType: (allergyType) => dispatch(setAllergyType(allergyType)),
    getNotes: (data) => dispatch(getNotes(data)),
    addNotes: (data) => dispatch(addNotes(data)),
    deleteNote: (data) => dispatch(deleteNote(data)),
    discardPatient: () => dispatch(discardPatient()),
    setPrescription: (data) => dispatch(setPrescription(data))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(PatientNotes));
