import React, { Component } from 'react';
import Header from '../component/Header';
import userAPI from '../api/userAPI';
import profile from '../icons/icon-my-profile.png';
import history from '../icons/icon-transaction-history.png';
import iconawait from '../icons/icon-transaction-await.png';
import logout from '../icons/sigout-icon.png';
import GoogleMaps from '../component/GoogleMaps';
import Comment from '../component/Comment';
import Footer from '../component/Footer';
import hotel from '../icons/icon-hotel.png';
import { Link, Redirect } from 'react-router-dom';

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
            id_div_comment: -1,
        }
        this.ChangeTab = this.ChangeTab.bind(this);
        this.UpdateInfo = this.UpdateInfo.bind(this);
        this.CancelUpdate = this.CancelUpdate.bind(this);
        this.Search = this.Search.bind(this);
        this.visibleNotiCancel = this.visibleNotiCancel.bind(this);
        this.hiddenNotiCancel = this.hiddenNotiCancel.bind(this);
        this.CancelBooking = this.CancelBooking.bind(this);
        this.Logout = this.Logout.bind(this);
        this.ShowMoreDetail = this.ShowMoreDetail.bind(this);
        this.HideMoreDetail = this.HideMoreDetail.bind(this);
    }

    componentDidMount() {
        let params = new FormData();
        params.append("id_member", localStorage.getItem("iduser"));
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
            document.getElementById("fullnameNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng h??? v?? t??n.";
            ok = false;
        }
        else {
            document.getElementById("fullnameNoti").innerHTML = "";
        }
        if (account === '') {
            document.getElementById("accountNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng t??n ????ng nh???p.";
            ok = false;
        }
        else {
            document.getElementById("accountNoti").innerHTML = "";
        }
        if (password.length < 8 && password !== "") {
            document.getElementById("passwordNoti").innerHTML = "(*)M???t kh???u ph???i l???n h??n 8 k?? t???.";
            ok = false;
        }
        else {
            document.getElementById("passwordNoti").innerHTML = "";
        }
        if (password !== confirm) {
            document.getElementById("confirmpasswordNoti").innerHTML = "(*)M???t kh???u x??c nh???n kh??ng ????ng.";
            ok = false;
        }
        else {
            document.getElementById("confirmpasswordNoti").innerHTML = "";
        }
        if (phone === '') {
            document.getElementById("phoneNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng s??? ??i???n tho???i.";
            ok = false;
        }
        else {
            document.getElementById("phoneNoti").innerHTML = "";
        }
        if (address === '') {
            document.getElementById("addressNoti").innerHTML = "(*)B???n kh??ng ???????c ????? tr???ng ?????a ch???.";
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
                        alert("C???p nh???t th??ng tin th??nh c??ng!");
                        this.componentDidMount();
                    }
                    else
                        alert("C???p nh???t th??ng tin th???t b???i!");
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
        document.getElementById("notification-cancel").innerHTML= "B???n h??y c??n nh???c k?? tr?????c khi h???y ph??ng. Ti???n c???c c?? th??? s??? kh??ng ???????c ho??n l???i. B???n v???n mu???n ti???p t???c?";
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
                    alert("B???n ???? h???y ph??ng th??nh c??ng");
                    this.componentDidMount();
                }
                else{
                    alert("H???y ph??ng th???t b???i");
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

    ShowMoreDetail = (e) => {
        e.preventDefault();
        if(this.state.id_div_comment !== -1)
            document.getElementById("comment" + this.state.id_div_comment).style.display = "none";
        document.getElementById("comment" + e.target.value).style.display = "block";
        this.setState({id_div_comment: e.target.value});
    }

    HideMoreDetail = () =>{
        document.getElementById("comment" + this.state.id_div_comment).style.display = "none";
        this.setState({id_div_comment: -1});
    }

    render() {
        var formatter = new Intl.NumberFormat();
        var keymap = Math.random();
        var type_room = ["", "Ph??ng ????n", "Ph??ng ????i", "Ph??ng t???p th???", "Ph??ng gia ????nh", "Mini house", "Homestay"]
        var classAccount = "col-md-12 list-control";
        var classAwait = "col-md-12 list-control";
        var classTransaction = "col-md-12 list-control";
        if (localStorage.getItem("iduser") === null){
            return <Redirect to="/" />
        }
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
                            <img src={profile} alt="icon" /> T??i kho???n c???a t??i
                        </div>
                        <div className={classAwait} onClick={this.ChangeTab.bind(this, 1)}>
                            <img src={iconawait} alt="icon" /> L???ch ?????t ph??ng
                        </div>
                        <div className={classTransaction} onClick={this.ChangeTab.bind(this, 2)}>
                            <img src={history} alt="icon" /> L???ch s??? ?????t ph??ng
                        </div>
                        <Link to="/"><div className="col-md-12 list-control" onClick={this.Logout}>
                            <img src={logout} alt="icon" /> ????ng xu???t
                        </div></Link>
                    </div>
                    <div className="col-md-9 member-info-right">
                        <div className="col-md-12 ">
                            {
                                this.state.tab_active === 0 ? (
                                    <div className="col-md-12 member-info-right-content">
                                        <label>H??? s?? c???a t??i</label>
                                        <p>Qu???n l?? th??ng tin h??? s?? ????? b???o m???t t??i kho???n</p>
                                        <div className="col-md-8 col-md-offset-2">
                                            <form id="member-info-form-update">
                                                <div className="row">
                                                    <span className="col-md-4">H??? v?? t??n</span>
                                                    <div className="col-md-8"><input id="fullname" defaultValue={this.state.info.fullname} className="form-control" /></div>
                                                    <i id="fullnameNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">T??n t??i kho???n</span>
                                                    <div className="col-md-8"><input id="account" defaultValue={this.state.info.username} readOnly className="form-control" /></div>
                                                    <i id="accountNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">M???t kh???u</span>
                                                    <div className="col-md-8"><input id="password" type="password" placeholder="Nh???p m???t kh???u n???u b???n mu???n thay ?????i. (8-12 k?? t???)" className="form-control" /></div>
                                                    <i id="passwordNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">X??c nh???n m???t kh???u</span>
                                                    <div className="col-md-8"><input id="confirmpassword" type="password" placeholder="Nh???p l???i m???t kh???u m???t l???n n???a." className="form-control" /></div>
                                                    <i id="confirmpasswordNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">S??? ??i???n tho???i (+84)</span>
                                                    <div className="col-md-8"><input type="number" id="phone" defaultValue={this.state.info.phone} className="form-control" /></div>
                                                    <i id="phoneNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <span className="col-md-4">?????a ch???</span>
                                                    <GoogleMaps key={keymap} address={this.state.info.address} lat={this.state.info.latitude} long={this.state.info.longtitude} />
                                                    <i id="addressNoti" className="notification col-md-8 col-md-offset-4"></i>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4 col-md-offset-8">
                                                        <span className="member-info-btn-update col-md-7" onClick={this.UpdateInfo}>C???p nh???t</span>
                                                        <span className="member-info-btn-cancel col-md-4 col-md-offset-1" onClick={this.CancelUpdate}>H???y</span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : this.state.tab_active === 1 ? (
                                    this.state.booking.length === 0 ? (
                                        <div className="member-info-right-content noti-empty-booking-schedule">
                                            <p>B???n ch??a c?? giao d???ch n??o c???</p>
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
                                                            CH??? X??C NH???N
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 bottom">
                                                        <div className="row">
                                                            <div className="col-md-7">T??n ph??ng: {book.name_room}</div>
                                                            <div className="col-md-5">Lo???i ph??ng: {type_room[book.type_room]}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Ng??y nh???n ph??ng: {book.checkin_date}</div>
                                                            <div className="col-md-5">Ng??y tr??? ph??ng: {book.checkout_date}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7"></div>
                                                            <div className="col-md-5">Gi?? m???i ????m: {formatter.format(book.price_room)} X ({book.night})</div>
                                                        </div>
                                                        <div className="col-md-2 cancel-booking" onClick={this.visibleNotiCancel.bind(this, book.id_booking)}>H???y ?????t ph??ng</div>
                                                        <div className="col-md-4 col-md-offset-6 total-payment">???? ?????t c???c {formatter.format(book.deposit)} (VND)</div>
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
                                                                    ???? X??C NH???N
                                                                </div>
                                                            ) : (
                                                                <div className="col-md-2 state-transaction">
                                                                    ???? NH???N PH??NG
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="col-md-12 bottom">
                                                        <div className="row">
                                                            <div className="col-md-7">T??n ph??ng: {book.name_room}</div>
                                                            <div className="col-md-5">Lo???i ph??ng: {type_room[book.type_room]}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Ng??y nh???n ph??ng: {book.checkin_date}</div>
                                                            <div className="col-md-5">Ng??y tr??? ph??ng: {book.checkout_date}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">Code check-in: {book.code}</div>
                                                            <div className="col-md-5">Gi?? m???i ????m: {formatter.format(book.price_room)} X ({book.night})</div>
                                                        </div>
                                                        <div className="col-md-4 col-md-offset-8 total-payment">???? ?????t c???c {formatter.format(book.deposit)} (VND)</div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )
                                ) : (
                                    this.state.transaction.length === 0 ? (
                                        <div className="member-info-right-content noti-empty-booking-schedule">
                                            <p>B???n ch??a c?? giao d???ch n??o c???</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="col-md-12 search-transaction input-group">
                                                <span className="input-group-addon" id="sizing-addon2"><span className="glyphicon glyphicon-zoom-in"></span></span>
                                                <input onChange={this.Search} placeholder="T??m ki???m theo t??n kh??ch s???n" aria-describedby="sizing-addon2"></input>
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
                                                                {
                                                                    trans.state === "DATHANHTOAN" ? (
                                                                        <div>???? THANH TO??N</div>
                                                                    ) : (
                                                                        <div>???? H???Y</div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 bottom">
                                                            <div className="row">
                                                                <div className="col-md-7">T??n ph??ng: {trans.name_room}</div>
                                                                <div className="col-md-5">Lo???i ph??ng: {type_room[trans.type_room]}</div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-7">Ng??y nh???n ph??ng: {trans.checkin_date}</div>
                                                                <div className="col-md-5">Ng??y tr??? ph??ng: {trans.checkout_date}</div>
                                                            </div>
                                                            <div className="col-md-8"><button className="button" value={trans.id_host} onClick={this.ShowMoreDetail}>Th??m nh???n x??t & ????nh gi??</button></div>
                                                            <div className="col-md-4 total-payment">T???ng s??? ti???n {formatter.format(trans.total_payment)} (VND)</div>
                                                        </div>
                                                        <div className="col-md-12 home-more-detail-none" id={"comment" + trans.id_host}>
                                                            <div className="col-md-1 col-md-offset-11"><span onClick={this.HideMoreDetail} className="glyphicon glyphicon-remove"></span></div>
                                                            <Comment id_host={trans.id_host} />
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
                        <button className="btn btn-danger" onClick={this.CancelBooking}>X??c nh???n h???y ph??ng</button>
                        <button className="btn btn-primary" onClick={this.hiddenNotiCancel}>Suy ngh?? l???i</button>
                    </div>
                </div>
            </div>
        )
    }
}
