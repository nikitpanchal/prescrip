//  code by ravi
import React from 'react';
import { Container, } from "native-base";
import { StyleSheet, Dimensions, View, TouchableOpacity, FlatList, Text, Alert } from "react-native";

import AttachmentTile from '../../components/CommonComponents/AttachmentTile';
import DocumentUploader from '../../components/CommonComponents/DocumentUploader';

export default class Findings extends React.Component {
    //Setting Screen to show in Setting Option
    constructor(props) {
        super();
        this.state = {
            data: []
        };
    }

    selectFile = () => {

    }

    onFilesReceived = (files) => {
        // Steps check if selected file is exceeding the size 5 MB
        let { data } = this.state
        let filtered = data.filter(i => {
            i.name == files.name
        })
        if (filtered.length > 0) {
            Alert.alert('File is already selected ')
        } else {
            //For Now configured for one file only
            
            data.push(files)
        }
        this.setState({ data : data })
    }

    showItem(item){
        this.props.navigation.push('DocumentViewer', { item })
    }

    render() {
        return (
            <View >
                <View style={{ flexdirection: 'column', flex: 1, }}>
                    <FlatList
                        columnWrapperStyle={{justifyContent: 'space-between'}}

                        style={{ flex: 0.35}}
                        data={this.state.data}
                        numColumns={2}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        ListHeaderComponent={<View style={{ flex: 1 }}>
                            <DocumentUploader getFile={this.onFilesReceived}  />
                        </View>
                        }
                        renderItem={({ item, index }) => <AttachmentTile key={index} onPress={()=> this.showItem(item)} item={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state.data}
                    />
                </View>
            </View>
        );
    }
}


