import React, { Component } from 'react';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';
import HostHeader from '../component/HostHeader';

export default class HostSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listConfirmAwait: [],
            listConformed: [],
        }
        this.getListConfirm = this.getListConfirm.bind(this);
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
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        if (this.state.listConfirmAwait.length === 0 && this.state.listConformed.length === 0) {
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
                    <div className="host-schedule-content col-md-10">
                        <div className="host-schedule-title col-md-12">Danh sách phòng chờ xác nhận</div>
                        <div className="host-schedule-title col-md-12">Danh sách phòng đã được đặt</div>
                    </div>
                </div>
            </div>
        )
    }
}
