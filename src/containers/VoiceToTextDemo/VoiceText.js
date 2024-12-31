import React from 'react';
import { Button, Text, Container, Input } from 'native-base';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ic_blue_mic, icon_search_button_blue } from '../../constants/images';
import Voice from '@react-native-community/voice';
export default class VoiceToTextContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: false,
      output: 'Output will appear here',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    }

  }
  componentDidMount() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }
  componentWillUnmount() {
    //destroy the process after switching the screen 
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    //Invoked when .start() is called without error

    this.setState({
      started: '√',
    });
  };

  onSpeechEnd = e => {
    //Invoked when SpeechRecognizer stops recognition

    this.setState({
      end: '√',
    });
  };

  onSpeechError = e => {
    //Invoked when an error occurs. 

    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    //Invoked when SpeechRecognizer is finished recognizing

    this.setState({
      results: e.value,
    });
  };

  onSpeechPartialResults = e => {
    //Invoked when any results are computed

    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    //Invoked when pitch that is recognized changed

    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
      start: true
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line

    }
  };

  _stopRecognizing = async () => {
    //Stops listening for speech
    try {
      this.setState({
        start: false
      })
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line

    }
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
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  }
  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Voice to Text Demo</Text>
          <TouchableOpacity onPress={this.state.start ? this._stopRecognizing : this._startRecognizing} style={{ padding: 10 }}>
            <Image source={ic_blue_mic} style={{ width: 50, height: 50 }} resizeMode="contain"></Image>
          </TouchableOpacity>
          <Text style={{ padding: 10 }}>{JSON.stringify(this.state.partialResults)}</Text>
        </View>
      </View>
    )
  }
}