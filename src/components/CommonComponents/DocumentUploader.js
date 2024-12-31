import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3'
import { generateGuid, getSizeOfDoc } from '../../commonmethods/common';

export default class DocumentUploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false
        };
    }
    pickSingleFile = async (type) => {
        let setType = DocumentPicker.types[type]
        try {
            const res = await DocumentPicker.pick({
                type: setType,
            });
            

            //Checking size using RNFB - because On Android some DocumentProviders may not provide this
            if (Math.ceil(res.size * 0.001) < 5000) {
                this.setState({ loading: true });
                let ext = res.name.split('.')[res.name.split('.').length - 1]
                let file = {
                    uri: res.uri,
                    name: generateGuid() + "." + ext,
                    type: res.type
                }
                this.uploadToAws(file)

            } else {
                Alert.alert('Please select files which are less then 5 Mb');
            }
        } catch (err) {
            this.handleError(err)
        }
    }

    async pickMultipleFiles() {
        // Pick multiple files
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
            });
            
            this.props.getFile(results)
        } catch (err) {
            this.handleError(err)
        }
    }

    uploadToAws(file) {
        let options = {
            keyPrefix: "investigationImg/",
            bucket: "prescripimage",
            region: "ap-southeast-1",
            accessKey: "AKIA2P5O2LH6PGYG3CI3",
            secretKey: "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",
            successActionStatus: 201,
            awsUrl: "s3.amazonaws.com/"
        };
        RNS3.put(file, options).then(response => {
            if (response.status == 201) {
                this.props.getFile(response.body.postResponse.key.split('/')[1])
            } else {
                alert("Failed to upload image");
            }
        });
    }

    handleError(err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
           
        } else {
            //throw err;
          
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View onPress={this.pickSingleFile.bind(this)} style={styles.contbutton}>
                    <Text style={styles.select}>Select File :</Text>
                </View>
                <TouchableOpacity onPress={this.pickSingleFile.bind(this, 'images')} style={styles.contbutton}>
                    <Text style={styles.selectType}>Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pickSingleFile.bind(this, 'pdf')} style={styles.contbutton}>
                    <Text style={styles.selectType}>Pdf</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    select: {
        color: '#333',
        fontSize: 14
    },
    selectType: {
        color: '#9d9fa2',
        fontSize: 14
    },
    container: {
        flexDirection: 'row'
    },
    contbutton: {
        borderColor: '#ebebeb',
        //borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: 100,

    }
});
