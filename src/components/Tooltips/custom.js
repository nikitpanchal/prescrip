import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Images from '../../Theme/Images'
import LottieView from 'lottie-react-native';
import { Triangle_Tip_Tooltip } from '../../constants/images';


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    };
    render() {
        return (
            
            <View style={{ flexDirection: 'column', margin: 15, }}>
                <View style={{ flexDirection: 'row', width: '75%' }}>
                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>

                        {
                            this.props.isLottie
                                ?
                                <LottieView
                                    style={{ width: 40, height: 40, resizeMode: 'contain', alignSelf: 'center' }}
                                    source={this.props.imagePath} loop={true} autoPlay={true} ref={animation => {
                                        this.animation = animation;
                                    }} /> :
                                <Image source={this.props.imagePath}
                                    style={{ width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' }}
                                />


                        }




                    </View>

                    <View style={{ justifyContent: 'center', marginLeft: 10, paddingRight: 20 }}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        {this.props.subtitle ? <Text style={styles.subtitle}>{this.props.subtitle ? this.props.subtitle : ""}</Text> : null}

                        <Text style={styles.decription}>{this.props.description}</Text>

                    </View>
                </View>

                <View
                    style={{
                        justifyContent: 'flex-end', marginBottom: 10
                    }}
                >
                    <Text style={styles.Got_it}>GOT IT</Text>

                </View>



            
            
            </View>
        );
    }
}

const styles = StyleSheet.create({





    title: {
        fontSize: 15,
        color: "#fefefe",
        fontFamily: "NotoSans-Bold"

    },
    subtitle: {
        fontSize: 13,
        color: "#fefefe",
        fontFamily: "NotoSans-Bold"

    },
    decription: {
        fontSize: 12,
        color: "#fefefe",

        fontFamily: "NotoSans"
    },

    Got_it: {
        textAlign: 'right',
        justifyContent: 'flex-end',


        fontSize: 13,
        color: "#fff",
        fontFamily: "NotoSans-Bold"

    }




});