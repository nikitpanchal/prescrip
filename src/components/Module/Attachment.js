import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import {
  Container,
  Button,
  Icon,
  Picker,
  CheckBox,
  Label,
  Item,
  Input,
} from 'native-base';

import LinearGradient from 'react-native-linear-gradient';
import {
  lefticon,
  icon_List_First_Element_Add_Button_Blue,
  Attachment_dots,
  ic_popup_Add_Button_fab,
  ic_pdf,
} from '../../constants/images';
var fabRipple = require('../../../assets/finding/FAB.json');
import FAB from '../../components/FAB/FAB';
import {
  ic_files,
  ic_takePhoto,
  empty_vc,
  Iamge_Folder,
} from '../../constants/images';
import EmptyHome from '../EmptyHome/EmptyHome';

const colorCode = '#881896';

import Modal from 'react-native-modalbox';
import LottieView from 'lottie-react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';




import DocumentPicker from 'react-native-document-picker';

import AttachmentTile from '../CommonComponents/AttachmentTile';

import {
  setAttachmentDataS3,
  setAttachmentEditing,
} from '../../actions/attachment';

import { withDb } from '../../DatabaseContext/withDatabase';
import { connect } from 'react-redux';
import { isImageValid } from '../../commonmethods/validation';

var RNFS = require('react-native-fs');
import { RNS3 } from 'react-native-aws3';
import { generateGuid, getSizeOfDoc } from '../../commonmethods/common';
const DATA = [
  {
    id: 'IMG_220122020',
    title: 'First Item',
    color: 'red',
    imagepath: 'https://api.adorable.io/avatars/285/test@user.i.png',
  },
  {
    id: 'IMG_3201220201',
    title: 'Second Item',
    color: 'blue',
    imagepath: 'https://api.adorable.io/avatars/285/test@user.i2.png',
  },
  {
    id: '48694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    color: 'green',
    imagepath: 'https://api.adorable.io/avatars/285/test@user.i3.png',
  },
];

class Attachment extends React.Component {
  constructor(props) {
    super(props);
    this.modal2 = React.createRef();
    this.state = {
      stateupload: [...this.props.Upload],
      // isActiveFab: true,
      renamepopupopen: false, //keep track of rename popupopen or not
      imagevieweropen: false, // imageviewer open or not
      imageindex: -1, //tacking of image of index here
      modalData: [
        {
          Name: 'Take Photo',
          image: ic_takePhoto,
          route: 'Assessment',
        },
        {
          Name: 'Choose Photo from Gallery',
          image: Iamge_Folder,
          route: 'UserFavPrescription',
        },
        {
          Name: 'Choose PDF from Files',
          image: ic_files,
          route: 'UserFavPrescription',
        },
      ], // modal option
      modalDataElements: [], // binding modal UI
      data: [],
    };
    this.images = [];
    this.previewImgs = [];
    this.modalattachfile = React.createRef();
    this.modalrename = React.createRef();
    this.modalImageViewer = React.createRef();
  }

  // viewing all images
  viewAllimage(index) {
    this.images = [];
    for (var i = 0; i < DATA.length; i++) {
      if (DATA[i].imagepath.toString().indexOf('http') !== -1) {
        this.images.push({
          id: i,
          uri: DATA[i].imagepath,
        });
      } else {
        this.images.push(DATA[i].imagepath);
      }
    }
    this.setState({
      imagevieweropen: true,
      menuIndex: -1,
      imageindex: index,
    });
  }

  //code for deletefile
  delelefilename(index, rowID, item) {
    // alert(rowID);
    if (rowID == 2) {

      this.setState({
        menuIndex: -1,
        statedata: this.state.stateupload.splice(index, 1)
      });
      this.props.setAttachmentDataS3(this.state.stateupload)
    } else {
      if (item.titleName) {
        item = item;
      } else {
        item = {
          titleName: item
            .substr(item.lastIndexOf('_') + 1)
            .substr(0, item.indexOf('.')),
        };
      }
      this.setState({
        genericNamePopup: item.titleName,
        editableRowData: item,
        editableRowIndex: index,
      });
      this.props.setAttachmentDataS3(this.state.stateupload)
      this.modal2.open();

    }
  }

  componentDidMount() {
    Keyboard.dismiss();

    // this.props.setAttachmentEditing(false)
    let copy = [...this.props.Upload];
    this.props.setAttachmentDataS3(copy);
    this.setState({
      statedata: copy,
    });
  }
  addLabel() {
    let filtered = [];
    this.state.statedata.filter((i) => {
      if (i.titleName == this.state.genericNamePopup) {
        filtered.push(i);
      }
    });
    if (filtered.length > 0) {
      Alert.alert('File is already selected ');
    } else {
      let editableRowDataFinal = this.state.editableRowData;
      editableRowDataFinal.titleName = this.state.genericNamePopup;

      let updatedArray = this.state.statedata;
      updatedArray[this.state.editableRowIndex] = editableRowDataFinal;

      this.setState({
        statedata: updatedArray,
      });
      this.modal2.close();

      this.props.setAttachmentDataS3(this.state.statedata);
    }
  }

  //FAB btn click
  fabtouch = (name) => {
    this.modalattachfile.open();
  };
  //ASK CAMERA PERMISSION
  hasCameraPermission = async () => {
    // if (Platform.OS === 'ios') {
    //   const hasPermission = await this.hasLocationPermissionIOS();
    //   return hasPermission;
    // }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Camera permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Prescrip',
        'Camera permission denied. Please enable it from setting',
        [{ text: 'OK', onPress: () => Linking.openSettings() }],
      );
    }

    return false;
  };
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("Camera permission given");
      } else {
        // console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  //function for opening photo and cdocs
  handleOpenCamera = async (rowId) => {
    if (rowId == 0) {
      if (Platform.OS == 'android') {
        const hasCameraPermission = await this.hasCameraPermission();

        if (!hasCameraPermission) {
          return;
        }
      }

      let quality_ = 80;
      const options = {
        noData: true,
        quality: 0.2,
        includeBase64: true,
        customButtons: [],
        storageOptions: {
          path: 'images',
        },
      };

      launchCamera(options, (response) => {
        this.modalattachfile.close();
        response = Array.isArray(response) ? response[0] : response;

        if (response.assets) {
          response = Array.isArray(response.assets) ? response.assets[0] : response.assets;


          if (response.uri) {
            var res = response;
            if (!res.fileName) {
              res.fileName = res.fileName ? res.fileName : res.uri;
              let f_index = res.fileName.lastIndexOf('/');
              res.fileName = res.fileName.substring(
                f_index + 1,
                res.fileName.length - 1,
              );
            }
            res.fileName = res.fileName.replace("rn_image_picker_lib_temp_", '');
            //Checking size using RNFB - because On Android some DocumentProviders may not provide this
            if (Math.ceil(res.fileSize / 125000) <= 5) {
              this.setState({ loading: true });
              res.titleName = res.fileName.substr(0, res.fileName.indexOf('.'));
              let ext = res.fileName.split('.')[
                res.fileName.split('.').length - 1
              ];
              let file = {
                uri: res.uri,
                name: generateGuid() + '.' + ext,
                type: res.type,
              };
              // this.uploadToAws(file)
              this.onFilesReceived(res);
            } else {
              Alert.alert('Please select files which are less then 5 Mb');
            }
            return;

          }

        } else {
          //Alert.alert("Some error occurred");
        }
      });

    }

    if (rowId == 1) {
      let quality_ = 80;
      const options = {
        noData: true,
        quality: 0.2,
        includeBase64: true,
        customButtons: [],
        storageOptions: {
          path: 'images',
        },
      };

      launchImageLibrary(options, (response) => {
        this.modalattachfile.close();
        response = Array.isArray(response) ? response[0] : response;
        if (response.assets) {
          response = Array.isArray(response.assets) ? response.assets[0] : response.assets;

          if (response.uri) {
            var res = response;
            if (!res.fileName) {
              res.fileName = res.fileName ? res.fileName : res.uri;
              let f_index = res.fileName.lastIndexOf('/');
              res.fileName = res.fileName.substring(
                f_index + 1,
                res.fileName.length - 1,
              );
            }
            res.fileName = res.fileName.replace("rn_image_picker_lib_temp_", '');
            //Checking size using RNFB - because On Android some DocumentProviders may not provide this
            if (Math.ceil(res.fileSize / 125000) <= 5) {
              this.setState({ loading: true });
              res.titleName = res.fileName.substr(0, res.fileName.indexOf('.'));
              res.menuOpen = false;
              let ext = res.fileName.split('.')[
                res.fileName.split('.').length - 1
              ];
              let file = {
                uri: res.uri,
                name: generateGuid() + '.' + ext,
                type: res.type,
              };
              // this.uploadToAws(file)
              this.onFilesReceived(res);
            } else {
              Alert.alert('Please select files which are less then 5 Mb');
            }
            return;
            let width = Math.round((res.width * 10) / 100);
            let ht = Math.round((res.height * 10) / 100);
            ImageResizer.createResizedImage(response.uri, width, ht, 'JPEG', 80)
              .then((resizedImageUri) => {
                this.state.attachdata.push({
                  id: resizedImageUri.name,
                  title: 'Third Item',
                  color: 'green',
                  imagepath: resizedImageUri.uri,
                });
                this.setState({ attachdata: this.state.attachdata });
                //this.upoadToAWS(response, rowId, true, resizedImageUri);
                //   this.upoadToAWS(resizedImageUri, rowId, true);
              })
              .catch((err) => {
                //this.setState({ showLoader: false });
              });
          }
        } else {
          //Alert.alert("Some error occurred");
        }
      });
    } else if (rowId == 2) {

      var self = this;

      try {
        async function main() {
          const res = await DocumentPicker.pick({
            //  type: DocumentPicker.types['pdf'],
          });
          let _res = res[0];
          const filePath = Platform.OS === "android" ? _res.uri : _res.uri.replace("file://", "");
          const file = await RNFS.readFile(filePath, "base64");
          _res.base64 = file;
          //Checking size using RNFB - because On Android some DocumentProviders may not provide this
          if (Math.ceil(_res.size * 0.001) < 5000) {
            //  this.setState({ loading: true });
            _res.titleName = _res.name;
            _res.menuOpen = false;
            let ext = _res.name.split('.')[_res.name.split('.').length - 1];
            // let file = {
            //   uri: _res.uri,
            //   name: generateGuid() + '.' + ext,
            //   type: _res.type,
            // };
            //   self.uploadToAws(file)
            self.onFilesReceived(_res);
          } else {
            Alert.alert('Please select files which are less then 5 Mb');
          }
        }
        main();
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }
  };

  keyboardreturncalled() {
    Keyboard.dismiss();
    this.modalrename.close();
  }

  onFilesReceived = (files) => {
    this.modalattachfile.close();
    // alert(JSON.stringify(files))
    // Steps check if selected file is exceeding the size 5 MB
    let { stateupload } = this.state;
    stateupload.push(files);
    // let filtered = data.filter((i) => {
    //   return i.titleName == files.titleName;
    // });
    // if (filtered.length > 0) {
    //   Alert.alert('File is already selected ');
    // } else {
    //   //For Now configured for one file only
    //   data.push(files);
    // }
    //this.setState({ data: data });
    this.setState({ stateupload: stateupload });
    this.props.setAttachmentDataS3(this.state.stateupload);
    this.props.setAttachmentEditing(true);
  };
  async getFilePath(item) {
    //const uriComponents = item.uri.split('/')
    let fileNameAndExtension = item.name; //uriComponents[uriComponents.length - 1]
    let destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
    await RNFS.copyFile(item.uri, destPath);
    destPath = 'file://' + destPath;
    return destPath;
  }
  getAllImages(ext, path) {
    let uploads = this.props.Upload;
    this.previewImgs = [];
    let currentIndex = 0;
    uploads.forEach((item) => {
      let destPath = '';
      if (item && item instanceof Object) {
        destPath = item.uri ? item.uri : item.image;
        if (item.image) {
          destPath = item.image;
          let type = destPath.split('.')[destPath.split('.').length - 1];
          if (type == ext) {
            this.previewImgs.push(destPath);
          }
        } else if (item.uri && item.uri.startsWith('file://')) {
          destPath = item.uri;
          let type = destPath.split('.')[destPath.split('.').length - 1];
          if (type == ext) {
            this.previewImgs.push(destPath);
          }
        } else {
          let type = destPath.split('.')[destPath.split('.').length - 1];
          if (type == ext) {
            this.previewImgs.push(destPath);
          }
        }
      } else {
        let type = item.split('.')[item.split('.').length - 1];
        if (type == ext) {
          this.previewImgs.push(item);
        }
      }
    });
    currentIndex = this.previewImgs.findIndex((file) => {
      if (file == path) {
        return file;
      }
    });
    this.props.navigation.push('DocumentViewer', {
      item: path,
      index: currentIndex,
      imgList: this.previewImgs,
    });
  }
  async openDocument(ext, path) {
    switch (ext) {
      case 'pdf':
        this.props.navigation.push('DocumentViewer', { item: path });
        break;
      default:
        this.getAllImages(ext, path);

        break;
    }
  }
  async showItem(item) {
    this.Closeallmenu();

    let destPath = item.image ? item.image : item;
    if (item && item instanceof Object && item.uri) {
      if (item.uri && item.uri.startsWith('content://')) {
        //const uriComponents = item.uri.split('/')
        const fileNameAndExtension = item.name; //uriComponents[uriComponents.length - 1]
        let destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
        await RNFS.copyFile(item.uri, destPath);
        destPath = 'file://' + destPath;
        let ext = destPath.split('.')[destPath.split('.').length - 1];

        this.openDocument(ext, destPath);
      } else if (item.uri && item.uri.startsWith('file://')) {
        destPath = item.uri;
        let ext = destPath.split('.')[destPath.split('.').length - 1];

        this.openDocument(ext, destPath);
      } else {
        let ext = destPath.split('.')[destPath.split('.').length - 1];

        this.openDocument(ext, destPath);
      }
    } else {
      let ext = destPath.split('.')[destPath.split('.').length - 1];

      this.openDocument(ext, destPath);
    }
  }

  Closeallmenu() {
    this.state.stateupload.forEach((element) => {
      element.menuOpen = false;
    });
    this.setState({});
  }
  showMenu(index) {
    for (let i = 0; i < this.state.stateupload.length; i++) {
      if (index == i) {
        this.state.stateupload[i].menuOpen = !this.state.stateupload[i]
          .menuOpen;
        this.setState({});
      } else {
        this.state.stateupload[i].menuOpen = false;
        this.setState({});
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps={'never'}
          keyboardVerticalOffset={0}
          behavior={Platform.select({ android: undefined, ios: 'padding' })}
          enabled={Platform.OS == 'android' ? false : true}>
          <Modal
            useNativeDriver={true}
            animationDuration={200}
            style={{
              borderWidth: 0,
              width: '80%',
              height: 180,
              overflow: 'hidden',
              justifyContent: 'center',
            }}

            ref={(ref) => this.modal2 = ref}
            position={'center'}
            //swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View
                style={{
                  padding: 15,
                  paddingBottom: 0,
                  justifyContent: 'center',
                }}>
                <Text style={{ color: '#212121', fontSize: 20 }}>
                  Add Generic Name
                </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                <Item stackedLabel style={{}}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      color: '#545454',
                      fontSize: 15,
                      left: 15,
                    }}>
                    Rename Files
                  </Text>

                  <Input
                    autoFocus
                    onChangeText={(text) => {
                      this.setState({ genericNamePopup: text });
                    }}
                    defaultValue={
                      this.state.genericNamePopup != null
                        ? this.state.genericNamePopup
                        : ''
                    }
                    style={[
                      {
                        fontSize: 17,
                        color: '#404040',
                        margin: 0,
                        padding: 0,
                        height: 'auto',
                        borderBottomColor: '#d3d3d3',
                        borderBottomWidth: 1,
                        height: 40,
                        left: -3,
                        borderBottomWidth: 0,
                      },
                    ]}
                    keyboardType="default"
                    returnKeyType={'next'}
                  />
                </Item>
              </View>
              <View style={{ flexDirection: 'row', flex: 0.5 }}>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingRight: 0,
                      flex: 1,
                      justifyContent: 'flex-end',
                      marginRight: 15,
                      alignSelf: 'stretch',
                      paddingTop: 0,
                    },
                  ]}>
                  <TouchableOpacity onPress={() => this.addLabel(0, 'add')}>
                    <Text
                      style={[
                        {
                          color: '#008bdf',
                          fontSize: 17,
                          lineHeight: 20,
                          letterSpacing: 0.5,
                          paddingRight: 30,
                          fontSize: 15,
                        },
                      ]}>
                      Add
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.addLabel(0, 'skip')}>
                    <Text
                      style={[
                        {
                          color: '#7f7f7f',
                          fontSize: 17,
                          lineHeight: 20,
                          letterSpacing: 0.5,
                          fontSize: 15,
                        },
                      ]}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.Closeallmenu()}>
            <View style={{ flex: 1, width: Dimensions.get('window').width }}>
              {this.state.stateupload && this.state.stateupload.length > 0 ? (
                <FlatList
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  style={{ flex: 1, padding: 10 }}
                  data={this.state.stateupload}
                  numColumns={2}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                  /*    ListHeaderComponent={<View style={{ flex: 1 }}>
                                            <DocumentUploader getFile={this.onFilesReceived}
            
                                                delelefilename={this.delelefilename} />
                                        </View>
                                        }*/
                  renderItem={({ item, index }) => (
                    <AttachmentTile
                      key={index}
                      index={index}
                      onPress={() => this.showItem(item)}
                      onMenuClick={() => this.showMenu(index)}
                      Closeallmenu={() => this.Closeallmenu()}
                      delelefilename={(index, rowID, item) =>
                        this.delelefilename(index, rowID, item)
                      }
                      item={item}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state.statedata}
                />
              ) : (
                <EmptyHome
                  {...this.props}
                  isLottie={true}
                  topmargin={40}
                  imagePath={empty_vc}
                  title={'No data available'}
                  colorCode={colorCode}
                  isShowButton={false}
                  description={'Attachments not present'}
                  onClick={() => this.onClick()}
                />
              )}

              <TouchableWithoutFeedback onPress={this.fabtouch}>
                <View
                  style={{
                    bottom: 50,
                    right: 50,
                    width: 60,
                    height: 60,
                    position: 'absolute',
                  }}>
                  <Image
                    source={ic_popup_Add_Button_fab}
                    resizeMode={'contain'}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </TouchableWithoutFeedback>

              {/* for ImageViewer */}
              <Modal
                visible={true}
                transparent={true}
                isOpen={this.state.imagevieweropen}
                ref={(r) => (this.modalImageViewer = r)}
              //onClosed={() => this.setState({ imagevieweropen: false })}
              >
                {/* <ImageView
                                images={this.images}
                                imageIndex={this.state.imageindex}
                                visible={true}
                                onRequestClose={() => {
                                    //Alert.alert("Modal has been closed.");
                                    this.setState({ imagevieweropen: false })
                                    this.modalImageViewer.close()
                                }}
                            /> */}
              </Modal>

              {/* for renameimage */}
              <Modal
                useNativeDriver={true}
                animationDuration={200}
                style={{ borderWidth: 0, height: 150, bottom: 0 }}

                ref={(ref) => this.modal2 = ref}
                position={'bottom'}
                isOpen={this.state.renamepopupopen}
                onClosed={() => this.setState({ renamepopupopen: false })}>
                <View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 50,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        color: '#545454',
                        fontSize: 15,
                        left: 15,
                      }}>
                      Rename Filess
                    </Text>
                  </View>

                  <TextInput
                    onChangeText={(text) =>
                      this.setState({ genericNamePopup: text })
                    }
                    defaultValue={
                      this.state.genericNamePopup != null
                        ? this.state.genericNamePopup
                        : ''
                    }
                    style={{
                      borderBottomWidth: 1,
                      height: 40,
                      borderBottomColor: 'gray',
                      textAlign: 'left',
                      marginLeft: 15,
                      marginRight: 15,
                    }}
                    autoFocus={true}
                    ref="text1"
                    blurOnSubmit={false}

                    maxLength={50}
                    value={this.state.filename}
                    returnKeyType="done"
                    autoCapitalize="none"
                  />

                  <View
                    style={{
                      right: 10,
                      flexDirection: 'row',
                      height: 50,
                      bottom: 0,
                      marginTop: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.modal2.close();
                      }}
                      style={{ flex: 0.8, justifyContent: 'center' }}>
                      <Text
                        style={{
                          color: '#939393',
                          fontSize: 15,
                          alignSelf: 'flex-end',
                        }}>
                        CANCEL
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.addLabel(0, 'add')}
                      style={{ flex: 0.2, justifyContent: 'center' }}>
                      <Text
                        style={{
                          color: '#4faaac',
                          fontSize: 15,
                          alignSelf: 'flex-end',
                          right: 20,
                        }}>
                        SAVE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Modal
                useNativeDriver={true}
                animationDuration={200}
                style={{
                  backgroundColor: 'transparent',
                  height: 260,
                  borderWidth: 0,
                  width: '100%',
                  borderRadius: 10,
                  overflow: 'hidden',
                  justifyContent: 'center',
                }}
                ref={(r) => (this.modalattachfile = r)}
                swipeToClose={false}
                position={'bottom'}
                //swipeToClose={this.state.swipeToClose}
                onClosed={() => { }}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}>
                <TouchableOpacity
                  onPress={() => this.modalattachfile.close()}
                  style={{
                    paddingBottom: 5,
                    paddingHorizontal: 10,
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#fff',
                      fontFamily: 'NotoSans-Bold',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.modalattachfile.close()}
                  style={{
                    backgroundColor: '#fff',
                    borderTopStartRadius: 8,
                    borderTopRightRadius: 8,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}></TouchableOpacity>

                <View
                  style={{
                    bottom: 0,
                    flex: 1,
                    flexDirection: 'column',
                    borderTopStartRadius: 8,
                    borderTopRightRadius: 8,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderBottomColor: '#dcdcdc',
                      borderBottomWidth: 1,
                      justifyContent: 'center',
                      paddingHorizontal: 8,
                      paddingBottom: 8,
                    }}>
                    <Text
                      style={{
                        letterSpacing: 0.2,
                        alignSelf: 'flex-start',
                        color: '#636363',
                        fontSize: 20,
                        left: 15,
                      }}>
                      Attach Files
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        color: '#919191',
                        fontSize: 11,
                        left: 15,
                      }}>
                      Valid formats .jpg .pdf
                    </Text>
                  </View>
                  {this.state.modalData.map((pic, i) => {
                    return (
                      <TouchableOpacity
                        key={'attacgh_' + i.toString()}
                        onPress={() => this.handleOpenCamera(i)}
                        style={{
                          bottom: 0,
                          flexDirection: 'row',
                          backgroundColor: 'white',
                          height: 60,
                          borderBottomColor: '#dcdcdc',
                          borderBottomWidth: 1,
                          paddingLeft: 2,
                        }}>
                        <View
                          style={{
                            flex: Platform.isPad ? 0.09 : 0.2,
                            justifyContent: 'center',
                          }}>
                          <Image
                            source={pic.image}
                            style={{
                              left: 15,
                              height: 29,
                              width: 30,
                              tintColor: this.props.colorCode
                                ? this.props.colorCode
                                : '#0065d7',
                            }}
                          />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text
                            style={{
                              alignSelf: 'flex-start',
                              color: this.props.colorCode
                                ? this.props.colorCode
                                : '#0065d7',
                              fontSize: 21,
                              fontFamily: 'NotoSans',
                            }}>
                            {pic.Name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
          {/* </TouchableOpacity> */}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
  type: state.attachment.type,
  Name: state.attachment.Name,
  Unit: state.attachment.Unit,
  Graph: state.attachment.graphtype,
  DataType: state.attachment.DataType,
  Value: state.attachment.Value,
  Upload: state.attachment.Upload,
  mdata: state.attachment.mdata,
});

const mapDispatchToProps = (dispatch) => ({
  setAttachmentDataS3: (data) => dispatch(setAttachmentDataS3(data)),
  setAttachmentEditing: (data) => dispatch(setAttachmentEditing(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withDb(Attachment));
