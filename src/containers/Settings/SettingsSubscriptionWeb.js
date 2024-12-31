import React, { Component } from 'react'
import { View, StyleSheet, StatusBar, BackHandler, ImageBackground, SafeAreaView, Dimensions, TouchableOpacity, Image, Text, Alert } from 'react-native'


import { connect } from 'react-redux'
import { WebView } from 'react-native-webview';
import { CommonActions } from '@react-navigation/native';
import { generateGuid } from '../../commonmethods/common';
import multipleTapHandler from '../../components/MultiTapHandle';
import Modal from "react-native-modalbox";
import {


    ic_Back_Button,

    ic_Blue_BG_578,
} from "../../constants/images";
const INJECTEDJAVASCRIPT = `setTimeout(() => {
    function notHeader() {
        const meta = document.createElement('meta');
         meta.setAttribute('content', 'width=device-width,  initial-scale=0.45, user-scalable=yes'); 
        meta.setAttribute('name', 'viewport'); 
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    notHeader();
    return true;
  }, 30);`
class SubscriptionWebPayPage extends Component {
    constructor(props) {
        super(props)

        this.handleBackButton = this.handleBackButton.bind(this);
        this.state = {
            loading: true,
            webVal: '',
            key: 1,
            backDis: false,
            afterPaymentText1: "Thank You for Renewing Prescrip Subscription",
            afterPaymentText2: "Please wait while we take you back to Patient List"
        }
        this.webdata = [],
            this.guid = "";
        this.WebViewRef = React.createRef();
    }
    showRxLoader() {
        this.setState({
            loading: true
        }, () => {
            this.resetWebViewToInitialUrl();
        })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {

        return false;
    }
    resetWebViewToInitialUrl = () => {
        this.setState({
            key: this.state.key + 1
        });
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        multipleTapHandler.clearNavigator()
        this.guid = generateGuid();
        //  let link = void Linking.openURL(this.props.route.params.paylink);
        //  return false

    }

    _onMessage = (val) => {
        let self = this;
        if (val.data.toLowerCase() == "success") {
            self.refs.modal2.open();
            setTimeout(() => {
                this.props.navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Drawer' }]

                }));
            }, 5000);
        }
        else if (val.data.toLowerCase() == "pending") {
            this.setState({
                afterPaymentText1:
                    "Payment was Cancelled",
                afterPaymentText2: "Payment was cancelled, please try again"
            }, () => {
                self.refs.modal2.open();

            });

        }
        else {
            this.setState({
                afterPaymentText1:
                    "Oops ! Payment failed",
                afterPaymentText2: "Payment was failed, please follow instruction on screens thank you"
            }, () => {
                self.refs.modal2.open();

            })
        }
    }

    leftImageOnClick() {
        this.setState({ backDis: true })
        setTimeout(() => {
            multipleTapHandler.clearNavigator();
            this.props.navigation.goBack(null);
        }, 3000)

    }
    render() {


        const screenHeight = Dimensions.get("window").height;
        const screenWidth = Dimensions.get("window").width;


        return (
            <View
                style={{ flex: 1, width: screenWidth, backgroundColor: '#fff' }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    translucent={true}
                    backgroundColor="#dcdcdc"
                />
                <View style={{ justifyContent: 'center', flexdirection: 'row', width: Dimensions.get('window').width }}>

                    <ImageBackground
                        style={{
                            width: '100%',
                        }} resizeMode="cover"
                        source={ic_Blue_BG_578}>

                        <View
                            style={{
                                flexDirection: 'column',
                                top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                                marginBottom:
                                    Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                            }}>
                            <SafeAreaView>
                                <View style={{ width: '100%', marginVertical: 10 }}>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                flex: 1
                                            }}>



                                            <TouchableOpacity
                                                onPress={() => {
                                                    !this.state.backDis ? this.leftImageOnClick() : null

                                                }}
                                                style={{
                                                    padding: 10,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Image
                                                    style={{
                                                        resizeMode: 'contain',
                                                        alignSelf: 'center',
                                                        justifyContent: 'flex-end',
                                                        width: 25,
                                                        height: 22,
                                                    }}
                                                    source={ic_Back_Button}
                                                />
                                            </TouchableOpacity>
                                            <Text

                                                style={{
                                                    fontFamily: 'NotoSans-Bold',
                                                    color: '#ffff',
                                                    fontSize: 20, marginLeft: 10,
                                                    alignSelf: 'flex-start', paddingTop: 8
                                                }}>
                                                {'Subscription'}
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </SafeAreaView>
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ flex: (this.props.type == 2 ? 0.84 : 0.93), backgroundColor: '#cdcdcd' }}>
                    <Modal
                        useNativeDriver={true}
                        animationDuration={200}
                        backdrop={false}
                        style={{
                            borderWidth: 0,
                            width: "80%",
                            height: 100,
                            overflow: "hidden",
                            justifyContent: "center", borderRadius: 20, backgroundColor: "#4D99E3"
                        }}

                        ref={"modal2"}
                        position={"bottom"}
                        //swipeToClose={this.state.swipeToClose}
                        onClosed={this.onClose}
                        onOpened={this.onOpen}
                        onClosingState={this.onClosingState}
                    >
                        <View
                            style={{

                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                            <Text style={{ fontFamily: 'NotoSans-Bold', textAlign: 'center', fontSize: 14 }}> {this.state.afterPaymentText1} </Text>
                            <Text style={{ fontFamily: 'NotoSans', textAlign: 'center', fontSize: 12 }}> {this.state.afterPaymentText2}  </Text>
                        </View>
                    </Modal>
                    <WebView
                        ref={this.WebViewRef}
                        androidLayerType="software"
                        key={1}
                        scalesPageToFit={true}

                        source={{ uri: this.props.route.params.paylink }}
                        onMessage={(event) => this._onMessage(event.nativeEvent)}
                        scrollEnabled={true}

                        //onMessage={event => event.nativeEvent}

                        style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
                    />
                </View>

            </View>

        )
    }
}
const mapStateToProps = state => ({





});

const mapDispatchToProps = dispatch => ({




})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubscriptionWebPayPage)

const styles = StyleSheet.create({
    dropdownMenu: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        position: 'absolute',
        top: -35,
        right: 10,
        height: 110,
        width: 100,
        borderBottomColor: '#cccccc',
        borderLeftColor: '#cccccc',
        borderRightColor: '#cccccc',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    dropdownFab: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        height: 250,
        width: '65%',
        borderRadius: 20,
        position: 'absolute',
        top: 180
    }
})
