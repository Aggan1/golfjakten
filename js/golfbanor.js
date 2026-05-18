import { getData } from "./api.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { showCourses, showDetails } from "./renderGolfbanor.js";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");

let courses = [];

function renderCourses() {
    showCourses(courses, golfList, function (bana) {
        showDetails(bana, golfDetails);
    });
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
}

init();