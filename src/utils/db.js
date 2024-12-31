import SQLite from 'react-native-sqlite-storage';
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
const name = "prescrip_db";
const createFromLocation = "~db/prescrip_v3db.sqlite";
export default class Database {
    constructor() {
        this.db;
        this.initDB()
    }

    initDB() {
        const self = this;
        return new Promise((resolve) => {
            //console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Opening database ...");
                    SQLite.openDatabase({ name: name, createFromLocation: createFromLocation })
                        .then(DB => {
                            self.db = DB;
                            //console.log("Database OPEN");
                            resolve(DB);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                   // console.log("echoTest failed - plugin not functional");
                });
        });
    };

    createTable(tablename, query) {
        return new Promise((resolve) => {
            //this.initDB().then((db) => {
                this.db.executeSql('SELECT * FROM tablename' + query).then((data) => {
                  //  console.log("Database is ready ... executing query ...");
                    let rawdata = data.rows.raw();
                    resolve(rawdata);
                }).catch((error) => {
                    console.log("Received error: ", error);

                    db.transaction((tx) => {
                        let createquery = 'CREATE TABLE Tablets(Srno VARCHAR(30) PRIMARY KEY NOT NULL, Name VARCHAR(30), Data VARCHAR(), ReferenceNo INTEGER, DataType VARCHAR(20), ExcelDownload VARCHAR(500), S3FileAccessLink VARCHAR(500), Sort INTEGER)';
                        tx.executeSql(createquery)
                    }).then(() => {
                        resolve('done');
                      
                    }).catch(error => {
                        //console.log(error);
                    });
                });
            //});
        }).catch((error) => {
           // console.log(error);
        });
    }

    findData(query) {
        const self = this;
        return new Promise((resolve) => {
            this.initDB().then(function (conn) {
                conn.executeSql(query, [], (tx, results) => {
                    resolve(tx)
                }, (error) => {
                    
                })
            }).catch(err => {
              //  console.log("error opening db ", err)
            });
        }).catch((error) => {
          //  console.log('error2', error);
        })
    }

    deleteData(query) {
        return new Promise((resolve) => {
            this.db.executeSql(query, [], (tx, results) => {
                var mainJson = results.rows.raw()[0];
                let newdosearr = JSON.parse(mainJson["newDose"]);
                newdosearr.push(newdoseArr[0]);
            }, (error) => {
                if (error)
                    console.log("Received error: ", error);
                this.db.transaction((tx) => {
                    tx.executeSql(query)
                }).then((tx, results) => {
                    resolve(results);
                }).catch(error => {
                  //  console.log(error);
                });
            });
        }).catch((error) => {

        })
    }


    getData(query) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.executeSql(query, [], (results) => {
                    if (query.Srno != 57) {
                        let data = results.rows.raw()[0];
                        if (data && data.Data) {
                            if (data.DataType == "ArrayObject") {
                                data.Data = [JSON.parse(data.Data)];
                            } else {
                                data.Data = JSON.parse(data.Data);
                            }
                        }
                    } else {
                        let row = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            row.push(results.rows.item(i));
                        }
                        let data = row[0];
                        data.Data = [JSON.parse(data.Data)];
                        data.Data[0].Value = data.Data[0].Value.concat(JSON.parse(row[1].Data).Value)
                    }
                    resolve(data);
                }, (error) => {
                    if (error)
                        console.log("Received error: ", error);
                    this.db.transaction((tx) => {
                        tx.executeSql(query)
                    }).then((tx, results) => {
                        if (query.Srno != 57) {
                            let data = results.rows.raw()[0];
                            if (data && data.Data) {
                                if (data.DataType == "ArrayObject") {
                                    data.Data = [JSON.parse(data.Data)];
                                } else {
                                    data.Data = JSON.parse(data.Data);
                                }
                            }
                        } else {
                            let row = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                row.push(results.rows.item(i));
                            }
                            let data = row[0];
                            data.Data = [JSON.parse(data.Data)];
                            data.Data[0].Value = data.Data[0].Value.concat(JSON.parse(row[1].Data).Value)
                        }
                        resolve(data);
                    }).catch(error => {
                     //   console.log(error);
                    });
                });
            }).catch((error) => {
                console.log("Promise Error Occurred : ", error);
            })
        }).catch(error => {
          //  console.log(error);
        });
    }

    updateData(query) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                tx.executeSql(query, [], (txs, upresults) => {
                    resolve(upresults)
                }, (error) => {
                    if (error)
                        this.db.transaction((tx) => {
                        tx.executeSql(query)
                    }).then((tx, results) => {
                        resolve(results);
                    }).catch(error => {
                      //  console.log(error);
                    });
                });
            }).catch((error) => {

            })
        }).catch(error => {
          //  console.log(error);
        });
    }


    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log("Database was not OPENED");
        }
    };

}