export function showCourses(golfbanor, golfList, showDetails) {
    golfList.innerHTML = "";

    for (let i = 0; i < golfbanor.length; i++) {
        const bana = golfbanor[i];

        const kort = document.createElement("article");
        kort.classList.add("golf-card");

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

            <span class="course-arrow"></span>
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
}

export function showDetails(bana, golfDetails) {
    let holes = "-";
    let courseType = "Golfbana";
    let weekdayPrice = "-";
    let weekendPrice = "-";
    let bookingUrl = "#";

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

        if (bana.extra.booking_url) {
            bookingUrl = bana.extra.booking_url;
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
            <a href="${bana.website}" target="_blank">Läs mer</a>
            <a href="${bookingUrl}" target="_blank" class="primary">Boka</a>
        </div>
    `;

    const closeButton = golfDetails.querySelector(".close-popup");

    closeButton.addEventListener("click", function () {
        golfDetails.classList.remove("visible");
    });
}