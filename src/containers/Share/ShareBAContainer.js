//  code by ravi
import React from 'react';
import { Container, } from "native-base";
import { View, } from "react-native";
import Images from '../../Theme/Images'
import HeaderData from '../../components/Header/header'
import { leftmenubg, lefticon, Profile_Image, ic_Blue_BG_578 } from '../../constants/images';
import ShareBAComponent from '../../components/Share/ShareBAComponent';
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


export default class ShareBAContainer extends React.Component {
    //Setting Screen to show in Setting Option

    constructor() {
        super();
        this.state = {
            isConsulting: false,
            pendingCunsultingTitle: false ? 'Showing pending consultations' : 'No consultation yet',
            pendingCunsultingDescription: '22 Video Consultations',
            isPendingCunsulting: false,

            //state to control the visibility of Tooltip
        };
    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }


    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }

    onNoMayBeLater() {

    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    onBookAppointmentClick() {

        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'Drawer' }]

        }));

    }


    RightImageOnClick() {
        this.props.navigation.navigate('CongratsClinicContainer')

    }


    render() {

        return (
            <View >
                <View style={{
                    flexdirection: 'column', flex: 1,
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
                            RightImageOnClick={() => this.RightImageOnClick()}
                            leftImageOnClick={() => this.leftImageOnClick()} />

                    </View>
                    <View>
                        <ShareBAComponent
                            {...this.props}
                            onBookAppointmentClick={() => this.onBookAppointmentClick()}

                        />
                    </View>
                </View>
            </View>

        );
    }
}
//It seems you are new to Prescrip Lets share your profile to invite your patients to book appointments
