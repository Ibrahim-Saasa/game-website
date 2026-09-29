// ========== PRODUCTS PAGE LOADER ==========
let productsData = [];

async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");
    const data = await response.json();
    productsData = data.products;
    renderProducts(productsData);
  } catch (error) {
    console.error("Error loading products:", error);
    // Fallback: render static products if JSON fails
    renderProductsStatic();
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;
    card.setAttribute("data-category", product.category);
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="product-image">📦</div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">${product.price}</div>
        <div class="product-specs">
          <p>${product.specs.join(" • ")}</p>
        </div>
        <button class="product-button" type="button" data-product-id="${product.id}">View Details</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Initialize product filter
  initProductFilter();
}

function initProductFilter() {
  const tags = document.querySelectorAll(".filter-tag");
  const grid = document.querySelector(".products-grid");

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      // Remove active class from all tags
      tags.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tag
      tag.classList.add("active");

      // Filter products
      const filter = tag.getAttribute("data-filter") || "all";
      const cards = grid.querySelectorAll(".product-card");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          setTimeout(() => card.classList.add("visible"), 10);
        } else {
          card.classList.remove("visible");
          setTimeout(() => (card.style.display = "none"), 300);
        }
      });
    });
  });
}

function renderProductsStatic() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const staticProducts = [
    {
      id: 1,
      name: "Alienware Aurora",
      category: "hardware",
      price: "$2,499",
      description: "High-performance gaming desktop",
      specs: ["Intel i9", "RTX 4090", "64GB RAM"],
    },
    {
      id: 2,
      name: "Razer Blade 16",
      category: "hardware",
      price: "$3,199",
      description: "Ultra-thin gaming laptop",
      specs: ["Intel i9", "RTX 4080", "32GB RAM"],
    },
    {
      id: 3,
      name: "Zenithal Legends",
      category: "games",
      price: "$59.99",
      description: "Epic MMORPG experience",
      specs: ["Multiplayer", "PvP", "Co-op"],
    },
  ];

  renderProducts(staticProducts);
}

function openProductModal(productId) {
  const product = productsData.find((p) => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById("modalBody");
  const safe = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  modalBody.innerHTML = `
    <h2>${safe(product.name)}</h2>
    <p class="product-category" style="margin-bottom: 15px;">${safe(product.category)}</p>
    <p style="color: gray; margin-bottom: 15px;">${safe(product.description)}</p>
    <h3 style="color: lightgreen; margin: 20px 0 10px 0;">${safe(product.price)}</h3>
    <h4 style="color: skyblue; margin: 20px 0 10px 0;">Specifications:</h4>
    <ul style="color: lightblue; margin-left: 20px; line-height: 1.8;">
      ${product.specs.map((spec) => `<li>${safe(spec)}</li>`).join("")}
    </ul>
    <div class="product-actions">
      <button type="button" class="product-library-action" data-action="wishlist_add" data-product-id="${product.id}"><i class="bx bx-bookmark-plus" aria-hidden="true"></i> Save to wishlist</button>
      <button type="button" class="product-library-action purchase-action" data-action="demo_purchase" data-product-id="${product.id}"><i class="bx bx-receipt" aria-hidden="true"></i> Record demo purchase</button>
    </div>
    <p class="product-action-status" role="status" aria-live="polite"></p>
  `;

  document.getElementById("productModal").style.display = "flex";
  document.getElementById("modalOverlay").style.display = "block";
}

async function handleProductLibraryAction(button) {
  const action = button.dataset.action;
  if (
    action === "demo_purchase" &&
    !window.confirm(
      "Record this as a demo purchase? No payment will be processed.",
    )
  ) {
    return;
  }

  const status = document.querySelector(".product-action-status");
  button.disabled = true;
  status.textContent = "Updating your library...";
  try {
    const response = await fetch("./api/library.php", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        product_id: Number(button.dataset.productId),
      }),
    });
    const result = await response.json();
    if (response.status === 401) {
      window.location.assign("auth.html");
      return;
    }
    if (!response.ok)
      throw new Error(result.message || "Could not update your library.");
    status.textContent = result.message;
    status.style.color = "#73d2a7";
  } catch (error) {
    status.textContent = error.message || "Could not update your library.";
    status.style.color = "#e37d8e";
  } finally {
    button.disabled = false;
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  const overlay = document.getElementById("modalOverlay");
  const productsGrid = document.getElementById("productsGrid");
  const closeModal = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  };
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  productsGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (card) openProductModal(Number(card.dataset.productId));
  });
  document.getElementById("modalBody").addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) handleProductLibraryAction(button);
  });
  loadProducts();
});
