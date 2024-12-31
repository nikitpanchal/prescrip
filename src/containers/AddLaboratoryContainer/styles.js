import { Platform } from 'react-native';

export default {
  itemForm: {
    //left:-15
    marginTop: 20
  },
  inputText: {
    fontSize: 17,
    color: "#404040",
    margin: 0,
    padding: 0,
    height: 40,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1
  },
  terms: {
    fontSize: 14,
    color: "#b2b2b2",
  },
  itemFormLabel: {
    color: "#b2b2b2",
    fontSize: 13,

  },
  itemFormLabelcust: {
    color: "#b2b2b2",
    fontSize: 13,

  },
  itemFormLabel1: {
    color: "#888888",
    fontSize: 13
  },

  radioGrand: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10, },
  radioParent: { flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10 },
  radiobtn: { width: '100%', resizeMode: 'contain' },
  genderText: {
    color: '#545454', fontSize: 16
  },
  radiobtnContainer: { alignSelf: 'flex-start', width: 16 },
  blue: {
    color: "#008be0",
    fontSize: 14,
  },
  bottomButtonSubmit: {
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    backgroundColor: "#008be0",
    fontWeight: 'normal'
  },
  wrapper: { backgroundColor: '#eee' },
  upperInfo: { backgroundColor: 'white', paddingBottom: 20, paddingLeft: 20, paddingRight: 20, },
  moreInfo: { backgroundColor: 'white', flexDirection: 'column', marginTop: 10, paddingLeft: 20, paddingRight: 20, paddingBottom: 20, },
  itemSelect: { width: 100, alignSelf: 'center', borderBottomWidth: 0, textAlign: "center" },
  itemMobileinner: { flexDirection: 'row', borderBottomColor: '#eee', borderBottomWidth: 1 },
  itemMobileinner1: { flex: 0.3 },
  itemMobileinner2: { flex: 0.38, paddingTop: Platform.OS != 'ios' ? 10 : 25, paddingBottom: 0, },
  pickerTextbox: { flex: 0.62, left: -15, paddingBottom: 25, paddingRight: 10, alignItems: 'flex-start', },
  custPicker: { fontSize: 26, width: Platform.OS != 'ios' ? 90 : 45, color: 'black', left: Platform.OS != 'ios' ? 10 : -35, alignSelf: 'flex-end' },
};
