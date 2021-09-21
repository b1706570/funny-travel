import React, { Component } from 'react';
import HostHeader from '../component/HostHeader';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';

export default class HostManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TotalRevenue: 0,
            AllTransaction: [],
            StatisticsRevenue: {},
            StatisticsEachRoom: {},
            CancellationRate: {},
        }
        this.StatisticsRevenue = this.StatisticsRevenue.bind(this);
        this.TotalRevenue = this.TotalRevenue.bind(this);
    }

    componentDidMount() {
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        const api = new hostAPI();
        api.getTransactionByOfHost(params)
            .then(response => {
                var allTrans = response;
                console.log(response);
                this.StatisticsRevenue(allTrans, "day");
                this.TotalRevenue(allTrans, "today");
                this.StatisticsEachRoom(allTrans);
                this.setState({ AllTransaction: response });
            })
            .catch(error => {
                console.log(error);
            })
    }

    TotalRevenue = (alldata, condition) => {
        if (condition === "today") {
            let now = new Date();
            let today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + " 12:00:00";
            let value = 0;
            for (let i = 0; i < alldata.length; i++) {
                if (alldata[i].checkout_date === today)
                    value += alldata[i].total_payment;
            }
            this.setState({ TotalRevenue: value });
        }
    }

    StatisticsRevenue = (alldata, condition) => {
        if (condition === "day") {
            let now = new Date();
            let value = [];
            let label = [];
            for (let i = 0; i < now.getDate(); i++) {
                label[i] = (i + 1) + "/" + (now.getMonth() + 1);
                value[i] = 0;
                for (let x = 0; x < alldata.length; x++) {
                    if (alldata[x].checkout_date === now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + (i + 1)).slice(-2) + " 12:00:00")
                        value[i] += Number(alldata[x].total_payment);
                }
            }
            let revenue = {};
            revenue['label'] = label;
            revenue['value'] = value;
            this.setState({ StatisticsRevenue: revenue });
        }
    }

    StatisticsEachRoom = (alldata) => {
        alldata.sort((a, b) => (a.name_room > b.name_room) ? 1 : -1);
        let label = [];
        let value = [];
        alldata.forEach((img) => {
            if (label.indexOf(img.name_room) === -1) {
                label.push(img.name_room);
                value.push(1);
            }
            else{
                value[label.indexOf(img.name_room)] += 1;
            }
        });
        let data = {};
        data['label'] = label;
        data['value'] = value;
        this.setState({ StatisticsEachRoom: data });
    }

    render() {
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        if (this.state.AllTransaction.length === 0) {
            return (
                <div>
                    <div className="host-header col-md-12">
                        <HostHeader hostActive={2} />
                    </div>
                    <div className="noti-empty-booking-schedule">
                        <p>Bạn không có lịch đặt nào cả</p>
                    </div>
                </div>
            )
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
