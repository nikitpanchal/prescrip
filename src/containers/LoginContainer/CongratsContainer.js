import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
 
import Congrats from "../../components/Login/Congrats";
import Images from "../../Theme/Images";

class CongratsContainer extends Component {
  constructor(props) {
    super(props);

    
    this.state = {
      congrats_array: [
        { image: Images.ic_Video_Consultation_Icon, title: "VIDEO CONSULTING" },
        { image: Images.e_prescription, title: "E-PRESCRIPTIONS" },
        { image: Images.ic_popup_My_Appts_Icon, title: "SMART APPOINTMENTS" },
        { image: Images.online_profile, title: "ONLINE PROFILE" },
      ],
    };
  }
  render() {
    return (
      <Congrats {...this.props} congrats_array={this.state.congrats_array} />
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile,
});
const mapDispatchToProps = (dispatch) => ({
  setVideoConsultationRegister: (vcRegister) =>
    dispatch(setVideoConsultationRegister(vcRegister)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CongratsContainer);
