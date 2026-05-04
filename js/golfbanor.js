const url =
    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=establishment&method=getall&descriptions=golfbana";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");
const visaFlerKnapp = document.getElementById("visa-fler");

let allaGolfbanor = [];
let antalVisade = 6;

// Hämta SMAPI
function hamtaGolfbanor() {
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

// Hämta egen JSON
function hamtaExtraData() {
    return fetch("data/golf-data.json")
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log("Fel lokal JSON:", error);
            return [];
        });
}

// Slå ihop data
function mergaGolfdata(smapiData, extraData) {
    return smapiData.map(function (bana) {
        const extraMatch = extraData.find(function (extra) {
            return extra.smapi_id === bana.id;
        });

        return {
            ...bana,
            extra: extraMatch || null
        };
    });
}

// Render lista
function skrivUtGolfbanor(golfbanor) {
    golfList.innerHTML = "";

    const banorAttVisa = golfbanor.slice(0, antalVisade);

    banorAttVisa.forEach(function (bana) {
        const kort = document.createElement("article");
        kort.classList.add("golf-card");

        let antalHal = "18 hål";
        let bantyp = "Golfbana";

        if (bana.extra) {
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
            visaDetaljer(bana);

            document.querySelectorAll(".golf-card").forEach(function (cardItem) {
                cardItem.classList.remove("active");
            });

            kort.classList.add("active");
        });

        golfList.appendChild(kort);
    });

    if (antalVisade >= golfbanor.length) {
        visaFlerKnapp.style.display = "none";
    } else {
        visaFlerKnapp.style.display = "block";
    }
}

// Visa detaljer
function visaDetaljer(bana) {
    let extraInfo = "<p>Ingen extra info.</p>";

    if (bana.extra) {
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

// Visa fler golfbanor
function visaFlerGolfbanor() {
    antalVisade = antalVisade + 6;
    skrivUtGolfbanor(allaGolfbanor);
}

// Init
function init() {
    Promise.all([hamtaGolfbanor(), hamtaExtraData()])
        .then(function (resultat) {
            const merged = mergaGolfdata(resultat[0], resultat[1]);
            allaGolfbanor = merged;
            skrivUtGolfbanor(allaGolfbanor);
        });

    visaFlerKnapp.addEventListener("click", visaFlerGolfbanor);
}

init();