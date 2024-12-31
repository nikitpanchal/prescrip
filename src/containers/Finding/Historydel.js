import React from 'react'
import { LineChart, AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, G, Line, Defs, Rect, LinearGradient, Stop, Text } from 'react-native-svg'
import { View } from 'react-native';

class History extends React.PureComponent {

    render() {

        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        /**
         * Both below functions should preferably be their own React Components
         */

        const HorizontalLine = (({ y }) => (
            <Line
                key={'zero-axis'}
                x1={'0%'}
                x2={'100%'}
                y1={y(50)}
                y2={y(50)}
                stroke={'grey'}
                strokeDasharray={[4, 8]}
                strokeWidth={2}
            />
        ))

        const Tooltip = ({ x, y }) => (
            <G
                x={x(5) - (75 / 2)}
                key={'tooltip'}
                onPress={() => console.log('tooltip clicked')}
            >
                <G y={50}>
                    <Rect
                        height={40}
                        width={75}
                        stroke={'grey'}
                        fill={'white'}
                        ry={10}
                        rx={10}
                    />
                    <Text
                        x={75 / 2}
                        dy={20}
                        alignmentBaseline={'middle'}
                        textAnchor={'middle'}
                        stroke={'rgb(134, 65, 244)'}
                    >
                        {`${data[5]}ºC`}
                    </Text>
                </G>
                <G x={75 / 2}>
                    <Line
                        y1={50 + 40}
                        y2={y(data[5])}
                        stroke={'grey'}
                        strokeWidth={2}
                    />
                    <Circle
                        cy={y(data[5])}
                        r={6}
                        stroke={'rgb(134, 65, 244)'}
                        strokeWidth={2}
                        fill={'white'}
                    />
                </G>
            </G>
        )

        const data2 = [0, 10, 20, 30, 40, 50, 60, 70, 80];
        const contentInset = { top: 20, bottom: 20, left: 10, right: 10 }
        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    key={index}
                    cx={x(index)}
                    cy={y(value)}
                    r={3}
                    stroke={'rgb(134, 65, 244)'}
                    fill={'#9e50b6'}
                />
            ))
        }

        const Gradient = ({ index }) => (
            <Defs key={index}>
                <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset={'0%'} stopColor={'rgb(232, 214, 237)'} stopOpacity={0.5} />
                    <Stop offset={'100%'} stopColor={'rgb(159, 80, 182)'} stopOpacity={0.9} />
                </LinearGradient>
            </Defs>
        )
        const data1 = ["Feb", "Mar", "Apr", "May", "Jun"];
        const BottomLabel = data1.map((value) => { return value });

        return (
            <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginVertical: 40, flex: 1 }}>
                <Text style={{ position: 'absolute', width: 200, top: -20, textAlign: 'left', color: "#aeaeae" }}>Last 5 Visit</Text>
                <YAxis
                    data={data2}
                    style={{ height: 400 }}
                    contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
                    yMax={80}
                    yMin={0}
                    svg={{
                        fill: '#cdcdcd',
                        fontSize: 10,
                    }}
                    numberOfTicks={10}
                    formatLabel={(value) => value}
                // formatLabel={(value) => `${value}` + prefxType}
                />

                <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>

                    <LineChart
                        style={{ height: 400 }}
                        data={data}
                        yMax={80}
                        yMin={0}
                        numberOfTicks={10}
                        svg={{ stroke: 'rgb(157, 68, 181)', fill: 'url(#gradient)', strokeWidth: 2 }}
                        contentInset={contentInset}
                    >
                        <Grid
                            svg={{ stroke: 'rgb(245, 245, 245)' }}
                        />
                        <Decorator />
                        <Gradient />
                        <Tooltip />
                    </LineChart>
                    <XAxis
                        style={{ alignContent: 'center', justifyContent: 'center', width: "100%" }}
                        data={data}
                        formatLabel={(value, index) => BottomLabel[value]}

                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 10, fill: '#cdcdcd' }}
                    />
                </View>
            </View>
        )
    }

}

export default History