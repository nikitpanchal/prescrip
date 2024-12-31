import React, { Component } from "react";

import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Container, Text } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { icon_Chief_Complaints_Duration_Button, icon_Reemove_Button } from '../../constants/images';
export default class SwipeListDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValues: [],
            listValues: ["Fever", "Dust", "Smoke", "Headache", "Polen", "Dizziness", "Insomnia", "Giddiness", "Lactose Intolerance", "Tuberculosis", "Caner", "Osteoporosis", "Diabetes"],
        }

    }
    componentDidMount() {

    }
    addValue(item, inde) {

        let selected = {
            value: item,
            duration: 'Select',
            period: 'Select'
        }
        this.state.selectedValues.push(selected);
        this.setState({
            selectedValues: this.state.selectedValues

        })
    }
    renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => { this.addValue(item.item, index) }} style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 22, fontFamily: 'NotoSans', padding: 5 }}>{item.item}</Text>
            </TouchableOpacity>
        )
    }
    removeSelectedItem(rowItem) {
        this.state.selectedValues.splice(rowItem.index, 1);
        this.setState({
            selectedValues: this.state.selectedValues
        });


    }
    renderSelectedItem(rowItem, index) {
        return (
            <View style={{ backgroundColor: '#ffffff', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={icon_Chief_Complaints_Duration_Button} style={{ width: 40, height: 40, marginRight: 10 }} resizeMode="contain"></Image>
                    <Text style={{ color: '#000000', fontFamily: 'NotoSans-Bold', fontSize: 20 }}>{rowItem.item.value}</Text>
                </View>
                <TouchableOpacity onPress={() => { this.removeSelectedItem(rowItem, index) }}>
                    <Image source={icon_Reemove_Button} style={{ width: 15, height: 15, marginHorizontal: 10 }} resizeMode="contain"></Image>
                </TouchableOpacity>
            </View>
        )
    }
    renderHiddenItem(rowItem) {
        return (
            <View style={{ padding: 15, backgroundColor: '#E6EEF7', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {/*Duration*/}
                <TouchableOpacity onPress={() => alert("Duration")}>
                    <View>
                        <Text style={{ fontFamily: 'NotoSans', fontSize: 12, color: '#c4c4c4' }}>Duration</Text>
                        <Text style={{ color: '#0b69d8', fontFamily: 'NotoSans-Bold', fontSize: 20 }}>
                            {rowItem.item.duration}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert("Period")}>
                    <View>
                        <Text style={{ fontFamily: 'NotoSans', fontSize: 12, color: '#c4c4c4' }}>Period</Text>
                        <Text style={{ color: '#0b69d8', fontFamily: 'NotoSans-Bold', fontSize: 20 }}>
                            {rowItem.item.duration}
                        </Text>
                    </View>
                </TouchableOpacity>
                {/*Duration Ends*/}
            </View>
        )
    }
    renderSeperator() {
        return (
            <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
        )
    }

    render() {
        return (
            <View style={{ marginTop: 20 }}>
                <View style={{ flex: 1 }}>

                    {this.state.selectedValues.length != 0 ?
                        <View>
                            <Text style={{ fontSize: 22, fontFamily: 'NotoSans-Bold', padding: 5 }}>Selected an item</Text>
                            <SwipeListView
                                data={this.state.selectedValues}
                                disableLeftSwipe={true}
                                renderItem={(data, index) => this.renderSelectedItem(data, index)}
                                renderHiddenItem={(data, index) => this.renderHiddenItem(data, index)}
                                leftOpenValue={310}

                            />
                        </View>
                        : null
                    }

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 22, fontFamily: 'NotoSans-Bold', padding: 5 }}>Select an item</Text>
                        <FlatList
                            data={this.state.listValues}
                            ItemSeparatorComponent={this.renderSeperator}
                            renderItem={(item, index) => this.renderItem(item, index)}
                            extraData={this.state}
                            keyExtractor={(item, i) => i.toString()}
                        />
                    </View>
                </View>
            </View>
        )
    }

}