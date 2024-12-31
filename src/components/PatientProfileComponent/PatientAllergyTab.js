/* Developed by Ruban 
  on 8/10/20 */

import React, { Component } from 'react'
import { View, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Button, Text, Content } from 'native-base'
import Capsule from '../../components/Capsule';
import multipleTapHandler from '../../components/MultiTapHandle/index';

export default class PatientAllergyTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allergyTitle: [
                { Environmental: [] },
                { Food: [] },
                { Drugs: [] },
                { Other: [] },
            ],

        }
    }


    componentDidMount() {
        multipleTapHandler.clearNavigator()
    }


    addAllergyType(keys, item) {
        this.props.setAllergyType(keys[0])
        this.props.navigation.navigate('FlatlistSearchAllergyContainer');

    }
    onCapClick() {

    }
    itemView(item, index) {

        return (
            <Capsule
                text={item}
                color={"#0869d8"}
                onClick={() => { return }}
            ></Capsule>
        )

        // <View style={{ flex: 1, borderBottomColor: '#cccccc', borderBottomWidth: 4, padding: 10 }}>
        //     <Text style={{ fontSize: 20, color: '#616161', fontFamily: 'NotoSans' }}>{key[0]}</Text>
        //     <View style={{ flexDirection: 'row',  }}>
        //         {item[key[0]].length > 0 ? <FlatList
        //             data={item[key[0]]}
        //             numColumns={3}
        //             renderItem={({ item, index }) => this.renderSecondaryItem(item, index)}
        //         /> :    <Text style={{ fontSize: 12, color: '#616161',  fontFamily: 'NotoSans' }}>
        //         Patient has any {key} based allergy?</Text> }

        //     </View>
        //     <Text style={{ fontSize: 16, color: '#0869d8', textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold' }}>Add an Allergen</Text>
        // </View>


    }
    componentWillReceiveProps(nextProps) {

        let Drugs = this.props.patientProfile.selectedAllergy[0].Drugs;
        let durgArr = [];
        if (Drugs.length > 0) {
            durgArr = Drugs.split(',')
        }
        let Environmental = this.props.patientProfile.selectedAllergy[0].Environmental;
        let envArr = [];
        if (Environmental.length > 0) {
            envArr = Environmental.split(',')
        }
        let Food = this.props.patientProfile.selectedAllergy[0].Food;
        let foodArr = [];
        if (Food.length > 0) {
            foodArr = Food.split(',')
        }
        let Other = this.props.patientProfile.selectedAllergy[0].Other;
        let otherArr = [];
        if (Other.length > 0) {
            otherArr = Other.split(',')
        }
        let allergyTitle = [
            { Environmental: envArr },
            { Food: foodArr },
            { Drugs: durgArr },
            { Other: otherArr },
        ];
        this.setState({
            allergyTitle: allergyTitle
        });


    }

    render() {

        //
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {this.state.allergyTitle.map(item => {
                    let keys = Object.keys(item);
                    return (

                        <View style={{ borderBottomColor: '#f0f0f0', borderBottomWidth: 4, padding: 15, }}>
                            <View >
                                <Text style={{ fontSize: 20, color: '#8b8b8b', fontFamily: 'NotoSans' }}>{keys[0]}</Text>
                                {item[keys[0]].length > 0 ? <FlatList

                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    data={item[keys[0]]}
                                    keyboardShouldPersistTaps={'handled'}
                                    contentContainerStyle={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: "wrap" }}
                                    renderItem={({ item, index }) => this.itemView(item, index)}
                                    keyExtractor={(item, i) => i.toString()}
                                    onEndThreshold={1}
                                /> :

                                    <Text style={{ fontSize: 12, color: '#616161', fontFamily: 'NotoSans', paddingVertical: 6 }}>
                                        Patient has any {keys} based allergy?</Text>

                                }
                            </View>
                            <TouchableOpacity onPress={() => multipleTapHandler.multitap(() => this.addAllergyType(keys, item), "FlatlistSearchAllergyContainer")} style={{ paddingTop: 6, paddingBottom: 10, flexWrap: 'wrap' }}>
                                <Text style={{ fontSize: 16, color: '#0869d8', textDecorationLine: 'underline', fontFamily: 'NotoSans-Bold' }}>+ Add an Allergen</Text>
                            </TouchableOpacity>
                        </View>



                    )


                })
                }
            </ScrollView>
        )


    }
}
