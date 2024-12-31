/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { S3BaseUrl } from '../../../app.json'

import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { ic_profile_image, ic_take_photo_icon, ic_remove } from '../../constants/images'
import CustomizeComponent from '../CustomizeComponents/CustomizeComponents'
import { generateGuid } from '../../commonmethods/common';
import { RNS3 } from 'react-native-aws3';


export default class PatientCameraTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgpath: null
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

        this.setState({ imgpath: image.path }, () => {
          //this.props.onDataChanges("Userimage",this.state.imgpath)
          this.uploadImage();
        })

        //this.uploadImage()

      }
    }).catch(err => {
      var x = ''
    });;
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
          //this.props.onDataChanges("Userimage",this.state.imgpath)
        })



      }

    }).catch(err => { });
  }

  // upload image
  uploadImage() {
    let file = {
      uri: this.state.imgpath,
      name: generateGuid() + ".jpeg",
      type: "image/jpeg"
    }
    let config = {
      keyPrefix: "patientimg/",
      bucket: "prescripimage",
      region: "ap-southeast-1",
      accessKey: "AKIA2P5O2LH6PGYG3CI3",
      secretKey: "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",
      successActionStatus: 201,
      awsUrl: "s3.amazonaws.com/"
    }
    RNS3.put(file, config).then(response => {
      if (response.status == 201) {
        this.props.onDataChanges('Userimage', file.name);

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
            this.props.onDataChanges('Userimage', "");
            this.props.patientDetails.CommonDetails.Userimage = ""

            // this.props.setDoctorData(this.props.doctorProfile.DoctorData)
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
          {this.props.patientDetails.CommonDetails.Userimage ? <Image source={{ uri: S3BaseUrl + "patientimg/" + this.props.patientDetails.CommonDetails.Userimage }} style={{ resizeMode: 'cover', height: 200, width: 200 }} /> :
            <Image source={ic_profile_image} style={{ resizeMode: 'contain', height: 200, width: 200 }} />}

          <TouchableOpacity onPress={() => this.onRemoveClick()} style={{ flex: 0.1, position: 'absolute', right: 55, top: 42 }}>
            <Image source={this.props.patientDetails.CommonDetails.Userimage ? ic_remove : null} style={{ height: 25, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 30, color: '#919191', lineHeight: 18, fontFamily: 'NotoSans', justifyContent: 'center', alignItems: 'center' }}>Patient Profile Image is optional, but helps you with the {"\n"}identification of patient at a glance.</Text>
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
            style={{ textAlign: 'center', fontSize: 15, fontFamily: 'NotoSans-bold', textDecorationLine: 'underline', color: '#1b7cdb' }}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

    )
  }
}