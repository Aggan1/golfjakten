import { getData } from "./api.js";
import { initMap, showMapMarkers, moveToCourse } from "./mapGolfbanor.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { showCourses, showDetails, markActiveCourse } from "./renderGolfbanor.js";
import { getGolfFilterValues, filterGolfbanor } from "./filterGolfbanor.js";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const antalGolfbanor = document.getElementById("antal-golfbanor");
const prisVarde = document.getElementById("pris-varde");

const filterElements = {
    search: document.getElementById("search"),
    area: document.getElementById("landskapFilter"),
    price: document.getElementById("prisFilter"),
    holes: document.getElementById("halFilter"),
    drivingRange: document.getElementById("drivingRange"),
    restaurant: document.getElementById("restaurant"),
    kiosk: document.getElementById("kiosk"),
    chargingStation: document.getElementById("chargingStation"),
    puttingGreen: document.getElementById("puttingGreen"),
    sortering: document.getElementById("sortering")
};

const resetButton = document.getElementById("reset");

let courses = [];

function renderCourses() {
    const filterValues = getGolfFilterValues(filterElements);
    const filteredCourses = filterGolfbanor(courses, filterValues);

    antalGolfbanor.textContent = filteredCourses.length;
    prisVarde.textContent = filterElements.price.value;

    showCourses(filteredCourses, golfList, function (bana) {
        showDetails(bana, golfDetails);
        moveToCourse(bana);
    });

    showMapMarkers(filteredCourses, function (bana) {
        showDetails(bana, golfDetails);
        markActiveCourse(bana);
        moveToCourse(bana);
    });
}

function resetFilters() {
    filterElements.search.value = "";
    filterElements.area.value = "all";
    filterElements.price.value = "1500";
    filterElements.holes.value = "all";
    filterElements.drivingRange.checked = false;
    filterElements.restaurant.checked = false;
    filterElements.kiosk.checked = false;
    filterElements.chargingStation.checked = false;
    filterElements.puttingGreen.checked = false;
    filterElements.sortering.value = "az";

    renderCourses();
}

function addFilterEvents() {
    filterElements.search.addEventListener("input", renderCourses);
    filterElements.area.addEventListener("change", renderCourses);
    filterElements.price.addEventListener("input", renderCourses);
    filterElements.holes.addEventListener("change", renderCourses);
    filterElements.drivingRange.addEventListener("change", renderCourses);
    filterElements.restaurant.addEventListener("change", renderCourses);
    filterElements.kiosk.addEventListener("change", renderCourses);
    filterElements.chargingStation.addEventListener("change", renderCourses);
    filterElements.puttingGreen.addEventListener("change", renderCourses);
    filterElements.sortering.addEventListener("change", renderCourses);

    resetButton.addEventListener("click", resetFilters);
}

// Startar själva sidan
function init() {
    initMap();

    Promise.all([
        getData("establishment", { descriptions: "golfbana" }),
        getExtraData()
    ])
        .then(function (resultat) {
            const merged = mergaGolfdata(resultat[0], resultat[1]);
            courses = merged;
            renderCourses();
        });

    addFilterEvents();
}

init();
