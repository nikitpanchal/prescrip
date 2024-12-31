import React, { Component } from 'react'
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native'
import PrescriptionHeader from '../../components/PrescriptionHeader/PrescriptionHeader'
import FollowUpComponent from '../../components/FollowUPComponent/FollowUpComponent'
import { dert } from '../../components/FollowUPComponent/FollowUpComponent'
import { setFollowupDate, setPrescription } from '../../actions/patientVisit'
import { icon_search_button_blue, lefticon, ic_Close_Button, Follow_Up_Date_Icon, ic_Orange_Tick } from '../../constants/images';
import Images from '../../Theme/Images'
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import moment from 'moment';

class FollowUpContainer extends Component {

    constructor(props) {
        super(props);
        let { params } = props.route

        this.state = {
            FollowupText: this.props.patientvisit.prescription.FollowUpText ? this.props.patientvisit.prescription.FollowUpText : null,
            // selectedFollowupdate: this.props.patientvisit.prescription.FollowupDate,
            date: this.props.patientvisit.prescription.FollowupDate ? this.props.patientvisit.prescription.FollowupDate : '',
            dateIndex: -1,
            followupData: [
                "N/A",
                "1 Day",
                "2 Days",
                "3 Days",
                "4 Days",
                "5 Days",
                "6 Days",
                "7 Days",
                "8 Days",
                "9 Days",
                "10 Days",
                "11 Days",
                "12 Days",
                "13 Days",
                "14 Days",
                "15 Days",
                "16 Days",
                "17 Days",
                "18 Days",
                "19 Days",
                "20 Days",
                "1 Week",
                "2 Weeks",
                "3 Weeks",
                "4 Weeks",
                "5 Weeks",
                "6 Weeks",
                "7 Weeks",
                "1 Month",
                "2 Months",
                "3 Months",
                "4 Months",
                "6 Months",
                "1 Year",
            ],
            previous_screen: params ? params.previous_screen : ''
        }
        this.date = ""
    }

    renderSeperator() {
        return (
            <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
        )
    }

    //Sunday alert
    getSundayalertday(day, item, index) {
        if (day == "Sunday") {
            Alert.alert(
                'Prescrip',
                'The selected followup date falls on' + moment(this.date).format(" Do MMM") + ", Sunday. Would you like to move it to " + moment(this.date).add(1, 'd').format('Do MMM') + ", Monday?",
                [
                    {
                        text: 'Yes',
                        onPress: () => {

                            this.getMonday(day, item, index)

                        }
                    },
                    {
                        text: 'No', onPress: () => {



                            this.convertWeeksToDays(day, item, index)

                        },
                        style: 'cancel'
                    }
                ],
                { cancelable: false }
            );
        } else {
            this.convertWeeksToDays(day, item, index)
        }
    }

    convertWeeksToDays(day, item, index) {

        if (item == "N/A") {
            this.setState({ date: "", dateIndex: 0 });
            this.child.resetDate("")

            return false;
        }
        let moment = require('moment')

        item = item.toLowerCase()
        let x = new Date();
        let arr = item.split(' ');
        if (item.indexOf('day') != -1) {

            this.date = new Date(x.setDate(x.getDate() + parseInt(arr[0])))

        } else if (item.indexOf('month') != -1) {

            this.date = moment().add(parseInt(item.split(" ")[0]), 'M');

        } else if (item.indexOf('week') != -1) {


            this.date = new Date(x.setDate(x.getDate() + (parseInt(arr[0]) * 7)))

        } else if (item.indexOf('year') != -1) {

            this.date = moment().add(parseInt(item.split(" ")[0]), 'y');

        } else {
            this.date = day;
        }
        this.setState({
            FollowupText: item,
            date: this.date, dateIndex: index
        });

        this.child.resetDate(this.date);
        this.props.patientvisit.prescription.FollowUpText = item
        
        this.props.setPrescription(this.props.patientvisit.prescription)

    }


    getMonday(day, item, index) {


        let moment = require('moment')

        if (item.includes('20 Days')) {
            index = index - 1;
        }
        if (item.includes('Month') || item.includes('Months') || item.includes('Week') || item.includes('Weeks')) {
            index = index
        } else {
            index = index + 1;
        }

        item = item.includes('20 Days') ? '21 Days' : this.state.followupData[index];
        item = item.toLowerCase()
        let x = new Date();

        let arr = item.split(' ');
        if (item.indexOf('day') != -1) {

            this.date = new Date(x.setDate((x.getDate()) + parseInt(arr[0])))


        } else if (item.indexOf('month') != -1) {

            this.date = moment().add(parseInt(item.split(" ")[0]), 'M').add(1, 'day');


        } else if (item.indexOf('week') != -1) {


            this.date = new Date(x.setDate((x.getDate() + 1) + (parseInt(arr[0]) * 7)))



        } else {
            this.date = day;
        }
        this.setState({
            date: this.date, dateIndex: index, FollowupText: item.includes('20 Days') ? '21 Days' : this.state.followupData[index]
        });
        this.props.patientvisit.prescription.FollowUpText = this.state.FollowupText
        this.props.setPrescription(this.props.patientvisit.prescription)
        this.child.resetDate(this.date);
        


    }

    // Sunday
    getSunday(data) {
        let moment = require('moment')
        let num = data.split(" ")
        let day = moment().add(parseInt(num), num[1]).format('dddd');
        let date = moment().add(parseInt(num), num[1]).toISOString();
        //this.date = date
        return day
    }

    itemView(item, index) {

        return (
            <TouchableOpacity
                // disabled={this.getSunday(item) == "Sunday" ? true : false}
                onPress={() => this.getSundayalertday(this.getSunday(item), item, index)} style={{ flex: 1, flexDirection: 'row', padding: 20 }}>
                <View style={{ flex: 0.9 }}>
                    <Text style={{ fontSize: 18, color: (this.getSunday(item) == "Sunday" ? '#abaaaa' : '#595757') }}>{this.getSunday(item) == "Sunday" ? item + " (" + this.getSunday(item) + ") " : item}</Text>
                </View>
                <View style={{ flex: 0.1 }}>
                    {this.state.dateIndex == index ? <Image source={ic_Orange_Tick} style={{ resizeMode: 'contain', height: 20 }} /> : null}
                </View>

            </TouchableOpacity>
        )

    }
    setCustomDate(date) {
        this.setState({
            date: date,
            FollowupText: null
        })

    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <PrescriptionHeader
                    {...this.props}
                    type={2}
                    bgImage={null}
                    bgColor={'white'}
                    container={"followup"}
                    title={("Set Follow up Date").toUpperCase()}
                    titleSize={18}
                    description={"After how many days after " + this.props.patientname + " should visit again?"}
                    descriptionSize={12}
                    titleColor={'#636363'}
                    descriptionColor={'#919191'}
                    placeholderTextColor={'black'}
                    placeTextColor={'black'}
                    placeholderTextSize={40}
                    //this.props.placeholderTextColor ? this.props.placeholderTextColor :
                    leftImage={Images.ic_black_back}
                    leftImageOnClick={() => this.props.navigation.pop()}
                    leftImageOnClick={() => this.props.navigation.pop()}
                    rightImageOnClick={null}
                />

                <FollowUpComponent {...this.props}
                    data={this.state.followupData}
                    ref={instance => { this.child = instance; }}
                    date={this.state.date}
                    patientVisitData={this.props.patientvisit.prescription}
                    renderItem={(item, index) => this.itemView(item, index)}
                    FollowupText={this.state.FollowupText}
                    setCustomDate={(date) => this.setCustomDate(date)}
                    itemSeperator={() => this.renderSeperator()}
                    btnTxt={"Done"}
                />
            </View>
        )
    }

}

const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    patientvisit: state.patientvisit,
    patientname: state.patientvisit.patientDetails.CommonDetails.FullName,

})
const mapDispatchToProps = dispatch => ({

    get_chief_suggestions: (patient_Id, doctorId, patientId) => dispatch(get_chief_suggestions(patient_Id, doctorId, patientId)),

    patientvisits: (prescriptionObj) => dispatch(patientvisits(prescriptionObj)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setFollowupDate: (patientvisitid, data) => dispatch(setFollowupDate(patientvisitid, data)),


});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(FollowUpContainer));
