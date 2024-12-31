import React from 'react';
import { View, TouchableOpacity, StatusBar, Text, Image, Dimensions, TextInput, FlatList, StyleSheet } from 'react-native';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';

export default class ItemPickerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    itemView(item, index) {
        return (
            <TouchableOpacity onPress={() => this.props.itemSelected(item)} style={{ justifyContent: 'center', padding: 20, borderBottomColor: '#cccccc', borderBottomWidth: 0.7 }}>
                <Text style={{ fontSize: 20, fontFamily: NotoSans }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 , width: Dimensions.get('window').width}}>
                <View style={{ paddingHorizontal: 9, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 2, paddingBottom: 8 }} >
                    <TouchableOpacity onPress={this.props.backPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={this.props.leftImage} style={{ resizeMode: 'contain', height: 20 }} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1, paddingHorizontal: 6, }} >
                        <View style={{ flex: 0.9, }} >
                            <Text style={{ fontSize: 11, color: '#919191', fontFamily: 'NotoSans', textTransform: 'uppercase' }}>{this.props.searchTitle}</Text>

                            <TextInput
                                //autoCompleteType={false}
                                autoCorrect={false}
                                placeholder={"Search for " + this.props.type}
                                onChangeText={this.props.searchText}
                                style={styles.searchinput}
                            />
                        </View>
                        <View>
                            <Image source={this.props.rightImage} style={{ height: 20, width: 20, resizeMode: 'contain', }} />
                        </View>
                    </View>
                </View>
                {/* <View style={{ flex: 0.1, borderBottomColor: '#cccccc', borderBottomWidth: 2, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.props.backPress} style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.leftImage} style={{ resizeMode: 'contain', height: 20 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7,backgroundColor:'pink',padding:0,margin:0}}>
                            <Text style={{ fontFamily: NotoSans, color: '#616161', textTransform: 'uppercase', fontSize: 12 }}>{this.props.searchTitle}</Text>
                            <TextInput
                                //autoCompleteType={false}
                                autoCorrect={false}
                                placeholder={"Search for "+this.props.type}
                                onChangeText={this.props.searchText}
                                style={{ fontSize: 20,fontFamily: NotoSans,includeFontPadding:false,alignContent:'flex-start',padding:0}} />
                        </View>
                      
                        <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={this.props.rightImage} style={{ resizeMode: 'contain', height: 18,width:18 }} />
                        </View>
                    </View>
                </View> */}

                {this.props.enterText && this.props.addView ?

                    <View style={{ flexDirection: 'column', backgroundColor: '#f1f1f1', }}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1, backgroundColor: '#fff', paddingStart: 8, paddingVertical: 18 }}>
                            <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1 }} >
                                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, }}>
                                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', paddingRight:5,flex: 1 }} >
                                        <Text style={{ fontSize: 24, color: '#0065d7', fontFamily: 'NotoSans-Bold', }}>{this.props.enterText}</Text>
                                        <Text style={{ fontSize: 11, color: '#0065d7',fontFamily: 'NotoSans', paddingTop: 5 }}>{this.props.subTitle}</Text>
                                    </View>
                                    <TouchableOpacity  onPress={this.props.addImgClick}  >
                                    <Image source={this.props.addImage} style={{ resizeMode: 'contain', height: 25 ,width:25}} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>

                    : null}
                <View style={{ flex: 0.78 }}>
                    <FlatList
                        data={this.props.data}
                        renderItem={({ item, index }) => this.itemView(item, index)}
                        keyExtractor={(item, i) => i.toString()}
                    />
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    cont: { flex: 0.4, flexDirection: 'column', paddingBottom: 10, paddingTop: 10, backgroundColor: '#fafafa' },
    first: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', paddingHorizontal: 14, paddingBottom: 14, borderBottomColor: '#dedede', borderBottomWidth: 2 },
    searchinput: { includeFontPadding: false, letterSpacing: 0.3, textAlign: 'justify', fontSize: 20, color: "#242424", padding: 0 },
    suggest_lab_view: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 30 },
    flat: { paddingHorizontal: 10, flex: 1, },
    suggest_pink_image: { height: 15, width: 15, resizeMode: 'contain' },
    suggest_pink_image_ref: { height: 9, width: 9, resizeMode: 'contain', marginTop: 2 },
    suggestion_laboratory_text: { fontSize: 15, color: '#f21c68', fontFamily: 'NotoSans', paddingStart: 5 },
})