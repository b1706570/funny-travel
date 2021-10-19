import React, { Component } from 'react';
import Header from '../component/Header';
import publicAPI from '../api/publicAPI';
import queryString from 'query-string';
import logo from '../img/logo.png';
import Comment from '../component/Comment';
import Chatbox from '../component/Chatbox';
import config from '../config.json';
import { Link } from 'react-router-dom';
import ShowAddressInMaps from '../component/ShowAddressInMaps';

export default class DetailHost extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            min_price: "",
            type_room: "",
            price_room: "Giá",
            point: "(Chưa có đánh giá)",
            listTypeRoom: [],
            listAllConv: [],
            litsImgRoom: [],
            listConv: [],
            class_div_left: "detail-div-left-default",
            class_div_right: "detail-div-right-default",
            class_more_detail_image: "div-more-detail-conv-hidden",
        }
        this.getAllConvenients = this.getAllConvenients.bind(this);
        this.getCommonInfoHost = this.getCommonInfoHost.bind(this);
        this.ShowORHideCmt = this.ShowORHideCmt.bind(this);
        this.ChangeTypeRoom = this.ChangeTypeRoom.bind(this);
        this.CheckRoomAvailable = this.CheckRoomAvailable.bind(this);
    }

    componentDidMount() {
        this.getCommonInfoHost();
        this.getAllConvenients();
    }

    getAllConvenients = () => {
        const api = new publicAPI();
        api.getAllConvenient()
            .then(response => {
                this.setState({
                    listAllConv: response,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCommonInfoHost = () => {
        let search = queryString.parse(this.props.location.search)
        let params = new FormData();
        params.append("id_host", this.props.match.params.id);
        const api = new publicAPI();
        api.getCommonInfoHost(params)
            .then(response => {
                var common_info = response.common_info;
                var point = response.point;
                var newlistImage = [];
                var newlistConvenient = [];
                var newlitsTypeRoom = [];
                var min = 99999999999;
                for (let i = 0; i < response['rooms'].length; i++) {
                    let room = response['rooms'][i];
                    room.convenients_room = room.convenients_room.split(";");
                    room.convenients_room = room.convenients_room.splice(0, room.convenients_room.length - 1);
                    room.images_room = room.images_room.split(";");
                    room.images_room = room.images_room.splice(0, room.images_room.length - 1);
                    for (let x = 0; x < room.convenients_room.length; x++)
                        if (newlistConvenient.indexOf(room.convenients_room[x]) === -1)
                            newlistConvenient.push(room.convenients_room[x]);
                    for (let x = 0; x < room.images_room.length; x++)
                        if (newlistImage.indexOf(room.images_room[x]) === -1)
                            newlistImage.push(room.images_room[x]);
                    if (room.price_room < min)
                        min = room.price_room;
                    if (newlitsTypeRoom.indexOf(room.type_room) === -1)
                        newlitsTypeRoom.push(room.type_room);
                    newlitsTypeRoom.sort((a, b) => a > b ? 1 : -1);
                }
                this.setState({
                    id_host: common_info.id_host,
                    address: common_info.address_host,
                    phone: common_info.phone_host,
                    email: common_info.email_host,
                    company: common_info.company_name,
                    fullname: common_info.fullname_host,
                    logo: common_info.logo_host,
                    latitude: common_info.latitude,
                    longtitude: common_info.longtitude,
                    min_price: min,
                    checkin_date: search.check_in,
                    checkout_date: search.check_out,
                    type_room: search.type,
                    litsImgRoom: newlistImage,
                    listConv: newlistConvenient,
                    listTypeRoom: newlitsTypeRoom,
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

    ShowORHideCmt = () => {
        if (this.state.class_div_left === "detail-div-left-default") {
            this.setState({
                class_div_left: "detail-div-left",
                class_div_right: "detail-div-right",
            })
        }
        else {
            this.setState({
                class_div_left: "detail-div-left-default",
                class_div_right: "detail-div-right-default",
            })
        }
    }

    ChangeTypeRoom = (index) => {
        this.setState({ type_room: index })
        this.props.history.push("/rooms/" + this.state.id_host + "?check_in=" + this.state.checkin_date + "&check_out=" + this.state.checkout_date + "&type=" + index);
    }

    ChangeDate = (e) => {
        var { name, value } = e.target;
        this.setState({ [name]: value });
        if (name === "checkin_date")
            this.props.history.push("/rooms/" + this.state.id_host + "?check_in=" + value + "&check_out=" + this.state.checkout_date + "&type=" + this.state.type_room);
        else
            this.props.history.push("/rooms/" + this.state.id_host + "?check_in=" + this.state.checkin_date + "&check_out=" + value + "&type=" + this.state.type_room);
    }

    CheckRoomAvailable = () => {
        if (localStorage.getItem('iduser') === null) {
            alert("Hãy đăng nhập trước khi kiếm tra tình trạng còn phòng");
        }
        else {
            var ok = true;
            if (this.state.type_room === "0") {
                alert("Bạn hãy chọn loại phòng trước khi kiểm tra");
                ok = false;
            }
            if (this.state.checkin_date === "") {
                alert("Bạn hãy chọn ngày nhận phòng trước khi kiểm tra");
                ok = false;
            }
            if (this.state.checkout_date === "") {
                alert("Bạn hãy chọn ngày trả phòng trước khi kiểm tra");
                ok = false;
            }
            if (ok === true) {
                let params = new FormData();
                params.append("id_host", this.state.id_host);
                params.append("type_room", this.state.type_room);
                params.append("checkin_date", this.state.checkin_date);
                params.append("checkout_date", this.state.checkout_date);
                const api = new publicAPI();
                api.checkRoomAvailable(params)
                    .then(response => {
                        document.getElementById("Noti-room-available").style.display = "block";
                        if (response.length === 0) {
                            this.setState({
                                price_room: "Giá",
                            })
                            document.getElementById("Noti-room-available").innerHTML = "Phòng không khả dụng. Vui lòng chọn thời gian khác!";
                            document.getElementById("btn-booking-room").style.display = "none";
                        }
                        else {
                            this.setState({
                                price_room: response[0],
                            })
                            document.getElementById("Noti-room-available").innerHTML = "Phòng khả dụng. Hãy nhanh tay đặt phòng để tận hưởng chuyến du lịch!";
                            document.getElementById("btn-booking-room").style.display = "block";
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }

    showMoreImage = () => {
        this.setState({
            class_more_detail_image: "div-more-detail-conv",
        })
        document.body.style.overflow = "hidden";
    }

    hiddenMoreImage = () => {
        this.setState({
            class_more_detail_image: "div-more-detail-conv-hidden",
        })
        document.body.style.overflow = "visible";
    }

    render() {
        var type_room = ["Chọn loại phòng", "Phòng đơn", "Phòng đôi", "Phòng tập thể", "Phòng gia đình", "Mini house", "Homestay"];
        var formater = new Intl.NumberFormat();
        return (
            <div>
                <div className="col-md-12 header-home"><Header /></div>
                <div className="col-md-8 col-md-offset-2 second-header-home-detail">
                    <div className="col-md-12">
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
                        <div className="col-md-12 image-room-detail">
                            <div className="col-md-6">
                                {
                                    this.state.litsImgRoom.map((images_room, index) =>
                                        index < 4 ? (
                                            <div key={index} className="small-image"><img src={config.ServerURL + "/" + images_room} alt="Hình ảnh phòng" /></div>
                                        ) : (null)
                                    )
                                }
                            </div>
                            <div className="col-md-6">
                                <div className="large-image"><img src={config.ServerURL + "/" + this.state.litsImgRoom[4]} alt="Hình ảnh phòng" /></div>
                            </div>
                            <div className="btn-show-more-detail-img" onClick={this.showMoreImage}>Xem thêm hình ảnh <span className="glyphicon glyphicon-th"></span></div>
                        
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-7">
                                <div className="price-room-detail">{"Giá thấp nhất mỗi đêm: " + formater.format(this.state.min_price) + " (VND)"}</div>
                                <div className="convenient-room-detail">
                                    <div className="col-md-12 title-room-detail">Các tiện nghi</div>
                                    <div>
                                        {
                                            this.state.listAllConv.map((conv, index) =>
                                                this.state.listConv.indexOf(conv.id_conv) === -1 ? (
                                                    <div key={index} className="home-detail-conv-info col-md-6">
                                                        <span className="glyphicon glyphicon glyphicon-unchecked" ></span>
                                                        <img className="icon-checkbox" src={config.ServerURL + "/" + conv.icon_conv} alt="Icon" />
                                                        <p className="value-checkbox">{conv.name_conv}</p>
                                                    </div>
                                                ) : (
                                                    <div key={index} className="home-detail-conv-info col-md-6">
                                                        <span className="glyphicon glyphicon glyphicon-check" ></span>
                                                        <img className="icon-checkbox" src={config.ServerURL + "/" + conv.icon_conv} alt="Icon" />
                                                        <p className="value-checkbox">{conv.name_conv}</p>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="col-md-12 div-check-room-available">
                                    {
                                        this.state.price_room === "Giá" ? (
                                            <div className="col-md-12 price-room">{this.state.price_room + " / đêm"}</div>
                                        ) : (
                                            <div className="col-md-12 price-room">{formater.format(this.state.price_room) + " / đêm"}</div>
                                        )
                                    }
                                    <div className="col-md-12">
                                        <div className="time-checkin">
                                            <p>Nhận phòng</p>
                                            <input name="checkin_date" type="date" value={this.state.checkin_date} onChange={this.ChangeDate} />
                                        </div>
                                        <div className="time-checkout">
                                            <p>Trả phòng</p>
                                            <input name="checkout_date" type="date" value={this.state.checkout_date} onChange={this.ChangeDate} />
                                        </div>
                                        <div className="type-room">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span className="col-md-10">{type_room[this.state.type_room]}</span><span className="caret"></span>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    {
                                                        this.state.listTypeRoom.map((item, index) =>
                                                            <li key={index}><p onClick={this.ChangeTypeRoom.bind(this, item)} >{type_room[item]}</p></li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-12 btn-check-room-available" onClick={this.CheckRoomAvailable}>Kiểm tra tình trạng còn phòng</div>
                                        <div id="Noti-room-available" className="col-md-12"></div>
                                        <div id="btn-booking-room" className="col-md-12"><Link to={"/rooms/book?hostID=" + this.state.id_host + "&type=" + this.state.type_room + "&check_in=" + this.state.checkin_date + "&check_out=" + this.state.checkout_date + "&price=" + this.state.price_room}>Đặt phòng</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-12">
                                <div className="col-md-12 title-room-detail">Chính sách đặt phòng và hủy phòng</div>
                                <div className="col-md-12">
                                    <p>- Bạn cần xem kỹ các thông tin trước khi xác nhận đặt phòng.</p>
                                    <p>- Khi xác nhận đặt phòng bạn sẽ chọn một trong ba phương thức thanh toán VNPay hoặc Paypal hoặc chuyển khoản ngân hàng để đặt cọc và hoàn tất việc thanh toán.</p>
                                    <p>- Sau khi đặt phòng bạn nên theo dõi lịch sử để theo dõi lịch đặt đã được xác nhận hay chưa.</p>
                                    <p>- Trong trường hợp bạn hủy phòng thì tiền cọc sẽ không được hoàn lại. Mọi ngoại lệ bạn nên liên lạc trực tiếp với chủ khách sạn.</p>
                                    <p>- Khi bạn chọn phương thức VNPAY hoặc PAYPAL để thanh toán bạn sẽ được xác nhận đặt phòng ngay lập tức.</p>
                                    <p>- Khi bạn chọn phương thức CHUYỂN KHOẢN NGÂN HÀNG để thanh toán bạn sẽ phải đợi 15 - 30 phút để xác nhận.</p>
                                </div>
                            </div>
                        </div>
                        <div id="map" className="col-md-12 map-in-detail-host">
                            <ShowAddressInMaps key={this.state.latitude} lat={this.state.latitude} long={this.state.longtitude} />
                        </div>
                    </div>
                    <div className={this.state.class_div_right}>
                        <Comment id_host={this.props.match.params.id} />
                    </div>
                </div>
                <div className={this.state.class_more_detail_image}>
                    <div className="hidden-detail-conv"><span className="glyphicon glyphicon glyphicon-remove-circle" onClick={this.hiddenMoreImage}></span></div>
                    <div className="col-md-6 col-md-offset-3">
                        {
                            this.state.litsImgRoom.map((img, index) =>
                                index % 6 === 0 ? (
                                    <div key={index} className="image-detail-1"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                ) : index % 6 === 1 ? (
                                    <div key={index} className="image-detail-2"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                ) : index % 6 === 2 ? (
                                    <div key={index} className="image-detail-3"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                ) : index % 6 === 3 ? (
                                    <div key={index} className="image-detail-4"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                ) : index % 6 === 4 ? (
                                    <div key={index} className="image-detail-5"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                ) : (
                                    <div key={index} className="image-detail-6"><img src={config.ServerURL + "/" + img} alt="Room-IMG" /></div>
                                )
                            )
                        }
                    </div>
                </div>
                <div className="btn-show-comment" onClick={this.ShowORHideCmt}></div>
                <div><Chatbox /></div>
            </div>
        )
    }
}
