import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import googleplay from '../img/google-play.svg';
import applestore from '../img/apple-store.svg';

export default class Footer extends Component {
    render() {
        return (
            <div>
                <div className="col-md-8 col-md-offset-2">
                    <Link to="#"><span id="facebook" className="icon-footer"></span></Link>
                    <Link to="#"><span id="instagram" className="icon-footer"></span></Link>
                    <Link to="#"><span id="twitter" className="icon-footer"></span></Link>
                    <Link to="#"><span id="youtube" className="icon-footer"></span></Link>
                    <Link to="#"><span id="zalo" className="icon-footer"></span></Link>
                </div>
                <div className="col-md-3 col-md-offset-2">
                    <p><label>Về chúng tôi</label></p>
                    <Link to="#"><p>Blog</p></Link>
                    <Link to="#"><p>Trang thông tin dành cho nhà cung cấp dịch vụ</p></Link>
                    <Link to="#"><p>Cơ hội nghề nghiệp</p></Link>
                    <Link to="#"><p>Thư ngỏ từ các nhà sáng lập</p></Link>
                    <Link to="#"><p>Tạp chí du lịch</p></Link>
                    <Link to="#"><p>Bản đồ</p></Link>
                </div>
                <div className="col-md-3">
                    <p><label>Hỗ trợ</label></p>
                    <Link to="#"><p>Cách Funny Travel hoạt động</p></Link>
                    <Link to="#"><p>Thông tin pháp lý</p></Link>
                    <Link to="#"><p>Thông báo bảo mật</p></Link>
                    <Link to="#"><p>Điều khoản sử dụng</p></Link>
                    <Link to="#"><p>Hướng dẫn du lịch</p></Link>
                    <Link to="#"><p>Hotline: 1900 9999</p></Link>
                    <Link to="#"><p>Email: funnytravel2102@gmail.com</p></Link>
                </div>
                <div className="col-md-2">
                    <p><label>Tải ứng dụng Funny Travel</label></p>
                    <Link to="#"><img src={applestore} alt="img-download-apple" /></Link>
                    <Link to="#"><img src={googleplay} alt="img-download-google" /></Link>
                </div>
                <div className="col-md-4 col-md-offset-4">
                    <p>FUNNY TRAVEL</p>
                    <p>Author: Dương Hồ Dũ - Place: Đại học Cần Thơ</p>
                </div>
            </div>
        )
    }
}
