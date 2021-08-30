import React, { Component } from 'react';
import userAPI from '../api/userAPI';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import facebook from '../icons/facebook.png'
import md5 from 'md5';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtAccount: '',
            txtPassword: '',
            direct: '',
            type: ''
        };
        this.handleChangle = this.handleChangle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        let data = document.getElementById("login-form");
        let params = new FormData(data);
        let acc = this.state.txtAccount;
        if (acc.search("@gmail") === -1 && acc.search("@") === -1) {
            params.append("type", "user");
            this.setState({ type: "user" })
        }
        else {
            params.append("type", "host");
            this.setState({ type: "host" });
        }
        const api = new userAPI();
        api.getuser(params)
            .then(response => {
                var pass = md5(this.state.txtPassword)
                if (response.length === 0 || response[0].password !== pass) {
                    alert("Sai tên đăng nhập hoặc mật khẩu!");
                    this.setState({
                        txtAccount: '',
                        txtPassword: '',
                    });
                }
                else {
                    if (this.state.type === "user") {
                        if (this.state.txtAccount === "admin") {
                            localStorage.setItem('iduser', response[0].id_mem);
                            localStorage.setItem('username', response[0].fullname);
                            localStorage.setItem('type', 'admin');
                            this.setState({ direct: '/admin' });
                        }
                        else {
                            localStorage.setItem('iduser', response[0].id_mem);
                            localStorage.setItem('username', response[0].fullname);
                            localStorage.setItem('type', 'user');
                            this.setState({ direct: '/' });
                        }
                    }
                    else {
                        localStorage.setItem('iduser', response[0].id_host);
                        localStorage.setItem('username', response[0].company_name);
                        localStorage.setItem('type', 'host');
                        const data = JSON.stringify(response[0]);
                        localStorage.setItem('data', data)
                        this.setState({ direct: '/host/' + response[0].company_name + "/" });
                    }
                }
            })
            .catch(error => {
                alert("Error!", error);
            });
    }

    render() {
        if (this.state.direct !== '') {
            return <Redirect to={this.state.direct} />
        }
        return (
            <div>
                <div className="login-background"></div>
                <div className="col-md-6 col-md-offset-5 div-form-login">
                    <h2>Đăng Nhập</h2>
                    <div className="col-md-6 div-left-login">
                        <form id="login-form" onSubmit={this.handleSubmit} >
                            <div className="form-group one-row-login">
                                <label className="col-md-12 control-label">Tên tài khoản</label>
                                <div className="col-md-12">
                                    <input className="form-control" placeholder="Tên tài khoản..." type="text" name="txtAccount" value={this.state.txtAccount} onChange={this.handleChangle} />
                                </div>
                            </div>
                            <div className="form-group one-row-login">
                                <label className="col-md-12 control-label">Mật khẩu</label>
                                <div className="col-md-12">
                                    <input className="form-control" placeholder="Mật khẩu..." type="password" name="txtPassword" value={this.state.txtPassword} onChange={this.handleChangle} />
                                </div>
                            </div>
                            <div className="form-group one-row-login">
                                <input className="btn btn-success col-md-12 but1-login" type="submit" value="Đăng nhập" />
                                <Link to="/register" type="button" className="btn btn-link col-md-12 but1-login">Bạn chưa có tài khoản?</Link>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-5 div-right-login">
                        <button className="col-md-12 col-md-offset-1 btn btn-info"><img src={facebook} alt="logo facebook" />   Đăng nhập bằng Facebook</button>
                    </div>
                </div>
            </div>
        )
    }
}