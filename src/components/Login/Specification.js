/* created by ruban 
specialization component*/
import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  Dimensions,
  ImageBackground,
  TextInput,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Images from '../../Theme/Images';
import LinearGradient from 'react-native-linear-gradient';
import {Container} from 'native-base';
import ToastComponent from '../Toast/toastComponent';
import Toast, {DURATION} from 'react-native-easy-toast';
import {logAnalytics} from '../../commonmethods/analytics';

export default class Specialization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doctorId: props.auth.doctorid,
      isSelected: false,
      refresh: true,
      showIndex: -1,
      searchText: '',
      loading: false,
      dataVisible: false,
      click: false,
      primarySpecialization: props.primarySpecialization,
      primarySpecUpdate: '',
      specArray: [],
      arrayholder: [],
      showToast: false,
      description: '',
    };
  }

  //checkbox handling function
  switchTick() {
    if (this.state.isSelected) {
      this.setState({isSelected: false});
    } else {
      this.setState({isSelected: true});
    }
  }
  // ( item[1] == this.state.primarySpecialization && this.state.showIndex == -1 )
  // search specialization function
  search(text) {
    if (text) {
      const newData = this.props.specArray.filter((item) => {
        const itemData = `${item[1].toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({dataVisible: true}, () => {
        this.setState({arrayholder: newData});
      });
    } else {
      this.setState({dataVisible: false});
    }
  }

  // on click flatlist item to get speialization name and index
  selectItem(index, item) {
    this.setState({showIndex: index, primarySpecialization: item[1]});
  }

  onNavigate() {
    try {
      if (this.state.primarySpecialization) {
        this.setState({loading: true});
        let specialization = this.state.primarySpecialization;
        this.props
          .setDoctorSpecialization(
            this.props.doctorProfile.DoctorData._id,
            specialization,
          )
          .then(({error, payload}) => {
            if (error) {
              switch (error.data) {
                case 'Network Error':
                  this.setState({
                    description: 'Currently internet is not avaliable',
                  });
                  break;
                default:
                  this.setState({
                    description: 'Error in gettting response from server',
                  });
                  break;
              }

              Alert.alert('Prescrip', error.data);
              this.setState({
                loading: false,
                showToast: true,
                //   description: payload.data.msg
              });

              setTimeout(() => {
                this.setState({
                  showToast: false,
                });
              });
            } else if (payload.data.status === 1) {
              this.props.doctorProfile.DoctorData.PrimarySpecialization = specialization;
              this.props.setDoctorData(this.props.doctorProfile.DoctorData);
              this.props.navigation.navigate('RegistrationSuccess');
              this.setState({loading: false});
              logAnalytics(
                this.props.doctorProfile.DoctorData._id,
                this.props.doctorProfile.DoctorData.DoctorFName +
                  ' ' +
                  this.props.doctorProfile.DoctorData.DoctorLName,
                this.state.primarySpecialization,
              );
            } else {
              alert(payload.data.msg);
              this.setState({loading: false});
            }
          });
      } else {
        alert('please select any one Specialization');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  }

  // flatlist function to get list of specialization
  itemView(index, item) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.selectItem(index, item);
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
            margin: 0,
            padding: 0,
          }}>
          <View style={{flex: 0.8}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                alignSelf: 'flex-start',
                fontFamily: 'NotoSans-Bold',
                margin: 15,
                color:
                  item[1] == this.state.primarySpecialization
                    ? '#29b62f'
                    : '#3f3e3e',
              }}>
              {item[1]}
            </Text>
          </View>

          {item[1] == this.state.primarySpecialization ? (
            <View
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{resizeMode: 'contain', height: 20}}
                source={Images.tick_selected}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            resizeMode: 'cover',
          }}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            keyboardVerticalOffset={20}
            behavior={Platform.select({android: undefined, ios: 'padding'})}
            enabled={Platform.OS == 'android' ? false : true}>
            <View
              style={{
                flex: this.state.primarySpecialization ? 0.85 : 1,
                marginTop: 40,
              }}>
              <Text
                style={{
                  fontSize: 35,
                  color: '#905094',
                  fontFamily: 'NotoSans-Bold',
                  marginHorizontal: 15,
                }}>
                What's Your{' '}
              </Text>
              <Text
                style={{
                  fontSize: 35,
                  color: '#905094',
                  fontFamily: 'NotoSans-Bold',
                  marginHorizontal: 15,
                }}>
                Specialization?{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: '#919191',
                  fontFamily: 'NotoSans',
                  marginHorizontal: 15,
                }}>
                Select your Primary Specialization
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccccc',
                  marginHorizontal: 15,
                }}>
                <View style={{flex: 0.9}}>
                  <TextInput
                    onChangeText={(text) => this.search(text)}
                    placeholder={'Search for Specialization'}
                    // autoCompleteType={false}
                    autoCorrect={false}
                    style={{
                      fontSize: 22,
                      fontFamily: 'NotoSans',
                    }}
                  />
                </View>
                <View style={{flex: 0.1}}>
                  <Image
                    source={Images.new_search}
                    style={{
                      alignSelf: 'flex-end',
                      resizeMode: 'contain',
                      height: 18,
                    }}
                  />
                </View>
              </View>
              <View>
                <FlatList
                  style={{marginTop: 10}}
                  //data visible false you will get filtered data or all data
                  data={
                    !this.state.dataVisible
                      ? this.props.specArray
                      : this.state.arrayholder
                  }
                  renderItem={({index, item}) => this.itemView(index, item)}
                  //keyExtractor={item => item.id.toString()}
                  ItemSeparatorComponent={this.renderSeparator}
                  extraData={this.state}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
        {this.state.primarySpecialization ? (
          <View
            style={{
              flex: 0.1,
              justifyContent: 'center',
              backgroundColor: '#fafafa',
            }}>
            <TouchableOpacity onPress={() => this.onNavigate()}>
              <LinearGradient
                colors={['#1b7cdb', '#07cef2']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.8]}
                style={{
                  width: '90%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 25,
                  marginBottom: 12,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 17,
                    color: '#ffffff',
                    fontFamily: 'NotoSans-Bold',
                    textTransform: 'uppercase',
                  }}>
                  PROCEED
                </Text>
                {this.props.loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}
