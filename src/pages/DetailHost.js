import React, { Component } from 'react';
import logo from '../img/logo.png';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Header from '../component/Header';
import publicAPI from '../api/publicAPI';
import config from '../config.json';
import NumberFormat from 'react-number-format';
import Footer from '../component/Footer';
import Comment from '../component/Comment';


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
                <Link className="left carousel-control" to="" data-slide="prev" onClick={this.PreviousImage} >
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                </Link>
                <Link className="right carousel-control" to="" data-slide="next" onClick={this.NextImage} >
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                </Link>
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
        }
        this.getCommonInfoHost = this.getCommonInfoHost.bind(this);
        this.getRoomUnavailable = this.getRoomUnavailable.bind(this);
        this.getAllConvenients = this.getAllConvenients.bind(this);
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

    render() {
        if (localStorage.getItem('type') === "host")
            return <Redirect to={"/host/" + localStorage.getItem('username')} />
        if (localStorage.getItem('type') === "admin")
            return <Redirect to="/admin" />
        var type_room = ['Phòng đơn', 'Phòng đôi', 'Phòng tập thể', 'Phòng gia đình', 'Mini house', 'Home stay'];
        return (
            <div>
                <div className="col-md-12 header-home"><Header /></div>
                <div className="col-md-12">This is control row</div>
                <div className="col-md-8 col-md-offset-2">
                    <div className="col-md-12 common-info-detail">
                        <label>{this.state.company}</label>
                        <span>{this.state.point}</span>
                    </div>
                    <div className="col-md-12">
                        {this.state.address}
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="detail-div-left">
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
                                                                return (<span key={index}>{conv.name_conv + ", "}</span>)
                                                            }
                                                        })
                                                    }

                                                </div>
                                                <span className="more-detail-conv">(xem thêm)</span>
                                            </div>
                                            <div className="col-md-1 booking-room">
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
                                                                return (<span key={index}>{conv.name_conv + ", "}</span>)
                                                            }
                                                        })
                                                    }

                                                </div>
                                                <span className="more-detail-conv">(xem thêm)</span>
                                            </div>
                                            <div className="col-md-1 booking-room">
                                                Đặt phòng
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="detail-div-right">
                        <Comment id_host={this.props.match.params.id} />
                    </div>
                </div>
                <div className="col-md-12"><Footer /></div>
            </div>
        )
    }
}
