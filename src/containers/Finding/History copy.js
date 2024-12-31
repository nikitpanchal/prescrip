import React, { Component } from "react"
import { View,Share, Image, TextInput, ScrollView, Platform, Linking, Keyboard, TouchableOpacity, Clipboard, FlatList, Dimensions } from "react-native"
import { connect } from "react-redux"
import { Container } from "native-base";
import LinearGradient1 from 'react-native-linear-gradient';
import { LineChart1 } from "react-native-chart-kit";
import { LineChart, AreaChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Circle, Path,LinearGradient,Defs,Stop,G ,Rect,Text,Svg} from 'react-native-svg'


const DATA = [
    {
        id: 'IMG_220122020',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'red'
    },
    {
        id: 'IMG_220122021',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'blue'
    },
    {
        id: 'IMG_220122022',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'green'
    }, {
        id: 'IMG_220122023',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'red'
    },
    {
        id: 'IMG_220122024',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'blue'
    },
    {
        id: 'IMG_220122025',
        date: '11',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'green'
    }
];


export default class History extends React.Component {

    constructor() {
        super();
        this.state = {



        },
            this.isgraph = 1
    }

    // <View style={{marginLeft:40,marginRight:10,height:1,backgroundColor:'gray',bottom:0}}></View>
    /* <View style={{justifyContent:'center',height:100, position:'absolute'}}>
     <Image
                        source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png' }}
                        style={{
                            height: 10, width: 10,left:80
                        }}
                    />
                    </View>*/

    //<View style={{height:100, width:2,backgroundColor:'green', left:80,position:'absolute'}}></View> 
    // 

    proceed() {

    };
    Item(data, index) {


        return (

            <View style={{ flex: 1, height: 80, width: '100%', backgroundColor: "#ffffff" }}>


                <View style={{ justifyContent: 'center', height: 80, position: 'absolute' }}>
                    <Image
                        source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png' }}
                        style={{
                            height: 10, width: 10, left: 76
                        }}
                    />
                </View>


                <View style={{ flexDirection: 'column', position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>


                    {/* date value */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 80, left: 50 }}>
                        <Text style={{ lineHeight: 13, fontSize: 13, fontWeight: 'bold' }}>{data.date}</Text>
                        <Text style={{ lineHeight: 13, fontSize: 13 }}>{data.month}</Text>
                    </View>


                </View>

                {/* temparature value */}
                <View style={{ height: 80, justifyContent: 'center', position: 'absolute' }}>

                    <Text style={{ fontSize: 16, left: 100, color: "#686868" }}>{data.temp}</Text>
                </View>



                {/* seperator code */}
                {

                    (index !== DATA.length - 1) ?
                        <View style={{




                            borderBottomColor: '#f1f1f1',
                            borderBottomWidth: 1,
                            marginLeft: 60,
                            marginRight: 15,
                            zIndex: 0, top: 79
                        }} /> : null

                }
                {/* vertical line */}
                {

                    (index !== DATA.length - 1) ?
                        <View style={{ height: 100, width: 2, backgroundColor: '#e4e4e4', left: 80, position: 'absolute' }}></View> :
                        <View style={{ height: 50, width: 2, backgroundColor: '#e4e4e4', left: 80, top: 0, position: 'absolute' }}></View>

                }




            </View>
        );
    }



    //{
    /* <View>
    <Text style={{color:'#c0c0c0',margin:20}}>Last 5 visit</Text>
    <LineChart
        data={{
            labels: ["Feb","March","Apr","May"],
            datasets: [
                {
                    data: [
                        26,
                       27,
                        31,
                       22,25
                    ]
                }
            ]
        }}
        
        width={Dimensions.get("window").width} // from react-native
        height={400}
        yAxisLabel=""
        yAxisSuffix=""
        withDots={true}
        withShadow={true}
        withInnerLines={true}
        withScrollableDot={false}
        //fromZero="2"
       
        
        yAxisInterval={10} // optional, defaults to 1
        chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradientOpacity:1,
            fillShadowGradient:'#dbc0e4',
            useShadowColorFromDataset:true,
            strokeWidth:1,
            
            
           // color:'red',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(162, 80, 185, ${opacity})`,
           
            labelColor: (opacity = 1) => `rgba(168, 168, 168, ${opacity})`,
            barPercentage: 1,
            useShadowColorFromDataset: true ,
            style: {
                borderRadius: 0
            },
            propsForBackgroundLines:{
                strokeWidth: "1",
                stroke: "#f2f2f2",
              
                //x1:"0" ,
               // y1:"0", 
               // x2:"100"
                //, y2:"100"
            },
            propsForDots: {
                r: "2",
                strokeWidth: "4",
                stroke: "#9e50b6",
                
            }
        }}
        
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
    />
</View>*/
    //}


    /*
            <View style={{ flexDirection: 'row', marginTop: 20, flex: 1 }}>
                               <Text style={{ position: 'absolute', width: 200, top: -10, textAlign: 'left' }}>{prefxType}</Text>
           
           
                               <YAxis
                       data={data}
                       contentInset={contentInset}
                       svg={{
                           fill: 'grey',
                           fontSize: 10,
                       }}
                       numberOfTicks={10}
                       formatLabel={(value) => `${value}ºC`}
                   />
           
                               <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
                               <LineChart
                   style={{ height: 200 }}
                   data={data}
                   svg={{ stroke: 'rgb(134, 65, 244)' }}
                   contentInset={{ top: 20, bottom: 20 }}
               >
                   <Grid />
               </LineChart>
           
           
               <XAxis
                       style={{ marginHorizontal: -10 }}
                       data={data}
                       formatLabel={(value, index) => index}
                       contentInset={{ left: 10, right: 10 }}
                       svg={{ fontSize: 10, fill: 'black' }}
                   />
                                   <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 15, color: '#3b3b3b' }}>(Trend for the last 6 visits)</Text>
           
                               </View>
           
           
                           </View>
                    */







    render1() {
        const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        return (
            <View style={{ height: 200, padding: 20 }}>
                <LineChart
                    style={{ flex: 1 }}
                    data={data}
                    gridMin={0}
                    contentInset={{ top: 10, bottom: 10 }}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                >
                    <Grid />
                </LineChart>
                <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={data}
                    formatLabel={(value, index) => index}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
            </View>
        )
    }

 x


    render() {


        const Gradient = ({ index }) => (
            <Defs key={index}>
                <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset={'0%'} stopColor={'rgb(232, 214, 237)'} stopOpacity={0.5}/>
                    <Stop offset={'100%'} stopColor={'rgb(159, 80, 182)'} stopOpacity={0.9}/>
                </LinearGradient>
            </Defs>
        )



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
        Keyboard.dismiss();
        var prefxType = "kg";
        const data2 = [0, 10, 20, 30, 40, 50, 60, 70, 80];
        const data = [26,27,31,22,25];

       // const CUT_OFF = 0
        const data1 = ["Feb", "Mar", "Apr", "May","Jun"];
        const contentInset = { top: 20, bottom: 20, left: 10, right: 10 }
        const BottomLabel = data1.map((value) => { return value });

        /*const Line = ({ line }) => (
            <Path
                d={ line }
                stroke={ 'rgba(134, 65, 244)' }
                fill={ 'none' }
            />
        )*/
       // const data = [ 10, 5, 25, 15, 20 ]

        const CUT_OFF = 20
      



        const Labels = ({ x, y,data,width,height }) => (
            data.map((value, index) => (
               
                <Svg>

<Rect x={x(index)-10} y={y(value)-26} width="18" height="18" fill="white" />
                <Text
                    key={ index }
                    
                    fill={'rgb(213, 170, 224)'} //{'rgb(213, 170, 224)'}
                    color="red"
                    stroke={'rgb(213, 170, 224)'}
                    strokeWidth={0.4}
                    fontSize={ 12 }
                    fontWeight="bold"
                    x={x(index)}
                    y={y(value)-14}
                    alignmentBaseline={ 'middle' }
                    //dy={20}
                    textAnchor="middle"
                    
                    
                >
                    {value}
                </Text>
                </Svg>
                
            ))
        )

        const Tooltip = ({ x, y }) => (
            <G
                x={ x(5) - (75 / 2) }
                key={ 'tooltip' }
                onPress={ () => console.log('tooltip clicked') }
            >
                <G y={ 50 }>
                    <Rect
                        height={ 40 }
                        width={ 75 }
                        stroke={ 'grey' }
                        fill={ 'white' }
                        ry={ 10 }
                        rx={ 10 }
                    />
                    <Text
                        x={ 75 / 2 }
                        dy={ 20 }
                        alignmentBaseline={ 'middle' }
                        textAnchor={ 'middle' }
                        stroke={ 'rgb(134, 65, 244)' }
                    >
                        { `${data[5]}ºC` }
                    </Text>
                </G>
                <G x={ 75 / 2 }>
                    <Line
                        y1={ 50 + 40 }
                        y2={ y(data[ 5 ]) }
                        stroke={ 'grey' }
                        strokeWidth={ 2 }
                    />
                    <Circle
                        cy={ y(data[ 5 ]) }
                        r={ 6 }
                        stroke={ 'rgb(134, 65, 244)' }
                        strokeWidth={ 2 }
                        fill={ 'white' }
                    />
                </G>
            </G>
        )
        return (
            <View style={{ flex: 1 }}>

                <View style={{ flexdirection: 'column', flex: 1 }}>





                    {

                        this.isgraph == 0 ?
                            <View>
                                <FlatList
                                    data={DATA}
                                    numColumns={1}
                                    renderItem={({ item, index }) => this.Item(item, index)}
                                    keyExtractor={item => item.id}
                                    style={{ marginBottom: 60, marginTop: 0, backgroundColor: '#fafafa' }}
                                />
                                <Text style={{ left: -20, color: "#c2c2c2", fontSize: 12, position: 'absolute', top: '40%', transform: [{ rotate: "270deg" }] }}>Head History</Text>
                            </View>
                            : <View style={{ flexDirection: 'row', marginLeft: 20,marginRight:20,marginVertical:40, flex: 1}}>
                            <Text style={{ position: 'absolute', width: 200, top: -20, textAlign: 'left', color:"#aeaeae"}}>Last 5 Visit</Text>
        
        
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
        
                            <View style={{ flexDirection: "column", marginLeft: 10, flex: 1}}>
                              
                                <LineChart
                                    style={{ height: 400 }}
                                    data={data}
                                    yMax={80}
                                    yMin={0}
                                    Labels={true}
                                    
                                   
                                    
                                    numberOfTicks={10}
                                    
                                    svg={{ stroke: 'rgb(157, 68, 181)' ,fill:'url(#gradient)' ,strokeWidth:2}}
                                    contentInset={contentInset}
                                >
                                    <Grid 
                                     svg={{ stroke: 'rgb(245, 245, 245)' }}
                                    />


        
                                    <Decorator />
                                    <Gradient/>
                                    <Labels/>
                                   
                                    
                                   

                                   
        
                                </LineChart>
        
        
                                <XAxis
                                    style={{ alignContent: 'center', justifyContent: 'center',width:"100%" }}
                                    data={data}
                                    formatLabel={(value, index) => BottomLabel[value]}
        
                                    contentInset={{ left: 10, right: 10 }}
                                    svg={{ fontSize: 10, fill: '#cdcdcd' }}
                                />
                                
        
                            </View>
        
        
                        </View>


                    }


                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%', marginBottom: 10, paddingHorizontal: 10, zIndex: 0, bottom: 0,

                    }} onPress={() => this.proceed()}>
                        <LinearGradient1
                            colors={["#50afb1", "#62d6d8"]} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} locations={[0, 0.8]}
                            style={{ width: '95%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 }}>
                            <Text uppercase={true} style={{
                                fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold'
                            }}>DONE</Text>


                        </LinearGradient1>

                        </TouchableOpacity> 


                </View>
            </View>

        );
    }
}