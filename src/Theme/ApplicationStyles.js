/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import Fonts from './Fonts'
import Colors from './Colors'
export default {
  screen: {
    container: {
      flex: 1,
    },
    centerAlign: {
      alignItems: 'center', 
      justifyContent: 'center',
    },
    selectionTick:{
        position:'absolute',
    },
    imgSelected:{
        width:30,
        height:30
    }, 
    vwButtonBackground:{
      flex:1,
      alignItems: 'center', 
      justifyContent: 'center',
      height: 50, 
      backgroundColor:Colors.backgroundSubmit,
      borderRadius:2
    },
    textButton:{
      ...Fonts.customFontFamily.SpaceGrotesk_Medium,
      color:Colors.textColor,
      fontSize: 18
    },
    textInputPadding:{
      padding: 4,
      margin: 0,
    }
  },
  removeModal:{
    vwModalParent:{ 
      backgroundColor:Colors.popupBackgroundColor,
      width:'80%',
      flexDirection:'column',
      borderRadius:4,
      padding:20 
    },
    textModalHeader:{
      color:Colors.textLightColor,
      padding:5,
      fontSize:20,
      ...Fonts.customFontFamily.SpaceGrotesk_Bold
    },
    textModalDescription:{
      color:Colors.textLightColor,
      padding:5,
      fontSize:16,
      ...Fonts.customFontFamily.SpaceGrotesk_Medium
    },
    textModalCancel:{
      color: Colors.backgroundPrimary,
      padding:5,
      fontSize:18,
      ...Fonts.customFontFamily.SpaceGrotesk_Regular
    },
    textModalConfirm:{
      color: Colors.backgroundPrimary,
      padding:5,
      fontSize:18,
      ...Fonts.customFontFamily.SpaceGrotesk_Regular,
      left:10
    }
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  GradientColor: [Colors.gradientUpper,Colors.gradientLower],
  imgSwitch:{
      width:60,
      height:45, 
  },
  ivArrowImage:{
    width:15,
    height:15,
  },
  alignEnd:{
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  vwModalParent:{
    backgroundColor:Colors.popupBackgroundColor,
    width:'80%',
    flexDirection:'column',
    borderRadius:8 
  },
  textHeaderLabel:{
    ...Fonts.customFontFamily.SpaceGrotesk_Medium,
    fontSize: 20,
    color: Colors.textColor,
  },
  vwModalContent:{
    padding:10,
    flexDirection:'column'
  },
  vwModalRouterSettings:{
    padding:10,
    flexDirection:'column'
  },
  inputFormHeader: {
    ...Fonts.customFontFamily.SpaceGrotesk_Light,
    fontSize: 16,
    color: Colors.textLightColor,
    
  },
  inputBox: {
    ...Fonts.customFontFamily.SpaceGrotesk_Regular,
    fontSize: 16,
    width : '80%',
    color: Colors.textColor,
    //marginTop: 4,
    //marginBottom: 15,
    padding: 4,
    margin: 0,
    //height:50
  },
  showPass: {
    width: 25,
    justifyContent: 'center',
    height: 25
  },
  vwModalRouterSettings:{
    padding:10,
    flexDirection:'column'
  },
  vwModalDHCPSettings:{
    padding:10,
    flexDirection:'row',
    alignItems:'center'
  },
  vwLogin: {
    backgroundColor:Colors.backgroundSubmit,
    padding:10,
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft:20,
    marginRight:20,
    borderRadius:4,
    marginTop:8,
    marginBottom:8
  },
  textLoginButton: {
    ...Fonts.customFontFamily.SpaceGrotesk_Medium,
    color: Colors.textColor,
    fontSize: 18
  },
  vwContainer:{
    flex:1,
    flexDirection:'column',
  },
}
