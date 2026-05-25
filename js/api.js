import { API_KEY } from "./config.js";

const BASE_URL = "https://smapi.lnu.se/api/";

export function getData(controller, filters = {}) {

    const params = new URLSearchParams({
        api_key: API_KEY,
        controller: controller,
        method: "getall",
        ...filters
    });

    if (filters.lat != null && filters.lng != null && filters.radius){
        params.set ("method", "getfromlatlng");
        params.set ("lat", filters.lat);
        params.set("lng", filters.lng);
        params.set("radius", filters.radius);
    }

    const url = `${BASE_URL}?${params}`;

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
            console.log("Fel vid hämtning från SMAPI:", error);
            return [];
        });
}