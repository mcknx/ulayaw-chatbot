var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken =
  "pk.eyJ1IjoibWNrZWVuYXNtYSIsImEiOiJja3ZsdGhzM2pjNzliMnB0OTVjbjd6Z2R1In0.hNMFUFqkwa-xTqAMbMiMVA";
var map = new mapboxgl.Map({
  container: "YOUR_CONTAINER_ELEMENT_ID",
  style: "mapbox://styles/mapbox/streets-v11",
});
