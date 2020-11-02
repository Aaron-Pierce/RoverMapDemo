
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

let points = [];

map.on('click', function (e) {
    var marker = new mapboxgl.Marker()
        .setLngLat(e.lngLat)
        .addTo(map);
    points.push(marker)
    lineCoordinates.push([e.lngLat.lng, e.lngLat.lat])
    map.getSource("route").setData({
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates': lineCoordinates
        }
    });
});

let lineCoordinates = []

map.on('load', function () {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': lineCoordinates
            }
        }
    });
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#888',
            'line-width': 8
        }
    });
});