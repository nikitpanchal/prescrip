import React, { Component } from "react";
import { Image, StatusBar, ActivityIndicator } from "react-native";
import { Container, Text, View } from "native-base";
import styles from "./styles";


export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" color="#5ABEEC" />
        </View>
      </View>
    );
  }
}
