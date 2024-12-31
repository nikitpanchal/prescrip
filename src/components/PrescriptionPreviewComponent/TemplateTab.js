import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback, Platform } from 'react-native'
import { connect } from 'react-redux'
import { prescrip, prescrip2, noimage, ic_selected_template } from '../../constants/images'
import { setPreviewSettingsTabIndex } from '../../actions/auth'

class TemplateTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      setIndex: -1,

      // tabData:["template 1","template 2","template 3","template 4","template 5","template 6"]
      tabData: this.props.sync.configData.templateCombination

    }
    this.templateData = [this.props.doctorProfile.DoctorData.PaperSettings.header,
    this.props.doctorProfile.DoctorData.PaperSettings.body,
    this.props.doctorProfile.DoctorData.PaperSettings.footer]
    this.dim = Dimensions.get('screen')
  }

  getTemplatetype(item, index) {
    // this.props.setTemplateType(item)

    item.map((a, i) => {
      switch (i) {
        case 0:

          this.props.onDataChanges('header', a)

          break;

        case 1:

          this.props.onDataChanges('body', a)


          break;

        case 2:

          this.props.onDataChanges('footer', a)

          break;
      }

    })


  }

  setTemplateTick(keys, item) {
    if (this.state.setIndex < 0) {
      return JSON.stringify(this.templateData) == JSON.stringify(item)
    }
    else {
      return this.state.setIndex == keys
    }
  }

  itemView(index, item) {
    let imgurl = "https://prescripimage.s3.ap-southeast-1.amazonaws.com/rx-template-thumbs/" + item[1] + "-" + item[0] + ".png"
    let keys = Object.keys(this.state.tabData)
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ setIndex: index }, () => {
        this.getTemplatetype(item, index)
      })}  >
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 0.5,
          margin: 10,
          borderColor: '#cccccc',
          borderWidth: 0.5, borderRadius : 5
        }}>
          <Image source={this.setTemplateTick(parseInt(keys[index]), item) ? ic_selected_template : noimage} style={{
            alignSelf: 'flex-end', position: 'absolute', top: 0, zIndex: 1,
            resizeMode: 'contain', height: 40, width: 40,
          }} />
          <Image source={{ uri: imgurl }} style={{
            resizeMode: 'contain', height: Platform.isPad ?
              (this.dim.height <= this.dim.width ? 700 : 480) : 270, width: Platform.isPad ? '92%' : '100%' 
          }} />
        </View>


      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (

      <View style={{ flex: 1, backgroundColor:'#fff' }}>
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
