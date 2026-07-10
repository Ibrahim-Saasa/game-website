// ========== PRODUCT FILTER FUNCTIONALITY ==========
class ProductFilter {
  constructor(containerSelector, tagSelector) {
    this.container = document.querySelector(containerSelector);
    this.tags = document.querySelectorAll(tagSelector);
    this.allProducts = [];
    this.currentFilter = "all";

    if (this.container && this.tags.length > 0) {
      this.initTagListeners();
    }
  }

  initTagListeners() {
    this.tags.forEach((tag) => {
      tag.addEventListener("click", (e) => {
        // Remove active class from all tags
        this.tags.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tag
        tag.classList.add("active");

        // Filter products
        this.currentFilter = tag.getAttribute("data-filter") || "all";
        this.filterProducts();
      });
    });
  }

  filterProducts() {
    const products = this.container.querySelectorAll(".product-card");

    products.forEach((product) => {
      const productCategory = product.getAttribute("data-category");

      if (
        this.currentFilter === "all" ||
        productCategory === this.currentFilter
      ) {
        product.style.display = "block";
        // Trigger animation
        setTimeout(() => product.classList.add("visible"), 10);
      } else {
        product.classList.remove("visible");
        setTimeout(() => (product.style.display = "none"), 300);
      }
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const filter = new ProductFilter(".products-grid", ".filter-tag");
});
