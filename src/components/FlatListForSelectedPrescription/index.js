import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, Text, BackHandler, AsyncStorage, SwipeableListView } from "react-native"
import { Icon } from "native-base";
import Images from '../../Theme/Images'
import { SwipeListView } from 'react-native-swipe-list-view';
import { icon_Chief_Complaints_Duration_Button, icon_Reemove_Button } from '../../constants/images';
const colorCode = "#0b69d8";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default class FlatListForSelectedPrescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderSeperator() {
        return (
            <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
        )
    }

    renderHiddenItem(rowItem, index) {
        let { clickData } = this.props
        return (
            <View style={styles.hiddenparentcont}>
                {/*Duration*/}
                <Picker label={"Select Duration"} rowItem={rowItem} onPress={() => clickData("Duration", index)} style={{ flex: 2 }} />
                {/*Period*/}
                <Picker label={"Select Period"} rowItem={rowItem} onPress={() => clickData("Period",index)} style={{ flex: 3 }} />
                <View style={{ flex: 1 }}></View>
            </View>
        )
    }

    renderSelectedItem(rowItem, index) {
        let { crossClick_selectedItem } = this.props;
        let duration = '' ;//rowItem.item.Value.split(' ')[0] || '', 
        
        period = '';//rowItem.item.Value.split(' ')[1] || ''
        return (
            <View style={styles.selitem}>
                <View style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center' }}>
                    {
                        duration != '' && period != '' ?
                            <View style={{ margin: 10, alignSelf: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: '#E6EEF7', justifyContent: 'center' }}>
                                <Text style={{ color: colorCode, fontFamily: 'NotoSans-Bold', fontSize: 16 }}>{duration}</Text>
                                <Text style={{ color: colorCode, fontFamily: 'NotoSans', fontSize: 11 }}>{period}</Text>
                            </View>
                            :
                            <Image source={icon_Chief_Complaints_Duration_Button} style={{ width: 50, height: 50, marginHorizontal: 10 }} resizeMode="contain"></Image>
                    }
                    <Text numberOfLines={2} ellipsizeMode='tail' style={styles.itemname}>{rowItem.item.Name}</Text>
                </View>

                <TouchableWithoutFeedback onPress={() => crossClick_selectedItem(rowItem.item.id)}>
                    <View style={styles.removeiconcont}>
                        <Image source={icon_Reemove_Button} style={styles.removeicon} resizeMode="contain"></Image>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    Item(data, index) {
        let { leftImageOnClick, crossClick_selectedItem } = this.props
        return (
            <View style={styles.content_container}>
                <View style={{ flexDirection: 'row', justifyContent: '', }}>
                    <TouchableOpacity onPress={() => leftImageOnClick()} style={styles.leftimgcont}>
                        <Image style={styles.leftimg} source={this.props.leftImage} />
                    </TouchableOpacity>
                    <View onPress={() => leftImageOnClick()} style={styles.leftimgicon}>
                        <Text style={{ fontFamily: 'NotoSans-Bold', color: this.props.titleColor, fontSize: 20, alignSelf: 'flex-start' }}>{data.name}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => crossClick_selectedItem(data.id)} style={styles.rightimgcont}>
                    <Image style={styles.rightimage} source={this.props.rightImage} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <SwipeListView
                data={this.props.data}
                disableLeftSwipe={true}
                renderItem={(item, index) => this.renderSelectedItem(item, index)}
                renderHiddenItem={(item, index) => this.renderHiddenItem(item, index)}
                keyExtractor={(item, index) => 'chief_' + index.toString()}
                extraData={this.state}
                closeOnScroll={true}
                //onRowClose={(rowKey) => alert(rowKey)}
                //onLeftActionStatusChange ={alert('sf')}
         
            />
        )
    }
}

const styles = StyleSheet.create({
    removeiconcont: { flex: 0.2, alignItems: 'center', justifyContent: 'center', },
    selitem: {
        shadowColor: "#d9d9d9",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 8, marginVertical: 10,
        paddingVertical:10,
        backgroundColor: '#ffffff', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between'
    },
    itemname: { flex: 1, flexWrap: 'wrap', marginHorizontal: 10, color: '#4a4646', fontFamily: 'NotoSans-Bold', fontSize: 22, },
    removeicon: { width: 15, height: 15, padding: 5, marginHorizontal: 10 },
    hiddenicon: { marginLeft: 10, color: colorCode, height: 30, width: 30 },
    hiddenvaltxt: { color: colorCode, fontFamily: 'NotoSans-Bold', fontSize: 20 },
    hiddenvalcont: { borderBottomColor: colorCode, borderBottomWidth: 1, justifyContent: 'flex-start', flexDirection: 'row' },
    hiddentxt: { fontFamily: 'NotoSans', fontSize: 12, color: '#756f6f' },
    hiddenparentcont: {
        shadowColor: "#d9d9d9",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        marginHorizontal: 5,
        elevation: 8, paddingVertical: 10, marginVertical: 10,
        backgroundColor: '#E6EEF7',
        flexDirection: 'row', justifyContent: 'flex-start',
        flexDirection: 'row', alignItems: 'flex-start'
    },
    leftimgcont: { padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', },
    leftimg: {
        resizeMode: "contain", marginLeft: 5, alignSelf: 'center', justifyContent: 'flex-end', width: 45, height: 45
    },
    leftimgicon: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10, paddingVertical: 30, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', },
    rightimage: { resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 15, height: 15 },
    rightimgcont: { padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', },
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
        paddingHorizontal: 10,
        //borderBottomColor: "#e3e3e3",
        // borderBottomWidth: 1
        backgroundColor: "#ffffff",
        borderRadius: 10,
        flexDirection: 'row', justifyContent: 'space-between',
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

const Picker = ({ onPress, rowItem, style, label }) => {
    return <TouchableWithoutFeedback onPress={onPress}>
        <View style={[{ marginHorizontal: 10 }, style]} >
            <Text style={styles.hiddentxt}>{label}</Text>
            <View style={styles.hiddenvalcont}>
                <Text style={styles.hiddenvaltxt}>
                    {rowItem.item.duration == "" ? 'Select' : rowItem.item.duration}
                </Text>
                <Icon as={FontAwesome} style={styles.hiddenicon} name="angle-down" type="FontAwesome" />
            </View>
        </View>
    </TouchableWithoutFeedback>
}