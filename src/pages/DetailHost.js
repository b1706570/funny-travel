import React, { Component } from 'react';
import logo from '../img/logo.png';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import Header from '../component/Header';
import publicAPI from '../api/publicAPI';
import config from '../config.json';
import NumberFormat from 'react-number-format';
import Footer from '../component/Footer';
import Comment from '../component/Comment';
import ShowAddressInMaps from '../component/ShowAddressInMaps';


export class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
            index_active: 0,
        }
        this.NextImage = this.NextImage.bind(this);
        this.PreviousImage = this.PreviousImage.bind(this);
        this.activeImage = this.activeImage.bind(this);
    }


    NextImage = (e) => {
        e.preventDefault();
        if (this.state.index_active < this.state.images.length - 1) {
            var nextid = this.state.index_active + 1;
            this.setState({ index_active: nextid });
        }
        else {
            this.setState({ index_active: 0 });
        }
    }

    PreviousImage = (e) => {
        e.preventDefault();
        if (this.state.index_active > 0) {
            var previousid = this.state.index_active - 1;
            this.setState({ index_active: previousid });
        }
        else {
            this.setState({ index_active: this.state.images.length - 1 })
        }
    }

    activeImage(index) {
        this.setState({
            index_active: index,
        })
    }

    render() {
        return (
            <div className="carousel slide">
                <div className="carousel-inner">
                    {
                        this.state.images.map((image, index) => {
                            if (index === this.state.index_active) {
                                return (
                                    <div key={index} className="item active">
                                        <img src={config.ServerURL + "/" + image} alt={index} />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={index} className="item">
                                        <img src={config.ServerURL + "/" + image} alt={index} />
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <a className="left carousel-control" href="#previous" data-slide="prev" onClick={this.PreviousImage} >
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href="#next" data-slide="next" onClick={this.NextImage} >
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                </a>
                <div className="col-md-12">
                    <div className="imagePagination">
                        {
                            this.state.images.map((image, index) => {
                                if (index === this.state.index_active) {
                                    return (
                                        <div className="activate" key={index}>
                                            <img src={config.ServerURL + "/" + image} alt={index} />
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index} onClick={this.activeImage.bind(this, index)}>
                                            <img src={config.ServerURL + "/" + image} alt={index} />
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default class DetailHost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRooms: [],
            listRoomUnavailable: [],
            listConv: [],
            listConvInDetail: [],
            checkin_date: "",
            checkout_date: "",
            id_host: "",
            address: "",
            phone: "",
            email: "",
            company: "",
            fullname: "",
            logo: logo,
            latitude: "",
            longtitude: "",
            point: "(Chưa có đánh giá)",
            class_listConv: "div-more-detail-conv-hidden",
            class_div_left: "detail-div-left-default",
            class_div_right: "detail-div-right-default",
            redirect: "",
        }
        this.getCommonInfoHost = this.getCommonInfoHost.bind(this);
        this.getRoomUnavailable = this.getRoomUnavailable.bind(this);
        this.getAllConvenients = this.getAllConvenients.bind(this);
        this.ChangeConvInMoreDetail = this.ChangeConvInMoreDetail.bind(this);
        this.HiddenMoreDetail = this.HiddenMoreDetail.bind(this);
        this.ShowORHideCmt = this.ShowORHideCmt.bind(this);
        this.ChangeDateHandler = this.ChangeDateHandler.bind(this);
    }

    componentDidMount() {
        this.getCommonInfoHost();
        this.getRoomUnavailable();
        this.getAllConvenients();
    }

    getAllConvenients() {
        const api = new publicAPI();
        api.getAllConvenient()
            .then(response => {
                this.setState({
                    listConv: response,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCommonInfoHost() {
        let search = queryString.parse(this.props.location.search)
        let params = new FormData();
        params.append("id_host", this.props.match.params.id);
        const api = new publicAPI();
        api.getCommonInfoHost(params)
            .then(response => {
                var common_info = response.common_info;
                var point = response.point;
                var newlistRooms = [];
                for (var i = 0; i < response.rooms.length; i++) {
                    var room = response.rooms[i];
                    room.convenients_room = room.convenients_room.split(";");
                    room.convenients_room = room.convenients_room.splice(0, room.convenients_room.length - 1);
                    room.images_room = room.images_room.split(";");
                    room.images_room = room.images_room.splice(0, room.images_room.length - 1);
                    newlistRooms.push(room);
                }
                this.setState({
                    listRooms: newlistRooms,
                    id_host: common_info.id_host,
                    address: common_info.address_host,
                    phone: common_info.phone_host,
                    email: common_info.email_host,
                    company: common_info.company_name,
                    fullname: common_info.fullname_host,
                    logo: common_info.logo_host,
                    latitude: common_info.latitude,
                    longtitude: common_info.longtitude,
                    checkin_date: search.check_in,
                    checkout_date: search.check_out,
                })
                if (response.point.point !== null) {
                    this.setState({
                        point: "(" + point.point + " sao - " + point.number + " lượt đánh giá)",
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    getRoomUnavailable() {
        let search = queryString.parse(this.props.location.search);
        let params = new FormData();
        params.append("checkin", search.check_in);
        params.append("checkout", search.check_out);
        const api = new publicAPI();
        api.getRoomUnavailable(params)
            .then(response => {
                this.setState({ listRoomUnavailable: response })
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeConvInMoreDetail(index) {
        let data = this.state.listRooms;
        this.setState({
            listConvInDetail: data[index].convenients_room,
            class_listConv: "div-more-detail-conv",
        })
        document.body.style.overflow = "hidden";
    }

    HiddenMoreDetail = () => {
        this.setState({
            class_listConv: "div-more-detail-conv-hidden",
        })
        document.body.style.overflow = "visible";
    }

    ShowORHideCmt(){
        if(this.state.class_div_left === "detail-div-left-default"){
            this.setState({
                class_div_left: "detail-div-left",
                class_div_right: "detail-div-right",
            })
        }
        else{
            this.setState({
                class_div_left: "detail-div-left-default",
                class_div_right: "detail-div-right-default",
            })
        }
    }

    ChangeDateHandler = (e) =>{
        var name = e.target.name;
        var value = e.target.value;
        this.setState({ [name]: value });
    }

    CheckRoomavailable = () =>{
        this.props.history.push("/rooms/" + this.state.id_host + "?check_in=" + this.state.checkin_date + "&check_out=" + this.state.checkout_date);
        window.location.reload();
    }

    BookingRoom = (id_room) =>{
        if(localStorage.getItem("iduser") === null){
            alert("Bạn phải đăng nhập trước khi đặt phòng!");
        }
        else{
            this.setState({
                redirect: "/rooms/book?roomID=" + id_room + "&check_in=" + this.state.checkin_date + "&check_out=" + this.state.checkout_date,
            })
        }    
    }

    render() {
        if (localStorage.getItem('type') === "host")
            return <Redirect to={"/host/" + localStorage.getItem('username')} />
        if (localStorage.getItem('type') === "admin")
            return <Redirect to="/admin" />
        if (this.state.redirect !== "")
            return <Redirect to={this.state.redirect} />
        var type_room = ['Phòng đơn', 'Phòng đôi', 'Phòng tập thể', 'Phòng gia đình', 'Mini house', 'Home stay'];
        return (
            <div key={this.state.checkin_date + this.state.checkout_date}>
                <div className="col-md-12 header-home"><Header /></div>
                <div className="col-md-8 col-md-offset-2 second-header-home-detail">
                    <div className="col-md-12">
                        <div className="col-md-7 col-md-offset-5 control-detail-host">
                            <div><label>Nhận phòng:</label>
                                <input type="date" name="checkin_date" value={this.state.checkin_date} onChange={this.ChangeDateHandler} />
                            </div>
                            <div><label>Trả phòng:</label>
                                <input type="date" name="checkout_date" value={this.state.checkout_date} onChange={this.ChangeDateHandler} />
                            </div>
                            <div onClick={this.CheckRoomavailable}>
                                <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                            </div>
                        </div>
                        <div className="col-md-12 common-info-detail">
                            <label>{this.state.company}</label>
                            <span>{this.state.point}</span>
                            <div className="col-md-12">
                                <a href="#map">{this.state.address}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className={this.state.class_div_left}>
                        {
                            this.state.listRooms.map((room, index) => {
                                if (this.state.listRoomUnavailable.indexOf(room.id_room) === -1) {
                                    return (
                                        <div className="col-md-12 room-detail" key={index}>
                                            <div className="col-md-6 image-room-detail">
                                                <ImageSlider images={room.images_room} />
                                            </div>
                                            <div className="col-md-5 content-room-detail">
                                                <div className="col-md-12 price-room-detail"> Giá mỗi đêm (VND): <NumberFormat thousandSeparator value={room.price_room} readOnly /></div>
                                                <div className="col-md-12"> Tên phòng: {room.name_room}</div>
                                                <div className="col-md-12"> Loại phòng: {type_room[room.type_room - 1]}</div>
                                                <div className="col-md-12"> Số người: {room.capacity_room}</div>
                                                <div className="col-md-12"> Trạng thái: <p className="available">Trống</p></div>
                                                <div className="col-md-12 room-conv-detail">
                                                    <span>Tiện ích: </span>
                                                    {
                                                        this.state.listConv.map((conv, index) => {
                                                            if (room.convenients_room.indexOf(conv.id_conv) !== -1) {
                                                                return (<span key={index}>{conv.name_conv + ", "}</span>);
                                                            }
                                                            else return null;
                                                        })
                                                    }

                                                </div>
                                                <span className="more-detail-conv-btn" onClick={this.ChangeConvInMoreDetail.bind(this, index)}>(xem thêm)</span>
                                            </div>
                                            <div onClick={this.BookingRoom.bind(this, room.id_room)} className="col-md-1 booking-room">
                                                Đặt phòng
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="col-md-12 room-detail" key={index}>
                                            <div className="col-md-6 image-room-detail">
                                                <ImageSlider images={room.images_room} />
                                            </div>
                                            <div className="col-md-5 content-room-detail">
                                                <div className="col-md-12 price-room-detail"> Giá mỗi đêm (VND): <NumberFormat thousandSeparator value={room.price_room} readOnly /></div>
                                                <div className="col-md-12"> Tên phòng: {room.name_room}</div>
                                                <div className="col-md-12"> Loại phòng: {type_room[room.type_room - 1]}</div>
                                                <div className="col-md-12"> Số người: {room.capacity_room}</div>
                                                <div className="col-md-12"> Trạng thái: <p className="unavailable">Đã được đặt</p></div>
                                                <div className="col-md-12 room-conv-detail">
                                                    <span>Tiện ích: </span>
                                                    {
                                                        this.state.listConv.map((conv, index) => {
                                                            if (room.convenients_room.indexOf(conv.id_conv) !== -1) {
                                                                return (<span key={index}>{conv.name_conv + ", "}</span>);
                                                            }
                                                            else return null;
                                                        })
                                                    }

                                                </div>
                                                <span className="more-detail-conv-btn" onClick={this.ChangeConvInMoreDetail.bind(this, index)}>(xem thêm)</span>
                                            </div>
                                            <div onClick={this.BookingRoom.bind(this, room.id_room)} className="col-md-1 booking-room">
                                                Đặt phòng
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className={this.state.class_div_right}>
                        <Comment id_host={this.props.match.params.id} />
                    </div>
                </div>
                <div id="map" className="col-md-12 map-in-detail-host">
                    <ShowAddressInMaps key={this.state.latitude} lat={this.state.latitude} long={this.state.longtitude} />
                </div>
                <div className="col-md-12"><Footer /></div>
                <div className={this.state.class_listConv}>
                    <div className="div-content-more-detail-conv">
                        <div className="hidden-detail-conv"><span className="glyphicon glyphicon glyphicon-remove-circle" onClick={this.HiddenMoreDetail}></span></div>
                        {
                            this.state.listConv.map((item, index) => {
                                if (this.state.listConvInDetail.indexOf(item.id_conv) === -1) {
                                    return (<div key={index} className="home-detail-conv-info col-md-4">
                                        <span className="glyphicon glyphicon glyphicon-unchecked" ></span>
                                        <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="Icon" />
                                        <p className="value-checkbox">{item.name_conv}</p>
                                    </div>)
                                }
                                else {
                                    return (
                                        <div key={index} className="home-detail-conv-info col-md-4">
                                            <span className="glyphicon glyphicon glyphicon-check" ></span>
                                            <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="Icon" />
                                            <p className="value-checkbox">{item.name_conv}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className="btn-show-comment" onClick={this.ShowORHideCmt}></div>
            </div>
        )
    }
}
