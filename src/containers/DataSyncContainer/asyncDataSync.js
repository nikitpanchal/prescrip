import _, { result } from 'lodash';
//import nextFrame from 'next-frame';
var syncData = null;
    var db = null;
    var toltalTabCount = 0;
    var tabData = null;
    var tabSync = null;
    var rowCount = -1;
    var initialRow = -1;
    var delCount = 0;
    var insertCount = 0;
    var modifyCount = 0;
    var specialization="";
    var sampleData = null;
export const initializeSetup=(db)=>{
    this.db=db;

}

export const  parseMasterData=(data,db)=>{
syncMasterData(data,db)
};
//NEW MASTER SYNCED
export async function syncMasterData(data,db){
    //await nextFrame();
    var tp = performance.now();
    const self = this;
    var groupCruds =  _.groupBy(data, (item) => {
      return item.Srno
    });
    //var groupCruds = this.groupBy(data.masterData, "Srno");
    var getOnlySrNosQuery = Object.entries(groupCruds).filter(x => x[0] != 2 && x[0] != 57 && x[0] != 17).map(x => ['SELECT * FROM MasterData where Srno=' + x[0].toString(), x[0]]);
    await db.transaction(tx => {
      Promise.all(getOnlySrNosQuery.map(async (q) => {
        try {
          let results = await tx.executeSql(q[0], []);
          var thisSrObj = groupCruds[q[1]];
  
          var finalData = await getFinalData(thisSrObj, results[1].rows.raw()[0],q[1]);
          var queryForUpdate = "UPDATE MasterData set " +
            "Data = '" + finalData.Data.replace(/\'/g, "''") + "'," +
            "LastUpdated = '" + finalData.LastUpdated + "'" +
            "where Srno = '" + q[1].toString() + "'";
          await db.transaction(async (tx1) => {
  
            try {
              var xUP = await tx1.executeSql(queryForUpdate, []);
              
  
            } catch (err) {
              
            }
  
          });
  
          //    let results1 = await tx.executeSql(queryForUpdate, []);  
  
        } catch (err) {
          
        }
      })).then(function () {
        var t1 = performance.now();
       
        
        if(groupCruds["57"]){
        getTabletData(db).then(results=>{
         
          parseTabletData(data,db);
        })
      }
      else{
        
      }
        // self.seggregateTabletsDataToProcess(data, db).then(function () {
  
        // });
      });
    });
  }
  // PARSE TABLET DATA1
  
  async function parseTabletData(data,db){
    var tp = performance.now();
   
    const self = this;
    var groupCruds =  _.groupBy(data, (item) => {
      return item.Srno
    });
    var tabObj=groupCruds["57"];
    let whenEntered = Math.max.apply(Math, groupCruds["57"].map(function (o) { return new Date(o.WhenEntered); }))
      whenEntered = new Date(whenEntered).toISOString();
      tabSync=whenEntered;
    var tabTypeData=_.groupBy(tabObj,(item)=>{
      return item.Type;
    });
    var insertTabs=tabTypeData["1"];
    if(insertTabs){
    insertTabs.map(item=>{
      insertTablet(item);
    })
  }
    let modifyTabs=[];
    if(tabTypeData["2"]){
  modifyTabs=[...modifyTabs,...tabTypeData["2"]];
    }
    if(tabTypeData["3"]){
      modifyTabs=[...modifyTabs,...tabTypeData["3"]];
    }
    if(modifyTabs.length>0){
    await Promise.all(tabData.map(async (row,index)=>{
     
  let finalData=await getFinalData(modifyTabs,row,57);
  tabData[index]=finalData;
    }));
    }
    await updateTabletTab(db);
    var t1 = performance.now();
    
    
    //this.onSyncComplete();
    
   
    
  
  }
  
  //MODIFY ROWS
  
  async function getFinalData(crudData, masterData) {
    
     var parsedMasterData = masterData;
     var parsredData = JSON.parse(parsedMasterData.Data);
     var dataInfo = parsedMasterData.DataType != "ArrayString" ? parsredData.Value
       : parsredData;
  
  
     for (let cLop = 0; cLop < crudData.length; cLop++) {
       var thisInstance = crudData[cLop];
       if (thisInstance.Type == 1) {
         dataInfo.unshift(thisInstance.ArrayValue);
  
  
       } else if (thisInstance.Type == 2) {
         var indexOfThis = -1;
         if (parsedMasterData.DataType == "ArrayString")
           indexOfThis = dataInfo.findIndex(c => c.toLowerCase() == thisInstance.Name.toLowerCase());
         else {
           indexOfThis = dataInfo.findIndex(c => Array.isArray(c) && c[0].toLowerCase() ==
             thisInstance.Name.toLowerCase() || c[1].toLowerCase()
             == thisInstance.Name.toLowerCase());
         }
  
         if (indexOfThis > -1) {
           dataInfo[indexOfThis] = thisInstance.ArrayValue;
         }
  
  
       }
       else if (thisInstance.Type == 3) {
         var indexOfThis = -1;
         if (parsedMasterData.DataType == "ArrayString")
           indexOfThis = dataInfo.findIndex(c => c.toLowerCase() == thisInstance.Name.toLowerCase());
         else {
           indexOfThis = dataInfo.findIndex(c => Array.isArray(c) && c[0].toLowerCase() ==
             thisInstance.Name.toLowerCase() || c[1].toLowerCase()
             == thisInstance.Name.toLowerCase());
         }
  
         if (indexOfThis > -1) {
         
           dataInfo.splice(indexOfThis,1);
         }
       }
     }
     if (parsedMasterData.DataType == "ArrayString") {
       parsredData = dataInfo;
     }
     else {
       parsredData.Value = dataInfo;
     }
  
     parsedMasterData.Data = JSON.stringify(parsredData);
     parsedMasterData.LastUpdated = crudData[crudData.length - 1].WhenEntered;
     return parsedMasterData;
  
  
   }

   //Optimized
  function getTabletData(db) {
    let tabletPromise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * from Tablets", [], (tx, result) => {
               
                tabData = result.rows.raw();
                rowCount = result.rows.length;
                initialRow = result.rows.length;

                resolve("Tablets fetched");
            }, (error) => {
                reject("Error in getting tablets "+JSON.stringify(error));
            });
        })
    });

    return tabletPromise;
}

function insertTablet(item) {
    //let type = item.Type;
    let newValue = item.ArrayValue;
    //let oldValue = item.OldArrayValue;
    //let lastSync = item.WhenEntered;
    //let srno = item.Srno;
    let Data = JSON.parse(tabData[rowCount - 1].Data);
    let Value = Data.Value;
    if (Value.length >= 35000) {
      //Create a new row in tablets
      let row = {
        Datainfo: ["GenericName", "Brand", "Dose"],
        Value: []
      };

      row.Value.push(newValue);
      let newRow = {
        Data: JSON.stringify(row)
      }
      tabData.push(newRow);
      rowCount++;
    }
    else {
      Value.push(newValue);
      Data.Value = Value;
      tabData[rowCount - 1].Data = JSON.stringify(Data);
    }
    //this.tabSync = lastSync;
  }

  function updateTabletTab(db) {
    //INSERT INTO Tablets (Srno,Name,Data,ReferenceNo,DataType,ExcelDownload,S3FileAccessLink,Sort,LastUpdated) VALUES ( 0, 'Tablet','HI' ,0, 'ArrayObject', '','',1, '2020-12-19T05:54:27.244Z' )
    let tabPromises = tabData.map((row, index) => {
      if (index > initialRow) {

      }
      else {
        let tabs=new Promise((resolve,reject)=>{
          db.transaction((tx) => {
            let query = "UPDATE Tablets SET Data= '" + row.Data.replace(/\'/g, "''") + "' , LastUpdated ='" + tabSync.toString() + "' WHERE Srno= " + index;
            tx.executeSql(query, [], (tx, result) => {
              
              resolve("Tab updated "+index);
            }, (error) => {
              
              reject("Tab updated error "+index);
            });
          });
        })
        return tabs; 
      }
    });
    return tabPromises;
  }


  //NEW MASTER SYNCED ENDS
  

