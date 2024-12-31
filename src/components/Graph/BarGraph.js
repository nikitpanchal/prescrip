import React,{Component} from 'react';
import {View,Text,ScrollView} from 'react-native';
import { Grid, LineChart, AreaChart,XAxis, YAxis,BarChart } from 'react-native-svg-charts'
import Svg,{ Circle, G,Path, Text as SVGText, Rect,Defs, LinearGradient, Stop } from 'react-native-svg'

const data = [ 50, 10, 40, 95,50];
const lables=["01-05","15-12","01-01","05-02","25-10"];

const axesSvg = { fontSize: 10, fill: '#000000' };
const verticalContentInset = { top: 40, bottom: 10,left :30,right : 20 }
const xAxisHeight = 20
const ConToolTip = ({ x, y, data }) => {
    return data.map((value, index) => (
       
        <Rect
        key={ index }
        x={ x(index)-10 }
        y={ y(value)-20}
        width ={25}
        height={15}
        stroke={ '#0064d7' }
        fill={'#ffffff'}>
       
        </Rect>
    ))
}

const ToolTip = ({ x, y, data }) => {
    return data.map((value, index) => (
       
       
        <SVGText
          stroke="#0064d7"
          fontSize="10"
          x={x(index)-10 / 2+8}
          y={y(value)-20 / 2}
          textAnchor="middle"
        >
        {data[index]}
        </SVGText>
       
    ))
}

const Decorator = ({ x, y, data }) => {
    return data.map((value, index) => (
       
        <Circle
            key={ index }
            cx={ x(index) }
            cy={ y(value) }
            r={ 2.5 }
            stroke={ '#0064d7' }
            fill={ '#0064d7' }
        />
        
    ))
}

const Line = ({ line }) => (
    <Path
        d={ line }
        stroke={ '#0064d7' }
        fill={ 'none' }
    />
)
const Gradient = ({ index }) => (
    <Defs key={index}>
        <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
            <Stop offset={'10%'} stopColor="#0064d7" stopOpacity={1}/>                    
            <Stop offset={'75%'} stopColor="#ffffff" stopOpacity={0}/>
        </LinearGradient>
    </Defs>
)

export default class LineGraph extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <View style={{flex : 0.45, padding : 10,flexDirection: 'row',justifyContent : 'center'}}>
            <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            contentInset={verticalContentInset}
            svg={axesSvg}
        />
        <View style={{ flex: 1}}>
                    <BarChart
                        style={{ flex: 1 }}
                        data={data}
                        
                        svg={{
                    fill : 'url(#gradient)' }}
                    >
                       
                       <Grid></Grid>
                       <Line/>
                
                
                <Gradient></Gradient>
                    </BarChart>
                    
                    <XAxis
                        style={{ height: xAxisHeight }}
                        data={lables}
                        formatLabel={(value, index) => lables[index]}
                        svg={axesSvg}
                    />
                </View>
            </View>
        )
    }
}