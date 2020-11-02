
mapboxgl.accessToken = 'pk.eyJ1IjoiYXl5eXlyb24iLCJhIjoiY2tibW95eXBuMWo3aTJzazBrZGJmMDg5MSJ9.-SoXb23oVkwp6Hjigt4Htg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ayyyyron/ckgzv4tze1f3919ps8ny0srqu'
});


map.on('mousemove', function (e) {
    document.getElementById('info').innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        JSON.stringify(e.point) +
        '<br />' +
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat.wrap());
});

map.on('click', function(e) {
    console.log(e.lngLat)
})