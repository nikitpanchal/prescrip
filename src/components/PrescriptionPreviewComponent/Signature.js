import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { tabDataStore } from "../../actions/previewSettings";
import {
  ic_settings_sign_logo,
  ic_close_button,
  ic_settings_edit_button,
  ic_setting_gallery,
  ic_setting_camera,
  remove_signature,
} from "../../constants/images";
import Images from "../../Theme/Images";
import ImagePicker from "react-native-image-crop-picker";
import { RNS3 } from "react-native-aws3";
import { s3DocSignConfig as config, signBucket } from "../../../app.json";
import { generateGuid } from "../../commonmethods/common";
class Signature extends Component {
  constructor(props) {
    super(props);

    this.guid = "";
    this.state = {
      loading: false,
      logoAray: [],
      image: null,
      imgPath: null,
      editImage: false,
    };
    this.Signature = this.props.doctorProfile.DoctorData.Signature
      ? this.props.doctorProfile.DoctorData.Signature
      : "";
  }
  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.setState({
        editImage: false,
      });
      this.Signature = this.props.doctorProfile.DoctorData.Signature
        ? this.props.doctorProfile.DoctorData.Signature
        : "";
    });
  }
  takePicture = async () => {
    this.cropImage();
  };

  RemoveImage() {
    Alert.alert(
      "Prescrip",
      "Do you want to delete this signature image ?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => this.Removeimage_signature(),

          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  chooseOption = async () => {
    //this.openPicker();
    this.setState({
      editImage: true,
    });
  };
  openPicker() {
    let self = this;
    ImagePicker.openPicker({
      //path : this.state.imgPath,
      width: 500,
      height: 200,
      cropping: true,
      useFrontCamera: false,
      showCropGuidelines: false,
    })
      .then((image) => {
        this.props.uploadSignature(image.path);
        this.setState(
          {
            image: image,
            imgPath: image.path,
            captured: true,
            editImage: false,
          },
          () => {
            self.props.showReset();
          }
        );
      })
      .catch((err) => console.log("err:", err));
  }
  takeGallery = async () => {
    this.openPicker();
  };
  openGallery() {
    ImagePicker.openGallery({
      //path : this.state.imgPath,
      width: 500,
      height: 200,
      cropping: true,
      useFrontCamera: false,
      showCropGuidelines: false,
    })
      .then((image) => {
        this.setState(
          {
            image: image,
            imgPath: image.path,
            captured: true,
            editImage: false,
          },
          () => {
            this.props.uploadSignature(image.path);
          }
        );
      })
      .catch((err) => console.log("err:", err));
  }
  cropImage() {
    let self = this;
    ImagePicker.openCamera({
      //path : this.state.imgPath,
      width: 500,
      height: 200,
      cropping: true,
      useFrontCamera: false,
      showCropGuidelines: false,
    })
      .then((image) => {
        this.props.uploadSignature(image.path);
        this.setState(
          {
            image: image,
            imgPath: image.path,
            captured: true,
            editImage: false,
          },
          () => self.props.showReset()
        );
      })
      .catch((err) => console.log("err:", err));
  }
  uploadImage() {
    this.guid = generateGuid();
    this.setState({
      loading: true,
    });
    let file = {
      uri: this.state.imgPath,
      name: this.guid + ".jpeg",
      type: "image/jpeg",
    };

    RNS3.put(file, config).then((response) => {
      if (response.status == 201) {
        this.Signature = file.name;
        let settings = this.props.previewReducer.templateData;
        settings.Signature = this.Signature;
        this.props.tabDataStore(settings);
      }
    });
  }
  Removeimage_signature() {
    this.props.doctorProfile.DoctorData.Signature = "";
    let settings = this.props.previewReducer.templateData;
    settings.Signature = "";
    this.Signature = "";
    this.props.tabDataStore(settings);

    this.setState(
      {
        imgPath: null,
        image: null,
      },
      () => {
        this.props.showReset();
      }
    );
  }
  renderPlaceholder() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.imgPath ? (
          <TouchableOpacity
            style={{ alignSelf: "flex-end", margin: 10 }}
            onPress={() =>
              this.setState({
                editImage: false,
                imgPath: null,
                image: null,
              })
            }
          >
            <Image
              source={ic_close_button}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            ></Image>
          </TouchableOpacity>
        ) : this.state.editImage ? (
          <TouchableOpacity
            style={{ alignSelf: "flex-end", margin: 10 }}
            onPress={() =>
              this.setState({
                editImage: false,
                imgPath: null,
                image: null,
              })
            }
          >
            <Image
              source={ic_close_button}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            ></Image>
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.takePicture();
            }}
            style={{ flex: 0.49 }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f1f1f9",
                borderColor: "#5252b7",
                borderRadius: 6,
                borderStyle: "dotted",
                borderWidth: 2,
              }}
            >
              <Image
                source={ic_setting_camera}
                style={{ resizeMode: "contain", width: 55, height: 55 }}
              ></Image>
              <Text
                style={{
                  color: "#5252b7",
                  fontFamily: "NotoSans-Bold",
                  fontSize: 15,
                }}
              >
                Take a Photo
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.takeGallery();
            }}
            style={{ flex: 0.49 }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f1f1f9",
                borderColor: "#5252b7",
                borderRadius: 6,
                borderStyle: "dotted",
                borderWidth: 2,
              }}
            >
              <Image
                source={ic_setting_gallery}
                style={{ resizeMode: "contain", width: 55, height: 55 }}
              ></Image>
              <Text
                style={{
                  color: "#5252b7",
                  fontFamily: "NotoSans-Bold",
                  fontSize: 15,
                }}
              >
                Upload from Gallery
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderSignature() {
    return (
      <View style={{ flex: 1, margin: Platform.isPad ? 10 : 0 }}>
        <TouchableOpacity
          onPress={() => this.RemoveImage()}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            top: -10,
            right: -11,
            elevation: 12,
            zIndex: 1,
          }}
        >
          <Image
            source={remove_signature}
            style={{ height: 22, width: 22, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#cccccc",
            borderWidth: 0.8,
          }}
        >
          <TouchableOpacity
            onPress={() => this.chooseOption()}
            style={{ height: "80%", width: "100%", paddingTop: 15 }}
          >
            <Image
              source={{
                uri: this.state.imgPath
                  ? this.state.imgPath
                  : this.Signature
                  ? signBucket + this.Signature
                  : "",
              }}
              style={{ resizeMode: "contain", height: "80%", width: "100%" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.chooseOption();
            }}
            style={{ alignSelf: "flex-end" }}
          >
            <Image
              source={ic_settings_edit_button}
              style={{
                resizeMode: "contain",
                height: 45,
                width: 45,
                alignSelf: "flex-end",
              }}
            />
          </TouchableOpacity>
        </View>
        {/*<View style={{flexDirection:'row', margin : 5,justifyContent:'space-between',alignItems:'center'}}>
<TouchableOpacity onPress={()=>{this.removeImage()}}>
<Text   style={{fontSize:18,fontFamily:'NotoSans-Bold',color:'#FF0000' }} >REMOVE</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{this.uploadImage()}}>
<Text style={{fontSize:18,fontFamily:'NotoSans-Bold',color:'#0065d7'}}>{this.Signature?"CHANGE":"ADD"}</Text>
</TouchableOpacity>
  </View>*/}
      </View>
    );
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingBottom: 40,
          paddingTop: 15,
        }}
      >
        {(this.Signature || this.state.imgPath) && !this.state.editImage
          ? this.renderSignature()
          : this.renderPlaceholder()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdownFont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: 50,
    right: 10,
    height: 150,
    width: 120,
    zIndex: 5,
    borderBottomColor: "#cccccc",
    borderLeftColor: "#cccccc",
    borderRightColor: "#cccccc",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  case1: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.5,
    margin: 8,
    // backgroundColor: '#b5e7a0',
    // borderColor: '#cccccc',
    borderWidth: 0.7,
  },
  case3and4: {
    flex: 1,
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
  },
  case2: {
    flex: 1,
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
  },
  labelTxt: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 12,
  },
  textStyle: {
    color: "#444444",
    fontSize: 16,
  },
  imgStyle: {
    resizeMode: "contain",
    height: 12,
  },
  btnStyle: {
    borderBottomColor: "#cccccc",
    borderLeftColor: "#cccccc",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 20,
    height: 32,
  },
  rightImg: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  viewCase2: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  previewReducer: state.previewReducer,
});

const mapDispatchToProps = (dispatch) => ({
  tabDataStore: (templateType) => dispatch(tabDataStore(templateType)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Signature);
