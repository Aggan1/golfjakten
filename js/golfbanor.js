import { getData } from "./api.js";
import { showCourses, showDetails } from "./renderGolfbanor.js";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const showButton = document.getElementById("visa-fler");
const hideButton = document.getElementById("hide");

let courses = [];
let visibleCount = 6;

// Hämta extra data från JSON fil
function getExtraData() {
    return fetch("data/golf-data.json")
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log("Fel lokal JSON:", error);
            return [];
        });
}

// Mergar datan från SMAPI och JSON så att det kombineras och läggs till för id:t
function mergaGolfdata(smapiData, extraData) {
    const resultat = [];

    for (let i = 0; i < smapiData.length; i++) {
        const bana = smapiData[i];
        let extraInfo = null;

        for (let j = 0; j < extraData.length; j++) {
            if (extraData[j].smapi_id === bana.id) {
                extraInfo = extraData[j];
            }
        }

        bana.extra = extraInfo;
        resultat.push(bana);
    }

    return resultat;
}

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