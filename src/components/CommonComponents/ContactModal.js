//**code by ravi */
import React, { Component } from "react"
import { Container, Text, Input } from 'native-base'
import { View, TouchableOpacity, Image, StatusBar, Dimensions, TextInput, ScrollView, Platform, PermissionsAndroid } from 'react-native'
import { connect } from "react-redux";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import Modal from "react-native-modalbox";
import styles from "./styles";
import Contacts from 'react-native-contacts';
import { setcontactname, setcontactmobilenumber } from '../../actions/patientVisit'
class ContactModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Mobile: '',
            Email: '',
            Name: '',
            deviceHeight: Dimensions.get('window').height,
            contactloading: false,
            contactList: [],
        },
            this.searchCntList = [];
        this.Contactsearchtxt = "";
        this.searchspcList = [];
        this.onModalClose = this.onModalClose.bind(this);
    }

    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }



    onOpen = () => {
        this.setState({ contactloading: true })
        if (Platform.OS != "ios") {
            this.askPermission();
        } else {
            this.getContact();
        }
    }


    askPermission() {
        let self = this;
        let contactss = Contacts;
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            'title': 'Contacts',
            'message': 'This app would like to read your contacts.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }).then((result) => {

            if (result == "granted") {
                //self.getContact()
                Contacts.getAll().then(contacts => this.setState({ contactList: contacts })).catch(err => {
                    this.handleerror(err);
                });
                this.setState({ contactloading: false })
                this.isModalOpen = true;
                this.refs.modal2.open()
            } else {
                this.setState({ contactloading: false })
            }
        })
        //this.setState({ loading: false })
    }

    handleerror(err) {

    }
    shouldComponentUpdate(a) {
        if (a.contactModalOpen) {
            this.contactmodal.open();
        } else if (!a.contactModalOpen) {

            this.contactmodal.close();

        }
    }

    checkpermission(permission) {
        if (permission === 'undefined') {
            this.acceptedpermission();
        }
        if (permission === 'authorized') {
            Contacts.getAll().then(contacts => this.setState({ contactList: contacts })).catch(err => {
                this.handleerror(err);
            });
            this.setState({ contactloading: false })
            this.isModalOpen = true;
            this.refs.modal2.open()

        }
        if (permission === 'denied') {
            this.acceptedpermission();
        }
    }

    acceptedpermission() {
        Contacts.requestPermission().then(permission => {
            this.checkpermission(permission);
        })
    }

    getContact() {
        Contacts.checkPermission().then(permission => {
            this.checkpermission(permission);
        })
    }


    _onPressItem = (id) => {

        var getObject = this.state.contactList.filter(function (type) {
            return type.recordID === id;
        });
        if (getObject[0].givenName) {
            let Mob = getObject[0].phoneNumbers.length ? getObject[0].phoneNumbers[0].number.replace(/ /g, '') : "",
                _Name = getObject[0].givenName;
            // if (Mob != "")
            //     this.props.change("Mobile", Mob);
            // if (_Name != "")
            //     this.props.change("Name", _Name);
            this.props.setcontactmobilenumber(Mob);
            this.props.setcontactname(_Name)
            this.setState({
                Mobile: Mob != "" ? Mob : this.state.Mobile,
                Name: _Name != "" ? _Name : this.state.Name,
            }, () => {
                let data = {
                    Name: _Name,
                    Mobile: Mob
                }
                this.props.getContactDetails(data);
            })




        }
        //this.isModalOpen = false;
        this.contactmodal.close();
        //this.props.closemodal();
        //this.refs.modal2.close()
    };

    sortAlpha(a, b) {
        if (a.givenName.toLowerCase() < b.givenName.toLowerCase()) {
            return -1;
        }
        if (a.givenName.toLowerCase() > b.givenName.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    getRandomColor() {

        var colors = ['#f1e0b0', '#f1cdb0', '#e7cfc8', '#97f2f3'];
        var min = 0;
        var max = 3;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        var color = colors[random];

        return color;
    }

    onChangeTextfilter(typedVal) {
        try {
            var copyFilterdcontent = [...this.state.contactList];
            let Filterdcontent = copyFilterdcontent.filter(function (value) {
                return value.givenName.toLowerCase().indexOf(typedVal.toLowerCase()) >= 0;
            });
            this.searchCntList = Filterdcontent;
            this.Contactsearchtxt = typedVal;
            this.forceUpdate();
        }
        catch {
        }
    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }

    BindData() {
        let mainArr = this.searchCntList.length == 0 && this.Contactsearchtxt == "" ? this.state.contactList : this.searchCntList;
        let sortedContactList = mainArr.filter(x => x.givenName).sort(this.sortAlpha);
        let content = sortedContactList.map((pic, i) => {
            return (
                <TouchableOpacity onPress={() => { this._onPressItem(pic.recordID) }} >
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ borderBottomColor: "#eee", flex: 0.1, flexDirection: 'column', borderBottomWidth: 1, paddingLeft: 15, padding: 10, paddingRight: 0, paddingHorizontal: 10, width: "100%", justifyContent: 'center' }}>
                            <View style={{ width: 35, height: 35, overflow: 'hidden', backgroundColor: this.getRandomColor(), borderRadius: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { fontSize: 18, textAlign: 'center', marginRight: 5 }]}> {pic.givenName.replace(/ /g, '').charAt(0)}</Text>
                            </View>
                        </View>
                        <View style={{ borderBottomColor: "#eee", flex: 0.9, flexDirection: 'column', borderBottomWidth: 1, padding: 10, paddingHorizontal: 10, width: "100%", justifyContent: 'center' }}>
                            <Text style={[styles.text, { fontSize: 16 }]}> {pic.givenName.replace(/ /g, '')}</Text>
                            <Text style={[styles.text, { fontSize: 13 }]}> {pic.phoneNumbers.length > 0 ? pic.phoneNumbers[0].number.replace(/ /g, '') : ""}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
        return (
            mainArr.length > 0 ?
                <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={true} style={{ width: "100%" }}>
                    {content}
                </ScrollView>
                :
                <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 10 }} >
                    <View style={{ borderBottomColor: "#dcdcdc", borderBottomWidth: 0, paddingBottom: 10 }}>
                        <Text style={{ justifyContent: 'center', textAlign: "center", color: '#3b3b3b', fontSize: 14 }}>No result found for {this.Contactsearchtxt} </Text>
                    </View>
                </View>
        )
    };
    onModalClose() {
        this.props.openmodal();
    }
    render() {
        dHeight = this.state.deviceHeight
        const { navigate } = this.props.navigation;

        return (

            <Modal
                useNativeDriver={true}
                animationDuration={200}
                style={{ borderWidth: 0, width: '80%', height: dHeight - 240, justifyContent: 'center' }}
                ref={(ref) => this.contactmodal = ref} position={"center"} //swipeToClose={this.state.swipeToClose}
                onClosed={this.onModalClose} onOpened={this.onOpen} onClosingState={this.onClosingState}>
                <View style={{ flex: 1 }}>
                    <View style={{ borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, }, shadowColor: '#dcdcdc', shadowOpacity: 2, borderBottomWidth: 2, padding: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center' }}>
                        <Text style={[styles.text, { shadowOpacity: 0 }]}> Select a Contact</Text>
                    </View>
                    <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                        <View style={{ flexDirection: "row", borderBottomColor: '#eee', borderBottomWidth: 2, width: '100%', paddingRight: 5 }}>
                            <Input style={{}}
                                placeholder="Search"
                                maxLength={20}
                                onChangeText={text => this.onChangeTextfilter(text)}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>


                    {this.BindData()}

                </View>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({


})
const mapDispatchToProps = dispatch => ({
    setcontactname: (cont_name) => dispatch(setcontactname(cont_name)),
    setcontactmobilenumber: (cont_mob) => dispatch(setcontactmobilenumber(cont_mob)),


})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactModal);



