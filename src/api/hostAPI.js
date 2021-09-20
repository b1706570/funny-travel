import config from '../config.json';
import axios from 'axios';

export default class hostAPI{
    constructor(){
        this.baseURL=config.ServerURL;
        this.gethostbyID=this.gethostbyID.bind(this);
        this.updateHostInfo=this.updateHostInfo.bind(this);
        this.getAllConvenient=this.getAllConvenient.bind(this);
        this.addRoom=this.addRoom.bind(this);
        this.getRoomByHostId=this.getRoomByHostId.bind(this);
        this.getBranch=this.getBranch.bind(this);
        this.deleteRoom=this.deleteRoom.bind(this);
        this.editRoom=this.editRoom.bind(this);
        this.checkIn=this.checkIn.bind(this);
        this.checkOut=this.checkOut.bind(this);
        this.getDataCheckout=this.getDataCheckout.bind(this);
        this.cancelBookingSchedule=this.cancelBookingSchedule.bind(this);
        this.getBookingSchedule=this.getBookingSchedule.bind(this);
        this.confirmBookingSchedule=this.confirmBookingSchedule.bind(this);
        this.rejectBookingSchedule=this.rejectBookingSchedule.bind(this);
        this.getTransactionByOfHost=this.getTransactionByOfHost.bind(this);
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

    deleteRoom(params){
        const api = new axios.create({ baseURL: this.baseURL });
        return api.post("/deleteroom.php", params)
            .then(response =>{
                return response.data[0];
            })
            .catch(error =>{
                console.log(error);
            })
    }

    editRoom(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/editroom.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    checkIn(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/checkin.php', params)
        .then(response =>{
            console.log(response);
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    checkOut(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/checkout.php', params)
        .then(response =>{
            console.log(response);
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getDataCheckout(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getdatacheckout.php', params)
        .then(response =>{
            return response.data;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    cancelBookingSchedule(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/processbookingschedule.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getBookingSchedule(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/getbookingschedule.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    getTransactionByOfHost(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/gettransactionbyhostid.php', params)
            .then(response =>{
                return response.data;
            })
            .catch(error =>{
                console.log(error);
            })
    }

    confirmBookingSchedule(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/processbookingschedule.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    rejectBookingSchedule(params){
        const api = axios.create({baseURL: this.baseURL});
        return api.post('/processbookingschedule.php', params)
        .then(response =>{
            return response.data[0].code;
        })
        .catch(error =>{
            console.log(error);
        })
    }
}