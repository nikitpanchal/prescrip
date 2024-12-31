import React from 'react';
import { Text } from "native-base";
import { TouchableWithoutFeedback, Image, StyleSheet, View,ActivityIndicator, Dimensions } from "react-native";
import LinearGradient from 'react-native-linear-gradient'

//Refer Additional Assessments for design
const CButton = ({ style, label, onPress,loading,colorCode }) => {
    return <TouchableWithoutFeedback onPress={() =>onPress()} >
        <View style={[styles.btncont, style]}>
            <LinearGradient
                disabled ={loading}



                colors={[colorCode ?colorCode :'#17afaf', colorCode ?colorCode :'#17afaf']} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                style={{    
                    
                    flexDirection: 'row',
                    width: '90%',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom :10,
                    borderRadius: 25
                    }}>
                <Text uppercase={true} style={{
                    fontSize: 16, color: "#fff", marginEnd: 5, fontFamily: 'NotoSans-Bold'
                }}>{label}</Text>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : null}

            </LinearGradient>
        </View>
    </TouchableWithoutFeedback>
}

export default CButton;

const styles = StyleSheet.create({
    btncont: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width, 
        paddingHorizontal: 10,marginBottom:10
    }
})