/* Created Ruban 
Register component
*/
import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  Text,
  Linking,
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Container, Input } from "native-base";
import { termsLink } from "../../../app.json";
import Images from "../../Theme/Images";
import LinearGradient from "react-native-linear-gradient";
import {
  userRegistrationSuccess,
  setMobile,
  setDoctorId,
} from "../../actions/auth";
import {
  isPhoneno,
  isEmailValid,
  isNameValid,
} from "../../commonmethods/validation";
import { connect } from "react-redux";
import ToastComponent from "../Toast/toastComponent";

import Toast, { DURATION } from "react-native-easy-toast";
const ht = Dimensions.get('window').height;
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      email: "",
      firstName: "",
      lastName: "",
      promoCode: "",
      isSelected: false,
      onClick: false,
      loading: false,
      isExits: false,
      checkMobile: false,
    };
    this.selection = { start: 0, end: 0 };
  }

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }} style={{ height: ht, width: Dimensions.get('window').width }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
        />
        <ImageBackground
          source={Images.bg_white}
          style={{
            flex: 1,
            resizeMode: "cover",
            width: Platform.isPad ? "100%" : Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "#fff",
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.isPad ? 0 : 20}
            behavior={Platform.select({ android: undefined, ios: "padding" })}
            enabled={Platform.OS == "android" ? false : true}
          >
            <ScrollView
              style={{ marginTop: 40, marginHorizontal: 18 }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 35,
                  color: "#905094",
                  fontFamily: "NotoSans-Bold",
                }}
              >
                {this.props.title}
              </Text>

              <View>
                <View style={{ flexDirection: "row", marginTop: 35 }}>
                  <Text
                    style={{
                      color: "#8b8b8b",
                      fontSize: 16,
                      marginBottom: 5,
                      fontFamily: "NotoSans",
                    }}
                  >
                    {this.props.fname}
                  </Text>
                  <Text
                    style={{
                      color: "#FF0000",
                      fontSize: 16,
                      marginBottom: 5,
                      fontFamily: "NotoSans",
                    }}
                  >
                    *
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      color: "#757575",
                      fontFamily: "NotoSans",
                    }}
                  >
                    Dr.{" "}
                  </Text>
                  <TextInput
                    onSelectionChange={({ nativeEvent: { selection } }) => {
                      this.selection = selection;
                    }}
                    blurOnSubmit={false}
                    ref={(input) => {
                      this.firstName = input;
                    }}
                    autoCorrect={false}
                    defaultValue={this.props.auth.registerData.firstName}
                    onSubmitEditing={() => {
                      this.lastName.focus();
                    }}
                    returnKeyType={"next"}
                    onChangeText={this.props.onChangeTextFname}
                    keyboardType="default"
                    maxLength={50}
                    style={{
                      backgroundColor: "transparent",
                      color: "#242424",
                      width: "100%",
                      padding: 0,
                      fontSize: 30,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>

                {this.props.onClick ? (
                  this.props.validityCheckFname
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
              </View>

              <View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <View style={{ flexDirection: "row", marginTop: 35 }}>
                    <Text
                      style={{
                        color: "#8b8b8b",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      {this.props.lname}
                    </Text>
                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      *
                    </Text>
                  </View>

                  <TextInput
                    onChangeText={this.props.onChangeTextLname}
                    keyboardType="default"
                    maxLength={50}
                    ref={(input) => {
                      this.lastName = input;
                    }}
                    onSubmitEditing={() => {
                      this.mobile.focus();
                    }}
                    autoCorrect={false}
                    defaultValue={this.props.auth.registerData.lastName}
                    returnKeyType={"next"}
                    style={{
                      backgroundColor: "transparent",
                      color: "#242424",

                      padding: 0,
                      fontSize: 30,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>

                {this.props.onClick ? (
                  this.props.validityCheckLname
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
              </View>

              <View>
                <View style={{ flexDirection: "row", marginTop: 35 }}>
                  <Text
                    style={{
                      color: "#8b8b8b",
                      fontSize: 16,
                      fontFamily: "NotoSans",
                    }}
                  >
                    {this.props.mobile}
                  </Text>
                  <Text
                    style={{
                      color: "#FF0000",
                      fontSize: 16,
                      marginBottom: 5,
                      fontFamily: "NotoSans",
                    }}
                  >
                    *
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                    alignItems: "center",
                    paddingBottom: 0,
                  }}
                >
                  {/* <Text style={{ flex: 0.2, fontSize: 30, paddingLeft: 10, color: '#4a4a4a', fontFamily: 'NotoSans', alignItems: 'center' }}>+91</Text> */}
                  <TextInput
                    maxLength={3}
                    editable={false}
                    placeholder="+91"
                    placeholderTextColor="#242424"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingLeft: 0,
                      fontFamily: "NotoSans",
                      flex: Platform.isPad ? 0.1 : 0.2,
                      color: "#242424",
                      paddingBottom: 5,
                      includeFontPadding: false,
                      fontSize: 30,
                    }}
                  />
                  <TextInput
                    onChangeText={this.props.onChangeTextmobile}
                    //onBlur={() => this.props.verifyMobileNumber}
                    onBlur={() => {
                      this.props.verifyMobileNumber;
                    }}
                    maxLength={10}
                    ref={(input) => {
                      this.mobile = input;
                    }}
                    onSubmitEditing={() => {
                      this.props.regRef.current
                        ? this.props.regRef.current.focus()
                        : this.emailId.focus();
                    }}
                    autoCorrect={false}
                    defaultValue={this.props.auth.registerData.mobile}
                    keyboardType="numeric"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "NotoSans",
                      flex: 0.8,
                      paddingBottom: 5,
                      color: "#242424",
                      includeFontPadding: false,
                      fontSize: 30,
                    }}
                  />
                </View>

                {this.props.onClick ? (
                  this.props.validityCheckMobile
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
                {this.props.isExits ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: "#4a4a4a",
                        alignSelf: "center",
                        fontSize: 16,
                        fontFamily: "NotoSans",
                      }}
                    >
                      {"You are already an user. Please "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Login")}
                    >
                      <Text
                        style={{
                          color: "#06b7cc",
                          alignSelf: "center",
                          fontSize: 16,
                          textDecorationLine: "underline",
                          fontFamily: "NotoSans",
                        }}
                      >
                        Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: "#4a4a4a",
                        alignSelf: "center",
                        fontSize: 16,
                        fontFamily: "NotoSans",
                      }}
                    ></Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: "#06b7cc",
                          alignSelf: "center",
                          fontSize: 16,
                          textDecorationLine: "underline",
                          fontFamily: "NotoSans",
                        }}
                      ></Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <View style={{ flexDirection: "row", marginTop: 35 }}>
                    <Text
                      style={{
                        color: "#8b8b8b",
                        fontSize: 16,
                        fontFamily: "NotoSans",
                      }}
                    >
                      {this.props.email}
                    </Text>

                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      *
                    </Text>
                  </View>

                  <TextInput
                    keyboardType="email-address"
                    maxLength={40}
                    ref={(input) => {
                      this.emailId = input;
                    }}
                    autoCorrect={false}
                    onChangeText={this.props.onChangeTextemail}
                    autoCapitalize="none"
                    returnKeyLabel={"Next"}
                    onSubmitEditing={() => {
                      this.regNum.focus();
                    }}
                    // defaultValue={this.props.auth.registerData.length>0?this.props.auth.registerData[3]:""}
                    defaultValue={this.props.auth.registerData.email}
                    style={{
                      color: "#242424",

                      padding: 0,
                      fontSize: this.props.emailFont,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>
                {this.props.onClick ? (
                  this.props.validityCheckEmail
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
              </View>
              <View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <View style={{ flexDirection: "row", marginTop: 35 }}>
                    <Text
                      style={{
                        color: "#8b8b8b",
                        fontSize: 16,
                        fontFamily: "NotoSans",
                      }}
                    >
                      {this.props.micrNo}
                    </Text>
                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      *
                    </Text>
                  </View>

                  <TextInput
                    keyboardType="default"
                    maxLength={30}
                    ref={(input) => {
                      this.regNum = input;
                    }}
                    autoCorrect={false}
                    onChangeText={this.props.onChangeTextmicrNo}
                    autoCapitalize="none"
                    returnKeyLabel={"Next"}
                    onSubmitEditing={() => {
                      this.councilName.focus();
                    }}
                    // defaultValue={this.props.auth.registerData.length>0?this.props.auth.registerData[3]:""}
                    defaultValue={this.props.auth.registerData.micrNo}
                    style={{
                      color: "#242424",

                      padding: 0,
                      fontSize: this.props.emailFont,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>
                {this.props.onClick ? (
                  this.props.validityCheckMicrNo
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
              </View>
              <View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <View style={{ flexDirection: "row", marginTop: 35 }}>
                    <Text
                      style={{
                        color: "#8b8b8b",
                        fontSize: 16,
                        fontFamily: "NotoSans",
                      }}
                    >
                      {this.props.council}
                    </Text>
                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 16,
                        marginBottom: 5,
                        fontFamily: "NotoSans",
                      }}
                    >
                      *
                    </Text>
                  </View>
                  <TextInput
                    keyboardType="default"
                    maxLength={30}
                    ref={(input) => {
                      this.councilName = input;
                    }}
                    autoCorrect={false}
                    onChangeText={this.props.onChangeTextcouncilName}
                    autoCapitalize="none"
                    returnKeyLabel={"Next"}
                    onSubmitEditing={() => this.props.navigate()}
                    // defaultValue={this.props.auth.registerData.length>0?this.props.auth.registerData[3]:""}
                    defaultValue={this.props.auth.registerData.councilName}
                    style={{
                      color: "#242424",

                      padding: 0,
                      fontSize: this.props.emailFont,
                      fontFamily: "NotoSans",
                    }}
                  />
                </View>
                {this.props.onClick ? (
                  this.props.validityCheckCouncilName
                ) : (
                  <Text
                    style={{
                      color: "#FF0000",
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: 12,
                    }}
                  >
                    {""}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={this.props.onSelected}
                >
                  {this.props.isSelected ? (
                    <Image
                      style={{ resizeMode: "contain", height: 24, width: 24 }}
                      source={Images.ic_checked}
                    />
                  ) : (
                    <Image
                      style={{ resizeMode: "contain", height: 24, width: 24 }}
                      source={Images.ic_unchecked}
                    />
                  )}
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgb(117, 117, 117)",
                      fontFamily: "NotoSans",
                    }}
                  >
                    I am a Registered Medical practitioner{" "}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgb(117, 117, 117)",
                        fontFamily: "NotoSans",
                      }}
                    >
                      and I agree to the
                    </Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(termsLink)}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#06b7cc",
                          marginLeft: 5,
                          textDecorationLine: "underline",
                          fontFamily: "NotoSans",
                        }}
                      >
                        terms & conditions
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 
                        <View style={{ flexDirection: 'row', marginTop: 40,flexGrow:1 }}>

                            <TouchableOpacity
                                style={{ marginRight: 20 }}
                                onPress={this.props.onSelected}>
                                {this.props.isSelected ? <Image style={{ resizeMode: 'contain', height: 24, width: 24 }} source={Images.ic_checked} /> : <Image style={{ resizeMode: 'contain', height: 24, width: 24 }} source={Images.ic_unchecked} />}
                            </TouchableOpacity>
                            <Text style={{ fontSize: 14, color: 'rgb(117, 117, 117)', fontFamily: 'NotoSans' }}>I am a Registered Medical practitioner and I agree to the</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(termsLink)}>


                                <Text style={{ fontSize: 16, color: 'rgb(117, 117, 117)', marginLeft: 5, textDecorationLine: 'underline', fontFamily: 'NotoSans' }}>Terms & conditions</Text>
                            </TouchableOpacity>
                        </View> */}
              <View style={{ marginVertical: 28 }}>
                <TouchableOpacity
                  disabled={this.props.isExits}
                  onPress={() => this.props.navigate()}
                >
                  <LinearGradient
                    colors={
                      this.props.isExits
                        ? ["#a2a2a2", "#a2a2a2"]
                        : ["#1b7cdb", "#07cef2"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.8]}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 25,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 17,
                        color: "#ffffff",
                        fontFamily: "NotoSans",
                        marginRight: 5,
                      }}
                    >
                      SIGN UP
                    </Text>
                    {this.props.loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginBottom: 30,
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#4a4a4a",
                    alignSelf: "center",
                    fontSize: 16,
                    fontFamily: "NotoSans",
                  }}
                >
                  {this.props.isExits
                    ? "You are already a user. Please "
                    : "Already a user? "}
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text
                    style={{
                      color: "#06b7cc",
                      alignSelf: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                      fontFamily: "NotoSans",
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>

        {this.props.showToast
          ? this.refs.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={this.props.toastTextColor}
              imagePath={this.props.toastImgPath}
              description={this.props.description}
            />,

            1500
          )
          : null}
        <Toast
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            width: "90%",

            backgroundColor: this.props.toastBgColor,
            borderRadius: 15,
          }}
          ref="toast"
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  userRegistrationSuccess: (mobile, email, firstName, lastName, promoCode) =>
    dispatch(
      userRegistrationSuccess(mobile, email, firstName, lastName, promoCode)
    ),
  setMobile: (mobile) => dispatch(setMobile(mobile)),
  setDoctorId: (doctorid) => dispatch(setDoctorId(doctorid)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
