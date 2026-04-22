const url =
    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=establishment&method=getall&descriptions=golfbana";

const golfList = document.getElementById("golf-list");

// Hämtar golfbanorna från smapi
function getGolfCourses() {
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("SMAPI data:", data);

            if (data.header.status === "OK") {
                return data.payload;
            } else {
                return [];
            }
        })
        .catch(function (error) {
            console.log("Fel vid hämtning av SMAPI:", error);
            return [];
        });
}

// Hämtar extern data från json
function getExtraGolfData() {
    return fetch("data/golf-data.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Lokal JSON-data:", data);
            return data;
        })
        .catch(function (error) {
            console.log("Fel vid hämtning av lokal JSON:", error);
            return [];
        });
}

// Kopplar smapi data och data från json genom id:et på golfbana
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

// Lägger in golfbanorna på sidan
function renderGolfCourses(courses) {
    golfList.innerHTML = "";

    courses.forEach(function (course) {
        const card = document.createElement("article");
        card.classList.add("golf-card");

        let extraInfo = "<p>Ingen extra golfdata tillgänglig.</p>";

        if (course.extra) {
            extraInfo = `
        <p>Greenfee vardag: ${course.extra.greenfee_weekday}</p>
        <p>Greenfee helg: ${course.extra.greenfee_weekend}</p>
        <p>Skick: ${course.extra.course_condition}</p>
        <p>Driving range: ${course.extra.driving_range ? "Ja" : "Nej"}</p>
        <p>Restaurang: ${course.extra.restaurant ? "Ja" : "Nej"}</p>
        <p>Kiosk: ${course.extra.kiosk ? "Ja" : "Nej"}</p>
        <p>Golfbil: ${course.extra.golf_cart ? "Ja" : "Nej"}</p>
        <p>Laddplats: ${course.extra.charging_station ? "Ja" : "Nej"}</p>
      `;
        }

        card.innerHTML = `
      <h3>${course.name}</h3>
      <p>${course.city}, ${course.municipality}</p>
      <p>Prisintervall: ${course.price_range}</p>
      <p>Betyg: ${course.rating}</p>
      <p>Antal recensioner: ${course.num_reviews}</p>
      <p>${course.abstract || "Ingen kort beskrivning tillgänglig."}</p>
      ${extraInfo}
    `;

        golfList.appendChild(card);
    });
}

// Startar hela processen
function init() {
    Promise.all([getGolfCourses(), getExtraGolfData()])
        .then(function (results) {
            const smapiCourses = results[0];
            const extraCourses = results[1];

            const mergedCourses = mergeGolfData(smapiCourses, extraCourses);
            console.log("Sammanslagen data:", mergedCourses);

            renderGolfCourses(mergedCourses);
        });
}

init();