document.body.style.overflow = "hidden";

const bilder = document.querySelectorAll(".bildruta img");
const knappar = document.querySelectorAll(".slide-knapp");

const rubrikText = document.getElementById("rubrik-text");
const beskrivningText = document.getElementById("beskrivning-text");

const slideInformation = [
    {
        rubrik: "Vår idé",
        text: "Vi startade Golfjakten för att göra det enklare för golfare att hitta golfbanor samt planera golfresor som matchar deras förväntningar och krav."
    },
    {
        rubrik: "Vårt mål",
        text: "Vårt mål är att erbjuda en omfattande och användarvänlig plattform där golfare kan upptäcka och jämföra golfupplevelser i hela Småland och på Öland."
    },
    {
        rubrik: "Golfresor",
        text: "Vi vill inspirera golfare att utforska nya golfbanor och destinationer genom att erbjuda ett planeringsverktyg där du själv väljer dina krav."
    },
    {
        rubrik: "Framtiden",
        text: "Ifall vi lyckas utveckla Golfjakten till en omfattande plattform, kan vi tänka oss att expandera till andra regioner och erbjuda ännu mer personaliserade golfupplevelser."
    }
];

let aktivIndex = 0;
let kanScrolla = true;
let klar = false;

function visaSlide(index) {

    bilder.forEach((bild) => {
        bild.classList.remove("aktiv-bild");
    });

    knappar.forEach((knapp) => {
        knapp.classList.remove("aktiv-slide");
    });

    bilder[index].classList.add("aktiv-bild");
    knappar[index].classList.add("aktiv-slide");

    rubrikText.textContent = slideInformation[index].rubrik;
    beskrivningText.textContent = slideInformation[index].text;

    aktivIndex = index;
}


knappar.forEach((knapp, index) => {
    knapp.addEventListener("click", () => {

        visaSlide(index);
        aktivIndex = index;

        if (klar) {
            document.body.style.overflow = "auto";
        }
    });
});

window.addEventListener("wheel", (event) => {

    if (!kanScrolla) return;

    kanScrolla = false;

    const scrollarNer = event.deltaY > 0;
    const scrollarUpp = event.deltaY < 0;

    /* ===== SCROLL NER ===== */
    if (scrollarNer) {

        if (aktivIndex < slideInformation.length - 1) {
            visaSlide(aktivIndex + 1);
        } 
        else {
            // sista slide → lås upp scroll
            document.body.style.overflow = "auto";
        }

    }

    /* ===== SCROLL UPP (ALLTID TILLÅTEN) ===== */
    if (scrollarUpp) {

        if (aktivIndex > 0) {
            visaSlide(aktivIndex - 1);
        } 
        else {
            // tillbaka till första slide → lås igen scroll
            document.body.style.overflow = "hidden";
        }
    }

    event.preventDefault();

    setTimeout(() => {
        kanScrolla = true;
    }, 900);

}, { passive: false });