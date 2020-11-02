
mapboxgl.accessToken = 'pk.eyJ1IjoiYXl5eXlyb24iLCJhIjoiY2tibW95eXBuMWo3aTJzazBrZGJmMDg5MSJ9.-SoXb23oVkwp6Hjigt4Htg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ayyyyron/ckgzv4tze1f3919ps8ny0srqu',
    center: [-110.792325, 38.407363],
    zoom: 11
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

function typeIndicator() {
    let coordinates = prompt("Enter coordinates in in lng, lat format");
    coordinates = coordinates.replace(" ", "");
    coordinates = coordinates.split(",");
    if (coordinates[0] > 0) {
        alert("If you are in the US, you have probably entered the coordinates in the wrong order. Lng should be first and is negative in the US");
    }
    console.log(coordinates)
    let isConfirmed = confirm(`Add indicator at lng: ${coordinates[0]}, lat: ${coordinates[1]}?`);
    if (isConfirmed) {
        var marker = new mapboxgl.Marker({ "color": "#b40219" })
            .setLngLat([parseFloat(coordinates[0]), parseFloat(coordinates[1])])
            .addTo(map);
    }
}


function degMinSecToDecimal(deg, min, sec) {
    console.log("Converting:", deg, min, sec)
    console.log("Returning", (deg + (min / 60) + (sec / 3600)))
    return deg + (min / 60) + (sec / 3600);
}

function degDecimalMinToDecimal(deg, min) {
    return deg + (min / 60)
}

function openUnitConverter() {
    document.getElementById("unitConverter").style.display = ""
}
function closeUnitConverter() {
    document.getElementById("unitConverter").style.display = "none"
}

function updateConversionsBasedOn(el) {
    let sources = {
        "DMS": ["DMSDeg", "DMSMin", "DMSSec"],
        "DDM": ["DDMDeg", "DDMMin"],
        "Decimal": ["Decimal"]
    }

    let source = "DMS";
    if (el.id.indexOf("DMS") !== -1) source = "DMS"
    else if (el.id.indexOf("DDM") !== -1) source = "DDM"
    else if (el.id.indexOf("Decimal") !== -1) source = "Decimal";

    let sourceValues = [];
    for (let id of sources[source]) {
        console.log(document.getElementById(id))
        sourceValues.push(parseFloat(document.getElementById(id).value) || 0);
    }
    console.log("Source", sourceValues)

    let DMSValues = [];
    let DDMValues = [];
    let DecimalValue = 0;

    if (source === "DMS") {
        DMSValues = sourceValues;
        DecimalValue = degMinSecToDecimal(...sourceValues);
        console.log("Converted successfully: ", DecimalValue)
    } else if (source === "DDM") {
        DDMValues = sourceValues;
        DecimalValue = degDecimalMinToDecimal(...sourceValues);
        console.log("DDM convert", degDecimalMinToDecimal(...sourceValues))
    } else if (source === "Decimal") {
        DecimalValue = sourceValues;
    }

    console.log(DMSValues, DDMValues, DecimalValue)

    document.getElementById("DMSDeg").value = DMSValues[0] || "";
    document.getElementById("DMSMin").value = DMSValues[1] || "";
    document.getElementById("DMSSec").value = DMSValues[2] || "";

    document.getElementById("DDMDeg").value = DDMValues[0] || "";
    document.getElementById("DDMMin").value = DDMValues[1] || "";

    console.log("What is the problem", DecimalValue)
    document.getElementById("Decimal").value = DecimalValue;

}

Array.from(document.getElementsByClassName("convertInput")).forEach(el => {
    console.log(el)
    el.addEventListener("keyup", function (evt) {
        if (!isNaN(evt.key))
            updateConversionsBasedOn(el);
    });
})


let valuesCopied = [];
function copyCoords() {
    let el = document.getElementById("Decimal");
    el.select();
    el.setSelectionRange(0, 9999);
    valuesCopied.push(el.value);
    document.getElementById("saved").innerHTML += 
    `
    <p>${el.value}</p>
    `
    document.execCommand("copy")
}