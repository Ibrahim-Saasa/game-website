// ========== VAULT PAGE COLLECTIONS ==========
const vaultCollections = [
  { id: 1, name: "Cosmic Phoenix", rarity: "legendary", icon: "🔥" },
  { id: 2, name: "Shadow Assassin", rarity: "epic", icon: "🗡️" },
  { id: 3, name: "Frost Guardian", rarity: "rare", icon: "❄️" },
  { id: 4, name: "Silver Knight", rarity: "rare", icon: "⚔️" },
  { id: 5, name: "Thunder Lord", rarity: "legendary", icon: "⚡" },
  { id: 6, name: "Dark Sorcerer", rarity: "epic", icon: "🎭" },
  { id: 7, name: "Nature's Wrath", rarity: "epic", icon: "🌿" },
  { id: 8, name: "Crystal Golem", rarity: "rare", icon: "💎" },
  { id: 9, name: "Void Walker", rarity: "legendary", icon: "👻" },
  { id: 10, name: "Fire Mage", rarity: "common", icon: "🔮" },
  { id: 11, name: "Mystic Sage", rarity: "common", icon: "📚" },
  { id: 12, name: "Ancient Dragon", rarity: "legendary", icon: "🐉" },
];

function renderVaultCollections(collections = vaultCollections) {
  const grid = document.getElementById("vaultGrid");
  if (!grid) return;

  grid.innerHTML = "";

  collections.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "vault-item";
    card.setAttribute("data-category", item.rarity);
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <div class="vault-image">
        ${item.icon}
        <div class="rarity-badge rarity-${item.rarity}">${item.rarity}</div>
      </div>
      <div class="vault-info">
        <h3>${item.name}</h3>
        <p>#${String(item.id).padStart(4, "0")}</p>
        <button class="btn-secondary" onclick="openCollectionModal(${item.id})" style="width: 100%; margin-top: 10px; padding: 8px 0;">View Details</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Initialize vault filter
  new VaultFilter(".vault-grid", ".vault-filter-tag");
}

function openCollectionModal(collectionId) {
  const collection = vaultCollections.find((c) => c.id === collectionId);
  if (!collection) return;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h2>${collection.name}</h2>
    <div style="font-size: 80px; text-align: center; margin: 20px 0;">${collection.icon}</div>
    <p class="product-category" style="margin-bottom: 15px; display: inline-block;">${collection.rarity}</p>
    <p style="color: gray; margin-bottom: 15px;">Collection ID: #${String(collection.id).padStart(4, "0")}</p>
    <h4 style="color: skyblue; margin: 20px 0 10px 0;">Collection Details:</h4>
    <ul style="color: lightblue; margin-left: 20px; line-height: 1.8;">
      <li>Rarity Tier: <strong>${collection.rarity.toUpperCase()}</strong></li>
      <li>Available: Limited Edition</li>
      <li>Transferable: Yes</li>
      <li>Tradeable: Yes</li>
      <li>In-Game Utility: Yes</li>
    </ul>
    <button class="btn-primary" style="margin-top: 20px; width: 100%;">View on Marketplace</button>
  `;

  const modal = new Modal("#collectionModal");
  modal.open();
}

// ========== VAULT FILTER CLASS ==========
class VaultFilter {
  constructor(containerSelector, tagSelector) {
    this.container = document.querySelector(containerSelector);
    this.tags = document.querySelectorAll(tagSelector);
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

        // Filter collections
        this.currentFilter = tag.getAttribute("data-filter") || "all";
        this.filterItems();
      });
    });
  }

  filterItems() {
    const items = this.container.querySelectorAll(".vault-item");

    items.forEach((item) => {
      const itemRarity = item.getAttribute("data-category");

      if (this.currentFilter === "all" || itemRarity === this.currentFilter) {
        item.style.display = "block";
        setTimeout(() => item.classList.add("visible"), 10);
      } else {
        item.classList.remove("visible");
        setTimeout(() => (item.style.display = "none"), 300);
      }
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderVaultCollections();
});
