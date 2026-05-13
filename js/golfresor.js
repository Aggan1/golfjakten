  const price = document.getElementById("price");
  const priceValue = document.getElementById("price-value");

  price.addEventListener("input", () => {
    priceValue.textContent = price.value + " kr";
  });
