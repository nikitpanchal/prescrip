/****** code by Sourabh ******/

import React, { Component } from "react";
import { Text } from "native-base";
import { Divider } from 'react-native-elements';
import { StatusBar, View, TouchableOpacity, SafeAreaView, Image, ImageBackground, TextInput, Platform ,Dimensions} from "react-native";
import styles from './styles';


import { delete_icon } from '../../constants/images'



// somewhere in your app
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,

} from 'react-native-popup-menu';

//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (Congrats screen)
//5.progress bar ,title ,description

//9.


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedBox: false,
            phonenumber: '',
            isMenuOpen: false
        }
        this.dismissMenu = this.dismissMenu.bind(this)
        this._checkboxsms = 0
    }


    dismissMenu() {
        if (this.state.isMenuOpen) {
            this.setState({
                isMenuOpen: false
            });
        }
    }
    onClick(item) {
        this.dismissMenu();
        this.props.menuSelectName(item)
    }

    setMenuNames() {

        return (
            this.props.menuNameList.map((item, i) => {
                return (
                    <MenuOption onSelect={() =>


                        this.onClick(item)

                    } >
                        <Text style={{ margin: 5, color: item == "Delete" ? "#ff0000" : '#000000', fontFamily: 'NotoSans' }}>{item}</Text>
                    </MenuOption>


                )

            })
        );
    }
    render() {


        return (


            <View style={{
                justifyContent: 'center', flexdirection: 'row',  width: Dimensions.get('window').width

            }}>
                <ImageBackground style={{ width: '100%' }} source={this.props.bgImage}>


                    <View style={{
                        flexDirection: 'column',
                        top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                        marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,



                    }} >
                        <SafeAreaView >

                            <View style={{ width: '100%', paddingHorizontal: 10, marginTop: this.props.isTitle ? 10 : null }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>


                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.props.leftImageOnClick() }}
                                            style={{ padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                            <Image style={{
                                                resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                                            }} source={this.props.leftImage} />


                                        </TouchableOpacity>

                                    </View>




                                    <View style={{ flexDirection: 'row' }}>

                                        {
                                             this.props.doctorProfile.DoctorData.RoleId != 1 ?
                                                this.props.secondMenu ?
                                                    this.props.isSecondMenuName ?
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => { this.props.secondMenuImageOnClick() }}
                                                                style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                                                                <Image style={{
                                                                    resizeMode: "cover", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                                                                }} source={this.props.secondMenuImage} />
                                                                {
                                                                    this.props.isSecondMenuName ?
                                                                        <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, marginTop: 3, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.secondMenuName}</Text>

                                                                        : null
                                                                }


                                                            </TouchableOpacity>

                                                        </View>
                                                        : <TouchableOpacity
                                                            onPress={() => { this.props.secondMenuImageOnClick() }}
                                                            style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                                                            {
                                                                true ? <Image style={{
                                                                    resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                                                                }} source={this.props.secondMenuImage} />
                                                                    : null
                                                            }

                                                        </TouchableOpacity>

                                                    : null : null

                                        }

                                        <TouchableOpacity
                                            onPress={() => { this.setState({ isMenuOpen: !this.state.isMenuOpen }) }}
                                            style={{ padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                            <Image style={{
                                                resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                                            }} source={this.props.rightImage} />

                                            {
                                                !this.props.isMenuName ?
                                                    null
                                                    : <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, marginTop: 3, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.rightImageName}</Text>


                                            }

                                            <Menu
                                                opened={this.state.isMenuOpen}
                                                onBackdropPress={() => this.dismissMenu()}

                                            >
                                                <MenuTrigger />
                                                <MenuOptions>
                                                    {
                                                        this.setMenuNames()
                                                    }
                                                </MenuOptions>

                                            </Menu>

                                        </TouchableOpacity>



                                    </View>

                                </View>



                                <View style={{ flexDirection: 'row', marginBottom: this.props.isTitle ? 15 : 30 }}>

                                    {

                                        <TouchableOpacity onPress={() => { this.props.iscameraImage ? this.props.cameraImageOnClick() : null }}>
                                            <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', }}>
                                                {
                                                    this.props.photo == null ?

                                                        this.props.showIntials ?

                                                            <View
                                                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}

                                                            >
                                                                <Text style={{
                                                                    fontSize: 24,
                                                                    color: "#fefeff",

                                                                    fontFamily: "NotoSans-Bold", fontSize: 30
                                                                }}>{this.props.DoctorFName.charAt(0)}</Text>

                                                                <Text style={{
                                                                    fontSize: 24,
                                                                    color: "#fefeff",

                                                                    fontFamily: "NotoSans-Bold", fontSize: 30
                                                                }}>{this.props.DoctorLName.charAt(0)}</Text>
                                                            </View>
                                                            : <Image
                                                                source={this.props.imagePath}
                                                                style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                                            ></Image>
                                                        :
                                                        <Image
                                                            source={{ uri: this.props.photo == null ? this.props.imagePath : this.props.photo }}
                                                            style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                                        />


                                                }

                                            </View>

                                            {
                                                this.props.iscameraImage ?
                                                    <TouchableOpacity
                                                        onPress={() => this.props.cameraImageOnClick()}
                                                        style={{ position: 'absolute', alignSelf: 'flex-end', }}

                                                    >
                                                        <Image
                                                            source={this.props.cameraImage}
                                                            style={{ width: 35, height: 35, }}

                                                        ></Image>
                                                    </TouchableOpacity> : null}
                                        </TouchableOpacity>

                                    }



                                    <View
                                        style={{ alignSelf: 'center', flex: 1 }}
                                    >
                                        <View style={{ flexDirection: 'column', paddingLeft: 10, alignSelf: 'flex-start' }}>
                                            {

                                                this.props.isEditClick ?
                                                    <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>

                                                        <TextInput
                                                            onChangeText={(txt) => this.props.setDoctorName(txt)}
                                                            keyboardType="default"
                                                            defaultValue={this.props.title.substring(3)}
                                                            style={
                                                                styles.decription
                                                            } />
                                                    </View>
                                                    :
                                                    <Text style={styles.decription}>{this.props.title}</Text>


                                            }
                                            {

                                                <Text style={styles.title}>{this.props.description}</Text>

                                            }
                                        </View>

                                        {


                                            this.props.iseditImage ?

                                                <TouchableOpacity
                                                    onPress={() => { this.props.editImageOnClick(this.props.isEditClick) }}
                                                    style={{ marginRight: 40, marginTop: -20, position: 'absolute', alignSelf: 'flex-end', }}

                                                >
                                                    <Image
                                                        source={this.props.isEditClick ? delete_icon : this.props.editImage}
                                                        style={{ width: 15, height: 15, }}
                                                    ></Image>
                                                </TouchableOpacity>

                                                : null}

                                    </View>




                                </View>
                            </View>

                        </SafeAreaView>
                    </View>
                </ImageBackground>

            </View>



        );
    }
}
