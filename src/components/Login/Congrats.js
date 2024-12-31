import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Dimensions,
  FlatList,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Container, Button } from 'native-base';
import Images from '../../Theme/Images';
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
var fabRipple = require('../../../assets/Json/verification.json');
var dotsLoding = require('../../../assets/Json/dotsLoding.json');

import LottieView from 'lottie-react-native';

import LinearGradient from 'react-native-linear-gradient';
import { logAnalytics } from '../../commonmethods/analytics';
import  AsyncStorage from '@react-native-async-storage/async-storage';
class Congrats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      isReady: false,
      specArray: [],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isReady: true });
    }, 3000);

    setTimeout(() => {
      this.setState({ isReady1: true });
    }, 4000);

    setTimeout(() => {
      this.setState({ isReady2: true });
    }, 5000);

    setTimeout(() => {
      this.setState({ isReady3: true });
    }, 6000);
    getScreenNameAnalytics({
      screen_name: "Registration Complete",
      screen_class: "CongratsContainer",
    });
  }

  ChangeState() {
    this.setState({ isReady: true });
  }
  readyUI() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            color: '#29b62f',
            alignSelf: 'flex-end',
            fontSize: 14,
          }}>
          Ready
        </Text>
      </View>
    );
  }

  //For Setting Up...
  settingUp() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <LottieView
          style={{ resizeMode: 'contain', height: 40, alignSelf: 'flex-end' }}
          source={dotsLoding}
          loop={true}
          autoPlay={true}
          ref={(animation) => {
            this.animation = animation;
          }}
        />
      </View>
    );
  }

  itemView(index, item) {
    let { DigitalConsult } = this.props.doctorProfile.DoctorData; //1;
    let e_prescription = 1;
    let smart_app = 1;
    let online_profile = 1;

    //"fd";//this.props.doctorProfile.DoctorData
    return (
      <View
        style={{
          flex: 1,
          borderColor: '#dedede',
          borderRadius: 10,
          padding: 10,
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          marginVertical: 4,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}>
        <View style={{ flex: 0.2 }}>
          <Image
            source={item.image}
            style={{ alignSelf: 'center', resizeMode: 'contain', height: 50 }}
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontWeight: 'bold',
              color: '#050505',
              fontSize: 15,
            }}>
            {item.title}
          </Text>
        </View>
        <View
          style={{
            flex: 0.3,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          {index == 0
            ? this.state.isReady
              ? DigitalConsult == 1
                ? this.readyUI()
                : null
              : this.settingUp()
            : index == 1
              ? this.state.isReady1
                ? e_prescription == 1
                  ? this.readyUI()
                  : null
                : this.settingUp()
              : index == 2
                ? this.state.isReady2
                  ? smart_app == 1
                    ? this.readyUI()
                    : null
                  : this.settingUp()
                : index == 3
                  ? this.state.isReady3
                    ? online_profile == 1
                      ? this.readyUI()
                      : null
                    : this.settingUp()
                  : null}
        </View>
      </View>
    );
  }

  navigate() {
    logAnalytics(
      this.props.doctorProfile.DoctorData._id,
      this.props.doctorProfile.DoctorData.DoctorFName +
      ' ' +
      this.props.doctorProfile.DoctorData.DoctorLName,
      'registration_finish',
    );

    this.props.navigation.navigate('Drawer');
    AsyncStorage.setItem("registered_doctor", "1");

  }

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }} 
            style={{   height:  Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />

        <ImageBackground
          source={Images.ic_BG}
          style={{ flex: 1, resizeMode: 'cover', height: '50%' }}>
          <View style={{ flex: 0.38, margin: 30 }}>
            <Text
              style={{
                color: '#ffffff',
                marginHorizontal: 5,
                fontSize: 22,
                fontFamily: 'NotoSans-Bold',
              }}>
              Congratulations!
            </Text>

            <Text
              style={{
                color: '#f7b2ff',
                marginHorizontal: 5,
                fontSize: 45,
                fontFamily: 'NotoSans-Bold',
              }}>
              {'Dr. ' +
                this.props.doctorProfile.DoctorData.DoctorFName +
                '\n' +
                this.props.doctorProfile.DoctorData.DoctorLName}
              !
            </Text>

            {
              <Text
                style={{
                  color: '#ffffff',
                  marginHorizontal: 5,
                  marginBottom: 5,
                  fontSize: 16,
                  fontFamily: 'NotoSans-Bold',
                }}>
                {!this.state.isReady
                  ? 'Your digital clinic is setting up...'
                  : 'Your digital clinic is ready'}
              </Text>
            }
          </View>

          <View
            style={{
              flex: 0.62,
              backgroundColor: '#f8f8f8',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              marginTop: 10,
            }}>
            {/*  
                    <Image source={Images.success}  />
*/}

            <LottieView
             
              style={{
                resizeMode: 'contain',
                height: 100,
                alignSelf: 'center',
                position: 'absolute',
                top: -22,
              }}
              source={fabRipple}
              loop={false}
              autoPlay={true}
              ref={(animation) => {
                this.animation = animation;
              }}
            />

            <FlatList
              style={{ marginTop: 70 }}
              data={this.props.congrats_array}
              renderItem={({ index, item }) => this.itemView(index, item)}
              //keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={this.renderSeparator}
              extraData={this.state.refresh}
            />

            <View style={{ marginVertical: 20 }}>
              {this.state.isReady ? (
                <TouchableOpacity onPress={() => this.navigate()}>
                  <LinearGradient
                    colors={['#1b7cdb', '#07cef2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.8]}
                    style={{
                      width: '90%',
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                      alignSelf: 'center',
                      borderRadius: 25,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: '#ffffff',
                      }}>
                      TAKE A WALKTHROUGH
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
export default Congrats;
