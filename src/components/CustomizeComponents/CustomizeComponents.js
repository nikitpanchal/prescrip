import React, { Component } from 'react'
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { isNameValid, isAddressValid, isPhoneno, isPincodeValid, isEmailValid } from '../../commonmethods/validation'
import LinearGradient from 'react-native-linear-gradient'


export default class CustomizeComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            setText: "",
            hideError: true,
            radioIndex: -1
        }
    }

    validation(textType) {
        let valid
        if (textType == "normal" && !this.props.defaultValue) {
            return (
                <Text style={{ color: '#FF0000', fontSize: 12 }}>please enter valid Input</Text>
            )
        }

        if (textType == "mobileNumber") {
            valid = isPhoneno(this.props.defaultValue, "Mobile number")
            if (!valid.isvalid) {
                return (
                    <Text style={{ color: '#FF0000', fontSize: 12 }}>{valid.msg}</Text>
                )
            }

        }

        if (textType == "name") {
            valid = isNameValid(this.props.defaultValue, "Name")
            if (!valid.isvalid) {
                return (
                    <Text style={{ color: '#FF0000', fontSize: 12 }}>{valid.msg}</Text>
                )
            }

        }

        if (textType == "age" && !this.props.defaultValue.length == 3) {


            return (
                <Text style={{ color: '#FF0000', fontSize: 12 }}>Please enter valid age</Text>
            )


        }

        if (textType == "emailAddress") {
            valid = isEmailValid(this.props.defaultValue, "Email Address")
            if (!valid.isvalid) {
                return (
                    <Text style={{ color: '#FF0000', fontSize: 12 }}>{valid.msg}</Text>
                )
            }

        }

        if (textType == "streetAddress") {
            valid = isAddressValid(this.props.defaultValue, "Street Address")
            if (!valid.isvalid) {
                return (
                    <Text style={{ color: '#FF0000', fontSize: 12 }}>{valid.msg}</Text>
                )
            }

        }

    }
    onRadioPress(index) {
        this.setState({ radioIndex: index })
    }

    radioGroupFun(item, index) {

        return (
            <TouchableOpacity onPress={() => this.onRadioPress(index)} style={[this.props.radioViewStyle, { borderColor: (this.state.radioIndex == index ? "#0065d7" : "#cccccc") }]}>
                <Image source={(this.state.radioIndex == index ? this.props.radioActive : this.props.radioInActive)} style={this.props.imgStyle} />
                <Text style={this.props.radioLabelStyle}>{item}</Text>
            </TouchableOpacity>
        )


    }



    render() {

        return (
            <View>
                {this.props.viewType == "textInput" && this.props.textType == "normal" ?
                    <View style={this.props.viewStyle}>
                        <Item floatingLabel >
                            <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                            <Input style={this.props.inputStyle}
                                defaultValue={this.props.defaultValue}
                                keyboardType={this.props.keyboardType}
                                maxLength={this.props.maxLength}
                                onChangeText={(txt) => this.props.onChangeText(txt)}

                            />

                        </Item>
                        {this.props.validate && this.props.textType == "normal" ? this.validation(this.props.textType) : null}

                    </View> : this.props.viewType == "textInput" && this.props.textType == "noValid" ?
                        <View style={this.props.viewStyle}>
                            <Item floatingLabel >
                                <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                                <Input style={this.props.inputStyle}
                                    defaultValue={this.props.defaultValue}
                                    keyboardType={this.props.keyboardType}
                                    maxLength={this.props.maxLength}
                                    onChangeText={(txt) => this.props.onChangeText(txt)}
                                    defaultValue={this.props.defaultValue}
                                />

                            </Item>


                        </View>
                        : this.props.viewType == "textInput" && this.props.textType == "name" ?
                            <View style={this.props.viewStyle}>


                                <Item floatingLabel style={{ flexDirection: 'row' }}>

                                    <Label style={[this.props.labelStyle, { color: '#818181' }]} >{this.props.labelText}</Label>
                                    {/*  <Label style={{ color: '#FF0000' }} >*</Label> */}
                                    <Input style={this.props.inputStyle}
                                        defaultValue={this.props.defaultValue}
                                        keyboardType={this.props.keyboardType}
                                        maxLength={this.props.maxLength}
                                        onChangeText={(txt) => this.props.onChangeText(txt)}
                                        defaultValue={this.props.defaultValue}

                                    />

                                </Item>
                                {this.props.validate && this.props.textType ? this.validation(this.props.textType) : null}


                            </View> :
                            this.props.viewType == "textInput" && this.props.textType == "mobileNumber" ?
                                <View style={this.props.viewStyle}>


                                    <Item floatingLabel >

                                        <Label style={[this.props.labelStyle, { color: '#818181' }]} >{this.props.labelText}</Label>

                                        <Input style={this.props.inputStyle}
                                            defaultValue={this.props.defaultValue}
                                            keyboardType={"numeric"}
                                            maxLength={this.props.maxLength}
                                            onChangeText={(txt) => this.props.onChangeText(txt)}


                                        />

                                    </Item>
                                    {this.props.validate && this.props.textType ? this.validation(this.props.textType) : null}


                                </View> : this.props.viewType == "textInput" && this.props.textType == "age" ?
                                    <View >

                                        <View style={this.props.viewStyle}>
                                            <Item floatingLabel >

                                                <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                                                <Input style={this.props.inputStyle}
                                                    defaultValue={this.props.defaultValue}
                                                    keyboardType={"numeric"}
                                                    maxLength={this.props.maxLength}
                                                    onChangeText={(txt) => this.props.onChangeText(txt)}
                                                    defaultValue={this.props.defaultValue}

                                                />
                                                <Label style={this.props.labelStyle} >years</Label>
                                            </Item>
                                            {this.props.validate && this.props.textType ? this.validation(this.props.textType) : null}

                                        </View>
                                    </View> : this.props.viewType == "textInput" && this.props.textType == "emailAddress" ?
                                        <View style={this.props.viewStyle}>


                                            <Item floatingLabel >

                                                <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                                                <Input style={this.props.inputStyle}
                                                    defaultValue={this.props.defaultValue}
                                                    keyboardType={this.props.keyboardType}
                                                    maxLength={this.props.maxLength}
                                                    onChangeText={(txt) => this.props.onChangeText(txt)}
                                                    defaultValue={this.props.defaultValue}

                                                />

                                            </Item>
                                            {this.props.validate && this.props.textType ? this.validation(this.props.textType) : null}


                                        </View> : this.props.viewType == "textInput" && this.props.textType == "streetAddress" ?
                                            <View style={this.props.viewStyle}>


                                                <Item floatingLabel >

                                                    <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                                                    <Input style={this.props.inputStyle}
                                                        defaultValue={this.props.defaultValue}
                                                        keyboardType={this.props.keyboardType}
                                                        maxLength={this.props.maxLength}
                                                        onChangeText={(txt) => this.props.onChangeText(txt)}
                                                        defaultValue={this.props.defaultValue}

                                                    />

                                                </Item>
                                                {this.props.validate && this.props.textType ? this.validation(this.props.textType) : null}


                                            </View> : this.props.viewType == "radioGroup" ?
                                                <View style={this.props.viewStyle}>
                                                    <Label style={this.props.labelStyle} >{this.props.labelText}</Label>
                                                    <View style={this.props.listStyle}>
                                                        <FlatList
                                                            keyExtractor={(item, i) => i.toString()}
                                                            data={this.props.radioName}
                                                            horizontal={this.props.horizontal}
                                                            scrollEnabled={this.props.scrollEnabled}
                                                            showsHorizontalScrollIndicator={this.props.showIndicator}
                                                            renderItem={({ item, index }) => this.radioGroupFun(item, index)} />
                                                    </View>
                                                </View>
                                                : this.props.viewType == "textArea" ?
                                                    <View style={this.props.viewStyle}>
                                                        <Input numberOfLines={this.props.numberOfLines}
                                                            multiline={true}
                                                            style={this.props.inputStyle} />
                                                    </View>
                                                    : this.props.viewType == "button" && this.props.buttonType == "normal" ? <View>
                                                        <Button block style={this.props.btnStyle}><Text style={this.props.labelStyle}>{this.props.btntext}</Text></Button>
                                                    </View> :
                                                        this.props.viewType == "button" && this.props.buttonType == "gradient" ?
                                                            <TouchableOpacity onPress={this.props.onBtnPress}>
                                                                <LinearGradient colors={this.props.btnColor} start={{ x: 0, y: 0 }}
                                                                    end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={styles.btn}>

                                                                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
                                                                        <Image source={this.props.setImage} style={{ resizeMode: "contain", height: 25, width: 25, marginStart: 5 }} />
                                                                        <Text style={styles.btnTxt} >{this.props.btnTxt}</Text>
                                                                    </View>

                                                                </LinearGradient>
                                                            </TouchableOpacity>
                                                            : null}



            </View>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 25, paddingTop: 3
    },
    btnTxt:
    {
        textTransform: 'uppercase', fontFamily: 'NotoSans-Bold', color: '#fff', fontSize: 17, textAlign: 'center', paddingBottom: 5, paddingStart: 10
    },
})
