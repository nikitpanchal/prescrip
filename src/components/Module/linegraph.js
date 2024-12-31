import React, { Component } from "react";
import { View } from "react-native"
import { LineChart, AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Circle, Path, LinearGradient, Defs, Stop, G, Rect, Text, Svg } from 'react-native-svg';
import { month } from "../../commonmethods/validation";
export default class linegraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }}

    render() {
        let { graphgArray,type } = this.props

        const verticalData = [0, 10, 20, 30, 40, 50, 60, 70, 80];


     const actualDataInGraph =[];// [20, 22, 45, 50, 55];
     const bottomBarNames =[];// [20, 22, 45, 50, 55];

    graphgArray.map(i => {
        actualDataInGraph.push(i[0].DataType)
        bottomBarNames.push(month[parseInt(i[0].date.substring(
            3, 
            5))])
      })  
  
    

        // const CUT_OFF = 0
     //   const bottomBarNames = ["Feb", "Feb", "Feb", "Feb", "Jun"];
        const contentInset = { top: 20, bottom: 20, left: 10, right: 10 }
        const BottomLabel = bottomBarNames.map((value) => { return value });
        


        const Gradient = ({ index }) => (
            <Defs key={index}>
                <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset={'0%'} stopColor={'rgb(232, 214, 237)'} stopOpacity={0.5} />
                    <Stop offset={'100%'} stopColor={'rgb(159, 80, 182)'} stopOpacity={0.9} />
                </LinearGradient>
            </Defs>
        )
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    key={type + index.toString()}
                    cx={x(index)}
                    cy={y(value)}
                    r={3}
                    stroke={'rgb(134, 65, 244)'}
                    fill={'#9e50b6'}
                />
            ))
        }
 
        const CUT_OFF = 20
        const Labels = ({ x, y, data, width, height }) => (
            data.map((value, index) => (
                <Svg key={type + index.toString()}>
                    <Rect x={x(index) - 10} y={y(value) - 28} width="20" height="20" fill="white" />
                    <Text
                        key={index}

                        fill={'#9e50b6'} //{'rgb(213, 170, 224)'}
                        color="red"
                        stroke={'#9e50b6'}
                        strokeWidth={0.1}
                        fontSize={10}
                        // fontWeight="bold"
                        x={x(index)}
                        y={y(value) - 14}
                        alignmentBaseline={'middle'}
                        //dy={20}
                        textAnchor="middle"


                    >
                        {value}
                    </Text>
                </Svg>
            ))
        )

        return (
            <View style={{ flexDirection: 'row', marginLeft: 0, marginRight: 0, marginVertical: 0, flex: 1 }}>
                <YAxis
                    data={verticalData}
                    style={{ height: 400 }}
                    contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
                    yMax={80}
                    yMin={0}
                    svg={{ fill: '#cdcdcd', fontSize: 10, }}
                    numberOfTicks={10}
                    formatLabel={(value) => value}
                    // formatLabel={(value) => `${value}` + prefxType}
                />

                <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
                    <LineChart
                        style={{ height: 400 }}
                        data={actualDataInGraph}
                        yMax={80}
                        yMin={0}
                        Labels={true}
                        numberOfTicks={10}
                        svg={{ stroke: 'rgb(157, 68, 181)', fill: 'url(#gradient)', strokeWidth: 2 }}
                        contentInset={contentInset}
                    >
                        <Grid svg={{ stroke: 'rgb(245, 245, 245)' }} />
                        <Decorator />
                        <Gradient />
                        <Labels />
                    </LineChart>  

                    <XAxis
                        style={{ alignContent: 'center', justifyContent: 'center', width: "100%" }}
                        data={actualDataInGraph}
                        formatLabel={(value, index) => BottomLabel[value]}
                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 10, fill: '#cdcdcd' }}
                    />
                </View>
            </View>
        );
    }
}