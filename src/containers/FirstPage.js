// Home screen
import React from 'react';
import { Text, ScrollView, View, Image, StyleSheet } from 'react-native';
import { dropdownbutton } from '../constants/image_assets'
import Modal from 'react-native-modalbox';
import Picker from '../components/IntraOcular_Pressure_Component'
import { updateTabExample, getPatientList } from "../actions/TabExmaple_Action";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class FirstPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "Undilated": {
        "Technique": ""
      }

    };
  }

  handleClick = () => {
    if (this.state.color === 'green') {
      this.setState({ myColor: 'blue' });
    } else {
      this.setState({ myColor: 'green' });
    }
  }

  onPress(item, pname, name) {
    // if (label == 'Undilated') {
    //   var temp = this.state.Undilated;
    //   if (textbox == 'Technique') {
    //     temp.Undilated = item
    //     this.setState({ Undilated: temp })
    //   }
    // }
    const { updateTabExample } = this.props;
    if (name == "Dilated") {
      if (pname == "Technique") {
        updateTabExample(item, pname, name)
      } else if (pname == "Time") {
        updateTabExample(item, pname, name)
      } else if (pname == "Iop") {
        updateTabExample(item, pname, name)
      }
    }
    else if (name == "Undilated") {
      if (pname == "Technique") {
        updateTabExample(item, pname, name)
      } else if (pname == "Time") {

        updateTabExample(item, pname, name)
      } else if (pname == "Iop") {
        updateTabExample(item, pname, name)
      }
    }
  }

  getPatient(docid) {
    return new Promise((resolve, reject) => {
      this.props.getPatientList(docid).then(data => {
        resolve(data)
      });
    })

  }

  render() {
    var names = ['Undilated', 'Dilated']
    var DATA = [
      {
        id: '1',
        num: '1'
      },
      {
        id: '2',
        num: '2'
      },
      {
        id: '3',
        num: '3'
      },
    ]
    const self = this;
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {
            // names.map(name => <Picker name={name} DATA={DATA} onPressButn={(item,id) => this.onPress(item, id, name)} />)
            names.map(name =>
              <Picker {...self.props}
                patientdata={(docid) => this.getPatient(docid)}
                name={name}
                DATA={DATA}
                onPress={(item, pname) => this.onPress(item, pname, name)} />
            )
          }
        </View>
      </ScrollView>
    );
  }
}

// FirstPage.propTypes = {
//   auth: PropTypes.object,
//   tab: PropTypes.object
// };

const mapStateToProps = state => ({
  auth: state.auth,
  tab: state.tab
});

const mapDispatchToProps = dispatch => ({
  getPatientList: (doctorid) => dispatch(getPatientList(doctorid)),
  updateTabExample: (item, pname, name) => dispatch(updateTabExample(item, pname, name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstPage);

