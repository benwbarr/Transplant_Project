    function createMap(Hospitals) {

    var margin = {top: 20, right: 20, bottom: 20, left: 100},
        width = 600 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#map-id")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        minZoom: 0,
        zoomOffset: -1,
        tileSize:512,
        id: "streets-v11",
        accessToken: API_KEY
    });

        // Create a baseMaps object to hold the lightmap layer
        var baseMaps = {
            "Map": lightmap
        };

        // Create an overlayMaps object to hold the Hospitals and States Info layer
        var overlayMap = {
            "Hospital Locations": Hospitals,
        };


        // Create the map object with options
        var map = L.map("map-id", {
            center: [38.642763, -98.327818],
            zoom: 5,
            layers: [lightmap, Hospitals,]
        });
// Load in geojson data
    var geoData = "../Resources/State.geojson";

    var geojson;

// Grab data with d3
    d3.json(geoData, function(data) {



        // Create a new choropleth layer
        geojson = L.choropleth(data, {


                style: {
                    // Border color
                    color: "#b10026",
                    weight: 5,
                    fillColor: "#82b8d8",
                    fillOpacity: 0.5
                },


        }).addTo(map);
    })
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(map);
}





    function createMarkers(data) {

        // Pull the "locations" property off of data.data
        var locations = data.data.locations;

        // Initialize an array to hold Hospital markers
        var HospitalMarkers = [];

        // Loop through the Hospitals array
        for (var index = 0; index < data.data.locations.length; index++) {
            var loc = data.data.locations[index];

            var Icon = L.icon({
                iconUrl: 'images/icon.png',

                iconSize: [30, 30], // size of the icon
            });

            // For each Hospital, create a marker and bind a popup with the Hospital's name

            locations.Link

            var HospitalMarker = L.marker([loc.Latitude, loc.Longitude], {icon: Icon})
                .bindPopup('<h2 style="background-color: #d8dde3;"><center><pre><u><b>Hospital Name: ' + '</b></center></u></h2>' +
                    "<h3 style=\"background-color: #d8dde3;\"><center>" + loc.Hospital_Name + '</center><h3>' + '<hr>' +
                    '</pre >'  + '<h2 style="background-color: #d8dde3;"><center><pre><u><b>Hospital Address: ' + '</b></center></u></h2>' + '</pre>'  +
                    "<h3 style=\"background-color: #d8dde3;\"><center>" + loc.Address + '</center><h3>' + '<hr>' +
                    '<h2 style="background-color: #d8dde3;"><center><pre><u><b>Hospital Website: ' + '</b></center></u></h2>' + '</pre>' +
                    "<h3 style=\"background-color: #d8dde3;\"><center>" + "<a href=" + loc.link  + " >Link</a>" + '</center><h3>', {
                    maxWidth: 550

                });

            // Add the marker to the HospitalMarkers array
            HospitalMarkers.push(HospitalMarker);
        }

        // Create a layer group made from the Hospital markers array, pass it into the createMap function
        createMap(L.layerGroup(HospitalMarkers));

    }


// Perform call to the json to get  information. Call createMarkers when complete
    d3.json("../Resources/mapjson.json", createMarkers);

