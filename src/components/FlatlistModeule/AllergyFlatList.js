//Flatlist Allergies
import React, { Component } from 'react'
import { Platform } from 'react-native';
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native'
import multipleTapHandler from '../../components/MultiTapHandle/index';
export default class AllergyFlatList extends Component {
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
    //On Item Click
    onListClick(index, item) {
        //this.setArr.splice(0,0,item);
        //this.setArr.push(item);
        let allergies = this.props.patientProfile.selectedAllergy;
        
        let allergyStr = allergies[0][this.props.patientProfile.allergyType];
        let arr = [];
        if (allergyStr.length > 0) {
            arr = allergyStr.split(',');
        }

        arr.push(item);
        arr = arr.filter(item => {
            if (item.length > 0) {
                return item;
            }
        });
        allergies[0][this.props.patientProfile.allergyType] = arr.toString();
        

        this.props.addPatientAllergy(allergies);
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack()
    }

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

                    <View style={{  flexDirection: 'row', alignItems: 'center',borderBottomColor: '#cccccc', borderBottomWidth: 2, paddingBottom:10}}>
                        <TouchableOpacity onPress={this.props.backPress} style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.leftImage} style={{ resizeMode: 'contain', height: 20 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8 }}>
                            <Text style={{ fontFamily: 'NotoSans', color: '#959595', textTransform: 'uppercase', fontSize: 10,alignSelf:Platform.isPad?'flex-start':null }}>{this.props.searchTitle}</Text>
                            <TextInput
                                value={this.props.enterText}
                                placeholder={"Search " + this.props.patientProfile.allergyType + " Allergy"}

                                autoCorrect={false}
                                onChangeText={this.props.searchText}
                                style={{ fontSize: 20, fontFamily: 'NotoSans',padding:0,includeFontPadding:false }} />
                        </View>

                        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.rightImage} style={{ resizeMode: 'contain', height: 20,width:20 }} />
                        </View>
                </View>
                {this.props.enterText && this.props.addView ?
                    <View style={{ flexDirection: 'column', backgroundColor: '#f1f1f1', }}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fff', paddingStart: 8, paddingVertical: 18 }}>
                            <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 14, }}>
                                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                        <Text style={{ fontFamily: 'NotoSans-Bold', color: '#0065d7', fontSize: 25 }}>{this.props.enterText}</Text>
                                        <Text style={{ fontFamily: 'NotoSans', color: '#0065d7', fontSize: 12 }}>{this.props.subTitle}</Text>
                                    </View>
                                    <TouchableOpacity  onPress={this.props.addImgClick}  >
                                    <Image source={this.props.addImage} style={{ resizeMode: 'contain', height: 25,width:25 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>: null}
                <View style={{ flex: 1 }}>
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