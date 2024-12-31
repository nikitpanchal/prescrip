import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from "react-redux";
import DigiConsultationSetup from '../../components/Login/DigiConsultationSetup'
import { setVideoConsultationRegister } from '../../actions/auth'


class DigiConsultationSetupContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }

  }
  render() {

    const nevigateFrom = this.props.route.params.nevigateFrom;

    return (

      <DigiConsultationSetup {...this.props} nevigateFrom={nevigateFrom}
      />

    )
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  doctorProfile: state.doctorProfile

});

const mapDispatchToProps = dispatch => ({
  setVideoConsultationRegister: (vcRegister) => dispatch(setVideoConsultationRegister(vcRegister)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps

)(DigiConsultationSetupContainer);
