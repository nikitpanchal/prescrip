import React, { Component } from 'react';
import { Text, ScrollView, Alert, View, Image, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList, Button } from 'react-native';
import { Icon } from 'native-base'
import { dropdownbutton } from '../constants/image_assets'
import Modal from "react-native-modalbox";
import Loading from '../components/Loading'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default class Picker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            Technique: '',
            Time: '',
            Iop: '',
            label: '',
            loading: false,
            pname: '',
            pdata: [],

        };
        // setModalVisible(visible);{
        //   this.setState({modalVisible:visible})

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

    }

    handleOpenModal(lname, pname, txtbox) {
        this.setState({ loading: true, pname, label: lname })
        var docid = '5d8b16e52712ef1ae04e0f5e'
        var self = this;
        this.props.patientdata(docid).then(data => {
            self.setState({ loading: false, pdata: data.payload.data.data })
        });
        this.setState({ modalVisible: true })
    }


    closemodal = () => {
        this.setState({ modalVisible: false, })
    }
    handleCloseModal(item) {
        this.props.onPress(item, this.state.pname )
    }

    Item(item) {
        return (
            <TouchableOpacity onPress={() => { this.handleCloseModal(item.commonDetails.fullName) }} >
                <Text style={{ fontSize: 16, color: '#111' }}>{item.commonDetails.fullName}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const self = this;
        const { name, DATA } = this.props;
        
        if (this.state.loading) {
            return (<Loading />)
        } else {


            return (
                <View>
                    <View style={{ margin: 15 }}>

                        <Modal
                            style={[styles.modal, styles.modalCenter]}
                            coverScreen={true}
                            position={"center"}
                            isOpen={this.state.modalVisible}
                        //onClosed={handleHide}
                        >
                            <View style={[styles.contentModal, styles.modalBasic]}>
                                <Button title='close' transparent style={styles.btnClose} onPress={() => this.closemodal()}>
                                    <Icon as={FontAwesome} name="close" style={styles.txtMessage} />
                                </Button>
                                {
                                    this.state.pdata && this.state.pdata.length > 0 &&
                                    <FlatList
                                        style={{ flex: 1 }}
                                        data={this.props.tab.PatientData}
                                        renderItem={({ item, index }) =>
                                            this.Item(item)
                                        }
                                        keyExtractor={(item, i) => i.toString()}
                                    />

                                }
                            </View>
                        </Modal>
                        <TouchableOpacity
                            onPress={() => {
                                this.handleOpenModal()
                            }}>
                            <View>
                                <Text style={styles.underlite_text}>{name}</Text>
                                <Text style={styles.technique_text}>Technique</Text>
                                <TouchableOpacity onPress={() => this.handleOpenModal(name, 'Technique')} style={styles.view_style}>
                                    <Text style={styles.select_text}> {this.props.tab.FirstPage='Dilated' != "" ? this.state.Technique : "Select"}</Text>
                                    <Image style={styles.imagestyle} source={dropdownbutton} />
                                </TouchableOpacity>

                                <Text style={styles.technique_text}>Time</Text>
                                <TouchableOpacity onPress={() => this.handleOpenModal(name, 'Time')} style={styles.view_style}>
                                    <Text style={styles.select_text}> {this.props.tab.Time!= "" ? this.state.Time : "Select"}</Text>
                                    <Image style={styles.imagestyle}
                                        source={dropdownbutton} />

                                </TouchableOpacity>

                                <Text style={styles.technique_text}>IOP</Text>
                                <TouchableOpacity onPress={() => this.handleOpenModal(name, 'Iop')} style={styles.view_style}>
                                    <Text style={styles.select_text}> {this.props.tab.Iop != "" ? this.state.Iop : "Select"}</Text>
                                    <Image style={styles.imagestyle}
                                        source={dropdownbutton} />

                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.viewline}></View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    underlite_text: {
        fontSize: 18, fontWeight: 'bold', color: '#333333', letterSpacing: 0.6
    },
    technique_text: {
        color: '#a9a9a9', marginTop: 30,

    },
    select_text: {
        color: '#686868', fontSize: 16,
    },
    imagestyle: {
        justifyContent: 'center', height: 12, width: 12, resizeMode: 'contain'

    },
    view_style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', borderBottomWidth: 0.8, borderBottomColor: '#ececec', paddingBottom: 5, marginTop: 5

    },
    viewline: {
        backgroundColor: '#ececec', height: 8, marginTop: 20
    },

    headerLeft: {
        flex: 0.3
    },
    headerBody: {
        flex: 0.4
    },
    textBody: {
        alignSelf: "center"
    },
    headerRight: {
        flex: 0.3
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    contentModal: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DCDCDC"
    },
    modalBasic: {
        flex: 1
    },
    modalTop: {
        height: 230
    },
    modalCenter: {
        height: 300,
        width: 300
    },
    modalBottom: {
        height: 300
    },
    text: {
        color: "black",
        fontSize: 22,
        alignSelf: "center"
    },
    btnClose: {
        position: "absolute",
        top: 0,
        right: 0
    },
    btnShowModal: {
        marginTop: 10
    },
    txtMessage: {
        color: "#000"
    }
})