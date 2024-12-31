import React, { Component } from "react"
import { View, Text, Image, TouchableOpacity, PanResponder, Animated } from 'react-native'
import Styles from './styles'
import { Images } from './../../Theme'

export default class ToolbarComponent extends Component {
    constructor(props){
        super(props); 
        
    }
  
    _onPress = () => {
        if(this.props.onLeftIconClicked!=undefined){
            this.props.onLeftIconClicked();
        }else{
            alert('onLeftIconClicked property missing')
        }  
        
    };

    onRightIconPress = () =>{
        if(this.props.onRightIconClicked!=undefined){
            this.props.onRightIconClicked();
        }else{
            alert('onRightIconClicked property missing')
        }
    }

    onMediaIconPress = ()=>{
        if(this.props.onMediaIconClicked!=undefined){
            this.props.onMediaIconClicked();
        }else{
            alert('onMediaIconPress property missing')
        }
    }

    onDropDownIconPres = ()=>{
        if(this.props.onDropDownIconClicked!=undefined){
            this.props.onDropDownIconClicked();
        }else{
            alert('onDropDownIconClicked property missing')
        }
    }

    render(){   
        leftIconImage = Images.ic_arrow_back;
        leftIconType = this.props.leftIconType;
        if(leftIconType=='drawer'){
            leftIconImage=Images.ic_arrow_back;
        }else if(leftIconType=='back'){
            leftIconImage = Images.ic_arrow_back;
        }else {
            leftIconImage=null;
        }
        
        return(
            <View onTouchStart={this.props.OutClick} style={Styles.vwToolbar}>   
                {
                (this.props.leftIconType!=undefined)?
                    <View style={Styles.flex_row}>
                        <TouchableOpacity onPress={this._onPress}>
                            <Image style={Styles.ivArrowBack} source={leftIconImage} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                :
                    null
                }
                <View style={[Styles.flex_row,Styles.aligncenter]}>
                    <View style={[Styles.flex_column]}>
                        <Text style={Styles.textToolbarLabel}>{this.props.headerTitle}</Text>
                        {
                            (this.props.subHeaderTitle && this.props.subHeaderTitle != "")? 
                            <Text style={Styles.textToolbarSubLabel}>{this.props.subHeaderTitle}</Text>
                            : null
                        }
                    </View>
                    {
                        (this.props.dropDownIcon)?
                        <TouchableOpacity onPress={this.onDropDownIconPres}>
                            <Image style={[Styles.ivRightImage,{marginLeft:10}]} source={this.props.dropDownIcon} resizeMode={'contain'} />
                        </TouchableOpacity>
                        :null
                    }
                    

                </View>
                {
                this.props.right_ico ?
                <View style={[Styles.flex_row, {position:'absolute', right:16}]}>  
                    <TouchableOpacity onPress={this.onRightIconPress}>
                        <Image style={Styles.ivRightImage} source={this.props.right_ico} resizeMode={'contain'} />
                    </TouchableOpacity>
                    {
                        (this.props.mediaIcon)?
                        <TouchableOpacity onPress={this.onMediaIconPress}>
                            <Image style={[Styles.ivRightImage,{marginLeft:28}]} source={this.props.mediaIcon} resizeMode={'contain'} />
                        </TouchableOpacity>
                        :null
                    }
                      
                </View>
                : null
                }

            </View>
        ) 
    }
}

/**
 * <View style={Styles.vwToolbar}>  
                <TouchableOpacity onPress={this._onPress}>
                    <Image style={Styles.ivArrowBack} source={leftIconImage} resizeMode={'contain'} />
                </TouchableOpacity>
                <Text style={Styles.textToolbarLabel}>{this.props.headerTitle}</Text>
            </View>
 */