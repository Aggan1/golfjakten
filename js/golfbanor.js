import { getData } from "./api.js";
import { initMap, showMapMarkers, moveToCourse } from "./mapGolfbanor.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { showCourses, showDetails, markActiveCourse } from "./renderGolfbanor.js";
import { getGolfFilterValues, filterGolfbanor } from "./filterGolfbanor.js";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const antalGolfbanor = document.getElementById("antal-golfbanor");
const mobileAntalGolfbanor = document.getElementById("antal-golfbanor-mobile");
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
const OPEN_COURSE_KEY = "golfjakten_open_golfbana";

let courses = [];

function saveOpenCourse(bana) {
    sessionStorage.setItem(OPEN_COURSE_KEY, bana.id);
}

function openSavedCourse(golfbanor) {
    const savedId = sessionStorage.getItem(OPEN_COURSE_KEY);

    if (savedId === null) {
        return;
    }

    for (let i = 0; i < golfbanor.length; i++) {
        if (golfbanor[i].id === savedId) {
            showDetails(golfbanor[i], golfDetails);
            markActiveCourse(golfbanor[i]);
            moveToCourse(golfbanor[i]);
        }
    }
}

function scrollToMapOnMobile() {
    if (window.innerWidth <= 700) {
        document.querySelector(".karta-section").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function renderCourses() {
    const filterValues = getGolfFilterValues(filterElements);
    const filteredCourses = filterGolfbanor(courses, filterValues);

    antalGolfbanor.textContent = filteredCourses.length;
    mobileAntalGolfbanor.textContent = filteredCourses.length;
    prisVarde.textContent = filterElements.price.value;

    showCourses(filteredCourses, golfList, function (bana) {
        showDetails(bana, golfDetails);
        saveOpenCourse(bana);
        moveToCourse(bana);
        scrollToMapOnMobile();
    });

    showMapMarkers(filteredCourses, function (bana) {
        showDetails(bana, golfDetails);
        saveOpenCourse(bana);
        markActiveCourse(bana);
        moveToCourse(bana);
        scrollToMapOnMobile();
    });

    openSavedCourse(filteredCourses);
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

function clearPopupWhenLeavingPage() {
    const links = document.querySelectorAll(".nav a, .header-btn");

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            sessionStorage.removeItem(OPEN_COURSE_KEY);
        });
    }
}

function setupMobileButtons() {
    const filterButton = document.getElementById("openFilter");
    const sortButton = document.getElementById("openSort");
    const resultButton = document.getElementById("showResultsButton");
    const overlay = document.getElementById("mobileOverlay");
    const filter = document.querySelector(".filter");
    const sortering = document.querySelector(".sortering");

    if (!filterButton || !sortButton || !resultButton || !overlay) {
        return;
    }

    function closeMobileSheets() {
        filter.classList.remove("visible");
        sortering.classList.remove("visible");
        overlay.classList.remove("visible");
    }

    function openFilter() {
        sortering.classList.remove("visible");
        filter.classList.add("visible");
        overlay.classList.add("visible");
    }

    function openSortering() {
        filter.classList.remove("visible");
        sortering.classList.add("visible");
        overlay.classList.add("visible");
    }

    filterButton.addEventListener("click", openFilter);
    sortButton.addEventListener("click", openSortering);
    resultButton.addEventListener("click", closeMobileSheets);
    overlay.addEventListener("click", closeMobileSheets);
    filterElements.sortering.addEventListener("change", closeMobileSheets);
}

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
    clearPopupWhenLeavingPage();
    setupMobileButtons();
}

init();