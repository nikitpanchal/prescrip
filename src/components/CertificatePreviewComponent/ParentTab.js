import React, { Component } from 'react';
import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
 
import { tabDataStore } from '../../actions/previewSettings';
import { setCertificateTemplateChange } from '../../actions/certificates';
import { connect } from 'react-redux';
import TemplateTab from './TemplateTab';
import FormatTab from './FormatTab';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
var tabs = {
  TEMPLATE: { screen: TemplateTab },
  FORMAT: { screen: FormatTab },
};
const Tab = createMaterialTopTabNavigator();



class ParentTab extends Component {
  constructor(props) {
    super(props);
    let tempData = props.previewReducer.templateData;
    this.state = {
      templateData:
        tempData && Object.keys(tempData).length > 0
          ? tempData
          : {
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
              this.props.patientvisit.prescription.PrescriptionList.length > 0
                ? this.props.patientvisit.prescription.PrescriptionList
                : [],
            Language: 'English',
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
              'History',
              'Findings',
              'Investigation',
              'LabTest',
              'Diagnosis',
              'Notes',
              'Prescription',
              'Display Generic Name',
              'Advice',
              'Followup',
              'Doctor Details',
              'Digital Image Signature',
            ],
          },
    };
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('rgb(34,137,34)');
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
      //isBW
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
      this.props.setCertificateTemplateChange(this.state.templateData);
      //this.props.tabDataStore(this.state.templateData)
      // this.props.settingDatastore(this.state.templateData)
      // this.props.WebViewRef.current ? this.props.WebViewRef.current.reload() : null
    });
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

              <TouchableOpacity
                accessibilityRole="button"
                style={isFocused ? styles.activeTab : styles.deactiveTab}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={isFocused ? styles.activeTab : styles.deactiveTab}
              >
                <Text style={isFocused ? styles.activeTabText : styles.tabText}
                >
                  {label}
                </Text></TouchableOpacity>
            )


          })}
        </ScrollView>
      </View >
    );
  }
  render() {
    return (
      <View style={{ flex: 1, borderTopColor: '#cccccc', borderTopWidth: 1 }}>
        <StatusBar barStyle="light-content" />
        <Tab.Navigator lazy={false} tabBar={props => <this.MyTabBar screenState={this.state} {...props} screenProps={this.props} />}
          screenOptions={{
            lazy: false
          }}>

          <Tab.Screen
            name={"TEMPLATE"}
            children={(props) =>
              <TemplateTab
                {...this.props}
                screenProps={{
                  rootNavigation: this.props.navigation,
                  state: this.state.templateData,
                  onDataChanges: (key, val, display) =>
                    this.onDataChanges(key, val, display),
                }}
              />
            }
            options={{
              headerShown: false
            }}


          />
          <Tab.Screen
            name={"FORMAT"}
            children={(props) =>
              <FormatTab
                {...this.props}
                screenProps={{
                  rootNavigation: this.props.navigation,
                  state: this.state.templateData,
                  onDataChanges: (key, val, display) =>
                    this.onDataChanges(key, val, display),
                }}
              />
            }
            options={{
              headerShown: false
            }}


          />
        </Tab.Navigator>
        {/* <TabContainer
          screenProps={{
            rootNavigation: this.props.navigation,
            state: this.state.templateData,
            onDataChanges: (key, val, display) =>
              this.onDataChanges(key, val, display),
          }}
        // onSave={(patientvisitid,templateData)=>this.props.onSave(patientvisitid,templateData)}
        /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  tabStyle: {

    backgroundColor: '#ffffff'
  },
  tabText: {
    textTransform: "uppercase",
    color: "#959595", fontSize: 14, paddingTop: 15,
    fontFamily: 'NotoSans', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0869d8",
    fontSize: 14,
    paddingTop: 15,
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
});

const mapDispatchToProps = (dispatch) => ({
  tabDataStore: (templateData) => dispatch(tabDataStore(templateData)),
  setCertificateTemplateChange: (data) =>
    dispatch(setCertificateTemplateChange(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ParentTab);


