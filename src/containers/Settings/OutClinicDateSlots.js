import React, { Component } from 'react';
import { Text, Image, StatusBar, BackHandler, View, Alert, Dimensions } from 'react-native';
import { Container } from 'native-base';
import { connect } from "react-redux";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';
import SelectOutClinicDates from '../../components/Settings/SelectOutClinicDates';
import { Black_back, ic_remove_out_of_clinic } from '../../constants/images';
import { get_away_appontment_timeslots } from '../../actions/settings';
import { setSettingClinic, setOutOfClinicsSlots, setOutOfClinicsDateSlots, setOutOfClinicsTimeSlots, setOutOfClinic } from '../../actions/settings';
import { setDoctorData } from '../../actions/doctorProfile';

class OutClinicDateSlots extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator()
        this.props.navigation.goBack(null);
        return true;
    }
    confrimDelete() {
        Alert.alert("Prescrip", `Do you want to remove Out of Clinic for ${this.props.settings.selectedClinic.ClinicName}`, [
            {
                text: 'No ',
                style: 'cancel',
            },
            {
                text: 'Yes',

                onPress: () => {
                    this.resetOutOfClinic();
                },
            },
        ])
    }
    resetOutOfClinic() {
        let data = {
            slotIds: [],
            doctorId: this.props.doctorProfile.DoctorData._id,
            slotTimes: [],
            type: 1,
            active: 0,
            clinicId: this.props.settings.selectedClinic.ClinicId
        };
        this.props.setOutOfClinic(data).then((response) => {
            if (response.payload.data.status == 1) {
                let doctorData = JSON.parse(
                    JSON.stringify(this.props.doctorProfile.DoctorData),
                );
                let index = doctorData.ClinicAddresses.findIndex(c => {
                    if (c.ClinicId == this.props.settings.selectedClinic.ClinicId) {
                        return c;
                    }
                });
                let clinic = doctorData.ClinicAddresses[index];
                doctorData.ClinicAddresses[index] = { ...clinic };
                this.props.setDoctorData(doctorData);
                this.props.setSettingClinic(clinic);
                //call on edit
                multipleTapHandler.clearNavigator();
                this.props.navigation.goBack(null);

            }


        });
    }
    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }
    render() {
        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#dcdcdc" />
                <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    <SettingsHeader
                        {...this.props}
                        bgImage={null}
                        bgColor={'white'}
                        cursorColor={"#0869d8"}
                        tintColor={"#0b69d8"}
                        description={this.props.settings.selectedClinic.ClinicName}
                        subtitle={"What would be your preferred time?"}
                        titleColor={null}
                        descriptionColor={'#3D3D3D'}
                        placeholderTextColor={'black'}
                        placeTextColor={'black'}
                        placeholderTextSize={20}
                        leftImage={Black_back}
                        rightImage={this.props.settings.selectedClinic.IsDoctorAway == 1 ? ic_remove_out_of_clinic : null}
                        rightImageCross={null}
                        isSearchBoxShowing={null}
                        type={5}
                        leftImageOnClick={() => this.leftImageOnClick()}
                        rightImageOnClick={() => this.confrimDelete()}
                    />
                    <SelectOutClinicDates
                        {...this.props} />
                </View>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    settings: state.settings


});

const mapDispatchToProps = dispatch => ({
    get_away_appontment_timeslots: (data) => dispatch(get_away_appontment_timeslots(data)),
    setOutOfClinicsSlots: (data) => dispatch(setOutOfClinicsSlots(data)),
    setOutOfClinicsDateSlots: (slots) => dispatch(setOutOfClinicsDateSlots(slots)),
    setOutOfClinicsTimeSlots: (slots) => dispatch(setOutOfClinicsTimeSlots(slots)),
    setOutOfClinic: (data) => dispatch(setOutOfClinic(data)),
    setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
    setSettingClinic: (clinic) => dispatch(setSettingClinic(clinic))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OutClinicDateSlots);