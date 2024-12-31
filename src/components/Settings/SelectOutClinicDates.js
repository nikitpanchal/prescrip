import { t } from 'i18n-js';
import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity,Alert } from 'react-native';
import {save_blue_btn} from '../../constants/images';
import multipleTapHandler from '../../components/MultiTapHandle/index';
var moment = require('moment');
export default class SelectOutClinicDates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateSlots: []
        };
    }
    componentDidMount() {
        this.getAppointmentData();
    }
    getAppointmentData() {
        let data = {
            doctorId: this.props.doctorProfile.DoctorData._id,
            clinicId: this.props.settings.selectedClinic.ClinicId
        }
        
        this.props.get_away_appontment_timeslots(data).then(response => {
            if (response.payload.data.status == 1) {
               
                this.props.setOutOfClinicsSlots(response.payload.data.timeSlots);
                this.parseDateSlots();
            }
            else{
                this.props.setOutOfClinicsSlots([]);
            }

        });
    }
    parseDateSlots() {
        let slots = [...this.props.settings.appointmentData];
        slots=slots.filter(s=>{ 
            if(s.AvailableTimeSlots.length>0){
                return s;
            }
        })
        let dateSlots = [];
        dateSlots = slots.map(item => {
            // if(item.AvailableTimeSlots.length>0 && item.NotAvailableTimeSlots.length> 0){

            let value = {
                date: item.date,
                slotId : item.slotId,
                slotIdRange :item.slotIdRange,
                showData: moment(item.date).format('dddd, MMMM Do YYYY'),
                selected: item.NotAvailableTimeSlots.length>0||item.active==0

            }
            return value;
            //}
        });
     
        this.setState({
            dateSlots
        }, () => { dateSlots = null });



    }
    //On Date Selection
    selectDateSlots(item,index){
let slots =[...this.state.dateSlots];
item.selected=!item.selected;
slots[index]=item;
this.setState({
    dateSlots: slots
},()=>{ slots =null });

    }
    renderDateSlots(item,index) {
        return (
<TouchableOpacity style={{flexDirection: 'row',justifyContent: 'space-between',padding: 15}} onPress={() =>this.selectDateSlots(item.item,item.index)}>
<Text style={{fontFamily:'NotoSans',color:'#414141',fontSize:18,}}>{item.item.showData}</Text>
{item.item.selected?<Image source={save_blue_btn} style={{ height: 20, width: 20, resizeMode: 'contain', }}/>:null}
</TouchableOpacity>
)
    }
    //On Proceed Click
    proceed(){
let slots = [...this.state.dateSlots];
slots=slots.filter(s=>{
    if(s.selected){
        return s;
    }
    
})
if(slots.length==0){
    Alert.alert("Prescrip","Please select a date");
}
else{
    this.props.navigation.navigate("OutofClinicTimeSlots");
}

this.props.setOutOfClinicsDateSlots(slots);
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
                <View style={{flex:0.9}}>
                <FlatList style={{flex:1,marginBottom:10}}
                data={this.state.dateSlots}
                extraData={this.state.showData}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent = { this.FlatListItemSeparator }
                renderItem={(item,index)=>this.renderDateSlots(item, index)}>
                </FlatList>

                </View>
                {/** Buttons*/}
                <View style={{

                    width: '100%',
                    height: 65,

                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0, alignItems: 'center', justifyContent: 'center'
                }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '100%', marginBottom: 10 }} onPress={() => this.proceed()}>
                        <View style={{ borderWidth: 2, borderColor: '#0065d7', borderRadius: 25, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontFamily: 'NotoSans-Bold', color: '#0065d7', fontSize: 18 }}>PROCEED</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}