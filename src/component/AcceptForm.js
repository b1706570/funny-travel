import React, { Component } from 'react';
import adminAPI from '../api/adminAPI';

export default class AcceptForm extends Component {
    constructor(props){
        super(props);
        this.state={
            txtFullname: this.props.data.fullname,
            txtHostname: this.props.data.company,
            txtGmail: this.props.data.email,
            txtPassword: '',
            txtPhonenumber: this.props.data.phone,
            txtAddress: this.props.data.address,
            txtLat: this.props.data.latitude,
            txtLng: this.props.data.longtitude,
            txtState: this.props.data.state,
            txtID: this.props.data.id_proposal,
        };
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChangle=this.handleChangle.bind(this);
    }

    componentDidMount(){
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz123456789!@#$%";
        var length = 8;
        var randPass = '';
        while(randPass.length <= length){
            var randIndex = Math.floor(Math.random() * chars.length);
            randPass += chars.substring(randIndex,randIndex+1);
        }
        this.setState({
            txtPassword: randPass,
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
        if(this.state.txtPassword === ''){
            document.getElementById("passwordNoti").innerHTML = "(*)Bạn không được để trống mật khẩu.";
        }
        else{
            document.getElementById("passwordNoti").innerHTML = "";
        }
        if(this.state.txtPhonenumber === ''){
            document.getElementById("phonenumberNoti").innerHTML = "(*)Bạn không được để trống số điện thoại.";
        }
        else{
            document.getElementById("phonenumberNoti").innerHTML = "";
        }
        if(this.state.txtAddress === ''){
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
        }
        else{
            document.getElementById("addressNoti").innerHTML = "";
        }
        if(this.state.txtFullname !== '' &&
        this.state.txtGmail !== '' &&
        this.state.txtPhonenumber !== '' &&
        this.state.txtPassword !== '' &&
        this.state.txtHostname !== '' &&
        this.state.txtAddress !== '' &&
        this.state.txtLat !== '' &&
        this.state.txtLng !== ''){
            let data = document.getElementById("host-browser-form")
            let params=new FormData(data);
            params.append("index",this.state.txtID);
            params.append("state", this.state.txtState);
            const api = new adminAPI();
            api.acceptproposal(params)
            .then(response =>{
                if(response === 200){
                    alert("Cấp tài khoản thành công!");
                    this.props.processing();
                    this.props.active(2);
                }
                else{
                    alert("Cấp tài khoản thất bại!");
                    console.log(response);
                }
            })
            .catch(error =>{
                console.log(error)
            });
        }
    }

    handleReject = () =>{
        let f=new FormData();
        f.append("index",this.state.txtID);
        const api=new adminAPI();
        api.rejectproposal(f)
        .then(response =>{
            if(response === 200){
                this.props.processing();
                this.props.active(2);
            }
            else{
                alert("Xóa tài khoản thất bại!");
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    render() {
        return (
            <div className="col-md-12 admin-form-browser">
                <h2>Duyệt tài khoản</h2>
                <form id="host-browser-form" onSubmit={this.handleSubmit} >
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Họ và tên</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Họ và tên..." type="text" name="txtFullname" value={this.state.txtFullname} onChange={this.handleChangle}/>
                        </div>
                        <label id="fullnameNoti" className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Tên doanh nghiệp</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Tên doanh nghiệp..." type="text" name="txtHostname" value={this.state.txtHostname} onChange={this.handleChangle}/>
                        </div>
                        <label id="hostnameNoti" className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Email</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="...@gmail.com" type="text" name="txtGmail" value={this.state.txtGmail} onChange={this.handleChangle}/>
                        </div>
                        <label id="emailNoti" className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Mật khẩu</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Mật khẩu" type="password" name="txtPassword" value={this.state.txtPassword} onChange={this.handleChangle}/>
                        </div>
                        <label id="passwordNoti"  className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Số điện thoại (+84)</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Số điện thoại" type="text" name="txtPhonenumber" value={this.state.txtPhonenumber} onChange={this.handleChangle}/>
                        </div>
                        <label id="phonenumberNoti" className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Địa chỉ</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Địa chỉ" type="text" name="txtAddress" value={this.state.txtAddress} onChange={this.handleChangle}/>
                        </div>
                        <label id="addressNoti"  className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Latitude</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Latitude" type="text" name="txtLat" value={this.state.txtLat} readOnly/>
                        </div>
                        <label className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <div className="form-group one-row-register">
                        <label  className="col-md-3 col-md-offset-1 control-label">Longitude</label>
                        <div className="col-md-8">
                            <input className="form-control" placeholder="Longitude" type="text" name="txtLng" value={this.state.txtLng} readOnly/>
                        </div>
                        <label className="col-md-8 col-md-offset-4 notification"></label>
                    </div>
                    <input className="btn btn-success col-md-3 col-md-offset-1 but1-register" type="submit" value="Cấp tài khoản" />
                    <button type="button" className="btn btn-danger col-md-3 col-md-offset-1 but1-register" onClick={this.handleReject}>Bỏ qua</button>
                    <button type="button" className="btn btn-warning col-md-3 col-md-offset-1 but1-register" onClick={this.props.active.bind(this,2)}>Hủy</button>
                </form>
            </div>
        )
    }
}
