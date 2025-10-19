const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // 1. Get product details from the button's data attributes
    const product = {
      id: event.target.dataset.id,
      name: event.target.dataset.name,
      price: parseFloat(event.target.dataset.price),
      image: event.target.dataset.image,
      quantity: 1, // Start with quantity 1
    };

    // 2. Get the existing cart from localStorage, or create a new empty one
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    // 3. Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      // If it is, just increase the quantity
      existingProduct.quantity++;
    } else {
      // If not, add the new product to the cart
      cart.push(product);
    }

    // 4. Save the updated cart back to localStorage
    localStorage.setItem("shoppingCart", JSON.stringify(cart));

    alert(`${product.name} has been added to your cart!`);
  });
});
