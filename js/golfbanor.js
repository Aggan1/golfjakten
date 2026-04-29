const url =
    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=establishment&method=getall&descriptions=golfbana";

const golfList = document.getElementById("golf-list");
const golfDetails = document.getElementById("golf-detaljer");

// Hämta SMAPI
function getGolfCourses() {
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
function getExtraGolfData() {
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
function mergeGolfData(smapiCourses, extraCourses) {
    return smapiCourses.map(function (course) {
        const extraMatch = extraCourses.find(function (extra) {
            return extra.smapi_id === course.id;
        });

        return {
            ...course,
            extra: extraMatch || null
        };
    });
}

// Render lista
function renderGolfCourses(courses) {
    golfList.innerHTML = "";

    courses.forEach(function (course) {
        const card = document.createElement("article");
        card.classList.add("golf-card");

        card.innerHTML = `
            <div class="course-img"></div>

            <div class="course-info">
                <h3>${course.name}</h3>
                <p>${course.city}, ${course.province}</p>
                <p>${course.extra?.holes || "18 hål"}</p>
                <p>${course.price_range || "Pris saknas"} · ${course.extra?.course_type || "Golfbana"}</p>
            </div>

            <span class="course-arrow">›</span>
        `;

        card.addEventListener("click", function () {
            showGolfDetails(course);

            document.querySelectorAll(".golf-card").forEach(function (c) {
                c.classList.remove("active");
            });

            card.classList.add("active");
        });

        golfList.appendChild(card);
    });
}

// Visa detaljer
function showGolfDetails(course) {
    let extraInfo = "<p>Ingen extra info.</p>";

    if (course.extra) {
        extraInfo = `
            <p>Greenfee vardag: ${course.extra.greenfee_weekday || "-"}</p>
            <p>Greenfee helg: ${course.extra.greenfee_weekend || "-"}</p>
            <p>Skick: ${course.extra.course_condition || "-"}</p>
            <p>Driving range: ${course.extra.driving_range ? "Ja" : "Nej"}</p>
            <p>Restaurang: ${course.extra.restaurant ? "Ja" : "Nej"}</p>
        `;
    }

    golfDetails.innerHTML = `
        <h3>${course.name}</h3>
        <p>${course.city}, ${course.municipality}</p>
        <p>${course.abstract || "Ingen beskrivning"}</p>
        ${extraInfo}
    `;
}

// Init
function init() {
    Promise.all([getGolfCourses(), getExtraGolfData()])
        .then(function (results) {
            const merged = mergeGolfData(results[0], results[1]);
            renderGolfCourses(merged);
        });
}

init();