import React, { Component } from 'react';
import queryString from 'query-string';
import publicAPI from '../api/publicAPI';
import Footer from '../component/Footer';
import logo from '../img/logo.png';
import { setCacheNameDetails } from 'workbox-core';

export default class RoomBooking extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkin: "--/--/--",
            checkout: "--/--/--",
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
        if(search.check_in !== "" && search.check_out !== ""){
            var date_start = Date.parse(search.check_in);
            var date_end = Date.parse(search.check_out);
            this.setState({ 
                checkin: search.check_in,
                checkout: search.check_out,
            });
        }
    }

    render() {
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
                            <p>{this.state.checkin}</p>
                        </div>
                        <div className="col-md-12">
                            <p className="title-bold">Ngày Trả phòng</p>
                            <p>{this.state.checkout}</p>
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
                            <label>Chi tiết giá</label>
                        </div>
                        <div className="col-md-12">
                            <p></p>
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
