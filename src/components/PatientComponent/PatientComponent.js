//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text, BackHandler, ActivityIndicator, Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from '../../Theme/Images'
import moment from 'react-moment';
import { calculateAge } from '../../commonmethods/common';
import { S3BaseUrl } from '../../../app.json'
const colorCode = "#0b69d8";
import multipleTapHandler from '../../components/MultiTapHandle/index';
export default class VideoCunsultingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }



    Item(item, index) {
        var delProv = this.props.doctorProfile.DoctorData.IsAssistant != 1;
        let age = calculateAge(item.DOB, false)
        return (
            <TouchableOpacity style={styles.content_container}
                 onLongPress={() => { delProv ? this.props.itemLongClick(item) : null }}
                onPress={() => multipleTapHandler.multitap(
                    () => this.props.onPatientClick(item),
                    "PatientVisitHistoryContainer"
                )}>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>

                    <View style={{ marginRight: 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: true ? '#3eb88a' : '#2ca4c1', borderRadius: 15, }}>

                        {
                            item.Userimage == "" ?

                                <Image
                                    source={this.props.imagePath}
                                    style={{ resizeMode: 'cover', alignSelf: 'center', width: 40, height: 40, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                ></Image> :
                                <Image
                                    source={{ uri: S3BaseUrl + "patientimg/" + item.Userimage }}
                                    style={{ resizeMode: 'cover', alignSelf: 'center', width: 40, height: 40, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                ></Image>



                        }

                    </View>



                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                        <Text style={{ color: '#0066D7', fontSize: 20, fontFamily: "NotoSans" }}>{item.FullName}</Text>



                        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                <Text style={{ color: '#555454', fontSize: 16 }}>{age.value + " " + age.units}</Text>
                                <Text style={{ color: '#555454', fontSize: 18 }}>{"  |  "}</Text>
                                <Text style={{ color: '#555454', fontSize: 16 }}>{item.Gender}</Text>



                            </View>
                        </View>


                    </View>

                </View>
            </TouchableOpacity>


        );

    }


    onViewableItemsChanged = ({ viewableItems, changed }) => {

    }


    onScrollEndDrag() {

        //   alert('dgd');
    }

    handleScroll = (event) => {
        let index = Math.ceil(
            event.nativeEvent.contentOffset.y / 90
        );

        this.props.topItem(index)




    }


    render() {



        return (
            <View style={{ flex: 1, backgroundColor: '#fff', width: Dimensions.get('screen').width }}>

                <FlatList
                    data={this.props.finalArrayAfterTabClick}
                    extraData={this.props.isRefresh}
                    //Header to show above listview
                    ListHeaderComponent={null}//ListHeader
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={({ item, index }) => this.Item(item, index)}
                    keyExtractor={(item, index) => index.toString()}

                    //onScroll={this.handleScroll}
                    // onScrollEndDrag ={()=>this.onScrollEndDrag()}
                    //onScrollEndDrag={() => alert("end")}
                    onMomentumScrollEnd={() =>
                        this.props.hitNextData(this.props.startIndex + 10)
                    }

                    ListFooterComponent={
                        this.props.finalArrayAfterTabClick.length > 9 ?
                            this.props.Render_Footer : null}

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
        paddingVertical: 15,
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
