import React, { Component } from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import configuration from './config';
var jwt = require('jsonwebtoken');

class ViewSession extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        var token = reactLocalStorage.get('token');
        jwt.verify(token, configuration.appName , function (err, decoded){
            if (err){
                decoded = null;
                window.location.href = '/#/login'
            }
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
            </div>
        )  
    }
}

export default ViewSession;
