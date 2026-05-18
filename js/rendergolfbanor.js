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
    let extraInfo = "<p>Ingen extra info.</p>";

    if (bana.extra !== null) {
        extraInfo = `
            <p><strong>Greenfee 18 hål vardag:</strong> ${bana.extra.greenfee_weekday_18 || "-"}</p>
            <p><strong>Greenfee 18 hål helg:</strong> ${bana.extra.greenfee_weekend_18 || "-"}</p>
            <p><strong>Greenfee 9 hål vardag:</strong> ${bana.extra.greenfee_weekday_9 || "-"}</p>
            <p><strong>Greenfee 9 hål helg:</strong> ${bana.extra.greenfee_weekend_9 || "-"}</p>
            <p><strong>Skick:</strong> ${bana.extra.course_condition || "-"}</p>
            <p><strong>Driving range:</strong> ${bana.extra.driving_range ? "Ja" : "Nej"}</p>
            <p><strong>Restaurang:</strong> ${bana.extra.restaurant ? "Ja" : "Nej"}</p>
            <p><strong>Kiosk:</strong> ${bana.extra.kiosk ? "Ja" : "Nej"}</p>
            <p><strong>Putting green:</strong> ${bana.extra.putting_green ? "Ja" : "Nej"}</p>
            <p><strong>Laddplats:</strong> ${bana.extra.charging_station ? "Ja" : "Nej"}</p>
        `;
    }

    golfDetails.innerHTML = `
        <h3>${bana.name}</h3>
        <p>${bana.city}, ${bana.municipality}</p>
        <p>${bana.abstract || "Ingen beskrivning"}</p>
        ${extraInfo}
    `;
}