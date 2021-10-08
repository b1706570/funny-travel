import React, { Component } from 'react';
import Header from '../component/Header';
import userAPI from '../api/userAPI';
import profile from '../icons/icon-my-profile.png';
import history from '../icons/icon-transaction-history.png';
import iconawait from '../icons/icon-transaction-await.png';
import logout from '../icons/sigout-icon.png';
import GoogleMaps from '../component/GoogleMaps';
import Footer from '../component/Footer';
import hotel from '../icons/icon-hotel.png';
import { Link } from 'react-router-dom';

export default class MemberInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            transaction: [],
            booking: [],
            tab_active: 0,
            search: "",
            class_noti_cancel: "noti-cancel-booking-hidden",
            id_booking_cancel: "",
        }
        this.ChangeTab = this.ChangeTab.bind(this);
        this.UpdateInfo = this.UpdateInfo.bind(this);
        this.CancelUpdate = this.CancelUpdate.bind(this);
        this.Search = this.Search.bind(this);
        this.visibleNotiCancel = this.visibleNotiCancel.bind(this);
        this.hiddenNotiCancel = this.hiddenNotiCancel.bind(this);
        this.CancelBooking = this.CancelBooking.bind(this);
        this.Logout = this.Logout.bind(this);
    }

    componentDidMount() {
        let params = new FormData();
        params.append("id_member", localStorage.getItem("iduser"));
        console.log(localStorage.getItem("iduser"));
        const api = new userAPI();
        api.getInfoUserByID(params)
            .then(response => {
                var book = response['booking'];
                for (let i = 0; i < book.length; i++) {
                    let checkin = new Date(book[i].checkin_date);
                    let checkout = new Date(book[i].checkout_date);
                    book[i]['night'] = Math.floor((checkout - checkin) / 86400000) + 1;
                }
                this.setState({
                    info: response['info'],
                    transaction: response['transaction'],
                    booking: book,
                    class_noti_cancel: "noti-cancel-booking-hidden",
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeTab = (tab) => {
        this.setState({ tab_active: tab });
    }

    UpdateInfo = () => {
        var fullname = document.getElementById("fullname").value;
        var account = document.getElementById("account").value;
        var password = document.getElementById("password").value;
        var confirm = document.getElementById("confirmpassword").value;
        var phone = document.getElementById("phone").value;
        var address = document.getElementById("address").value;
        var ok = true;
        if (fullname === '') {
            document.getElementById("fullnameNoti").innerHTML = "(*)Bạn không được để trống họ và tên.";
            ok = false;
        }
        else {
            document.getElementById("fullnameNoti").innerHTML = "";
        }
        if (account === '') {
            document.getElementById("accountNoti").innerHTML = "(*)Bạn không được để trống tên đăng nhập.";
            ok = false;
        }
        else {
            document.getElementById("accountNoti").innerHTML = "";
        }
        if (password.length < 8 && password !== "") {
            document.getElementById("passwordNoti").innerHTML = "(*)Mật khẩu phải lớn hơn 8 kí tự.";
            ok = false;
        }
        else {
            document.getElementById("passwordNoti").innerHTML = "";
        }
        if (password !== confirm) {
            document.getElementById("confirmpasswordNoti").innerHTML = "(*)Mật khẩu xác nhận không đúng.";
            ok = false;
        }
        else {
            document.getElementById("confirmpasswordNoti").innerHTML = "";
        }
        if (phone === '') {
            document.getElementById("phoneNoti").innerHTML = "(*)Bạn không được để trống số điện thoại.";
            ok = false;
        }
        else {
            document.getElementById("phoneNoti").innerHTML = "";
        }
        if (address === '') {
            document.getElementById("addressNoti").innerHTML = "(*)Bạn không được để trống địa chỉ.";
            ok = false;
        }
        else {
            document.getElementById("addressNoti").innerHTML = "";
        }
        if (ok === true) {
            let params = new FormData();
            params.append("id_member", localStorage.getItem("iduser"));
            params.append("fullname", fullname);
            params.append("account", account);
            if (password !== "")
                params.append("password", password);
            params.append("phone", phone);
            params.append("address", address);
            params.append("latitude", document.getElementById("latitude").value);
            params.append("longtitude", document.getElementById("longtitude").value);
            const api = new userAPI();
            api.updateInfoByID(params)
                .then(response => {
                    if (response === 200) {
                        alert("Cập nhật thông tin thành công!");
                        this.componentDidMount();
                    }
                    else
                        alert("Cập nhật thông tin thất bại!");
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    Search = (e) => {
        var keyword = e.target.value;
        this.setState({ search: keyword });
    }

    CancelUpdate = () => {
        document.getElementById("member-info-form-update").reset();
        document.getElementById("fullnameNoti").innerHTML = "";
        document.getElementById("accountNoti").innerHTML = "";
        document.getElementById("passwordNoti").innerHTML = "";
        document.getElementById("confirmpasswordNoti").innerHTML = "";
        document.getElementById("phoneNoti").innerHTML = "";
        document.getElementById("addressNoti").innerHTML = "";
    }

    visibleNotiCancel = (id) =>{
        this.setState({
            class_noti_cancel: "noti-cancel-booking-visible",
            id_booking_cancel: id,
        })
        document.getElementById("notification-cancel").innerHTML= "Bạn hãy cân nhắc kĩ trước khi hủy phòng. Tiền cọc có thể sẽ không được hoàn lại. Bạn vẫn muốn tiếp tục?";
        document.body.style.overflow = "hidden";
    }

    hiddenNotiCancel = (e) =>{
        e.preventDefault();
        this.setState({ class_noti_cancel: "noti-cancel-booking-hidden" });
        document.body.style.overflow= "visible";
    }

    CancelBooking = (e) =>{
        e.preventDefault();
        let params = new FormData();
        params.append("id_booking", this.state.id_booking_cancel);
        params.append("type", "cancel");
        const api = new userAPI();
        api.cancelBooking(params)
            .then(response =>{
                if(response === 200){
                    alert("Bạn đã hủy phòng thành công");
                    this.componentDidMount();
                }
                else{
                    alert("Hủy phòng thất bại");
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    Logout = () =>{
        localStorage.removeItem("iduser");
        localStorage.removeItem("username");
        localStorage.removeItem("type");
    }

    render() {
        var formatter = new Intl.NumberFormat();
        var keymap = Math.random();
        var type_room = ["", "Phòng đơn", "Phòng đôi", "Phòng tập thể", "Phòng gia đình", "Mini house", "Homestay"]
        var classAccount = "col-md-12 list-control";
        var classAwait = "col-md-12 list-control";
        var classTransaction = "col-md-12 list-control";
        if (this.state.tab_active === 0)
            classAccount += " tab-active";
        else if (this.state.tab_active === 1)
            classAwait += " tab-active";
        else
            classTransaction += " tab-active";
        return (
            <div>
                <div className="col-md-12 header-home"><Header /></div>
                <div className="col-md-10 col-md-offset-1">
                    <div className="col-md-3 member-info-left">
                        <div className={classAccount} onClick={this.ChangeTab.bind(this, 0)}>
                            <img src={profile} alt="icon" /> Tài khoản của tôi
                        </div>
                        <div className={classAwait} onClick={this.ChangeTab.bind(this, 1)}>
                            <img src={iconawait} alt="icon" /> Lịch đặt phòng
                        </div>
                        <div className={classTransaction} onClick={this.ChangeTab.bind(this, 2)}>
                            <img src={history} alt="icon" /> Lịch sử đặt phòng
                        </div>
                        <Link to="/"><div className="col-md-12 list-control" onClick={this.Logout}>
                            <img src={logout} alt="icon" /> Đăng xuất
                        </div></Link>
                    </div>
                    <div className="col-md-9 member-info-right">
                        <div className="col-md-12 ">
                            {
                                this.state.tab_active === 0 ? (
                                    <div className="col-md-12 member-info-right-content">
                                        <label>Hồ sơ của tôi</label>
                                        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                                        <div className="col-md-8 col-md-offset-2">
                                            <form id="member-info-form-update">
                                                <div className="row">
                                                    <span className="col-md-4">Họ và tên</span>
                                                    <div className="col-md-8"><input id="fullname" defaultValue={this.state.info.fullname} className="form-control" /></div>
                                                    <i id="fullnameNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">Tên tài khoản</span>
                                                    <div className="col-md-8"><input id="account" defaultValue={this.state.info.username} readOnly className="form-control" /></div>
                                                    <i id="accountNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">Mật khẩu</span>
                                                    <div className="col-md-8"><input id="password" type="password" placeholder="Nhập mật khẩu nếu bạn muốn thay đổi. (8-12 kí tự)" className="form-control" /></div>
                                                    <i id="passwordNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">Xác nhận mật khẩu</span>
                                                    <div className="col-md-8"><input id="confirmpassword" type="password" placeholder="Nhập lại mật khẩu một lần nữa." className="form-control" /></div>
                                                    <i id="confirmpasswordNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">Số điện thoại (+84)</span>
                                                    <div className="col-md-8"><input type="number" id="phone" defaultValue={this.state.info.phone} className="form-control" /></div>
                                                    <i id="phoneNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">Địa chỉ</span>
                                                    <GoogleMaps key={keymap} address={this.state.info.address} lat={this.state.info.latitude} long={this.state.info.longtitude} />
                                                    <i id="addressNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4 col-md-offset-8">
                                                        <span className="member-info-btn-update col-md-7" onClick={this.UpdateInfo}>Cập nhật</span>
                                                        <span className="member-info-btn-cancel col-md-4 col-md-offset-1" onClick={this.CancelUpdate}>Hủy</span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : this.state.tab_active === 1 ? (
                                    this.state.booking.length === 0 ? (
                                        <div className="member-info-right-content noti-empty-booking-schedule">
                                            <p>Bạn chưa có giao dịch nào cả</p>
                                        </div>
                                    ) : (
                                        this.state.booking.map((book, index) =>
                                            book.state === "CHOXACNHAN" ? (
                                                <div className="col-md-12 member-info-right-content" key={index} >
                                                    <div className="col-md-12 top">
                                                        <div className="col-md-10">
                                                            <div className="col-md-1">
                                                                <img src={hotel} alt="icon-hotel" />
                                                            </div>
                                                            <Link to={"/rooms/" + book.id_host + "?check_in=&check_out="} target="_blank">
                                                                <div className="col-md-11">
                                                                    <div>{book.company_name}</div>
                                                                    <div className="host-address">{book.address_host}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-md-2 state-transaction-yellow">
                                                            {book.state}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 bottom">
                                                        <div className="row">
                                                            <div className="col-md-7">Tên phòng: {book.name_room}</div>
                                                            <div className="col-md-5">Loại phòng: {type_room[book.type_room]}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Ngày nhận phòng: {book.checkin_date}</div>
                                                            <div className="col-md-5">Ngày trả phòng: {book.checkout_date}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7"></div>
                                                            <div className="col-md-5">Giá mỗi đêm: {formatter.format(book.price_room)} X ({book.night})</div>
                                                        </div>
                                                        <div className="col-md-2 cancel-booking" onClick={this.visibleNotiCancel.bind(this, book.id_booking)}>Hủy đặt phòng</div>
                                                        <div className="col-md-4 col-md-offset-6 total-payment">Đã đặt cọc {formatter.format(book.deposit)} (VND)</div>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className="col-md-12 member-info-right-content" key={index} >
                                                    <div className="col-md-12 top">
                                                        <div className="col-md-10">
                                                            <div className="col-md-1">
                                                                <img src={hotel} alt="icon-hotel" />
                                                            </div>
                                                            <Link to={"/rooms/" + book.id_host + "?check_in=&check_out="} target="_blank">
                                                                <div className="col-md-11">
                                                                    <div>{book.company_name}</div>
                                                                    <div className="host-address">{book.address_host}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        {
                                                            book.state === "DAXACNHAN" ? (
                                                                <div className="col-md-2 state-transaction-green">
                                                                    {book.state}
                                                                </div>
                                                            ) : (
                                                                <div className="col-md-2 state-transaction">
                                                                    {book.state}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="col-md-12 bottom">
                                                        <div className="row">
                                                            <div className="col-md-7">Tên phòng: {book.name_room}</div>
                                                            <div className="col-md-5">Loại phòng: {type_room[book.type_room]}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Ngày nhận phòng: {book.checkin_date}</div>
                                                            <div className="col-md-5">Ngày trả phòng: {book.checkout_date}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Code check-in: {book.code}</div>
                                                            <div className="col-md-5">Giá mỗi đêm: {formatter.format(book.price_room)} X ({book.night})</div>
                                                        </div>
                                                        <div className="col-md-4 col-md-offset-8 total-payment">Đã đặt cọc {formatter.format(book.deposit)} (VND)</div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )
                                ) : (
                                    this.state.transaction.length === 0 ? (
                                        <div className="member-info-right-content noti-empty-booking-schedule">
                                            <p>Bạn chưa có giao dịch nào cả</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="col-md-12 search-transaction input-group">
                                                <span className="input-group-addon" id="sizing-addon2"><span className="glyphicon glyphicon-zoom-in"></span></span>
                                                <input onChange={this.Search} placeholder="Tìm kiếm theo tên khách sạn" aria-describedby="sizing-addon2"></input>
                                            </div>
                                            {
                                                this.state.transaction.map((trans, index) =>
                                                    <div className="col-md-12 member-info-right-content" key={index} >
                                                        <div className="col-md-12 top">
                                                            <div className="col-md-10">
                                                                <div className="col-md-1">
                                                                    <img src={hotel} alt="icon-hotel" />
                                                                </div>
                                                                <Link to={"/rooms/" + trans.id_host + "?check_in=&check_out="} target="_blank"><div className="col-md-11">
                                                                    <div>
                                                                        {
                                                                            trans.company_name.split(" ").map(word => {
                                                                                if (this.state.search.toLowerCase().indexOf(word.toLowerCase()) !== -1)
                                                                                    return <span key={word} className="yellow-word">{word} </span>
                                                                                return <span key={word}>{word} </span>
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div className="host-address">{trans.address_host}</div>
                                                                </div>
                                                                </Link>
                                                            </div>
                                                            <div className="col-md-2 state-transaction">
                                                                {trans.state}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 bottom">
                                                            <div className="row">
                                                                <div className="col-md-7">Tên phòng: {trans.name_room}</div>
                                                                <div className="col-md-5">Loại phòng: {type_room[trans.type_room]}</div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-7">Ngày nhận phòng: {trans.checkin_date}</div>
                                                                <div className="col-md-5">Ngày trả phòng: {trans.checkout_date}</div>
                                                            </div>
                                                            <div className="col-md-4 col-md-offset-8 total-payment">Tổng số tiền {formatter.format(trans.total_payment)} (VND)</div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-12"><Footer /></div>
                <div className={this.state.class_noti_cancel + " col-md-12"}>
                    <div>
                        <p id="notification-cancel"></p>
                        <button className="btn btn-danger" onClick={this.CancelBooking}>Xác nhận hủy phòng</button>
                        <button className="btn btn-primary" onClick={this.hiddenNotiCancel}>Suy nghĩ lại</button>
                    </div>
                </div>
            </div>
        )
    }
}
