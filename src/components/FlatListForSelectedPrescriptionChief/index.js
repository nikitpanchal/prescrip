//code by ravi

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight,
  Text,
  BackHandler,
  AsyncStorage,
  SwipeableListView,
  Dimensions,
  Platform,
} from "react-native";
import { Icon } from "native-base";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Images from "../../Theme/Images";

import { SwipeListView } from "react-native-swipe-list-view";
import {
  icon_Chief_Complaints_Duration_Button,
  icon_Reemove_Button,
} from "../../constants/images";

const colorCode = "#0b69d8";

import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import { Duration } from "../../constants/images";
import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { setTooltipStatus } from "../../actions/tooltip";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

class VideoCunsultingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.length = 0;
  }

  renderSeperator() {
    return <View style={{ height: 1, backgroundColor: "#cdcdcd" }}></View>;
  }

  renderHiddenItem(rowItem, index) {
    return (
      <View
        style={{
          shadowColor: "#d9d9d9",
          marginHorizontal: 5,

          paddingVertical: 10,
          marginVertical: 10,
          backgroundColor: "#E6EEF7",
          flexDirection: "row",
          justifyContent: "flex-start",
          borderRadius: 10,
          alignItems: "flex-start",
          width: width,
        }}
      >
        {/*Duration*/}
        <TouchableOpacity
          onPress={() => this.props.clickData("Duration", rowItem.item.id)}
        >
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{ fontFamily: "NotoSans", fontSize: 12, color: "#c4c4c4" }}
            >
              Duration
            </Text>

            <View
              style={{
                borderBottomColor: colorCode,
                borderBottomWidth: 1,
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: colorCode,
                  fontFamily: "NotoSans-Bold",
                  fontSize: 20,
                }}
              >
                {rowItem.item.duration == "" ? "Select" : rowItem.item.duration}
              </Text>
              <Icon as={FontAwesome}
                style={{
                  marginLeft: 10,
                  color: colorCode,
                  height: 30,
                  width: 30,
                }}
                name="angle-down"
                type="FontAwesome"
              />
            </View>
          </View>
        </TouchableOpacity>
        {/*Period*/}
        <TouchableOpacity
          onPress={() => this.props.clickData("Period", rowItem.item.id)}
        >
          <View style={{ marginLeft: 20 }}>
            <Text
              style={{ fontFamily: "NotoSans", fontSize: 12, color: "#c4c4c4" }}
            >
              Select Period
            </Text>

            <View
              style={{
                borderBottomColor: colorCode,
                borderBottomWidth: 1,
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: colorCode,
                  fontFamily: "NotoSans-Bold",
                  fontSize: 20,
                }}
              >
                {rowItem.item.period == "" ? "Select" : rowItem.item.period}
              </Text>
              <Icon as={FontAwesome}
                style={{
                  marginLeft: 10,
                  color: colorCode,
                  height: 30,
                  width: 30,
                }}
                name="angle-down"
                type="FontAwesome"
              />
            </View>
          </View>
        </TouchableOpacity>
        {/*Duration Ends*/}
      </View>
    );
  }

  openRow(index, rowMap) {
    //alert("Clicked");

    if (rowMap[index + 1]) {
      let rowRef = rowMap[index + 1];

      if (!rowRef.isOpen) {
        rowRef.manuallySwipeRow(Platform.isPad ? width / 1.25 : 275);
        rowRef.isOpen = true;
      } else {
        rowRef.closeRow();
        rowRef.isOpen = false;
      }
    }
  }
  renderSelectedItem(rowItem, rowMap) {
    return (
      <View
        style={{
          borderBottomColor: "#d9d9d9",
          borderBottomWidth: 1.8,
          borderRightColor: "#d9d9d9",
          borderRightWidth: 1,
          borderLeftColor: "#d9d9d9",
          borderLeftWidth: 1,
          marginHorizontal: 5,
          elevation: 5,
          paddingVertical: 10,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: "#ffffff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}>
          {rowItem.item.duration != "" && rowItem.item.period != "" ? (
            <TouchableOpacity
              onPress={() => {
                this.openRow(rowItem.index, rowMap);
              }}
              style={{
                marginLeft: 10,
                alignSelf: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E6EEF7",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colorCode,
                  fontFamily: "NotoSans-Bold",
                  fontSize: 16,
                }}
              >
                {rowItem.item.duration}
              </Text>

              <Text
                style={{
                  color: colorCode,
                  fontFamily: "NotoSans",
                  fontSize: 11,
                }}
              >
                {rowItem.item.period}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              {this.props.chiefComplaintContainerClock ? (
                <TouchableOpacity
                  style={{ flexDirection: "column", justifyContent: "center" }}
                >
                  <Tooltip
                    topAdjustment={
                      Platform.OS === "android" ? -StatusBar.currentHeight : 0
                    }
                    animated={true}
                    isVisible={this.props.chiefComplaintContainerClock}
                    backgroundColor={"rgba(0,0,0,0)"}
                    contentStyle={{
                      backgroundColor: "#6f6af4",
                      height: "100%",
                    }}
                    tooltipStyle={{ left: 20, alignItems: "flex-end" }}
                    content={
                      <TouchableOpacity
                        style={{ backgroundColor: "#6f6af4" }}
                        onPress={() => {
                          this.props.setTooltipStatus({
                            ["chiefComplaintContainerClock"]: false,
                          });
                        }}
                      >
                        <AddPatient
                          imagePath={Duration}
                          title={"Duration of Complaint"}
                          description={
                            "You can add duration of the patient's complaint from here."
                          }
                        />
                      </TouchableOpacity>
                    }
                    //(Must) This is the view displayed in the tooltip
                    placement="bottom"
                    //(Must) top, bottom, left, right, auto.
                    onClose={() =>
                      this.props.setTooltipStatus({
                        ["chiefComplaintContainerClock"]: false,
                      })
                    }
                    //(Optional) Callback fired when the user taps the tooltip
                  >
                    <Image
                      source={icon_Chief_Complaints_Duration_Button}
                      style={{ width: 50, height: 50, marginHorizontal: 10 }}
                      resizeMode="contain"
                    ></Image>
                  </Tooltip>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.openRow(rowItem.index, rowMap);
                  }}
                >
                  <Image
                    source={icon_Chief_Complaints_Duration_Button}
                    style={{ width: 50, height: 50, marginHorizontal: 10 }}
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              flex: 1,
              flexWrap: "wrap",
              marginHorizontal: 10,
              color: "#000000",
              fontFamily: "NotoSans-Bold",
              fontSize: 17,
              textAlign: "left",
            }}
          >
            {rowItem.item.name}
          </Text>
        </View>
        <View
          style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.crossClick_selectedItem(
                rowItem.item.id,
                rowItem.index
              );
            }}
          >
            <Image
              source={icon_Reemove_Button}
              style={{
                width: 15,
                height: 15,
                padding: 5,
                marginHorizontal: 10,
              }}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  Item(data, index) {
    return (
      <TouchableOpacity style={styles.content_container}>
        <View style={{}}>
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.leftImageOnClick();
                }}
                style={{
                  padding: 5,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    marginLeft: 5,
                    alignSelf: "center",
                    justifyContent: "flex-end",
                    width: 45,
                    height: 45,
                  }}
                  source={this.props.leftImage}
                />
              </TouchableOpacity>

              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
                onPress={() => {
                  this.props.leftImageOnClick();
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 30,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "NotoSans-Bold",
                    color: this.props.titleColor,
                    fontSize: 20,
                    alignSelf: "flex-start",
                  }}
                >
                  {data.name}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.crossClick_selectedItem(data.id, index);
              }}
              style={{
                padding: 5,
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
                  width: 15,
                  height: 15,
                }}
                source={this.props.rightImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ marginHorizontal: 10, flex: 1 }}>
        <SwipeListView
          data={this.props.data}
          disableLeftSwipe={true}
          disableRightSwipe={true}
          ref={"swipeList"}
          renderItem={(rowData, rowMap) =>
            this.renderSelectedItem(rowData, rowMap)
          }
          renderHiddenItem={(item, index) => this.renderHiddenItem(item, index)}
          keyExtractor={(item) => item.id}
          extraData={this.state}
          closeOnScroll={true}

          //    onRowClose={(rowKey) => alert(rowKey)}

          //onLeftActionStatusChange ={alert('sf')}
        />
      </View>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.length == 0) {
      this.length = this.props.data.length;
    }
    if (this.length !== this.props.data.length) {
      this.refs.swipeList.closeAllOpenRows();
      this.length = this.props.data.length;
    }
  }
}

const mapStateToProps = (state) => ({
  chiefComplaintContainerClock:
    state.tooltip.toolTipStatus.chiefComplaintContainerClock,
});

const mapDispatchToProps = (dispatch) => ({
  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(VideoCunsultingComponent));

const styles = StyleSheet.create({
  view_style: {
    flexDirection: "row",
    backgroundColor: "#008be0",
    height: 60,
  },
  Optometry_Record: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "left",
  },
  step_2_5: {
    fontSize: 12,
    color: "#ffffff",
  },
  Next: {
    height: 18,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
  content_container: {
    flexDirection: "column",
    paddingVertical: 5,
    paddingHorizontal: 10,
    //borderBottomColor: "#e3e3e3",
    // borderBottomWidth: 1
  },
  content_color: {
    color: "#383838",
    fontWeight: "600",
    fontSize: 16,
  },
  Next_blue: {
    height: 15,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
});
