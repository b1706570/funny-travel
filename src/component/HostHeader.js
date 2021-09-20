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
            class_noti_new_book: "noti-new-book-hidden",
        }
        this.Logout = this.Logout.bind(this);
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
        this.NotiNewBook();
    }

    NotiNewBook = () =>{
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        const api = new hostAPI();
        api.getBookingSchedule(params)
            .then(response => {
                if(response['listAwait'].length !== 0){
                    this.setState({ class_noti_new_book: "noti-new-book-visible" });
                }
                else{
                    this.setState({ class_noti_new_book: "noti-new-book-hidden" });
                }
            })
            .catch(error => {
                console.log(error);
            })
        this.timer = setTimeout(this.NotiNewBook, 60000);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    Logout(){
        localStorage.removeItem("iduser");
        localStorage.removeItem("type");
        localStorage.removeItem("username");
    }

    render() {
        var list_class_controller=["col-md-1 host-controller-child",
                                    "col-md-2 host-controller-child",
                                    "col-md-1 host-controller-child",
                                    "col-md-2 host-controller-child",
                                    "col-md-3 host-controller-child",
                                    "col-md-2 host-controller-child",]
        list_class_controller[this.props.hostActive] += " host-controller-child-active";
        return (
            <div>
                <div className="host-logo col-md-2 col-md-offset-1">
                    <img src={this.state.logoURL} alt="logo-host" />
                </div>
                <div className="host-controller col-md-6 col-md-offset-3">
                    <Link className={list_class_controller[0]} to={this.state.my_url + "/"}>Phòng</Link>
                    <Link className={list_class_controller[1]} to={this.state.my_url + "/bookingschedule"}>Đặt trước<span className={this.state.class_noti_new_book}></span></Link>
                    <Link className={list_class_controller[3]} to={this.state.my_url + "/addbranch"}>Thêm chi nhánh</Link>
                    <Link className={list_class_controller[4]} to={this.state.my_url + "/personalinfo"}>Cập nhật thông tin</Link>
                    <Link className={list_class_controller[2]} to={this.state.my_url + "/manage"}>Quản trị</Link>
                    <Link className={list_class_controller[5]} to="#" onClick={this.Logout}><span className="glyphicon glyphicon-log-out"></span> Đăng xuất</Link>
                </div>
            </div>
        )
    }
}
