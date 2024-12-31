import React, { Component } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView,StatusBar } from 'react-native'
import { Toast } from 'native-base'
import { ic_clock, ic_black_back, ic_delete_time, ic_close_button, ic_save_button } from '../../constants/images'
import { onTemplateSave } from '../../actions/previewSettings'
import PrescriptionPreviewHeader from '../../components/PrescriptionPreviewComponent/PrescriptionPreviewHeader'
import PrescriptionPreviewFooter from '../../components/PrescriptionPreviewComponent/PrescriptionPreviewFooter'
import PrescriptionPreviewBody from '../../components/PrescriptionPreviewComponent/PrescriptionPreviewBody'
import { connect } from 'react-redux'
import Images from '../../Theme/Images'


class PrescriptionPreviewSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            templateData: {
                "PaperSettings": {
                    "Margin": [
                        "10",
                        "10",
                        "10",
                        "10"
                    ],
                    "papername": "A4"
                    ,
                    "TemplateFontSize": "14",
                    "header": 1,
                    "footer": 1,
                    "body": 1
                },
                "Language": "English",
                "DisplayLabel": {
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
                },
                "DisplayPreferences":["Chief Complaints",
                "History",
                "Findings",
                "Investigation",
                "LabTest",
                "Diagnosis",
                "Notes",
                "Prescription",
                "Display Generic Name",
                "Advice",
                "Followup",
                "Doctor Details",
                "Digital Image Signature"]
            }
        }
    }

    leftImageOnClick() {
        this.props.navigation.goBack()
    }

    save() {
        let { previewReducer, onTemplateSave, navigation, rxid} = this.props

        let arr = Object.keys(previewReducer.templateData).length > 0 ? previewReducer.templateData : this.state.templateData
        onTemplateSave(rxid, arr).then(({payload, error}) => {
            if(error){
                Toast.show({ text: 'Some error occured', duration: 1000, position: 'bottom' })
            } else if(payload.data.status == 2000) {
                Toast.show({ text: 'Settings saved successfully ', duration: 1000, position: 'bottom' })
                navigation.pop();
            }else{
                Toast.show({ text: payload.data.message, duration: 1000, position: 'bottom' })
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
   
          

                {/*  header component for prescription preview */}
                <PrescriptionPreviewHeader {...this.props}
                    parentClick={() => alert('fds')}
                    title={"Interactive Preview Settings"}
                    subtitle={this.props.patientname+"'s"+" Prescription"}
                    leftImage={ic_close_button}
                    leftImageClick={() => this.leftImageOnClick()}
                    rightImage={ic_save_button}
                    rightImageClick={() => this.save()}
                />

                {/*  body component for prescription preview */}
                <PrescriptionPreviewBody {...this.props} type={2} />
                <PrescriptionPreviewFooter {...this.props} type={2} />
        
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    patientvisit: state.patientvisit,
    patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
    doctorProfile: state.doctorProfile,
    previewReducer: state.previewReducer,
    rxid : state.patientvisit.prescription._id
});

const mapDispatchToProps = dispatch => ({
 
    onTemplateSave: (doctorid, data) => dispatch(onTemplateSave(doctorid, data))
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrescriptionPreviewSetting)
