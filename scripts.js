var map = L.map('map').fitWorld();

// adds base map 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
}).addTo(map);

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
}

map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
    alert(e.message);
  }
  
  map.on('locationerror', onLocationError);

// locates user and zooms to them on map 
map.locate({setView: true, maxZoom: 16});
