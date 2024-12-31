/****** code by Sourabh ******/

import React, { Component } from 'react';
import { Container, Text, Icon, Button } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';

import {
  StatusBar,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import styles from './styles';

import { wrap } from 'lodash';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { connect } from 'react-redux';

import {
  icon_Three_Dot_Menu_Button,
  Billing_Dropdown_Collapse,
  Billing_Dropdown_Expand,
  delete_icon,
  Tooltip_Edit_Icon,
  ic_Add_Clinic_Button,
  Template_Setting,
  Show_all,
  Patient_Search,
  TrailPeriod, Tooltip_More_Option, Tooltip_Payment_Calendar, Tooltip_Payment_Filter, Tooltip_Pending, Tooltip_Received, Tooltip_Refunded,
} from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';
import { month } from '../../commonmethods/validation';

//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (Congrats screen)
//5.progress bar ,title ,description
let timer = null;

class PrescriptionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBox: false,
      phonenumber: '',
      search: '',
      text: '',

      isMenuOpen: false,
      showTooltip: false,
      prevMonth: this.props.initialDate ? month[new Date(this.props.initialDate).getMonth() - 1] : '',
      nextMonth: this.props.initialDate ? month[new Date(this.props.initialDate).getMonth() + 1] : ''
    };
    this._checkboxsms = 0;
  }

  componentDidMount() {
    timer = setTimeout(() => {
      this.setState({
        showTooltip: true,
      });
    }, 200);
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  changeData(text) {
    this.setState({ text });
    this.props.searchAction(text);
  }

  rightImageOnClick() {
    if (this.props.rightImageOnClick) {
      this.setState({ text: '' });
      if (this.props.container != 'followup') this.props.rightImageOnClick();
    }
  }

  dismissMenu() {
    if (this.state.isMenuOpen) {
      this.setState({
        isMenuOpen: false,
      });
    }
  }
  onClick(item) {
    this.dismissMenu();
    this.props.menuSelectName(item);
  }

  onMonthChange(newDate) {
    //  console.log(new Date(newDate).getMonth() - 1)

    this.setState({
      nextMonth: new Date(newDate).getMonth() == 11 ? "Jan" : month[new Date(newDate).getMonth() + 1],
      prevMonth: new Date(newDate).getMonth() == 0 ? "Dec" : month[new Date(newDate).getMonth() - 1]
    }, () => {
      this.props.onDateChange(newDate, "onMonthChange");
    })

  }
  setMenuNames() {
    if (this.props.menuList) {
      return this.props.menuList.map((item, i) => {
        return (
          <MenuOption
            key={(i) => 'menuKey' + i}
            onSelect={() => this.onClick(item)}>
            {this.props.isSecondMenuNotificationIcon && item == 'Payment' ? (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 80,
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    backgroundColor: 'red',

                    borderRadius: 5,
                    resizeMode: 'cover',
                    alignSelf: 'center',
                    width: 10,
                    height: 10,
                  }}
                  source={null}
                />
              </View>
            ) : null}
            <Text
              style={{
                margin: 5,

                color: item == 'Delete' ? '#ff0000' : '#000000',
                fontFamily: 'NotoSans',
              }}>
              {item}
            </Text>
          </MenuOption>
        );
      });
    }
  }

  render() {
    const { search } = this.state;
    return (
      <View style={{ justifyContent: 'center', flexdirection: 'row', width: Dimensions.get('window').width }}>
        <ImageBackground
          style={{
            width: '100%',
            backgroundColor: this.props.bgColor,
            borderBottomColor: '#dddddd',
            borderBottomWidth: 1,
          }}
          source={this.props.bgImage}>
          <View
            style={{
              flexDirection: 'column',
              top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
              marginBottom:
                Platform.OS === 'ios' ? null : StatusBar.currentHeight,
            }}>
            <SafeAreaView>
              <View style={{ width: '100%', marginVertical: this.props.type == 6 ? 10 : null }}>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      flex: 0.85,
                    }}>

                    <TouchableOpacity
                      onPress={() => {
                        this.props.callFrom && this.props.callFrom == 'search'
                          ? this.props.leftImageOnClick()
                          : this.props.isSearchBoxShowing
                            ? this.rightImageOnClick()
                            : this.props.leftImageOnClick();
                      }}
                      style={{
                        padding: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                          width: 25,
                          height: 22,
                        }}
                        source={this.props.leftImage}
                      />
                    </TouchableOpacity>

                    {this.props.type == 6 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.clickedOnBilling(!this.props.show);
                        }}
                        style={{ flexDirection: 'column', marginLeft: 10 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#c8ece1',
                              alignSelf: 'center',
                              fontSize: 21,
                              fontFamily: 'NotoSans',
                            }}>
                            {this.props.title}
                          </Text>
                          <Image
                            style={{
                              resizeMode: 'contain',
                              marginLeft: 5,
                              alignSelf: 'center',
                              tintColor: 'white',
                              justifyContent: 'flex-end',
                              width: 11,
                              height: 11,
                            }}
                            source={!this.props.show ? Billing_Dropdown_Expand : Billing_Dropdown_Collapse}
                          />
                        </View>

                        <Tooltip
                          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                          animated={true}
                          isVisible={this.props.tooltipSteps == 1 ? true : false}
                          backgroundColor={"rgba(0,0,0,0.5)"}
                          contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
                          tooltipStyle={{ left: 20, alignItems: "flex-start" }}

                          content={
                            <TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                              onPress={() => { this.props.toolTipClick(3) }}
                            >
                              <AddPatient
                                imagePath={Tooltip_Payment_Calendar}
                                title={"Quick Calender"}
                                description={"By tapping here, you can quickly navigate through the months and days"}
                              />
                            </TouchableOpacity>
                          }
                          //(Must) This is the view displayed in the tooltip
                          placement="bottom"
                          //(Must) top, bottom, left, right, auto.
                          onClose={() => { this.props.toolTipClick(3) }}
                        //(Optional) Callback fired when the user taps the tooltip
                        >

                          <Text
                            style={{
                              textAlign: 'right',
                              color: '#cbeee2',
                              alignSelf: 'flex-start',
                              fontSize: 12,
                              fontFamily: 'NotoSans',
                            }}>
                            {'Billed: ' +
                              this.props.calBilled +
                              '| Received: ' +
                              this.props.calRecevied}
                          </Text>
                        </Tooltip>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          flex: 1,
                          backgroundColor: 'blue',
                        }}
                        //    onPress={() => { this.props.leftImageOnClick() }}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: Platform.OS === 'ios' ? 10 : 20,
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                        }}>

                        <Text
                          style={{
                            fontFamily: 'NotoSans',
                            color: this.props.titleColor,
                            fontSize: this.props.titleSize
                              ? this.props.titleSize
                              : 12,
                            alignSelf: 'flex-start',
                          }}>
                          {this.props.title}
                        </Text>
                        {this.props.description ? (
                          this.props.isSearchBoxShowing ? (
                            <TextInput
                              defaultValue={
                                this.props.isSearchBoxShowing
                                  ? ''
                                  : this.state.text
                              }
                              selectionColor={this.props.cursorColor}
                              placeholder={this.props.description}
                              placeholderTextColor={this.props.descriptionColor}
                              style={{
                                padding: 0,
                                width: 300,
                                fontFamily: 'NotoSans',
                                alignItems: 'flex-start',
                                color: this.props.placeTextColor
                                  ? this.props.placeholderTextColor
                                  : 'white',
                                borderColor: 'white',
                                fontSize: this.props.placeholderTextSize
                                  ? this.props.placeholderTextSize
                                  : 16,
                                borderWidth: null,
                                //  borderBottomColor: '#cccccc',
                                borderBottomWidth: 1,
                                includeFontPadding: false,
                              }}
                              maxLength={60}
                              autoFocus={
                                this.props.isSearchBoxShowing ? true : false
                              }
                              onChangeText={(text) => this.changeData(text)}
                              value={this.state.text}
                            />
                          ) : (
                            <Text
                              onPress={() => {
                                this.rightImageOnClick();
                              }}
                              style={{
                                fontFamily: 'NotoSans',
                                color: this.props.descriptionColor,
                                fontSize: this.props.descriptionSize
                                  ? this.props.descriptionSize
                                  : 20,
                                alignSelf: 'flex-start', paddingTop: 8
                              }}>
                              {this.props.description}
                            </Text>
                          )
                        ) : null}
                      </TouchableOpacity>

                    )}
                  </View>
                  {/* {this.props.subscriptionDetails && this.props.subscriptionDetails.Plan == 3 ?
                    <TouchableOpacity style={{
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      position: 'absolute', right: 30
                    }}
                      onPress={() => { this.props.navigation.navigate('SettingsSubscription') }}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                          height: 65,
                        }}
                        source={TrailPeriod}
                      />
                    </TouchableOpacity> : null} */}
                  {this.state.showTooltip && this.props.currentTab == "MyPatients" &&
                    this.props.patientScreenSearch &&
                    this.props.auth.tooltip == 'Others' ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.rightImageOnClick();
                      }}
                      style={{
                        marginBottom: 20,
                        marginRight: 20,
                        flex: 0.1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <Tooltip
                        topAdjustment={
                          Platform.OS === 'android'
                            ? -StatusBar.currentHeight
                            : 0
                        }
                        animated={true}
                        isVisible={true}
                        backgroundColor={'rgba(0,0,0,0.5)'}
                        contentStyle={{
                          backgroundColor: '#6f6af4',
                          height: '100%',
                        }}
                        tooltipStyle={{ right: 20, alignItems: 'flex-end' }}
                        content={
                          <TouchableOpacity
                            style={{ backgroundColor: '#6f6af4' }}
                            onPress={() => {
                              this.props.setTooltipStatus({
                                ['patientScreenSearch']: false,
                              });
                            }}>
                            <AddPatient
                              imagePath={Patient_Search}
                              title={'Easy Patient Search'}
                              description={
                                'Search for the patient by their name or contact number'
                              }
                            />
                          </TouchableOpacity>
                        }
                        //(Must) This is the view displayed in the tooltip
                        placement="bottom"
                        //(Must) top, bottom, left, right, auto.
                        onClose={() => {
                          this.props.setTooltipStatus({
                            ['patientScreenSearch']: false,
                          });
                        }}
                      //(Optional) Callback fired when the user taps the tooltip
                      >
                        <Image
                          style={{
                            tintColor: this.props.descriptionColor
                              ? this.props.descriptionColor
                              : null,

                            resizeMode: 'contain',
                            alignSelf: 'center',
                            justifyContent: 'flex-end',
                            width: 20,
                            height: 20,
                          }}
                          source={
                            this.props.isSearchBoxShowing
                              ? this.props.rightImageCross
                              : this.props.rightImage
                          }
                        />
                      </Tooltip>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginLeft: 15,
                        flex: 0.15,
                        justifyContent: 'flex-start',
                      }}>
                      <TouchableOpacity
                        // onPress={() => {
                        //   this.rightImageOnClick();
                        // }}this.props.leftImageOnClick()
                        onPress={() => {
                          this.props.type == 6 && this.props.show ? this.props.closeCalender() :
                            this.props.menuList
                              ? this.setState({
                                isMenuOpen: !this.state.isMenuOpen,
                              })
                              : this.rightImageOnClick();
                        }}
                        style={{
                          marginBottom: this.props.description ? 27 : null,
                          flexDirection: 'column',
                          justifyContent: this.props.description
                            ? 'flex-end'
                            : 'center',
                          alignItems: 'center',
                        }}>
                        {this.props.isSecondMenuNotificationIcon ? (
                          <View
                            style={{
                              position: 'absolute',
                              top: 2,
                              left: 10,
                              alignSelf: 'center',
                            }}>
                            <Image
                              style={{
                                backgroundColor: 'red',

                                borderRadius: 5,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                width: 10,
                                height: 10,
                              }}
                              source={null}
                            />
                          </View>
                        ) : null}
                        <Tooltip
                          topAdjustment={
                            Platform.OS === 'android'
                              ? -StatusBar.currentHeight
                              : 0
                          }
                          animated={true}
                          isVisible={this.props.tooltipSteps == 2 ? true : false}

                          backgroundColor={'rgba(0,0,0,0.5)'}
                          contentStyle={{
                            backgroundColor: '#6f6af4',
                            height: '100%',
                          }}
                          tooltipStyle={{ right: 10, alignItems: 'flex-end' }}
                          content={
                            <TouchableOpacity
                              style={{ backgroundColor: '#6f6af4' }}
                              onPress={() => { this.props.toolTipClick(8) }}

                            >
                              <AddPatient
                                imagePath={Tooltip_More_Option}
                                title={'More Options'}
                                description={
                                  'By tapping here you will find the payment settings and FAQs.'
                                }
                              />
                            </TouchableOpacity>
                          }
                          //(Must) This is the view displayed in the tooltip
                          placement="bottom"
                          //(Must) top, bottom, left, right, auto.
                          onClose={() => { this.props.toolTipClick(8) }}


                        //(Optional) Callback fired when the user taps the tooltip
                        >
                          <Image
                            style={{
                              tintColor: this.props.descriptionColor
                                ? this.props.descriptionColor
                                : null,

                              resizeMode: 'contain',
                              alignSelf: 'center',
                              justifyContent: 'flex-end',
                              width: 20,
                              height: 20,
                            }}
                            source={
                              this.props.type == 6 && this.props.show ? this.props.rightImageCross :
                                this.props.type == 6 ? this.props.rightImage
                                  : this.props.isSearchBoxShowing
                                    ? this.props.rightImageCross
                                    : this.props.rightImage
                            }
                          />
                        </Tooltip>
                        <Menu
                          opened={this.state.isMenuOpen}
                          onBackdropPress={() => this.dismissMenu()}>
                          <MenuTrigger />
                          <MenuOptions>{this.setMenuNames()}</MenuOptions>
                        </Menu>
                      </TouchableOpacity>
                      {this.props.type == 6 && !this.props.show ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.rightImageOnClick();
                          }}
                          style={{
                            marginRight: 20,
                            marginBottom: this.props.description ? 27 : null,
                            flexDirection: 'column',
                            justifyContent: this.props.description
                              ? 'flex-end'
                              : 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={{
                              tintColor: this.props.descriptionColor
                                ? this.props.descriptionColor
                                : null,

                              resizeMode: 'contain',
                              alignSelf: 'center',
                              justifyContent: 'flex-end',
                              width: 20,
                              height: 20,
                            }}
                            source={this.props.rightSecondImage}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}

                </View>

              </View>

            </SafeAreaView>
          </View>


          {this.props.show ?
            <View>



              <CalendarPicker
                selectedStartDate={this.props.initialDate}
                initialDate={this.props.initialDate}
                selectedRangeStartStyle={{ backgroundColor: 'red' }}
                textStyle={{ color: "white" }}
                todayBackgroundColor={"transparent"}
                todayTextStyle={"white"}
                maxDate={new Date()}
                nextTitle={this.state.nextMonth + " >"}
                nextTitleStyle={{ color: 'white', fontFamily: 'NotoSans', fontSize: 18 }}
                previousTitle={"< " + this.state.prevMonth}
                previousTitleStyle={{ color: 'white', fontFamily: 'NotoSans', fontSize: 18 }}


                selectedDayColor="#FFFFFF"
                selectedDayTextColor="#000"
                onDateChange={(newDate) => {
                  this.props.onDateChange(newDate, "onDateChange");
                }}

                onMonthChange={(newDate) => {
                  this.onMonthChange(newDate)

                }}
              />

              <TouchableOpacity
                style={{}}
                onPress={() => { this.props.onDateChange("", "onDoneClick") }}
              >
                <View
                  style={{ width: 90, borderWidth: 1, marginBottom: 20, marginRight: 30, alignSelf: 'flex-end', borderColor: 'white', borderRadius: 20 }}

                >
                  <Text
                    style={{

                      fontSize: 18,
                      color: 'white', fontFamily: 'NotoSans-Bold', alignSelf: 'center', marginVertical: 5
                    }}
                  >
                    DONE</Text>
                </View>
              </TouchableOpacity>
            </View>


            : null}
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  patientScreenSearch: state.tooltip.toolTipStatus.patientScreenSearch,
});

const mapDispatchToProps = (dispatch) => ({
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionHeader);
