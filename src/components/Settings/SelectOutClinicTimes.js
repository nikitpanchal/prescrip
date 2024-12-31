
import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { save_blue_btn, ic_checked, ic_unchecked } from '../../constants/images';
import _ from 'lodash';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { Alert } from 'react-native';
var moment = require('moment');
export default class SelectOutClinicTimes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeSlots: [],
            selectAll: false,
        };
    }
    componentDidMount() {
        this.parseTimeSlots();
    }

    parseTimeSlots() {
        let slots = [...this.props.settings.appointmentData];
        let dateSlots = [...this.props.settings.dateSlots];
        dateSlots = dateSlots.map(d => {
            return d.slotId;
        })
        let timeSlots = [];
        let naSlots=[];
        let isAllDay=slots.find(s=>{
            if(s.active==0){
                return true;
            }
        })
        
        slots.map(item => {
            // if(item.AvailableTimeSlots.length>0 && item.NotAvailableTimeSlots.length> 0){

            if (dateSlots.includes(item.slotId)) {
                if(item.AvailableTimeSlots.length>0){
                timeSlots = [...timeSlots, ...item.AvailableTimeSlots];
                }
                if(item.NotAvailableTimeSlots.length>0){
                    timeSlots=[...timeSlots, ...item.NotAvailableTimeSlots];
                }
                naSlots =[...naSlots, ...item.NotAvailableTimeSlots];
            }
            //}
        });
        timeSlots = [...new Set(timeSlots)];
        naSlots = [...new Set(naSlots)];
        timeSlots = _.sortBy(timeSlots);
       // console.log(timeSlots);
        timeSlots = timeSlots.map(t => {
            if(t<10){
                let time = {
                    showTime: moment(("0"+"0"+t).toString(),"hmm").format("hh:mm A"),
                    selected: naSlots.includes(t) ||(isAllDay?true:false),
                    time: t
                }
                return time;
            }
            if (t < 100) {
                //t = "0" + t;
                let time = {
                    showTime: moment(("0"+t).toString(),"hmm").format("hh:mm A"),
                    selected: naSlots.includes(t) ||(isAllDay?true:false),
                    time: t
                }
                return time;
            }
            else {
                let time = {
                    showTime: moment(t.toString(), "hmm").format("hh:mm A"),
                    selected: naSlots.includes(t)||(isAllDay?true:false),
                    time: t
                }
                return time;
            }
        })
     //   console.log(timeSlots);
        this.setState({
            timeSlots,
            selectAll : isAllDay?true:false
        }, () => { timeSlots = null });



    }
    //On Date Selection
    selectDateSlots(item, index) {
        if(this.state.selectAll){
            Alert.alert("Prescrip","Please uncheck Mark all day before editing individual time slots");
            return;
        }
        let slots = [...this.state.timeSlots];
        item.selected = !item.selected;
        slots[index] = item;
        this.setState({
            timeSlots: slots
        }, () => { slots = null });

    }
    renderDateSlots(item, index) {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }} onPress={() => this.selectDateSlots(item.item, item.index)}>
                <Text style={{ fontFamily: 'NotoSans', color: '#414141', fontSize: 18, }}>{item.item.showTime}</Text>
                {item.item.selected ? <Image source={save_blue_btn} style={{ height: 20, width: 20, resizeMode: 'contain', }} /> : null}
            </TouchableOpacity>
        )
    }
    //On Proceed Click
    proceed() {
        let slots = [...this.state.timeSlots];
        slots = slots.filter(s => {
            if (s.selected) {
                return s;
            }

        })
        if (slots.length == 0) {
            alert("Please select a time slot");
        }
        else {
           // console.log(slots);
            this.props.setOutOfClinicsTimeSlots(slots);
            slots=slots.map(s=>{
                return s.time;
            })
            let dateSlots = [...this.props.settings.dateSlots];
            let selectedSlots=[];
           dateSlots.map(d=>{
               let range =d.slotIdRange;
               range.map(r=>{
                   selectedSlots.push(r.sid)
               })

           })


            let data = {
                slotIds: selectedSlots,
                doctorId : this.props.doctorProfile.DoctorData._id,
                slotTimes :this.state.selectAll?[]:slots,
                type : this.state.selectAll?0:1,
                active : this.state.selectAll?1:0,
                clinicId :this.props.settings.selectedClinic.ClinicId
            }
            
            this.props.setOutOfClinic(data).then(response=>{
                
                if(response.payload.data.status ===1){
                    let doctorData=JSON.parse(JSON.stringify(this.props.doctorProfile.DoctorData));
                    let index=doctorData.ClinicAddresses.findIndex(c=>{
                        if(c.ClinicId==this.props.settings.selectedClinic.ClinicId){
                            return c;
                        }
                    });
                    let clinic=doctorData.ClinicAddresses[index];
                    doctorData.ClinicAddresses[index]={...clinic};

                    this.props.setDoctorData(doctorData);
                    this.props.setSettingClinic(clinic);
                }
            });
           multipleTapHandler.clearNavigator();
           this.props.navigation.navigate("SettingsClinicConsultation");
        }

    }
    selectAllSlots() {
        let selectAllSlots = !this.state.selectAll;
        let slots = this.state.timeSlots;
        slots = slots.map(s => {
            s.selected = selectAllSlots;
            return s
        });
        this.setState({
            timeSlots: slots,
            selectAll: selectAllSlots
        }, () => { slots = null });
    }
    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#cdcdcd",
            }}
          />
        );
      }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={{ flex: 0.9 }}>
                    <FlatList style={{ flex: 1, marginBottom: 50 }}
                        data={this.state.timeSlots}
                        extraData={this.state.showData}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent = { this.FlatListItemSeparator }
                        renderItem={(item, index) => this.renderDateSlots(item, index)}>
                    </FlatList>

                </View>
                {/** Buttons*/}
                <View style={{

                    width: '100%',
                    height: 120,

                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0, alignItems: 'center', justifyContent: 'center'
                }}>
                    <View style={{ alignSelf: 'flex-start', padding: 20, backgroundColor: '#fff' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.selectAllSlots()}>
                            <Image source={this.state.selectAll ? ic_checked : ic_unchecked} style={{ height: 25, width: 25, resizeMode: 'contain', }}></Image>
                            <Text style={{ fontSize: 15, fontFamily: 'NotoSans', color: '#000000', marginLeft: 10 }}>{"Mark all day"}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '100%', marginBottom: 10 }} onPress={() => this.proceed()}>
                        <View style={{ borderWidth: 2, borderColor: '#0065d7', borderRadius: 25, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontFamily: 'NotoSans-Bold', color: '#0065d7', fontSize: 18 }}>SAVE & PROCEED</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}