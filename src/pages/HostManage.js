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
            listTransDetail: [],
            StatisticsRevenue: {},
            StatisticsEachRoom: {},
            CancellationRate: {},
            Day: "",
            Month: "",
            Year: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.StatisticsRevenue = this.StatisticsRevenue.bind(this);
        this.TotalRevenue = this.TotalRevenue.bind(this);
        this.StatisticsEachRoom = this.StatisticsEachRoom.bind(this);
        this.StatisticsCancellation = this.StatisticsCancellation.bind(this);
        this.CreateListDetailTransaction = this.CreateListDetailTransaction.bind(this);
    }

    componentDidMount() {
        let now = new Date();
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
                //this.CreateListDetailTransaction(allTrans, now.getDate(), now.getMonth() + 1, now.getFullYear());
                this.CreateListDetailTransaction(allTrans, 19, 9, 2021);
                this.setState({
                    AllTransaction: response,
                    Day: now.getDate(),
                    Month: now.getMonth() + 1,
                    Year: now.getFullYear(),
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleChange = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({ [name]: value });
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
                else {
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

    CreateListDetailTransaction = (alldata, day, month, year) => {
        let data = [];
        if (year === "") {
            alert("Bạn phải nhập năm trước khi thống kê");
        }
        else {
            if (day !== "" && month === "") {
                alert("Bạn hãy nhập thêm tháng nữa nhé!");
            }
            else if (day !== "" && month !== "") {
                for (let i = 0; i < alldata.length; i++) {
                    let d = new Date(alldata[i].checkout_date).getDate();
                    let m = new Date(alldata[i].checkout_date).getMonth() + 1;
                    let y = new Date(alldata[i].checkout_date).getFullYear();
                    if (d === Number(day) && m === Number(month) && y === Number(year)) {
                        data.push(alldata[i]);
                    }
                }
            }
            else if (day === "" && month !== "") {
                for (let i = 0; i < alldata.length; i++) {
                    let m = new Date(alldata[i].checkout_date).getMonth() + 1;
                    let y = new Date(alldata[i].checkout_date).getFullYear();
                    if (m === Number(month) && y === Number(year)) {
                        data.push(alldata[i]);
                    }
                }
            }
            else if (day === "" && month === "") {
                for (let i = 0; i < alldata.length; i++) {
                    let y = new Date(alldata[i].checkout_date).getFullYear();
                    if (y === Number(year)) {
                        data.push(alldata[i]);
                    }
                }
            }
        }
        data.sort((a, b) => ((new Date(a.checkout_date)) < (new Date(b.checkout_date))) ? 1 : -1);
        this.setState({
            listTransDetail: data,
        })
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
                        <div className="col-md-12 host-detail-transaction">
                            <div className="controller">
                                Ngày: <input name="Day" value={this.state.Day} maxLength="2" onChange={this.handleChange} />
                                Tháng: <input name="Month" value={this.state.Month} maxLength="2" onChange={this.handleChange} />
                                Năm: <input name="Year" value={this.state.Year} maxLength="4" onChange={this.handleChange} />
                                <span className="glyphicon glyphicon-filter" onClick={this.CreateListDetailTransaction.bind(this, this.state.AllTransaction, this.state.Day, this.state.Month, this.state.Year)}></span>
                            </div>
                            <div className="header-table">
                                <label className="col-name-room">Tên phòng</label>
                                <label className="col-name-customer">Tên khách hàng</label>
                                <label className="col-phone">Số điện thoại</label>
                                <label className="col-checkin-date">Ngày nhận phòng</label>
                                <label className="col-checkout-date">Ngày trả phòng</label>
                                <label className="col-deposit">Đặt cọc</label>
                                <label className="col-total-payment">Tổng thanh toán</label>
                                <label className="col-state">Trạng thái</label>
                            </div>
                            {
                                this.state.listTransDetail.map((trans, index) =>
                                    index % 2 === 0 ? (
                                        <div key={index} className="line-table-white">
                                            <span className="col-name-room">{trans.name_room}</span>
                                            <span className="col-name-customer">{trans.fullname}</span>
                                            <span className="col-phone">{trans.phone}</span>
                                            <span className="col-checkin-date">{trans.checkin_date}</span>
                                            <span className="col-checkout-date">{trans.checkout_date}</span>
                                            <span className="col-deposit">{formater.format(trans.deposit)}</span>
                                            <span className="col-total-payment">{formater.format(trans.total_payment)}</span>
                                            <span className="col-state">{trans.state}</span>
                                        </div>
                                    ) : (
                                        <div key={index} className="line-table-gray">
                                            <span className="col-name-room">{trans.name_room}</span>
                                            <span className="col-name-customer">{trans.fullname}</span>
                                            <span className="col-phone">{trans.phone}</span>
                                            <span className="col-checkin-date">{trans.checkin_date}</span>
                                            <span className="col-checkout-date">{trans.checkout_date}</span>
                                            <span className="col-deposit">{formater.format(trans.deposit)}</span>
                                            <span className="col-total-payment">{formater.format(trans.total_payment)}</span>
                                            <span className="col-state">{trans.state}</span>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}