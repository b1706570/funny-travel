import config from '../config.json';
import axios from 'axios';

export default class userAPI{
    constructor(){
        this.baseURL=config.ServerURL;
        this.getuser=this.getuser.bind(this);
        this.getallusername=this.getallusername.bind(this);
        this.getallemail=this.getallemail.bind(this);
        this.register=this.register.bind(this);
        this.getInfoUserByID=this.getInfoUserByID.bind(this);
        this.updateInfoByID=this.updateInfoByID.bind(this);
        this.cancelBooking=this.cancelBooking.bind(this);
    }

    getuser(params) {
        const api1 = axios.create({baseURL: this.baseURL});
        return api1.post('/login.php', params)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        })
    }

    getallusername(){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getallusername.php')
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        })
    }

    getallemail(){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getallemail.php')
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        })
    }

    register(params) {
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/register.php', params)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
    }

    getInfoUserByID(params) {
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getinfouserbyid.php', params)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
    }

    updateInfoByID(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/updatememberinfo.php', params)
        .then(response => {
            return response.data[0].code;
        })
        .catch(error => {
            console.log(error);
        });
    }

    cancelBooking(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/processbookingschedule.php', params)
        .then(response => {
            return response.data[0].code;
        })
        .catch(error => {
            console.log(error);
        });
    }
}
