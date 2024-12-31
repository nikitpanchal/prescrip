import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
 

import { withDb } from '../../DatabaseContext/withDatabase';
import { connect } from 'react-redux';
import {
  delete_icon,
  Tooltip_Edit_Icon,
  ic_Add_Clinic_Button,
  More_Options,
  ic_settings_Print_Tooltip_icon,
} from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';

class PrescriptionPreviewHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      subfont: 20,
    };
  }

  subFontSize() {
    if (this.props.subtitle.length > 30 && this.props.subtitle.length <= 45) {
      return 17;
    } else if (this.props.subtitle.length > 45) {
      return 16;
    } else {
      return 20;
    }
  }

  render() {
    let { navigation, fabClick } = this.props;
    return (
      <View activeOpacity={1} style={styles.container}>
        <StatusBar translucent backgroundColor="#ffffff" />
        <TouchableOpacity
          onPress={this.props.leftImageOnClick}
          style={styles.ViewImage}>
          <Image style={styles.Image} source={this.props.leftImage} />
        </TouchableOpacity>
        {this.props.type == 1 ? (
          <View style={styles.ViewText}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={[styles.subtitle, { fontSize: this.subFontSize() }]}>
              {this.props.subtitle}
            </Text>
          </View>
        ) : (
          <View style={styles.ViewText}>
            <Text style={{ color: '#444444', fontSize: 22, color: '#636363' }}>
              {this.props.title}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.title}>{this.props.name + ' | '}</Text>
              <Text style={styles.title}>{this.props.age + ' | '}</Text>
              <Text style={styles.title}>{this.props.gender}</Text>
            </View>
          </View>
        )}
        {!this.props.printPreviewSetting ?
          <TouchableOpacity
            style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Tooltip
              topAdjustment={
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0
              }
              animated={true}
              isVisible={this.props.prescriptionPreviewPrint}
              backgroundColor={'rgba(0,0,0,0.5)'}
              contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
              tooltipStyle={{ right: 20, alignItems: 'flex-end' }}
              content={
                <TouchableOpacity
                  style={{ backgroundColor: '#6f6af4' }}
                  onPress={() => {
                    this.props.setTooltipStatus({
                      ['prescriptionPreviewPrint']: false,
                    });
                  }}>
                  <AddPatient
                    imagePath={ic_settings_Print_Tooltip_icon}
                    title={'Print Prescription'}
                    description={
                      'Provide your patient a personal copy of the prescription.'
                    }
                  />
                </TouchableOpacity>
              }
              placement={'bottom'}
              onClose={() =>
                this.props.setTooltipStatus({
                  ['prescriptionPreviewPrint']: false,
                })
              }>
              <TouchableOpacity
                onPress={this.props.rightThirdImageClick}
                style={[styles.ViewImage, { padding : 15 }]}>
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    marginLeft: Platform.isPad ? 35 : 0,
                  }}
                  source={this.props.rightThirdImage}
                />
              </TouchableOpacity>
            </Tooltip>
          </TouchableOpacity>
          : <TouchableOpacity
            onPress={this.props.rightThirdImageClick}
            style={[styles.ViewImage, { padding : 15 }]}>
            <Image
              style={{
                width: 22,
                height: 22,
                resizeMode: 'contain',
                marginLeft: Platform.isPad ? 35 : 0,
              }}
              source={this.props.rightThirdImage}
            />
          </TouchableOpacity>
        }
        {this.props.activityLoad2 ? (
          <View style={styles.ViewImage}>
            <ActivityIndicator size={'small'} color={'#0064d7'} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={this.props.rightSecondImageClick}
            style={styles.ViewImage}>
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: 'contain',
                marginLeft: Platform.isPad ? 35 : 0,
              }}
              source={this.props.rightSecondImage}
            />
          </TouchableOpacity>
        )}

        {this.props.activityLoad ? (
          <View style={styles.ViewImage}>
            <ActivityIndicator size={'small'} color={'#0064d7'} />
          </View>
        ) : !fabClick &&
          !this.props.printPreviewPinch &&
          !this.props.printPreviewAddSection &&
          this.props.printPreviewSetting ? (
          <TouchableOpacity
            style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Tooltip
              topAdjustment={
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0
              }
              animated={true}
              isVisible={this.props.printPreviewSetting}
              backgroundColor={'rgba(0,0,0,0.5)'}
              contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
              tooltipStyle={{ right: 20, alignItems: 'flex-end' }}
              content={
                <TouchableOpacity
                  style={{ backgroundColor: '#6f6af4' }}
                  onPress={() => {
                    this.props.setTooltipStatus({
                      ['printPreviewSetting']: false,
                    });
                  }}>
                  <AddPatient
                    imagePath={More_Options}
                    title={'More Options'}
                    description={
                      'Manage prescription SETTINGS like template selection, format etc You can even SHARE your prescription when ready from here.'
                    }
                  />
                </TouchableOpacity>
              }
              //(Must) This is the view displayed in the tooltip
              placement="bottom"
              //(Must) top, bottom, left, right, auto.
              onClose={() =>
                this.props.setTooltipStatus({ ['printPreviewSetting']: false })
              }
            //(Optional) Callback fired when the user taps the tooltip
            >
              <TouchableOpacity
                onPress={this.props.rightImageClick}
                style={styles.ViewImage}>
                <Image
                  style={{
                    tintColor: '#0064d7',
                    width: this.props.isSettingsClicked ? 25 : 20,
                    height: this.props.isSettingsClicked ? 25 : 20,
                    resizeMode: 'contain',
                  }}
                  source={this.props.rightImage}
                />
              </TouchableOpacity>
            </Tooltip>
          </TouchableOpacity>
        ) : (
          this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
            this.props.doctorProfile.DoctorData.RoleId == 3 ?
            <TouchableOpacity
              onPress={this.props.rightImageClick}
              style={styles.ViewImage}>
              <Image
                style={{
                  tintColor: '#0064d7',
                  width: this.props.isSettingsClicked ? 25 : 20,
                  height: this.props.isSettingsClicked ? 25 : 20,
                  resizeMode: 'contain',
                }}
                source={this.props.rightImage}
              />
              <Menu
                opened={this.props.menuState}
                optionsContainerStyle={{ width: 10, height: 60 }}
                onBackdropPress={this.props.dismissMenu}>
                <MenuTrigger />
                <MenuOptions optionsContainerStyle={{ paddingLeft: 8, width: 160 }}>
                  {this.props.menuArray}
                </MenuOptions>
              </Menu>
            </TouchableOpacity> : null
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  printPreviewSetting: state.tooltip.toolTipStatus.printPreviewSetting,
  printPreviewPinch: state.tooltip.toolTipStatus.printPreviewPinch,
  printPreviewAddSection: state.tooltip.toolTipStatus.printPreviewAddSection,
  prescriptionPreviewPrint:
    state.tooltip.toolTipStatus.prescriptionPreviewPrint,
});

const mapDispatchToProps = (dispatch) => ({
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withDb(PrescriptionPreviewHeader));

const styles = StyleSheet.create({
  container: {
    flex: Platform.isPad ? 0.06 : 0.1,
    flexDirection: 'row',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    // paddingVertical: 8,
    marginTop: Platform.OS == 'android' ? 18 : 0,
  },
  ViewImage: {
    // flex: Platform.isPad?0.1:0.2,
    flex: 0.1,
    justifyContent: 'center',
    padding: 8,
    alignItems: 'center',
  },
  ViewText: {
    flex: 0.8,
    justifyContent: 'center',
    paddingBottom: Platform.isPad ? 5 : 0,
  },
  title: {
    fontSize: 12,
    color: 'grey',
  },
  subtitle: {
    // fontSize: 20,
    color: '#1b7cdb',
  },
  Image: {
    resizeMode: 'contain',
    height: 20,
  },
});
