const url =

    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=activity&method=getall&descriptions=golfbana";

const golfList = document.getElementById("golf-list");

fetch(url)

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        console.log("SMAPI data:", data);

        if (data.header.status === "OK") {

            renderGolfCourses(data.payload);

        } else {

            golfList.innerHTML = "<p>Kunde inte hämta golfbanor.</p>";

        }

    })

    .catch(function (error) {

        console.log("Fel vid hämtning:", error);

        golfList.innerHTML = "<p>Något gick fel vid hämtning av data.</p>";

    });

function renderGolfCourses(courses) {

    golfList.innerHTML = "";

    courses.forEach(function (course) {

        const card = document.createElement("article");

        card.classList.add("golf-card");

        card.innerHTML = `

      <h3>${course.name}</h3>

      <p>${course.description}</p>

      <p>Betyg: ${course.rating}</p>

      <p>Antal recensioner: ${course.num_reviews}</p>

    `;

        golfList.appendChild(card);

    });

}