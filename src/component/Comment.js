import React, { Component } from 'react';
import publicAPI from '../api/publicAPI';
import config from '../config.json';
import logo from '../icons/add-logo.png';
import report from '../icons/icon-report.png';

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            star: [0, 0, 0, 0, 0],
            host_id: "",
            user_id: "",
            evaluate: 0,
            image_preview: logo,
            content_comment: "",
            image_comment: null,
            id_comment_report: -1,
            content_report: "",

        }
        this.getComment = this.getComment.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.ChangeImage = this.ChangeImage.bind(this);
        this.MouseOver = this.MouseOver.bind(this);
        this.MouseOut = this.MouseOut.bind(this);
        this.setEvaluate = this.setEvaluate.bind(this);
        this.clearComment = this.clearComment.bind(this);
        this.ReportVisible = this.ReportVisible.bind(this);
        this.ChangeContentReport = this.ChangeContentReport.bind(this);
        this.ChangeContentReporSample = this.ChangeContentReporSample.bind(this);
    }

    componentDidMount() {
        this.getComment(this.props.id_host);
        this.setState({
            host_id: this.props.id_host,
            user_id: localStorage.getItem('iduser'),
        })
    }

    getComment(id_host) {
        let params = new FormData();
        params.append("id", id_host);
        const api = new publicAPI();
        api.getComment(params)
            .then(response => {
                this.setState({ comments: response });
            })
            .catch(error => {
                console.log(error);
            })
    }

    ChangeHandler = (e) => {
        if (localStorage.getItem('iduser')) {
            var name = e.target.name;
            var value = e.target.value;
            this.setState({
                [name]: value,
            })
        }
        else {
            alert("Bạn phải đăng nhập trước khi sử dụng chức năng này.");
        }
    }

    ChangeImage = (e) => {
        if (localStorage.getItem('iduser')) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    this.setState({
                        image_preview: reader.result,
                        image_comment: e.target.files[0],
                    })
                }
            }
            if (e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0]);
            }
        }
        else {
            alert("Bạn phải đăng nhập trước khi sử dụng chức năng này.");
        }
    }

    MouseOver(index) {
        let arr = this.state.star;
        for (let i = this.state.evaluate; i <= index; i++) {
            arr[i] = 1;
        }
        this.setState({
            star: arr,
        })
    }

    MouseOut(index) {
        let arr = this.state.star;
        for (let i = this.state.evaluate; i <= index; i++) {
            arr[i] = 0;
        }
        this.setState({
            star: arr,
        })
    }

    setEvaluate(index) {
        let arr = this.state.star;
        for (let i = 0; i < index; i++) {
            arr[i] = 1;
        }
        for (let i = index + 1; i < 5; i++) {
            arr[i] = 0;
        }
        this.setState({
            star: arr,
            evaluate: index + 1,
        })
    }

    clearComment() {
        this.setState({
            star: [0, 0, 0, 0, 0],
            evaluate: 0,
            image_preview: logo,
            image_comment: null,
            content_comment: "",
        })
    }

    ReportVisible = (id_comment) => {
        var old_id = this.state.id_comment_report;
        if (old_id !== -1)
            document.getElementById(old_id).style.visibility = "hidden";
        document.getElementById(id_comment).style.visibility = "visible";
        this.setState({
            id_comment_report: id_comment,
            content_report: "",
        })
    }

    ChangeContentReport = (e) => {
        var content = e.target.value;
        this.setState({
            content_report: content,
        })
    }

    ChangeContentReporSample = (value) => {
        this.setState({
            content_report: this.state.content_report + " " + value,
        })
    }

    submitComment = (e) => {
        e.preventDefault();
        if (localStorage.getItem('iduser') && (this.state.content_comment !== "" || this.state.evaluate !== 0 || this.state.image_comment !== null)) {
            let params = new FormData();
            if (this.state.content_comment !== "")
                params.append("content", this.state.content_comment);
            if (this.state.evaluate !== 0)
                params.append("evaluate", this.state.evaluate);
            if (this.state.image_comment !== null)
                params.append("image", this.state.image_comment);
            params.append("id_host", this.state.host_id);
            params.append("id_member", this.state.user_id);
            const api = new publicAPI();
            api.pushComment(params)
                .then(response => {
                    if (response.code === 200) {
                        this.getComment(this.state.host_id);
                        this.clearComment();
                    }
                    else {
                        alert("Thêm bình luận thất bại!");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
        else {
            alert("Bạn phải đăng nhập hoặc thêm nội dung trước khi thêm bình luận.");
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="col-md-12 home-div-comment">
                    {
                        this.state.comments.map((comment, index) => {
                            if (comment.point === null) {
                                var point = "(Chưa đánh giá)";
                                var class_of_evaluate = "";
                            }
                            else {
                                point = comment.point;
                                class_of_evaluate = "evaluate-available";
                            }
                            if (comment.content === null) {
                                if (comment.image === "" || comment.image === null) {
                                    return (
                                        <div key={index} className="home-row-comment col-md-12">
                                            <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                            <div className="col-md-12 date-comment"></div>
                                            <div className="col-md-12 content-comment">(Chưa viết bình luận)</div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index} className="home-row-comment col-md-12">
                                            <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                            <div className="col-md-12 date-comment">{comment.date_create}</div>
                                            <div className="col-md-12 content-comment"></div>
                                            <img className="home-img-comment" src={config.ServerURL + "/" + comment.image} alt="Ảnh bình luận" />
                                        </div>
                                    )
                                }
                            }
                            else {
                                if (comment.image === "" || comment.image === null) {
                                    return (
                                        <div key={index} className="home-row-comment col-md-12">
                                            <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                            <div className="col-md-12 date-comment">{comment.date_create}</div>
                                            <div className="col-md-12 content-comment">{comment.content}</div>
                                            <div className="report-comment col-md-6 col-md-offset-6">
                                                <div id={comment.id_comment} className="report-comment-content col-md-10">
                                                    <p>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Nội dung không phù hợp")}>Nội dung không phù hợp</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Ngôn từ không lịch sự")}>Ngôn từ không lịch sự</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Spam")}>Spam</span>
                                                    </p>
                                                    <textarea className="form-control" value={this.state.content_report} onChange={this.ChangeContentReport} />
                                                    <button className="btn btn-danger" >Gửi</button>
                                                </div>
                                                <img className="col-md-2" src={report} alt="icon-report" onClick={this.ReportVisible.bind(this, comment.id_comment)} />
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index} className="home-row-comment col-md-12">
                                            <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                            <div className="col-md-12 date-comment">{comment.date_create}</div>
                                            <div className="col-md-12 content-comment">{comment.content}</div>
                                            <img className="home-img-comment" src={config.ServerURL + "/" + comment.image} alt="Ảnh bình luận" />
                                            <div className="report-comment col-md-6 col-md-offset-6">
                                                <div id={comment.id_comment} className="report-comment-content col-md-10">
                                                    <p>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Nội dung không phù hợp")}>Nội dung không phù hợp</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Ngôn từ không lịch sự")}>Ngôn từ không lịch sự</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Spam")}>Spam</span>
                                                    </p>
                                                    <textarea className="form-control" value={this.state.content_report} onChange={this.ChangeContentReport} />
                                                    <button className="btn btn-danger" >Gửi</button>
                                                </div>
                                                <img className="col-md-2" src={report} alt="icon-report" onClick={this.ReportVisible.bind(this, comment.id_comment)} />
                                            </div>
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </div>
                <div className="col-md-12 home-add-comment">
                    <div>
                        {
                            this.state.star.map((item, index) => {
                                if (item === 1) {
                                    return <span key={index} onMouseOut={this.MouseOut.bind(this, index)} onClick={this.setEvaluate.bind(this, index)} className="star-active"></span>
                                }
                                else {
                                    return <span key={index} onMouseOver={this.MouseOver.bind(this, index)} className="star-nonactive"></span>
                                }
                            })
                        }
                    </div>
                    <form>
                        <input className="col-md-10" name="content_comment" type="text" value={this.state.content_comment} onChange={this.ChangeHandler} />
                        <input id={"image-comment" + this.props.id_host} name="image" type="file" onChange={this.ChangeImage} />
                        <label className="col-md-1" htmlFor={"image-comment" + this.props.id_host}>
                            <img src={this.state.image_preview} alt="Thêm ảnh bình luận" />
                        </label>
                        <button className="col-md-1" onClick={this.submitComment} >Đồng ý</button>
                    </form>
                </div>
            </div>
        )
    }
}
