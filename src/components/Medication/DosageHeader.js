//Created by Pritish on 3/09/2020
//Custom UI Header File for medicine selection
import Capsule from '../../components/Capsule';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Icon } from 'native-base';
import Images from '../../Theme/Images'
import { ic_close_button, ic_med_edit, ic_dosage_reminder, Duration, tooltip_medication } from '../../constants/images';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font'
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/FontAwesome";

import { delete_icon, Tooltip_Edit_Icon, ic_Add_Clinic_Button } from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';
import { connect } from 'react-redux'


class DosageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

            currentView: 'Dosage Form',
            dosageFlow: [
                {
                    name: this.props.dosage.medicine.form[0],
                    selected: false,
                    value: '',
                    valueIndex: this.props.dosage.medicine.form[1]
                },
                {
                    name: this.props.dosage.medicine.brand[0],
                    selected: false,
                    value: '',
                    valueIndex: this.props.dosage.medicine.brand[1]
                },
                {
                    name: this.props.dosage.medicine.dose[0],
                    selected: false,
                    value: '',
                    valueIndex: this.props.dosage.medicine.dose[1]
                },
                {
                    name: this.props.dosage.medicine.regimen[0],
                    selected: false,
                    value: '',
                    valueIndex: this.props.dosage.medicine.regimen[1]
                },
                {
                    name: this.props.dosage.medicine.duration[0],
                    selected: false,
                    value: '',
                    valueIndex: this.props.dosage.medicine.duration[1]
                }

            ]
        }
        this.showIndex = 0;

    }
    closeView() {
        this.props.navigation.pop();
        this.props.resetMedicine();
        //this.props.navigation.navigate('ListMedication')
    }
    setSelectedView(item, index) {
        if (item.name == 'Brand Name') {
            if (this.props.dosage.medicine.form[0] == null) {
                if (this.props.dosage.medicine.brand[1] == -1) {
                    this.props.setupToast({
                        toastTextColor: '#ffffff',
                        toastImgPath: Images.Error,
                        description: "Please select a dosage form",
                        toastBgColor: '#d9541d',
                        showToast: true,

                    })
                    setTimeout(() => {
                        this.props.setupToast({
                            toastTextColor: '#ffffff',
                            toastImgPath: Images.Error,
                            description: "",
                            toastBgColor: '#d9541d',
                            showToast: false,

                        })
                    }, 2000);
                    return;

                }
            }
        }

        if (item.name != 'Dosage Form' && item.name != 'Brand Name') {
            if (this.props.dosage.medicine.brand[1] == -1) {
                this.props.setupToast({
                    toastTextColor: '#ffffff',
                    toastImgPath: Images.Error,
                    description: "Please select a brand first",
                    toastBgColor: '#d9541d',
                    showToast: true,

                })
                setTimeout(() => {
                    this.props.setupToast({
                        toastTextColor: '#ffffff',
                        toastImgPath: Images.Error,
                        description: "Please select a brand first",
                        toastBgColor: '#d9541d',
                        showToast: false,

                    })
                }, 2000);
                return
            }
            this.props.setCurrentDosageView(item.name);
        }
        else {
            this.props.setCurrentDosageView(item.name);
        }

        //this.props.setCurrentDosageView(item.name);
    }
    componentDidMount() {
        this.renderDosagePath(this.state.currentView);
    }
    renderDosagePath(view) {
        switch (view) {
            case 'Dosage Form':
                this.showIndex = 0;
                break;
            case 'Brand Name':
                this.showIndex = 0;
                break;
            case 'Dose':
                this.showIndex = 2;
                break;
            case 'Dose Regime':
                this.showIndex = this.props.dosage.medicine.form[3] == 1 ? 4 : 3;
                break;
            case 'Duration':
                this.showIndex = 4;
                break;


        }
        //IMPROVE
        let dosageFlow = [
            {
                name: 'Dosage Form',
                selected: false,
                value: this.props.dosage.medicine.form[0] ? this.props.dosage.medicine.form[0] : null,
                valueIndex: this.props.dosage.medicine.form[1],
                visible: true,
            },
            {
                name: 'Brand Name',
                selected: false,
                value: this.props.dosage.medicine.brand[1] != -1 ? this.props.dosage.medicine.brand[1] : null,
                valueIndex: this.props.dosage.medicine.brand[1],
                visible: true,
            },
            {
                name: 'Dose',
                selected: false,
                value: this.props.dosage.medicine.dose[0] ? this.props.dosage.medicine.dose[0] : null,
                valueIndex: this.props.dosage.medicine.dose[1],
                visible: this.props.dosage.medicine.form[3] == 1 ? false : true,
            },
            {
                name: 'Dose Regimen',
                selected: false,
                value: this.props.dosage.medicine.regimen[0] ? this.props.dosage.medicine.regimen[0][0] : null,
                valueIndex: this.props.dosage.medicine.regimen[1],
                visible: true,
            },
            {
                name: 'Duration',
                selected: false,
                value: this.props.dosage.medicine.duration[0] ? this.props.dosage.medicine.duration[0] : null,
                valueIndex: this.props.dosage.medicine.duration[1],
                visible: true
            }

        ];
        this.setState({
            dosageFlow: dosageFlow
        });
        this.flatListRef.scrollToIndex({ animated: true, index: this.showIndex });

    }
    renderHeaderItem(data, index) {
        return (
            data.item.visible ?
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', alignSelf: 'center' }}>


                        {
                            data.index == 0 && this.props.medicationEdit ?

                                <TouchableOpacity onPress={() => this.setSelectedView(data.item, index)}
                                    style={{
                                        flexDirection: 'row', backgroundColor: data.item.value ? '#1EB73C' :
                                            this.props.dosage.currentView == data.item.name ? '#0065d7' : '#0065d7', borderRadius: 20
                                    }}>


                                    <Tooltip
                                        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}

                                        animated={true}
                                        isVisible={true}
                                        backgroundColor={"rgba(0,0,0,0)"}
                                        contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
                                        tooltipStyle={{ left: 20, alignItems: 'flex-end' }}

                                        content={<TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                                            onPress={() => { this.props.setTooltipStatus({ ["medicationEdit"]: false }) }}
                                        >
                                            <AddPatient

                                                isLottie={true}
                                                imagePath={tooltip_medication}
                                                title={"Medication Trail"}
                                                description={"View the medication you have prescribed. Add & edit your prescribed medication easily from here."}
                                            />
                                        </TouchableOpacity>}
                                        //(Must) This is the view displayed in the tooltip
                                        placement="bottom"
                                        //(Must) top, bottom, left, right, auto.
                                        onClose={() => this.props.setTooltipStatus({ ["medicationEdit"]: false })}
                                    //(Optional) Callback fired when the user taps the tooltip
                                    >


                                        <Text style={{
                                            fontFamily: NotoSans, textAlign: 'center', fontSize: 16, color:
                                                (this.props.dosage.currentView == data.item.name || data.item.value) ? '#ffffff' : '#ffffff', padding: 8
                                        }}>
                                            {data.item.value ? data.item.value : data.item.name}</Text>

                                        {data.item.value ?
                                            <Image source={ic_med_edit} style={{
                                                resizeMode: 'contain', width: 20, height: 20, alignSelf:
                                                    'center', marginEnd: 10
                                            }}></Image>
                                            : null}




                                    </Tooltip>

                                </TouchableOpacity>
                                :

                                <TouchableOpacity onPress={() => this.setSelectedView(data.item, index)}

                                    style={{
                                        flexDirection: 'row', backgroundColor: data.item.value ? '#1EB73C' :
                                            this.props.dosage.currentView == data.item.name ? '#0065d7' : '#0065d7', borderRadius: 20
                                    }}>
                                    <Text style={{
                                        fontFamily: NotoSans, textAlign: 'center', fontSize: 16, color:
                                            (this.props.dosage.currentView == data.item.name || data.item.value) ? '#ffffff' : '#ffffff', padding: 8
                                    }}>{data.item.value ? data.item.value : data.item.name}</Text>
                                    {data.item.value ?
                                        <Image source={ic_med_edit} style={{
                                            resizeMode: 'contain', width: 20, height: 20,
                                            alignSelf: 'center', marginEnd: 10
                                        }}></Image>
                                        : null}
                                </TouchableOpacity>

                        }
                        {(data.index < this.state.dosageFlow.length - 1) ?
                            <Icon as={MaterialCommunityIcons} size={30} name="angle-right" color="coolGray.800" _dark={{
                                color: "coolGray.800"
                            }} style={{
                                alignSelf: 'center', color: data.item.value ? '#1EB73C' :
                                    this.props.dosage.currentView == data.item.name ?
                                        '#0065d7' : '#cdcdcd' , marginLeft : 10
                            }} />
                             : null}
                    </View>
                    {data.index >= 3 ? <View style={{
                        flexDirection: 'row', marginBottom: 5, marginTop: 5, alignItems:
                            'center', justifyContent: 'center'
                    }}>
                        {this.props.dosage.medicine.reminder && data.index == 3 ? <Image source={ic_dosage_reminder}
                            style={{ height: 15, width: 15 }} resizeMode={'contain'} ></Image> : null}
                        <Text style={{ color: '#8b8a8a' }}>{data.index == 3 && this.props.dosage.medicine.schedule ?
                            this.props.dosage.medicine.schedule.toUpperCase() : this.props.dosage.medicine.startfrom ? this.props.dosage.medicine.startfrom.toUpperCase() : ""}</Text>
                    </View> : null}
                </View>
                : null)
    }
    render() {
        return (

            <View style={{ backgroundColor: '#f1f2f4', justifyContent: 'flex-start', flex: 0.3 }}>
                {/*Header View*/}

                <SafeAreaView>
                    <View style={{ marginTop: Platform.OS == "android" ? this.props.databaseContext.statusBarHeight || 23 : this.props.databaseContext.statusBarHeight || 0, flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: NotoSans, fontSize: 20 }}>Add Medication</Text>
                        <TouchableOpacity onPress={() => this.closeView()}>
                            <Image source={ic_close_button} style={{ width: 18, height: 18 }} resizeMode={"contain"}></Image>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                {/*Header View Ends*/}
                {/*Dosage Path*/}
                <View style={{ alignItems: 'flex-start', padding: 10 }}>
                    <FlatList
                        data={this.state.dosageFlow}
                        extraData={this.state}
                        horizontal={true}
                        ref={(ref) => { this.flatListRef = ref; }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item, index) => this.renderHeaderItem(item, index)}>

                    </FlatList>
                </View>
                {/*Dosage Path Ends*/}
            </View>
        )
    }
    componentWillReceiveProps(nextProps) {
        //if(this.props.dosage.currentView!=nextProps.dosage.currentView || ){
        this.renderDosagePath(nextProps.dosage.currentView);
        //}

    }
}



const mapStateToProps = state => ({

    medicationEdit: state.tooltip.toolTipStatus.medicationEdit,


});

const mapDispatchToProps = dispatch => ({

    setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DosageHeader)
