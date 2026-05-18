export function getGolfFilterValues(filterElements) {
    return {
        search: filterElements.search.value.toLowerCase(),
        area: filterElements.area.value,
        maxPrice: Number(filterElements.price.value),
        holes: filterElements.holes.value,
        drivingRange: filterElements.drivingRange.checked,
        restaurant: filterElements.restaurant.checked,
        kiosk: filterElements.kiosk.checked,
        chargingStation: filterElements.chargingStation.checked,
        puttingGreen: filterElements.puttingGreen.checked,
        sortering: filterElements.sortering.value
    };
}

function getPriceNumber(value) {
    if (!value) {
        return null;
    }

    const numbers = String(value).match(/\d+/g);

    if (!numbers) {
        return null;
    }

    return Math.max(...numbers.map(Number));
}

function getCourseMaxPrice(bana) {
    if (bana.extra) {
        const prices = [
            getPriceNumber(bana.extra.greenfee_weekday_18),
            getPriceNumber(bana.extra.greenfee_weekend_18),
            getPriceNumber(bana.extra.greenfee_weekday_9),
            getPriceNumber(bana.extra.greenfee_weekend_9)
        ].filter(function (price) {
            return price !== null;
        });

        if (prices.length > 0) {
            return Math.max(...prices);
        }
    }

    return getPriceNumber(bana.price_range);
}

export function filterGolfbanor(golfbanor, filters) {
    let filtered = [...golfbanor];

    if (filters.search) {
        filtered = filtered.filter(function (bana) {
            const text = `
                ${bana.name || ""}
                ${bana.city || ""}
                ${bana.municipality || ""}
                ${bana.province || ""}
            `.toLowerCase();

            return text.includes(filters.search);
        });
    }

    if (filters.area !== "all") {
        filtered = filtered.filter(function (bana) {
            return bana.province === filters.area;
        });
    }

    filtered = filtered.filter(function (bana) {
        const maxPrice = getCourseMaxPrice(bana);

        if (maxPrice === null) {
            return true;
        }

        return maxPrice <= filters.maxPrice;
    });

    if (filters.holes !== "all") {
        filtered = filtered.filter(function (bana) {
            if (!bana.extra || !bana.extra.holes) {
                return false;
            }

            return String(bana.extra.holes) === filters.holes;
        });
    }

    if (filters.drivingRange) {
        filtered = filtered.filter(function (bana) {
            return bana.extra && bana.extra.driving_range;
        });
    }

    if (filters.restaurant) {
        filtered = filtered.filter(function (bana) {
            return bana.extra && bana.extra.restaurant;
        });
    }

    if (filters.kiosk) {
        filtered = filtered.filter(function (bana) {
            return bana.extra && bana.extra.kiosk;
        });
    }

    if (filters.chargingStation) {
        filtered = filtered.filter(function (bana) {
            return bana.extra && bana.extra.charging_station;
        });
    }

    if (filters.puttingGreen) {
        filtered = filtered.filter(function (bana) {
            return bana.extra && bana.extra.putting_green;
        });
    }

    if (filters.sortering === "az") {
        filtered.sort(function (a, b) {
            return a.name.localeCompare(b.name, "sv");
        });
    }

    if (filters.sortering === "za") {
        filtered.sort(function (a, b) {
            return b.name.localeCompare(a.name, "sv");
        });
    }

    return filtered;
}