import React, { Component } from 'react';
import hostAPI from '../api/hostAPI';
import { Redirect } from 'react-router';
import HostHeader from '../component/HostHeader';
import { Link } from 'react-router-dom';

export default class HostSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listConfirmAwait: [],
            listConfirmed: [],
            dataInFormConfirm: "",
            listRoomAvailable: [],
            id_room_choosed: "",
            class_form_confirm: "form-confirm-booking-room-hidden",
        }
        this.getListConfirm = this.getListConfirm.bind(this);
        this.ConfirmBooking = this.ConfirmBooking.bind(this);
        this.RejectBooking = this.RejectBooking.bind(this);
        this.CancelBooking = this.CancelBooking.bind(this);
        this.getRoomToConfirm = this.getRoomToConfirm.bind(this);
        this.ChooseRoom = this.ChooseRoom.bind(this);
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
                    dataInFormConfirm: response['listAwait'][0],
                })
            })
            .catch(error => {
                console.log(error);
            })
        this.timer = setTimeout(this.getListConfirm, 60000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    ShowFormConfirm = (index) => {
        this.setState({
            dataInFormConfirm: this.state.listConfirmAwait[index],
            id_room_choosed: "",
            class_form_confirm: "form-confirm-booking-room-visible",
        })
        document.body.style.overflow = "hidden";
        this.getRoomToConfirm(index);
    }

    HiddenFormConfirm = (e) =>{
        e.preventDefault();
        this.setState({
            class_form_confirm: "form-confirm-booking-room-hidden",
            listRoomAvailable: [],
        })
        document.body.style.overflow = "visible";
    }

    ChooseRoom = (index) =>{
        this.setState({
            id_room_choosed: index,
        })
    }

    getRoomToConfirm = (index) => {
        let type = this.state.listConfirmAwait[index].type_room;
        let id_host = this.state.listConfirmAwait[index].id_host;
        let checkin_date = this.state.listConfirmAwait[index].checkin_date;
        let checkout_date = this.state.listConfirmAwait[index].checkout_date;
        let params = new FormData();
        params.append("type_room", type);
        params.append("id_host", id_host);
        params.append("checkin_date", checkin_date);
        params.append("checkout_date", checkout_date);
        const api = new hostAPI();
        api.getRoomAvailableToConfirm(params)
            .then(response => {
                if(response.length !== 0){
                    this.setState({
                        listRoomAvailable: response,
                        id_room_choosed: 0,
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    ConfirmBooking = (id_booking) => {
        if(this.state.id_room_choosed === ""){
            alert("Thao t??c kh??ng h???p l???!");
        }
        else {
        let code = Math.random() * (10 - 1) + 1;
        code = Math.floor(code * 10000000);
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "confirm");
        params.append("code", code);
        params.append("id_room", this.state.listRoomAvailable[this.state.id_room_choosed].id_room);
        const api = new hostAPI();
        api.confirmBookingSchedule(params)
            .then(response => {
                if (response === 200) {
                    alert("X??c nh???n ?????t ph??ng th??nh c??ng!");
                    this.setState({
                        class_form_confirm: "form-confirm-booking-room-hidden",
                        listRoomAvailable: [],
                    })
                    document.body.style.overflow = "visible";
                    if (this.state.listConfirmAwait.length === 1) {
                        window.location.reload();
                    }
                    else {
                        this.componentDidMount();
                    }
                }
                else {
                    alert("X??c nh???n ?????t ph??ng th???t b???i!");
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    RejectBooking = (id_booking) => {
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "reject");
        const api = new hostAPI();
        api.cancelBookingSchedule(params)
            .then(response => {
                if (response === 200) {
                    alert("H???y y??u c???u th??nh c??ng!");
                    this.setState({
                        class_form_confirm: "form-confirm-booking-room-hidden",
                        listRoomAvailable: [],
                    })
                    document.body.style.overflow = "visible";
                    if (this.state.listConfirmAwait.length === 1) {
                        window.location.reload();
                    }
                    else {
                        this.componentDidMount();
                    }
                }
                else {
                    alert("H???y y??u c???u th???t b???i!");
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
                    alert("H???y ?????t ph??ng th??nh c??ng!");
                    this.componentDidMount();
                }
                else {
                    alert("H???y ?????t ph??ng th???t b???i!");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        console.log(this.state.listConfirmAwait);
        var type_room = ["Ch???n lo???i ph??ng", "Ph??ng ????n", "Ph??ng ????i", "Ph??ng t???p th???", "Ph??ng gia ????nh", "Mini house", "Homestay"];
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
                        <p>B???n kh??ng c?? l???ch ?????t n??o c???</p>
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
                            <div className="host-schedule-title col-md-12">DANH S??CH PH??NG CH??? X??C NH???N</div>
                            <div className="col-md-12">
                                <div className="col-md-12 header-table">
                                    <div className="col-md-2">Lo???i ph??ng</div>
                                    <div className="col-md-2">T??n Kh??ch h??ng</div>
                                    <div className="col-md-2">S??? ??i???n tho???i</div>
                                    <div className="col-md-2">Ng??y nh???n ph??ng</div>
                                    <div className="col-md-2">Ng??y tr??? ph??ng</div>
                                    <div className="col-md-2">?????t c???c</div>
                                </div>
                                {
                                    this.state.listConfirmAwait.map((item, index) =>
                                        index % 2 === 0 ? (
                                            <div key={index} className="col-md-12 line-table-white">
                                                <div className="col-md-2">{type_room[item.type_room]}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-ok" onClick={this.ShowFormConfirm.bind(this, index)}></span>&nbsp;
                                                        <span className="glyphicon glyphicon-remove" onClick={this.RejectBooking.bind(this, item.id_booking)}></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={index} className="col-md-12 line-table-gray">
                                                <div className="col-md-2">{type_room[item.type_room]}</div>
                                                <div className="col-md-2">{item.fullname}</div>
                                                <div className="col-md-2">{item.phone}</div>
                                                <div className="col-md-2">{item.checkin_date}</div>
                                                <div className="col-md-2">{item.checkout_date}</div>
                                                <div className="col-md-2">
                                                    <div className="col-md-9">
                                                        {formater.format(item.deposit)} (VND)
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className="glyphicon glyphicon-ok" onClick={this.ShowFormConfirm.bind(this, index)}></span>&nbsp;
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
                            <div className="host-schedule-title col-md-12">DANH S??CH PH??NG ???? ???????C ?????T</div>
                            <div className="col-md-12">
                                <div className="col-md-12 header-table">
                                    <div className="col-md-2">T??n ph??ng</div>
                                    <div className="col-md-2">T??n Kh??ch h??ng</div>
                                    <div className="col-md-2">S??? ??i???n tho???i</div>
                                    <div className="col-md-2">Ng??y nh???n ph??ng</div>
                                    <div className="col-md-2">Ng??y tr??? ph??ng</div>
                                    <div className="col-md-2">?????t c???c</div>
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
                    <div>
                        {
                            this.state.dataInFormConfirm === undefined ? (
                                null
                            ) : (
                                <div className={this.state.class_form_confirm}>
                                    <div className="col-md-4 col-md-offset-4">
                                        <div className="col-md-12 title">X??c nh???n ?????t ph??ng</div>
                                        <div className="col-md-5">H??? t??n ng?????i ?????t:</div><div className="col-md-7">{this.state.dataInFormConfirm['fullname']}</div>
                                        <div className="col-md-5">S??? ??i???n tho???i:</div><div className="col-md-7">{this.state.dataInFormConfirm['phone']}</div>
                                        <div className="col-md-5">Lo???i ph??ng:</div><div className="col-md-7">{type_room[this.state.dataInFormConfirm['type_room']]}</div>
                                        <div className="col-md-5">Ng??y nh???n ph??ng:</div><div className="col-md-7">{this.state.dataInFormConfirm['checkin_date']}</div>
                                        <div className="col-md-5">Ng??y tr??? ph??ng:</div><div className="col-md-7">{this.state.dataInFormConfirm['checkout_date']}</div>
                                        <div className="col-md-5">?????t c???c:</div><div className="col-md-7">{formater.format(this.state.dataInFormConfirm['deposit'])}</div>
                                        <div className="col-md-5">Ch???n ph??ng:</div>
                                        {
                                            this.state.listRoomAvailable.length === 0 ? (
                                                <div className="col-md-7">Kh??ng c??n ph??ng kh??? d???ng</div>
                                            ) : (
                                                <div className="col-md-7">
                                                    <div className="btn-group">
                                                        <button type="button" className="btn btn-danger">{this.state.listRoomAvailable[this.state.id_room_choosed].name_room}</button>
                                                        <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="caret"></span>
                                                            <span className="sr-only">Toggle Dropdown</span>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-right">
                                                        {
                                                            this.state.listRoomAvailable.map((item, index) =>
                                                                <li key={index} onClick={this.ChooseRoom.bind(this, index)}><Link to="#">{item.name_room}</Link></li>
                                                            )
                                                        }
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className="btn btn-info col-md-3 col-md-offset-2" onClick={this.RejectBooking.bind(this, this.state.dataInFormConfirm['id_booking'])}>T??? ch???i</div>
                                        <div className="btn btn-success col-md-2" onClick={this.ConfirmBooking.bind(this, this.state.dataInFormConfirm['id_booking'])}>X??c nh???n</div>
                                        <button className="btn col-md-3" onClick={this.HiddenFormConfirm}>H???y</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
