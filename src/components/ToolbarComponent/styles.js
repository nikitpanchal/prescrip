import { StyleSheet, Dimensions } from 'react-native'
import {Fonts, ApplicationStyles, Colors} from './../../Theme'

export default StyleSheet.create({
    vwToolbar:{
        height:60,    
        backgroundColor:Colors.toolBarBackground,
        flexDirection:'row',
        alignItems: 'center', 
        //...ApplicationStyles.screen.centerAlign,
    },
    ivArrowBack:{
        width:20,
        height:20,
        marginLeft:16
    },
    ivRightImage:{
        width:20,
        height:20,
        //backgroundColor:'red'
    },
    textToolbarLabel:{
        ...Fonts.customFontFamily.SpaceGrotesk_Medium,
        fontSize: 18,
        color:Colors.textColor,
        marginLeft:16
    },
    textToolbarSubLabel: {
        ...Fonts.customFontFamily.SpaceGrotesk_Medium,
        fontSize: 14,
        color: '#6a6a6c',
        marginLeft: 16
    },
    flex_row: {
        flexDirection: 'row',
    },
    flex_column: {
        flexDirection: 'column'
    },
    aligncenter: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})