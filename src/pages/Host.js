import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HostHeader from '../component/HostHeader';
import HostAddRoom from '../component/HostAddRoom';
import HostEditRoom from '../component/HostEditRoom';
import OtpInput from 'react-otp-input';
import hostAPI from '../api/hostAPI';
import logocheckin from '../icons/icon-checkin-room.png';
import logocheckout from '../icons/icon-checkout-room.png';

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
            data_on_edit: {},
            body_status: "room-body-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
            opt: "",
            name_room_checkin: "",
            id_booking_checkin: "",
        }
        this.openAddRoom = this.openAddRoom.bind(this);
        this.closeAddRoom = this.closeAddRoom.bind(this);
        this.openEditRoom = this.openEditRoom.bind(this);
        this.closeEditRoom = this.closeEditRoom.bind(this);
        this.openCheckinFormPreBook = this.openCheckinFormPreBook.bind(this);
        this.closeCheckinFormPreBook = this.closeCheckinFormPreBook.bind(this);
        this.getAllRoom = this.getAllRoom.bind(this);
        this.getBranch = this.getBranch.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.PreBookedCheckIn = this.PreBookedCheckIn.bind(this);
        this.clearFormPreBook = this.clearFormPreBook.bind(this);
    }

    componentDidMount() {
        let today = new Date();
        let checkin = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        let checkout = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() + 1);
        this.getAllRoom(checkin,checkout);
        this.getBranch();
        this.setState({
            body_status: "room-body-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
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

    getAllRoom = (checkin, checkout) => {
        const api = new hostAPI();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        params.append("checkin", checkin);
        params.append("checkout", checkout);
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
            data_on_edit: this.state.listRoom[index],
        })
    }

    closeEditRoom = () => {
        this.setState({
            edit_room_status: "edit-room-hidden",
            add_room_status: "add-room-hidden",
            body_status: "room-body-visible",
            checkin_form_status: "div-pre-booked-checkin-hidden",
        })
    }

    openAddRoom = (e) => {
        e.preventDefault();
        this.setState({
            add_room_status: "add-room-visible",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-hidden",
            checkin_form_status: "div-pre-booked-checkin-hidden",
        })
    }

    closeAddRoom = () => {
        this.setState({
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-visible",
            checkin_form_status: "div-pre-booked-checkin-hidden",
        })
    }

    openCheckinFormPreBook = (name, id) =>{
        this.setState({
            checkin_form_status: "div-pre-booked-checkin-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-hidden",
            name_room_checkin: name,
            id_booking_checkin: id,
        })
        document.body.style.overflow = "hidden";
    }

    closeCheckinFormPreBook = (e) =>{
        e.preventDefault();
        this.setState({
            checkin_form_status: "div-pre-booked-checkin-hidden",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-hidden",
            body_status: "room-body-visible",
        })
        document.body.style.overflow = "visible";
        this.clearFormPreBook();
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

    ChangeOPT = (e) =>{
        this.setState({ opt: e })
    }

    PreBookedCheckIn = (e) =>{
        e.preventDefault();
        let data = document.getElementById("pre-booked-checkin");
        let params = new FormData(data);
        params.append("prebook", true);
        params.append("otpcode", this.state.opt);
        const api = new hostAPI();
        api.checkIn(params)
            .then(response => {
                if(response === 1){
                    alert("Check-in thành công!");
                    this.clearFormPreBook();
                    this.componentDidMount();
                }
                else{
                    alert("Check-in thất bại!");
                    this.clearFormPreBook();
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    clearFormPreBook = () =>{
        document.getElementById("pre-booked-checkin").reset();
        this.setState({ opt: '' })
    }

    render() {
        if (localStorage.getItem("type") !== 'host') {
            return <Redirect to="/" />
        }
        var class_body = this.state.body_status + " col-md-12";
        var class_add_room = this.state.add_room_status + " col-md-8 col-md-offset-2";
        var class_edit_room = this.state.edit_room_status + " col-md-8 col-md-offset-2";
        var type_room = ['', 'Phòng đơn', 'Phòng đôi', 'Phòng tập thể', 'Phòng gia đình', 'Mini House', 'Home Stay'];
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
                            <div className="col-md-7 col-md-offset-2">
                                <div className="control-element"><label>Nhận phòng:</label>  <input type="date" /></div>
                                <div className="control-element"><label>Trả phòng:</label>  <input type="date" /></div>
                                <div className="control-element"><select>
                                    <option>--Loại phòng--</option>
                                </select></div>
                                <div className="control-element"><label>Số người:</label>  <input type="text" /></div>
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
                            <div><label>Bạn cần thêm phòng để bắt đầu hoạt động.</label></div>
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
                        <div className="col-md-7 col-md-offset-2">
                            <div className="control-element"><label>Nhận phòng:</label>  <input type="date" /></div>
                            <div className="control-element"><label>Trả phòng:</label>  <input type="date" /></div>
                            <div className="control-element"><select>
                                <option>--Loại phòng--</option>
                            </select></div>
                            <div className="control-element"><label>Số người:</label>  <input type="text" /></div>
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
                                                        <div className="icon-checkin-room col-md-2 col-md-offset-8"><img src={logocheckin} alt="icon-checkin-room" /></div>
                                                        <div className="icon-checkout-room col-md-2"><img src={logocheckout} alt="icon-checkout-room" /></div>
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
                                                        <div className="icon-checkout-room col-md-2"><img src={logocheckout} alt="icon-checkout-room" /></div>
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
                                                <div className="info-rooms-in-host">
                                                    <div className="edit-info-room-host">
                                                    </div>
                                                    <label>{room.name_room}</label>
                                                    <p>- Loại phòng: {type_room[room.type_room]}</p>
                                                    <p>- Số người: {room.capacity_room}</p>
                                                    <p>- Giá mỗi đêm: <span>{f.format(room.price_room)} VND</span></p>
                                                    <div className="edit-info-room-host">
                                                        <div className="col-md-10">{this.state.listTimeUnavailable[this.state.listRoomUnAvailable.indexOf(room.id_room)]}</div>
                                                        <div className="icon-checkout-room col-md-2"><img src={logocheckout} alt="icon-checkout-room" /></div>
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
                <div className={this.state.checkin_form_status}>
                    <div className="col-md-4 col-md-offset-4">
                        <form id="pre-booked-checkin" className="col-md-12">
                            <label>CHECK-IN ----{this.state.name_room_checkin}</label>
                            <input type="hidden" name="id_book" value={this.state.id_booking_checkin} />
                            <input className="form-control" type="text" name="fullname" placeholder="Họ và Tên ..."></input>
                            <input className="form-control" type="number" name="phone" placeholder="Số điện thoại ..."></input>
                            <p><span>HOẶC</span></p>
                            <div className="div-opt">
                                <OtpInput value={this.state.opt} placeholder="--------" isInputNum={true} onChange={this.ChangeOPT} numInputs={8} separator={<span>&nbsp;&Omicron;&nbsp;</span>}/>
                            </div>
                            <button className="btn-checkin" onClick={this.PreBookedCheckIn}>Check-in</button>
                            <button className="btn-close" onClick={this.closeCheckinFormPreBook}>Đóng</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
