function ViewChange(state, map) {
    console.log(map)
    //This function is called when a dropdown menu item is selected
    var dropdownMenu = d3.select("#StateDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    if (dataset === "Alabama") {
        map.setView([32.806671, -86.79113], 7);
    } else if (dataset === "Arizona") {
        map.setView([33.729759, -111.431221], 7);
    } else if (dataset === "Alaska") {
        map.setView([61.370716, -152.404419], 7);
    } else if (dataset === "Arkansas") {
        map.setView([34.969704, -92.373123], 7);
    }

}

function InfoChange(select) {
    console.log(select)
    stateSelected = select.value
    //
    // //This function is called when a dropdown menu item is selected
    // var dropdownMenu = d3.select("#StateDataset");
    // // Assign the value of the dropdown menu option to a variable
    // var inputText = dropdownMenu.property("value");

    d3.json('../Resources/mapjson.json', function(data) {
        hospitals = data.data.locations
        stateHospitals = hospitals.filter(hosp => hosp.State === stateSelected)


        hospitalNames = stateHospitals.map(obj => ("Hospital: " + obj ['Hospital_Name'] + "Address: "  + obj ['Address'] + "Link: " +  obj ['link']))
        hospitalAddress = stateHospitals.map(obj => obj['Address'])

        console.log(hospitalNames)

    var list = d3.select(".summary");

    list.html("");

    list.append("li").text(stateSelected);
    list.append("li").text(hospitalNames)

    })
}

function createMap(Hospitals) {
    var margin = {top: 20, right: 20, bottom: 20, left: 100},
        width = 600 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#map2-id")
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
        tileSize: 512,
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
    var map = L.map("map2-id", {
        center: [39.8712, -98.327818],
        zoom: 5,
        layers: [lightmap, Hospitals,]
    });
    lightmap.addTo(map);

    // Load in geojson data
    var geoData = "../Resources/State.geojson";

    var geojson;

    // Grab data with d3
    d3.json(geoData, function (data) {


        // Create a new choropleth layer
        geojson = L.choropleth(data, {

            // q for quartile, e for equidistant, k for k-means
            mode: "q",
            style: {
                // Border color
                color: "#b10026",
                weight: 4,
                fillColor: "#82b8d8",
                fillOpacity: 0
            },


        }).addTo(map);
        console.log(data)
    })


    d3.select("#StateDataset").on("change", function() {
        ViewChange(this, map)
        InfoChange(this)
    } );



       d3.json("../Resources/mapjson.json",InfoChange);


}








        //list.append("li").text(info)




    function createMarkers(data) {

        // Pull the "locations" property off of data.data
        var locations = data.data.locations;

        // Initialize an array to hold Hospital markers
        var HospitalMarkers = [];

        // Loop through the Hospitals array
        for (var index = 0; index < data.data.locations.length; index++) {
            var loc = data.data.locations[index];



            var Icon = L.icon({
                iconUrl: 'images/icon2.png',

                iconSize: [30, 30], // size of the icon
            });

            locations.Link


            var HospitalMarker = L.marker([loc.Latitude, loc.Longitude], {icon: Icon})
                .bindTooltip(loc.Hospital_Name,{
                    permanent: true,
                    direction: 'right'
        }
    );




            // Add the marker to the HospitalMarkers array
            HospitalMarkers.push(HospitalMarker);
        }

        // Create a layer group made from the Hospital markers array, pass it into the createMap function
        createMap(L.layerGroup(HospitalMarkers));

    }


    // Perform call to the json to get  information. Call createMarkers when complete
    d3.json("../Resources/mapjson.json", createMarkers);











