export function getExtraData() {
    return fetch("data/golf-data.json")
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log("Fel lokal JSON:", error);
            return [];
        });
}

export function mergaGolfdata(smapiData, extraData) {
    const resultat = [];

    for (let i = 0; i < smapiData.length; i++) {
        const bana = smapiData[i];
        let extraInfo = null;

        for (let j = 0; j < extraData.length; j++) {
            if (extraData[j].smapi_id === bana.id) {
                extraInfo = extraData[j];
            }
        }

        bana.extra = extraInfo;
        resultat.push(bana);
    }

    return resultat;
}