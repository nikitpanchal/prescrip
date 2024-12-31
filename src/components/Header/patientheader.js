
import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, SafeAreaView, Image, ImageBackground, TextInput, ScrollView, Platform } from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../Tooltips'
import { delete_icon } from '../../constants/images'
import moment from "moment";
import {S3BaseUrl} from '../../../app.json'


export default class PatientHeader extends Component {
    render() {
        return <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', }}>
            <Image
                source={{uri: S3BaseUrl +"doctorimg/" + DoctorImage}}
                style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
            ></Image>
        </View>
    }
}