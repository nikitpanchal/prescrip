import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, TouchableOpacity as Button } from 'react-native'
 
import Modal from "react-native-modalbox";
import { connect } from 'react-redux'
import { setFormatTabData } from '../../actions/previewSettings'
import { ic_arrow_decrease, ic_arrow_increase } from '../../constants/images'

class FormatTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marginLeft: parseInt(this.props.screenProps.state.PaperSettings.Margin[3]),
            marginRight: parseInt(this.props.screenProps.state.PaperSettings.Margin[1]),
            marginTop: parseInt(this.props.screenProps.state.PaperSettings.Margin[0]),
            marginBottom: parseInt(this.props.screenProps.state.PaperSettings.Margin[2]),

            tabData: [{
                "Paper Size":
                    ["A3", "A4", "A5"]
            },
            {
                "Top Margin": parseInt(this.props.screenProps.state.PaperSettings.Margin[0])
                // ["1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "7mm", "8mm", "9mm", "10mm"]
            },
            {
                "Bottom Margin": parseInt(this.props.screenProps.state.PaperSettings.Margin[2])
            },
            {
                "Left Margin": parseInt(this.props.screenProps.state.PaperSettings.Margin[3])
            },
            {
                "Right Margin": parseInt(this.props.screenProps.state.PaperSettings.Margin[1])
            },
            {
                "Header Display": ["Show", "Hide"]
            },
            { "Footer Display": ["Show", "Hide"] },
            { "Font Size": "Large" }
            ],
            fontState: false,
            dropDownFormat: ["Small", "Normal", "Large", "Extra Large"]

        }

    }


    onFontChange(size, item) {
        this.props.screenProps.onDataChanges(size, item)
        this.refs.modal.close()
    }

    bindData(item, index) {
        return (
            <TouchableOpacity onPress={() => this.onFontChange('TemplateFontSize', item)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, padding: 8 }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    marginAdjuster(pressDown, pressUp, type) {
        if (pressDown == true && pressUp == false && type == "Top Margin") {

            this.setState({ marginTop: this.state.marginTop - 1 }, () => {
                this.pushMargininArr()
            })

        } else if (pressDown == true && pressUp == false && type == "Bottom Margin") {
            this.setState({ marginBottom: this.state.marginBottom - 1 }, () => {
                this.pushMargininArr()
            })

        }
        else if (pressDown == true && pressUp == false && type == "Left Margin") {
            this.setState({ marginLeft: this.state.marginLeft - 1 }, () => {
                this.pushMargininArr()
            })
        }
        else if (pressDown == true && pressUp == false && type == "Right Margin") {
            this.setState({ marginRight: this.state.marginRight - 1 }, () => {
                this.pushMargininArr()
            })
        }
        else if (pressDown == false && pressUp == true && type == "Top Margin") {
            this.setState({ marginTop: this.state.marginTop + 1 }, () => {
                this.pushMargininArr()
            })
        }
        else if (pressDown == false && pressUp == true && type == "Bottom Margin") {
            this.setState({ marginBottom: this.state.marginBottom + 1 }, () => {
                this.pushMargininArr()
            })

        } else if (pressDown == false && pressUp == true && type == "Left Margin") {
            this.setState({ marginLeft: this.state.marginLeft + 1 }, () => {
                this.pushMargininArr()
            })

        } else if (pressDown == false && pressUp == true && type == "Right Margin") {
            this.setState({ marginRight: this.state.marginRight + 1 }, () => {
                this.pushMargininArr()
            })
        }


        //arr.push()


    }

    pushMargininArr() {

        let arr = [this.state.marginTop, this.state.marginRight, this.state.marginBottom, this.state.marginLeft]
        this.props.screenProps.onDataChanges("Margin", arr)
    }

    showHide(key, val) {
        if (key == "Header Display") {
            if (val == "Show") {
                this.props.screenProps.onDataChanges("header", 1)
            } else {
                this.props.screenProps.onDataChanges("header", 0)
            }

        } else if (key == "Footer Display") {
            if (val == "Show") {
                this.props.screenProps.onDataChanges("footer", 1)
            } else {
                this.props.screenProps.onDataChanges("footer", 0)
            }

        }
    }

    headerFooterShow(key, a, i) {
        if (key == "Header Display" && this.props.screenProps.state.PaperSettings['header'] == 0) {
            return 1
        } else if (key == "Header Display" && this.props.screenProps.state.PaperSettings['header'] >= 1) {
            return 0
        } else if (key == "Footer Display" && this.props.screenProps.state.PaperSettings['footer'] == 0) {
            return 1
        } else if (key == "Footer Display" && this.props.screenProps.state.PaperSettings['footer'] >= 1) {
            return 0
        }

    }

    //   dropDownFontChange(item)
    //   {
    //     var stateCopy = Object.assign({}, this.state);
    //     stateCopy.tabData = stateCopy.tabData.slice();
    //     stateCopy.tabData[5] = Object.assign({}, stateCopy.tabData[5]);
    //     stateCopy.tabData[5]["Font Size"] = item;
    //     this.setState({tabData:stateCopy});
    //   }

    onButtonClick(type, idx, value) {
        this.props.screenProps.onDataChanges('papername', value)


    }

    fontChange() {

        var content = this.state.dropDownFormat.map((item, index) => {
            return (

                <TouchableOpacity onPress={() => this.dropDownFontChange(item)}>
                    <Text style={{ fontSize: 14, padding: 10, alignItems: 'center', justifyContent: 'center', color: '#000000' }}>{item}</Text>
                </TouchableOpacity>
            )
        })
        return content
    }

    // set value of margin
    setmarginValue(val) {
        switch (val) {
            case 'Top Margin':
                return this.props.screenProps.state.PaperSettings.Margin[0]

            case 'Bottom Margin':
                return this.props.screenProps.state.PaperSettings.Margin[2]

            case 'Left Margin':
                return this.props.screenProps.state.PaperSettings.Margin[3]

            case 'Right Margin':
                return this.props.screenProps.state.PaperSettings.Margin[1]

        }

    }

    fontnamebySize(val) {
        switch (val) {
            case '14':
                return "Small"
            case '16':
                return "Normal"
            case '18':
                return "Large"
            case '20':
                return "Extra Large"
        }
    }

    itemView(index, item) {

        let keys = Object.keys(item)

        return (

            index == 0 ?
                <View style={styles.case2}>
                    <View style={[styles.labelTxt, { flex: 0.4, marginLeft: 25 }]}>
                        <Text style={styles.textStyle}>{keys[0]}</Text>

                    </View>
                    {item[keys[0]].map((a, idx) => {

                        return (
                            <View style={styles.viewCase2}>
                                <Button block onPress={() => this.onButtonClick(1, idx, a)} style={[styles.btnStyle, {
                                    backgroundColor: (this.props.screenProps.state.PaperSettings.papername == a ? '#0065d7' : 
                                    (this.props.screenProps.state.PaperSettings.papername == a ? '#0065d7' : '#ffffff'))
                                }]}><Text style={{ paddingTop:5,  color: (this.props.screenProps.state.PaperSettings.papername == a ? '#ffffff'
                                 : (this.props.screenProps.state.PaperSettings.papername == a ? '#ffffff' : '#0065d7')) }}>{a}</Text></Button>
                            </View>
                        )
                    })
                    }
                </View> :

                index == 1 || index == 2 || index == 3 || index == 4 ? <View style={styles.case2} >
                    <View style={[styles.labelTxt, { flex: 0.6, marginLeft: 25 }]}>
                        <Text style={styles.textStyle}>{keys[0]}</Text>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.marginAdjuster(true, false, keys[0]) }}>
                            <Image source={ic_arrow_decrease} style={{ resizeMode: 'contain', height: 10, width: 10 }} />
                        </TouchableOpacity>
                        <Text style={[styles.textStyle, { marginHorizontal: 10 }]}>{this.setmarginValue(keys[0]) + " mm"}</Text>
                        <TouchableOpacity onPress={() => { this.marginAdjuster(false, true, keys[0]) }}>
                            <Image source={ic_arrow_increase} style={{ resizeMode: 'contain', height: 10, width: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View> :

                    index == 5 || index == 6 ?
                        <View style={styles.case2}>
                            <View style={[styles.labelTxt, { flex: 0.6, marginLeft: 25 }]}>
                                <Text style={styles.textStyle}>{keys[0]}</Text>
                            </View>
                            {
                                item[keys[0]].map((a, idx) => {
                                    return (
                                        <View style={styles.viewCase2}>
                                            <Button block onPress={() => this.showHide(keys[0], a)} style={[styles.btnStyle, {
                                                backgroundColor: (this.headerFooterShow(keys[0], a, idx) == idx
                                                    ? '#0065d7' : '#ffffff'),
                                            }]}><Text style={{paddingTop:5, color: (this.headerFooterShow(keys[0], a, idx) == idx ? '#ffffff' : '#0065d7') }}>{a}</Text></Button>
                                        </View>
                                    )
                                })
                            }</View> :
                        index == 7 ?
                            <View style={[styles.case2, { marginHorizontal: 30 }]}>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <Text style={styles.textStyle}>{keys[0]}</Text>
                                </View>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TouchableOpacity onPress={
                                        () => this.refs.modal.open()
                                    } style={{ flexDirection: 'row', }}>

                                        <Text style={[styles.textStyle, { marginHorizontal: 8 }]}>{this.fontnamebySize(this.props.screenProps.state.PaperSettings.TemplateFontSize)}</Text>

                                        <Image source={ic_arrow_increase} style={{ resizeMode: 'contain', height: 15, width: 15 }} />
                                    </TouchableOpacity>

                                </View>

                            </View> :
                            null

        )
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <FlatList
                    data={this.state.tabData}
                    renderItem={({ index, item }) => this.itemView(index, item)}
                    keyExtractor={item => item.id}
                    extraData={this.state}
                    ItemSeparatorComponent={this.renderSeparator} />
                <Modal
                    useNativeDriver={true}
                    animationDuration={200}
                    style={{
                        borderWidth: 0, width: '50%', borderTopLeftRadius: 20, borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20, borderTopRightRadius: 20, height: '70%', overflow: 'hidden',
                    }}
                    ref={"modal"}
                    swipeToClose={false}
                    position={"center"}
                    //swipeToClose={this.state.swipeToClose}
                    onClosed={() => { this.close }}
                    onOpened={this.open}
                    onClosingState={this.onClosingState}>

                    <View style={{ flex: 1 }}>


                        <FlatList
                            data={this.state.dropDownFormat}
                            ItemSeparatorComponent={this.renderSeperator}
                            renderItem={({ item, index }) => this.bindData(item, index)} />

                    </View>


                </Modal>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    dropdownFont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        position: 'absolute',
        top: 50,
        right: 10,
        height: 150,
        width: 120,
        zIndex: 5,
        borderBottomColor: '#cccccc',
        borderLeftColor: '#cccccc',
        borderRightColor: '#cccccc',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },


    case2: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,

    },
    labelTxt: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 12
    },
    textStyle: {
        color: '#000000',
        fontSize: 16
    },
    imgStyle: {
        resizeMode: 'contain',
        height: 18
    },
    btnStyle: {
        borderBottomColor: '#cccccc',
        borderLeftColor: '#cccccc',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 20,
        paddingHorizontal : 10,
        height: 32,
    },
    rightImg: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    viewCase2: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    }
})
const mapStateToProps = state => ({
    auth: state.auth,
    previewReducer: state.previewReducer

});

const mapDispatchToProps = dispatch => ({
    setFormatTabData: (formatData) => dispatch(setFormatTabData(formatData))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormatTab);
