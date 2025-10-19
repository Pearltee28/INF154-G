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

  // --- FORM VALIDATION ELEMENTS ---
  const email = document.getElementById("email");
  const cardNumber = document.getElementById("card-number");
  const expirationDate = document.getElementById("expiration-date");
  const cvc = document.getElementById("cvc");
  const payButton = document.getElementById("pay-button");
  const successModal = document.getElementById("success-modal");
  const closeModal = document.getElementById("close-modal");
  const formInputs = document.querySelectorAll(".form-input");

  // --- ORDER SUMMARY ELEMENTS ---
  const orderItems = document.querySelectorAll(".order-item");
  const subtotalEl = document.getElementById("subtotal-value");
  const shippingEl = document.getElementById("shipping-value");
  const taxesEl = document.getElementById("taxes-value");
  const totalEl = document.getElementById("total-value");
  const payButtonText = document.getElementById("pay-button-text");

  const TAX_RATE = 0.08; // 8% tax rate

  // --- DYNAMIC CART CALCULATION ---
  const updateTotals = () => {
    let subtotal = 0;

    orderItems.forEach((item) => {
      const price = parseFloat(item.dataset.price);
      const quantityInput = item.querySelector(".quantity-input");
      const quantity = parseInt(quantityInput.value, 10);

      const lineItemTotal = price * quantity;
      const itemPriceEl = item.querySelector(".order-item-price");
      // Update the displayed price for this specific item row
      if (itemPriceEl) {
        itemPriceEl.textContent = `R${lineItemTotal.toFixed(2)}`;
      }

      subtotal += lineItemTotal;
    });

    const shippingCost = parseFloat(shippingEl.dataset.shippingCost);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + shippingCost + taxes;

    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    taxesEl.textContent = `R${taxes.toFixed(2)}`;
    totalEl.textContent = `R${total.toFixed(2)}`;
    payButtonText.textContent = `Pay R${total.toFixed(2)}`;
  };

  // Add event listeners to all quantity inputs
  orderItems.forEach((item) => {
    const quantityInput = item.querySelector(".quantity-input");
    if (quantityInput) {
      quantityInput.addEventListener("input", updateTotals);
    }
  });

  // Initial calculation on page load
  updateTotals();

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

  // --- VALIDATION LOGIC ---
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
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
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

    let allFieldsValid = true;
    formInputs.forEach((input) => {
      if (input.value.trim() === "" && input.id !== "address-2") {
        showError(input, `${input.id}-error`);
        allFieldsValid = false;
      }
    });

    if (
      isEmailValid &&
      isCardValid &&
      isExpiryValid &&
      isCvcValid &&
      allFieldsValid
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
      }, 1500);
    }
  });

  closeModal.addEventListener("click", () => {
    successModal.classList.add("hidden");
  });

  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      hideError(input, `${input.id}-error`);
    });
  });
});
