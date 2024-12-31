import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ParentTab from './ParentTab';
import { connect } from 'react-redux';
import {
  Finish_Outline_Button,
  Print_Gradient_Button,
} from '../../constants/images';

class PrescriptionPreviewFooter extends Component {
  render() {
    //Finish_Outline_Button
    return (
      <View
        style={[styles.container, { flex: this.props.type == 2 ? 0.05 : 0.1 }]}>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', zIndex:1 }}
          onPress={this.props.onClickDraft}>
          {this.props.type == 2 || (this.props.doctorProfile.DoctorData.IsAssistant == 1 ) ? (
            <View
              style={[styles.btn1Style, { height: Platform.isPad ? 60 : 40 }]}>
              <Text style={styles.btnTextStyle}>{this.props.btnText1}</Text>
            </View>
          ) : (
            <ImageBackground
              source={Finish_Outline_Button}
              style={[styles.btn3Style, { height: Platform.isPad ? 60 : 40 }]}>
              <Text style={styles.btnTextStyle}>{this.props.btnText1}</Text>
            </ImageBackground>
          )}
        </TouchableOpacity>
        {this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
          this.props.doctorProfile.DoctorData.RoleId == 3 ?
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'flex-end' }}
            onPress={this.props.onClickFinish}>
            {this.props.type == 2  ? (
            <LinearGradient
              colors={['#1b7cdb', '#07cef2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.8]}
              style={[styles.btn2Style, { height: Platform.isPad ? 60 : 40 }]}>
              <Text style={styles.btnTextStyle2}>{this.props.btnText2}</Text>
            </LinearGradient>
            ) : (
            <ImageBackground
              source={Print_Gradient_Button}
              style={[styles.btn3Style, { height: Platform.isPad ? 60 : 40 }]}>
              <Text style={styles.btnTextStyle2}>{this.props.btnText2}</Text>
            </ImageBackground>
            )}
          </TouchableOpacity> : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  previewReducer: state.previewReducer,
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrescriptionPreviewFooter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  btn1Style: {
    width: '100%',

    borderColor: '#08c9f1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn2Style: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },

  btn3Style: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },

  btnTextStyle: {
    textTransform: 'uppercase',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 15,
    color: '#166dd8',
    fontFamily: 'NotoSans-Bold',
    position: 'absolute',
  },
  btnTextStyle2: {
    textTransform: 'uppercase',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 15,
    color: '#ffffff',
    fontFamily: 'NotoSans-Bold',
  },
});
