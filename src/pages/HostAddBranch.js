import React, { Component } from 'react';
import userAPI from '../api/userAPI';
import logo from '../img/logo.png'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';
import GoogleMaps from '../component/GoogleMaps';
import hostAPI from '../api/hostAPI';
import HostHeader from '../component/HostHeader';
import config from '../config.json';

export default class HostAddBranch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtFullname: '',
            txtGmail: '',
            txtPhonenumber: '',
            txtHostname: '',
            txtLogo: '',
            direct: ''
        };
        this.handleChangle = this.handleChangle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const api = new hostAPI();
        api.gethostbyID(localStorage.getItem("iduser"))
            .then(response => {
                let currentlogo = logo;
                if (response.logo_host !== "") {
                    currentlogo = config.ServerURL + "/" + response.logo_host;
                }
                this.setState({
                    txtFullname: response.fullname_host,
                    txtGmail: response.email_host,
                    txtPhonenumber: response.phone_host,
                    txtLogo: currentlogo,
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleChangle = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var ok = true;
        if (this.state.txtHostname === '') {
            document.getElementById("hostnameNoti").innerHTML = "(*)Bạn không được để trống tên doanh nghiệp.";
            ok = false;
        }
        else {
            document.getElementById("hostnameNoti").innerHTML = "";
        }
        if (document.getElementById("address").value === '') {
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
            ok = false;
        }
        else {
            document.getElementById("addressNoti").innerHTML = "";
        }
        if (document.getElementById("address").value !== '' && ok === true) {
            let data = document.getElementById("user_register_form")
            let params = new FormData(data);
            params.append("type", "host");
            params.append("state", "old");
            const api = new userAPI();
            api.register(params)
                .then(response => {
                    if (response[0].code === 200) {
                        alert("Gửi yêu cầu thành công. Admin sẽ liên lạc với bạn qua email nhé!");
                        this.setState({ direct: '/host/' + localStorage.getItem("username") });
                    }
                    else {
                        alert("Gửi yêu cầu không thành công!");
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    render() {
        if (this.state.direct !== '') {
            return <Redirect to={this.state.direct} />
        }
        return (
            <div>
                <div className="host-header col-md-12">
                    <HostHeader hostActive={3} />
                </div>
                <div className="col-md-6 col-md-offset-3 div-form-register-host">
                    <img className="mainlogo col-md-offset-5" src={this.state.txtLogo} alt="logoweb" />
                    <h2>Thêm chi nhánh mới</h2>
                    <form id="user_register_form" onSubmit={this.handleSubmit} >
                        <div className="form-group one-row-register">
                            <label className="col-md-3 col-md-offset-1 control-label">Họ và tên</label>
                            <div className="col-md-7">
                                <input className="form-control" placeholder="Họ và tên..." type="text" name="txtFullname" value={this.state.txtFullname} onChange={this.handleChangle} readOnly />
                            </div>
                            <label id="fullnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                        </div>
                        <div className="form-group one-row-register">
                            <label className="col-md-3 col-md-offset-1 control-label">Tên doanh nghiệp</label>
                            <div className="col-md-7">
                                <input className="form-control" placeholder="Tên doanh nghiệp..." type="text" name="txtHostname" value={this.state.txtHostname} onChange={this.handleChangle} />
                            </div>
                            <label id="hostnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                        </div>
                        <div className="form-group one-row-register">
                            <label className="col-md-3 col-md-offset-1 control-label">Email</label>
                            <div className="col-md-7">
                                <input className="form-control" placeholder="...@gmail.com" type="text" name="txtGmail" value={this.state.txtGmail} onChange={this.handleChangle} readOnly />
                            </div>
                            <label id="emailNoti" className="col-md-7 col-md-offset-4 notification"></label>
                        </div>
                        <div className="form-group one-row-register">
                            <label className="col-md-3 col-md-offset-1 control-label">Số điện thoại</label>
                            <div className="col-md-7">
                                <input className="form-control" placeholder="Số điện thoại" type="text" name="txtPhonenumber" value={this.state.txtPhonenumber} onChange={this.handleChangle} readOnly />
                            </div>
                            <label id="phonenumberNoti" className="col-md-7 col-md-offset-4 notification"></label>
                        </div>
                        <div className="form-group one-row-register">
                            <label className="col-md-3 col-md-offset-1 control-label">Địa chỉ</label>
                            <GoogleMaps />
                            <label id="addressNoti" className="col-md-7 col-md-offset-4 notification"></label>
                        </div>
                        <label className="col-md-10 col-md-offset-1 one-row-register">(*)Lời nhắc: với việc đăng ký, bạn đồng ý với chính sách bảo mật và điều khoản sử dụng của chúng tôi.</label>
                        <input className="btn btn-success col-md-10 col-md-offset-1 but1-register" type="submit" value="Gửi yêu cầu đăng kí" />
                        <Link to="/login" type="button" className="btn btn-info col-md-10 col-md-offset-1 but1-register">Đăng nhập tài khoản</Link>
                    </form>
                </div>
            </div>
        )
    }
}
