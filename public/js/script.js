
// creating  the socket varible 
const socket = io();

// checks if browser support geolocation
if (navigator.geolocation) {

    // set option for high frquency , 5 second delay(timeout) and no caching

    // Use watchPosition to track the users location continuously.
    navigator.geolocation.watchPosition((position) => {

        // destructuring the property of position coords(coordinates)
        /* coords includes all these property =  {
            "accuracy": 609284.118555948,
            "latitude": 28.6130176,
            "longitude": 77.3292032,
            "altitude": null,
            "altitudeAccuracy": null,
            "heading": null,
            "speed": null
        } */

        const { latitude, longitude } = position.coords;

        // Emit the latitude and longitude via a socket with "send-location".
        socket.emit("send-location", { latitude, longitude });


    }, (error) => {
        //  Log any errors to the console
        console.log(error)
    },
        {
            enableHighAccuracy: true, // for high frequency
            maximumAge: 0, // no caching data of user
            timeout: 5000  // dealy 5 second in updating the position
        }
    )
}


// Initialize a map centered at coordinates (0, 0) with a zoom level of 15 using Leaflet.
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Real Tracking"
}).addTo(map);


// Create an empty object markers.
let marker = {};

// When receiving location data via the socket, extract id, latitude, and longitude, 
// and center the map on the new coordinates.

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude])
    // If a marker for the id exists, update its position, otherwise,
    // create a new marker at the given coordinates and add it to the a user disconnects,
    // remove their marker from the map and delete it from markers.

    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude])
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map)
    }
})


socket.on("user-disconnect", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);

        // using delete keyqord it delete keyvalue pair with id
        delete marker[id];
    }
})



