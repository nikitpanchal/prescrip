//Created by Pritish on 5/09/2020
//Custom UI for Dose of selected medicine
import React,{Component} from 'react';
import Capsule from '../Capsule';
import {View,FlatList,TouchableOpacity,TextInput,Alert,Image,Text} from 'react-native';
import {NotoSans,NotoSans_BoldItalic,NotoSans_Italic,NotoSans_Bold} from '../../constants/font';

import {ic_blue_search,Add_blue_btn,empty_vc} from '../../constants/images';
import EmptyHomePrescrip from '../../components/EmptyHome/EmptyHomePrescrip'
import _ from 'lodash';
var dosageForm="";
export default class Dose extends Component{
    constructor(props){
        super(props);
        this.state={
            add : false,
            newDose : false,
            txtDose :"",
           

            
           
doses : this.props.dosage.medicine.brand[2].length>0?this.props.dosage.medicine.brand[2].split(','):[]
        }
        this.dbData=null;
        this.arrDoses=[];
        this.mostUsed=[];
        this.Brands=[];
        this.masterData=[];
        this.Doses=this.props.dosage.medicine.brand[2].length>0?this.props.dosage.medicine.brand[2].split(','):[];
    }
    componentDidMount(){
        this.Doses=this.props.dosage.medicine.brand[2].length>0?this.props.dosage.medicine.brand[2].split(','):[];
        this.Doses=this.Doses.filter(d=>{
            if(d!=""){
                return d
            }
        })
        this.mostUsed=this.props.dosage.medicine.MostUsed.length>0?this.getMostUsed():[];
        this.getDbMedecine();
        dosageForm=this.props.dosage.medicine.form[0];
        this.getBrandName(this.props.dosage.medicine.form[1]);
    }
    getMostUsed(){
        let item=this.props.dosage.medicine.MostUsed.find(brand=>{
            if(brand.BrandName.trim().toLowerCase()==this.props.dosage.medicine.brand[1].trim().toLowerCase()){
                return brand;
            }
        })
        let suggested=[];
        if(item){
        suggested=_.orderBy(item.Dose,[dose=>dose[1]],['asc']);
        }
       
       
    suggested.map((s)=>{
        let doses=this.Doses;
        this.Doses.forEach(function (item, i) {
            item.trim();
            if (item === s[0]) {
                
                doses.splice(i, 1);
                doses.unshift(item);
            }
            });
            this.Doses=doses;
            doses=null;


    })
    let len=suggested.length?suggested.length:this.Doses.length;
suggested=null;

this.setState({
    doses: this.Doses//.slice(0,len)
})        

    }
    searchDoses(txt){
        if(txt){
            let searchData=this.Doses.filter(item=>{

                if(item.toLowerCase().indexOf(txt.toLowerCase())>-1){
                    return item;
                }
                
            });
            let is_avail=searchData.findIndex((item)=>{
                if(item.trim().toLowerCase()==txt.trim().toLowerCase()){
                    return item;
                }
            });
            this.setState({
                doses : searchData,
                add : is_avail > -1?false:true,
                txtDose : txt
            });

        }
        else{
            this.setState({
                doses : this.Doses,
                txtDose : txt,
                add : false,

               
            });
        }

    }
    addNewDose(){
        let doses=this.Doses;
        if(doses.indexOf(this.state.txtDose)>-1){
Alert.alert("Prescrip","Dose already added");
        }
        else{
            this.arrDoses.unshift(this.state.txtDose);
        doses.unshift(this.state.txtDose);
        }
        this.props.dosage.medicine.brand[2]=doses.toString();
        this.setState({
            doses : doses,
            add:false,
            newDose : true,
        },()=>this.setDose(this.state.txtDose,0))
    }
    getBrandName(srno){
        //let test=[["Pantoprazole 40mg+Levosulpiride 75mg Sustained Release","Volapride Plus","40mg+75mg"],["Rabeprazole 20mg+Domperidone SR 30mg","Rabib-DSR","20mg+30mg"],["Cholecalciferol 60000IU","Salmon D3","60000IU"],["Ginseng+Antioxidants+Multivitamis+Multiminerals Softgel Capsule","Cardexamin",""],["Esomeprazole-40mg+Domperidone-30mg","Protonact DSR","40mg+30mg"],["Omega 3 Fatty Acid+Lutein+Astaxanthin+Zeaxanthin","Bioret",""],["Calcium Carbonate+Calcitriol+Vitamin K2-7","Aporosis",""],["Calcium Carbonate 625mg+Calcitrol 0.23mcg+Zinc 7.5mg+Methylcobalmin 500mcg+Folic Acid 1.5mg+ Pyridoxine 3mg","Cal-Aid","625mg"]];
       
        //57 is srno for tablets
       this.setState({
           loading : true
       })
            this.props.databaseContext.db.transaction((tx) => {
                if(srno!=57){
                tx.executeSql("SELECT * FROM MasterData where Srno = "+srno, [], (tx, results) => {
                    let brandDataValue1 = results.rows.raw()[0];
                    let refno=JSON.parse(brandDataValue1.ReferenceNo);
                    let values = JSON.parse(brandDataValue1.Data);
                   if(values.Value){
                    this.Brands=values.Value;
                    this.masterData=[...this.Brands];
                //     let multiple=this.masterData.filter(m=>{
                //         if(m[0].includes(",") && m[1].includes(",")){
                //             return m;
                //         }
                //     });
                //    console.log(multiple);
                //    multiple=null;
                   }
                   else{
tx.executeSql("Select * from MasterData where Srno= "+refno,[],(tx,results)=>{
    let brandDataValue1 = results.rows.raw()[0];
    let values1 = JSON.parse(brandDataValue1.Data);
   if(values1.Value){
    this.Brands=values1.Value;
    this.masterData=[...this.Brands];
//     let refmultiple=this.masterData.filter(m=>{
//         if(m[0].includes(",") && m[2].includes(',')){
//             return m;
//         }
//     });
//    console.log(refmultiple);
//    multiple=null;
   }
},(error)=>{

})
                   }
                    
                    //this.getDbMedecine();
                   
               
    
                }, (error) => {
            
                });
            }
            else if(srno==57){
                tx.executeSql('SELECT * FROM Tablets', [], (tx, results) => {
                    let row = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        row.push(results.rows.item(i));
                    }
                    let data = row[0];
                    data.Data = [JSON.parse(data.Data)];
                    data.Data[0].Value = data.Data[0].Value.concat(JSON.parse(row[1].Data).Value)
                    this.Brands=data.Data[0].Value;
                    this.masterData=[...this.Brands];
                //     let multiple=this.masterData.filter(m=>{
                //         if(m[0].includes(",") && m[2].includes(",")){
                //             return m;
                //         }
                //     });
                //    console.log(multiple);
                //    multiple=null;
                //    multiple=multiple.map()
                    
                    
                }, (error) => {

                });
            }
            });
        }
    //    arrayToCSV(arr, delimiter = ','){
    //       let csv= arr.map(v=>
    //         v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)).join('\n');
    //         console.log(csv);
    //    }
        checkCustomDose(name,dose){
        //  if(this.state.newDose){
        //      return true
        //  }   
let brand=this.Brands.find(item=>{
    if(item[1].toLowerCase()==name.toLowerCase()){
        return item;
    }
});
if(brand){
    let doses=brand[2].split(',');
    doses=doses.map(d=>{
        return d.trim();
    });
    let cust_index=-1;
    cust_index=doses.findIndex(d=>{
        if(d.trim()===dose.trim()){
            return d;
        }
    })    
    return cust_index>-1?false:true;
}
else{
    return false;
}
        }
    getGenericName(names,index){
        let genericName='';
        let generics=names.split(',');
        if(generics){
            if(generics.length==1){
                genericName=generics[0]
            }
            else{
            genericName=generics[index];
            }
        }
        else {
            genericName=names;
        }
        return genericName?genericName:'';
    }
    getDoseIndex(name,selected){
        let doses="";
        let brand=this.Brands.find(item=>{
            if(item[1].toLowerCase()==name.toLowerCase()){
                return item;
            }
        });
        if(brand){
        doses=brand[2]; 
        
        }
        else{
          doses="";
        }
        let dosesArray=doses.split(',');
        dosesArray=dosesArray.map(d=>{
            return d.trim()
        }) 
        let index=-1;
        index=dosesArray.findIndex(item=>{
            if(item.trim()==selected.trim()){
return item
            }
        });
return index;
    }
    setDose(item,index,custom){
        let medicine=this.props.dosage.medicine;
        medicine.brand=this.props.dosage.medicine.brand;
        let isCustom=this.checkCustomDose(medicine.brand[1],item.trim());
        
let doseindex= this.getDoseIndex(medicine.brand[1],item.trim());
        
        let genericName=this.getGenericName(medicine.generic,doseindex);
        medicine.brand[0]=isCustom?"":genericName;
        medicine.dose=[item,index];
        
        this.props.setMedicine(medicine,null);
        if(this.state.newDose){
        this.addCustomMedicine()
        }
        else{
        this.props.setCurrentDosageView('Dose Regimen')
        }
    }
   //Confrim Delete
   confrimDelete(item){
    let brand=this.props.dosage.medicine.brand[1];
    let dosageForm=this.props.dosage.medicine.form[0];
   let recents=JSON.parse (this.dbData.newDose);
   console.log(recents);
   let doseIndex=-1;
   doseIndex=recents.findIndex(rec=>{
if(rec[1].trim()==brand.trim() && rec[4].trim()==dosageForm.trim()){
let doses=rec[2].split(',');
if(doses.includes(item)){
    return rec
}
}
   });

    if(doseIndex > -1){
        Alert.alert("Prescrip",`Do you want to delete ${item}`,[
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "YES", onPress: () => this.deleteDose(item,doseIndex) }
        ])
    }
    else{
        Alert.alert("Prescrip",`Cannot delete ${item}`);
    }
}
deleteDose(item){
    let doctor_id=this.props.doctorProfile.DoctorData._id;
    let brand=this.props.dosage.medicine.brand[1];
    let dosageForm=this.props.dosage.medicine.form[0];
   let data={
    "Key":"Dose",
    "value":item,
    "DoctorId":doctor_id,
    "brandName":brand,
    "doseForm":dosageForm,
    "brandRemoving":false,
    "doseRemoving":true
   }
   this.props.delete_custom_data(data).then(response =>{
    if (response.payload.data.status == 1) {
        let lastCloudSync = response.payload.data.LastCloudSync;
        let recents=JSON.parse (this.dbData.newDose);
        let dosesArray= [...this.state.doses];
        dosesArray=dosesArray.filter(d=>{
            if(d.trim()!=item.trim()){
                return d;
            }
        })
        this.setState({
            doses : [...dosesArray]
        },()=>{dosesArray=null })
        let doseIndex=-1;
        let recentBrand=recents.find(rec=>{
 if(rec[1].trim()==brand.trim() && rec[4].trim()==dosageForm.trim()){
     return rec;
 }
        });
        let modifydoses=recentBrand[2].split(',');
       doseIndex=modifydoses.findIndex(dose=>{
            if(dose.trim()==item.trim()){
                return dose
            }
        });
        modifydoses.splice(doseIndex,1);
 
        recentBrand[2]=modifydoses.toString();
        console.log(recentBrand);
        this.addToLocalDb(doctor_id,recentBrand,lastCloudSync,true);            

    }
   });
    
}
    renderDoses(item,index){
        
        return(
            <Capsule color ={"#0065d7"} text={item} onLongClick={()=>this.confrimDelete(item)} onClick={()=>{this.setDose(item,index)}}/>
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
            {/*Search View*/}
   <View style={{flexDirection : 'row',alignItems : 'center',justifyContent : 'space-between',borderColor : '#d1d1d1',borderRadius : 5,borderWidth : 2,marginVertical : 10,marginHorizontal : 20}}>
   <TextInput autoCorrect ={false} style={{flex : 0.9,fontSize : 16,fontFamily : NotoSans,paddingHorizontal : 5,paddingVertical : 10}} placeholder ={"Search for "+this.props.dosage.currentView} onChangeText={(text)=>{this.searchDoses(text)}} />
   <View style={{flex : 0.1}} >
   <Image source={ic_blue_search} style={{ width : 20,height : 20,alignSelf : "center",paddingHorizontal : 5}} resizeMode={"contain"}></Image>
   </View>
   </View>
   {/*Search View Ends*/}
   {
    this.state.add?
    <View style={{alignItems : 'center',flexDirection : 'row',justifyContent : 'space-between',marginVertical : 10,marginHorizontal : 20}}>
    <View style={{ flexDirection: 'column',flex : 0.9}} >
    <Text style={{ fontSize: 22, color: '#0065d7', fontFamily: 'NotoSans-Bold', }}>{this.state.txtDose}</Text>
    { <Text style={{ fontSize: 11, color: '#0065d7', fontFamily: 'NotoSans', paddingTop: 5 }}>Add as {this.props.dosage.currentView}</Text>}
   
    </View>
    <TouchableOpacity disabled ={!this.state.add} style={{flex : 0.1}} onPress={()=>this.addNewDose()}>
   <Image source={this.state.add ? Add_blue_btn:ic_blue_search} style={{ width : 35,height : 35,alignSelf : "center",paddingHorizontal : 5}} resizeMode={"contain"}></Image>
   </TouchableOpacity>
</View>
    :null
}
 {
                        this.state.doses.length ==0?
                        <EmptyHomePrescrip
    
                        isLottie ={true}
                        imagePath={null}
                        title={'No '+'Doses'+ (this.state.txtDose ==''? ' available ':' found')}

                        colorCode={'red'}
                        isShowButton={false}
                        description={ this.state.txtDose ==''?null:("To add '"+this.state.txtDose+"' as "+"Dose"+"\nYou can click the \u2295 symbol")}
                       />:
            <FlatList
keyboardShouldPersistTaps={'handled'}
contentContainerStyle={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}
data={this.state.doses}
renderItem={({ item,index }) => (this.renderDoses(item,index))}
extraData={this.state}>
</FlatList>}

            </View>
        )
    }
    

//DB FUNCTIONS
getDbMedecine(){
    this.arrDoses=[];
    this.props.databaseContext.db.transaction((tx)=>{
        let query="SELECT DoctorID, newDose, LastCloudSync from Recents where DoctorID= '"+this.props.doctorProfile.DoctorData._id+"'";
        
        tx.executeSql(query,[],(tx,result)=>{
            let resData = result.rows.raw()[0];
            this.dbData=resData;
          
        });
    })
}

addCustomMedicine(){
    //Call API
     let brand=this.props.dosage.medicine.brand;
    // "DoctorId": doctorId,
    // "isDoseAdding": isDoseAdding,
    // "brandName": brandName,
    // "doseForm": doseForm,
    // "dose": dose,
    // "newDoseArray": newDoseArray,
    // "lastCloudSync": this.lastCloudSync
    let masterIndex=this.masterData.findIndex(b=>{
        if(b[1].toLowerCase().trim()==brand[1].toLowerCase().trim()){
            return b;
        }
    })
    let is_custom=masterIndex>-1?false:true;
    let customBrand=this.props.dosage.medicine.customBrand?this.props.dosage.medicine.customBrand:is_custom;
    let medicine=[brand[0],brand[1],brand[2],customBrand,this.props.dosage.medicine.form[0]];
    let doctor_id=this.props.doctorProfile.DoctorData._id;
    let data={
        DoctorId : doctor_id,
        isDoseAdding: this.props.dosage.medicine.customBrand?false:this.state.newDose,
        brandName : brand[1],
        doseForm : this.props.dosage.medicine.form[0],
        dose :this.arrDoses.toString(),
        newDoseArray: medicine,
        lastCloudSync : this.dbData.LastCloudSync

    };
    this.props.addCustomMedicine(data).then(response=>{
        
        let syncResponse=response.payload.data;
        if(syncResponse.status==1){
            let cusmed=this.props.dosage.medicine;
            cusmed.customBrand=false;
            
            this.props.setMedicine(cusmed,null);
            this.addToLocalDb(doctor_id,medicine,syncResponse.LastCloudSync,false);
        }


    });


    //Call Sql Sync on response
    //Switch to Regimen
}
addToLocalDb(doc_id,medicine,LastCloudSync,isDelete){
    let index=-1;
    let newDose=JSON.parse(this.dbData.newDose);
    if(isDelete){
        index =newDose.findIndex((item)=>{
            if(item[1].toLowerCase()==medicine[1].toLowerCase() && item[4].toLowerCase()==medicine[4].toLowerCase()){
                return item
            }
    
        });
        if(index>-1){
        newDose[index]=medicine;
        }
    }
    else{
   index =newDose.findIndex((item)=>{
        if(item[1].toLowerCase()==medicine[1].toLowerCase() && item[4].toLowerCase()==medicine[4].toLowerCase()){
            return item
        }

    });
    if(index>-1){
    newDose[index]=medicine;
    }
    else{
    newDose.unshift(medicine);
    }
    
    }
    

this.props.databaseContext.db.transaction((tx)=>{
 let query="UPDATE Recents SET newDose = '"+JSON.stringify(newDose).replace(/\'/g, "''")+"', LastCloudSync= '"+LastCloudSync+"' where DoctorID ='"+doc_id+"'";
 
 tx.executeSql(query,[],(tx,result)=>{

if(!isDelete && result.rowsAffected>0){
    this.dbData.newDose=JSON.stringify(newDose);
    this.props.setCustomBrand(null);
    this.props.setCurrentDosageView('Dose Regimen')
}
else{

}
 },(error)=>{
     
 })
});
}
}
