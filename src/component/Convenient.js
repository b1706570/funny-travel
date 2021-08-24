import React, { Component } from 'react';
import adminAPI from '../api/adminAPI';
import config from '../config.json';
import default_icon from '../icons/icon-add-convenient.png';

export default class Convenient extends Component {
    constructor(props){
        super(props);
        this.state ={
            conv: [],
            icon_add_conv_url: default_icon,
            icon_add_visible: "form-add-conv",
        }
        this.imageHandler=this.imageHandler.bind(this);
        this.iconHandler=this.iconHandler.bind(this);
        this.updateHandler=this.updateHandler.bind(this);
        this.Add_Convenient=this.Add_Convenient.bind(this);
        this.cancelHandler=this.cancelHandler.bind(this);
        this.changeHandler=this.changeHandler.bind(this);
    }

    componentDidMount(){
        const api = new adminAPI()
        api.getConvenient()
        .then(response =>{
            let res = response;
            let i=0;
            while(i<response.length){
                res[i].icon_conv = config.ServerURL + '/' + response[i].icon_conv;
                i++;
            }
            this.setState({
                conv: res,
            })
        })
        .catch(error =>{
            console.log(error);
        })
    }


    imageHandler = (e) =>{
        let index = e.target.id;
        index = index / 1000 - 1;
        let items = this.state.conv;
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                items[index].icon_conv = reader.result;
                this.setState({
                    conv: items,
                })
            }
        }
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    iconHandler = (e) =>{
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                this.setState({icon_add_conv_url: reader.result});
            }
        }
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    updateHandler = (e) =>{
        e.preventDefault();
        let data = document.getElementById('item'+e.target.value);
        let params = new FormData(data);
        const api = new adminAPI();
        api.updateConvenient(params)
        .then(response =>{
            if(response === 200){
                this.componentDidMount();
            }
            else{
                alert("Cập nhật tiện ích thất bại!");
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    deleteHandler = (e) =>{
        e.preventDefault();
        let index = e.target.value;
        const api = new adminAPI();
        api.deleteConvenient(index)
        .then(response =>{
            if(response === 200){
                this.componentDidMount();
            }
            else{
                alert("Xóa tiện ích thất bại!");
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    Add_Convenient = (e) =>{
        e.preventDefault();
        this.setState({
            icon_add_visible: "add-visible",
        })
    }

    addHandler = (e) =>{
        e.preventDefault();
        let data = document.getElementById("form-add-conv");
        let params = new FormData(data);
        if(document.getElementById("add-icon-conv").files[0]  && document.getElementById("input-add-conv-tag").value !== ""){
        const api = new adminAPI();
        api.addConvenient(params)
        .then(response =>{
            if(response === 200){
                document.getElementById("form-add-conv").reset();
                this.setState({icon_add_conv_url: default_icon,});
                this.componentDidMount();
            }
        })
        .catch(error =>{
            console.log(error);
        })
        }
        else{
            alert("Vui lòng nhập đủ các thông tin!");
        }
    }

    cancelHandler = (e) =>{
        e.preventDefault();
        this.setState({
            icon_add_visible: "form-add-conv",
            icon_add_conv_url: default_icon,
        })
        document.getElementById('form-add-conv').reset();
    }

    changeHandler = (e) =>{
        let items = this.state.conv;
        items[e.target.id].name_conv = e.target.value;
        this.setState({
            conv: items,
        });
    }

    render() {
        var classStyle = "rows col-md-12 " + this.state.icon_add_visible;
        return (
            <div className="col-md-12 div-convenient">
                <div className="title col-md-12">
                    <h3 className="col-md-6">TIỆN ÍCH</h3>
                    <button className="btn-add-conv col-md-1 col-md-offset-5" onClick={this.Add_Convenient}></button>
                </div>
                <div className="rows bolder col-md-12">
                    <div className="col-md-1">#</div> 
                    <div className="col-md-8">Tên tiện ích</div> 
                    <div className="col-md-3">Icon</div> 
                </div>
                <div className={classStyle}>
                    <form id="form-add-conv">
                        <div className="col-md-9"><input id="input-add-conv-tag" className="form-control" type="text" name="name_conv" /></div> 
                        <div className="col-md-3">
                            <input id="add-icon-conv" className="form-control" type="file" name="icon_conv" onChange={this.iconHandler} />
                            <label htmlFor="add-icon-conv">
                                <img className="icons-conv" src={this.state.icon_add_conv_url} alt='Icon' />
                            </label>
                            <button className="button-conv-add" onClick={this.addHandler}>Thêm</button>
                            <button className="button-conv-cancel" onClick={this.cancelHandler}></button>
                        </div>
                    </form>
                </div> 
                {
                    this.state.conv.map((item, index) => 
                        <form id={'item' + index} key={index}>
                        <div className="rows col-md-12">
                            <input type="hidden" name="id_conv" defaultValue={item.id_conv}/>
                            <div className="col-md-1">{index + 1}</div>
                            <div className="col-md-8"><input id={index} className="form-control" name="name_conv" value={item.name_conv} onChange={this.changeHandler}/></div>
                            <div className="col-md-3">
                                <input id={(index+1)*1000} className="form-control" type="file" name="icon_conv" onChange={this.imageHandler} />
                                <label htmlFor={(index+1)*1000}>
                                    <img className="icons-conv" src={item.icon_conv} alt='Icon' />
                                </label>
                                <button className="button-conv-update" value={index} onClick={this.updateHandler}>Cập nhật</button>
                                <button className="button-conv-delete" value={item.id_conv} onClick={this.deleteHandler}>Xóa</button>
                            </div>
                        </div>
                        </form>)
                }
            </div>
        )
    }
}
