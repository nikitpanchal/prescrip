import { keys } from 'lodash'
import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, TextInput, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { tabDataStore } from '../../actions/previewSettings'
import { ic_edit_label, ic_label_hidden, ic_label_unhidden, drop_down, ic_save_button } from '../../constants/images'
import Images from '../../Theme/Images'

class LabelTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      changeLabeltext: '',
      labelState: false,
      labelIndex: -1,
      displayIndex: -1,
      tabData:
        this.props.previewReducer.labelData.length > 0 ? this.props.previewReducer.labelData : [{
          "ChiefComplaints": "Chief Complaints",
          "History": "Patient History / Family History",
          "Findings": "Findings",
          "Investigation": "Investigation",
          "LabTest": "Recommended Cinical Tests",
          "Diagnosis": "Diagnosis",
          "Notes": "Notes",
          "Prescription": "Rx",
          "DisplayGenericName": "Display Generic Name",
          "Advice": "Advice",
          "Followup": "Follow Up",
          "DoctorDetails": "Doctor Details",
          "DigitalImageSignature": "Digital Image Signature",
        }],

      forSeq: {
        "ChiefComplaints": "Chief Complaints",
        "History": "Patient History / Family History",
        "Findings": "Findings",
        "Investigation": "Investigation",
        "LabTest": "Recommended Cinical Tests",
        "Diagnosis": "Diagnosis",
        "Notes": "Notes",
        "Prescription": "Rx",
        "DisplayGenericName": "Display Generic Name",
        "Advice": "Advice",
        "Followup": "Follow Up",
        "DoctorDetails": "Doctor Details",
        "DigitalImageSignature": "Digital Image Signature",
      },


      hideView: false,
      editChange: false
    }
    this.labelHide = []

    this.DisplayPreferences = this.props.previewReducer.templateData != null ?
      this.props.previewReducer.templateData.DisplayPreferences :
      ["Chief Complaints",
        "Patient History / Family History",
        "On Examination / Findings",
        "Investigations",
        "Recommend Clinical Tests",
        "Diagnosis",
        "Notes",
        "Prescription",
        "Display Generic Name",
        "Advice",
        "Follow up",
        "Doctor Details",
        "Digital Image Signature"]
    this.defaultDisplayPreferences = ["Chief Complaints",
      "Patient History / Family History",
      "On Examination / Findings",
      "Investigations",
      "Recommend Clinical Tests",
      "Diagnosis",
      "Notes",
      "Prescription",
      "Display Generic Name",
      "Advice",
      "Follow up",
      "Doctor Details",
      "Digital Image Signature"]
  }

  stateHideView() {
    this.setState({ hideView: !this.state.hideView })
  }
  editView() {
    this.setState({ editChange: !this.state.editChange })
  }

  labelTextChange(key, val) {

    var templateDataDemo = this.state.tabData;

    templateDataDemo[key] = val;

  // alert(JSON.stringify(templateDataDemo))   
    this.setState({
      tabData :templateDataDemo
    })



   // this.state.tabData[key] = val
  }

  labelEdit(index, a, keys) {


   // alert(index +" " +a +" "+ keys)   
    if (this.state.labelState && this.state.labelIndex == index) {
      //this.state.tabData[keys] = a

      

      this.props.onDataChanges("DisplayLabel", (this.state.tabData[keys] ? this.state.tabData[keys] : a), keys)

    }

    this.setState({ labelIndex: index, labelState: !this.state.labelState })

  }


  onViewHide(i, a) {

    let index = this.DisplayPreferences.indexOf(this.defaultDisplayPreferences[i])
    if (index > -1) {
      this.DisplayPreferences.splice(index, 1);
      this.setState({ displayIndex: index })
    }
    else {
      this.setState({ displayIndex: index })
      this.DisplayPreferences.push(this.defaultDisplayPreferences[i])
    }




    this.props.onDataChanges("DisplayPreferences", this.DisplayPreferences)

    //present=false absent = true

  }

  sort(arr) {
    return arr = ["DisplayGenericName",
      "DoctorDetails",
      "DigitalImageSignature",
      "ChiefComplaints",
      "History",
      "Findings",
      "Investigation",
      "LabTest",
      "Notes",
      "Diagnosis",
      "Prescription",
      "Advice",
      "Followup"]
  }
  itemView(idx, a) {
    let keys4 = Object.keys(this.props.state.DisplayLabel)



    return (<View style={styles.case3and4}>

      <TouchableOpacity onPress={() => this.onViewHide(idx, keys4[idx])} style={{ flex: 0.1, marginLeft: 12, justifyContent: 'center', alignItems: 'center' }} >
        {this.DisplayPreferences.includes(this.defaultDisplayPreferences[idx]) ? <Image source={ic_label_unhidden} style={styles.imgStyle} />
          : <Image source={ic_label_hidden} style={styles.imgStyle} />}
      </TouchableOpacity>
      {

        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'flex-start' }}>
          {this.state.labelIndex == idx && this.state.labelState ? <TextInput

            defaultValue={this.props.state.DisplayLabel[a]}
            onChangeText={(txt) => this.labelTextChange(Object.keys(this.state.forSeq)[idx], txt)}
            style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1, fontSize: 16, width: '100%' }} />
            : <Text style={styles.textStyle}>{this.props.state.DisplayLabel[a]}</Text>}
        </View>

      }

      <TouchableOpacity disabled={(a == "DisplayGenericName" || a == "DoctorDetails" || a == "DigitalImageSignature") ? true : false} onPress={() => this.labelEdit(idx, this.props.state.DisplayLabel[a], Object.keys(this.state.forSeq)[idx])} style={styles.rightImg}>
        {a == "DisplayGenericName" || a == "DoctorDetails" || a == "DigitalImageSignature" ? null : <View >
          <Image source={this.state.labelState && this.state.labelIndex == idx ? ic_save_button : ic_edit_label} style={styles.imgStyle} />
        </View>}
      </TouchableOpacity>
    </View>
    )

  }
  render() {
    return (
      <FlatList
        data={Object.keys(this.state.forSeq)}
        renderItem={({ index, item }) => this.itemView(index, item)}
        keyExtractor={item => item.id}
        extraData={this.state}
        keyboardShouldPersistTaps={'handled'}
        ItemSeparatorComponent={this.renderSeparator} />

    )
  }


}



const styles = StyleSheet.create({

  dropdownFont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 50,
    right: 10,
    height: 150,
    width: 120,
    zIndex: 5,
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderRightColor: '#cccccc',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  case1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
    margin: 8,
    // backgroundColor: '#b5e7a0',
    // borderColor: '#cccccc',
    borderWidth: 0.7
  },
  case3and4: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5
  },
  case2: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5,

  },
  labelTxt: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 12
  },
  textStyle: {
    color: '#444444',
    fontSize: 16
  },
  imgStyle: {
    resizeMode: 'contain',
    height: 12
  },
  btnStyle: {
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 20,
    height: 32,
  },
  rightImg: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  viewCase2: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  }
})

const mapStateToProps = state => ({
  auth: state.auth,
  previewReducer: state.previewReducer

});

const mapDispatchToProps = dispatch => ({
  setTemplateType: (templateType) => dispatch(setTemplateType(templateType)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelTab)

