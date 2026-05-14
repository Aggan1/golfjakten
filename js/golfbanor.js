import { getData } from "./api.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { showCourses, showDetails } from "./renderGolfbanor.js";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const showButton = document.getElementById("visa-fler");
const hideButton = document.getElementById("hide");

let courses = [];
let visibleCount = 6;

function renderCourses() {
    showCourses(courses, visibleCount, golfList, showButton, hideButton, function (bana) {
        showDetails(bana, golfDetails);
    });
}

function showMore() {
    visibleCount = visibleCount + 6;
    renderCourses();
}

function hideCourses() {
    visibleCount = 6;
    renderCourses();
}

// Startar själva sidan
function init() {
    Promise.all([
        getData("establishment", { descriptions: "golfbana" }),
        getExtraData()
    ])
        .then(function (resultat) {
            const merged = mergaGolfdata(resultat[0], resultat[1]);
            courses = merged;
            renderCourses();
        });
    showButton.addEventListener("click", showMore);
    hideButton.addEventListener("click", hideCourses);
}

init();