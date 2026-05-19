import { isFavorite, toggleFavorite } from "./favoriterStorage.js";

function updateFavoriteButton(button, id) {
    if (isFavorite(id)) {
        button.classList.add("saved");
        button.title = "Ta bort från favoriter";
    } else {
        button.classList.remove("saved");
        button.title = "Spara som favorit";
    }
}

export function showCourses(golfbanor, golfList, showDetails) {
    golfList.innerHTML = "";

    for (let i = 0; i < golfbanor.length; i++) {
        const bana = golfbanor[i];

        const kort = document.createElement("article");
        kort.classList.add("golf-card");
        kort.dataset.id = bana.id;

        let antalHal = "18 hål";
        let bantyp = "Golfbana";

        if (bana.extra !== null) {
            if (bana.extra.holes) {
                antalHal = bana.extra.holes + " hål";
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

            <button class="favorite-button" type="button">
                <img src="images/ikoner/heart.svg" alt="Spara favorit">
            </button>
        `;

        const favoriteButton = kort.querySelector(".favorite-button");
        updateFavoriteButton(favoriteButton, bana.id);

        favoriteButton.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleFavorite(bana.id);
            updateFavoriteButton(favoriteButton, bana.id);
        });

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
}

export function showDetails(bana, golfDetails) {
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

    golfDetails.classList.add("visible");

    golfDetails.innerHTML = `
        <div class="golf-popup-header">
            <div>
                <h3>${bana.name}</h3>
                <p>${bana.city}, ${bana.province}</p>
            </div>

            <button class="close-popup" type="button">×</button>
        </div>

        <div class="popup-info">
            <span>${holes}</span>
            <span>${weekdayPrice} – ${weekendPrice}</span>
            <span>${courseType}</span>
        </div>

        <p>${bana.abstract || "Ingen beskrivning finns tillgänglig."}</p>

        <div class="popup-facilities">
            <span>Driving range: ${bana.extra && bana.extra.driving_range ? "Ja" : "Nej"}</span>
            <span>Restaurang: ${bana.extra && bana.extra.restaurant ? "Ja" : "Nej"}</span>
            <span>Kiosk: ${bana.extra && bana.extra.kiosk ? "Ja" : "Nej"}</span>
            <span>Putting green: ${bana.extra && bana.extra.putting_green ? "Ja" : "Nej"}</span>
        </div>

        <div class="popup-buttons">
             <a href="${bana.website}" target="_blank">
                Besök hemsida
             </a>

            <a href="golfdetaljer.html?id=${bana.id}&from=golfbanor" class="primary">
               Läs mer
            </a>
        </div>

        <div class="popup-save">
            <button class="popup-favorite-button" type="button">
                Spara som favorit
            </button>
        </div>
        `;

    const closeButton = golfDetails.querySelector(".close-popup");
    const popupFavoriteButton = golfDetails.querySelector(".popup-favorite-button");

    if (isFavorite(bana.id)) {
        popupFavoriteButton.textContent = "Sparad";
    }

    popupFavoriteButton.addEventListener("click", function () {
        toggleFavorite(bana.id);

        if (isFavorite(bana.id)) {
            popupFavoriteButton.textContent = "Sparad";
        } else {
            popupFavoriteButton.textContent = "Spara som favorit";
        }

        const kort = document.querySelector(`.golf-card[data-id="${bana.id}"]`);
        if (kort) {
            const favoriteButton = kort.querySelector(".favorite-button");
            updateFavoriteButton(favoriteButton, bana.id);
        }
    });

    closeButton.addEventListener("click", function () {
        golfDetails.classList.remove("visible");

        const allaKort = document.querySelectorAll(".golf-card");

        for (let i = 0; i < allaKort.length; i++) {
            allaKort[i].classList.remove("active");
        }
    });
}

export function markActiveCourse(bana) {
    const allaKort = document.querySelectorAll(".golf-card");

    for (let i = 0; i < allaKort.length; i++) {
        allaKort[i].classList.remove("active");

        if (allaKort[i].dataset.id === bana.id) {
            allaKort[i].classList.add("active");
            allaKort[i].scrollIntoView({
                block: "nearest"
            });
        }
    }
}