import React, { Component } from 'react'
import adminAPI from '../api/adminAPI';
import config from '../config.json';

export default class AdminManageComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allComment: [],
            current_page: 0,
            all_page: "",
            detail_report: {
                'owner': "",
                'content': "",
                'report': [],
            },
            class_detail_report: "detail-report-hidden",
        }
        this.getComment = this.getComment.bind(this);
        this.FillData = this.FillData.bind(this);
        this.ShowReport = this.ShowReport.bind(this);
        this.HideReport = this.HideReport.bind(this);
    }

    componentDidMount() {
        this.getComment(this.state.current_page);
    }

    getComment = (page) => {
        let params = new FormData();
        params.append("pagination", page + 1);
        const api = new adminAPI();
        api.getComment(params)
            .then(response => {
                console.log(response['data']);
                this.setState({
                    allComment: response['data'],
                    all_page: response['total'],
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    FillData = (action) =>{
        if(action === "next"){
            if(this.state.current_page === this.state.all_page - 1){
                alert("Bạn đang ở trang cuối");
            }
            else{
                this.getComment(this.state.current_page + 1);
                this.setState({ current_page: this.state.current_page + 1 });
            }
        }
        else{
            if(this.state.current_page === 0){
                alert("Bạn đang ở trang đầu");
            }
            else{
                this.getComment(this.state.current_page - 1);
                this.setState({ current_page: this.state.current_page - 1 });
            }
        }
    }

    ShowReport = (index) =>{
        let params = new FormData();
        params.append("id_comment", this.state.allComment[index].id_comment);
        const api = new adminAPI();
        api.getReportDetail(params)
            .then(response =>{
                var dict = {};
                dict['owner'] = this.state.allComment[index].fullname;
                dict['content'] = this.state.allComment[index].content;
                dict['report'] = response;
                this.setState({
                    detail_report: dict,
                    class_detail_report: "detail-report-visible",
                })
            })
            .catch(error =>{
                console.log(error);
            })
    }

    HideReport = () =>{
        this.setState({
            class_detail_report: "detail-report-hidden",
        })
    }

    DeleteComment = (id_comment) =>{
        let params = new FormData();
        params.append("id_comment", id_comment);
        const api = new adminAPI();
        api.deleteComment(params)
            .then(response =>{
                if(response === 200){
                    alert("Xóa bình luận thành công.");
                    this.getComment(this.state.current_page);
                }
                else{
                    alert("Xóa bình luận không thành công.");
                }
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render() {
        if (this.state.allComment.length === 0) {
            return (
                <div className="admin-content">
                    <div className="noti-empty-statistics">
                        <p>Chưa có bình luận nào cả</p>
                    </div>
                </div>
            )
        }
        return (
            <div className="col-md-12 admin-content">
                <div className="admin-table-comment">
                    <div className="col-md-12 header rows">
                        <div className="col-md-2">Người bình luận</div>
                        <div className="col-md-3">Host được bình luận</div>
                        <div className="col-md-3">Nội dung bình luận</div>
                        <div className="col-md-2">Hình ảnh</div>
                        <div className="col-md-2 report-number"><div className="col-md-8">Báo xấu</div></div>
                    </div>
                    {
                        this.state.allComment.map((comment, index) =>
                            <div key={index} className="col-md-12 rows" onDoubleClick={this.ShowReport.bind(this, index)}>
                                <div className="col-md-2">{comment.fullname}</div>
                                <div className="col-md-3">{comment.company_name}</div>
                                <div className="col-md-3">{comment.content}</div>
                                {
                                    comment.image === "" || comment.image === null ? (
                                        <div className="col-md-2"></div>
                                    ) : (
                                        <div className="col-md-2"><img src={config.ServerURL + "/" + comment.image} alt="comment-img" /></div>
                                    )
                                }
                                <div className="col-md-2 report-number">
                                    {
                                        comment.report > 4 ? (
                                            <div className="col-md-8 gray">{comment.report}</div>
                                        ) : (
                                            <div className="col-md-8">{comment.report}</div>
                                        )
                                    }
                                    <div className="col-md-2"><span className="glyphicon glyphicon-trash" onClick={this.DeleteComment.bind(this, comment.id_comment)}></span></div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="col-md-12 control-comment">
                    <div>
                        <span className="btn-previous" onClick={this.FillData.bind(this, "previous")}><span className="glyphicon glyphicon-backward"></span> Trang trước</span>
                        <span className="page-number">{"Trang " + (this.state.current_page + 1) + "/" + this.state.all_page}</span>
                        <span className="btn-next" onClick={this.FillData.bind(this,"next")}>Trang sau <span className="glyphicon glyphicon-forward"></span></span>
                    </div>
                </div>
                <div className={this.state.class_detail_report}>
                    <div className="col-md-12 close-detail-report"><span className="glyphicon glyphicon-remove" onClick={this.HideReport}></span></div>
                    <div className="col-md-12">
                        <p>Nguời comment: {this.state.detail_report.owner}</p>
                        <p>Nội dung: {this.state.detail_report.content}</p>
                        {
                            this.state.detail_report.report.length === 0 ? (
                                <div className="noti-empty-report">Chưa có báo xấu nào</div>
                            ) : (
                                <div className="list-report">
                                    <div>
                                        <div className="col-md-4"><label>Người báo xấu</label></div>
                                        <div className="col-md-8"><label>Nội dung báo xấu</label></div>
                                    </div>
                                    {
                                        this.state.detail_report.report.map(report =>
                                            <div>
                                                <div className="col-md-4">{report.fullname}</div>
                                                <div className="col-md-8">{report.reason}</div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
