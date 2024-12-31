import React, { Component } from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { ic_note_delete,Attachment_clip } from "../../constants/images";

const Item = ({ data, index, remove, editItem,colorCode }) => {
    let isstring = typeof data === 'string';
    return (
        <View style={styles.cont}>
            <TouchableWithoutFeedback onPress={() => editItem(data, index,'Sourabh')}>
                <View style={styles.left}>
                    <Text style={[styles.txt1,{color :colorCode ?colorCode :'#000'}]}>{isstring ? data : data.Name}</Text>
                    {
                    data.Value || data.DataType ?
                    <Text style={styles.txt2}>{(data.Value || data.DataType)+ (data.Unit ? " ("+data.Unit+")":"") }</Text>
                    :null
                    }
                    { data.Upload && data.Upload.length >0 ? <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 3 }}>

                        <Image source={Attachment_clip} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
                        <Text style={{ color: '#969696', fontSize: 14, fontFamily: 'NotoSans' }}>{data.Upload.length + " Attachments"}</Text>

                    </View> : null} 

                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => remove(data, index)}>
                <View style={styles.cancelparent}>
                    <Image source={ic_note_delete} style={styles.cancel} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default Item



const styles = StyleSheet.create({
    cont: {
        flex: 0.4, flexDirection: 'row', paddingBottom: 10, paddingTop: 10, backgroundColor: '#fff', paddingHorizontal: 16, justifyContent: 'center', marginVertical: 8,
        borderRadius: 5,
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation:8
    },
    left : { flexDirection: 'column', flex: 0.9,paddingVertical:8 },
    txt1: { color: '#0badad', fontSize: 18, fontFamily: 'NotoSans',color:'#000' },
    txt2: { color: '#3f3e3e', fontSize: 20, fontFamily: 'NotoSans-Bold' },
    cancel: { width: 14, height: 14, resizeMode: 'contain' },
    cancelparent: { flex: 0.1, alignItems: 'center', justifyContent: 'center' }
})