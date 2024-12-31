import React from 'react';
import { View, TouchableOpacity, StatusBar, Text, Image, BackHandler, Dimensions } from 'react-native';
import { Container } from 'native-base';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { setCertificateType, setPickerValue, setComponentData, setPaperSettings, createCertificate } from '../../actions/certificates';
import { Black_back, ic_Add_Clinic_Button, ic_med_info, ic_med_pharam, ic_drag, icon_Reemove_Button } from '../../constants/images';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font'
import { calculateAge } from '../../commonmethods/common';
import CertificateForm from '../../components/Certificate/CertificateForm';
class CertficateInputForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {

        }
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }


    handleBackButtonClick() {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack();
        return true;
    }


    render() {
        let age = calculateAge(this.props.patientvisit.patientDetails.CommonDetails.DOB, false)
        return (
            <View style={{
                flex: 1, paddingTop: Platform.OS == "android" ?
                    this.props.databaseContext.statusBarHeight || 23 : this.props.databaseContext.statusBarHeight || 37, backgroundColor: '#ffffff'
            }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
                {/** Header */}
                <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', paddingVertical: 2, width :Dimensions.get('window').width }}>
                    <TouchableOpacity
                        onPress={() => this.handleBackButtonClick()}
                        style={{ padding: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                        <Image style={{
                            resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                        }} source={Black_back} />


                    </TouchableOpacity>
                    {/*Title*/}
                    <View style={{ justifyContent: 'center', marginVertical: 10 }}>
                        <Text style={{ fontSize: 22, fontFamily: NotoSans, color: '#636363' }}>{this.props.certificates.selectedCertificate.name}</Text>
                        <Text style={{ fontFamily: NotoSans, fontSize: 12, color: '#919191', marginBottom: 5 }}>{this.props.patientvisit.patientDetails.CommonDetails.FullName + " | " + age.value + " " + age.units + " | " + this.props.patientvisit.patientDetails.CommonDetails.Gender}</Text>
                    </View>
                    {/*Title Ends*/}

                </View>
                <View
                    style={{
                        width :Dimensions.get('window').width,
                        height: 1,
                       
                        backgroundColor: "#cdcdcd",
                    }}
                />
                {/**Header Ends */}
                <CertificateForm {...this.props}></CertificateForm>

            </View>
        )
    }
}


const mapStateToProps = state => ({

    patientvisit: state.patientvisit,
    doctorProfile: state.doctorProfile,
    certificates: state.certificates

});


const mapDispatchToProps = dispatch => ({
    setCertificateType: (certificate) => dispatch(setCertificateType(certificate)),
    setPickerValue: (key, value) => dispatch(setPickerValue(key, value)),
    setComponentData: (data) => dispatch(setComponentData(data)),
    setPaperSettings: (setting) => dispatch(setPaperSettings(setting)),
    createCertificate: (certificate) => dispatch(createCertificate(certificate))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(CertficateInputForm));