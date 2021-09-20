import React, { Component } from 'react';
import HostHeader from '../component/HostHeader';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';

export default class HostManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            TotalRevenue: 0,
            AllTransaction: [],
            RevenuePerMonth: [],
            StatisticsEachRoom: [],
            CancellationRate: [],
        }
    }

    componentDidMount(){
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        const api = new hostAPI();
        api.getTransactionByOfHost(params)
            .then(response =>{
                console.log(response);
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render() {
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        return (
            <div>
                <div className="host-header col-md-12">
                    <HostHeader hostActive={2} />
                </div>
            </div>
        )
    }
}
