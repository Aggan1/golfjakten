import { getData }  from "./api.js";
import { bilRutt, hamtaKoordinater } from "./bilesaKoordinater.js";
const map = L.map("map").setView([62.0, 15.0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);


const priceInput = document.getElementById("price");
const priceValue = document.getElementById("price-value");
const generateBtn = document.querySelector(".generate-btn");
const checkboxes = document.querySelectorAll(".check-option input");
const resultat = document.getElementById("resultat");
const tripSummary = document.getElementById("trip-summary");
const distanceInput = document.getElementById("distance");
const distanceValue = document.getElementById("distance-value");
const startInput = document.getElementById("start");
const playersInput = document.getElementById("players");


let golfbanor = [];
let golfData = [];
let markers = [];
let aktuellResa = [];
let userLatitude = null;
let userLongitude = null;
let startKoordinater = null;

function uppdateraPris (){
  priceValue.textContent = priceInput.value + " kr";
}

function hamtaPris(prisText){

  if(!prisText){
    return null;
  }

  prisText = String(prisText);

  if (prisText.includes("PERMANENT") || prisText.includes("Har ej")){
    return null;
  }

  if (prisText.includes("-")){
    const delar = prisText.split("-");
    return Number(delar[0]);
  }
  return Number(prisText);
}

function hamtaValdaTeman(){
  const teman = [];

  for (let i = 0; i < checkboxes.length; i ++){
    if (checkboxes[i].checked){
      teman.push(checkboxes[i].value);
    }
  }
  return teman;
}

function matcharTeman (golfbana, teman){
  if (!golfbana.extraData){
    return false;
  }

  for (let i = 0; i < teman.length; i++){
    const tema = teman[i];

    if (tema === "Restaurang" && golfbana.extraData.restaurant !== true) {
        return false;
      }

    if (tema === "Kiosk" && golfbana.extraData.kiosk !== true) {
        return false;
      }
    
    if (tema === "Driving_range" && golfbana.extraData.driving_range !== true){
        return false;
    }

    if (tema === "Putting_green" && golfbana.extraData.putting_green !==true){
      return false;
    }

    if (tema === "Laddplats" && golfbana.extraData.charging_station !== true) {
      return false
    }
  }
  return true;
}

function filtreraGolfbanor(){
  const maxPris = Number(priceInput.value);
  const teman = hamtaValdaTeman();

  const filtrerade = golfbanor.filter(function (golfbana){
    if (!golfbana.extraData){
      return false;
    }

    const pris = hamtaPris(golfbana.extraData.greenfee_weekday_18);

    if (pris === null || pris > maxPris){
      return false;
    }

    if (teman.length > 0 && !matcharTeman(golfbana, teman)){
      return false;
    }

    return true;
  });

  return filtrerade;
}

function raknaTotalPris(lista){
  let totalPris = 0;

  for (let i = 0; i < lista.length; i++){
    const pris = hamtaPris(lista[i].extraData.greenfee_weekday_18);

    if (pris !== null){
      totalPris += pris;
    }
  }

  return totalPris;
}

function visaGolfresa(lista){
  resultat.innerHTML = "";

  if (lista.length === 0){
    tripSummary.textContent = "Inga golfbanor matchade dina val.";
    resultat.innerHTML = "<p>Ingen golfbana kunde visas.</p>";
    return;
  }

  const totalPris = raknaTotalPris(lista);
  const antalSpelare = Number(playersInput.value);
  const totalPrisSpelare = totalPris * antalSpelare;

  tripSummary.textContent = lista.length + " golfbanor matchade dina val. Total greenfee blir ungefär " + totalPrisSpelare + " kr för " + antalSpelare + " spelare.";

  for (let i = 0; i < lista.length; i++){
    const golfbana = lista[i];
    const pris = golfbana.extraData.greenfee_weekday_18;
    const prisNummer = hamtaPris(golfbana.extraData.greenfee_weekday_18);
    const antalSpelare = Number(playersInput.value);
    const totalprisGolfbana = prisNummer * antalSpelare;

    let matText = "Mat saknas";

    if (golfbana.extraData.restaurant === true){
      matText = "Restaurang finns";
    } else if (golfbana.extraData.kiosk === true){
      matText = "Kiosk finns";
    }

    const kort = document.createElement("article");
    kort.classList.add("resa-kort");

    kort.innerHTML = `
    <div class="resa-header">
      <span>GOLFBANA</span>
      <h3>${golfbana.name}</h3>
    </div>

    <div class="resa-info">
      <p><strong>Pris per person: </strong>${pris}</p>
      <p><strong>Totalpris: </strong>${totalprisGolfbana} kr för ${antalSpelare} spelare</p>
      <p><strong>Mat: </strong>${matText}</p>
      <p><strong>Plats: </strong>${golfbana.city || ""}, ${golfbana.province || ""}</p>
      <p><strong>Antal hål: </strong>${golfbana.extraData.holes || "18"} hål</p>
      <p class="restid">Restid: välj startplats för att beräkna.</p>
    </div>
    `;

    resultat.append(kort);

    hamtaTid(golfbana, kort);
  }
}

function uppdateraVisning(){
  const filtrerade = filtreraGolfbanor();

  visaGolfresa(filtrerade);
  visaGolfbanorPaKarta(filtrerade);
}

function visaGolfbanorPaKarta(lista, rutt) {

  for (let i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }
  markers = [];

  for (let i = 0; i < lista.length; i++) {

    const golfbana = lista[i];

    if (golfbana.lat && golfbana.lng){

      const marker = L.marker([
        golfbana.lat, 
        golfbana.lng
      ]).addTo(map);

      marker.bindPopup(` 
        <h3> ${golfbana.name}</h3>`);

        markers.push(marker);
    }
  }
}

function start (){

  priceInput.addEventListener("input", function (){
    uppdateraPris();
    uppdateraVisning();
  });

  playersInput.addEventListener("change", uppdateraVisning);

  for (let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener("change", uppdateraVisning);
  }

  distanceInput.addEventListener("change", function(){
    const distance = distanceInput.value;

    if (distance === distanceInput.max){
      distanceValue.textContent = "Alla avstånd";

      userLatitude = null;
      userLongitude = null;
      startKoordinater = null;

      hamtaGolfbanor();
      return
    }

    distanceValue.textContent = "<=" + distance + " km";

    if (startInput.value !== ""){
      hamtaStartplats();
    } else if (userLatitude === null || userLongitude === null){
      hamtaPosition();
    }else{
      hamtaGolfbanor();
    }

   
  });
   generateBtn.addEventListener("click", function(){
    if (startInput.value !== ""){
      hamtaStartplats();
    }else if (userLatitude === null || userLongitude === null){
      hamtaPosition();
    }else{
      hamtaGolfbanor();
    }
   });
}

function hamtaGolfbanor() {
  const  filters = {
    descriptions: "golfbana"
  };

  if (startKoordinater !== null && distanceInput.value !== distanceInput.max){
    filters.lat = startKoordinater.lat;
    filters.lng = startKoordinater.lng;
    filters.radius = distanceInput.value;
  } else if (userLatitude !== null && userLongitude !== null && distanceInput.value !== distanceInput.max){
    filters.lat = userLatitude;
    filters.lng = userLongitude;
    filters.radius = distanceInput.value;
  }

  getData ("establishment", filters)
  .then (function (data){
    golfbanor = data;

    console.log("Alla golfbanor:", golfbanor);

    kopplaData();
    uppdateraVisning();
   
  });
}

function getGolfData (){
  return fetch ("data/golf-data.json")

  .then(function (response) {
    return response.json ();
  })

  .then (function (data){
    golfData = data;

    console.log("Golf-data från json:", golfData);
  });
}

function kopplaData (){
  
  for (let i = 0; i < golfbanor.length; i ++){
    for (let j = 0; j < golfData.length; j ++){
      if(golfbanor [i].id === golfData[j].smapi_id){
        golfbanor[i].extraData = golfData[j];
      }
    }
  }
  console.log ("Golfbanor med extra data:", golfbanor);
}


function hamtaPosition(){
  navigator.geolocation.getCurrentPosition(sparaMinPosition, visaPostionFel);
}

function sparaMinPosition (position){
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  console.log("Latitud:", userLatitude);
  console.log ("Longitud:", userLongitude);

  hamtaGolfbanor()
}

function visaPostionFel (error){
  console.log ("Kunde inte hämta plats:", error.message);
}


function hamtaStartplats(){
  const startplats = startInput.value;

  if (startplats === ""){
    startKoordinater = null;
    hamtaGolfbanor();
    return;
  }

  hamtaKoordinater(startplats)
  .then (function (koordinater){
    if (koordinater === null){
      tripSummary.textContent = "Kunde inte hitta platsen.";
      return;
    }
    startKoordinater = koordinater;
    hamtaGolfbanor();
  })
}

function hamtaTid( golfbana, kort){
  let startPunkt = null;

  if (startKoordinater !== null){
    startPunkt = startKoordinater;
  } else if (userLatitude !== null && userLongitude !== null){
    startPunkt = {
      lat: userLatitude,
      lng: userLongitude
    };
  }

  if (startPunkt === null){
    return;
  }

  const punkter = [
    startPunkt,
    {
      lat: Number(golfbana.lat),
      lng: Number(golfbana.lng)
    }
  ];

  bilRutt(punkter)
  .then(function(rutt){
    const restidText = kort.querySelector(".restid");

    if (rutt === null){
      restidText.textContent = "Kunde inte beräkna restid.";
      return;
    }
    restidText.textContent = "Restid med bil: ca " + Tid(rutt.tidMinuter) + ".";
  });
}

function Tid(minuter){
  if (minuter < 60){
    return minuter + " minuter";
  }

  const timmar = Math.floor(minuter / 60);
  const resterandeMinuter = minuter % 60;

  if (resterandeMinuter === 0){
    return timmar + " timme";
  }
  return timmar + " tim " + resterandeMinuter + " min";
}

uppdateraPris();
start();

getGolfData().then(function (){
  hamtaGolfbanor();
});
