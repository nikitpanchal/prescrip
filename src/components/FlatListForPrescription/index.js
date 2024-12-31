//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text, Dimensions, AsyncStorage } from "react-native"

import Images from '../../Theme/Images'


export default class VideoCunsultingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    Item(data, index) {
        var delProv = this.props.doctorProfile.DoctorData.IsAssistant != 1;
        return (
            <TouchableOpacity style={styles.content_container}

                onLongPress={() => delProv ?
                    this.props.deleteItemInSelctedFlatList(data.name, index) : null}
                onPress={() => this.props.addItemInSelctedFlatList(data.name, index, "normal")}
            >
                <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'NotoSans', color: '#595757', fontSize: 17 }}>{data.name}</Text>
                </View>

            </TouchableOpacity>
        );
    }

    ItemCertificate(data, index) {
        return (
            <TouchableOpacity style={styles.content_container}

                onPress={() => this.props.addItemInSelctedFlatList(data.certificate, index)}
            >
                <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'NotoSans', color: '#595757', fontSize: 17 }}>{data.name}</Text>
                </View>

            </TouchableOpacity>
        );
    }
    Item1(data, index) {
        return (
            <TouchableOpacity style={styles.content_container}

                onPress={() => this.props.addItemInSelctedFlatList(data, index)}
                onLongPress={() => this.props.onlongPress(data, index)}
            >
                <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'NotoSans', color: '#595757', fontSize: 17 }}>{data.Favourite}</Text>
                </View>

            </TouchableOpacity>
        );
    }


    render() {
        return (
            <View style={{ flex: 1, width: Dimensions.get('window').width, }}>

                <FlatList style={{ width: Dimensions.get('window').width }}
                    data={this.props.data}
                    renderItem={({ item, index }) => this.props.callFrom == "fav" ? this.Item1(item, index) : this.props.callFrom == 'certi' ? this.ItemCertificate(item, index) : this.Item(item, index)}
                    keyExtractor={(item, index) => 'vcc' + index.toString()}
                    extraData={this.state}
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1,
        backgroundColor: 'white'
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
