import config from '../config.json';
import axios from 'axios';

export default class hostAPI{
    constructor(){
        this.baseURL=config.ServerURL;
        this.gethostbyID=this.gethostbyID.bind(this);
        this.updateHostInfo=this.updateHostInfo.bind(this);
        this.getAllConvenient=this.getAllConvenient.bind(this);
        this.addRoom=this.addRoom.bind(this);
    }

    gethostbyID(id){
        const api = axios.create({baseURL: this.baseURL});
        let f = new FormData();
        f.append("id", id);
        return api.post('/gethostbyID.php',f)
        .then(response =>{
            return response.data[0];
        })
        .catch(error =>{
            console.log(error);
        }) 
    }

    updateHostInfo(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/updatehostinfo.php',params)
        .then(response =>{
            console.log(response);
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getAllConvenient(){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getconvenient.php')
        .then(response =>{
            return response.data;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    addRoom(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/addroom.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getRoomByHostId(params){
        const api = new axios.create({baseURL: this.baseURL});
        return api.post("/getroombyhostid.php", params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getBranch(params){
        const api = new axios.create({ baseURL: this.baseURL });
        return api.post("/getbranchhost.php", params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }
}