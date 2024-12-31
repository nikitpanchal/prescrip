import React, { Component } from 'react'
import WhatsNewComponent from '../../components/WhatsNewComponent/WhatsNewComponent'
import { doctorServiceProvided } from '../../actions/doctorProfile'
import { setUpdateApp } from '../../actions/sync'
import { connect } from "react-redux";
import { Platform, Linking } from 'react-native'
import { ioslink, androidlink, androidPackage } from '../../../app.json'
import { StackActions, CommonActions } from '@react-navigation/native';

class WhatsNewContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            featureArr: [],
            links: null,
        }
    }

    componentDidMount() {

        let featureArr = this.props.sync.configData.releaseNotes;
        let links = this.props.sync.configData.link;
        this.setState({ featureArr: featureArr, links: links });
    }

    updateNowFun() {
        if (Platform.OS == "ios") {
            //Linking.openURL(this.state.links.ios)
            Linking.openURL(ioslink)
        } else {
            Linking.openURL(androidlink)
        }
    }

    notNow() {
       
        this.props.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'Drawer' }]

        }));
    };

    render() {
        return (

            <WhatsNewComponent {...this.props}
                featureNotes={this.state.featureArr}
                updateNow={() => this.updateNowFun()}
                notNowClick={() => this.notNow()} />

        )
    }
}

const mapStateToProps = state => ({
    doctorProfile: state.doctorProfile,
    sync: state.sync,

});

const mapDispatchToProps = dispatch => ({
    doctorServiceProvided: (data) => dispatch(doctorServiceProvided(data)),
    setUpdateApp: (data) => dispatch(setUpdateApp(data))

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WhatsNewContainer);

