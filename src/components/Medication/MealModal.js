
///code by ravi///
import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from "react-native-modalbox";
import { Tick_off, Tick, BG, lefticon } from '../constants/images';



export default class BottomModal extends Component {

    constructor(props) {
        super(props)
        this.modalCity = React.createRef();
        this.state = {
            checkedBox: false,
            meal_btnName: [],
            btnIndex: -1,
            meal: ['Before Meal', "Without Meal", "After Meal"],

        }
        this._checkboxsms = 0
    }
    changeColor(index) {
        this.setState({ btnIndex: index })
    }
    componentDidMount() {
        this.setState({ onClosed: !this.state.onclick })
    }

    //meal button view///
    meallabel() {

        {
            var content = this.state.meal.map((item, index) => {
                return (
                    <TouchableOpacity onPress={(() => this.changeColor(index))}
                        style={{
                            width: '30%', borderRadius: 25, shadowColor: '#000',
                            shadowOffset: { width: 1, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3, marginTop: 10,
                            elevation: 5, backgroundColor: (this.state.btnIndex == index ? "#0065d7" : "white"), paddingVertical: 8, justifyContent: 'center', alignItems: 'center',
                        }} >
                        <Text style={{ fontSize: 15, color: (this.state.btnIndex == index ? "white" : "#0065d7") }}>{item}</Text>

                    </TouchableOpacity>
                )
            })

            return content
        }


    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <TouchableOpacity onPress={() => this.modalCity.open()} style={{ padding: 10, backgroundColor: 'pink', alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>Show</Text>
                </TouchableOpacity>

                <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{ backgroundColor: 'transparent', height: 280, borderWidth: 0, width: '100%', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' }}
                    
                    ref={(ref) => this.modalCity = ref}
                    swipeToClose={false}
                    position={"bottom"}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={() => { this.close }}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>


                    <TouchableOpacity onPress={() => this.modalCity.close()} style={{
                        paddingVertical: 8, paddingHorizontal: 10, width: "100%", justifyContent: 'flex-end', alignItems: 'flex-end'
                    }}>
                        <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'NotoSans-Bold', }}>Close</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 14, backgroundColor: '#fff', borderTopStartRadius: 5, borderTopRightRadius: 5 }}>

                        <View style={{ paddingTop: 14 }}>
                            <Text style={{ fontSize: 18, color: '#000' }}>When should the medicine {"\n"} be consumed ?</Text>
                        </View>
                        <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                            {this.meallabel()}
                        </View>

                        <View style={{ color: '#fff', fontSize: 20, flexDirection: 'row', paddingTop: 20 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', }} onPress={() => this.setState({ checkedBox: this.state.checkedBox == true ? false : true })}>

                                <View style={{ flexDirection: 'row', alignSelf: "center", }}>

                                    <Image resizeMode={"contain"} source={this.state.checkedBox ? Tick : Tick_off} style={{ height: 22, width: 22 }} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignSelf: "center", paddingLeft: 7, }}>
                                <Text style={{ fontSize: 22, color: '#333' }}> Send Dose Reminder </Text>
                            </View>

                        </View>
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%', paddingHorizontal: 10, bottom: 0, position: 'absolute', marginBottom: 15
                        }} onPress={() => this.proceed()}>
                            <LinearGradient
                                colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                                style={{ width: '95%', height: 45, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                                <Text uppercase={true} style={{
                                    fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold'
                                }}>NEXT</Text>


                            </LinearGradient>

                        </TouchableOpacity>
                    </View>
                </Modal>


            </View>



        )

    }
}
