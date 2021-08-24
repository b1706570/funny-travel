import React, { Component } from 'react';
import adminAPI from '../api/adminAPI';

export default class ListProposal extends Component {
    constructor(props){
        super(props);
        this.state = {
            listProposal: []
        }

        this.handleAccept=this.handleAccept.bind(this);
        this.handleReject=this.handleReject.bind(this);
    }

    componentDidMount(){
        const api = new adminAPI();
        api.getlistproposal()
        .then(response =>{
            this.setState({
                listProposal: response
            })
        })
        .catch(error =>{
            console.log(error);
        })
    }

    handleAccept = (e) =>{
        this.props.active(3);
        let idx = e.target.value;
        let data = this.state.listProposal[idx];
        this.props.loaddata(data);
    }

    handleReject = (e) =>{
        var index=e.target.value;
        let f=new FormData();
        f.append("index",index);
        const api=new adminAPI();
        api.rejectproposal(f)
        .then(response =>{
            if(response === 200){
                this.componentDidMount();
                this.props.processing();
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
            <div className="admin-content">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-md-2">Tên chủ doanh nghiệp</th>
                        <th className="col-md-2">Tên doanh nghiệp</th>
                        <th className="col-md-2">Email</th>
                        <th className="col-md-2">Số điện thoại</th>
                        <th className="col-md-3">Địa chỉ</th>
                        <th className="col-md-1"></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.listProposal.map((obj, index) => {
                                return(
                                    <tr key={index}>
                                        <td className="col-md-2">{obj.fullname}</td>
                                        <td className="col-md-2">{obj.company}</td>
                                        <td className="col-md-2">{obj.email}</td>
                                        <td className="col-md-2">{obj.phone}</td>
                                        <td className="col-md-3">{obj.address}</td>
                                        <td className="col-md-1">
                                            <button className="admin-btn-accept btn-success glyphicon glyphicon-ok" onClick={this.handleAccept} value={index}></button>
                                            <button className="admin-btn-reject btn-danger glyphicon glyphicon-remove" onClick={this.handleReject} value={obj.id_proposal}></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
