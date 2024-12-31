import React, { Component } from "react";
import {
  Container,

} from "native-base";
import Tab1 from "./UseFav";
import Tab2 from "./UseCerti";
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  TextInput, Text, ScrollView, Dimensions
} from "react-native";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import PrescriptionWebViewHeader from "../../components/Header/PrescriptionWebViewHeader";
import Images from "../../Theme/Images";
import {
  empty_vc,
  Chief_N_Data_Icon,
  Black_back,
  ic_note_delete,
  Search_button_light_blue,
  add_button_gray,
  icon_search_button_blue,
} from "../../constants/images";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
const Tab = createMaterialTopTabNavigator();
export default class UseFavourite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EmptyHomeTitle: "No Prescription",
      isShowButton: false,
      enterText: "",
      favdata: this.props,
      search: "",
      refresh: false,
    };
  }

  OnClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack();
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "UseFavourite",
      screen_class: "UseFavourite",
    });
  }
  searchFilterFunction() { }

  rightImageOnClick() {
    this.setState({ enterText: "" });
    this.searchData("");
    this.textInput.clear();
  }

  searchData(txt) {
    // this.searchFilterFunction(txt)
    this.setState({
      enterText: txt,
    });
  }
  MyTabBar({ state, descriptors, navigation, position, screenState }) {
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
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={isFocused ? styles.activeTab : styles.deactiveTab}
              >
                <View style={{
                  backgroundColor: 'transparent', height: 8, alignSelf: 'flex-end',
                  width: 8, borderRadius: 8
                }}></View>
                < Text style={isFocused ? styles.activeTabText : styles.tabText}>{label}</Text>
              </TouchableOpacity>
            );

          })}
        </ScrollView>
      </View >
    );
  }




  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />



        <View
          style={{
            paddingHorizontal: 9,
            marginTop: 20,
            flexDirection: "row",
            borderBottomColor: "#cccccc",
            borderBottomWidth: 2,
            paddingVertical: 18,
            backgroundColor: "#fff", width: Dimensions.get('window').width
          }}
        >
          <TouchableOpacity
            onPress={() => this.OnClick()}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={Images.ic_black_back}
              style={{ resizeMode: "contain", height: 20 }}
            />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#595757",
                fontFamily: "NotoSans",
                textTransform: "uppercase",
              }}
            >
              {this.props.searchTitle}
            </Text>
            <View style={{ flex: 1 }}>
              <TextInput
                //autoCompleteType={false}
                ref={(input) => {
                  this.textInput = input;
                }}
                autoCorrect={false}
                placeholder={"Select Favourite "}
                placeholderTextColor="#595757"
                onChangeText={(txt) => this.searchData(txt)}
                style={{
                  includeFontPadding: false,
                  letterSpacing: 0.3,
                  textAlign: "justify",
                  fontSize: 20,
                  color: "#595757",
                  padding: 0,
                }}
                Value={this.state.txt}
              />
            </View>
            <TouchableOpacity onPress={() => this.rightImageOnClick()}>
              <Image
                source={
                  this.state.enterText.trim()
                    ? ic_note_delete
                    : icon_search_button_blue
                }
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  tintColor: "#595757",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Tab.Navigator style={{ width: Dimensions.get('window').width }} lazy={false} s tabBar={props => <this.MyTabBar screenState={this.state} {...props} />}
          screenOptions={{
            lazy: false
          }}>

          <Tab.Screen
            name={'PRESCRIPTIONS'}
            children={(props) =>
              <Tab1
                {...this.props}
                route={this.props.navigation}
                enterText={this.state.enterText}
              />
            }
            options={{
              headerShown: false
            }}


          />
          <Tab.Screen
            name={'CERTIFICATES'}
            children={(props) =>
              <Tab2
                {...this.props}
                route={this.props.navigation}
                enterText={this.state.enterText}
              />
            }
            options={{
              headerShown: false
            }} />
        </Tab.Navigator>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "#ffffff",
    color: "#000",
  },
  activeTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "#0869d8"
  },
  deactiveTab: {
    justifyContent: 'center', paddingBottom: 12, paddingLeft: 10, paddingRight: 10,
    borderColor: "#0869d8", borderBottomWidth: 4, borderColor: "transparent"
  },
  tabText: {
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "NotoSans",
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "#0065d7",
    fontSize: 14,
    fontFamily: "NotoSans-Bold",
  },
  container: {
    marginTop: 22,
    flex: 0.07,
    flexDirection: "row",
  },
  ViewImage: {
    flex: 0.12,
    justifyContent: "center",
    alignItems: "center",
  },
  ViewText: {
    flex: 0.76,
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    color: "grey",
  },
  subtitle: {
    fontSize: 20,
    color: "#717171",
    fontFamily: "NotoSans",
  },
  subtitle2: {
    fontSize: 12,
    color: "#717171",
    fontFamily: "NotoSans",
  },
  Image: {
    resizeMode: "contain",
    height: 20,
  },
});
