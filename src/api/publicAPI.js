import config from '../config.json';
import axios from 'axios';

export default class publicAPI {
    constructor() {
        this.baseURL = config.ServerURL;
        this.getRoom = this.getRoom.bind(this);
        this.gethostbyID = this.gethostbyID.bind(this);
        this.getAllConvenient = this.getAllConvenient.bind(this);
        this.getMinMaxPrice = this.getMinMaxPrice.bind(this);
        this.getComment = this.getComment.bind(this);
        this.pushComment = this.pushComment.bind(this);
        this.getCommonInfoHost = this.getCommonInfoHost.bind(this);
        this.getRoomUnavailable = this.getRoomUnavailable.bind(this);
        this.getRoomByID = this.getRoomByID.bind(this);
        this.BookingRoom = this.BookingRoom.bind(this);
        this.ReportComment = this.ReportComment.bind(this);
    }

    getRoom(params) {
        const api = axios.create({ baseURL: this.baseURL });
        return api.post('/getrooms.php', params)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.lof(error);
            })
    }

    gethostbyID(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/gethostbyID.php', params)
        .then(response =>{
            return response.data[0];
        })
        .catch(error =>{
            console.log(error);
        }) 
    }

    getAllConvenient() {
        const api = axios.create({ baseURL: this.baseURL });
        return api.post('/getconvenient.php')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            })
    }

    getMinMaxPrice() {
        const api = axios.create({ baseURL: this.baseURL });
        return api.post('/getmaxminprice.php')
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getComment(params) {
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getcomment.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    pushComment(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/pushcomment.php', params)
            .then(response =>{
                return response.data[0];
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getCommonInfoHost(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getcommoninfohost.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getRoomUnavailable(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getbookingschedule.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getRoomByID(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getrooms.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    BookingRoom(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/addbookingroom.php', params)
            .then(response =>{
                return response.data[0].code;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    ReportComment(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/reportcomment.php', params)
            .then(response =>{
                return response.data[0].code;
            })
            .catch(error =>{
                console.log(error);
            })
    }
}