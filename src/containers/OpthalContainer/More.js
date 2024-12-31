import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StatusBar,Dimensions } from 'react-native';
 
import multipleTapHandler from '../../components/MultiTapHandle/index';
import PrescriptionWebViewHeader from '../../components/Header/PrescriptionWebViewHeader'
import Images from '../../Theme/Images'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Picker from "../../components/Module/Picker";
import { lefticon, righticon } from "../../constants/images";
import { blue_indropdown, blue_dropdown } from "../../constants/images";
import { setOpthalListData, setOpthalData } from '../../actions/opthal';
import { withDb } from "../../DatabaseContext/withDatabase";
var r1 = null;
class More extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenModal: false,
      showMore: this.props.from ? true : false
    }
  }

  componentDidMount() {
    this.setData();
  }

  setData() {
    this.props.databaseContext.db.transaction((tx) => {

      tx.executeSql("SELECT Data FROM MasterData where Srno = 16", [], (tx, results) => {
        if (results.rows.length > 0) {
          let opthal = JSON.parse(results.rows.raw()[0].Data).Value[0];

          this.props.setOpthalData(opthal)
        }
      }, (error) => {

      });
    });
  }

  _selectPicker = (data) => {
    this.setState({ isOpenModal: !this.state.isOpenModal })
  }


  OnClick() {
    multipleTapHandler.clearNavigator()
    this.props.navigation.goBack()
  }

  render() {
    const self = this;
    var { more } = this.props.opthal;
    return (
      <View
        style={{ backgroundColor: '#ffffff', width:Dimensions.get('window').width , height : Dimensions.get('window').height }}>
        <StatusBar barStyle="dark-content" hidden={false} translucent={true} backgroundColor="#fff" />
        {/*Header*/}

        <PrescriptionWebViewHeader
          {...this.props}
          bgImage={null}
          bgColor={'#ffffff'}
          title={null}
          isShowTitle={false}
          description={"More"}
          descriptionColor={'#636363'}
          leftImage={Images.ic_black_back}
          rightImage={null}
          secondRightImage={null}
          callFrom={'opthal'}
          issecondRightImage={false}
          OnClick={(callFrom) => this.OnClick(callFrom)}
        />
        <ScrollView style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
          {
            more && more.map(i => {
              //header, label, data, selected
              return <Picker section={"more"} screen={"more"} {...this.props} onPress={this._selectPicker} navigation={this.props.navigation} label={i.label} data={i.Value} style={{ marginBottom: 30 }} />
            })
          }
        </ScrollView>
      </View>
    );
  }
}

More.propTypes = {
  auth: PropTypes.object,
  opthal: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,

  opthal: state.opthal,
});

const mapDispatchToProps = dispatch => ({
  setOpthalListData: (data) => dispatch(setOpthalListData(data)),
  setOpthalData: (data) => dispatch(setOpthalData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(More));
