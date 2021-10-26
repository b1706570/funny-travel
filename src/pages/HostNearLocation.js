import React, { Component } from 'react';
import Chatbox from '../component/Chatbox';
import Footer from '../component/Footer';
import Header from '../component/Header';

export default class HostNearLocation extends Component {
    render() {
        return (
            <div>
                <div>
                    <div className="col-md-12 header-home"><Header /></div>
                    <div className="col-md-12">Các địa điểm ở gần bạn</div>
                    <div className="col-md-8 content-near-location">
                        aaaaa
                    </div>
                    <div className="col-md-4 map-in-near-location">bbbb</div>
                    <div className="col-md-12 footer-home"><Footer /></div>
                    <div><Chatbox /></div>
                </div>
                <div className="home-background"></div>
            </div>
        )
    }
}
