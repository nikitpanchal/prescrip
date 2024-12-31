//code by Sourabh

import React from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text, BackHandler } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from '../../Theme/Images'

import { ic_clock, ic_Empty_Setup_Clinic_Icon } from '../../constants/images';
import {daysName} from '../../constants/commondata';
import {isEqual} from 'lodash';


export default class ReviewClinicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opSlots : null,
            viewSlots : []
        };
         this.opSlots=[];
         this.ophours=[];
    }
componentDidMount(){
this.parseOpHoursJSON();
}
getIndex(schedule){
    let days=this.ophours.map((s1,i)=>isEqual(s1,schedule)?i:-1).filter(index=>index!==-1)
return days;
  }
  checkItem(check){
    let index;
    let isValid;
isValid=this.opSlots.some(function (item, i) {
    return isEqual(check,item)? (index = i, true) : false;
});

return isValid;
  }
//Parse the time slot
parseOpHoursJSON(){
    this.ophours=this.props.doctorProfile.ClinicAddress.OperationHours;
    this.ophours.forEach((schedule,index)=>{
        if(schedule.length>0){
  //let day=daysName[index];
  let slot={
    days : daysName[index],
    slots : schedule
  };
    this.opSlots.push(slot);
      
  }
  else{
    let slot={
      days:daysName[index],
      slots : []
    }
    this.opSlots.push(slot);
  }
    
  
      });
      //CONVERT TO NAME
    //  this.opSlots.forEach((op)=>{
    //     op.days=op.days.map((day)=>{
    //       return daysName[day];
    //     })
    //   });
      
      this.setState({
          opSlots : this.opSlots
      },()=>this.createViewSlots());

}
createViewSlots(){
let slots=[...this.state.opSlots];
let views=[];
for(let i=0;i<slots.length;i++){
    if(i==0){
        views[6]={...slots[i]};

    }
    else{
        views[i-1]={...slots[i]};
    }
}

this.setState({
    viewSlots: views
});
}
parseTime(slots){
    let time="";
    if(slots.length>0){
    slots.forEach((slot)=>{
        time=time+slot[0]+" - "+slot[1]+"\n";


    });
}

else{
    time="Closed"
}
    return time;
}
parseDays(days){
    let isSeq=false;
    let preindex=-1;
    let currentindex=-1;
    let daysStr="";
    days.forEach((day,index)=>{
        currentindex=daysName.indexOf(day);
        if(index<days.length-1){
            if(days[index+1]===daysName[currentindex+1]){
                isSeq=true;
                daysStr=days[0]+" - "+days[index+1]
            }
            else{
                daysStr=daysStr+", "+days[index+1]
            }

        }
        

    });
    return days.length>1 ?daysStr:days.join();
    //return days.join();
}
    Item(data) {
        let days=data.days;//this.parseDays(data.days)
        let timeSlots=this.parseTime(data.slots);
        return (
            
            <TouchableOpacity style={styles.content_container}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', }}>
{
    timeSlots!="Closed"?

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <Image style={{
                                marginTop: 8,
                                resizeMode: "contain", justifyContent: 'flex-end', width: 15, height: 15, marginRight: 10
                            }} source={ic_clock} />


                            <Text style={{ flex: 1, color: '#444444', fontSize: 22, fontFamily: "NotoSans-Bold" }}>{days}</Text>
                        </View>


                        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

                                    <Text style={{ flex: 1, marginLeft: 25, marginTop: 10, color: '#4c4c4c', fontSize: 16, lineHeight: 35, fontFamily: "NotoSans", fontSize: 18 }}>{timeSlots}</Text>

                            </View>
                        </View>

                        <View
                            style={{ height: 1, marginLeft: 25, marignTop: 10, backgroundColor: '#EEEEEE', flex: 1 }}
                        ></View>


                    </View>
                        :null}
                </View>
            </TouchableOpacity>
        );
    }



    render() {
        return (
            <View style={{ flex: 1, marginTop: -60 }}>


                <FlatList
                    data={this.state.viewSlots}
                    renderItem={({ item,index }) => this.Item(item)}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view_style: {
        flexDirection: "row",
        backgroundColor: '#008be0',
        height: 60
    },
    Optometry_Record: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: 'bold',
        textAlign: 'left'
    },
    step_2_5: {
        fontSize: 12,
        color: '#ffffff'
    },
    Next: {
        height: 18,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain'

    },
    content_container: {
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 10,

    },
    content_color: {
        color: '#383838',
        fontWeight: "600",
        fontSize: 16
    },
    Next_blue: {
        height: 15,
        color: "#ffffff",
        textAlign: 'center',
        resizeMode: 'contain',

    }
});
