// Initialize the map with a default view
var map = L.map('map').setView([35.0, -99.0], 4);
// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
}).addTo(map);

//creating layers for the map
fetch('/geojson')
    .then(response => response.json())
    .then(data => {
        // Add the geojson data from the GOES mask table as small red circles
        var goesmaskLayer = L.geoJSON(JSON.parse(data["goes_mask"]), {
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
        });

        // Add the geojson data from the VIIRS mask table as orange polygons
        var viirsMaskLayer = L.geoJSON(JSON.parse(data["viirs_mask"]), {
            style: function(feature) {
                return {color: "orange", weight: 8};
            }
        });

        // Add the layers to the map and to the layers control
        var overlayLayers = {
            "GOES Mask": goesmaskLayer,
            "VIIRS Mask": viirsMaskLayer
        };
        
        L.control.layers({}, overlayLayers).addTo(map);
        goesmaskLayer.addTo(map);
        viirsMaskLayer.addTo(map);
    });