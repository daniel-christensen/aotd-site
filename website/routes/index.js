const express = require('express');
const router = express.Router();

// ------------------------------------------------------------------------
// Retrieve asteroid objects
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xhr = new XMLHttpRequest();
var url = getHTML();
var data;

function getHTML() {
    return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&` +
            `end_date=${getDate()}&api_key=uD7DVxE2eDdhngxoM7UxLU1t48bPFVZT04VsLWbo`
}

function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    
    return yyyy + '-' + mm + '-' + dd;
}

// Called whenever the readyState attribute changes 
xhr.onreadystatechange = function() {
  // Check if fetch request is done
  if (xhr.readyState == 4 && xhr.status == 200) { 
  
    // Parse the JSON string
    parseData(JSON.parse(xhr.responseText));
  }
};

// Picks all needed information from the retrieved JSON
function parseData(json) {
    var list = new Array(json.element_count);
    var date = getDate();
    var parsed = json.near_earth_objects[date];
    for (var i = 0; i < json.element_count; i++) {
        var object = new asteroid(
            parsed[i].nasa_jpl_url,
            parsed[i].id,
            Math.round(parsed[i].estimated_diameter.meters.estimated_diameter_min) + ' Meters - ' + Math.round(parsed[i].estimated_diameter.meters.estimated_diameter_max) + ' Meters',
            Math.round(parsed[i].close_approach_data["0"].miss_distance.lunar) + ' Lunar Distance',
            parsed[i].is_potentially_hazardous_asteroid
        );       
        list[i] = object;
    }
    data = list
}

var asteroid = function(link, id, estD, missD, pD) {
    this.link = link;
    this.id = id;
    this.estD = estD;
    this.missD = missD;
    this.pD = pD;
}

var request = function() {
    xhr.open("GET", url, true);
    xhr.send();
    console.log('An API request to NeoGw was made!');
}

// -----------------------------------------------------------------
// Begin routing
request();

setInterval(request, 1000 * 60 * 30);

router.get('/', (req, res) => {
    res.render('layout', { data: data} );
});

module.exports = router;