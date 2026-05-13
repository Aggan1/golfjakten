const smapi =
    "https://smapi.lnu.se/api/?api_key=EB72AuVs&controller=establishment&method=getall&descriptions=golfbana";

function golfbanor() {
    return fetch (smapi)
    .then(response => response.json ())
    .then (data =>{
        if (data.header.status === "OK"){
            return data.payload;
        }
       return[];
    });
}

function data(){
    return fetch("data/golf-data.json")
    .then(response => response.json())
    .catch(() =>[]);
}

function startsida (sampi, data){
    const topLista = document.querySelector (".korts");

    if (topLista === null){
        return;
    }

    topLista.innerHTML ="";
    const golfbanor = [];

    for (let i = 0; i < sampi.length;  i++){
        const bana = sampi[i];
        let extraInfo = null;

        for (let j = 0; j < Data.length; j++){
            if (String(bana.id) == String(data[j].sampi_id)){
                extraInfo = data [j];
            }
        }
        bana.extra = extraInfo;
        golfbanor.push(bana);

    }
const valdaBanor = golfbanor.slice(0, 4);

for (let i = 0; i < valdaBanor.length; i++){
    const bana = valdaBanor [i];
    const greenfee = bana.extra ? bana.extra.greenfee_weekday : "Pris saknas";

    const kort = document.createElement ("article");
    kort.classList.add("kort");

    kort.innerHTML = `<img src = "..." "alt Bild på ${bana.name}" > 
        
        <div> 
            <h3> ${bana.name}</h3>
            <p>${bana.city}, ${bana.province}<p/>
            <p>${greenfee}</p>
            <span>bana →</span>
            </div>`;
            kort.addEventListener("click", function (){
                window.location = "golfbanor.html?id=" + bana.id;
            });
            topLista.appendChild(kort);
        }
}

function startsidaGolfbanor (){
    Promise.all([golfbanor(), data()])
    .then(function (resultat){
        startsidan(resultat[0], resultat[1]);
    })
    .catch(function (error){
        console.log("Fel:", error);
    });
}
document.addEventListener("DOMContentLoaded", startsidaGolfbanor);
