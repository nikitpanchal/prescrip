import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container } from 'native-base';
import LineGraph from '../../components/Graph/LineGraph';
import BarGraph from '../../components/Graph/BarGraph';
export default class ShowGraph extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LineGraph {...this.props} />
            </View>
        )
    }
}