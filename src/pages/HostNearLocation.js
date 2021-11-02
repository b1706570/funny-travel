/*import axios from 'axios';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getDistance } from 'geolib';
import publicAPI from '../api/publicAPI';
import Chatbox from '../component/Chatbox';
import Footer from '../component/Footer';
import Header from '../component/Header';
import config from '../config.json';
import NumberFormat from 'react-number-format';
import vnd from '../icons/icon-vnd.png';

const opencagedataURL = "https://api.opencagedata.com/geocode/v1/json?language=vi&countrycode=vn&limit=1&no_annotations=1&key=50c04b387edd4fbf869af5e69d19a8c3";

export default class HostNearLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mylat: -1,
            mylong: -1,
            listHost: [],
            direct: '',
            moreinfo_statement: "col-md-12 home-more-detail-none",
        }
        this.ShowMoreDetail = this.ShowMoreDetail.bind(this);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                var latitude = pos.coords.latitude;
                var longtitude = pos.coords.longitude;
                const api = axios.create({ baseURL: opencagedataURL + "&q=" + latitude + "+" + longtitude });
                return api.get()
                    .then(response => {
                        var address = response.data.results[0].formatted;
                        address = address.split(",");
                        var city = address[address.length - 2];
                        var ward = address[address.length - 3];
                        let params = new FormData();
                        params.append("city", city);
                        params.append("ward", ward)
                        const api1 = new publicAPI();
                        api1.GetLocationNearMe(params)
                            .then(res => {
                                if (res[0] !== 'empty') {
                                    var list_host = [];
                                    for (let i = 0; i < res.length; i++) {
                                        var data = res[i];
                                        var distance = getDistance(
                                            { latitude: latitude, longitude: latitude },
                                            { latitude: data['latitude'], longitude: data['longtitude'] },
                                        );
                                        data['distance'] = distance / 1000;
                                        var conv = data['convenients'].split(";");
                                        conv = Array.from(new Set(conv));
                                        conv.pop();
                                        var images = data['images'].split(";");
                                        images = Array.from(new Set(images));
                                        images.pop();
                                        data['convenients'] = conv;
                                        data['images'] = images;
                                        list_host.push(data);
                                    }
                                    list_host.sort((a, b) => a.distance >= b.distance ? 1 : -1);
                                    list_host = list_host.splice(0, 10);
                                    this.setState({
                                        mylat: latitude,
                                        mylong: longtitude,
                                        listHost: list_host,
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        }
        else {
            alert("Bạn hãy cho phép truy cập vị trí của bạn và thử lại nhé");
            this.setState({
                direct: "/",
            });
        }
    }

    ShowMoreDetail = (e) => {
        e.preventDefault();
        this.setState({
            moreinfo_statement: "col-md-12 home-more-detail-visible",
        })
    }

    render() {
        if (localStorage.getItem('type') === "host")
            return <Redirect to={"/host/" + localStorage.getItem('username')} />
        if (localStorage.getItem('type') === "admin")
            return <Redirect to="/admin" />
        if (this.state.direct !== '')
            return <Redirect to={this.state.direct} />
        if (this.state.mylat === -1 && this.state.mylong === -1)
            return null;
        var class_address = "";
        var class_img = "";
        var class_comment = "";
        if (this.state.tab === 0) class_address += "active";
        else if (this.state.tab === 1) class_img += "active";
        else if (this.state.tab === 2) class_comment += "active";
        return (
            <div>
                <div>
                    <div className="col-md-12 header-home"><Header /></div>
                    <div className="col-md-12">Các địa điểm ở gần bạn</div>
                    <div className="col-md-8 content-near-location">
                        {
                            this.state.listHost.map((host, index) =>
                                <div key={index} className="home-row-info col-md-12">
                                    <Link to={"/rooms/" + host.id_host + "?check_in=&check_out=&type=0"}>
                                        <div className="col-md-3 near-me-image-info">
                                            <img src={config.ServerURL + "/" + host.images[0]} alt="Ảnh của khách sạn" />
                                        </div>
                                        <div className="home-detail-info col-md-9">
                                            <p className="home-info-name col-md-12">{host.company_name}</p>
                                            <p className="home-info-address col-md-12">
                                                <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span> {host.address_host}
                                            </p>
                                            <p className="home-info-price col-md-12">
                                                <span aria-hidden="true"><img src={vnd} alt="icon-vnd" /></span> <NumberFormat thousandSeparator={true} value={host.min_price} readOnly />
                                            </p>
                                            <p className="home-info-evaluate col-md-12">
                                                <span className="glyphicon glyphicon-star" aria-hidden="true"></span> {host.point}
                                            </p>
                                            <p className="home-info-showmoredetail col-md-12"><button className="button" onClick={this.ShowMoreDetail}>Xem thêm thông tin</button></p>
                                        </div>
                                    </Link>
                                    <div className={this.state.moreinfo_statement}>
                                        <div className="col-md-5 col-md-offset-7 showinfo-tabs">
                                            <div className="col-md-11">
                                                <ul className="nav nav-tabs nav-justified">
                                                    <li role="presentation" className={class_address}><Link onClick={this.ChangeTabHandler.bind(this, 0)} to="#">Vị trí</Link></li>
                                                    <li role="presentation" className={class_img}><Link onClick={this.ChangeTabHandler.bind(this, 1)} to="#">Hình ảnh</Link></li>
                                                    <li role="presentation" className={class_comment}><Link onClick={this.ChangeTabHandler.bind(this, 2)} to="#">Nhận xét</Link></li>
                                                </ul>
                                            </div>
                                            <div className="col-md-1">
                                                <span className="glyphicon glyphicon-remove home-remove-more-detail" aria-hidden="true" onClick={this.HideMoreDetail}></span>
                                            </div>
                                        </div>
                                        <DetailInfoTab tab_index={this.state.tab} id_host={this.state.id} lat={this.state.lat} long={this.state.long} arrImage={this.state.listImg} listConv={this.props.listConv} ConvAvailable={this.state.listConv} />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="col-md-4 map-in-near-location">bbbb</div>
                    <div className="col-md-12 footer-home"><Footer /></div>
                    <div><Chatbox /></div>
                </div>
                <div className="home-background"></div>
            </div>
        )
    }
}*/

import React, { Component } from 'react';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Chatbox from '../component/Chatbox';
import { Redirect } from 'react-router-dom';
import publicAPI from '../api/publicAPI';
import ShowInfo from '../component/ShowInfo';
import axios from 'axios';
import { getDistance } from 'geolib';
import { MapContainer, Marker, TileLayer, MapConsumer, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const opencagedataURL = "https://api.opencagedata.com/geocode/v1/json?language=vi&countrycode=vn&limit=1&no_annotations=1&key=50c04b387edd4fbf869af5e69d19a8c3";

export default class HostNearLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mylat: -1,
            mylong: -1,
            listHost: [],
            listConv: [],
            listMaker: [],
            direct: '',
        }
        this.getAllConvenients = this.getAllConvenients.bind(this);
        this.ScrollToID = this.ScrollToID.bind(this);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                var listMaker = [];
                let arr = [];
                var latitude = pos.coords.latitude;
                var longtitude = pos.coords.longitude;
                arr.push(latitude);
                arr.push(longtitude);
                arr.push("Vị trí hiện tại của bạn")
                listMaker.push(arr);
                const api = axios.create({ baseURL: opencagedataURL + "&q=" + latitude + "+" + longtitude });
                return api.get()
                    .then(response => {
                        var address = response.data.results[0].formatted;
                        address = address.split(",");
                        var city = address[address.length - 2];
                        var ward = address[address.length - 3];
                        let params = new FormData();
                        params.append("city", city);
                        params.append("ward", ward)
                        const api1 = new publicAPI();
                        api1.GetLocationNearMe(params)
                            .then(res => {
                                if (res[0] !== 'empty') {
                                    var list_host = [];
                                    for (let i = 0; i < res.length; i++) {
                                        var data = res[i];
                                        var distance = getDistance(
                                            { latitude: latitude, longitude: latitude },
                                            { latitude: data['latitude'], longitude: data['longtitude'] },
                                        );
                                        data['distance'] = distance / 1000;
                                        list_host.push(data);
                                    }
                                    list_host.sort((a, b) => a.distance >= b.distance ? 1 : -1);
                                    list_host = list_host.splice(0, 10);
                                    for(let i = 0; i < list_host.length; i++){
                                        let arr = [];
                                        arr.push(list_host[i]['latitude']);
                                        arr.push(list_host[i]['longtitude']);
                                        arr.push(list_host[i]['company_name']);
                                        listMaker.push(arr);
                                    }
                                    this.setState({
                                        mylat: latitude,
                                        mylong: longtitude,
                                        listHost: list_host,
                                        listMaker: listMaker,
                                    })
                                    this.getAllConvenients();
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
        }
        else {
            alert("Bạn hãy cho phép truy cập vị trí của bạn và thử lại nhé");
            this.setState({
                direct: "/",
            });
        }
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

    ScrollToID  = (index) =>{
        window.scrollTo(0, document.getElementById(index).offsetTop);
    }

    render() {
        if (localStorage.getItem('type') === "host")
            return <Redirect to={"/host/" + localStorage.getItem('username')} />
        if (localStorage.getItem('type') === "admin")
            return <Redirect to="/admin" />
        if (this.state.direct !== '')
            return <Redirect to={this.state.direct} />
        if (this.state.mylat === -1 && this.state.mylong === -1)
            return null;
        var listHost = this.state.listHost;
        var markerIcon = new L.Icon({
            iconUrl: require('../icons/icons-marker.png').default,
            iconSize: [30,40],
        });
        return (
            <div>
                <div>
                    <div className="col-md-12 header-home"><Header /></div>
                    <div className="col-md-12 near-location-title">CÁC ĐỊA ĐIỂM Ở GẦN BẠN</div>
                    <div className="col-md-8 content-near-location">
                        {
                            listHost.map((item, index) =>
                                <div key={index} id={index + 1} className="near-me-div-info">
                                    <ShowInfo item={item} listConv={this.state.listConv} checkin="" checkout="" type="0" />
                                </div>
                            )
                        }
                    </div>
                    <div className="col-md-4 aaa">
                        <MapContainer className="map-in-near-location" center={[this.state.mylat, this.state.mylong]} zoom={13} scrollWheelZoom={false} >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {
                                this.state.listMaker.map((latlng, index) =>
                                    index === 0 ? (
                                        <Marker key={index} position={[latlng[0], latlng[1]]} icon={markerIcon}>
                                            <Tooltip><b>{latlng[2]}</b></Tooltip>
                                            <Popup><b>{latlng[2]}</b></Popup>
                                        </Marker>
                                    ) : (
                                        <Marker key={index} position={[latlng[0], latlng[1]]} eventHandlers={{click: this.ScrollToID.bind(this, index)}}>
                                            <Tooltip><b>{latlng[2]}</b></Tooltip>
                                            <Popup><b>{latlng[2]}</b></Popup>
                                        </Marker>
                                    )
                                )
                            }
                            <MapConsumer>
                            {(map) => {
                                map.flyTo([this.state.mylat, this.state.mylong])
                                map._onResize()
                                return null
                            }}
                            </MapConsumer>
                        </MapContainer>
                    </div>
                    <div className="col-md-12 footer-home"><Footer /></div>
                    <div><Chatbox /></div>
                </div>
                <div className="home-background"></div>
            </div>
        )
    }
}

