import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StatusBar, ScrollView, StyleSheet, Image, Animated, Alert, Dimensions } from 'react-native'

import { Button } from 'native-base'
import { ic_clock, ic_black_back, ic_Add_Clinic_Button, democlose, SuggestLab_Pink_btn, Pinch_to_zoom, Click_Sections } from '../../constants/images'
import { setAttachmentData, resetAttachmentData, setMData } from "../../actions/attachment";
import { get_suggestions } from "../../actions";

import LottieView from 'lottie-react-native';
import { setSuggestionData, setPrescription } from '../../actions/patientVisit';
import { setWebdata } from '../../actions/previewSettings';
import ToastComponent from '../Toast/toastComponent'
import Images from '../../Theme/Images'
import Toast, { DURATION } from 'react-native-easy-toast'
import { setPatientVisitKeyData, setDiagnosis, setAdditionalAssesstment } from "../../actions/patientVisit";
import { connect } from 'react-redux'
import { WebView } from 'react-native-webview';

import { generateGuid } from '../../commonmethods/common';
import multipleTapHandler from '../MultiTapHandle';
var rxloading = require("../../../assets/Json/Rx-Loader.json")
import { editPatentDetails, setPatientHabits, setPatientHistory, updatePatientDetails, setPatientData, addPatientAllergy, updatePatientOBHistory } from
    '../../actions/patientProfie';
import { isStagging, staging, prod } from "../../../app.json";
import { Gpal } from '../../commonmethods/common';

var prescrip_loader_4 = require("../../../assets/Json/Prescription-Loader-4.json")



import { Tooltip_Edit_Icon } from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';
import { calculateAge } from '../../commonmethods/common';
const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.2, maximum-scale=0.4, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`
class PrescriptionPreviewBody extends Component {
    constructor(props) {
        super(props)

        this.DisplayLabel = {
            "ChiefComplaints": "Chief Complaints",
            "History": "History",
            "Findings": "Findings",
            "Investigation": "Investigation",
            "LabTest": "LabTest",
            "Notes": "Notes",
            "Diagnosis": "Diagnosis",
            "Prescription": "Prescription",
            "DisplayGenericName": "Display Generic Name",
            "Advice": "Advice",
            "Followup": "Followup",
            "DoctorDetails": "Doctor Details",
            "DigitalImageSignature": "Digital Image Signature",
        };
        this.state = {
            loading: true,
            webVal: '',
            key: 1,
        }
        this.webdata = [],
            this.guid = "";
    }
    showRxLoader() {
        this.setState({
            loading: true
        }, () => {
            this.resetWebViewToInitialUrl();
        })
    }
    resetWebViewToInitialUrl = () => {
        this.setState({
            key: this.state.key + 1
        });
    };
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    componentDidMount() {
        multipleTapHandler.clearNavigator()
        this.props.onRef(this);

        this.guid = generateGuid();
    }
    sendMessageToWebView = () => {

        //alert("Onload end called");
        this.webdata = [];
        let data = [];
        this.props.setWebdata(data);


        let { patientDetails } = this.props.patientvisit;
        let p_age = calculateAge(patientDetails.CommonDetails.DOB, false);
        let PatientDetails = {
            "id": this.props.patientvisit.Commonid,
            "FullName": patientDetails.CommonDetails.FullName,
            "Age": p_age.value.toString() + " " + p_age.units,
            "Height": patientDetails.CommonDetails.BodyDetails.Height,
            "Weight": patientDetails.CommonDetails.BodyDetails.Weight,
            "BMI": patientDetails.CommonDetails.BodyDetails.BMI,
            "Mobile": patientDetails.Mobile,
            "Gender": patientDetails.CommonDetails.Gender,
            "ReferralDrrName": patientDetails.CommonDetails.Referredby,
            "PatientId": this.props.patientvisit.patientId,
            "EmailAddress": patientDetails.CommonDetails.EmailAddress,
            "Address": patientDetails.CommonDetails.Address
        };

        let prescription = JSON.parse(JSON.stringify(this.props.patientvisit.prescription));
        // prescription.patientDetails =PatientDetails;
        prescription.PatientDetails = PatientDetails;
        prescription.Allergy = patientDetails.CommonDetails.Allergy;
        prescription.FamilyHistory = patientDetails.CommonDetails.FamilyHistory;
        prescription.PatientHabits = patientDetails.CommonDetails.PatientHabits;
        prescription.PersonalHistory = patientDetails.CommonDetails.PersonalHistory;
        prescription.Gpal = patientDetails.CommonDetails.Gpal;





        let medicines = prescription.PrescriptionList.map(med => {
            // med.Remarks = this.props.createRemarks(med, prescription.Language);

            return med;

        });
        prescription.PrescriptionList = medicines;
        medicines = null;

        prescription.PaperSettings = this.props.previewReducer.templateData.PaperSettings
        prescription.PaperSettings.header = this.props.doctorProfile.showHeader ? prescription.PaperSettings.header == 0 ? 1 : prescription.PaperSettings.header : 0;
        prescription.PaperSettings.footer = this.props.doctorProfile.showFooter ? prescription.PaperSettings.footer == 0 ? 1 : prescription.PaperSettings.footer : 0;
        //  prescription.WhenEntered = new Date().toISOString();
        if (this.props.doctorProfile.DoctorData.DisplayPreferences) {
            prescription["DisplayPreferences"] = this.props.doctorProfile.DoctorData.DisplayPreferences;
        }

        if (prescription.Type == "Ophthalmologist") {
            prescription["Ophthalmologist"] = this.props.opthal.selecteddata
        }

        this.props.setPrescription(prescription);


        let medicineList = prescription.PrescriptionList;
        medicineList = medicineList.map(drug => {
            if (drug.StartFrom.toLowerCase() == "Today".toLowerCase()) {
                drug.StartFrom = "";
            }
            return drug;
        })
        prescription.PrescriptionList = [...medicineList];
        medicineList = null;
        this.props.WebViewRef.current.injectJavaScript(`window.WebViewBridge.onMessage(` + JSON.stringify(prescription) + `)`);
        this.setState({ loading: false })
        // this.webview.injectJavaScript('alert("Injected JS ")');
    };

    _onMessage = (val) => {


        if (!val)
            return false
        if (!val.data)
            return false

        if (this.webdata.length >= 4) {
            this.webdata = [];
        }
        this.webdata.push(val.data)
        this.props.setWebdata(this.webdata)
        let type = val.data, suggesticon, suggestname;
        let { Srno, displayname, defaultlabel, subtext, patientname, mdata,
            ChiefComplaints, Findings, Investigation, Diagnosis, navigation,
            RecommendedLabTest, Advice, setPatientVisitKeyData, setAttachmentData,
            setAdditionalAssesstment, patientvisit, suggestscreen, Pharmacy, colorCode
        } = this.props;
        let nextscreenname = '';

        multipleTapHandler.clearNavigator();
        var isActionAble = this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
            this.props.doctorProfile.DoctorData.RoleId == 3;
        switch (type) {
            case 'ChiefComplaints':
                type = 'ChiefComplaints'
                displayname = 'ChiefComplaints'
                nextscreenname = 'ChiefComplaintContainer'
                defaultlabel = 'Suggested'
                mdata = ChiefComplaints || []
                Srno = 8
                suggesticon = null
                suggestname = ''
                multipleTapHandler.multitapFunctionHandler(nextscreenname, () => {

                })
                multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen), nextscreenname)
                break;
            case 'Findings':
                type = 'Findings'
                nextscreenname = 'FindingsContainer'
                displayname = 'Findings'
                defaultlabel = 'Suggestions'
                subtext = "what are " + patientname + "'s " + displayname + "? "
                mdata = Findings || []
                Srno = 9
                suggesticon = null
                suggestname = ''
                colorCode = "#0ab2b2"
                multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen, colorCode), nextscreenname)
                break;
            case 'Investigation':
                type = 'Investigation'
                nextscreenname = 'InvestigationContainer'
                displayname = 'Investigation'
                defaultlabel = 'Suggested'
                subtext = "what are " + patientname + " " + displayname + "? "
                mdata = Investigation || []
                Srno = 10
                suggesticon = null
                suggestname = ''
                suggestscreen = ''
                colorCode = "#ab47bc"

                multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen, colorCode), nextscreenname)
                break;
            case 'Notes':
                type = 'Notes'
                nextscreenname = 'PatientNotes'
                displayname = 'Notes'

                multipleTapHandler.multitap(() => this.props.navigation.push('PatientNotes', { previous_screen: 'PrintPreview' }), "PatientNotes")
                // multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen, colorCode), nextscreenname)
                break;
            case 'Diagnosis':
                type = 'Diagnosis'
                nextscreenname = 'DiagnosisContainer'
                displayname = 'Diagnosis'
                defaultlabel = 'Suggested'
                subtext = "what are " + patientname + " " + displayname + "? "
                mdata = Diagnosis || []
                Srno = 12
                suggesticon = null
                suggestname = ''
                suggestscreen = ''
                colorCode = "#ff7043"

                multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen, colorCode), nextscreenname)
                break;
            case 'LabTest':
                if (isActionAble) {
                    type = 'RecommendedLabTest'
                    displayname = 'Lab Test'
                    nextscreenname = 'RecommendedLabTestContainer'
                    defaultlabel = 'Suggested'
                    subtext = "RECOMMEND LAB TESTS"
                    mdata = RecommendedLabTest || []
                    Srno = 11
                    suggesticon = SuggestLab_Pink_btn
                    suggestname = 'Suggest Laboratory'
                    suggestscreen = 'LaboratoryContainer'
                    multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen), nextscreenname)
                }
                break;
            case 'RecommendedLabTest':
                if (isActionAble) {
                    type = 'RecommendedLabTest'
                    displayname = 'Lab Test'
                    nextscreenname = 'RecommendedLabTestContainer'
                    defaultlabel = 'Suggested'
                    subtext = "RECOMMEND LAB TESTS"
                    mdata = RecommendedLabTest || []
                    Srno = 11
                    suggesticon = SuggestLab_Pink_btn
                    suggestname = 'Suggest Laboratory'
                    suggestscreen = 'LaboratoryContainer'
                    this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen)

                } break;
            case 'Advice':
                if (isActionAble) {
                    type = 'Advice'
                    displayname = 'Advice'
                    nextscreenname = 'AdviceContainer'
                    defaultlabel = 'Referred Doctor'
                    subtext = "ANY ADVICE FOR " + patientname + "?"
                    mdata = Advice || []
                    Srno = 13
                    suggesticon = SuggestLab_Pink_btn
                    suggestname = 'Refer to Specialist'
                    suggestscreen = 'SpecialistContainer'
                    multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen), nextscreenname)
                }
                break;
            case 'Followup':
                if (isActionAble) {

                    type = 'Followup'
                    displayname = 'Followup'
                    nextscreenname = 'FollowUpContainer'
                    defaultlabel = 'Suggested'
                    subtext = "ANY Followup FOR " + patientname + "?"
                    mdata = Advice || []
                    Srno = 13
                    multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, null, '', ''), nextscreenname)
                }
                break;
            case 'Ophthalmologist':
                if (isActionAble) {
                    this.webdata = [];
                    this.props.setWebdata(this.webdata);
                    multipleTapHandler.multitap(() => this.props.navigation.push("OpthalHome", { previous_screen: 'PrintPreview' }), "OpthalHome");
                }
                break;
            case 'Opthalmologist':
                if (isActionAble) {
                    this.webdata = [];
                    this.props.setWebdata(this.webdata);
                    multipleTapHandler.multitap(() => this.props.navigation.push("OpthalHome", { previous_screen: 'PrintPreview' }), "OpthalHome");

                }
                break;
            case 'Prescription':
                if (isActionAble) {
                    this.props.resetMedicine();
                    type = 'Pharmacy'
                    displayname = 'Pharmacy'
                    //nextscreenname = 'ListMedication'
                    nextscreenname = this.props.patientvisit.prescription.PrescriptionList.length > 0 ? 'ListMedication' : 'SelectMedication'
                    defaultlabel = 'Suggested'
                    subtext = "RECOMMEND PHARMACY"
                    mdata = Pharmacy || []
                    Srno = 11
                    suggesticon = SuggestLab_Pink_btn
                    suggestname = 'Suggest Pharmacy'
                    suggestscreen = 'LaboratoryContainer'
                    multipleTapHandler.multitap(() => this.redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen), nextscreenname)
                }
                break;
            // this.props.navigation.navigate('ListMedication');
            // break;

            case 'Patient':
                this.webdata = [];
                this.props.setWebdata(this.webdata);

                let patientDetails = { ...this.props.patientvisit.patientDetails };
                let gpal = null;
                if (patientDetails.CommonDetails.Gender == "Female") {
                    if (patientDetails.CommonDetails.Gpal) {
                        gpal = { ...Gpal, ...patientDetails.CommonDetails.Gpal };
                    }
                    else {
                        gpal = { ...Gpal }
                    }


                }
                else {
                    gpal = null;
                }
                patientDetails.CommonDetails.Gpal = gpal ? { ...gpal } : null;
                this.props.updatePatientOBHistory(patientDetails.CommonDetails.Gender)
                let allery = patientDetails.CommonDetails.Allergy;
                let habits = patientDetails.CommonDetails.PatientHabits;
                let selfHistory = patientDetails.CommonDetails.PersonalHistory;
                let familyHistory = patientDetails.CommonDetails.FamilyHistory;
                let history = [];
                selfHistory = selfHistory.map(item => {

                    item["Relation"] = "Self";
                    return item;


                });
                if (allery.length == 0) {
                    allery = [
                        {
                            "Environmental": "",
                            "Food": "",
                            "Drugs": "",
                            "Other": ""
                        }
                    ]
                }
                history = [...selfHistory, ...familyHistory];
                this.props.editPatentDetails(true);
                this.props.setPatientData(patientDetails);
                this.props.addPatientAllergy(allery);
                this.props.setPatientHabits(habits);
                this.props.setPatientHistory(history);
                //  multipleTapHandler.multitap(() => this.props.navigation.navigate('AddPatientContainer'), "AddPatientContainer");

                // break;


                multipleTapHandler.multitap(() => this.props.navigation.push("AddPatientContainer", { previous_screen: 'PrintPreview' }), "AddPatientContainer");
                break;


            case 'Logo':
                if (isActionAble) {
                    type = "Logo"
                    this.webdata = [];
                    this.props.setWebdata(this.webdata);

                    this.props.dataFromChild(type);
                }
                break

            case 'Signature':
                if (isActionAble) {
                    let DisplayLabel = JSON.parse(JSON.stringify(this.props.doctorProfile.DoctorData.DisplayLabel));
                    DisplayLabel = { ...this.DisplayLabel, ...DisplayLabel };
                    this.props.tempData["DisplayLabel"] = DisplayLabel;
                    this.props.tabDataStore(this.props.tempData);


                    type = "Signature"
                    this.webdata = [];
                    this.props.setWebdata(this.webdata);

                    this.props.dataFromChild(type);
                }
                break
            default:
                type = ''
                break;
            //     type = 'ChiefComplaints'
            //     displayname = 'Complaints'
            //     nextscreenname = 'ChiefComplaintContainer'
            //     mdata = ChiefComplaints || []
            //     Srno = 8
            //     defaultlabel = 'Past Complaints'
            //     subtext = "what are " + patientname + " " + displayname + "? "
        }




    }

    redirectSpecific(nextscreenname, type, displayname, defaultlabel, subtext, Srno, mdata, suggesticon, suggestname, suggestscreen, colorCode) {
        this.webdata = [];
        let { navigation, setPatientVisitKeyData, setAttachmentData } = this.props;
        setPatientVisitKeyData({ [type]: mdata });
        setAttachmentData({
            type, "DataType": '',
            "Graph": '',
            "Unit": '',
            "Upload": [],
            "Name": '',
            "Value": '', mdata, Srno, subtext, displayname, defaultlabel, suggesticon, suggestname, suggestscreen, colorCode
        })
        this.webdata = [];
        this.props.setWebdata(this.webdata);
        navigation.push(nextscreenname, { previous_screen: 'PrintPreview' })
    }

    render() {



        let prescription = JSON.parse(JSON.stringify(this.props.patientvisit.prescription));
        prescription.PaperSettings.header = this.props.doctorProfile.showHeader ? prescription.PaperSettings.header == 0 ? 1 : prescription.PaperSettings.header : 0;
        prescription.PaperSettings.footer = this.props.doctorProfile.showFooter ? prescription.PaperSettings.footer == 0 ? 1 : prescription.PaperSettings.footer : 0;
        //prescription.WhenEntered = new Date().toISOString();

        let header = this.props.url ? (this.props.certificateSettings ? this.props.certificateSettings.PaperSettings.header : 1) : prescription.PaperSettings.header
        let body = this.props.url ? (this.props.certificateSettings ? this.props.certificateSettings.PaperSettings.body : 1) : prescription.PaperSettings.body
        let footer = this.props.url ? (this.props.certificateSettings ? this.props.certificateSettings.PaperSettings.footer : 1) : prescription.PaperSettings.footer

        let { anim, onFabStateChange, onMenuStateChange, dropdownMenu, rxid, WebViewRef } = this.props;
        let url_online = (isStagging ? staging.printTemplate : prod.printTemplate) + 'template/report.html?' + 'HeaderType=' + header + '&BodyType=' + body + '&FooterType=' + footer + '&print=1&patientid=' + rxid + "&shownavs=1&" + "shownavs=1&guid=" + this.guid;
        let url_offline = (isStagging ? staging.printTemplate : prod.printTemplate) + "template/report.html?" + 'HeaderType=' + header + '&BodyType=' + body + '&FooterType=' + footer + "&print=1" + "&offline=1&shownavs=1&guid=" + this.guid;

        if (prescription.Type == "Ophthalmologist") {
            url_offline = (isStagging ? staging.printTemplate : prod.printTemplate) + "template/specialization/Ophthalmologist.html?" + 'HeaderType=' + header + '&BodyType=' + body + '&FooterType=' + footer + "&print=1" + "&offline=1&shownavs=1&guid=" + this.guid;
            url_online = (isStagging ? staging.printTemplate : prod.printTemplate) + 'template/specialization/Ophthalmologist.html?' + 'HeaderType=' + header + '&BodyType=' + body + '&FooterType=' + footer + '&print=1&patientid=' + rxid + "&shownavs=1" + "&shownavs=1&guid=" + this.guid;
        }


        return (

            <View style={{ flex: (this.props.type == 2 ? 0.84 : 0.93), backgroundColor: '#cdcdcd' }}>


                {onMenuStateChange && !this.props.onFabStateChange ?
                    <View style={styles.dropdownMenu}>{dropdownMenu}</View> : null}
                {
                    this.state.loading ?
                        <View style={{
                            justifyContent: 'center', alignItems: 'center',
                            width: Dimensions.get('screen').width
                        }}>
                            <LottieView
                                style={{ width: Dimensions.get('window').width, height: '100%', justifyContent: 'center', alignItems: 'center', }}
                                source={prescrip_loader_4} autoPlay={true} ref={animation => {
                                    this.animation = animation;
                                }} />
                        </View>
                        : null
                }

                <WebView
                    ref={WebViewRef}
                    androidLayerType="software"
                    key={this.state.key}
                    scalesPageToFit={true}
                    source={{ uri: (this.props.url ? this.props.url : url_offline) }}
                    onMessage={(event) => this._onMessage(event.nativeEvent)}
                    scrollEnabled={true}
                    onLoadEnd={() => { this.props.url ? null : this.sendMessageToWebView() }}
                    //onMessage={event => event.nativeEvent}

                    style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
                />







                {/* //success toast */}
                {
                    this.props.showToast ?
                        this.refs.toast.show(


                            <ToastComponent
                                {...this.props}

                                textColorCode={this.props.toastTextColor}
                                imagePath={this.props.toastImgPath}
                                description={this.props.description}

                            />

                            , 1500) : null
                }
                {/* //error toast */}



                <Toast

                    position='bottom'
                    style={{
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%', bottom: 130,

                        backgroundColor: this.props.toastBgColor, borderRadius: 15
                    }}
                    ref="toast" />

            </View>



        )
    }
}
const mapStateToProps = state => ({

    patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
    auth: state.auth,
    previewReducer: state.previewReducer,
    patientvisit: state.patientvisit,
    patientProfile: state.patientProfile,
    subtext: state.attachment.subtext,
    Name: state.attachment.Name,
    Unit: state.attachment.Unit,
    Srno: state.attachment.Srno,
    Graph: state.attachment.graphtype,
    DataType: state.attachment.DataType,
    Value: state.attachment.Value,
    Upload: state.attachment.attachments,
    mdata: state.attachment.mdata,
    colorCode: state.attachment.colorCode,

    rxid: state.patientvisit.prescription._id,
    ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
    Findings: state.patientvisit.prescription.Findings,
    Advice: state.patientvisit.prescription.Advice,

    Investigation: state.patientvisit.prescription.Investigation,
    Diagnosis: state.patientvisit.prescription.Diagnosis,
    RecommendedLabTest: state.patientvisit.prescription.RecommendedLabTest,
    certificateSettings: state.certificates.certificateSettings,
    printPreviewPinch: state.tooltip.toolTipStatus.printPreviewPinch,
    printPreviewAddSection: state.tooltip.toolTipStatus.printPreviewAddSection,
    opthal: state.opthal,



});

const mapDispatchToProps = dispatch => ({

    setAttachmentData: (data) => dispatch(setAttachmentData(data)),
    setMData: (data) => dispatch(setMData(data)),
    setWebdata: (data) => dispatch(setWebdata(data)),
    setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
    resetAttachmentData: () => dispatch(resetAttachmentData()),
    get_suggestions: (doctorId, searchArray) => dispatch(get_suggestions(doctorId, searchArray)),
    setSuggestionData: (prescription) => dispatch(setSuggestionData(prescription)),
    setAdditionalAssesstment: (id, data) => dispatch(setAdditionalAssesstment(id, data)),
    setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),

    updatePatientOBHistory: (patientGender) => dispatch(updatePatientOBHistory(patientGender)),
    setPatientHabits: (habits) => dispatch(setPatientHabits(habits)),
    setPatientHistory: (history) => dispatch(setPatientHistory(history)),
    setPatientData: (data) => dispatch(setPatientData(data)),
    addPatientAllergy: (allery) => dispatch(addPatientAllergy(allery)),
    editPatentDetails: (val) => dispatch(editPatentDetails(val)),


})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrescriptionPreviewBody)

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
