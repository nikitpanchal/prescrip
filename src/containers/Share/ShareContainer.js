// ravi Code
import React from 'react';
import { leftmenubg, ic_icon_Edit_Button, ic_Blue_BG_578, lefticon } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, TouchableOpacity, Dimensions } from "react-native";
import Images from '../../Theme/Images'
import HeaderData from '../../components/Header/header'
import ShareComponent from '../../components/Share/ShareComponent';
import multipleTapHandler from '../../components/MultiTapHandle/index';


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


export default class ShareContainer extends React.Component {
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

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }


    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }

    RightImageOnClick() {
        this.props.navigation.navigate('ShareBAContainer')


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
                            imagePath={Images.ic_profile_dummy_image}
                            title={"Dr. Sourabh\nPatil"}
                            description={"General/Family Physician"}
                            onGotIt={() => this.onGotIt()}
                            leftImage={lefticon}
                            rightImage={ic_icon_Edit_Button}
                            type={3}
                            rightImageName={"Edit"}
                            leftImageOnClick={() => this.leftImageOnClick()}

                        />


                    </View>



                    <View>
                        <ShareComponent />


                    </View>
                    <View style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row', position: 'absolute', zIndex: 0, bottom: 0,
                        width: Dimensions.get('window').width, paddingHorizontal: 10, marginTop: 30, backgroundColor: '#fff', paddingVertical: 15
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.RightImageOnClick() }}
                            style={{ width: '45%', borderRadius: 25, paddingVertical: 3, justifyContent: 'center', alignItems: 'center', borderColor: '#176dd8', borderWidth: 1, }} >
                            <Text uppercase={true} style={{ fontSize: 14, color: '#176dd8', fontFamily: 'NotoSans-Bold', alignSelf: 'center' }}>view as{"\n"}patient</Text>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.props.onClick() }}
                            style={{ width: '45%', borderRadius: 25, backgroundColor: "#26b82d", paddingVertical: 15, justifyContent: 'center', alignItems: 'center', }} >
                            <Text uppercase={true} style={{ fontSize: 14, color: "#fff", fontFamily: 'NotoSans-Bold' }}>share</Text>

                        </TouchableOpacity>

                    </View>
                </View>
            </View>

        );
    }
}
