import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { tabDataStore } from '../../actions/previewSettings';
import {
  ic_clinic_option,
  ic_selected_template,
  ic_logo_1,
  ic_logo_2,
  ic_logo_3,
  ic_logo_4,
  ic_logo_5,
  ic_logo_6,
  ic_logo_7,
  ic_logo_8,
  ic_logo_9,
  ic_logo_10,
  ic_logo_11,
  ic_logo_12,
  ic_logo_13,
} from '../../constants/images';
import Images from '../../Theme/Images';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import {
  s3DocSignConfig as config,
  signBucket,
  doctorLogo,
} from '../../../app.json';
import { generateGuid } from '../../commonmethods/common';

class Cliniclogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setIndex: -1,
      logoArr: [
        { cliniclogo: ic_clinic_option, name: '', type: 'custom' },
        { cliniclogo: ic_logo_1, name: 'logo-1.png', type: 'fixed' },
        { cliniclogo: ic_logo_2, name: 'logo-2.png', type: 'fixed' },
        { cliniclogo: ic_logo_3, name: 'logo-3.png', type: 'fixed' },
        { cliniclogo: ic_logo_4, name: 'logo-4.png', type: 'fixed' },
        { cliniclogo: ic_logo_5, name: 'logo-5.png', type: 'fixed' },
        { cliniclogo: ic_logo_6, name: 'logo-6.png', type: 'fixed' },
        { cliniclogo: ic_logo_7, name: 'logo-7.png', type: 'fixed' },
        { cliniclogo: ic_logo_8, name: 'logo-8.png', type: 'fixed' },
        { cliniclogo: ic_logo_9, name: 'logo-9.png', type: 'fixed' },
        { cliniclogo: ic_logo_10, name: 'logo-10.png', type: 'fixed' },
        { cliniclogo: ic_logo_11, name: 'logo-11.png', type: 'fixed' },
        { cliniclogo: ic_logo_12, name: 'logo-12.png', type: 'fixed' },
        { cliniclogo: ic_logo_13, name: 'logo-13.png', type: 'fixed' },
      ],
      image: null,
      imgPath: null,
      captured: false,
    };
  }
  componentDidMount() {
    if (this.props.doctorProfile.DoctorData.Logo) {
      let img = {
        cliniclogo: ic_clinic_option,
        name: this.props.doctorProfile.DoctorData.Logo,
        type: 'custom',
      };
      let images = this.state.logoArr;
      if (images[1].type == 'fixed' || images[1].type == 'custom') {
        images.splice(1, 0, img);
      }
      this.setState(
        {
          logoArr: images,
        },
        () => { },
      );
    }
  }
  takePicture = async () => {
    this.cropImage();
  };
  cropImage() {
    ImagePicker.openPicker({
      //path : this.state.imgPath,
      width: 300,
      height: 300,
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
            setIndex: -1,
          },
          () => this.updateArr(this.state.imgPath, 'upload'),
        );
      })
      .catch((err) => { });
  }

  updateArr(path, type) {
    let img = {
      cliniclogo: ic_clinic_option,
      name: path,
      type: type,
    };
    let images = this.state.logoArr;
    if (images[1].type == 'fixed' || images[1].type == 'custom') {
      images.splice(1, 0, img);
    } else {
      images[1] = img;
    }
    this.setState({
      logoArr: images,
    });
  }
  uploadImage() {
    let guid = generateGuid();
    let file = {
      uri: this.state.imgPath,
      name: guid + '.jpeg',
      type: 'image/jpeg',
    };
    let options = {
      keyPrefix: 'images/',
      bucket: 'prescripimage',
      region: 'ap-southeast-1',
      accessKey: 'AKIA2P5O2LH6PGYG3CI3',
      secretKey: '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',
      successActionStatus: 201,
      awsUrl: 's3.amazonaws.com/',
    };
    try {
      RNS3.put(file, options).then((response) => {
        if (response.status == 201) {
          let settings = this.props.previewReducer.templateData;
          settings.Logo = file.name;
          this.props.tabDataStore(settings);
          this.setState({ loading: false, setIndex: 1 });
        } else {
          alert('Failed to upload image');
        }
      });
    } catch {
      alert('Failed to upload image');
    }
  }
  setLogo(item, index) {
    if (index == 0) {
      this.takePicture();
    } else if (item.type == 'upload') {
      this.uploadImage();
    } /*if(item.type=='fixed')*/ else {
      let logo = item.name;
      let settings = this.props.previewReducer.templateData;
      settings.Logo = logo;
      this.props.tabDataStore(settings);
      this.setState({ setIndex: index }, () => {
        this.props.showReset();
      });
    }
  }
  itemView(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.setLogo(item, index)}
        style={{
          
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center' 
        }}>
        <View style={{ flex: 0.25 }}>
          <Image
            source={this.state.setIndex == index ? ic_selected_template : null}
            style={{
              alignSelf: 'flex-end',
              resizeMode: 'contain' ,
              height: 30,
              width: 30,
            }}
          />
          <Image
            source={
              index == 0
                ? item.cliniclogo
                : {
                  uri:
                    item.type == 'fixed' || item.type == 'custom'
                      ? doctorLogo + item.name
                      : item.name,
                }
            }
            style={{ resizeMode: 'contain', height: 90, width: 90, padding: 5 }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.logoArr}
        style={{ flex: 1, padding: 10, backgroundColor :'#fff' }}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => this.itemView(item, index)}
      />
    );
  }
}

const styles = StyleSheet.create({
  dropdownFont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 50,
    right: 10,
    height: 150,
    width: 120,
    zIndex: 5,
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderRightColor: '#cccccc',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  case1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
    margin: 8,
    // backgroundColor: '#b5e7a0',
    // borderColor: '#cccccc',
    borderWidth: 0.7,
  },
  case3and4: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5,
  },
  case2: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5,
  },
  labelTxt: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  textStyle: {
    color: '#444444',
    fontSize: 16,
  },
  imgStyle: {
    resizeMode: 'contain',
    height: 12,
  },
  btnStyle: {
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 20,
    height: 32,
  },
  rightImg: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  viewCase2: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  previewReducer: state.previewReducer,
});

const mapDispatchToProps = (dispatch) => ({
  setTemplateType: (templateType) => dispatch(setTemplateType(templateType)),
  tabDataStore: (templateType) => dispatch(tabDataStore(templateType)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Cliniclogo);
