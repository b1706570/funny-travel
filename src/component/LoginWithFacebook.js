import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import userAPI from '../api/userAPI';
import { Redirect } from 'react-router';

export default class LoginWithFacebook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            direct: '',
        }
    }

    responseFacebook = (response) => {
        if (response['status'] !== 'unknown') {
            var profile = response;
            var arr = String(profile.id).split("");
            var id = "";
            for (let i = arr.length - 9; i < arr.length - 1; i++) {
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
    }

    render() {
        if (this.state.direct !== "") {
            return <Redirect to={this.state.direct} />
        }
        return (
            <div>
                <FacebookLogin
                    appId="256574039817151"
                    autoLoad={false}
                    fields="name,email,picture"
                    //onClick={componentClicked}
                    callback={this.responseFacebook}
                    cssClass="btn-facebook-login"
                    textButton={"Đăng nhập với tài khoản Facebook"} />
            </div>
        )
    }
}
