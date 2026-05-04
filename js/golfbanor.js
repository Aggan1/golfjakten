const url =
    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=establishment&method=getall&descriptions=golfbana";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const showButton = document.getElementById("visa-fler");
const hideButton = document.getElementById("hide");

let courses = [];
let visibleCount = 6;

// Hämtar golfbanorna från SMAPI
function getGolfbanor() {
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.header.status === "OK") {
                return data.payload;
            } else {
                return [];
            }
        })
        .catch(function (error) {
            console.log("Fel vid SMAPI:", error);
            return [];
        });
}

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

// Visar golfbanorna på sidan
function showCourses(golfbanor) {
    golfList.innerHTML = "";

    for (let i = 0; i < visibleCount && i < golfbanor.length; i++) {
        const bana = golfbanor[i];

        const kort = document.createElement("article");
        kort.classList.add("golf-card");

        let antalHal = "18 hål";
        let bantyp = "Golfbana";

        if (bana.extra !== null) {
            if (bana.extra.holes) {
                antalHal = bana.extra.holes;
            }

            if (bana.extra.course_type) {
                bantyp = bana.extra.course_type;
            }
        }

        kort.innerHTML = `
            <div class="course-img"></div>

            <div class="course-info">
                <h3>${bana.name}</h3>
                <p>${bana.city}, ${bana.province}</p>
                <p>${antalHal}</p>
                <p>${bana.price_range || "Pris saknas"} · ${bantyp}</p>
            </div>

            <span class="course-arrow">›</span>
        `;

        kort.addEventListener("click", function () {
            showDetails(bana);

            const allaKort = document.querySelectorAll(".golf-card");

            for (let k = 0; k < allaKort.length; k++) {
                allaKort[k].classList.remove("active");
            }

            kort.classList.add("active");
        });

        golfList.appendChild(kort);
    }

    if (golfbanor.length <= 6) {
        showButton.style.display = "none";
        hideButton.style.display = "none";
    } else {
        showButton.style.display = "block";

        if (visibleCount > 6) {
            hideButton.style.display = "block";
        } else {
            hideButton.style.display = "none";
        }
    }
}

// Visa detaljer för golfbana när man klickar på den i listan
function showDetails(bana) {
    let extraInfo = "<p>Ingen extra info.</p>";

    if (bana.extra !== null) {
        extraInfo = `
            <p><strong>Greenfee vardag:</strong> ${bana.extra.greenfee_weekday || "-"}</p>
            <p><strong>Greenfee helg:</strong> ${bana.extra.greenfee_weekend || "-"}</p>
            <p><strong>Skick:</strong> ${bana.extra.course_condition || "-"}</p>
            <p><strong>Driving range:</strong> ${bana.extra.driving_range ? "Ja" : "Nej"}</p>
            <p><strong>Restaurang:</strong> ${bana.extra.restaurant ? "Ja" : "Nej"}</p>
        `;
    }

    golfDetails.innerHTML = `
        <h3>${bana.name}</h3>
        <p>${bana.city}, ${bana.municipality}</p>
        <p>${bana.abstract || "Ingen beskrivning"}</p>
        ${extraInfo}
    `;
}

function showMore() {
    visibleCount = visibleCount + 6;
    showCourses(courses);
}

function hideCourses() {
    visibleCount = 6;
    showCourses(courses);
}

// Startar själva sidan
function init() {
    Promise.all([getGolfbanor(), getExtraData()])
        .then(function (resultat) {
            const merged = mergaGolfdata(resultat[0], resultat[1]);
            courses = merged;
            showCourses(courses);
        });

    showButton.addEventListener("click", showMore);
    hideButton.addEventListener("click", hideCourses);
}

init();