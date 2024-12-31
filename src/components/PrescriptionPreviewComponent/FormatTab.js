import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import { setFormatTabData } from '../../actions/previewSettings';
import { setHeader, setFooter } from '../../actions/doctorProfile';
import {
  ic_arrow_decrease,
  ic_arrow_increase,
  ic_settings_BandW_blue_icon,
  ic_settings_BandW_white_icon,
  ic_settings_Colorprint_blue_icon,
  ic_settings_Colorprint_white_icon,
} from '../../constants/images';

class FormatTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsBW: parseInt(
        this.props.state.PaperSettings.IsBW
          ? this.props.state.PaperSettings.IsBW
          : 0,
      ),
      marginLeft: parseInt(this.props.state.PaperSettings.Margin[3]),
      marginRight: parseInt(this.props.state.PaperSettings.Margin[1]),
      marginTop: parseInt(this.props.state.PaperSettings.Margin[0]),
      marginBottom: parseInt(this.props.state.PaperSettings.Margin[2]),

      tabData: [
        {
          'Print Color': ['Color', 'B & W'],
        },
        {
          'Paper Size': ['A3', 'A4', 'A5'],
        },
        {
          'Top Margin': parseInt(this.props.state.PaperSettings.Margin[0]),
        },
        {
          'Bottom Margin': parseInt(this.props.state.PaperSettings.Margin[2]),
        },
        {
          'Left Margin': parseInt(this.props.state.PaperSettings.Margin[3]),
        },
        {
          'Right Margin': parseInt(this.props.state.PaperSettings.Margin[1]),
        },
        {
          'Header Display': ['Show', 'Hide'],
        },
        { 'Footer Display': ['Show', 'Hide'] },
        { 'Font Size': 'Large' },
      ],
      fontState: false,
      dropDownFormat: ['Small', 'Normal', 'Large', 'Extra Large'],
    };
  }

  onFontChange(size, item) {
    this.props.onDataChanges(size, item);
    this.refs.modal.close();
  }

  bindData(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.onFontChange('TemplateFontSize', item)}
        style={{ alignItems: 'center', justifyContent: 'center' ,borderBottomWidth : 1, borderColor : '#cecece'}}>
        <Text style={{ fontSize: 18, padding: 8 }}>{item}</Text>
      </TouchableOpacity>
    );
  }

  marginAdjuster(pressDown, pressUp, type) {
    if (pressDown == true && pressUp == false && type == 'Top Margin') {
      this.setState({ marginTop: this.state.marginTop - 1 }, () => {
        this.pushMargininArr();
      });
    } else if (
      pressDown == true &&
      pressUp == false &&
      type == 'Bottom Margin'
    ) {
      this.setState({ marginBottom: this.state.marginBottom - 1 }, () => {
        this.pushMargininArr();
      });
    } else if (pressDown == true && pressUp == false && type == 'Left Margin') {
      this.setState({ marginLeft: this.state.marginLeft - 1 }, () => {
        this.pushMargininArr();
      });
    } else if (
      pressDown == true &&
      pressUp == false &&
      type == 'Right Margin'
    ) {
      this.setState({ marginRight: this.state.marginRight - 1 }, () => {
        this.pushMargininArr();
      });
    } else if (pressDown == false && pressUp == true && type == 'Top Margin') {
      this.setState({ marginTop: this.state.marginTop + 1 }, () => {
        this.pushMargininArr();
      });
    } else if (
      pressDown == false &&
      pressUp == true &&
      type == 'Bottom Margin'
    ) {
      this.setState({ marginBottom: this.state.marginBottom + 1 }, () => {
        this.pushMargininArr();
      });
    } else if (pressDown == false && pressUp == true && type == 'Left Margin') {
      this.setState({ marginLeft: this.state.marginLeft + 1 }, () => {
        this.pushMargininArr();
      });
    } else if (
      pressDown == false &&
      pressUp == true &&
      type == 'Right Margin'
    ) {
      this.setState({ marginRight: this.state.marginRight + 1 }, () => {
        this.pushMargininArr();
      });
    }

    //arr.push()
  }

  pushMargininArr() {
    let arr = [
      this.state.marginTop,
      this.state.marginRight,
      this.state.marginBottom,
      this.state.marginLeft,
    ];
    this.props.onDataChanges('Margin', arr);
  }

  showHide(key, val) {
    if (key == 'Header Display') {
      this.props.setHeader(val == 'Show' ? true : false);
      this.props.onDataChanges('header', val == 'Show' ? true : false);
    }
    if (key == 'Footer Display') {
      this.props.setFooter(val == 'Show' ? true : false);
      this.props.onDataChanges('footer', val == 'Show' ? true : false);
    }
  }

  headerFooterShow(key, a) {
    // if(key=="Header Display" && this.props.state.PaperSettings['header']==0)
    // {
    //     return 1
    // }else if(key=="Header Display" && this.props.state.PaperSettings['header']>=1)
    // {
    //   return 0
    // }else if(key=="Footer Display" && this.props.state.PaperSettings['footer']==0)
    // {
    //   return 1
    // }else if(key=="Footer Display" && this.props.state.PaperSettings['footer']>=1)
    // {
    //   return 0
    // }

    if (
      key == 'Header Display' &&
      this.props.doctorProfile.showHeader &&
      a == 'Show'
    ) {
      return true;
    } else if (
      key == 'Header Display' &&
      !this.props.doctorProfile.showHeader &&
      a == 'Hide'
    ) {
      return true;
    } else if (
      key == 'Footer Display' &&
      this.props.doctorProfile.showFooter &&
      a == 'Show'
    ) {
      return true;
    } else if (
      key == 'Footer Display' &&
      !this.props.doctorProfile.showFooter &&
      a == 'Hide'
    ) {
      return true;
    }
  }

  onButtonClick(type, idx, value) {
    this.props.onDataChanges('papername', value);
  }

  fontChange() {
    var content = this.state.dropDownFormat.map((item, index) => {
      return (
        <TouchableOpacity onPress={() => this.dropDownFontChange(item)}>
          <Text
            style={{
              fontSize: 14,
              padding: 10,
              alignItems: 'center',
            
              justifyContent: 'center',
              color: '#000000',
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    });
    return content;
  }

  // set value of margin
  setmarginValue(val) {
    switch (val) {
      case 'Top Margin':
        return this.props.state.PaperSettings.Margin[0];

      case 'Bottom Margin':
        return this.props.state.PaperSettings.Margin[2];

      case 'Left Margin':
        return this.props.state.PaperSettings.Margin[3];

      case 'Right Margin':
        return this.props.state.PaperSettings.Margin[1];
    }
  }
  setColor(itm) {
    if (itm == 'B & W') {
      this.props.onDataChanges('IsBW', 1);
      this.setState({ IsBW: 1 });
    } else {
      this.props.onDataChanges('IsBW', 0);
      this.setState({ IsBW: 0 });
    }
  }

  fontnamebySize(val) {
    switch (val) {
      case '14':
        return 'Small';
      case '16':
        return 'Normal';
      case '18':
        return 'Large';
      case '20':
        return 'Extra Large';
    }
  }

  itemView(index, item) {
    let keys = Object.keys(item);

    return index == 0 ? (
      <View style={styles.case2}>
        <View style={[styles.labelTxt, { flex: 0.5, marginLeft: 25 }]}>
          <Text style={styles.textStyle}>{keys[0]}</Text>
        </View>
        {item[keys[0]].map((a, idx) => {
          return (
            <View
              style={{
                flex: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setColor(a)}
                block
                style={{
                  borderRadius: 20,
                  height: 40,
                  width: '90%',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor:
                    this.state.IsBW == 1
                      ? a == 'B & W'
                        ? '#0065d7'
                        : '#fff'
                      : a == 'Color'
                        ? '#0065d7'
                        : '#fff',
                }}>
                <View style={{
                  flex: 1, justifyContent: 'space-between', alignContent: 'center',
                  flexDirection: 'row'
                }}>
                  <Image
                    source={
                      this.state.IsBW == 1
                        ? a == 'B & W'
                          ? ic_settings_BandW_white_icon
                          : ic_settings_BandW_blue_icon
                        : a == 'Color'
                          ? ic_settings_Colorprint_white_icon
                          : ic_settings_Colorprint_blue_icon
                    }
                    style={{ resizeMode: 'contain', height: 20, width: 20, }}
                  />
                  <Text
                    style={{
                      color:
                        this.state.IsBW == 1
                          ? a == 'B & W'
                            ? '#fff'
                            : '#0065d7'
                          : a == 'Color'
                            ? '#fff'
                            : '#0065d7',
                    }}>
                    {a}
                  </Text>
                </View>

              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    ) : index == 1 ? (
      <View style={styles.case2}>
        <View style={[styles.labelTxt, { flex: 0.4, marginLeft: 25 }]}>
          <Text style={styles.textStyle}>{keys[0]}</Text>
        </View>
        {item[keys[0]].map((a, idx) => {
          return (
            <View style={styles.viewCase2}>
              <TouchableOpacity
                block
                onPress={() => this.onButtonClick(1, idx, a)}
                style={[
                  styles.btnStyle,
                  {
                    borderRadius: 20,
                    height: 40,
                    width: '90%',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor:
                      this.props.state.PaperSettings.papername == a
                        ? '#0065d7'
                        : this.props.state.PaperSettings.papername == a
                          ? '#0065d7'
                          : '#ffffff',
                  },
                ]}>
                <Text
                  style={{
                    color:
                      this.props.state.PaperSettings.papername == a
                        ? '#ffffff'
                        : this.props.state.PaperSettings.papername == a
                          ? '#ffffff'
                          : '#0065d7',
                  }}>
                  {a}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    ) : index == 2 || index == 3 || index == 4 || index == 5 ? (
      <View style={styles.case2}>
        <View
          style={[
            styles.labelTxt,
            { flex: Platform.isPad ? 0.8 : 0.6, marginLeft: 25 },
          ]}>
          <Text style={styles.textStyle}>{keys[0]}</Text>
        </View>
        <View
          style={{
            flex: Platform.isPad ? 0.2 : 0.4,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              this.marginAdjuster(true, false, keys[0]);
            }}>
            <Image
              source={ic_arrow_decrease}
              style={{ resizeMode: 'contain', height: 10, width: 10 }}
            />
          </TouchableOpacity>
          <Text style={[styles.textStyle, { marginHorizontal: 10 }]}>
            {this.setmarginValue(keys[0]) + ' mm'}
          </Text>
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              this.marginAdjuster(false, true, keys[0]);
            }}>
            <Image
              source={ic_arrow_increase}
              style={{ resizeMode: 'contain', height: 10, width: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ) : index == 6 || index == 7 ? (
      <View style={styles.case2}>
        <View style={[styles.labelTxt, { flex: 0.6, marginLeft: 25 }]}>
          <Text style={styles.textStyle}>{keys[0]}</Text>
        </View>
        {item[keys[0]].map((a, idx) => {
          return (
            <View style={styles.viewCase2}>
              <Button
                block
                onPress={() => this.showHide(keys[0], a)}
                style={[
                  styles.btnStyle,
                  {
                    backgroundColor: this.headerFooterShow(keys[0], a)
                      ? '#0065d7'
                      : '#ffffff',
                  },
                ]}>
                <Text
                  style={{
                    color: this.headerFooterShow(keys[0], a)
                      ? '#ffffff'
                      : '#0065d7',
                  }}>
                  {a}
                </Text>
              </Button>
            </View>
          );
        })}
      </View>
    ) : index == 8 ? (
      <View style={[styles.case2, { marginHorizontal: 30 }]}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.textStyle}>{keys[0]}</Text>
        </View>
        <View
          style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => this.refs.modal.open()}
            style={{ flexDirection: 'row' }}>
            <Text style={[styles.textStyle, { marginHorizontal: 8 }]}>
              {this.fontnamebySize(
                this.props.state.PaperSettings.TemplateFontSize,
              )}
            </Text>

            <Image
              source={ic_arrow_increase}
              style={{ resizeMode: 'contain', height: 15, width: 15 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.tabData}
          renderItem={({ index, item }) => this.itemView(index, item)}
          keyExtractor={(item) => item.id}
          extraData={this.state}

          ItemSeparatorComponent={this.renderSeparator}
        />
        <Modal
          useNativeDriver={true}
          animationDuration={200}
          style={{
            borderWidth: 0,
            width: '50%',
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderTopRightRadius: 20,
            height: Platform.isPad ? '40%' : '70%',
            overflow: 'hidden',
          }}
          ref={'modal'}
          swipeToClose={false}
          position={'center'}
          //swipeToClose={this.state.swipeToClose}
          onClosed={() => {
            this.close;
          }}
          onOpened={this.open}
          onClosingState={this.onClosingState}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.dropDownFormat}
              ItemSeparatorComponent={this.renderSeperator}
              renderItem={({ item, index }) => this.bindData(item, index)}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdownFont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 50,
    right: 10,
    height: 150,
    width: 120,
    zIndex: 5,
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderRightColor: '#cccccc',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  case2: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5,
  },
  labelTxt: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  textStyle: {
    color: '#000000',
    fontSize: 16,
  },
  imgStyle: {
    resizeMode: 'contain',
    height: 18,
  },
  btnStyle: {
    borderBottomColor: '#cccccc',
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 20,

  },
  rightImg: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  viewCase2: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  previewReducer: state.previewReducer,
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  setFormatTabData: (formatData) => dispatch(setFormatTabData(formatData)),
  setHeader: (data) => dispatch(setHeader(data)),
  setFooter: (data) => dispatch(setFooter(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormatTab);
