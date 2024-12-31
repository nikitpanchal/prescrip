//  code by ravi
import React from 'react';
import { Container, } from "native-base";
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { pdfimg, Attachment_dots, ic_pdf } from "../../constants/images";
import { S3BaseUrl } from "../../../app.json";
import { isImageValid } from "../../commonmethods/validation";

import { setAttachmentDataS3, setAttachmentEditing } from "../../actions/attachment";

import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux"
class AttachmentTile extends React.Component {
    //Setting Screen to show in Setting Option
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: -1, //menu will visible for that index
            isimage: isImageValid.test(typeof props.item == 'string' ? props.item : props.item.uri ?props.item.uri: props.item.image?props.item.image:undefined )
            //state to control the visibility of Tooltip
        };
    }

    AtthachmentType() {
        var { item } = this.props
        let type = this.state.isimage ? 'img' : 'pdf';
        let fname = typeof item == 'string' ? item : item.image?item.image :item.fileName
        let basePath = S3BaseUrl + 'investigationImg/' + fname;
        switch (type) {
            case 'pdf':
                return ic_pdf

                break;
            case 'img':
                //Please change this image for Image logo
                return { uri: typeof item == 'string' ? basePath : item.image ?  basePath :item.uri }
                // return { uri: basePath }
                break;
            default:
            //Please add deffault image
        }
    }

    // code for opening rename popup
    callrenamefile(filename, index) {
        this.renameindex = index;
        this.setState({
            menuIndex: -1,
            filename: filename,
            renamepopupopen: true
        })
    }

    closeMenu() {
        this.setState({
            menuIndex: -1
        })
    }

    clickOnItem(index, rowID, item) {
        this.setState({
            menuIndex: -1
        })
        this.props.delelefilename(index, rowID, item)
        this.props.Closeallmenu();
    }
    //setting menuindex after click
    setMenuIndex(index) {
        this.setState({ menuIndex: this.state.menuIndex === index ? -1 : index });
    }

    render() {
        const { onPress, delelefilename, item, index } = this.props


        return (
            <View style={[styles.tile1]}>
                <TouchableOpacity onPress={onPress} style={styles.tile}>
                    <Image source={this.AtthachmentType()} style={[styles.tileImg, this.state.isimage ? { width: '100%', height: '100%', resizeMode: 'contain' } : {}]} />
                </TouchableOpacity>
                <View style={styles.attachOptions}>
                    {/*filename*/}
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 0.8 }}>
                        <Text style={{ fontSize: 13, paddingLeft: 5, color: 'black', textAlignVertical: "center" }}
                            numberOfLines={1} >
                            {item.titleName ? item.titleName :item.imageName ? item.imageName:  (item.substr(item.lastIndexOf("_") + 1)).substr(0, item.indexOf('.'))}
                        </Text>
                    </View>
                    {/*Dotted Menu*/}
                    <TouchableWithoutFeedback onPress={() => this.props.onMenuClick(index)}>
                        <View style={{ flex: 0.12, alignItems: 'flex-end', alignSelf: 'center', paddingVertical: 3, marginRight: 10 }}>
                            <Image source={Attachment_dots} resizeMode="contain" style={{ height: 17, }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                { 
                    (item.menuOpen) ?
                        <View style={[styles.menucontainer,{height :item.imageName ? 70 :item.titleName? 70 :35}]}>
                           
                           {
                               item.titleName || item.imageName?
                               <TouchableOpacity onPress={() =>

                                this.clickOnItem(index, 1, item)
                            }

                            >
                                <Text style={[styles.menutext, { color: '#000' }]}>Rename</Text>
                            </TouchableOpacity>
:null
                           }
                           
                            <TouchableOpacity 
                            
                            onPress={() => this.clickOnItem(index, 2, item)}>
                                <Text style={styles.menutext}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        : null
                }
            </View>
        );
    }
}




const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    type: state.attachment.type,
    Name: state.attachment.Name,
    Unit: state.attachment.Unit,
    Graph: state.attachment.graphtype,
    DataType: state.attachment.DataType,
    Value: state.attachment.Value,
    Upload: state.attachment.Upload,
    mdata: state.attachment.mdata,
});

const mapDispatchToProps = dispatch => ({

    setAttachmentDataS3: (data) => dispatch(setAttachmentDataS3(data)),
    setAttachmentEditing: (data) => dispatch(setAttachmentEditing(data)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(AttachmentTile));


const styles = {
    tile: { height: 170, justifyContent: 'center', alignItems: 'center', borderColor: '#eee', borderWidth: 1, backgroundColor: '#fff' },
    tile1: {
        flex: 0.5, borderRadius: 5,
        backgroundColor: '#fff',
        margin: 8,
        shadowColor: '#999',
        shadowOffset: { height: 0.5 }, shadowOpacity: 0.6,
        elevation: 4, shadowRadius: 3,
    },
    tileImg: { width: 40, height: 40, },
    attachOptions: {
        flex: 1, height: 38, flexDirection: 'row', shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-between'
    },
    dotStyle: { height: 38, width: 4, resizeMode: 'contain' },
    menucontainer: {
        height: 70, width: 120, backgroundColor: 'white', bottom: 0, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        right: 10,
        position: 'absolute',

        elevation: 5, alignSelf: 'flex-end'
    },
    menutext: { fontSize: 12, padding: 10, left: 5, alignItems: 'center', justifyContent: 'center', color: 'red' }
}
