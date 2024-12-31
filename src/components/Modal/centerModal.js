import React, { Component } from "react";
import { View, Text, Button, Icon } from "native-base";
import { TouchableOpacity, FlatList, Image, Modal } from "react-native";
import { connectModal } from "redux-modal";
import styles from "./styles";
import { ic_Close_Button, } from '../../constants/images'


export default class CenterModal extends Component {
  constructor(props) {
    super(props);
    //  this.state = {};
  }


  Item(data, index) {

    return (

      <TouchableOpacity
        onPress={() => { this.props.modalResultValue(data) }}
        style={{ padding: 10, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: 'NotoSans', color: '#000' }}>{data}</Text>
      </TouchableOpacity>
    )

  }

  renderSeperator() {
    return (
      <View style={{ height: 1, backgroundColor: '#cdcdcd' }}></View>
    )
  }

  render() {
    const { show, handleHide, header, data, onPress } = this.props;
    return (


      <Modal
        // backdrop={true}
        //backdropPressToClose={false}
        //animationType="slide"
        transparent={true}
        coverScreen={show}
        // isOpen={true}
        position={'center'}

        visible={show}
        // ref={"modalCity"}
        onRequestClose={() => {
        }}
      // onClosed={() => {this.props.modalResultValue('select')}}

      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0,0,0,0.7)',

        }}>




          <View style={{

            backgroundColor: "#ffffff",
            borderRadius: 8,
            // padding: 20,
            alignItems: "center",
            width: '90%',

            flex: 0.6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}>

            <TouchableOpacity onPress={() => { this.props.modalResultValue('cross') }}
              style={{
                alignSelf: 'flex-end',
                position: 'absolute', top: -10, right: -11,
                elevation: 12, zIndex: 1,
              }}>
              <Image source={ic_Close_Button} style={{ height: 23, width: 23, resizeMode: 'contain', }} />
              {/* <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text> */}
            </TouchableOpacity>

            <View style={{ flex: 1, alignContent: 'center', alignSelf: 'center' }}>

              <View style={{ borderBottomWidth: 1, borderBottomColor: '#ededed', flexDirection: 'row', paddingVertical: 15, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start' }} >


                <Text
                  style={{ paddingStart: 15, textAlign: 'center', fontFamily: 'NotoSans-Bold', color: '#3c3c3c', fontSize: 22, flex: 1 }}
                >{header}</Text>
              </View>



              <FlatList

                keyExtractor={(item, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                data={data}
                ItemSeparatorComponent={this.renderSeperator}
                renderItem={({ item, index }) => this.Item(item, index)} />
            </View>
          </View>
        </View>
      </Modal>
    );

  }
}
