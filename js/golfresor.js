import { getData }  from "./api.js";

const map = L.map("map").setView([62.0, 15.0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);




const startInput = document.getElementById("start");
const priceInput = document.getElementById("price");
const priceValue = document.getElementById("price-value");
const playersInput = document.getElementById("players");
const checkboxes = document.querySelectorAll(".check-option input");
const resultat = document.getElementById("resultat");

let golfbanor = [];
let golfData = [];





function uppdateraPris (){
  priceValue.textContent = priceInput.value + " kr";

}

function hamtaPris(prisText){

  if(prisText === null){
    return null;
  }

  if (prisText.includes("PERMANENT")){
    return null;
  }

  if (prisText.includes("Har ej")){
    return null;
  }

  if (prisText.includes("-")){
    const delar = prisText.split("-");
    return Number(delar[0]);
  }
  return Number(prisText);
}



function filtreraGolfbanor () {
  const sokText = startInput.value.toLowerCase ();
  const maxPris = Number(priceInput.value);

  const filtreradeGolfbanor = golfbanor.filter(function (golfbana){
    
    const matcharNamn =
     golfbana.name.toLowerCase().includes(sokText);

     let pris = null; 
     
     if (golfbana.extraData) {
   pris = hamtaPris(golfbana.extraData.greenfee_weekday_18); 

   }
   
   let matcharPris = true;

    if (maxPris > 0) {
      matcharPris = pris !== null && pris <= maxPris;
    }
  

  console.log(golfbana.name, pris);

  return matcharNamn && matcharPris;

  });

  console.log("Sökning:", sokText);
  console.log("Maxpris:", maxPris);
  console.log("Filtrerade golfbanor:", filtreradeGolfbanor);
  
  visaGolfbanor(filtreraGolfbanor);

  

 
}

function visaGolfbanor (lista){
  resultat.innerHTML = "";

  if (lista.length === 0) {
    resultat.innerHTML = "<p>Inga golfbanor hittades!<p>";
    return;
  }

  for (let i = 0; i < lista.length; i ++){
    const golfbana = lista[i];

    const kort = document.createElement ("article");

    kort.innerHTML = `
    <h3>${golfbana.name}</h3>
    <p>Pris: ${golfbana.extraData ? golfbana.extraData.greenfee_weekday_18: "Pris saknas"} kr</p>`;

    resultat.append(kort);
  }
}












function start (){

  startInput.addEventListener ("input", filtreraGolfbanor);

  priceInput.addEventListener("input", function (){
    uppdateraPris();
    filtreraGolfbanor();
  });

  playersInput.addEventListener("change", filtreraGolfbanor);

  for(let i = 0; i < checkboxes.length; i ++){
    checkboxes[i].addEventListener("change", filtreraGolfbanor);
  }
  
}

function hamtaGolfbanor() {
  getData ("establishment", { descriptions: "golfbana" })
  .then (function (data){
    golfbanor = data;

    console.log("Alla golfbanor:", golfbanor);

    kopplaData();
    filtreraGolfbanor();
   
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


