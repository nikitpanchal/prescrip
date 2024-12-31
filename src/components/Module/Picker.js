import React, { Component } from 'react';
import { Text, ScrollView, Alert, View, Image, StyleSheet, TouchableOpacity, FlatList, Button } from 'react-native';
import { Icon } from 'native-base';
import { downwhiteicon,ic_note_delete } from '../../constants/images';
import CenterModal from "../Modal/centerModal";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { show } from "redux-modal";
import { bindActionCreators } from "redux";

class Picker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenModal: false
        }
    }

    onPress = (data) => {
        this.props.onPress(data);
        this.setState({ isOpenModal: !this.state.isOpenModal }, () => this.handleHide())

    }
clearData(){
    const { label, screen, section } = this.props;
    let selecteddata=this.props.opthal.selecteddata;
    
    if(screen == section ){
        selecteddata[screen][label]="";
    }
    else{
        selecteddata[screen][section][label]="";

    }


    //selecteddata[screen][section][label]="";
    this.props.setOpthalData({selecteddata});
}
    handleHide = (data) => {

        const { label, screen, section } = this.props;
        this.props.setOpthalListData({ header: label, data, screen, section, label });
        if (this.props.screenProps) {
            this.props.screenProps.rootNavigation.navigate('OpthalList')
        } else {
            this.props.navigation.navigate('OpthalList')
        }
    }

    getComp(selected, showData, label, data) {
        if (this.props.from) {
            var splitted = showData.split(' / ');
            if (showData.split(' / ').join('') != "") {
                return <>
                    <Text style={{ fontSize: 16, color: '#212121' }}>{label} : </Text>
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#ececec', }]}>
                        <Text style={{ color: '#404040', fontSize: 15, }}> {showData.split(' / ').join('') != "" ? (splitted[0] != "" ? splitted[0] : "-") + " / " + (splitted[1] != "" ? splitted[1] : "-") : "Select"}</Text>
                    </View></>
            } else {
                return null
            }
        } else {
            return <><Text style={{ fontSize: 13, color: '#929292', }}>{label}</Text>
                <TouchableOpacity onPress={() => { this.handleHide(data) }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',borderBottomWidth: 0.8, borderBottomColor: '#ececec', paddingBottom: 5, marginTop: 10 }}>
                    <Text style={{ color: '#404040', fontSize: 16}}> {selected && selected != "" ? selected : "Select"}</Text>
                   {selected && selected != "" ?<TouchableOpacity style={{padding : 10}} onPress={()=>this.clearData()}><Image style={{ justifyContent: 'center', height: 12, width: 12, resizeMode: 'contain',}} source={ic_note_delete} /></TouchableOpacity>:<Image style={{ justifyContent: 'center', height: 12, width: 12, resizeMode: 'contain', right: 10 }} source={downwhiteicon} />}
                    
                </TouchableOpacity>
            </>
        }
    }

    render() {
        const { label, data, style, navigation, screen, section } = this.props;
        var selected = ""
        if (screen == "more") {
            if (!this.props.opthal.selecteddata[screen])
                this.props.opthal.selecteddata[screen] = {}
            selected = this.props.opthal.selecteddata[screen][label] ? this.props.opthal.selecteddata[screen][label] : "";
        } else {
            selected = this.props.opthal.selecteddata[screen][section] ? this.props.opthal.selecteddata[screen][section][label] : "";
        }

        var showData = "";
        if (this.props.from) {
            var exi = this.props.opthal.selecteddata["lefteye"][section]
            var exi1 = this.props.opthal.selecteddata["righteye"][section]
            showData = (exi ? (exi[label] ? exi[label] : "") : "") + " / " + (exi1 ? (exi1[label] ? exi1[label] : "") : "");
        }
        return <>
            <View style={[{ height: 50 }, style, this.props.from && { flexDirection: "row", height: "auto", marginBottom: 8 }]} >
                {
                    this.getComp(selected, showData, label, data)
                }
            </View>

            {/* <CenterModal show={this.state.isOpenModal} handleHide={() => this.handleHide()} onPress={this.onPress.bind(this)} header={label} data={data} /> */}
        </>

    }
}

export default connect(
    null,
    dispatch => bindActionCreators({ show }, dispatch))
    (Picker);
