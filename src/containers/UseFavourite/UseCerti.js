import React, { Component } from 'react';
import { Container, Header, Content, Thumbnail, Text } from 'native-base';

import { favourites } from '../../actions/patientVisit';
import { connect } from "react-redux";
import FlatListForPrescription from '../../components/FlatListForPrescription'
import { withDb } from "../../DatabaseContext/withDatabase";
import { setCertificateType, clearCertificate } from '../../actions/certificates';
import { empty_PatientList, } from '../../constants/images'
import EmptyHome from '../../components/EmptyHome/EmptyHome'
import { Alert, Dimensions, View } from 'react-native';
class MyFav extends Component {

    constructor(props) {
        super(props);

        this.state = {
            invalid: true,
            loading: false,
            isRefresh: true,
            favList: [],
            certificates: [],
            dataIsPresent: true,
            EmptyHomeTitle: "No Certificate",
        }
        this.db = null;
    }

    componentDidMount() {
        this.db = this.props.databaseContext.db;
        this.getDbData();


    }






    getDbData() {
        this.db.transaction((tx) => {
            let query = "SELECT DATA FROM MasterData where Srno = 15";
            tx.executeSql(query, [], (tx, result) => {
                let resData = result.rows.raw()[0];
                let certiData = JSON.parse(resData.Data);

                certiData = certiData.Value;
                this.setState({
                    certificates: certiData
                }, () => {
                    this.getFavList();
                })
            }, (error) => {

            })
        })
    }


    getFavName(key) {

        let item = this.state.certificates.find(certi => {
            if (certi.name.replace(/\s/g, '') == key) {
                return certi;
            }
        })
        return item;
    }

    getFavList() {
        let favList = [];
        let self = this;
        let certiFav = this.props.doctorProfile.DoctorData.CertificatesFav ? this.props.doctorProfile.DoctorData.CertificatesFav : [];

        Object.keys(certiFav).forEach(function (k) {

            if (certiFav[k] ? certiFav[k].length > 0 : false) {
                let certificate = self.getFavName(k);
                let fav = {
                    name: certificate.name,
                    key: k,
                    favarr: certiFav[k],
                    certificate: certificate
                }
                favList.push(fav);
            }
        });
        this.setState({
            favList
        })

    }



    addItemInSelctedFlatList(item) {
        this.props.clearCertificate();
        this.props.setCertificateType(item);
        this.props.navigation.navigate('CertificateFavContainer');
    }

    // takeData(list, enterText) {
    //     if (enterText) {
    //         let list1 = list.filter(element => {
    //             if (element.name.startsWith(enterText)) {
    //                 return true
    //             } else {
    //                 return false
    //             }
    //         })
    //         return list1

    //     } else {
    //         return list
    //     }

    // }

    takeData(list, enterText) {
        let enterText1 = enterText.trim()

        if (enterText1) {


            let list1 = list.filter(element => {
                if (element.name.startsWith(enterText1)) {
                    return true
                } else {
                    return false
                }
            })

            return list1;
        }
        return list;
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1, width: Dimensions.get('window').width, backgroundColor: '#fff'
                }}>

                    {
                        this.takeData(this.state.favList, this.props.enterText).length > 0 ?
                            <FlatListForPrescription
                                {...this.props}
                                data={this.takeData(this.state.favList, this.props.enterText)}
                                callFrom={"certi"}
                                addItemInSelctedFlatList={(item) => this.addItemInSelctedFlatList(item)}

                            />
                            :
                            <EmptyHome
                                {...this.props}
                                isLottie={true}
                                imagePath={empty_PatientList}
                                //imagePath={Images.ic_Video_Consultations_Empty_Icon}
                                title={this.state.EmptyHomeTitle}
                                // colorCode={colorCode}
                                isShowButton={this.state.isShowButton}
                                onClick={() => this.onClick()}
                            />
                    }
                </View>
            </View>
        );
    }
}



const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile
});

const mapDispatchToProps = dispatch => ({
    //{"startDate":"07-06-2019","endDate":"10-10-2020","type":3,"doctorId":"5f02f35fcf043e1acc45adf5"}
    favourites: (doctorid) => dispatch(favourites(doctorid)),
    setCertificateType: (certificate) => dispatch(setCertificateType(certificate)),
    clearCertificate: () => dispatch(clearCertificate()),


});

export default connect(mapStateToProps, mapDispatchToProps)(withDb(MyFav));
