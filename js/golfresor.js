import { getData }  from "./api.js";

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

let golfbanor = [];
let golfData = [];
let markers = [];
let aktuellResa = [];

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

    if (tema === "budget"){
      const pris = hamtaPris(golfbana.extraData.greenfee_weekday_18);

      if(pris === null || pris > 600){
        return false;
      }
    }

    if (tema === "training"){
      if (golfbana.extraData.driving_range !== true && golfbana.extraData.putting_green !== true){
        return false;
      }
    }
    if (tema === "food"){
      if (golfbana.extraData.restaurant !== true){
        return false;
      }
    }
  }
  return true;
}

function blandaLista (Lista){
  const blandadLista = [...Lista];

  for (let i = blandadLista.length - 1; i > 0; i --){
    const slumpIndex = Math.floor (Math.random () * (i + 1));
    const tillfallig = blandadLista[i];

    blandadLista[i] = blandadLista[slumpIndex];
    blandadLista[slumpIndex] = tillfallig;
  }
  return blandadLista;
}


function skapaGolfresa(){
  const maxPris = Number(priceInput.value);
  const antalBanor = 1
  const teman = hamtaValdaTeman();

  let Filtrerade = golfbanor.filter(function(golfbana){
    if (!golfbana.extraData){
      return false
    }

    const pris = hamtaPris(golfbana.extraData.greenfee_weekday_18);

    if (pris === null || pris > maxPris){
      return false 
    }
    if (teman.length > 0 && ! matcharTeman (golfbana, teman)){
      return false
    }
    return true;
  });

  Filtrerade = blandaLista(Filtrerade);

  aktuellResa = Filtrerade.slice(0, antalBanor);

  visaGolfresa(aktuellResa);
  visaGolfbanorPaKarta(aktuellResa);
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
    resultat.innerHTML= "";

    if (lista.length === 0){
      tripSummary.textContent = "Inga golfbanor matchade dina val.";
      resultat.innerHTML = "<p>Ingen golfresa kunde skapas.</p>";
      return;
    }

    const totalPris = raknaTotalPris(lista);

    tripSummary.textContent = "Din golfresa innehåller " + lista .length + " banor och kostar ungefär " + totalPris + "kr i greenfee. ";

    for ( let i = 0 ; i < lista.length; i++){
      const golfbana = lista[i];
      const pris = golfbana.extraData.greenfee_weekday_18;

      const kort = document.createElement("article");
      kort.classList.add ("resa-kort");
   

    kort.innerHTML = `
    <div class ="resa-header">
    <span>GOLFBANA</span>
    <h3>${golfbana.name}</h3>
    </div>

    <div class="resa-info">
    <p><strong>Start: </strong></p>
    <p><strong>Stopp: </strong/>Kafé /restauranglängs vägen</p>
    <p><strong>Pris: </strong/>${pris}</p>
    <p><strong>Plats: </strong>${golfbana.city || ""}, ${golfbana.province || ""}</p>
    <p><strong>Antal hål:</strong>${golfbana.extraData.holes || "18"} hål</p> 
    </div>
    
    <button class= "map-btn" type = "button"> Spara resa </button>`;


    resultat.append (kort);
  }
 }

function visaGolfbanorPaKarta(lista) {

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
  });

  generateBtn.addEventListener("click", skapaGolfresa);
  
}

function hamtaGolfbanor() {
  getData ("establishment", { descriptions: "golfbana" })
  .then (function (data){
    golfbanor = data;

    console.log("Alla golfbanor:", golfbanor);

    kopplaData();
    skapaGolfresa();
   
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


uppdateraPris();
start();

getGolfData().then(function (){
  hamtaGolfbanor();
});


