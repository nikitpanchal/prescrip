import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { ic_profile_image, ic_take_photo_icon, ic_remove } from '../../constants/images'
import CustomizeComponent from '../CustomizeComponents/CustomizeComponents'
import { generateGuid } from '../../commonmethods/common';
import { RNS3 } from 'react-native-aws3';
import { connect } from 'react-redux'
import { setDoctorData, } from '../../actions/doctorProfile';

import { s3Config as config, doctorBucket } from "../../../app.json";
class DoctorCameraTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imgpath: null,


    }
  }

  // take photo from camera
  takePhoto() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      if (image != null) {
        this.props.onDataChanges("DoctorImage", image.path)
        this.setState({ imgpath: image.path }, () => {
          this.uploadImage();
        })

        //this.uploadImage()

      }
    }).catch(err => { });;
  }

  // choose photo from gallery
  choosePhoto() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      if (image != null) {

        this.setState({ imgpath: image.path }, () => {
          this.uploadImage();
        })



      }

    }).catch(err => {
    });
  }

  uploadImage() {
    let file = {
      uri: this.state.imgpath,
      name: generateGuid() + ".jpeg",
      type: "image/jpeg"
    }

    RNS3.put(file, config).then(response => {

      if (response.status == 201) {


        try {
          this.props.updateDoctorDetails(file.name, "DoctorImage", this.props.doctorProfile.DoctorData._id).then(response => {
            if (response.payload.data.status === 1) {
              this.props.doctorProfile.DoctorData.DoctorImage = file.name
              this.props.onDataChanges("DoctorImage", file.name)
              this.props.setDoctorData(this.props.doctorProfile.DoctorData)

            }
          });

        }
        catch (ex) {

        }
      }

    });

  }





  onRemoveClick() {

    Alert.alert(
      'Prescrip',
      'Do you want to delete this profile image ?',
      [

        {
          text: 'Yes',
          onPress: () => {
            this.props.onDataChanges('DoctorImage', "");
            this.props.doctorProfile.DoctorData.DoctorImage = ""

            this.props.setDoctorData(this.props.doctorProfile.DoctorData)
          }

        },
        {
          text: 'No', onPress: () => { },
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );

  }

  render() {


    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>

            {this.props.doctorData.DoctorImage ? <Image source={{ uri: doctorBucket + this.props.doctorData.DoctorImage }} style={{ resizeMode: 'cover', height: 200, width: 200 }} /> :
              <Image source={ic_profile_image} style={{ resizeMode: 'contain', height: 200, width: 200 }} />}



            <TouchableOpacity onPress={() => this.onRemoveClick()} style={{ flex: 0.1, position: 'absolute', right: -30, top: -10 }}>
              <Image source={this.props.doctorData.DoctorImage ? ic_remove : null} style={{ height: 25, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>


          <Text style={{ fontSize: 12, textAlign: 'center', padding: 20, color: '#8b8b8b', lineHeight: 18, fontFamily: 'NotoSans' }}>Patient Profile Image is optional but helps you with the {"\n"} identification
            of patient at a glance</Text>
        </View>
        <View style={{ flex: 0.15 }}>
          <CustomizeComponent {...this.props}
            viewType="button"
            buttonType="gradient"
            onBtnPress={() => this.takePhoto()}
            setImage={ic_take_photo_icon}
            btnColor={["#1b7cdb", "#07cef2"]}
            btnTxt={"Take Photo"} />
        </View>
        <TouchableOpacity style={{ flex: 0.15 }} onPress={() => this.choosePhoto()}>
          <Text
            style={{ textAlign: 'center', fontSize: 15, fontFamily: 'NotoSans-Bold', textDecorationLine: 'underline', color: '#1b7cdb' }}>Choose Photo</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  doctorProfile: state.doctorProfile
});

const mapDispatchToProps = dispatch => ({
  setDoctorData: (data) => dispatch(setDoctorData(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorCameraTab);
