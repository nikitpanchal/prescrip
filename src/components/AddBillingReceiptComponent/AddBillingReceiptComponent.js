import React from 'react';

import {
  View,
  BackHandler,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  
  Spec_Check_Active,
  Spec_Check_Non_Active,
 
} from '../../constants/images';
import {
 
  setAppointmentClinic,
} from '../../actions/appointments';
import {
 
  month,
  monthFull,
  
} from '../../commonmethods/validation';
var moment = require('moment');
import {
 
  ic_Mark_as_done,
 
} from '../../constants/images';
import { logAnalytics } from '../../commonmethods/analytics';
import Modal from 'react-native-modalbox';
import {
  Billing_Save_Receipt,
  ic_close_button,
  Billing_From_Contacts,
  Billing_Date_Picker,
  UPI_Icon,
  Billing_Dropdown_Expanded,
  Billing_Dropdown_Collapsed,
  worldwide,
} from '../../constants/images';
import { FlatList } from 'react-native-gesture-handler';
import { isNameValid } from '../../commonmethods/validation';
import Images from '../../Theme/Images';
import { Alert } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import multipleTapHandler from '../../components/MultiTapHandle/index';
import { connect } from 'react-redux';
import { withDb } from '../../DatabaseContext/withDatabase';
import { ic_save_button, ic_Visual_Acuity } from '../../constants/images';
import {
  setAttachmentData,
  resetAttachmentData,
  setMData,
} from '../../actions/attachment';
import { get_suggestions } from '../../actions';
import {
  setSuggestionData,
  create_update_prescription,
} from '../../actions/patientVisit';
import {
  setPatientVisitKeyData,
  setDiagnosis,
  setAdditionalAssesstment,
  setPrescription,
} from '../../actions/patientVisit';
import AddClinicPopup from '../Modal/addClinicPopup';
const TODAYDATE = new Date();
class AddBillingReceiptComponent extends React.Component {
  constructor(props) {
    super(props);
    this.WholeAddress = '';
    this.clinicContact = '';
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.modalServiceProvider = React.createRef();
    this.modalpayment = React.createRef();
    this.state = {
      isDatePickerVisible: false,
      setDate: '',
      setProvider: 'Select Services Provided',
      setPatientName: 'Select Patient From here',
      invoiceNo: "INV-" + TODAYDATE.getTime(),
      setPaymentType: 'Select Payment Type',
      pendingCunsultingDescription: 'Select Clinic Name',

      //validation params
      validName: true,
      patientName: '',
      validAmount: true,
      amount: '',
      remark: '',
      paymentIcon: worldwide,
      receiptno: '',
      validDate: true,
      validProvided: true,
      validPaymentType: true,
      validClinic: true,
      selectedSecondarySpec: [],
      specArray: [],
      specializeArr: [],
      primaryselect: 'Select',
      secondryselect: 'Select',
      arrayPrimary_Spec: [
        'Dentist',
        'CardioLogist',
        'Dermatologist',
        'Diabetologist',
        'Hepatologist',
        'Dermatologist',
        'Diabetologist',
        'Hepatologist',
      ],
      arraySecondory_Spec: [
        'Dentist',
        'CardioLogist',
        'Dermatologist',
        'Diabetologist',
        'Hepatologist',
        'Dermatologist',
        'Diabetologist',
        'Hepatologist',
      ],
      srchText: '',
      selectedSecondarySpec: [],
      SuggSpecialization: [],
      specializeArr: [],
      btnIndex: -1,
      ExactEqualLength: 1,

      ContactDetails1: [],
      currentClinic: 0,
      isContactDetailsModal: false,
      flatListTopMonth: month[new Date().getMonth()],
      flatListTopDate: new Date().getDate(),
      isVisibleDatshow: false,
      finalArrayAfterTabClick: [],
      showTimingModal: false,
    };
  }

  BindSecondory_Spec() {
    {
      var content = this.props.providerData.map((item, index) => {
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                this.state.selectedSecondarySpec.indexOf(item) > -1
                  ? this.removeSecondarySpec(item)
                  : this.pushSecondarySpec(item);
              }}
              style={{
                borderBottomColor: '#cccccc',
                borderBottomWidth: 1,
                height: 50,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{ paddingHorizontal: 8 }}>
                <Image
                  resizeMode={'contain'}
                  source={
                    this.state.selectedSecondarySpec.indexOf(item) > -1
                      ? Spec_Check_Active
                      : Spec_Check_Non_Active
                  }
                  style={{ height: 18, width: 18, resizeMode: 'contain' }}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'NotoSans',
                  color: '#000',
                  alignItems: 'center',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return content;
    }
  }

  componentDidMount() {
    let selectedSecondarySpec = []; //this.state.doctorData.DisplaySpecializationCSV.split(',');
    this.setState({
      selectedSecondarySpec: selectedSecondarySpec,
    });

    if (this.props.doctorProfile.DoctorData.ClinicAddresses) {
      this.getClinicList();
    }

    this.focusListener = this.props.navigation.addListener('focus', () => {
      //   alert('sd')

      this.setState({
        setProvider: this.setData()
          ? this.setData()
          : 'Select Services Provided',
      });

      //  setProvider ==
      // this.setS
      // this.setData();
      //Put your Data loading function here instead of my this.loadData()
    });
  }

  pushSecondarySpec(item) {
    let secSpec = this.state.selectedSecondarySpec;
    secSpec.push(item);
    secSpec = secSpec.filter((item) => {
      if (item.length > 0) {
        return item;
      }
    });
    this.setState({
      selectedSecondarySpec: secSpec,
    });
    this.forceUpdate();
  }

  removeSecondarySpec(item) {
    let secSpec = this.state.selectedSecondarySpec;
    let index = secSpec.indexOf(item);
    secSpec.splice(index, 1);
    this.setState({
      selectedSecondarySpec: secSpec,
    });
    this.forceUpdate();
  }
  setSecondarySpec() {
    //this.setState({ setProvider: item }
    this.modalServiceProvider.close();

    let spec = this.props.providerData.filter((item) => {
      if (item.length > 0) {
        return item;
      }
    });
    let secSpec =
      this.state.selectedSecondarySpec.join() == ''
        ? 'Select Services Provided'
        : this.state.selectedSecondarySpec.join();
    //  this.onDataChanges("DisplaySpecializationCSV", secSpec);
    //this.secondary.close();
    this.setState({ setProvider: secSpec }, () => {
      this.forceUpdate();
    });
  }

  searchSpecilialization(text1) {
    // let text=text1.replace(/\s/g, '');

    this.setState({
      srchText: text1,
    });

    let text = text1.trim();
    if (text) {
      let newData = this.props.providerData.filter((item) => {
        const itemData = item.toLowerCase();
        const textData = text.toLowerCase();

        return itemData.includes(textData);
      });

      this.setState({ specArray: newData, specializeArr: newData });
    } else {
      this.setState({
        specArray: this.props.providerData,
        specializeArr: this.props.providerData,
      });
    }
  }

  rightClick() {
    // let isEmail = isEmailValid(this.state.specialistdata.EMAIL)
    // let isMobile = isPhoneno(this.state.specialistdata.MOBILE)
    //let isName = isNameValid(this.state.patientName);
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      ' ' +
      this.props.doctorProfile.DoctorData.DoctorLName,
      'add_billing_receipt',
    );
    let date = this.props.setDate;

    let name = this.props.fullName;
    let invoiceNo = this.state.invoiceNo;

    let validProvided = this.state.setProvider;
    let validPaymentType = this.state.setPaymentType;
    let validClinic = this.state.pendingCunsultingDescription;

    let amount = this.state.amount;

    // let isSPECIALIZATION = this.state.specialistdata.SPECIALIZATION
    if (
      name != 'Select Patient From here' &&
      date != 'Select Date' &&
      validProvided != 'Select Services Provided' &&
      validPaymentType != 'Select Payment Type' &&
      amount != '' &&
      validClinic != 'Select Clinic Name'
    ) {
      this.setState({
        validName: true,
        validDate: true,
        validProvided: true,
        validPaymentType: true,
        validAmount: true,
        validClinic: true,
      });

      this.props.onRightIconPress(
        name,
        date,
        validProvided,
        amount,
        validPaymentType,
        this.state.remark,
        this.WholeAddress,
        this.clinicContact,
        invoiceNo
      );
    } else {
      if (name == 'Select Patient From here') {
        this.setState({
          validName: false,
        });
      } else {
        this.setState({
          validName: true,
        });
      }

      if (date == 'Select Date') {
        this.setState({
          validDate: false,
        });
      } else {
        this.setState({
          validDate: true,
        });
      }

      if (validProvided == 'Select Services Provided') {
        this.setState({
          validProvided: false,
        });
      } else {
        this.setState({
          validProvided: true,
        });
      }

      if (amount == '') {
        this.setState({
          validAmount: false,
        });
      } else {
        this.setState({
          validAmount: true,
        });
      }

      if (validPaymentType == 'Select Payment Type') {
        this.setState({
          validPaymentType: false,
        });
      } else {
        this.setState({
          validPaymentType: true,
        });
      }

      if (validClinic == 'Select Clinic Name') {
        this.setState({
          validClinic: false,
        });
      } else {
        this.setState({
          validClinic: true,
        });
      }
    }
  }

  setData(item) {
    if (this.props.patientvisit.prescription['Provider']) {
      return this.props.patientvisit.prescription['Provider']
        .map((i) => {
          if (typeof i === 'string') {
            return i;
          } else {
            return i.Name;
          }
        })
        .join(', ');
    } else {
      return null;
    }
  }

  //Call Service Provided screen

  nextButton() {
    var type = {
      description: '',
      imagePath: 158,
      name: 'Provider',
    };

    let {
      Srno,
      displayname,
      defaultlabel,
      subtext,
      patientname,
      mdata,
      ChiefComplaints,
      Findings,
      Investigation,
      Diagnosis,
      navigation,
      RecommendedLabTest,
      Advice,
      setPatientVisitKeyData,
      setAttachmentData,
      setAdditionalAssesstment,
      patientvisit,
      suggesticon,
      fullName,
      suggestname,
      colorCode,
    } = this.props;
    let nextscreenname = '';
    switch (type.name) {
      case 'Provider':
        type = 'Provider';
        nextscreenname = 'ProviderContainer';
        displayname = 'Services';
        defaultlabel = 'Suggested';
        subtext = 'Service Provided  to ' + fullName;
        mdata = this.props.patientvisit.prescription['Provider'] || [];
        Srno = 12;
        colorCode = '#359EAC';

        break;
      default:
        break;
    }
    setPatientVisitKeyData({ [type]: mdata });
    setAttachmentData({
      type,
      DataType: '',
      Graph: '',
      Unit: '',
      Upload: [],
      Name: '',
      Value: '',
      mdata,
      Srno,
      subtext,
      displayname,
      colorCode,
      defaultlabel,
      suggestname,
      suggesticon,
    });

    multipleTapHandler.multitap(
      () => this.props.navigation.navigate(nextscreenname),
      nextscreenname,
    );

    // navigation.navigate(nextscreenname)
  }

  serviceProviderData(item, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({ setProvider: item }, () =>
            this.modalServiceProvider.close(),
          )
        }
        style={{
          borderBottomColor: '#cdcdcd',
          borderBottomWidth: 0.8,
          padding: 10,
        }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>{item}</Text>
      </TouchableOpacity>
    );
  }

  paymentMethodData(item, index) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState(
            {
              setPaymentType: item,
              paymentIcon: this.props.iconsPayment[
                this.props.paymentData.indexOf(item)
              ],
            },
            () => this.modalpayment.close(),
          )
        }
        style={{
          borderBottomColor: '#cdcdcd',
          borderBottomWidth: 0.8,
          padding: 10,
        }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>{item}</Text>
      </TouchableOpacity>
    );
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

  // this function opens modal depends upon refs and set boolean isModalOpen to open
  onModalOpen(modalType) {
    this[modalType].open();
    this.setState({ isModalOpen: true });
  }

  // this function set item for service provided when text is clicked

  setProviderModalState(item) {
    this.setState(
      { setProvider: item },
      () => this.modalServiceProvider.close(),
      this.setState({ isModalOpen: false }),
    );
  }

  // this function set item for payment type when text is clicked
  setPaymentModalState(item) {
    this.setState(
      { setPaymentType: item },
      () => this.modalpayment.close(),
      this.setState({ isModalOpen: false }),
    );
  }

  handleBackButtonClick() {
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: !this.state.isModalOpen }, () => {
        this.modalServiceProvider.close(), this.modalpayment.close();
      });
    } else {
      this.props.onLeftIconPress();

      // this.props.navigation.goBack(null);
      // return true;
    }
  }

  setDefaultClinic(index) {
    let clinics = this.props.doctorProfile.DoctorData.ClinicAddresses;
    if (clinics.length > 0) {
      let selectedClinic = clinics[index];
      this.WholeAddress =
        selectedClinic.ClinicName +
        ' ' +
        selectedClinic.Address +
        ' ' +
        selectedClinic.City +
        ' ' +
        selectedClinic.State +
        ' ' +
        selectedClinic.Pincode;
      this.clinicContact = selectedClinic.ContactNo;
      let data = {
        clinicId: clinics[index].ClinicId,
        ClinicName: clinics[index].ClinicName,
        Address: clinics[index].Address,
        selectedDate: this.props.appointments.selectedDate
          ? this.props.appointments.selectedDate
          : new Date().toISOString(),
      };
      // this.props.setAppointmentClinic(data);
      this.setState(
        {
          pendingCunsultingDescription: clinics[index].ClinicName + '  ',
          currentClinic: clinics[index].ClinicId,
          isContactDetailsModal: false,
          selectedDate: data.selectedDate,
          flatListTopMonth: month[moment(data.selectedDate).month()],
          flatListTopDate: moment(data.selectedDate).date(),
          showTimingModal: false,
          upperdateTag:
            monthFull[moment(data.selectedDate).month()] +
            ' ' +
            moment(data.selectedDate).date() +
            ',' +
            moment(data.selectedDate).year(),
        },
        () => {
          //this.getClinicAppointment(clinics[index].ClinicId);
        },
      );
      //this.setTestList();

      let renderClinics = [];
      for (let c = 0; c < clinics.length; c++) {
        c == index ? (clinics[c].IsDefault = 1) : (clinics[c].IsDefault = 0);
        let item = {
          id: c + 1,
          name: clinics[c].ClinicName,
          des: '',
          colorCode: clinics[c].IsDefault ? '#0065d7' : '#000000',
          imagePath: clinics[c].IsDefault ? ic_Mark_as_done : '',
        };
        renderClinics.push(item);
      }
      renderClinics.push({
        id: '4',
        name: '',
        des: '',
        colorCode: '#0065d7',
        imagePath: null,
      });
      this.setState({
        ContactDetails1: renderClinics,
      });
    }
  }

  onClick(callFrom) {
    if (callFrom == 'share') {
      this.onShare();
    } else {
      this.setState({
        isContactDetailsModal: false,
      });
    }
  }

  closeClick() {
    this.setState({
      isContactDetailsModal: false,
    });
  }

  getClinicList() {
    if (this.props.doctorProfile.DoctorData.ClinicAddresses.length > 0) {
      let clinics = this.props.doctorProfile.DoctorData.ClinicAddresses;

      let defclinic = clinics.find((clinic) => {
        return clinic.IsDefault == 1;
      });
      if (this.props.appointments.clinicId == 0) {
        this.setDefaultClinic(0);
      } else {
        let clinics = this.props.doctorProfile.DoctorData.ClinicAddresses;
        let index = -1;
        let clinic = clinics.find((c, i) => {
          if (c.ClinicId == this.props.appointments.clinicId) {
            index = i;
          }
        });
        this.setDefaultClinic(index);
      }

      this.setState({
        createAppointment: this.props.createAppointment,
      });
    } else {
      this.setState({
        pendingCunsultingDescription: 'N/A',
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddClinicPopup
          {...this.props}
          ContactDetails1={this.state.ContactDetails1}
          isContactDetailsModal={this.state.isContactDetailsModal}
          closeClick={() => this.closeClick()}
          onClick={() => this.onClick('PopUp')}
          callFrom={'receipt'}
          setCurrentClinic={(index) => this.setDefaultClinic(index)}
        />

        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />

        <View
          style={{
            flex: 0.1,
            marginBottom: 2,
            marginTop: 15,
            flexDirection: 'row',
            borderBottomColor: '#dddddd',
            borderBottomWidth: 1.5,
          }}>
          <TouchableOpacity
            onPress={this.props.onLeftIconPress}
            style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={ic_close_button}
              style={{ resizeMode: 'contain', height: 20, width: 20 }}
            />
          </TouchableOpacity>
          <View style={{ flex: 0.8, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontFamily: 'NotoSans' }}>
              Add Receipt
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.rightClick()}
            style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={Billing_Save_Receipt}
              style={{ resizeMode: 'contain', height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 0.9 }}
          behavior={Platform.OS == 'android' ? null : 'padding'}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
              marginBottom:
                Platform.OS === 'ios' ? null : StatusBar.currentHeight,
                width : Dimensions.get('window').width
            }}>
            <View style={{ flex: 1 }}>

              <View style={{ padding: 10, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Invoice No.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>

                    <View style={{ flex: 0.95, justifyContent: 'center' }}>
                      <TextInput
                        style={{ fontSize: 20, fontFamily: 'NotoSans' }}
                        maxLength={30}
                        keyboardType={"number-pad"}
                        defaultValue={this.state.invoiceNo}
                        onChangeText={(text) =>
                          this.setState({
                            invoiceNo: text,
                          })
                        }
                      />
                    </View>
                  </View>
                </View>
                {this.state.validAmount ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please enter valid amount{' '}
                  </Text>
                )}
              </View>
              <View style={{ padding: 5, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Patient name
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.getNameFromApp()}
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <View style={{ flex: 0.9 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'NotoSans',
                        color:
                          this.props.fullName == 'Select Patient From here'
                            ? '#cdcdcd'
                            : '#000',
                      }}>
                      {this.props.fullName}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1, alignItems: 'center' }}>
                    <Image
                      source={Billing_From_Contacts}
                      style={{ resizeMode: 'contain', height: 20, width: 20 }}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.validName ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please select Patient first{' '}
                  </Text>
                )}
              </View>
              <View style={{ padding: 10, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Date of Receipt
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.fullName == 'Select Patient From here'
                      ? alert('Please select patient first')
                      : this.props.onDatePress()
                  }
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <View style={{ flex: 0.9 }}>
                    {/* <TextInput defaultValue={this.state.setDate} style={{ fontSize: 20, fontFamily: 'NotoSans' }} /> */}
                    <Text style={{ fontSize: 20, fontFamily: 'NotoSans' }}>
                      {this.props.setDate}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1, alignItems: 'center' }}>
                    <Image
                      source={Billing_Date_Picker}
                      style={{ resizeMode: 'contain', height: 20, width: 20 }}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.validDate ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please select valid date{' '}
                  </Text>
                )}
              </View>

              {/* Select clinic */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginBottom: 15,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Clinic / Hospital
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.fullName == 'Select Patient From here'
                      ? alert('Please select patient first')
                      : this.state.pendingCunsultingDescription == 'N/A'
                        ? ''
                        : this.setState({ isContactDetailsModal: true })
                  }
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                  }}>
                  <View
                    style={{
                      marginTop: 10,
                      flex: 0.9,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/* // <Text style={{ fontSize: 20, width: '10%', backgroundColor: 'red' }}>{"\u20B9"}</Text> */}

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'NotoSans',
                          color:
                            this.state.pendingCunsultingDescription ==
                              'Select clinic name'
                              ? '#cdcdcd'
                              : '#000',
                        }}>
                        {this.state.pendingCunsultingDescription}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={Billing_Dropdown_Collapsed}
                      style={{ resizeMode: 'contain', height: 12, width: 12 }}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.validClinic ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please select Clinic Name{' '}
                  </Text>
                )}
              </View>

              <View style={{ padding: 10, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Service provided
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.fullName == 'Select Patient From here'
                      ? alert('Please select patient first')
                      : this.nextButton()
                  }
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <View style={{ flex: 0.7 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'NotoSans',
                        color:
                          this.state.setProvider == 'Select Services Provided'
                            ? '#cdcdcd'
                            : '#000',
                      }}>
                      {this.state.setProvider}
                    </Text>
                  </View>
                  <View style={{ flex: 0.3, alignItems: 'center' }}>
                    <Text
                      style={{
                        textAlign: 'right',
                        alignSelf: 'flex-end',
                        fontSize: 17,
                        fontFamily: 'NotoSans',
                        color: '#1A9BA7',
                      }}>
                      {this.state.setProvider == 'Select Services Provided'
                        ? 'Select '
                        : 'Change'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {this.state.validProvided ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please select valid Service Provider{' '}
                  </Text>
                )}
              </View>
              <View style={{ padding: 10, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Amount
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/* // <Text style={{ fontSize: 20, width: '10%', backgroundColor: 'red' }}>{"\u20B9"}</Text> */}
                    <View style={{ flex: 0.05, alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#717171',
                          fontFamily: 'NotoSans',
                        }}>
                        {'\u20B9'}
                      </Text>
                    </View>
                    <View style={{ flex: 0.95, justifyContent: 'center' }}>
                      <TextInput
                        style={{ fontSize: 20, fontFamily: 'NotoSans' }}
                        keyboardType={'number-pad'}
                        defaultValue={this.state.amount}
                        onChangeText={(text) =>
                          this.setState({
                            amount: text,
                          })
                        }
                      />
                    </View>
                  </View>
                </View>
                {this.state.validAmount ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please enter valid amount{' '}
                  </Text>
                )}
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginBottom: 15,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Payment Method
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.fullName == 'Select Patient From here'
                      ? alert('Please select patient first')
                      : this.onModalOpen('modalpayment')
                  }
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                  }}>
                  <View
                    style={{
                      marginTop: 10,
                      flex: 0.9,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/* // <Text style={{ fontSize: 20, width: '10%', backgroundColor: 'red' }}>{"\u20B9"}</Text> */}

                    <View style={{ flex: 0.15, justifyContent: 'center' }}>
                      <Image
                        source={this.state.paymentIcon}
                        style={{ resizeMode: 'contain', height: 25, width: 25 }}
                      />
                    </View>
                    <View style={{ flex: 0.85 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'NotoSans',
                          color:
                            this.state.setPaymentType == 'Select Payment Type'
                              ? '#cdcdcd'
                              : '#000',
                        }}>
                        {this.state.setPaymentType}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={Billing_Dropdown_Collapsed}
                      style={{ resizeMode: 'contain', height: 12, width: 12 }}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.validPaymentType ? (
                  <Text style={{ fontSize: 12, color: '#ffffff' }}></Text>
                ) : (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Please select valid Payment Type{' '}
                  </Text>
                )}
              </View>
              <View style={{ padding: 10, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#919191',
                    fontFamily: 'NotoSans',
                  }}>
                  Remarks:
                </Text>
                <View
                  style={{
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 0.8,
                    paddingVertical: 6,
                  }}>
                  <TextInput
                    multiline={true}
                    style={{ fontSize: 20, fontFamily: 'NotoSans' }}
                    defaultValue={this.state.remark}
                    onChangeText={(text) =>
                      this.setState({
                        remark: text,
                      })
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={this.props.isDatePickerVisible}
          maximumDate={new Date()}
          onConfirm={this.props.dateHandlePress}
          onCancel={() => this.setState({ isDatePickerVisible: false })}
        />

        {/*Secondary Specialization*/}
        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: '100%',
            borderRadius: 10,
            height: '100%',
            overflow: 'hidden',
            justifyContent: 'center',
            margingTop: 30,
          }}
          
          ref={(ref) => this.modalServiceProvider = ref}
          swipeToClose={false}
          position={'center'}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
          <View style={{ flex: 1, top: 40 }}>
            {/*  <View style={{
        
       
              borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, },
              shadowColor: '#dcdcdc', flexDirection: 'row',
              shadowOpacity: 2, borderBottomWidth: 2, paddingVertical: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center', alignItems: 'center'
            }}>
           <View style={{ flex: 0.9 }}>
                <TextInput
                  value={this.state.srchText}
                  onChangeText={(txt) => this.searchSpecilialization(txt)}
                  style={{ fontSize: 14, textAlign: 'left' }}
                  placeholder=" Select Secondry Specialization" />

        </View>
              <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                {this.props.providerData.length != -1 && this.state.srchText.trim() == "" || this.props.providerData.indexOf(this.state.srchText.trim()) != -1 ? <Image source={Images.new_search} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                  :
                  <TouchableOpacity onPress={() => this.addItemInSpecialization(this.state.srchText.trim(), "custom")}>
                    <Image source={ic_add_blue} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                  </TouchableOpacity>}

              </View>

            </View>*/}
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ width: '100%' }}>
              {this.BindSecondory_Spec()}
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={() => this.setSecondarySpec()}
            style={{
              bottom: 30,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              position: 'absolute',
              backgroundColor: '#0065d7',
              width: '100%',
            }}>
            <Text
              uppercase={true}
              style={{ paddingVertical: 15, fontSize: 14, color: '#fff' }}>
              Done
            </Text>
          </TouchableOpacity>
        </Modal>

        {/* // modal for payment type */}

        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: '80%',
            borderRadius: 10,
            height: 270,
            overflow: 'hidden',
            justifyContent: 'center',
            margingTop: 30,
          }}
          ref={(ref) => this.modalpayment = ref}
           
          swipeToClose={false}
          position={'center'}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.props.paymentData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                this.paymentMethodData(item, index)
              }
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  type: state.attachment.type,
  displayname: state.attachment.displayname,
  colorCode: state.attachment.colorCode,
  defaultlabel: state.attachment.defaultlabel,
  subtext: state.attachment.subtext,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  Srno: state.attachment.Srno,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.attachments,
  mdata: state.attachment.mdata,
  patientvisit: state.patientvisit,
  ChiefComplaints: state.patientvisit.prescription.ChiefComplaints,
  Findings: state.patientvisit.prescription.Findings,
  Investigation: state.patientvisit.prescription.Investigation,
  Diagnosis: state.patientvisit.prescription.Diagnosis,
  DoctorHeaderDetails: state.patientvisit.prescription.DoctorHeaderDetails,
  PrescriptionList: state.patientvisit.prescription.PrescriptionList,
  prescription: state.patientvisit.prescription,

  RecommendedLabTest: state.patientvisit.prescription.RecommendedLabTest,
  Advice: state.patientvisit.prescription.Advice,
  opthal: state.opthal,
  NotesTooltip: state.tooltip.toolTipStatus.NotesTooltip,
  appointments: state.appointments,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentData: (data) => dispatch(setAttachmentData(data)),
  setMData: (data) => dispatch(setMData(data)),
  setPatientVisitKeyData: (data) => dispatch(setPatientVisitKeyData(data)),
  resetAttachmentData: () => dispatch(resetAttachmentData()),
  get_suggestions: (doctorId, searchArray) =>
    dispatch(get_suggestions(doctorId, searchArray)),
  setSuggestionData: (prescription) =>
    dispatch(setSuggestionData(prescription)),
  setAdditionalAssesstment: (id, data) =>
    dispatch(setAdditionalAssesstment(id, data)),
  create_update_prescription: (data) =>
    dispatch(create_update_prescription(data)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
  setAppointmentClinic: (data) => dispatch(setAppointmentClinic(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withDb(AddBillingReceiptComponent));
