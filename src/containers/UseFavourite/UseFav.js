import React, { Component } from 'react';
import { Container, Header, Content, Thumbnail, Text } from 'native-base';

import PrescriptionLoader from "../../components/Loading/prescriptionLoader";
import { favourites, setPrescription, setPrintClickCount, createRefill, setSuggestionPatientData } from '../../actions/patientVisit';
import { connect } from "react-redux";
import FlatListForPrescription from '../../components/FlatListForPrescription'

import { empty_PatientList, } from '../../constants/images'
import EmptyHome from '../../components/EmptyHome/EmptyHome'
import moment from 'moment';
import { setOpthalListData, setOpthalData, AddRecents, resetOpthalData } from '../../actions/opthal';
import { get_suggestions } from "../../actions";
import { offline_def_prescription, calculateAge } from '../../commonmethods/common';
import { element } from 'prop-types';
import { deletePatientVisit } from '../../actions/previewSettings'
import { Alert, Dimensions, View } from 'react-native';

import ToastComponent from '../../components/Toast/toastComponent'
import Toast, { DURATION } from 'react-native-easy-toast'
import Images from '../../Theme/Images'

class MyFav extends Component {

  constructor(props) {
    super(props);

    this.state = {
      invalid: true,
      loading: false,
      isRefresh: true,
      favList: [],
      dataIsPresent: true,
      EmptyHomeTitle: "No Prescription",
      isShowButton: false,
      text: '',
      filterdata: [],
      //Toast States
      description: '',
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: '#4D99E3',
    }
  }

  componentDidMount() {
    this.setVCDPage()
  }


  setVCDPage() {
    //this.props.doctorProfile.DoctorData._id
    this.props.favourites(this.props.doctorProfile.DoctorData._id).then((payload) => {
      var data = payload.payload.data;
      if (data.status == 1) {


        this.setState({
          invalid: true,
          loading: false,
          isRefresh: true,
          favList: data.data,
          filterdata: data.data,
          dataIsPresent: data.data.length > 0 ? true : false
        })


      }
      else {
        this.setState({
          invalid: true,
          loading: false,
          isRefresh: true,
          favList: [],
          dataIsPresent: false
        })

      }
    });

  }





  //set sugg data

  setSuggSugg(callFrom, patient_details) {


    this.props.get_suggestions(patient_details).then(({ payload, error }) => {
      var data = payload.data;

      if (error) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate('PrescriptionPreviewHome', { refill: true });

        setTimeout(() => {
          this.setState({
            loading: false
          })
        }, 2000);
      }
      else if (data.status == 0) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate('PrescriptionPreviewHome', { refill: true });

        setTimeout(() => {
          this.setState({
            loading: false
          })
        }, 2000);

      } else if (data.status == 1) {

        this.props.setSuggestionPatientData(data.suggesstion);
        this.props.navigation.navigate('PrescriptionPreviewHome', { refill: true });

        setTimeout(() => {
          this.setState({
            loading: false
          })
        }, 2000);


      }
    });
  }



  changeData(text) {
    this.setState({ text });
    this.props.searchData(text);
  }



  addItemInSelctedFlatList(data) {

    let { patientvisit, doctorProfile, updatepatientvisits, prescriptionFav, templateData, ChiefComplaints } = this.props;
    let { patientDetails } = patientvisit
    this.setState({
      loading: true
    })
    let clinics = [...this.props.doctorProfile.DoctorData.ClinicAddresses];
    clinics.forEach((v) => {
      delete v.OperationHours
    });
    let findingFinal = data.Findings ? data.Findings.length > 0 ? data.Findings.map(itemData => {
      itemData.DataType = "";
      itemData.Upload = [];

      return itemData;
    }) : [] : [];

    let investigationFinal = data.Investigation ? data.Investigation.length > 0 ? data.Investigation.map(itemData => {
      itemData.DataType = "";
      itemData.Upload = [];

      return itemData;
    }) : [] : [];
    let p_age = calculateAge(patientDetails.CommonDetails.DOB, false);
    let final_Data =
    {
      "DoctorHeaderDetails": {
        "Logo": doctorProfile.DoctorData.Logo,
        "DoctorEmail": doctorProfile.DoctorData.DoctorEmail,
        "DoctorName": doctorProfile.DoctorData.DoctorFName + " " + doctorProfile.DoctorData.DoctorLName,
        "Specialist": doctorProfile.DoctorData.DisplaySpecializationCSV,
        "Qualification": doctorProfile.DoctorData.DisplayQualificationCSV,
        "MICRNo": doctorProfile.DoctorData.MICRNo,
        "CouncilName": doctorProfile.DoctorData.CouncilName,
        "Clinic": clinics,
        "Signature": doctorProfile.DoctorData.Signature ? doctorProfile.DoctorData.Signature : "",
        "DisplayLabel": doctorProfile.DoctorData.DisplayLabel ? doctorProfile.DoctorData.DisplayLabel : {
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
      },
      "DoctorFooterDetails": null,
      "PatientDetails": {
        "id": patientvisit.Commonid,
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
      },
      "PatientID": patientvisit.patientId,
      "DoctorID": doctorProfile.DoctorData._id,
      "PaperSettings": templateData || templateData != {} ? templateData :
        {
          "Margin": ["10", "10", "10", "10"],
          "TemplateFontSize": "14",
          "papername": "A4",
          "papersize": ["210", "297"],
          "header": 1,
          "footer": 1,
          "body": 1
        },
      "ChiefComplaints": data.ChiefComplaints,
      "Type": data.Ophthalmologist ? "Ophthalmologist" : this.props.doctorProfile.DoctorData.PrimarySpecialization,
      "Findings": findingFinal,
      "Investigation": investigationFinal,
      "Diagnosis": data.Diagnosis,
      "PrescriptionList": data.PrescriptionList,
      "Allergy": patientDetails.CommonDetails.Allergy,
      "FamilyHistory": patientDetails.CommonDetails.FamilyHistory,
      "Habits": [],
      "PatientHabits": patientDetails.CommonDetails.PatientHabits,
      "PersonalHistory": patientDetails.CommonDetails.PersonalHistory,
      "Gpal": patientDetails.CommonDetails.Gpal,
      "RecommendedLabTest": data.RecommendedLabTest,
      "Advice": data.Advice,
      "Language": data.Language ? data.Language : "English",
      "SOSReport": 0,
      "ReferredDoctorDetails": null,
      "ReferredPharmacyDetails": null,
      "ReferredPathLabDetails": null,
      "DisplayPreferences": ["Chief Complaints",
        "Patient History / Family History",
        "On Examination / Findings",
        "Investigations",
        "Recommend Clinical Tests",
        "Diagnosis",
        "Notes",
        "Prescription",
        "Display Generic Name",
        "Advice",
        "Follow up",
        "Doctor Details",
        "Digital Image Signature"],

      // "DisplayPreferences": data.DisplayPreferences,

    }
    if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
      final_Data.DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
      final_Data.DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
    }

    if (data.FollowUpText && data.FollowUpText != '') {
      var day_forFollowup = this.getSunday(data.FollowUpText);
      if (day_forFollowup != 'Sunday') {
        final_Data.FollowUpText = data.FollowUpText;
        final_Data.FollowupDate = this.convertWeeksToDays(day_forFollowup, data.FollowUpText)
      }
      else {

        final_Data.FollowupDate = null;
      }
    }
    else {
      final_Data.FollowupDate = null;
    }
    // this.props.resetOpthalData();
    if (final_Data.Type == "Ophthalmologist" && data["Ophthalmologist"]) {
      let opthalData = JSON.parse(JSON.stringify(data["Ophthalmologist"]));
      final_Data[final_Data.Type] = opthalData;
      this.props.setOpthalData({ selecteddata: opthalData });
    }
    let offlinePrescrip_data_1 = { ...offline_def_prescription, ...final_Data };
    delete offlinePrescrip_data_1.Provider;

    // data._id = "";
    this.props.createRefill(offlinePrescrip_data_1).then(response => {
      if (response.payload.data.status == 1) {
        this.setState({
          loading: false
        })
        offlinePrescrip_data_1._id = response.payload.data.rxId;
        offlinePrescrip_data_1.WhenEntered = response.payload.data.whenEntered ? response.payload.data.whenEntered : new Date().toISOString();
        this.props.setPrescription(offlinePrescrip_data_1);

        this.props.setPrintClickCount(1)



        let searchArray = [];
        let element = this.props.patientvisit.prescription.ChiefComplaints
        for (let index = 0; index < element.length; index++) {

          searchArray.push(element[index].Name)
        }
        if (searchArray.length > 0) {
          this.setSuggSugg("PrintPreview", { "doctorId": this.props.doctorProfile.DoctorData._id, "searchArray": searchArray })

        } else {
          this.props.setSuggestionPatientData([]);
          this.props.navigation.navigate('PrescriptionPreviewHome', { refill: true });
          this.setState({
            loading: false
          })

        }



        //   this.props.navigation.navigate('PrescriptionPreviewHome', { refill: true });
      }
      else {
        this.setState({
          loading: false
        })
      }

    });

  }
  getSunday(data) {
    let moment = require('moment')
    let num = data.split(" ")
    let day = moment().add(parseInt(num), num[1]).format('dddd');
    let date = moment().add(parseInt(num), num[1]).toISOString();
    this.date = date
    return day
  }
  convertWeeksToDays(day, item) {

    var date = "";
    item = item.toLowerCase()
    let x = new Date();
    let arr = item.split(' ');
    if (item.indexOf('day') != -1) {

      date = new Date(x.setDate(x.getDate() + parseInt(arr[0])))

    } else if (item.indexOf('month') != -1) {

      date = moment().add(parseInt(item.split(" ")[0]), 'M');

    } else if (item.indexOf('week') != -1) {


      date = new Date(x.setDate(x.getDate() + (parseInt(arr[0]) * 7)))

    } else if (item.indexOf('year') != -1) {

      date = moment().add(parseInt(item.split(" ")[0]), 'y');

    } else {
      date = day;
    }
    return date;

  }
  takeData(list, enterText) {
    let enterText1 = enterText.trim()
    if (enterText1) {


      let list1 = list.filter(element => {
        if (element.Favourite.startsWith(enterText1)) {
          return true
        } else {
          return false
        }
      })
      // this.setState({filterdata:list1})
      return list1;
    }
    //this.setState({filterdata:list})

    return list;
  }



  onlongPress(data, index) {

    Alert.alert("Prescrip", "Do you want to delete the prescription from favourite ? It won't available once discarded", [

      {
        text: "Cancel",
        onPress: () => console.log(""),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => this.onDiscard(data._id, { "action": 0, "doctorId": this.props.doctorProfile.DoctorData._id, "PatientName": this.props.patientvisit.patientDetails.CommonDetails.FullName }),

      },
    ])

    //  alert(item)
  }



  onDiscard(patientid, data) {


    this.props.deletePatientVisit(patientid, data).then(response => {
      if (response.error) {

        switch (response.error.data) {
          case 'Network Error':
            this.setState({
              description: 'Currently internet is not avaliable'
            })
            break;
          default:
            this.setState({
              description: 'Error in gettting response from server'
            })
            break;
        }

        this.setState({
          editShow: !this.state.editShow,
          loading: false,
          showToast: true,
          toastImagePath: Images.Error,
          toastBgColor: "#d9541d",
          toastTextColor: '#fffefe',

          //  description: payload.data.msg
        })


        setTimeout(() => {
          this.setState({
            showToast: false
          })
        })
        return
      }
      else if (response.payload.data.status == 2000) {

        this.setVCDPage()

        this.setState({

          showToast: true,
          loading: false,
          toastBgColor: "#29b62f",
          toastImagePath: Images.Success,
          toastTextColor: "#fafdfa",
          isAddedFav: true,
          description: response.payload.data.msg,
        })


        setTimeout(() => {
          this.setState({

            showToast: false
          })

          //this.props.navigation.goBack()

        }, 2000);

        //alert(response.payload.data.msg)


      } else {

        // Toast.show({ text: `Something went wrong`, duration: 1000, position: 'bottom' })
      }
    })
  }


  render() {

    return (
      <View
        style={{ flex: 1 }} >

        <View style={{


          flex: 1,

          width: Dimensions.get('window').width, backgroundColor: '#fff',

        }}>


          {
            this.takeData(this.state.favList, this.props.enterText).length > 0 ?
              <FlatListForPrescription
                {...this.props}
                data={this.takeData(this.state.favList, this.props.enterText)}
                //   data={this.state.favList}
                callFrom={"fav"}
                //  enterText ={this.props.enterText}
                onlongPress={(data, index) => this.onlongPress(data, index)}
                addItemInSelctedFlatList={(title) => this.addItemInSelctedFlatList(title, "Complaints")}

              /> :
              <EmptyHome
                {...this.props}
                isLottie={true}
                imagePath={empty_PatientList}
                //imagePath={Images.ic_Video_Consultations_Empty_Icon}
                title={this.state.EmptyHomeTitle}
                // colorCode={colorCode}
                isShowButton={this.state.isShowButton}
                onClick={() => this.onClick()}
              />
          }
        </View>

        <View
          style={{

            position: 'absolute',
            flex: 1,
            // height :'100%',
            width: Dimensions.get('window').width,
            backgroundColor: 'green'
          }}
        >


          {
            this.state.showToast ?
              this.toast.show(


                <ToastComponent
                  {...this.props}

                  textColorCode={this.state.toastTextColor}

                  imagePath={this.state.toastImagePath}
                  description={this.state.description}

                />

                , 2000) : null
          }
          <Toast

            position='center'
            style={{
              shadowColor: '#fff',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '95%',
              zIndex: 1000,

              backgroundColor: this.state.toastBgColor,


              borderRadius: 15
            }}
            ref={(ref) => this.toast = ref} />
          {this.state.loading ? (
            <View
              style={{
                zIndex: 99,
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                height: Dimensions.get('screen').height,
                width: Dimensions.get('screen').width,
                position: "absolute",
              }}
            >
              <PrescriptionLoader
                {...this.props}
                type={'Refilling your favourite templete'}
              />
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}



const mapStateToProps = state => ({
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  opthal: state.opthal,
  prescriptionFav: state.patientvisit.prescription,
  templateData: state.previewReducer.templateData.PaperSettings,

});

const mapDispatchToProps = dispatch => ({
  //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
  favourites: (doctorid) => dispatch(favourites(doctorid)),
  createRefill: (data) => dispatch(createRefill(data)),


  get_suggestions: (data) => dispatch(get_suggestions(data)),
  setSuggestionPatientData: (prescription) => dispatch(setSuggestionPatientData(prescription)),

  setOpthalData: (data) => dispatch(setOpthalData(data)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),
  deletePatientVisit: (patientvisitid, data) => dispatch(deletePatientVisit(patientvisitid, data)),

  resetOpthalData: () => dispatch(resetOpthalData()),

});





export default connect(mapStateToProps, mapDispatchToProps)(MyFav);

