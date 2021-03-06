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
            document.getElementById("fullnameNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng h??? v?? t??n.";
            ok = false;
        }
        else{
            document.getElementById("fullnameNoti").innerHTML = "";
        }
        if(this.state.txtHostname === ''){
            document.getElementById("hostnameNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng t??n doanh nghi???p.";
            ok = false;
        }
        else{
            document.getElementById("hostnameNoti").innerHTML = "";
        }
        if(this.state.txtGmail === ''){
            document.getElementById("emailNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng gmail.";
            ok = false;
        }
        else{
            document.getElementById("emailNoti").innerHTML = "";
        }
        if(this.state.txtPaypal === ''){
            document.getElementById("paypalNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng Client-id Paypal.";
            ok = false;
        }
        else{
            document.getElementById("paypalNoti").innerHTML = "";
        }
        if(this.state.txtBanknumber === ''){
            document.getElementById("banknumberNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng STK ng??n h??ng.";
            ok = false;
        }
        else{
            document.getElementById("banknumberNoti").innerHTML = "";
        }
        if(this.state.txtBranchname === ''){
            document.getElementById("branchnameNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng t??n ng??n h??ng.";
            ok = false;
        }
        else{
            document.getElementById("branchnameNoti").innerHTML = "";
        }
        if(this.state.txtOwneraccount === ''){
            document.getElementById("owneraccountNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng ch??? t??i kho???n.";
            ok = false;
        }
        else{
            document.getElementById("owneraccountNoti").innerHTML = "";
        }
        if(this.state.txtPhonenumber === ''){
            document.getElementById("phonenumberNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng s??? ??i???n tho???i.";
            ok = false;
        }
        else{
            document.getElementById("phonenumberNoti").innerHTML = "";
        }
        if(document.getElementById("address").value === ''){
            document.getElementById("addressNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng ?????a ch???.";
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
                    alert("C???p nh???t t??i kho???n th??nh c??ng!");
                    let redirectURL= "/host/" + localStorage.getItem('username');
                    this.setState({redirect: redirectURL});
                }
                else{
                    alert("C???p nh???t t??i kho???n th???t b???i!");
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
                    <h2>C???p nh???t t??i kho???n</h2>
                    <form id="host-update-form" onSubmit={this.handleSubmit} >
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">H??? v?? t??n</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="H??? v?? t??n..." type="text" name="txtFullname" value={this.state.txtFullname} onChange={this.handleChangle}/>
                                </div>
                                <label id="fullnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">T??n doanh nghi???p</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="T??n doanh nghi???p..." type="text" name="txtHostname" value={this.state.txtHostname} onChange={this.handleChangle}/>
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
                                <label  className="col-md-3 col-md-offset-1 control-label">M???t kh???u</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder='Nh???p m???t kh???u m???i n???u b???n mu???n thay ?????i' type="password" name="txtPassword"  onChange={this.handleChangle}/>
                                </div>
                                <label id="passwordNoti"  className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">PayPal-ID</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="Copy Client-ID PayPal c???a b???n paste v??o ????y..." type="text" name="txtPaypal" value={this.state.txtPaypal} onChange={this.handleChangle}/>
                                </div>
                                <label id="paypalNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">STK ng??n h??ng</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="S??? t??i kho???n ng??n h??ng c???a b???n..." type="number" name="txtBanknumber" value={this.state.txtBanknumber} onChange={this.handleChangle}/>
                                </div>
                                <label id="banknumberNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">T??n ng??n h??ng</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="T??n ng??n h??ng + chi nh??nh..." type="text" name="txtBranchname" value={this.state.txtBranchname} onChange={this.handleChangle}/>
                                </div>
                                <label id="branchnameNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">T??n ch??? t??i kho???n</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="T??n ch??? t??i kho???n ???????c ghi tr??n th???..." type="text" name="txtOwneraccount" value={this.state.txtOwneraccount} onChange={this.handleChangle}/>
                                </div>
                                <label id="owneraccountNoti" className="col-md-7 col-md-offset-4 notification"></label>
                            </div>
                        </div>
                        <div className="form-group one-row-register">
                            <div className="host-update-form-cluster col-md-6">
                                <label  className="col-md-3 col-md-offset-1 control-label">S??? ??i???n tho???i (+84)</label>
                                <div className="col-md-7">
                                    <input className="form-control" placeholder="S??? ??i???n tho???i" type="text" name="txtPhonenumber" value={this.state.txtPhonenumber} onChange={this.handleChangle}/>
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
                                <label  className="col-md-3 col-md-offset-1 control-label">?????a ch???</label>
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
                            <input className="btn host-btn-submit col-md-10 col-md-offset-1 but1-register" type="submit" value="C???p nh???t" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
