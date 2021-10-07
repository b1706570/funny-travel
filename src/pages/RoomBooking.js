import React, { Component } from 'react';
import queryString from 'query-string';
import publicAPI from '../api/publicAPI';
import Paypal from '../component/Paypal';
import Footer from '../component/Footer';
import logo from '../img/logo.png';
import { Link, Redirect } from 'react-router-dom';

export default class RoomBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            host_id: "",
            host_name: "",
            host_address: "",
            checkin_date: "",
            checkout_date: "",
            room_id: "",
            room_price: 0,
            price_USD: 0,
            room_name: "",
            room_type: "",
            room_capacity: "",
            host_paypal_id: "",
            host_number_bank: "",
            host_branch_name: "",
            host_owner_account: "",
            member_id: "",
            number_night: 0,
            available: true,
            class_noti_payment: "noti-payment-hidden",
            class_payment_way: "payment-way-hidden",
            paypal: true,
            direct: '',
        }

        this.CheckRoomAvailable = this.CheckRoomAvailable.bind(this);
        this.DateChange = this.DateChange.bind(this);
        this.RoomNotAvailableNoti = this.RoomNotAvailableNoti.bind(this);
        this.ChoosePaymentWay = this.ChoosePaymentWay.bind(this);
        this.HiddenNoti = this.HiddenNoti.bind(this);
        this.ChangePaymentWay = this.ChangePaymentWay.bind(this);
        this.PaymentSuccess = this.PaymentSuccess.bind(this);
        this.PaymentWithoutPaypal = this.PaymentWithoutPaypal.bind(this);
        this.PaymentError = this.PaymentError.bind(this);
    }


    componentDidMount() {
        let search = queryString.parse(this.props.location.search);
        var date_start = Date.parse(search.check_in);
        var date_end = Date.parse(search.check_out);
        const api = new publicAPI();
        let params1 = new FormData();
        params1.append("id", search.hostID);
        api.gethostbyID(params1)
            .then(response => {
                this.setState({
                    checkin_date: search.check_in,
                    checkout_date: search.check_out,
                    host_id: search.hostID,
                    room_price: search.price,
                    price_USD: search.price / 22400,
                    room_type: search.type,
                    room_capacity: search.type * 2,
                    number_night: (date_end - date_start) / 86400000,
                    host_name: response.company_name,
                    host_address: response.address_host,
                    host_paypal_id: response.paypal_id,
                    host_number_bank: response.bank_number,
                    host_branch_name: response.branch_name,
                    host_owner_account: response.owner_acount,
                })
            })
            .catch(error => {
                console.log(error);
            })

        this.CheckRoomAvailable();
    }

    CheckRoomAvailable = () =>{
        let search = queryString.parse(this.props.location.search);
        let params = new FormData();
        params.append("checkin_date", search.check_in);
        params.append("checkout_date", search.check_out);
        params.append("id_host", search.hostID);
        params.append("type_room", search.type);
        const api = new publicAPI();
        api.checkRoomAvailable(params)
            .then(response => {
                console.log(response);
                if (response.length === 0) {
                    this.setState({ available: false });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    DateChange = (e) => {
        if (e.target.name === "checkin_date") {
            this.props.history.push("/rooms/book?hostID=" + this.state.host_id + "&check_in=" + e.target.value + "&check_out=" + this.state.checkout_date + "&type=" + this.state.room_type + "&price=" + this.state.room_price);
        }
        if (e.target.name === "checkout_date") {
            this.props.history.push("/rooms/book?hostID=" + this.state.host_id + "&check_in=" + this.state.checkin_date + "&check_out=" + e.target.value +  "&type=" + this.state.room_type + "&price=" + this.state.room_price);
        }
        window.location.reload();
    }

    RoomNotAvailableNoti = (e) => {
        e.preventDefault();
        document.getElementById("notification-payment").innerHTML = "Phòng hiện không khả dụng. Vui lòng chọn thời gian khác hoặc phòng khác!";
        this.setState({
            class_noti_payment: "noti-payment-visible",
        })
    }

    ChoosePaymentWay = (e) =>{
        e.preventDefault();
        document.getElementById("notification-payment").innerHTML = "Vui lòng kiểm tra kĩ các thông tin về phòng trước khi chuyển khoản thanh toán!";
        this.setState({
            class_noti_payment: "noti-payment-visible",
            class_payment_way: "payment-way-visible",
        })
        document.body.style.overflow= "hidden";
    }

    HiddenNoti = () => {
        this.setState({ class_noti_payment: "noti-payment-hidden" });
        document.body.style.overflow= "visible";
    }

    ChangePaymentWay = (way) =>{
        if(way === "paypal"){
            this.setState({ paypal: true });
        }
        else{
            this.setState({ paypal: false });
        }
    }

    PaymentWithoutPaypal = () =>{
        let params = new FormData();
        params.append("paypal", 0);
        params.append("id_member", localStorage.getItem("iduser"));
        params.append("id_host", this.state.host_id);
        params.append("type_room", this.state.room_type);
        params.append("checkin", this.state.checkin_date);
        params.append("checkout", this.state.checkout_date);
        params.append("deposit", this.state.room_price * this.state.number_night * 0.1);
        const api = new publicAPI();
        api.BookingRoom(params)
            .then(response =>{
                if(response === 200){
                    alert("Đặt phòng thành công! Bạn có thể xem thông tin ở trang thông tin cá nhân.");
                    this.setState({ direct: "/member/personalinfomation" })
                }
                else{
                    alert("Đặt phòng thất bại vui lòng thử lại!");
                    this.componentDidMount();
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    PaymentSuccess = () =>{
        let code = Math.random() * (10 - 1) + 1;
        code = Math.floor(code * 10000000);
        let params = new FormData();
        params.append("paypal", 1);
        params.append("id_member", localStorage.getItem("iduser"));
        params.append("id_host", this.state.host_id);
        params.append("code", code);
        params.append("type_room", this.state.room_type);
        params.append("checkin", this.state.checkin_date);
        params.append("checkout", this.state.checkout_date);
        params.append("deposit", this.state.room_price * this.state.number_night * 0.1);
        const api = new publicAPI();
        api.BookingRoom(params)
            .then(response =>{
                if(response === 200){
                    alert("Đặt phòng thành công! Bạn có thể xem thông tin ở trang thông tin cá nhân.");
                    this.setState({ direct: "/member/personalinfomation" })
                }
                else{
                    alert("Đặt phòng thất bại vui lòng thử lại!");
                    this.componentDidMount();
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    PaymentError = () =>{
        alert("Thanh toán thất bại! Xin thử lại vào một thời điểm khác");
    }

    render() {
        if(this.state.direct !== "")
            return <Redirect to={this.state.direct} />
        var type_room = ["Chọn loại phòng", "Phòng đơn", "Phòng đôi", "Phòng tập thể", "Phòng gia đình", "Mini house", "Homestay"];
        var priceFormat = new Intl.NumberFormat();
        var deposit = parseFloat(this.state.price_USD * this.state.number_night * 0.1).toFixed(2);
        deposit = parseFloat(deposit);
        return (
            <div key={this.state.host_paypal_id}>
                <div className="col-md-12 header-book-room">
                    <img src={logo} alt="logo-web" />
                </div>
                <div className="col-md-8 col-md-offset-2 body-book-room">
                    <div className="book-room-div-left">
                        <div className="col-md-12">
                            <Link to={"/rooms/" + this.state.host_id + "?check_in=" + this.state.checkin_date  + "&check_out=" + this.state.checkout_date + "&type=" + this.state.room_type}><span className="glyphicon glyphicon-chevron-left"></span></Link>
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
                            <p className="title-bold">Loại phòng</p>
                            <p>{type_room[this.state.room_type]}</p>
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
                            <p>Khi bạn chọn phương thức PAYPAL để thanh toán bạn sẽ được xác nhận đặt phòng ngay lập tức</p>
                            <p>Khi bạn chọn phương thức CHUYỂN KHOẢN NGÂN HÀNG để thanh toán bạn sẽ phải đợi 15 - 30 phút để xác nhận</p>
                        </div>
                    </div>
                    <div className="book-room-div-right">
                        <div className="col-md-12">
                            <p className="name-host">{this.state.host_name}</p>
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
                            <p className="col-md-5 col-md-offset-7">~{priceFormat.format(this.state.price_USD * this.state.number_night)} (USD)</p>
                            <p className="col-md-7">Đặt cọc (10%):</p>
                            <p className="col-md-5">{priceFormat.format(this.state.room_price * this.state.number_night * 0.1)} (VND)</p>
                            <p className="col-md-5 col-md-offset-7">~{priceFormat.format(this.state.price_USD * this.state.number_night * 0.1)} (USD)</p>
                        </div>
                        <div className="col-md-12 paypal-btn">
                            {
                                this.state.available ? (
                                    <button className="payment-available-btn" onClick={this.ChoosePaymentWay}>ĐẶT PHÒNG</button>
                                ) : (
                                    <button className="payment-not-available-btn" onClick={this.RoomNotAvailableNoti}>ĐẶT PHÒNG</button>
                                )
                            }
                            <div className={this.state.class_payment_way}>
                                <label>Chọn phương thức thanh toán</label>
                                <span><input type="radio" name="optradio" onClick={this.ChangePaymentWay.bind(this, "paypal")} /> Thanh toán qua Paypal</span>
                                <span><input type="radio" name="optradio" onClick={this.ChangePaymentWay.bind(this, "bank")} /> Thanh toán qua chuyển khoản ngân hàng</span>
                                <div className="payment-way">
                                    {
                                        this.state.paypal ? (
                                            <Paypal client={this.state.host_paypal_id} total={deposit} success={this.PaymentSuccess} error={this.PaymentError}/>
                                        ) : (
                                            <div>
                                                <p><label>Số tài khoản:</label> {this.state.host_number_bank}</p>
                                                <p><label>Ngân hàng:</label> {this.state.host_branch_name}</p>
                                                <p><label>Chủ tài khoản:</label> {this.state.host_owner_account}</p>
                                                <p><label>Số tiền cần chuyển:</label> {priceFormat.format(this.state.room_price * this.state.number_night * 0.1)} (VND)</p>
                                                <button className="btn btn-warning" onClick={this.PaymentWithoutPaypal}>Xác nhận & Thanh toán</button>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <Footer />
                </div>
                <div className={this.state.class_noti_payment + " col-md-12"}>
                    <div>
                        <p id="notification-payment"></p>
                        <button className="btn btn-danger" onClick={this.HiddenNoti}>OK</button>
                    </div>
                </div>
            </div>
        )
    }
}
