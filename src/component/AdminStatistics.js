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
        this.StatisticsTopRevenue = this.StatisticsTopRevenue.bind(this);
        this.StatisticsTopBooking = this.StatisticsTopBooking.bind(this);
        this.StatisticsTopRate = this.StatisticsTopRate.bind(this);
    }

    componentDidMount() {
        const api = new adminAPI();
        api.getDataToStatistics()
            .then(response => {
                var transaction = response['transaction'];
                var register = response['register'];
                var toprevenue = response['toprevenue'];
                var topbooking = response['topbooking'];
                var toprate = response['toprate']
                register = register.splice(2, response['register'].length);
                let year_start = new Date(register[0]).getFullYear();
                let current_year = new Date(register[register.length - 1]).getFullYear();
                let register_condition = [];
                for (let i = year_start; i <= current_year; i++)
                    register_condition.push(i);
                this.StatisticsRegister(register, current_year);
                this.StatisticsRevenue(transaction, this.state.RevenueAccording);
                this.StatisticsTopRevenue(toprevenue);
                this.StatisticsTopBooking(topbooking);
                this.StatisticsTopRate(toprate);
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
        dict['label'] = "L?????t ng?????i d??ng ????ng k?? t??i kho???n m???i";
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
            dict['label'] = "Doanh thu to??n h??? th???ng c??c ng??y trong th??ng hi???n t???i";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(75, 192, 192, 1)'];
            dict['borderColor'] = ['rgba(75, 192, 192, 0.5)']
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
            dict['label'] = "Doanh thu to??n h??? th???ng c??c th??ng trong n??m hi???n t???i";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(255, 99, 132, 1)'];
            dict['borderColor'] = ['rgba(255, 99, 132, 0.5)']
            datasets.push(dict);
            let statistics = {};
            statistics['labels'] = labels;
            statistics['data'] = datasets;
            this.setState({
                StatisticsRevenue: statistics,
            })
        }
        else if (condition === "year") {
            let labels = [];
            let data = [];
            let start_year = new Date(raw_data[0].checkout_date).getFullYear();
            let current_year = new Date(raw_data[raw_data.length - 1].checkout_date).getFullYear();
            for (let i = start_year; i <= current_year; i++) {
                labels.push(i);
                data.push(0);
            }
            for (let i = 0; i < raw_data.length; i++) {
                let year = new Date(raw_data[i].checkout_date).getFullYear();
                let index = labels.indexOf(year);
                data[index] += Number(raw_data[i].total_payment);
            }
            let datasets = [];
            let dict = {};
            dict['label'] = "Doanh thu to??n h??? th???ng theo t???ng n??m";
            dict['data'] = data;
            dict['backgroundColor'] = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',];
            datasets.push(dict);
            let statistics = {};
            statistics['labels'] = labels;
            statistics['data'] = datasets;
            this.setState({
                StatisticsRevenue: statistics,
            })
        }
        else if (condition === "search") {
            let month = document.getElementById("admin-manage-input-month").value;
            let year = document.getElementById("admin-manage-input-year").value;
            if (year === "" || year.length !== 4) {
                alert("H??y nh???p n??m!");
            }
            else {
                if (month === "") {
                    let labels = [];
                    let data = [];
                    let current_year = Number(year);
                    for (let i = 1; i < 13; i++) {
                        labels.push(i + "/" + current_year);
                        data.push(0);
                    }
                    for (let i = 0; i < raw_data.length; i++) {
                        let date = new Date(raw_data[i].checkout_date);
                        let m = date.getMonth();
                        let y = date.getFullYear();
                        if (y === current_year) {
                            data[m] += Number(raw_data[i].total_payment);
                        }
                    }
                    let datasets = [];
                    let dict = {};
                    dict['label'] = "Doanh thu to??n h??? th???ng c??c th??ng trong n??m hi???n t???i";
                    dict['data'] = data;
                    dict['backgroundColor'] = ['rgba(54, 162, 235, 1)'];
                    dict['borderColor'] = ['rgba(54, 162, 235, 0.5)']
                    datasets.push(dict);
                    let statistics = {};
                    statistics['labels'] = labels;
                    statistics['data'] = datasets;
                    this.setState({
                        StatisticsRevenue: statistics,
                    })
                }
                else {
                    let current_year = Number(year);
                    let current_month = Number(month);
                    let num_day = new Date(current_year, current_month, 0).getDate();
                    let labels = [];
                    let data = [];
                    for (let i = 1; i <= num_day; i++) {
                        labels.push(i + "/" + current_month + "/" + current_year);
                        data.push(0);
                    }
                    for (let i = 0; i < raw_data.length; i++) {
                        let d = new Date(raw_data[i].checkout_date).getDate();
                        let m = new Date(raw_data[i].checkout_date).getMonth() + 1;
                        let y = new Date(raw_data[i].checkout_date).getFullYear();
                        if (m === current_month && y === current_year) {
                            data[d - 1] += Number(raw_data[i].total_payment);
                        }
                    }
                    let datasets = [];
                    let dict = {};
                    dict['label'] = "Doanh thu to??n h??? th???ng c??c ng??y trong th??ng hi???n t???i";
                    dict['data'] = data;
                    dict['backgroundColor'] = ['rgba(153, 102, 255, 1)'];
                    dict['borderColor'] = ['rgba(153, 102, 255, 0.5)'];
                    datasets.push(dict);
                    let statistics = {};
                    statistics['labels'] = labels;
                    statistics['data'] = datasets;
                    this.setState({
                        StatisticsRevenue: statistics,
                    })
                }
            }
        }
    }

    StatisticsTopRevenue = (raw_data) =>{
        let data = [];
        let labels = [];
        for(let i = 0; i < raw_data.length; i++){
            data.push(raw_data[i].sum);
            labels.push(raw_data[i].company_name);
        }
        var datasets = [];
        var dict = {};
        dict['label'] = "Top 10 host c?? doanh thu cao nh???t";
        dict['data'] = data;
        dict['backgroundColor'] = ['rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(123, 147, 141, 1)',
        'rgba(32, 218, 13, 1)',
        'rgba(255, 55, 112, 1)',
        'rgba(50, 223, 228, 1)'];
        datasets.push(dict);
        var statistics = {};
        statistics['labels'] = labels;
        statistics['data'] = datasets;
        this.setState({
            TopRevenue: statistics,
        })
    }

    StatisticsTopBooking = (raw_data) =>{
        let data = [];
        let labels = [];
        for(let i = 0; i < raw_data.length; i++){
            data.push(raw_data[i].count);
            labels.push(raw_data[i].company_name);
        }
        var datasets = [];
        var dict = {};
        dict['label'] = "Top 10 host c?? l?????t ?????t cao nh???t";
        dict['data'] = data;
        dict['backgroundColor'] = ['rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(123, 147, 141, 1)',
        'rgba(32, 218, 13, 1)',
        'rgba(255, 55, 112, 1)',
        'rgba(50, 223, 228, 1)'];
        datasets.push(dict);
        var statistics = {};
        statistics['labels'] = labels;
        statistics['data'] = datasets;
        this.setState({
            TopBooking: statistics,
        })
    }

    StatisticsTopRate = (raw_data) =>{
        let data = [];
        let labels = [];
        for(let i = 0; i < raw_data.length; i++){
            data.push(raw_data[i].avg);
            labels.push(raw_data[i].company_name);
        }
        var datasets = [];
        var dict = {};
        dict['label'] = "Top 10 host ???????c ????nh gi?? cao nh???t";
        dict['data'] = data;
        dict['backgroundColor'] = ['rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(123, 147, 141, 1)',
        'rgba(32, 218, 13, 1)',
        'rgba(255, 55, 112, 1)',
        'rgba(50, 223, 228, 1)'];
        datasets.push(dict);
        var statistics = {};
        statistics['labels'] = labels;
        statistics['data'] = datasets;
        this.setState({
            TopRate: statistics,
        })
    }


    render() {
        var formatter = new Intl.NumberFormat();
        var name_tab = ['Doanh thu to??n h??? th???ng',
            'Top 10 host c?? doanh thu cao nh???t',
            'Top 10 host c?? l?????t ?????t cao nh???t',
            'Top 10 host ???????c ????nh gi?? t???t nh???t',
            'L?????t ????ng k?? th??nh vi??n']
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
                                                <span className="glyphicon glyphicon-check"></span><span>C??c ng??y trong th??ng hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>C??c th??ng trong n??m hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>T???ng n??m</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Kh??c</span>
                                            </div>
                                        ) : this.state.RevenueAccording === "month" ? (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>C??c ng??y trong th??ng hi???n t???i</span>
                                                <span className="glyphicon glyphicon-check"></span><span>C??c th??ng trong n??m hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>T???ng n??m</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Kh??c</span>
                                            </div>
                                        ) : this.state.RevenueAccording === "year" ? (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>C??c ng??y trong th??ng hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>C??c th??ng trong n??m hi???n t???i</span>
                                                <span className="glyphicon glyphicon-check"></span><span>T???ng n??m</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "custom")}></span><span>Kh??c</span>
                                            </div>
                                        ) : (
                                            <div className="check-condition">
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "day")}></span><span>C??c ng??y trong th??ng hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "month")}></span><span>C??c th??ng trong n??m hi???n t???i</span>
                                                <span className="glyphicon glyphicon-unchecked" onClick={this.ChangeConditionRevenue.bind(this, "year")}></span><span>T???ng n??m</span>
                                                <span className="glyphicon glyphicon-check"></span><span>Kh??c</span>
                                                <span>
                                                    <span>th??ng: <input id="admin-manage-input-month" maxLength="2" /> n??m: <input id="admin-manage-input-year" maxLength="4" /><span className="glyphicon glyphicon-search" onClick={this.ChangeConditionRevenue.bind(this, "search")}></span></span>
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
                                                        text: 'Bi???u Doanh thu to??n h??? th???ng',
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
                                                <p>H??y ch???n th??ng v?? n??m ????? th???ng k??</p>
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
                                                        text: 'Bi???u Doanh thu to??n h??? th???ng',
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
                                <Bar
                                    data={{
                                        labels: this.state.TopRevenue['labels'],
                                        datasets: this.state.TopRevenue['data'],
                                    }}
                                    height={200}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Bi???u ????? Top 10 host c?? doanh thu cao nh???t',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend: {
                                                display: false,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : this.state.tab_index === 2 ? (
                            <div>
                                <Bar
                                    data={{
                                        labels: this.state.TopBooking['labels'],
                                        datasets: this.state.TopBooking['data'],
                                    }}
                                    height={200}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Bi???u ????? Top 10 host c?? doanh thu cao nh???t',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend: {
                                                display: false,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : this.state.tab_index === 3 ? (
                            <div>
                                <Bar
                                    data={{
                                        labels: this.state.TopRate['labels'],
                                        datasets: this.state.TopRate['data'],
                                    }}
                                    height={200}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Bi???u ????? Top 10 host c?? doanh thu cao nh???t',
                                                color: 'red',
                                                padding: '20',
                                            },
                                            legend: {
                                                display: false,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="col-md-12">
                                    <p>T???ng s??? th??nh vi??n: {formatter.format(this.state.StatisticsRegister['total'])}</p>
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
                                                text: 'Bi???u ????? l?????t ????ng k?? theo n??m',
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
