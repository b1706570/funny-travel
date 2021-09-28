import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import adminAPI from '../api/adminAPI';
import ListProposal from '../component/ListProposal';
import AcceptForm from '../component/AcceptForm';
import Convenient from '../component/Convenient';
import AdminListMember from '../component/AdminListMember';

export class AdminTab extends Component {
    render() {
        if (this.props.tab_index === 0)
            return (
                <div>
                    tab1
                </div>
            )
        else if (this.props.tab_index === 1)
            return (
                <div>
                    <AdminListMember />
                </div>
            )
        else if (this.props.tab_index === 2)
            return (
                <div>
                    quản lý host
                </div>
            )
        else if (this.props.tab_index === 3)
            return (
                <div>
                    quản lý bình luận
                </div>
            )
        else if (this.props.tab_index === 4)
            return (
                <div>
                    <Convenient active={this.props.active} />
                </div>
            )
        else if (this.props.tab_index === 5)
            return (
                <div>
                    <ListProposal processing={this.props.processing} active={this.props.active} loaddata={this.props.loaddata} />
                </div>
            )
        else if (this.props.tab_index === 6)
            return (
                <div>
                    <AcceptForm data={this.props.data} processing={this.props.processing} active={this.props.active} />
                </div>
            )
    }
}

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            noti_request: null,
            data_accept_form: null
        }

        this.sigout = this.sigout.bind(this);
        this.loadNumberProposal = this.loadNumberProposal.bind(this);
        this.clicktoActive = this.clicktoActive.bind(this);
        this.proposalProcessing = this.proposalProcessing.bind(this);
    }

    componentDidMount() {
        this.loadNumberProposal();
    }

    loadNumberProposal() {
        const api = new adminAPI();
        api.getnumberproposal()
            .then(response => {
                if (response !== 0) {
                    this.setState({ noti_request: response });
                }
            })
            .catch(error => {
                console.log(error);
            })
        this.timer = setTimeout(this.loadNumberProposal, 300000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    sigout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('iduser');
        localStorage.removeItem('type');
    }

    clicktoActive = (param) => {
        this.setState({
            active: param
        })
    }

    proposalProcessing = () => {
        this.setState({
            noti_request: this.state.noti_request - 1,
        })
    }

    loadDataToAcceptForm = (data) => {
        this.setState({
            data_accept_form: data,
        })
    }

    render() {
        if (localStorage.getItem("type") !== "admin") {
            return <Redirect to="/" />
        }
        else {
            let active0 = "";
            let active1 = "";
            let active2 = "";
            let active3 = "";
            let active4 = "";
            let active5 = "";
            if (this.state.active === 0)
                active0 += "active";
            else if (this.state.active === 1)
                active1 += "active";
            else if (this.state.active === 2)
                active2 += "active"
            else if (this.state.active === 3)
                active3 += "active"
            else if (this.state.active === 4)
                active4 += "active"
            else if (this.state.active === 5)
                active5 += "active"
            return (
                <div>
                    <div className="admin-header col-md-10 col-md-offset-1">
                        <div className="col-md-2 admin-text">Adminitrator</div>
                        <div></div>
                    </div>
                    <div className="col-md-2 col-md-offset-1 div-left-admin">
                        <ul className="nav nav-pills nav-stacked">
                            <li role="presentation" className={active0} onClick={this.clicktoActive.bind(this, 0)}><Link to="#">Trang chính</Link></li>
                            <li role="presentation" className={active1} onClick={this.clicktoActive.bind(this, 1)}><Link to="#">Quản lý người dùng</Link></li>
                            <li role="presentation" className={active2} onClick={this.clicktoActive.bind(this, 2)}><Link to="#">Quản lý host</Link></li>
                            <li role="presentation" className={active3} onClick={this.clicktoActive.bind(this, 3)}><Link to="#">Quản lý bình luận</Link></li>
                            <li role="presentation" className={active4} onClick={this.clicktoActive.bind(this, 4)}><Link to="#">Tiện ích</Link></li>
                            <li role="presentation" className={active5} onClick={this.clicktoActive.bind(this, 5)}><Link to="#">Yêu cầu mới <span className="noti-request">{this.state.noti_request}</span></Link></li>
                            <li role="presentation" className="admin-logout"><Link to="/" onClick={this.sigout}><span className="glyphicon glyphicon-log-out"></span> Đăng xuất</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-8 div-right-admin">
                        <AdminTab tab_index={this.state.active} processing={this.proposalProcessing} active={this.clicktoActive} loaddata={this.loadDataToAcceptForm} data={this.state.data_accept_form} />
                    </div>
                </div>
            )
        }
    }
}
