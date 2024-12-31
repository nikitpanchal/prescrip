//   code by ravi
import React, { Component } from "react"
import { View, TouchableOpacity, Image, StatusBar, Dimensions, BackHandler, Alert, Keyboard } from 'react-native'
import { Container, Text, Input, } from 'native-base'
import BankDetailComponent from '../../components/BankDetailComponent/BankDetailComponent'
import Images from '../../Theme/Images'
import { Call_white, ic_Teal_BG_578, lefticon, } from '../../constants/images';
import { connect } from "react-redux";
import HeaderData from '../../components/Header/header'
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { isValidIfsc, isEmailValid } from "../../commonmethods/validation";

import { bank_details } from "../../actions";

import { setDoctorData } from '../../actions/doctorProfile'


class BankDetailContainer extends Component {

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            description: '',
            showToast: false



        }







    }


    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    leftImageOnClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()
    }

    RightImageOnClick() {
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }


    submitClick(acc, reacc, ifsc_number, emailId) {
        // if (this.props.route.params && this.props.route.params.callAfterAdd) {
        //     this.props.navigation.goBack();
        //     this.props.route.params.callAfterAdd();

        // }

        // return;


        Keyboard.dismiss();
        let isnumacc = /^\d+$/.test(acc);
        let isnumreacc = /^\d+$/.test(reacc)

        if (acc && reacc && ifsc_number && emailId) {
        }
        else {
            // Toast.show({ text: 'Please enter all fields', duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            this.setState({
                showToast: true,
                description: "Please enter all fields"
            })

            setTimeout(() => {
                this.setState({
                    showToast: false
                })

            }, 2000);

            return;
        }


        if (acc != reacc) {
            //Toast.show({ text: 'Entered Successfully', duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            //this.props.navigation.navigate('DigitalImageSignature');

            // Toast.show({ text: 'Account not matched', duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            this.setState({
                showToast: true,
                description: "Account not matched"
            })

            setTimeout(() => {
                this.setState({
                    showToast: false
                })

            }, 2000);

            return;

        }


        if (!isnumacc || !isnumreacc) {
            // Toast.show({ text: 'Please enter valid account number', duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            this.setState({
                showToast: true,
                description: "Please enter valid account number"
            })

            setTimeout(() => {
                this.setState({
                    showToast: false
                })

            }, 2000);
            return;
        }


        let check = isValidIfsc(ifsc_number, "IFSC number");
        if (!check.isvalid) {

            // Toast.show({ text: check.msg, duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            this.setState({
                showToast: true,
                description: check.msg
            })

            setTimeout(() => {
                this.setState({
                    showToast: false
                })

            }, 2000);

            check = null;

            return;
        }




        let check1 = isEmailValid(emailId.trim(), "Email Id");
        if (!check1.isvalid) {

            // Toast.show({ text: check.msg, duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
            this.setState({
                showToast: true,
                description: check1.msg
            })

            setTimeout(() => {
                this.setState({
                    showToast: false
                })

            }, 2000);

            check1 = null;

            return;
        }


        check = null;


        let BankDetails = {
            "AccountNo": acc,
            "IFSC": ifsc_number,
            "emailId": emailId.trim()
        };
        this.props.bank_details(BankDetails, this.props.doctorProfile.DoctorData._id).then((response) => {
            if (response.payload.data.status == 1) {
                let data = this.props.doctorProfile.DoctorData;
                data.BankDetails = response.payload.data.BankDetails;
                this.props.setDoctorData(data);
                // Toast.show({ text: 'Bank details updated scussfully', duration: 2000, style: { borderRadius: 20, bottom: 50 }, textStyle: { textAlign: 'center' } })
                this.setState({
                    showToast: true,
                    description: 'Bank details updated successfully '
                })


                setTimeout(() => {
                    this.setState({
                        showToast: false
                    }, () => {

                        if (this.props.route.params && this.props.route.params.callAfterAdd) {
                            if (this.props.route.params.conItem) {
                                this.props.route.params.callAfterAdd(this.props.route.params.conItem);
                            }
                            else {
                                this.props.route.params.callAfterAdd();
                            }
                        }
                        this.props.navigation.goBack();
                    })

                }, 2000);

            }
            else {
                Alert.alert("Prescrip", response.payload.data.msg)
                this.setState({
                    loading: false
                })
            }
        })

        //alert('all ok')

    }


    render() {



        const acc_number = this.props.doctorProfile.DoctorData.BankDetails ? this.props.doctorProfile.DoctorData.BankDetails.AccountNo : '';
        const ifsc = this.props.doctorProfile.DoctorData.BankDetails ? this.props.doctorProfile.DoctorData.BankDetails.IFSC : '';
        const emailId = this.props.doctorProfile.DoctorData.BankDetails ? this.props.doctorProfile.DoctorData.BankDetails.ContactEmail : this.props.doctorProfile.DoctorData.DoctorEmail ? this.props.doctorProfile.DoctorData.DoctorEmail : '';

        return (
            <View style={{ flex: 1 }}>

                <View style={{
                    flexdirection: 'column', flex: 1, backgroundColor: '#fafafa'
                }}>


                    <View>

                        <HeaderData
                            {...this.props}
                            bgImage={ic_Teal_BG_578}
                            description={"Provide your" + "\n" + "Banking details"}
                            leftImage={lefticon}
                            type={2}
                            leftImageOnClick={() => this.leftImageOnClick()}
                            rightImageName={"Help"}
                            RightImageOnClick={() => this.RightImageOnClick()}

                        />
                    </View>


                    <View style={{ position: 'relative', width: Dimensions.get('window').width, borderTopLeftRadius: 25, 
                    borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, 
                    paddingVertical: 10, backgroundColor: '#fafafa', paddingHorizontal: 15, }}>

                    </View>

                    <BankDetailComponent
                        {...this.props}
                        submitClick={(acc_number, confirm_number, ifsc_number, emailId) => this.submitClick(acc_number, confirm_number, ifsc_number, emailId)}
                        acc_number={acc_number}
                        ifsc={ifsc}
                        emailId={emailId}
                        showToast={this.state.showToast}
                        description={this.state.description}
                    />



                </View>
            </View>
        )
    }

}
const mapStateToProps = state => ({
    auth: state.auth,

    doctorProfile: state.doctorProfile


});


const mapDispatchToProps = dispatch => ({
    bank_details: (BankDetails, DoctorData_id) => dispatch(bank_details(BankDetails, DoctorData_id)),
    setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),



});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BankDetailContainer);