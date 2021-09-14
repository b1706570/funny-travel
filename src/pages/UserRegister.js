import React, { Component } from 'react';
import userAPI from '../api/userAPI';
import {Link} from 'react-router-dom';
import logo from '../img/logo.png'
import { Redirect } from 'react-router';
import GoogleMaps from '../component/GoogleMaps.js'

export default class UserRegister extends Component {
    constructor(props){
        super(props);
        this.state={
            txtFullname: '',
            txtAccount: '',
            txtPassword: '',
            txtAddress: '',
            txtPhone: '',
            listUsernotavailable : [],
            usernameAvailable: true,
            direct: ''
        };
        this.handleChangle=this.handleChangle.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const api=new userAPI();
        api.getallusername()
        .then(response => {
            this.setState({listUsernotavailable: response});
        })
        .catch(error => {
            console.log(error);
        })
    }

    handleChangle = (e) =>{
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name] : value
        });
        if(name === 'txtAccount'){
            let i = 0;
            while(i < this.state.listUsernotavailable.length){
                var user = this.state.listUsernotavailable[i];
                if(user['username'] === value){
                    document.getElementById("accountNoti").innerHTML = "(*) Tên đăng nhập này đã tồn tại. Vui lòng chọn tên đăng nhập khác!!!";
                    this.setState({usernameAvailable: false})
                    break;
                }
                else{
                    document.getElementById("accountNoti").innerHTML = "";
                    this.setState({usernameAvailable: true})
                }
                i+=1;
            }
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        if(this.state.txtFullname === ''){
            document.getElementById("fullnameNoti").innerHTML = "(*)Bạn không được để trống họ và tên.";
        }
        else{
            document.getElementById("fullnameNoti").innerHTML = "";
        }
        if(this.state.txtAccount === ''){
            document.getElementById("accountNoti").innerHTML = "(*)Bạn không được để trống tên đăng nhập.";
        }
        else{
            if(this.state.usernameAvailable === false){
                document.getElementById("accountNoti").innerHTML = "(*) Tên đăng nhập này đã tồn tại. Vui lòng chọn tên đăng nhập khác!!!";
            }
            else{
                document.getElementById("accountNoti").innerHTML = "";
            }   
        }
        if(this.state.txtPassword === ''){
            document.getElementById("passwordNoti").innerHTML = "(*)Bạn không được để trống mật khẩu.";
        }
        else{
            document.getElementById("passwordNoti").innerHTML = "";
        }
        if(this.state.txtPhone === ''){
            document.getElementById("phoneNoti").innerHTML = "(*)Bạn không được để trống số điện thoại.";
        }
        else{
            document.getElementById("phoneNoti").innerHTML = "";
        }
        if(document.getElementById("address").value === ''){
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
        }
        else{
            document.getElementById("addressNoti").innerHTML = "";
        }
        if(this.state.txtFullname !== '' &&
        this.state.txtAccount !== '' &&
        this.state.txtPassword !== '' && 
        this.state.txtPhone !== '' && 
        document.getElementById("address").value !== '' &&
        this.state.usernameAvailable === true){
            let data = document.getElementById("user_register_form")
            let params=new FormData(data);
            params.append("type","member")
            const api = new userAPI();
            api.register(params)
            .then(response =>{
                if(response[0].code === 200){
                    alert("Đăng kí tài khoản thành công!");
                    this.setState({direct: '/login'});
                }
                else{
                    alert("Đăng kí tài khoản không thành công!");
                }
            })
            .catch(error =>{
                console.log(error)
            });
        }
    }

    render() {
        if(this.state.direct !== ''){
            return <Redirect to={this.state.direct} />
        }
        return (
            <div className="col-md-6 col-md-offset-3 div-form-register">
                <img className="mainlogo col-md-offset-5" src={logo} alt="logoweb" />
                <h2>Đăng kí thành viên</h2>
                <form id="user_register_form" onSubmit={this.handleSubmit} >
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Họ và tên</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Họ và tên..." type="text" name="txtFullname" value={this.state.txtFullname} onChange={this.handleChangle}/>
                        </div>
                        <label id="fullnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Tên tài khoản</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Tên tài khoản..." type="text" name="txtAccount" value={this.state.txtAccount} onChange={this.handleChangle}/>
                        </div>
                        <label id="accountNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Mật khẩu</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Mật khẩu..." type="password" name="txtPassword" value={this.state.txtPassword} onChange={this.handleChangle}/>
                        </div>
                        <label id="passwordNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Số điện thoại (+84)</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Số điện thoại" type="number" name="txtPhone" value={this.state.txtPhone} onChange={this.handleChangle}/>
                        </div>
                        <label id="phoneNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Địa chỉ</label>
                        <GoogleMaps/>
                        <label id="addressNoti"  className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <label className="col-md-10 col-md-offset-1 one-row-register">(*)Lời nhắc: với việc đăng ký, bạn đồng ý với chính sách bảo mật và điều khoản sử dụng của chúng tôi.</label>
                    <input className="btn btn-success col-md-10 col-md-offset-1 but1-register" type="submit" value="Tạo tài khoản" />
                    <Link to="/login" type="button" className="btn btn-info col-md-10 col-md-offset-1 but1-register">Đăng nhập tài khoản</Link>
                </form>
            </div>
        )
    }
}
