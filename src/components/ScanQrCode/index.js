import React, { Component } from 'react';
import { Container, Icon } from "native-base";
import { View, Text, Platform, TouchableOpacity, Linking, PermissionsAndroid, BackHandler, StatusBar, AsyncStorage, Image, Dimensions } from 'react-native';
import styles from "./styles";
import { CameraScreen as CameraKitCameraScreen } from 'react-native-camera-kit';
import io from 'socket.io-client';
import { isStagging, staging } from "../../../app.json";
import { righticon, lefticon, } from "../../constants/images";
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader'
import Images from '../../Theme/Images'
import _CryptoJS from "crypto-js";
export default class ScanQrCode extends Component {
    constructor(props) {
        super(props);
        this._handleBackPress = this._handleBackPress.bind(this);
        this.state = {
            QR_Code_Value: '',
            heightCam: 0,
            Start_Scanner: false,
        };
        this.socketConnection = this.props.route.params.SockConobj;
    }
    componentDidMount() {
        this.DocId = this.props.route.params.DocId;
        // AsyncStorage.getItem('doctorid').then((val) => {
        //     this.DocId = val;
        // });
        this.open_QR_Code_Scanner();
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress() {
        this.props.navigation.goBack()
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }
    testQrOP(message) {
        try {
            if (this.state.Start_Scanner) {
                let originalGuid = _CryptoJS.enc.Utf8.stringify(_CryptoJS.AES.decrypt(message, 'prescripsec'));
                if (originalGuid.split(':')[1] == "prescrip") {
                    var sendData = {
                        "Guid": originalGuid.split(':')[0],
                        "DocId": this.DocId
                    }
                    this.setState({ Start_Scanner: false })


                    const self = this;
                    let socket_url = isStagging ? staging.socket : "http://qsftdsjqtpdlfu.prescrip.in:8050";
                    this.socketConnection = io.connect(socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050", { transports: ['websocket'] });
                    this.socketConnection.on('connection', function (data) {
                        if (this.socketConnection.connected) {
                            this.socketConnection.emit("SendGuID", sendData);
                            if (this.props.route.params.returnScanData) {
                                this.props.route.params.returnScanData(true);
                            }
                            this.props.navigation.goBack();
                        }
                    })

                }
            }
        }
        catch (e) {
            alert(e.message);

        }

    }
    onQR_Code_Scan_Done = (message) => {
        try {
            if (this.state.Start_Scanner) {
                let originalGuid = _CryptoJS.enc.Utf8.stringify(_CryptoJS.AES.decrypt(message, 'prescripsec'));
                if (originalGuid.split(':')[1] == "prescrip") {
                    var sendData = {
                        "Guid": originalGuid.split(':')[0],
                        "DocId": this.DocId
                    }
                    this.setState({ Start_Scanner: false })
                    if (this.socketConnection) {
                        if (this.socketConnection.connected) {
                            this.socketConnection.emit("SendGuID", sendData);
                            if (this.props.route.params.returnScanData) {
                                this.props.route.params.returnScanData(true);
                            }
                            this.props.navigation.goBack();
                        }
                    }
                    else {
                        const self = this;
                        let socket_url = isStagging ? staging.socket : "http://qsftdsjqtpdlfu.prescrip.in:8050";
                        this.socketConnection = io(socket_url || "http://qsftdsjqtpdlfu.prescrip.in:8050", { transports: ['websocket'] });
                        this.socketConnection.on('connect', function (data) {
                            if (this.socketConnection.connected) {
                                this.socketConnection.emit("SendGuID", sendData);
                                if (this.props.route.params.returnScanData) {
                                    this.props.route.params.returnScanData(true);
                                }
                                this.props.navigation.goBack();
                            }
                        })
                    }
                }
            }
        }
        catch (e) {
            alert(JSON.stringify(e));

        }
    }
    OnClick(callFrom) {


        switch (callFrom) {
            case 'left':
                this._handleBackPress();
                break;

            default:
                break;
        }

    }
    open_QR_Code_Scanner = () => {
        var that = this;
        if (Platform.OS === 'android') {
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA, {
                        'title': 'Camera App Permission',
                        'message': 'Camera App needs access to your camera '
                    }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        that.setState({
                            Start_Scanner: true
                        })

                    } else {

                    }
                } catch (err) {

                }
            }
            requestCameraPermission();
        } else {
            that.setState({ Start_Scanner: true });
        }
    }
    find_dimesions(layout) {
        const { height } = layout.nativeEvent.layout;
        this.setState({ heightCam: height })
    }
    render() {
        if (!this.state.Start_Scanner) {
            return (
                <View style={styles.MainContainer}>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <PrescriptionWebViewHeader
                    {...this.props}
                    bgImage={null}
                    bgColor={'#ffffff'}
                    title={"Scan"}
                    description={"Scan"}
                    titleColor={'#919191'}
                    descriptionColor={'#0b69d8'}
                    leftImage={Images.ic_black_back}
                    rightImage={""}
                    secondRightImage={""}


                    OnClick={(callFrom) => this.OnClick(callFrom)}


                />
                <View style={{ flex: 1, backgroundColor: '#fff', width: Dimensions.get('window').width }}>
                    <View style={{
                        flex: 1,
                        position: 'absolute',
                        backgroundColor: "#fff",
                        width: '100%',
                        padding: 15,
                        zIndex: 99,

                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Text style={{ textAlign: 'center', fontSize: 18, justifyContent: 'center', alignItems: 'center' }}>
                            Visit <Text style={{ textAlign: 'center', fontSize: 18, justifyContent: 'center', alignItems: 'center', color: '#000' }}>
                                {isStagging ? staging.print : "print.prescrip.in"} </Text>on your computer and scan the QR Code
                        </Text>
                    </View>
                    <View />
                    <CameraKitCameraScreen
                        scanBarcode={true}
                        onReadCode={event =>
                            // this.testQrOP(event.nativeEvent.codeStringValue)
                            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
                        }
                    />
                </View>
            </View>
        );
    }
}
