/// ravi
import React, { Component } from 'react';
import { Container, Textarea } from 'native-base';
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { Black_back } from '../../constants/images';
import multipleTapHandler from '../../components/MultiTapHandle/index';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';

class SettingsAddOutOfClinicText extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      text: '',
      textHeight: 80,
    };
    this.deviceWidth = Dimensions.get('window').width;
    this.deviceHeight = Dimensions.get('window').height;
    this.max_height = (this.deviceHeight * 50) / 100;
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  onHeightChange(height) {
    height = height < this.max_height ? height : this.max_height;
    this.setState({ textHeight: height });
  }

  render() {
    // const updatenotidata = this.props.doctorProfile.settingnotificationdata.toggleValue;
    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />

        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={'white'}
            cursorColor={'#0869d8'}
            tintColor={'#0b69d8'}
            description={'Add Out Of Clinic Option'}
            subtitle={'gnensebngiseb'}
            titleColor={null}
            descriptionColor={'#3D3D3D'}
            placeholderTextColor={'black'}
            placeTextColor={'black'}
            placeholderTextSize={20}
            leftImage={Black_back}
            rightImage={null}
            rightImageCross={null}
            isSearchBoxShowing={null}
            type={5}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={null}
          />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'column',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 20,
                paddingBottom: 20,
              }}>
              <Text
                style={{
                  color: '#3D3D3D',
                  fontSize: 18,
                  fontFamily: 'NotoSans-Bold',
                }}>
                Add Option Text
              </Text>
              <View
                style={{
                  borderColor: '#bfbfbf',
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingBottom: 50,
                  marginTop: 10,
                }}>
                <Textarea
                  multiline={true}
                  numberOfLines={4}
                  maxLength={400}
                  placeholder={'Type your text...'}
                  placeholderTextColor={'#bfbfbf'}
                  defaultValue={this.state.text}
                  onChangeText={(txt) => this.setState({ text: txt })}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  onContentSizeChange={(e) =>
                    this.onHeightChange(e.nativeEvent.contentSize.height)
                  }
                  style={{
                    fontSize: 16,
                    width: '100%',
                    height: this.state.textHeight,

                    fontFamily: 'NotoSans',
                    alignItems: 'center',
                  }}
                />
              </View>
              <Text
                style={{
                  color: '#3D3D3D',
                  fontSize: 16,
                  fontFamily: 'NotoSans-Bold',
                  alignSelf: 'flex-end',
                }}>
                {this.state.text.length + '/' + 400}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: 10,
                backgroundColor: '#fafafa',
                paddingVertical: 20,
              }}>
              <TouchableOpacity
                style={{
                  width: '90%',
                  borderRadius: 25,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#176dd8',
                  borderWidth: 1,
                }}>
                <Text
                  uppercase={true}
                  style={{
                    fontSize: 16,
                    letterSpacing: 0.8,
                    color: '#176dd8',
                    fontFamily: 'NotoSans-Bold',
                    alignSelf: 'center',
                  }}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAddOutOfClinicText);
