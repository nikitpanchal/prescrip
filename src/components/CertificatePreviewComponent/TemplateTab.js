import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { prescrip, prescrip2, prescrip3, ic_selected_template } from '../../constants/images'
import { setPreviewSettingsTabIndex } from '../../actions/auth'

class TemplateTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      setIndex: -1,
      // tabData:["template 1","template 2","template 3","template 4","template 5","template 6"]
      tabData: this.props.sync.configData.certCombination

    }

  }

  getTemplatetype(item, index) {
    // this.props.setTemplateType(item)
    this.setState({ setIndex: index })
    item.map((a, i) => {
      switch (i) {
        case 0:

          this.props.screenProps.onDataChanges('header', a)

          break;

        case 1:

          this.props.screenProps.onDataChanges('body', a)


          break;

        case 2:

          this.props.screenProps.onDataChanges('footer', a)

          break;
      }

    })


  }

  itemView(index, item) {
    let imgurl = "https://prescripimage.s3.ap-southeast-1.amazonaws.com/medical-certificate-thumbs/" + item[1] + "-" + item[0] + ".png";

    return (
      <TouchableOpacity onPress={() => this.getTemplatetype(item, index)} style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#cccccc',
        flex: 0.5,
        margin: 10,
        borderWidth: 0.5
      }} >

        <Image source={this.props.previewReducer.templateData.PaperSettings.header == item[0] ? ic_selected_template : null} style={{
          alignSelf: 'flex-end',
          padding: 5, resizeMode: 'contain', height: 40, width: 40, position: 'absolute', top: 0, zIndex:1
        }} />
        <Image source={{ uri: imgurl }} style={{ resizeMode: 'contain', height: 270, width: '100%' }} />
      </TouchableOpacity>
    )
  }

  render() {
    return (

      <View style={{ flex: 1, backgroundColor : '#fff' }}>
        <FlatList
          data={this.state.tabData}
          renderItem={({ index, item }) => this.itemView(index, item)}
          keyExtractor={item => item.id}
          numColumns={2}

        />
      </View>
    )
  }

}
const mapStateToProps = state => ({
  auth: state.auth,
  certificatesTemplate: state.certificates.certCombination,
  previewReducer: state.previewReducer,
  sync: state.sync
});

const mapDispatchToProps = dispatch => ({
  setPreviewSettingsTabIndex: (tabindex) => dispatch(setPreviewSettingsTabIndex(tabindex)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateTab);
