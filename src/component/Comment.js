import React, { Component } from 'react';
import publicAPI from '../api/publicAPI';
import config from '../config.json';
import logo from '../icons/add-logo.png';

export default class Comment extends Component {
    constructor(props){
        super(props);
        this.state={
            comments: [],
            star: [0,0,0,0,0],
            host_id: "",
            user_id: "",
            evaluate: 0,
            image_preview: logo,
            content_comment: "",
            image_comment: null,
        }
        this.getComment = this.getComment.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.ChangeImage = this.ChangeImage.bind(this);
        this.MouseOver = this.MouseOver.bind(this);
        this.MouseOut = this.MouseOut.bind(this);
        this.setEvaluate = this.setEvaluate.bind(this);
    }

    componentDidMount(){
        this.getComment(this.props.id_host);
        this.setState({
            host_id: this.props.id_host,
            user_id: localStorage.getItem('iduser'),
        })
    }

    getComment(id_host){
        let params = new FormData();
        params.append("id", id_host);
        const api = new publicAPI();
        api.getComment(params)
            .then(response =>{
                this.setState({ comments: response });
            })
            .catch(error =>{
                console.log(error);
            })
    }

    ChangeHandler = (e) =>{
        if(localStorage.getItem('iduser')){
            var name = e.target.name;
            var value = e.target.value;
            this.setState({
                [name]: value,
            })
        }
        else{
            alert("Bạn phải đăng nhập trước khi sử dụng chức năng này.");
        }
    }

    ChangeImage = (e) =>{
        if(localStorage.getItem('iduser')){
            const reader = new FileReader();
            reader.onload = () =>{
                if(reader.readyState === 2){
                    this.setState({
                        image_preview: reader.result,
                        image_comment: e.target.files[0],
                    })
                }
            }
            if(e.target.files[0]){
                reader.readAsDataURL(e.target.files[0]);
            }
        }
        else{
            alert("Bạn phải đăng nhập trước khi sử dụng chức năng này.");
        }
    }

    MouseOver(index){
        let arr = this.state.star;
        for(let i=this.state.evaluate; i<=index; i++ ){
            arr[i] = 1;
        }
        this.setState({
            star: arr,
        })
    }

    MouseOut(index){
        let arr = this.state.star;
        for(let i=this.state.evaluate; i<=index; i++ ){
            arr[i] = 0;
        }
        this.setState({
            star: arr,
        })
    }

    setEvaluate(index){
        this.setState({
            evaluate: index + 1,
        })
    }

    submitComment = (e) =>{
        e.preventDefault();
        if(localStorage.getItem('iduser') && (this.state.content_comment !== "" || this.state.evaluate !== 0 || this.state.image_comment !== null)){
            alert("yes");
        }
        else{
            alert("Bạn phải đăng nhập hoặc thêm nội dung trước khi thêm bình luận.");
        }
    }

    render() {
        return (
            <div className="col-md-12">
                {
                    this.state.comments.map((comment, index) =>{
                        if(comment.point === null){
                            var point = "(Chưa đánh giá)";
                            var class_of_evaluate = "";
                        }
                        else{
                            point = comment.point;
                            class_of_evaluate = "evaluate-available";
                        }
                        if(comment.content === null){
                            var content = "";
                            var date = "";
                        }
                        else{
                            content = comment.content;
                            date = comment.date_create;
                        }
                        if(comment.image === null){
                            return(
                                <div key={index} className="home-row-comment col-md-12">
                                    <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                    <div className="col-md-12 date-comment">{date}</div>
                                    <div className="col-md-12 content-comment">{content}</div>
                                </div>
                            )
                        }
                        else{
                            return (
                                <div key={index} className="home-row-comment col-md-12">
                                    <div className="col-md-12 who-comment">{comment.fullname}<p className={class_of_evaluate}>{point}</p></div>
                                    <div className="col-md-12 date-comment">{date}</div>
                                    <div className="col-md-12 content-comment">{content}</div>
                                    <img src={config.ServerURL + "/" + comment.image} alt="Ảnh bình luận"/>
                                </div>
                            )
                        }
                    })
                }
                <div className="col-md-12 home-add-comment">
                    <div>
                    {
                        this.state.star.map((item, index) =>{
                            if(item === 1 ){
                                return <span key={index} onMouseOut={this.MouseOut.bind(this, index)} onClick={this.setEvaluate.bind(this, index)} className="star-active"></span>
                            } 
                            else{
                                return <span key={index} onMouseOver={this.MouseOver.bind(this, index)} className="star-nonactive"></span>
                            }
                        })
                    }
                    </div>
                    <form>
                        <input className="col-md-10" name="content_comment" type="text" value={this.state.content_comment} onChange={this.ChangeHandler} />
                        <input id={"image-comment" + this.props.id_host} name="image" type="file" onChange={this.ChangeImage}/>
                        <label className="col-md-1" htmlFor={"image-comment" + this.props.id_host}>
                            <img src={this.state.image_preview} alt="Thêm ảnh bình luận" />
                        </label>
                        <button className="col-md-1" onClick={this.submitComment} >Thêm bình luận</button>
                    </form>
                </div>
            </div>
        )
    }
}
