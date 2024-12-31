import React, { Component } from 'react';
import Capsule from '../Capsule';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from '../../constants/font';
import multipleTapHandler from '../../components/MultiTapHandle/index';

import {
  ic_Close_Button,
  ic_blue_search,
  Add_blue_btn,
  ic_arrow_decrease,
  ic_arrow_increase,
} from '../../constants/images';
import {
  ic_upload_image_inactive,
  ic_upload_image_tab_active,
  Spec_Check_Active,
  Spec_Check_Non_Active,
} from '../../constants/images';
import _ from 'lodash';
//Custom UI for Therapy Duration
export default class TherapyDuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: [],
      isChecked: false,
      btnIndex: -1,
      done: false,
      startFromDay: '',
      showFromModal: false,
      showLanguage: false,
      searchText: '',
      language: this.props.patientvisit.prescription.Language,
      remarks: this.props.dosage.medicine.remarks
        ? this.props.dosage.medicine.remarks
        : '',

      startFrom: [
        {
          type: 'Today',
          select: true,
          show: true,
        },
        {
          type: '',
          select: false,
          show: false,
        },
        {
          type: 'Tomorrow',
          select: false,
          show: true,
        },
        {
          type: 'More Options',
          select: false,
          show: true,
        },
        {
          type: '2 Days',
          select: false,
          show: false,
        },
        {
          type: '3 Days',
          select: false,
          show: false,
        },
        {
          type: '4 Days',
          select: false,
          show: false,
        },
        {
          type: '5 Days',
          select: false,
          show: false,
        },
        {
          type: '6 Days',
          select: false,
          show: false,
        },
        {
          type: '7 Days',
          select: false,
        },
        {
          type: '8 Days',
          select: false,
          show: false,
        },
        {
          type: '9 Days',
          select: false,
          show: false,
        },
        {
          type: '10 Days',
          select: false,
          show: false,
        },
      ],
    };
    this.durationIndex = 4;
    this.Duration = [];
    this.Master = [];
    this.Recents = [];
    this.Languages = [];
    this.mostUsed = [];
    this.LastCloudSync = null;
    this.medicine = null;
    this.suggestedDuration = [];
    this.db = this.props.databaseContext.db;
  }
  //Search for Duration
  searchDuration(txt) {
    if (txt) {
      this.setState({ searchText: txt });
      let searchData = this.Duration.filter((item) => {
        if (item.toLowerCase().startsWith(txt.toLowerCase())) {
          return item;
        }
      });
      //Show MostUsed on top
      let suggested =
        this.mostUsed.length > 0
          ? _.orderBy(this.mostUsed, [(reg) => reg[1]], ['asc'])
          : [];
      suggested = suggested.filter((s) => {
        if (s[0] != '') {
          return s;
        }
      });
      suggested.map((s) => {
        let duration = searchData;
        searchData.forEach(function (item, i) {
          item.trim();
          if (item === s[0]) {
            duration.splice(i, 1);
            duration.unshift(item);
          }
        });
        searchData = duration;
        duration = null;
      });
      let duration = [...searchData];
      duration = _.uniqBy(duration, (item) => {
        return item;
      });
      searchData = [...duration];
      duration = null;

      suggested = null;
      let is_avail = searchData.findIndex((item) => {
        if (item.trim().toLowerCase() == txt.trim().toLowerCase()) {
          return item;
        }
      });
      this.setState({
        duration: searchData,
        txtDuration: txt,
        add: is_avail > -1 ? false : true,
      });
    } else {
      this.setState({
        duration: this.Duration,
        txtDuration: txt,
        searchText: '',
        add: false,
      });
    }
  }
  //Show Modal
  showModal() {
    this.setState({
      showFromModal: true,
      add: false,
      txtDuration: '',
    });
  }
  //Close Modal
  closeModal() {
    let medicine = this.props.dosage.medicine;
    medicine.startfrom = '';
    this.props.setMedicine(medicine, null);
    this.setState({
      showFromModal: false,
      showLanguage: false,
      done: true,
    });
  }
  //Set Start From
  setDay(day, day_index) {
    // let visibleDays=this.state.startFrom.filter((day,index)=>{
    //     if(day.show){
    //         return day
    //     }
    // });
    this.refs.remarks.blur();
    let froms = [];
    if (day.type == 'More Options') {
      froms = this.state.startFrom.map((item, index) => {
        if (index == 1) {
          item.type = '';
          item.show = false;
          item.select = false;
        } else if (item.type == 'More Options') {
          item.show = false;
        } else {
          item.show = true;
          item.select = false;
        }
        return item;
      });
    } else if (day.type == 'Today' || day.type == 'Tomorrow') {
      froms = this.state.startFrom.map((item, index) => {
        if (item.type == day.type) {
          item.select = true;
          item.show = true;
        } else if (item.type == 'More Options') {
          item.show = true;
        } else {
          item.select = false;
          item.show = false;
        }
        return item;
      });
      froms[0].show = true;
      froms[2].show = true;
    } else {
      froms = this.state.startFrom.map((item, index) => {
        if (index == 1) {
          item.type = day.type;
          item.select = true;
          item.show = true;
        } else if (index == 2) {
          item.show = false;
        } else if (index == day_index) {
          item.show = false;
        } else if (index > 3) {
          item.show = false;
        } else {
          item.show = true;
        }
        return item;
      });
    }

    this.setState({
      startFrom: froms,
    });
  }
  renderRemarks() {
    return (
      <View style={{ width: '100%' }}>
        <Text style={{ fontFamily: NotoSans, color: '#8b8b8b', fontSize: 15 }}>
          Remark(s)
        </Text>
        <TouchableWithoutFeedback>
          <TextInput
            multiline={true}
            ref={'remarks'}
            returnKeyType={'done'}
            onFocus={() => this.collapseStartFrom()}
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(txt) => {
              this.setState({
                remarks: txt,
              });
            }}
            autoCorrect={false}
            value={this.state.remarks}
            style={{
              borderBottomColor: '#8b8b8b',
              borderBottomWidth: 0.7,
              width: '100%',
              fontFamily: NotoSans,
              fontSize: 24,
              color: '#242424',
              paddingVertical: 5,
              marginVertical: 5,
            }} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
  renderLanguageSelection() {
    return (
      <View style={{ width: '100%', marginVertical: 10 }}>
        <Text style={{ fontFamily: NotoSans, color: '#8b8b8b', fontSize: 15 }}>
          Language
        </Text>
        <TouchableOpacity
          onPress={() => {
            this.showLanguages();
          }}
          style={{
            flexDirection: 'row',
            borderBottomColor: '#8b8b8b',
            borderBottomWidth: 0.7,
            width: '100%',
            paddingVertical: 5,
            marginVertical: 5,
            justifyContent: 'space-between',
          }}>
          <Text style={{ fontFamily: NotoSans, fontSize: 24, color: '#242424' }}>
            {this.state.language}
          </Text>
          <Image
            source={ic_arrow_decrease}
            style={{
              width: 20,
              height: 20,
              alignSelf: 'flex-end',
              paddingHorizontal: 5,
            }}
            resizeMode={'contain'}></Image>
        </TouchableOpacity>
      </View>
    );
  }
  renderDays() {
    let days = this.state.startFrom.map((day, index) => {
      if (day.type && day.show) {
        return (
          <TouchableOpacity
            keyboardShouldPersistTaps="handled"
            onPress={() => this.setDay(day, index)}
            style={{
              margin: 3,
              backgroundColor: day.select ? '#0065d7' : '#ffffff',
              alignSelf: 'baseline',
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,

              elevation: 4,
            }}>
            <Text
              style={{
                color: day.select ? '#ffffff' : '#0065d7',
                paddingHorizontal: 20,
                paddingVertical: 10,
                textAlign: 'center',
              }}>
              {day.type}
            </Text>
          </TouchableOpacity>
        );
      }
    });

    return days;
  }
  collapseStartFrom() {
    let froms = this.state.startFrom.map((from, index) => {
      from.show = index > 3 ? false : true;
      if (index == 2) {
        from.show = false;
      }
      return from;
    });
    this.setState({
      startFrom: froms,
    });
  }
  showLanguages() {
    this.setState({
      showLanguage: true,
      showFromModal: false,
    });
  }
  closeLangModal() {
    this.setState({
      showLanguage: false,
      showFromModal: true,
    });
  }
  setLangauage(lang, index) {
    //this.closeLangModal();
    //return;

    let newPrescription = this.props.patientvisit.prescription;
    newPrescription.PrescriptionList.map((itm) => {
      itm.Remarks = this.createRemarks(itm, lang.Name);
      this.props.setPrescription(newPrescription);
    });

    this.setState({
      showLanguage: false,
      showFromModal: true,
      language: lang.Name,
      remarks: this.createRemarks(this.medicine, lang.Name),
    });
    setTimeout(() => {
      let prescription = this.props.patientvisit.prescription;
      prescription.Language = lang.Name;
      this.props.setPrescription(prescription);
      prescription = null;
    }, 500);
  }

  renderLangModal() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 15,
            width: '80%',

            height: '80%',
          }}>
          <TouchableOpacity
            onPress={() => this.closeLangModal()}
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              top: -10,
              right: -11,
              elevation: 12,
              zIndex: 1,
            }}>
            <Image
              source={ic_Close_Button}
              style={{ height: 23, width: 23, resizeMode: 'contain' }}
            />
            {/* <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> */}
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: NotoSans,
              fontSize: 22,
              color: '#242424',
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Select Language
          </Text>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#cdcdcd',
              marginBottom: 5,
            }}></View>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}>
            {this.renderLanguage()}
          </ScrollView>
        </View>
      </View>
    );
  }
  renderLanguage() {
    let langView = [];
    langView = this.Languages.map((lang, index) => {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setLangauage(lang, index);
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
                  lang.Name == this.state.language
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
              {lang.Name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
    return langView;
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    this.getSuggestedData();
    this.getDoseDuration();
    this.getMostUsed();
    this.getLanguages();
  }
  //Set Duration
  setDuration(item, index) {
    let medicine = this.props.dosage.medicine;
    medicine.duration = [item, index];
    this.toggleModal();
    this.props.setMedicine(medicine, null);
    this.props.setCurrentDosageView('Duration');
    let medObj = {
      Srno: parseInt(medicine.form[1]),
      DosageForms: medicine.form[0],
      BrandName: medicine.brand[1],
      Dose: medicine.dose[0] ? medicine.dose[0] : '',
      Generic: medicine.brand[0] ? medicine.brand[0] : '',
      DoseRegimen: medicine.regimen[0] ? medicine.regimen[0][0] : '',
      Therapy: medicine.duration[0] ? medicine.duration[0] : '',
      Intake: medicine.schedule ? medicine.schedule : '',
      StartFrom: medicine.startfrom ? medicine.startfrom : '',

      Remarks: '', //Create Logic for remarks ref. v2
      DosageReminder: medicine.reminder,
    };
    this.medicine = medObj;
    let remarks =
      this.createRemarks(
        medObj,
        this.props.patientvisit.prescription.Language,
      );

    this.setState({
      remarks: remarks,
    });
    this.showModal();
  }

  //Add New Therapy
  addNewTherapy() {
    let data = {
      DoctorId: this.props.doctorProfile.DoctorData._id,
      key: 'DoseTherapy',
      newData: this.state.txtDuration,
      lastCloudSync: this.LastCloudSync ? this.LastCloudSync : '',
    };
    this.props.add_custom_data(data).then((response) => {
      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(data.key, this.state.txtDuration, false);
      }
    });
  }

  //Update DB
  updateRecentDb(key, value, isDelete) {
    let therapy_index = -1;
    if (isDelete) {
      therapy_index = this.Recents.findIndex((item) => {
        if (item.trim() == value.trim()) {
          return item;
        }
      });
      if (therapy_index > -1) {
        this.Recents.splice(therapy_index, 1);
      }
    } else {
      this.Recents.unshift(value);
    }
    this.db.transaction((tx) => {
      let query =
        'UPDATE Recents SET ' +
        key +
        " = '" +
        JSON.stringify(this.Recents).replace(/\'/g, "''") +
        "', LastCloudSync= " +
        JSON.stringify(this.LastCloudSync) +
        " where DoctorID ='" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(query, [], (tx, results) => {
        if (isDelete) {
          therapy_index = this.Duration.findIndex((item) => {
            if (item.trim() == value.trim()) {
              return item;
            }
          });
          if (therapy_index > -1) {
            this.Duration.splice(therapy_index, 1);
          }
          let duration_new = [...this.state.duration];
          duration_new = duration_new.filter((d) => {
            if (d.trim() != value.trim()) {
              return d;
            }
          });
          if (duration_new.length > 0) {
            this.setState(
              {
                duration: [...duration_new],
              },
              () => {
                duration_new = null;
              },
            );
          } else {
            this.setState({
              duration: this.Duration,
            });
          }
        } else {
          this.Duration.unshift(value);

          this.setState(
            {
              duration: this.Duration,
            },
            () => {
              this.setDuration(value, 0);
            },
          );
        }
      });
    });
  }

  //ConfrimDelete

  confrimDelete(item) {
    if (this.Recents.includes(item)) {
      Alert.alert('Prescrip', `Do you want to delete ${item}`, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.deleteDuration(item) },
      ]);
    } else {
      Alert.alert('Prescrip', `Cannot delete ${item}`);
    }
  }

  //Delete Duration
  deleteDuration(item) {
    let doctor_id = this.props.doctorProfile.DoctorData._id;
    let data = {
      Key: 'DoseTherapy',
      value: item,
      DoctorId: doctor_id,
      brandName: '',
      doseForm: '',
      brandRemoving: false,
      doseRemoving: false,
    };
    // console.log(data);
    this.props.delete_custom_data(data).then((response) => {
      // console.log(response);
      if (response.payload.data.status == 1) {
        this.LastCloudSync = response.payload.data.LastCloudSync;
        this.updateRecentDb(data.Key, data.value, true);
      }
    });
  }

  //Render Regimen
  renderDuration(item, index) {
    return (
      <Capsule
        color={'#0065d7'}
        text={item}
        onLongClick={() => this.confrimDelete(item)}
        onClick={() => {
          this.setDuration(item, index);
        }}
      />
    );
  }
  setStartFrom() {
    let startFrom = this.state.startFrom.find((s) => {
      if (s.select) {
        return s;
      }
    });

    let medicine = this.props.dosage.medicine;
    medicine.startfrom = startFrom ? startFrom.type : '';
    this.props.setMedicine(medicine, null);
    this.setState(
      {
        done: true,
        showFromModal: false,
      },
      () => {
        multipleTapHandler.multitap(() => this.showList(), 'ListMedication');
      },
    );
  }
  createRemarks(medicine, selectedlang) {
    let val = medicine.Therapy;
    const self = this;
    let languages = this.Languages; //this.props.patientvisitdetails;

    let mealValue = '',
      flowStatment = '',
      Meal = medicine.Intake.split(' ')[0],
      DoseFormValue = medicine.DosageForms,
      BrandGenericName = medicine.Generic, //need this
      DoseValue = medicine.Dose,
      NofDaysValue = medicine.StartFrom,
      DoseRegimeValue = medicine.DoseRegimen,
      therapySelected = val,
      brandSelected = medicine.BrandName;
    var stm = '';
    var regimes = Meal + ' ';
    //DoseRegimeValue = DoseRegimeValue.split(' ').join('')

    if (DoseRegimeValue == '1/2 - 0 - 0') {
      DoseRegimeValue = '1-0-0';
    } else if (DoseRegimeValue == '0 - 1/2 - 0') {
      DoseRegimeValue = '0-1-0';
    } else if (DoseRegimeValue == '0 - 0 - 1/2') {
      DoseRegimeValue = '0-0-1';
    } else if (DoseRegimeValue == '0 - 1/2 - 1/2') {
      DoseRegimeValue = '0-1-1';
    } else if (DoseRegimeValue == '1/2 - 1/2 - 0') {
      DoseRegimeValue = '1-1-0';
    } else if (DoseRegimeValue == '1/2 - 0 - 1/2') {
      DoseRegimeValue = '1-0-1';
    } else if (
      DoseRegimeValue == '1/2 - 1/2 - 1/2' ||
      DoseRegimeValue == '2-1-1'
    ) {
      DoseRegimeValue = '1-1-1';
    }

    switch (DoseRegimeValue) {
      case '1-0-0':
        regimes = regimes + 'breakfast';
        break;

      case '0-1-0':
        regimes = regimes + 'lunch';
        break;

      case '0-0-1':
        regimes = regimes + 'dinner';
        break;

      case '1-1-0':
        regimes = regimes + 'breakfast + ' + regimes + 'lunch';
        break;

      case '0-1-1':
        regimes = regimes + 'lunch + ' + regimes + 'dinner';
        break;

      case '1-0-1':
        regimes = regimes + 'breakfast + ' + regimes + 'dinner';
        break;

      case '1-1-1':
        regimes =
          regimes + 'breakfast + ' + regimes + 'lunch + ' + regimes + 'dinner';
        break;

      case '1-1-1-1':
        regimes = 'Four times a day (1-1-1-1)';
        break;
      case '1-1-1-1-1':
        regimes = 'Five times a day (1-1-1-1-1)';
        break;
      case '1-1-1-1-1-1':
        regimes = 'Six times a day (1-1-1-1-1-1)';
        break;
      case '1-1-1-1-1-1':
        regimes = 'Six times a day (1-1-1-1-1-1)';
        break;

      // case 'SOS':
      //     regimes = 'Six times a day (1-1-1-1-1-1)';
      //     break;
      default:
        regimes = DoseRegimeValue;
    }

    if (DoseFormValue === 'Injection' || DoseFormValue === 'Infusion') {
      flowStatment = 'Injection/Infusion';
      stm = 'As directed by the physician';
    } else if (
      DoseFormValue === 'Powder (Topical)' ||
      DoseFormValue === 'Cream' ||
      DoseFormValue === 'Ointment' ||
      DoseFormValue === 'Lotion' ||
      DoseFormValue === 'Gel' ||
      DoseFormValue === 'Shampoo' ||
      DoseFormValue === 'Soap/Bar'
    ) {
      flowStatment = 'PowderTopical';
      stm =
        'To be applied (topically) as directed by the physician(Not to be consumed orally)';
    } else if (
      DoseFormValue === 'Drop' ||
      DoseFormValue === 'Nasal Drops' ||
      DoseFormValue === 'Ear Drops' ||
      DoseFormValue === 'Eye Drops' ||
      DoseFormValue === 'Oral Drops'
    ) {
      flowStatment = 'Drop';
      stm = 'As directed by the Physician';
    } else if (DoseFormValue === 'Inhaler' || DoseFormValue === 'Rotacap') {
      flowStatment = 'Inhaler/Rotacap';
      stm = 'As directed by the Physician';
    } else if (
      DoseFormValue === 'Other' ||
      DoseFormValue === 'Nebulizer' ||
      DoseFormValue === 'Powder (Oral)'
    ) {
      stm = 'As directed by the Physician';
    } else {
      //stm = regimes
    }
    if (Meal == 'NA') {
      regimes = 'As advised by Physician';
    }
    selectedlang = selectedlang || 'English';
    selectedlang = languages.filter((i) => i.Name == selectedlang)[0];
    stm = stm.replace('BrandName', medicine.BrandName);
    stm = stm.replace('DoseForm', medicine.DosageForms);
    stm = stm.replace('DoseValue', medicine.Dose);
    stm = stm.replace('Regime', medicine.DoseRegimen);
    stm = stm.replace('Therapy', medicine.Therapy);
    var sen_eng = languages[0].Sentences.toString().toLowerCase().split(',');
    var rep_eng = languages[0].Replacements.toString().toLowerCase().split(',');
    if (stm == '') {
      stm = regimes.toLowerCase();
    }

    if (selectedlang && selectedlang.Name != 'English') {
      stm = stm.toLowerCase();

      sen_eng.map((i) => {
        if (stm.indexOf(i) != -1) {
          stm = stm.replace(i, selectedlang.Sentences[sen_eng.indexOf(i)] || i);
        }
      });
      rep_eng.map((i, index) => {
        if (stm.indexOf(i) != -1) {
          stm = stm.replace(i, selectedlang.Replacements[index]);
          stm = stm
            .split('')
            .map((j) => j.replace(i, selectedlang.Replacements[index]))
            .join('');
        }
      });
    }

    return stm;
  }

  getAll() {
    if (this.state.searchText) {
      return;
    } else {
      this.setState({
        duration: this.Duration,
        txtDuration: '',
        add: false,
      });
    }
  }
  showList() {
    let medicine = this.props.dosage.medicine;

    let medicineList = [
      ...this.props.patientvisit.prescription.PrescriptionList,
    ];
    let medObj = {
      Srno: parseInt(medicine.form[1]),
      DosageForms: medicine.form[0],
      BrandName: medicine.brand[1],
      Dose: medicine.dose[0] ? medicine.dose[0] : '',
      Generic: medicine.brand[0] ? medicine.brand[0] : '',
      DoseRegimen: medicine.regimen[0] ? medicine.regimen[0][0] : '',
      Therapy: medicine.duration[0] ? medicine.duration[0] : '',
      Intake: medicine.schedule ? medicine.schedule : '',
      StartFrom: medicine.startfrom ? medicine.startfrom : '',

      Remarks: this.state.remarks, //Create Logic for remarks ref. v2
      DosageReminder: medicine.reminder,
    };
    medObj['Remarks'] = this.state.remarks
      ? this.state.remarks
      : this.createRemarks(
        medObj,
        this.props.patientvisit.prescription.Language,
      );
    let index = medicineList.findIndex((item) => {
      if (item.BrandName == medObj.BrandName) {
        return item;
      }
    });
    if (this.props.dosage.medicine.editIndex > -1) {
      medicineList[this.props.dosage.medicine.editIndex] = medObj;
    } else {
      medicineList.push(medObj);
    }

    let prescrpition = this.props.patientvisit.prescription;
    prescrpition.PrescriptionList = [...medicineList];
    this.props.setPrescription(prescrpition);
    this.props.addToPrescription(medicineList);
    this.props.setCurrentDosageView('Dosage Form');
    this.props.navigation.pop();
    this.props.navigation.navigate('ListMedication');
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    return (
      <View style={{ flex: 1 }}>
        {/*Search View*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: '#d1d1d1',
            borderRadius: 5,
            borderWidth: 2,
            marginVertical: 10,
            marginHorizontal: 20,
          }}>
          <TextInput
            style={{
              flex: 0.9,
              fontSize: 16,
              fontFamily: NotoSans,
              paddingHorizontal: 5,
              paddingVertical: 10,
            }}
            autoCorrect={false}
            value={this.state.txtDuration}
            placeholder={'Search for ' + this.props.dosage.currentView}
            onChangeText={(text) => this.searchDuration(text)}
            onFocus={() => this.getAll()} />
          <View style={{ flex: 0.1 }}>
            <Image
              source={ic_blue_search}
              style={{
                width: 20,
                height: 20,
                alignSelf: 'center',
                paddingHorizontal: 5,
              }}
              resizeMode={'contain'}></Image>
          </View>
        </View>

        {/*Search View Ends*/}
        {this.state.add ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
              marginHorizontal: 20,
            }}>
            <View style={{ flexDirection: 'column', flex: 0.9 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#0065d7',
                  fontFamily: 'NotoSans-Bold',
                }}>
                {this.state.txtDuration}
              </Text>
              {
                <Text
                  style={{
                    fontSize: 11,
                    color: '#0065d7',
                    fontFamily: 'NotoSans',
                    paddingTop: 5,
                  }}>
                  Add as {this.props.dosage.currentView}
                </Text>
              }
            </View>
            <TouchableOpacity
              disabled={!this.state.add}
              style={{ flex: 0.1 }}
              onPress={() => {
                this.addNewTherapy();
              }}>
              <Image
                source={this.state.add ? Add_blue_btn : ic_blue_search}
                style={{
                  width: 35,
                  height: 35,
                  alignSelf: 'center',
                  paddingHorizontal: 5,
                }}
                resizeMode={'contain'}></Image>
            </TouchableOpacity>
          </View>
        ) : null}
        {/*Language Modal*/}
        <Modal
          animationType="fade"
          visible={this.state.showLanguage}
          ref={'language'}
          style={{}}
          transparent={false}>
          {this.renderLangModal()}
        </Modal>
        {/*Ends*/}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showFromModal}
          ref={'from'}>
          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            {/*Close Button*/}
            <TouchableOpacity
              onPress={() => this.closeModal()}
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
            {/*Modal View*/}
            <KeyboardAvoidingView
              behavior={Platform.select({ android: undefined, ios: 'padding' })}
              enabled={Platform.OS == 'android' ? false : true}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderTopLeftRadius: 15,
                  borderTopEndRadius: 15,
                  // padding: 20,
                  width: '100%',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'flex-start',
                    width: '100%',
                    padding: 20,
                  }}>
                  {/** Title */}
                  <Text
                    style={{
                      color: '#000000',
                      fontFamily: NotoSans,
                      fontSize: 20,
                    }}>
                    {'When should the medication start from ?'}
                  </Text>
                  {/** Options View */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginVertical: 10,
                      flexWrap: 'wrap',
                    }}>
                    {this.renderDays()}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginVertical: 10,
                      flexWrap: 'wrap',
                    }}>
                    {this.renderRemarks()}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginVertical: 10,
                      flexWrap: 'wrap',
                    }}>
                    {this.renderLanguageSelection()}
                  </View>

                  {/*NEXT Button*/}
                  <TouchableOpacity
                    onPress={() => {
                      this.setStartFrom();
                    }}>
                    <LinearGradient
                      colors={['#1b7cdb', '#07cef2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      locations={[0, 0.8]}
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        alignSelf: 'center',
                        borderRadius: 25,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 17,
                            color: '#ffffff',
                            fontFamily: 'NotoSans-Bold',
                            marginEnd: 5,
                          }}>
                          NEXT
                        </Text>
                        {this.state.loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : null}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/*** Ends */}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <FlatList
          style={{ marginBottom: 10 }}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          data={this.state.duration.slice(0, 50)}
          renderItem={({ item, index }) => this.renderDuration(item, index)}
          extraData={this.state}></FlatList>
        <TouchableOpacity
          onPress={() =>
            multipleTapHandler.multitap(() => this.showList(), 'ListMedication')
          }>
          <LinearGradient
            colors={
              this.state.done ? ['#29b62f', '#07d611'] : ['#1b7cdb', '#07cef2']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.8]}
            style={{
              flexDirection: 'row',
              width: '90%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              alignSelf: 'center',
              borderRadius: 25,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: '#ffffff',
                  fontFamily: 'NotoSans-Bold',
                  marginEnd: 5,
                }}>
                {this.state.done ? 'DONE' : 'NEXT'}
              </Text>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  //Get Languages from Local DB
  getLanguages() {
    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT DATA FROM MasterData where Srno =17',
        [],
        (tx, results) => {
          let DataValue1 = results.rows.raw()[0];
          let values = JSON.parse(DataValue1.Data);

          this.Languages = values.Value;
        },
        (error) => { },
      );
    });
  }

  //Get Most Used
  getMostUsed() {
    let query = `SELECT DoseTherapy from MostUsed where DoctorId='${this.props.doctorProfile.DoctorData._id}'`;

    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(query, [], (tx, result) => {
        let data = result.rows.raw()[0];
        this.mostUsed = data.DoseTherapy ? JSON.parse(data.DoseTherapy) : [];
        this.mostUsed =
          this.mostUsed.length > 0
            ? _.orderBy(this.mostUsed, [(reg) => reg[1]], ['asc'])
            : [];
      });
    });
  }

  //Get Suggested Data
  getSuggestedData() {
    let suggestedPromise = new Promise((resolve, reject) => {
      this.props.databaseContext.db.transaction((tx) => {
        let brand = this.props.dosage.medicine.brand[1];
        let dose = this.props.dosage.medicine.dose[0]
          ? this.props.dosage.medicine.dose[0]
          : '';
        let query = `SELECT * from Suggestions where DoctorId='${this.props.doctorProfile.DoctorData._id}' and BrandName='${brand}' and Dose='${dose}'`;

        tx.executeSql(query, [], (tx, result) => {
          let data = result.rows.raw();

          resolve(data);
        });
      });
    });
    suggestedPromise.then((result) => {
      let dbData = result.map((item) => {
        return JSON.parse(item.Data);
      });

      let medicine = this.props.dosage.medicine;
      let regimen = medicine.regimen[0] ? medicine.regimen[0][0] : '';
      let filterData = dbData[0].filter((item) => {
        if (
          item[0] === this.props.dosage.medicine.form[0] &&
          item[1] == regimen &&
          item[2] != ''
        ) {
          return item;
        }
      });
      if (Array.isArray(filterData) && filterData.length > 0) {
        this.suggestedDuration = _.orderBy(filterData, [(r) => r[3]], ['asc']);
      }
    });
  }

  //Get Dose Duration from Local DB
  getDoseDuration() {
    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql(
        'SELECT DATA FROM MasterData where Srno = ' + this.durationIndex,
        [],
        (tx, results) => {
          let DataValue1 = results.rows.raw()[0];
          let values = JSON.parse(DataValue1.Data);

          this.Duration = values;
          this.getRecentTherapy();
        },
        (error) => { },
      );
    });
  }

  getRecentTherapy() {
    this.db.transaction((tx) => {
      let query =
        "SELECT DoseTherapy,LastCloudSync from Recents where DoctorID= '" +
        this.props.doctorProfile.DoctorData._id +
        "'";

      tx.executeSql(
        query,
        [],
        (tx, results) => {
          let recents = results.rows.raw()[0];
          this.Recents = JSON.parse(recents.DoseTherapy);

          this.LastCloudSync = recents.LastCloudSync;

          if (this.Recents.length > 0) {
            this.Duration = [...this.Recents, ...this.Duration];
          }

          //Show suggestions first
          let suggested = [];
          if (this.suggestedDuration.length > 0) {
            suggested = this.suggestedDuration;

            suggested.map((s) => {
              let duration = this.Duration;
              this.Duration.forEach(function (item, i) {
                item.trim();
                s[2].trim();
                if (item === s[2]) {
                  duration.splice(i, 1);
                  duration.unshift(item);
                }
              });
              this.Duration = duration;
              duration = null;
            });
            let duration = [...this.Duration];
            duration = _.uniqBy(duration, (item) => {
              return item;
            });
            this.Duration = [...duration];
            duration = null;
            let len = this.suggestedDuration.length
              ? this.suggestedDuration.length
              : this.Duration.length;
            suggested = null;

            this.setState({
              duration: this.Duration.slice(0, len),
            });
          } else {
            //Show MostUsed on top
            suggested =
              this.mostUsed.length > 0
                ? _.orderBy(this.mostUsed, [(reg) => reg[1]], ['asc'])
                : [];
            suggested = suggested.filter((s) => {
              if (s[0] != '') {
                return s;
              }
            });
            suggested.map((s) => {
              let duration = this.Duration;
              this.Duration.forEach(function (item, i) {
                item.trim();
                if (item === s[0]) {
                  duration.splice(i, 1);
                  duration.unshift(item);
                }
              });
              this.Duration = duration;
              duration = null;
            });
            let duration = [...this.Duration];
            duration = _.uniqBy(duration, (item) => {
              return item;
            });
            this.Duration = [...duration];
            duration = null;
            let len = suggested.length
              ? suggested.length
              : this.Duration.length;
            suggested = null;

            this.setState({
              duration: this.Duration.slice(0, len),
            });
          }
        },
        (error) => { },
      );
    });
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
});
