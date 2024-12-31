//This is an example code for SectionList//
import React, { Component } from 'react';
//import react in our code. 
import { Image, StyleSheet, View, SectionList, StatusBar, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { Difference_In_Days1 } from '../../commonmethods/common';
import { getCurreny } from '../../commonmethods/validation';
//import all the components we are going to use. 
import { Tooltip_Add_Receipt, Tooltip_More_Option, Tooltip_Payment_Calendar, Tooltip_Payment_Filter, Tooltip_Pending, Tooltip_Received, Tooltip_Refunded, Billing_Payment_Refund_Icon, icon_Three_Dot_Menu_Button, Billing_Dropdown_Collapse, Billing_Dropdown_Expand, Billing_Menu_Button, Billing_Payment_Pending_Icon, Billing_Payment_Received_Icon, BG, lefticon, trans_collapsed, trans_expand, ic_Teal_BG_578, icon_search_white, icon_close_white, ic_Blue_BG_578 } from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';

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


    isDateIsPast(selectedData) {
        var whenEntered = new Date(selectedData);
        var now = new Date("2021-04-14");
        now.setHours(0, 0, 0, 0);
        if (whenEntered <= now) {
            return true;
            //  console.log("Selected date is in the past");
        } else {
            return false;
            // console.log("Selected date is NOT in the past");
        }
    }

    showAlert(sectionIndex) {

        // alert(sectionIndex)
        this.refs.foo.scrollToLocation({
            sectionIndex: sectionIndex,
            itemIndex: 0
        }
        );
    }

    //Total Bill
    calBilled(selectedArray) {
        let amount = 0;
        for (let index = 0; index < selectedArray.length; index++) {
            const element = selectedArray[index];

            if (element.PayType != 4) {
                amount = amount + element.AmountPaid
            }
        }

        return getCurreny() + " " + amount.toFixed(2);

    }



    //Total Received
    calRecevied(selectedArray) {
        let amount = 0;
        for (let index = 0; index < selectedArray.length; index++) {
            const element = selectedArray[index];
            if (element.PayType != 4) {
                amount = amount + element.ReimbursementAmount
            }
        }
        return getCurreny() + " " + amount.toFixed(2);
    }


    checkPendingORdoneORrefund(item) {

        if (!item.PayType && (item.AmountPaid == 0 || item.AmountPaid > 0 || item.IsPaidByAdmin == 1)) {
            return Billing_Payment_Received_Icon
        }
        else if (item.PayType == 5) {

            return Billing_Payment_Refund_Icon;
        } else if ((item.IsPaid == 1 && item.IsPaidByAdmin == 1) || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4) {

            return Billing_Payment_Received_Icon
        } else if (item.IsRefunded == 1 && item.IsCancelled == null) {
            return Billing_Payment_Refund_Icon;
        } else if (this.isDateIsPast(item.WhenEntered)) {
            return Billing_Payment_Received_Icon;
        } else if (item.PayType == 7 && item.IsPaid == 1) {

            return Billing_Payment_Received_Icon;
        } else {
            return Billing_Payment_Pending_Icon;
        }

    }


    render() {

        return (
            <View style={{ flex: 1 }}>

                <SectionList
                    ref="foo"
                    refreshing={this.props.refresh}
                    onRefresh={() => this.props.onRefresh()}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    sections={this.props.finalArrayAfterTabClick}
                    stickySectionHeadersEnabled={false}
                    scrollEnabled={true}

                    style={{}}

                    renderSectionHeader={({ section }) => (


                        <View
                            style={{ flexDirection: 'row', margin: 10, marginVertical: 15, justifyContent: 'space-between' }}
                        >


                            <Text style={styles.SectionHeaderStyle}> {
                                Difference_In_Days1(section.data[0].WhenEntered) == 0 ?
                                    'Today (' + section.data.length + ')' : Difference_In_Days1(section.data[0].WhenEntered) == 1 ?
                                        'Yesterday (' + section.data.length + ')' : section.title + ' (' + section.data.length + ')'} </Text>

                            {this.props.defaultSelectionFinal == "Refunds" ? null :
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                                >
                                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                        <Text
                                            style={{ fontSize: 10, color: '#828282', fontFamily: 'NotoSans' }}
                                        >{"Billed"}</Text>
                                        <Text
                                            style={{ fontSize: 15, color: '#434343', fontFamily: 'NotoSans' }}

                                        >{this.calBilled(section.data)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginLeft: 20, justifyContent: 'center' }}>
                                        <Text
                                            style={{ fontSize: 10, color: '#57c05b', fontFamily: 'NotoSans' }}

                                        >{"Recevied"}</Text>
                                        <Text
                                            style={{ fontSize: 15, color: '#29b62f', fontFamily: 'NotoSans' }}

                                        >{this.calRecevied(section.data)}</Text>
                                    </View>


                                </View>
                            }
                        </View>
                    )}
                    renderItem={({ item }) => (

                        // Single Comes here which will be repeatative for the FlatListItems

                        <TouchableOpacity
                            //item.PayType == 3 && 
                            //
                            onPress={() => { this.props.viewReceptClick(item.PayType == 4 || item.PayType == 5 ? 'viewReceipt' : item.IsRefunded == 1 && item.IsCancelled == 1 ? 'viewReceipt' : item.IsPaid == 0 ? 'viewInfo' : 'viewReceipt', item) }}
                            // onLongPress={() => { this.props.deleteCustomData(item) }}

                            style={{
                                flexDirection: 'row', paddingVertical: 18,
                                paddingHorizontal: 10,
                                borderBottomColor: "#e3e3e3",
                                borderBottomWidth: 1,

                                // margin: 10,
                                backgroundColor: 'white',
                                // shadowColor: "#000",
                                // shadowOffset: {
                                //     width: 0,
                                //     height: 2
                                //  },
                                //  shadowOpacity: 0.25,
                                //   shadowRadius: 3.84,
                                //  elevation: 5,

                                borderRadius: 6
                            }}
                        >
                            <View
                                style={{ flex: 0.10, alignSelf: 'center' }}
                            >

                                {
                                    this.checkPendingORdoneORrefund(item) == Billing_Payment_Received_Icon ?

                                        <Tooltip
                                            topAdjustment={
                                                Platform.OS === 'android'
                                                    ? -StatusBar.currentHeight
                                                    : 0
                                            }
                                            animated={true}
                                            isVisible={this.props.tooltipSteps == 3 ? true : false}

                                            backgroundColor={'rgba(0,0,0,0.5)'}
                                            contentStyle={{
                                                backgroundColor: '#6f6af4',
                                                height: '100%',
                                            }}
                                            tooltipStyle={{ left: 15, alignItems: 'flex-start' }}
                                            content={
                                                <TouchableOpacity
                                                    style={{ backgroundColor: '#6f6af4' }}
                                                    onPress={() => { this.props.toolTipClick(4) }}

                                                >
                                                    <AddPatient
                                                        imagePath={Tooltip_Received}
                                                        title={'Payment Received'}
                                                        description={
                                                            'The green check mark indicates that the payment has been received'
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            }
                                            //(Must) This is the view displayed in the tooltip
                                            placement="bottom"
                                            //(Must) top, bottom, left, right, auto.
                                            onClose={() => { this.props.toolTipClick(4) }}


                                        //(Optional) Callback fired when the user taps the tooltip
                                        >

                                            <Image style={{
                                                resizeMode: "contain", alignSelf: 'center', width: 35, height: 35
                                            }} source={this.checkPendingORdoneORrefund(item)} />

                                        </Tooltip> :

                                        this.checkPendingORdoneORrefund(item) == Billing_Payment_Pending_Icon ?

                                            <Tooltip
                                                topAdjustment={
                                                    Platform.OS === 'android'
                                                        ? -StatusBar.currentHeight
                                                        : 0
                                                }
                                                animated={true}
                                                isVisible={this.props.tooltipSteps == 4 ? true : false}

                                                backgroundColor={'rgba(0,0,0,0.5)'}
                                                contentStyle={{
                                                    backgroundColor: '#6f6af4',
                                                    height: '100%',
                                                }}
                                                tooltipStyle={{ left: 15, alignItems: 'flex-start' }}
                                                content={
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: '#6f6af4' }}
                                                        onPress={() => { this.props.toolTipClick(5) }}

                                                    >
                                                        <AddPatient
                                                            imagePath={Tooltip_Pending}
                                                            title={'Payment Pending'}
                                                            description={
                                                                'The hourglass icon indicates that payment is still pending'
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                }
                                                //(Must) This is the view displayed in the tooltip
                                                placement="bottom"
                                                //(Must) top, bottom, left, right, auto.
                                                onClose={() => { this.props.toolTipClick(5) }}


                                            //(Optional) Callback fired when the user taps the tooltip
                                            >

                                                <Image style={{
                                                    resizeMode: "contain", alignSelf: 'center', width: 35, height: 35
                                                }} source={this.checkPendingORdoneORrefund(item)} />

                                            </Tooltip> :
                                            this.checkPendingORdoneORrefund(item) == Billing_Payment_Refund_Icon ?

                                                <Tooltip
                                                    topAdjustment={
                                                        Platform.OS === 'android'
                                                            ? -StatusBar.currentHeight
                                                            : 0
                                                    }
                                                    animated={true}
                                                    isVisible={this.props.tooltipSteps == 5 ? true : false}

                                                    backgroundColor={'rgba(0,0,0,0.5)'}
                                                    contentStyle={{
                                                        backgroundColor: '#6f6af4',
                                                        height: '100%',
                                                    }}
                                                    tooltipStyle={{ left: 15, alignItems: 'flex-start' }}
                                                    content={
                                                        <TouchableOpacity
                                                            style={{ backgroundColor: '#6f6af4' }}
                                                            onPress={() => { this.props.toolTipClick(6) }}

                                                        >
                                                            <AddPatient
                                                                imagePath={Tooltip_Refunded}
                                                                title={'Payment Refunded'}
                                                                description={
                                                                    'This symbol indicates that the payment has been refunded'
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    }
                                                    //(Must) This is the view displayed in the tooltip
                                                    placement="bottom"
                                                    //(Must) top, bottom, left, right, auto.
                                                    onClose={() => { this.props.toolTipClick(6) }}


                                                //(Optional) Callback fired when the user taps the tooltip
                                                >

                                                    <Image style={{
                                                        resizeMode: "contain", alignSelf: 'center', width: 35, height: 35
                                                    }} source={this.checkPendingORdoneORrefund(item)} />

                                                </Tooltip> :
                                                <Image style={{
                                                    resizeMode: "contain", alignSelf: 'center', width: 35, height: 35
                                                }} source={this.checkPendingORdoneORrefund(item)} />

                                }


                            </View>



                            <View style={styles.content_container}>

                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                        <Text style={{ color: '#000000', fontSize: 20, fontFamily: 'NotoSans' }}>{item.Name ? item.Name : "Patient"}</Text>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>

                                        {
                                            //For old data

                                            // item.PayType == 1 && item.IsCancelled == 1 && item.IsRefunded == 1 && item.ConsultComplete == 0 ? null :


                                            !item.IsPaid && this.isDateIsPast(item.WhenEntered) ? null :

                                                !item.PayType ?
                                                    <Text style={{ color: "#29b62f", fontSize: 20 }}>{"+ "}</Text>
                                                    :

                                                    item.PayType == 5 ?
                                                        <Text style={{ color: "#636363", fontSize: 20 }}>{"- "}</Text>

                                                        :
                                                        (item.IsPaid == 1 && item.IsPaidByAdmin == 1) || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ?
                                                            <Text style={{ color: (item.IsPaid == 1 && item.IsPaidByAdmin == 1) || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : "#636363", fontSize: 20 }}>{"+ "}</Text>
                                                            :
                                                            item.IsRefunded == 1 && item.IsCancelled == null ?
                                                                <Text style={{ color: "#636363", fontSize: 20 }}>{"- "}</Text>

                                                                :
                                                                null
                                        }
                                        <Text style={{
                                            color: !item.PayType ? "#29b62f" :
                                                !item.IsPaid && this.isDateIsPast(item.WhenEntered) ? "#444444" :
                                                    item.PayType == 5 ? "#444444" : (item.IsPaid == 1 && item.IsPaidByAdmin == 1) || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : item.IsRefunded == 1 && item.IsCancelled == null ? "#444444" : "#444444", fontSize: 20

                                        }}>{getCurreny() + " "}</Text>
                                        <Text style={{
                                            color:
                                                !item.PayType ? "#29b62f" :
                                                    !item.IsPaid && this.isDateIsPast(item.WhenEntered) ? "#444444" :
                                                        item.PayType == 5 ? "#444444" : (item.IsPaid == 1 && item.IsPaidByAdmin == 1) || (item.IsRefunded == 1 && item.IsCancelled == 1) || item.PayType == 4 ? "#29b62f" : item.IsRefunded == 1 && item.IsCancelled == null ? "#444444" : "#444444", fontSize: 20
                                        }}>{item.ConsultFees.toFixed(2)}</Text>


                                    </View>

                                </View>
                                {

                                    //  item.PayType ?

                                    <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>



                                        <View
                                            style={{ flexDirection: 'row', marginRight: 40, flex: 1 }}
                                        >
                                            <View style={{
                                                flexDirection: "row",

                                                borderRadius: 6,
                                                borderWidth: 1,
                                                borderColor:
                                                    !item.PayType ? "#820091" :
                                                        item.PayType == 5 ? "#ff4600" : item.PayType == 1 || item.PayType == 2 ? "#820091" : item.PayType == 3  ? "#02798a" : item.PayType == 7 ? "#02798a" :
                                                            item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Video Consulation")) ? "#820091" :
                                                                item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Clinic Appointment")) ? "#db575a" : "gray"

                                            }}>
                                                <Text style={{

                                                    paddingHorizontal: 5,
                                                    color: !item.PayType ? "#820091" :
                                                        item.PayType == 5 ? "#ff4600" :
                                                            item.PayType == 1 || item.PayType == 2 ? "#820091" : item.PayType == 3 ? "#02798a" : item.PayType == 7 ? "#02798a" :
                                                                item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Video Consulation")) ? "#820091" :
                                                                    item.PayType == 4 && item.ServiceProvided && (item.ServiceProvided.split(',').includes("Clinic Appointment")) ? "#db575a" :


                                                                        "gray", fontSize: 12
                                                }}>{
                                                        !item.PayType ? "Video Consulation" : item.PayType == 5 ? "Refund" :
                                                            item.PayType == 1 || item.PayType == 2 ? " Video Consulation " : item.PayType == 3 ? " Precrip Pay Link " : item.PayType == 7 ? " Prescrip Supscription " : item.PayType == 4 ?
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


                                        {/* <Text style={{ alignSelf: 'flex-end', textAlign: 'right', color: "#787878", fontSize: 12 }}>{item.Remarks && item.Remarks == "clonedcancel" ? "Refunded" : item.IsRefunded == 1 && item.IsCancelled == null ? "Refunded" : item.PayType == 1 ? "via Prescrip" : item.PayType == 2 ? "via Prescrip" : item.PayType == 3 ? "via Prescrip Link" : item.PayType == 4 ? "" : item.PayType == 5 ? "Refunded" : ""}</Text>*/}



                                    </View>
                                    //  : null
                                }



                                { /*  <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                                    
                                    <View style={{
                                        flex: 1, marginTop: 15, textAlign: 'center', justifyContent: 'flex-end',
                                        flexDirection: 'row'
                                    }}>


                                        <TouchableOpacity
                                       
                                            onPress={() => { item.IsCancelled == 1 || item.IsRefunded == 1 || item.Remarks == "clonedcancel" ? this.props.viewReceptClick('viewReceipt', item) : this.props.viewReceptClick(item.PayType == 4 ? 'viewReceipt' : item.IsPaid == 0 ? 'viewInfo' : 'viewReceipt', item) }} >


                                            <Text style={{ textAlign: "right", padding: 5, color: '#0065d7', fontSize: 13 }}>{item.IsCancelled == 1 || item.IsRefunded == 1 || item.Remarks == "clonedcancel" ? "View Receipt" : item.PayType == 4 ? 'View Receipt' : item.IsPaid == 0 ? "View Info." : "View Receipt"}</Text>

                                        </TouchableOpacity>
                                    </View>

                                </View>
                                */}

                            </View>
                        </TouchableOpacity>
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

        color: '#4c4c4c',
        fontFamily: 'NotoSans',
        alignSelf: 'flex-end'
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
        flex: 0.90,
        marginLeft: 10


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