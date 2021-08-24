import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class BtnSigin extends Component {
    constructor(props){
        super(props);
        if(localStorage.getItem("iduser")!==null){
            this.state = {
                userName: localStorage.getItem("username"),
                idUser: localStorage.getItem("iduser")
            }
        }
        else{
            this.state = {
                userName: '',
                idUser: ''
            }
        }
    }

    handleSigout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('iduser');
        localStorage.removeItem('type');
        localStorage.removeItem('data');
        this.setState({
            userName: '',
            idUser: ''
        })
    }

    render() {
        if(this.state.userName === ''){
            return (
                <div className="col-md-4 col-md-offset-2">
                    <Link className="btn btn-primary" to='/login'>Đăng nhập</Link>
                </div>
            )
        }
        else{
            return (
                <div className="col-md-6">
                    <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{this.state.userName}</button>
                        <ul className="dropdown-menu">
                            <li className="btn" onClick={this.handleSigout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
            )
        }
    }
}
