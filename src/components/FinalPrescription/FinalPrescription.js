/* created by Ruban */

import React, { Component } from 'react';
import {
  Refer_Green_icon,
  Refer_Grey_icon,
  ic_arrow_decrease,
  ic_arrow_increase,
  ic_laboratory_icon,
  SuggestLab_Pink_btn,
  ic_pharamacy_icon,
  ic_specialist_icon,
  ic_whatsapp_icon,
  ic_sms_icon,
  ic_mail_icon,
  ic_more_icon,
  ic_content_copy,
  ic_content_share,
  ic_saveRX_icon,
  Contact_btn_pink,
  contact_green,
  Save_pink_btn,
  save_btn_green,
} from '../../constants/images';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Keyboard,
  View,
  Text,
  TextInput,
  FlatList,
  Linking,
  TouchableOpacity,
  Clipboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Share,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Container, Accordion, Button } from 'native-base';
import Images from '../../Theme/Images';
import multipleTapHandler from '../MultiTapHandle/index';
import NoNetwork from '../NoNetwork/noNetwork';
import ToastComponent from '../Toast/toastComponent';
import { addToFavourite } from '../../actions/certificates';

import Toast, { DURATION } from 'react-native-easy-toast';
import { ic_Blue_BG_578 } from '../../constants/images';
import {
  saveQuickRxFavourites,
  setlab,
  addAsFav,
  sendRxSMS,
} from '../../actions/patientVisit';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { calculateAge } from '../../commonmethods/common';
var success_tick = require('../../../assets/Json/Success-Tick-Big.json');
import LinearGradient from 'react-native-linear-gradient';
import { logAnalytics } from '../../commonmethods/analytics';

class FinalPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getDataFromTab: this.props.certificates.certificateResponse,
      focus: false,
      remarkInput: '',
      isInternetOn: true,
      NoNetworkMsg: '',
      toastImagePath: Images.Info,
      toastTextColor: '#fafbfe',
      toastBgColor: '#4D99E3',
      showToast: false,
      copyToast: false,
      errorToast: false,
      consultationType: ['First Time', 'Follow Up', 'Custom'],
      description: '',
      url:
        this.props.route.params.item == 'Certificate'
          ? this.props.certificates.certificateResponse.url
          : this.props.patientvisit.prescription.url,
      dropDownIndex: -1,
      consultTypeIndex: 0,
      quickRxText: '',
      isAddedFav: false,
      loading: false,
      consultFee: this.props.doctorProfile.DoctorData.ConsultFee
        ? this.props.doctorProfile.DoctorData.ConsultFee.toString()
        : '0',
      msg:
        'Hello, ' +
        this.props.patientname +
        ' Hope you get well under my care, please find a copy of your prescription',
      paymsg: 'Hello, you can make payment using the below link \n',
      shareModal: false,

      refer: [
        {
          img: ic_laboratory_icon,
          color: '#f21c68',
          title: 'Laboratory',
        },
        {
          img: ic_pharamacy_icon,
          color: '#0065d7',
          title: 'Pharmacy',
        },
        {
          img: ic_specialist_icon,
          color: '#1ca977',
          title: 'Specialist',
        },
      ],
      share: [
        {
          img: ic_sms_icon,
          title: 'SMS',
        },
        {
          img: ic_whatsapp_icon,
          title: 'Whatsapp',
        },
        {
          img: ic_mail_icon,
          title: 'Mail',
        },
        {
          img: ic_more_icon,
          title: 'More',
        },
      ],
      //    this.dataArray = [
      //         { title: 'first', content: "Lorem ipsum dolor sit amet" },
      //         { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
      //         { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
      //       ];
    };
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    this.setState({ focus: false });
  }

  quickRxIndex(index) {
    this.setState({ focus: false });
    // let val = index == this.state.dropDownIndex ? -1 :( this.props.route.params.item=="Prescription"?index:index+1)
    let val = index == this.state.dropDownIndex ? -1 : index;
    this.setState({ dropDownIndex: val });
  }

  itemView(index, item) {
    if (
      this.props.route.params.item == 'Certificate' &&
      (index == 0 || index == 3)
    ) {
      return null;
    } else {
      return (
        <View
          style={{
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1.8,
            borderLeftColor: '#cccccc',
            borderLeftWidth: 1,
            borderTopWidth: 0.2,
            borderRightColor: '#cccccc',
            borderRightWidth: 1,
            borderRadius: 10,
            margin: 12,
            padding: 10,
          }}>
          <TouchableOpacity onPress={() => this.quickRxIndex(index)}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View
                style={{
                  flex: Platform.isPad ? 0.05 : 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={item.img}
                  style={{ resizeMode: 'contain', height: 20 }}
                />
              </View>
              <View
                style={{
                  flex: Platform.isPad ? 0.9 : 0.8,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ fontFamily: 'NotoSans', fontSize: 20, color: '#000' }}>
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    index == this.state.dropDownIndex
                      ? ic_arrow_increase
                      : ic_arrow_decrease
                  }
                  style={{ resizeMode: 'contain', height: 8 }}
                />
              </View>
            </View>
            <Text style={styles.dtls}>{item.details}</Text>
          </TouchableOpacity>
          {this.dropdown(index, item)}
        </View>
      );
    }
  }

  sendPrescrip1(type, number) {
    multipleTapHandler.clearNavigator();
    const separator = Platform.OS === 'ios' ? '&' : '?';
    let url = this.props.patientvisit.payment_link;

    let msg = 'Hello, you can make payment using the below link \n';

    // let msg = "Hello, " + this.props.patientvisit.patientDetails.CommonDetails.FullName + " Hope you get well under my care, please find a copy of your prescription";

    switch (type) {
      case 'whatsapp':
        Linking.openURL(
          'whatsapp://send?text=' +
          msg +
          '\n' +
          url +
          '&phone=' +
          parseInt(number),
        );


        break;

      case 'sms':
        Platform.OS == 'android'
          ? Linking.openURL('sms:' + number + '?body=' + msg + '\n' + url)
          : Linking.openURL('sms:' + number + '&body=' + msg + '\n' + url);

        //  Linking.openURL('sms:' + number + '?sms_body=' + msg + "\n" + url);
        break;

      case 'mail':
        Linking.openURL(
          'mailto:' +
          this.props.patientvisit.patientDetails.CommonDetails.Email +
          '?subject=' +
          this.props.patientvisit.patientDetails.CommonDetails.FullName +
          ' prescription' +
          '&body=' +
          msg +
          '\n' +
          url,
        );
        break;

      default:
        this.onShare(1);
    }
  }

  sendPrescrip(type, number) {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      ' ' +
      this.props.doctorProfile.DoctorData.DoctorLName,
      'shared_rx',
    );
    const separator = Platform.OS === 'ios' ? '&' : '?';
    switch (type) {
      case 'whatsapp':
        Linking.openURL(
          'whatsapp://send?text=' +
          this.state.msg +
          '\n' +
          this.state.url +
          '&phone=' +
          number,
        );


        break;

      case 'sms':
        Platform.OS == 'android'
          ? Linking.openURL(
            'sms:' +
            number +
            '?body=' +
            this.state.msg +
            '\n' +
            this.state.url,
          )
          : Linking.openURL(
            'sms:' +
            number +
            '&body=' +
            this.state.msg +
            '\n' +
            this.state.url,
          );

        //  Linking.openURL('sms:' + number + '?sms_body=' + this.state.msg + "\n" + this.state.url);
        break;

      case 'mail':
        Linking.openURL(
          'mailto:' +
          this.props.patientvisit.patientDetails.CommonDetails.Email +
          '?subject=' +
          this.props.patientvisit.patientDetails.CommonDetails.FullName +
          ' prescription' +
          '&body=' +
          this.state.msg +
          '\n' +
          this.state.url,
        );
        break;

      default:
        this.onShare(2);
    }
  }

  // sharing payment link
  async onShare(type) {
    multipleTapHandler.clearNavigator();
    try {
      let msg =
        type == 1
          ? 'Hello, you can make payment using the below link \n' +
          this.props.patientvisit.payment_link
          : this.state.msg;
      const result = await Share.share({
        message:
          type == 1
            ? msg
            : msg +
            ' ' +
            this.state.url +
            ' Regards ' +
            this.props.doctorProfile.DoctorData.DoctorFName +
            ' ' +
            this.props.doctorProfile.DoctorData.DoctorLName,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      this.props.submitErrors('Sidebar', error, 'onShare');
      alert(error.message);
    }
  }

  // send message type
  getTypeoFsend(item) {
    switch (item) {
      case 'SMS':
        return 'sms';

      case 'Whatsapp':
        return 'whatsapp';

      case 'Mail':
        return 'mail';

      default:
        return 'more';
    }
  }

  // send numer type
  getNumberForsend(item) {
    switch (item) {
      case 'SMS':
        return this.props.patientmobile;
      case 'Whatsapp':
        return this.props.patientvisit.patientDetails.CommonDetails.Whatsapp &&
          this.props.patientvisit.patientDetails.CommonDetails.Whatsapp != '' ?
          this.props.patientvisit.patientDetails.CommonDetails.Whatsapp :
          this.props.patientvisit.patientDetails.CommonDetails.CountryCode ?
            this.props.patientvisit.patientDetails.CommonDetails.CountryCode + this.props.patientvisit.patientDetails.Mobile : '+91' + this.props.patientvisit.patientDetails.Mobile;
      case 'Mail':
        return this.props.patientmail;
      default:
        return 'more';
    }
  }

  saveCertFavQuickRx() {
    var {
      PaperSettings,
      _id,
      Type,
      CertificateType,
      DoctorHeaderDetails,
      url,
    } = this.props.certificates.certificateResponse;

    let type = CertificateType.replace(/\s/g, '');
    this.state.getDataFromTab;
    let data = {
      DoctorID: this.props.doctorProfile.DoctorData._id,
      CertificatesTypes: type,
      header: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.header
        : this.state.templateData.PaperSettings.header,
      footer: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.footer
        : this.state.templateData.PaperSettings.footer,
      body: this.state.getDataFromTab.PaperSettings
        ? this.state.getDataFromTab.PaperSettings.body
        : this.state.templateData.PaperSettings.body,
      type: 1,
    };

    this.props.addToFavourite(data).then((response) => {
      if (response.payload.data.status == 1) {
        let { CertificatesFav } = response.payload.data.data;
        let doctorData = this.props.doctorProfile.DoctorData;
        doctorData.CertificatesFav = CertificatesFav;
        this.props.setDoctorData(doctorData);
        this.setState({
          isFavPrescription: true,
        });
      }
    });
  }

  saveQuickRx() {
    if (this.props.route.params.item == 'Certificate') {
      this.saveCertFavQuickRx();
    } else {
      if (this.state.quickRxText) {
        this.setState({ loading: true });
        if (this.state.isAddedFav) {
          this.setState({ loading: false });
          Alert.alert(
            'Prescrip',
            'Prescription is already saved in Favourite list',
          );
          Keyboard.dismiss();
        } else {
          let { rxid, saveQuickRxFavourites, addAsFav } = this.props;
          let data = {
            Favourite: this.state.quickRxText,
            prescriptionId: rxid,
          };

          addAsFav(data).then((response) => {
            if (response.error) {
              switch (response.error.data) {
                case 'Network Error':
                  this.setState({
                    description: 'Currently internet is not avaliable',
                  });
                  break;
                default:
                  this.setState({
                    description: 'Error in gettting response from server',
                  });
                  break;
              }

              this.setState({
                editShow: !this.state.editShow,
                loading: false,
                showToast: true,
                toastImagePath: Images.Error,
                toastBgColor: '#d9541d',
                toastTextColor: '#fffefe',

                //   description: payload.data.msg
              });
            
              setTimeout(() => {
                this.setState({
                  showToast: false,
                });
              });
              return;
            } else if (response.payload.data.status == 1) {
              logAnalytics(
                this.props.doctorProfile.DoctorData._id,
                this.props.doctorProfile.DoctorData.DoctorFName +
                ' ' +
                this.props.doctorProfile.DoctorData.DoctorLName,
                'favorites_created',
              );
              this.setState({
                showToast: true,
                loading: false,
                toastBgColor: '#29b62f',
                toastImagePath: Images.Success,
                toastTextColor: '#fafdfa',
                isAddedFav: true,
                description: 'QuickRx Saved Successfully.',
                quickRxText: ""
              });
              this.props.showToast(
                'QuickRx Saved Successfully.',
                '#fafdfa',
                '#29b62f',
                Images.Success,
              );
              setTimeout(() => {
                this.setState({
                  showToast: false,
                });
              }, 2000);
              Keyboard.dismiss();
            //  Toast.show({ text: "Saved Successfully.", position: 'bottom' })
            }
          });
        }
      } else {
        Alert.alert('Prescrip', 'Please enter QuickRx name');
      }
    }
  }

  referName(displayname) {
    var { referName } = this.props;
    let colorCode, selectedName, suggesticon;
    switch (displayname) {
      case 'Laboratory':
        colorCode = '#f21c68';
        selectedName = referName
          ? referName.Lab
            ? referName.Lab.Name
            : null
          : null;
        suggesticon = SuggestLab_Pink_btn;
        return selectedName;
      case 'Specialist':
        colorCode = '#1DB07A';
        selectedName = referName
          ? referName.Specialist
            ? referName.Specialist.Name
            : null
          : null;
        suggesticon = Refer_Green_icon;
        return selectedName;
      case 'Pharmacy':
        colorCode = '#0aadad';
        selectedName = referName
          ? referName.Pharma
            ? referName.Pharma.Name
            : null
          : null;
        suggesticon = Refer_Green_icon;
        return selectedName;

      default:
        break;
    }
  }
  getPaymentLink(type) {
    this.props.showToast(
      'Payment Link is being generated',
      '#FFFFFF',
      '#4D99E3',
      Images.Info,
    );
    this.setState({ loading: true });
    if (this.props.doctorProfile.DoctorData.BankDetails) {
      this.setState({ loading: false });
      let age = calculateAge(
        this.props.patientvisit.patientDetails.CommonDetails.DOB,
        false,
      );
      let data = {
        doctorId: this.props.doctorProfile.DoctorData._id,
        transactionId: this.props.patientvisit.vc_trans_id,
        digiConsultationId: this.props.patientvisit.vc_consult_id,
        amount: parseFloat(this.state.consultFee.toString()).toFixed(2),
        consultFees: this.props.doctorProfile.DoctorData.ConsultFee
          ? parseFloat(
            this.props.doctorProfile.DoctorData.ConsultFee.toString(),
          ).toFixed(2)
          : 0,
        patientId: this.props.patientvisit.patientDetails.CommonDetails.id,
        patient_Id: this.props.patientvisit.patientDetails._id,
        patientName: this.props.patientvisit.patientDetails.CommonDetails
          .FullName,
        dob: this.props.patientvisit.patientDetails.CommonDetails.DOB,
        gender: this.props.patientvisit.patientDetails.CommonDetails.Gender,
        mobile: this.props.patientvisit.patientDetails.Mobile,
        whatsApp: this.props.patientvisit.patientDetails.CommonDetails.Whatsapp
          ? this.props.patientvisit.patientDetails.CommonDetails.Whatsapp
          : '',
        age: age.value + ' ' + age.units,
        remarks: this.state.remarkInput,
        patientEmail: this.props.patientvisit.patientDetails.CommonDetails
          .EmailAddress,
      };

      this.props.getPaymentLink(data).then((response) => {
        if (response.payload.data.status == 1) {
          logAnalytics(
            this.props.doctorProfile.DoctorData._id,
            this.props.doctorProfile.DoctorData.DoctorFName +
            ' ' +
            this.props.doctorProfile.DoctorData.DoctorLName,
            'shared_prescrip_paylink',
          );
          this.setState({ loading: false });
          let paylink = response.payload.data.payLink;
          this.props.setPaymentLink(paylink);
          switch (type) {
            case 'share':
              // this.onShare(1);
              this.setState({
                shareModal: true,
              });
              break;
            case 'copy':
              this.props.showToast(
                'Payment Link is copied',
                '#FFFFFF',
                '#29b62f',
                Images.Info,
              );
              Clipboard.setString(this.props.patientvisit.payment_link);
              this.setState({
                showToast: true,
                copyToast: true,
                description: 'Copied Successfully',
              });

              setTimeout(() => {
                multipleTapHandler.clearNavigator();
                this.setState({
                  copyToast: false,
                  showToast: false,
                });
              }, 2000);
              break;
          }
        } else {
          this.props.showToast(
            response.payload.data.msg,
            '#FFFFFF',
            '#d9541d',
            Images.Error,
          );
        }
      });
    } else {
      this.setState({ loading: false });
      this.props.navigation.navigate('BankDetailContainer', {
        calledFrom: 'addBankDetails',
      });
    }
  }

  navigate(type) {
    let color, newsuggestednameicon, newsuggesticon;

    switch (type) {
      case 'Laboratory':
        type = 'Laboratory';
        color = '#f21c68';
        newsuggestednameicon = Contact_btn_pink;
        newsuggesticon = Save_pink_btn;
        break;
      case 'Pharmacy':
        type = 'Pharmacy';
        color = '#0065d7';
        break;
      case 'Specialist':
        type = 'Specialist';
        color = '#1cb07a';
        newsuggestednameicon = contact_green;
        newsuggesticon = save_btn_green;
        break;
    }

    let screen = type + 'Container';
    multipleTapHandler.multitap(
      () => this.props.navigation.push(screen, { type, color }),
      screen,
    );
  }

  dropdown(index, item) {
    //  var index = this.props.route.params.item=="Prescription"?index:index+1
    //
    if (this.state.dropDownIndex == 0 && index == 0) {
      return (
        <FlatList
          data={this.state.refer}
          style={{ marginTop: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.navigate(item.title)}
              style={{
                borderTopColor: '#cccccc',
                flexDirection: 'row',
                borderTopWidth: 0.8,
                paddingVertical: 15,
              }}>
              <View
                style={{
                  flex: Platform.isPad ? 0.05 : 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={item.img}
                  style={{ resizeMode: 'contain', height: 20 }}
                />
              </View>
              <View
                style={{
                  flex: Platform.isPad ? 0.95 : 0.9,
                  justifyContent: 'center',
                }}>
                {this.referName(item.title) != null ? (
                  <Text
                    style={{
                      color: item.color,
                      fontSize: 14,
                      fontFamily: 'NotoSans',
                    }}>
                    {'Suggested ' + item.title}
                  </Text>
                ) : null}
                <Text
                  style={{
                    color: item.color,
                    fontSize: 22,
                    fontFamily: 'NotoSans',
                  }}>
                  {this.referName(item.title) == null
                    ? item.title
                    : this.referName(item.title)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      );
    } else if (this.state.dropDownIndex == 1 && index == 1) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 18,
            justifyContent: 'center',
            borderTopColor: '#cccccc',
            borderTopWidth: 0.8,
          }}>
          {this.state.share.map((item) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.sendPrescrip(
                    this.getTypeoFsend(item.title),
                    this.getNumberForsend(item.title),
                  )
                }
                style={{
                  flex: 0.25,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Image
                  source={item.img}
                  style={{ height: 50, resizeMode: 'contain' }}
                />
                <Text
                  style={{
                    color: item.color,
                    fontSize: 12,
                    fontFamily: 'NotoSans',
                    color: '#737373',
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else if (this.state.dropDownIndex == 2 && index == 2) {
      return (
        <View
          style={{
            borderTopColor: '#cccccc',
            borderTopWidth: 0.4,
            marginVertical: 18,
            paddingHorizontal: 10,
          }}>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontSize: 12, color: '#8d8d8d', fontFamily: 'NotoSans' }}>
              Consultation Type
            </Text>
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              {this.state.consultationType.map((item, ind) => {
                return item == 'First Time' || item == 'Custom' ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          consultTypeIndex: ind,
                          consultFee:
                            ind == 0
                              ? this.props.doctorProfile.DoctorData.ConsultFee
                              : ind == 1
                                ? this.props.doctorProfile.DoctorData.FollowupFee
                                  ? this.props.doctorProfile.DoctorData
                                    .FollowupFee
                                  : ''
                                : '',
                        },
                        () => {
                          this.state.consultTypeIndex == 2 ||
                            this.state.consultFee == '' ||
                            this.props.doctorProfile.DoctorData.FollowupFee == ''
                            ? this.consultInput.focus()
                            : null;
                        },
                      )
                    }
                    style={{
                      width: 95,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor:
                        this.state.consultTypeIndex == ind
                          ? '#0064d7'
                          : '#8d8d8d',
                      borderWidth: 1.2,
                      borderRadius: 6,
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'NotoSans',
                        fontSize: 16,
                        color:
                          this.state.consultTypeIndex == ind
                            ? '#0064d7'
                            : '#8d8d8d',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ) : item == 'Follow Up' &&
                  this.props.doctorProfile.DoctorData.FollowupFee ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          consultTypeIndex: ind,
                          consultFee:
                            ind == 0
                              ? this.props.doctorProfile.DoctorData.ConsultFee
                              : ind == 1
                                ? this.props.doctorProfile.DoctorData.FollowupFee
                                  ? this.props.doctorProfile.DoctorData
                                    .FollowupFee
                                  : ''
                                : '',
                        },
                        () => {
                          this.state.consultTypeIndex == 2 ||
                            this.state.consultFee == '' ||
                            this.props.doctorProfile.DoctorData.FollowupFee == ''
                            ? this.consultInput.focus()
                            : null;
                        },
                      )
                    }
                    style={{
                      width: 95,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor:
                        this.state.consultTypeIndex == ind
                          ? '#0064d7'
                          : '#8d8d8d',
                      borderWidth: 1.2,
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'NotoSans',
                        fontSize: 16,
                        color:
                          this.state.consultTypeIndex == ind
                            ? '#0064d7'
                            : '#8d8d8d',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontFamily: 'NotoSans', fontSize: 12, color: '#8d8d8d' }}>
              Consultation Amount
            </Text>
            <View style={{ justifyContent: 'space-around' }}>
              <View
                style={{
                  marginTop: 12,
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomColor: '#cccccc',
                  borderBottomWidth: 0.8,
                }}>
                <View style={{ flex: 0.2 }}>
                  <Text
                    style={{
                      fontFamily: 'NotoSans',
                      color: '#444444',
                      fontSize: 22,
                      alignSelf: 'flex-start',
                    }}>
                    {'\u20B9'}
                  </Text>
                </View>
                <View style={{ flex: 0.8, width: '100%' }}>
                  <TextInput
                    keyboardType={'numeric'}
                    ref={(ref) => (this.consultInput = ref)}
                    onFocus={() => this.setState({ focus: true })}
                    onBlur={() => this.setState({ focus: false })}
                    defaultValue={
                      this.state.consultTypeIndex == 0
                        ? this.state.consultFee.toString()
                        : this.state.consultTypeIndex == 1
                          ? this.props.doctorProfile.DoctorData.FollowupFee.toString()
                          : ''
                    }
                    style={{
                      flex: 1,
                      fontSize: 22,
                      fontFamily: 'NotoSans-Bold',
                      textAlign: 'right',
                    }}
                    onChangeText={(txt) =>
                      this.setState({
                        consultFee: txt,
                      })
                    }
                  />
                </View>

                {/* <Text style={{ fontSize: 22, fontFamily: 'NotoSans-Bold', alignSelf: 'flex-end' }} >{this.props.consultFee}</Text> */}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontFamily: 'NotoSans', fontSize: 12, color: '#8d8d8d' }}>
              Remarks
            </Text>
            <View
              style={{
                marginTop: 12,
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType={'default'}
                  ref={(ref) => (this.remarkInput = ref)}
                  defaultValue={this.state.remarkInput.toString()}
                  onFocus={() => this.setState({ focus: true })}
                  onBlur={() => this.setState({ focus: false })}
                  onChangeText={(txt) =>
                    this.setState({
                      remarkInput: txt,
                    })
                  }
                  style={{
                    flex: 1,
                    fontSize: 22,
                    fontFamily: 'NotoSans-Bold',
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 0.8,
                  }}
                />
              </View>
            </View>
          </View>

          {/* <Text>{this.props.consultFee} </Text> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',

              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              disabled={parseFloat(this.state.consultFee) > 0 ? false : true}
              onPress={() => this.getPaymentLink('copy')}
              style={{ flexDirection: 'row', alignItems: 'center', height: 35 }}>
              {this.state.loading ? (
                <ActivityIndicator size={'small'} color={'#0064d7'} />
              ) : (
                <Image
                  source={ic_content_copy}
                  style={{
                    resizeMode: 'contain',
                    height: 18,
                    tintColor:
                      parseFloat(this.state.consultFee) > 0
                        ? '#0065d7'
                        : '#a2a2a2',
                  }}
                />
              )}
              <Text
                style={{
                  textTransform: 'uppercase',
                  color:
                    parseFloat(this.state.consultFee) > 0
                      ? '#0065d7'
                      : '#a2a2a2',
                  fontFamily: 'NotoSans-Bold',
                }}>
                Copy Link
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <Button
                disabled={parseFloat(this.state.consultFee) > 0 ? false : true}
                onPress={() => this.getPaymentLink('share')}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  height: 35,
                  alignSelf: 'flex-end',
                  marginTop: 10,
                  backgroundColor:
                    parseFloat(this.state.consultFee) > 0
                      ? '#0065d7'
                      : '#a2a2a2',
                }}>
                <View style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                  {this.state.loading ? (
                    <ActivityIndicator size={'small'} color={'#0064d7'} />
                  ) : (
                    <Image
                      source={ic_content_share}
                      style={{ resizeMode: 'contain', height: 18 }}
                    />
                  )}
                  <Text
                    style={{
                      textTransform: 'uppercase',
                      color: '#fff',
                      fontFamily: 'NotoSans-Bold'
                    }}>
                    Share Link
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      );
    } else if (this.state.dropDownIndex == 3 && index == 3) {
      return (
        <View
          style={{
            borderTopColor: '#cccccc',
            borderTopWidth: 0.8,
            marginVertical: 20,
            paddingHorizontal: 10,
          }}>
          <Text style={{ marginTop: 20, color: '#444444', fontSize: 12 }}>
            Name of QuickRX
          </Text>

          <TextInput
            onChangeText={(txt) => this.setState({ quickRxText: txt })}
            defaultValue={this.state.quickRxText}
            onFocus={() => this.setState({ focus: true })}
            onBlur={() => this.setState({ focus: false })}
            onSubmitEditing={() => this.saveQuickRx()}
            style={styles.txtinput}
          />
          <Button
            onPress={() => this.saveQuickRx()}
            style={{
              borderRadius: 20,
              paddingHorizontal: 10,
              height: 35,
              alignSelf: 'flex-end',
              marginTop: 10,
              backgroundColor: '#ff402e',
            }}>
            <View style={{
              flexDirection: 'row',
              flex: 1,
            }}>
              {this.state.loading ? (
                <ActivityIndicator size={'small'} color={'#ffffff'} />
              ) : (
                <Image
                  source={ic_saveRX_icon}
                  style={{ resizeMode: 'contain', height: 20 }}
                />
              )}
              <Text
                style={{
                  textTransform: 'uppercase',
                  color: '#fff',
                  fontFamily: 'NotoSans-Bold',
                }}>
                save quick rx
              </Text>
            </View>
          </Button>
        </View>
      );
    }
  }
  sendSMS() {
    let data = {
      doctorId: this.props.doctorProfile.DoctorData._id,
      pmobile: this.props.patientmobile,
      pname: this.props.patientname,
      dname: `${this.props.doctorProfile.DoctorData.DoctorFName} ${this.props.doctorProfile.DoctorData.DoctorLName}`,
      plink: this.props.patientvisit.prescription.url,
    };

    this.props.sendRxSMS(data).then((response) => {
      this.resetRefer();
    });
  }
  resetRefer() {

    this.props.done();


  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.shareModal}
          ref={'meal'}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
            behavior={Platform.OS == 'ios' ? 'padding' : null}>
            <View
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}>
              {/*Close Button*/}
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    shareModal: false,
                  })
                }
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#ffffff',
                    fontFamily: 'NotoSans-Bold',
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
              {/*Close Button Ends*/}

              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                {this.state.share.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.sendPrescrip1(
                          this.getTypeoFsend(item.title),
                          this.getNumberForsend(item.title),
                        )
                      }
                      style={{
                        flex: 0.25,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Image
                        source={item.img}
                        style={{ height: 50, resizeMode: 'contain' }}
                      />
                      <Text
                        style={{
                          color: item.color,
                          fontSize: 12,
                          fontFamily: 'NotoSans',
                          color: '#737373',
                        }}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <View
          style={{ flex: 1 }}
        >
          <ImageBackground source={ic_Blue_BG_578} style={styles.bgimg}>
            <View
              style={{
                flex: 0.3,
                justifyContent: 'center',
                alignItems: 'center', width: Dimensions.get('window').width
              }}>
              <LottieView
                style={styles.lott}
                source={success_tick}
                loop={false}
                autoPlay={true}
                ref={this.animation}
              />
              <Text style={styles.save}>
                {`${this.props.route.params.item} Saved Successfully`}{' '}
              </Text>
              <Text style={styles.name}>
                {' '}
                {`for ${this.props.patientname} ( ${this.props.patientmobile} )`}
              </Text>
            </View>
            {/* //this.state.focus?0.7:0.6 */}
            <View style={[{ flex: 0.7 }, styles.flatl]}>
              <FlatList
                ref="flatList"
                automaticallyAdjustKeyboardInsets={true}
                keyboardVerticalOffset={
                  Platform.select({
                    ios: () => 0,
                    android: () => 100
                  })
                }
                keyboardShouldPersistTaps={'always'}
                data={this.props.data}
                renderItem={({ index, item }) => this.itemView(index, item)}
                extraData={this.state}
              />

              {/* {!this.state.focus ? <TouchableWithoutFeedback disabled={this.props.loading} onPress={() => { this.resetRefer() }}>
                                <Text style={styles.done}>Done</Text>
                            </TouchableWithoutFeedback> : null} */}
              {!this.state.focus ? (
                <View
                  style={{

                    justifyContent: 'center',
                    width: '95%', backgroundColor: '#fff',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity onPress={() => this.sendSMS()}>
                    <LinearGradient
                      colors={['#1b7cdb', '#07cdf2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      locations={[0, 0.8]}
                      style={{
                        width: '95%',
                        flexDirection: 'column',
                        height: 55,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 25,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 17,
                          color: '#f9fcfe',
                          fontFamily: 'NotoSans',
                          marginRight: 5,
                        }}>
                        DONE
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 15,
                          color: '#f9fcfe',
                          fontFamily: 'NotoSans',
                          marginRight: 5,
                        }}>
                        Send the Prescription via SMS
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.resetRefer();
                    }}
                    style={{ marginVertical: 20 }}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        textDecorationColor: '#757575',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#757575',
                        fontFamily: 'NotoSans-Bold',
                        marginRight: 5,
                      }}>
                      Proceed
                    </Text>
                  </TouchableOpacity>
                  {/* <Accordion dataArray={this.props.data} expanded={0}/> */}
                </View>
              ) : null}
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  consultFee: state.doctorProfile.DoctorData.ConsultFee,
  patientvisit: state.patientvisit,
  referName: state.patientvisit.referName,
  certificates: state.certificates,
  patientname: state.patientvisit.patientDetails.CommonDetails.FullName,
  patientmobile: state.patientvisit.patientDetails.Mobile,
  patientmail: state.patientvisit.patientDetails.CommonDetails.EmailAddres,
  rxid: state.patientvisit.prescription._id,
});

const mapDispatchToProps = (dispatch) => ({
  saveQuickRxFavourites: (patientvisitid, data) =>
    dispatch(saveQuickRxFavourites(patientvisitid, data)),
  setlab: (Name) => dispatch(setlab(Name)),
  addAsFav: (data) => dispatch(addAsFav(data)),
  sendRxSMS: (data) => dispatch(sendRxSMS(data)),
  addToFavourite: (data) => dispatch(addToFavourite(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FinalPrescription);

const styles = StyleSheet.create({
  bgimg: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 40 / 100,
    resizeMode: 'cover',
  },
  button: {
    width: '70%',
    height: 45,
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 17,
    color: '#ffffff',
    fontFamily: 'NotoSans-Bold',
  },
  lott: { resizeMode: 'contain', height: 100, alignSelf: 'center' },
  save: { color: '#ffffff', fontFamily: 'NotoSans-Bold', fontSize: 20 },
  name: { color: '#ffffff', fontSize: 14 },
  flatl: {
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 10,
  },
  txtinput: {
    fontSize: 25,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.8,
    fontFamily: 'NotoSans-Bold',
    color: '#444444',
  },
  done: {
    alignSelf: 'flex-end',
    fontFamily: 'NotoSans',
    color: '#0065d7',
    fontSize: 20,
    margin: 10,
  },
  itemview: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
    borderRightColor: '#cccccc',
    borderRightWidth: 1,
    borderRadius: 10,
    margin: 12,
  },
  cardcont: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtls: { fontFamily: 'NotoSans', fontSize: 13, color: '#636363', marginLeft: 5 },
});
