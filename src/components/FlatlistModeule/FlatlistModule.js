import { relativeTimeThreshold } from 'moment'
import React, { Component } from 'react'
import { View, Alert, Text, SafeAreaView, Image, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native'
import multipleTapHandler from '../../components/MultiTapHandle/index';
export default class FlatlistSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tempData: [],
            searchText: '',

        }
        this.setArr = this.props.patientData
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }
    //on flatlist item click
    onListClick(index, item) {
        if (this.props.type == "History") {
            let obj = {
                Disease: item,
                Relation: "",
                Duration: ""

            }

            let item_index = -1;
            item_index = this.setArr.findIndex(item => {
                if (item.Disease == obj.Disease) {
                    return item
                }

            });
            if (item_index > -1) {
                Alert.alert("Prescrip", "Item already added")
            }
            else {
                this.setArr.push(obj);
                this.props.type == "History" ? this.props.setPatientHistory(this.setArr) :
                    this.props.setPatientHabits(this.setArr)
                multipleTapHandler.clearNavigator();
                this.props.navigation.goBack()
            }
        }
        else if (this.props.type == "Habit") {
            let obj = {

                "Name": item,
                "Type": "",
                "Frequency": "",
                "Duration": ""

            }

            let item_index = -1;
            item_index = this.setArr.findIndex(item => {
                if (item.Name == obj.Name) {
                    return item
                }

            });
            if (item_index > -1) {
                Alert.alert("Prescrip", "Item already added")
            }
            else {
                this.setArr.push(obj);
                this.props.type == "History" ? this.props.setPatientHistory(this.setArr) :
                    this.props.setPatientHabits(this.setArr)
                multipleTapHandler.clearNavigator();
                this.props.navigation.goBack()
            }
        }


    }

    // view of flatlist item
    itemView(item, index) {
        return (
            <TouchableOpacity onPress={() => this.onListClick(index, item)} style={{ justifyContent: 'center', padding: 20, borderBottomColor: '#cccccc', borderBottomWidth: 0.7 }}>
                <Text style={{ fontSize: 20, fontFamily: 'NotoSans' }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, top: 30 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: '#cccccc', borderBottomWidth: 2, paddingBottom: 10, }}>
                    <TouchableOpacity onPress={this.props.backPress} style={{ flex: Platform.isPad ? 0.08 : 0.15, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={this.props.leftImage} style={{ resizeMode: 'contain', height: 20 }} />
                    </TouchableOpacity>
                    <View style={{ flex: Platform.isPad ? 0.8 : 0.7 }}>
                        <Text style={{ fontFamily: 'NotoSans', color: '#959595', textTransform: 'uppercase', fontSize: 10 }}>{this.props.searchTitle}</Text>
                        <TextInput
                             value={this.props.enterText}
                            autoCorrect={false}
                            placeholder={"Search for " + this.props.type}
                            onChangeText={this.props.searchText}
                            style={{ fontSize: 20, fontFamily: 'NotoSans', padding: 0, includeFontPadding: false }} />
                    </View>

                    <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={this.props.rightImage} style={{ resizeMode: 'contain', height: 20, width: 20 }} />
                    </View>
                </View>


                {/* 
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: '#cccccc', borderBottomWidth: 2,paddingBottom:5}}>
                        <TouchableOpacity onPress={this.props.backPress} style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.leftImage} style={{ resizeMode: 'contain', height: 20 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7,padding:0 }}>
                            <Text style={{ fontFamily: 'NotoSans', color: '#616161', textTransform: 'uppercase', fontSize: 12 }}>{this.props.searchTitle}</Text>
                            <TextInput
                                //autoCompleteType={false}
                                autoCorrect={false}
                                placeholder={"Search for " + this.props.type}
                                onChangeText={this.props.searchText}
                                style={{ fontSize: 20, fontFamily: 'NotoSans' }} />
                        </View>

                        <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.rightImage} style={{ resizeMode: 'contain', height: 18 }} />
                        </View>
                </View> */}
                {this.props.enterText && this.props.addView ?

                    <View style={{ flexDirection: 'column', backgroundColor: '#f1f1f1', }}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fff', paddingStart: 8, paddingVertical: 18 }}>
                            <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: Platform.isPad ? 30 : 14, }}>
                                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                        <Text style={{ fontFamily: 'NotoSans-Bold', color: '#0065d7', fontSize: 25 }}>{this.props.enterText}</Text>
                                        <Text style={{ fontFamily: 'NotoSans', color: '#0065d7', fontSize: 12 }}>{this.props.subTitle}</Text>
                                    </View>
                                    <TouchableOpacity onPress={this.props.addImgClick}  >
                                        <Image source={this.props.addImage} style={{ resizeMode: 'contain', height: Platform.isPad ? 45 : 32, width: Platform.isPad ? 45 : 32 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>



                    // <View style={{ flex: 0.12, borderBottomColor: '#cccccc', borderBottomWidth: 1, }}>
                    //     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 25 }}>

                    //         <View style={{ flex: 0.85, alignItems: 'flex-start' }}>
                    //             <Text style={{ fontFamily: 'NotoSans-Bold', color: '#0065d7', fontSize: 25 }}>{this.props.enterText}</Text>
                    //             <Text style={{ fontFamily: 'NotoSans', color: '#0065d7', fontSize: 12 }}>{this.props.subTitle}</Text>

                    //         </View>

                    //         <TouchableOpacity onPress={this.props.addImgClick} style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                    //             <Image source={this.props.addImage} style={{ resizeMode: 'contain', height: 25 }} />
                    //         </TouchableOpacity>
                    //     </View>
                    // </View> 
                    : null}
                <View style={{ flex: 0.78 }}>
                    <FlatList
                        data={this.props.filterData}
                        renderItem={({ item, index }) => this.itemView(item, index)}
                        keyExtractor={(item, i) => i.toString()}
                    />
                </View>

            </SafeAreaView>
        )
    }
}