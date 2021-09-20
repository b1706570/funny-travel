import React, { Component } from 'react';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';
import HostHeader from '../component/HostHeader';

export default class HostSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listConfirmAwait: [],
            listConfirmed: [],
        }
        this.getListConfirm = this.getListConfirm.bind(this);
        this.ConfirmBooking = this.ConfirmBooking.bind(this);
        this.RejectBooking = this.RejectBooking.bind(this);
        this.CancelBooking = this.CancelBooking.bind(this);
    }

    componentDidMount() {
        this.getListConfirm();
    }

    getListConfirm = () => {
        const api = new hostAPI();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        api.getBookingSchedule(params)
            .then(response => {
                this.setState({
                    listConfirmAwait: response['listAwait'],
                    listConfirmed: response['listConfirmed'],
                })
            })
            .catch(error => {
                console.log(error);
            })
        this.timer = setTimeout(this.getListConfirm, 60000 );
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    ConfirmBooking = (id_booking) => {
        let code = Math.random() * (10 - 1) + 1;
        code = Math.floor(code * 10000000);
        console.log(code);
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "confirm");
        params.append("code", code);
        const api = new hostAPI();
        api.confirmBookingSchedule(params)
            .then(response => {
                if (response === 200) {
                    alert("Xác nhận đặt phòng thành công!");
                    if(this.state.listConfirmAwait.length === 1){
                        window.location.reload();
                    }
                    else{
                        this.componentDidMount();
                    }
                }
                else {
                    alert("Xác nhận đặt phòng thất bại!");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    RejectBooking = (id_booking) => {
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "reject");
        const api = new hostAPI();
        api.cancelBookingSchedule(params)
            .then(response => {
                if (response === 200) {
                    alert("Hủy yêu cầu thành công!");
                    if(this.state.listConfirmAwait.length === 1){
                        window.location.reload();
                    }
                    else{
                        this.componentDidMount();
                    }
                }
                else {
                    alert("Hủy yêu cầu thất bại!");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    CancelBooking = (id_booking) => {
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "cancel");
        const api = new hostAPI();
        api.cancelBookingSchedule(params)
            .then(response => {
                if (response === 200) {
                    alert("Hủy đặt phòng thành công!");
                    this.componentDidMount();
                }
                else {
                    alert("Hủy đặt phòng thất bại!");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        var formater = new Intl.NumberFormat();
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        if (this.state.listConfirmAwait.length === 0 && this.state.listConfirmed.length === 0) {
            return (
                <div>
                    <div className="host-header col-md-12">
                        <HostHeader hostActive={1} />
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
                    <HostHeader hostActive={1} />
                </div>
                <div className="col-md-12">
                    <div className="host-schedule-content col-md-10 col-md-offset-1">
                        <div className="table-host-schedule-await">
                            <div className="host-schedule-title col-md-12">DANH SÁCH PHÒNG CHỜ XÁC NHẬN</div>
                            <div className="col-md-12">
                                <div className="col-md-12 header-table">
                                    <div className="col-md-2">Tên phòng</div>
                                    <div className="col-md-2">Tên Khách hàng</div>
                                    <div className="col-md-2">Số điện thoại</div>
                                    <div className="col-md-2">Ngày nhận phòng</div>
                                    <div className="col-md-2">Ngày trả phòng</div>
                                    <div className="col-md-2">Đặt cọc</div>
                                </div>
                                {
                                    this.state.listConfirmAwait.map((item, index) =>
                                        index % 2 === 0 ? (
                                            <div key={index} className="col-md-12 line-table-white">
                                                <div className="col-md-2">{item.name_room}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-ok" onClick={this.ConfirmBooking.bind(this, item.id_booking)}></span>&nbsp;
                                                        <span className="glyphicon glyphicon-remove" onClick={this.RejectBooking.bind(this, item.id_booking)}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={index} className="col-md-12 line-table-gray">
                                                <div className="col-md-2">{item.name_room}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-ok" onClick={this.ConfirmBooking.bind(this, item.id_booking)}></span>&nbsp;
                                                        <span className="glyphicon glyphicon-remove" onClick={this.RejectBooking.bind(this, item.id_booking)}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="table-host-schedule-confirmed">
                            <div className="host-schedule-title col-md-12">DANH SÁCH PHÒNG ĐÃ ĐƯỢC ĐẶT</div>
                            <div className="col-md-12">
                                <div className="col-md-12 header-table">
                                    <div className="col-md-2">Tên phòng</div>
                                    <div className="col-md-2">Tên Khách hàng</div>
                                    <div className="col-md-2">Số điện thoại</div>
                                    <div className="col-md-2">Ngày nhận phòng</div>
                                    <div className="col-md-2">Ngày trả phòng</div>
                                    <div className="col-md-2">Đặt cọc</div>
                                </div>
                                {
                                    this.state.listConfirmed.map((item, index) =>
                                        index % 2 === 0 ? (
                                            <div key={index} className="col-md-12 line-table-white">
                                                <div className="col-md-2">{item.name_room}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-remove" onClick={this.CancelBooking.bind(this, item.id_booking)}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={index} className="col-md-12 line-table-gray">
                                                <div className="col-md-2">{item.name_room}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-remove" onClick={this.CancelBooking.bind(this, item.id_booking)}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
