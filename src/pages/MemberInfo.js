import React, { Component } from 'react';
import Header from '../component/Header';

export default class MemberInfo extends Component {
    constructor(props){
        super(props);
        this.state={
            info: {},
            transaction: [],
        }
    }

    render() {
        return (
            <div>
                <div className="col-md-12 header-home"><Header /></div>
                <div className="col-md-10 col-md-offset-1">
                    <div className="col-md-3 member-info-left">aaa</div>
                    <div className="col-md-9 member-info-right">bb</div>
                </div>
            </div>
        )
    }
}
