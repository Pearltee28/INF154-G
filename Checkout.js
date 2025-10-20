document.addEventListener("DOMContentLoaded", () => {
  /* --- TESTING DETAILS ---
   * Use the following details to test the checkout form validation.
   *
   * SUCCESSFUL PAYMENT:
   * Card Number: 1111 1111 1111 1111
   * Expiration Date: 12/26 (or any future date)
   * CVC: 123
   *
   * FAILED PAYMENTS (EXAMPLES):
   * Invalid Card Number: 1234
   * Expired Card: 01/24 (or any past date)
   * Invalid CVC: 1
   */
  // --- UTILITY FUNCTIONS ---
  const showError = (input, messageId) => {
    const errorEl = document.getElementById(messageId);
    input.classList.add("input-error");
    if (errorEl) errorEl.style.display = "block";
  };

  const hideError = (input, messageId) => {
    const errorEl = document.getElementById(messageId);
    input.classList.remove("input-error");
    if (errorEl) errorEl.style.display = "none";
  };

  // --- ORDER SUMMARY & CART LOGIC ---
  const subtotalEl = document.getElementById("subtotal-value");
  const shippingEl = document.getElementById("shipping-value");
  const totalEl = document.getElementById("total-value");
  const payButtonText = document.getElementById("pay-button-text");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const updateTotals = () => {
    let subtotal = 0;
    const orderItems = document.querySelectorAll(".order-item");

    orderItems.forEach((item) => {
      const price = parseFloat(item.dataset.price);
      const quantityInput = item.querySelector(".quantity-input");
      const quantity = parseInt(quantityInput.value, 10);
      const lineItemTotal = price * quantity;
      const itemPriceEl = item.querySelector(".order-item-price");
      if (itemPriceEl) {
        itemPriceEl.textContent = `R${lineItemTotal.toFixed(2)}`;
      }
      subtotal += lineItemTotal;
    });

    let shippingCost = 65.0;
    if (subtotal >= 500 || subtotal === 0) {
      shippingCost = 0;
    }

    const total = subtotal + shippingCost;

    shippingEl.textContent = `R${shippingCost.toFixed(2)}`;
    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    totalEl.textContent = `R${total.toFixed(2)}`;
    payButtonText.textContent = `Pay R${total.toFixed(2)}`;
  };

  const populateOrderSummary = () => {
    const container = document.querySelector(".order-items-container");
    if (!container) return;
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach((item, index) => {
      const itemHtml = `
                <div class="order-item" data-price="${item.price.toFixed(
                  2
                )}" data-name="${item.name}">
                    <div class="order-item-details">
                        <img src="${item.image}" alt="${
        item.name
      }" class="order-item-image" style="width:64px; height:64px; object-fit:contain;">
                        <div>
                            <h3 class="order-item-title">${item.name}</h3>
                            <div class="quantity-control">
                                <label for="qty-item${index}" class="sr-only">Quantity</label>
                                <input type="number" id="qty-item${index}" class="quantity-input" value="${
        item.quantity
      }" min="0">
                            </div>
                        </div>
                    </div>
                    <span class="order-item-price">R${(
                      item.price * item.quantity
                    ).toFixed(2)}</span>
                </div>`;
      container.innerHTML += itemHtml;
    });
  };

  function addQuantityListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("input", (event) => {
        const orderItemEl = event.target.closest(".order-item");
        const itemName = orderItemEl.dataset.name;
        const newQuantity = parseInt(event.target.value, 10);

        const cartItem = cart.find((item) => item.name === itemName);

        if (cartItem) {
          if (newQuantity > 0) {
            cartItem.quantity = newQuantity;
          } else {
            cart = cart.filter((item) => item.name !== itemName);
            orderItemEl.remove();
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }
        updateTotals();
      });
    });
  }

  // --- INITIAL PAGE LOAD ---
  populateOrderSummary();
  addQuantityListeners();
  updateTotals();

  // --- FORM VALIDATION ELEMENTS AND LOGIC ---
  const email = document.getElementById("email");
  const cardNumber = document.getElementById("card-number");
  const expirationDate = document.getElementById("expiration-date");
  const cvc = document.getElementById("cvc");
  const payButton = document.getElementById("pay-button");
  const successModal = document.getElementById("success-modal");
  const closeModal = document.getElementById("close-modal");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      showError(email, "email-error");
      return false;
    }
    hideError(email, "email-error");
    return true;
  };

  const validateCardNumber = () => {
    const cardNumberValue = cardNumber.value.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNumberValue)) {
      showError(cardNumber, "card-error");
      return false;
    }
    hideError(cardNumber, "card-error");
    return true;
  };

  const validateExpiryDate = () => {
    const expiryValue = expirationDate.value;
    const [month, year] = expiryValue.split("/");
    if (
      !/^\d{2}\/\d{2}$/.test(expiryValue) ||
      parseInt(month, 10) > 12 ||
      parseInt(month, 10) === 0
    ) {
      showError(expirationDate, "expiry-error");
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const cardYear = parseInt(year, 10);
    const cardMonth = parseInt(month, 10);

    if (
      cardYear < currentYear ||
      (cardYear === currentYear && cardMonth < currentMonth)
    ) {
      showError(expirationDate, "expiry-error");
      return false;
    }
    hideError(expirationDate, "expiry-error");
    return true;
  };

  const validateCvc = () => {
    if (!/^\d{3,4}$/.test(cvc.value)) {
      showError(cvc, "cvc-error");
      return false;
    }
    hideError(cvc, "cvc-error");
    return true;
  };

  // --- INPUT FORMATTING ---
  cardNumber.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    e.target.value = value;
  });
  expirationDate.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    e.target.value = value;
  });
  cvc.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
  });

  // --- EVENT LISTENERS ---
  email.addEventListener("blur", validateEmail);
  cardNumber.addEventListener("blur", validateCardNumber);
  expirationDate.addEventListener("blur", validateExpiryDate);
  cvc.addEventListener("blur", validateCvc);

  payButton.addEventListener("click", (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isCardValid = validateCardNumber();
    const isExpiryValid = validateExpiryDate();
    const isCvcValid = validateCvc();

    let areRequiredFieldsFilled = true;
    const requiredFields = document.querySelectorAll(
      "#first-name, #last-name, #address, #city, #state, #zip, #country"
    );

    requiredFields.forEach((input) => {
      if (input.value.trim() === "") {
        showError(input, `${input.id}-error`);
        areRequiredFieldsFilled = false;
      } else {
        hideError(input, `${input.id}-error`);
      }
    });

    if (
      isEmailValid &&
      isCardValid &&
      isExpiryValid &&
      isCvcValid &&
      areRequiredFieldsFilled
    ) {
      const buttonText = payButton.querySelector(".button-text");
      const spinner = payButton.querySelector(".spinner");
      if (buttonText) buttonText.style.display = "none";
      if (spinner) spinner.style.display = "inline-block";
      payButton.disabled = true;

      setTimeout(() => {
        successModal.classList.remove("hidden");
        successModal.style.display = "flex";
        if (buttonText) buttonText.style.display = "inline-block";
        if (spinner) spinner.style.display = "none";
        payButton.disabled = false;
        localStorage.removeItem("cart");
      }, 1500);
    }
  });

  closeModal.addEventListener("click", () => {
    successModal.style.display = "none"; // Directly hide the modal
    successModal.classList.add("hidden"); // Also add class for consistency
  });

  document.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.id === "expiration-date") {
        hideError(input, "expiry-error");
      } else {
        hideError(input, `${input.id}-error`);
      }
    });
  });
});
