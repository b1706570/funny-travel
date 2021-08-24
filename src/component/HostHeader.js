import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';
import config from '../config.json';
import hostAPI from '../api/hostAPI';

export default class HostHeader extends Component {
    constructor(props){
        super(props);
        this.state={
            my_url: "/host/"+localStorage.getItem("username"),
            logoURL: logo,
        }
    }

    componentDidMount = () =>{
        const api = new hostAPI();
        api.gethostbyID(localStorage.getItem('iduser'))
        .then(response =>{
            if(response.logo_host !== ""){
                this.setState({
                    logoURL: config.ServerURL + "/" + response.logo_host,
                })
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    render() {
        var list_class_controller=["col-md-2 host-controller-child",
                                    "col-md-2 host-controller-child",
                                    "col-md-2 host-controller-child",
                                    "col-md-2 host-controller-child",
                                    "col-md-4 host-controller-child",]
        list_class_controller[this.props.hostActive] += " host-controller-child-active";
        return (
            <div>
                <div className="host-logo col-md-2 col-md-offset-1">
                    <img src={this.state.logoURL} alt="logo-host" />
                </div>
                <div className="host-controller col-md-5 col-md-offset-3">
                    <Link className={list_class_controller[0]} to={this.state.my_url + "/"}>Phòng</Link>
                    <Link className={list_class_controller[1]} to="#">Đặt trước</Link>
                    <Link className={list_class_controller[2]} to="#">Tin nhắn</Link>
                    <Link className={list_class_controller[3]} to="#">Quản trị</Link>
                    <Link className={list_class_controller[4]} to={this.state.my_url + "/personalinfo"}>Cập nhật thông tin</Link>
                </div>
            </div>
        )
    }
}
