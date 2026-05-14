const map = L.map("map").setView([62.0, 15.0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

const price = document.getElementById("price");
const priceValue = document.getElementById("price-value");

price.addEventListener("input", function () {
  priceValue.textContent = price.value + " kr";
});

