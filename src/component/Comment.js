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
        this.submitReport = this.submitReport.bind(this);
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
            alert("B???n ph???i ????ng nh???p tr?????c khi s??? d???ng ch???c n??ng n??y.");
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
            alert("B???n ph???i ????ng nh???p tr?????c khi s??? d???ng ch???c n??ng n??y.");
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
        if (localStorage.getItem("iduser") === null) {
            alert("B???n ph???i ????ng nh???p tr?????c khi s??? d???ng ch???c n??ng n??y!");
        }
        else {
            var old_id = this.state.id_comment_report;
            if (old_id !== id_comment) {
                if (old_id !== -1) {
                    document.getElementById(old_id).style.visibility = "hidden";
                    document.getElementById(old_id).style.zIndex = "10";
                }
                document.getElementById(id_comment).style.visibility = "visible";
                document.getElementById(id_comment).style.zIndex = "20";
                this.setState({
                    id_comment_report: id_comment,
                    content_report: "",
                })
            }
            else {
                if (old_id !== -1) {
                    document.getElementById(old_id).style.visibility = "hidden";
                    document.getElementById(old_id).style.zIndex = "10";
                }
                this.setState({
                    id_comment_report: -1,
                    content_report: "",
                })
            }
        }
    }

    ChangeContentReport = (e) => {
        var content = e.target.value;
        this.setState({
            content_report: content,
        })
    }

    ChangeContentReporSample = (value) => {
        this.setState({
            content_report: this.state.content_report + value + " ",
        })
    }

    submitReport = (e) => {
        e.preventDefault();
        if (localStorage.getItem("iduser") === null) {
            alert("B???n ???? ????ng xu???t vui l??ng ????ng nh???p l???i!");
        }
        else {
            if (this.state.content_report === "") {
                alert("B???n ph???i nh???p l?? do b??o x???u!");
            }
            else {
                let params = new FormData();
                params.append("id_comment", this.state.id_comment_report);
                params.append("id_reporter", localStorage.getItem("iduser"));
                params.append("reason", this.state.content_report);
                const api = new publicAPI();
                api.ReportComment(params)
                    .then(response => {
                        if (response === 200) {
                            alert("B??o x???u c???a b???n ???? ???????c g???i. Xin c???m ??n!");
                            document.getElementById(this.state.id_comment_report).style.visibility = "hidden";
                            document.getElementById(this.state.id_comment_report).style.zIndex = "10";
                            this.setState({
                                id_comment: -1,
                                content_comment: "",
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }

    submitComment = (e) => {
        e.preventDefault();
        if (this.state.content_comment !== "" || this.state.evaluate !== 0 || this.state.image_comment !== null) {
            if (this.state.content_comment !== "" && this.state.evaluate !== 0) {
                console.log(1);
                const api = new publicAPI();
                api.GetAnalystOfComment({ "text": this.state.content_comment })
                    .then(response => {
                        let ok = true;
                        let label = response['data']['predict'];
                        if ((label === "POS" && this.state.evaluate < 3) || (label === "NEG" && this.state.evaluate >= 3)) {
                            let cf = window.confirm("B??nh lu???n v?? ????nh gi?? c???a b???n kh??ng kh???p. B???n mu???n ti???p t???c g???i b??nh lu???n kh??ng?");
                            if (cf === false) {
                                ok = false;
                            }
                        }
                        if (ok === true) {
                            let params = new FormData();
                            if (this.state.content_comment !== "")
                                params.append("content", this.state.content_comment);
                            if (this.state.evaluate !== 0)
                                params.append("evaluate", this.state.evaluate);
                            if (this.state.image_comment !== null)
                                params.append("image", this.state.image_comment);
                            params.append("id_host", this.state.host_id);
                            params.append("id_member", this.state.user_id);
                            api.pushComment(params)
                                .then(response => {
                                    if (response.code === 200) {
                                        this.getComment(this.state.host_id);
                                        this.clearComment();
                                    }
                                    else {
                                        alert("Th??m b??nh lu???n th???t b???i!");
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            else if (this.state.content_comment !== "") {
                const api = new publicAPI();
                let params1 = new FormData();
                params1.append("id_host", this.state.host_id);
                params1.append("id_member", this.state.user_id);
                api.GetEvaluateOfMemberForHost(params1)
                    .then(response => {
                        let evaluate = response[0]['evaluate'];
                        if (evaluate !== -1) {
                            api.GetAnalystOfComment({ "text": this.state.content_comment })
                                .then(response => {
                                    let ok = true;
                                    let label = response['data']['predict'];
                                    if ((label === "POS" && evaluate < 3) || (label === "NEG" && evaluate >= 3)) {
                                        let cf = window.confirm("????nh gi?? hi???n t???i c???a b???n v??? kh??ch s???n n??y l?? " + evaluate + " sao. B???n c?? mu???n ????nh gi?? l???i kh??ng?");
                                        if (cf === true) {
                                            ok = false;
                                        }
                                    }
                                    if (ok === true) {
                                        let params = new FormData();
                                        if (this.state.content_comment !== "")
                                            params.append("content", this.state.content_comment);
                                        if (this.state.evaluate !== 0)
                                            params.append("evaluate", this.state.evaluate);
                                        if (this.state.image_comment !== null)
                                            params.append("image", this.state.image_comment);
                                        params.append("id_host", this.state.host_id);
                                        params.append("id_member", this.state.user_id);
                                        api.pushComment(params)
                                            .then(response => {
                                                if (response.code === 200) {
                                                    this.getComment(this.state.host_id);
                                                    this.clearComment();
                                                }
                                                else {
                                                    alert("Th??m b??nh lu???n th???t b???i!");
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            })
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            else {
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
                            alert("Th??m b??nh lu???n th???t b???i!");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
        else {
            alert("B???n h??y th??m n???i dung ho???c ????nh gi?? tr?????c khi g???i nh??!");
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="col-md-12 home-div-comment">
                    {
                        this.state.comments.map((comment, index) => {
                            if (comment.point === null) {
                                var point = "(Ch??a ????nh gi??)";
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
                                            <div className="col-md-12 content-comment">(Ch??a vi???t b??nh lu???n)</div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index} className="home-row-comment col-md-12">
                                            <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                            <div className="col-md-12 date-comment">{comment.date_create}</div>
                                            <div className="col-md-12 content-comment"></div>
                                            <img className="home-img-comment" src={config.ServerURL + "/" + comment.image} alt="???nh b??nh lu???n" />
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
                                            <div className="report-comment col-md-8 col-md-offset-4">
                                                <div id={comment.id_comment} className="report-comment-content col-md-10">
                                                    <p>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "N???i dung kh??ng ph?? h???p")}>N???i dung kh??ng ph?? h???p</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Ng??n t??? kh??ng l???ch s???")}>Ng??n t??? kh??ng l???ch s???</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Spam")}>Spam</span>
                                                    </p>
                                                    <textarea className="form-control" placeholder="Nh???p l?? do b??o x???u b??nh lu???n" value={this.state.content_report} onChange={this.ChangeContentReport} />
                                                    <button className="btn btn-danger" onClick={this.submitReport}>G???i</button>
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
                                            <img className="home-img-comment" src={config.ServerURL + "/" + comment.image} alt="???nh b??nh lu???n" />
                                            <div className="report-comment col-md-8 col-md-offset-4">
                                                <div id={comment.id_comment} className="report-comment-content col-md-10">
                                                    <p>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "N???i dung kh??ng ph?? h???p")}>N???i dung kh??ng ph?? h???p</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Ng??n t??? kh??ng l???ch s???")}>Ng??n t??? kh??ng l???ch s???</span>
                                                        <span onClick={this.ChangeContentReporSample.bind(this, "Spam")}>Spam</span>
                                                    </p>
                                                    <textarea className="form-control" placeholder="Nh???p l?? do b??o x???u b??nh lu???n" value={this.state.content_report} onChange={this.ChangeContentReport} />
                                                    <button className="btn btn-danger" onClick={this.submitReport}>G???i</button>
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
                        <input className="col-md-9" name="content_comment" type="text" value={this.state.content_comment} onChange={this.ChangeHandler} />
                        <input id={"image-comment" + this.props.id_host} name="image" type="file" onChange={this.ChangeImage} />
                        <label className="col-md-1" htmlFor={"image-comment" + this.props.id_host}>
                            <img src={this.state.image_preview} alt="Th??m ???nh b??nh lu???n" />
                        </label>
                        <button className="col-md-2" onClick={this.submitComment} >?????ng ??</button>
                    </form>
                </div>
            </div>
        )
    }
}
