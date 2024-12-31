import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import {
  Container
} from 'native-base';

import { tabDataStore } from '../../actions/previewSettings';
import TemplateTab from './TemplateTab';
import LanguageTab from './LanguageTab';
import LabelTab from './LabelTab';
import FormatTab from './FormatTab';
import Cliniclogo from './Cliniclogo';
import Signature from './Signature';
import _ from 'lodash';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { connect } from 'react-redux';

import {
  delete_icon,
  Tooltip_Edit_Icon,
  ic_Add_Clinic_Button,
  Template_Setting,
} from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';
const Tab = createMaterialTopTabNavigator();
class ParentTab extends Component {
  constructor(props) {
    super(props);
    var self = this;
    self.forceUpdate();
    self.tempData = JSON.parse(
      JSON.stringify(self.props.previewReducer.templateData),
    );
    self.tempData.Language = self.props.patientvisit.prescription.Language;
    self.state = {
      tabArray:
        self.props.prescription.Type != 'Ophthalmologist'
          ? ['Template', 'Format', 'Language', 'Label', 'Logo', 'Signature']
          : ['Format', 'Language', 'Label', 'Logo', 'Signature'],
      templateData: {
        PaperSettings: {
          IsBW: 0,
          Margin: ['10', '10', '10', '10'],
          papername: 'A4',
          papersize: ['210', '297'],
          TemplateFontSize: '14',
          header: 1,
          footer: 1,
          body: 1,
        },
        PrescriptionList:
          self.props.patientvisit.prescription.PrescriptionList.length > 0
            ? self.props.patientvisit.prescription.PrescriptionList
            : [],
        Language: self.props.patientvisit.prescription.Language,
        DisplayLabel: {
          ChiefComplaints: 'Chief Complaints',
          History: 'History',
          Findings: 'Findings',
          Investigation: 'Investigation',
          LabTest: 'LabTest',
          Notes: 'Notes',
          Diagnosis: 'Diagnosis',
          Prescription: 'Prescription',
          DisplayGenericName: 'Display Generic Name',
          Advice: 'Advice',
          Followup: 'Followup',
          DoctorDetails: 'Doctor Details',
          DigitalImageSignature: 'Digital Image Signature',
        },
        DisplayPreferences: [
          'Chief Complaints',
          'Patient History / Family History',
          'On Examination / Findings',
          'Investigations',
          'Recommend Clinical Tests',
          'Diagnosis',
          'Notes',
          'Prescription',
          'Display Generic Name',
          'Advice',
          'Follow up',
          'Doctor Details',
          'Digital Image Signature',
        ],
      },
    };
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('rgb(34,137,34)');
  }

  componentDidMount() {
    //data update

    this.setState({ templateData: { ...this.tempData } });
  }
  /// change setting data by props
  onDataChanges(key, val, display) {
    if (key == 'papername') {
      this.state.templateData.PaperSettings[key] = val;
      switch (val) {
        case 'A3':
          this.state.templateData.PaperSettings['papersize'] = ['297', '420'];
          break;
        case 'A4':
          this.state.templateData.PaperSettings['papersize'] = ['210', '297'];
          break;
        case 'A5':
          this.state.templateData.PaperSettings['papersize'] = ['148', '210'];
          break;
        case 'A4':
          this.state.templateData.PaperSettings['papersize'] = ['210', '297'];
          break;
      }
    } else if (
      key == 'Margin' ||
      key == 'header' ||
      key == 'footer' ||
      key == 'body' ||
      key == 'IsBW'
    ) {
      this.state.templateData.PaperSettings[key] = val;
    } else if (key == 'TemplateFontSize') {
      switch (val) {
        case 'Small':
          this.state.templateData.PaperSettings[key] = '14';
          break;

        case 'Normal':
          this.state.templateData.PaperSettings[key] = '16';
          break;
        case 'Large':
          this.state.templateData.PaperSettings[key] = '18';
          break;
        case 'Extra Large':
          this.state.templateData.PaperSettings[key] = '20';
          break;
        default:
          this.state.templateData.PaperSettings[key] = '14';
          break;
      }
    } else if (key == 'DisplayLabel') {
      let data = { ...this.state.templateData.DisplayLabel };
      data[display] = val;
      this.state.templateData[key] = data;
    } else if (key == 'DisplayPreferences') {
      this.state.templateData[key] = val;
    } else {
      this.state.templateData[key] = val;
    }

    this.state.templateData[
      'PrescriptionList'
    ] = this.props.patientvisit.prescription.PrescriptionList;

    this.setState({ templateData: this.state.templateData }, () => {
      this.props.onChange(this.state.templateData);
      let orgObj = JSON.parse(
        JSON.stringify(this.props.previewReducer.templateData),
      );
      if (!_.isEqual(orgObj, this.state.templateData)) {
        this.props.showReset();
      }
      this.props.showReset();
    });
  }
  returnTabAppContainer(bottomTabObject) {
    let dd = [];
    const self = this;

    dd = bottomTabObject.map((item, i) => {

      return (
        i == 0 && this.props.prescription.Type != 'Ophthalmologist' ?
          <Tab.Screen
            name={item}
            children={(props) =>
              <TemplateTab
                {...this.props}
                onDataChanges={(key, val, display) =>
                  this.onDataChanges(key, val, display)
                }
                state={this.state.templateData}
              />
            }
            options={{
              headerShown: false

            }} /> : i == 1 ? <Tab.Screen
              name={item}
              children={(props) =>
                <FormatTab
                  {...this.props}
                  onDataChanges={(key, val, display) =>
                    this.onDataChanges(key, val, display)
                  }
                  state={this.state.templateData}
                />
              }
              options={{
                headerShown: false
              }}


            /> : i == 2 ? <Tab.Screen
              name={item}
              children={(props) =>
                <LanguageTab
                  {...this.props}
                  languages={this.props.languages}
                  onDataChanges={(key, val, display) =>
                    this.onDataChanges(key, val, display)
                  }
                  state={this.state.templateData}
                />
              }
              options={{
                headerShown: false
              }}


            /> : i == 3 ? <Tab.Screen
              name={item}
              children={(props) =>
                <LabelTab
                  {...this.props}
                  onDataChanges={(key, val, display) =>
                    this.onDataChanges(key, val, display)
                  }
                  state={this.state.templateData}
                />
              }
              options={{
                headerShown: false
              }}


            /> : i == 4 ? <Tab.Screen
              name={item}
              children={(props) =>
                <Cliniclogo
                  {...this.props}
                  onDataChanges={(key, val, display) =>
                    this.onDataChanges(key, val, display)
                  }
                  state={this.state.templateData}
                />
              }
              options={{
                headerShown: false
              }}


            /> : i == 5 ? <Tab.Screen
              name={item}
              children={(props) =>
                <Signature
                  {...this.props}
                  uploadSignature={(path) => this.props.uploadSignature(path)}
                  onDataChanges={(key, val, display) =>
                    this.onDataChanges(key, val, display)
                  }
                  state={this.state.templateData}
                />
              }
              options={{
                headerShown: false
              }}


            /> : null
      )
    });

    return dd;
  }
  MyTabBar({ state, descriptors, navigation, position, screenProps }) {
    return (
      <View style={{
        flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 2
      }}>
        <ScrollView contentContainerStyle={{
          justifyContent: 'center', alignItems: 'center', flexGrow: 1
        }} showsHorizontalScrollIndicator={false} horizontal={true}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };


            return (
              screenProps.openTooltip &&
                screenProps.certificateSetting &&
                label == 'Template' ? (
                //true ?
                <TouchableOpacity
                  accessibilityRole="button"

                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={isFocused ? styles.activeTab : styles.deactiveTab}
                >
                  <Tooltip
                    topAdjustment={
                      Platform.OS === 'android'
                        ? -StatusBar.currentHeight
                        : 0
                    }
                    animated={true}
                    isVisible={true}
                    backgroundColor={'rgba(0,0,0,0)'}
                    contentStyle={{
                      backgroundColor: '#6f6af4',
                      height: '100%',
                      marginTop: 8,
                    }}
                    content={
                      <TouchableOpacity
                        style={{ backgroundColor: '#6f6af4' }}
                        onPress={() => {
                          screenProps.setTooltipStatus({
                            ['certificateSetting']: false,
                          });
                        }}>
                        <AddPatient
                          imagePath={Template_Setting}
                          title={'Prescription Templates'}
                          description={
                            'Select from a range of prescription templates that suit you the best.'
                          }
                        />
                      </TouchableOpacity>
                    }
                    //(Must) This is the view displayed in the tooltip
                    placement="Top"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() =>
                      screenProps.setTooltipStatus({
                        ['certificateSetting']: false,
                      })
                    }
                  //(Optional) Callback fired when the user taps the tooltip
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'NotoSans',
                        color: '#969696',
                        textTransform: 'uppercase',
                      }}>
                      {label}
                    </Text>
                  </Tooltip>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={isFocused ? styles.activeTab : styles.deactiveTab}
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  
                >
                  <Text style={isFocused ? styles.activeTabText : styles.tabText}
                   >
                    {label}
                  </Text></TouchableOpacity>
              )
            );

          })}
        </ScrollView>
      </View >
    );
  }
  render() {
    return (
      <View    style={{ flex:1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />
        <Tab.Navigator lazy={false} tabBar={props => <this.MyTabBar screenState={this.state} {...props} screenProps={this.props} />}
          screenOptions={{
            lazy: false
          }}>

          {this.returnTabAppContainer(this.state.tabArray)}
        </Tab.Navigator>
      </View>
      /* <View style={{ flex: 1, borderTopColor: '#cccccc', borderTopWidth: 1 }}>
        <StatusBar barStyle='light-content' />
        <TabContainer screenProps={{
          rootNavigation: this.props.navigation,
          state: this.state.templateData,
           
          onDataChanges: (key, val, display) => this.onDataChanges(key, val, display)
        }}
        // onSave={(patientvisitid,templateData)=>this.props.onSave(patientvisitid,templateData)} 
        />
      </View> */
    );
  }
}
const styles = StyleSheet.create({
  tabStyle: {

    backgroundColor: '#ffffff'
  },
  tabText: {
    textTransform: "uppercase",
    color: "#959595", fontSize: 14,paddingTop : 15,
    fontFamily: 'NotoSans', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0869d8",
    fontSize: 14,
    paddingTop : 15,
    fontFamily: 'NotoSans-Bold', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeCamTab: {
    borderBottomWidth: 4, borderColor: "#0869d8", paddingRight: 10, paddingLeft: 10
  },
  deactiveCamTab: {
    borderBottomWidth: 4, borderColor: "transparent", paddingRight: 10, paddingLeft: 10
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },
  deactiveTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "transparent"
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: (Platform.OS == "android" ? 20 : 0)


  },
  ViewImage: {
    flex: 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  ViewText: {
    flex: 0.76,
    justifyContent: 'center'
  },
  title: {
    fontSize: 12,
    color: 'grey'
  },
  subtitle: {
    fontSize: 20,
    color: '#717171',
    fontFamily: 'NotoSans'
  },
  subtitle2: {
    fontSize: 12,
    color: '#717171',
    fontFamily: 'NotoSans'
  },
  Image: {
    resizeMode: 'contain',
    height: 20
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
  previewReducer: state.previewReducer,
  certificateSetting: state.tooltip.toolTipStatus.certificateSetting,
});

const mapDispatchToProps = (dispatch) => ({
  tabDataStore: (templateData) => dispatch(tabDataStore(templateData)),
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ParentTab);
