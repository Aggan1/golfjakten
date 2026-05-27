import { isFavorite, toggleFavorite } from "./favoriterStorage.js";

function getFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("from");
}

function getBackLink() {
    const from = getFromUrl();

    if (from === "favoriter") {
        return "favoriter.html";
    }

    return "golfbanor.html";
}

function getBackText() {
    const from = getFromUrl();

    if (from === "favoriter") {
        return "Tillbaka till favoriter";
    }

    return "Tillbaka till alla golfbanor";
}

function getFacilityText(value) {
    if (value) {
        return "Ja";
    }

    return "Nej";
}

function getFacilityIcon(value) {
    if (value) {
        return "images/ikoner/check.svg";
    }

    return "images/ikoner/x2.svg";
}

export function renderGolfdetaljer(bana, container) {
    if (!bana) {
        container.innerHTML = "<p>Golfbanan kunde inte hittas.</p>";
        return;
    }

    let holes = "-";
    let courseType = "Golfbana";
    let drivingRange = false;
    let restaurant = false;
    let kiosk = false;
    let chargingStation = false;
    let puttingGreen = false;

    if (bana.extra !== null) {
        if (bana.extra.holes) {
            holes = bana.extra.holes + " hål";
        }

        if (bana.extra.course_type) {
            courseType = bana.extra.course_type;
        }

        drivingRange = bana.extra.driving_range;
        restaurant = bana.extra.restaurant;
        kiosk = bana.extra.kiosk;
        chargingStation = bana.extra.charging_station;
        puttingGreen = bana.extra.putting_green;
    }

    const backLink = getBackLink();
    const backText = getBackText();
    const priceRange = bana.price_range || "Pris saknas";
    const description = bana.abstract || "Ingen beskrivning finns tillgänglig.";
    const website = bana.website || "#";

    let favoriteText = "Spara favorit";

    if (isFavorite(bana.id)) {
        favoriteText = "Sparad";
    }

    container.innerHTML = `
        <a href="${backLink}" class="tillbaka">
            <img src="images/ikoner/arrow.svg" alt="">
            ${backText}
        </a>

        <section class="detalj-hero">
            <div class="detalj-info">
                <h1>${bana.name}</h1>

                <p class="detalj-plats">
                    <img src="images/ikoner/gps.svg" alt="">
                    ${bana.city}, ${bana.province}
                </p>

                <div class="detalj-knappar">
                    <a href="${website}" target="_blank" class="primary">Besök hemsida</a>
                    <button class="detalj-favorit" type="button">${favoriteText}</button>
                </div>
            </div>

            <div class="detalj-bild"></div>
        </section>

        <section class="detalj-info-rutor">
            <div class="info-ruta">
                <img src="images/ikoner/price.svg" alt="">
                <div>
                    <h3>Greenfee</h3>
                    <p>${priceRange}</p>
                </div>
            </div>

            <div class="info-ruta">
                <img src="images/ikoner/flag.svg" alt="">
                <div>
                    <h3>Antal hål</h3>
                    <p>${holes}</p>
                </div>
            </div>

            <div class="info-ruta">
                <img src="images/ikoner/gran.svg" alt="">
                <div>
                    <h3>Bantyp</h3>
                    <p>${courseType}</p>
                </div>
            </div>

            <div class="info-ruta">
                <img src="images/ikoner/gps.svg" alt="">
                <div>
                    <h3>Område</h3>
                    <p>${bana.province}</p>
                </div>
            </div>
        </section>

        <div class="detalj-knappar-mobile">
            <a href="${website}" target="_blank" class="primary">Besök hemsida</a>
            <button class="detalj-favorit" type="button">${favoriteText}</button>
        </div>

        <section class="detalj-grid">
            <div class="detalj-box">
                <h2>Om banan</h2>
                <p>${description}</p>
                <p><strong>Adress:</strong> ${bana.address || "-"}, ${bana.city}</p>
                <p><strong>Telefon:</strong> ${bana.phone_number || "-"}</p>
            </div>

            <div class="detalj-box">
                <h2>Faciliteter</h2>

                <div class="faciliteter-lista">
                    <p class="facilitet">
                        <img src="${getFacilityIcon(drivingRange)}" alt="">
                        Driving range: ${getFacilityText(drivingRange)}
                    </p>

                    <p class="facilitet">
                        <img src="${getFacilityIcon(puttingGreen)}" alt="">
                        Putting green: ${getFacilityText(puttingGreen)}
                    </p>

                    <p class="facilitet">
                        <img src="${getFacilityIcon(restaurant)}" alt="">
                        Restaurang: ${getFacilityText(restaurant)}
                    </p>

                    <p class="facilitet">
                        <img src="${getFacilityIcon(kiosk)}" alt="">
                        Kiosk: ${getFacilityText(kiosk)}
                    </p>

                    <p class="facilitet">
                        <img src="${getFacilityIcon(chargingStation)}" alt="">
                        Laddplats: ${getFacilityText(chargingStation)}
                    </p>
                </div>
            </div>
        </section>
    `;

    const favoriteButtons = document.querySelectorAll(".detalj-favorit");

    function updateFavoriteButton() {
        for (let i = 0; i < favoriteButtons.length; i++) {
            if (isFavorite(bana.id)) {
                favoriteButtons[i].textContent = "Sparad";
                favoriteButtons[i].classList.add("saved");
            } else {
                favoriteButtons[i].textContent = "Spara favorit";
                favoriteButtons[i].classList.remove("saved");
            }
        }
    }

    updateFavoriteButton();

    for (let i = 0; i < favoriteButtons.length; i++) {
        favoriteButtons[i].addEventListener("click", function () {
            toggleFavorite(bana.id);
            updateFavoriteButton();
        });
    }
}