/****** code by Sourabh ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button } from "native-base";
import {
  StatusBar,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  Platform,Dimensions
} from "react-native";

//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (SettingsContainer screen)
//5.progress bar ,title ,description

export default class SettingsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBox: false,
      phonenumber: "",
      search: "",
      text: "",
    };
    this._checkboxsms = 0;
  }

  changeData(text) {
    this.setState({ text });
    this.props.searchAction(text);
  }

  rightImageOnClick() {
    if (this.props.rightImageOnClick) {
      this.setState({ text: "" });

      this.props.rightImageOnClick();
    }
  }

  render() {
    const { search } = this.state;
    return (
      <View style={{ justifyContent: "center", flexdirection: "row" , width: Dimensions.get('window').width }}>
        <ImageBackground
          style={{
            width: "100%",
            backgroundColor: this.props.bgColor,
            borderBottomColor: "#dddddd",
            borderBottomWidth: 1,
          }}
          source={this.props.bgImage}
        >
          <View
            style={{
              flexDirection: "column",
              top: Platform.OS === "ios" ? null : StatusBar.currentHeight,
              marginBottom:
                Platform.OS === "ios" ? null : StatusBar.currentHeight,
            }}
          >
            <SafeAreaView>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      flex: 0.85,
                      paddingVertical: 0,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.leftImageOnClick()}
                      style={{
                        padding: 10,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          resizeMode: "contain",
                          alignSelf: "center",
                          justifyContent: "flex-end",
                          width: 25,
                          height: 22,
                        }}
                        source={this.props.leftImage}
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        flex: 1,
                        backgroundColor: "blue",
                      }}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: Platform.OS === "ios" ? 10 : 16,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      {this.props.isSearchBoxShowing ? (
                        <TextInput
                          defaultValue={
                            this.props.isSearchBoxShowing ? "" : this.state.text
                          }
                          selectionColor={this.props.cursorColor}
                          placeholder={this.props.description}
                          placeholderTextColor={this.props.descriptionColor}
                          style={{
                            padding: 0,
                            width: 300,
                            fontFamily: "NotoSans",
                            alignItems: "flex-start",
                            color: this.props.placeTextColor
                              ? this.props.placeholderTextColor
                              : "white",
                            borderColor: "white",
                            fontSize: this.props.placeholderTextSize
                              ? this.props.placeholderTextSize
                              : 16,
                            borderWidth: null,
                            //  borderBottomColor: '#cccccc',
                            borderBottomWidth: 2,
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
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            onPress={() => {
                              this.rightImageOnClick();
                            }}
                            style={{
                              fontFamily: "NotoSans-Bold",
                              color: this.props.descriptionColor,
                              fontSize: this.props.descriptionSize
                                ? this.props.descriptionSize
                                : 20,
                              alignSelf: "flex-start",
                            }}
                          >
                            {this.props.description}
                          </Text>
                          {this.props.subtitle ? (
                            <Text
                              style={{
                                fontFamily: "NotoSans",
                                color: "#7c7c7c",
                                fontSize: this.props.descriptionSize
                                  ? this.props.descriptionSize
                                  : 13,
                                alignSelf: "flex-start",
                              }}
                            >
                              {this.props.subtitle}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.rightImageOnClick();
                    }}
                    style={{
                      flex: 0.1,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        resizeMode: "contain",
                        alignSelf: "center",
                        justifyContent: "flex-end",
                        width: 22,
                        height: 22,
                      }}
                      source={
                        this.props.isSearchBoxShowing
                          ? this.props.rightImageCross
                          : this.props.rightImage
                      }
                    />
                  </TouchableOpacity>
                </View>
                {this.props.subArrayData &&
                this.props.subArrayData.length > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 15,
                      paddingVertical: 18,
                      borderTopColor: "#cccccc",
                      borderTopWidth: 0.5,
                    }}
                  >
                    {this.props.subArrayData.map((privilage, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={privilage.img}
                            style={{
                              resizeMode: "contain",
                              height: 10,
                              width: 10,
                              marginRight: 5,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "NotoSans",
                              color: "#656565",
                            }}
                          >
                            {privilage.access}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
