import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Text,
  Left,
  Body,
  Right,
  Content,
} from "native-base";
import {
  Dimensions,
  Alert,
  StatusBar,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { ic_Close_Button } from "../../constants/images";
const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
import styles from "./styles";
import ListModal from "./listModal";

export default class AddClinicPopup extends Component {
  constructor() {
    super();
    this.state = {
      //state to control the visibility of Tooltip
    };
  }

  showClinics() {
    {
      let clinics = this.props.ContactDetails1.filter((item, index) => {
        if (index < this.props.ContactDetails1.length - 1) return item;
      });
      var content = clinics.map((item, index) => {
        return (
          <View
            style={{
              flexDirection: "column",
              borderBottomWidth: 1,
              borderBottomColor: "#f4f4f4",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.setCurrentClinic(index);
              }}
            >
              <View
                style={{
                  padding: 20,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: "#eae8e8",
                    alignSelf: "center",
                  }}
                  source={item.imagePath}
                />

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    marginLeft: 20,
                    width: "85%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSans",
                      color: item.colorCode,
                      fontSize: 19,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      });

      return content;
    }
  }

  render() {
    return (
      <Modal
        backdrop={true}
        backdropPressToClose={false}
        animationType="slide"
        transparent={true}
        visible={this.props.isContactDetailsModal}
        ref={"modalCity"}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          {/*    <TouchableOpacity onPress={() => this.props.closeClick()}
            style={{
              alignSelf: 'flex-end',
              marginRight: (Platform.isPad?30: 9), marginBottom: -10,
              justifyContent: 'center', alignItems: 'center', elevation: 12, zIndex: 1,
            }}>
            <Image source={ic_Close_Button} style={{ height: 23, width: 23, resizeMode: 'contain', }} />
            <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> 
          </TouchableOpacity>     
*/}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              // padding: 20,
              alignItems: "center",
              width: "90%",

              flex:
                this.props.ContactDetails1.length > 5
                  ? 0.8
                  : this.props.ContactDetails1.length == 5
                  ? 0.7
                  : 0.6,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.closeClick()}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: -10,
                right: -11,
                elevation: 12,
                zIndex: 1,
              }}
            >
              <Image
                source={ic_Close_Button}
                style={{ height: 23, width: 23, resizeMode: "contain" }}
              />
              {/* <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> */}
            </TouchableOpacity>

            <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ededed",
                  flexDirection: "row",
                  paddingVertical: 15,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    paddingStart: 15,
                    fontFamily: "NotoSans-Bold",
                    color: "#3c3c3c",
                    fontSize: 22,
                    flex: 1,
                  }}
                >
                  {this.props.callFrom == "billing"
                    ? "Payment Source"
                    : "Select a Clinic"}
                </Text>
              </View>

              <View style={{ width: "100%", flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.showClinics()}
                </ScrollView>
                {this.props.callFrom != "receipt" &&
                this.props.callFrom != "billing" &&
                this.props.ContactDetails1 &&
                this.props.ContactDetails1.length != 0 ? (
                  <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.onClick();
                      }}
                    >
                      <View
                        style={{
                          padding: 20,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        <Image
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 17,
                            borderWidth: 1,
                            borderColor: "gray",
                            alignSelf: "center",
                          }}
                          source={
                            this.props.ContactDetails1[
                              this.props.ContactDetails1.length - 1
                            ].imagePath
                          }
                        />

                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: 20,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "NotoSans",
                              color:
                                this.props.ContactDetails1[
                                  this.props.ContactDetails1.length - 1
                                ].colorCode,
                              fontSize: 19,
                            }}
                          >
                            {
                              this.props.ContactDetails1[
                                this.props.ContactDetails1.length - 1
                              ].name
                            }
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
