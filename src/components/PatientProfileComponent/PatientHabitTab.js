/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import PatientEmptyComponent from '../EmptyPatientComponents/PatientEmptyComponent'
import { SetPatientHabits } from '../../actions/patientProfie'
import { connect } from 'react-redux'

class PatientHabitTab extends Component {

  constructor(props) {
    super(props);
    this.setState({
      habits: [],
    })
    this.habits = [];
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      //this.list.refreshList();
      this.habits = [];
      let key = "id";
      this.habits = this.props.patientProfile.habits.map((item, index) => {
        item[key] = index + 1;
        return item;
      })
      this.setState({
        refresh: true
      })
    })
  }

  //
  render() {
    return (
      <PatientEmptyComponent {...this.props}
        onRef={(ref) => (this.list = ref)}
        patientData={this.habits}//this.props.patientProfile.habits}
        title={"you have not added any patient's habit."}
        hiddenTitle={"Add more patient habits"}
        btnText={"ADD HABIT"}
        type={"Habit"}
        btnClick={() => this.props.navigation.navigate('FlatlistSearchContainer')}

      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  patientProfile: state.patientProfile
});

const mapDispatchToProps = dispatch => ({
  SetPatientHabits: (habits) => dispatch(SetPatientHabits(habits)),

});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientHabitTab);