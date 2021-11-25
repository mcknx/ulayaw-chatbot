import React, { Component, useState } from "react";
import {
  GoogleApiWrapper,
  InfoWindow,
  Marker,
  Circle,
  Map,
} from "google-maps-react";

import CurrentLocation from "./Map";

// <ul>
//   {places && places.map((p) => <li key={p.id}>{p.name}</li>)}</ul>)

function Listing({ places }) {
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);

  function onMarkerClick(props, marker, e) {
    setShowingInfoWindow(true);
    setSelectedPlace(props);
    setActiveMarker(marker);
  }

  function onClose(props) {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  }
  console.log(places);
  return (
    <div>
      {places &&
        places.map((p) => {
          <div>
            <Marker onClick={onMarkerClick} name={p.name} />
            <InfoWindow
              marker={activeMarker}
              visible={showingInfoWindow}
              onClose={onClose}
            >
              <div>
                <h4>{selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </div>;
        })}
    </div>
  );
}

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    places: [],
    count: 0,
    type: "hospital",
  };

  onMapReady = (mapProps, map) => this.searchNearby(map, map.center);

  searchNearby = (map, center) => {
    const { google } = this.props;

    const service = new google.maps.places.PlacesService(map);

    // Specify location, radius and place types for your Places API search.
    const request = {
      location: center,
      radius: "5000",
      type: this.state.type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK)
        this.setState({ places: results });
    });
  };

  onMarkerClick = (props, marker, e) => {
    // console.log(props);
    // console.log(marker);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  renderType(type) {
    const coords = { lat: this.props.lat, lng: this.props.lng };
    if (!this.props.loaded) return <div>Loading...</div>;
    return (
      <Map
        google={this.props.google}
        initialCenter={coords}
        onReady={this.onMapReady}
        zoom={12}
      >
        <Circle
          radius={5000}
          center={coords}
          //   onMouseover={() => console.log("mouseover")}
          onClick={() => {
            console.log("clikced");
            if (type === 0) {
              console.log("hospital");
              return this.setState({
                count: 1,
                type: "hospital",
              });
            }

            if (type === 1) {
              console.log("police");
              return this.setState({
                count: 2,
                type: "police",
              });
            }
            if (type === 2) {
              console.log("current");
              return this.setState({
                count: 0,
              });
            }
          }}
          //   onMouseout={() => console.log("mouseout")}
          strokeColor="transparent"
          strokeOpacity={0}
          strokeWeight={5}
          fillColor="#FF0000"
          fillOpacity={0.2}
        />

        {this.state.count === 1 &&
          this.state.places &&
          this.state.places.map((p) => {
            return (
              <Marker
                onMouseover={this.onMarkerClick}
                onMouseout={this.onClose}
                name={p.name}
                position={p.geometry.location}
              />
            );
          })}
        {this.state.count === 2 &&
          this.state.places &&
          this.state.places.map((p) => {
            return (
              <Marker
                onMouseover={this.onMarkerClick}
                onMouseout={this.onClose}
                name={p.name}
                position={p.geometry.location}
              />
            );
          })}
        {/* {console.log(this.state.places)} */}

        {this.state.count === 0 && (
          <Marker
            onMouseover={this.onMarkerClick}
            name={"Current Location"}
            onMouseout={this.onClose}
          />
        )}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClick={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
  render() {
    return (
      <div>
        {this.state.count === 0 && this.renderType(0)}
        {this.state.count === 1 && this.renderType(1)}
        {this.state.count === 2 && this.renderType(2)}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyA6hz3_zGUdW-B6RrjX1zi2nKVfM9sRyjg",
})(MapContainer);
