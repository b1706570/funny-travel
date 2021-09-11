import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import hostAPI from '../api/hostAPI';
import config from '../config.json';
import addlogo from '../icons/add-logo.png';


export default class HostEditRoom extends Component {
    constructor(props) {
        super(props);
        var textPrice = new Intl.NumberFormat().format(this.props.data.price_room);
        this.state = {
            txtRoomname: this.props.data.name_room,
            txtCapacity: this.props.data.capacity_room,
            txtRoomtype: this.props.data.type_room,
            txtTPrice: textPrice,
            txtNPrice: this.props.data.price_room,
            listAllConv: [],
            listImg: [],
            listFiles: [],
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.imageHandler = this.imageHandler.bind(this);
        this.removeImageReview = this.removeImageReview.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Cancel = this.Cancel.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
    }

    componentDidMount() {
        console.log(this.props.data);
        const api = new hostAPI();
        api.getAllConvenient()
            .then(response => {
                this.setState({
                    listAllConv: response,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    changeHandler = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value,
        })
        if (name === "txtTPrice") {
            let n = value.replaceAll(",", "");
            this.setState({
                txtNPrice: n,
            })
        }
    }

    resetComponent = () => {
        this.setState({
            txtRoomname: "",
            txtCapacity: "",
            txtRoomtype: "0",
            txtTPrice: "",
            txtNPrice: 0,
            listImg: [],
            listFiles: [],
        });
        document.getElementById('form-add-room').reset();
    }

    imageHandler = (e) => {

        /* Storage List Files */
        var newList = Array.from(e.target.files);
        var oldList = Array.from(this.state.listFiles);
        for (var i = 0; i < oldList.length; i++) {
            newList.push(oldList[i]);
        }
        this.setState({
            listFiles: newList,
        })


        /* Load Files to Preview */
        if (e.target.files) {

            /* Get files in array form */
            const files = Array.from(e.target.files);

            /* Map each file to a promise that resolves to an array of image URI's */
            Promise.all(files.map(file => {
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }));
            }))
                .then(images => {

                    /* Save old state */
                    var oldFiles = this.state.listImg;
                    for (var i = 0; i < oldFiles.length; i++) {
                        images.push(oldFiles[i]);
                    }

                    /* Once all promises are resolved, update state with image URI array */
                    this.setState({ listImg: images })

                }, error => {
                    console.error(error);
                });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var ok = true;

        /* sua logic khuc nay lai */
        if (document.getElementById('roomname').value === "") {
            document.getElementById('roomnameNoti').innerHTML = "(*) Bạn không được để trống tên phòng.";
            ok = false;
        }
        else {
            document.getElementById('roomnameNoti').innerHTML = "";
        }

        if (document.getElementById('roomtype').value === "") {
            document.getElementById('roomtypeNoti').innerHTML = "(*) Bạn không được để trống loại phòng.";
            ok = false;
        }
        else {
            document.getElementById('roomtypeNoti').innerHTML = "";
        }

        if (document.getElementById('capacity').value === "") {
            document.getElementById('capacityNoti').innerHTML = "(*) Bạn không được để trống số người.";
            ok = false;
        }
        else {
            document.getElementById('capacityNoti').innerHTML = "";
        }

        if (document.getElementById('price').value === "") {
            document.getElementById('priceNoti').innerHTML = "(*) Bạn không được để trống giá phòng.";
            ok = false;
        }
        else {
            document.getElementById('priceNoti').innerHTML = "";
        }

        if (this.state.listImg.length === 0) {
            document.getElementById('imageNoti').innerHTML = "(*) Hãy chọn ít nhất một ảnh để miêu tả về phòng.";
            ok = false;
        }
        else {
            document.getElementById('imageNoti').innerHTML = "";
        }

        if (ok === true) {
            let data = document.getElementById("form-add-room");
            let params = new FormData(data);
            params.append("IDhost", localStorage.getItem('iduser'));
            var files = Array.from(this.state.listFiles);
            for (var i = 0; i < files.length; i++) {
                params.append("txtImageroom[]", files[i]);
            }
            const api = new hostAPI();
            api.addRoom(params)
                .then(response => {
                    if (response === 200) {
                        alert("Thêm phòng thành công!");
                        this.resetComponent();
                        this.props.close();
                    }
                    else {
                        alert("Thêm phòng thất bại!");
                        this.resetComponent();
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    removeImageReview = (e) => {
        e.preventDefault();
        var index = e.target.value;
        var images = this.state.listImg;
        var List = Array.from(this.state.listFiles);
        List.splice(index, 1);
        images.splice(index, 1);
        this.setState({
            listImg: images,
            listFiles: List,
        });
    }

    Cancel = (e) => {
        e.preventDefault();
        this.props.close();
        this.resetComponent();
    }

    render() {
        return (
            <div className="col-md-12">
                <p className="title-add-room">THÊM PHÒNG</p>
                <form id="form-add-room" onSubmit={this.handleSubmit}>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Tên phòng</label>
                            <div className="col-md-12 input-group">
                                <input id="roomname" className="form-control" placeholder="Tên Phòng..." type="text" name="txtRoomname" value={this.state.txtRoomname} onChange={this.changeHandler} />
                            </div>
                            <label id="roomnameNoti" className="col-md-12  notification"></label>
                        </div>
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Loại phòng</label>
                            <div className="col-md-12 input-group">
                                <select id="roomtype" name="txtRoomtype" className="form-control" value={this.state.txtRoomtype} onChange={this.changeHandler}>
                                    <option value="">--Chọn loại phòng--</option>
                                    <option value="1">Phòng đơn</option>
                                    <option value="2">Phòng đôi</option>
                                    <option value="3">Phòng tập thể</option>
                                    <option value="4">Phòng gia đình</option>
                                    <option value="5">Mini house</option>
                                    <option value="6">Home stay</option>
                                </select>
                            </div>
                            <label id="roomtypeNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Số lượng người</label>
                            <div className="col-md-12 input-group">
                                <input id="capacity" className="form-control" placeholder="Số lượng người..." type="number" name="txtCapacity" value={this.state.txtCapacity} onChange={this.changeHandler} />
                            </div>
                            <label id="capacityNoti" className="col-md-12  notification"></label>
                        </div>
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Giá tiền</label>
                            <div className="col-md-12 input-group">
                                <NumberFormat id="price" thousandSeparator={true} className="form-control" placeholder="Giá tiền..." type="text" name="txtTPrice" value={this.state.txtTPrice} onChange={this.changeHandler} />
                                <input type="hidden" name="txtNPrice" value={this.state.txtNPrice} />
                                <span className="input-group-addon" id="basic-addon2">VND</span>
                            </div>
                            <label id="priceNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-12">
                            <label className="col-md-12 control-label">Tiện ích</label>
                            {
                                this.state.listAllConv.map((item, index) =>
                                    <div key={index} className="col-md-3">
                                        <input className="checkbox" type="checkbox" name="txtListConvenient[]" value={item.id_conv} />
                                        <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="icon" />
                                        <span className="value-checkbox" >{item.name_conv}</span>
                                    </div>
                                )
                            }
                            <label id="convenientNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-12">
                            <label className="col-md-12 control-label">Hình ảnh phòng</label>
                            <div className="col-md-12">
                                {
                                    this.state.listImg.map((url, index) =>
                                        <div key={index} className="col-md-2">
                                            <label>
                                                <img className="host-icon-preview" src={url} alt="add-img" />
                                            </label>
                                            <button className="btn-remove-img" value={index} onClick={this.removeImageReview}></button>
                                        </div>
                                    )
                                }
                                <input id="room-img" type="file" multiple accept="image/*" onChange={this.imageHandler} />
                                <div className="col-md-2">
                                    <label htmlFor="room-img">
                                        <img className="host-icon-add-img" src={addlogo} alt="add-img" />
                                    </label>
                                </div>
                            </div>
                            <label id="imageNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="col-md-3 col-md-offset-9">
                            <button type="submit" className="btn-submit-add-room">Thêm</button>
                            <button className="btn-close-add-room" onClick={this.Cancel} >Hủy</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
