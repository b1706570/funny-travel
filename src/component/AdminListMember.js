import React, { Component } from 'react';
import adminAPI from '../api/adminAPI';

export default class AdminListMember extends Component {
    constructor(props){
        super(props);
        this.state = {
            next: 0,
            previous: -50,
            listUser: [],
            totalUser: "",
            totalBooking: "",
            totalUserActive: "",
        }
    }

    componentDidMount(){
        let params = new FormData();
        params.append("according", "member");
        const api = new adminAPI();
        api.getTotalPeople(params)
            .then(response =>{
                this.setState({
                    totalUser: response.member,
                    totalBooking: response.booking,
                    totalUserActive: response.active,
                })
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render() {
        return (
            <div className="col-md-12 admin-content">
                <div className="col-md-9 admin-list-user-left">
                    aaaa
                </div>
                <div className="col-md-3 admin-list-user-right">
                    <div className="col-md-12 orange">
                        <p className="title orange">Tổng số người dùng</p>
                        <p className="data">{this.state.totalUser}</p>
                    </div>
                    <div className="col-md-12 pink">
                        <p className="title pink">Tổng số người dùng đã thanh toán</p>
                        <p className="data">{this.state.totalUserActive}</p>
                    </div>
                    <div className="col-md-12 green">
                        <p className="title green">Tổng số lượt thanh toán</p>
                        <p className="data">{this.state.totalBooking}</p>
                    </div>      
                </div>
            </div>
        )
    }
}
