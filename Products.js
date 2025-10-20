// Get all size buttons
const sizeButtons = document.querySelectorAll(".size-option");
const priceElement = document.querySelector(".price");
const addToCartButton = document.querySelector(".add-to-cart");
const quantityInput = document.querySelector(".quantity");

// Store prices for each size
const sizePrices = {
  "330ml": 19.0,
  "6 pack": 100.0,
  "12 pack": 160.0,
};

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    //Update the price
    const size = button.textContent;
    priceElement.textContent = "R" + sizePrices[size] + ".00";

    //Remove 'selected' class from all buttons
    sizeButtons.forEach((btn) => btn.classList.remove("selected"));

    //Add 'selected' class to clicked button
    button.classList.add("selected");
  });
});

// Add to Cart Logic
addToCartButton.addEventListener("click", () => {
  const productName = document.querySelector(".product-info h2").textContent;
  const selectedSizeEl = document.querySelector(".size-option.selected");
  const size = selectedSizeEl.textContent;
  const price = sizePrices[size];
  const quantity = parseInt(quantityInput.value, 10);
  const imageSrc = document.querySelector(".product-image img").src;

  // Create a unique name for the cart item based on product and size
  const cartItemName = `${productName} (${size})`;

  // Call the global addToCart function from Cart.js
  if (window.addToCart) {
    window.addToCart(cartItemName, price, imageSrc, quantity);
  } else {
    console.error("addToCart function not found. Make sure Cart.js is loaded.");
  }
});
