import React, { Component } from 'react'
import { View, Text, Image, FlatList, StatusBar, SafeAreaView, TouchableOpacity, Animated, BackHandler } from 'react-native'
import { appIcon } from '../../constants/images'
import LinearGradient from 'react-native-linear-gradient'
import { androidlink, ioslink } from '../../../app.json'
import { Platform } from 'react-native'
import { Linking } from 'react-native'


class WhatsNewComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isWhatsNewClicked: false,

        }
        this.entranceAnimation = new Animated.Value(0)
        this.flexAnimation = new Animated.Value(85)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {

        return true;
    }

    onWhatsNewClick() {
        this.setState({ isWhatsNewClicked: true }, () => {
            Animated.timing(this.entranceAnimation, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true
            }).start()


        })

    }



    render() {
        const translateX = this.entranceAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [-100, 0] // the card will translate from the left side of the screen to its natural position
        });
        const translateY = this.entranceAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -10] // the card will translate from the left side of the screen to its natural position
        });
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="transparent" />
                <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    <Animated.View style={{ transform: [{ translateY }], flex: (this.state.isWhatsNewClicked ? 0.35 : 0.85), justifyContent: 'center', alignItems: 'center', }}>


                        <Image source={appIcon} style={{ resizeMode: 'contain', height: 80, width: 80 }} />
                        <Text style={{ textAlign: 'center', color: '#404040', fontSize: 18, fontFamily: 'NotoSans' }}>You're missing out</Text>
                        <Text style={{ textAlign: 'center', color: '#8b8b8b', marginVertical: 8, fontFamily: 'NotoSans' }}>Update Prescrip app for newest feauture</Text>
                        <TouchableOpacity onPress={() => this.onWhatsNewClick()}>
                            <Text style={{
                                textAlign: 'center', color: '#8b8b8b', textDecorationLine: 'underline',
                                color: '#2581df', fontFamily: 'NotoSans-Bold'
                            }}>What's New?</Text>
                        </TouchableOpacity>


                    </Animated.View>

                    {this.state.isWhatsNewClicked ?
                        <Animated.View style={{ transform: [{ translateX }], flex: 0.5, backgroundColor: '#ffffff', margin: 15, borderRadius: 5 }}>
                            <FlatList
                                contentContainerStyle={{ padding: 12 }}
                                data={this.props.featureNotes}
                                renderItem={({ item, index }) => <View style={{ flexDirection: 'row', alignItems: 'center', padding: 3 }}>
                                    <Text style={{ fontSize: 14, paddingRight: 6, color: '#454545', fontFamily: 'NotoSans' }}>{"\u2022"}</Text>
                                    <Text style={{ color: '#454545', fontFamily: 'NotoSans' }}>{item}</Text>
                                </View>} />
                        </Animated.View>
                        : null}

                    <View style={{ flex: 0.15 }}>
                        <TouchableOpacity onPress={this.props.updateNow}>
                            <LinearGradient colors={["#29b62f", "#06d611"]} start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '60%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                                <Text style={{ textAlign: 'center', fontFamily: 'NotoSans-Bold', fontSize: 17, color: '#ffffff', textTransform: 'uppercase' }} >Update</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        {/*<TouchableOpacity onPress={this.props.notNowClick}>
                            <Text style={{ textAlign: 'center', color: '#6d6d6d', fontFamily: 'NotoSans-Bold' }}>Not Now</Text>
                    </TouchableOpacity>*/}

                    </View>
                </View>


            </SafeAreaView>
        )
    }
}



export default WhatsNewComponent