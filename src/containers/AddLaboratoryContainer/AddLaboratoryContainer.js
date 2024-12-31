//   code by ravi
import React, { Component } from "react"
import { View, TouchableOpacity, Image, StatusBar, Dimensions, TextInput, ScrollView, Platform, StyleSheet, BackHandler, ActivityIndicator } from 'react-native'
import { Container, Text, Input, } from 'native-base'
import AddLaboratoryComponent from '../../components/AddLaboratoryComponent/AddLaboratoryComponent'
import { ic_close_button, Save_pink_btn, save_btn_green, save_blue_btn } from '../../constants/images'
import { connect } from "react-redux";
import Images from '../../Theme/Images'
import Modal from "react-native-modalbox";
import { withDb } from "../../DatabaseContext/withDatabase";
import { isValidCountryCode, isPhoneno, isAddressValid, isEmailValid } from '../../commonmethods/validation';
import { referralcontact, setaddrefer, editreferralcontact } from '../../actions/patientVisit'
import ContactModal from '../../components/CommonComponents/ContactModal'
import multipleTapHandler from '../../components/MultiTapHandle/index'

class AddLaboratoryContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.gdata = {
      DoctorID: "",
      Name: "",
      Mobile: "",
      Alternateno: "",
      Address: "",
      Email: "",
      Pincode: "",
      City: "",
      State: "",
      Specialist: "",
      LocationName: "",
      MICRNo: "",
      CountryCode: '+91'

    };
    let { navigation } = this.props;
    this.specialization = React.createRef();
    this.state = {
      contactModalOpen: false,
      array_Spec: ['Dentist', 'CardioLogist', 'Dermatologist', 'Diabetologist', 'Hepatologist', 'Dermatologist', 'Diabetologist', 'Hepatologist'],
      srchText: '',
      loading: false,
      specialistdata: {},
      Contactdata: {},
      deviceHeight: Dimensions.get('window').height,
      labname: "",
      laboratorydata: { ...this.gdata },
      errorFields: {
        laboratory: {
          err: false,
          Name: '',
          Email: '',
          Mobile: '',
          Pincode: '',
          City: '',
          State: '',
          Address: '',
          MICRNo: '',
          Alternateno: '',
          Specialist: '',
          CountryCode: ''
        }
      },
      contactloading: false,
      contactList: [],
      array_Spec: [],
      specArray: [],
      description: '',
      showToast: false
    },


      this.searchCntList = [];
    this.Contactsearchtxt = "";
    this.searchspcList = [];
    this.specializationlist = null;
    this.Edit = false;
    this.addedData = {};

  }


  open() {

    this.setState({
      contactModalOpen: !this.state.contactModalOpen
    })
  }
  closeModal() {
    this.currentmodal.current.close();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator()
    this.props.navigation.pop();
    return true
  }
  getContactDetails(data) {
    let Contactdata = {
      Name: data.Name,
      Mobile: data.Mobile,
      countryCode: ''
    }
    this.onDataChanges("Name", Contactdata.Name);
    this.onDataChanges("Mobile", Contactdata.Mobile);
    this.onDataChanges("countryCode", '');



  }


  componentDidMount() {
    multipleTapHandler.clearNavigator()

    let dataFromEdit = this.props.route.params.item ? this.props.route.params.item : {};

    let type = this.props.route.params.type;
    if (type) {
      switch (type) {
        case 1:
          this.setState({
            labname: this.props.route.params.item.Name,//this.props.patientvisit.referName.Pharma.Name,
            laboratorydata: this.props.route.params.item,//this.props.patientvisit.referName.Pharma,
          })
          break;
        case 2:
          this.setState({
            labname: this.props.route.params.item.Name,//this.props.patientvisit.referName.Lab.Name,
            laboratorydata: this.props.route.params.item,//this.props.patientvisit.referName.Lab,
          })
          break;
        case 3:
          this.setState({
            labname: this.props.route.params.item.Name,//this.props.patientvisit.referName.Specialist.Name,
            laboratorydata: this.props.route.params.item,//this.props.patientvisit.referName.Specialist,
          })
          break;
      }
    }
    this.getDataforSpecialization();
  }

  //db
  getDataforSpecialization() {

    this.props.databaseContext.db.transaction((tx) => {
      tx.executeSql("SELECT Data FROM MasterData where Srno=2", [], (tx, results) => {
        if (results.rows.length > 0) {
          this.specializationlist = JSON.parse(results.rows.raw()[0].Data).Value;


          this.setState({ specArray: this.specializationlist }, () => {
          })
          resolve(specializationlist);
        }
      }, (error) => {
        resolve(specializationlist);
      });
    });
  }
  showSpecialization() {
    this.setState({ specArray: this.specializationlist }, () => {
      this.forceUpdate();
    })
    this.specialization.open();
  }
  Bind_Spec() {
    {
      var content = this.state.specArray.map(item => {
        return (
          <TouchableOpacity onPress={() => {
            this.onDataChanges("Specialist", item[1])
            this.specialization.close();
            this.setState({ specArray: this.specializationlist }, () => {
              this.forceUpdate();
            })
          }}>
            <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1, alignItems: 'flex-start', paddingStart: 8 }}>
              <Text style={{ fontSize: 18, height: 50, fontFamily: 'NotoSans', paddingTop: 8, color: '#000' }}>{item[1]}</Text>
            </View>
          </TouchableOpacity>
        )
      })
      return content
    }
  }
  searchSpecilialization(text) {

    if (text && this.state.specArray.length > 0) {
      let newData = this.state.specArray.filter(item => {

        return item[1].indexOf(text) > -1;
      });

      this.setState({ specArray: newData }, () => {
        this.forceUpdate();
      });

    } else {
      this.setState({ specArray: this.specializationlist }, () => {
        this.forceUpdate();
      })
    }
    this.setState({
      srchText: text
    });
  }


  //On Data changes in Child Component
  onDataChanges(key, value) {
    this.state.laboratorydata[key] = value;
    this.setState({
      laboratorydata: this.state.laboratorydata
    })
  }

  validateInputs() {
    let displayname = this.props.route.params.NavigationData.type;
    let isEmail = {
      "isvalid": true
    }
    if (this.state.laboratorydata.Email) {
      isEmail = isEmailValid(this.state.laboratorydata.Email)
    } else {
      isEmail.isvalid = true
    }
    let isName = isAddressValid(this.state.laboratorydata.Name)
    let isMobile = isPhoneno(this.state.laboratorydata.Mobile)
    let isSpecialist = this.state.laboratorydata.Specialist ? (this.state.laboratorydata.Specialist && displayname == "Specialist") ? true : false : true;
    let cCode = isValidCountryCode(this.state.laboratorydata.CountryCode)
    if (isMobile.isvalid && isName.isvalid && isSpecialist && isEmail.isvalid) {
      this.state.errorFields.laboratory.err = false
    } else {
      this.state.errorFields.laboratory.err = true
    }
    if (!isName.isvalid) {
      this.state.errorFields.laboratory.Name = "Please enter  Name"
    } else {
      this.state.errorFields.laboratory.Name = ""
    }
    if (!cCode.isvalid && !isMobile.isvalid) {

      this.state.errorFields.laboratory.Mobile = "Invalid Country code & Mobile Number";
    }
    else if (!isMobile.isvalid) {

      this.state.errorFields.laboratory.Mobile = "Please enter valid Mobile Number";
    }
    else if (!cCode.isvalid) {
      this.state.errorFields.laboratory.Mobile = "Invalid Country code";
    }
    else {
      this.state.errorFields.laboratory.Mobile = "";
    }
    if (!isSpecialist) {
      this.state.errorFields.laboratory.Specialist = "Please select specialization"
    } else {
      this.state.errorFields.laboratory.Specialist = ""
    }

    if (!isEmail.isvalid) {
      this.state.errorFields.laboratory.Email = "Please enter valid Email-Id"
    }
    else {
      this.state.errorFields.laboratory.Email = ""
    }


    this.setState({
      errorFields: this.state.errorFields
    }, () => {
      if (!this.state.errorFields.laboratory.err) {
        this.addreferralcontact();
      }
    })

  }


  Navigateback() {
    this.props.setaddrefer(null);
    multipleTapHandler.clearNavigator()
    this.props.navigation.pop();
    return true

  }

  //referall api
  addreferralcontact() {
    try {
      this.setState({
        loading: true,
      })
      let id = this.state.laboratorydata._id
      var displayname = this.props.route.params.NavigationData.type;
      var type = 0;
      switch (displayname) {
        case 'Laboratory':
          type = 2
          break;
        case 'Pharmacy':
          type = 1
          break;
        case 'Specialist':
          type = 3
          break;
        default:
      }

      var gdata = {
        DoctorID: this.props.doctorProfile.DoctorData._id || '',
        Name: this.state.laboratorydata.Name || '',
        Mobile: this.state.laboratorydata.CountryCode && this.state.laboratorydata.CountryCode == '+91' ?
          this.state.laboratorydata.Mobile : '+91' + this.state.laboratorydata.Mobile,
        Email: this.state.laboratorydata.Email || '',
        Address: this.state.laboratorydata.Address || '',
        Pincode: this.state.laboratorydata.Pincode || '',
        City: this.state.laboratorydata.City || '',
        State: this.state.laboratorydata.State || '',
        Alternateno: this.state.laboratorydata.Alternateno || '',
        MICRNo: this.state.laboratorydata.MICRNo || '',
        LocationName: "test",
        Specialist: this.state.laboratorydata.Specialist || '',
        Type: type,
      }
      if (!id) {
        this.props.referralcontact(gdata).then((payload) => {
          if (payload.payload.data.status == 2000) {
            this.setState({
              showToast: true,
              description: "Successfully added"
            })
            setTimeout(() => {
              this.setState({
                showToast: false
              })
              this.Navigateback();
              this.forceUpdate();
            }, 800);
            this.props.setaddrefer(gdata)


          } else {
            Alert.alert(payload.error.response.data.errors.msg)
          }
        })

      } else {

        this.props.editreferralcontact(id, this.gdata).then((payload) => {
          if (payload.payload.data.status == 2000) {
            multipleTapHandler.clearNavigator();
            this.props.navigation.pop();

          } else {
            Alert.alert(payload.error.response.data.errors.msg)
          }
        })
      }



    } catch (err) {
      this.setState({
        loading: false,
      })


    }
  }


  render() {
    const screenHeight = Dimensions.get('window').height
    let dataFromEdit = this.props.route.params.item ? this.props.route.params.item : {}
    // let dHeight = this.state.deviceHeight
    let { type, color } = this.props.route.params.NavigationData
    let { statusBarHeight } = this.props.databaseContext

    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
          <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
          <View style={[styles.statusbarheight, { paddingTop: statusBarHeight || 37 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
                <Image source={ic_close_button} style={{ height: 18, width: 18, resizeMode: 'contain', }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, paddingStart: 15, color: '#636363' }}>Add {type}</Text>
            </View>
            {!this.props.menuState ? (this.state.loading ? <ActivityIndicator size="large" color={color} style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', position: 'absolute', zIndex: 1, bottom: 5, right: 10, }} />

              : <TouchableOpacity onPress={() => this.validateInputs()} style={{ alignSelf: 'center' }}>
                <Image source={save_btn_green} style={[styles.close_images, { tintColor: color }]} />
              </TouchableOpacity>) : null}

          </View>
          <AddLaboratoryComponent
            {...this.props}
            onDataChanges={(key, value) => this.onDataChanges(key, value, dataFromEdit)}
            specArray={this.state.specArray}
            laboratorydata={this.state.laboratorydata}
            Contactdata={this.state.Contactdata}
            Page_color_code={color}
            Page_type={type}
            errorFields={this.state.errorFields.laboratory}
            labname={this.state.laboratoryName}
            showSpec={() => this.showSpecialization()}
            openmodal={() => this.open()}
            closemodal={() => this.closeModal()}
            showToast={this.state.showToast}
            description={this.state.description}
          />
          <ContactModal
            {...this.props}
            openmodal={() => this.open()}
            contactModalOpen={this.state.contactModalOpen}
            getContactDetails={(data) => this.getContactDetails(data)}
          />
        </View>
        {/* Specialization*/}
        <Modal
          translucent={true}
          useNativeDriver={true}
          animationDuration={80}
          style={{
            borderWidth: 0, width: '80%', borderRadius: 10, height: screenHeight / 1.6, overflow: 'hidden', marginTop: 30
          }}
          ref={(ref) => this.specialization = ref}

          swipeToClose={false}
          transparent={true}
          position={"center"}

          onClosed={() => { this.close }}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
          <View style={{ flex: 1 }}>

            <View style={{
              borderBottomColor: "#dcdcdc", shadowOffset: { width: 2, height: 1, },
              shadowColor: '#dcdcdc', flexDirection: 'row',
              shadowOpacity: 2, borderBottomWidth: 2, paddingVertical: 15, paddingHorizontal: 10, width: "100%", justifyContent: 'center', alignItems: 'center'
            }}>
              <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                <TextInput onChangeText={(txt) => this.searchSpecilialization(txt)} style={{ fontSize: 16, textAlign: 'center' }} placeholder="  Specialization" />

              </View>

              <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                {this.state.array_Spec.length > 0 ? <Image source={gray_search} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
                  :
                  <TouchableOpacity>
                    {/* <Image source={ic_add_blue} style={{ resizeMode: 'contain', height: 25, width: 25 }} /> */}
                  </TouchableOpacity>}

              </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
              {this.Bind_Spec()}
            </ScrollView>
          </View>
        </Modal>
        {/*Ends*/}
      </View>
    )
  }

}
const mapStateToProps = state => ({
  patientvisit: state.patientvisit,
  doctorProfile: state.doctorProfile,
  referName: state.patientvisit.referName

});

const mapDispatchToProps = dispatch => ({
  referralcontact: (data) => dispatch(referralcontact(data)),
  setaddrefer: (gdata) => dispatch(setaddrefer(gdata)),
  editreferralcontact: (id, data) => dispatch(editreferralcontact(id, data))

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(AddLaboratoryContainer));

const styles = StyleSheet.create({
  close_images: { height: 25, width: 25, resizeMode: 'contain', },
  statusbarheight: { marginVertical: Platform.OS === 'ios' ? 0 : 15, paddingBottom: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', paddingHorizontal: 14, borderBottomColor: '#dedede', borderBottomWidth: 2 }
})