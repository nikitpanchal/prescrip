/* created by ruban 
Appointment map component */

import React, { Component } from 'react'
import {
  View, Text, Linking, Alert, Image, StatusBar, ImageBackground, ActivityIndicator,
  TouchableOpacity, Platform, PermissionsAndroid, ToastAndroid, Dimensions, KeyboardAvoidingView, SafeAreaView,
} from 'react-native'
import { Container } from 'native-base'
import { ic_black_back, ic_Pick_Clinic_Location, ic_Pick_Clinic_Location_BG } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import Modal from "react-native-modalbox";
import Geolocation from 'react-native-geolocation-service';
import { setDoctorData, setClinicDetails, updateDoctorDetails } from '../../actions/doctorProfile'
import { connect } from 'react-redux'
import Toast, { DURATION } from 'react-native-easy-toast'
import ToastComponent from '../../components/Toast/toastComponent'
import Images from '../../Theme/Images'

class AppointmentMapComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {

      currentLongitude: 'unknown',//Initial Longitude
      currentLatitude: 'unknown',
      loading: false,
      forceLocation: true,
      highAccuracy: true,
      locloading: false,
      showLocationDialog: true,
      significantChanges: false,
      updatesEnabled: false,
      foregroundService: false,
      location: {},
      //Toast States
      description: '',
      showToast: false,

      toastImagePath: Images.Info,
      toastTextColor: "#fafbfe",
      toastBgColor: '#4D99E3',

    }


  }


  // on press may be later
  onMayBeLaterClick() {
    this.props.navigation.navigate('CongratsClinicContainer')
  }
  //Get Current Location
  //Location function
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Prescrip", 'Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert("Prescrip", 'Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your Current Location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Current Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert("Prescrip", "Current Location permission denied. Please enable it from setting", [{ text: 'OK', onPress: () => Linking.openSettings() }]);
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ locloading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: { lat: position.coords.latitude, lng: position.coords.longitude }, locloading: false }, () => {
            this.getLatLongNavigate();
          });

        },
        (error) => {
          this.setState({ locloading: false });
          Alert.alert("Prescrip", "Cannot get your Current Location at the moment");
        },
        {
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };


  requestLocation() {
    let config = {
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse'
    };
    if (Platform.OS == 'ios') {
      Geolocation.setRNConfiguration(config);
      this.getCurrentLocation();
    }
    else {
      this.getCurrentLocation();
    }

  }
  getCurrentLocation() {
    let geoOptions = {
      enableHighAccuracy: false,
      //timeOut: 60000, //20 second  
      //maximumAge: 10000 //10 second  
    };
    Geolocation.getCurrentPosition(this.geoSuccess, this.geoFailure, geoOptions);
  }
  geoSuccess = (position) => {

    this.setState({
      ready: true,
      location: { lat: position.coords.latitude, lng: position.coords.longitude }
    }, () => {
      this.getLatLongNavigate();
    })
  }
  geoFailure = (err) => {
    this.setState({ error: err.message });
    //Handle Error
    
    switch (err.code) {
      case 1:
        //Permission Denied
        Alert.alert("Prescrip", " Current Location permission is denied. Please to settings and allow the permission", [{ text: 'OK', onPress: () => Linking.openSettings() }]);

        //Linking.openSettings();
        break;
      case 2:
        Alert.alert("Prescrip", "GPS is disabled. Please enable the service");
        break;
      case 3:
        Alert.alert("Prescrip", "Unable to get your Current Location at the moment");
        break;
    }


  }
  getLatLongNavigate() {
    this.setState({ loading: true })
    let doctorData = { ...this.props.doctorProfile.DoctorData }
    let clinicAddress = { ...this.props.doctorProfile.ClinicAddress }
    try {
      clinicAddress.Latitude = this.state.location.lat;
      clinicAddress.Longitude = this.state.location.lng;
      this.props.setClinicDetails(clinicAddress)
      let index = -1;
      let isUpdate = 0;
      index = doctorData.ClinicAddresses.findIndex((item) => {
        return item.ClinicId == clinicAddress.ClinicId;

      });
      if (index > -1) {
        isUpdate = 2;
        doctorData.ClinicAddresses[index] = clinicAddress;
      }
      else {
        isUpdate = 1;
        doctorData.ClinicAddresses.push(clinicAddress)
      }


      let clinicDetails = {
        clinicId: clinicAddress.ClinicId,
        clinicAddresses: clinicAddress,
        action: isUpdate,
        doctorId: doctorData._id,
        fromSettings : 0,
      }
      this.props.addClinicAddresses(clinicDetails).then(({ payload, error }) => {

        if (error) {
          this.setState({
            description: 'Currently internet is not avaliable',
            toastBgColor: "#d9541d",
            toastTextColor: '#fffefe',
            toastImagePath: Images.Error

          })
          switch (error.data) {
            case 'Network Error':
              this.setState({
                description: 'Currently internet is not avaliable',
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error

              })
              break;
            default:
              this.setState({
                description: 'Error in gettting response from server',
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error

              })
              break;
          }

          this.setState({
            showToast: true,
          })

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false
            });

          }, 1500);

          this.setState({ loading: false })
          return;
        }
        if (payload.data.status === 1) {
          this.props.setDoctorData(doctorData)
          this.setState({ loading: false })
          this.props.navigation.navigate("CongratsClinicContainer")

        } else {
          this.setState({

            showToast: true,
            description: payload.data.msg,
            toastBgColor: "#29b62f",
            toastTextColor: '#fafdfa',
            toastImagePath: Images.Success
          })

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false
            });

          }, 1500);

        }
      })
    }
    catch (error) {
      this.setState({
        showToast: true,
        description: payload.data.msg,
        toastBgColor: "#d9541d",
        toastTextColor: '#fffefe',
        toastImagePath: Images.Error


      })

      setTimeout(() => {
        this.setState({
          showToast: false,
          loading: false
        });

      }, 1500);

    }
  }

  // get current latt and long
  // callLocation(that) {

  //   this.setState({ loading: true })
  //   //alert("callLocation Called");
  //   Geolocation.getCurrentPosition(
  //     //Will give you the current location
  //     (position) => {
  //       let currentLongitude = JSON.stringify(position.coords.longitude);
  //       //getting the Longitude from the location json
  //       let currentLatitude = JSON.stringify(position.coords.latitude);
  //       //getting the Latitude from the location json
  //       that.setState({ currentLongitude: currentLongitude,
  //        });
  //       //Setting state Longitude to re re-render the Longitude Text
  //       that.setState({ currentLatitude: currentLatitude });
  //       this.setState({
  //         location : {
  //           currentLongitude : currentLongitude,
  //           currentLatitude : currentLatitude
  //         }
  //       },()=>{

  //       })
  //       //Setting state Latitude to re re-render the Longitude Text

  //       //CongratsClinicContainer

  //       //alert("latitude: " + this.state.currentLatitude + "\n" + "longitude: " + this.state.currentLongitude)
  //       //Geolocation.


  //     },
  //     (error) => {
  //       Linking.openURL('app-settings:');
  //       this.setState({ loading: false })
  //     },
  //     { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
  //   );

  // }

  //no may be later click
  noMaybeClick() {
    this.setState({ loading: true })
    let doctorData = { ...this.props.doctorProfile.DoctorData }
    let clinicAddress = { ...this.props.doctorProfile.ClinicAddress }
    try {
      let index = -1;
      let isUpdate = 0;
      index = doctorData.ClinicAddresses.findIndex((item) => {
        return item.ClinicId == clinicAddress.ClinicId;

      });
      if (index > -1) {
        doctorData.ClinicAddresses[index] = clinicAddress;
        isUpdate = 2;
      }
      else {
        doctorData.ClinicAddresses.push(clinicAddress);
        isUpdate = 1;
      }
      let clinicDetails = {
        clinicId: clinicAddress.ClinicId,
        clinicAddresses: clinicAddress,
        action: isUpdate,
        doctorId: doctorData._id,
        fromSettings : 0,
      }


      this.props.addClinicAddresses(clinicDetails).then(({ payload, error }) => {
        if (error) {
          this.setState({
            description: 'Currently internet is not avaliable',
            toastBgColor: "#d9541d",
            toastTextColor: '#fffefe',
            toastImagePath: Images.Error

          })
          switch (error.data) {
            case 'Network Error':
              this.setState({
                description: 'Currently internet is not avaliable',
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error
    
              })
              break;
            default:
              this.setState({
                description: 'Error in gettting response from server',
                toastBgColor: "#d9541d",
                toastTextColor: '#fffefe',
                toastImagePath: Images.Error

              })
              break;
          }

          this.setState({
            showToast: true,
          })

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false
            });

          }, 1500);

          return;
        }
        if (payload.data.status === 1) {
          this.setState({ loading: false })
          this.props.setDoctorData(doctorData)
          this.props.navigation.navigate("CongratsClinicContainer")

        } else {

          this.setState({
            showToast: true,
            description: payload.data.msg,
            toastBgColor: "#d9541d",
            toastTextColor: '#fffefe',
            toastImagePath: Images.Error
          })

          setTimeout(() => {
            this.setState({
              showToast: false,
              loading: false
            });

          }, 1500);
        }
      })
    }
    catch (error) {
      this.setState({
        showToast: true,
        description: payload.data.msg,
        toastBgColor: "#d9541d",
        toastTextColor: '#fffefe',
        toastImagePath: Images.Error
      })

      setTimeout(() => {
        this.setState({
          showToast: false,
          loading: false
        });

      }, 1500);
      
    }

  }

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  }
  render() {
    const screenHeight = Dimensions.get('window').height
    const screenWidth = Dimensions.get('window').width
    return (

      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        {this.state.loading ? <View style={{ zIndex: 99, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%', position: 'absolute' }}>
          <ActivityIndicator size="large" color="#0077c0" />
        </View>
          :
          null}
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />
        <ImageBackground style={{ flex: 1 }} source={ic_Pick_Clinic_Location_BG}>

          <View style={{ flex: 1, paddingHorizontal: 12, }}>
            <TouchableOpacity style={{ flex: 0.12, flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={this.props.navigateback} >
              <Image source={ic_black_back} style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: '#000', alignSelf: 'center' }} />
            </TouchableOpacity>
            <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={ic_Pick_Clinic_Location} style={{ resizeMode: 'contain', height: 200 }} />
            </View>

            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', marginHorizontal: 20 }}>
              <Text style={{ fontFamily: 'NotoSans', fontSize: 30, color: '#444444', letterSpacing: 0.1, textAlign: 'center' }}>Let's Make it easy for {"\n"}your patients to find {"\n"}{this.props.clinicName} Clinic</Text>
              <Text style={{ fontFamily: 'NotoSans', fontSize: 22,fontWeight:'200', color: '#565656', letterSpacing: 0.1, textAlign: 'center' }}>We need your  permission to {"\n"}access your current location</Text>
            </View>

            <TouchableOpacity onPress={() => this.getLocation()} disabled={this.state.locloading || this.state.updatesEnabled} style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <LinearGradient colors={this.state.locloading || this.state.updatesEnabled ? ["#a2a2a2", "#a2a2a2"] : ["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >Use Current Location</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.noMaybeClick()} style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <View >
                <Text style={{ fontFamily: 'NotoSans-Bold', fontSize: 16, textDecorationLine: 'underline', color: '#828181' }}>No, may be later</Text>
              </View>
            </TouchableOpacity>
          </View>



        </ImageBackground>
        {
          this.state.showToast ?
            this.refs.toast.show(


              <ToastComponent
                {...this.props}

                textColorCode={this.state.toastTextColor}

                imagePath={this.state.toastImagePath}
                description={this.state.description}

              />

              , 1500) : null
        }
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
            width: '90%',

            backgroundColor: this.state.toastBgColor,


            borderRadius: 15
          }}
          ref="toast" />

      </View>

    )

  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile
});
const mapDispatchToProps = dispatch => ({
  setDoctorData: (doctorData) => dispatch(setDoctorData(doctorData)),
  setClinicDetails: (clinicAddress) => dispatch(setClinicDetails(clinicAddress)),
  updateDoctorDetails: (objectValue, objectKey, doctorId) => dispatch(updateDoctorDetails(objectValue, objectKey, doctorId)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentMapComponent);