//code by ravi

import React, { Component } from "react"
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text, BackHandler, Platform, Modal, Linking } from "react-native"
import { calculateAge } from '../../commonmethods/common';
import Images from '../../Theme/Images'
import { ic_clock, Profile_Image, ic_Add_Prescription, ic_Contact, ic_Mark_as_done, ic_Cancel_Appoointment, ic_Patient_Image, ic_whatsapp } from '../../constants/images';
import ToastComponent from '../../components/Toast/toastComponent'
import Images from '../../Theme/Images'
import Toast, { DURATION } from 'react-native-easy-toast'

export default class AppointmentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      showModal: false,
      ContactDetails: []
    }
  }
  connectPhoneCall(phoneNumber) {
    //if (Platform.OS === 'android') {
    phoneNumber = `tel:${phoneNumber}`;
    //}
    Linking.openURL(phoneNumber);

  }
  connectWhats(number) {
    Linking.openURL('whatsapp://send?phone=' + number)

  }
  makePrescription() {

    this.setState({
      showToast: true,
      description: "To be integrated later"
    })

    setTimeout(() => {
      this.setState({
        showToast: false,

      })

    }, 2000);


  }
  markAsDone(item) {
    this.setState({
      selectedIndex: 0
    });
    this.props.markAppointmentDone(item);

  }
  cancelAppointment(item) {
    this.setState({
      selectedIndex: 0
    });
    this.props.cancelAppointment(item);

  }
  showModal(index) {
    this.setState({
      selectedIndex: index,
      showModal: true,
      age: calculateAge(this.props.data[index].PatientDob),
      ContactDetails: [{
        id: '1',
        name: 'Contact via Call',
        des: this.props.data[index].From,
        colorCode: '#0065d7',
        imagePath: ic_Contact,
        ConsultationId: this.props.data[index]._id
      }, {
        id: '2',
        name: 'Contact via Whatsapp',
        des: this.props.data[index].PatientWhatsapp ? this.props.data[index].PatientWhatsapp : this.props.data[index].From,
        colorCode: '#0065d7',
        imagePath: ic_whatsapp,
        ConsultationId: this.props.data[index]._id

      }, {
        id: '3',
        name: 'Add Prescription',
        des: this.props.data[index],
        colorCode: '#000000',
        imagePath: ic_Add_Prescription,
        ConsultationId: this.props.data[index]._id

      }, {
        id: '4',
        name: 'Mark as Done',
        des: this.props.data[index],
        colorCode: '#29b62f',
        imagePath: ic_Mark_as_done,
        ConsultationId: this.props.data[index]._id

      }, {
        id: '5',
        name: 'Cancel Appointment',
        des: this.props.data[index],
        colorCode: '#e6342e',
        imagePath: ic_Cancel_Appoointment,
        ConsultationId: this.props.data[index]._id

      },
      ]
    });
  }

  handleScroll = (event) => {
    let index = Math.ceil(
      event.nativeEvent.contentOffset.y / 70
    );

    this.props.topItem(index)




  }

  renderItem(data, index) {
    let age = calculateAge(data.PatientDob);
    return (
      <TouchableOpacity style={styles.content_container} onPress={() => this.showModal(index)}>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>

          <View style={{ marginRight: 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: data.AppointmentTime == 'Walk In' ? '#3eb88a' : '#2ca4c1', borderRadius: 15, }}>

            <Text style={{ marginLeft: 10, marginRight: 10, color: '#0066D7', fontFamily: 'NotoSans-Bold', color: '#ffffff', fontSize: 18, textAlign: 'center' }}>{index < 10 ? "0" + (index + 1) : index + 1}</Text>

          </View>



          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
            <Text style={{ color: '#000000', fontSize: 20, fontFamily: "NotoSans" }}>{data.PatientName}</Text>



            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>

              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                <Text style={{ color: '#555454', fontSize: 16 }}>{age.value + " " + age.units}</Text>
                <Text style={{ color: '#555454', fontSize: 18 }}>{"  |  "}</Text>
                <Text style={{ color: '#555454', fontSize: 16 }}>{data.PatientGender}</Text>
                {

                  data.isActive ? <View style={{ marginLeft: 5, alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#E0F8E1' }}>

                    <Text style={{ marginLeft: 5, marginRight: 5, color: '#3eb88a', fontFamily: 'NotoSans', fontSize: 11 }}>{'Walk In'}</Text>

                  </View>
                    : null
                }


              </View>
            </View>


          </View>
        </View>
      </TouchableOpacity>
    );
  }

  popup_click(item, index) {
    this.setState({
      showModal: false
    })
    switch (index) {
      case 0:
        this.connectPhoneCall(item.des);
        break;
      case 1:
        this.connectWhats(item.des);
        break;
      case 2:
        this.makePrescription(item.ConsultationId)
        break;
      case 3:
        this.markAsDone(item.des);
        break;
      case 4:
        this.cancelAppointment(item.des);
        break;
        break

    }
  }
  modalOptions() {

    {
      var content = this.state.ContactDetails.map((item, index) => {
        return (

          <TouchableOpacity
            onPress={() => this.popup_click(item, index)}
            style={{ flexDirection: 'column', justifyContent: 'center' }}>

            <View style={{ backgroundColor: '#D3D3D3', height: 1, }} >
            </View>
            <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-start' }} >

              <Image style={{ width: 35, height: 35, alignSelf: 'center', }}
                source={item.imagePath} />

              <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 20, }} >

                <Text
                  style={{ fontFamily: 'NotoSans', color: item.colorCode, fontSize: 19 }}

                >{item.name}</Text>

              </View>

            </View>



          </TouchableOpacity>
        )
      })

      return content
    }


  }
  render() {
    return (
      <View style={{}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          ref={"options"}

        >
          <View style={{
            flex: 1,
            width: '100%',
            justifyContent: "flex-end",
            alignItems: "flex-end",
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>

            <TouchableOpacity onPress={() => this.setState({
              showModal: false,
            })} style={{
              paddingVertical: 8, paddingHorizontal: 10, justifyContent: 'flex-end', alignItems: 'flex-end'
            }}>
              <Text style={{ fontSize: 15, color: 'white', fontFamily: 'NotoSans-Bold', }}>Close</Text>
            </TouchableOpacity>

            <View style={{

              backgroundColor: "#ffffff",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              // padding: 20,
              width: '100%',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}>




              <View style={{ flexDirection: 'column', alignSelf: 'flex-start', width: '100%' }}>

                <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start' }} >
                  <Image style={{ width: 35, height: 35, }}
                    source={ic_Patient_Image}
                  />


                  <Text
                    style={{ marginLeft: 10, alignSelf: 'center', fontFamily: 'NotoSans-Bold', color: '#000000', fontSize: 22 }}
                  >{this.props.data.length > 0 ? this.props.data[this.state.selectedIndex].PatientName : ""}</Text>
                </View>

                <View

                  style={{
                    paddingHorizontal: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between'
                  }} >

                  <Text
                    style={{ fontFamily: 'NotoSans', color: '#3c3b3b', fontSize: 16 }}> {this.state.age != null ? this.state.age.value + " " + this.state.age.units + ' | ' + this.props.data[this.state.selectedIndex].PatientGender : ""}</Text>

                  <Text
                    style={{ fontFamily: 'NotoSans', color: '#3c3b3b', fontSize: 16 }}

                  >{this.props.data.length > 0 ? this.props.data[this.state.selectedIndex].AppointmentTime : ""}</Text>
                </View>


                <View style={{ paddingHorizontal: 20, width: '100%', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }} >

                  {/*<Text
                      style={{ fontFamily: 'NotoSans', color: '#555454', fontSize: 14 }}
  
                    >{'Txn ID: ' + this.state.pendingVCitemClickProfileData.TransID}</Text>*/}

                  {/*<Text
                      style={{ fontFamily: 'NotoSans', color: '#555454', fontSize: 14 }}
  
                    >{'Paid ' + getCurreny() + ' ' + this.state.pendingVCitemClickProfileData.AmountPaid}</Text>*/}
                </View>


                {
                  this.modalOptions()
                }


              </View>

            </View>
          </View>
        </Modal>

        <FlatList
          style={{ top: -20 }}
          data={this.props.data}
          onScroll={this.handleScroll}
          onScrollBeginDrag={() => this.props.scrollStart()}
          onScrollEndDrag={() => this.props.scrollEnd()}

          renderItem={({ item, index }) => this.renderItem(item, index)}

        />
        {
          this.state.showToast ?
            this.refs.toast.show(


              <ToastComponent
                {...this.props}

                textColorCode={"#fafbfe"}
                imagePath={Images.Info}
                description={this.state.description}

              />

              , 2000) : null
        }
        <Toast

          position='bottom'
          style={{
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            backgroundColor: '#4D99E3', borderRadius: 15
          }}
          ref="toast" />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  view_style: {
    flexDirection: "row",
    backgroundColor: '#008be0',
    height: 60
  },
  Optometry_Record: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: 'bold',
    textAlign: 'left'
  },
  step_2_5: {
    fontSize: 12,
    color: '#ffffff'
  },
  Next: {
    height: 18,
    color: "#ffffff",
    textAlign: 'center',
    resizeMode: 'contain'

  },
  content_container: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 10,

    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  content_color: {
    color: '#383838',
    fontWeight: "600",
    fontSize: 16
  },
  Next_blue: {
    height: 15,
    color: "#ffffff",
    textAlign: 'center',
    resizeMode: 'contain',

  }
});
