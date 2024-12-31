//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text, BackHandler, AsyncStorage } from "react-native"

import Images from '../../Theme/Images'


export default class VideoCunsultingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    Item(data) {
        return (
            <TouchableOpacity style={styles.content_container}>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                        <View style={{ marginRight: 20, alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: data.isActive ? '#3eb88a' : '#2ca4c1', borderRadius: 15, }}>

                            <Text style={{ marginBottom: 5, marginLeft: 10, marginRight: 10, color: '#0066D7', fontFamily: 'NotoSans-Bold', color: '#ffffff', fontSize: 22 }}>{data.srno}</Text>

                        </View>

                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                        <Text style={{ color: '#000000', fontSize: 20, fontFamily: "NotoSans" }}>{data.name}</Text>



                        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                <Text style={{ color: '#555454', fontSize: 16 }}>{data.year + " yrs"}</Text>
                                <Text style={{ color: '#555454', fontSize: 18 }}>{"  |  "}</Text>
                                <Text style={{ color: '#555454', fontSize: 16 }}>{data.gender}</Text>
                                {

data.isActive ?<View style={{ marginLeft: 5, alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#E0F8E1' }}>

<Text style={{ marginLeft: 5, marginRight: 5, color: '#3eb88a', fontFamily: 'NotoSans', fontSize: 11 }}>{'Walk In'}</Text>

</View>
:null
                                }
                                

                            </View>
                        </View>


                    </View>
                </View>
            </TouchableOpacity>
        );
    }



    render() {
        return (
            <View style={{ flex: 1 }}>


                <FlatList
                    data={this.props.data}
                    renderItem={({ item }) => this.Item(item)}
                    //keyExtractor={item => item.id.toString()}
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
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
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
