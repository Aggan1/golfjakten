

const form = document.querySelector (".kontakt-form");
const text = document.querySelector(".text-skickat");

form.addEventListener ("submit", function(event){
    event.preventDefault();

    text.textContent = "Ditt medelande har skickats!";
})