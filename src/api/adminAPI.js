import config from '../config.json';
import axios from 'axios';

export default class adminAPI{
    constructor(){
        this.baseURL=config.ServerURL;
        this.getnumberproposal=this.getnumberproposal.bind(this);
        this.getlistproposal=this.getlistproposal.bind(this);
        this.rejectproposal=this.rejectproposal.bind(this);
        this.acceptproposal=this.acceptproposal.bind(this);
        this.getConvenient=this.getConvenient.bind(this);
        this.updateConvenient=this.updateConvenient.bind(this);
        this.deleteConvenient=this.deleteConvenient.bind(this);
        this.addConvenient=this.addConvenient.bind(this);
        this.getTotalPeople=this.getTotalPeople.bind(this);
        this.getAllUser=this.getAllUser.bind(this);
        this.deleteUser=this.deleteUser.bind(this);
    }

    getnumberproposal(){
        const api = axios.create({baseURL: this.baseURL});
        let f = new FormData();
        f.append('type','length')
        return api.post('/getproposal.php',f)
        .then(response => {
            return response.data[0].count;
        })
        .catch(error => {
            console.log(error);
        })
    }

    getlistproposal(){
        const api = axios.create({baseURL: this.baseURL});
        let f = new FormData();
        f.append('type','list')
        return api.post('/getproposal.php',f)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        })
    }

    rejectproposal(param){
        const api = axios.create({baseURL: this.baseURL});
        param.append("type","reject");
        return api.post('/proposalprocessing.php',param)
        .then(response => {
            return response.data[0].code;
        })
        .catch(error => {
            console.log(error);
        })
    }

    acceptproposal(param){
        const api = axios.create({baseURL: this.baseURL});
        param.append("type","accept");
        return api.post('/proposalprocessing.php',param)
        .then(response => {
            return response.data[0].code;
        })
        .catch(error => {
            console.log(error);
        })
    }

    getConvenient(){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getconvenient.php')
        .then(response =>{
            return response.data;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    updateConvenient(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/updateconvenient.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    deleteConvenient(index){
        let params = new FormData();
        params.append("index",index)
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/deteleconvenient.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    addConvenient(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/addconvenient.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getTotalPeople(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/gettotalpeople.php', params)
        .then(response =>{
            return response.data;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getAllUser(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/admingetalluser.php', params)
        .then(response =>{
            return response.data;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    deleteUser(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/deleteuser.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }
}
