import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import HostHeader from '../component/HostHeader';
import HostAddRoom from '../component/HostAddRoom';

export default class Host extends Component {
    constructor(props){
        super(props);
        this.state={
            add_room_status: "add-room-hidden",
            body_status: "room-body-visible",
        }
        this.openAddRoom=this.openAddRoom.bind(this);
        this.closeAddRoom=this.closeAddRoom.bind(this);
    }

    openAddRoom = (e) =>{
        e.preventDefault();
        this.setState({
            add_room_status: "add-room-visible",
            body_status: "room-body-hidden",
        })
    }

    closeAddRoom = () =>{
        this.setState({
            add_room_status: "add-room-hidden",
            body_status: "room-body-visible",
        })
    }

    render() {
        if(localStorage.getItem("type") !== 'host'){
            return <Redirect to="/" />
        }

        var class_body = this.state.body_status + " col-md-12";
        var class_add_room = this.state.add_room_status + " col-md-8 col-md-offset-2";

        return (
            <div>
                <div className="host-header col-md-12">
                    <HostHeader hostActive={0}/>
                </div>
                <div className={class_body} >
                    <div className="host-control col-md-12">
                        <div className="btn-add-room col-md-2 col-md-offset-1">
                            <button onClick={this.openAddRoom}>Thêm phòng</button>
                        </div>
                        <div className="col-md-7 col-md-offset-2">
                            <div className="control-element"><label>Nhận phòng:</label>  <input type="date" /></div>
                            <div className="control-element"><label>Trả phòng:</label>  <input type="date" /></div>  
                            <div className="control-element"><select>
                                <option>--Loại phòng--</option>
                            </select></div>
                            <div className="control-element"><label>Số người:</label>  <input type="text" /></div>
                        </div>
                    </div>
                    <div className="host-content col-md-12">
                        
                    </div>
                </div>
                <div className={class_add_room}>
                    <HostAddRoom  close={this.closeAddRoom} />
                </div>
            </div>
        )
    }
}
