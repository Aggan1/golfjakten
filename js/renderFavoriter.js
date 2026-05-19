import { removeFavorite } from "./favoriterStorage.js";

export function renderFavoriter(favoriter, container, updatePage) {
    container.innerHTML = "";

    if (favoriter.length === 0) {
        container.innerHTML = `
            <div class="favorit-tom">
                <p>Du har inte sparat några golfbanor ännu.</p>
            </div>
        `;
        return;
    }

    for (let i = 0; i < favoriter.length; i++) {
        const bana = favoriter[i];

        const card = document.createElement("article");
        card.classList.add("favorit-card");

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

        card.innerHTML = `
            <div class="favorit-img"></div>

            <div class="favorit-info">
                <h2>${bana.name}</h2>
                <p>${bana.city}, ${bana.province}</p>
                <p>${antalHal}</p>
                <p>${bana.price_range || "Pris saknas"} · ${bantyp}</p>
            </div>

            <button class="favorit-heart" type="button">
                <img src="images/ikoner/heart.svg" alt="Ta bort favorit">
            </button>

            <a href="golfbana.html?id=${bana.id}&from=favoriter" class="favorit-btn">
                Visa detaljer
            </a>
        `;

        const removeButton = card.querySelector(".favorit-heart");

        removeButton.addEventListener("click", function () {
            removeFavorite(bana.id);
            updatePage();
        });

        container.appendChild(card);
    }
}