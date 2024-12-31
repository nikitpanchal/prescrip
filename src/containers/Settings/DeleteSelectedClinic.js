/// Ravi
import React, { Component } from 'react';
import { Container, Content, Header } from 'native-base';
import {
    Text,
    Image,
    View,
    StatusBar,
    BackHandler,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import {
    Settings_Next_Step_Icon,
    Black_back,
    ic_Calendar_Time_Small,
    ic_Clinics_and_Hospital_icon,
    ic_note_delete,
    remove_signature,
    ic_Add_Clinic_Button,
} from '../../constants/images';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';
import {
    get_outofclinic_time_and_date,
    setSettingClinic,
    delete_ooc,
} from '../../actions/settings';
import { FloatingAction } from 'react-native-floating-action';
import _, { result } from 'lodash';
import moment from 'moment';

class DeleteSelectedClinic extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            occdata: [],
            clinicdata: [],
        };
    }
    componentDidMount() {

        this.props.navigation.addListener('focus', () => {
            this.getoutofclinicdata();
        });


    }

    componentWillMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
        );
    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack(null);
        return true;
    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(), this.props.navigation.goBack(null);
        return true;
    }

    getoutofclinicdata() {
        try {
            let data = {
                doctorId: this.props.doctorProfile.DoctorData._id,
            };
            this.props.get_outofclinic_time_and_date(data).then((response) => {
                if (response.payload.data.Status == 1) {
                    var newdata = _(response.payload.data.ooc)
                        .groupBy((x) => x.OocId)
                        .map((value, key) => ({ OocId: key, Clinics: value }))
                        .value();
                    this.setState({ occdata: newdata });
                }
            });
        } catch (error) {
            Alert.alert("Prescrip", "Some error occurred");
        }
    }

    deleteClinic(item, index) {
        try {
            let delete_ooc_Details = {
                doctorId: this.props.doctorProfile.DoctorData._id,
                occId: item.OocId,
            };
            this.props.delete_ooc(delete_ooc_Details).then((response) => {
                if (response.payload.data.Status == 1) {
                    let data = [...this.state.occdata];
                    data.splice(index, 1);
                    this.setState({ occdata: data }, () => {
                        data = null;
                        if (this.state.occdata.length == 0) {
                            this.handleBackButtonClick();
                        }
                    });
                    // this.setState({})
                } else {
                    Alert.alert('Prescrip', response.payload.data.msg);
                }
            });
        } catch (error) {
            Alert.alert("Prescrip", "Some error occurred");
        }
    }

    Item(item, index) {
        let finalData = [];
        let isAllDay = false;
        item.Clinics.forEach((elementFinal) => {
            let found = this.props.doctorProfile.DoctorData.ClinicAddresses.find(
                (element) => element.ClinicId == elementFinal.ClinicId,
            );
            finalData.push(found.ClinicName);
        });
        if (item.Clinics[0].Away[2] == 0 && item.Clinics[0].Away[3] == 0) {
            isAllDay = true;
        }
        else if (item.Clinics[0].Away[2] == null && item.Clinics[0].Away[3] == null) {
            isAllDay = true;
        }
        else if (item.Clinics[0].Away[2] == 0) {
            item.Clinics[0].Away[2] = "000";
        }
        return (
            <View
                style={{
                    flex: 1,
                    paddingVertical: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fafafa',
                }}>
                <View style={{ flexDirection: 'column', flex: 1, width: '90%' }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                position: 'absolute',
                                top: -10,
                                right: -11,
                                elevation: 12,
                                zIndex: 1,
                                paddingLeft: 15,
                                paddingBottom: 10
                            }} onPress={() => this.deleteClinic(item, index)}>
                            <Image
                                source={remove_signature}
                                style={{ height: 23, width: 23, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 15,
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start', paddingTop: 5


                                        }}>
                                        <Image
                                            style={{
                                                width: 18,
                                                height: 18,
                                                resizeMode: 'contain',
                                                alignSelf: 'flex-start',
                                            }}
                                            source={ic_Calendar_Time_Small}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                marginLeft: 16,
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: 'NotoSans',
                                                    color: '#1c1c1c',
                                                    fontSize: 16, marginTop: -3
                                                }}>{moment(item.Clinics[0].StartDate).format(
                                                    'ddd, Do MMM  YYYY',
                                                )}
                                            </Text>
                                            <Text
                                                style={{
                                                    paddingVertical: 12,
                                                    fontFamily: 'NotoSans',
                                                    color: '#1c1c1c',
                                                    fontSize: 16,
                                                }}>
                                                {moment(item.Clinics[0].EndDate).format(
                                                    'ddd, Do MMM  YYYY',
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', }}>
                                        <Text
                                            style={{
                                                fontFamily: 'NotoSans',
                                                color: '#1c1c1c',
                                                fontSize: 16, marginTop: isAllDay ? -35 : 0
                                            }}>
                                            {isAllDay ? "All-day" : moment(item.Clinics[0].Away[2].toString(), "hmm").format('hh:mm A')}
                                        </Text>
                                        {!isAllDay ? <Text
                                            style={{
                                                paddingVertical: 12,
                                                fontFamily: 'NotoSans',
                                                color: '#1c1c1c',
                                                fontSize: 16,
                                            }}>
                                            {moment(item.Clinics[0].Away[3].toString(), "hmm").format('hh:mm A')}
                                        </Text> : null}
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingHorizontal: 10,
                                    paddingBottom: 15,
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingBottom: 5 }}>
                                    <Image
                                        style={{
                                            width: 18,
                                            height: 18,
                                            resizeMode: 'contain',
                                            alignSelf: 'flex-start',
                                        }}
                                        source={ic_Clinics_and_Hospital_icon}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            marginLeft: 16,
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'NotoSans',
                                                color: '#636363',
                                                fontSize: 14,
                                            }}>
                                            {finalData.length > 2 ? finalData[0] + ", +" + (finalData.length - 1) + " more..." : finalData.join(', ')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    translucent={true}
                    backgroundColor="#dcdcdc"
                />
                <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    {/* for HEADER */}
                    <SettingsHeader
                        {...this.props}
                        bgImage={null}
                        bgColor={'white'}
                        cursorColor={'#0869d8'}
                        tintColor={'#636363'}
                        description={'Out of Clinic'}
                        subtitle={null}
                        titleColor={null}
                        descriptionColor={'#3D3D3D'}
                        placeholderTextColor={'black'}
                        placeTextColor={'black'}
                        placeholderTextSize={20}
                        leftImage={Black_back}
                        rightImage={null}
                        rightImageCross={null}
                        type={5}
                        leftImageOnClick={() => this.leftImageOnClick()}
                        rightImageOnClick={null}
                    />
                    <View style={{ backgroundColor: '#fafafa', flex: 1, paddingTop: 10 }}>
                        <FlatList
                            data={this.state.occdata}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => this.Item(item, index)}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <FloatingAction
                        iconHeight={55}
                        iconWidth={55}
                        position={'right'}
                        color="transparent"
                        floatingIcon={ic_Add_Clinic_Button}
                        overlayColor="transpart"
                        buttonSize={55}
                        distanceToEdge={{ horizontal: 30, vertical: 40 }}
                        onPressMain={() => this.props.navigation.navigate('SettingsAddOutOfClinicNew')}
                    />
                </View>
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    doctorProfile: state.doctorProfile,
    settings: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
    get_outofclinic_time_and_date: (data) =>
        dispatch(get_outofclinic_time_and_date(data)),
    setSettingClinic: (data) => dispatch(setSettingClinic(data)),
    delete_ooc: (data) => dispatch(delete_ooc(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DeleteSelectedClinic);

const styles = StyleSheet.create({
    view_style: {
        flexDirection: 'row',
        backgroundColor: '#008be0',
        height: 60,
    },
    Optometry_Record: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    step_2_5: {
        fontSize: 12,
        color: '#ffffff',
    },
    Next: {
        height: 18,
        color: '#ffffff',
        textAlign: 'center',
        resizeMode: 'contain',
    },
    content_container: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1,
    },
    content_color: {
        color: '#383838',
        fontWeight: '600',
        fontSize: 16,
    },
    Next_blue: {
        height: 15,
        color: '#ffffff',
        textAlign: 'center',
        resizeMode: 'contain',
    },
});
