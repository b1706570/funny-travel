import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, MapConsumer } from 'react-leaflet';

export default class ShowAddressInMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 10.0171177, // value default
      long: 105.7659884 //value default
    };
  }

  componentDidMount() {
    if (this.props.lat !== "") {
      this.setState({
        lat: this.props.lat,
        long: this.props.long,
      })
    }
  }

  render() {
    var position = [this.state.lat, this.state.long];
    return (
      <div>
        <div className="col-md-12 home-more-info-content">
          <MapContainer className="ggmap" center={position} zoom={15} scrollWheelZoom={false} >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
            </Marker>
            <MapConsumer>
              {(map) => {
                map.flyTo(position)
                map._onResize()
                return null
              }}
            </MapConsumer>
          </MapContainer>
        </div>
      </div>
    );
  }
}
