
import React, { Component } from "react";


import Share from 'react-native-share';
import { abdmRequest } from './abdmApiRequest'
var Buffer = require('buffer/').Buffer
import {
    StatusBar,
    View,
    Image,

    TextInput,

    BackHandler,
    TouchableOpacity,
    Text,
    ScrollView, StyleSheet,
    KeyboardAvoidingView, Dimensions, Alert
} from "react-native";
import ReactNativeBlobUtil from 'react-native-blob-util'

import SettingsHeader from "../../../../components/SettingsHeader/SettingsHeader";
import {

    ic_close_button, iconrightarrow, ic_checked, ic_unchecked

} from "../../../../constants/images";
const imgpath = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';
import {
    setAssitantData,
    updateAssitantData,
    setAsstCliniNameList,
    setAsstRole,
    manageAsstData,
    deleteAssitantData,
} from "../../../../actions/settings";
import multipleTapHandler from "../../../../components/MultiTapHandle";
import { connect } from "react-redux";

import { Platform } from "react-native";

import { setTooltipStatus } from "../../../../actions/tooltip";


import { SafeAreaView, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";

class CreateAbhaAddress extends Component {
    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.fileName = "";
        this.modalRole = React.createRef();
        this.allValid = false;
        this.width = Dimensions.get('screen').width;
        this.ht = Dimensions.get('screen').height;
        this.state = {
            src: null,
            isSelected: false,
            abhaAddress: '',
            mobile: '',
            txnId: this.props.route?.params?.txnId,
            suggestionList: [],
            xToken: this.props.route?.params?.xToken,
            loading: false,
            srcLoading: false

        };
    }

    componentDidMount() {

        let data = JSON.stringify({});

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-suggesstion/' + this.state.txnId,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        abdmRequest(data, config)
            .then((response) => {
                response = response.data;
                if (response.txnId && (response.txnId != '' && response.txnId != 'Invalid Transaction Id')) {

                    this.setState({
                        suggestionList: response.abhaAddressList,
                        txnId: response.txnId
                    })
                }


            })
            .catch((error) => {

                Alert.alert('Error', error.messsage)

            });

    }


    handleBackButtonClick() {
        // this.removeFlags();
        if (this.state.isModalOpen) {
            this.setState({ isModalOpen: !this.state.isModalOpen }, () => {
                this.modalRole.close();
            });
        } else {
            multipleTapHandler.clearNavigator();

            this.props.navigation.goBack(null);
            return true;
        }
        this.setState({ isChanged: false });
    }
    componentWillMount() {
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    }
    leftImageOnClick() {
        //this.removeFlags();
        multipleTapHandler.clearNavigator(),
            this.props.navigation.navigate("PatientVisitHistoryContainer");
        return true;
    }
    setValue(type, text) {
        this.setState({
            [type]: text
        })
    }
    selectSuggestion(sugg) {
        this.setValue('abhaAddress', sugg);
    }
    timerFinished() {
        this.setState({
            hideTimer: true,
            attempt: 1
        })
    }
    validateResponse(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    downloadFile(url, fileName, token) {

        const { config, fs } = ReactNativeBlobUtil;
        const downloads = fs.dirs.DownloadDir;
        return config({
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: false,
                path: downloads + '/' + fileName + '.png',
            }
        }).fetch('GET', url, {
            'xtoken': token
        });
    }
    navigateBackToProfile() {
        this.props.navigation.navigate("PatientVisitHistoryContainer");
    }
    shareAbhaCard() {


        Share.open({
            url: Platform.OS === 'android' ? 'file://' +
                this.state.src
                : '' + this.state.src,
        })
            .then((res) => { })
            .catch((ex) => { });
    }
    async verify() {
        if (!this.state.abhaAddress) {
            Alert.alert("Error", "All Fields are Required")
            return false;
        }
        this.setState({
            loading: false, srcLoading: true
        })
        let data = JSON.stringify({
            "txnId": this.state.txnId,
            "abhaAddress": this.state.abhaAddress
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://stagingapi2.prescrip.in/apiv2/abdm-entrollment-createabha',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        abdmRequest(data, config)
            .then((response) => {
                
                if (response.data) {
                    response = response.data;
                    this.downloadFile('https://stagingapi2.prescrip.in/apiv2/v2abdm/getPngCard', 'abhacard' + new Date().getTime().toString(),
                        this.state.xToken).then(res => {
                            let path = res.path();
                            this.setState({
                                src: path, loading: false, srcLoading: false
                            });
                        }).catch(() => {
                            this.setState({
                                loading: false, srcLoading: false
                            });
                        });

                }
                else {
                    this.setState({
                        loading: false, srcLoading: false
                    });
                }

            })
            .catch((error) => {
                this.setState({
                    loading: false, srcLoading: false
                });
                Alert.alert('Error', error.message);

            });


    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    translucent={true}
                    backgroundColor="#dcdcdc"
                />
                <SettingsHeader
                    {...this.props}
                    bgImage={null}
                    bgColor={"white"}
                    cursorColor={"#0869d8"}
                    tintColor={"#0b69d8"}
                    titleColor={null}
                    descriptionColor={"#3D3D3D"}
                    description={
                        'Aadhar Authentication'
                    }
                    subtitle={

                        null
                    }
                    placeholderTextColor={"black"}
                    placeTextColor={"black"}
                    placeholderTextSize={20}
                    leftImage={ic_close_button}
                    leftImageOnClick={() => this.leftImageOnClick()}
                    rightImage={null}
                    rightImageCross={null}
                    isSearchBoxShowing={null}
                    type={5}
                    rightImageOnClick={() => null}
                />



                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : null}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                        style={{
                            flex: 1
                        }}
                    >
                        {!this.state.src ?
                            <View style={{ marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>

                                <View style={{ flexDirection: "row" }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#8B8B8B",
                                            fontFamily: "NotoSans",
                                        }}
                                    >
                                        ABHA Address
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#FF0000" }}>
                                        *
                                    </Text>
                                </View>
                                <TextInput
                                    onChangeText={(text) =>
                                        this.setValue("abhaAddress", text)
                                    }

                                    keyboardType="email-address"
                                    value={this.state.abhaAddress}
                                    maxLength={30}
                                    style={{
                                        borderBottomColor: "#d7d7d7",
                                        letterSpacing: 1,
                                        paddingTop: 5,
                                        textAlign: 'left',
                                        paddingBottom: 0,
                                        paddingTopLeft: 0,
                                        borderBottomWidth: 1,
                                        fontSize: 20,
                                        color: "#242424",
                                        fontFamily: "NotoSans",
                                    }}
                                />

                            </View> : null}
                        {!this.state.src ?
                            <View style={{
                                marginTop: 5, paddingLeft: 15, paddingRight: 15, flexDirection: 'row',
                                justifyContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                                    {this.state.suggestionList.length == 0 ? (
                                        <>
                                            <ActivityIndicator size="small" color="#000" />
                                            <Text onPress={() => this.selectSuggestion(a)}
                                                style={{
                                                    color: '#000', fontSize: 14,
                                                    fontFamily: 'NotoSans'
                                                }}> {'Loading Abha address sugesstions...'}
                                            </Text></>

                                    ) :
                                        this.state.suggestionList.map((a) => {
                                            return <View style={{
                                                alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingBottom: 5
                                            }}>
                                                <Text onPress={() => this.selectSuggestion(a)}
                                                    style={{
                                                        color: '#06b7cc', fontSize: 14, textDecorationLine: "underline",
                                                        fontFamily: 'NotoSans'
                                                    }}> {a}
                                                </Text>

                                            </View>
                                        })
                                    }



                                </ScrollView>

                            </View> : null
                        }
                        {!this.state.src ?
                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity
                                    disabled={this.state.loading}
                                    onPress={() => this.verify()}
                                >
                                    <LinearGradient
                                        colors={["#1b7cdb", "#07cef2"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        locations={[0, 0.8]}
                                        style={styles.linear_gradient_btn_style}
                                    >
                                        <Text style={styles.linear_gradient_text_style}>
                                            {"Done"}
                                        </Text>
                                        {this.state.loading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : null}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View> : null
                        }
                        <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            {
                                this.state.src ?

                                    <View style={{ width: '100%', flexDirection: 'column', flex: 1 }}>
                                        <View style={{ flex: 0.8 }}>
                                            <Image
                                                style={{
                                                    width: '100%',
                                                    resizeMode: 'cover',
                                                    height: this.ht * 60 / 100
                                                }}
                                                source={{
                                                    uri: Platform.OS === 'android' ? 'file://' +
                                                        this.state.src : '' + this.state.src
                                                }} />
                                        </View>
                                        <View style={{ flex: 0.2 }}>

                                            <TouchableOpacity onPress={() => this.shareAbhaCard()}>
                                                <LinearGradient
                                                    colors={['#1b7cdb', '#07cdf2']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    locations={[0, 0.8]}
                                                    style={{
                                                        width: '95%',
                                                        flexDirection: 'column',
                                                        height: 55,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        alignSelf: 'center',
                                                        borderRadius: 25,
                                                    }}>

                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize: 15,
                                                            color: '#f9fcfe',
                                                            fontFamily: 'NotoSans',
                                                            marginRight: 5,
                                                        }}>
                                                        Share ABHA Card
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.navigateBackToProfile();
                                                }}
                                                style={{ marginVertical: 20 }}>
                                                <Text
                                                    style={{
                                                        textDecorationLine: 'underline',
                                                        textDecorationColor: '#757575',
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: 18,
                                                        color: '#757575',
                                                        fontFamily: 'NotoSans-Bold',
                                                        marginRight: 5,
                                                    }}>
                                                    Proceed
                                                </Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    :
                                    this.state.srcLoading ?
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center', height: this.ht * 50 / 100
                                        }}>
                                            <ActivityIndicator size="large" color="#000"
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }} />
                                            <Text
                                                style={{
                                                    color: '#000', fontSize: 14, paddingTop: 10,
                                                    fontFamily: 'NotoSans', justifyContent: 'flex-start', alignItems: 'flex-start'
                                                }}> {'Loading ABHA Card...'}
                                            </Text>
                                        </View> : null

                            }


                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView >
            </View >
        );
    }
}
const styles = StyleSheet.create({
    flat: { flex: 1, flexGrow: 1, paddingHorizontal: 15, paddingVertical: 16 },
    cflatlistitem: { marginVertical: 5 },
    btn_container: { flex: 0.1, justifyContent: "center" },
    linear_gradient_btn_style: {
        flexDirection: "row",
        width: "90%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        alignSelf: "center",
        borderRadius: 25,
    },
    linear_gradient_text_style: {
        textAlign: "center",
        fontSize: 17,
        color: "#ffffff",
        fontFamily: "NotoSans-Bold",
        marginEnd: 5,
    },

    cont: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#d8dadc",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 5,
        margin: 10,
    },
    txt1: {
        color: "#9a9c9e",
        fontSize: 15,
        marginLeft: 5,
        fontFamily: "NotoSans",
        alignItems: "flex-start",
    },
});

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAbhaAddress);
