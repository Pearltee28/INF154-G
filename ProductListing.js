const products = document.querySelectorAll(".product-card");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortSelect = document.getElementById("sortSelect");

// Search functionality
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase();

  products.forEach(function (product) {
    const productName = product.querySelector("h3").textContent.toLowerCase();

    if (productName.includes(searchTerm)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchProducts();
  }
});

// Category filter
categoryFilter.addEventListener("change", function () {
  const category = this.value;

  products.forEach(function (product) {
    if (
      category === "all" ||
      product.getAttribute("data-category") === category
    ) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
});

// Price filter
priceFilter.addEventListener("change", function () {
  const priceRange = this.value;

  products.forEach(function (product) {
    const price = parseInt(product.getAttribute("data-price"));
    let show = false;

    if (priceRange === "all") {
      show = true;
    } else if (priceRange === "under20" && price < 20) {
      show = true;
    } else if (priceRange === "20-30" && price >= 20 && price <= 30) {
      show = true;
    } else if (priceRange === "over30" && price > 30) {
      show = true;
    }

    product.style.display = show ? "block" : "none";
  });
});

// Sort functionality
sortSelect.addEventListener("change", function () {
  const sortType = this.value;
  const productGrid = document.getElementById("productGrid");
  const productsArray = Array.from(products);

  if (sortType === "price-low") {
    productsArray.sort(function (a, b) {
      return (
        parseInt(a.getAttribute("data-price")) -
        parseInt(b.getAttribute("data-price"))
      );
    });
  } else if (sortType === "price-high") {
    productsArray.sort(function (a, b) {
      return (
        parseInt(b.getAttribute("data-price")) -
        parseInt(a.getAttribute("data-price"))
      );
    });
  } else if (sortType === "name") {
    productsArray.sort(function (a, b) {
      const nameA = a.querySelector("h3").textContent;
      const nameB = b.querySelector("h3").textContent;
      return nameA.localeCompare(nameB);
    });
  }

  productsArray.forEach(function (product) {
    productGrid.appendChild(product);
  });
});
