const bilder = document.querySelectorAll(".bildruta img");
const knappar = document.querySelectorAll(".slide-knapp");
const prevPil = document.querySelector(".slide-prev, .slide-foregaende");
const nextPil = document.querySelector(".slide-next, .slide-nasta");
const bildrutaElement = document.querySelector(".bildruta");

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

const desktopLäge = window.matchMedia("(min-width: 769px)");

function visaSlide(index) {
  bilder.forEach(bild => bild.classList.remove("aktiv-bild"));
  knappar.forEach(knapp => knapp.classList.remove("aktiv-slide"));

  bilder[index].classList.add("aktiv-bild");
  knappar[index].classList.add("aktiv-slide");

  rubrikText.textContent = slideInformation[index].rubrik;
  beskrivningText.textContent = slideInformation[index].text;

  aktivIndex = index;
}

function uppdateraScrollLäge() {
  if (desktopLäge.matches) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

uppdateraScrollLäge();

desktopLäge.addEventListener("change", uppdateraScrollLäge);

knappar.forEach((knapp, index) => {
  knapp.addEventListener("click", () => {
    visaSlide(index);

    if (!desktopLäge.matches) {
      document.body.style.overflow = "auto";
    }
  });
});

if (prevPil) {
  prevPil.addEventListener("click", () => {
    const prevIndex = aktivIndex > 0 ? aktivIndex - 1 : slideInformation.length - 1;
    visaSlide(prevIndex);
  });
}

if (nextPil) {
  nextPil.addEventListener("click", () => {
    const nextIndex = aktivIndex < slideInformation.length - 1 ? aktivIndex + 1 : 0;
    visaSlide(nextIndex);
  });
}

window.addEventListener("wheel", (event) => {
  if (!desktopLäge.matches) return;

  if (!kanScrolla) return;

  kanScrolla = false;

  const scrollarNer = event.deltaY > 0;
  const scrollarUpp = event.deltaY < 0;

  if (scrollarNer) {
    if (aktivIndex < slideInformation.length - 1) {
      visaSlide(aktivIndex + 1);
    } else {
      document.body.style.overflow = "auto";
    }
  }

  if (scrollarUpp) {
    if (aktivIndex > 0) {
      visaSlide(aktivIndex - 1);
    } else {
      document.body.style.overflow = "hidden";
    }
  }

  event.preventDefault();

  setTimeout(() => {
    kanScrolla = true;
  }, 900);

}, { passive: false });

let touchStartX = 0;
let touchEndX = 0;
const touchThreshold = 40;

if (bildrutaElement) {
  bildrutaElement.addEventListener("touchstart", (event) => {
    if (event.target.closest(".slide-navigering")) return;
    touchStartX = event.changedTouches[0].clientX;
    touchEndX = touchStartX;
  });

  bildrutaElement.addEventListener("touchmove", (event) => {
    touchEndX = event.changedTouches[0].clientX;
  }, { passive: true });

  bildrutaElement.addEventListener("touchend", () => {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < touchThreshold) return;

    if (swipeDistance > 0) {
      const prevIndex = aktivIndex > 0 ? aktivIndex - 1 : slideInformation.length - 1;
      visaSlide(prevIndex);
    } else {
      const nextIndex = aktivIndex < slideInformation.length - 1 ? aktivIndex + 1 : 0;
      visaSlide(nextIndex);
    }
  });
}
