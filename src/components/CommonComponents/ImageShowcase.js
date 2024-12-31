import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import PdfReader from '../../components/CommonComponents/PdfReader'

export default class IamgeShowcase extends React.Component {
    _renderTitleIndicator() {
        return <PagerTitleIndicator titles={['one', 'two', 'three']} />;
    }
 
    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }
    render() {
        const { uri } = this.props;
        let type = uri.indexOf('pdf') != -1 ? 'pdf' : 'images'
        return (
            <View style={styles.container}>
                {type == 'pdf' ? <PdfReader uri={uri} /> :
                    <IndicatorViewPager
                        style={{ height: 200 }}
                        indicator={this._renderDotIndicator()}
                    >
                        <View style={{ backgroundColor: 'cadetblue' }}>
                            <Text>page one</Text>
                        </View>
                        <View style={{ backgroundColor: 'cornflowerblue' }}>
                            <Text>page two</Text>
                        </View>
                        <View style={{ backgroundColor: '#1AA094' }}>
                            <Text>page three</Text>
                        </View>
                    </IndicatorViewPager>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },


});
