import config from '../config.json';
import axios from 'axios';

export default class publicAPI {
    constructor() {
        this.baseURL = config.ServerURL;
        this.getRoom = this.getRoom.bind(this);
        this.getAllConvenient = this.getAllConvenient.bind(this);
        this.getMinMaxPrice = this.getMinMaxPrice.bind(this);
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
}