// Global variables for map, layer control, and layers
var map;
var layerControl;
var goesmaskLayer;
var viirsMaskLayer;

// Function to fetch data and update map
function updateMap() {
    // Initialize the map and add tile layer if they don't exist
    if (typeof map === 'undefined') {
        map = L.map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
        }).addTo(map);
    }

    // Recenter and reset zoom level of the map
    map.setView([35.0, -99.0], 4);

    fetch('/geojson')
        .then(response => response.json())
        .then(data => {
            // If layers exist, remove them from map and layer control
            if (typeof goesmaskLayer !== 'undefined') {
                map.removeLayer(goesmaskLayer);
                layerControl.removeLayer(goesmaskLayer);
            }
            if (typeof viirsMaskLayer !== 'undefined') {
                map.removeLayer(viirsMaskLayer);
                layerControl.removeLayer(viirsMaskLayer);
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

            // If layer control exists, remove it
            if (typeof layerControl !== 'undefined') {
                layerControl.remove();
            }

            // Add the layers to the layers control
            var overlayLayers = {
                "GOES Mask": goesmaskLayer,
                "VIIRS Mask": viirsMaskLayer
            };

            // Add new layer control
            layerControl = L.control.layers({}, overlayLayers).addTo(map);
        });
}

// Call updateMap function when page loads
updateMap();

// Add event listener to refresh button to update map when clicked
document.getElementById('refreshButton').addEventListener('click', updateMap);