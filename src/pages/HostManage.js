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
            StatisticsAll: 0,
            AllTransaction: [],
            Branchname: [],
            listTransDetail: [],
            StatisticsRevenue: [],
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
        this.ChangeTypeStatistics = this.ChangeTypeStatistics.bind(this);
    }

    componentDidMount() {
        let now = new Date();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        const api = new hostAPI();
        api.getTransactionByOfHost(params)
            .then(response => {
                var allTrans = response['data'];
                var branch = response['branch'];
                branch.unshift(localStorage.getItem("username"));
                this.StatisticsRevenue(allTrans, branch, "day", this.state.StatisticsAll);
                this.TotalRevenue(allTrans, "today");
                this.StatisticsEachRoom(allTrans);
                this.StatisticsCancellation(allTrans);
                this.CreateListDetailTransaction(allTrans, now.getDate(), now.getMonth() + 1, now.getFullYear());
                this.setState({
                    AllTransaction: allTrans,
                    Branchname: branch,
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

    StatisticsRevenue = (alldata, branch, condition, type) => {
        if (condition === "custom" && document.getElementById("host-manage-input-year").value === "") {
            alert("Bạn phải nhập năm trước khi thống kê");
        }
        else {
            var rawdata = [];
            var Branch = [];
            if (type === 0) {
                rawdata.push(alldata[0]);
                Branch.push(branch[0]);
            }
            else {
                rawdata = alldata;
                Branch = branch;
            }
            var backgroundColor = ['rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',];
            var borderColor = ['rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',];
            var accordingTo = "";
            var revenue = {};
            var label = [];
            var datasets = [];
            for (let t = 0; t < Branch.length; t++) {
                var data = rawdata[t];
                var now = new Date();
                var value = [];
                if (condition === "day") {
                    for (let i = 0; i < now.getDate(); i++) {
                        label[i] = (i + 1) + "/" + (now.getMonth() + 1) + "/" + (now.getFullYear() % 2000);
                        value[i] = 0;
                        for (let x = 0; x < data.length; x++) {
                            if (data[x].checkout_date === now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + (i + 1)).slice(-2) + " 12:00:00")
                                value[i] += Number(data[x].total_payment);
                        }
                    }
                    accordingTo = "Ngày";
                }
                else if (condition === "month") {
                    for (let i = 0; i < (now.getMonth() + 1); i++) {
                        label[i] = (i + 1) + "/" + now.getFullYear();
                        value[i] = 0;
                        for (let x = 0; x < data.length; x++) {
                            let month = new Date(data[x].checkout_date).getMonth() + 1;
                            let year = new Date(data[x].checkout_date).getFullYear();
                            if (month === (i + 1) && year === now.getFullYear()) {
                                value[i] += Number(data[x].total_payment);
                            }
                        }
                    }
                    accordingTo = "Tháng";
                }
                else if (condition === "year") {
                    data.sort((a, b) => ((new Date(a.checkout_date).getFullYear()) > (new Date(b.checkout_date).getFullYear())) ? 1 : -1);
                    if (data.length !== 0) {
                        let start = new Date(data[0].checkout_date).getFullYear();
                        let end = new Date(data[data.length - 1].checkout_date).getFullYear();
                        for (let i = start; i <= end; i++) {
                            label[i] = i;
                            value[i] = 0;
                            for (let x = 0; x < data.length; x++) {
                                let year = new Date(data[x].checkout_date).getFullYear();
                                if (year === i) {
                                    value[i] += Number(data[x].total_payment);
                                }
                            }
                        }
                        label.splice(0, start);
                        value.splice(0, start);
                    }
                    accordingTo = "Năm";
                }
                else if (condition === "custom") {
                    let month = document.getElementById("host-manage-input-month").value;
                    let year = document.getElementById("host-manage-input-year").value;
                    if (month === "") {
                        for (let i = 0; i < 12; i++) {
                            label[i] = (i + 1) + "/" + year;
                            value[i] = 0;
                            for (let x = 0; x < data.length; x++) {
                                let Month = new Date(data[x].checkout_date).getMonth() + 1;
                                let Year = new Date(data[x].checkout_date).getFullYear();
                                if (Month === (i + 1) && Year === Number(year)) {
                                    value[i] += Number(data[x].total_payment);
                                }
                            }
                        }
                        accordingTo = "Năm " + year;
                    }
                    else {
                        let numday = new Date(year, month, 0).getDate();
                        for (let i = 0; i < numday; i++) {
                            label[i] = (i + 1) + "/" + month + "/" + (year % 2000);
                            value[i] = 0;
                            for (let x = 0; x < data.length; x++) {
                                if (data[x].checkout_date === year + "-" + ("0" + month).slice(-2) + "-" + ("0" + (i + 1)).slice(-2) + " 12:00:00")
                                    value[i] += Number(data[x].total_payment);
                            }
                        }
                        accordingTo = "Tháng " + month + ", Năm " + year;
                    }
                }
                let dict = {};
                dict['label'] = Branch[t];
                dict['data'] = value;
                dict['backgroundColor'] = backgroundColor[t];
                dict['borderColor'] = borderColor[t];
                datasets.push(dict);
            }
            revenue['label'] = label;
            revenue['datasets'] = datasets;
            this.setState({
                StatisticsRevenue: revenue,
                AccordingTo: accordingTo,
            });
        }
    }

    StatisticsEachRoom = (alldata) => {
        var data = alldata[0];
        data.sort((a, b) => (a.name_room > b.name_room) ? 1 : -1);
        let label = [];
        let value = [];
        data.forEach((trans) => {
            if (label.indexOf(trans.name_room) === -1) {
                label.push(trans.name_room);
                value.push(1);
            }
            else {
                value[label.indexOf(trans.name_room)] += 1;
            }
        });
        let data1 = {};
        data1['label'] = label;
        data1['value'] = value;
        this.setState({ StatisticsEachRoom: data1 });
    }

    StatisticsCancellation = (alldata) => {
        var rawdata = alldata[0];
        let label = ['DATHANHTOAN', 'DAHUY'];
        let value = [0, 0];
        rawdata.forEach((trans) => {
            value[label.indexOf(trans.state)] += 1;
        })
        let data = {};
        data['label'] = label;
        data['value'] = value;
        this.setState({ StatisticsCancellation: data });
    }


    CreateListDetailTransaction = (alldata, day, month, year) => {
        var rawdata = alldata[0];
        let data = [];
        if (year === "") {
            alert("Bạn phải nhập năm trước khi thống kê");
        }
        else {
            if (day !== "" && month === "") {
                alert("Bạn hãy nhập thêm tháng nữa nhé!");
            }
            else if (day !== "" && month !== "") {
                for (let i = 0; i < rawdata.length; i++) {
                    let d = new Date(rawdata[i].checkout_date).getDate();
                    let m = new Date(rawdata[i].checkout_date).getMonth() + 1;
                    let y = new Date(rawdata[i].checkout_date).getFullYear();
                    if (d === Number(day) && m === Number(month) && y === Number(year)) {
                        data.push(rawdata[i]);
                    }
                }
            }
            else if (day === "" && month !== "") {
                for (let i = 0; i < rawdata.length; i++) {
                    let m = new Date(rawdata[i].checkout_date).getMonth() + 1;
                    let y = new Date(rawdata[i].checkout_date).getFullYear();
                    if (m === Number(month) && y === Number(year)) {
                        data.push(rawdata[i]);
                    }
                }
            }
            else if (day === "" && month === "") {
                for (let i = 0; i < rawdata.length; i++) {
                    let y = new Date(rawdata[i].checkout_date).getFullYear();
                    if (y === Number(year)) {
                        data.push(rawdata[i]);
                    }
                }
            }
        }
        data.sort((a, b) => ((new Date(a.checkout_date)) < (new Date(b.checkout_date))) ? 1 : -1);
        this.setState({
            listTransDetail: data,
        })
    }

    ChangeTypeStatistics = (number) => {
        this.setState({
            StatisticsAll: Number(number),
        })
        this.StatisticsRevenue(this.state.AllTransaction, this.state.Branchname, "day", Number(number));
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
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, this.state.Branchname, "day", this.state.StatisticsAll)}>Ngày</Link></li>
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, this.state.Branchname, "month", this.state.StatisticsAll)}>Tháng</Link></li>
                                    <li><Link to="#" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, this.state.Branchname, "year", this.state.StatisticsAll)}>Năm</Link></li>
                                    <li role="separator" className="divider"></li>
                                    <li>Tháng: <input id="host-manage-input-month" maxLength="2" />
                                        Năm: <input id="host-manage-input-year" maxLength="4" />
                                        <span className="glyphicon glyphicon-search" onClick={this.StatisticsRevenue.bind(this, this.state.AllTransaction, this.state.Branchname, "custom", this.state.StatisticsAll)}></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12 statistics-according">
                            {
                                this.state.StatisticsAll === 0 ? (
                                    <div>
                                        <span className="glyphicon glyphicon-check"></span><span>Thống kê chi nhánh hiện tại</span>
                                        <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeTypeStatistics.bind(this, 1)}></span><span>Thống kê tất cả các chi nhánh</span>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeTypeStatistics.bind(this, 0)}></span><span>Thống kê chi nhánh hiện tại</span>
                                        <span className="glyphicon glyphicon-check"></span><span>Thống kê tất cả các chi nhánh</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-md-12 chart">
                            {
                                (this.state.AccordingTo === "Tháng")
                                    || (this.state.AccordingTo.indexOf("Năm ") !== -1 && this.state.AccordingTo.indexOf("Tháng") === -1) ? (
                                    <Line
                                        data={{
                                            labels: this.state.StatisticsRevenue['label'],
                                            datasets: this.state.StatisticsRevenue['datasets'],
                                        }}
                                        height={100}
                                        options={{
                                            plugins: {
                                            title:{
                                                display: true,
                                                text: 'Biểu đồ doanh thu',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend:{
                                                position: 'bottom',
                                            }
                                        }
                                        }}
                                    />
                                ) : (
                                    <Bar
                                        data={{
                                            labels: this.state.StatisticsRevenue['label'],
                                            datasets: this.state.StatisticsRevenue['datasets'],
                                        }}
                                        height={100}
                                        options={{
                                            plugins: {
                                            title:{
                                                display: true,
                                                text: 'Biểu đồ doanh thu',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend:{
                                                position: 'bottom',
                                            }
                                        }
                                        }}
                                    />
                                )
                            }
                        </div>
                        <div className="col-md-12 host-manage-title">Thống kê tổng số lượt đặt theo từng phòng chi nhánh hiện tại</div>
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
                                options={{
                                    plugins: {
                                    title:{
                                        display: true,
                                        text: 'Biểu đồ tổng số lượt đặt mỗi phòng',
                                        color: 'red',
                                        padding: '20',
                                    },
                                    legend:{
                                        position: 'bottom',
                                    }
                                }
                                }}
                            />
                        </div>
                        <div className="col-md-12 host-manage-title">Tỉ lệ đặt phòng / hủy phòng chi nhánh hiện tại</div>
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
                                width={500}
                                height={500}
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