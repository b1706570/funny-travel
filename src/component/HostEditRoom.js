import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import hostAPI from '../api/hostAPI';
import config from '../config.json';
import addlogo from '../icons/add-logo.png';

export default class HostEditRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtIDRoom: "",
            txtRoomname: "",
            txtCapacity: "",
            txtRoomtype: "",
            txtTPrice: "",
            txtNPrice: 0,
            txtListConvenients: [],
            listConvAvailable: [],
            listAllConv: [],
            listOldImg: [],
            listImg: [],
            listFiles: [],
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.ChooseImg = this.ChooseImg.bind(this);
        this.removeImageReview = this.removeImageReview.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.ChangeConv = this.ChangeConv.bind(this);
        this.Cancel = this.Cancel.bind(this);
    }

    componentDidMount() {
        if (Object.entries(this.props.data).length !== 0) {
            var textPrice = new Intl.NumberFormat().format(this.props.data.price_room);
            var listconv = this.props.data.convenients_room.split(";");
            listconv.splice(listconv.length - 1, listconv.length);
            var listimg = this.props.data.images_room.split(";");
            listimg.splice(listimg.length - 1, listimg.length);
            const api = new hostAPI();
            api.getAllConvenient()
                .then(response => {
                    this.setState({
                        txtIDRoom: this.props.data.id_room,
                        txtRoomname: this.props.data.name_room,
                        txtCapacity: this.props.data.capacity_room,
                        txtRoomtype: this.props.data.type_room,
                        txtTPrice: textPrice,
                        txtNPrice: this.props.data.price_room,
                        listConvAvailable: listconv,
                        listAllConv: response,
                        listOldImg: listimg,
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        }
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

    ChangeConv = (e) => {
        var id = e.target.value;
        var list = this.state.listConvAvailable;
        if (list.indexOf(id) === -1) {
            list.push(id);
        }
        else {
            list.splice(list.indexOf(id), 1);
        }
        this.setState({ listConvAvailable: list });
    }

    ChooseImg = (e) => {

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

        if (this.state.txtRoomname === "") {
            document.getElementById('roomnameeditNoti').innerHTML = "(*) B???n kh??ng ???????c ????? tr???ng t??n ph??ng.";
            ok = false;
            console.log(this.state.txtRoomname);
        }
        else {
            document.getElementById('roomnameeditNoti').innerHTML = "";
        }

        if (this.state.txtRoomtype === "") {
            document.getElementById('roomtypeeditNoti').innerHTML = "(*) B???n kh??ng ???????c ????? tr???ng lo???i ph??ng.";
            ok = false;
        }
        else {
            document.getElementById('roomtypeeditNoti').innerHTML = "";
        }

        if (this.state.txtCapacity === "") {
            document.getElementById('capacityeditNoti').innerHTML = "(*) B???n kh??ng ???????c ????? tr???ng s??? ng?????i.";
            ok = false;
        }
        else {
            document.getElementById('capacityeditNoti').innerHTML = "";
        }

        if (this.state.txtNPrice === "") {
            document.getElementById('priceeditNoti').innerHTML = "(*) B???n kh??ng ???????c ????? tr???ng gi?? ph??ng.";
            ok = false;
        }
        else {
            document.getElementById('priceeditNoti').innerHTML = "";
        }

        if (this.state.listConvAvailable.length === 0) {
            document.getElementById('convenienteeditNoti').innerHTML = "(*) B???n kh??ng ???????c ????? tr???ng c??c ti???n ??ch c???a ph??ng.";
            ok = false;
        }
        else {
            document.getElementById('convenienteeditNoti').innerHTML = "";
        }

        if (this.state.listImg.length === 0 && this.state.listOldImg.length === 0) {
            document.getElementById('imageeditNoti').innerHTML = "(*) H??y ch???n ??t nh???t m???t ???nh ????? mi??u t??? v??? ph??ng.";
            ok = false;
        }
        else {
            document.getElementById('imageeditNoti').innerHTML = "";
        }

        if (ok === true) {
            let params = new FormData();
            params.append("txtIDRoom", this.state.txtIDRoom);
            params.append("txtRoomname", this.state.txtRoomname);
            params.append("txtRoomtype", this.state.txtRoomtype);
            params.append("txtRoomprice", this.state.txtNPrice);
            params.append("txtCapacity", this.state.txtCapacity);
            var files = Array.from(this.state.listFiles);
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    params.append("txtImageroom[]", files[i]);
                }
            }
            var oldImg = Array.from(this.state.listOldImg);
            if (oldImg.length > 0) {
                for (var x = 0; x < oldImg.length; x++) {
                    params.append("txtOldImage[]", oldImg[x]);
                }
            }
            var conv = Array.from(this.state.listConvAvailable);
            for (var z = 0; z < conv.length; z++) {
                params.append("txtListConv[]", conv[z]);
            }
            const api = new hostAPI();
            api.editRoom(params)
                .then(response => {
                    if (response === 200) {
                        alert("C???p nh???t ph??ng th??nh c??ng!");
                        this.props.close();
                        window.location.reload();
                    }
                    else {
                        alert("C???p nh???t ph??ng th???t b???i!");
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

    removeOldImageReview = (e) => {
        e.preventDefault();
        var img = e.target.value;
        var list = this.state.listOldImg;
        list.splice(list.indexOf(img), 1);
        this.setState({ listOldImg: list });
    }

    Cancel = (e) => {
        e.preventDefault();
        this.props.close();
    }

    render() {
        if (Object.entries(this.props.data).length === 0)
            return null;
        return (
            <div className="col-md-12">
                <p className="title-add-room">C???P NH???T TH??NG TIN PH??NG</p>
                <form id="form-edit-room">
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">T??n ph??ng</label>
                            <div className="col-md-12 input-group">
                                <input id="roomnameedit" className="form-control" placeholder="T??n Ph??ng..." type="text" name="txtRoomname" value={this.state.txtRoomname} onChange={this.changeHandler} />
                            </div>
                            <label id="roomnameeditNoti" className="col-md-12  notification"></label>
                        </div>
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Lo???i ph??ng</label>
                            <div className="col-md-12 input-group">
                                <select id="roomtypeedit" name="txtRoomtype" className="form-control" value={this.state.txtRoomtype} onChange={this.changeHandler}>
                                    <option value="">--Ch???n lo???i ph??ng--</option>
                                    <option value="1">Ph??ng ????n</option>
                                    <option value="2">Ph??ng ????i</option>
                                    <option value="3">Ph??ng t???p th???</option>
                                    <option value="4">Ph??ng gia ????nh</option>
                                    <option value="5">Mini house</option>
                                    <option value="6">Home stay</option>
                                </select>
                            </div>
                            <label id="roomtypeeditNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">S??? l?????ng ng?????i</label>
                            <div className="col-md-12 input-group">
                                <input id="capacityedit" className="form-control" placeholder="S??? l?????ng ng?????i..." type="number" name="txtCapacity" value={this.state.txtCapacity} onChange={this.changeHandler} />
                            </div>
                            <label id="capacityeditNoti" className="col-md-12  notification"></label>
                        </div>
                        <div className="host-update-form-cluster col-md-6">
                            <label className="col-md-12 control-label">Gi?? ti???n</label>
                            <div className="col-md-12 input-group">
                                <NumberFormat id="priceedit" thousandSeparator={true} className="form-control" placeholder="Gi?? ti???n..." type="text" name="txtTPrice" value={this.state.txtTPrice} onChange={this.changeHandler} />
                                <input type="hidden" name="txtNPrice" value={this.state.txtNPrice} />
                                <span className="input-group-addon" id="basic-addon2">VND</span>
                            </div>
                            <label id="priceeditNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-12">
                            <label className="col-md-12 control-label">Ti???n ??ch</label>
                            {
                                this.state.listAllConv.map((item, index) => {
                                    if (this.state.listConvAvailable.indexOf(item.id_conv) === -1) {
                                        return (
                                            <div key={index} className="col-md-3">
                                                <input className="checkbox" type="checkbox" onChange={this.ChangeConv} value={item.id_conv} />
                                                <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="icon" />
                                                <span className="value-checkbox" >{item.name_conv}</span>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index} className="col-md-3">
                                                <input className="checkbox" type="checkbox" defaultChecked onChange={this.ChangeConv} value={item.id_conv} />
                                                <img className="icon-checkbox" src={config.ServerURL + "/" + item.icon_conv} alt="icon" />
                                                <span className="value-checkbox" >{item.name_conv}</span>
                                            </div>
                                        )
                                    }
                                })
                            }
                            <label id="convenienteeditNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="host-update-form-cluster col-md-12">
                            <label className="col-md-12 control-label">H??nh ???nh ph??ng</label>
                            <div className="col-md-12">
                                {
                                    this.state.listOldImg.map((url, index) =>
                                        <div key={index} className="col-md-2">
                                            <label>
                                                <img className="host-icon-preview" src={config.ServerURL + "/" + url} alt="old-img" />
                                            </label>
                                            <button className="btn-remove-img" value={url} onClick={this.removeOldImageReview}></button>
                                        </div>
                                    )
                                }
                            </div>
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
                                <input id="edit-room-img" type="file" multiple accept="image/*" onChange={this.ChooseImg} />
                                <div className="col-md-2">
                                    <label htmlFor="edit-room-img">
                                        <img className="host-icon-add-img" src={addlogo} alt="add-img" />
                                    </label>
                                </div>
                            </div>
                            <label id="imageeditNoti" className="col-md-12  notification"></label>
                        </div>
                    </div>
                    <div className="form-group one-row-register">
                        <div className="col-md-3 col-md-offset-9">
                            <button className="btn-submit-add-room" onClick={this.handleSubmit}>S???a</button>
                            <button className="btn-close-add-room" onClick={this.Cancel} >H???y</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
