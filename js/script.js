const url = "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=activity&method=getall&descriptions=golfbana";

fetch(url)

    .then(response => response.json())

    .then(data => {

        console.log("SMAPI data:", data);

    })

    .catch(error => {

        console.log("Fel vid hämtning:", error);

    });