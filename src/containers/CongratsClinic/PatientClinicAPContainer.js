//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
//import all the basic component we have used
import { leftmenubg, lefticon, Profile_Image, For_Clinic_Appointments, ic_Blue_BG_578 } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, Image, BackHandler } from "react-native";
import Images from '../../Theme/Images'
import HeaderData from '../../components/Header/header'
import PatientClinicAPComponent from '../../components/CongratsClinic/PatientClinicAPComponent';

import multipleTapHandler from '../../components/MultiTapHandle/index';

import { StackActions, CommonActions } from '@react-navigation/native';

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

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }



    onBookAppointmentClick() {
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
                            imagePath={Profile_Image}
                            title={"Dr. Sourabh\nPatil"}
                            description={"General/Family Physician"}
                            onGotIt={() => this.onGotIt()}
                            leftImage={lefticon}
                            rightImage={Images.ic_share_button}
                            type={3}
                            leftImageOnClick={() => this.leftImageOnClick()}

                        />
                    </View>
                    <View style={{ flexDirection: 'column', position: 'relative', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 10, backgroundColor: '#fafafa', paddingHorizontal: 15, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10, }}>
                            <Image style={{
                                resizeMode: "contain", width: 25, height: 25, alignSelf: 'center'
                            }} source={For_Clinic_Appointments} />

                            <Text style={{ fontSize: 15, color: '#ed353a', paddingLeft: 5, }}>Book In Person Appointments  </Text>
                        </View>
                    </View>
                    <PatientClinicAPComponent
                        {...this.props}
                        onBookAppointmentClick={() => this.onBookAppointmentClick()}


                    />




                </View>
            </View>

        );
    }
}
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
