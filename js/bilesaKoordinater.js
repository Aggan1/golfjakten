


export function hamtaKoordinater(plats){
    const url = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(plats);
    return fetch (url)
    .then(function (response){
        return response.json();
    })

    .then (function (data){
        if(data.length === 0){
            return null;
        }

        return{
            lat: Number(data[0].lat),
            lng: Number(data[0].lon)
        };
    });
}

export function bilRutt(punkter){
    let koordinater = "";

    for (let i = 0; i < punkter.length; i++){
        koordinater += punkter[i].lng + "," + punkter[i].lat;

        if (i < punkter.length - 1){
            koordinater += ";";
        }
    }

    const url = "https://router.project-osrm.org/route/v1/driving/" + koordinater + "?overview=full&geometries=geojson";

    return fetch(url)
    .then(function (response){
        return response.json();
    })

    .then(function (data) {
        if (!data.routes || data.routes.length === 0) {
       return null;

        }
        return{
            tidMinuter: Math.round(data.routes[0].duration / 60), 
            avstandkm: Math.round(data.routes[0].distance / 1000),
            koordinater: data.routes[0].geometry.coordinates
        };
    });
}