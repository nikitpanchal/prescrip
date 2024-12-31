import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList } from 'react-native'
import Triangle from 'react-native-triangle';

export default class BubbleFlatlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrData: [{
                "title": "hii",
                "desc": "hgjhjhg hgjhghj"
            }, {
                "title": "hii",
                "desc": "hgjhjhg hgjhghj"
            }, {
                "title": "hii",
                "desc": "hgjhjhg hgjhghj"
            }, {
                "title": "hii",
                "desc": "hgjhjhg hgjhghj"
            }]

        }
    }

    itemView(item) {
        return (

            <View style={{ backgroundColor: '#cccccc', margin: 20, padding: 50 }}>
                <Text style={{ color: '#000000' }}>{item.title}</Text>
                <Text tyle={{ color: '#000000' }}>{item.desc}</Text>
                <View style={{ position: 'absolute', left: -8, top: 10 }}>
                    <Triangle
                        width={10}
                        height={20}
                        color={'#cccccc'}
                        direction={'left'}
                    />
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={this.state.arrData}
                    renderItem={({ item }) => this.itemView(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, i) => i.toString()}
                />
            </SafeAreaView>

        )
    }
}