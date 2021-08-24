import React, { Component } from 'react';
import BtnSigin from './BtnSigin';
import BtnSigup from './BtnSigup';
import logo from '../img/logo.png';

export default class Header extends Component {
    render() {
        return (
            <div>
                <div className="logo col-md-1 col-md-offset-1"><img className="mainlogo" src={logo} alt="logo trang web"></img></div>
                <div className="btn col-md-1 entity">Gần bạn</div>
                <div className="btn col-md-1 entity">Gần bạn</div>
                <div className="col-md-3 col-md-offset-4 entity">
                    <BtnSigin />
                    <BtnSigup />
                </div>
            </div>
        )
    }
}
