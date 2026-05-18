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