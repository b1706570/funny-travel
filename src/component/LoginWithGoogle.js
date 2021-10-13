import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import userAPI from '../api/userAPI';
import { Redirect } from 'react-router';

export default class LoginWithGoogle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            direct: '',
        }
    }

    responseGoogle = (res) => {
        var profile = res['profileObj'];
        var arr = String(profile.googleId).split("");
        var id = "";
        for (let i = arr.length - 10; i < arr.length - 1; i++) {
            id += arr[i];
        }
        var params = new FormData();
        params.append("id", id);
        params.append("fullname", profile.name);
        const api = new userAPI();
        api.googlelogin(params)
            .then(response => {
                if (response === 1) {
                    alert("Bạn hãy cập nhật thông tin cá nhân của mình nhé!");
                    localStorage.setItem("iduser", id);
                    localStorage.setItem("username", profile.name);
                    localStorage.setItem("type", "user");
                    this.setState({
                        direct: "/member/personalinfomation",
                    })
                }
                else {
                    localStorage.setItem("iduser", id);
                    localStorage.setItem("username", profile.name);
                    localStorage.setItem("type", "user");
                    this.setState({
                        direct: "/",
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if (this.state.direct !== "") {
            return <Redirect to={this.state.direct} />
        }
        return (
            <div>
                <GoogleLogin
                    clientId='349194322944-vb8ti5449c46au16h9ofghkefqosmm0m.apps.googleusercontent.com'
                    buttonText='Đăng nhập với tài khoản Google'
                    onSuccess={this.responseGoogle}
                    cookiePolicy={"single_host_origin"}
                />
            </div>
        )
    }
}
