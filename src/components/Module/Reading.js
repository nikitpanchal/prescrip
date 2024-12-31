import React, { Component } from "react"
import { View, Text, Dimensions, Image, TextInput, Keyboard, ScrollView, KeyboardAvoidingView, Platform, Linking, TouchableOpacity, Clipboard, Alert } from "react-native"
import { connect } from "react-redux"
import { Container, Icon } from "native-base";
import LinearGradient from 'react-native-linear-gradient'
import { Units_Edit_Button } from '../../constants/images'
import { setReadingUnit, setReading } from "../../actions/attachment";

class Reading extends React.Component {
    constructor(props) {
        super(props);
        let { data, type } = this.props.rootNavigation.params

        this.state = {
            distolic: data.DataType ? data.DataType.split("/")[0] : "",
            unit: Array.isArray(data) ? data[2] : data.Unit ? data.Unit : '',
            keyBoradType: Array.isArray(data) ? data[1] : data.keyBoradType ? data.keyBoradType : '',
            sistolic: data.DataType ? data.DataType.split("/")[1] : "",
            Value: this.props.Value,
            txt_Unit: this.props.Unit,
            editClicked: 0,
            data: data,
            callFrom: Array.isArray(data) ? data[5] : data.callFrom ? data.callFrom : 'master',
            type: type           //ChiefComplaints, Findings, Investigation, 
        };
    }

    focusNextField(nextField) {

        this.refs[nextField].focus();
    }


    stateFocus1(text, callFrom) {
        var self = this
        let data = {};

        if (callFrom == "sistolic") {
            this.setState({ sistolic: text })
            this.setState({
                Value: self.state.distolic + "/" + text,
            });
            data = {
                key: "Value",
                value: self.state.distolic + "/" + text,
            }


        } else {
            this.setState({ distolic: text }, () => {
                if (text.length == 3) {
                    self.focusNextField('2')
                }
            })
            this.setState({
                Value: text + "/" + self.state.sistolic,
            });
            data = {
                key: "Value",
                value: text + " / " + self.state.sistolic,
            }


        }


        this.props.onDataChange(data);

    }

    stateFocus(text, objkey) {
        let data = {};
        this.setState({ [objkey]: text });
        if (objkey == 'Unit') {
            this.setState({
                txt_Unit: text
            });
            data = {
                key: "Unit",
                value: text
            }
        }
        else {
            this.setState({
                Value: text
            });
            data = {
                key: "Value",
                value: text
            }
            //setReading(text)
        }
        this.props.onDataChange(data);
    }

    editUnit() {

        this.setState({ editClicked: !this.state.editClicked })
    }

    proceed() {

    }

    render() {
        let info = this.state.data;

        return (
            <View centerContent={true} style={{
              
                flex: 1, backgroundColor : '#fff'
            }}>
                <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={120}
                    behavior={Platform.select({ android: undefined, ios: 'padding' })} enabled={Platform.OS == "android" ? false : true}>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"never"} style={{ flex: 1, marginBottom: 70  }}>
                        <View style={{ flexdirection: 'column', alignItems: 'center', top: 70, height: 350,  width: Dimensions.get('window').width }}>
                            <Text style={{ fontSize: 20, color: '#545454' }}>Today's Reading</Text>

                            {
                                this.state.data[0] == "BP" || this.state.data.Name == "BP" ?
                                    <View style={{ marginTop: 20, flexDirection: 'row' }}>
                                        <View style={{ borderBottomColor: 'gray', textAlign: 'center' }}>
                                            <TextInput


                                                onSubmitEditing={Keyboard.dismiss}
                                                style={{ fontSize: 30, borderBottomWidth: 1, width: 80, borderBottomColor: 'gray', textAlign: 'center' }}
                                                //  autoFocus={true}
                                                ref="text1"
                                                blurOnSubmit={false}
                                                //  autoFocus={true}
                                                maxLength={3}
                                                value={this.state.distolic}
                                                keyboardType={"numeric"}
                                                onChangeText={text => this.stateFocus1(text, "distolic")}
                                                autoCapitalize="none" />

                                        </View>

                                        <View style={{ width: 14, paddingStart: 5, paddingTop: Platform.OS === 'ios' ? 0 : 10, }}>
                                            <Text style={{ fontSize: 32, transform: [{ rotate: '11deg' }], width: 40, color: 'grey', height: 50 }}>
                                                /</Text>
                                        </View>


                                        <View style={{ borderBottomColor: 'gray', textAlign: 'center', }} >
                                            <TextInput

                                                onSubmitEditing={Keyboard.dismiss}
                                                ref="2"
                                                style={{ fontSize: 30, borderBottomWidth: 1, width: 80, borderBottomColor: 'gray', textAlign: 'center' }}
                                                blurOnSubmit={false}
                                                autoFocus={this.state.distolic.length > 2 ? true : false}
                                                value={this.state.sistolic}
                                                keyboardType={"numeric"}
                                                maxLength={3}

                                                onChangeText={text => this.stateFocus1(text, "sistolic")}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>

                                    :

                                    <TextInput

                                        onSubmitEditing={Keyboard.dismiss}
                                        style={{ color: '#000000', borderBottomWidth: 1, fontSize: 40, width: "50%", borderBottomColor: '#ccc', textAlign: 'center' }}
                                        // maxLength={10}
                                        value={this.state.Value}
                                        //onSubmitEditing={() => Keyboard.dismiss()}
                                        keyboardType={this.state.keyBoradType == "Alpha Numeric" || this.state.keyBoradType === "Alpha-numeric" ? "default" : "numeric"}
                                        onChangeText={text => this.stateFocus(text, "Value")}
                                        autoCapitalize="none" />

                            }

                            {
                                this.state.editClicked ?
                                    <TextInput

                                        onSubmitEditing={Keyboard.dismiss}
                                        style={{ color: '#000000', marginTop: 20, borderBottomWidth: 1, fontSize: 20, width: "50%", borderBottomColor: '#ccc', textAlign: 'center' }}
                                        maxLength={8}
                                        value={this.state.txt_Unit}
                                        returnKeyType="done"
                                        placeholder={'Enter Unit'}
                                        autoFocus={true}
                                        // onKeyPress={(keyPress) => this.editUnit()}
                                        //onSubmitEditing={() => this.editUnit()}
                                        //  keyboardType={"numeric"}
                                        onChangeText={text => this.stateFocus(text, "Unit")}
                                        autoCapitalize="none" /> :
                                    <View>

                                        {

                                            this.state.callFrom == 'recent' ?
                                                <TouchableOpacity onPress={() => { this.editUnit() }}>
                                                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }} >
                                                        <Text style={{ marginTop: 0, fontSize: 20, color: '#000000', }}>{this.state.unit}</Text>

                                                        {
                                                            this.state.unit == "" ?
                                                                <Text style={{ marginTop: 0, fontSize: 20, color: 'gray', }}>{" (Edit Unit)"}</Text>
                                                                : null

                                                        }

                                                        <Image
                                                            source={Units_Edit_Button}
                                                            style={{
                                                                marginLeft: 5, width: 14, height: 14, resizeMode: 'contain'
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity> :
                                                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }} >
                                                    <Text style={{ marginTop: 0, fontSize: 20, color: '#000000', }}>{this.state.unit}</Text>

                                                </View>
                                        }





                                    </View>

                            }
                        </View>
                    </ScrollView>

                </KeyboardAvoidingView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    Value: state.attachment.Value,
    Unit: state.attachment.Unit,
});

const mapDispatchToProps = dispatch => ({
    setReading: (userdata) => dispatch(setReading(userdata)),
    setReadingUnit: (userdata) => dispatch(setReadingUnit(userdata)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reading);