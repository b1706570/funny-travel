import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HostHeader from '../component/HostHeader';
import HostAddRoom from '../component/HostAddRoom';
import HostEditRoom from '../component/HostEditRoom';
import OtpInput from 'react-otp-input';
import NumberFormat from 'react-number-format';
import hostAPI from '../api/hostAPI';
import logocheckin from '../icons/icon-checkin-room.png';
import logocheckout from '../icons/icon-checkout-room.png';
import logoCancel from '../icons/icon-cancel-schedule.png';

export default class Host extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoom: [],
            listRoomUnAvailable: [],
            listRoomPrepare: [],
            listTimeUnavailable: [],
            listTimePrepare: [],
            listIdCheckin: [],
            listIdCheckout: [],
            currentHost: "",
            branchHost: [],
            data_checkout: {},
            data_on_edit: {},
            body_status: "room-body-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
            opt: "",
            name_room: "",
            id_room_checkin: "",
            id_booking: "",
            check_in_time_form: "",
            check_out_time_form: "",
            type_room: 0,
            count_time: "",
        }
        this.openAddRoom = this.openAddRoom.bind(this);
        this.closeAddRoom = this.closeAddRoom.bind(this);
        this.openEditRoom = this.openEditRoom.bind(this);
        this.closeEditRoom = this.closeEditRoom.bind(this);
        this.openCheckinFormPreBook = this.openCheckinFormPreBook.bind(this);
        this.openCheckinFormBook = this.openCheckinFormBook.bind(this);
        this.openCheckoutFormRoom = this.openCheckoutFormRoom.bind(this);
        this.closeCheckinFormBook = this.closeCheckinFormBook.bind(this);
        this.getAllRoom = this.getAllRoom.bind(this);
        this.getBranch = this.getBranch.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.PreBookedCheckIn = this.PreBookedCheckIn.bind(this);
        this.NonPreBookedCheckIn = this.NonPreBookedCheckIn.bind(this);
        this.clearFormPreBook = this.clearFormPreBook.bind(this);
        this.cancelBookingSchedule = this.cancelBookingSchedule.bind(this);
        this.Changehandler = this.Changehandler.bind(this);
        this.ChangeOtherFee = this.ChangeOtherFee.bind(this);
        this.count_timer = this.count_timer.bind(this);
        this.ChangeOPT = this.ChangeOPT.bind(this);
    }

    componentDidMount() {
        let today = new Date();
        let checkin = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
        let checkout = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + (today.getDate() + 1)).slice(-2);
        this.getAllRoom(checkin, checkout, this.state.type_room);
        this.getBranch();
        this.count_timer();
        this.setState({
            body_status: "room-body-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
            check_in_time_form: checkin,
            check_out_time_form: checkout,
        });
        document.body.style.overflow = "visible";
    }


    getBranch = () => {
        const api = new hostAPI();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        api.getBranch(params)
            .then(response => {
                this.setState({
                    currentHost: localStorage.getItem("username"),
                    branchHost: response,
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    getAllRoom = (checkin, checkout, type_room) => {
        const api = new hostAPI();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        params.append("checkin", checkin);
        params.append("checkout", checkout);
        if (type_room > 0) {
            params.append("type-room", type_room);
        }
        api.getRoomByHostId(params)
            .then(response => {
                var room = response.splice(0, response.length - 6);
                var roomUnAvailable = response.splice(response.length - 6, response.length - 5);
                var timeUnavailable = response.splice(response.length - 5, response.length - 4);
                var listcheckout = response.splice(response.length - 4, response.length - 3);
                var roomPrepare = response.splice(response.length - 3, response.length - 2);
                var timePrepare = response.splice(response.length - 2, response.length - 1);
                var listcheckin = response;
                this.setState({
                    listRoom: room,
                    listRoomUnAvailable: roomUnAvailable[0],
                    listRoomPrepare: roomPrepare[0],
                    listTimeUnavailable: timeUnavailable[0],
                    listTimePrepare: timePrepare[0],
                    listIdCheckin: listcheckin[0],
                    listIdCheckout: listcheckout[0],
                    data_on_edit: room[0],
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeBranch = (index) => {
        var branch = this.state.branchHost[index];
        if (branch.id_host !== localStorage.getItem("iduser")) {
            localStorage.setItem("iduser", branch.id_host);
            localStorage.setItem("username", branch.company_name);
            window.location.reload();
        }
    }

    openEditRoom = (index) => {
        this.setState({
            edit_room_status: "edit-room-visible",
            add_room_status: "add-room-hidden",
            body_status: "room-body-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
            data_on_edit: this.state.listRoom[index],
        })
    }

    closeEditRoom = () => {
        this.setState({
            edit_room_status: "edit-room-hidden",
            add_room_status: "add-room-hidden",
            body_status: "room-body-visible",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
        })
    }

    openAddRoom = (e) => {
        e.preventDefault();
        this.setState({
            add_room_status: "add-room-visible",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
        })
    }

    closeAddRoom = () => {
        this.setState({
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-visible",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkout_form_status: "div-checkout-hidden",
        })
    }

    openCheckinFormPreBook = (name, id) => {
        this.setState({
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-hidden",
            checkout_form_status: "div-checkout-hidden",
            name_room: name,
            id_booking: id,
        })
        document.body.style.overflow = "hidden";
    }

    openCheckinFormBook = (name, id_room) => {
        this.setState({
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            checkin_form_status: "div-pre-booked-checkin-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-hidden",
            checkout_form_status: "div-checkout-hidden",
            name_room: name,
            id_room_checkin: id_room,
        })
        document.body.style.overflow = "hidden";
    }

    closeCheckinFormBook = (e) => {
        e.preventDefault();
        this.setState({
            checkin_form_status: "div-pre-booked-checkin-hidden",
            checkin_form_pre_status: "div-pre-booked-checkin-hidden",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-visible",
            checkout_form_status: "div-checkout-hidden",
        })
        document.body.style.overflow = "visible";
        this.clearFormPreBook();
    }

    openCheckoutFormRoom = (name, id_booking) => {
        let params = new FormData();
        params.append("id_booking", id_booking);
        const api = new hostAPI(params);
        api.getDataCheckout(params)
            .then(response => {
                var data = response;
                data['checkin_date'] = response['checkin_date'].split(" ", 1)[0];
                data['checkout_date'] = response['checkout_date'].split(" ", 1)[0];
                data['night'] = (new Date(response['checkout_date']) - new Date(response['checkin_date'])) / 86400000;
                data['other_fee'] = 0;
                data['total'] = Number(data['price_room']) * Number(data['night']) + Number(data['other_fee']) - Number(data['deposit']);
                this.setState({
                    data_checkout: data,
                    checkin_form_pre_status: "div-pre-booked-checkin-hidden",
                    checkin_form_status: "div-pre-booked-checkin-hidden",
                    add_room_status: "add-room-hidden",
                    edit_room_status: "edit-room-hidden",
                    body_status: "room-body-hidden",
                    checkout_form_status: "div-checkout-visible",
                    name_room: name,
                    id_booking: id_booking,
                });
            })
            .catch(error => {
                console.log(error);
            })
        document.body.style.overflow = "hidden";
    }

    deleteRoom = (index) => {
        var ok = window.confirm("Mọi thông tin về phòng sẽ mất sau khi xóa. Bạn chắn chắn muốn xóa ?");
        if (ok === true) {
            const api = new hostAPI();
            let params = new FormData();
            params.append("id_room", index);
            api.deleteRoom(params)
                .then(response => {
                    if (response.code === 200) {
                        this.componentDidMount();
                    }
                    else {
                        alert("Lỗi hệ thống. Vui lòng thử lại sau!");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    ChangeOPT = (e) => {
        this.setState({ opt: e })
    }

    Changehandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        console.log(value);
        this.setState({ [name]: value });
        //this.getAllRoom(this.state.check_in_time_form, this.state.check_out_time_form, this.state.type_room);
        if (name === "check_in_time_form")
            this.getAllRoom(value, this.state.check_out_time_form, this.state.type_room);
        else if (name === "check_out_time_form")
            this.getAllRoom(this.state.check_in_time_form, value, this.state.type_room);
        else
            this.getAllRoom(this.state.check_in_time_form, this.state.check_out_time_form, value);

    }

    ChangeOtherFee = (e) =>{
        let value = e.target.value;
        value = value.split(",").join("");
        let data = this.state.data_checkout;
        data['other_fee'] = value;
        data['total'] = Number(data['price_room']) * Number(data['night']) + Number(data['other_fee']) - Number(data['deposit']);
        this.setState({
            data_checkout: data,
        })
    }

    Checkout = (e) =>{
        e.preventDefault();
        let data = this.state.data_checkout;
        let params = new FormData();
        params.append("id_booking", this.state.id_booking);
        params.append("id_member", data['id_member']);
        params.append("id_room", data['id_room']);
        params.append("fullname", data['fullname']);
        params.append("phone", data['phone']);
        params.append("checkin_date", data['checkin_date']);
        params.append("checkout_date", data['checkout_date']);
        params.append("deposit", data['deposit']);
        params.append("total_payment", data['total']);
        const api = new hostAPI();
        api.checkOut(params)
            .then(response =>{
                if(response === 200){
                    alert("Thanh toán thành công!");
                    this.componentDidMount();
                }
                else{
                    alert("Thanh toán không thành công!");
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    PreBookedCheckIn = (e) => {
        e.preventDefault();
        let data = document.getElementById("pre-booked-checkin");
        let params = new FormData(data);
        params.append("prebook", 'true');
        params.append("otpcode", this.state.opt);
        const api = new hostAPI();
        api.checkIn(params)
            .then(response => {
                if (response === 1) {
                    alert("Check-in thành công!");
                    this.clearFormPreBook();
                    this.componentDidMount();
                }
                else {
                    alert("Check-in thất bại!");
                    this.clearFormPreBook();
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    NonPreBookedCheckIn = (e) => {
        e.preventDefault();
        let data = document.getElementById("non-pre-booked-checkin");
        let params = new FormData(data);
        params.append("prebook", 'false');
        params.append("check-in-time", this.state.check_in_time_form);
        params.append("check-out-time", this.state.check_out_time_form);
        const api = new hostAPI();
        api.checkIn(params)
            .then(response => {
                if (response === 200) {
                    alert("Check-in thành công!");
                    this.clearFormPreBook();
                    this.componentDidMount();
                }
                else {
                    alert("Check-in thất bại!");
                    this.clearFormPreBook();
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    clearFormPreBook = () => {
        document.getElementById("pre-booked-checkin").reset();
        document.getElementById("non-pre-booked-checkin").reset();
        this.setState({ opt: '' })
    }

    count_timer = () =>{
        let now = new Date();
        if(now.getHours() >= 12){
            this.setState({
                count_time: (now.getHours() - 12) + " : " + now.getMinutes() + " : " + now.getSeconds(),
            })
        }
        this.timer = setTimeout(this.count_timer, 1000);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    cancelBookingSchedule = (id_booking) =>{
        let params = new FormData();
        params.append("id_booking", id_booking);
        params.append("type", "cancel");
        const api = new hostAPI();
        api.cancelBookingSchedule(params)
            .then(response =>{
                if(response === 200){
                    alert("Hủy đặt phòng thành công!");
                    this.componentDidMount();
                }
                else{
                    alert("Hủy đặt phòng thất bại!");
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render() {
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        var now = new Date().getFullYear() + "-" + ("0" +(new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2);
        var class_body = this.state.body_status + " col-md-12";
        var class_add_room = this.state.add_room_status + " col-md-8 col-md-offset-2";
        var class_edit_room = this.state.edit_room_status + " col-md-8 col-md-offset-2";
        var type_room = ['--Loại phòng--', 'Phòng đơn', 'Phòng đôi', 'Phòng tập thể', 'Phòng gia đình', 'Mini House', 'Home Stay'];
        const f = new Intl.NumberFormat();
        if (this.state.listRoom.length === 0) {
            return (
                <div>
                    <div className="host-header col-md-12">
                        <HostHeader hostActive={0} />
                    </div>
                    <div className={class_body} >
                        <div className="host-control col-md-12">
                            <div className="btn-add-room col-md-2 col-md-offset-1">
                                <button onClick={this.openAddRoom}>Thêm phòng</button>
                            </div>
                            <div className="col-md-6 col-md-offset-3">
                                <div className="control-element">
                                    <label>Nhận phòng:</label>
                                    <input type="date" name="check_in_time_form" value={this.state.check_in_time_form} onChange={this.Changehandler} />
                                </div>
                                <div className="control-element">
                                    <label>Trả phòng:</label>
                                    <input type="date" name="check_out_time_form" value={this.state.check_out_time_form} onChange={this.Changehandler} />
                                </div>
                                <div className="control-element">
                                    <select name="type_room" value={this.state.type_room} onChange={this.Changehandler} >
                                        {
                                            type_room.map((item, index) =>
                                                this.state.type_room === index ? (
                                                    <option key={index} value={index} disabled>{item}</option>
                                                ) : (
                                                    <option key={index} value={index}>{item}</option>
                                                )
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="host-content col-md-12">
                            <div className="col-md-12 branch-host">
                                <div className="btn-group">
                                    <button type="button" className="btn">{this.state.currentHost}</button>
                                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="caret"></span>
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        {
                                            this.state.branchHost.map((branch, index) => <li key={index} onClick={this.ChangeBranch.bind(this, index)}><Link to="">{branch.company_name}</Link></li>)
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div><label>Chưa có gì ở đây cả.</label></div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="host-header col-md-12">
                    <HostHeader hostActive={0} />
                </div>
                <div className={class_body} >
                    <div className="host-control col-md-12">
                        <div className="btn-add-room col-md-2 col-md-offset-1">
                            <button onClick={this.openAddRoom}>Thêm phòng</button>
                        </div>
                        <div className="col-md-6 col-md-offset-3">
                            <div className="control-element">
                                <label>Nhận phòng:</label>
                                <input type="date" name="check_in_time_form" value={this.state.check_in_time_form} onChange={this.Changehandler} />
                            </div>
                            <div className="control-element">
                                <label>Trả phòng:</label>
                                <input type="date" name="check_out_time_form" value={this.state.check_out_time_form} onChange={this.Changehandler} />
                            </div>
                            <div className="control-element">
                                <select name="type_room" value={this.state.type_room} onChange={this.Changehandler} >
                                    {
                                        type_room.map((item, index) =>
                                            this.state.type_room === index ? (
                                                <option key={index} value={index} disabled>{item}</option>
                                            ) : (
                                                <option key={index} value={index}>{item}</option>
                                            )
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="host-content col-md-12">
                        <div className="col-md-12 branch-host">
                            <div className="btn-group">
                                <button type="button" className="btn">{this.state.currentHost}</button>
                                <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="caret"></span>
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {
                                        this.state.branchHost.map((branch, index) => <li key={index} onClick={this.ChangeBranch.bind(this, index)}><Link to="">{branch.company_name}</Link></li>)
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label className="col-md-12 title-host-home">DANH SÁCH PHÒNG TRỐNG</label>
                            {
                                this.state.listRoom.map((room, index) => {
                                    if (this.state.listRoomPrepare.indexOf(room.id_room) === -1 && this.state.listRoomUnAvailable.indexOf(room.id_room) === -1) {
                                        return (
                                            <div key={index} className="rooms-in-host room-green col-md-4">
                                                <div className="info-rooms-in-host">
                                                    <div className="edit-info-room-host">
                                                        <span className="glyphicon glyphicon-edit" onClick={this.openEditRoom.bind(this, index)}></span>
                                                        <span className="glyphicon glyphicon-trash" onClick={this.deleteRoom.bind(this, index)}></span>
                                                    </div>
                                                    <label>{room.name_room}</label>
                                                    <p>- Loại phòng: {type_room[room.type_room]}</p>
                                                    <p>- Số người: {room.capacity_room}</p>
                                                    <p>- Giá mỗi đêm: <span>{f.format(room.price_room)} VND</span></p>
                                                    <div className="edit-info-room-host">
                                                        <div className="icon-checkin-room col-md-2 col-md-offset-10"><img src={logocheckin} onClick={this.openCheckinFormBook.bind(this, room.name_room, room.id_room)} alt="icon-checkin-room" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else return null;
                                })
                            }
                        </div>
                        <div className="col-md-12">
                            <label className="col-md-12 title-host-home">DANH SÁCH PHÒNG ĐÃ ĐƯỢC ĐẶT</label>
                            {
                                this.state.listRoom.map((room, index) => {
                                    if (this.state.listRoomPrepare.indexOf(room.id_room) !== -1) {
                                        return (
                                            <div key={index} className="rooms-in-host room-yellow col-md-4">
                                                {
                                                    this.state.listTimePrepare[this.state.listRoomPrepare.indexOf(room.id_room)] === (now + " 12:01:00") ? (
                                                        <span className="time">{this.state.count_time}</span>
                                                    ) : ( null )
                                                }
                                                <div className="info-rooms-in-host">
                                                    <div className="edit-info-room-host">
                                                    </div>
                                                    <label>{room.name_room}</label>
                                                    <p>- Loại phòng: {type_room[room.type_room]}</p>
                                                    <p>- Số người: {room.capacity_room}</p>
                                                    <p>- Giá mỗi đêm: <span>{f.format(room.price_room)} VND</span></p>
                                                    <div className="edit-info-room-host">
                                                        <div className="col-md-8">{this.state.listTimePrepare[this.state.listRoomPrepare.indexOf(room.id_room)]}</div>
                                                        <div className="icon-checkin-room col-md-2"><img src={logocheckin} onClick={this.openCheckinFormPreBook.bind(this, room.name_room, this.state.listIdCheckin[this.state.listRoomPrepare.indexOf(room.id_room)])} alt="icon-checkin-room" /></div>
                                                        <div className="icon-checkout-room col-md-2"><img src={logoCancel} onClick={this.cancelBookingSchedule.bind(this, this.state.listIdCheckin[this.state.listRoomPrepare.indexOf(room.id_room)])} alt="icon-cancel-room" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else return null;
                                })
                            }
                        </div>
                        <div className="col-md-12">
                            <label className="col-md-12 title-host-home">DANH SÁCH PHÒNG ĐANG SỬ DỤNG</label>
                            {
                                this.state.listRoom.map((room, index) => {
                                    if (this.state.listRoomUnAvailable.indexOf(room.id_room) !== -1) {
                                        return (
                                            <div key={index} className="rooms-in-host room-red col-md-4">
                                                {
                                                    this.state.listTimeUnavailable[this.state.listRoomUnAvailable.indexOf(room.id_room)] === (now + " 12:00:00") ? (
                                                        <span className="time">{this.state.count_time}</span>
                                                    ) : ( null )
                                                }
                                                <div className="info-rooms-in-host">
                                                    <div className="edit-info-room-host">
                                                    </div>
                                                    <label>{room.name_room}</label>
                                                    <p>- Loại phòng: {type_room[room.type_room]}</p>
                                                    <p>- Số người: {room.capacity_room}</p>
                                                    <p>- Giá mỗi đêm: <span>{f.format(room.price_room)} VND</span></p>
                                                    <div className="edit-info-room-host">
                                                        <div className="col-md-10">{this.state.listTimeUnavailable[this.state.listRoomUnAvailable.indexOf(room.id_room)]}</div>
                                                        <div className="icon-checkout-room col-md-2"><img src={logocheckout} onClick={this.openCheckoutFormRoom.bind(this, room.name_room, this.state.listIdCheckout[this.state.listRoomUnAvailable.indexOf(room.id_room)])} alt="icon-checkout-room" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else return null;
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={class_add_room}>
                    <HostAddRoom close={this.closeAddRoom} />
                </div>
                <div className={class_edit_room}>
                    <HostEditRoom key={this.state.data_on_edit['id_room']} close={this.closeEditRoom} data={this.state.data_on_edit} />
                </div>
                <div className={this.state.checkin_form_pre_status}>
                    <div className="col-md-4 col-md-offset-4">
                        <form id="pre-booked-checkin" className="col-md-12">
                            <label>CHECK-IN ----{this.state.name_room}</label>
                            <input type="hidden" name="id_book" value={this.state.id_booking} />
                            <input className="form-control" type="text" name="fullname" placeholder="Họ và tên ..."></input>
                            <i>Họ và tên</i>
                            <input className="form-control" type="number" name="phone" placeholder="Số điện thoại ..."></input>
                            <i>Số điện thoại</i>
                            <p><span>HOẶC</span></p>
                            <div className="div-opt">
                                <OtpInput value={this.state.opt} placeholder="--------" isInputNum={true} onChange={this.ChangeOPT} numInputs={8} separator={<span>&nbsp;&Omicron;&nbsp;</span>} />
                            </div>
                            <button className="btn-checkin" onClick={this.PreBookedCheckIn}>Check-in</button>
                            <button className="btn-close" onClick={this.closeCheckinFormBook}>Đóng</button>
                        </form>
                    </div>
                </div>
                <div className={this.state.checkin_form_status}>
                    <div className="col-md-4 col-md-offset-4">
                        <form id="non-pre-booked-checkin" className="col-md-12">
                            <label>CHECK-IN ----{this.state.name_room}</label>
                            <input type="hidden" name="id-room" value={this.state.id_room_checkin}></input>
                            <input className="form-control" type="text" name="fullname" placeholder="Họ và tên ..."></input>
                            <i>Họ và tên</i>
                            <input className="form-control" type="number" name="phone" placeholder="Số điện thoại ..."></input>
                            <i>Số điện thoại</i>
                            <input className="form-control" type="date" defaultValue={this.state.check_in_time_form} readOnly></input>
                            <i>Ngày check-in</i>
                            <input className="form-control" type="date" defaultValue={this.state.check_out_time_form} readOnly></input>
                            <i>Ngày check-out</i>
                            <button className="btn-checkin" onClick={this.NonPreBookedCheckIn}>Check-in</button>
                            <button className="btn-close" onClick={this.closeCheckinFormBook}>Đóng</button>
                        </form>
                    </div>
                </div>
                <div className={this.state.checkout_form_status}>
                    <div className="col-md-4 col-md-offset-4">
                        <form id="checkout" className="col-md-12">
                            <label>CHECK-OUT ----{this.state.name_room}</label>
                            <div className="rows1">
                                <div className="col-md-7">Anh/Chị:</div><div className="col-md-5">{this.state.data_checkout['fullname']}</div>
                                <div className="col-md-7">Số điện thoại (+84):</div><div className="col-md-5">{this.state.data_checkout['phone']}</div>
                            </div>
                            <div className="rows1">
                                <div className="col-md-7">Tên phòng:</div><div className="col-md-5">{this.state.data_checkout['name_room']}</div>
                                <div className="col-md-7">Ngày nhận phòng: </div><div className="col-md-5">{this.state.data_checkout['checkin_date']}</div>
                                <div className="col-md-7">Ngày trả phòng: </div><div className="col-md-5">{this.state.data_checkout['checkout_date']}</div>
                            </div>
                            <div className="rows1">
                                <div className="col-md-7">Thành tiền:</div><div className="col-md-5">(+) {f.format(this.state.data_checkout['price_room'])} x ({this.state.data_checkout['night']})</div>
                                <div className="col-md-7">Đã đặt cọc:</div><div className="col-md-5">(-) {f.format(this.state.data_checkout['deposit'])}</div>
                                <div className="col-md-7">Phụ thu:</div><div className="col-md-5"><NumberFormat thousandSeparator /*value={this.state.data_checkout['other_fee']}*/ onChange={this.ChangeOtherFee} /></div>
                            </div>
                            <div>
                                <div className="col-md-7">Tổng thanh toán:</div><div className="col-md-5 total-price">{f.format(this.state.data_checkout['total'])} (VND)</div>
                            </div>
                            <div>
                                <div className="col-md-12"><button className="btn btn-success col-md-12" onClick={this.Checkout}>Xác nhận trả phòng</button></div>
                                <div className="col-md-12"><button className="btn btn-danger col-md-12" onClick={this.closeCheckinFormBook}>Hủy</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
