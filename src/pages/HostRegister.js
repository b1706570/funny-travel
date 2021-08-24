import React, { Component } from 'react';
import userAPI from '../api/userAPI';
import logo from '../img/logo.png'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';
import GoogleMaps from '../component/GoogleMaps';

export default class HostRegister extends Component {
    constructor(props){
        super(props);
        this.state={
            txtFullname: '',
            txtGmail: '',
            txtPhonenumber: '',
            txtHostname: '',
            listUsernotavailable : [],
            usernameAvailable: true,
            direct: ''
        };
        this.handleChangle=this.handleChangle.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const api=new userAPI();
        api.getallemail()
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
        if(name === 'txtGmail'){
            let i = 0;
            while(i < this.state.listUsernotavailable.length){
                var email = this.state.listUsernotavailable[i];
                if(email['email_host'] === value){
                    document.getElementById("emailNoti").innerHTML = "(*) Email này đã có người sử dụng. Vui lòng chọn Email khác!!!";
                    this.setState({usernameAvailable: false})
                    break;
                }
                else{
                    document.getElementById("emailNoti").innerHTML = "";
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
        if(this.state.txtHostname === ''){
            document.getElementById("hostnameNoti").innerHTML = "(*)Bạn không được để trống tên doanh nghiệp.";
        }
        else{
            document.getElementById("hostnameNoti").innerHTML = "";
        }
        if(this.state.txtGmail === ''){
            document.getElementById("emailNoti").innerHTML = "(*)Bạn không được để trống gmail.";
        }
        else{
            if(this.state.usernameAvailable === false){
                document.getElementById("emailNoti").innerHTML = "(*) Email này đã có người sử dụng. Vui lòng chọn Email khác!!!";
            }
            else{
                document.getElementById("emailNoti").innerHTML = "";
            }   
        }
        if(this.state.txtPhonenumber === ''){
            document.getElementById("phonenumberNoti").innerHTML = "(*)Bạn không được để trống số điện thoại.";
        }
        else{
            document.getElementById("phonenumberNoti").innerHTML = "";
        }
        if(document.getElementById("address").value === ''){
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
        }
        else{
            document.getElementById("addressNoti").innerHTML = "";
        }
        if(this.state.txtFullname !== '' &&
        this.state.txtGmail !== '' &&
        this.state.txtPhonenumber !== '' &&
        document.getElementById("address").value !== '' &&
        this.state.txtHostname !== '' &&
        this.state.usernameAvailable === true){
            let data = document.getElementById("user_register_form")
            let params=new FormData(data);
            params.append("type","host")
            const api = new userAPI();
            api.register(params)
            .then(response =>{
                if(response[0].code === 200){
                    alert("Gửi yêu cầu thành công. Admin sẽ liên lạc với bạn qua email nhé!");
                    this.setState({direct: '/'});
                }
                else{
                    alert("Gửi yêu cầu không thành công!");
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
        var {name, account, phone} = this.state;
        return (
            <div className="col-md-6 col-md-offset-3 div-form-register">
                <img className="mainlogo col-md-offset-5" src={logo} alt="logoweb" />
                <h2>Đăng kí doanh nghiệp</h2>
                <form id="user_register_form" onSubmit={this.handleSubmit} >
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Họ và tên</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Họ và tên..." type="text" name="txtFullname" value={name} onChange={this.handleChangle}/>
                        </div>
                        <label id="fullnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Tên doanh nghiệp</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Tên doanh nghiệp..." type="text" name="txtHostname" value={name} onChange={this.handleChangle}/>
                        </div>
                        <label id="hostnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Email</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="...@gmail.com" type="text" name="txtGmail" value={account} onChange={this.handleChangle}/>
                        </div>
                        <label id="emailNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Số điện thoại</label>
                        <div className="col-md-7">
                            <input className="form-control" placeholder="Số điện thoại" type="text" name="txtPhonenumber" value={phone} onChange={this.handleChangle}/>
                        </div>
                        <label id="phonenumberNoti" className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Địa chỉ</label>
                        <GoogleMaps />
                        <label id="addressNoti"  className="col-md-7 col-md-offset-4 notification"></label>
                    </div>
                    <label className="col-md-10 col-md-offset-1 one-row-register">(*)Lời nhắc: với việc đăng ký, bạn đồng ý với chính sách bảo mật và điều khoản sử dụng của chúng tôi.</label>
                    <input className="btn btn-success col-md-10 col-md-offset-1 but1-register" type="submit" value="Gửi yêu cầu đăng kí" />
                    <Link to="/login" type="button" className="btn btn-info col-md-10 col-md-offset-1 but1-register">Đăng nhập tài khoản</Link>
                </form>
            </div>
        )
    }
}
