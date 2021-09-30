import React, { Component } from 'react';
import adminAPI from '../api/adminAPI';

export default class AdminListHost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: 0,
            anymore: 1,
            listUser: [],
            totalUser: "",
            totalBooking: "",
            totalRoom: "",
            search: "",
        }
        this.GetUser = this.GetUser.bind(this);
        this.Search = this.Search.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
    }

    componentDidMount() {
        let params = new FormData();
        params.append("type", "host");
        const api = new adminAPI();
        api.getTotalPeople(params)
            .then(response => {
                this.setState({
                    totalUser: response.member,
                    totalBooking: response.booking,
                    totalRoom: response.room,
                })
            })
            .catch(error => {
                console.log(error);
            })
        this.GetUser("next");
    }

    GetUser = (control) => {
        const api = new adminAPI();
        var pagination = this.state.pagination;
        if (control === "next") {
            if (this.state.anymore === 0) {
                alert("Bạn đang ở cuối danh sách.");
            }
            else {
                let params = new FormData();
                params.append("pagination", pagination);
                params.append("search", this.state.search);
                params.append("type", "host");
                api.getAllUser(params)
                    .then(response => {
                        this.setState({
                            listUser: response['data'],
                            anymore: response['more'],
                            pagination: pagination + 1,
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
        else {
            if (this.state.pagination === 1 || this.state.pagination === 0) {
                alert("Bạn đang ở đầu danh sách");
            }
            else {
                pagination = pagination - 2;
                let params = new FormData();
                params.append("pagination", pagination);
                params.append("search", this.state.search);
                params.append("type", "host");
                api.getAllUser(params)
                    .then(response => {
                        this.setState({
                            listUser: response['data'],
                            anymore: response['more'],
                            pagination: pagination + 1,
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }

    Search = (e) => {
        this.setState({
            search: e.target.value,
            pagination: 0,
            anymore: 1,
        })
    }

    DeleteUser = (index) => {
        var iduser = this.state.listUser[index].id_mem;
        var fullname = this.state.listUser[index].fullname;
        if(window.confirm("Bạn có chắc chắn muốn xóa " + fullname + " ?")){
            let params = new FormData();
            params.append("id_host", iduser);
            params.append("type", "host");
            const api = new adminAPI();
            api.deleteUser(params)
                .then(response =>{
                    if(response === 200){
                        alert("Xóa tài khoản thành công!");
                        this.componentDidMount();
                    }
                    else{
                        alert("Xóa tài khoản thất bại!");
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
        }
    }

    render() {
        var formater = new Intl.NumberFormat();
        return (
            <div className="col-md-12 admin-content">
                <div className="col-md-9 admin-list-user-left">
                    <div className="col-md-12 search">
                        <div className="col-md-8">
                            <div className=" input-group">
                                <input className="form-control" value={this.state.search} onChange={this.Search} placeholder="Tìm kiếm theo tên doanh nghiệp hoặc số điện thoại..." />
                                <span className="input-group-btn">
                                    <span className="btn btn-default" type="button" onClick={this.GetUser.bind(this, "next")}>Go!</span>
                                </span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <span className="btn-previous" onClick={this.GetUser.bind(this, "previous")}><span className="glyphicon glyphicon-backward"></span> Trang trước</span>
                            <span className="btn-next" onClick={this.GetUser.bind(this, "next")}>Trang sau <span className="glyphicon glyphicon-forward"></span></span>
                        </div>
                    </div>
                    <div className="col-md-12 admin-table">
                        <div className="col-md-12 header rows">
                            <div className="col-md-2">Chủ sở hữu</div>
                            <div className="col-md-2">Tên doanh nghiệp</div>
                            <div className="col-md-2">Email</div>
                            <div className="col-md-3">Địa chỉ</div>
                            <div className="col-md-2">Điện thoại</div>
                        </div>
                        {
                            this.state.listUser.length > 0 ? (
                                this.state.listUser.map((user, index) =>
                                    index % 2 === 0 ? (
                                        <div className="col-md-12 rows line-table-white" key={index}>
                                            <div className="col-md-2">{user.fullname_host}</div>
                                            <div className="col-md-2">
                                                {
                                                    user.company_name.split(" ").map(word => {
                                                        if (this.state.search.toLowerCase().indexOf(word.toLowerCase()) !== -1)
                                                            return <span key={word} className="yellow-word">{word} </span>
                                                        return <span key={word}>{word} </span>
                                                    })
                                                }
                                            </div>
                                            <div className="col-md-2">{user.email_host}</div>
                                            <div className="col-md-3">{user.address_host}</div>
                                            <div className="col-md-2">
                                                {
                                                    user.phone_host.indexOf(this.state.search) !== -1 && this.state.search !== "" ? (
                                                        <span className="yellow-word">{user.phone_host}</span>
                                                    ) : (
                                                        <span>{user.phone_host}</span>
                                                    )
                                                }
                                            </div>
                                            <div className="col-md-1"><span className="glyphicon glyphicon-trash" onClick={this.DeleteUser.bind(this, index)}></span></div>
                                        </div>
                                    ) : (
                                        <div className="col-md-12 rows line-table-gray" key={index}>
                                            <div className="col-md-2">{user.fullname_host}</div>
                                            <div className="col-md-2">
                                                {
                                                    user.company_name.split(" ").map(word => {
                                                        if (this.state.search.toLowerCase().indexOf(word.toLowerCase()) !== -1)
                                                            return <span key={word} className="yellow-word">{word} </span>
                                                        return <span key={word}>{word} </span>
                                                    })
                                                }
                                            </div>
                                            <div className="col-md-2">{user.email_host}</div>
                                            <div className="col-md-3">{user.address_host}</div>
                                            <div className="col-md-2">
                                                {
                                                    user.phone_host.indexOf(this.state.search) !== -1 && this.state.search !== "" ? (
                                                        <span className="yellow-word">{user.phone_host}</span>
                                                    ) : (
                                                        <span>{user.phone_host}</span>
                                                    )
                                                }
                                            </div>
                                            <div className="col-md-1"><span className="glyphicon glyphicon-trash" onClick={this.DeleteUser.bind(this, index)}></span></div>
                                        </div>
                                    )
                                )
                            ) : (null)
                        }
                    </div>
                </div>
                <div className="col-md-3 admin-list-user-right">
                    <div className="col-md-12 pink">
                        <p className="title pink">Tổng số host</p>
                        <p className="data">{formater.format(this.state.totalUser)}</p>
                    </div>
                    <div className="col-md-12 green">
                        <p className="title green">Tổng số phòng</p>
                        <p className="data">{formater.format(this.state.totalRoom)}</p>
                    </div>
                    <div className="col-md-12 orange">
                        <p className="title orange">Tổng số giao dịch thành công</p>
                        <p className="data">{formater.format(this.state.totalBooking)}</p>
                    </div>
                </div>
            </div>
        )
    }
}
