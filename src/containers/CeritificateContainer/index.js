import React from 'react';
import { View, SafeAreaView, StatusBar, Text, Image, BackHandler } from 'react-native';
import { NotoSans, NotoSans_BoldItalic, NotoSans_Italic, NotoSans_Bold } from '../../constants/font';
import { Container } from 'native-base';
import Images from '../../Theme/Images'

import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader'
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { withDb } from "../../DatabaseContext/withDatabase";
import { connect } from "react-redux";
import CertificateList from '../../components/Certificate/CertificateList';
import { setCertificateType, clearCertificate } from '../../actions/certificates';

class SelectCertificate extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {

    }
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator()

  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
  OnClick(callFrom) {


    switch (callFrom) {
      case 'left':
        multipleTapHandler.clearNavigator(),
          this.props.navigation.goBack()
        break;

      case 'right':
        multipleTapHandler.clearNavigator(),
          ToastAndroid.show(
            'Implementation in progress',
            ToastAndroid.LONG,
          );
        break;

      case 'secondRight':
        multipleTapHandler.clearNavigator(),
          ToastAndroid.show(
            'Implementation in progress',
            ToastAndroid.LONG,
          );
        break;

      default:
        break;
    }

  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={'#ffffff'}
          isShowTitle={true}
          title={"ISSUE CERTIFICATE TO " + this.props.patientvisit.patientDetails.CommonDetails.FullName.toUpperCase()}
          description={"Select Template"}
          titleColor={'#919191'}
          descriptionColor={'#0065d7'}
          leftImage={Images.ic_black_back}
          rightImage={""}
          secondRightImage={""}


          OnClick={(callFrom) => this.OnClick(callFrom)}


        />
        <CertificateList
          {...this.props}></CertificateList>

      </View>
    )
  }
}
const mapStateToProps = state => ({

  patientvisit: state.patientvisit,
  doctorProfile: state.doctorProfile,
  certificates: state.certificates

});
const mapDispatchToProps = dispatch => ({
  setCertificateType: (certificate) => dispatch(setCertificateType(certificate)),
  clearCertificate: () => dispatch(clearCertificate()),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(SelectCertificate));