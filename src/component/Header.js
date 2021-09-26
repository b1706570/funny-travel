import React, { Component } from 'react';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    constructor(props) {
        super(props);
        if (localStorage.getItem("iduser") !== null) {
            this.state = {
                userName: localStorage.getItem("username"),
                idUser: localStorage.getItem("iduser")
            }
        }
        else {
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
        if (this.state.userName === '') {
            return (
                <div>
                    <div className="logo col-md-1 col-md-offset-1"><img className="mainlogo" src={logo} alt="logo trang web"></img></div>
                    <div className="btn col-md-1 entity">Gần bạn</div>
                    <div className="col-md-2 col-md-offset-6 entity">
                        <div className="col-md-5 col-md-offset-1">
                            <Link className="btn btn-primary" to='/login'>Đăng nhập</Link>
                        </div>
                        <div className="col-md-6">
                            <div className="dropdown">
                                <button className="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">Đăng kí</button>
                                <ul className="dropdown-menu">
                                    <li><Link to="/register">Bạn tìm kiếm địa điểm du lịch?</Link></li>
                                    <li><Link to="/host/register">Bạn là người cung cấp dịch vụ?</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="logo col-md-1 col-md-offset-1"><img className="mainlogo" src={logo} alt="logo trang web"></img></div>
                <div className="btn col-md-1 entity">Gần bạn</div>
                <div className="col-md-2 col-md-offset-6 entity">
                    <div className="col-md-8 col-md-offset-4">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{this.state.userName}</button>
                            <ul className="dropdown-menu">
                                <li><Link to="/member/personalinfomation"><span className="glyphicon glyphicon-user"></span>Thông tin cá nhân</Link></li>
                                <li><Link to="" onClick={this.handleSigout}><span className="glyphicon glyphicon-log-out"></span> Đăng xuất</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
