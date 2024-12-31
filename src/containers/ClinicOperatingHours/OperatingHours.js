import React, {Component} from 'react';
import { Alert,StatusBar,TouchableHighlight, View, TouchableOpacity, Image,Modal, ImageBackground, TextInput, ScrollView } from "react-native";
import { setClinicDetails } from '../../actions/doctorProfile'
import { connect } from 'react-redux';
import {BackHandler} from 'react-native';
import OperatingHours from '../../components/ClnicOperatingHours/OperatingHours'
class OperatingHoursContainer extends Component{
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
         
        }

      }
      componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        }
        componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        }
        handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
        }
        render(){
          return(
<OperatingHours
{...this.props}/>
          )
      }
}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile
  })
  
  const mapDispatchToProps = dispatch => ({
    setClinicDetails: (clinicAddress) => dispatch(setClinicDetails(clinicAddress))
  })
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(OperatingHoursContainer);