/****** code by Sourabh ******/

import React, { Component } from "react";
import { Container, Text, Icon, Button, } from "native-base";
import { StatusBar, View, TouchableOpacity, SafeAreaView, Image, ImageBackground, TextInput, ScrollView, Platform } from "react-native";
import styles from './styles';
import Images from '../../Theme/Images'
import { wrap } from "lodash";



import { connect } from 'react-redux'

import { delete_icon, Tooltip_Edit_Icon, ic_Add_Clinic_Button, Template_Setting, Show_all, Patient_Search } from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';


//Type Details
//1.Image,Title,Description
//2.Title Description
//3.Hide title description
//4.title,description,extra data (Congrats screen)
//5.progress bar ,title ,description
let timer = null;

class PrescriptionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBox: false,
      phonenumber: '',
      search: "",
      text: '',
      showTooltip :false,
    }
    this._checkboxsms = 0;
    this.searchWaiting=null;

  }

  componentDidMount() {
  
    timer = setTimeout(() => {
        this.setState({
            showTooltip: true
        })
    }, 200);
}


componentWillUnmount() {
  clearTimeout(timer);
}

  changeData(text) {
   // this.setState({ text });
  
  }

  rightImageOnClick() {
    if (this.props.rightImageOnClick) {
    this.setState({ text: '' });
    if(this.props.container!="followup")
    this.props.rightImageOnClick();
    }
  }

  render() {
    const { search } = this.state;
    return (
      <View style={{ justifyContent: 'center', flexdirection: 'row', }}>
        <ImageBackground style={{ width: '100%', backgroundColor: this.props.bgColor, borderBottomColor: '#dddddd', borderBottomWidth: 1 }} source={this.props.bgImage}>
          <View style={{
            flexDirection: 'column',
            top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
            marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
          }} >
            <SafeAreaView >
              <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 0.85 }}>
                    <TouchableOpacity
                      onPress={() => { this.props.callFrom && this.props.callFrom == "search"?  this.props.leftImageOnClick() :this.props.isSearchBoxShowing ? this.rightImageOnClick() : this.props.leftImageOnClick() }}
                      style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>


                      <Image style={{
                        resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 25, height: 22
                      }} source={this.props.leftImage} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', flex: 1, backgroundColor: 'blue' }}
                      //    onPress={() => { this.props.leftImageOnClick() }}
                      style={{ paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 10 : 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                      <Text style={{ fontFamily: 'NotoSans', color: this.props.titleColor, fontSize: this.props.titleSize ? this.props.titleSize : 12, alignSelf: 'flex-start' }}>{this.props.title}</Text>
                     {
                       this.props.description ?
                        this.props.isSearchBoxShowing ?
                          <TextInput
                            defaultValue={this.props.isSearchBoxShowing ? "" : this.state.text}
                            selectionColor={this.props.cursorColor}
                            placeholder={this.props.description}
                            autoCorrect={false}
                            placeholderTextColor={this.props.descriptionColor}
                            style={{

                              padding: 0,
                              width: 300,
                              fontFamily: 'NotoSans',
                              alignItems: 'flex-start',
                              color: this.props.placeTextColor ? this.props.placeholderTextColor : 'white',
                              borderColor: 'white',
                              fontSize: this.props.placeholderTextSize ? this.props.placeholderTextSize : 16,
                              borderWidth: null,
                              //  borderBottomColor: '#cccccc',
                              borderBottomWidth: 1,
                              includeFontPadding: false,
                            }}
                            maxLength={60}
                            autoFocus={this.props.isSearchBoxShowing ? true : false}
                         
                            onChangeText={(text) => {

                                this.setState({ text });
                                this.props.searchAction(text,"doNotHit");
                                if(this.searchWaiting)
                                {
                                   
                                    clearTimeout(this.searchWaiting);
                                }
                                
                            
                            this.searchWaiting = setTimeout(() => {
                                this.searchWaiting = null;
                              
                                this.props.searchAction(text,"hitAPI");
                               //this.changeData(text)
                            }, 1500);
                              }} 
                           
                        //    onChangeText={(text) => this.changeData(text)}
                            //placeholder={"type here..."}
                            //  placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : '#f2f2f2'}
                            //defaultValue={text}
                            //defaultValue={text}

                            value={this.state.text}
                          /> : <Text
                            onPress={() => { this.rightImageOnClick() }}
                            style={{ fontFamily: 'NotoSans', color: this.props.descriptionColor, fontSize: this.props.descriptionSize ? this.props.descriptionSize : 20, alignSelf: 'flex-start' }}>{this.props.description}</Text>

                            :null
                      }
                    </TouchableOpacity>
                  </View>


                  {
                   false?
                      <TouchableOpacity
                        onPress={() => { this.rightImageOnClick() }}
                        style={{      
                          marginBottom: 20, marginRight :20, flex: 0.1, flexDirection: 'column',
                          justifyContent: 'flex-end', alignItems: 'center',
                        }}>  
                        <Tooltip
                          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                          animated={true}
                          isVisible={true}
                          backgroundColor={"rgba(0,0,0,0.5)"}
                          contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}

                          content={<TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                            onPress={() => { this.props.setTooltipStatus({ ["patientScreenSearch"]: false }) }}>
                            <AddPatient
                              imagePath={Patient_Search}
                              title={"Easy Patient Search"}
                              description={"Search for the patient by their name or contact number"}
                            />
                          </TouchableOpacity>}
                          //(Must) This is the view displayed in the tooltip
                          placement="bottom"
                          //(Must) top, bottom, left, right, auto.
                          onClose={() => { this.props.setTooltipStatus({ ["patientScreenSearch"]: false }) }}
                        //(Optional) Callback fired when the user taps the tooltip
                        >




                          <Image style={{
                            tintColor: this.props.descriptionColor ? this.props.descriptionColor : null,

                            resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 17, height: 17
                          }} source={this.props.isSearchBoxShowing ? this.props.rightImageCross : this.props.rightImage} />


                        </Tooltip>

                      </TouchableOpacity>

                      :
                      <TouchableOpacity
                        onPress={() => { this.rightImageOnClick() }}
                        style={{
                          marginBottom: this.props.description ? 27:null,flex: 0.1, flexDirection: 'column',
                          justifyContent: this.props.description ? 'flex-end':'center', alignItems: 'center',
                        }}>

                        <Image style={{
                          tintColor: this.props.descriptionColor ? this.props.descriptionColor : null,

                          resizeMode: "contain", alignSelf: 'center', justifyContent: 'flex-end', width: 17, height: 17
                        }} source={this.props.isSearchBoxShowing ? this.props.rightImageCross : this.props.rightImage} />

                      </TouchableOpacity>
                  }
                </View>
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = state => ({

  patientScreenSearch: state.tooltip.toolTipStatus.patientScreenSearch,


});

const mapDispatchToProps = dispatch => ({

  setTooltipStatus: (data) => dispatch(setTooltipStatus(data)),

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrescriptionHeader)













