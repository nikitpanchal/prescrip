import React from 'react';
import { Text } from "native-base";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient'
import { Black_back } from "../../constants/images";

const CButton = ({ style, onPress }) => {
    return <TouchableOpacity onPress={onPress} >
        <Image source={Black_back} style={[styles.btnimg, style]} />
    </TouchableOpacity>
}

export default CButton;

const styles = StyleSheet.create({
    btnimg: { height: 25, width: 22, resizeMode: 'contain', }
})