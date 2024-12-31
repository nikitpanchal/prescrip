import React from 'react';
import { leftmenubg, ic_icon_Edit_Button, lefticon, For_Clinic_Appointments, ic_Blue_BG_578 } from '../../constants/images';
import { Container, Text, } from "native-base";
import { View, TouchableOpacity, Image, BackHandler } from "react-native";
import Images from '../../Theme/Images'
import HeaderData from '../../components/Header/header'
import DoctorClinicAPComponent from '../../components/CongratsClinic/DoctorClinicAPComponent';

import multipleTapHandler from '../../components/MultiTapHandle/index';

import { StackActions, CommonActions } from '@react-navigation/native';


const DATA = [{
    id: '1',
    name: 'Sourabh Patil',
    year: '2',
    gender: 'Male',
    day: '3',
}, {
    id: '2',
    name: 'Pritish Patil',
    year: '3',
    gender: 'Male',
    day: '3',
}, {
    id: '3',
    name: 'Ravi',
    year: '5',
    gender: 'Male',
    day: '3',
}, {
    id: '4',
    name: 'Ruben',
    year: '4',
    gender: 'Male',
    day: '1',
}, {
    id: '1',
    name: 'Sourabh Patil',
    year: '2',
    gender: 'Male',
    day: '3',
}, {
    id: '2',
    name: 'Pritish Patil',
    year: '3',
    gender: 'Male',
    day: '3',
}, {
    id: '3',
    name: 'Ravi',
    year: '5',
    gender: 'Male',
    day: '3',
}, {
    id: '4',
    name: 'Ruben',
    year: '4',
    gender: 'Male',
    day: '1',
}];


export default class DoctorClinicAPContainer extends React.Component {
    //Setting Screen to show in Setting Option

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            isConsulting: false,
            pendingCunsultingTitle: false ? 'Showing pending consultations' : 'No consultation yet',
            pendingCunsultingDescription: '22 Video Consultations',
            isPendingCunsulting: false,

            //state to control the visibility of Tooltip
        };
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

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

    onViewAsPatient() {
        this.props.navigation.navigate('PatientClinicAPContainer')
    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }


    onShareClick() {
        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'Drawer', params: { foo: true, introScreen: '' } }]

        }));

    }
    render() {
        return (

            <View >

                <View style={{
                    flexdirection: 'column', flex: 1, backgroundColor: '#fafafa',
                }}>

                    <View>
                        <HeaderData
                            {...this.props}
                            bgImage={ic_Blue_BG_578}
                            imagePath={Images.ic_profile_dummy_image}
                            title={"Dr. Sourabh\nPatil"}
                            description={"General/Family Physician"}
                            onGotIt={() => this.onGotIt()}
                            leftImage={lefticon}
                            rightImage={ic_icon_Edit_Button}
                            rightImageName={"Edit"}
                            type={3}
                            leftImageOnClick={() => this.leftImageOnClick()} />

                    </View>
                    <View style={{ flexDirection: 'column', position: 'relative', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 10, backgroundColor: '#fafafa', paddingHorizontal: 15, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, }}>
                            <Image style={{
                                resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                            }} source={For_Clinic_Appointments} />

                            <Text style={{ fontSize: 14, color: '#ed353a', paddingLeft: 5, }}>Clinic(s) For In Person Appointments  </Text>
                        </View>
                    </View>

                    <DoctorClinicAPComponent

                        {...this.props}


                    />

                    <View style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row', position: 'absolute', zIndex: 0, bottom: 0,
                        width: '100%', paddingHorizontal: 10, backgroundColor: '#fff', paddingVertical: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.onViewAsPatient() }}
                            style={{ width: '45%', borderRadius: 25, paddingVertical: 3, justifyContent: 'center', alignItems: 'center', borderColor: '#176dd8', borderWidth: 1, }} >
                            <Text uppercase={true} style={{ fontSize: 14, letterSpacing: 0.8, color: '#176dd8', fontFamily: 'NotoSans-Bold', alignSelf: 'center' }}>VIEW AS {"\n"}PATIENT</Text>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.onShareClick() }}
                            style={{ width: '45%', borderRadius: 25, backgroundColor: "#26b82d", paddingVertical: 12, justifyContent: 'center', alignItems: 'center', }} >
                            <Text uppercase={true} style={{ fontSize: 14, color: "#fff", fontFamily: 'NotoSans-Bold' }}>SHARE</Text>

                        </TouchableOpacity>

                    </View>
                </View>
            </View>

        );
    }
}
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
