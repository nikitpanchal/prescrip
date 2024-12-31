/* Developed by Ruban 
  on 8/10/20 */
  
import React, { Component } from 'react'
import { View, Text,BackHandler } from 'react-native'
import FlatlistSearch from '../../components/FlatlistModeule/FlatlistModule'
import { icon_search_button_blue, icon_List_First_Element_Add_Button_Blue, ic_add_blue } from '../../constants/images'
import Images from '../../Theme/Images'
import { connect } from 'react-redux'
import { withDb } from "../../DatabaseContext/withDatabase";
import { updatePatientHabits,setPatientHabits} from "../../actions/patientProfie";
import multipleTapHandler from '../../components/MultiTapHandle/index';
class FlatlistSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      // enterData:{
      //  entertext:'',
      //  type:'',
      //  frequency:'',
      //  duration:''
      // },
      value : "",
      addView:false,
    }
    this.habitsArr = this.props.patientProfile.patientHabits[0].Value;
  }

  componentDidMount()
  {
    multipleTapHandler.clearNavigator()

  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
    multipleTapHandler.clearNavigator();  
    this.props.navigation.goBack(null);
    return true;
    }
  // onpress save data
//   _storeDB(sr, tbname, data) {
//     this.props.databaseContext.db.transaction((tx) => {
//      let  query =  'INSERT INTO '+ tbname + ' (_id, PatientHabits) VALUES (?,?)';
//      

//         tx.executeSql(query, [5, data], (tx, results) => {
//           
//           if (results.rowsAffected > 0) {
//             Alert.alert(
//               'Success',
//               'You are Registered Successfully',
//               [
//                 {
//                   text: 'Ok',
//                   onPress: () => navigation.navigate('HomeScreen'),
//                 },
//               ],
//               { cancelable: false }
//             );
//           } else alert('Registration Failed');
//         }
//       );
//     });

// }

//set state of search value
enterHabits(txt)
{
  // this.state.enterData["entertext"]=txt
  // this.state.enterData["type"]=""
  // this.state.enterData["frequency"]=""
  // this.state.enterData["duration"]=''

    this.setState({addView:true,value : txt})

}

//on click add button
addItemFun()
{
  let dbData=this.props.patientProfile.patientHabits[0];
  let habit=[];

  habit.push(this.state.value);
  this.habitsArr.push(habit);
  dbData.Value=this.habitsArr;
  
  this.props.patientProfile.patientHabits[0]=dbData;
  this.props.updatePatientHabits(this.props.patientProfile.patientHabits);
  this.setState({addView:false})
  
}
getHabits(){
  let habits=this.props.patientProfile.patientHabits[0].Value.map(item=>{
return item[0]
  });
  return habits;
}
  render() {
    return (
      <FlatlistSearch {...this.props}
        leftImage={Images.ic_black_back}
        rightImage={icon_search_button_blue}
        searchTitle={"Search for habit"}
        type ={"Habit"}
        searchText={(txt) => this.enterHabits(txt)}
        enterText={this.state.value}
        patientData={this.props.patientProfile.habits}
        subTitle={"Add as Habit"}
        filterData={this.getHabits()}
        backPress={()=>this.handleBackButtonClick()}
        addImage={ic_add_blue}
        addView={this.state.addView}
        addImgClick={() => this.addItemFun()}
      />
    )
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  patientProfile:state.patientProfile
});

const mapDispatchToProps = dispatch => ({
  updatePatientHabits : (patientHabits)=>dispatch(updatePatientHabits(patientHabits)),
  setPatientHabits : (habits)=>dispatch(setPatientHabits(habits)),


});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(FlatlistSearchContainer));