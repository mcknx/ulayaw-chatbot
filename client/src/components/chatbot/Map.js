import React from "react";
import ReactDOM from "react-dom";

const mapStyles = {
  map1: {
    position: "absolute",
    width: "350px",
    height: "350px",
  },
};

export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);

    // const { lat, lng } = this.props.initialCenter;

    this.state = {
      currentLocation: {
        lat: props.lat,
        lng: props.lng,
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  recenterMap() {
    const map1 = this.map1;
    const current = this.state.currentLocation;
    const google = this.props.google;
    const maps = google.maps;

    if (map1) {
      let center = new maps.LatLng(current.lat, current.lng);
      map1.panTo(center);
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });
        });
      }
    }
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map1;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom,
        }
      );

      // maps.Map() is constructor that instantiates the map
      this.map1 = new maps.Map(node, mapConfig);
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map1(children, (c) => {
      if (!c) return;

      return React.cloneElement(c, {
        map1: this.map1,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      });
    });
  }

  render() {
    const style = Object.assign({}, mapStyles.map1);

    return (
      <div>
        <div style={style} ref="map1">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

CurrentLocation.defaultProps = {
  zoom: 14,
  //   initialCenter: {
  //     lat: 0,
  //     lng: 0,
  //   },
  centerAroundCurrentLocation: false,
  visible: true,
};

export default CurrentLocation;
