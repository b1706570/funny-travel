import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HostHeader from '../component/HostHeader';
import HostAddRoom from '../component/HostAddRoom';
import HostEditRoom from '../component/HostEditRoom';
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
            currentHost: "",
            branchHost: [],
            data_on_edit: {},
            body_status: "room-body-visible",
            add_room_status: "add-room-hidden",
            edit_room_status: "edit-room-visible",
        }
        this.openAddRoom = this.openAddRoom.bind(this);
        this.closeAddRoom = this.closeAddRoom.bind(this);
        this.getAllRoom = this.getAllRoom.bind(this);
        this.getBranch = this.getBranch.bind(this);
        this.editRoom = this.editRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    componentDidMount() {
        this.getAllRoom();
        this.getBranch();
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

    getAllRoom = () => {
        const api = new hostAPI();
        let params = new FormData();
        params.append("id_host", localStorage.getItem("iduser"));
        api.getRoomByHostId(params)
            .then(response => {
                var room = response.splice(0, response.length - 2);
                var roomUnAvailable = response.splice(response.length - 2, response.length - 1);
                var roomPrepare = response;
                this.setState({
                    listRoom: room,
                    listRoomUnAvailable: roomUnAvailable[0],
                    listRoomPrepare: roomPrepare[0],
                    data_on_edit: room[0],
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeBranch = (index) =>{
        var branch = this.state.branchHost[index];
        if(branch.id_host !== localStorage.getItem("iduser")){
            localStorage.setItem("iduser", branch.id_host);
            localStorage.setItem("username", branch.company_name);
            window.location.reload();
        }
    }

    openAddRoom = (e) => {
        e.preventDefault();
        this.setState({
            add_room_status: "add-room-visible",
            body_status: "room-body-hidden",
        })
    }

    closeAddRoom = () => {
        this.setState({
            add_room_status: "add-room-hidden",
            body_status: "room-body-visible",
        })
    }

    editRoom = (index) =>{
        console.log(index);
    }

    deleteRoom = (index) =>{
        var ok = window.confirm("Mọi thông tin về phòng sẽ mất sau khi xóa. Bạn chắn chắn muốn xóa ?");
        if(ok === true){
            const api = new hostAPI();
            let params = new FormData();
            params.append("id_room", index);
            api.deleteRoom(params)
                .then(response =>{
                    if(response.code === 200){
                        this.componentDidMount();
                    }
                    else{
                        alert("Lỗi hệ thống. Vui lòng thử lại sau!");
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
        }
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
                        <div>
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
                                                        <div className="icon-checkin-room col-md-2 col-md-offset-8"><img src={logocheckin} alt="icon-checkin-room" /></div>
                                                        <div className="icon-checkout-room col-md-2"><img src={logocheckout} alt="icon-checkout-room" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else if (this.state.listRoomUnAvailable.indexOf(room.id_room) !== -1) {
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
                                                        <div className="icon-checkout-room col-md-2 col-md-offset-10"><img src={logocheckout} alt="icon-checkout-room" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index} className="rooms-in-host room-green col-md-4">
                                                <div className="info-rooms-in-host">
                                                    <div className="edit-info-room-host">
                                                        <span className="glyphicon glyphicon-edit" onClick={this.editRoom.bind(this, room.id_room)}></span>
                                                        <span className="glyphicon glyphicon-trash" onClick={this.deleteRoom.bind(this, room.id_room)}></span>
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
                                }
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={class_add_room}>
                    <HostAddRoom close={this.closeAddRoom} />
                </div>
                <div className={class_edit_room}>
                    <HostEditRoom key={this.state.data_on_edit['id_room']} data={this.state.data_on_edit}/>
                </div>
            </div>
        )
    }
}
