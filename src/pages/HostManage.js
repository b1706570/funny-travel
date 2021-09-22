import React, { Component } from 'react';
import HostHeader from '../component/HostHeader';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

export default class HostManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AccordingTo: "Ngày",
            TotalRevenue: 0,
            AllTransaction: [],
            StatisticsRevenue: {},
            StatisticsEachRoom: {},
            CancellationRate: {},
        }
        this.StatisticsRevenue = this.StatisticsRevenue.bind(this);
        this.TotalRevenue = this.TotalRevenue.bind(this);
        this.StatisticsEachRoom = this.StatisticsEachRoom.bind(this);
        this.StatisticsCancellation = this.StatisticsCancellation.bind(this);
    }

    componentDidMount() {
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        const api = new hostAPI();
        api.getTransactionByOfHost(params)
            .then(response => {
                var allTrans = response;
                this.StatisticsRevenue(allTrans, "day");
                this.TotalRevenue(allTrans, "today");
                this.StatisticsEachRoom(allTrans);
                this.StatisticsCancellation(allTrans);
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
        var now = new Date();
        var value = [];
        var label = [];
        if (condition === "day") {
            for (let i = 0; i < now.getDate(); i++) {
                label[i] = (i + 1) + "/" + (now.getMonth() + 1) + "/" + (now.getFullYear() % 2000);
                value[i] = 0;
                for (let x = 0; x < alldata.length; x++) {
                    if (alldata[x].checkout_date === now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + (i + 1)).slice(-2) + " 12:00:00")
                        value[i] += Number(alldata[x].total_payment);
                }
            }
            let revenue = {};
            revenue['label'] = label;
            revenue['value'] = value;
            this.setState({
                StatisticsRevenue: revenue,
                AccordingTo: "Ngày",
            });
        }
        else if (condition === "month") {
            for (let i = 0; i < (now.getMonth() + 1); i++) {
                label[i] = (i + 1) + "/" + now.getFullYear();
                value[i] = 0;
                for (let x = 0; x < alldata.length; x++) {
                    let month = new Date(alldata[x].checkout_date).getMonth() + 1;
                    let year = new Date(alldata[x].checkout_date).getFullYear();
                    if (month === (i + 1) && year === now.getFullYear()) {
                        value[i] += Number(alldata[x].total_payment);
                    }
                }
            }
            let revenue = {};
            revenue['label'] = label;
            revenue['value'] = value;
            this.setState({
                StatisticsRevenue: revenue,
                AccordingTo: "Tháng",
            });
        }
        else if (condition === "year") {
            alldata.sort((a, b) => ((new Date(a.checkout_date).getFullYear()) > (new Date(b.checkout_date).getFullYear())) ? 1 : -1);
            let start = new Date(alldata[0].checkout_date).getFullYear();
            let end = new Date(alldata[alldata.length - 1].checkout_date).getFullYear();
            for (let i = start; i <= end; i++) {
                label[i] = i;
                value[i] = 0;
                for (let x = 0; x < alldata.length; x++) {
                    let year = new Date(alldata[x].checkout_date).getFullYear();
                    if (year === i) {
                        value[i] += Number(alldata[x].total_payment);
                    }
                }
            }
            label.splice(0, start);
            value.splice(0, start);
            let revenue = {};
            revenue['label'] = label;
            revenue['value'] = value;
            this.setState({
                StatisticsRevenue: revenue,
                AccordingTo: "Năm",
            });
        }
        else if (condition === "custom") {
            let month = document.getElementById("host-manage-input-month").value;
            let year = document.getElementById("host-manage-input-year").value;
            if (year === "") {
                alert("Bạn cần nhập dữ liệu cho cột năm trước khi thống kê");
            }
            else {
                if (month === "") {
                    for (let i = 0; i < 12; i++) {
                        label[i] = (i + 1) + "/" + year;
                        value[i] = 0;
                        for (let x = 0; x < alldata.length; x++) {
                            let Month = new Date(alldata[x].checkout_date).getMonth() + 1;
                            let Year = new Date(alldata[x].checkout_date).getFullYear();
                            if (Month === (i + 1) && Year === Number(year)) {
                                value[i] += Number(alldata[x].total_payment);
                            }
                        }
                    }
                    let revenue = {};
                    revenue['label'] = label;
                    revenue['value'] = value;
                    this.setState({
                        StatisticsRevenue: revenue,
                        AccordingTo: "Năm " + year,
                    });
                }
                else{
                    let numday = new Date(year, month, 0).getDate();
                    for (let i = 0; i < numday; i++) {
                        label[i] = (i + 1) + "/" + month + "/" + (year % 2000);
                        value[i] = 0;
                        for (let x = 0; x < alldata.length; x++) {
                            if (alldata[x].checkout_date === year + "-" + ("0" + month).slice(-2) + "-" + ("0" + (i + 1)).slice(-2) + " 12:00:00")
                                value[i] += Number(alldata[x].total_payment);
                        }
                    }
                    let revenue = {};
                    revenue['label'] = label;
                    revenue['value'] = value;
                    this.setState({
                        StatisticsRevenue: revenue,
                        AccordingTo: "Tháng " + month + ", Năm " + year,
                    });
                }
            }
        }
    }

    StatisticsEachRoom = (alldata) => {
        alldata.sort((a, b) => (a.name_room > b.name_room) ? 1 : -1);
        let label = [];
        let value = [];
        alldata.forEach((trans) => {
            if (label.indexOf(trans.name_room) === -1) {
                label.push(trans.name_room);
                value.push(1);
            }
            else {
                value[label.indexOf(trans.name_room)] += 1;
            }
        });
        let data = {};
        data['label'] = label;
        data['value'] = value;
        this.setState({ StatisticsEachRoom: data });
    }

    StatisticsCancellation = (alldata) => {
        let label = ['DATHANHTOAN', 'DAHUY'];
        let value = [0, 0];
        alldata.forEach((trans) => {
            value[label.indexOf(trans.state)] += 1;
        })
        let data = {};
        data['label'] = label;
        data['value'] = value;
        this.setState({ StatisticsCancellation: data });
    }

    render() {
        var formater = new Intl.NumberFormat();
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
                <div className="host-manage-content col-md-12">
                    <div className="host-manage-total-revenue col-md-12">DOANH THU CỦA NGÀY HÔM NAY: {formater.format(this.state.TotalRevenue)} (VND)</div>
                    <div className="host-manage-statistics-revenue col-md-12">
                        <div className="col-md-12 host-manage-title">Thống kê doanh thu theo:
                            <div className="btn-group">
                                <button type="button" className="btn">{this.state.AccordingTo}</button>
                                <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, "day")}>Ngày</Link></li>
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, "month")}>Tháng</Link></li>
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, "year")}>Năm</Link></li>
                                    <li role="separator" className="divider"></li>
                                    <li>Tháng: <input id="host-manage-input-month" maxLength="2" />
                                        Năm: <input id="host-manage-input-year" maxLength="4" />
                                        <span className="glyphicon glyphicon-search" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, "custom")}></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12 chart">
                            {
                                (this.state.AccordingTo === "Tháng")  
                                || (this.state.AccordingTo.indexOf("Năm ") !== -1 && this.state.AccordingTo.indexOf("Tháng") === -1) ? (
                                    <Line
                                        data={{
                                            labels: this.state.StatisticsRevenue['label'],
                                            datasets: [
                                                {
                                                    label: 'DOANH THU (VND)',
                                                    data: this.state.StatisticsRevenue['value'],
                                                    backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                                                    borderColor: ['rgba(255, 99, 132, 1)'],
                                                    borderWidth: 5,
                                                }
                                            ]
                                        }}
                                        height={100}
                                    />
                                ) : (
                                    <Bar
                                        data={{
                                            labels: this.state.StatisticsRevenue['label'],
                                            datasets: [
                                                {
                                                    label: 'DOANH THU (VND)',
                                                    data: this.state.StatisticsRevenue['value'],
                                                    backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                                                    borderColor: ['rgba(255, 99, 132, 1)'],
                                                    borderWidth: 5,
                                                }
                                            ]
                                        }}
                                        height={100}
                                    />
                                )
                            }
                        </div>
                        <div className="col-md-12 host-manage-title">Thống kê tổng số lượt đặt theo từng phòng</div>
                        <div className="col-md-12 chart">
                            <Bar
                                data={{
                                    labels: this.state.StatisticsEachRoom['label'],
                                    datasets: [
                                        {
                                            label: 'LƯỢT ĐẶT',
                                            data: this.state.StatisticsEachRoom['value'],
                                            backgroundColor: [
                                                'rgba(255, 159, 64, 0.5)',
                                                'rgba(54, 162, 235, 0.5)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(54, 162, 235, 1)',
                                            ],
                                            borderWidth: 5,
                                        }
                                    ]
                                }}
                                height={100}
                            />
                        </div>
                        <div className="col-md-12 host-manage-title">Tỉ lệ đặt phòng / hủy phòng</div>
                        <div className="col-md-12 chart">
                            <Doughnut
                                data={{
                                    labels: this.state.StatisticsCancellation['label'],
                                    datasets: [
                                        {
                                            label: 'LƯỢT ĐẶT',
                                            data: this.state.StatisticsCancellation['value'],
                                            backgroundColor: [
                                                'rgb(255, 0, 0)',
                                                'rgb(180, 180, 180)',
                                            ],
                                        }
                                    ]
                                }}
                                width={600}
                                height={600}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                        <div className="col-md-12 host-manage-title">Chi tiết các giao dịch</div>
                        <div className="col-md-12">
                            aa
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
