import React, { Component } from 'react';
import GoogleMaps from './GoogleMaps';
import hostAPI from '../api/hostAPI';
import logo from '../icons/add-logo.png';
import { Redirect } from 'react-router-dom';
import config from '../config.json';

export default class HostUpdateForm extends Component {
    constructor(props){
        super(props);
        const data = JSON.parse(localStorage.getItem('data'));
        let currentLogo = logo;
        if(data.logo_host !== ''){
            currentLogo = config.ServerURL + "/" +data.logo_host;
        }
        this.state={
            txtID: data.id_host,
            txtFullname: data.fullname_host,
            txtHostname: data.company_name,
            txtGmail: data.email_host,
            txtPhonenumber: data.phone_host,
            txtAddress: data.address_host,
            txtLat: data.latitude,
            txtLng: data.longtitude,
            txtLogo: currentLogo,
            txtImg: data.image_host,
            redirect: '',
        };
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChangle=this.handleChangle.bind(this);
        this.imageHandler=this.imageHandler.bind(this);
    }

    imageHandler = (e) =>{
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                this.setState({txtLogo: reader.result});
            }
        }
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    updateDataLocalStorage = () =>{
        const api1 = new hostAPI();
        api1.gethostbyID(this.state.txtID)
        .then(response =>{
            localStorage.setItem('data', JSON.stringify(response));
        })
        .catch(error =>{
            console.log(error);
        })
    }


    handleChangle = (e) =>{
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name]: value,
        })
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
            document.getElementById("emailNoti").innerHTML = "";
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
        this.state.txtHostname !== '' &&
        document.getElementById("address").value !== ''){
            let data = document.getElementById("host-update-form")
            let params=new FormData(data);
            params.append("txtID",this.state.txtID);
            const api = new hostAPI();
            api.updateHostInfo(params)
            .then(response =>{
                if(response === 200){
                    this.updateDataLocalStorage();
                    alert("Cập nhật tài khoản thành công!");
                    let redirectURL= "/host/" + localStorage.getItem('username');
                    this.setState({redirect: redirectURL});
                }
                else{
                    alert("Cập nhật tài khoản thất bại!");
                    console.log(response);
                }
            })
            .catch(error =>{
                console.log(error)
            });
        }
    }

    render() {
        if(this.state.redirect !== ''){ 
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="col-md-12 host-update-form">
                <div className="bg-host-update-form"></div>
                <div className="content-host-update-form">
                    <h2>Cập nhật tài khoản</h2>
                    <form id="host-update-form" onSubmit={this.handleSubmit} >
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Họ và tên</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Họ và tên..." type="text" name="txtFullname" value={this.state.txtFullname} onChange={this.handleChangle}/>
                                </div>
                                <label id="fullnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Tên doanh nghiệp</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Tên doanh nghiệp..." type="text" name="txtHostname" value={this.state.txtHostname} onChange={this.handleChangle}/>
                                </div>
                                <label id="hostnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Email</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="...@gmail.com" type="text" name="txtGmail" value={this.state.txtGmail} onChange={this.handleChangle}/>
                                </div>
                                <label id="emailNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Mật khẩu</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder='Nhập mật khẩu mới nếu bạn muốn thay đổi' type="password" name="txtPassword"  onChange={this.handleChangle}/>
                                </div>
                                <label id="passwordNoti"  className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Số điện thoại (+84)</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Số điện thoại" type="text" name="txtPhonenumber" value={this.state.txtPhonenumber} onChange={this.handleChangle}/>
                                </div>
                                <label id="phonenumberNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">LatLng</label>
                                <div className="col-md-7">
                                    <input className="form-control" type="text" value={this.state.txtLat+' , '+this.state.txtLng} onChange={this.handleChangle} readOnly/>
                                </div>
                                <label  className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register col-md-12">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Địa chỉ</label>
                                <GoogleMaps cls='large-map' address={this.state.txtAddress} lat={this.state.txtLat} long={this.state.txtLng} />
                                <label id="addressNoti"  className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Logo</label>
                                <div className="col-md-7">
                                    <input id="logo-host" className="form-control" type="file" name="txtLogo" onChange={this.imageHandler}/>
                                    <label htmlFor="logo-host" className="host-logo-file">
                                        <img className="img-logo" src={this.state.txtLogo} alt="logo"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <input className="btn host-btn-submit col-md-10 col-md-offset-1 but1-register" type="submit" value="Cập nhật" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
