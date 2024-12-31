/* Developed and updated by Ruban 
  on 8/10/20 */


import React, { Component, useCallback } from 'react'
import { View, TouchableOpacity, Image, ListView, ScrollView, TouchableHighlight, Dimensions, Platform } from 'react-native';
import { Container, Text, Button, List, ListItem, Icon } from 'native-base';
import { icon_Chief_Complaints_Duration_Button, icon_Reemove_Button, ic_dropdown_bottom } from '../../constants/images';
import { SwipeListView } from 'react-native-swipe-list-view';
import Modal from "react-native-modalbox";
import { FlatList } from 'react-native-gesture-handler';
let { height, width } = Dimensions.get('window');


export default class PatientEmptyComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: 1,
            OrientationStatus: '',
            Height_Layout: '',
            Width_Layout: '',
            selectedVal: this.props.patientData,
            currentItem: null,
            hiddentext: ['Type', 'Frequency', 'Duration'],
            hiddentextHistory: ['Duration', 'Related to'],
            modalType: [],
            default: true,
            title: '',
            valuePeriod: 'Select',
            valueType: 'Select',
            valueDuration: 'Select',
            valueFrequency: 'Select',
            valueRelatedto: 'Select',
        },
            this.length = 0;
        this.modalCity = React.createRef();
        this.modalData = {
            "Type": ["Beer", "Vodka", "Tobacco", "Alcohol", "Rum", "Weeds"],
            "Duration": ["1 Week",
                "1 Month",
                "2-5 Months",
                "6 Months",
                "6-11 Months",
                "1 Year",
                "2 Years", "3 Years", "4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years", "11 Years", "12 Years", "13 Years", "14 Years", "15 Years", "16 Years", "17 Years", "18 Years", "19 Years", "20 Years", "21 Years", "22 Years", "23 Years", "24 Years", "25 Years", "26 Years", "27 Years", "28 Years", "29 Years", "30 Years", "31 Years", "32 Years", "33 Years", "34 Years", "35 Years", "36 Years", "37 Years", "38 Years", "39 Years", "40 Years", "41 Years", "42 Years", "43 Years", "44 Years", "45 Years", "46 Years", "47 Years", "48 Years", "49 Years", "50 Years", "51 Years", "52 Years", "53 Years", "54 Years", "55 Years", "56 Years", "57 Years", "58 Years", "59 Years", "60 Years", "61 Years", "62 Years", "63 Years", "64 Years", "65 Years", "66 Years", "67 Years", "68 Years", "69 Years", "70 Years", "71 Years", "72 Years", "73 Years", "74 Years", "75 Years", "76 Years", "77 Years", "78 Years", "79 Years", "80 Years"],
            "Frequency": [
                "Everyday",
                "Twice a week",
                "Weekly",
                "Monthly",
                "Quarterly",
                "Yearly"
            ],
            "relation": ["Self", "Mother",
                "Father",
                "Brother",
                "Mother, Father",
                "Sister",
                "Wife",
                "Husband"]
            ,
            "period": ["Years", "Months", "Days"]
            ,
        }
    }
    componentDidMount() {
        //this.DetectOrientation();
    }
    refreshList() {
        this.setState({
            key: this.state.key++

        })

    }
    DetectOrientation() {
        if (this.swipeList) {
            this.swipeList.closeAllOpenRows();
        }

        if (this.state.Width_Layout > this.state.Height_Layout) {
            width = this.state.Width_Layout;
            // Write Your own code here, which you want to execute on Landscape Mode.

            this.setState({
                OrientationStatus: 'Landscape Mode'
            });
        }
        else {
            width = this.state.Height_Layout;

            // Write Your own code here, which you want to execute on Portrait Mode.

            this.setState({
                OrientationStatus: 'Portrait Mode'
            });
        }

    }
    //function to remove items from list
    removeSelectedItem(rowItem, rowIndex) {
        this.state.selectedVal.splice(rowItem.index, 1);
        if (this.props.type == "History") {
            let data = this.props.patientProfile.history;
            data.splice(rowItem.index, 1);
            this.props.setPatientHistory(data);
        }
        else if (this.props.type == "Habit") {
            let data = this.props.patientProfile.habits;
            data.splice(rowItem.index, 1);
            this.props.setPatientHabits(data);
        }


        this.setState({
            selectedVal: this.state.selectedVal
        });


    }
    componentWillReceiveProps() {
        if (this.props.type == "Habit") {
            this.habits = [];
            let key = "id";
            this.habits = this.props.patientProfile.habits.map((item, index) => {
                item[key] = index + 1;
                return item;
            })
            this.setState({
                refresh: true,
                selectedVal: this.habits
            })
        }
        else if (this.props.type == "History") {
            this.history = [];
            let key = "id";
            this.history = this.props.patientProfile.history.map((item, index) => {
                item[key] = index + 1;
                return item;
            })
            this.setState({
                refresh: true,
                selectedVal: this.history
            })
        }

    }

    // dataChanges()
    // {
    //     let Data ={
    //         "Duration":this.state.valueDuration,
    //         "Frequency":this.state.valueFrequency,
    //         "Name":this.state.valueType,
    //         "Type":""
    //     }
    //     this.props.onDataChanges("PatientHabits",Data)
    //   }


    openRow(index, rowMap) {
        //   this.DetectOrientation();
        if (rowMap[index + 1]) {
            let rowRef = rowMap[index + 1];


            if (!rowRef.isOpen) {

                rowRef.manuallySwipeRow(Platform.isPad ? (width - (width * 0.20)) : 320);
                rowRef.isOpen = true;
            }
            else {

                rowRef.closeRow();
                rowRef.isOpen = false;

            }


        }

    }

    //render default swipe ui of Habits and history one function for both
    renderSelectedItem(rowItem, rowMap) {

        let split = rowItem.item.Duration ? (rowItem.item.Duration).split(" ") : null
        let num = rowItem.item.Duration ? split[0] : ""
        let days = rowItem.item.Duration ? split[1] : ""



        return (

            <View style={{
                shadowColor: "#d9d9d9",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                marginHorizontal: 5,
                elevation: 8, padding: 10, margin: 15, borderRadius: 8,
                backgroundColor: '#ffffff', flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between', flex: 1
            }}>
                <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>

                    {
                        //Clock & Duration view
                        rowItem.item.Duration ?
                            <TouchableOpacity onPress={() => { this.openRow(rowItem.index, rowMap) }}
                                style={{ marginLeft: 10, alignSelf: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: '#E6EEF7', justifyContent: 'center' }}
                            >

                                <Text style={{ color: '#0869d8', fontFamily: 'NotoSans-Bold', fontSize: 16, }}>{num}</Text>

                                <Text style={{ color: '#0869d8', fontFamily: 'NotoSans', fontSize: 11 }} numberOfLines={1}>{days}</Text>



                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { this.openRow(rowItem.index, rowMap) }}>
                                <Image source={icon_Chief_Complaints_Duration_Button} style={{ width: 50, height: 50, marginHorizontal: 10 }} resizeMode="contain"></Image>
                            </TouchableOpacity>

                        //Ends
                    }
                    <View style={{ flex: 0.9, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode='tail'
                            style={{ marginHorizontal: 10, color: '#000000', fontFamily: 'NotoSans-Bold', fontSize: 20, }}>{this.props.type == "History" ? rowItem.item.Disease : rowItem.item.Name}</Text>
                        {/*this.props.type=="History" ? <View style={{ flexDirection: 'row' }}>

                            <Text style={{ color: '#616161', fontSize: 12 }}>found in {this.state.valueRelatedto ? this.state.valueRelatedto : rowItem.item.relatedto}</Text>
                        </View> :
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#616161', fontSize: 12 }}>in the form of {this.state.valueType ? this.state.valueType : rowItem.item.type}, </Text>
                                <Text style={{ color: '#616161', fontSize: 12 }}>  {this.state.valueFrequency ? this.state.valueFrequency : rowItem.item.frequency}</Text>
                    </View>*/}

                    </View>


                </View>
                {/*Delete Button*/}
                <View
                    style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}

                >
                    <TouchableOpacity
                        onPress={() => this.removeSelectedItem(rowItem)}>
                        <Image source={icon_Reemove_Button} style={{ width: 15, height: 15, marginHorizontal: 10 }} resizeMode="contain"></Image>
                    </TouchableOpacity>
                </View>
                {/*Delete Button*/}
            </View>


        )


    }

    //get value from state depends upon item and return it
    bindValue(item) {
        switch (item) {
            case "Duration":
                return this.state.valueDuration

            case "Type":
                return this.state.valueType

            case "Period":
                return this.state.valuePeriod

            case "Frequency":
                return this.state.valueFrequency

            case "Related to":
                return this.state.valueRelatedto

        }
    }


    // this function shows after  swiper is enabled and this displays views of duration,period and weekly of History
    renderHiddenItemHistory(rowItem) {
        // this.setState({
        //     currentItem : rowItem
        // });
        return (
            <View style={{
                padding: 5, margin: 15, marginRight: 5, backgroundColor: '#E6EEF7',
                flexDirection: 'row',
                borderRadius: 8,

            }}>
                {this.state.hiddentextHistory.map((item, index) => {
                    return (
                        <TouchableOpacity style={{ flex: 0.45, alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => this.titlemodal(item, rowItem)} >
                            <View style={{ height: '100%', width: '100%' }}>
                                <Text style={{ color: '#616161', fontSize: 12, fontFamily: 'NotoSans', }} >{item}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#0065d7', borderBottomWidth: 0.8, width: '90%' }}>
                                    <View style={{ flex: 0.7, }}>
                                        <Text style={{ fontFamily: 'NotoSans', color: '#0869d8', fontFamily: 'NotoSans-Bold', fontSize: 20 }} numberOfLines={1}>{index == 0 ? rowItem.item.Duration : rowItem.item.Relation}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Image source={ic_dropdown_bottom} style={{ height: 6, resizeMode: 'contain' }} />
                                    </View>

                                </View>



                            </View>
                            {/* <View style={{ height: '100%', width: '100%' }}>
                                <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>{item}</Text>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ flex: 0.8, }}>
                                        <Text style={{ fontFamily: 'NotoSans', color: '#0869d8' }}>{this.bindValue(item)}</Text>
                                    </View>
                                    <View style={{ flex: 0.2 }}>
                                        <Image source={ic_dropdown_bottom} style={{ height: 8, resizeMode: 'contain' }} />
                                    </View>

                                </View>

                            </View> */}


                        </TouchableOpacity>
                    )
                })
                }


                {/*                
                {this.inputRender()} */}
            </View>
        )
    }

    //set listitem of modal depends upon modal type
    setvalue(dataType, value) {
        switch (dataType) {
            case "Type":
                this.state.currentItem.item.Type = value;
                this.state.selectedVal[this.state.currentItem.index] = this.state.currentItem.item;

                this.setState({
                    valueType: value,
                    currentItem: this.state.currentItem,
                    selectedVal: this.state.selectedVal
                }, () => {
                }, () => {
                    this.modal.close()
                })
                this.modal.close()
                break;

            case "Frequency":
                this.state.currentItem.item.Frequency = value;
                this.state.selectedVal[this.state.currentItem.index] = this.state.currentItem.item;
                this.modal.close();
                this.setState({
                    valueFrequency: value,
                    currentItem: this.state.currentItem,
                    selectedVal: this.state.selectedVal
                }, () => {
                }, () => {
                    this.modal.close()
                })
                break;

            case "Duration":
                this.state.currentItem.item.Duration = value;
                this.state.selectedVal[this.state.currentItem.index] = this.state.currentItem.item;
                this.setState({
                    valueDuration: value,
                    currentItem: this.state.currentItem,
                    selectedVal: this.state.selectedVal
                }, () => {
                    this.modal.close()
                })
                break;

            case "Period":
                this.setState({ valuePeriod: value }, () => {
                    this.modal.close()
                })
                break;

            case "Related to":
                this.state.currentItem.item.Relation = value;
                this.state.selectedVal[this.state.currentItem.index] = this.state.currentItem.item;
                this.setState({
                    valueRelatedto: value,
                    currentItem: this.state.currentItem,
                    selectedVal: this.state.selectedVal
                }, () => {
                    this.modal.close()
                })
                break;


        }

    }

    // displays title of modal depends upon type
    //Set current item and open modal
    titlemodal(title, rowItem) {
        this.setState({
            currentItem: rowItem
        });

        switch (title) {
            case "Type":
                let dbHistory = this.props.patientProfile.patientHabits[0].Value;

                let index = dbHistory.findIndex(db => db[0] == rowItem.item.Name)
                let arr = dbHistory[index];
                let str = arr[1] ? arr[1] : "";
                let types = str ? str.split(',') : [];
                this.modalData.Type = types;
                this.setState({ title, modalType: this.modalData.Type }, () => {
                    this.modal.open()
                })
                break;

            case "Frequency":
                this.setState({ title, modalType: this.modalData.Frequency }, () => {
                    this.modal.open()
                })
                break;

            case "Duration":
                this.setState({ title, modalType: this.modalData.Duration }, () => {
                    this.modal.open()
                })
                break;

            case "Period":
                this.setState({ title, modalType: this.modalData.period }, () => {
                    this.modal.open()
                })
                break;

            case "Related to":
                this.setState({ title, modalType: this.modalData.relation }, () => {
                    this.modal.open()
                })
                break;


        }

    }

    BindData(item, index, dataType) {
        return (
            <TouchableOpacity onPress={() => this.setvalue(dataType, item)} style={{ padding: 10, alignItems: 'center', }}>
                <Text style={{ fontSize: 20, fontFamily: 'NotoSans', color: '#000' }}>{item}</Text>
            </TouchableOpacity>
        )

    }

    //seperator list item by border used in flatlist
    renderSeperator() {
        return (
            <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
        )
    }

    // this function shows after  swiper is enabled and this displays views of duration,period and related to of Habits
    renderHiddenItemHabits(rowItem) {

        return (
            <View style={{
                padding: 5, margin: 15, marginRight: 5, backgroundColor: '#E6EEF7',
                flexDirection: 'row',
                borderRadius: 8,
            }}>
                {this.state.hiddentext.map((item, index) => {
                    return (

                        <TouchableOpacity style={{ flex: 0.29, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#E6EEF7', }} onPress={() => this.titlemodal(item, rowItem)} >
                            <View style={{ height: '100%', width: '100%', alignItems: 'flex-start', }}>
                                <Text style={{ fontSize: 10, color: '#616161', fontFamily: 'NotoSans' }}>{item}</Text>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.7, borderBottomColor: '#0065d7', borderBottomWidth: 0.8 }}>
                                        <Text style={{ color: '#0869d8', fontFamily: 'NotoSans-Bold', fontSize: 18 }} numberOfLines={1}>{index == 0 ? rowItem.item.Type : index == 1 ? rowItem.item.Frequency : rowItem.item.Duration}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: 'flex-end', paddingTop: 8, }}>
                                        <Image source={ic_dropdown_bottom} style={{ height: 6, resizeMode: 'contain', }} />
                                    </View>

                                </View>



                            </View>


                        </TouchableOpacity>
                    )

                })





                    // <TouchableOpacity style={{ flex: 0.25, alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => this.titlemodal(item)} >
                    //     <View style={{ height: '100%', width: '100%' }}>
                    //         <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans' }}>{item}</Text>
                    //         <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    //             <View style={{ flex: 0.8, borderBottomColor: '#0065d7', borderBottomWidth: 0.8, width: '10%' }}>
                    //                 <Text style={{ fontFamily: 'NotoSans', color: '#0869d8' }}>{this.bindValue(item)}</Text>
                    //             </View>
                    //             <View style={{ flex: 0.2 }}>
                    //                 <Image source={ic_dropdown_bottom} style={{ height: 8, resizeMode: 'contain' }} />
                    //             </View>

                    //         </View>

                    //     </View>


                    // </TouchableOpacity>

                }


                {/*                
                {this.inputRender()} */}
            </View>
        )
    }


    //if doctor added new items in array this function will be called to render flat swipe list
    renderFlatItem() {

        return (
            <View style={{ flex: 1 }}>

                <SwipeListView

                    data={this.state.selectedVal}

                    renderItem={(rowData, rowMap) => this.renderSelectedItem(rowData, rowMap)}
                    renderHiddenItem={(data, index) => (this.props.type == "History" ? this.renderHiddenItemHistory(data, index) :
                        this.renderHiddenItemHabits(data, index))}
                    disableLeftSwipe={true}
                    disableRightSwipe={true}
                    key={this.state.key}
                    ref={'swipeList'}
                    keyExtractor={item => item.id}
                    extraData={this.state}
                    closeOnScroll={true}


                />
                <View style={{ paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>

                    <Button onPress={this.props.btnClick} block style={{
                        backgroundColor: '#fff', borderColor: '#0065d7', marginTop: 15,
                        borderWidth: 1, alignSelf: 'center', borderRadius: 20
                    }}>
                        <Text style={{ color: '#0065d7', fontFamily: 'NotoSans-Bold', fontWeight: '500', fontSize: 16 }}>{this.props.btnText}</Text>
                    </Button>
                    <Text style={{ fontFamily: 'NotoSans', color: '#8e8e8e', fontSize: 15, marginTop: 8 }}>  {this.props.hiddenTitle}</Text>
                </View>
            </View>

        )

    }

    //main function
    render() {

        return (
            <View style={{ flex: 1 }} >
                {this.state.selectedVal.length > 0 ?
                    this.renderFlatItem()
                    :
                    <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontFamily: 'NotoSans', color: '#8e8e8e', fontSize: 15, textAlign: 'center' }}>  {this.props.title}</Text>
                        <Button onPress={this.props.btnClick} block style={{
                            backgroundColor: '#fff', borderColor: '#0065d7', marginTop: 15,
                            borderWidth: 1, alignSelf: 'center', borderRadius: 20
                        }}>
                            <Text style={{ color: '#0065d7', fontFamily: 'NotoSans-Bold', fontWeight: '500', fontSize: 16 }}>{this.props.btnText}</Text>
                        </Button>
                    </View>}

                <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{
                        borderWidth: 0, width: '70%', borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20, borderTopRightRadius: 20, height: '60%', overflow: 'hidden',
                    }}
                    ref={(ref) => this.modal = ref}

                    swipeToClose={false}
                    position={"center"}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={() => { this.close }}
                    onOpened={this.open}
                    onClosingState={this.onClosingState}>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#616161', borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 20, color: '#616161', fontFamily: 'NotoSans' }}>{this.state.title}</Text>
                        </View>
                        <View style={{ flex: 0.9, borderBottomColor: '#616161', borderBottomWidth: 1 }}>
                            <FlatList
                                data={this.state.modalType}
                                ItemSeparatorComponent={this.renderSeperator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => this.BindData(item, index, this.state.title)} />
                        </View>

                    </View>


                </Modal>
            </View>
        )
    }
}