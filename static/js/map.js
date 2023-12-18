var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

fetch('/geojson')
    .then(response => response.json())
    .then(data => {
        // Add the geojson data from the first table as points
        L.geoJSON(JSON.parse(data["goesmask"])).addTo(map);

        // Add the geojson data from the second table as red polygons
        L.geoJSON(JSON.parse(data["viirs_mask"]), {
            style: function(feature) {
                return {color: "red", weight: 6};
            }
        }).addTo(map);
    });