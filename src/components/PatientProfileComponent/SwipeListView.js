/* Developed by Ruban 
  on 8/10/20 */


import React, { Component } from 'react'
import { View, Text, Animated, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Easing } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'

export default class SwipeListView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refresh: false
        }
    }

    addNotesToProps() {
        let data = this.props.patientvisit.prescription
        data.Notes = this.props.text
        this.props.setPrescription(data)
        this.props.navigation.pop()

    }



    render() {
        const extraData = this.props.extraData
        const LeftActions = ({ progress, dragX, onPress }) => {
            const scale = dragX.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
            return (
                <TouchableOpacity onPress={onPress}>
                    <View style={styles.leftAction}>
                        <Animated.Image source={this.props.left_image} style={[styles.actionImage, { transform: [{ scale }] }]} />

                    </View>
                </TouchableOpacity>
            );
        };

        return (
            <Swipeable
                //   renderLeftActions={LeftActions}
                onSwipeableLeftOpen={this.props.onSwipeFromLeft}
                renderLeftActions={(progress, dragX) => (
                    <LeftActions progress={progress} dragX={dragX} onPress={this.props.onLeftPress} />
                )}
            >
                <TouchableOpacity disabled={this.props.route.params.previous_screen == "PrintPreview" || this.props.route.params.previous_screen == "AdditionalAssessment"
                    ? false : true} onPress={() => this.addNotesToProps()} style={styles.listView}>
                    <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={this.props.titleimage} style={{ resizeMode: 'contain', height: 12 }} />
                        <Text style={{ fontSize: 12, fontFamily: 'NotoSans', color: '#969696' }}>{this.props.currentDateTime}</Text>

                    </View>
                    <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 12 }}>
                        <Text style={{ fontFamily: 'NotoSans', lineHeight: 20 }}>{this.props.text}</Text>
                    </View>

                </TouchableOpacity>
            </Swipeable>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    text: {
        color: '#4a4a4a',
        fontSize: 15,
    },
    listView: {
        flex: 1, borderBottomColor: '#cccccc', alignItems: 'flex-start', margin: 15,
        borderBottomWidth: 2, justifyContent: 'center', padding: 7, borderRadius: 6,
        borderLeftColor: '#cccccc', borderLeftWidth: 0.6, borderRightColor: '#cccccc', borderRightWidth: 0.6, backgroundColor: '#fff'
    },
    leftAction: {
        backgroundColor: '#f7eaea',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        flex: 1,
        padding: 8,
        margin: 15,
        width: '100%'
    },
    rightAction: {
        backgroundColor: '#dd2c00',
        justifyContent: 'center',
        // flex: 1,
        alignItems: 'flex-end',
    },

    actionImage: {
        resizeMode: 'contain',
        height: 15,
    },
});