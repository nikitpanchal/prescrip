/****** code by ravi ******/

import React, { Component } from "react";
import { FloatingAction } from "react-native-floating-action";
import { Alert,Platform } from 'react-native';
import { add_Button, ic_Close_Button, add_Certificate_Icon, add_Favourite_Icon, add_Prescription_Icon, ic_Add_Clinic_Button } from '../../constants/images'

export default class FAB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fabchangeimage: false,


        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.listcount == 0) {
            if(!this.state.fabchangeimage){
            this.floatingAction.animateButton();
            this.setState({ fabchangeimage: !this.state.fabchangeimage })

            }
            else if(this.props.listcount > 0 &&this.state.fabchangeimage){
                this.floatingAction.reset();
                this.setState({ fabchangeimage: !this.state.fabchangeimage })

            }
        }
    }



    closeFAB() {
        this.floatingAction.reset();
        this.setState({ fabchangeimage: !this.state.fabchangeimage })

    }

    render() {
        return (
            <FloatingAction
                iconHeight={55}
                iconWidth={55}
                position={"right"}
                openmodal={()=>this.openmodal()}
                onPressBackdrop={() => { this.closeFAB() }}
                ref={(ref) => { this.floatingAction = ref; }}
                color="transparent"
                floatingIcon={this.state.fabchangeimage ? ic_Close_Button : ic_Add_Clinic_Button}
                overlayColor= {this.props.listcount == 0?"rgba(255, 255, 255, 0)":"rgba(255, 255, 255, 0.90)"}
                showBackground={this.props.listcount == 0?false:true}
                distanceToEdge={{ horizontal:Platform.isPad? 80:30, vertical:Platform.isPad? 80:40 }}
                actions={this.props.actions}
                onPressMain={() => this.setState({ fabchangeimage: !this.state.fabchangeimage })}
                onPressItem={name => {
                    this.props.fabtouch(name);
                    this.setState({ fabchangeimage: !this.state.fabchangeimage })
                }}
            />
      
        )
    }
}