import React, { Component } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Follow_Up_Date_Icon, Checkbox_Orange, Uncheckbox_Orange } from '../../constants/images'
import DateTimePicker from "react-native-modal-datetime-picker";
import moment, { defaultFormat } from 'moment';
import ToastComponent from '../../components/Toast/toastComponent'
import Images from '../../Theme/Images'

import Toast, { DURATION } from 'react-native-easy-toast'
export default class FollowUpComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDatePickerVisible: false,
            cust_date: this.props.patientvisit.prescription.FollowupDate ? moment(this.props.patientvisit.prescription.FollowupDate).format("DD-MM-YYYY") : 'Select Custom Date',
            isClickedSOS: this.props.patientvisit.prescription.SOSReport == 1 ? true : false,
            isClickedReport: this.props.patientvisit.prescription.SOSReport == 1 ? true : false,

            description: '',
            showToast: false,
            loading: false,

        }
        this.FollowupText = null;
    }
    resetDate(date) {
        var date_ = date ? moment(date).format("DD-MM-YYYY") : 'Select Custom Date';
        this.setState({
            cust_date: date_
        })
    }
    cancelDatePicker() {
        this.setState({
            isDatePickerVisible: false
        })
    };

    sundayChecker(item, date, sunDate) {

        if (item == "Sunday") {
            Alert.alert(
                'Prescrip',
                'The selected followup date falls on' + item + ", Sunday. Would you like to move it to " + moment(date).add(1, 'd').format('Do MMM') + ", Monday?",
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            this.props.setCustomDate(moment(date, defaultFormat).add(1, 'd').toDate());
                            this.setState({
                                cust_date: moment(date).add(1, 'd').format("DD-MM-YYYY")
                            }, () => {
                                this.cancelDatePicker();
                            });
                            this.FollowupText = null;
                        }
                    },
                    {
                        text: 'No', onPress: () => {


                            this.props.setCustomDate(date);
                            this.setState({
                                cust_date: sunDate
                            }, () => {
                                this.cancelDatePicker();
                            });
                            this.FollowupText = null;

                        },
                        style: 'cancel'
                    }
                ],
                { cancelable: false }
            );
        } else {
            this.props.setCustomDate(date);
            this.setState({
                cust_date: sunDate
            }, () => {
                this.cancelDatePicker();
            });
            this.FollowupText = null;
        }

    }

    setDate = date => {
        //     this.cancelDatePicker();

        //  this.props.setCustomDate(date);
        let day = moment(date).format('dddd').toString()

        let date_str = moment(date).format("DD-MM-YYYY");
        this.sundayChecker(day, date, date_str)


    }

    onClickDone() {

        let { FollowupText, date, navigation } = this.props;
        let prescription = this.props.patientvisit.prescription;
        if (date) {
            let followup_date = new Date(date).toISOString();

            prescription["FollowupDate"] = followup_date;
            prescription["FollowUpText"] = FollowupText ? FollowupText : this.FollowupText,
                this.props.setPrescription(prescription);

            this.setState({
                showToast: true,
                description: "Follow up date successfully selected",
                loading: true,

            })
        }
        else {
            prescription["FollowupDate"] = null;
            prescription["FollowUpText"] = "";
            this.props.setPrescription(prescription);
        }
        setTimeout(() => {
            this.setState({
                showToast: false,
                loading: false
            })
            navigation.pop();
        }, 800);

        return;
        // this.setState({
        //     loading: true
        // })
        // let { patientVisitData, setFollowupDate, FollowupText, date, navigation } = this.props
        // let data = {
        //     "SOSReport": this.state.isClickedSOS ? 1 : 0,
        //     "FollowupDate": date,
        //     "FollowUpText": FollowupText ? FollowupText : this.FollowupText,
        // }
        // setFollowupDate(patientVisitData._id, data).then(({ payload, error }) => {
        //     if (payload.data.status == 2000) {
        //         let prescription = this.props.patientvisit.prescription;
        //         prescription["FollowupDate"] = payload.data.data.FollowupDate;
        //         prescription["FollowUpText"] = FollowupText ? FollowupText : this.FollowupText,
        //             this.props.setPrescription(prescription);

        //         this.setState({
        //             showToast: true,
        //             description: "Follow up date successfully selected",
        //             loading: true,

        //         })


        //         setTimeout(() => {
        //             this.setState({
        //                 showToast: false,
        //                 loading: false
        //             })
        //             navigation.pop();
        //         }, 800);

        //     } else {

        //         this.setState({
        //             showToast: true,
        //             description: "Some error occurred!",
        //             loading: false
        //         })


        //         setTimeout(() => {
        //             this.setState({
        //                 showToast: false,
        //                 loading: false,
        //             })

        //         }, 2000);

        //         // Toast.show({
        //         //     text: "Some error occurred!",
        //         //     //buttonText: "Okay",
        //         //     position: "bottom"
        //         //   })

        //     }
        // })
    }

    setCheckBox() {
        this.setState({ isClickedReport: !this.state.isClickedReport, isClickedSOS: !this.state.isClickedSOS }, () => {
            this.props.patientvisit.prescription.SOSReport = (this.state.isClickedReport || this.state.isClickedSOS) ? 1 : 0
            this.props.setPrescription(this.props.patientvisit.prescription)
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/*Date Modal*/}
                <DateTimePicker
                    isVisible={this.state.isDatePickerVisible}
                    onConfirm={this.setDate}
                    date={new Date()}
                    minimumDate={new Date()}
                    onCancel={this.cancelDatePicker.bind(this)}
                />
                {/*Ends*/}
                <TouchableOpacity onPress={() => this.setState({
                    isDatePickerVisible: true
                })} style={{
                    flex: 0.1, flexDirection: 'row', alignItems: 'center', borderTopColor: '#cccccc', borderTopWidth: 1,
                    borderBottomColor: '#cdcdcd', borderBottomWidth: 1
                }}>
                    <View style={{ flex: 0.8, justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: '#ff6935', fontSize: 20 }}>{this.state.cust_date}</Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={Follow_Up_Date_Icon} style={{ resizeMode: 'contain', height: 40 }} />
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 0.6 }}>
                    <FlatList

                        data={this.props.data}
                        renderItem={({ item, index }) => this.props.renderItem(item, index)}
                        ItemSeparatorComponent={this.props.itemSeperator}
                        keyExtractor={(item, i) => i.toString()}
                    />
                </View>

                <View style={{ backgroundColor: '#f5f5f5f', flex: 0.3, }}>
                    <View style={{ flex: 0.4, margin: 15 }}>
                        <Text style={{ color: '#757575', fontSize: 14 }} >Patient to follow up</Text>
                    </View>
                    <View style={{ flex: 0.6, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.setCheckBox()} style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View style={{}}>
                                <Image source={!this.state.isClickedSOS ? Uncheckbox_Orange : Checkbox_Orange} style={{ resizeMode: 'contain', height: 20 }} />
                            </View>
                            <View style={{}}>
                                <Text style={{ color: '#757575', fontSize: 18 }} >for SOS</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setCheckBox()} style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View >
                                <Image source={!this.state.isClickedReport ? Uncheckbox_Orange : Checkbox_Orange} style={{ resizeMode: 'contain', height: 20 }} />
                            </View>
                            <View style={{}}>
                                <Text style={{ color: '#757575', fontSize: 18 }} >with Reports</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.onClickDone()}>
                        <LinearGradient colors={["#ff6935", "#ffa658"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={styles.btn}>

                            <Text style={styles.btnTxt} >{this.props.btnTxt}</Text>
                            {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}

                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {
                    this.state.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={"#fafbfe"}
                                imagePath={Images.Success}
                                description={this.state.description}

                            />

                            , 1200) : null
                }
                <Toast

                    position='bottom'
                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        bottom: 110,
                        backgroundColor: '#4BB543', borderRadius: 15,
                    }}
                    ref="toast" />

            </View >

        )
    }
}
//
const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        borderRadius: 25
    },
    btnTxt:
    {
        textAlign: 'center',
        fontSize: 17,
        color: '#ffffff',
        fontFamily: 'NotoSans-Bold',
        marginEnd: 5
    },
})