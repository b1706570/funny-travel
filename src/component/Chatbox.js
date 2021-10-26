import React, { Component } from 'react';
import iconShow from '../icons/icon-show-box-chat.png';
import iconHide from '../icons/icon-close-box-chat.png';
import iconBot from '../icons/bot.png';
import iconSend from '../icons/send-message.png';
import publicAPI from '../api/publicAPI';
import config from '../config.json';
import { Link } from 'react-router-dom';

export default class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formOpen: false,
            story: [
                ['bot', {'text': 'Xin chào bạn!', 'image': null, 'link': null}],
                ['bot', {'text': 'Mời bạn để lại lời nhắn tôi sẽ giúp bạn trả lời những câu hỏi!', 'image': null, 'link': null}],
            ],
            icon_box_chat: iconShow,
        }
    }

    ShowOrHideBoxChat = () => {
        if (this.state.formOpen) {
            document.getElementById("boxchat").style.display = "none";
            this.setState({ formOpen: false, icon_box_chat: iconShow });
        }
        else {
            document.getElementById("boxchat").style.display = "inline-block";
            document.getElementById("boxchat").style.zIndex = 10;
            this.setState({ formOpen: true, icon_box_chat: iconHide });
        }
    }

    PushChat = () => {
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

    GetBotResponse = (request) => {
        let dict = { "message": request };
        const api = new publicAPI()
        api.GetResponseMessage(dict)
            .then(response => {
                let newstory = this.state.story;
                for (let i = 0; i < response.length; i++) {
                    if (response[i].text !== undefined) {
                        let res = [];
                        let dict = {};
                        res.push("bot");
                        dict['text'] = response[i].text;
                        dict['image'] = null;
                        dict['link'] = null;
                        res.push(dict);
                        newstory.push(res);
                    }
                    else {
                        let res = [];
                        let dict = {};
                        res.push("bot");
                        dict['text'] = response[i].custom.text;
                        if(response[i].custom.image !== undefined){
                            let arr_img = response[i].custom.image.split(";")
                            dict['image'] = arr_img[0];
                        }
                        else{
                            dict['image'] = null;
                        }
                        if(response[i].custom.link !== undefined)
                            dict['link'] = response[i].custom.link;
                        else
                            dict['image'] = null;
                        res.push(dict);
                        newstory.push(res);
                    }
                }
                this.setState({
                    story: newstory,
                }, function () {
                    document.getElementById("content-boxchat").scrollTo(0, document.getElementById("content-boxchat").scrollHeight);
                })
            })
            .catch(error => {
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
                                    <div key={index} className="message-left">
                                        <img src={iconBot} alt="Icon-bot" />
                                        <span>
                                            {
                                                //message[1].split("|").map((item, index) => <div key={index}>{item}</div>)
                                                message[1]['link'] === null ? (
                                                    message[1]['image'] === null ? (
                                                        message[1]['text'].split("|").map((item, index) => <div key={index}>{item}</div>)
                                                    ) : (
                                                        <div>
                                                            <img className="image-room" src={config.ServerURL + "/" + message[1]['image']} alt="Ảnh phòng" />
                                                            {
                                                                message[1]['text'].split("|").map((item, index) => <div key={index}>{item}</div>)
                                                            }
                                                        </div>
                                                    )
                                                ) : (
                                                    <Link to={message[1]['link']}target="_blank">
                                                        {
                                                            message[1]['image'] === null ? (
                                                                message[1]['text'].split("|").map((item, index) => <div key={index}>{item}</div>)
                                                            ) : (
                                                                <div>
                                                                    <img className="image-room" src={config.ServerURL + "/" + message[1]['image']} alt="Ảnh phòng" />
                                                                    {
                                                                        message[1]['text'].split("|").map((item, index) => <div key={index}>{item}</div>)
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </Link>
                                                )
                                            }
                                        </span>
                                    </div>
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
