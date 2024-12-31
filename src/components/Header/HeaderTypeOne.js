/****** code by Sourabh ******/

import React, { Component } from "react";
import { View, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, StatusBar, Image, Text, SafeAreaView,Dimensions } from "react-native";
import { Black_back, tooltip_Notes } from '../../constants/images'
import multipleTapHandler from '../../components/MultiTapHandle/index';



import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
export default class HeaderTypeOne extends Component {


    handleBackButtonClick() {
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack();
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }
    render() {
        let { label, subtext, navigation, statusBarHeight } = this.props
        return (
            <View style={{ justifyContent: 'center', flexdirection: 'row',  width: Dimensions.get('window').width }}>

                <SafeAreaView>
                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        paddingVertical: 13,
                        borderBottomColor: '#d9d9d9',
                        borderBottomWidth: 2,
                        top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                        marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                    }} >


                        <TouchableWithoutFeedback onPress={() => this.handleBackButtonClick()}>
                            <View style={styles.imagecont}>
                                <Image source={Black_back} resizeMode={"contain"} style={{ width: 25, height: 22 }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.textcont}>
                            <Text style={styles.subtext}>{subtext}</Text>
                            <Text style={[styles.main, { color: (this.props.textColor ? this.props.textColor : "#0065d7") }]}>{label}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>


                            {this.props.showTooltip  && this.props.NotesTooltip ?


                                <TouchableOpacity
                                onPress={() => { this.props.tooltipClck() }}
                                >
                                    <Tooltip
                                        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                        animated={true}
                                        isVisible={this.props.NotesTooltip}
                                        backgroundColor={"rgba(0,0,0,0)"}
                                        contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
                                        tooltipStyle={{ right: 10, alignItems: 'flex-end' }}

                                        content={<TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                                        onPress={() => { this.props.tooltipClck() }}
                                        >
                                            <AddPatient
                                                imagePath={tooltip_Notes}
                                               isLottie ={true}
                                                //imagePath={tooltip_PatientList}
                                                title={"Add Notes"}
                                                description={"Click here to add and maintain history of notes for your patient."}


                                            />
                                        </TouchableOpacity>}
                                        //(Must) This is the view displayed in the tooltip
                                        placement="bottom"
                                        //(Must) top, bottom, left, right, auto.
                                        onClose={() => { this.props.tooltipClck() }}
                                    //    onClose={() => this.props.tooltipClck}
                                    //(Optional) Callback fired when the user taps the tooltip
                                    >



                                        <Image source={this.props.rightImage} style={{ resizeMode: 'contain',right :10, height: 25, width: 25 }} />

                                    </Tooltip>
 
                                </TouchableOpacity>
 
                                :  

                                <TouchableWithoutFeedback onPress={this.props.rightImageClick} >
                                    <Image source={this.props.rightImage} style={{ resizeMode: 'contain',right :10, height: 25, width: 25 }} />
                                </TouchableWithoutFeedback>
                            
                            }
                        </View>

                    </View>

                </SafeAreaView>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 13,
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 2,

    },
    subtext: { color: '#919191', fontSize: 12, textTransform: 'uppercase' },
    main: { fontSize: 22, },
    imagecont: { justifyContent: 'center', },
    textcont: { flex: 0.95, paddingStart: 12 }
})