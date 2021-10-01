import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import adminAPI from '../api/adminAPI';
import { Bar, Line } from 'react-chartjs-2';

export default class AdminStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Alltransaction: [],
            AlldataRegister: [],
            Revenue: {},
            RevenueAccording: "day",
            TopRevenue: {},
            TopBooking: {},
            TopRate: {},
            StatisticsRegister: {},
            RegisterCondition: [],
            RegisterAccording: "",
            tab_index: 0,
        }
        this.ChangeTab = this.ChangeTab.bind(this);
        this.ChangeConditionRegister = this.ChangeConditionRegister.bind(this);
        this.ChangeConditionRevenue = this.ChangeConditionRevenue.bind(this);
        this.StatisticsRegister = this.StatisticsRegister.bind(this);
        this.StatisticsRevenue = this.StatisticsRevenue.bind(this);
    }

    componentDidMount() {
        const api = new adminAPI();
        api.getDataToStatistics()
            .then(response => {
                var transaction = response['transaction'];
                var register = response['register'];
                register = register.splice(2, response['register'].length);
                let year_start = new Date(register[0]).getFullYear();
                let current_year = new Date(register[register.length - 1]).getFullYear();
                let register_condition = [];
                for (let i = year_start; i <= current_year; i++)
                    register_condition.push(i);
                this.StatisticsRegister(register, current_year);
                this.StatisticsRevenue(transaction, this.state.RevenueAccording);
                this.setState({
                    Alltransaction: transaction,
                    AlldataRegister: register,
                    RegisterCondition: register_condition,
                    RegisterAccording: current_year,
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeTab = (index) => {
        this.setState({
            tab_index: index,
        })
    }

    ChangeConditionRegister = (value) => {
        this.setState({
            RegisterAccording: value,
        })
        this.StatisticsRegister(this.state.AlldataRegister, value);
    }

    ChangeConditionRevenue = (value) => {
        this.setState({
            RevenueAccording: value,
        })
        if (value !== "custom")
            this.StatisticsRevenue(this.state.Alltransaction, value);
    }

    StatisticsRegister = (raw_data, condition) => {
        var labels = [];
        var data = [];
        for (let i = 1; i < 13; i++) {
            labels.push(i + "/" + condition);
            data.push(0);
        }
        for (let i = 0; i < raw_data.length; i++) {
            let date = new Date(raw_data[i]);
            let month = date.getMonth();
            let year = date.getFullYear();
            if (year === condition) {
                data[month] += 1;
            }
        }
        var datasets = [];
        var dict = {};
        dict['label'] = "Lượt người dùng đăng kí tài khoản mới";
        dict['data'] = data;
        dict['backgroundColor'] = ['rgba(75, 192, 192, 1)'];
        datasets.push(dict);
        var statistics = {};
        statistics['labels'] = labels;
        statistics['data'] = datasets;
        statistics['total'] = raw_data.length;
        this.setState({
            StatisticsRegister: statistics,
        })
    }

    StatisticsRevenue = (raw_data, condition) => {
        if (condition === "day") {
            let current_year = new Date().getFullYear();
            let current_month = new Date().getMonth() + 1;
            let num_day = new Date(current_year, current_month, 0).getDate();
            let labels = [];
            let data = [];
            for (let i = 1; i <= num_day; i++) {
                labels.push(i + "/" + current_month + "/" + current_year);
                data.push(0);
            }
            for (let i = 0; i < raw_data.length; i++) {
                let day = new Date(raw_data[i].checkout_date).getDate();
                let month = new Date(raw_data[i].checkout_date).getMonth() + 1;
                let year = new Date(raw_data[i].checkout_date).getFullYear();
                if (month === current_month && year === current_year) {
                    data[day - 1] += Number(raw_data[i].total_payment);
                }
            }
            let datasets = [];
            let dict = {};
            dict['label'] = "Doanh thu toàn hệ thống các ngày trong tháng hiện tại";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(75, 192, 192, 1)'];
            datasets.push(dict);
            let statistics = {};
            statistics['labels'] = labels;
            statistics['data'] = datasets;
            this.setState({
                StatisticsRevenue: statistics,
            })
        }
        else if (condition === "month") {
            let labels = [];
            let data = [];
            let current_year = new Date().getFullYear();
            for (let i = 1; i < 13; i++) {
                labels.push(i + "/" + current_year);
                data.push(0);
            }
            for (let i = 0; i < raw_data.length; i++) {
                let date = new Date(raw_data[i].checkout_date);
                let month = date.getMonth();
                let year = date.getFullYear();
                if (year === current_year) {
                    data[month] += Number(raw_data[i].total_payment);
                }
            }
            let datasets = [];
            let dict = {};
            dict['label'] = "Doanh thu toàn hệ thống các tháng trong năm hiện tại";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(255, 99, 132, 1)'];
            datasets.push(dict);
            let statistics = {};
            statistics['labels'] = labels;
            statistics['data'] = datasets;
            this.setState({
                StatisticsRevenue: statistics,
            })
        }
        else if(condition === "year"){
            let labels = [];
            let data = [];
            let start_year = new Date(raw_data[0].checkout_date).getFullYear();
            let current_year = new Date(raw_data[raw_data.length - 1].checkout_date).getFullYear();
            for(let i = start_year; i <= current_year; i++){
                labels.push(i);
                data.push(0);
            }
            for(let i = 0; i < raw_data.length; i++){
                let year = new Date(raw_data[i].checkout_date).getFullYear();
                let index = labels.indexOf(year);
                data[index] += Number(raw_data[i].total_payment);
            }
            let datasets = [];
            let dict = {};
            dict['label'] = "Doanh thu toàn hệ thống theo từng năm";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)',];
            datasets.push(dict);
            let statistics = {};
            statistics['labels'] = labels;
            statistics['data'] = datasets;
            this.setState({
                StatisticsRevenue: statistics,
            })
        }
        else if(condition === "search"){
            let month = document.getElementById("admin-manage-input-month").value;
            let year = document.getElementById("admin-manage-input-year").value;
            console.log(month, year);
        }
    }


    render() {
        var formatter = new Intl.NumberFormat();
        var name_tab = ['Doanh thu toàn hệ thống',
            'Top 10 host có doanh thu cao nhất',
            'Top 10 host có lượt đặt cao nhất',
            'Top 10 host được đánh giá tốt nhất',
            'Lượt đăng ký thành viên']
        if (this.state.Alltransaction.length === 0 && this.state.AlldataRegister.length === 0) {
            return null;
        }
        return (
            <div className="admin-statistics col-md-12">
                <div className="col-md-12">
                    <ul className="nav nav-tabs nav-justified">
                        {
                            name_tab.map((name, index) =>
                                this.state.tab_index === index ? (
                                    <li key={index} role="presentation" className="active"><Link to="#">{name}</Link></li>
                                ) : (
                                    <li key={index} role="presentation" onClick={this.ChangeTab.bind(this, index)}><Link to="#">{name}</Link></li>
                                )
                            )
                        }
                    </ul>
                </div>
                <div className="col-md-12">
                    {
                        this.state.tab_index === 0 ? (
                            <div>
                                <div className="col-md-12">
                                    {
                                        this.state.RevenueAccording === "day" ? (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-check"></span><span>Các ngày trong tháng hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>Các tháng trong năm hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>Từng năm</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Khác</span>
                                            </div>
                                        ) : this.state.RevenueAccording === "month" ? (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>Các ngày trong tháng hiện tại</span>
                                                <span className="glyphicon glyphicon-check"></span><span>Các tháng trong năm hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>Từng năm</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Khác</span>
                                            </div>
                                        ) : this.state.RevenueAccording === "year" ? (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>Các ngày trong tháng hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>Các tháng trong năm hiện tại</span>
                                                <span className="glyphicon glyphicon-check"></span><span>Từng năm</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Khác</span>
                                            </div>
                                        ) : (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>Các ngày trong tháng hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>Các tháng trong năm hiện tại</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>Từng năm</span>
                                                <span className="glyphicon glyphicon-check"></span><span>Khác</span>
                                                <span>
                                                    <span>tháng: <input id="admin-manage-input-month" maxLength="2" /> năm: <input id="admin-manage-input-year" maxLength="4" /><span className="glyphicon glyphicon-search" onClick={this.ChangeConditionRevenue.bind(this, "search")}></span></span>
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    this.state.RevenueAccording === "year" ? (
                                        <Bar
                                            data={{
                                                labels: this.state.StatisticsRevenue['labels'],
                                                datasets: this.state.StatisticsRevenue['data'],
                                            }}
                                            height={180}
                                            options={{
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: 'Biểu Doanh thu toàn hệ thống',
                                                        color: 'red',
                                                        padding: '20',
                                                    },
                                                    legend: {
                                                        position: 'bottom',
                                                    }
                                                }
                                            }}
                                        />
                                    ) : this.state.RevenueAccording === "custom" ? (
                                        <div>
                                            <div className="noti-empty-statistics">
                                                <p>Hãy chọn tháng và năm để thống kê</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Line
                                            data={{
                                                labels: this.state.StatisticsRevenue['labels'],
                                                datasets: this.state.StatisticsRevenue['data'],
                                            }}
                                            height={180}
                                            options={{
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: 'Biểu Doanh thu toàn hệ thống',
                                                        color: 'red',
                                                        padding: '20',
                                                    },
                                                    legend: {
                                                        position: 'bottom',
                                                    }
                                                }
                                            }}
                                        />
                                    )
                                }
                            </div>
                        ) : this.state.tab_index === 1 ? (
                            <div>
                                tab1
                            </div>
                        ) : this.state.tab_index === 2 ? (
                            <div>
                                tab2
                            </div>
                        ) : this.state.tab_index === 3 ? (
                            <div>
                                tab3
                            </div>
                        ) : (
                            <div>
                                <div className="col-md-12">
                                    <p>Tổng số thành viên: {formatter.format(this.state.StatisticsRegister['total'])}</p>
                                    <div className="check-condition">
                                        {
                                            this.state.RegisterCondition.map((name, index) =>
                                                this.state.RegisterAccording === name ? (
                                                    <span key={index} className="glyphicon glyphicon-check"><span>{name}</span></span>
                                                ) : (
                                                    <span key={index} className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRegister.bind(this, name)}><span>{name}</span></span>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                                <Bar
                                    data={{
                                        labels: this.state.StatisticsRegister['labels'],
                                        datasets: this.state.StatisticsRegister['data'],
                                    }}
                                    height={180}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Biểu đồ lượt đăng kí theo năm',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend: {
                                                position: 'bottom',
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
