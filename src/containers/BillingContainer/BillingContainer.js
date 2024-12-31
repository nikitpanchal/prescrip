/****** code by ravi ******/
import React, { Component } from "react";
import { StatusBar, Alert, LayoutAnimation, StyleSheet, KeyboardAvoidingView, View, Text, BackHandler, ScrollView, UIManager, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';

import multipleTapHandler from '../../components/MultiTapHandle/index';

import { Container, Icon, Button, } from "native-base";
import PrescriptionHeader from "../../components/PrescriptionHeader/PrescriptionHeaderDelay";
import { BG, lefticon, empty_PatientList, icon_close_white, ic_back_black, icon_search_button_blue, ic_Close_Button, icon_Reemove_Button, trans_collapsed, trans_expand, ic_Teal_BG_578, ic_Blue_BG_578, icon_search_white, icon_Three_Dot_Menu_Button, Black_back, Search_button_light_blue, ic_note_delete, icon_List_First_Element_Add_Button_Blue, transactions_collapse_button, transactions_expand_button } from '../../constants/images';

import Images from '../../Theme/Images'
import BillingComponent from "../../components/BillingComponent/BillingComponent";
import BillingCompnentWithoutSection from "../../components/BillingComponent/BillingCompnentWithoutSection";

import EmptyHome from '../../components/EmptyHome/EmptyHome'

class Expandable_ListView extends Component {

    constructor(props) {
        super(props);
        this.state = {

            layout_Height: 0,
            nameTrans: transactions_expand_button

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item.expanded) {
            this.setState(() => {
                return {
                    layout_Height: null,
                    nameTrans: transactions_collapse_button
                }
            });
        }
        else {
            this.setState(() => {
                return {
                    layout_Height: 0,
                    nameTrans: transactions_expand_button
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.layout_Height !== nextState.layout_Height) {
            return true;
        }
        return false;
    }

    show_Selected_Category = (item) => {

        // Write your code here which you want to execute on sub category selection.
        Alert.alert(item);

    }


    render() {
        return (
            <View >

                <TouchableOpacity

                    onPress={this.props.onClickFunction} style={styles.category_View}>

                    <View>
                        <Text style={styles.category_Text}>{this.props.item[0].Name ? this.props.item[0].Name : "Patient"} </Text>
                        <Text style={styles.sub_Category_Text}>{this.props.item[0].PatientMobile ? "+91 " + this.props.item[0].PatientMobile : 'Number N/A'} </Text>

                    </View>
                    <View
                        style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginBottom: 10 }}
                    >
                        <Text style={styles.iconStyle} >{'View Transactions'} </Text>
                        <Image source={this.state.nameTrans} style={{ height: 12, width: 12, resizeMode: 'contain' }} />


                    </View>


                </TouchableOpacity>

                <View style={{ height: this.state.layout_Height, overflow: 'hidden' }}>



                    <BillingCompnentWithoutSection
                        {...this.props}
                        finalArrayAfterTabClick={this.props.item}
                        viewReceptClick={(clickFrom, itemData) => this.props.viewReceptClick(clickFrom, itemData)}

                    />



                </View>

            </View>

        );
    }
}

export default class BillingContainer extends Component {
    constructor(props) {
        super(props);
        this.monthData = [];
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.resultOfMonth = this.props.route.params.resultOfMonth;
        if (Platform.OS === 'android') {

            UIManager.setLayoutAnimationEnabledExperimental(true)

        }

        const array = [

            {
                expanded: false, category_Name: "Mobiles", sub_Category: [{ id: 1, name: 'Mi' }, { id: 2, name: 'RealMe' }, { id: 3, name: 'Samsung' },
                { id: 4, name: 'Infinix' }, { id: 5, name: 'Oppo' }, { id: 6, name: 'Apple' }, { id: 7, name: 'Honor' }]
            },

            {
                expanded: false, category_Name: "Laptops", sub_Category: [{ id: 8, name: 'Dell' }, { id: 9, name: 'MAC' }, { id: 10, name: 'HP' },
                { id: 11, name: 'ASUS' }]
            },

            {
                expanded: false, category_Name: "Computer Accessories", sub_Category: [{ id: 12, name: 'Pendrive' }, { id: 13, name: 'Bag' },
                { id: 14, name: 'Mouse' }, { id: 15, name: 'Keyboard' }]
            },

            {
                expanded: false, category_Name: "Home Entertainment", sub_Category: [{ id: 16, name: 'Home Audio Speakers' },
                { id: 17, name: 'Home Theatres' }, { id: 18, name: 'Bluetooth Speakers' }, { id: 19, name: 'DTH Set Top Box' }]
            },

            {
                expanded: false, category_Name: "TVs by brand", sub_Category: [{ id: 20, name: 'Mi' },
                { id: 21, name: 'Thomson' }, { id: 22, name: 'LG' }, { id: 23, name: 'SONY' }]
            },

            {
                expanded: false, category_Name: "Kitchen Appliances", sub_Category: [{ id: 24, name: 'Microwave Ovens' },
                { id: 25, name: 'Oven Toaster Grills (OTG)' }, { id: 26, name: 'Juicer/Mixer/Grinder' }, { id: 27, name: 'Electric Kettle' }]
            }
        ];

        this.state = {

            EmptyHomeTitle: "No patients",
            EmptyHomeDescription: "Looks like you havent added any Patient",


            AccordionData: this.props.route.params.resultOfMonth,

            resultOfMonth: this.props.route.params.resultOfMonth,
            isInternetOn: true,
            NoNetworkMsg: '',
            showSyncModal: false,
            searchText: 'sourabh',
            showalertModal: false,
            finalArrayAfterTabClick: [],
            dataIsPresent: true,
            isShowButton: false,
            startIndex: 0,
            EmptyHomeTitle: "No patients",
            EmptyHomeDescription: "Looks like you havent added any Patient, add from here",
            toolTipVisible: false,

            isConsulting: false,
            pendingCunsultingDescription: 'Khurana Clinic ˅ ',
            isPendingCunsulting: false,
            phonenumber: '',
            firstSearch: true,
            normalComplients: [],
            pastComplients: [],
            isSearchBoxShowing: false,
            dummyData: [],
            selectedComplients: [],
            newName: '',
            // searchText: "",
            //Toast States
            description: '',
            showToast: false,
            patientCount: '',

            toastImagePath: Images.Info,
            toastTextColor: "#fafbfe",
            toastBgColor: '#4D99E3',
            isLoading: false,
            exactSearch: 2,

        }

    }

    update_Layout = (item) => {

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        let array = [...this.state.AccordionData];
        let row_index = array.findIndex(arr => {
            if (arr[0].Name == item[0].Name) {
                return arr;
            }
        });
        array[row_index]['expanded'] = !array[row_index]['expanded'];
        array = array.map((arr, index) => {
            if (index != row_index) {
                array[index]['expanded'] = false;

            }
            return arr;
        })

        this.setState(() => {
            return {
                AccordionData: array
            }
        });
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack(null);
        return true;
    }



    updateData = (data) => {



    }


    viewReceptClick(clickFrom, itemData) {
        //  if (clickFrom == 'viewReceipt') {



        if (!itemData.PayType) {
            itemData.PayType = 1;
        }
        //this.props.screenProps.rootNavigation.navigate('PatientBillingReceiptContainer')
        this.props.navigation.navigate(
            'PatientBillingReceiptContainer',
            {
                updateData: this.updateData.bind(this),
                filterMonth: this.state.dateForShowData,
                receviedAmountData: {
                    receviedAmount:
                        itemData.ReimbursementAmount != null &&
                            itemData.ReimbursementAmount != undefined
                            ? itemData.ReimbursementAmount
                            : '',
                    platformFee:
                        itemData.TechnologyFee != null &&
                            itemData.TechnologyFee != undefined
                            ? itemData.TechnologyFee
                            : '',
                    transactionFee:
                        itemData.ConvenienceFee != null &&
                            itemData.ConvenienceFee != undefined
                            ? (itemData.ConvenienceFee / 100) * itemData.ConsultFees
                            : '',
                    totalAmount:
                        itemData.ConsultFees != null && itemData.ConsultFees != undefined
                            ? itemData.ConsultFees
                            : '',
                    transactionId: itemData.TransactionId ? itemData.TransactionId : '',
                    Name: itemData.Name ? itemData.Name : 'N/A',
                    WhenEntered: itemData.WhenEntered ? itemData.WhenEntered : '',
                    patient_Id: itemData.PatientId ? itemData.PatientId : '',
                    callfrom: clickFrom,
                    patientId: itemData.PatientCID ? itemData.PatientCID : '',
                    // patientId: itemData.PatientId,
                    IsPaid:
                        itemData.IsPaid != null && itemData.IsPaid != undefined
                            ? itemData.IsPaid
                            : '',
                    PayType:
                        itemData.PayType != null && itemData.PayType != undefined
                            ? itemData.PayType
                            : '',
                    IsRefunded:
                        itemData.Remarks && itemData.Remarks == 'clonedcancel'
                            ? 1
                            : itemData.IsRefunded,
                    IsCancelled:
                        itemData.Remarks && itemData.Remarks == 'clonedcancel'
                            ? null
                            : itemData.IsCancelled,

                    _id: itemData._id ? itemData._id : '',
                    PayLink: itemData.PayLink
                },
            },
        );

        // alert('sad')

    }


    componentDidMount() {




        multipleTapHandler.clearNavigator()

    }


    searchAction(text, callFrom) {

        this.searchText = text.trim();
        this.firstSearch = true
        this.startIndex = 0;

        this.setState({
            isRefreshData: true
        })


        let totalName = [];

        let newData = this.monthData.filter(item => {
            const itemData = `${item[0].Name.toUpperCase()}`;
            const itemData1 = `${item[0].PatientMobile.toUpperCase()}`;
            const itemData2 = `${item[0].TransactionId.toUpperCase()}`;


            const textData = text.toUpperCase();
            if (itemData.indexOf(textData) > -1) {
                return true
            } else if (itemData1.indexOf(textData) > -1) {
                return true
            }
            else if (itemData2.indexOf(textData) > -1) {
                return true
            }
            else {
                return false
            }

        });



        if (text == "") {
            this.setState({
                dummyData: this.monthData,
                isSearchBoxShowing: false

            })
        } else {
            this.setState({
                dummyData: newData,
                isSearchBoxShowing: true

            })
        }




    }

    rightImageOnClick() {


        if (this.state.isSearchBoxShowing) {

            this.searchText = "";
            this.firstSearch = true
            this.startIndex = 0;

        }
        this.setState({
            startIndex: 0,
            isSearchBoxShowing: this.state.isSearchBoxShowing ? false : !this.state.isSearchBoxShowing,
            searchText: "",
            dummyData: this.monthData,

        });
    }


    render() {

        this.monthData = this.props.route.params.resultOfMonth

        return (

            <View style={{ width: Dimensions.get('window').width, flex: 1 }} >

                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />


                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                    style={{
                        flex: 1, flexDirection: 'column',
                        backgroundColor: '#F6F9FA',

                    }} >

                    <View>
                        <PrescriptionHeader
                            {...this.props}

                            title={"SEARCH RECEIPT BY NAME, NUMBER, Txn ID"}
                            bgImage={null}
                            bgColor={'white'}
                            cursorColor={"#0869d8"}
                            tintColor={"#0b69d8"}

                            description={"Type here name, number and txn ID"}

                            titleColor={'#919191'}
                            descriptionColor={'black'}
                            placeholderTextColor={'black'}
                            placeTextColor={'black'}
                            placeholderTextSize={17}
                            descriptionSize={17}


                            leftImage={Black_back}
                            rightImage={Search_button_light_blue}
                            rightImageCross={this.searchText != "" ? ic_note_delete : null}
                            isSearchBoxShowing={this.state.isSearchBoxShowing}
                            type={5}
                            callFrom={'search'}
                            searchAction={(text, callFrom) => this.searchAction(text, callFrom)}
                            leftImageOnClick={() => this.handleBackButtonClick()}
                            rightImageOnClick={() => this.rightImageOnClick()}






                        />
                    </View>

                    {
                        this.searchText ? <View style={styles.headerContainer}>
                            <Text style={styles.cheader_container_Text}>{"Result for '" + this.searchText + "'"} </Text>


                        </View> : null

                    }

                    <View style={{ flex: 1, width: Dimensions.get('window').width }}>

                        <ScrollView>
                            {
                                this.state.isSearchBoxShowing ? this.state.dummyData.length > 0 ?

                                    this.state.dummyData.map((item, index) =>
                                    (
                                        <Expandable_ListView
                                            {...this.props}
                                            indicatorStyle={null}
                                            key={item[0].Name}
                                            viewReceptClick={(clickFrom, itemData) => this.viewReceptClick(clickFrom, itemData)}

                                            onClickFunction={this.update_Layout.bind(this, item, index)} item={item} />
                                    ))
                                    :
                                    <EmptyHome
                                        {...this.props}
                                        isLottie={true}
                                        imagePath={empty_PatientList}
                                        //imagePath={Images.ic_Video_Consultations_Empty_Icon}
                                        title={this.state.EmptyHomeTitle}
                                        colorCode={"red"}
                                        isShowButton={false}
                                        description={this.searchText == '' ? null : ("'" + this.searchText + "' as patient not found")}

                                    /> :
                                    this.monthData.map((item, index) =>
                                    (
                                        <Expandable_ListView
                                            key={item[0].Name}
                                            viewReceptClick={(clickFrom, itemData) => this.viewReceptClick(clickFrom, itemData)}

                                            onClickFunction={this.update_Layout.bind(this, item, index)} item={item} />
                                    ))
                            }

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1, borderWidth: 1, borderColor: 'red',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'white', width: Dimensions.get('window').width
    },
    headerContainer: {
        justifyContent: 'center',

        backgroundColor: '#fafafa',
    },


    iconStyle: {


        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        color: '#0065d7',
        fontSize: 12,
        alignSelf: 'flex-end',


    },

    sub_Category_Text: {
        textAlign: 'left',
        color: '#555454',
        fontFamily: 'NotoSans',
        fontSize: 12,
        paddingBottom: 10
    },

    category_Text: {
        textAlign: 'left',
        color: '#242424',
        fontFamily: 'NotoSans-Bold',
        fontSize: 18,
        paddingTop: 10
    },
    cheader_container_Text: {
        textAlign: 'left',
        color: '#4c4c4c',
        fontFamily: 'NotoSans',
        fontSize: 11,
        margin: 5,
        marginVertical: 10,

    },

    category_View: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 1,


    },

    Btn: {
        padding: 10,
        backgroundColor: '#FF6F00'
    }

});
