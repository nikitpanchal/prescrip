import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import Images from "../../Theme/Images";
import LottieView from "lottie-react-native";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{ flexDirection: "column", marginRight: 10, height: "100%" }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              justifyContent: "center",
              height: "100%",
              alignSelf: "center",
            }}
          >
            {this.props.isLottie ? (
              <LottieView
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
                source={this.props.imagePath}
                loop={true}
                autoPlay={true}
                ref={(animation) => {
                  this.animation = animation;
                }}
              />
            ) : (
              <Image
                source={this.props.imagePath}
                style={{
                  width: this.props.imgWidth ? this.props.imgWidth : 50,
                  height: this.props.imgHeight ? this.props.imgHeight : 50,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            )}
          </View>

          <View
            style={{
              justifyContent: "center",
              marginLeft: 10,
              paddingRight: 20,
            }}
          >
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.subtitle ? (
              <Text style={styles.subtitle}>
                {this.props.subtitle ? this.props.subtitle : ""}
              </Text>
            ) : null}

            <Text style={styles.decription}>{this.props.description}</Text>
          </View>
        </View>

        {!this.props.textBtnVisible ? null : (
          <View style={{ justifyContent: "flex-end" }}>
            <Text style={styles.Got_it}>GOT IT</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#fefefe",
    fontFamily: "NotoSans-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#fefefe",
    fontFamily: "NotoSans-Bold",
  },
  decription: {
    fontSize: 13,
    color: "#fefefe",
    marginRight: 10,
    paddingRight: 10,
    fontFamily: "NotoSans",
  },

  Got_it: {
    textAlign: "right",
    justifyContent: "flex-end",

    marginBottom: 20,
    fontSize: 14,
    color: "#fff",
    fontFamily: "NotoSans-Bold",
  },
});
