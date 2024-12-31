// ravi Code
import React from 'react';
import { Edit_White_Icon, ic_icon_Edit_Button, ic_Blue_BG_578, lefticon, Profile_Image } from '../../constants/images';
import { Container, Text } from "native-base";
import { View, Dimensions, Alert, Linking, Platform, PermissionsAndroid, Share, BackHandler } from "react-native";
import Images from '../../Theme/Images'
import HeaderData from '../../components/Header/header'
import PatientProfileViewComponent from '../../components/DoctorProfileComponent/PatientProfileViewComponent';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import Geolocation from '@react-native-community/geolocation';
import { connect } from "react-redux";
// import ImagePicker from 'react-native-image-crop-picker';





class PatientProfileViewContainer extends React.Component {

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const firstnamealpha = props.doctorProfile.DoctorData.DoctorFName.charAt(0).toUpperCase();
    const surfirstalpha = props.doctorProfile.DoctorData.DoctorLName.charAt(0).toUpperCase();
    const { DoctorMobile } = props.doctorProfile.DoctorData

    this.state = {
      currentLongitude: 'unknown',//Initial Longitude
      currentLatitude: 'unknown',
      mobileno: DoctorMobile,
      latitude: null,
      doctorimage_alpha: firstnamealpha + surfirstalpha,



    };
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(),
      this.props.navigation.goBack()
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator()

  }

  Navigateback = () => {
    multipleTapHandler.clearNavigator(),
      this.props.navigation.goBack()

  }

  RightImageOnClick() {
    this.props.navigation.navigate('ShareBAContainer');


  }
  Bookapp_navigate() {
    this.props.navigation.navigate('ShareBAContainer');
  }

  getLocation() {
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.callLocation(that);
          } else {
            alert("Permission Denied");
          }
        } catch (err) {

        }
      }
      requestLocationPermission();
    }
  }
  callLocation(that) {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        that.setState({ currentLongitude: currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        that.setState({ currentLatitude: currentLatitude });
        //Setting state Latitude to re re-render the Longitude Text

        //CongratsClinicContainer



        //Geolocation.fr



      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change

      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      that.setState({ currentLongitude: currentLongitude });
      //Setting state Longitude to re re-render the Longitude Text
      that.setState({ currentLatitude: currentLatitude });
      //Setting state Latitude to re re-render the Longitude Text
    });
  }
   
  //share app link
  async onShare() {
    try {
      let msg = 'Hello, you can view my clinic(s) & take an appointment for consultation using below link \n' + this.props.doctorProfile.DoctorData.ShortUrl;
      const result = await Share.share({
        message: msg,
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
  };





  render() {

    return (
      <View style={{ flex: 1 }}>

        <View style={{
          flexdirection: 'column', flex: 1, backgroundColor: '#fafafa', width: Dimensions.get('window').width
        }}>


          <View>

            <HeaderData
              {...this.props}
              bgImage={ic_Blue_BG_578}
              imagePath={Images.ic_profile_dummy_image}
              title={"Dr. " + this.props.doctorProfile.DoctorData.DoctorFName + " " + this.props.doctorProfile.DoctorData.DoctorLName}
              description={this.props.doctorProfile.DoctorData.PrimarySpecialization}
              onGotIt={() => this.onGotIt()}
              leftImage={lefticon}
              rightImage={Images.ic_share_button}
              type={3}
              rightImageName={"Share"}
              isMenuName={true}
              RightImageOnClick={() => multipleTapHandler.multitap(() => this.onShare(), "ShareBAContainer")}
              leftImageOnClick={() => this.leftImageOnClick()}
              doctorimage_alpha={this.state.doctorimage_alpha}
            />


          </View>

          <View style={{ position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, paddingVertical: 10, backgroundColor: '#fafafa', paddingHorizontal: 15, }}>

          </View>
          <PatientProfileViewComponent
            {...this.props}
            data={this.props.doctorProfile.DoctorData.ClinicAddresses}
            getLocation={() => this.getLocation()}
            currentLongitude={this.state.currentLongitude}
            latitude={() => this.state.latitude}
            doctorotherspecialization={this.props.doctorProfile.DoctorData.DisplaySpecializationCSV}

            Bookapp_navigate={() => multipleTapHandler.multitap(() => this.Bookapp_navigate(), "ShareBAContainer")}


          />

        </View>
      </View>

    );
  }
}
const mapStateToProps = state => ({
  doctorProfile: state.doctorProfile

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientProfileViewContainer);