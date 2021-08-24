import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, MapConsumer} from 'react-leaflet';
import axios from 'axios';

const apiURL="https://api.opencagedata.com/geocode/v1/json?language=vi&countrycode=vn&limit=1&no_annotations=1&key=50c04b387edd4fbf869af5e69d19a8c3";

export default class GoogleMaps extends Component {
  constructor(props){
    super(props);
    this.state={
      txtAddress: '',
      lat: 10.0171177, // value default
      long: 105.7659884 //value default
    };
    this.getMylocation=this.getMylocation.bind(this);
    this.handleSetmaker=this.handleSetmaker.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }

  componentDidMount(){
    console.log(this.props.address);
    if(typeof this.props.address !== "undefined"){
      console.log(this.props.address);
      this.setState({
        txtAddress: this.props.address,
        lat: this.props.lat,
        long: this.props.long,
      })
    }
  }

  handleChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleClick = () =>{
    var value = document.getElementById("address").value
    console.log(value);
    const api = axios.create({baseURL: apiURL+ '&q=' + value});
    return api.get()
    .then(response => {
      console.log(response.data.results[0].formatted)
      this.setState({
        txtAddress : response.data.results[0].formatted,
        lat: response.data.results[0].geometry.lat,
        long: response.data.results[0].geometry.lng
      });
    })
    .catch(error =>{
      console.log(error);
    })
  }

  getMylocation = () =>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( pos => {
        var latitude=pos.coords.latitude;
        var longtitude=pos.coords.longitude;
        const api = axios.create({baseURL: apiURL+ '&q=' + latitude + "+" + longtitude});
        return api.get()
        .then(response => {
          this.setState({
            txtAddress : response.data.results[0].formatted,
            lat: latitude,
            long: longtitude
          });
        })
        .catch(error =>{
          console.log(error);
        })
      })
    }
    else{
      alert("Không thể phát hiện vị trí của bạn!");
    }
  }

  handleSetmaker = (e) => {
    var {lat, lng} = e.latlng;
    const api = axios.create({baseURL: apiURL+ '&q=' + lat + "+" + lng});
    return api.get()
    .then(response => {
      console.log(response.data.results[0].formatted)
      this.setState({
        txtAddress : response.data.results[0].formatted,
        lat: response.data.results[0].geometry.lat,
        long: response.data.results[0].geometry.lng
      });
    })
    .catch(error =>{
      console.log(error);
    })
  }

  render() {
    var position=[this.state.lat, this.state.long];
    return (
      <div>
        <div className="col-md-7 txtAddr-map">
          <input id="address" className="form-control" value={this.state.txtAddress} placeholder="Địa chỉ..." type="text" name="txtAddress" onChange={this.handleChange}/>
          <input type="hidden" name="lat" value={this.state.lat}/>
          <input type="hidden" name="lng" value={this.state.long}/>
        </div>
        <div className="col-md-2 col-md-offset-9 icon-map">
          <div id="find-location-btn" className=" btn ggmap-addr-btn" onClick={this.handleClick}></div>
          <div id="my-location-btn" className="btn ggmap-addr-btn" onClick={this.getMylocation}></div>
        </div>
        <div className="col-md-7 col-md-offset-4">
          <MapContainer id="map" className="ggmap" center={position} zoom={15} scrollWheelZoom={false} >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
            </Marker>
            <MapConsumer>
              {(map) => {
                map.flyTo(position)
                map.on("click", this.handleSetmaker)
                return null
              }}
            </MapConsumer>
          </MapContainer>
        </div>
      </div>
    );
  }
}
