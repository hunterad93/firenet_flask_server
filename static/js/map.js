// Initialize the map with a default view
var map = L.map('map').setView([35.0, -99.0], 4);
// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
}).addTo(map);

// Function to fetch data and update map
function updateMap() {
    fetch('/geojson')
        .then(response => response.json())
        .then(data => {
            // If layers exist, remove them
            if (typeof goesmaskLayer !== 'undefined') {
                map.removeLayer(goesmaskLayer);
            }
            if (typeof viirsMaskLayer !== 'undefined') {
                map.removeLayer(viirsMaskLayer);
            }

            // Add the new data to the map as layers
            goesmaskLayer = L.geoJSON(JSON.parse(data["goes_mask"]), {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 2,
                        fillColor: "red",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1
                    });
                }
            }).addTo(map);

            viirsMaskLayer = L.geoJSON(JSON.parse(data["viirs_mask"]), {
                style: function(feature) {
                    return {color: "orange", weight: 8};
                }
            }).addTo(map);

            // Add the layers to the layers control
            var overlayLayers = {
                "GOES Mask": goesmaskLayer,
                "VIIRS Mask": viirsMaskLayer
            };

            // If layer control exists, remove it
            if (typeof layerControl !== 'undefined') {
                layerControl.remove();
            }

            // Add new layer control
            layerControl = L.control.layers({}, overlayLayers).addTo(map);
        });
}

// Call updateMap function when page loads
updateMap();

// Add event listener to refresh button to update map when clicked
document.getElementById('refreshButton').addEventListener('click', updateMap);