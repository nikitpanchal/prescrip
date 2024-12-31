//Tab container for Opthal
import React from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, BackHandler, ScrollView ,Dimensions} from 'react-native';

import multipleTapHandler from '../../components/MultiTapHandle/index';
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader'
import Images from '../../Theme/Images'
import RightEye from '../../components/Opthal/RightEye';
import LeftEye from '../../components/Opthal/LeftEye';

import LinearGradient from 'react-native-linear-gradient'
import { connect } from "react-redux";
import { setOpthalListData, setOpthalData } from '../../actions/opthal';
import { setPrescription } from '../../actions/patientVisit';
import { withDb } from "../../DatabaseContext/withDatabase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
let colorCodeOfPage = "#00C953";
const Tab = createMaterialTopTabNavigator();
class OpthalHome extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  OnClick() {
    multipleTapHandler.clearNavigator()
    this.props.navigation.goBack()
  }



  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {

    multipleTapHandler.clearNavigator()
    this.props.navigation.goBack()
    return true;
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator()

  }
  redirect(route) {
    //let prescription=this.props.prescription;
    //prescription["Ophthalmologist"]=this.props.opthal.selecteddata
    if (route) {
      this.props.navigation.push(route);
    } else {
      this.props.navigation.goBack(null);
    }
  }
  MyTabBar({ state, descriptors, navigation, position, screenState, _color }) {
    return (
      <View style={{
        flexDirection: 'row', backgroundColor: _color ? _color : '#0065d7'
      }}
        style={{
          backgroundColor: '#fff', borderBottomWidth: 1
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
                activeTextStyle={{ color: _color ? _color : '#0065d7', fontFamily: 'NotoSans-Bold' }}
                textStyle={{ color: '#919191', fontSize: 16, fontFamily: 'NotoSans-Bold' }}
                tabStyle={{ backgroundColor: '#fff' }}
                activeTabStyle={{ backgroundColor: '#fff' }}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={isFocused ? styles.activeCamTab : styles.deactiveCamTab}
              >
                <View style={{
                  backgroundColor: '#fff', height: 8, alignSelf: 'flex-end',
                  width: 8, borderRadius: 8
                }}></View>
                < Text style={{
                  color: isFocused ? (_color ? _color : '#0065d7') : '#919191', fontSize: 16, padding: 10, fontFamily: 'NotoSans-Bold'
                }}>{label}</Text>
              </TouchableOpacity>
            );

          })}
        </ScrollView>
      </View >
    );
  }
  render() {
    return (

      <View
        style={{ backgroundColor: 'gray', width:Dimensions.get('window').width , height : Dimensions.get('window').height}}>
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
        {/*Header*/}

        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={'#ffffff'}
          title={"INFORMATION ABOUT"}
          titleColor={'#919191'}

          isShowTitle={true}
          description={"Visual Acuity"}
          descriptionColor={colorCodeOfPage}
          leftImage={Images.ic_black_back}
          rightImage={null}
          secondRightImage={null}
          callFrom={'opthal'}
          issecondRightImage={false}
          OnClick={(callFrom) => this.OnClick(callFrom)}
        />
        <Tab.Navigator lazy={false} tabBar={props => <this.MyTabBar screenState={this.state}
          {...props} _color={this.props.colorCode} />} sceneContainerStyle={{
            backgroundColor: "#fff" 
          }} >

          <Tab.Screen
            name={'RIGHT EYE'}
            children={(props) =>
              <RightEye
                {...this.props}></RightEye>

            }
            options={{
              headerShown: false
            }} />
          <Tab.Screen
            name={'LEFT EYE'}
            children={(props) =>
              <LeftEye
                {...this.props}>
              </LeftEye>
            }
            options={{
              headerShown: false
            }} />

        </Tab.Navigator>
        
        <View style={{ bottom: 0, width: '100%',   flexDirection: "row", backgroundColor: '#ffffff', borderTopColor: '#dcdcdc', borderTopWidth: 1 }}>
          <View
            style={{ flex: 1, backgroundColor: '#ffffff' }}
          >
            <TouchableOpacity onPress={() => this.redirect("More")}>
              <View style={{
                flexDirection: 'row',
                width: '100%',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: '#16e261'

              }}>

                <Text style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: '#16e261',
                  fontFamily: 'NotoSans-Bold',
                  marginEnd: 5
                }} >{"MORE"}</Text>

              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1 }}
          >


            <TouchableOpacity
              onPress={() => {
                this.redirect()
              }}
            >
              <LinearGradient colors={[colorCodeOfPage, "#16e261"]} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',

                }}>

                <Text style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: '#ffffff',
                  fontFamily: 'NotoSans-Bold',
                  marginEnd: 5
                }} >{'DONE'}</Text>

              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }
  //End of class    
}

const mapStateToProps = state => ({
  auth: state.auth,
  opthal: state.opthal,
  prescription: state.patientvisit.prescription,
});

const mapDispatchToProps = dispatch => ({
  setOpthalListData: (data) => dispatch(setOpthalListData(data)),
  setOpthalData: (data) => dispatch(setOpthalData(data)),
  setPrescription: (prescription) => dispatch(setPrescription(prescription)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(OpthalHome));


//StyeSheet
const styles = StyleSheet.create({
  activeCamTab: {
    borderBottomWidth: 4, borderColor: '#0ab2b2', paddingRight: 10, paddingLeft: 10
  },
  deactiveCamTab: {
    borderBottomWidth: 4, borderColor: "transparent", paddingRight: 10, paddingLeft: 10,
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },
  tabStyle: {
    backgroundColor: '#ffffff',
    color: 'red'
  },
  tabText: {
    textTransform: "uppercase",
    color: "#959595", fontSize: 14,
    fontFamily: 'NotoSans', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0869d8",
    fontSize: 14,
    fontFamily: 'NotoSans-Bold', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
  },
  linear_gradient_btn_style: {
    flexDirection: 'row',
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 25
  },
  
  
  container: {
    marginTop: 22,
    flex: 0.07,
    flexDirection: 'row'


  },
  ViewImage: {
    flex: 0.12,
    justifyContent: 'center',
    alignItems: 'center'
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
