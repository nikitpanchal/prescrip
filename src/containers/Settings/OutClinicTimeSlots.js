import React,{ Component} from 'react';
import {Text,Dimensions,StatusBar,BackHandler,View} from 'react-native';
import {Container} from 'native-base';
import { connect } from "react-redux";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';
import SelectOutClinicTimes from '../../components/Settings/SelectOutClinicTimes';
import { Black_back, } from '../../constants/images';
import {get_appontment_timeslots} from '../../actions/appointments';
import {setSettingClinic,setOutOfClinicsSlots,setOutOfClinicsDateSlots,setOutOfClinicsTimeSlots,setOutOfClinic} from '../../actions/settings';
import {setDoctorData} from '../../actions/doctorProfile';

class OutClinicTimeSlots extends Component {
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
    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }
    render() {
        return (
            <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
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
                        rightImage={null}
                        rightImageCross={null}
                        isSearchBoxShowing={null}
                        type={5}
                        leftImageOnClick={() => this.leftImageOnClick()}
                        rightImageOnClick={null}
                    />
                    <SelectOutClinicTimes
                    {...this.props}/>
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
    get_appontment_timeslots:(data) => dispatch(get_appontment_timeslots(data)),
    setOutOfClinicsSlots:(data) => dispatch(setOutOfClinicsSlots(data)),
    setOutOfClinicsDateSlots:(slots) => dispatch(setOutOfClinicsDateSlots(slots)),
    setOutOfClinicsTimeSlots : (slots) => dispatch(setOutOfClinicsTimeSlots(slots)),
    setOutOfClinic:(data)=> dispatch(setOutOfClinic(data)),
    setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
    setSettingClinic : (clinic) => dispatch(setSettingClinic(clinic))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OutClinicTimeSlots);