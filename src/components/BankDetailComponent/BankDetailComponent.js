//   code by ravi
import React, { Component } from "react"
import { View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { Container, Text, Input } from 'native-base'
import { Call_white, ic_Teal_BG_578, lefticon, } from '../../constants/images';
import ToastComponent from '../Toast/toastComponent'
import Images from '../../Theme/Images'
import Toast, { DURATION } from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient'

export default class BankDetailComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            enter_acc_name_text: this.props.acc_number,
            enter_condirm_acc_name_text: this.props.acc_number,
            enter_ifsccode: this.props.ifsc,
            emailId: this.props.emailId,
            borderColor: '',
            hasFocus: false,
            donevisible: false,
            opacity: 0.5,
            isACCFocused: false,
            isConfirmACCnumber: false,
            isIFSCnumber: false,
            isemailId: false,


        }
    }

    handleACCFocus = () => this.setState({ isACCFocused: true, })

    handleACCBlur = () => this.setState({ isACCFocused: false, })

    handleConfirmACCnumberFocus = () => this.setState({ isConfirmACCnumber: true, })

    handleConfirmACCnumberBlur = () => this.setState({ isConfirmACCnumber: false, })

    handleIFSCnumberFocus = () => this.setState({ isIFSCnumber: true, })

    handleIFSCnumberBlur = () => this.setState({ isIFSCnumber: false, })


    handleemailIdFocus = () => this.setState({ isemailId: true, })

    handleemailIdBlur = () => this.setState({ isemailId: false, })




    // onFocus() {
    //     this.setState({
    //         borderColor: "#0c9bad"
    //     })
    // }

    // onBlur() {
    //     this.setState({
    //         borderColor: "#9a9a9a"
    //     })
    // }
    render() {

        return (

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1,  }}  >
                <ScrollView style={{ flexDirection: 'column', backgroundColor: '#fafafa', paddingHorizontal: 12, }} showsVerticalScrollIndicator={false}>
                    {this.props.route.params && this.props.route.params.calledFrom ? <Text style={{ margin: 10, fontSize: 16, color: '#070707', fontFamily: 'NotoSans', paddingStart: 10, alignContent: 'center', textAlign: 'center' }}>Please provide your details to ensure that the amount paid by your patients are auto transferred your account.</Text> : null}
                    <Text style={{ fontSize: 16, color: '#070707', fontFamily: 'NotoSans', paddingStart: 10 }}>Bank Detail</Text>
                    <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }} >
                        <View elevation={5} style={{ flexDirection: 'column', justifyContent: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dcdcdc", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } }}>
                            <Text style={{ fontSize: 18, color: '#c6c6c6' }}>Account Number</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, borderWidth: 1.5, borderColor: this.state.isACCFocused ? "#0c9bad" : "#9a9a9a", height: 70, }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ enter_acc_name_text: text })}
                                    keyboardType={"numeric"}
                                    value={this.state.enter_acc_name_text}

                                    onBlur={this.handleACCBlur}
                                    onFocus={this.handleACCFocus}
                                    style={{ color: '#434343', width: "100%", fontSize: 30, fontFamily: 'NotoSans-Bold' }}
                                />
                            </View>
                            <View style={{ paddingVertical: 14, }}>
                                <Text style={{ fontSize: 18, color: '#c6c6c6' }}>Confirm Account Number</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, borderWidth: 1.5, borderColor: this.state.isConfirmACCnumber ? "#0c9bad" : "#9a9a9a", height: 70, }}>
                                    <TextInput
                                        onChangeText={(text) => this.setState({ enter_condirm_acc_name_text: text })}
                                        keyboardType={"numeric"}
                                        value={this.state.enter_condirm_acc_name_text}
                                        onBlur={this.handleConfirmACCnumberBlur}
                                        onFocus={this.handleConfirmACCnumberFocus}
                                        style={{ color: '#434343', width: "100%", fontSize: 30, fontFamily: 'NotoSans-Bold' }}
                                    />
                                </View>
                            </View>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontSize: 18, color: '#c6c6c6' }}>IFSC Code</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, borderWidth: 1.5, borderColor: this.state.isIFSCnumber ? "#0c9bad" : "#9a9a9a", height: 70, }}>
                                    <TextInput
                                        onChangeText={(text) => this.setState({ enter_ifsccode: text, })}
                                        keyboardType={"default"}
                                        value={this.state.enter_ifsccode}
                                        onBlur={this.handleIFSCnumberBlur}
                                        onFocus={this.handleIFSCnumberFocus}
                                        style={{ color: '#434343', width: "100%", fontSize: 30, fontFamily: 'NotoSans-Bold' }}
                                    />
                                </View>
                            </View>

                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontSize: 18, color: '#c6c6c6' }}>Email Id</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, borderWidth: 1.5, borderColor: this.state.isemailId ? "#0c9bad" : "#9a9a9a", height: 70, }}>
                                    <TextInput
                                        onChangeText={(text) => this.setState({ emailId: text.trim(), })}
                                        keyboardType={"default"}
                                        autoCorrect={false}
                                        autoCapitalize={"none"}
                                        value={this.state.emailId}
                                        onBlur={this.handleemailIdBlur}
                                        onFocus={this.handleemailIdFocus}
                                        style={{ color: '#434343', width: "100%", fontSize: 30, fontFamily: 'NotoSans-Bold' }}
                                    />
                                </View>
                            </View>





                        </View>




                    </View>


                </ScrollView>


                <TouchableOpacity
                    disabled={this.state.loading}
                    style={{
                        justifyContent: 'space-around',
                        alignItems: 'center', flexDirection: 'row', 
                        width: '100%', paddingBottom: 15
                    }} onPress={() => this.props.submitClick(this.state.enter_acc_name_text, this.state.enter_condirm_acc_name_text, this.state.enter_ifsccode, this.state.emailId)}
                >
                    <LinearGradient colors={["#28B62E", "#0cd214"]} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '95%', borderRadius: 25, paddingVertical: 14, justifyContent: 'center', alignItems: 'center', }} >
                        <Text uppercase={true} style={{ fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold' }}>{'SUBMIT'}</Text>
                        {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                    </LinearGradient>


                </TouchableOpacity>


                {
                    this.props.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={"#fafbfe"}
                                imagePath={Images.Info}
                                description={this.props.description}

                            />

                            , 2000) : null
                }
                <Toast

                    position='bottom'

                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                          width: '90%',
                        bottom: 200,
                        backgroundColor: '#4D99E3', borderRadius: 15
                    }}
                    ref="toast" />
            </KeyboardAvoidingView>
        )
    }

}

