import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class BtnSigup extends Component {
    render() {
        return (
            <div className="col-md-6">
                <div className="dropdown">
                <button className="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown">Đăng kí</button>
                    <ul className="dropdown-menu">
                        <li><Link to="/register">Bạn tìm kiếm địa điểm du lịch?</Link></li>
                        <li><Link to="/host/register">Bạn là người cung cấp dịch vụ?</Link></li>
                    </ul>
                </div>
            </div>
        )
    }
}
