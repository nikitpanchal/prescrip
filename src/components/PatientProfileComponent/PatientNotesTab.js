/* Developed by Ruban 
  on 8/10/20 */
import LottieView from 'lottie-react-native';
import React, { Component, createRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  StatusBar,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Easing,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Container, TextArea as Textarea } from "native-base";
import Voice from "@react-native-community/voice";
import {
  ic_save_note,
  ic_voice_typing,
  ic_note_calendar_time,
  ic_note_delete,
} from "../../constants/images";
import SwipeListView from "./SwipeListView";
import moment from "moment";
import { addNotes } from "../../actions/patientProfie";
import { Black_back, tooltip_Notes, clear_text } from "../../constants/images";

import Tooltip from "react-native-walkthrough-tooltip";
import AddPatient from "../../components/Tooltips";
import { Keyboard, Dimensions } from "react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
var blazing = require('../../../assets/Json/137064-recording-mic-animation.json');
export default class PatientNotesTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      inpress: false,
      note: "",
      start: false,
      clearNotes: false,
      output: "Output will appear here",
      pitch: "",
      error: "",
      end: "",
      textHeight: 60,
      started: "",
      results: [],
      partialResults: [],
      refresh: false,
      currentDateTime: null,
    };
    this.deviceWidth = Dimensions.get("window").width;
    this.deviceHeight = Dimensions.get("window").height;
    this.max_width = this.deviceWidth;
    this.max_height = (this.deviceHeight * 50) / 100;
    this.notesList = createRef();
    this.noteArray = [];
    // this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    getScreenNameAnalytics({
      screen_name: "Notes",
      screen_class: "patientNotesTab",
    });
    if (
      this.props.route.params.previous_screen == "PrintPreview" &&
      this.props.patientvisit.prescription.Notes
    ) {
      this.setState({ note: this.props.patientvisit.prescription.Notes });
    } else {
      this.setState({ note: "" });
    }
    this.getPatientNotes();
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }
  getPatientNotes() {
    this.props.patientProfile.patientDetails.CommonDetails;
    let data = {
      patient_Id: this.props.patientProfile.patientDetails._id,
      patientId: this.props.patientProfile.patientDetails.CommonDetails.id,
    };
    this.props.getNotes(data).then((response) => {
      let data = response.payload.data;
      if (data.status == 1) {
        this.noteArray = data.notes;
        this.setState({
          refresh: !this.state.refresh,
        });
      } else {
        this.noteArray = [];
      }
    });
  }

  addPatientNotes(notes) {
    let self = this;
    let data = {
      notes: notes.Notes,
      patient_Id: this.props.patientProfile.patientDetails._id,
      patientId: this.props.patientProfile.patientDetails.CommonDetails.id,
      doctorId: this.props.doctorProfile.DoctorData._id,
    };
    this.props.addNotes(data).then((response) => {
      let note = response.payload.data.newNote;
      this.noteArray.push(note);
      this.setState({ refresh: true });

      if (self.notesList && self.notesList.scrollToEnd) {
        self.notesList.scrollToEnd({ animating: false });
       
      }
    });
  }
  componentWillUnmount() {
    //destroy the process after switching the screen
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = (e) => {
    //Invoked when .start() is called without error


  };

  onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition


  };

  onSpeechError = (e) => {
    //Invoked when an error occurs.

    this.setState({
      error: JSON.stringify(e.error),
      start: false
    });
  };

  onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing

    this.setState({
      results: e.value,
      note: e.value[0], start: false
    });
  };

  onSpeechPartialResults = (e) => {
    //Invoked when any results are computed

    this.setState({
      partialResults: e.value,
      note: e.value[0]
    });
  };

  onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed

    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    //Starts listening for speech for a specific locale

    this.setState({
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
      start: true,
      inpress: true
    });

    try {
      if (this.state.note == '')
        await Voice.start("en-US");
      else
        await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
    }
  };

  _stopRecognizing = async (e) => {
    //Stops listening for speech
    try {
      this.setState({
        start: false, inpress: false

      });

      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
    }
    //this.pushNote();
  };

  _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
    }
  };

  _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
    }
    this.setState({
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
    });
  };

  clearNotes() {
    if (this.props.route.params.previous_screen == "PrintPreview") {
      this.setState({ note: "", clearNotes: true, start: false });
    } else {
      this.setState({ note: "", clearNotes: false, start: false });
    }
  }

  pushNote() {
    if (this.state.note) {
      this.getCurrentDateandTime();
    } else {
      if (
        this.props.route.params.previous_screen == "PrintPreview"
      ) {
        let data = this.props.patientvisit.prescription;
        data.Notes = "";
        this.props.setPrescription(data);
        this.setState({ clearNotes: false, start: false });
        this.props.navigation.pop();
      }
    }
  }

  addNotesToProps() {
    if (
      this.props.route.params.previous_screen == "PrintPreview" ||
      this.props.route.params.previous_screen ==
      "AdditionalAssessment"
    ) {
      let data = this.props.patientvisit.prescription;
      data.Notes = this.state.note;
      this.props.setPrescription(data);
      if (this.noteArray.length > 5) {
        setTimeout(() => {
          this.props.navigation.pop();
        }, 2000);
      } else {
        setTimeout(() => {
          this.props.navigation.pop();
        }, 700);
      }
    } else {
    }
  }

  getCurrentDateandTime() {
    this.setState(
      { currentDateTime: moment().format("h:mm A, Do MMMM YYYY") },
      () => {
        let data = {
          WhenEntered: this.state.currentDateTime,
          Notes: this.state.note,
        };
        // this.setState({ noteArray: [...this.state.noteArray, data] },()=>{

        // })

        this.addPatientNotes(data);
        this.addNotesToProps();
        // this.props.onDataChanges('Notes',this.noteArray)
        this.setState({ note: "", clearNotes: true, start: false });

        Keyboard.dismiss();
      }
    );
  }

  changeText(text) {
    this.setState({ note: text });
  }

  deleteArray(index, id, item) {
    this.props.patientProfile;
    let data = {
      noteId: id,
      DoctorId: this.props.doctorProfile.DoctorData._id,
      PatientName:
        this.props.patientProfile.patientDetails.CommonDetails.FullName,
    };
    this.props.deleteNote(data).then((response) => { });
    if (index > -1) {
      this.noteArray.splice(index, 1);
      let pdata = this.props.patientvisit.prescription;
      if (pdata.Notes == item.Notes) {
        pdata.Notes = "";
        this.props.setPrescription(pdata);
      }

      this.setState({ refresh: true });
    }
  }

  itemView(item, index) {
    return (
      <SwipeListView
        {...this.props}
        item={item}
        index={index}
        extraData={this.state.refresh}
        text={item.Notes}
        left_image={ic_note_delete}
        currentDateTime={moment(item.WhenEntered).format(
          "h:mm A, Do MMMM YYYY"
        )}
        onSwipeFromLeft={() => { }}
        onLeftPress={() => this.deleteArray(index, item._id, item)}
        titleimage={ic_note_calendar_time}
      />

      // <View style={[styles.listView, { marginLeft: 15 }]}>
      //     <View style={{ flex: 0.3, flexDirection: 'row', }}>
      //         <Image source={ic_note_calendar_time} style={{ resizeMode: 'contain', height: 12 }} />
      //         <Text style={{ fontSize: 12, fontFamily: 'NotoSans', color: '#969696' }}>{this.state.currentDateTime}</Text>

      //     </View>
      //     <View style={{ flex: 0.7, justifyContent: 'center' }}>
      //         <Text style={{ fontFamily: 'NotoSans', lineHeight: 20 }}>{item}</Text>
      //     </View>

      // </View>
    );
  }
  onHeightChange(height) {
    height = height < this.max_height ? height : this.max_height;
    this.setState({ textHeight: height });
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fafafa" }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
          <FlatList
            style={{ flex: 0.8 }}
            ref={(ref) => (this.notesList = ref)}

            data={this.noteArray}
            renderItem={({ item, index }) => this.itemView(item, index)}
            extraData={this.state.refresh}
            keyExtractor={(item, i) => i.toString()}
          />
        </View>
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row", width: Dimensions.get('screen').width, justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{


              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              flex: 0.95,
              borderBottomColor: "#cccccc",
              borderBottomWidth: 2,
              borderLeftColor: "#cccccc",
              borderRadius: 6,
              borderLeftWidth: 0.6,
              borderRightColor: "#cccccc",
              borderRightWidth: 0.6,
              backgroundColor: "#fff", borderTopWidth: 0.6, borderTopColor: "#cccccc",
            }}
          >
            {this.state.note.length > 0 ? (
              <TouchableOpacity
                onPress={() => this.clearNotes()}
                style={{
                  flex: 0.1,
                  justifyContent: "center",
                  alignSelf: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={clear_text}
                  style={{ resizeMode: "contain", height: 14, width: 14 }}
                />
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                multiline={true}
                numberOfLines={100}
                placeholder={"Type your note..."}
                placeholderTextColor={"#3d3d3d"}
                value={this.state.note}

                onChangeText={(text) => this.changeText(text)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(e) =>
                  this.onHeightChange(e.nativeEvent.contentSize.height)
                }
                style={{
                  fontSize: 16,

                  height: this.state.textHeight + 50, width: '90%',
                  fontFamily: "NotoSans",
                  alignItems: "center",
                }}
              />
            </View>
          </View>


          <TouchableOpacity

            onPress={() => {

              this.pushNote()
            }}
            style={{
              flex: 0.18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={

                ic_save_note

              }
              style={{ width: 55, height: 60, resizeMode: "contain" }}
            />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    borderBottomColor: "#cccccc",
    alignItems: "flex-start",
    margin: 15,
    borderBottomWidth: 2,
    justifyContent: "flex-start",
    padding: 10,
    borderRadius: 6,
    borderLeftColor: "#cccccc",
    borderLeftWidth: 0.6,
    borderRightColor: "#cccccc",
    borderRightWidth: 0.6,
  },
});
