import React, { Component } from 'react';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Chatbox from '../component/Chatbox';
import { Link, Redirect } from 'react-router-dom';
import publicAPI from '../api/publicAPI';
import ShowInfo from '../component/ShowInfo';
import NumberFormat from 'react-number-format';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHost: [],
            listConv: [],
            pagination: [],
            typeRoom: ['--Chọn loại phòng--', 'Phòng đơn', 'Phòng đôi', 'Phòng tập thể', 'Phòng gia đình', 'Mini House', 'HomeStay'],
            location: [
                "--Chọn vị trí--",
                "An Giang",
                "Vũng Tàu",
                "Bắc Giang",
                "Bắc Kạn",
                "Bạc Liêu",
                "Bắc Ninh",
                "Bến Tre",
                "Bình Định",
                "Bình Dương",
                "Bình Phước",
                "Bình Thuận",
                "Bình Thuận",
                "Cà Mau",
                "Cao Bằng",
                "Đắk Lắk",
                "Đắk Nông",
                "Điện Biên",
                "Đồng Nai",
                "Đồng Tháp",
                "Gia Lai",
                "Hà Giang",
                "Hà Nam",
                "Hà Tĩnh",
                "Hải Dương",
                "Hậu Giang",
                "Hòa Bình",
                "Hưng Yên",
                "Khánh Hòa",
                "Kiên Giang",
                "Kon Tum",
                "Lai Châu",
                "Lâm Đồng",
                "Lạng Sơn",
                "Lào Cai",
                "Long An",
                "Nam Định",
                "Nghệ An",
                "Ninh Bình",
                "Ninh Thuận",
                "Phú Thọ",
                "Quảng Bình",
                "Quảng Bình",
                "Quảng Ngãi",
                "Quảng Ninh",
                "Quảng Trị",
                "Sóc Trăng",
                "Sơn La",
                "Tây Ninh",
                "Thái Bình",
                "Thái Nguyên",
                "Thanh Hóa",
                "Thừa Thiên Huế",
                "Tiền Giang",
                "Trà Vinh",
                "Tuyên Quang",
                "Vĩnh Long",
                "Vĩnh Phúc",
                "Yên Bái",
                "Phú Yên",
                "Cần Thơ",
                "Đà Nẵng",
                "Hải Phòng",
                "Hà Nội",
                "Sài Gòn"
            ],
            currentPage: 1,
            min_price: 0,
            max_price: 10,
            price_of_condition: "",
            checkin_of_condition: "",
            checkout_of_condition: "",
            typeroom_of_condition: 0,
            city_of_condition: "",
            orderby: 0,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getPageItems = this.getPageItems.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.getAllConvenients = this.getAllConvenients.bind(this);
        this.getMinMaxPrice = this.getMinMaxPrice.bind(this);
        this.changePage = this.changePage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.OrderBy = this.OrderBy.bind(this);
    }

    componentDidMount() {
        this.getPageItems(1, this.state.orderby);
        this.getAllConvenients();
        this.getMinMaxPrice();
    }

    getMinMaxPrice() {
        const api = new publicAPI()
        api.getMinMaxPrice()
            .then(response => {
                this.setState({
                    max_price: response.max,
                    min_price: response.min,
                    price_of_condition: response.max,
                })
            })
            .catch(error => {
                console.log(error);
            })
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

    createPagination = (number) => {
        let num_pagi;
        if (number % 25 === 0) {
            num_pagi = number / 25;
        }
        else num_pagi = number / 25 + 1;
        let arr = [];
        for (let i = 1; i <= num_pagi; i++) {
            arr.push(i);
        }
        this.setState({
            pagination: arr,
        });
    }

    getPageItems(index, order) {
        let params = new FormData();
        params.append("start", index);
        params.append("order", order);
        if (this.state.price_of_condition !== "")
            params.append("price", this.state.price_of_condition);
        if (Number(this.state.typeroom_of_condition) !== 0)
            params.append("type_room", this.state.typeroom_of_condition);
        if (this.state.city_of_condition !== "--Chọn vị trí--")
            params.append("location", this.state.city_of_condition);
        if (this.state.checkin_of_condition !== "" && this.state.checkout_of_condition !== "") {
            params.append("checkin", this.state.checkin_of_condition);
            params.append("checkout", this.state.checkout_of_condition);
        }
        const api = new publicAPI();
        api.getRoom(params)
            .then(response => {
                var data = Array.from(response);
                var Npage = Array.from(response);
                data.splice(data.length - 1, 1);
                Npage.splice(0, Npage.length - 1);
                this.setState({
                    listHost: data
                });
                if (Npage !== this.state.pagination.length) {
                    this.createPagination(Npage[0]);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeHandler = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name]: value,
        })
    }

    changePage = (number) => {
        var index = Number(number);
        this.getPageItems(index, this.state.orderby);
        this.setState({
            currentPage: index,
        })
        window.scrollTo(0, 0)
    }

    nextPage() {
        if (this.state.currentPage < this.state.pagination.length) {
            var index = this.state.currentPage + 1;
            this.getPageItems(index);
            this.setState({
                currentPage: index,
            })
            window.scrollTo(0, 0)
        }
    }

    previousPage() {
        if (this.state.currentPage > 1) {
            var index = this.state.currentPage - 1;
            this.getPageItems(index);
            this.setState({
                currentPage: index,
            })
            window.scrollTo(0, 0)
        }
    }

    FillData = (e) => {
        e.preventDefault();
        this.getPageItems(1);
        this.setState({
            currentPage: 1,
        })
        window.scrollTo(0, 0);
    }

    OrderBy = (index) =>{
        this.setState({
            orderby: index,
            currentPage: 1,
        })
        this.getPageItems(1, index);
    }

    render() {
        if (localStorage.getItem('type') === "host")
            return <Redirect to={"/host/" + localStorage.getItem('username')} />
        if (localStorage.getItem('type') === "admin")
            return <Redirect to="/admin" />
        var listHost = this.state.listHost;
        var arrOrder = ['Đánh giá', 'Giá phòng tăng dần', 'Giá phòng giảm dần'];
        return (
            <div>
                <div>
                    <div className="col-md-12 header-home"><Header /></div>
                    <div className="col-md-12 content-home">
                        <div className="col-md-12">
                            <div className="col-md-9 col-md-offset-1 control-home">
                                <div className="control-element"><label>Nhận phòng: </label>
                                    <input type="date" name="checkin_of_condition" value={this.state.checkin_of_condition} onChange={this.ChangeHandler} />
                                </div>
                                <div className="control-element"><label>Trả phòng:  </label>
                                    <input type="date" name="checkout_of_condition" value={this.state.checkout_of_condition} onChange={this.ChangeHandler} />
                                </div>
                                <div className="control-element"><label>Loại phòng: </label>
                                    <select name="typeroom_of_condition" value={this.state.typeroom_of_condition} onChange={this.ChangeHandler}>
                                        {
                                            this.state.typeRoom.map((item, index) => {
                                                if (index === this.state.typeroom_of_condition) {
                                                    return <option key={index} value={index} disabled>{item}</option>
                                                }
                                                else {
                                                    return <option key={index} value={index}>{item}</option>
                                                }
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="control-element"><label>Tỉnh/Thành phố:</label>
                                    <select name="city_of_condition" value={this.state.city_of_condition} onChange={this.ChangeHandler}>
                                        {
                                            this.state.location.map((item, index) => {
                                                if (item === this.state.city_of_condition) {
                                                    return <option key={index} value={item} disabled>{item}</option>
                                                }
                                                else {
                                                    return <option key={index} value={item} >{item}</option>
                                                }
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="control-element-range"><label>Giá mỗi đêm: từ <NumberFormat thousandSeparator={true} defaultValue="0"></NumberFormat> đến <NumberFormat thousandSeparator={true} value={this.state.price_of_condition}></NumberFormat></label>
                                    <input type="range" name="price_of_condition" step="50000" min={this.state.min_price} max={this.state.max_price} value={this.state.price_of_condition} onChange={this.ChangeHandler} />
                                </div>
                            </div>
                            <div className="control-element-btn-find col-md-1">
                                <button onClick={this.FillData}>Tìm</button>
                            </div>
                            <div className="show-content col-md-10 col-md-offset-1">
                                <div className="col-md-12">
                                    <div className="control-element1 col-md-4 col-md-offset-4">
                                        <label>Sắp xếp theo:  </label>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {arrOrder[this.state.orderby]} <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu">
                                            {
                                                arrOrder.map((item,index) =>
                                                    <li onClick={this.OrderBy.bind(this, index)} key={index}><Link to="#">{item}</Link></li>
                                                )
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    {
                                        listHost.map((item) => <ShowInfo key={item.id_host} item={item} listConv={this.state.listConv} checkin={this.state.checkin_of_condition} checkout={this.state.checkout_of_condition} type={this.state.typeroom_of_condition} />)
                                    }
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-4 col-md-offset-4">
                                        <div className="Pagination">
                                            <div><Link to="" onClick={this.previousPage}>&laquo;</Link></div>
                                            {
                                                this.state.pagination.map((items, index) => {
                                                    if (items === this.state.currentPage)
                                                        return <div key={index} className="PaginationActive"><Link to="#" >{items}</Link></div>
                                                    return <div key={index}><Link to="#" onClick={this.changePage.bind(this, items)}>{items}</Link></div>
                                                })
                                            }
                                            <div><Link to="" onClick={this.nextPage}>&raquo;</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 footer"><Footer /></div>
                    <div><Chatbox /></div>
                </div>
                <div className="home-background"></div>
            </div>
        )
    }
}
