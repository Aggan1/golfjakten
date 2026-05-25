import { getData } from "./api.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { getFavorites } from "./favoriterStorage.js";
import { renderFavoriter } from "./renderFavoriter.js";

const favoritList = document.getElementById("favorit-list");
const antalFavoriter = document.getElementById("antal-favoriter");
const sortering = document.getElementById("sortering");

let allCourses = [];

function getSavedCourses() {
    const favoriteIds = getFavorites();

    return allCourses.filter(function (bana) {
        return favoriteIds.includes(bana.id);
    });
}

function sortCourses(courses) {
    if (sortering.value === "az") {
        courses.sort(function (a, b) {
            return a.name.localeCompare(b.name, "sv");
        });
    }

    if (sortering.value === "za") {
        courses.sort(function (a, b) {
            return b.name.localeCompare(a.name, "sv");
        });
    }

    return courses;
}

function updatePage() {
    let savedCourses = getSavedCourses();
    savedCourses = sortCourses(savedCourses);

    antalFavoriter.textContent = savedCourses.length;

    renderFavoriter(savedCourses, favoritList, updatePage);
}

function init() {
    Promise.all([
        getData("establishment", { descriptions: "golfbana" }),
        getExtraData()
    ])
        .then(function (resultat) {
            allCourses = mergaGolfdata(resultat[0], resultat[1]);
            updatePage();
        });

    sortering.addEventListener("change", updatePage);
}

init();