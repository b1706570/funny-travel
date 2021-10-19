import React, { Component } from 'react';
import iconShow from '../icons/icon-show-box-chat.png';
import iconHide from '../icons/icon-close-box-chat.png';
import iconBot from '../icons/bot.png';
import iconSend from '../icons/send-message.png';
import publicAPI from '../api/publicAPI';

export default class Chatbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            formOpen: false,
            story: [
                ['bot', 'Xin chào bạn!'],
                ['bot', 'Mời bạn để lại lời nhắn tôi sẽ giúp bạn trả lời những câu hỏi!'],
            ],
            icon_box_chat: iconShow,
        }
    }

    ShowOrHideBoxChat = () =>{
        if(this.state.formOpen){
            document.getElementById("boxchat").style.display= "none";
            this.setState({ formOpen: false, icon_box_chat: iconShow });
        }
        else{
            document.getElementById("boxchat").style.display= "inline-block";
            document.getElementById("boxchat").style.zIndex= 10;
            this.setState({ formOpen: true, icon_box_chat: iconHide });
        }
    }

    PushChat = () =>{
        let content = document.getElementById("input-chat-content").value;
        let newstory = this.state.story;
        let arr = [];
        arr.push("user");
        arr.push(content);
        newstory.push(arr);
        this.setState({
            story: newstory,
        }, function () {
            document.getElementById("content-boxchat").scrollTo(0, document.getElementById("content-boxchat").scrollHeight);
            this.GetBotResponse(content);
        });
        document.getElementById("input-chat-content").value = "";
    }

    GetBotResponse = (request) =>{
        let dict = {"message": request};
        const api = new publicAPI()
        api.GetResponseMessage(dict)
            .then(response =>{
                let newstory = this.state.story;
                let res =[];
                res.push("bot");
                res.push(response);
                newstory.push(res);
                this.setState({
                    story: newstory,
                }, function() {
                    document.getElementById("content-boxchat").scrollTo(0, document.getElementById("content-boxchat").scrollHeight);
                })
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render() {
        return (
            <div className="chatbox">
                <div id="boxchat">
                    <div className="col-md-12">Cuộc trò truyện của bạn<span onClick={this.ShowOrHideBoxChat} className="glyphicon glyphicon-minus"></span></div>
                    <div id="content-boxchat" className="content-boxchat">
                    {
                        this.state.story.map((message, index) =>
                            message[0] === "bot" ? (
                                <div key={index} className="message-left"><img src={iconBot} alt="Icon-bot" /><span>{message[1]}</span></div>
                            ) : (
                                <div key={index} className="message-right"><span>{message[1]}</span></div>
                            )
                        )
                    }
                    </div>
                    <div className="input-chat">
                        <textarea id="input-chat-content" className="form-control" />
                        <img onClick={this.PushChat} src={iconSend} alt="icon-send-message" />
                    </div>
                </div>
                <div id="icon-show-box-chat"><img onClick={this.ShowOrHideBoxChat} src={this.state.icon_box_chat} alt="Icon" /></div>
            </div>
        )
    }
}
