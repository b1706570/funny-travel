import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import HostHeader from '../component/HostHeader';
import HostUpdateForm from '../component/HostUpdateForm';

export default class HostInfo extends Component {
    render() {
        if(localStorage.getItem("type")!=='host'){
            return <Redirect to="/" />
        }
        return (
            <div>
                <div className="host-header col-md-12">
                    <HostHeader hostActive={4}/>
                </div>
                <div className="host-info-body">
                    <HostUpdateForm />
                </div>
            </div>
        )
    }
}
