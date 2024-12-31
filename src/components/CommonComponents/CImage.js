import React, { Component } from "react";
import { View, PanResponder, Image,Text } from "react-native";
import { WebView } from 'react-native-webview';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image'
class ZoomableImage extends Component {
    render() {
        return (
            <Swiper index={this.props.currentIndex} style={{
                backgroundColor: '#fff'
            }} loop={false}
                dotColor='#cdcdcd' activeDotColor='#0064d7' showsPagination={true}>
                {
                    this.props.images.map((item, i) => {
                       
                        return <View style={{ flex: 1 }}>
                        <FastImage resizeMode={FastImage.resizeMode.contain} style={{ flex: 1, resizeMode: "contain", height: '100%' }}
                        source={{ priority: FastImage.priority.normal,uri: item }} />
                        </View>
                        })
                }
            </Swiper>
        );
    }
}

// ZoomableImage.propTypes = {

// };
export default ZoomableImage;
