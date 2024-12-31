import React from 'react';
import { Text } from "native-base";
import { TouchableWithoutFeedback, Image, StyleSheet, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient'
import { save_btn_green } from '../../constants/images'
//Refer Additional Assessments for design
const CFlatListItem = ({ style, label, imagePath, onPress, extracomponent, selecteddata }) => {
    return <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.cont, style]}>
            <View style={{ width: 50, justifyContent: 'center' }}>
                <Image source={imagePath} resizeMode={'contain'} style={{
                    height: 40, width: 40,
                    alignSelf: 'flex-start',
                }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                {selecteddata ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.txt1}>{label}</Text>
                        <View style={{ width: 50, paddingHorizontal: 15, justifyContent: 'center' }} >
                            <Image source={save_btn_green} resizeMode={'contain'} style={{
                                height: 22, width: 22, tintColor: '#00C953',
                            }} />
                        </View>
                    </View>
                    : <Text style={styles.txt1}>{label}</Text>

                }

                {extracomponent}

            </View>

        </View>
    </TouchableWithoutFeedback>
}

export default CFlatListItem;

const styles = StyleSheet.create({
    cont: {
        flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#d9d9d9",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 8,
        justifyContent: 'center',
        minHeight: 70
    },
    txt1: { color: '#3f3e3e', fontSize: 22, fontFamily: 'NotoSans', paddingTop:5 },
})