/**
 * This file contains the application's colors.
 *
 * Define color here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

export default {
  transparent: 'red',
  blackSemiTransParent: 'red', 
  // Example colors:
  text: '#212529',
  primary: '#007bff',
  success: '#28a745',
  error: '#dc3545',
  backgroundPrimary:'#007893',
  get backgroundSubmit(){
    //get method is used to reassign property within object
    return this.backgroundPrimary
  },
  itemSelectionColor:'#192d38',
  gradientUpper:'#F2F2F2',
  gradientLower:'#F2F2F2',
  backgroundSaveGreen: '#00935d',
  backgroundDark:'#0b0c11',
  popupBackgroundColor:'#21232c',
  blackLightSemiTransParent: 'rgba(0,0,0,0.5)',
  undelineColorUpper:'#0f0f15', 
  undelineColorLower:'#2d2e34',
  textColor:'#ffffff',
  textErrorColor:'#cd285f',
  textSecondaryColor: '#7c8691',
  comingSoonBorder: '#343745',
  textComingSoon:'#ffb100',
  textLightColor: '#eaeaea',
  toolBarBackground: '#C51B1C',
  textInactive:'#F8F8F8',
  percentCompleted:'#11a376',
  percentRemaining:'#2d2f3b',
  unselectedBorder: '#737479',
  //sourabh color code
  greenColor :'#155B45',
  redColor :'#AD2A58',
}
