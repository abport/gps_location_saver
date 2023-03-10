// Initialize the map
var map = L.map("mapid").setView([38.0808, 46.2919], 13);

// Select the save button element
var saveButton = document.querySelector("#save-button");

// Create a marker and add it to the map
var marker = L.marker([38.0808, 46.2919]).addTo(map);

// Add the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
  maxZoom: 18,
}).addTo(map);

function getUTM(lat, lng) {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const toProjection =
    "+proj=utm +zone=" + zone + " +datum=WGS84 +units=m +no_defs";
  const point = proj4(proj4.defs("EPSG:4326"), toProjection, [lng, lat]);
  const easting = point[0];
  const northing = point[1];
  const utmZone = `${zone}${lat > 0 ? "N" : "S"}`;
  return [lat, lng, easting, northing, utmZone];
}

function onLocationFound(e) {
  const { lat, lng } = e.latlng;
  const [Latitude, Longitude, Easting, Northing, UTMZone] = getUTM(lat, lng);
  marker.setLatLng(e.latlng);
  marker
    .bindPopup(
      `Latitude: ${Latitude}<br>Longitude: ${Longitude}<br>Easting: ${Easting}<br>Northing: ${Northing}<br>UTM Zone: ${UTMZone}`
    )
    .openPopup();
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#28a745";
  saveButton.innerHTML = "Save Location";
}

function onLocationError(e) {
  alert(e.message);
}

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

map.on("click", function (e) {
  const { lat, lng } = e.latlng;
  const [Latitude, Longitude, Easting, Northing, UTMZone] = getUTM(lat, lng);
  marker.setLatLng(e.latlng);
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#28a745";
  saveButton.innerHTML = "Save Location";
  marker
    .bindPopup(
      `Latitude: ${Latitude}<br>Longitude: ${Longitude}<br>Easting: ${Easting}<br>Northing: ${Northing}<br>UTM Zone: ${UTMZone}`
    )
    .openPopup();
});

saveButton.addEventListener("click", function () {
  const { lat, lng } = marker.getLatLng();

  const nameField = document.querySelector("#name-field");
  const name = nameField.value;

  const [Latitude, Longitude, Easting, Northing, UTMZone] = getUTM(lat, lng);
  const data = [[Latitude, Longitude, Easting, Northing, UTMZone, name]];
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "\uFEFFLatitude,Longitude,Easting,Northing,UTM Zone,Name\n" +
    data.map((d) => d.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "location.csv");
  document.body.appendChild(link);
  link.click();
  nameField.value = "";
  nameField.focus();
});

// Select the location button element
var locationButton = document.querySelector("#location-button");

// Function to get the user's current location
function getLocation() {
  map.locate({ setView: true, maxZoom: 16 });
}

// Event listener for the location button
locationButton.addEventListener("click", getLocation);

// Function to add a marker with the lat, long, and UTM details for the user's current location
function addLocationMarker(location) {
  const { lat, lng } = location.latlng;
  const [Latitude, Longitude, Easting, Northing, UTMZone] = getUTM(lat, lng);
  const locationMarker = L.marker([lat, lng]).addTo(map);
  locationMarker
    .bindPopup(
      `Latitude: ${Latitude}<br>Longitude: ${Longitude}<br>Easting: ${Easting}<br>Northing: ${Northing}<br>UTM Zone: ${UTMZone}`
    )
    .openPopup();
}

// When the user's location is found, update the marker location
function onLocationFound(e) {
  const { lat, lng } = e.latlng;
  const [Latitude, Longitude, Easting, Northing, UTMZone] = getUTM(lat, lng);
  marker.setLatLng(e.latlng);
  marker
    .bindPopup(
      `Latitude: ${Latitude}<br>Longitude: ${Longitude}<br>Easting: ${Easting}<br>Northing: ${Northing}<br>UTM Zone: ${UTMZone}`
    )
    .openPopup();
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#28a745";
  saveButton.innerHTML = "Save Location";
}

// Event listener for when the user's location is not found
function onLocationError(e) {
  alert(e.message);
}

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);
