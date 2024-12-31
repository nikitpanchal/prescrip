import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, BackHandler } from 'react-native';
import PdfReader from './PdfReader'
import ImageShowcase from './ImageShowcase'
import DocumentPicker from 'react-native-document-picker';
import { S3BaseUrl } from "../../../app.json";
import ZoomableImage from "./CImage";
import PrescriptionWebViewHeader from '../Header/PrescriptionWebViewHeader';
import Images from '../../Theme/Images';
export default class DocumentUploader extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    _renderTitleIndicator() {
        return <PagerTitleIndicator titles={['one', 'two', 'three']} />;
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {

        this.props.navigation.pop();
        return true;
    }
    OnClick(callFrom) {


        switch (callFrom) {
            case 'left':
                this.handleBackButtonClick();
                break;

        }
    }
    switchDocuments() {
        let { item, index, imgList } = this.props.route.params;
        let type = item.split('.')[item.split('.').length - 1];
        let basePath = item.startsWith('file://') ? item : S3BaseUrl + 'investigationImg/' + item;
        if (imgList) {
            imgList = imgList.map(item => {
                return item.startsWith('file://') ? item : S3BaseUrl + 'investigationImg/' + item;
            })
        }
        switch (type) {
            case 'pdf':
                return <PdfReader uri={basePath} />
                break;
            case 'images':
                return <ZoomableImage source={basePath} currentIndex={index} images={imgList} style={{ width: 100, height: 100 }} />
                break;
            default:
                return <ZoomableImage source={basePath} currentIndex={index} images={imgList} style={{ flex: 1 }} height={100} width={100} />
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <PrescriptionWebViewHeader
                    {...this.props}
                    bgImage={null}
                    bgColor={'#ffffff'}
                    title={""}
                    description={"View Attachments"}
                    titleColor={'#919191'}
                    descriptionColor={'#0b69d8'}
                    leftImage={Images.ic_black_back}
                    rightImage={""}
                    secondRightImage={""}


                    OnClick={(callFrom) => this.OnClick(callFrom)}


                />
                {this.switchDocuments()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },


});
