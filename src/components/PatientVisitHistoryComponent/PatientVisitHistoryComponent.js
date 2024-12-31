/****** code by ravi ******/

import React, { Component } from "react"
import { Text, } from "native-base"
import { View, FlatList, TouchableOpacity, StatusBar, Platform, Dimensions } from "react-native"
import PagerView from 'react-native-pager-view'
import ShowGraph from '../../containers/GraphContainer/ShowGraph'
import Triangle from 'react-native-triangle'
import moment from "moment";
import { Add_the_typed } from '../../constants/images';
import Tooltip from 'react-native-walkthrough-tooltip';
import AddPatient from '../../components/Tooltips';
import { setTooltipStatus } from '../../actions/tooltip';
import LineGraph from '../../components/Graph/LineGraph';

const _renderDotIndicator = (len) => {
    return <PagerDotIndicator pageCount={len} selectedDotStyle={{ backgroundColor: '#0065d7' }} />;
}
const renderGraphs = (graphData) => {
    let views = [];
    for (let g = 0; g < graphData.length; g++) {
        let data = graphData[g].map(item => {
            return item.DataType
        });
        let lables = graphData[g].map(item => {
            return item.date
        });
        views.push(<View
            style={{}}
        >
            <Text style={{ fontSize: 16, color: '#000000', fontFamily: 'NotoSans-Bold', marginLeft: 10 }}>{graphData[g][0].Name + " (" + graphData[g][0].Unit + ")"}</Text>
            <Text style={{ fontSize: 12, color: '#545454', fontFamily: 'NotoSans', marginLeft: 10 }}>Last 5 Visits</Text>

            <LineGraph
                data={data}
                lables={lables}></LineGraph>
        </View>
        );
    }

    return views;
}
export default class PatientVisitHistoryComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            graphData: null,
            currentPage: 0
        }
    }

    Item(data, index) {
        let check = moment(data.WhenEntered);
        let day = check.format('DD') // => ('Monday' , 'Tuesday' ----)
        let month = check.format('MMMM') // => ('January','February.....)
        let year = check.format('YYYY');
        var delProv = this.props.doctorProfile.DoctorData.IsAssistant != 1;
        return (
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingLeft: 15, top: 55, paddingRight: 10 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'NotoSans-Bold' }}>{day}</Text>
                    <Text style={{ fontSize: 10, marginTop: -5, fontWeight: '600' }}>{month.substr(0, 3)}</Text>
                    <Text style={{ fontSize: 7, }}>{year}</Text>
                </View>
                <View style={{ borderLeftWidth: 3, marginRight: 30, borderColor: '#d9d9d9', width: 5, height: index < this.props.data.length - 1 ? '100%' : 0, top: 60 }}>

                </View>
                <TouchableOpacity style={{ minHeight: 50, flex: 0.88, flexDirection: 'column', justifyContent: 'center', }}
                     onLongPress={() => { delProv ? this.props.itemLongClick(data._id) : null }}
                    onPress={() => { this.props.setPrescriptionVisitId(data._id); this.props.itemClick('item', data.Type) }}>
                    <View style={{ top: 60, left: -40, flexDirection: 'column', borderRightWidth: 1, borderColor: '#D8D8D8', }}>
                        <View style={{ alignItems: 'center', right: -2, height: 12, width: 12, borderRadius: 12 / 2, backgroundColor: data.IsPrint || data.CertificateType !== "" ? "#0064d7" : "#ffffff", borderWidth: 2, borderColor: data.IsPrint || data.CertificateType !== "" ? "#0064d7" : "#e85348" }}></View>
                    </View>
                    <View style={{ left: -11, justifyContent: 'center', flex: 0.9, borderWidth: 1, borderColor: '#ececec', shadowColor: '#ebebeb', flexDirection: 'column', borderRadius: 3, marginTop: 20, shadowOpacity: 0.7, shadowRadius: 2, backgroundColor: '#FFFFFF', shadowOffset: { height: 2, width: 2 } }}>
                        {
                            data.ChiefComplaints.length > 0 || data.CertificateType ? <View>
                                {
                                    index == 0 && !data.IsPrint && data.CertificateType == "" && this.props.patientVisitHistryIncomplete ?
                                        <TouchableOpacity
                                            style={{ flex: 1, alignItems: 'flex-start', backgroundColor: data.IsPrint || data.CertificateType !== "" ? '#f5f5ff' : '#fcf2f3', paddingVertical: 8, paddingLeft: 8, }}>

                                            <Tooltip
                                                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                                                animated={true}
                                                isVisible={true}

                                                //isVisible={this.props.chiefComplaintContainerAdd}
                                                backgroundColor={"rgba(0,0,0,0)"}
                                                contentStyle={{ backgroundColor: '#6f6af4', height: '100%' }}
                                                tooltipStyle={{ right: 20, alignItems: 'flex-end' }}

                                                content={<TouchableOpacity style={{ backgroundColor: "#6f6af4" }}
                                                    onPress={() => { this.props.tooltipClicked(true) }}
                                                >
                                                    <AddPatient
                                                        imagePath={Add_the_typed}

                                                        title={"Pending Prescription"}
                                                        description={"Marked in RED, these are partially filled prescriptions which are still awaiting finlisation by the doctor."}


                                                    />
                                                </TouchableOpacity>}
                                                //(Must) This is the view displayed in the tooltip
                                                placement="top"
                                                //(Must) top, bottom, left, right, auto.
                                                onClose={() => this.props.tooltipClicked(true)}
                                            //(Optional) Callback fired when the user taps the tooltip
                                            >


                                                <Text style={{ color: data.IsPrint || data.CertificateType !== "" ? "#0065d7" : "#e85348", fontSize: 16, alignSelf: 'flex-start' }}>{data.ChiefComplaints.join(', ') || data.CertificateType}</Text>


                                            </Tooltip>

                                        </TouchableOpacity>
                                        :

                                        <View style={{ backgroundColor: data.IsPrint || data.CertificateType !== "" ? '#f5f5ff' : '#fcf2f3', paddingVertical: 8, paddingLeft: 8, }}>
                                            <Text style={{ color: data.IsPrint || data.CertificateType !== "" ? "#0065d7" : "#e85348", fontSize: 16, alignSelf: 'flex-start' }}>{data.ChiefComplaints.join(', ') || data.CertificateType}</Text>
                                        </View>}
                            </View> : null
                        }
                        {
                            (data.ChiefComplaints.length > 0 || data.CertificateType) ? <View style={{ position: 'absolute', top: 27, left: -10, }}>
                                <Triangle
                                    width={12}
                                    height={10}
                                    color={'#f5f5ff'}
                                    direction={'left'}
                                    style={{}}
                                />
                            </View> : null
                        }


                        {/* {this.props.stateMenu==false?<View>{this.props.menuDropDown}</View>:null} */}

                        <View style={{ paddingLeft: 8, flexDirection: 'column', }}>
                            {data.Findings.length > 0 ? <View>
                                <Text style={{ paddingVertical: 8, color: '#676767', fontSize: 12, }}>{data.Findings.map(i => (i.Name) + ": " + (i.DataType) + " " + (i.Unit)).join(', ')}</Text>
                            </View> : null}
                            {data.RecommendedLabTest.length > 0 ? <View>
                                <Text style={{ paddingVertical: 8, color: '#676767', fontSize: 12, paddingTop: 3 }}>{data.RecommendedLabTest.join(', ')}</Text>
                            </View> : null}
                        </View>
                        {
                            data.Diagnosis.length > 0 ?
                                <View>
                                    <View style={{ marginHorizontal: 10, flexDirection: 'column', borderTopWidth: 1, borderColor: '#ececec', }}>
                                    </View>
                                    <View style={{ paddingVertical: 8, paddingLeft: 8, flexDirection: 'column', }}>
                                        <Text style={{ color: '#000', fontSize: 12, marginBottom: 2 }}>{data.Diagnosis.join(', ')}</Text>
                                    </View>
                                </View>
                                : null
                        }
                    </View>
                </TouchableOpacity>
            </View >
        );
    }


    PageIndicator(data) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    bottom: 0
                }}
            >
                {data.map((item, index) => (
                    <View
                        key={index}
                        backgroundColor={index === this.state.currentPage ? '#0065d7' : 'black'}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 10,
                            marginHorizontal: 5,
                        }}
                    ></View>
                ))}
            </View>
        );
    };
    graphHeader(data) {

        let dataarr = [...data.find, ...data.invest];


        return (

            <View style={{
                flex: 1,
                height: 250,
                marginTop: 20,
                width: '100%'
            }}>

                <PagerView
                    onPageSelected={(e) => this.setState({ currentPage: e.nativeEvent.position })}
                    orientation="horizontal" style={{ width: Dimensions.get('screen').width, flex: 1 }} initialPage={0}>


                    {renderGraphs(dataarr)}

                </PagerView>
                {this.PageIndicator(dataarr)}
            </View >
        );

    }

    parseAllNumbers(value) {
        return !isNaN(value.DataType.trim())
    }
    isCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    }
    render() {

        return (
            <View style={{ flex: 1 }}>

                <FlatList
                    style={{ flex: 1 }}
                    data={this.props.data}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, }}
                    ListHeaderComponent={this.props.findGraph.length + this.props.investGraph.length > 0 ? this.graphHeader({ find: this.props.findGraph, invest: this.props.investGraph }) : null}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => this.Item(item, index)}
                    onEndReachedThreshold={0.3}
                    // onEndReached={({ distanceFromEnd }) => {
                    //     if (distanceFromEnd >= 0) {
                    //         this.props.loadMore()
                    //     }
                    // }}
                    onScroll={({ nativeEvent }) => {
                        //console.log(nativeEvent);
                        if (!this.scrollToEndNotified && this.isCloseToBottom(nativeEvent)) {
                            this.scrollToEndNotified = true;
                            this.props.loadMore()
                        }
                    }}
                    // onEndReached={() => this.props.loadMore()}
                    keyExtractor={(item, index) => 'pvhc' + index.toString()}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props.data}
                />
            </View>
        )
    }
}




