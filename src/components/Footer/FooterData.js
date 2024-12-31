import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export default class FooterData extends Component {
    constructor(props) {
        super(props)
    }
    /* type 1 = normal button 
    type 2 = gradient button and text view below button 
    type 3 = 2 gradient button left and right
    type 4 = center gradient button and two text on left and right below button */ 
    render() {
        return (

            this.props.type == 1 ?
               <View style={{flex:0.2,justifyContent:'center'}}>
                <Button block style={this.props.btnStyle}><Text>{this.props.btnText}</Text></Button>
               </View>:
               this.props.type==2?
                <View style={{flex:0.2,justifyContent:'center'}} >
                    <TouchableOpacity onPress={this.props.onBtnClick} style={this.props.TouchableOpacityStyle}>
                        <LinearGradient colors={this.props.colors} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={this.props.gradientStyle}>

                            <Text style={{ textAlign: 'center', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >{this.props.btnText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.props.onTextClick}>
                            <Text style={{ textAlign: 'center', marginTop: 25, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 15, color: '#757575' }} >{this.props.secondText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                : this.props.type == 3 ?
                <View style={{ flex: 0.1, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this.props.btnClick1}>
                        <View
                            style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25, borderColor: '#08c9f1', borderWidth: 1 }}>

                            <Text style={{ textAlign: 'center', fontSize: 17, color: '#08c9f1', fontFamily: 'NotoSans-Bold' }} >{this.props.btnText1}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity

                        style={{ flex: 1 }}
                        onPress={this.props.btnClick2}>
                        <LinearGradient colors={this.props.colors2} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10, alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >{this.props.btnText2}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                :this.props.type==4?
                <View style={{flex:0.2}}>
                     <TouchableOpacity onPress={this.props.onBtnClick} >
                        <LinearGradient colors={this.props.colors} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%', height: 50, alignItems: 'center', justifyContent: 'center',marginTop:25,  alignSelf: 'center', borderRadius: 25 }}>

                            <Text style={{ textAlign: 'center', fontSize: 17, color: '#ffffff', fontFamily: 'NotoSans-Bold' }} >{this.props.btnText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
               <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <TouchableOpacity 
                    onPress ={this.props.leftTextClick}
                    >
                        <Text style={{ textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 14, color: '#757575' }} >{this.props.leftText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                     onPress ={this.props.rightTextClick}
                    >
                        <Text style={{ textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold', fontSize: 14, color: '#ec6569' }} >{this.props.rightText}</Text>
                    </TouchableOpacity>
                </View>
                </View>:null


        )
    }
}