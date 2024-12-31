/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PatientEmptyComponent from '../EmptyPatientComponents/PatientEmptyComponent'


export default class PatientHistoryTab extends Component {
    constructor(props) {
        super(props);
        this.history = [];
        this.swipeLisy = React.createRef();
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            //this.list.refreshList();
            this.history = [];
            let key = "id";
            this.history = this.props.patientProfile.history.map((item, index) => {
                item[key] = index + 1;
                return item;
            })
            this.setState({
                refresh: true
            })
        })
    }

    render() {
        return (
            <PatientEmptyComponent {...this.props}
                onRef={(ref) => (this.list = ref)}
                patientData={this.history}//this.props.patientProfile.history}
                title={"you have not added any " + "\n" + " patient's disease history"}
                hiddenTitle={"Add more patient disease history"}
                btnText={"ADD DISEASE HISTORY"}
                type={"History"}
                btnClick={() => this.props.navigation.navigate('FlatlistSearchHistoryContainer')}
            />
        )
    }
}