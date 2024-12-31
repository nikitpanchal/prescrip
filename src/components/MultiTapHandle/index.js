import React, { Component } from "react";
let screens = [], functions = [];
export default class multipleTapHandler extends Component {



    constructor(props) {

    }
    static clearNavigator() {
        screens = [];
        functions = [];
    }
    static multitap(navigator, screenName, screenArr, wait = 300) {
        if (screenName == screens[screens.length - 1])
            return
        screens.push(screenName);
        navigator();

    };
    static multitapFunctionHandler(functionName, callback) {
        if (functionName == functions[functions.length - 1])
            return 0;
        else {
            functions.push(functionName);
            callback();
            return 1;
        }
        // navigator();

    };

}