/* created by Ruban 
Login component
*/

import React, { Component } from 'react'
import {
    Platform,
    View, Dimensions, TextInput, Text, ImageBackground, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView
} from 'react-native'
import Images from '../../Theme/Images'
import {  Center, Container  } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'


import ToastComponent from '../Toast/toastComponent'

import Toast, { DURATION } from 'react-native-easy-toast'

export default class NewLogin extends Component {

    render() {
        return (
            <View contentContainerStyle={{ flexGrow: 1 }} style={{  height:Dimensions.get('window').height,   width:Dimensions.get('window').width }}>
               
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />

                <ImageBackground source={Images.bg_white} style={styles.imgBG}>
                    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.isPad ? 0 : 20} behavior={Platform.select({ android: undefined, ios: 'padding' })} enabled={Platform.OS == "android" ? false : true}>
                        <View style={{ flex: 0.8, marginTop: 40, marginHorizontal: 18 }}>
                            <Text style={styles.title}>{this.props.title}</Text>
                            <Text style={styles.maintxt}>{this.props.text}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>
                                <Text style={styles[91]}>+91</Text>
                                <TextInput

                                    onChangeText={this.props.mobileVal}
                                    maxLength={10}
                                    keyboardType='number-pad' style={styles.inputStyle}
                                    autoFocus={true}
                                />

                            </View>
                            {this.props.onClick ? this.props.mobileValid : <Text style={{ color: '#FF0000', textAlign: 'left', marginTop: 5, fontSize: 12, }}>{""}</Text>}
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                <View style={{
                                    flexDirection: 'row', marginTop: 40, alignItems: 'center', justifyContent: 'center',
                                    alignItems: 'center'
                                }} >
                                    <Text style={styles.txtNewUser}>{this.props.newUser}</Text>
                                    <Text style={styles.txtRegister}>{this.props.register}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 0.2, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={this.props.mobileCheck}>
                                <LinearGradient colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={styles.btn}>

                                    <Text style={styles.btnTxt} >{this.props.btnTxt}</Text>
                                    {this.props.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                                </LinearGradient>
                            </TouchableOpacity>


                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>

                {
                    this.props.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={this.props.toastTextColor}
                                imagePath={this.props.toastImgPath}
                                description={this.props.description}

                            />

                            , 1500) : null
                }
                <Toast

                    position='center'
                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        backgroundColor: this.props.toastBgColor, borderRadius: 15
                    }}
                    ref="toast" />



            </View>

        )
    }
}


const styles = StyleSheet.create({
    imgBG: {
        flex: 1,
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover',
        backgroundColor: '#fff'


    },
    button: {
        width: '70%',
        height: 45,
    },
    text: {
        color: 'white',
        fontSize: 16
    },
    inputStyle: {
        fontFamily: 'NotoSans',
        flex: 0.8,
        color: "#242424",
        margin: 0,
        padding: 0,
        fontSize: 30,
    },
    txtNewUser: {
        fontSize: 16,
        color: '#4a4a4a',
        fontFamily: 'NotoSans'
    },
    txtRegister: {
        fontSize: 16,
        color: '#06b7cc',
        fontFamily: 'NotoSans',
        marginLeft: 5,
        textDecorationLine: 'underline',
    },
    btn: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        borderRadius: 25
    },
    btnTxt:
    {
        textAlign: 'center',
        fontSize: 17,
        color: '#ffffff',
        fontFamily: 'NotoSans-Bold',
        marginEnd: 5
    },
    91: {
        flex: Platform.isPad ? 0.1 : 0.2,
        fontSize: 30,
        paddingLeft: 10,
        color: '#4a4a4a',
        fontFamily: 'NotoSans'
    },
    title: {
        fontSize: 35, color: '#905094',
        fontFamily: 'NotoSans-Bold',
    },
    maintxt: {
        color: '#8b8b8b',
        fontFamily: 'NotoSans',
        fontSize: 16,
        marginTop: 40
    }

})