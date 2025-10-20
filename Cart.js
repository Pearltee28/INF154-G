// Function to handle adding items to the cart
function addToCart(name, price, image, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, image, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${quantity} x ${name} has been added to your cart!`);
}

// Export addToCart to be accessible by other scripts
window.addToCart = addToCart;

// --- CART PAGE LOGIC ---
// Only run this if we are on the cart page
if (document.getElementById("cart-items")) {
  const cartTableBody = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                </td>
                <td>R${item.price.toFixed(2)}</td>
                <td class="quantity">
                    <button class="decrease" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-index="${index}">+</button>
                </td>
                <td class="total-price">R${itemTotal.toFixed(2)}</td>
            `;
      cartTableBody.appendChild(row);
    });

    // Total on this page is just the subtotal. Shipping is handled at checkout.
    const total = subtotal;

    subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    totalElement.textContent = `R${total.toFixed(2)}`;

    localStorage.setItem("cart", JSON.stringify(cart));
    attachButtonEvents();
  }

  function attachButtonEvents() {
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart[index].quantity++;
        renderCart();
      });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart[index].quantity--;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        renderCart();
      });
    });
  }

  renderCart();
}
