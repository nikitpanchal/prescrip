import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Picker from "../../components/Module/Picker";
import { blue_indropdown, blue_dropdown, ic_note_delete } from "../../constants/images";
import { setOpthalListData, setOpthalData } from '../../actions/opthal';
import { withDb } from "../../DatabaseContext/withDatabase";
var r1 = null;
class LeftEye extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenModal: false,
      refresh: false,
      showMore: this.props.from ? true : false
    }
  }

  componentDidMount() {
   // this.setData();
  }

  setData() {
    this.props.databaseContext.db.transaction((tx) => {

      tx.executeSql("SELECT Data FROM MasterData where Srno = 16", [], (tx, results) => {
        if (results.rows.length > 0) {
          let opthal = JSON.parse(results.rows.raw()[0].Data).Value[0];

          this.props.setOpthalData(opthal);
          this.setState({
            refresh: true
          })
        }
      }, (error) => {

      });
    });
  }

  getSphereNearValues(start, end) {
    var x = start
    for (var i = 0; i < end * 2; i++) {
      x = x + 0.5;
    }
    return x
  }

  getSphereDistanceValues(start, end) {
    var x = start
    for (var i = 0; i < end * 2; i++) {
      x = x + 0.5;
    }
    return x
  }


  getData(row) {
    const self = this;
    var { spectacle_prescription } = this.props.opthal.lefteye;
    return spectacle_prescription.Columns.map(column => {
      var r = null;
      if (self.props.opthal.selecteddata.lefteye["spectacle_prescription"]) {
        //self.props.opthal.selecteddata.lefteye["spectacle_prescription"] = {};
        if (self.props.opthal.selecteddata.lefteye["spectacle_prescription"][row])
          r = self.props.opthal.selecteddata.lefteye["spectacle_prescription"][row][column];
      }
      if (self.props.from) {
        if (self.props.opthal.selecteddata.righteye["spectacle_prescription"]) {
          //self.props.opthal.selecteddata.lefteye["spectacle_prescription"] = {};
          if (self.props.opthal.selecteddata.righteye["spectacle_prescription"][row])
            r1 = self.props.opthal.selecteddata.righteye["spectacle_prescription"][row][column];
        }
        return <View style={[{ flex: (column != "" ? 1 : 1.5), borderBottomWidth: (column != "" ? 1 : 0), borderColor: "#dcdcdc", height: 30, marginHorizontal: 3, marginVertical: 10, justifyContent: "center", alignItems: (column != "" ? "center" : "flex-start") }, self.props.from && { borderBottomWidth: 0 }]}>
          <Text style={{ color: '#929292', fontSize: 13 }}>{(column != "" ? ((r1 && r1 != "" ? r1 : "-") + " / " + (r && r != "" ? r : "-")) : row)}</Text>
        </View>
      } else {

        return <TouchableOpacity onPress={() => { this._toggleModal(row, column,"toggle") }} style={[{ flexDirection: 'row', flex: (column != "" ? 1 : 1.5), borderBottomWidth: (column != "" ? 1 : 0), borderColor: "#dcdcdc", height: 30, marginHorizontal: 3, marginVertical: 10, justifyContent: "center", alignItems: (column != "" ? "center" : "flex-start") }]}>
          <Text style={{ color: '#929292', fontSize: 13 }}>{column != "" ? (r && r != "" ? r : (r == 0 ? r : "-")) : row}</Text>
          {
            (r && r != "") || (r == 0) ?
              <TouchableOpacity
              onPress={() => { this._toggleModal(row, column,"remove") }}
              style ={{margin :10}}
              >
                <Image style={{ justifyContent: 'center', height: 10, width: 10, resizeMode: 'contain',}} source={ic_note_delete} />

              </TouchableOpacity>

              : null

          }

        </TouchableOpacity>



      }

    })
  }


  selectData(item) {
    const { header, screen, section } = this.props.opthallist;
    var { selecteddata } = this.props.opthal;
    var column = header.split(" / ");
    if (screen != "more") {
        if (!selecteddata[screen][section]) {
            selecteddata[screen][section] = {};
        }

        if (!selecteddata[screen][section][column[0]])
            selecteddata[screen][section][column[0]] = {}
    }
    if (column.length > 1) {
        //For Grid Data
        if (column.join("_") == "Near_Sphere") {
            var x = selecteddata[screen][section]["Distance"];  
            if (true) {

                //x && (x["Sphere"] ? 1 :  x["Sphere"] ==0 ? 1 :0 :0 ) 
                if (!selecteddata[screen][section][column[0]]) {
                    selecteddata = selecteddata[screen][column[0]]
                }
                if(selecteddata[screen][section][column[0]][column[1]]){
                    selecteddata[screen][section][column[0]][column[1]] = parseFloat(selecteddata[screen][section]["Distance"]) ? parseFloat(selecteddata[screen][section]["Distance"]["Sphere"]) + item: item
                }else{
                    selecteddata[screen][section][column[0]][column[1]] = item

                }  
                this.props.setOpthalData({ selecteddata });
               // this.onBack();
            } else {
                Alert.alert("Please add Sphere Distance to select Sphere Near")
            }
        } else if (column.join("_") == "Distance_Cylinder" || column.join("_") == "Near_Cylinder") {
            var x = selecteddata[screen][section]["Distance"];
            var y = selecteddata[screen][section]["Near"];
            if (!y) {
                selecteddata[screen][section]["Near"] = {}
            }
            if (!x) {
                selecteddata[screen][section]["Distance"] = {}
            }
            selecteddata[screen][section]["Distance"]["Cylinder"] = item;
            selecteddata[screen][section]["Near"]["Cylinder"] = item;
            this.props.setOpthalData({ selecteddata });
          //  this.onBack();

        } else if (column.join("_") == "Distance_Axis" || column.join("_") == "Near_Axis") {
            var x = selecteddata[screen][section]["Distance"];
            var y = selecteddata[screen][section]["Near"];
            if (!y) {
                selecteddata[screen][section]["Near"] = {}
            }
            if (!x) {
                selecteddata[screen][section]["Distance"] = {}
            }
            selecteddata[screen][section]["Distance"]["Axis"] = item;
            selecteddata[screen][section]["Near"]["Axis"] = item;
            this.props.setOpthalData({ selecteddata });
          //  this.onBack();
        }
        
        else if (column.join("_") == "Distance_Sphere") {
          selecteddata[screen][section][column[0]][column[1]] = item

          if(selecteddata[screen][section]["Near"] && selecteddata[screen][section]["Near"]["Sphere"])
          if(selecteddata[screen][section]["Near"] && (selecteddata[screen][section]["Near"]["mainValue"] ? true:selecteddata[screen][section]["Near"]["mainValue"] == 0  ? true :false) )
          {
              selecteddata[screen][section]["Near"][column[1]] =  parseFloat(selecteddata[screen][section]["Near"]["mainValue"])
          }  
          
          this.props.setOpthalData({ selecteddata });
         // this.onBack();
      } 
      
        else {

            selecteddata[screen][section][column[0]][column[1]] = item
            this.props.setOpthalData({ selecteddata });
           // this.onBack();
        }
    } else if (screen == "more") {
        //For Normal Pickers
        selecteddata[screen][column[0]] = item;
        this.props.setOpthalData({ selecteddata });
      //  this.onBack();

    } else {
        //For Normal Pickers
        selecteddata[screen][section][column[0]] = item;
        this.props.setOpthalData({ selecteddata });
    //    this.onBack();
    }

    this.setState({
      refresh :true
    })
}


  _toggleModal(row, column,callFrom) {
    var { spectacle_prescription } = this.props.opthal.lefteye;
    var data = spectacle_prescription[row][column];
    this.props.setOpthalListData({ header: row + " / " + column, row, column, screen: "lefteye", section: "spectacle_prescription", data });
    
    if(callFrom =="toggle")
    {
      this.props.navigation.navigate('OpthalList')
    }else{


     setTimeout(() => {
        this.selectData()
    }, 200);
     
    }


  }

  _selectPicker = () => {
    this.setState({ isOpenModal: !this.state.isOpenModal })
  }

  toggleShowMore() {
    this.setState({ showMore: !this.state.showMore })
  }

  render() {
    const self = this;
    var { visual_acuity, spectacle_prescription } = this.props.opthal.lefteye;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#eee" }}>
        <View style={[{ flex: 1, paddingHorizontal: 15, backgroundColor: "#fff" }, this.props.from && { paddingHorizontal: 0 }]}>
          <View style={{ flex: 1, paddingVertical: 20, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#404040", }}>Visual Acuity</Text>
          </View>
          {/* <View style={{ flexDirection: this.props.from ? "row" : "column" }}> */}
          {
            visual_acuity && visual_acuity.map(i => {
              //header, label, data, selected
              return <Picker section={"visual_acuity"} screen={"lefteye"} {...this.props} onPress={this._selectPicker} navigation={this.props.navigation} label={i.label} data={i.Value} style={{ marginBottom: 30 }} />
            })
          }
          {/* </View> */}
        </View>
        <View style={[{ flex: 1, paddingHorizontal: 15, backgroundColor: "#fff", }, this.props.from && { paddingHorizontal: 0 }]}>
          <View style={{ flex: 1, paddingVertical: 15, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#404040", }}>Spectacle Prescription</Text>
          </View>
          <View style={{ flexDirection: "row", }}>
            {
              spectacle_prescription && spectacle_prescription.Columns.map(i => {
                return <View style={{ flex: (i != "" ? 1 : 1.5), justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: '#929292', fontSize: 13 }}>{i}</Text>
                  {self.props.from ? <Text style={{ color: '#929292', fontSize: 11 }}>{i != "" ? "RE/LE" : ""}</Text> : null}
                </View>
              })
            }

          </View>

          <View style={{ flexDirection: "column", flex: 1 }}>
            {
              spectacle_prescription && spectacle_prescription.rows.map((row, index) => {
                return <View style={{ flex: 1, flexDirection: "row", }}>
                  {this.getData(row)}
                </View>
              })
            }
          </View>
        </View>
      </ScrollView>
    );
  }
}

LeftEye.propTypes = {
  auth: PropTypes.object,
  opthal: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  patientvisitdetails: state.patientvisitdetails,
  opthal: state.opthal,
  opthallist: state.opthallist,

});

const mapDispatchToProps = dispatch => ({
  setOpthalListData: (data) => dispatch(setOpthalListData(data)),
  setOpthalData: (data) => dispatch(setOpthalData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(LeftEye));
