// (OLD) 
// var map = L.map('map').fitWorld();

// adds base map (OLD)
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     tileSize: 512,
//     zoomOffset: -1,
//     id: 'mapbox/streets-v11',
//     accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
// }).addTo(map);

// Light base map 
var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
    tileSize: 512,
    zoomOffset: -1,
});

// dark base map 
var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
    tileSize: 512,
    zoomOffset: -1,
});

// Alerts user on what they are looking at 
alert('Welcome to my IP location finder, this website will locate where you are based on your IP and give you a radius of where you might be. you can change the background from light or dark on the top right, or recenter your map on the top left.');

var map = L.map('map', {layers:[light]}).fitWorld();

// function to put a pop up of roughly where the user is with a blue circle with the radius of where they may be based on sensor accruacy
function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius <= 200) {
            L.circle(e.latlng, radius, {color: 'yellow'}).addTo(map);
        }
        if (radius <= 100) {
            L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
        }
        else{
            L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
        } //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
    
        // uses sunCalc to get time based on JS date and lat lon 
        var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
        // uses sunCalc to get sunrise horus based on getTime 
        var sunrise = times.sunrise.getHours();
        // uses sunCalc to get sunset horus based on getTime 
        var sunset = times.sunset.getHours();
        

        // This var gets the current time 
        var currentTime = new Date().getHours();
        // if its after sundrise but before sunset make it light ... else make it dark
        if (sunrise < currentTime && currentTime < sunset){
            map.removeLayer(dark);
            map.addLayer(light);
        }
        else {
            map.removeLayer(light);
            map.addLayer(dark);
        }
}

var baseMaps = {
    "Dark": dark,
    "Light": light
};

// Adds dark light base map layer control 
var layerControl = L.control.layers(baseMaps).addTo(map);

L.easyButton('glyphicon-globe', function(bt, map){
    alert('map center is at:' + map.getCenter().toString())
    map.locate({setView: true, maxZoom: 16});
}).addTo(map);

map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
    alert(e.message);
  }
  
  map.on('locationerror', onLocationError);

// locates user and zooms to them on map 
map.locate({setView: true, maxZoom: 16});
