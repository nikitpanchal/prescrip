import React, { Component } from 'react';
import { Container, Content, Header } from 'native-base';
import {
  Text,
  Image,
  View,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { withDb } from '../../DatabaseContext/withDatabase';
import { connect } from 'react-redux';
import ToastComponent from '../../components/Toast/toastComponent';
import { Black_back } from '../../constants/images';
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from '../../constants/font';
import Toast, { DURATION } from 'react-native-easy-toast';
import { logAnalytics } from '../../commonmethods/analytics';
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader';
import Images from '../../Theme/Images';
import LinearGradient from 'react-native-linear-gradient';
import {
  get_chief_suggestions,
  patientvisits,
  get_suggestions,
} from '../../actions';
import { S3BaseUrl } from '../../../app.json';
import {
  setOpthalListData,
  setOpthalData,
  resetOpthalData,
} from '../../actions/opthal';
import LeftEye from '../../components/Opthal/LeftEye';
import {
  getVisitPrescription,
  setPrescription,
  setPrintClickCount,
  createRefill,
  setSuggestionPatientData,
} from '../../actions/patientVisit';
import styles from './styles';
import moment from 'moment';
import { ic_dosage_reminder, ic_pdf } from '../../constants/images';
import multipleTapHandler from '../../components/MultiTapHandle';
import {
  offline_def_prescription,
  calculateAge,
} from '../../commonmethods/common';
import FastImage from 'react-native-fast-image';

class ShowVisitHistory extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      loading: false,
      type: 'prescription',
      data: null,
      issueDate: '',
    };
    this.data1 = null;
  }
  componentDidMount() {
    this.getVisitDetails();
    multipleTapHandler.clearNavigator();
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
  rePrint() {
    this.props.navigation.navigate('PrescriptionWebView');
  }
  OnClick(callFrom) {
    if (this.state.data && !this.state.data.IsPrint) {
      logAnalytics(
        this.props.doctorProfile.DoctorData._id,
        this.props.doctorProfile.DoctorData.DoctorFName +
        ' ' +
        this.props.doctorProfile.DoctorData.DoctorLName,
        'edit_prescription',
      );
    }
    switch (callFrom) {
      case 'left':
        this.handleBackButtonClick();
        break;
      case 'refill':
        //  this.props.resetOpthalData();

        if (this.state.type == 'certificate') {
          this.closePreview();
        } else {
          this.setState({
            loading: true,
          });
          let data = this.state.data;
          data._id = data && !data.IsPrint ? data._id : '';

          let { templateData, patientvisit } = this.props;
          let { patientDetails } = this.props.patientvisit;
          let p_age = calculateAge(patientDetails.CommonDetails.DOB, false);
          let PatientDetails = {
            id: patientvisit.Commonid,
            FullName: patientDetails.CommonDetails.FullName,
            Age: p_age.value.toString() + ' ' + p_age.units,
            Height: patientDetails.CommonDetails.BodyDetails.Height,
            Weight: patientDetails.CommonDetails.BodyDetails.Weight,
            BMI: patientDetails.CommonDetails.BodyDetails.BMI,
            Mobile: patientDetails.Mobile,
            Gender: patientDetails.CommonDetails.Gender,
            ReferralDrrName: patientDetails.CommonDetails.Referredby,
            PatientId: this.props.patientvisit.patientId,
            EmailAddress: patientDetails.CommonDetails.EmailAddress,
            Address: patientDetails.CommonDetails.Address,
          };

          let clinics = [
            ...this.props.doctorProfile.DoctorData.ClinicAddresses,
          ];
          clinics.forEach((v) => {
            delete v.OperationHours;
          });
          let DoctorHeaderDetails = {
            Logo: this.props.doctorProfile.DoctorData.Logo,
            DoctorEmail: this.props.doctorProfile.DoctorData.DoctorEmail,
            DoctorName:
              this.props.doctorProfile.DoctorData.DoctorFName +
              ' ' +
              this.props.doctorProfile.DoctorData.DoctorLName,
            Specialist: this.props.doctorProfile.DoctorData.DisplaySpecializationCSV,
            Qualification: this.props.doctorProfile.DoctorData
              .DisplayQualificationCSV,
            MICRNo: this.props.doctorProfile.DoctorData.MICRNo,
            CouncilName: this.props.doctorProfile.DoctorData.CouncilName,
            Clinic: clinics,
            Signature: this.props.doctorProfile.DoctorData.Signature
              ? this.props.doctorProfile.DoctorData.Signature
              : '',
            DisplayLabel: this.props.doctorProfile.DoctorData.DisplayLabel,

          };
          if (this.props.doctorProfile.DoctorData.IsAssistant == 1) {
            DoctorHeaderDetails.AssistantName = this.props.doctorProfile.DoctorData.AssistantName;
            DoctorHeaderDetails.AssistantId = this.props.doctorProfile.DoctorData.AssistantId;
          }
          let final_Data = {
            PatientDetails: PatientDetails,
            PaperSettings:
              templateData || templateData != {}
                ? templateData
                : {
                  Margin: ['10', '10', '10', '10'],
                  TemplateFontSize: '14',
                  papername: 'A4',
                  papersize: ['210', '297'],
                  header: 1,
                  footer: 1,
                  body: 1,
                },
            DoctorHeaderDetails: DoctorHeaderDetails,
            Allergy: patientDetails.CommonDetails.Allergy,
            FamilyHistory: patientDetails.CommonDetails.FamilyHistory,
            Habits: [],
            Gpal: patientDetails.CommonDetails.Gpal,
            PatientHabits: patientDetails.CommonDetails.PatientHabits,
            PersonalHistory: patientDetails.CommonDetails.PersonalHistory,
            Type: data.Type,

            DisplayPreferences: [
              'Chief Complaints',
              'Patient History / Family History',
              'On Examination / Findings',
              'Investigations',
              'Recommend Clinical Tests',
              'Diagnosis',
              'Notes',
              'Prescription',
              'Display Generic Name',
              'Advice',
              'Follow up',
              'Doctor Details',
              'Digital Image Signature',
            ],
          };

          let offlinePrescrip_data = { ...offline_def_prescription, ...data };
          offlinePrescrip_data.WhenEntered = new Date();
          if (offlinePrescrip_data.FollowUpText && offlinePrescrip_data.FollowUpText != '' && this.state.data.IsPrint) {

            var day_forFollowup = this.getSunday(offlinePrescrip_data.FollowUpText);
            if (day_forFollowup != 'Sunday') {
              offlinePrescrip_data.FollowupDate = this.convertWeeksToDays(day_forFollowup, offlinePrescrip_data.FollowUpText);
            }
            else {
              offlinePrescrip_data.FollowupDate = null;
            }


          }

          let offlinePrescrip_data_1 = { ...offlinePrescrip_data, ...final_Data };
          delete offlinePrescrip_data_1.Provider;

          if (data && !data.IsPrint) {
            this.props.setPrescription(offlinePrescrip_data_1);
            this.props.setPrintClickCount(1);

            let searchArray = [];
            let element = this.props.patientvisit.prescription.ChiefComplaints;
            for (let index = 0; index < element.length; index++) {
              searchArray.push(element[index].Name);
            }

            let prescriptionTest = JSON.parse(
              JSON.stringify(this.props.patientvisit.prescription),
            );
            if (
              prescriptionTest.Type == 'Ophthalmologist' &&
              prescriptionTest['Ophthalmologist']
            ) {
              let opthalData = JSON.parse(
                JSON.stringify(prescriptionTest['Ophthalmologist']),
              );

              this.props.setOpthalData({ selecteddata: opthalData });
            }

            if (searchArray.length > 0) {
              this.setSuggSugg('PrintPreview', {
                doctorId: this.props.doctorProfile.DoctorData._id,
                searchArray: searchArray,
              });
            } else {
              this.props.setSuggestionPatientData([]);
              this.props.navigation.navigate('PrescriptionPreviewHome', {
                refill: true,
              });

              this.setState({
                loading: false,
              });
            }
          } else {
            //logAnalytics
            logAnalytics(
              this.props.doctorProfile.DoctorData._id,
              this.props.doctorProfile.DoctorData.DoctorFName +
              ' ' +
              this.props.doctorProfile.DoctorData.DoctorLName,
              'prescription_refill',
            );

            this.props.createRefill(offlinePrescrip_data_1).then((response) => {
              if (response.payload.data.status == 1) {
                this.setState({
                  loading: false,
                });
                offlinePrescrip_data_1.WhenEntered = response.payload.data.whenEntered ? response.payload.data.whenEntered : new Date().toISOString();
                offlinePrescrip_data_1._id = response.payload.data.rxId;
                this.props.setPrescription(offlinePrescrip_data_1);
                this.props.setPrintClickCount(1);

                let searchArray = [];
                let element = this.props.patientvisit.prescription
                  .ChiefComplaints;
                for (let index = 0; index < element.length; index++) {
                  searchArray.push(element[index].Name);
                }

                let prescriptionTest = JSON.parse(
                  JSON.stringify(this.props.patientvisit.prescription),
                );
                if (
                  prescriptionTest.Type == 'Ophthalmologist' &&
                  prescriptionTest['Ophthalmologist']
                ) {
                  let opthalData = JSON.parse(
                    JSON.stringify(prescriptionTest['Ophthalmologist']),
                  );

                  this.props.setOpthalData({ selecteddata: opthalData });
                }

                if (searchArray.length > 0) {
                  this.setSuggSugg('PrintPreview', {
                    doctorId: this.props.doctorProfile.DoctorData._id,
                    searchArray: searchArray,
                  });
                } else {
                  this.props.setSuggestionPatientData([]);
                  this.props.navigation.navigate('PrescriptionPreviewHome', {
                    refill: true,
                  });

                  this.setState({
                    loading: false,
                  });
                }
              } else {
                this.setState({
                  loading: false,
                });
              }
            });
          }

          //this.props.navigation.push("ChiefComplaintContainer");
        }
        break;
    }
  }
  setChiefComplaints() { }
  getVisitDetails() {
    this.setState({
      loading: true,
    });
    // https://stagingtemplate.prescrip.in/template/report.html?HeaderType=1&TemplatebodyType=3&FooterType=1&print=1&patientid=5fa535d7583cfa13c45ba5df
    this.props
      .getVisitPrescription(this.props.patientvisit.patientVisitId)
      .then((response) => {
        let data = response.payload.data;
        this.data1 = data;
        data.PatientDetails.Mobile = data.PatientDetails.Mobile.length == 10 ? '+91' + data.PatientDetails.Mobile : data.PatientDetails.Mobile;
        
        this.props.setPrescription(data);

        if (data.Type == 'Ophthalmologist' && data['Ophthalmologist']) {
          let opthalData = JSON.parse(JSON.stringify(data['Ophthalmologist']));

          this.props.setOpthalData({ selecteddata: opthalData });
        }

        this.setState({
          loading: false,
          data: data,
          issueDate: moment(data.WhenEntered).format('DD-MM-YYYY'),
        });
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
  getDate(date) {
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    return (
      new Date(date).getDate() +
      ' ' +
      month[new Date(date).getMonth()] +
      ' ' +
      new Date(date).getFullYear()
    );
  }
  openPdf(path) {
    //  path =  "4F8E44CE-1ACB-F095-8FA8-06E77127D86D_2301101374866800000.pdf"
    this.props.navigation.push('DocumentViewer', { item: path });
  }

  //set sugg data

  setSuggSugg(callFrom, patient_details) {
    this.props.get_suggestions(patient_details).then(({ payload, error }) => {
      var data = payload.data;

      if (error) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate('PrescriptionPreviewHome', {
          refill: true,
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } else if (data.status == 0) {
        this.props.setSuggestionPatientData([]);
        this.props.navigation.navigate('PrescriptionPreviewHome', {
          refill: true,
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } else if (data.status == 1) {
        this.props.setSuggestionPatientData(data.suggesstion);

        this.setState({
          loading: false,
        });

        this.props.navigation.navigate('PrescriptionPreviewHome', {
          refill: true,
        });


      }
    });
  }
  isJsonParsable = (obj) => {
    try {
      if (Object.keys(obj).length > 0 && obj.constructor === Object) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };
  openImages(path, uploads, ext) {
    //  console.log(path);
    // console.log(uploads);
    // console.log(ext);
    uploads = uploads.filter((item) => {
      if (this.isJsonParsable(item)) {
        let type = item.image.split('.')[item.image.split('.').length - 1];
        if (type.toLowerCase() == ext.toLowerCase()) {
          return item;
        }
      } else {
        let type = item.split('.')[item.split('.').length - 1];
        if (type.toLowerCase() == ext.toLowerCase()) {
          return item;
        }
      }
    });
    let index = uploads.findIndex((item) => {
      if (this.isJsonParsable(item)) {
        if (item.image == path) {
          return item;
        }
      } else {
        if (item == path) {
          return item;
        }
      }
    });
    uploads = uploads.map((u) => {
      if (this.isJsonParsable(u)) {
        return u.image;
      } else {
        return u;
      }
    });
    this.props.navigation.push('DocumentViewer', {
      item: path,
      index: index,
      imgList: uploads,
    });
  }

  //Show Opthal Data
  getSpecialist_Struct(screen) {
    //if (this.data1.Findings.length == 0) {

    if (true) {
      let morekeys = this.data1.Ophthalmologist.more
        ? Object.keys(this.data1.Ophthalmologist.more)
        : [];
      let lefteyekeys = this.data1.Ophthalmologist.lefteye
        ? Object.keys(this.data1.Ophthalmologist.lefteye)
        : [];
      let righteyekeys = this.data1.Ophthalmologist.righteye
        ? Object.keys(this.data1.Ophthalmologist.righteye)
        : [];
      const self = this;
      return (
        <View
          style={{ borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10 }}>
          <Text
            style={[
              styles.ClinicNameHeader,
              { paddingBottom: 4, fontSize: 16, paddingLeft: 15 },
            ]}>
            Ophthalmologist
          </Text>
          {lefteyekeys.length > 0 || righteyekeys.length > 0 ? (
            <View style={styles.ClinicInnerContainer}>
              {<LeftEye {...this.props} from="PatientVisitDetails" />}
            </View>
          ) : null}
          {this.data1['Ophthalmologist']['more'] ? (
            <View style={styles.ClinicInnerContainer}>
              <Text style={{ fontWeight: 'bold' }}>More</Text>
              {morekeys.map((i) => {
                return (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{}}>{i + ': '}</Text>
                    <Text style={{}}>{this.data1.Ophthalmologist.more[i]}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      );
    }
  }
  render() {
    const day = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        {this.state.loading ? (
          <View
            style={{
              zIndex: 99,
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              position: 'absolute',
            }}>
            <ActivityIndicator size={'large'} color="#fff" />
          </View>
        ) : null}
        {/* for HEADER */}

        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={'#fffff'}
          title={'ISSUE DATE ' + this.state.issueDate}
          description={
            this.props.patientvisit.patientDetails.CommonDetails.FullName +
            "'s " +
            (this.state.type == 'certificate' ? 'Certificate' : 'Prescription')
          }
          titleColor={'#919191'}
          descriptionColor={'#0b69d8'}
          leftImage={Images.ic_black_back}
          rightImage={''}
          secondRightImage={''}
          isShowTitle={true}
          OnClick={(callFrom) => this.OnClick(callFrom)}
        />

        <View style={{ flex: 1, backgroundColor: '#ffffff', height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
          {/** Content View */}
          {this.state.data ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.ClinicMainContainer]}>
              <View style={[styles.ClinicWapperContainer]}>
                {this.state.data.FollowupDate ? (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Follow Up Date
                    </Text>
                    {/* <Text style={[styles.ClinicText, { paddingLeft: 0, fontSize: 17 }]}>{this.getDate(this.data1.WhenEntered)}</Text> */}
                    <Text
                      style={[
                        styles.ClinicText,
                        { paddingLeft: 0, fontSize: 17 },
                      ]}>
                      {day[new Date(this.state.data.FollowupDate).getDay()] +
                        ', ' +
                        this.getDate(this.state.data.FollowupDate)}
                    </Text>
                  </View>
                ) : null}
                {this.state.data.ChiefComplaints.length > 0 && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Chief Complaint
                    </Text>
                    {this.state.data.ChiefComplaints.map((item, i) => {
                      return (
                        <Text
                          style={[
                            styles.ClinicText,
                            { paddingLeft: 0, fontSize: 17 },
                          ]}>
                          {item.Name +
                            (item.Value != '' ? ' - ' + item.Value : '')}
                        </Text>
                      );
                    })}
                  </View>
                )}
              </View>
              {this.state.data.PrescriptionList.length > 0 && (
                <View
                  style={[
                    styles.ClinicWapperContainer,
                    { borderBottomWidth: 0 },
                  ]}>
                  <Text
                    style={[
                      styles.ClinicNameHeader,
                      { paddingBottom: 4, fontSize: 16, paddingLeft: 15 },
                    ]}>
                    Prescription
                  </Text>
                  {this.state.data.PrescriptionList.map((item, i) => {
                    return (
                      <View style={[styles.ClinicInnerContainer]}>
                        <Text
                          style={[
                            styles.ClinicText,
                            { paddingLeft: 0, paddingBottom: 5 },
                          ]}>
                          {item.DosageForms}
                        </Text>
                        <Text
                          style={[
                            styles.ClinicNameHeader,
                            { paddingBottom: 8, fontSize: 20 },
                          ]}>
                          {item.BrandName}
                        </Text>
                        <Text
                          style={[
                            styles.ClinicText,
                            { paddingLeft: 0, paddingBottom: 10, fontSize: 17 },
                          ]}>
                          {item.Generic}
                        </Text>
                        <Text
                          style={[
                            styles.ClinicText,
                            { paddingLeft: 0, paddingBottom: 10, fontSize: 17 },
                          ]}>
                          {item.Dose}
                        </Text>
                        <View style={styles.ClinicFirstRow}>
                          <Image
                            source={ic_dosage_reminder}
                            style={styles.ClinicLeftImage}
                          />
                          <View style={styles.ClinicTextWapper}>
                            <Text style={styles.ClinicText}>
                              {item.DoseRegimen + ' X ' + item.Therapy}{' '}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                          <Text
                            style={{
                              color: '#383838',
                              fontSize: 15,
                              fontWeight: '400',
                            }}>
                            {item.Intake}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                          }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.ClinicText,
                                { paddingLeft: 0, fontSize: 15 },
                              ]}>
                              Start After
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: '#383838',
                              fontSize: 15,
                              fontWeight: '400',
                              paddingLeft: 5,
                            }}>
                            {item.StartFrom}
                          </Text>
                        </View>

                        <View style={[styles.ClinicFirstRow, { paddingTop: 15 }]}>
                          <View style={styles.ClinicTextWapper}>
                            <Text
                              style={[
                                styles.ClinicText,
                                { paddingLeft: 0, fontSize: 15 },
                              ]}>
                              {item.Remarks}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            borderBottomColor: '#dcdcdc',
                            borderBottomWidth: 1,
                            paddingTop: 20,
                          }}></View>
                      </View>
                    );
                  })}
                </View>
              )}

              <View
                style={[styles.ClinicWapperContainer, { borderBottomWidth: 0 }]}>
                {this.state.data.RecommendedLabTest.length > 0 && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Recommended Clinical Test
                    </Text>
                    <Text
                      style={[
                        styles.ClinicText,
                        { paddingLeft: 0, fontSize: 17 },
                      ]}>
                      {this.state.data.RecommendedLabTest.join(', ').trim(', ')}
                    </Text>
                  </View>
                )}
                {this.state.data.Diagnosis.length > 0 && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Diagnosis
                    </Text>
                    <Text
                      style={[
                        styles.ClinicText,
                        { paddingLeft: 0, fontSize: 17 },
                      ]}>
                      {this.state.data.Diagnosis.join(', ').trim(', ')}
                    </Text>
                  </View>
                )}
                {this.state.data.Investigation.length > 0 && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Investigations
                    </Text>
                    {this.state.data.Investigation.map((item, i) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'column',
                            flex: 1,
                            borderColor: '#ebebeb',
                            borderBottomWidth: 1,
                            padding: 5,
                            alignItems: 'flex-start',
                          }}>
                          <Text style={[{ color: '#383838', fontSize: 13 }]}>
                            {i +
                              1 +
                              '. ' +
                              item.Name +
                              ' ' +
                              item.DataType +
                              ' ' +
                              item.Unit}
                          </Text>
                          {/*Show attachments*/}
                          {item.Upload && item.Upload.length > 0 ? (
                            <ScrollView
                              style={{
                                height: 110,
                                width: '100%',
                                marginHorizontal: 15,
                                padding: 5,
                              }}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}>
                              {item.Upload.map((item1, i) => {
                                let type = '';

                                if (this.isJsonParsable(item1)) {
                                  type = item1.fileName
                                    ? item1.fileName.split('.')[
                                    item1.fileName.split('.').length - 1
                                    ]
                                    : item1.name
                                      ? item1.name.split('.')[
                                      item1.name.split('.').length - 1
                                      ]
                                      : item1.image.split('.')[
                                      item1.image.split('.').length - 1
                                      ];
                                } else {
                                  type = item1.split('.')[
                                    item1.split('.').length - 1
                                  ];
                                }

                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      type == 'pdf'
                                        ? this.openPdf(
                                          this.isJsonParsable(item1)
                                            ? item1.fileName
                                              ? item1.fileName
                                              : item1.name
                                                ? item1.name
                                                : item1.image
                                            : item1,
                                        )
                                        : this.openImages(
                                          this.isJsonParsable(item1)
                                            ? item1.fileName
                                              ? item1.fileName
                                              : item1.name
                                                ? item1.name
                                                : item1.image
                                            : item1,
                                          item.Upload,
                                          type,
                                        );
                                    }}
                                    style={{ padding: 5 }}>
                                    <View
                                      style={{
                                        height: 100,
                                        width: 100,
                                        borderColor: '#ebebeb',
                                        borderWidth: 1,
                                      }}>
                                      {type == 'pdf' ? (
                                        <Image
                                          resizeMode="contain"
                                          style={{
                                            height: 100,
                                            width: 100,
                                            marginRight: 15,
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                          }}
                                          source={ic_pdf}
                                        />
                                      ) : (
                                        <FastImage
                                          resizeMode={
                                            FastImage.resizeMode.contain
                                          }
                                          style={{
                                            height: 100,
                                            width: 100,
                                            marginRight: 15,
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                          }}
                                          source={{
                                            priority: FastImage.priority.high,
                                            uri:
                                              S3BaseUrl +
                                              'investigationImg/' +
                                              (this.isJsonParsable(item1)
                                                ? item1.image
                                                : item1),
                                          }}
                                        />
                                      )}
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                )}
                {this.state.data.Findings.length > 0 && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Findings
                    </Text>
                    {this.state.data.Findings.map((item, i) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'column',
                            flex: 1,
                            borderColor: '#ebebeb',
                            borderBottomWidth: 1,
                            padding: 5,
                            alignItems: 'flex-start',
                          }}>
                          <Text style={[{ color: '#383838', fontSize: 13 }]}>
                            {i +
                              1 +
                              '. ' +
                              item.Name +
                              ' ' +
                              item.DataType +
                              ' ' +
                              item.Unit}
                          </Text>
                          {/*Show attachments*/}
                          {item.Upload && item.Upload.length > 0 ? (
                            <ScrollView
                              style={{
                                height: 110,
                                width: '100%',
                                marginHorizontal: 15,
                                padding: 5,
                              }}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}>
                              {item.Upload.map((item1, i) => {
                                let type = '';
                                if (this.isJsonParsable(item1)) {
                                  type = item1.fileName
                                    ? item1.fileName.split('.')[
                                    item1.fileName.split('.').length - 1
                                    ]
                                    : item1.name
                                      ? item1.name.split('.')[
                                      item1.name.split('.').length - 1
                                      ]
                                      : item1.image.split('.')[
                                      item1.image.split('.').length - 1
                                      ];

                                  // type= item1.image.split('.')[item1.image.split('.').length - 1];
                                } else {
                                  type = item1.split('.')[
                                    item1.split('.').length - 1
                                  ];
                                }

                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      type == 'pdf'
                                        ? this.openPdf(
                                          this.isJsonParsable(item1)
                                            ? item1.fileName
                                              ? item1.fileName
                                              : item1.name
                                                ? item1.name
                                                : item1.image
                                            : item1,
                                        )
                                        : this.openImages(
                                          this.isJsonParsable(item1)
                                            ? item1.fileName
                                              ? item1.fileName
                                              : item1.name
                                                ? item1.name
                                                : item1.image
                                            : item1,
                                          item.Upload,
                                          type,
                                        );
                                    }}
                                    style={{ padding: 5 }}>
                                    <View
                                      style={{
                                        height: 100,
                                        width: 100,
                                        borderColor: '#ebebeb',
                                        borderWidth: 1,
                                      }}>
                                      {type == 'pdf' ? (
                                        <Image
                                          resizeMode="contain"
                                          style={{
                                            height: 100,
                                            width: 100,
                                            marginRight: 15,
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                          }}
                                          source={ic_pdf}
                                        />
                                      ) : (
                                        <FastImage
                                          resizeMode={
                                            FastImage.resizeMode.contain
                                          }
                                          style={{
                                            height: 100,
                                            width: 100,
                                            marginRight: 15,
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                          }}
                                          source={{
                                            priority: FastImage.priority.high,
                                            uri:
                                              S3BaseUrl +
                                              'investigationImg/' +
                                              (this.isJsonParsable(item1)
                                                ? item1.fileName
                                                  ? item1.fileName
                                                  : item1.name
                                                    ? item1.name
                                                    : item1.image
                                                : item1),
                                          }}
                                        />
                                      )}
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                )}
                {this.state.data['Ophthalmologist'] &&
                  this.getSpecialist_Struct()}
                {this.state.data.Notes != '' && (
                  <View style={styles.ClinicInnerContainer}>
                    <Text
                      style={[
                        styles.ClinicNameHeader,
                        { paddingBottom: 4, fontSize: 16 },
                      ]}>
                      Note
                    </Text>
                    <Text
                      style={[
                        styles.ClinicText,
                        { paddingLeft: 0, fontSize: 17 },
                      ]}>
                      {this.state.data.Notes}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : null}
          {/* for bottom button*/}

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            {this.props.doctorProfile.DoctorData.IsAssistant != 1 || this.props.doctorProfile.DoctorData.RoleId != 1 && this.state.data && !this.state.data.IsPrint ?
              <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <TouchableOpacity onPress={() => this.OnClick('refill')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderWidth: 2,
                      borderColor: '#07cef2',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 17,
                        color: '#07cef2',
                        fontFamily: 'NotoSans-Bold',
                        marginEnd: 5,
                      }}>
                      {this.state.type == 'certificate'
                        ? 'FINISH'
                        : this.state.data && !this.state.data.IsPrint
                          ? 'EDIT'
                          : 'REFILL'}
                    </Text>
                    {this.state.loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View> : null
            }
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  this.rePrint();
                }}>
                <LinearGradient
                  colors={['#1b7cdb', '#07cef2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0, 0.8]}
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 17,
                      color: '#ffffff',
                      fontFamily: 'NotoSans-Bold',
                      marginEnd: 5,
                    }}>
                    {'REPRINT'}
                  </Text>
                  {this.props.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  patientProfile: state.patientProfile,
  templateData: state.doctorProfile.DoctorData.PaperSettings,
});
const mapDispatchToProps = (dispatch) => ({
  get_suggestions: (data) => dispatch(get_suggestions(data)),
  setSuggestionPatientData: (prescription) =>
    dispatch(setSuggestionPatientData(prescription)),
  setOpthalData: (data) => dispatch(setOpthalData(data)),
  resetOpthalData: () => dispatch(resetOpthalData()),

  createRefill: (data) => dispatch(createRefill(data)),
  getVisitPrescription: (patientvisits) =>
    dispatch(getVisitPrescription(patientvisits)),
  patientvisits: (prescriptionObj) => dispatch(patientvisits(prescriptionObj)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setPrintClickCount: (data) => dispatch(setPrintClickCount(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withDb(ShowVisitHistory));
