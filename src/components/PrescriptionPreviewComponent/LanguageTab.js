import React,{Component} from 'react'
import {View,Text,TouchableOpacity,Image, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {setPreviewSettingsTabIndex} from '../../actions/auth'
import { drop_up, ic_delete_time } from '../../constants/images'
import { ic_clock,ic_selected_language_notification} from '../../constants/images'
import { FlatList } from 'react-native-gesture-handler'

class LanguageTab extends Component{
    constructor(props)
    {
        super(props)
        this.state={
            tabData:['Hindi','English','Marathi','Tamil','Sanskrit','Telugu','Malayalam','Kannada','Punjabi','Gujarati','Urdu','Odia']
        }

    }

    itemView(index,item)
    {
      return(
        <TouchableOpacity onPress={() => this.props.onDataChanges('Language', item.Name)}>
        <View style={styles.case3and4}>
            <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 12 }}>
                <Text style={styles.textStyle}>{item.Name}</Text>
            </View>
            <View style={styles.rightImg}>
                <Image source={(this.props.state.Language==item.Name?ic_selected_language_notification:null)} style={styles.imgStyle} />
            </View>
        </View>
    </TouchableOpacity >
      )
    }
    //
    render()
    {
      
        return(
           <FlatList 
           data={this.props.languages}
           renderItem={({index,item})=>this.itemView(index,item)}
           ItemSeparatorComponent={this.renderSeperator}
           extraData={this.state}
           />
        )
    }
    

}

const styles = StyleSheet.create({
  case3and4: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.5
},
rightImg: {
  flex: 0.1,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12
},
textStyle: {
  color: '#444444',
  fontSize: 16
},
imgStyle: {
  resizeMode: 'contain',
  height: 18
},
})
const mapStateToProps = state => ({
    auth: state.auth,

  });
  
  const mapDispatchToProps = dispatch => ({
    setPreviewSettingsTabIndex: (tabindex) => dispatch(setPreviewSettingsTabIndex(tabindex)),
  })

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(LanguageTab);
