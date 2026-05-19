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
        return "← Tillbaka till favoriter";
    }

    return "← Tillbaka till alla golfbanor";
}

export function renderGolfdetaljer(bana, container) {
    if (!bana) {
        container.innerHTML = "<p>Golfbanan kunde inte hittas.</p>";
        return;
    }

    let holes = "-";
    let courseType = "Golfbana";
    let weekdayPrice = "-";
    let weekendPrice = "-";

    if (bana.extra !== null) {
        if (bana.extra.holes) {
            holes = bana.extra.holes + " hål";
        }

        if (bana.extra.course_type) {
            courseType = bana.extra.course_type;
        }

        if (bana.extra.greenfee_weekday_18) {
            weekdayPrice = bana.extra.greenfee_weekday_18;
        }

        if (bana.extra.greenfee_weekend_18) {
            weekendPrice = bana.extra.greenfee_weekend_18;
        }
    }

    const backLink = getBackLink();
    const backText = getBackText();
    const favoriteText = isFavorite(bana.id) ? "Sparad" : "Spara favorit";

    container.innerHTML = `
        <a href="${backLink}" class="tillbaka">${backText}</a>

        <section class="detalj-hero">
            <div class="detalj-bild">
                <button id="favoriteButton" class="detalj-favorit" type="button">
                    ${favoriteText}
                </button>
            </div>

            <div class="detalj-info">
                <h1>${bana.name}</h1>
                <p>${bana.city}, ${bana.province}</p>

                <div class="detalj-snabbinfo">
                    <span>${holes}</span>
                    <span>${courseType}</span>
                    <span>${bana.price_range || "Pris saknas"}</span>
                </div>

                <p>${bana.abstract || "Ingen beskrivning finns tillgänglig."}</p>

                <div class="detalj-knappar">
                    <a href="${bana.website}" target="_blank">Besök hemsida</a>
                    <a href="Golfresor.html" class="primary">Planera resa</a>
                </div>
            </div>
        </section>

        <section class="detalj-grid">
            <div class="detalj-box">
                <h2>Om banan</h2>
                <p>${bana.abstract || "Här kommer mer information om golfbanan."}</p>
            </div>

            <div class="detalj-box">
                <h2>Fakta</h2>
                <p><strong>Antal hål:</strong> ${holes}</p>
                <p><strong>Bantyp:</strong> ${courseType}</p>
                <p><strong>Greenfee vardag:</strong> ${weekdayPrice}</p>
                <p><strong>Greenfee helg:</strong> ${weekendPrice}</p>
                <p><strong>Telefon:</strong> ${bana.phone_number || "-"}</p>
                <p><strong>Adress:</strong> ${bana.address || "-"}, ${bana.city}</p>
            </div>
        </section>
    `;

    const favoriteButton = document.getElementById("favoriteButton");

    favoriteButton.addEventListener("click", function () {
        toggleFavorite(bana.id);

        if (isFavorite(bana.id)) {
            favoriteButton.textContent = "Sparad";
        } else {
            favoriteButton.textContent = "Spara favorit";
        }
    });
}