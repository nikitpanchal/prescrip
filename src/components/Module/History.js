import React, { Component } from "react"
import { View, Share, Text, Image, TextInput, ScrollView, Platform, Linking, Keyboard, TouchableOpacity, Clipboard, FlatList, Dimensions } from "react-native"
import { connect } from "react-redux"
import { Container } from "native-base";
import LinearGradient1 from 'react-native-linear-gradient';
import { LineChart1 } from "react-native-chart-kit";
import Linegraph from "./linegraph"
import Images from '../../Theme/Images'
import { History_Dot } from '../../constants/images'
import { withDb } from "../../DatabaseContext/withDatabase";
import db from "../../utils/db";
import { month } from "../../commonmethods/validation";
import { empty_vc } from '../../constants/images'
import EmptyHome from '../EmptyHome/EmptyHome'

const colorCode = "#881896";

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
        date: '12',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'blue'
    },
    {
        id: 'IMG_220122022',
        date: '13',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'green'
    }, {
        id: 'IMG_220122023',
        date: '14',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'red'
    },
    {
        id: 'IMG_220122024',
        date: '15',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'blue'
    },
    {
        id: 'IMG_220122025',
        date: '16',
        month: 'jan',
        temp: "+0.25 degree",
        color: 'green'
    }
];

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isgraph: 0,
            graphgArray: []
        };

    }

    setData(item) {

        var size = 5;

        let graphgArray = []



        this.props.patientvisit.patientRxList.slice(0, size).map(i => {

            if (i.hasOwnProperty(this.props.type)) {

                if (i[this.props.type].length > 0) {
                    let graphItem = i[this.props.type].find((graph_item) => {
                        if (graph_item.Name == this.props.Name) {

                            return graph_item;
                        }
                    });
                    if (graphItem) {
                        let item = { ...graphItem };
                        item['date'] = i.WhenEntered;
                        graphgArray.push(item);
                        item = null;
                    }


                }

            }

        })


        this.setState({
            graphgArray: graphgArray
        })

        // alert(JSON.stringify(graphgArray))

    }


    componentDidMount() {
        // patientvisit.patientRxList


        // alert(this.props.attachment.keyBoradType);

        // alert(this.props.patientvisit.patientRxList)
        this.setState({
            isgraph: this.props.attachment.keyBoradType == "numeric" ? 1 : 0
        })

        this.setData();






    }
    Item(data, index) {

        return (
            <View style={{ flex: 1, height: 80, width: '100%', backgroundColor: "#ffffff" }}>
                <View style={{ justifyContent: 'center', height: 80, position: 'absolute', zIndex: 1 }}>
                    <Image
                        source={History_Dot}
                        style={{ height: 12, width: 12, left: 75 }}
                    />
                </View>

                <View style={{ flexDirection: 'column', position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                    {/* date value */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 80, left: 50, }}>
                        <Text style={{ lineHeight: 13, fontSize: 13, fontFamily: 'NotoSans-Bold', color: '#272727', paddingTop: 5 }}>{data.date.substring(0, 2)}</Text>
                        <Text style={{ lineHeight: 13, fontSize: 9, color: '#575757', fontFamily: 'NotoSans-Bold', marginTop: -5 }}>{month[parseInt(data.date.substring(3, 5))]}</Text>
                    </View>
                </View>

                {/* temparature value */}
                <View style={{ height: 80, justifyContent: 'center', position: 'absolute', }}>

                    <Text style={{ fontSize: 18, left: 95, color: "#5e5e5e", paddingBottom: 3 }}>{data.DataType}</Text>
                </View>

                {/* seperator code */}
                {
                    (index !== this.state.graphgArray.length - 1) ?
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
                    (index !== this.state.graphgArray.length - 1) ?
                        <View style={{ height: 100, width: 2, backgroundColor: '#e5e5e5', left: 80, position: 'absolute' }}></View> :
                        <View style={{ height: 50, width: 2, backgroundColor: '#e4e4e4', left: 80, top: 0, position: 'absolute' }}></View>
                }
            </View>
        );
    }

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

    render() {

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
        const data = [26, 27, 31, 22, 25];

        // const CUT_OFF = 0
        const data1 = ["Feb", "Mar", "Apr", "May", "Jun"];
        const contentInset = { top: 20, bottom: 20, left: 10, right: 10 }
        const BottomLabel = data1.map((value) => { return value });


        const CUT_OFF = 20
        const Labels = ({ x, y, data, width, height }) => (
            data.map((value, index) => (
                <Svg>
                    <Rect x={x(index) - 10} y={y(value) - 26} width="18" height="18" fill="white" />
                    <Text
                        key={index}
                        fill={'rgb(213, 170, 224)'} //{'rgb(213, 170, 224)'}
                        color="red"
                        stroke={'rgb(213, 170, 224)'}
                        strokeWidth={0.4}
                        fontSize={12}
                        fontWeight="bold"
                        x={x(index)}
                        y={y(value) - 14}
                        alignmentBaseline={'middle'}
                        //dy={20}
                        textAnchor="middle">
                        {value}
                    </Text>
                </Svg>
            ))
        )
        return (
            <View contentContainerStyle={{ flex: 1 }}
                style={{
                    backgroundColor: '#fff', height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width
                }}>

                {

                    this.state.graphgArray.length == 0 ?



                        //Empty data

                        <EmptyHome
                            {...this.props}
                            isLottie={true}
                            topmargin={40}
                            imagePath={empty_vc}
                            title={"No data available"}
                            colorCode={colorCode}
                            isShowButton={false}
                            description={"History is not present for " + this.props.Name}
                            onClick={() => this.onClick()} />
                        :

                        //If data avalaible
                        <ScrollView style={{ flexdirection: 'column', marginBottom: 50 }}>


                            <View>
                                <FlatList
                                    data={this.state.graphgArray}
                                    numColumns={1}
                                    renderItem={({ item, index }) => this.Item(item, index)}
                                    keyExtractor={(item, index) => 'History' + index}
                                    style={{ marginBottom: 60, marginTop: 0, backgroundColor: '#fafafa' }}
                                />
                                <Text style={{ left: -20, color: "#969696", fontSize: 12, position: 'absolute', top: '40%', transform: [{ rotate: "270deg" }] }}>Head History</Text>
                            </View>

                        </ScrollView>
                }
            </View>
        );
    }

}



const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    type: state.attachment.type,
    Srno: state.attachment.Srno,
    defaultlabel: state.attachment.defaultlabel,
    displayname: state.attachment.displayname,
    mdata: state.attachment.mdata,
    attachment: state.attachment,
    patientvisit: state.patientvisit,
    Name: state.attachment.Name,
    Unit: state.attachment.Unit,
    attachment: state.attachment,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(History));