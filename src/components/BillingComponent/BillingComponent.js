//This is an example code for SectionList//
import React, { Component } from 'react';
//import react in our code. 
import { StyleSheet, View, SectionList, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { Difference_In_Days1 } from '../../commonmethods/common';
import { getCurreny } from '../../commonmethods/validation';
//import all the components we are going to use. 

export default class BillingComponent extends Component {
    GetSectionListItem = item => {
        //Function for click on an item

    };
    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ height: 0.5, width: '100%', }} />
        );
    };


    isDateIsPast(selectedData){
        var whenEntered = new Date(selectedData);
        var now = new Date("2021-04-14");
        now.setHours(0,0,0,0);
        if (whenEntered <= now) {
            return true;
        //  console.log("Selected date is in the past");
        } else {
            return false;
         // console.log("Selected date is NOT in the past");
        }
    }    
   

    render() {

        return (
            <View style={{}}>

                <SectionList
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    sections={this.props.finalArrayAfterTabClick}
                    stickySectionHeadersEnabled={false}
                    scrollEnabled={true}

                    style={{ marginBottom: 50,}}

                    renderSectionHeader={({ section }) => (


                        <Text style={styles.SectionHeaderStyle}> {
                            Difference_In_Days1(section.data[0].WhenEntered) == 0 ? 
                            'Today ('+section.data.length +')' : Difference_In_Days1(section.data[0].WhenEntered) == 1 ? 
                            'Yesterday ('+section.data.length +')'  : section.title +' ('+section.data.length +')'} </Text>
                    )}
                    renderItem={({ item }) => (

                        // Single Comes here which will be repeatative for the FlatListItems
                        <View style={styles.content_container}


                        >


                            {

                                item.PayType ?






                                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View
                                            style={{ flexDirection: 'row' }}
                                        >
                                            <View style={{
                                                flexDirection: "row",
                                                borderRadius: 6,
                                                borderWidth: 1,

                                                borderColor: item.PayType == 1 || item.PayType == 2 ? "#820091" : item.PayType == 3 ? "#02798a" :
                                                    item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Video Consulation")) ? "#820091" :
                                                        item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Clinic Appointment")) ? "#db575a" : "gray"

                                            }}>
                                                <Text style={{
                                                    paddingHorizontal: 5,
                                                    color: item.PayType == 1 || item.PayType == 2 ? "#820091" : item.PayType == 3 ? "#02798a" :
                                                        item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Video Consulation")) ? "#820091" :
                                                            item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Clinic Appointment")) ? "#db575a" :


                                                                "gray", fontSize: 12
                                                }}>{item.PayType == 1 || item.PayType == 2 ? " Video Consulation " : item.PayType == 3 ? " Precrip Pay Link " : item.PayType == 4 ?
                                                    item.ServiceProvided && (item.ServiceProvided.split(',').includes("Video Consulation")) ? "Video Consulation" :
                                                        item.ServiceProvided && (item.ServiceProvided.split(',').includes("Clinic Appointment")) ? "Clinic Appointment" :

                                                            item.ServiceProvided ? item.ServiceProvided.split(',')[0] : " Offline Payment " : ""}</Text>



                                            </View>
                                            {
                                                item.PayType == 4 ?
                                                    <Text style={{ paddingHorizontal: 5, color: "gray", fontSize: 12 }}>{item.ServiceProvided ? item.ServiceProvided.split(',').length > 1 ? "+ " + (item.ServiceProvided.split(',').length - 1) : "" : ""}</Text>

                                                    : null
                                            }
                                        </View>


                                        <Text style={{ alignSelf: 'flex-end', textAlign: 'right', color: "#787878", fontSize: 12 }}>{item.Remarks && item.Remarks == "clonedcancel" ? "Refunded" : item.IsRefunded == 1 && item.IsCancelled == null ? "Refunded" : item.PayType == 1 ? "via Prescrip" : item.PayType == 2 ? "via Prescrip" : item.PayType == 3 ? "via Prescrip Link" : item.PayType == 4 ? "" : item.PayType == 5 ? "Refunded" : ""}</Text>



                                    </View>
                                    : null
                            }


                            <View style={{ paddingVertical: 8, justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ color: '#000000', fontSize: 24, fontFamily: 'NotoSans' }}>{item.Name}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

                                    {
                                        //For old data

                                       // item.PayType == 1 && item.IsCancelled == 1 && item.IsRefunded == 1 && item.ConsultComplete == 0 ? null :

                                  !item.IsPaid && this.isDateIsPast(item.WhenEntered) ?null:

                                            item.Remarks && item.Remarks == "clonedcancel" ?
                                                <Text style={{ color: "#444444", fontSize: 28 }}>{"- "}</Text>

                                                :
                                                item.IsPaid == 1 || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ?
                                                    <Text style={{ color: item.IsPaid == 1 || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : "#444444", fontSize: 28 }}>{"+ "}</Text>
                                                    :
                                                    item.IsRefunded == 1 && item.IsCancelled == null ?
                                                        <Text style={{ color: "#444444", fontSize: 28 }}>{"- "}</Text>

                                                        :
                                                        null
                                    }
                                    <Text style={{ color:
                                       !item.IsPaid &&  this.isDateIsPast(item.WhenEntered) ? "#444444" :

                                        item.Remarks && item.Remarks == "clonedcancel" ? "#444444" : item.IsPaid == 1 || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : item.IsRefunded == 1 && item.IsCancelled == null ? "#444444" : "#444444", fontSize: 28 }}>{getCurreny() + " "}</Text>
                                    <Text style={{ color: 
                                       !item.IsPaid &&   this.isDateIsPast(item.WhenEntered) ? "#444444" :
                                        item.Remarks && item.Remarks == "clonedcancel" ? "#444444" : item.IsPaid == 1 || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : item.IsRefunded == 1 && item.IsCancelled == null ? "#444444" : "#444444", fontSize: 28 }}>{item.ConsultFees + ".00"}</Text>


                                </View>
                                <View style={{
                                    flex: 1, marginTop: 15, textAlign: 'center', justifyContent: 'flex-end',
                                    flexDirection: 'row'
                                }}>


                                    <TouchableOpacity
                                        //item.PayType == 3 && 

                                        // onPress={() => { item.IsCancelled == 1 ? null : this.props.viewReceptClick(item.PayType == 4 ? 'viewReceipt' : item.IsPaid == 0 ? 'viewInfo' : 'viewReceipt', item) }} >

                                        onPress={() => { item.IsCancelled == 1 || item.IsRefunded == 1 || item.Remarks == "clonedcancel" ? this.props.viewReceptClick('viewReceipt', item) : this.props.viewReceptClick(item.PayType == 4 ? 'viewReceipt' : item.IsPaid == 0 ? 'viewInfo' : 'viewReceipt', item) }} >


                                        <Text style={{ textAlign: "right", padding: 5, color: '#0065d7', fontSize: 13 }}>{item.IsCancelled == 1 || item.IsRefunded == 1 || item.Remarks == "clonedcancel" ? "View Receipt" : item.PayType == 4 ? 'View Receipt' : item.IsPaid == 0 ? "View Info." : "View Receipt"}</Text>
                                        {/*<Text style={{ textAlign: "right", padding: 5, color: item.IsCancelled == 1 ? "#444444" : '#0065d7', fontSize: 13 }}>{item.IsCancelled == 1 ? "Cancelled" + (item.IsRefunded == 1 ? "\n(Amount Refunded)" : "") : item.PayType == 4 ? 'View Receipt' : item.IsPaid == 0 ? "View Info." : "View Receipt"}</Text>*/}

                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    SectionHeaderStyle: {
        fontSize: 14,
        padding: 5,
        marginLeft: 10,
        color: '#4c4c4c',
        fontFamily: 'NotoSans'
    },
    SectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: '#4c4c4c',
        fontFamily: 'NotoSans'

    },
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
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderBottomColor: "#e3e3e3",
        margin: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 6

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