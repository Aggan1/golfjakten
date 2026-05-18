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

let golfbanor = [];
let golfData = [];


function uppdateraPris (){
  priceValue.textContent = priceInput.value + " kr";

}

function filtreraGolfbanor () {
  const sokText = startInput.value.toLowerCase ();
  const maxPris = Number(priceInput.value);

  const filtreraGolfbanor = golfbanor.filter(function (golfbana){
    return golfbana.name.toLowerCase().includes(sokText)
  });

  console.log("Sökning:", sokText);
  console.log("Maxpris:", maxPris);
  console.log("Filtrerade golfbanor:", filtreraGolfbanor);
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

    filtreraGolfbanor();
  });
}

function golfData (){
  return fetch ("data/golf-data.json")

  .then(function (response) {
    return response.json ();
  })

  .then (function (data){
    golfData = data;

    console.log("Golf-data från json:", golfData);
  });
}

uppdateraPris();
start();
hamtaGolfbanor();


