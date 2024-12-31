/****** code by ravi ******/
import React from 'react';
import { Container, Text } from "native-base";
import { View, TouchableOpacity, Image,KeyboardAvoidingView,BackHandler } from "react-native";
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { connect } from "react-redux";
import ProfessionalComponent from '../../components/DoctorProfileComponent/ProfessionalComponent'
import { withDb } from "../../DatabaseContext/withDatabase";

class ProfessionalContainer extends React.Component {



    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            DisplayQualificationCSV:this.props.doctorProfile.DoctorData.DisplayQualificationCSV,
            RegistrationNumber: '',
            MedicalCouncil: '',
            specArray:[]

        };
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
        this.props.navigation.goBack(null);
        return true;
        }
    handlequalification = (text) => {
        this.setState({ Qualification: text })
    }
    handleregistrationnumber = (text) => {
        this.setState({ RegistrationNumber: text })
    }
    handlemedicalcouncil = (text) => {
        this.setState({ MedicalCouncil: text })
    }


    Navigateback = () => {
        multipleTapHandler.clearNavigator(),
            this.props.navigation.goBack()

    }

    getDataforSpecialization() {

        //const self = this;
        let specializationlist = [];
        this.props.databaseContext.db.transaction((tx) => {
            tx.executeSql("SELECT Data FROM MasterData where Srno=2", [], (tx, results) => {
                if (results.rows.length > 0) {
                    specializationlist = JSON.parse(results.rows.raw()[0].Data).Value;
                    
                    this.setState({ specArray: specializationlist })
                    resolve(specializationlist);

                }
            }, (error) => {
                resolve(specializationlist);
            });
        });

    }


    render() {

        return (
            <View >
                <KeyboardAvoidingView
                    style={{ flex: 1 }} >
                    <View style={{
                        flexdirection: 'column', flex: 1, 
                    }}>

                        <ProfessionalComponent 
                        {...this.props}
                        data={this.props.doctorProfile.DoctorData}
                        handlequalification={(text)=>this.handlequalification(text)}
                        handleregistrationnumber={(text)=>this.handleregistrationnumber(text)}
                        handlemedicalcouncil={(text)=>this.handlemedicalcouncil(text)}
                        specArray={this.state.specArray}
                       onModalClick={()=>this.getDataforSpecialization()}
                        />






                    </View>
                </KeyboardAvoidingView>
            </View>

        );
    }
}
const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile

});

const mapDispatchToProps = dispatch => ({


});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDb(ProfessionalContainer));