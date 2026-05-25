const FAVORITE_KEY = "golfjakten_favoriter";

export function getFavorites() {
    const saved = localStorage.getItem(FAVORITE_KEY);

    if (saved === null) {
        return [];
    }

    return JSON.parse(saved);
}

export function saveFavorites(favorites) {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
    const favorites = getFavorites();

    return favorites.includes(id);
}

export function addFavorite(id) {
    const favorites = getFavorites();

    if (!favorites.includes(id)) {
        favorites.push(id);
        saveFavorites(favorites);
    }
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(function (favoriteId) {
        return favoriteId !== id;
    });

    saveFavorites(updatedFavorites);
}

export function toggleFavorite(id) {
    if (isFavorite(id)) {
        removeFavorite(id);
    } else {
        addFavorite(id);
    }
}