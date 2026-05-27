window.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".kontakt-formular");
  const popup = document.querySelector("#popupMeddelande");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    popup.textContent = "Ditt meddelande har skickats!";
    popup.style.display = "inline-block";

    form.reset();

    setTimeout(function () {
      popup.style.display = "none";
    }, 3000);
  });
});