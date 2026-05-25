import { getData } from "./api.js";
import { getExtraData, mergaGolfdata } from "./golfData.js";
import { renderGolfdetaljer } from "./renderGolfdetaljer.js";

const detaljInnehall = document.getElementById("detalj-innehall");

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function getFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("from");
}

function setActiveNav() {
    const from = getFromUrl();
    const navLinks = document.querySelectorAll(".nav a");

    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("active");

        if (from === "favoriter" && navLinks[i].getAttribute("href") === "favoriter.html") {
            navLinks[i].classList.add("active");
        }

        if (from === "golfbanor" && navLinks[i].getAttribute("href") === "golfbanor.html") {
            navLinks[i].classList.add("active");
        }
    }
}

function init() {
    const id = getIdFromUrl();

    setActiveNav();

    Promise.all([
        getData("establishment", { descriptions: "golfbana" }),
        getExtraData()
    ])
        .then(function (resultat) {
            const golfbanor = mergaGolfdata(resultat[0], resultat[1]);

            const valdBana = golfbanor.find(function (bana) {
                return bana.id === id;
            });

            renderGolfdetaljer(valdBana, detaljInnehall);
        });
}

init();