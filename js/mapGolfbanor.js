let map;
let markers = [];

export function initMap() {
    map = L.map("map").setView([57.0, 14.9], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);
}

function createIcon() {
    return L.divIcon({
        className: "golf-marker",
        html: "",
        iconSize: [18, 18]
    });
}

export function showMapMarkers(golfbanor, onMarkerClick) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].remove();
    }

    markers = [];

    for (let i = 0; i < golfbanor.length; i++) {
        const bana = golfbanor[i];

        if (!bana.lat || !bana.lng) {
            continue;
        }

        const marker = L.marker([Number(bana.lat), Number(bana.lng)], {
            icon: createIcon()
        }).addTo(map);

        marker.on("click", function () {
            onMarkerClick(bana);
        });

        markers.push(marker);
    }
}

export function moveToCourse(bana) {
    if (bana.lat && bana.lng) {
        map.setView([Number(bana.lat), Number(bana.lng)], 11);
    }
}