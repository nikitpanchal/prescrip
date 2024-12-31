/****** code by Sourabh ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, SafeAreaView, Image, ImageBackground, TextInput, Dimensions, Platform, Alert } from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../Tooltips'
import { S3BaseUrl } from '../../../app.json'

import { tooltip_Billing, tooltip_Share, icon_search_white } from '../../constants/images'


import { delete_icon, Tooltip_Edit_Icon, Billing_Dropdown_Collapsed } from '../../constants/images'
import moment from "moment";
let timer = null;



//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (Congrats screen)
//5.progress bar ,title ,description

//9.


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBox: false,
      phonenumber: '',
      showTooltip: false
    }
    this._checkboxsms = 0
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }


  componentDidMount() {
    timer = setTimeout(() => {
      this.setState({
        showTooltip: true
      })
    }, 500);
  }



  render() {
    return (
      <View style={{ justifyContent: 'center', flexdirection: 'row' }}>
        <ImageBackground style={{ width: Dimensions.get('window').width }} source={this.props.bgImage}>

          <View style={{
            flexDirection: 'column',
            top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
            marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,



          }}>
            <SafeAreaView>

              <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 10, marginTop: this.props.isTitle ? 10 : null }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>


                  <View
                    style={{ flexDirection: 'row', }}
                  >{this.props.leftImageOnClick ?
                    <TouchableOpacity
                      onPress={() => { this.props.leftImageOnClick() }}
                      style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                      {
                        true ? <Image style={{
                          resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                        }} source={this.props.leftImage} />
                          : null
                      }

                    </TouchableOpacity> : null}

                    {
                      this.props.isBilling ?
                        <TouchableOpacity
                          onPress={() => { this.props.clickedOnBilling() }}
                          style={{ flexDirection: 'column', }}>

                          <Text style={{ textAlign: 'right', color: '#cbeee2', alignSelf: 'flex-end', marginLeft: 10, fontSize: 15, fontFamily: 'NotoSans' }}>{"TRANSACTIONS"}</Text>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                            <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 14, fontFamily: 'NotoSans' }}>{this.props.title}</Text>
                            <Image style={{
                              resizeMode: "contain", marginLeft: 10, alignSelf: 'center', tintColor: 'white', justifyContent: 'flex-end', width: 11, height: 10
                            }} source={Billing_Dropdown_Collapsed} />

                          </View>
                        </TouchableOpacity>

                        : null
                    }

                    {
                      this.props.isTitle ?
                        <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', marginLeft: 10, fontSize: 19, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.title}</Text>
                        : null
                    }




                  </View>





                  {

                    this.props.type == 1 || this.props.type == 3 || this.props.type == 10 ?

                      <View
                        style={{ flexDirection: 'row' }}
                      >

                        {
                          this.props.isBilling ?
                            <View>
                              <TouchableOpacity
                                onPress={() => { this.props.thirdMenuImageOnClick() }}
                                style={{ paddingHorizontal: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                                <Image style={{
                                  resizeMode: "cover", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                                }} source={icon_search_white} />


                                <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, marginTop: 3, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{"Search"}</Text>

                              </TouchableOpacity>
                            </View>
                            : null
                        }


                        {

                          this.props.secondMenu ?


                            this.props.isSecondMenuName ?


                              <View>
                                <TouchableOpacity
                                  onPress={() => { this.props.secondMenuImageOnClick() }}
                                  style={{ paddingHorizontal: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                                  <Image style={{
                                    resizeMode: "cover", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                                  }} source={this.props.secondMenuImage} />



                                  {
                                    this.props.isSecondMenuName ?
                                      <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, marginTop: 3, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.secondMenuName}</Text>

                                      : null
                                  }


                                </TouchableOpacity>

                                {
                                  this.props.isSecondMenuNotificationIcon ?
                                    <View
                                      style={{ position: 'absolute', alignSelf: 'center' }}
                                    >
                                      <Image style={{
                                        backgroundColor: 'red',
                                        marginLeft: 20,
                                        borderRadius: 5,
                                        resizeMode: "cover", alignSelf: 'center', width: 10, height: 10
                                      }} source={null} /></View> : null
                                }

                              </View>




                              : <TouchableOpacity
                                onPress={() => { this.props.secondMenuImageOnClick() }}
                                style={{ paddingRight: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                                {
                                  true ? <Image style={{
                                    resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 20
                                  }} source={this.props.secondMenuImage} />
                                    : null
                                }

                              </TouchableOpacity>




                            :
                            null



                        }
                        {
                          !Platform.isPad && this.props.shareProfile ?


                            <TouchableOpacity
                              onPress={() => { this.props.RightImageOnClick() }}
                              style={{ paddingHorizontal: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                              <Tooltip
                                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                animated={true}
                                //  isVisible={this.props.screenProps ? (this.props.screenProps.tooltip == "Share") : (this.props.auth && this.props.auth.tooltip == "Profile" && this.state.showTooltip)}
                                isVisible={this.props.shareProfile}

                                //  isVisible={this.props.screenProps ? (this.props.screenProps.tooltip == "Share" &&  !Platform.isPad? true : false) : (this.props.auth && this.props.auth.tooltip  == "Profile" && this.state.showTooltip  &&  !Platform.isPad ? true : false)}
                                backgroundColor={this.props.auth && this.props.auth.tooltip == "Profile" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)"}
                                contentStyle={{ backgroundColor: '#6f6af4' }}
                                tooltipStyle={{ right: 20, alignItems: 'flex-end' }}

                                content={<TouchableOpacity
                                  style={{ backgroundColor: "#6f6af4" }}
                                  onPress={() => { this.props.onGotIt() }}>
                                  {this.props.auth && this.props.auth.tooltip == "Profile" ? <AddPatient
                                    imagePath={Tooltip_Edit_Icon}
                                    title={"Glorify your profile!"}
                                    description={"Update your Qualifications, Specializations, Add Clinics and keep patients informed about you"}
                                  /> : <AddPatient
                                    isLottie={true}
                                    imagePath={tooltip_Share}
                                    //imagePath={Images.ic_popup_Share_Icon}
                                    title={"Share your profile"}
                                    // subtitle={"Your profile is 100% complete."}
                                    description={"Let the world know about you. Your new and existing patients can use this to book appointments with you"}
                                  />}
                                </TouchableOpacity>}
                                //(Must) This is the view displayed in the tooltip
                                placement="bottom"
                                //(Must) top, bottom, left, right, auto.
                                onClose={() => { this.props.onGotIt() }}
                              //(Optional) Callback fired when the user taps the tooltip
                              >
                                <Image style={{
                                  resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                                }} source={this.props.rightImage} />

                                {
                                  !this.props.isMenuName ?
                                    null
                                    : <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, marginTop: 3, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.rightImageName}</Text>


                                }
                              </Tooltip>

                            </TouchableOpacity>
                            : <TouchableOpacity
                              onPress={() => { this.props.RightImageOnClick() }}
                              style={{ paddingHorizontal: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                              <Image style={{
                                resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 20, height: 20
                              }} source={this.props.rightImage} />

                              {
                                !this.props.isMenuName ?
                                  null
                                  : <Text style={{ textAlign: "center", color: '#fff', alignSelf: 'center', fontSize: 11, fontWeight: 'bold', fontFamily: 'NotoSans-Bold' }}>{this.props.rightImageName}</Text>


                              }

                            </TouchableOpacity>
                        }






                      </View>
                      :
                      this.props.type == 5 ?

                        <View style={{ marignRight: 20, alignSelf: 'center', flexDirection: 'row', height: 14, flex: 1, borderRadius: 10, borderColor: '#DD5A59', borderWidth: 2 }}
                        >
                          <View
                            style={{
                              backgroundColor: '#A3F129', flex: this.props.progressBarWidth, borderRadius: 10,
                            }}
                          >
                          </View>


                        </View>
                        : null




                  }



                </View>

                {
                  this.props.type == 5 ?
                    <Text style={[styles.title, { marignRight: 20, fontFamily: 'NotoSans', fontSize: 12, alignSelf: 'flex-end', justifyContent: 'flex-end' }]}>{this.props.stepText}</Text>
                    : null
                }



                <View style={{ flexDirection: 'row', marginBottom: this.props.isTitle ? 15 : 30 }}>

                  {
                    this.props.type == 1 || this.props.type == 3 ?

                      <TouchableOpacity onPress={() => { this.props.iscameraImage ? this.props.cameraImageOnClick() : null }}>
                        <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', }}>
                          {
                            this.props.doctorProfile && this.props.doctorProfile.DoctorData.DoctorImage == "" && this.props.photo == null ?

                              this.props.showIntials ?

                                <View
                                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}

                                >
                                  <Text style={{
                                    fontSize: 24,
                                    color: "#fefeff",

                                    fontFamily: "NotoSans-Bold", fontSize: 30
                                  }}>{this.props.DoctorFName.charAt(0)}</Text>

                                  <Text style={{
                                    fontSize: 24,
                                    color: "#fefeff",

                                    fontFamily: "NotoSans-Bold", fontSize: 30
                                  }}>{this.props.DoctorLName.charAt(0)}</Text>
                                </View>
                                : <View>{this.props.doctorimage_alpha ?
                                  <View style={{
                                    alignItems: 'center', justifyContent: 'space-around', width: 70,
                                    height: 70, borderRadius: 10, borderWidth: 2, borderColor: '#fff',
                                  }}>
                                    <Text uppercase={true} style={{
                                      fontSize: 30, color: '#fff', fontFamily:
                                        'NotoSans-Bold', alignSelf: 'center', paddingTop : 20
                                    }}>{this.props.doctorimage_alpha}</Text>

                                  </View> : <View style={{ alignItems: 'center', justifyContent: 'space-around', width: 70, height: 70, borderRadius: 10, borderWidth: 2, borderColor: '#fff', }}>
                                    <Text uppercase={true} style={{ fontSize: 30, color: '#fff', fontFamily: 'NotoSans-Bold', alignSelf: 'center' }}>{this.props.receviedAmountDataName.charAt(0)}</Text>

                                  </View>
                                }
                                </View>
                              :
                              <View>{this.props.transactionId ? <Image
                                source={this.props.imagePath}
                                style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                              />
                                : <Image
                                  source={{ uri: this.props.photo == null ? S3BaseUrl + "doctorimg/" + this.props.doctorProfile.DoctorData.DoctorImage : this.props.photo }}
                                  style={{ alignSelf: 'center', width: 70, height: 70, borderColor: 'white', borderWidth: 2, borderRadius: 5 }}
                                />
                              }
                              </View>


                          }

                        </View>

                        {


                          this.props.iscameraImage ?
                            <TouchableOpacity onPress={() => this.props.cameraImageOnClick()}
                              style={{ position: 'absolute', alignSelf: 'flex-end', }}

                            >
                              <Image
                                source={this.props.cameraImage}
                                style={{ width: 35, height: 35, }}

                              ></Image>
                            </TouchableOpacity> : null}
                      </TouchableOpacity>
                      : null
                  }


                  {
                    this.props.type != 10 ?

                      <View
                        style={{ alignSelf: 'center', flex: 1 }}
                      >
                        <TouchableOpacity

                          onPress={() => { this.props.type == 1 ? this.props.showProfile() : null }}
                          style={{

                            flexDirection: 'column', paddingLeft: 10, alignSelf: 'flex-start',
                          }}>
                          {


                            this.props.type == 1 ?
                              <Text style={styles.title}>{this.props.title}</Text>
                              :
                              this.props.type == 3 ?
                                this.props.isEditClick ?



                                  <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>

                                    <TextInput
                                      onChangeText={(txt) => this.props.setDoctorName(txt)}
                                      keyboardType="default"
                                      defaultValue={this.props.title.substring(3)}

                                      style={
                                        styles.decription



                                      } />
                                  </View>
                                  :
                                  <View>{this.props.recev_amt ? <View style={{ flexDirection: 'column' }}>
                                    <View style={{
                                      flexDirection: "row",
                                      borderRadius: 6,
                                      borderWidth: 1,
                                      backgroundColor: '#fff',
                                      borderColor: "#820091", paddingHorizontal: 6

                                    }}>
                                      <Text style={{ color: "#820091", fontSize: 12 }}>{" Video Consulation "}</Text>
                                      <Text style={{ color: "#820091", fontSize: 12, }}>{moment(this.props.recev_amt.WhenEntered).format("Do MMM, YYYY")}</Text>


                                    </View>
                                    <Text style={styles.decription}>{this.props.title}</Text>
                                  </View>
                                    :

                                    <Text style={styles.decription}>{this.props.title}</Text>}
                                  </View>
                                : this.props.type == 4 ?
                                  <Text style={{ fontFamily: 'NotoSans-Bold', color: '#fefafa', fontSize: 23, paddingTop: 12 }}>{this.props.title}</Text>
                                  : this.props.type == 5 ?
                                    <Text style={{ marginBottom: 10, fontFamily: 'NotoSans-Bold', color: '#fefafa', fontSize: 20 }}>{this.props.title}</Text>
                                    :
                                    null
                          }
                          {
                            this.props.type == 3 ?
                              <Text style={styles.title}>{this.props.description}</Text>
                              : this.props.type == 4 ?
                                <Text style={{ fontFamily: 'NotoSans-Bold', color: '#ffd9dd', fontSize: 35 }}>{this.props.description}</Text>
                                :
                                this.props.type == 4 ?
                                  <Text style={{ fontFamily: 'NotoSans-Bold', color: '#ffd9dd', fontSize: 35 }}>{this.props.description}</Text>
                                  :
                                  this.props.type == 5 ?
                                    <Text style={[styles.decription, { marginBottom: 20, fontSize: 30 }]}>{this.props.description}</Text>
                                    :


                                    <Text style={styles.decription}>{this.props.description}</Text>

                          }

                          {
                            this.props.type == 4 ?
                              <Text style={{ marginBottom: 50, fontFamily: 'NotoSans', color: '#ffffff', fontSize: 18 }}>{this.props.extraData}</Text>
                              :
                              null

                          }

                        </TouchableOpacity>

                        {


                          this.props.iseditImage ?

                            <TouchableOpacity
                              onPress={() => { this.props.editImageOnClick(this.props.isEditClick) }}
                              style={{ marginRight: 40, marginTop: -20, position: 'absolute', alignSelf: 'flex-end', }}

                            >
                              <Image
                                source={this.props.isEditClick ? delete_icon : this.props.editImage}
                                style={{ width: 15, height: 15, }}
                              ></Image>
                            </TouchableOpacity>

                            : null}

                      </View>

                      :

                      this.props.isShowConsultations ?



                        <View
                          style={{ marginBottom: 50, flex: 1, paddingBottom: 20, justifyContent: 'center', flexDirection: 'row', margin: 10 }}

                        >


                          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>

                            <Text
                              style={{ marginTop: 10, fontFamily: 'NotoSans-Bold', color: '#cbeee2', fontSize: 28 }}>
                              {'Overall'}
                            </Text>

                            <Text
                              style={{ fontFamily: 'NotoSans', color: '#cbeee2', fontSize: 13 }}
                            >{'Summary'}</Text>


                          </View>

                          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

                            <Text
                              style={{ marginTop: 10, fontFamily: 'NotoSans-Bold', color: '#cbeee2', fontSize: 28 }}>
                              {this.props.totalConsultations}
                            </Text>

                            <Text
                              style={{ fontFamily: 'NotoSans', color: '#cbeee2', fontSize: 13 }}
                            >{'Consultations'}</Text>


                          </View>


                          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

                            <Text
                              style={{ marginTop: 10, fontFamily: 'NotoSans-Bold', color: '#cbeee2', fontSize: 28 }}>
                              {this.props.totalEarnings}

                            </Text>

                            <Text
                              style={{ fontFamily: 'NotoSans', color: '#cbeee2', fontSize: 13 }}
                            >{'Lifetime Earnings'}</Text>


                          </View>


                        </View>
                        : null

                  }
                </View>
              </View>

            </SafeAreaView>
          </View>
        </ImageBackground>

      </View >


    );
  }
}
