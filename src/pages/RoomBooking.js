import React, { Component } from 'react';
import queryString from 'query-string';
import publicAPI from '../api/publicAPI';
import Footer from '../component/Footer';
import logo from '../img/logo.png';

export default class RoomBooking extends Component {
    constructor(props){
        super(props);
        this.state = {
            host_id: "",
            host_name: "",
            host_address: "",
            checkin_date: "",
            checkout_date: "",
            room_id: "",
            room_price: "",
            room_name: "",
            room_type: "",
            room_capacity: "",
            member_id: "",
            number_night: 0,
        }
        this.DateChange = this.DateChange.bind(this);
    }

    componentDidMount(){
        let search = queryString.parse(this.props.location.search);
        let params = new FormData();
        params.append("id_room", search.roomID);
        const api = new publicAPI();
        api.getRoomByID(params)
            .then(response =>{
                this.setState({
                    checkin_date: search.check_in,
                    checkout_date: search.check_out,
                    host_id: search.hostID,
                    room_id: search.roomID,
                    room_price: response[0].price_room,
                    room_name: response[0].name_room,
                    room_type: response[0].type_room,
                    room_capacity: response[0].capacity_room,
                    member_id: localStorage.getItem("iduser"),
                })
            })
            .catch(error =>{
                console.log(error);
            })
        
        let params1 = new FormData();
        params1.append("id", search.hostID);
        api.gethostbyID(params1)
            .then(response =>{
                this.setState({
                    host_name: response.company_name,
                    host_address: response.address_host,
                })
            })
            .catch(error =>{
                console.log(error);
            })

        if(search.check_in !== "" && search.check_out !== ""){
            var date_start = Date.parse(search.check_in);
            var date_end = Date.parse(search.check_out);
            this.setState({ 
                number_night: (date_end - date_start) / 86400000
            });
        }
    }

    DateChange = (e) =>{
        if(e.target.name === "checkin_date"){
            this.props.history.push("/rooms/book?roomID=" + this.state.room_id + "&hostID=" + this.state.host_id + "&check_in=" + e.target.value + "&check_out=" + this.state.checkout_date)
        }
        if(e.target.name === "checkout_date"){
            this.props.history.push("/rooms/book?roomID=" + this.state.room_id + "&hostID=" + this.state.host_id + "&check_in=" + this.state.checkin_date + "&check_out=" + e.target.value)
        }
        window.location.reload();
    }

    render() {
        var priceFormat = new Intl.NumberFormat();
        return (
            <div>
                <div className="col-md-12 header-book-room">
                    <img src={logo} alt="logo-web" />
                </div>
                <div className="col-md-8 col-md-offset-2 body-book-room">
                    <div className="book-room-div-left">
                        <div className="col-md-12">
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <label className="title-large">Xác nhận đặt phòng và thanh toán</label>
                        </div>
                        <div className="col-md-12">
                            <label>Thông tin chuyến đi</label>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Ngày nhận phòng</p>
                            <p><input type="date" name="checkin_date" value={this.state.checkin_date} onChange={this.DateChange} /></p>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Ngày trả phòng</p>
                            <p><input type="date" name="checkout_date" value={this.state.checkout_date} onChange={this.DateChange} /></p>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Tên phòng</p>
                            <p>{this.state.room_name}</p>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Loại phòng</p>
                            <p>{this.state.room_type}</p>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Số lượng người</p>
                            <p>{this.state.room_capacity}</p>
                        </div>
                        <div className="col-md-12">
                            <label>Chính sách đặt phòng và hủy phòng</label>
                        </div>
                        <div className="col-md-12">
                            <p>Bạn cần xem kỹ các thông tin trước khi xác nhận đặt phòng.</p>
                            <p>Khi xác nhận đặt phòng bạn sẽ chọn 1 trong 2 phương thức thanh toán MoMo hoặc Paypal để đặt cọc và hoàn tất việc thanh toán.</p>
                            <p>Sau khi đặt phòng bạn nên theo dõi lịch sử để theo dõi lịch đặt đã được xác nhận hay chưa.</p>
                            <p>Trong trường hợp bạn hủy phòng thì tiền cọc sẽ không được hoàn lại. Mọi ngoại lệ bạn nên liên lạc trực tiếp với chủ khách sạn.</p>
                        </div>
                    </div>
                    <div className="book-room-div-right">
                        <div className="col-md-12">
                            <p className="name-host">{this.state.host_name} - Phòng {this.state.room_name}</p>
                            <div>{this.state.host_address}</div>
                            <div>Số lượng: {this.state.room_capacity} người</div>
                            <div>Thời gian: {this.state.checkin_date} * {this.state.checkout_date}</div>
                            <div>({this.state.number_night} đêm)</div>
                        </div>
                        <div className="col-md-12">
                            <label>Chi tiết giá</label>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-7">{priceFormat.format(this.state.room_price)} X {this.state.number_night} đêm</div>
                            <div className="col-md-5">{priceFormat.format(this.state.room_price * this.state.number_night)} (VND)</div>
                            <p className="col-md-7">Tổng cộng:</p>
                            <p className="col-md-5">{priceFormat.format(this.state.room_price * this.state.number_night)} (VND)</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <Footer />
                </div>
            </div>
        )
    }
}
