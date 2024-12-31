import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, StatusBar, StyleSheet, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient'

import { isStagging, staging, prod } from "../../../app.json";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { setCertificateType, clearCertificate } from '../../actions/certificates';
const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`
var favdata, DoctorID, doc, CertificatesTypes, template_id;
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class CertificateFavComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,

        }
        this.firstPage = 0
        this.webdata = [];
        this.deviceWidth = Dimensions.get('window').width;
        this.deviceHeight = Dimensions.get('window').height;
        this.headerBotton = this.deviceHeight * 33 / 100;
        if (this.props.certificates.selectedCertificate && this.props.certificates.selectedCertificate.name) {

            var firstPaper = this.props.doctorProfile.DoctorData.CertificatesFav ? this.props.doctorProfile.DoctorData.CertificatesFav[this.props.certificates.selectedCertificate.name.split(" ").join("")][0] : {
                header: 1, footer: 1, body: 1
            };
        }
        else {
            var firstPaper = {
                header: 1, footer: 1, body: 1
            };
        }
        this.webdata = firstPaper ? [firstPaper.header, firstPaper.body, firstPaper.footer] : [];
        this.guid = "";
        this.focusListner = this.props.navigation.addListener("focus", () => {
            //this.guid = this.generateGuid();
        });
    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }

    CreateCertificate(header, footer, body) {
        var data = {
            "Margin": [
                "10",
                "10",
                "10",
                "10"
            ],
            "TemplateFontSize": "16",
            "papername": "A4",
            "papersize": [
                "210",
                "297"
            ],
            "header": header,
            "footer": footer,
            "body": body,
        };
        this.props.setPaperSettings(data);
        this.props.navigation.navigate('CertificateInputForm')

    }
    //Toggle

    toggleStatus(data) {
        if (this.props.certificates.selectedCertificate && this.props.certificates.selectedCertificate.name) {

            const self = this;
            var x = this.props.doctorProfile.DoctorData.CertificatesFav[this.props.certificates.selectedCertificate.name.split(" ").join("")].filter(i =>
                i.header == this.webdata[0] && i.body == this.webdata[1] && i.footer == this.webdata[2]
            )
            if (x.length > 0) {
                this.setState({
                    // toggle: !this.state.toggle
                    toggle: false
                })

            } else {
                this.setState({
                    toggle: true
                })

            }
        }
    }
    //On Message
    _onMessage(message) {

        if (this.webdata.length >= 3) {
            this.webdata = [];
        }
        if (parseInt(message.nativeEvent.data)) {
            this.webdata.push(parseInt(message.nativeEvent.data));
        }
        if (this.webdata.length == 3) {
            this.toggleStatus()
        }

        sleep(1000).then(() => {
            this.setState({
                loaded: true
            })

        });
    }
    setPreview() {
        //when you will swipe the template then you will get header footer body
        DoctorID = this.props.doctorProfile.DoctorData._id;
        doc = this.props.doctorProfile.DoctorData;
        if (this.props.certificates.selectedCertificate && this.props.certificates.selectedCertificate.name) {
            CertificatesTypes = this.props.certificates.selectedCertificate.name.split(" ").join("");
        }
        favdata = doc.CertificatesFav ? doc.CertificatesFav[CertificatesTypes] : [{ header: 1, body: 1, footer: 1 }];
        let header = [], body = [], footer = []
        if (CertificatesTypes && favdata) {
            for (var i = 0; i < favdata.length; i++) {
                if (i == 0) {
                    this.firstPage[footer, header, body];
                }
                header.push(favdata[i].header)
                body.push(favdata[i].body)
                footer.push(favdata[i].footer)
            }
        } else {
            for (var i = 0; i < 2; i++) {
                header.push(i.header)
                body.push(i.body)
                footer.push(i.footer)
            }
        }
        //let url = (isStagging ? staging.printTemplate : prod.printTemplate) + '/template/Certificates/' + CertificatesTypes + '.html?TemplatebodyType=' + body.join(',') + "&HeaderType=" + header.join(',') + "&FooterType=" + footer.join(',');
        let url = (isStagging ? staging.printTemplate : prod.printTemplate) + '/template/Certificates/' + CertificatesTypes + '.html?favs=' + header.join(',');


        return url;
    }
    render() {

        let url = this.setPreview();
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    androidLayerType="software"
                    source={{ uri: url }}
                    style={{ zIndex: 1 }}
                    scalesPageToFit={true}
                    // injectedJavaScript={INJECTEDJAVASCRIPT}
                    incognito
                    style={{ justifyContent: 'center', flex: 1, alignItems: 'center', paddingBottom: 55 }}
                    onMessage={this._onMessage.bind(this)}
                />
                {
                    !this.state.loaded ?
                        <View style={{
                            zIndex: 999999, justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%', position: 'absolute'
                        }}>
                            <ActivityIndicator size="large" color="#0077c0" />
                            <View style={{
                                flex: 0.2, bottom: this.headerBotton,
                                padding: 20, position: 'absolute', width: '100%'
                            }}>
                                <Text style={{
                                    fontWeight: 'bold', fontSize: 16, color: '#fff',
                                    textAlign: 'center', letterSpacing: 1
                                }}>Please wait while we load Templates..</Text>

                            </View>
                        </View> : null
                }
                {/*NEXT Button*/}
                <TouchableOpacity style={{ backgroundColor: '#cccccc' }} onPress={() => { multipleTapHandler.multitap(() => this.CreateCertificate(this.webdata[0], this.webdata[1], this.webdata[2]), "CertificateInputForm") }}>
                    <LinearGradient colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{
                            flexDirection: 'row',
                            width: '90%',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 10,
                            alignSelf: 'center',
                            borderRadius: 25
                        }}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 17,
                                color: '#ffffff',
                                fontFamily: 'NotoSans-Bold',
                                marginEnd: 5
                            }} >SELECT TEMPLATE</Text>
                            {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                        </View>

                    </LinearGradient>
                </TouchableOpacity>

                {/*** Ends */}

            </View>

        )
    }

}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    certificates: state.certificates,

});

const mapDispatchToProps = dispatch => ({
    setCertificateType: (certificate) => dispatch(setCertificateType(certificate)),
    clearCertificate: () => dispatch(clearCertificate()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CertificateFavComponent);

const styles = StyleSheet.create({
    container: {
        flex: 0.1,
        flexDirection: 'row',
        borderBottomColor: '#cccccc',
        alignItems: 'center',
        backgroundColor: '#1b7cdb',
        borderBottomWidth: 1,
        marginTop: Platform.OS == "android" ? 15 : 0
    },
    btn1Style: {
        width: '100%',
        height: 40,
        borderColor: '#08c9f1',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    btnTextStyle: {
        textTransform: "uppercase",
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 15,
        color: '#ffffff',
        fontFamily: 'NotoSans-Bold'
    },
    ViewImage: {
        flex: 0.12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ViewText: {
        flex: 0.76,
        justifyContent: 'center'
    },
    title: {
        fontSize: 22,
        color: '#ffffff'
    },

    Image: {
        resizeMode: 'contain',
        height: 20
    }
})