//**code by ravi */
import React, { Component } from "react"
import { Container, Text } from 'native-base'
import { View, Dimensions, Image, StatusBar, TouchableOpacity } from 'react-native'
import { Black_back, Diagnosis, Finding, Investigations } from '../../constants/images'
import { connect } from "react-redux";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import LinearGradient from 'react-native-linear-gradient'

class AdditionalAssesmentsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectedFidings_value: 'BP-86mmhG, hair color',
            SelectedInvestigatio_value: 'Feno, WBC Counts',
            SelectedDiagonosis_value: '',
        }
    }

    componentDidMount() {
        multipleTapHandler.clearNavigator()

    }

    Navigateback = () => {
        multipleTapHandler.clearNavigator();
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="dark-content" hidden={false} translucent={true} />
                    <View style={{ justifyContent: 'space-between', marginTop: 22, flex: 0.07, flexDirection: 'row', alignContent: 'center', paddingHorizontal: 14, paddingBottom: 12, borderBottomColor: '#dedede', borderBottomWidth: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <TouchableOpacity onPress={this.Navigateback} >
                                <Image source={Black_back} style={{ height: 20, width: 20, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                            <View>
                                <Text uppercase={true} style={{ fontSize: 10, paddingStart: 15, color: '#919191', fontFamily: 'NotoSans' }}>more information</Text>
                                <Text style={{ fontSize: 18, paddingStart: 15, color: '#0b69d8', fontFamily: 'NotoSans' }}>Additional Assesments </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', flex: 1, flexDirection: 'column', paddingTop: 18, paddingStart: 14, paddingRight: 12, backgroundColor: '#fafafa' }}>
                        {/*** Findings***/}
                        <View style={{ alignItems: 'center', flexDirection: 'row', shadowColor: '#333', shadowOffset: { height: 0.5 }, shadowOpacity: 0.6, elevation: 4, shadowRadius: 0, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 11 }}>
                            <TouchableOpacity >
                                <Image source={Finding} style={{ height: 45, width: 45, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontSize: 20, paddingStart: 10, color: '#3f3e3e', fontFamily: 'NotoSans' }}>Findings</Text>
                                {this.state.SelectedFidings_value ?
                                    <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 11, paddingStart: 10, color: '#737373', fontFamily: 'NotoSans-Bold' }}>{this.state.SelectedFidings_value}</Text>
                                    : null}
                            </View>
                        </View>
                        {/*** Investigation***/}
                        <View style={{ alignItems: 'center', flexDirection: 'row', shadowColor: '#333', shadowOffset: { height: 0.5 }, shadowOpacity: 0.6, elevation: 4, shadowRadius: 0, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 11, marginVertical: 14 }}>
                            <TouchableOpacity >
                                <Image source={Investigations} style={{ height: 45, width: 45, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontSize: 20, paddingStart: 10, color: '#3f3e3e', fontFamily: 'NotoSans' }}>Investigations</Text>
                                {this.state.SelectedInvestigatio_value ?

                                    <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 11, paddingStart: 10, color: '#737373', fontFamily: 'NotoSans-Bold' }}>{this.state.SelectedInvestigatio_value}</Text>
                                    : null}
                            </View>
                        </View>
                        {/*** Diagnosis***/}
                        <View style={{ alignItems: 'center', flexDirection: 'row', shadowColor: '#333', shadowOffset: { height: 0.5 }, shadowOpacity: 0.6, elevation: 4, shadowRadius: 0, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 11 }}>
                            <TouchableOpacity >
                                <Image source={Diagnosis} style={{ height: 45, width: 45, resizeMode: 'contain', }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontSize: 20, paddingStart: 10, color: '#3f3e3e', fontFamily: 'NotoSans' }}>Diagnosis</Text>
                                {this.state.SelectedDiagonosis_value ?
                                    <Text style={{ flexWrap: 'wrap', fletextAlign: 'justify', fontSize: 11, paddingStart: 10, color: '#737373', fontFamily: 'NotoSans-Bold' }}>{this.state.SelectedDiagonosis_value}</Text>
                                    : null}
                            </View>
                        </View>

                    </View>
                    <TouchableOpacity style={{ alignItems: 'center', position: 'absolute', width: '100%', marginBottom: 15, paddingHorizontal: 8, bottom: 0 }} onPress={() => this.proceed()}>
                        <LinearGradient
                            colors={["#1b7cdb", "#07cef2"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                            style={{ width: '95%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                            <Text uppercase={true} style={{
                                fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold'
                            }}>next</Text>
                        </LinearGradient>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdditionalAssesmentsContainer);