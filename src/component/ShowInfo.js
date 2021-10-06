import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import ShowAddressInMaps from './ShowAddressInMaps';
import config from '../config.json';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import vnd from '../icons/icon-vnd.png';

export class DetailInfoTab extends Component {
    render() {
        if (this.props.tab_index === 0) {
            return (
                <div>
                    <ShowAddressInMaps lat={this.props.lat} long={this.props.long} />
                    <div>
                        <h4>Các tiện ích</h4>
                        {
                            this.props.listConv.map((item, index) => {
                                if (this.props.ConvAvailable.indexOf(item.id_conv) === -1) {
                                    return (<div key={index} className="home-conv-info col-md-3">
                                        <span className="glyphicon glyphicon glyphicon-unchecked" ></span>
                                        <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="Icon" />
                                        <p className="value-checkbox">{item.name_conv}</p>
                                    </div>)
                                }
                                else {
                                    return (
                                        <div key={index} className="home-conv-info col-md-3">
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
            )
        }
        else if (this.props.tab_index === 1) {
            return (
                <div className="col-md-12 home-more-info-content">
                    {
                        this.props.arrImage.map((item, index) =>
                            <img key={index} src={config.ServerURL + "/" + item} alt="hình ảnh" />
                        )
                    }
                </div>
            )
        }
        else if (this.props.tab_index === 2) {
            return (
                <div className="col-md-12 home-more-info-content">
                    <Comment id_host={this.props.id_host} />
                </div>
            )
        }
    }
}

export default class ShowInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listImg: [],
            listConv: [],
            id: "",
            name: "",
            address: "",
            lat: this.props.item.latitude,
            long: this.props.item.longtitude,
            price: 0,
            tab: 0,
            moreinfo_statement: "col-md-12 home-more-detail-none",
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.ShowMoreDetail = this.ShowMoreDetail.bind(this);
        this.HideMoreDetail = this.HideMoreDetail.bind(this);
        this.ChangeTabHandler = this.ChangeTabHandler.bind(this);
    }

    componentDidMount(){
        var listImgs = this.props.item.images;
        var arrImg = listImgs.split(";");
        var listConvs = this.props.item.convenients;
        var arrConv = listConvs.split(";");
        arrConv = Array.from(new Set(arrConv));
        this.setState({
            listImg: arrImg,
            id: this.props.item.id_host,
            name: this.props.item.company_name,
            address: this.props.item.address_host,
            lat: this.props.item.latitude,
            long: this.props.item.longtitude,
            price: this.props.item.price,
            point: this.props.item.point,
            listConv: arrConv,
        })
    }

    ShowMoreDetail = (e) => {
        e.preventDefault();
        this.setState({
            moreinfo_statement: "col-md-12 home-more-detail-visible",
        })
    }

    HideMoreDetail = (e) => {
        e.preventDefault();
        this.setState({
            moreinfo_statement: "col-md-12 home-more-detail-none",
        })
    }

    ChangeTabHandler = (index_tab) => {
        this.setState({
            tab: index_tab,
        })
    }

    render() {
        var class_address = "";
        var class_img = "";
        var class_comment = "";
        if (this.state.tab === 0) class_address += "active";
        else if (this.state.tab === 1) class_img += "active";
        else if (this.state.tab === 2) class_comment += "active";
        return (
            <div className="home-row-info col-md-12">
                <Link to={"/rooms/" + this.props.item.id_host + "?check_in=" + this.props.checkin + "&check_out=" + this.props.checkout + "&type=" + this.props.type}>
                <div className="home-image-info col-md-3">
                    <img src={config.ServerURL + "/" + this.state.listImg[0]} alt="Ảnh của khách sạn" />
                </div>
                <div className="home-detail-info col-md-9">
                    <p className="home-info-name col-md-12">{this.state.name}</p>
                    <p className="home-info-address col-md-12">
                        <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span> {this.state.address}
                    </p>
                    <p className="home-info-price col-md-12">
                        <span aria-hidden="true"><img src={vnd} alt="icon-vnd" /></span> <NumberFormat thousandSeparator={true} value={this.state.price} readOnly />
                    </p>
                    <p className="home-info-evaluate col-md-12">
                        <span className="glyphicon glyphicon-star" aria-hidden="true"></span> {this.state.point}
                    </p>
                    <p className="home-info-showmoredetail col-md-12"><button className="button" onClick={this.ShowMoreDetail}>Xem thêm thông tin</button></p>
                </div>
                </Link>
                <div className={this.state.moreinfo_statement}>
                    <div className="col-md-5 col-md-offset-7 showinfo-tabs">
                        <div className="col-md-11">
                            <ul className="nav nav-tabs nav-justified">
                                <li role="presentation" className={class_address}><Link onClick={this.ChangeTabHandler.bind(this, 0)} to="">Vị trí</Link></li>
                                <li role="presentation" className={class_img}><Link onClick={this.ChangeTabHandler.bind(this, 1)} to="">Hình ảnh</Link></li>
                                <li role="presentation" className={class_comment}><Link onClick={this.ChangeTabHandler.bind(this, 2)} to="">Nhận xét</Link></li>
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
}
