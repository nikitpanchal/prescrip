import React, {Component} from 'react';
import {StatusBar,StyleSheet,View} from 'react-native';
export default class AppStatusBar extends Component{
    constructor(props){
        super()
    }
    createStatusBar =()=>{
        return (
        <View
        style={{
          backgroundColor: '#008bdf',
          height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
        }}>
        <StatusBar style={styles.statusbar}
        barStyle="light-content"
         
          
        />
      </View>
        )
    }
    render(){
        return this.createStatusBar();
            

        
    }
}
const styles=StyleSheet.create({
statusbar :{
    backgroundColor : '#008bdf',
    
}
});