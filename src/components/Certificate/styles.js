import { Platform } from "react-native";
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';

export default {
  container: {
    flex: 1,
    backgroundColor : '#ffffff',
    flexDirection : 'column',
  },
  view_style: {
    flexDirection: "row",
    backgroundColor: '#008be0',
    height: 60
},
header_title: {
  fontSize: 18,
  color: "#ffffff",
  fontWeight: 'bold',
  textAlign: 'left'
},
next: {
  height: 18,
  color: "#ffffff",
  textAlign: 'center',
  resizeMode: 'contain'

},
  containerGray: {
    flex: 1,
    backgroundColor: "#eee",
  },
  header: {
    backgroundColor: '#008be0',
    paddingTop: Platform.OS == 'ios' ? 25 : 10,
    paddingBottom: 15,
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  pcd_inputText: {
    fontSize: 24,
    color: "#424242",
    margin: 0,

    borderBottomColor: '#909090',
    borderBottomWidth: 1

  },
  pcd_inputTextIos: {
    fontSize: 24,
    color: "#424242",
    margin: 0,
    height: 45,
    borderBottomColor: '#909090',
    borderBottomWidth: 1

  },
  inputText: {
    fontSize: 17,
    color: "#404040",
    height : 50,
    margin: 0,
    padding: 0,
    fontFamily : NotoSans,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    
  },
  inputArea: {
    fontSize: 17,
    color: "#404040",
    height : 75,
    margin: 0,
    padding: 0,
    fontFamily : NotoSans,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    
  },
  header1: {
    backgroundColor: '#008be0',
    paddingTop: Platform.OS == 'ios' ? 25 : 10,
    paddingBottom: 15,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header2: {
    backgroundColor: '#008be0',
    paddingTop: Platform.OS == 'ios' ? 25 : 10,
    paddingBottom: 15,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  searchBack: { alignItems: 'center', justifyContent: 'center' },
  searchButtons: { width: '50%', height: '50%', resizeMode: 'contain' },
  header3: {
    backgroundColor: '#008be0',
    //paddingTop: Platform.OS == 'ios' ? 25 : 10,
    paddingBottom: 15,
    paddingHorizontal:10,
    height: 130,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  body: {
    //backgroundColor:'grey', 
    alignSelf: 'stretch', flex: 0.8,
  },

  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerLeft1: {
    flexDirection: 'row',
    flex: 1,
  },
  headerIcon: { resizeMode: "contain", height: 20, width: 20, alignSelf: 'flex-start', alignSelf: 'center', },
  headerRgtIcon: { resizeMode: "contain", height: 20, width: 20, alignSelf: 'center', },
  headerParent: { flex: 1, flexDirection: "row", paddingLeft: 10, paddingRight: 10, height: 50, justifyContent: 'center' },
  headerBody: {
    flex: 0.8,
  },
  headerLeft2: {
    flexDirection: 'row',
    flex: 0.8,
  },
  headerRight: {
    paddingLeft: 10,
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherHeader: {
    paddingTop: Platform.OS == 'ios' ? 25 : 10,
    backgroundColor: '#008be0',
    justifyContent: 'center'
  },

  textBody: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold'
  },
  textBody1: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: Platform.OS == 'ios' ? 3 : 0
  },

  headerIcon: { flex: 0.08, justifyContent: 'center' },
  headerText: { flex: 0.92, justifyContent: 'center', },
  headerText1: { flex: 0.92, justifyContent: 'center', paddingLeft: 10 },

  removeLeft: { width: '100%', marginLeft: 0, paddingLeft: 10, paddingRight: 10, marginRight: 0 },
  removewithoutpad: { width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 },
  itemdivider: { width: '100%', marginLeft: 0, paddingLeft: 10, paddingRight: 10, marginRight: 0, color: 'grey' },

  sectionhead: {
    fontSize: 18,
    color: '#008be0',
    fontWeight: 'bold'
  },
  sectioncont: {
    fontSize: 18,
    color: '#767676',
    paddingTop: 5,
    paddingBottom: 5
  },
  sectionsubcont: {
    fontSize: 16,
    color: '#a7a7a7',
  },

  itemFormLabel: {
    color: "#b2b2b2",
    fontSize: 13
  },
  pcd_itemFormLabel: {
    color: "#818181",
    fontSize: 15,
    textAlign: 'center'
  },
  itemForm: {
    marginTop: 42,
  },
  sectionsubcont1: {
    fontSize: 16,
    color: '#008be0'
  },
  textLogin: {
    fontSize: 18
  },
  contentForm: {
    marginTop: 20
  },
  buttonLogin: {
    marginTop: 50,
    paddingTop: 25,
    paddingBottom: 30,
    backgroundColor: "#008be0",
    fontWeight: 'normal'
  },
  bottomButtonSubmit: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "#008be0",
    fontWeight: 'normal'
  },
  buttonLogin1: {
    backgroundColor: "#008be0",
    fontWeight: 'normal',
    bottom: 0,
    position : 'absolute',
    justifyContent: 'flex-end',
    
    marginBottom: 0,
    zIndex: 10
  },
  savebutton: {
    width: '100%', 
    backgroundColor: "#008be0",
    fontWeight: 'normal',
    bottom: 0,
    position : 'absolute',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 0,
    zIndex: 10
  },
  buttonLoginfade: {
    backgroundColor: "#008be08c",
    fontWeight: 'normal',
    bottom: 0,
    marginBottom: 0
  },
  pcd_buttonLogin1: {
    backgroundColor: "#19c670",
    fontWeight: 'normal',
    color: '#fff',
    bottom: 0,

    marginBottom: 0
  },
  pcd_buttonLoginfade: {
    backgroundColor: "#bfbfbf",
    fontWeight: 'normal',
    bottom: 0,
    color: '#fff',
    marginBottom: 0
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#eee"
    //marginLeft: 10,
    //marginRight: 10
  },

  moreInfo: { flexDirection: 'column', marginTop: 20, paddingLeft: 20, paddingRight: 10, flex: 1 },
  panel: { width: '100%', backgroundColor: '#4e88e2', top: 0, paddingTop: 10, paddingBottom: 10, flexDirection: 'row' },
  BottomPanel: { borderWidth: 0, elevation: 0, flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignText: 'center', alignSelf: 'flex-start' },
  BottomPanelText: { fontSize: 14, color: '#fff' },
  BottomPanelImage: { resizeMode: "contain", width: 20 },
  listItemStyle: { width: '100%', marginLeft: 0, paddingLeft: 20, paddingRight: 10, marginRight: 0, borderColor: '#f0f0f0', borderBottomWidth: 1 },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 17,
    color: "#007AFF"
  },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: 100,
  },
  assessmentIcons: { resizeMode: 'contain', width: 20, bottom: 2, alignSelf: 'center' },
  assessmentText: { color: "#008be0", paddingLeft: 3, fontSize: 15 },
  assessmentPills: { backgroundColor: '#fff', borderRadius: 25, paddingTop: 3, paddingBottom: 3, paddingLeft: 20, paddingRight: 20 },
  assessmentContain: {},

  modal: {
    elevation: 3,
    borderColor: '#eee',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    //height: 230,
    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: '100%'
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "black"
  },
  listItem: { paddingTop: 15, paddingBottom: 15, borderBottomColor: '#eee', borderBottomWidth: 0.5, flexDirection: 'row', paddingLeft: 15 },

  // Add  clinic and hospital details
  ClinicMainContainer: {
    flex: 1,
    flexDirection: "column",
    height: '100%'

  },
  ClinicWapperContainer: {
    flex: 1,
    borderBottomWidth: .8,
    borderBottomColor: '#dcdcdc',
    marginBottom: 10
  },
  ClinicInnerContainer: {
    flex: 1,
    paddingBottom: 15,
    padding: 15
  },
  ClinicNameHeader: {
    paddingBottom: 20,
    fontSize: 22,
    color: '#212121',
    fontWeight: '600'
  },
  ClinicFirstRow: {
    flexDirection: "row",
    paddingRight: 0
  },
  ClinicPdTop20: {
    paddingTop: 20
  },
  ClinicLeftImage: {
    width: 16,
    resizeMode: 'contain'
  },
  ClinicLeftImage: {
    width: 16,
    resizeMode: 'contain'
  },
  ClinicTextWapper: {
    flex: 1,
  },
  ClinicText: {
    color: '#383838',
    paddingLeft: 10,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: .5,
    fontWeight: '300'
  },
  clinicPdTop5:
  {
    paddingTop: 5
  },
  ClinicTextMobile: {
    color: '#008bdf',
    paddingLeft: 10,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: .5,
    fontWeight: '300'
  },
  ClinicEditText: {
    color: '#008bdf',
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: .5,
    paddingRight: 30
  },
  ClinicDeleteText: {
    color: '#7f7f7f',
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: .5
  },
  ClinicButtonStick: {
    backgroundColor: "#008be0",
    fontWeight: 'normal',
    bottom: 0,
    marginBottom: 0,
    height: 50
  },
  ClinicButtonStickText: {
    color: '#fff',
    fontSize: 20
  },
  ClinicFqbButton: {
    backgroundColor: '#008be0',
    bottom: 40,
    right: 10
  },

  //Investigationm Screen
  unCheckedBtn: { marginTop: 15, alignSelf: 'center', borderColor: "#008be0", borderWidth: 1, backgroundColor: 'white' },
  checkedBtn: { marginTop: 15, alignSelf: 'center', backgroundColor: "#008be0" },
  unCheckedBtn1: { marginTop: 10, borderColor: "#008be0", borderWidth: 1, backgroundColor: 'white' },
  checkedBtn1: { marginTop: 10, backgroundColor: "#008be0" },
  pphr: { borderBottomColor: 'transparent', flex: 1, justifyContent: "center" },
  bottom: {
    flex: 1,
    position : 'absolute',
    justifyContent: 'flex-end',
    marginBottom: 36
  }
};

