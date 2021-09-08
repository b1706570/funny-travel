import React, { Component } from 'react';
import GoogleMaps from './GoogleMaps';
import hostAPI from '../api/hostAPI';
import logo from '../icons/add-logo.png';
import { Redirect } from 'react-router-dom';
import config from '../config.json';

export default class HostUpdateForm extends Component {
    constructor(props){
        super(props);
        /*const data = JSON.parse(localStorage.getItem('data'));
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
            txtPaypal: data.paypal_id,
            txtBanknumber: data.bank_number,
            txtBranchname: data.branch_name,
            txtOwneraccount: data.owner_acount,
            txtLat: data.latitude,
            txtLng: data.longtitude,
            txtLogo: currentLogo,
            txtImg: data.image_host,
            redirect: '',
        };*/
        this.state = {
            txtID: '',
            txtFullname: '',
            txtHostname: '',
            txtGmail: '',
            txtPhonenumber: '',
            txtAddress: '',
            txtPaypal: '',
            txtBanknumber: '',
            txtBranchname: '',
            txtOwneraccount: '',
            txtLat: '',
            txtLng: '',
            txtLogo: '',
            redirect: '',
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChangle=this.handleChangle.bind(this);
        this.imageHandler=this.imageHandler.bind(this);
    }

    componentDidMount(){
        const api = new hostAPI();
        api.gethostbyID(localStorage.getItem("iduser"))
            .then(response =>{
                var data = response;
                let currentLogo = logo;
                if(data.logo_host !== ''){
                    currentLogo = config.ServerURL + "/" +data.logo_host;
                }
                this.setState({
                    txtID: data.id_host,
                    txtFullname: data.fullname_host,
                    txtHostname: data.company_name,
                    txtGmail: data.email_host,
                    txtPhonenumber: data.phone_host,
                    txtAddress: data.address_host,
                    txtPaypal: data.paypal_id,
                    txtBanknumber: data.bank_number,
                    txtBranchname: data.branch_name,
                    txtOwneraccount: data.owner_acount,
                    txtLat: data.latitude,
                    txtLng: data.longtitude,
                    txtLogo: currentLogo,
                })
            })
            .catch(error =>{
                console.log(error);
            })
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
        var ok = true;
        if(this.state.txtFullname === ''){
            document.getElementById("fullnameNoti").innerHTML = "(*)Bạn không được để trống họ và tên.";
            ok = false;
        }
        else{
            document.getElementById("fullnameNoti").innerHTML = "";
        }
        if(this.state.txtHostname === ''){
            document.getElementById("hostnameNoti").innerHTML = "(*)Bạn không được để trống tên doanh nghiệp.";
            ok = false;
        }
        else{
            document.getElementById("hostnameNoti").innerHTML = "";
        }
        if(this.state.txtGmail === ''){
            document.getElementById("emailNoti").innerHTML = "(*)Bạn không được để trống gmail.";
            ok = false;
        }
        else{
            document.getElementById("emailNoti").innerHTML = "";
        }
        if(this.state.txtPaypal === ''){
            document.getElementById("paypalNoti").innerHTML = "(*)Bạn không được để trống Client-id Paypal.";
            ok = false;
        }
        else{
            document.getElementById("paypalNoti").innerHTML = "";
        }
        if(this.state.txtBanknumber === ''){
            document.getElementById("banknumberNoti").innerHTML = "(*)Bạn không được để trống STK ngân hàng.";
            ok = false;
        }
        else{
            document.getElementById("banknumberNoti").innerHTML = "";
        }
        if(this.state.txtBranchname === ''){
            document.getElementById("branchnameNoti").innerHTML = "(*)Bạn không được để trống tên ngân hàng.";
            ok = false;
        }
        else{
            document.getElementById("branchnameNoti").innerHTML = "";
        }
        if(this.state.txtOwneraccount === ''){
            document.getElementById("owneraccountNoti").innerHTML = "(*)Bạn không được để trống chủ tài khoản.";
            ok = false;
        }
        else{
            document.getElementById("owneraccountNoti").innerHTML = "";
        }
        if(this.state.txtPhonenumber === ''){
            document.getElementById("phonenumberNoti").innerHTML = "(*)Bạn không được để trống số điện thoại.";
            ok = false;
        }
        else{
            document.getElementById("phonenumberNoti").innerHTML = "";
        }
        if(document.getElementById("address").value === ''){
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
            ok = false;
        }
        else{
            document.getElementById("addressNoti").innerHTML = "";
        }
        if(ok === true && document.getElementById("address").value !== ''){
            let data = document.getElementById("host-update-form");
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
        console.log(this.state.txtBanknumber);
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
                                <label  className="col-md-3 col-md-offset-1 control-label">PayPal-ID</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Copy Client-ID PayPal của bạn paste vào đây..." type="text" name="txtPaypal" value={this.state.txtPaypal} onChange={this.handleChangle}/>
                                </div>
                                <label id="paypalNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">STK ngân hàng</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Số tài khoản ngân hàng của bạn..." type="number" name="txtBanknumber" value={this.state.txtBanknumber} onChange={this.handleChangle}/>
                                </div>
                                <label id="banknumberNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Tên ngân hàng</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Tên ngân hàng + chi nhánh..." type="text" name="txtBranchname" value={this.state.txtBranchname} onChange={this.handleChangle}/>
                                </div>
                                <label id="branchnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">Tên chủ tài khoản</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Tên chủ tài khoản được ghi trên thẻ..." type="text" name="txtOwneraccount" value={this.state.txtOwneraccount} onChange={this.handleChangle}/>
                                </div>
                                <label id="owneraccountNoti" className="col-md-7 col-md-offset-4 notification"></label>
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
                                <GoogleMaps key={this.state.txtID} cls='large-map' address={this.state.txtAddress} lat={this.state.txtLat} long={this.state.txtLng} />
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
